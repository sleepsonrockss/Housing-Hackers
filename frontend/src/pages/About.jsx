export default function About() {
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
              { label: "How it works", href: "/how-it-works" },
              { label: "Chapters", href: "/chapters" },
              { label: "About", href: "/about", active: true },
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
      <section className="border-b border-zinc-900 py-24 px-6">
        <div className="max-w-[800px] mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="h-px w-8 bg-zinc-700" />
            <span className="text-[11px] tracking-widest uppercase text-zinc-500">Our Mission</span>
            <span className="h-px w-8 bg-zinc-700" />
          </div>
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight leading-[1.08] mb-6">
            Empower renters with knowledge.
          </h1>
          <p className="text-[16px] text-zinc-500 leading-relaxed">
            Too many tenants make decisions in ignorance of their rights. TenantTales exists to change that through immersive, interactive learning.
          </p>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="border-b border-zinc-900 py-20 px-6">
        <div className="max-w-[900px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-semibold mb-6">The Problem We Solve</h2>
              <p className="text-[15px] text-zinc-500 leading-relaxed mb-4">
                Tenant rights are complex, vary by region, and are poorly understood. Most renters learn too late—after signing a bad lease, paying illegal fees, or facing unlawful eviction.
              </p>
              <p className="text-[15px] text-zinc-500 leading-relaxed">
                Traditional resources are dry, inaccessible, and don't stick. People learn best by doing, not reading. That's where TenantTales comes in.
              </p>
            </div>
            <div className="p-8 rounded-lg border border-zinc-800 bg-zinc-900/40">
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-semibold text-white mb-1">1 in 4</div>
                  <p className="text-[12px] text-zinc-500">Tenants are unaware of basic rights</p>
                </div>
                <div className="border-t border-zinc-800 pt-4">
                  <div className="text-2xl font-semibold text-white mb-1">$500M+</div>
                  <p className="text-[12px] text-zinc-500">In illegal landlord fees paid annually</p>
                </div>
                <div className="border-t border-zinc-800 pt-4">
                  <div className="text-2xl font-semibold text-white mb-1">40%</div>
                  <p className="text-[12px] text-zinc-500">Of evictions lack proper legal notice</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR APPROACH */}
      <section className="border-b border-zinc-900 py-20 px-6">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-3xl font-semibold mb-12">Our Approach</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Scenario-Based",
                desc: "Learn through real situations, not lectures. Every scenario is grounded in actual tenant law.",
              },
              {
                title: "Interactive",
                desc: "Make decisions, see consequences. Learning sticks when you choose and experience outcomes.",
              },
              {
                title: "Accessible",
                desc: "Clear, jargon-free language. Designed for anyone, regardless of background or experience.",
              },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/20">
                <h3 className="text-[15px] font-semibold mb-2">{item.title}</h3>
                <p className="text-[13px] text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="border-b border-zinc-900 py-20 px-6">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-3xl font-semibold mb-12">Our Values</h2>

          <div className="space-y-8">
            {[
              {
                title: "Accuracy",
                desc: "Every scenario and legal detail is fact-checked against current tenant law. We take responsibility for accuracy seriously.",
              },
              {
                title: "Neutrality",
                desc: "We present the law as it stands, not advocacy. Players see both tenant protections and landlord perspectives.",
              },
              {
                title: "Accessibility",
                desc: "Tenant rights education should be free and available to everyone, regardless of income or privilege.",
              },
              {
                title: "Empowerment",
                desc: "Knowledge is power. We equip renters to negotiate, advocate, and protect themselves.",
              },
            ].map((item) => (
              <div key={item.title}>
                <h3 className="text-[15px] font-semibold mb-2">{item.title}</h3>
                <p className="text-[13px] text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="border-b border-zinc-900 py-20 px-6">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-3xl font-semibold mb-12">The Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "Jordan Chen",
                role: "Founder & Game Designer",
                bio: "Former tenant advocate with 8 years in housing policy. Designed TenantTales to fix the knowledge gap.",
              },
              {
                name: "Alex Rivera",
                role: "Legal Advisor",
                bio: "Tenant rights lawyer specializing in residential law. Ensures all content is accurate and current.",
              },
              {
                name: "Sam Patel",
                role: "Engineering Lead",
                bio: "Full-stack engineer passionate about accessible learning tools. Built the platform from the ground up.",
              },
              {
                name: "Morgan Lee",
                role: "Content & Research",
                bio: "Wrote all 48 scenarios based on real tenant experiences. Fact-checks every legal claim.",
              },
            ].map((person) => (
              <div key={person.name} className="p-6 rounded-lg border border-zinc-800 bg-zinc-900/20">
                <h3 className="text-[14px] font-semibold text-white">{person.name}</h3>
                <p className="text-[12px] text-zinc-400 mb-2">{person.role}</p>
                <p className="text-[13px] text-zinc-500 leading-relaxed">{person.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-[600px] mx-auto">
          <h2 className="text-3xl font-semibold mb-4">Join the Movement</h2>
          <p className="text-[15px] text-zinc-500 mb-8 leading-relaxed">
            Help us empower the next generation of informed, confident renters.
          </p>
          <a
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-zinc-950 text-[13px] font-semibold px-5 py-2.5 rounded-md hover:bg-zinc-100 transition-all"
          >
            Get Started Today
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