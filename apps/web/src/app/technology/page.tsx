import React from 'react';
import { Terminal, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Technology Stack | HawkEdge Technology',
  description: 'Explore the full technical ledger of our frontend, backend, cloud, DevOps, AI, and analytics stacks.',
};

const techCategories = [
  {
    category: 'Frontend Architecture',
    tag: 'UI_REACTION_ENGINE',
    description: 'We construct high-speed, accessible interfaces mapped to strict typography and layout grids, prioritizing Server-Side Rendering (SSR) to keep JavaScript payloads small.',
    stack: [
      { name: 'Next.js (App Router)', usage: 'Server-side rendering, routing boundaries, and optimization.' },
      { name: 'TypeScript', usage: 'Compile-time schema checking and type safety across pages.' },
      { name: 'Tailwind CSS', usage: 'Utility styling using standardized design tokens.' },
      { name: 'Framer Motion', usage: 'Micro-interactions and state transition animations.' },
    ],
  },
  {
    category: 'Backend & Systems',
    tag: 'LOGIC_PERSISTENCE',
    description: 'We prioritize structured application architecture, concurrency throughput, and strict request-response data schema verification.',
    stack: [
      { name: 'NestJS / Node.js', usage: 'Structured enterprise APIs and dependency management.' },
      { name: 'Go (Golang)', usage: 'High-throughput concurrency brokers and microservices.' },
      { name: 'PostgreSQL', usage: 'Primary relational database utilizing strict schema keys.' },
      { name: 'Redis', usage: 'In-memory caching and real-time session tracking.' },
    ],
  },
  {
    category: 'Cloud & DevOps',
    tag: 'IAC_TELEMETRY',
    description: 'We eliminate manual server clicks by defining networks in code, automating pipelines, and placing active alerts on telemetry logs.',
    stack: [
      { name: 'AWS Cloud', usage: 'Hosting ECS, RDS, S3, and serverless compute.' },
      { name: 'Terraform', usage: 'Declarative Infrastructure as Code (IaC) configuration.' },
      { name: 'Docker / Kubernetes', usage: 'Container isolation and orchestration workloads.' },
      { name: 'GitHub Actions', usage: 'CI/CD pipeline triggers verifying tests on every commit.' },
    ],
  },
  {
    category: 'Artificial Intelligence',
    tag: 'NEURAL_PIPELINES',
    description: 'We implement local embedding engines and RAG validation layers that execute with low latency and maintain absolute data sovereignty.',
    stack: [
      { name: 'Python / PyTorch', usage: 'Model fine-tuning, training runs, and numerical calculations.' },
      { name: 'FastAPI', usage: 'High-speed model inference serving endpoints.' },
      { name: 'pgvector / Pinecone', usage: 'Semantic index lookup and context search.' },
      { name: 'LangChain / Langfuse', usage: 'Agentic workflows and LLM telemetry tracking.' },
    ],
  },
  {
    category: 'Telemetry & Analytics',
    tag: 'METRICS_QUEUEING',
    description: 'We process high-volume events using distributed queues, forwarding log metrics to unified visual telemetry dashboards.',
    stack: [
      { name: 'Apache Kafka', usage: 'High-throughput event queueing and stream processing.' },
      { name: 'Prometheus', usage: 'Active database tracking and system health telemetry.' },
      { name: 'Grafana', usage: 'Visual metrics logging and emergency paging triggers.' },
      { name: 'Mixpanel / Plausible', usage: 'Privacy-compliant product analytics tracking.' },
    ],
  },
];

export default function TechnologyPage() {
  return (
    <div className="bg-bg-base text-text-primary min-h-screen py-16 md:py-24 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="max-w-3xl border-b border-border-default pb-12 mb-16">
          <span className="font-mono text-xs text-brand-primary tracking-widest uppercase block mb-4">
            // 06 / TECHNOLOGICAL BLUEPRINTS
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight mb-6">
            Technology Stack Ledger.
          </h1>
          <p className="text-base text-text-secondary leading-relaxed max-w-2xl font-body">
            We standardize on specific tools to keep system complexity down and maintain speed. Every stack coordinate has been verified in production environments.
          </p>
        </div>

        {/* Tech Stack Listing */}
        <div className="flex flex-col gap-12 mb-20">
          {techCategories.map((cat, i) => (
            <div
              key={i}
              className="border border-border-default bg-bg-surface/10 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Category Info */}
              <div className="lg:col-span-1 flex flex-col gap-3">
                <span className="font-mono text-[9px] text-brand-primary tracking-widest uppercase">
                  // {cat.tag}
                </span>
                <h2 className="font-heading font-bold text-xl text-text-primary">
                  {cat.category}
                </h2>
                <p className="text-xs text-text-muted leading-relaxed font-body mt-2">
                  {cat.description}
                </p>
              </div>

              {/* Stack Details */}
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {cat.stack.map((item, idx) => (
                  <div
                    key={idx}
                    className="border border-border-subtle bg-bg-base/40 p-5 rounded-xs flex items-start gap-3.5"
                  >
                    <CheckCircle2 className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-heading font-bold text-xs text-text-primary uppercase tracking-wide">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-text-secondary leading-relaxed font-body mt-1">
                        {item.usage}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Console Verification */}
        <div className="border border-border-default p-6 bg-bg-surface/20 flex items-center gap-4 max-w-4xl mx-auto font-mono text-[10px] text-text-muted">
          <Terminal className="w-6 h-6 text-brand-primary flex-shrink-0" />
          <div className="flex flex-col gap-0.5">
            <span>HAWKEDGE_SYSTEM_INIT // CONFIG MATCH: STABLE</span>
            <span>VERIFIED ON ENGINE: NEXT_JS 15.5 // NODE 20.x // PGSQL 16</span>
          </div>
        </div>

      </div>
    </div>
  );
}
