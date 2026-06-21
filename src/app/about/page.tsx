import type { Metadata } from "next";
import { ArrowRight, Mail } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { DEFINITION, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: DEFINITION.canonical,
  alternates: { canonical: `${SITE.url}/about` },
  openGraph: {
    title: `About — ${SITE.name}`,
    description: DEFINITION.canonical,
    url: `${SITE.url}/about`,
  },
};

const PILLARS = [
  { k: "Research", v: "Evidence-graded investigation" },
  { k: "Governance", v: "Auditable, constrained decisions" },
  { k: "Artificial Intelligence", v: "Machine-assisted analysis" },
  { k: "Shariah Compliance", v: "Embedded by architecture" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden pb-24 pt-36 md:pt-44">
          {/* Ambient depth */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute inset-0 grid-overlay opacity-40" />
            <div className="absolute left-1/2 top-0 h-[80vh] w-[80vh] -translate-x-1/2 bg-radial-glow" />
          </div>

          <Container>
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-gold/60" />
                <span className="eyebrow text-gold/90">About ASQIOS</span>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tightest text-ink sm:text-5xl md:text-6xl">
                What Is ASQIOS?
              </h1>
            </Reveal>

            {/* Highlighted core identity statement */}
            <Reveal delay={0.1}>
              <div className="relative mt-12 overflow-hidden rounded-3xl border border-gold/25 bg-white/[0.04] p-8 shadow-gold md:p-14">
                <div className="pointer-events-none absolute inset-0 -z-10 bg-radial-glow opacity-40" />
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-gold/80 via-gold/30 to-transparent"
                />
                <p className="max-w-4xl font-display text-2xl font-medium leading-snug tracking-tight text-ink sm:text-3xl md:text-4xl">
                  ASQIOS is an{" "}
                  <span className="text-gradient">
                    AI-native Shariah-compliant
                  </span>{" "}
                  investment intelligence and{" "}
                  <span className="text-gold">research platform.</span>
                </p>
                <p className="mt-7 max-w-3xl text-base leading-relaxed text-ink-muted md:text-lg">
                  {DEFINITION.aboutBody}
                </p>
              </div>
            </Reveal>

            {/* Pillars */}
            <Reveal delay={0.15}>
              <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
                {PILLARS.map((p) => (
                  <div key={p.k} className="bg-bg p-6">
                    <p className="font-display text-base font-semibold tracking-tight text-ink">
                      {p.k}
                    </p>
                    <p className="mt-1 font-mono text-[0.62rem] uppercase tracking-widest text-ink-muted">
                      {p.v}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Context */}
            <Reveal delay={0.2}>
              <p className="mt-14 max-w-3xl font-display text-xl font-light leading-snug tracking-tight text-ink/90 md:text-2xl">
                ASQIOS is a research institution and intelligence framework — not
                a stock-picking app, signal service, or trading platform. Every
                conclusion is{" "}
                <span className="text-azure">earned, challenged, and recorded.</span>
              </p>
            </Reveal>

            {/* CTAs */}
            <Reveal delay={0.25}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/#platform"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 font-mono text-xs uppercase tracking-widest text-bg transition-all duration-300 hover:bg-white hover:shadow-glow"
                >
                  Explore the Platform
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </a>
                <a
                  href={`mailto:${SITE.email}`}
                  className="group inline-flex items-center justify-center gap-2 rounded-full glass px-7 py-3.5 font-mono text-xs uppercase tracking-widest text-ink transition-all duration-300 hover:border-azure/40 hover:shadow-glow"
                >
                  <Mail size={15} className="text-azure" />
                  Contact
                </a>
              </div>
            </Reveal>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
