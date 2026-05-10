#!/usr/bin/env python3
"""
Read Muse (or any) EEG over Lab Streaming Layer for ~EEG_LSL_DURATION_SEC seconds,
derive a rough 0–100 stress score from signal variability, print one JSON line to stdout.

Requires: pip install pylsl numpy
Prereq: muselsl stream (or another LSL EEG source) running so an EEG stream is visible.

Override with your own script via EEG_CALIBRATE_SCRIPT in the Node .env — stdout must be
JSON with at least {"stress": <int 0-100>} (e.g. wrap jss.py and map its output).
"""
from __future__ import annotations

import json
import os
import sys
import time

try:
    import numpy as np
    import pylsl
except ImportError as e:
    print(
        json.dumps(
            {
                "error": "missing_deps",
                "message": str(e),
                "hint": "pip install -r requirements-eeg.txt",
            }
        ),
        file=sys.stderr,
    )
    sys.exit(3)

DURATION = float(os.environ.get("EEG_LSL_DURATION_SEC", "10"))
RESOLVE_SEC = float(os.environ.get("EEG_LSL_RESOLVE_SEC", "8"))


def _find_inlet() -> tuple[pylsl.StreamInlet, float] | None:
    deadline = time.time() + RESOLVE_SEC
    while time.time() < deadline:
        for info in pylsl.resolve_streams(0.5):
            name = (info.name() or "").lower()
            typ = (info.type() or "").lower()
            if "eeg" in typ or "eeg" in name or "muse" in name:
                fs = float(info.nominal_srate()) if info.nominal_srate() else 256.0
                return pylsl.StreamInlet(info, max_chunklen=2048), fs
        time.sleep(0.1)
    return None


def _band_metrics(sig: np.ndarray, fs: float) -> dict:
    """Theta / alpha / beta power and a concentration proxy (beta vs alpha; educational only)."""
    sig = np.asarray(sig, dtype=np.float64).ravel()
    n = sig.size
    if n < 32 or fs <= 0:
        return {
            "concentration": 50,
            "beta_alpha_ratio": None,
            "theta_band": None,
            "alpha_band": None,
            "beta_band": None,
            "sample_rate_hz": round(fs, 2) if fs else None,
        }
    sig = sig - np.mean(sig)
    w = np.hanning(n)
    y = np.fft.rfft(sig * w)
    p = np.abs(y) ** 2
    freqs = np.fft.rfftfreq(n, 1.0 / fs)

    def band_power(lo: float, hi: float) -> float:
        m = (freqs >= lo) & (freqs < hi)
        return float(np.sum(p[m]))

    theta = band_power(4.0, 8.0)
    alpha = band_power(8.0, 13.0)
    beta = band_power(13.0, 30.0)
    ratio = beta / (alpha + 1e-12)
    concentration = int(np.clip(25 + 50 * np.tanh((ratio - 1.0) / 1.5), 0, 100))
    return {
        "concentration": concentration,
        "beta_alpha_ratio": round(float(ratio), 4),
        "theta_band": round(theta, 4),
        "alpha_band": round(alpha, 4),
        "beta_band": round(beta, 4),
        "sample_rate_hz": round(fs, 2),
    }


def _stress_from_samples(samples: np.ndarray) -> tuple[int, dict]:
    """samples: (n, c) float — crude arousal proxy from multi-channel variability."""
    if samples.size == 0:
        return 50, {}
    x = np.asarray(samples, dtype=np.float64)
    rms_per_sample = np.sqrt(np.mean(np.square(x), axis=1))
    med = float(np.median(rms_per_sample))
    mad = float(np.median(np.abs(rms_per_sample - med))) + 1e-9
    arousal = float(np.mean(np.abs(rms_per_sample - med)) / mad)
    stress = int(round(np.clip(12 + arousal * 22, 0, 100)))
    meta = {
        "samples": int(x.shape[0]),
        "channels": int(x.shape[1]),
        "arousal_proxy": round(arousal, 4),
    }
    return stress, meta


def main() -> int:
    found = _find_inlet()
    if found is None:
        print(
            json.dumps(
                {
                    "error": "no_stream",
                    "message": "No EEG LSL stream found within resolve window.",
                    "hint": "Run muselsl stream in another terminal, then retry.",
                }
            ),
            file=sys.stderr,
        )
        return 1

    inlet, fs = found
    buf: list[list[float]] = []
    t0 = time.time()
    while time.time() - t0 < DURATION:
        sample, _ts = inlet.pull_sample(timeout=0.25)
        if sample is not None:
            buf.append(list(sample))

    if not buf:
        print(
            json.dumps(
                {
                    "error": "no_samples",
                    "message": "Stream resolved but no samples arrived in time window.",
                }
            ),
            file=sys.stderr,
        )
        return 2

    arr = np.array(buf, dtype=np.float64)
    stress, meta = _stress_from_samples(arr)
    trace = np.mean(arr, axis=1) if arr.ndim == 2 else arr.ravel()
    bands = _band_metrics(trace, fs)
    out = {"stress": stress, "source": "lsl", **meta, **bands}
    print(json.dumps(out), flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
