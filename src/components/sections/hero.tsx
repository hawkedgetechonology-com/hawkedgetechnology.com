"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/layout/section";
import { ArrowRight, CheckCircle, BarChart3, Users, Zap, Globe, Layout, FileText, Search } from "lucide-react";

const TRUST_STATEMENTS = [
  "No hidden costs",
  "Free consultation",
  "Transparent process",
  "Dedicated project team",
];

const PRODUCTS = [
  {
    id: "mission-control",
    label: "Mission Control Dashboard",
    icon: BarChart3,
    color: "text-primary",
    bg: "bg-soft-blue",
    accent: "#00A3FF",
    description: "Real-time operational intelligence",
    metrics: [
      { label: "Active Projects", value: "24", trend: "+3 this week" },
      { label: "Team Velocity", value: "94%", trend: "↑ 12% vs last sprint" },
      { label: "On-Time Rate", value: "98.2%", trend: "Excellent" },
    ],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-and-numbers-31908-large.mp4",
    ui: "dashboard",
  },
  {
    id: "crm",
    label: "CRM",
    icon: Users,
    color: "text-secondary",
    bg: "bg-soft-blue",
    accent: "#004385",
    description: "Client relationship intelligence",
    metrics: [
      { label: "Active Clients", value: "142", trend: "+8 this month" },
      { label: "Pipeline Value", value: "$2.4M", trend: "↑ 18% QoQ" },
      { label: "Retention Rate", value: "96%", trend: "Industry-leading" },
    ],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-cyber-security-system-scanning-screens-and-data-34538-large.mp4",
    ui: "crm",
  },
  {
    id: "client-studio",
    label: "Client Studio",
    icon: Layout,
    color: "text-primary",
    bg: "bg-soft-blue",
    accent: "#00A3FF",
    description: "White-label client collaboration",
    metrics: [
      { label: "Active Workspaces", value: "67", trend: "Across 12 teams" },
      { label: "Avg. NPS Score", value: "72", trend: "World-class" },
      { label: "Feedback Response", value: "<2h", trend: "Average reply time" },
    ],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-abstract-digital-technology-background-40742-large.mp4",
    ui: "studio",
  },
  {
    id: "proposal-engine",
    label: "Proposal Engine",
    icon: FileText,
    color: "text-secondary",
    bg: "bg-soft-blue",
    accent: "#004385",
    description: "AI-assisted proposal generation",
    metrics: [
      { label: "Proposals Sent", value: "389", trend: "This quarter" },
      { label: "Win Rate", value: "42%", trend: "↑ 9% vs industry avg" },
      { label: "Avg. Close Time", value: "4.2d", trend: "Down from 8.1d" },
    ],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-programming-code-on-a-computer-screen-close-up-34537-large.mp4",
    ui: "proposal",
  },
  {
    id: "discovery-engine",
    label: "Discovery Engine",
    icon: Search,
    color: "text-primary",
    bg: "bg-soft-blue",
    accent: "#00A3FF",
    description: "Intelligent market intelligence",
    metrics: [
      { label: "Data Sources", value: "1,200+", trend: "Indexed daily" },
      { label: "Insights Generated", value: "840", trend: "This month" },
      { label: "Accuracy Score", value: "97.1%", trend: "Verified" },
    ],
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-computer-server-room-with-blinking-lights-40746-large.mp4",
    ui: "discovery",
  },
];

function ProductShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % PRODUCTS.length);
        setIsTransitioning(false);
      }, 300);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const product = PRODUCTS[activeIndex];
  const Icon = product.icon;

  return (
    <div className="relative w-full">
      {/* Browser chrome */}
      <div className="bg-white rounded-2xl border border-border-color shadow-lg overflow-hidden">
        {/* Browser top bar */}
        <div className="flex items-center gap-3 px-4 py-3 bg-light-gray border-b border-border-color">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
            <div className="w-3 h-3 rounded-full bg-green-400/60" />
          </div>
          <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-foreground/40 border border-border-color font-mono">
            app.hawkedge.io/{product.id}
          </div>
        </div>

        {/* App content */}
        <div
          className="p-6 min-h-[320px] transition-all duration-300"
          style={{ opacity: isTransitioning ? 0 : 1, transform: isTransitioning ? "translateY(6px)" : "translateY(0)" }}
        >
          {/* App header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-soft-blue">
                <Icon size={18} className={product.color} />
              </div>
              <div>
                <p className="font-semibold text-secondary text-sm">{product.label}</p>
                <p className="text-xs text-foreground/50">{product.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-foreground/50">Live</span>
            </div>
          </div>

          {/* Metrics row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {product.metrics.map((metric, i) => (
              <div key={i} className="bg-light-gray rounded-xl p-3 border border-border-color">
                <p className="text-2xl font-bold font-heading text-secondary leading-none mb-1">{metric.value}</p>
                <p className="text-xs font-medium text-foreground/60 mb-1">{metric.label}</p>
                <p className="text-xs text-primary/70">{metric.trend}</p>
              </div>
            ))}
          </div>

          {/* Video showcase of technology in action */}
          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden border border-border-color shadow-inner bg-black">
            <video
              key={product.id}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={product.videoUrl} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-white border border-white/20 font-semibold tracking-wider uppercase">
              Technology Loop
            </div>
          </div>
        </div>
      </div>

      {/* Product nav dots */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {PRODUCTS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => { setActiveIndex(i); setIsTransitioning(false); }, 300);
            }}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === activeIndex ? 24 : 8,
              height: 8,
              background: i === activeIndex ? "var(--primary)" : "var(--border-color)",
            }}
            aria-label={`View ${p.label}`}
          />
        ))}
      </div>

      {/* Active product label */}
      <p className="text-center text-sm text-foreground/50 mt-2 font-medium transition-all duration-300">
        {PRODUCTS[activeIndex].label}
      </p>
    </div>
  );
}

export function HeroSection() {
  return (
    <Section background="soft-blue" className="pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
      {/* Subtle editorial grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(var(--secondary) 1px, transparent 1px), linear-gradient(90deg, var(--secondary) 1px, transparent 1px)",
        backgroundSize: "48px 48px"
      }} />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 lg:gap-20">
        {/* Left Side */}
        <div className="flex-1 max-w-2xl text-center md:text-left">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-secondary text-sm font-semibold mb-6 shadow-sm border border-border-color animate-slide-up"
          >
            <Zap size={14} className="text-primary" />
            <span>Trusted by Growing Businesses</span>
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-secondary leading-tight tracking-tight mb-6 animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            Precision Software Engineering for{" "}
            <span className="text-primary">Modern Enterprises</span>
          </h1>

          <p
            className="text-lg md:text-xl text-foreground/70 mb-10 leading-relaxed animate-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            We partner with founders, executives, and product teams to design, build, and scale
            software that drives measurable business growth — on time, on budget, and built to last.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 animate-slide-up"
            style={{ animationDelay: "300ms" }}
          >
            <Link href="/contact">
              <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2 cursor-pointer hover-elevate">
                Book a Free Consultation <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/portfolio">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white cursor-pointer hover-elevate">
                Explore Our Work
              </Button>
            </Link>
          </div>

          {/* Trust statement */}
          <div
            className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 mt-6 animate-slide-up"
            style={{ animationDelay: "400ms" }}
          >
            {TRUST_STATEMENTS.map((stmt, i) => (
              <span key={i} className="flex items-center gap-1.5 text-sm text-foreground/60">
                <CheckCircle size={14} className="text-primary shrink-0" />
                {stmt}
              </span>
            ))}
          </div>
        </div>

        {/* Right Side — Product Showcase */}
        <div
          className="flex-1 w-full animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          <ProductShowcase />
        </div>
      </div>
    </Section>
  );
}
