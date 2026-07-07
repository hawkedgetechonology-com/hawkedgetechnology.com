'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Cpu, Layers, Sparkles, UserCheck, GraduationCap, ChevronRight } from 'lucide-react';
import { Button } from '@hawkedge/ui';

type JourneyType = 'software' | 'ai' | 'business' | 'internship' | 'talent';

interface JourneyContent {
  headline: string;
  tagline: string;
  paragraph: string;
  stats: { label: string; value: string }[];
  stack: string[];
  ctaText: string;
  ctaLink: string;
}

const journeyData: Record<JourneyType, JourneyContent> = {
  software: {
    headline: 'Engineering High-Performance Digital Infrastructure.',
    tagline: '// CUSTOM SOFTWARE DEVELOPMENT',
    paragraph: 'We design and build robust web, mobile, and API-driven systems that resolve complex business problems. Standardized on TypeScript, NestJS, and Next.js, we eliminate technical debt out of the gate with strict type-safety and 100% test coverage.',
    stats: [
      { label: 'Uptime SLA', value: '99.99%' },
      { label: 'Core Coverage', value: '100% Target' },
      { label: 'Development Cycle', value: '2-Week Sprints' },
    ],
    stack: ['Next.js', 'NestJS', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker'],
    ctaText: 'Initiate Project Build',
    ctaLink: '/contact?journey=software',
  },
  ai: {
    headline: 'Deploy Production-Grade Machine Learning & Intelligence.',
    tagline: '// ARTIFICIAL INTELLIGENCE & ML',
    paragraph: 'Go beyond basic API wrappers. We build custom RAG pipelines, fine-tune models on domain-specific datasets, and deploy secure vector search indices that run on-premise or in your cloud, prioritizing data sovereignty and sub-second latency.',
    stats: [
      { label: 'Data Processing', value: '80% Faster' },
      { label: 'Search Latency', value: '<50ms' },
      { label: 'Execution Loop', value: 'Agentic' },
    ],
    stack: ['PyTorch', 'FastAPI', 'pgvector', 'HuggingFace', 'LangChain', 'OpenAI'],
    ctaText: 'Deploy AI Strategy',
    ctaLink: '/contact?journey=ai',
  },
  business: {
    headline: 'Enterprise Digitization & High-Throughput Automation.',
    tagline: '// WORKFLOW & SCALING OPERATIONS',
    paragraph: 'Replace slow, manual back-office operations with high-throughput workflow engines. We audit your operational bottlenecks, build custom administrative tools, and integrate legacy systems to scale your capacity without scaling headcount.',
    stats: [
      { label: 'Average ROI', value: '3.5x Year 1' },
      { label: 'Manual Work Saved', value: '10,000+ Hrs' },
      { label: 'Sync Failures', value: '0%' },
    ],
    stack: ['AWS Cloud', 'Terraform', 'Python', 'Node.js', 'Apache Kafka', 'Kubernetes'],
    ctaText: 'Optimize Operations',
    ctaLink: '/contact?journey=business',
  },
  internship: {
    headline: 'Learn Production-Grade Engineering Firsthand.',
    tagline: '// TALENT DEVELOPER PIPELINE',
    paragraph: 'A highly selective training experience designed for aspiring engineers. Work in real monorepos, contribute to live platforms, solve git conflicts, and survive rigorous daily code review iterations under the mentorship of senior staff.',
    stats: [
      { label: 'Admissions Rate', value: '<3%' },
      { label: 'Program Duration', value: '6 Months' },
      { label: 'Placement Rate', value: '92%' },
    ],
    stack: ['Git & Monorepos', 'TypeScript', 'Prisma', 'Turborepo', 'CI/CD Pipelines'],
    ctaText: 'Apply to Program',
    ctaLink: '/contact?journey=internship',
  },
  talent: {
    headline: 'Onboard Elite Vetted Engineers Instantly.',
    tagline: '// TALENT AUGMENTATION',
    paragraph: 'Deploy senior software architects, backend specialists, and DevOps veterans. Skip recruiting pipelines and integrate experts directly into your codebase and daily standups within 48 hours, fully aligned with your timezone.',
    stats: [
      { label: 'Onboarding Time', value: '48 Hours' },
      { label: 'Average Tenure', value: '5+ Years' },
      { label: 'Timezone Sync', value: 'Full Offset' },
    ],
    stack: ['Lead Architects', 'Full-Stack Developers', 'DevOps Engineers', 'AI Researchers'],
    ctaText: 'Request Talent Coordinates',
    ctaLink: '/contact?journey=talent',
  },
};

const selectorOptions = [
  { id: 'software', label: 'Build Software', icon: Layers },
  { id: 'ai', label: 'Launch AI', icon: Cpu },
  { id: 'business', label: 'Grow Business', icon: Sparkles },
  { id: 'internship', label: 'Join Internship', icon: GraduationCap },
  { id: 'talent', label: 'Hire Talent', icon: UserCheck },
] as const;

export default function FrontierPage() {
  const [selectedJourney, setSelectedJourney] = useState<JourneyType>('software');
  const journeyContent = journeyData[selectedJourney];

  return (
    <div className="bg-bg-base text-text-primary min-h-screen flex flex-col font-body">
      
      {/* Hero Section */}
      <section className="relative border-b border-border-default pt-20 pb-24 md:pt-28 md:pb-32">
        {/* Editorial Layout Grid Lines */}
        <div className="absolute inset-y-0 left-1/4 w-[1px] bg-border-subtle/30 pointer-events-none hidden lg:block" />
        <div className="absolute inset-y-0 right-1/4 w-[1px] bg-border-subtle/30 pointer-events-none hidden lg:block" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl">
            <span className="font-mono text-xs text-brand-primary tracking-widest uppercase block mb-6">
              // SYSTEMS ENGINEERING FOR ENTERPRISE CAPABILITY
            </span>
            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight text-text-primary mb-8">
              Build Technology That <br className="hidden sm:inline" />
              Moves Business Forward.
            </h1>
            <p className="text-base sm:text-lg text-text-secondary max-w-2xl mb-10 leading-relaxed font-body">
              HawkEdge constructs zero-debt custom software, production-ready AI pipelines, and resilient cloud architectures. Vetted precision engineering, built for organizations that refuse shortcuts.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact" className="focus:outline-none">
                <Button variant="primary" size="lg" className="w-full sm:w-auto h-12 px-8" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Start Your Project
                </Button>
              </Link>
              <Link href="/contact?intent=consultation" className="focus:outline-none">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto h-12 px-8">
                  Book Consultation
                </Button>
              </Link>
              <Link href="/projects" className="focus:outline-none flex items-center justify-center py-3 text-sm font-mono text-text-secondary hover:text-text-primary transition-colors gap-1 sm:ml-4">
                Explore Our Work <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Selector Experience */}
      <section className="border-b border-border-default bg-bg-surface/50 py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* Left Column: Selector Prompt */}
            <div className="flex flex-col gap-6 lg:col-span-1 lg:sticky lg:top-24">
              <span className="font-mono text-xs text-brand-primary tracking-widest uppercase">
                // JOURNEY ROUTING ENGINE
              </span>
              <h2 className="font-heading font-bold text-3xl tracking-tight text-text-primary">
                What brings you <br />
                here today?
              </h2>
              <p className="text-xs text-text-muted leading-relaxed font-body">
                Select your focus coordinate to routing. The systems interface below adapts dynamically to present relevant stack details, KPIs, and pathways.
              </p>

              {/* Selector Buttons */}
              <div className="flex flex-col gap-2 mt-4">
                {selectorOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedJourney === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedJourney(opt.id)}
                      className={`flex items-center gap-3 w-full px-4 py-3 text-left border rounded-sm font-mono text-xs transition-all focus:outline-none focus:ring-1 focus:ring-brand-primary ${
                        isSelected
                          ? 'bg-bg-elevated border-brand-primary text-text-primary shadow-raised'
                          : 'bg-bg-subtle border-border-subtle text-text-muted hover:border-border-default hover:text-text-secondary'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-brand-primary' : 'text-text-muted'}`} />
                      <span>{opt.label}</span>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-brand-primary ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Columns: Dynamic Content Console */}
            <div className="lg:col-span-2 border border-border-default bg-bg-base p-6 sm:p-10 relative">
              <div className="absolute top-0 right-0 p-3 border-l border-b border-border-default font-mono text-[9px] text-text-muted">
                DYN_CONSOLE_OK // ID: {selectedJourney.toUpperCase()}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedJourney}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-8 min-h-[350px] justify-between"
                >
                  <div className="flex flex-col gap-4">
                    <span className="font-mono text-[10px] text-brand-primary tracking-widest">
                      {journeyContent.tagline}
                    </span>
                    <h3 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight leading-snug text-text-primary">
                      {journeyContent.headline}
                    </h3>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-body mt-2">
                      {journeyContent.paragraph}
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4 border-t border-b border-border-subtle py-6">
                    {journeyContent.stats.map((stat, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <span className="font-mono text-[9px] text-text-muted uppercase tracking-wider">
                          {stat.label}
                        </span>
                        <span className="font-heading font-bold text-lg sm:text-xl text-text-primary">
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack & CTA */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mt-4">
                    <div className="flex flex-wrap gap-2">
                      {journeyContent.stack.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-[10px] bg-bg-surface border border-border-subtle px-2 py-0.5 text-text-secondary rounded-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <Link href={journeyContent.ctaLink} className="w-full sm:w-auto">
                      <Button
                        variant="primary"
                        className="w-full sm:w-auto"
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        {journeyContent.ctaText}
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

        </div>
      </section>

      {/* KPI Stats / Trust Grid */}
      <section className="border-b border-border-default py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col border-l border-border-default pl-6 gap-2">
              <span className="font-heading font-extrabold text-3xl tracking-tight text-text-primary">
                100%
              </span>
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
                Vetted Source Code
              </span>
            </div>
            <div className="flex flex-col border-l border-border-default pl-6 gap-2">
              <span className="font-heading font-extrabold text-3xl tracking-tight text-text-primary">
                &lt; 2 Weeks
              </span>
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
                Average Deployment Cycle
              </span>
            </div>
            <div className="flex flex-col border-l border-border-default pl-6 gap-2">
              <span className="font-heading font-extrabold text-3xl tracking-tight text-text-primary">
                Zero
              </span>
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
                Technical Debt Commit
              </span>
            </div>
            <div className="flex flex-col border-l border-border-default pl-6 gap-2">
              <span className="font-heading font-extrabold text-3xl tracking-tight text-text-primary">
                24/7
              </span>
              <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
                Automated SLA Monitoring
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Previews: Services & Projects */}
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Services Section */}
          <div className="mb-20">
            <div className="flex justify-between items-baseline mb-12 border-b border-border-subtle pb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-brand-primary tracking-widest">// 01 //</span>
                <h2 className="font-heading font-bold text-2xl tracking-tight text-text-primary">
                  Engineering Disciplines
                </h2>
              </div>
              <Link href="/services" className="font-mono text-xs text-text-muted hover:text-text-primary transition-colors flex items-center gap-1 focus:outline-none">
                All Disciplines <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="border border-border-default bg-bg-surface/30 p-6 flex flex-col justify-between min-h-[220px]">
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-[10px] text-brand-primary tracking-wider uppercase">01 / APPS</span>
                  <h3 className="font-heading font-bold text-lg text-text-primary">Custom Systems Engineering</h3>
                  <p className="text-xs text-text-secondary leading-relaxed font-body">
                    We build high-availability web applications, NestJS APIs, and scalable monorepos engineered for performance and long-term maintainability.
                  </p>
                </div>
                <Link href="/services?ref=apps" className="font-mono text-[11px] text-text-primary hover:text-brand-primary flex items-center gap-1 mt-6 focus:outline-none">
                  Read blueprint <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="border border-border-default bg-bg-surface/30 p-6 flex flex-col justify-between min-h-[220px]">
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-[10px] text-brand-primary tracking-wider uppercase">02 / MODEL</span>
                  <h3 className="font-heading font-bold text-lg text-text-primary">AI & ML Pipeline Deployment</h3>
                  <p className="text-xs text-text-secondary leading-relaxed font-body">
                    Deploy custom cognitive infrastructure, enterprise RAG search layers, and agentic task runners validated against private databases.
                  </p>
                </div>
                <Link href="/services?ref=ai" className="font-mono text-[11px] text-text-primary hover:text-brand-primary flex items-center gap-1 mt-6 focus:outline-none">
                  Read blueprint <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="border border-border-default bg-bg-surface/30 p-6 flex flex-col justify-between min-h-[220px]">
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-[10px] text-brand-primary tracking-wider uppercase">03 / STACK</span>
                  <h3 className="font-heading font-bold text-lg text-text-primary">Cloud Native Infrastructure</h3>
                  <p className="text-xs text-text-secondary leading-relaxed font-body">
                    Standardize deployment with Terraform, automated GitHub Actions pipelines, Kubernetes orchestration, and active telemetry.
                  </p>
                </div>
                <Link href="/services?ref=devops" className="font-mono text-[11px] text-text-primary hover:text-brand-primary flex items-center gap-1 mt-6 focus:outline-none">
                  Read blueprint <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

            </div>
          </div>

          {/* Projects Section */}
          <div>
            <div className="flex justify-between items-baseline mb-12 border-b border-border-subtle pb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-brand-primary tracking-widest">// 02 //</span>
                <h2 className="font-heading font-bold text-2xl tracking-tight text-text-primary">
                  Engineering Ledger
                </h2>
              </div>
              <Link href="/projects" className="font-mono text-xs text-text-muted hover:text-text-primary transition-colors flex items-center gap-1 focus:outline-none">
                Full Ledger <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="border border-border-default bg-bg-base p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="font-mono text-[10px] text-text-muted">PROJECT ALPHA</span>
                    <span className="font-mono text-[9px] bg-green-950 text-green-400 border border-green-800 px-2 py-0.5 rounded-sm">COMPLETED</span>
                  </div>
                  <h3 className="font-heading font-bold text-xl text-text-primary mb-3">Enterprise Route Logistics Optimizer</h3>
                  <p className="text-xs text-text-secondary leading-relaxed mb-6 font-body">
                    Designed and built a real-time routing engine handling scheduling for 500+ commercial vehicles. Resolved critical database locks under heavy load and cut fuel consumption by 18%.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="font-mono text-[9px] border border-border-subtle px-2 py-0.5 rounded-xs text-text-muted">Next.js</span>
                    <span className="font-mono text-[9px] border border-border-subtle px-2 py-0.5 rounded-xs text-text-muted">NestJS</span>
                    <span className="font-mono text-[9px] border border-border-subtle px-2 py-0.5 rounded-xs text-text-muted">PostgreSQL</span>
                    <span className="font-mono text-[9px] border border-border-subtle px-2 py-0.5 rounded-xs text-text-muted">AWS</span>
                  </div>
                </div>
                <Link href="/case-studies" className="font-mono text-xs text-brand-primary hover:text-text-primary flex items-center gap-1.5 mt-auto focus:outline-none">
                  Read Case Study <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="border border-border-default bg-bg-base p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="font-mono text-[10px] text-text-muted">PROJECT DELTA</span>
                    <span className="font-mono text-[9px] bg-green-950 text-green-400 border border-green-800 px-2 py-0.5 rounded-sm">COMPLETED</span>
                  </div>
                  <h3 className="font-heading font-bold text-xl text-text-primary mb-3">Autonomous AI Clinical Documenter</h3>
                  <p className="text-xs text-text-secondary leading-relaxed mb-6 font-body">
                    Custom speech-to-text models integrated directly with electronic health record platforms. Reduced physician document drafting times by an average of 3 hours per day.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="font-mono text-[9px] border border-border-subtle px-2 py-0.5 rounded-xs text-text-muted">Python</span>
                    <span className="font-mono text-[9px] border border-border-subtle px-2 py-0.5 rounded-xs text-text-muted">PyTorch</span>
                    <span className="font-mono text-[9px] border border-border-subtle px-2 py-0.5 rounded-xs text-text-muted">FastAPI</span>
                    <span className="font-mono text-[9px] border border-border-subtle px-2 py-0.5 rounded-xs text-text-muted">Whisper</span>
                  </div>
                </div>
                <Link href="/case-studies" className="font-mono text-xs text-brand-primary hover:text-text-primary flex items-center gap-1.5 mt-auto focus:outline-none">
                  Read Case Study <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Global Consult CTA */}
      <section className="bg-bg-surface border-t border-b border-border-default py-16 md:py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="font-mono text-xs text-brand-primary tracking-widest uppercase block mb-4">
            // READY TO DEPLOY
          </span>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl tracking-tight text-text-primary mb-6">
            Get an Architectural Roadmap for Your System.
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto mb-8 leading-relaxed font-body">
            Request an engineering audit. We will review your current software stack and deliver a clear technical blueprint. No marketing pitches. Just code and topology.
          </p>
          <Link href="/contact" className="focus:outline-none">
            <Button variant="primary" size="lg" className="px-8 h-12" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Start Consultation Request
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
