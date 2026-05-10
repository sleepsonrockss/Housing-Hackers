import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Check } from "lucide-react";
import GameNavActions from "../components/GameNavActions";
import SiteAuthHeaderLinks from "../components/SiteAuthHeaderLinks";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const passwordStrength = (pwd) => {
    if (!pwd) return 0;
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const strength = passwordStrength(password);
  const strengthColor = {
    0: "bg-zinc-800",
    1: "bg-red-600",
    2: "bg-yellow-600",
    3: "bg-blue-600",
    4: "bg-green-600",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Call your signup API
    console.log("Signup:", { fullName, email, password });
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white font-sans antialiased flex flex-col">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-[#090909]/80 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5 no-underline text-inherit">
              <div className="h-5 w-5 rounded bg-white flex items-center justify-center">
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M1 10L5.5 1 10 10H1z" fill="#090909" />
                </svg>
              </div>
              <span className="text-[13px] font-semibold tracking-tight">TenantTales</span>
            </Link>
            <SiteAuthHeaderLinks omit="signup" />
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-[420px]">
          {/* Heading */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-px w-6 bg-zinc-700" />
              <span className="text-[11px] tracking-widest uppercase text-zinc-500">Get Started</span>
              <span className="h-px w-6 bg-zinc-700" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-center mb-2">Create an account</h1>
            <p className="text-center text-[13px] text-zinc-500">
              Join thousands learning tenant rights.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-[12px] font-medium mb-2 text-zinc-300">
                Full name
              </label>
              <input
                id="name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-[12px] font-medium mb-2 text-zinc-300">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-[12px] font-medium mb-2 text-zinc-300">
                Password
              </label>
              <div className="relative mb-2">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength meter */}
              {password && (
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i < strength ? strengthColor[strength] : "bg-zinc-800"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Strength text */}
              {password && (
                <p className="text-[11px] text-zinc-600 mt-1">
                  {strength === 1 && "Weak password"}
                  {strength === 2 && "Fair password"}
                  {strength === 3 && "Good password"}
                  {strength === 4 && "Strong password"}
                </p>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2.5 text-[12px] text-zinc-400 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded border border-zinc-700 bg-zinc-950 mt-0.5 cursor-pointer accent-white"
                  required
                />
                <span className="leading-relaxed">
                  I agree to the{" "}
                  <a href="/terms" className="text-white hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="text-white hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!agreeTerms}
              className="w-full bg-white text-zinc-950 text-[13px] font-semibold py-2.5 rounded-lg hover:bg-zinc-100 transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-6"
            >
              Create account
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-zinc-800" />
            <span className="text-[12px] text-zinc-600">or</span>
            <div className="flex-1 h-px bg-zinc-800" />
          </div>

          {/* OAuth */}
          <div className="space-y-2 mb-8">
            <button type="button" className="w-full px-4 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900/50 text-[13px] font-medium text-white hover:border-zinc-700 hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>
            <button type="button" className="w-full px-4 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900/50 text-[13px] font-medium text-white hover:border-zinc-700 hover:bg-zinc-900 transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.002 12.002 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              Sign up with GitHub
            </button>
          </div>

        </div>
      </main>

      <div className="max-w-lg mx-auto px-6 pb-4 flex justify-center border-t border-zinc-900 pt-6">
        <GameNavActions compact />
      </div>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 py-6 px-6 text-center text-[12px] text-zinc-600">
        <p>© 2026 TenantTales. All rights reserved.</p>
      </footer>
    </div>
  );
}