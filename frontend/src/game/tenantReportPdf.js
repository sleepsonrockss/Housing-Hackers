import { jsPDF } from "jspdf";

function drawLineSeries(doc, x, y, w, h, values, opts = {}) {
  const { color = [37, 99, 235], ymin = 0, ymax = 100, labelY = "Score (0–100)" } = opts;
  if (!values.length) return y + h + 24;
  doc.setDrawColor(220);
  doc.setLineWidth(0.5);
  doc.rect(x, y, w, h);
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(labelY, x, y - 6);
  const lo = ymin;
  const hi = Math.max(ymax, lo + 1);
  const n = values.length;
  doc.setDrawColor(...color);
  doc.setLineWidth(1.2);
  for (let i = 1; i < n; i++) {
    const xa = x + ((i - 1) / (n - 1)) * w;
    const xb = x + (i / (n - 1)) * w;
    const va = Math.min(hi, Math.max(lo, values[i - 1]));
    const vb = Math.min(hi, Math.max(lo, values[i]));
    const ya = y + h - ((va - lo) / (hi - lo)) * h;
    const yb = y + h - ((vb - lo) / (hi - lo)) * h;
    doc.line(xa, ya, xb, yb);
  }
  doc.setDrawColor(0);
  doc.setTextColor(0);
  return y + h + 28;
}

function drawBarPair(doc, x, y, w, label, value, maxVal = 100) {
  doc.setFontSize(10);
  doc.setTextColor(40);
  doc.text(label, x, y);
  const bw = w * 0.55;
  doc.setFillColor(230);
  doc.rect(x, y + 4, bw, 10, "F");
  const fill = Math.min(1, Math.max(0, value / maxVal));
  doc.setFillColor(59, 130, 246);
  doc.rect(x, y + 4, bw * fill, 10, "F");
  doc.setFontSize(10);
  doc.setTextColor(20);
  doc.text(String(value), x + bw + 12, y + 12);
}

/**
 * @param {object} p
 * @param {object | null} p.museCalibration
 * @param {Array<{ step: number, stress: number, beat?: string, label?: string, chapter?: number | null }>} p.stressTimeline
 * @param {{ money: number, stress: number }} p.finalStats
 * @param {boolean} p.completedAllDays
 * @param {"money" | "stress" | null} p.gameOverReason
 */
export function downloadTenantMuseReport({
  museCalibration,
  stressTimeline,
  finalStats,
  completedAllDays,
  gameOverReason,
}) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 48;
  let cy = margin;

  doc.setFontSize(18);
  doc.setTextColor(15);
  doc.text("Tenant session summary (game + optional Muse EEG)", margin, cy);
  cy += 28;

  doc.setFontSize(9);
  doc.setTextColor(90);
  const disclaimer =
    "This PDF combines an educational simulation (TenantTales) with optional consumer EEG (Muse S) metrics captured at session start. " +
    "It is not a medical or psychological assessment and must not be used to discriminate. Use only as a conversation aid alongside direct tenant communication.";
  const split = doc.splitTextToSize(disclaimer, pageW - margin * 2);
  doc.text(split, margin, cy);
  cy += split.length * 11 + 18;

  doc.setFontSize(11);
  doc.setTextColor(30);
  doc.text(`Run status: ${completedAllDays ? "Completed all five days" : gameOverReason ? `Ended early (${gameOverReason})` : "In progress"}`, margin, cy);
  cy += 16;
  doc.text(`Final simulation — Money: $${finalStats.money} · Stress meter: ${finalStats.stress} / 100`, margin, cy);
  cy += 28;

  doc.setFontSize(14);
  doc.text("Muse S — baseline window (start of session)", margin, cy);
  cy += 20;
  doc.setFontSize(10);
  doc.setTextColor(50);

  if (museCalibration && typeof museCalibration === "object") {
    const m = museCalibration;
    const rows = [
      ["Stress index (model)", m.stress != null ? String(m.stress) : "—"],
      ["Concentration proxy (β/α heuristic)", m.concentration != null ? String(m.concentration) : "—"],
      ["Beta / alpha ratio", m.betaAlphaRatio != null ? String(m.betaAlphaRatio) : m.beta_alpha_ratio != null ? String(m.beta_alpha_ratio) : "—"],
      ["Samples (count)", m.samples != null ? String(m.samples) : "—"],
      ["Channels", m.channels != null ? String(m.channels) : "—"],
      ["Sample rate (Hz)", m.sampleRateHz != null ? String(m.sampleRateHz) : m.sample_rate_hz != null ? String(m.sample_rate_hz) : "—"],
      ["Source", String(m.source ?? "—")],
      ["Captured (UTC)", String(m.capturedAt ?? "—")],
    ];
    doc.setFillColor(245);
    let ry = cy;
    for (let i = 0; i < rows.length; i++) {
      doc.setFillColor(i % 2 === 0 ? 252 : 245);
      doc.rect(margin, ry, pageW - margin * 2, 18, "F");
      doc.setTextColor(60);
      doc.text(rows[i][0], margin + 6, ry + 12);
      doc.setTextColor(20);
      doc.text(rows[i][1], margin + 220, ry + 12);
      ry += 18;
    }
    cy = ry + 16;

    if (m.stress != null && m.concentration != null) {
      drawBarPair(doc, margin, cy, pageW - margin * 2, "Baseline stress index", Number(m.stress));
      cy += 36;
      drawBarPair(doc, margin, cy, pageW - margin * 2, "Baseline concentration proxy", Number(m.concentration));
      cy += 44;
    }
  } else {
    doc.setTextColor(120);
    doc.text("No Muse calibration stored for this run (e.g. Play (Regular) without EEG).", margin, cy);
    cy += 28;
  }

  doc.setFontSize(14);
  doc.setTextColor(30);
  doc.text("In-game stress trajectory (after each choice)", margin, cy);
  cy += 18;

  const stresses = (stressTimeline || []).map((p) => p.stress);
  if (stresses.length >= 2) {
    cy = drawLineSeries(doc, margin, cy, pageW - margin * 2, 120, stresses, { ymin: 0, ymax: 100 });
    doc.setFontSize(8);
    doc.setTextColor(100);
    const captions = (stressTimeline || []).map((p, i) => `${i}. ${p.beat || "?"} → ${p.stress}`);
    const capLines = doc.splitTextToSize(captions.join(" · "), pageW - margin * 2);
    doc.text(capLines, margin, cy);
    cy += capLines.length * 9 + 16;
  } else {
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text("Not enough logged points for a chart (need at least two).", margin, cy);
    cy += 24;
  }

  doc.setFontSize(12);
  doc.setTextColor(30);
  doc.text("Landlord-facing prompts (non-clinical)", margin, cy);
  cy += 16;
  doc.setFontSize(10);
  doc.setTextColor(50);
  const prompts = [
    "• Ask open questions about housing stability and support needs rather than inferring from metrics.",
    "• If stress appeared high in the game narrative, discuss concrete supports (payment plans, repairs timeline, referrals).",
    "• EEG baselines vary by sleep, caffeine, and movement — never treat a single window as a label of the person.",
  ];
  for (const line of prompts) {
    const lines = doc.splitTextToSize(line, pageW - margin * 2);
    doc.text(lines, margin, cy);
    cy += lines.length * 12 + 4;
  }

  doc.save(`tenant-session-report-${new Date().toISOString().slice(0, 10)}.pdf`);
}
