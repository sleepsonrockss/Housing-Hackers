import { Link } from "react-router-dom";
import { getResumeGameHref, RESTART_GAME_HREF } from "../game/playerSessionPersist";

const baseBtn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px 14px",
  borderRadius: "8px",
  fontSize: "12px",
  fontWeight: 600,
  textDecoration: "none",
  border: "1px solid #3f3f46",
  background: "#141418",
  color: "#e4e4e7",
  lineHeight: 1.2,
  whiteSpace: "nowrap",
};

/**
 * Consistent Home / Days / Continue (resume) / Restart / Choice log controls.
 * @param {{
 *   omitContinue?: boolean,
 *   continueHref?: string,
 *   continueLabel?: string,
 *   compact?: boolean,
 *   className?: string,
 * }} props
 */
export default function GameNavActions({
  omitContinue = false,
  continueHref: continueHrefProp,
  continueLabel = "Continue game",
  compact = false,
  className = "",
}) {
  const continueHref = continueHrefProp ?? getResumeGameHref();
  const gap = compact ? "6px" : "10px";
  const pad = compact ? "6px 10px" : baseBtn.padding;
  const btn = { ...baseBtn, padding: pad, fontSize: compact ? "11px" : "12px" };
  const primary = { ...btn, borderColor: "#60a5fa", background: "rgba(96, 165, 250, 0.12)", color: "#bfdbfe" };
  const restart = { ...btn, borderColor: "#b45309", background: "rgba(251, 191, 36, 0.08)", color: "#fcd34d" };
  const ghost = {
    ...btn,
    border: "none",
    background: "transparent",
    color: "#a1a1aa",
    textDecoration: "underline",
    textUnderlineOffset: "3px",
    padding: compact ? "6px 8px" : "8px 10px",
  };

  return (
    <nav
      className={className}
      aria-label="Game navigation"
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap,
        rowGap: gap,
      }}
    >
      <Link to="/" style={ghost}>
        Home
      </Link>
      <Link to="/chapters" style={ghost}>
        Days
      </Link>
      {!omitContinue ? (
        <Link to={continueHref} style={primary}>
          {continueLabel}
        </Link>
      ) : null}
      <Link to={RESTART_GAME_HREF} style={restart} title="New run: resets money to $1850, stress, flags, and saved choices in this browser.">
        Restart run
      </Link>
      <Link to="/game/run-log" style={ghost}>
        Choice log
      </Link>
    </nav>
  );
}
