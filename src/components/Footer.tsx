"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin, Phone, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SITE, FOOTER_GROUPS, DEFINITION } from "@/lib/site";
import { fadeUp, viewportOnce } from "@/lib/motion";

export function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden border-t border-line">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-radial-glow opacity-40" />

      {/* CTA band */}
      <Container>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="section-pad flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-2xl">
            <span className="eyebrow text-gold/90">Contact</span>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tightest text-ink sm:text-4xl md:text-5xl">
              Building the intelligence layer for{" "}
              <span className="text-gradient">disciplined investing.</span>
            </h2>
          </div>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-stretch">
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${SITE.email}`}
                className="group inline-flex items-center justify-between gap-6 rounded-full bg-ink px-6 py-3.5 font-mono text-xs uppercase tracking-widest text-bg transition-all hover:bg-white hover:shadow-glow"
              >
                <span className="inline-flex items-center gap-2">
                  <Mail size={15} /> {SITE.email}
                </span>
                <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href={`tel:${SITE.phone}`}
                className="group inline-flex items-center justify-between gap-6 rounded-full glass px-6 py-3.5 font-mono text-xs uppercase tracking-widest text-ink transition-all hover:border-azure/40 hover:shadow-glow"
              >
                <span className="inline-flex items-center gap-2">
                  <Phone size={15} className="text-azure" /> {SITE.phoneDisplay}
                </span>
                <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-between gap-6 rounded-full glass px-6 py-3.5 font-mono text-xs uppercase tracking-widest text-ink transition-all hover:border-success/40 hover:shadow-glow"
              >
                <span className="inline-flex items-center gap-2">
                  <WhatsAppIcon className="text-success" /> WhatsApp
                </span>
                <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href={SITE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-between gap-6 rounded-full glass px-6 py-3.5 font-mono text-xs uppercase tracking-widest text-ink transition-all hover:border-azure/40 hover:shadow-glow"
              >
                <span className="inline-flex items-center gap-2">
                  <Linkedin size={15} className="text-azure" /> LinkedIn
                </span>
                <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

            {/* WhatsApp QR — scan to open a chat */}
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center gap-3 rounded-2xl glass p-5 transition-all hover:border-success/40 hover:shadow-glow"
            >
              <span className="rounded-xl bg-white p-2.5">
                <img
                  src="/whatsapp-qr.svg"
                  alt="Scan the QR code to chat with ASQIOS on WhatsApp"
                  width={116}
                  height={116}
                  className="h-[116px] w-[116px]"
                />
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[0.58rem] uppercase tracking-widest text-ink-muted">
                <WhatsAppIcon className="text-success" size={12} /> Scan to chat
              </span>
            </a>
          </div>
        </motion.div>
      </Container>

      <div className="section-rule" />

      {/* Link grid */}
      <Container>
        <div className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Logo />
              <span className="font-display text-lg font-semibold tracking-tightest text-ink">
                {SITE.name}
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              {DEFINITION.label}
            </p>
            <p className="mt-3 font-mono text-[0.62rem] uppercase tracking-widest text-gold/80">
              {SITE.tagline}
            </p>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <div key={group.heading}>
              <h3 className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-muted">
                {group.heading}
              </h3>
              <ul className="mt-5 flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-ink/80 transition-colors hover:text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      <div className="section-rule" />

      <Container>
        <div className="flex flex-col items-center justify-between gap-4 py-7 sm:flex-row">
          <p className="font-mono text-[0.62rem] uppercase tracking-widest text-ink-muted">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <p className="font-mono text-[0.62rem] uppercase tracking-widest text-ink-muted">
            {SITE.domain}
          </p>
        </div>
      </Container>
    </footer>
  );
}

function Logo() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" fill="none" aria-hidden>
      <circle cx="16" cy="16" r="13" stroke="rgba(255,255,255,0.18)" />
      <circle cx="16" cy="16" r="6" stroke="#D4AF37" />
      <circle cx="16" cy="16" r="1.6" fill="#4F8CFF" />
    </svg>
  );
}

function WhatsAppIcon({
  size = 15,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91A9.86 9.86 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.37c0-4.54 3.7-8.23 8.24-8.23a8.2 8.2 0 0 1 8.23 8.24c0 4.54-3.69 8.4-8.23 8.4zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29z" />
    </svg>
  );
}
