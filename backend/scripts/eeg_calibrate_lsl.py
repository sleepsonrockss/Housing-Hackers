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


def _find_inlet() -> pylsl.StreamInlet | None:
    deadline = time.time() + RESOLVE_SEC
    while time.time() < deadline:
        for info in pylsl.resolve_streams(0.5):
            name = (info.name() or "").lower()
            typ = (info.type() or "").lower()
            if "eeg" in typ or "eeg" in name or "muse" in name:
                return pylsl.StreamInlet(info, max_chunklen=2048)
        time.sleep(0.1)
    return None


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
    inlet = _find_inlet()
    if inlet is None:
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
    out = {"stress": stress, "source": "lsl", **meta}
    print(json.dumps(out), flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
