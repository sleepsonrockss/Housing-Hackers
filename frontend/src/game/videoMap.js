/**
 * Maps scenario IDs to their pre-generated video files in /public/videos/.
 * Videos are served as static assets by Vite.
 */
export const VIDEO_MAP = {
  "c1-q1": "/videos/Q1.1.mp4",
  "c1-q2": "/videos/Q1.2.mp4",
  "c1-q3": "/videos/Q1.3.mp4",
  "c1-q4": "/videos/Q1.4.mp4",
  "c1-q5": "/videos/Q1.5.mp4",

  "c2-q1": "/videos/Q2.1.mp4",
  "c2-q2": "/videos/Q2.2.mp4",
  "c2-q3": "/videos/Q2.3.mp4",
  "c2-q4": "/videos/Q2.4.mp4",

  "c3-q1": "/videos/Q3.1.mp4",
  "c3-q2": "/videos/Q3.2.mp4",
  "c3-q3": "/videos/Q3.3.mp4",
  "c3-q4": "/videos/Q3.4.mp4",

  "c4-q1": "/videos/Q4.1.mp4",
  "c4-q2": "/videos/Q4.2.mp4",
  "c4-q3": "/videos/Q4.3.mp4",
  "c4-q4": "/videos/Q4.4.mp4",

  "c5-q1": "/videos/Q5.1.mp4",
  "c5-q2": "/videos/Q5.2.mp4",
  "c5-q3": "/videos/Q5.3.mp4",
  "c5-q4": "/videos/Q5.4.mp4",
};

/**
 * Returns the video path for a given scenario ID, or null if none exists.
 */
export function getVideoForScenario(scenarioId) {
  return VIDEO_MAP[scenarioId] ?? null;
}
