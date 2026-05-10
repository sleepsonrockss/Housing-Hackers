import { parseGlossarySegments } from "../game/housingGlossary";

/**
 * Renders string with inline glossary triggers.
 * @param {{ text: string, onOpenTerm: (key: string) => void, stopPropagation?: boolean }} props
 */
export function GlossaryRichText({ text, onOpenTerm, stopPropagation = false }) {
  const segments = parseGlossarySegments(text);
  return segments.map((seg, i) => {
    if (seg.type === "text") {
      return <span key={i}>{seg.text}</span>;
    }
    return (
      <button
        key={i}
        type="button"
        className="glossary-term-btn"
        onClick={(e) => {
          if (stopPropagation) e.stopPropagation();
          onOpenTerm(seg.key);
        }}
        aria-label={`Open explanation of ${seg.surface}`}
      >
        {seg.surface}
      </button>
    );
  });
}
