import React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-bg-base border-t border-border-default mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Core Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-12 border-b border-border-subtle">
          
          {/* Brand and Mission */}
          <div className="flex flex-col gap-4">
            <span className="font-heading font-extrabold text-lg tracking-wider text-text-primary">
              HAWKEDGE
            </span>
            <p className="text-xs text-text-muted leading-relaxed max-w-xs font-body">
              An enterprise-grade systems engineering and AI automation firm. We build production systems with mathematical precision and zero-debt architectures.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-semantic-success animate-pulse" />
              <span className="font-mono text-[9px] text-text-secondary tracking-wider uppercase">
                STATUS: ALL SERVICES OPERATIONAL
              </span>
            </div>
          </div>

          {/* Links: Platform Index */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[10px] text-brand-primary tracking-widest uppercase">
              // PLATFORM INDEX
            </span>
            <ul className="grid grid-cols-2 gap-2 text-xs font-body">
              <li>
                <Link href="/" className="text-text-muted hover:text-text-primary transition-colors focus:outline-none">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-text-muted hover:text-text-primary transition-colors focus:outline-none">
                  About
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-text-muted hover:text-text-primary transition-colors focus:outline-none">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-text-muted hover:text-text-primary transition-colors focus:outline-none">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="text-text-muted hover:text-text-primary transition-colors focus:outline-none">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/industries" className="text-text-muted hover:text-text-primary transition-colors focus:outline-none">
                  Industries
                </Link>
              </li>
              <li>
                <Link href="/technology" className="text-text-muted hover:text-text-primary transition-colors focus:outline-none">
                  Technology
                </Link>
              </li>
              <li>
                <Link href="/internships" className="text-text-muted hover:text-text-primary transition-colors focus:outline-none">
                  Internships
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-text-muted hover:text-text-primary transition-colors focus:outline-none">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text-muted hover:text-text-primary transition-colors focus:outline-none">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Legal & Compliance */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[10px] text-brand-primary tracking-widest uppercase">
              // COMPLIANCE & LEGAL
            </span>
            <ul className="flex flex-col gap-2.5 text-xs font-body">
              <li>
                <Link href="/privacy" className="text-text-muted hover:text-text-primary transition-colors focus:outline-none">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-text-muted hover:text-text-primary transition-colors focus:outline-none">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-text-muted hover:text-text-primary transition-colors focus:outline-none">
                  Refund & Cancellation Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Coordinates & Systems Parameters */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[10px] text-brand-primary tracking-widest uppercase">
              // SYSTEMS COORDINATES
            </span>
            <ul className="flex flex-col gap-2 text-xs font-mono text-text-muted">
              <li>
                <span className="text-[10px] text-text-secondary">EMAIL: </span>
                <a href="mailto:ops@hawkedge.io" className="hover:text-text-primary transition-colors focus:outline-none">
                  ops@hawkedge.io
                </a>
              </li>
              <li>
                <span className="text-[10px] text-text-secondary">HQ: </span>
                <span>Bengaluru, KA, India</span>
              </li>
              <li className="pt-2 border-t border-border-subtle mt-2 flex flex-col gap-1">
                <div className="flex justify-between">
                  <span>SECURE_MD5:</span>
                  <span className="text-text-secondary">E9C2F8B7...</span>
                </div>
                <div className="flex justify-between">
                  <span>ENGINE:</span>
                  <span className="text-text-secondary">NEXT.JS v15</span>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-4 font-mono text-[10px] text-text-muted">
          <span>
            © {currentYear} HAWKEDGE TECHNOLOGY PRIVATE LIMITED. ALL RIGHTS RESERVED.
          </span>
          <div className="flex gap-4">
            <span className="hover:text-text-primary cursor-help">LATENCY: 14ms</span>
            <span>|</span>
            <span className="hover:text-text-primary cursor-help">BUILD: STABLE-MAIN</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
