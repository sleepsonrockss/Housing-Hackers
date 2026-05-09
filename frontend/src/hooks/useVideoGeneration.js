import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * useVideoGeneration Hook
 * Handles all video generation API calls
 */
export function useVideoGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videoData, setVideoData] = useState(null);

  /**
   * Generate complete video content (script, visuals, narration)
   */
  const generateFullVideo = async (scenarioId, choiceId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/video/full`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scenarioId, choiceId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate video");
      }

      const data = await response.json();
      setVideoData(data);
      return data;
    } catch (err) {
      const message = err.message || "Error generating video";
      setError(message);
      console.error("Video generation error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate scene intro (no choice) — called when scenario loads
   */
  const generateScene = async (scenarioId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/video/scene`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate scene");
      }

      const data = await response.json();
      setVideoData(data);
      return data;
    } catch (err) {
      const message = err.message || "Error generating scene";
      setError(message);
      console.error("Scene generation error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate only the video script
   */
  const generateScript = async (scenarioId, choiceId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/video/script`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scenarioId, choiceId }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate script");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Script generation error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate only visual description
   */
  const generateVisuals = async (scenarioId, choiceId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/video/visuals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scenarioId, choiceId }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate visuals");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Visuals generation error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Generate only narration
   */
  const generateNarration = async (scenarioId, choiceId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/video/narration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scenarioId, choiceId }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate narration");
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Narration generation error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear error state
   */
  const clearError = () => setError(null);

  /**
   * Clear video data
   */
  const clearVideo = () => setVideoData(null);

  return {
    loading,
    error,
    videoData,
    generateScene,
    generateFullVideo,
    generateScript,
    generateVisuals,
    generateNarration,
    clearError,
    clearVideo,
  };
}