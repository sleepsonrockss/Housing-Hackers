import { ArrowRight, Zap, Users, TrendingUp, Brain } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#090909] text-white font-sans antialiased">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-zinc-900 bg-[#090909]/80 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="h-5 w-5 rounded bg-white flex items-center justify-center">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M1 10L5.5 1 10 10H1z" fill="#090909" />
              </svg>
            </div>
            <span className="text-[13px] font-semibold tracking-tight">TenantTales</span>
          </a>

          <nav className="hidden md:flex items-center gap-5">
            {[
              { label: "How it works", href: "/how-it-works", active: true },
              { label: "Chapters", href: "/chapters" },
              { label: "About", href: "/about" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`text-[13px] transition-colors ${
                  l.active ? "text-white font-medium" : "text-zinc-500 hover:text-zinc-200"
                }`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href="/login" className="text-[13px] text-zinc-400 hover:text-white px-3 py-1.5 transition-colors">
              Sign in
            </a>
            <a href="/signup" className="text-[13px] font-medium bg-white text-zinc-950 px-3 py-1.5 rounded-md hover:bg-zinc-100 transition-colors">
              Get started
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="border-b border-zinc-900 py-20 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="h-px w-8 bg-zinc-700" />
            <span className="text-[11px] tracking-widest uppercase text-zinc-500">The Method</span>
            <span className="h-px w-8 bg-zinc-700" />
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.08] mb-4">
            How TenantTales Works
          </h1>
          <p className="text-[15px] text-zinc-500 leading-relaxed">
            A chapter-based, decision-driven experience that teaches you tenant rights through real scenarios.
          </p>
        </div>
      </section>

      {/* STEP-BY-STEP FLOW */}
      <section className="border-b border-zinc-900 py-20 px-6">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-2xl font-semibold mb-12">The Journey</h2>

          {/* Timeline */}
          <div className="space-y-8">
            {[
              {
                step: 1,
                title: "Start Your Chapter",
                desc: "You arrive at a new scenario. The stage is set: an inspection happening, a neighbor complaint, a lease renewal notice.",
              },
              {
                step: 2,
                title: "Face the Decision",
                desc: "Read the situation carefully. You're presented with 3–5 realistic choices, each with different outcomes.",
              },
              {
                step: 3,
                title: "Make Your Choice",
                desc: "Select an action. Your decision triggers immediate consequences—some good, some you'll regret.",
              },
              {
                step: 4,
                title: "Learn & Progress",
                desc: "See the outcome. Understand the legal or practical implications of your choice. Move forward.",
              },
              {
                step: 5,
                title: "Complete the Chapter",
                desc: "Finish all scenarios in the chapter to unlock the next one. Track your progress across 10 chapters.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6">
                {/* Number */}
                <div className="flex flex-col items-center gap-4 shrink-0">
                  <div className="w-12 h-12 rounded-lg border border-zinc-700 flex items-center justify-center bg-zinc-950">
                    <span className="text-[13px] font-semibold">{item.step}</span>
                  </div>
                  {item.step < 5 && <div className="w-px h-12 bg-zinc-800" />}
                </div>

                {/* Content */}
                <div className="pt-1 pb-4">
                  <h3 className="text-[15px] font-semibold mb-1.5">{item.title}</h3>
                  <p className="text-[13px] text-zinc-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEY FEATURES */}
      <section className="border-b border-zinc-900 py-20 px-6">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-2xl font-semibold mb-12">What Makes It Work</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: Brain,
                title: "Scenario-Based Learning",
                desc: "Learn from realistic situations, not textbooks. Each scenario mirrors real-world tenant challenges.",
              },
              {
                icon: TrendingUp,
                title: "Progressive Difficulty",
                desc: "Start with basics (viewings, leases). Progress to complex issues (disputes, tribunals).",
              },
              {
                icon: Zap,
                title: "Immediate Feedback",
                desc: "See the consequences of your choices instantly. Understand cause and effect.",
              },
              {
                icon: Users,
                title: "Guided by Law",
                desc: "Every scenario is grounded in real tenant rights. Learn what the law actually says.",
              },
            ].map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/30">
                  <Icon className="w-6 h-6 text-white mb-3" />
                  <h3 className="text-[15px] font-semibold mb-2">{feature.title}</h3>
                  <p className="text-[13px] text-zinc-500 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROGRESS SYSTEM */}
      <section className="border-b border-zinc-900 py-20 px-6">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-2xl font-semibold mb-8">Track Your Progress</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { n: "10", l: "Chapters", d: "One for each major topic in tenant rights" },
              { n: "48", l: "Scenarios", d: "Real-world situations you'll face as a tenant" },
              { n: "120+", l: "Outcomes", d: "Different endings based on your choices" },
            ].map(({ n, l, d }) => (
              <div key={l} className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/20">
                <div className="text-2xl font-semibold mb-1">{n}</div>
                <div className="text-[13px] font-medium text-white mb-2">{l}</div>
                <p className="text-[12px] text-zinc-600">{d}</p>
              </div>
            ))}
          </div>

          <p className="text-[13px] text-zinc-500 leading-relaxed">
            Your progress is saved automatically. Resume from where you left off anytime. Replay chapters to see different outcomes.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-[600px] mx-auto">
          <h2 className="text-3xl font-semibold mb-4">Ready to start?</h2>
          <p className="text-[15px] text-zinc-500 mb-8 leading-relaxed">
            Begin your journey through the renting world. Learn by doing, not by reading.
          </p>
          <a
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-zinc-950 text-[13px] font-semibold px-5 py-2.5 rounded-md hover:bg-zinc-100 transition-all"
          >
            Start Now
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 py-8 px-6 text-center text-[12px] text-zinc-600">
        <div className="max-w-[1280px] mx-auto">
          <p>© 2026 TenantTales. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}