import { useState, useRef, useCallback } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
const POLL_INTERVAL = 5000;

export function useVeoVideo() {
  const [status, setStatus] = useState("idle");
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [retryIn, setRetryIn] = useState(null);
  const pollRef = useRef(null);
  const timerRef = useRef(null);
  // Store state refs so inheritFrom can read them synchronously
  const stateRef = useRef({ status: "idle", videoUrl: null, error: null, elapsedSeconds: 0 });

  const stopPolling = () => {
    clearInterval(pollRef.current);
    clearInterval(timerRef.current);
  };

  const setAll = (s, url, err, elapsed) => {
    stateRef.current = { status: s, videoUrl: url, error: err, elapsedSeconds: elapsed };
    setStatus(s);
    setVideoUrl(url);
    setError(err);
    setElapsedSeconds(elapsed);
  };

  const reset = useCallback(() => {
    stopPolling();
    setAll("idle", null, null, 0);
  }, []);

  // Allow parent to "adopt" another hook's completed video
  const inheritFrom = useCallback((other) => {
    stopPolling();
    setAll(other.status, other.videoUrl, other.error, other.elapsedSeconds);
  }, []);

  const startGenerationFromPrompt = useCallback(async (prompt) => {
    stopPolling();
    setAll("pending", null, null, 0);

    try {
      const res = await fetch(`${API_BASE_URL}/api/video/veo/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error("Failed to start video job");
      const { jobId } = await res.json();

      timerRef.current = setInterval(() => {
        setElapsedSeconds((s) => {
          stateRef.current.elapsedSeconds = s + 1;
          return s + 1;
        });
      }, 1000);

      pollRef.current = setInterval(async () => {
        try {
          const r = await fetch(`${API_BASE_URL}/api/video/veo/status/${jobId}`);
          const data = await r.json();
          if (data.status === "done") {
            stopPolling();
            setRetryIn(null);
            setAll("done", data.videoUrl, null, stateRef.current.elapsedSeconds);
          } else if (data.status === "error") {
            stopPolling();
            setRetryIn(null);
            setAll("error", null, data.error || "Video generation failed", stateRef.current.elapsedSeconds);
          } else {
            setStatus(data.status);
            setRetryIn(data.retryIn ?? null);
            stateRef.current.status = data.status;
          }
        } catch (_) { /* network hiccup */ }
      }, POLL_INTERVAL);
    } catch (err) {
      stopPolling();
      setAll("error", null, err.message, 0);
    }
  }, []);

  return { status, videoUrl, error, elapsedSeconds, retryIn, startGenerationFromPrompt, reset, inheritFrom };
}
