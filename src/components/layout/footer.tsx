import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

// Brand social icons as inline SVG (lucide-react does not export brand icons)
const LinkedInIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const TwitterXIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l16 16m0-16L4 20" />
  </svg>
);
const GitHubIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);
const FacebookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const FOOTER_LINKS = {
  company: [
    { label: "About HawkEdge", href: "/about" },
    { label: "Our Process", href: "/about#process" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  services: [
    { label: "Custom Software", href: "/services" },
    { label: "Web Development", href: "/services" },
    { label: "AI Solutions", href: "/services" },
    { label: "Cloud & DevOps", href: "/services" },
    { label: "UI/UX Design", href: "/services" },
    { label: "Technology Consulting", href: "/services" },
  ],
  resources: [
    { label: "Portfolio & Case Studies", href: "/portfolio" },
    { label: "FAQ", href: "/contact#faq" },
    { label: "Our Process", href: "/about" },
    { label: "Book a Consultation", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
  ],
};

const SOCIALS = [
  { label: "LinkedIn", href: "#", Icon: LinkedInIcon },
  { label: "Instagram", href: "https://www.instagram.com/hawkedge_technologies?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==", Icon: InstagramIcon },
  { label: "Twitter / X", href: "#", Icon: TwitterXIcon },
  { label: "GitHub", href: "#", Icon: GitHubIcon },
  { label: "Facebook", href: "#", Icon: FacebookIcon },
];

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-heading font-semibold text-secondary text-sm mb-5 tracking-wide uppercase">{title}</h4>
      {children}
    </div>
  );
}

function FooterLinks({ links }: { links: { label: string; href: string }[] }) {
  return (
    <ul className="space-y-3">
      {links.map((item) => (
        <li key={item.label}>
          <Link
            href={item.href}
            className="text-sm text-foreground/60 hover:text-primary transition-colors duration-200"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-light-gray border-t border-border-color">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-10">

        {/* Top: Brand + Columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 mb-14">

          {/* Brand — spans 2 cols on large */}
          <div className="col-span-2 space-y-6">
            <div className="relative h-12 w-32">
              <Image
                src="/logo.jpg"
                alt="HawkEdge Technologies Logo"
                fill
                sizes="128px"
                className="object-contain object-left"
              />
            </div>
            <p className="text-sm text-foreground/60 leading-relaxed max-w-xs">
              A precision software engineering company building scalable, secure, and maintainable digital products for modern businesses.
            </p>

            {/* Business email — prominent */}
            <a
              href="mailto:hawkedgetechonology@gmail.com"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              <Mail size={14} />
              hawkedgetechonology@gmail.com
            </a>

            {/* Social links */}
            <div className="flex gap-3">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-foreground/50 hover:text-primary shadow-sm hover:shadow-md transition-all border border-border-color"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <FooterCol title="Company">
            <FooterLinks links={FOOTER_LINKS.company} />
          </FooterCol>

          {/* Services */}
          <FooterCol title="Services">
            <FooterLinks links={FOOTER_LINKS.services} />
          </FooterCol>

          {/* Resources */}
          <FooterCol title="Resources">
            <FooterLinks links={FOOTER_LINKS.resources} />
          </FooterCol>

          {/* Contact + Legal */}
          <div className="space-y-8">
            <FooterCol title="Contact">
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5">
                  <Phone size={14} className="text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/60">+1 (800) 123-4567</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/60">123 Innovation Drive, Silicon Valley, CA</span>
                </li>
                <li className="text-sm text-foreground/60 pl-5">Mon – Fri · 9AM – 6PM</li>
              </ul>
            </FooterCol>

            <FooterCol title="Legal">
              <FooterLinks links={FOOTER_LINKS.legal} />
            </FooterCol>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border-color flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-foreground/40">
            &copy; {currentYear} HawkEdge Technologies. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="text-xs text-foreground/40 hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="text-xs text-foreground/40 hover:text-primary transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
