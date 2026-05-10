import { useNavigate } from "react-router-dom";

const defaultStyle = {
  border: "none",
  background: "transparent",
  color: "#a1a1aa",
  textDecoration: "underline",
  textUnderlineOffset: "3px",
  fontSize: "13px",
  cursor: "pointer",
  fontFamily: "inherit",
  padding: "4px 0",
  lineHeight: 1.2,
};

/**
 * Browser-style back when history allows; otherwise navigates to `fallback`.
 * Not used on in-question game screens.
 */
export default function NavBackButton({
  fallback = "/",
  label = "Back",
  style,
  className,
  compact = false,
}) {
  const navigate = useNavigate();
  const mergedStyle = {
    ...defaultStyle,
    fontSize: compact ? "12px" : defaultStyle.fontSize,
    ...style,
  };

  return (
    <button
      type="button"
      className={className}
      style={mergedStyle}
      aria-label="Go back"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          navigate(-1);
        } else {
          navigate(fallback);
        }
      }}
    >
      ← {label}
    </button>
  );
}
