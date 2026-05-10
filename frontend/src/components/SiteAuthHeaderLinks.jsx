import { Link } from "react-router-dom";

const linkClass =
  "text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors no-underline font-normal";

/**
 * Preview-only auth entry points. Keep these next to the logo only — do not
 * add /login or /signup links elsewhere in the app.
 *
 * @param {{ omit?: "login" | "signup" }} props
 */
export default function SiteAuthHeaderLinks({ omit }) {
  const showLogin = omit !== "login";
  const showSignup = omit !== "signup";

  return (
    <nav
      aria-label="Account (coming soon)"
      className="ml-3 sm:ml-4 inline-flex items-center gap-2 border-l border-zinc-800 pl-3 sm:pl-4"
    >
      {showLogin ? (
        <Link to="/login" className={linkClass}>
          Sign in
        </Link>
      ) : null}
      {showLogin && showSignup ? (
        <span className="text-zinc-700 select-none" aria-hidden>
          ·
        </span>
      ) : null}
      {showSignup ? (
        <Link to="/signup" className={linkClass}>
          Sign up
        </Link>
      ) : null}
    </nav>
  );
}
