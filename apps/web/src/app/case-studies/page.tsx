import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Case Studies | HawkEdge Technology',
  description: 'Deep technical audits and post-mortem storytelling covering real enterprise scaling and AI production implementations.',
};

export default function CaseStudiesPage() {
  return (
    <div className="bg-bg-base text-text-primary min-h-screen py-16 md:py-24 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="max-w-3xl border-b border-border-default pb-12 mb-16">
          <span className="font-mono text-xs text-brand-primary tracking-widest uppercase block mb-4">
            // 04 / POST-MORTEM & AUDIT STORIES
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight mb-6">
            Technical Case Studies.
          </h1>
          <p className="text-base text-text-secondary leading-relaxed max-w-2xl font-body">
            Detailed engineering breakdowns of systems architecture, operational challenges, and execution strategies. We publish honest retrospective analysis, including errors hit and lessons learned.
          </p>
        </div>

        {/* Case Studies Ledger */}
        <div className="flex flex-col gap-20">
          
          {/* Case Study 1 */}
          <article className="border border-border-default bg-bg-surface/10 p-6 sm:p-10 flex flex-col gap-8 relative">
            <div className="absolute top-0 right-0 p-3 border-l border-b border-border-default font-mono text-[9px] text-text-muted">
              SYSTEM_ID: CS-001 // SCALE_LOGISTICS
            </div>

            {/* Header info */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs text-brand-primary tracking-widest uppercase">
                // ARCHITECTURE RE-DESIGN // FINTECH & TRANSACTION SCALE
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-text-primary mt-1">
                Re-architecting legacy backend to support 10x concurrent transactions.
              </h2>
              <div className="flex flex-wrap gap-4 text-xs font-mono text-text-muted mt-2">
                <span>CLIENT: Global Asset Brokerage</span>
                <span>|</span>
                <span>METRICS: Response time -78%</span>
                <span>|</span>
                <span>ENGINE: Go, Apache Kafka, Redis</span>
              </div>
            </div>

            {/* Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 border-t border-border-subtle pt-8">
              
              {/* Summary columns */}
              <div className="lg:col-span-2 flex flex-col gap-6 font-mono text-[10px] text-text-muted border-b lg:border-b-0 lg:border-r border-border-subtle pb-6 lg:pb-0 lg:pr-8">
                <div>
                  <span className="text-text-secondary block mb-1">THE BOTTLENECK:</span>
                  <p className="leading-relaxed font-body text-xs text-text-muted">
                    Monolithic relational database locking during high-frequency market order entry intervals, causing cascading connection timeouts.
                  </p>
                </div>
                <div>
                  <span className="text-text-secondary block mb-1">SYSTEM CAPACITY OUTCOME:</span>
                  <p className="leading-relaxed font-body text-xs text-text-muted">
                    Max supported concurrency expanded from 5,000 to 50,000 users. Real-time read operations dropped under 50ms.
                  </p>
                </div>
              </div>

              {/* Story Columns */}
              <div className="lg:col-span-3 flex flex-col gap-6 text-xs text-text-secondary leading-relaxed font-body">
                
                <div>
                  <h3 className="font-heading font-bold text-xs text-text-primary uppercase tracking-wider mb-2">
                    1. CHALLENGE
                  </h3>
                  <p>
                    A leading asset manager with $12B AUM suffered cascading system failure spikes during opening trading hours. Database transactional tables experienced serial row locks due to concurrent read-write logs on a single monolithic PostgreSQL node. This lead to socket pool exhaustion, throwing 504 gateway timeouts back to active traders.
                  </p>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-xs text-text-primary uppercase tracking-wider mb-2">
                    2. SOLUTION
                  </h3>
                  <p>
                    We deconstructed transaction execution into an event-driven microservices topology. Transactions are ingested through high-speed Go API endpoints and dropped immediately into partitioned Apache Kafka queues. Consumers parse queue events asynchronously, updating isolated memory indices in Redis. Database persistence is deferred to a decoupled write-replicator pipeline, fully eliminating direct transactional contention locks.
                  </p>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-xs text-text-primary uppercase tracking-wider mb-2">
                    3. IMPLEMENTATION PATH
                  </h3>
                  <p>
                    We designed a parallel routing gateway to monitor active client traffic. Over a 4-week window, we directed 5% of trading queries to the Kafka stream, comparing outputs with legacy nodes. Upon checking output parity, we progressively scaled the router (10%, 25%, 50%, 100%) and executed final cutover with zero downtime.
                  </p>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-xs text-text-primary uppercase tracking-wider mb-2">
                    4. LESSONS LEARNED
                  </h3>
                  <p className="border-l-2 border-brand-primary pl-4 bg-bg-surface/30 py-2">
                    <strong>Parity synchronization is where risk lives.</strong> During early canary runs, we noticed minor transaction timing offsets between parallel systems due to message queuing delays. We resolved this by implementing deterministic sequence ID markers on client requests, establishing absolute state sorting across all microservice layers.
                  </p>
                </div>

              </div>

            </div>
          </article>

          {/* Case Study 2 */}
          <article className="border border-border-default bg-bg-surface/10 p-6 sm:p-10 flex flex-col gap-8 relative">
            <div className="absolute top-0 right-0 p-3 border-l border-b border-border-default font-mono text-[9px] text-text-muted">
              SYSTEM_ID: CS-002 // RAG_LOGISTICS
            </div>

            {/* Header info */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs text-brand-primary tracking-widest uppercase">
                // INTELLIGENT SYSTEMS // SUPPLY CHAIN LOGISTICS
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-text-primary mt-1">
                Reducing inventory bloat by 22% via custom RAG context forecast engines.
              </h2>
              <div className="flex flex-wrap gap-4 text-xs font-mono text-text-muted mt-2">
                <span>CLIENT: Multimodal Logistics Group</span>
                <span>|</span>
                <span>METRICS: Inaccuracy rate down to 8%</span>
                <span>|</span>
                <span>ENGINE: Python, pgvector, AWS SageMaker</span>
              </div>
            </div>

            {/* Breakdown Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 border-t border-border-subtle pt-8">
              
              {/* Summary columns */}
              <div className="lg:col-span-2 flex flex-col gap-6 font-mono text-[10px] text-text-muted border-b lg:border-b-0 lg:border-r border-border-subtle pb-6 lg:pb-0 lg:pr-8">
                <div>
                  <span className="text-text-secondary block mb-1">THE BOTTLENECK:</span>
                  <p className="leading-relaxed font-body text-xs text-text-muted">
                    Manual weather and routing calculations led to inaccurate product demand forecasts, forcing over-purchasing to buffer warehouse reserves.
                  </p>
                </div>
                <div>
                  <span className="text-text-secondary block mb-1">SYSTEM CAPACITY OUTCOME:</span>
                  <p className="leading-relaxed font-body text-xs text-text-muted">
                    Forecast inaccuracies fell from 34% to 8%. Reduced capital locked up in excess stock storage by $2.3M.
                  </p>
                </div>
              </div>

              {/* Story Columns */}
              <div className="lg:col-span-3 flex flex-col gap-6 text-xs text-text-secondary leading-relaxed font-body">
                
                <div>
                  <h3 className="font-heading font-bold text-xs text-text-primary uppercase tracking-wider mb-2">
                    1. CHALLENGE
                  </h3>
                  <p>
                    A regional shipping operator with 18 distribution points was struggling to manage warehouse storage capacities. Planners relied on manual heuristics to predict inventory needs, resulting in massive over-ordering to avoid stocking outages. Demand models failed to account for complex multi-variable conditions like port delays, customs timing, and regional weather trends.
                  </p>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-xs text-text-primary uppercase tracking-wider mb-2">
                    2. SOLUTION
                  </h3>
                  <p>
                    We designed a local semantic search database coupled with a forecasting model. Legacy order metrics, weather feeds, port queues, and shipping schedules are continuously chunked and embedded using local vector models. When a planner queries for target stock indexes, our RAG backend fetches matching historical weather and transport context coordinates, injecting them directly into the context window of our local model to yield precise, data-driven order forecasts.
                  </p>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-xs text-text-primary uppercase tracking-wider mb-2">
                    3. IMPLEMENTATION PATH
                  </h3>
                  <p>
                    We set up automated ingestion runs using Apache Airflow and AWS SageMaker pipelines. Data sanitization pipelines sanitise raw input files (Excel logs, web scraping API results) to feed them into a PostgreSQL database with pgvector extensions. The system was exposed to dispatch planners as a clean, text-based terminal console.
                  </p>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-xs text-text-primary uppercase tracking-wider mb-2">
                    4. LESSONS LEARNED
                  </h3>
                  <p className="border-l-2 border-brand-primary pl-4 bg-bg-surface/30 py-2">
                    <strong>Sanitizing inputs beats model fine-tuning.</strong> Early tests yielded poor forecasts because input logs contained duplicate tracking records and misaligned timezone stamps. We spent 80% of our effort structuring data sanitization pipelines rather than training models. Clean input ingestion remains the single most important parameter for intelligent system outputs.
                  </p>
                </div>

              </div>

            </div>
          </article>

        </div>

        {/* Audit Verification */}
        <div className="border border-border-default bg-bg-surface p-6 sm:p-8 mt-20 max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-6">
          <ShieldCheck className="w-10 h-10 text-brand-primary flex-shrink-0" />
          <div>
            <span className="font-mono text-[9px] text-text-muted uppercase tracking-wider block mb-1">
              // TELEMETRY & SYSTEM REVIEWS
            </span>
            <p className="text-xs text-text-secondary leading-relaxed font-body">
              All case studies reflect genuine deployment logs and system outputs. The architectures described have been delivered to production. Client names have been anonymized to comply with strict non-disclosure parameters.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
