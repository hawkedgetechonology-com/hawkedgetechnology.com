'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, ChevronUp, Layers, Cpu, Cloud, HelpCircle, Calendar, ShieldAlert } from 'lucide-react';
import { Button } from '@hawkedge/ui';

interface FAQItem {
  q: string;
  a: string;
}

interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

interface ServiceData {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  tagline: string;
  overview: string;
  process: ProcessStep[];
  technologies: string[];
  timeline: string;
  faqs: FAQItem[];
  ctaLink: string;
}

const servicesList: ServiceData[] = [
  {
    id: 'software',
    icon: Layers,
    title: 'Custom Systems Engineering',
    tagline: 'HIGH-PERFORMANCE FULL-STACK SOFTWARE',
    overview: 'We build high-availability web applications, NestJS APIs, and scalable monorepos engineered for performance and long-term maintainability. Our codebases prioritize compile-time type safety and microsecond execution speeds, avoiding the spaghetti patterns of traditional outsourcing.',
    process: [
      { step: '01', title: 'System Audit & Schema Modeling', description: 'We inspect legacy database bottlenecks and design strict relational database schemas before writing logic.' },
      { step: '02', title: 'Interface Definition', description: 'Deliver strict OpenAPI specifications or typed Protocol Buffers to establish hard boundaries between frontend and backend services.' },
      { step: '03', title: 'Sprint Compilation', description: 'Two-week sprint sprints compiling pure TypeScript, maintaining 100% core codebase test coverage.' },
      { step: '04', title: 'Telemetry SLA handoff', description: 'Deploy server health endpoints and release complete repository control credentials to your team.' },
    ],
    technologies: ['Next.js', 'React', 'Node.js', 'NestJS', 'Go', 'PostgreSQL', 'Redis', 'Docker'],
    timeline: '8 - 16 Weeks',
    faqs: [
      { q: 'Do we own the intellectual property?', a: 'Yes. You own 100% of all source repositories, databases, Figma blueprints, and Docker deployment assets from day one.' },
      { q: 'What is your testing strategy?', a: 'We enforce automated test runs. Every pull request triggers unit testing (Jest), integration checks (Supertest), and end-to-end scenarios (Playwright) before merge approval.' },
      { q: 'How do you handle future maintenance?', a: 'All systems are handed over with self-documenting code, configuration scripts, and 30 days of direct support. We also offer ongoing monthly SLA maintenance retainers.' }
    ],
    ctaLink: '/contact?service=software',
  },
  {
    id: 'ai',
    icon: Cpu,
    title: 'AI & ML Pipeline Integration',
    tagline: 'COGNITIVE COMPUTING & NATURAL LANGUAGE ENGINES',
    overview: 'Deploy custom cognitive infrastructure, enterprise RAG search layers, and agentic task runners validated against private databases. We build systems that perform deterministic reasoning, preventing hallucination while keeping computation budgets optimized.',
    process: [
      { step: '01', title: 'Feasibility & Compute Audit', description: 'We compute token overhead costs and choose appropriate model parameters (local vs API).' },
      { step: '02', title: 'Vector Space Engineering', description: 'Setup pgvector or Pinecone clusters and design clean data ingestion pipelines for your document directories.' },
      { step: '03', title: 'Agent & RAG Pipeline Assembly', description: 'Deploy semantic orchestration frameworks and set up contextual search indexes to provide localized model access.' },
      { step: '04', title: 'Guardrail Calibration', description: 'Configure verification loops that parse generated model outputs against original database coordinates to ensure 100% accuracy.' },
    ],
    technologies: ['Python', 'PyTorch', 'FastAPI', 'pgvector', 'HuggingFace', 'LangChain', 'OpenAI'],
    timeline: '10 - 18 Weeks',
    faqs: [
      { q: 'Is our corporate data exposed to public AI models?', a: 'No. We configure models using virtual private networks, private endpoints, or local open-weights pipelines (such as Llama 3) running on private GPU instances.' },
      { q: 'How do you prevent AI hallucinations?', a: 'We implement Retrieval-Augmented Generation (RAG) coupled with semantic validation guardrails (like Guardrails AI). The model is strictly prohibited from answering without local context reference.' },
      { q: 'What is the cost of running these models?', a: 'During the audit stage, we calculate exact token-to-dollar forecasts. We utilize local caching, small semantic models, and routing strategies to minimize API costs.' }
    ],
    ctaLink: '/contact?service=ai',
  },
  {
    id: 'devops',
    icon: Cloud,
    title: 'Cloud Native Infrastructure & DevOps',
    tagline: 'DECLARATIVE IaC & TELEMETRY SYSTEMS',
    overview: 'Standardize your systems deployment with modular Terraform scripts, automated GitHub Actions pipelines, Kubernetes orchestration, and active metrics. We architect systems that scale automatically and recover from service failures without manual intervention.',
    process: [
      { step: '01', title: 'Infrastructure Audit', description: 'We review existing servers to list single points of failure, network latency holes, and idle compute expenses.' },
      { step: '02', title: 'Infrastructure as Code Definition', description: 'We write 100% declarative Terraform configurations, completely eliminating manual server configuration.' },
      { step: '03', title: 'CI/CD Workflow Engineering', description: 'Automate build runs that check lint rules, compile code, build Docker layers, and run rolling canary deployments.' },
      { step: '04', title: 'Active Alerting & Observability', description: 'Deploy Prometheus metrics collecting server KPIs, feeding into custom Grafana alerting dashboards.' },
    ],
    technologies: ['AWS', 'Terraform', 'Docker', 'Kubernetes', 'GitHub Actions', 'Prometheus', 'Grafana'],
    timeline: '6 - 12 Weeks',
    faqs: [
      { q: 'Which cloud providers do you support?', a: 'We specialize in Amazon Web Services (AWS) and Google Cloud Platform (GCP). All modules are structured to be cloud-agnostic where possible.' },
      { q: 'How are sensitive database passwords managed?', a: 'We configure secure vault endpoints (e.g. AWS Secrets Manager or HashiCorp Vault). Secrets are injected dynamically at runtime; they are never stored in git repositories.' },
      { q: 'Do you offer automated rollback parameters?', a: 'Yes. If a container deployment fails health check endpoints or increases latency beyond SLA limits, the pipeline automatically halts and reverts to the last stable run.' }
    ],
    ctaLink: '/contact?service=devops',
  },
];

function ServicesContent() {
  const searchParams = useSearchParams();
  const refParam = searchParams.get('ref');
  
  const [expandedId, setExpandedId] = useState<string | null>('software');
  const [activeFaq, setActiveFaq] = useState<string | null>(null);

  // If redirected with a specific service reference, auto-expand it
  useEffect(() => {
    if (refParam && ['software', 'ai', 'devops'].includes(refParam)) {
      setExpandedId(refParam);
      const element = document.getElementById(`service-${refParam}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [refParam]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    setActiveFaq(null);
  };

  const toggleFaq = (indexStr: string) => {
    setActiveFaq(activeFaq === indexStr ? null : indexStr);
  };

  return (
    <div className="bg-bg-base text-text-primary min-h-screen py-16 md:py-24 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header section */}
        <div className="max-w-3xl border-b border-border-default pb-12 mb-16">
          <span className="font-mono text-xs text-brand-primary tracking-widest uppercase block mb-4">
            // 02 / SERVICE CATALOG
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight mb-6">
            Core Engineering Lines.
          </h1>
          <p className="text-base text-text-secondary leading-relaxed max-w-2xl font-body">
            We provide precise technical solutions across three core pillars. No packages of useless hours. We scope, architect, build, and deploy completed technical solutions.
          </p>
        </div>

        {/* Services Expandable Menu */}
        <div className="flex flex-col gap-6 mb-20">
          {servicesList.map((service) => {
            const Icon = service.icon;
            const isExpanded = expandedId === service.id;
            
            return (
              <div
                key={service.id}
                id={`service-${service.id}`}
                className={`border transition-all duration-300 ${
                  isExpanded ? 'border-brand-primary bg-bg-surface/40' : 'border-border-default bg-bg-surface/10 hover:border-border-strong'
                }`}
              >
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => toggleExpand(service.id)}
                  className="flex items-center justify-between w-full p-6 sm:p-8 text-left focus:outline-none focus:ring-1 focus:ring-brand-primary"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className={`p-3 rounded-sm border ${isExpanded ? 'border-brand-primary bg-bg-elevated' : 'border-border-default bg-bg-subtle'}`}>
                      <Icon className={`w-6 h-6 ${isExpanded ? 'text-brand-primary' : 'text-text-muted'}`} />
                    </div>
                    <div>
                      <span className="font-mono text-[9px] text-brand-primary tracking-widest block mb-1">
                        {service.tagline}
                      </span>
                      <h2 className="font-heading font-bold text-lg sm:text-xl md:text-2xl text-text-primary tracking-tight">
                        {service.title}
                      </h2>
                    </div>
                  </div>
                  <div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-text-muted" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-text-muted" />
                    )}
                  </div>
                </button>

                {/* Accordion Expanded Content */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-8 sm:px-8 sm:pb-12 border-t border-border-subtle pt-6">
                        
                        {/* Section Grid: Overview & Process */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                          
                          {/* Left Column: Overview & Meta */}
                          <div className="lg:col-span-1 flex flex-col justify-between h-full gap-6">
                            <div className="flex flex-col gap-4">
                              <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
                                // SERVICE OVERVIEW
                              </span>
                              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-body">
                                {service.overview}
                              </p>
                            </div>

                            <div className="flex flex-col gap-4 border-t border-border-subtle pt-6">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-mono text-[10px] text-text-muted flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5" /> CYCLE TIMELINE:
                                </span>
                                <span className="font-heading font-bold text-text-primary">
                                  {service.timeline}
                                </span>
                              </div>

                              <div className="flex flex-col gap-2 mt-2">
                                <span className="font-mono text-[10px] text-text-muted">
                                  CORE STACK CODES:
                                </span>
                                <div className="flex flex-wrap gap-1.5">
                                  {service.technologies.map((tech) => (
                                    <span
                                      key={tech}
                                      className="font-mono text-[9px] bg-bg-elevated border border-border-subtle text-text-secondary px-2 py-0.5 rounded-xs"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Column: Steps & FAQs */}
                          <div className="lg:col-span-2 flex flex-col gap-8">
                            
                            {/* Process Steps */}
                            <div className="flex flex-col gap-4">
                              <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider">
                                // STEP-BY-STEP EXECUTION PATH
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {service.process.map((step) => (
                                  <div
                                    key={step.step}
                                    className="border border-border-subtle bg-bg-base/40 p-4 rounded-xs"
                                  >
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="font-mono text-xs text-brand-primary">{step.step}</span>
                                      <h3 className="font-heading font-bold text-xs text-text-primary uppercase tracking-wide">
                                        {step.title}
                                      </h3>
                                    </div>
                                    <p className="text-[11px] text-text-secondary leading-relaxed font-body">
                                      {step.description}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Service FAQs */}
                            <div className="flex flex-col gap-4 border-t border-border-subtle pt-6">
                              <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider flex items-center gap-1.5">
                                <HelpCircle className="w-4 h-4 text-brand-primary" /> DISCIPLINE FAQ
                              </span>
                              <div className="flex flex-col gap-2">
                                {service.faqs.map((faq, idx) => {
                                  const faqKey = `${service.id}-faq-${idx}`;
                                  const isFaqExpanded = activeFaq === faqKey;
                                  return (
                                    <div
                                      key={idx}
                                      className="border border-border-subtle bg-bg-subtle/50 rounded-xs"
                                    >
                                      <button
                                        onClick={() => toggleFaq(faqKey)}
                                        className="flex items-center justify-between w-full p-4 text-left font-heading text-xs font-semibold text-text-primary hover:text-brand-primary transition-colors focus:outline-none"
                                      >
                                        <span>{faq.q}</span>
                                        <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform ${isFaqExpanded ? 'rotate-180' : ''}`} />
                                      </button>
                                      <AnimatePresence initial={false}>
                                        {isFaqExpanded && (
                                          <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.15 }}
                                            className="overflow-hidden"
                                          >
                                            <div className="px-4 pb-4 text-[11px] text-text-secondary leading-relaxed font-body border-t border-border-subtle/50 pt-2">
                                              {faq.a}
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Request Consultation Action */}
                            <div className="border-t border-border-subtle pt-6 flex justify-end">
                              <Link href={service.ctaLink} className="focus:outline-none">
                                <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                                  Request Consultation for {service.title}
                                </Button>
                              </Link>
                            </div>

                          </div>

                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* System Trust Disclaimer */}
        <div className="border border-border-default p-6 bg-bg-surface/20 flex flex-col sm:flex-row items-center gap-4 max-w-4xl mx-auto">
          <ShieldAlert className="w-8 h-8 text-brand-primary flex-shrink-0" />
          <div className="text-center sm:text-left">
            <span className="font-mono text-[9px] text-text-muted uppercase tracking-wider block mb-1">
              // TELEMETRY STANDARDS & COMPLIANCE
            </span>
            <p className="text-[11px] text-text-secondary leading-relaxed font-body">
              All services adhere to strict Service Level Agreements (SLAs). Code changes undergo mandatory static analysis (ESLint), schema check validations, and unit suite runs prior to production pipeline promotions.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="bg-bg-base text-text-muted min-h-screen flex items-center justify-center font-mono text-xs">Loading services catalog...</div>}>
      <ServicesContent />
    </Suspense>
  );
}
