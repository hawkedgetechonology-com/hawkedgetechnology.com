export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'select' | 'multi' | 'text';
  options?: QuestionOption[];
  placeholder?: string;
}

export type BuildType = 'WEBSITE' | 'AI_SOLUTION' | 'WEB_APP' | 'DASHBOARD' | 'PARTNERSHIP';

export const QUESTIONS: Record<BuildType, Question[]> = {
  WEBSITE: [
    {
      id: 'web_business_type',
      text: 'What is your primary business type?',
      type: 'select',
      options: [
        { value: 'B2B SaaS', label: 'B2B SaaS' },
        { value: 'Enterprise Service', label: 'Enterprise Service' },
        { value: 'E-commerce / Retail', label: 'E-commerce / Retail' },
        { value: 'Agency / Portfolio', label: 'Agency / Portfolio' },
      ],
    },
    {
      id: 'web_goal',
      text: 'What is the primary target objective of this public website?',
      type: 'select',
      options: [
        { value: 'Lead Generation', label: 'Lead Generation targeting C-Suite Buyers' },
        { value: 'Brand Authority', label: 'Brand Authority & Editorial Presence' },
        { value: 'Self-Service Sales', label: 'Self-Service Product Sales' },
        { value: 'Developer Documentation', label: 'Developer Hub & API Reference docs' },
      ],
    },
    {
      id: 'web_pages',
      text: 'What is the anticipated scope of pages?',
      type: 'select',
      options: [
        { value: '1-10 pages', label: '1 to 10 page layouts' },
        { value: '15-50 pages', label: '15 to 50 dynamic layouts' },
        { value: '50+ pages', label: '50+ pages / Large directory indexing' },
      ],
    },
    {
      id: 'web_features',
      text: 'Select required platform features (select all that apply):',
      type: 'multi',
      options: [
        { value: 'Headless CMS', label: 'Headless CMS Integration' },
        { value: 'Client Portal', label: 'Client / Explorer Login Portal' },
        { value: 'CRM Sync', label: 'Bi-directional CRM Sync Telemetry' },
        { value: 'Multi-language', label: 'Multi-region Internationalization (i18n)' },
      ],
    },
    {
      id: 'web_timeline',
      text: 'What is your expected timeline to go live?',
      type: 'select',
      options: [
        { value: 'Immediate (<2 months)', label: 'Immediate (< 2 months)' },
        { value: 'Standard (2-4 months)', label: 'Standard (2 - 4 months)' },
        { value: 'Flexible', label: 'Flexible / Research-driven' },
      ],
    },
    {
      id: 'web_budget',
      text: 'What is the authorized budget tier for this build?',
      type: 'select',
      options: [
        { value: '$5k - $25k', label: 'Tier 1 ($5,000 - $25,000)' },
        { value: '$25k - $50k', label: 'Tier 2 ($25,000 - $50,000)' },
        { value: '$50k - $100k', label: 'Tier 3 ($50,000 - $100,000)' },
        { value: '$100k+', label: 'Tier 3+ ($100,000+)' },
      ],
    },
  ],
  AI_SOLUTION: [
    {
      id: 'ai_industry',
      text: 'Which domain/sector will this intelligence solution run in?',
      type: 'select',
      options: [
        { value: 'Healthcare', label: 'Healthcare & Biotech (HIPAA constrained)' },
        { value: 'Finance', label: 'Finance, Banking & Audit (SOC2 constrained)' },
        { value: 'Logistics', label: 'Supply Chain, Logistics & Robotics' },
        { value: 'Legal', label: 'Legal Tech & Document Comprehension' },
        { value: 'Other', label: 'General / Technology / Other' },
      ],
    },
    {
      id: 'ai_problem',
      text: 'What is the core problem space targeting machine intelligence?',
      type: 'select',
      options: [
        { value: 'Agentic Task Loops', label: 'Autonomous Agentic Task Loops' },
        { value: 'Document Analysis', label: 'Document/Text Analytics & Semantic Search' },
        { value: 'Data Ingestion', label: 'Predictive Modeling & Anomaly Ingestion' },
        { value: 'Customer Support', label: 'LLM Customer Operations Assist' },
      ],
    },
    {
      id: 'ai_data',
      text: 'What is the state of your training/reference datasets?',
      type: 'select',
      options: [
        { value: 'Unstructured Text', label: 'Unstructured text/PDFs requiring OCR & Vectorization' },
        { value: 'SQL Databases', label: 'Relational database logs requiring text-to-SQL schemas' },
        { value: 'Audio/Video', label: 'Multimodal signals (audio/video streams)' },
        { value: 'Clean Structured Data', label: 'Cleaned, tabular datasets ready for fine-tuning' },
      ],
    },
    {
      id: 'ai_privacy',
      text: 'What are your infrastructure and hosting privacy requirements?',
      type: 'select',
      options: [
        { value: 'Private Cloud VPC', label: 'Secure Private VPC (AWS/GCP)' },
        { value: 'On-Premise', label: 'On-Premise Private Hardware Deployment' },
        { value: 'Public API/SaaS', label: 'Public Cloud SaaS APIs (OpenAI/Anthropic wrappers)' },
      ],
    },
    {
      id: 'ai_timeline',
      text: 'What is your deployment timeline target?',
      type: 'select',
      options: [
        { value: 'Immediate (<2 months)', label: 'Immediate (< 2 months)' },
        { value: 'Standard (2-4 months)', label: 'Standard (2 - 4 months)' },
        { value: 'Flexible', label: 'Flexible / Research-driven' },
      ],
    },
    {
      id: 'ai_budget',
      text: 'What is the budget allocation parameter?',
      type: 'select',
      options: [
        { value: '$5k - $25k', label: 'Tier 1 ($5,000 - $25,000)' },
        { value: '$25k - $50k', label: 'Tier 2 ($25,000 - $50,000)' },
        { value: '$50k - $100k', label: 'Tier 3 ($50,000 - $100,000)' },
        { value: '$100k+', label: 'Tier 3+ ($100,000+)' },
      ],
    },
  ],
  WEB_APP: [
    {
      id: 'app_type',
      text: 'What type of dynamic application are you building?',
      type: 'select',
      options: [
        { value: 'SaaS Platform', label: 'Multi-tenant SaaS Platform Cockpit' },
        { value: 'Internal Tool', label: 'Internal Operations Dashboard / Administrative CRM' },
        { value: 'Marketplace', label: 'Peer-to-Peer Marketplace / Transactional Exchange' },
      ],
    },
    {
      id: 'app_concurrency',
      text: 'What is the expected concurrent connection scale at peak?',
      type: 'select',
      options: [
        { value: '<1k', label: 'Less than 1,000 concurrent active users' },
        { value: '1k-10k', label: '1,000 to 10,000 concurrent active users' },
        { value: '>10k', label: 'More than 10,000 concurrent (requires horizontal clustering)' },
      ],
    },
    {
      id: 'app_goal',
      text: 'What is the core architectural goal?',
      type: 'select',
      options: [
        { value: 'High Availability', label: 'High Availability & Active-Active failover' },
        { value: 'Low Latency', label: 'Real-time Sub-second response rates' },
        { value: 'Offline Support', label: 'Offline-First synchronizing client local storage' },
      ],
    },
    {
      id: 'app_integrations',
      text: 'Select required external integration coordinates (select all that apply):',
      type: 'multi',
      options: [
        { value: 'Payment Gateway', label: 'Stripe Payments & Ledger auditing' },
        { value: 'Third-Party APIs', label: 'External legacy REST/GraphQL connectors' },
        { value: 'Webhooks', label: 'Webhooks / Event broker notification signals' },
      ],
    },
    {
      id: 'app_isolation',
      text: 'What database tenant isolation structure do you require?',
      type: 'select',
      options: [
        { value: 'Row-Level Security', label: 'Shared Database with Postgres Row-Level Security (RLS)' },
        { value: 'Multi-Tenant DB', label: 'Separate Schemas / Multi-Tenant DB routing' },
        { value: 'Single-Tenant DB', label: 'Dedicated isolated database instances' },
      ],
    },
    {
      id: 'app_timeline',
      text: 'What is your target launch timeline?',
      type: 'select',
      options: [
        { value: 'Immediate (<2 months)', label: 'Immediate (< 2 months)' },
        { value: 'Standard (2-4 months)', label: 'Standard (2 - 4 months)' },
        { value: 'Flexible', label: 'Flexible / Research-driven' },
      ],
    },
    {
      id: 'app_budget',
      text: 'What is the authorized development budget?',
      type: 'select',
      options: [
        { value: '$5k - $25k', label: 'Tier 1 ($5,000 - $25,000)' },
        { value: '$25k - $50k', label: 'Tier 2 ($25,000 - $50,000)' },
        { value: '$50k - $100k', label: 'Tier 3 ($50,000 - $100,000)' },
        { value: '$100k+', label: 'Tier 3+ ($100,000+)' },
      ],
    },
  ],
  DASHBOARD: [
    {
      id: 'dash_source',
      text: 'What is the primary telemetry ingestion source?',
      type: 'select',
      options: [
        { value: 'IoT Sensors', label: 'IoT Hardware Sensors & Industrial streams' },
        { value: 'Transaction Logs', label: 'Financial ledger & Transaction audit logs' },
        { value: 'User Analytics', label: 'Clickstream telemetry & Product metrics' },
      ],
    },
    {
      id: 'dash_frequency',
      text: 'What is the data sync telemetry frequency?',
      type: 'select',
      options: [
        { value: 'Real-Time', label: 'Real-time WebSocket connection loops' },
        { value: 'Hourly', label: 'Hourly cron batch processing' },
        { value: 'Daily', label: 'Daily analytics aggregation data syncs' },
      ],
    },
    {
      id: 'dash_audience',
      text: 'Who is the target audience consuming this telemetry?',
      type: 'select',
      options: [
        { value: 'Executives', label: 'Executive Board members (High-level charts)' },
        { value: 'Operations', label: 'Operations/NOC Engineers (Detail tables)' },
        { value: 'Clients', label: 'External Customer telemetry (Embedded iframe dashboards)' },
      ],
    },
    {
      id: 'dash_charts',
      text: 'Select required visualization controls (select all that apply):',
      type: 'multi',
      options: [
        { value: 'Line/Bar', label: 'Standard Line, Bar, and Pie matrices' },
        { value: 'Heatmaps', label: 'Density Grids / Spatial Heatmaps' },
        { value: 'Custom WebGL', label: 'High-density WebGL graphs (>50k points)' },
      ],
    },
    {
      id: 'dash_budget',
      text: 'What is the development budget limit?',
      type: 'select',
      options: [
        { value: '$5k - $25k', label: 'Tier 1 ($5,000 - $25,000)' },
        { value: '$25k - $50k', label: 'Tier 2 ($25,000 - $50,000)' },
        { value: '$50k - $100k', label: 'Tier 3 ($50,000 - $100,000)' },
        { value: '$100k+', label: 'Tier 3+ ($100,000+)' },
      ],
    },
  ],
  PARTNERSHIP: [
    {
      id: 'partner_org',
      text: 'What type of organization do you represent?',
      type: 'select',
      options: [
        { value: 'University', label: 'Academic Institution / University' },
        { value: 'Corporate', label: 'Enterprise / Technology Corporation' },
        { value: 'Accelerator', label: 'Startup Incubator / Venture Accelerator' },
      ],
    },
    {
      id: 'partner_verification',
      text: 'Select preferred cohort candidate verification filter:',
      type: 'select',
      options: [
        { value: 'Coding Test', label: 'Automated Code compilation and tests' },
        { value: 'Portfolio Review', label: 'Manual technical systems review' },
      ],
    },
    {
      id: 'partner_cohort',
      text: 'What is your target start cohort period?',
      type: 'select',
      options: [
        { value: 'Fall', label: 'Fall Ingestion (September)' },
        { value: 'Spring', label: 'Spring Ingestion (February)' },
        { value: 'Summer', label: 'Summer Intensive cohort (June)' },
      ],
    },
    {
      id: 'partner_count',
      text: 'How many candidates do you anticipate sponsoring?',
      type: 'select',
      options: [
        { value: '<5', label: 'Fewer than 5 candidates' },
        { value: '5-20', label: 'Between 5 and 20 candidates' },
        { value: '>20', label: 'Over 20 candidates (dedicated lab setup)' },
      ],
    },
    {
      id: 'partner_sponsorship',
      text: 'What is the sponsorship funding allocation?',
      type: 'select',
      options: [
        { value: 'Full', label: '100% Full Corporate Sponsorship' },
        { value: 'Partial', label: 'Partial Co-funded Cohort' },
        { value: 'None', label: 'No Sponsorship / Direct Student Ingestion' },
      ],
    },
  ],
};

const GENERIC_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'proton.me',
  'protonmail.com',
  'icloud.com',
  'mail.com',
  'aol.com',
  'zoho.com',
];

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function calculateLeadMetrics(answers: Record<string, any>): {
  leadScore: number;
  leadPriority: 'HIGH' | 'MEDIUM' | 'LOW';
} {
  let score = 0;

  // 1. Budget Score (Max 40)
  const budget =
    answers.web_budget ||
    answers.ai_budget ||
    answers.app_budget ||
    answers.dash_budget ||
    answers.partner_sponsorship;
  if (budget === '$100k+' || budget === 'Full' || budget === '$50k - $100k') {
    score += 40;
  } else if (budget === '$25k - $50k' || budget === 'Partial') {
    score += 25;
  } else {
    score += 15;
  }

  // 2. Timeline Score (Max 30)
  const timeline =
    answers.web_timeline ||
    answers.ai_timeline ||
    answers.app_timeline ||
    answers.partner_cohort;
  if (
    timeline === 'Immediate (<2 months)' ||
    timeline === 'Immediate (<1m)' ||
    timeline === 'Immediate (<2m)' ||
    timeline === 'Fall'
  ) {
    score += 30;
  } else if (timeline === 'Standard (2-4 months)' || timeline === 'Spring') {
    score += 20;
  } else {
    score += 5;
  }

  // 3. Complexity Score (Max 20)
  const type = (answers.buildType || '').toUpperCase();
  if (type === 'AI_SOLUTION') {
    score += 20;
  } else if (type === 'WEB_APP') {
    const scale = answers.app_concurrency || '';
    score += scale === '>10k' ? 20 : 15;
  } else if (type === 'DASHBOARD') {
    const freq = answers.dash_frequency || '';
    score += freq === 'Real-Time' ? 15 : 10;
  } else if (type === 'WEBSITE') {
    score += 8;
  } else {
    score += 10; // Partnerships default
  }

  // 4. Domain Coordinates Score (Max 10)
  const email = (answers.email || '').toLowerCase();
  const domain = email.split('@')[1];
  if (domain && !GENERIC_DOMAINS.includes(domain)) {
    score += 10;
  } else {
    score += 5;
  }

  let leadPriority: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
  if (score >= 70) {
    leadPriority = 'HIGH';
  } else if (score >= 40) {
    leadPriority = 'MEDIUM';
  }

  return { leadScore: score, leadPriority };
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function formatCRMEntry(answers: Record<string, any>): Record<string, any> {
  const { leadScore, leadPriority } = calculateLeadMetrics(answers);
  
  // Compute complexity string
  let complexity = 'Medium';
  const type = (answers.buildType || '').toUpperCase();
  if (type === 'AI_SOLUTION') {
    complexity = 'Critical';
  } else if (type === 'WEB_APP' && answers.app_concurrency === '>10k') {
    complexity = 'Critical';
  } else if (type === 'WEBSITE' && answers.web_pages === '50+ pages') {
    complexity = 'High';
  } else if (type === 'WEBSITE') {
    complexity = 'Standard';
  }

  // Compute budget representation
  const budget =
    answers.web_budget ||
    answers.ai_budget ||
    answers.app_budget ||
    answers.dash_budget ||
    answers.partner_sponsorship ||
    'Not Specified';

  // Compute timeline representation
  const timeline =
    answers.web_timeline ||
    answers.ai_timeline ||
    answers.app_timeline ||
    answers.partner_cohort ||
    'Flexible';

  // Generate technical summary goal text
  let goal = `Ingest project details for build type ${type}.`;
  if (type === 'WEBSITE') {
    goal = `Construct a dynamic ${answers.web_business_type || 'B2B'} website optimized for ${answers.web_goal || 'online presence'}.`;
  } else if (type === 'AI_SOLUTION') {
    goal = `Implement a production-ready AI pipeline inside the ${answers.ai_industry || 'enterprise'} sector automating ${answers.ai_problem || 'key analytics'}.`;
  } else if (type === 'WEB_APP') {
    goal = `Build a high-performance ${answers.app_type || 'SaaS'} application targeting ${answers.app_concurrency || 'moderate'} scale, focused on ${answers.app_goal || 'reliability'}.`;
  } else if (type === 'DASHBOARD') {
    goal = `Deploy a data dashboard displaying ${answers.dash_source || 'system'} telemetry synchronizing at ${answers.dash_frequency || 'periodic'} cycles.`;
  } else if (type === 'PARTNERSHIP') {
    goal = `Set up an academic/corporate partnership pipeline for ${answers.partner_org || 'academic'} cohorts, aiming to verify ${answers.partner_count || 'several'} students.`;
  }

  return {
    timestamp: new Date().toISOString(),
    leadName: answers.fullName || 'Anonymous Explorer',
    company: answers.companyName || 'Indie/Private',
    email: answers.email || 'N/A',
    buildType: type,
    leadScore,
    leadPriority,
    briefSummary: {
      complexity,
      timeline,
      budget,
      goal,
    },
    rawAnswers: { ...answers },
  };
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function getRecommendations(answers: Record<string, any>): {
  techStack: string[];
  architecture: string;
  estimatedDuration: string;
  advice: string[];
} {
  const type = (answers.buildType || '').toUpperCase();
  
  if (type === 'WEBSITE') {
    const isLarge = answers.web_pages === '50+ pages';
    const features = answers.web_features || [];
    return {
      techStack: ['Next.js (App Router)', 'React 19', 'Tailwind CSS', 'Framer Motion', 'TypeScript', 'Contentful CMS'],
      architecture: isLarge ? 'Incremental Static Regeneration (ISR) with Edge caching' : 'Static Site Generation (SSG) deployed on Vercel CDN',
      estimatedDuration: isLarge ? '2 - 3 Months' : '4 - 6 Weeks',
      advice: [
        'Leverage Next.js static layouts for sub-second page delivery.',
        'Use headless CMS hooks with webhook revalidation triggers to survive editor updates.',
        'Integrate client portal links using secure secure tokens from Jose.',
        features.includes('CRM Sync') ? 'Stream logs to the database using transactional queues.' : 'Implement caching middleware.',
      ],
    };
  }

  if (type === 'AI_SOLUTION') {
    const isHighPrivacy = answers.ai_privacy === 'On-Premise' || answers.ai_privacy === 'Private Cloud VPC';
    return {
      techStack: ['PyTorch', 'FastAPI', 'pgvector (PostgreSQL)', 'Docker', 'AWS ECS', 'Jose JWT', 'LangChain'],
      architecture: isHighPrivacy ? 'Isolated Private VPC with secure GPU Kubernetes nodes' : 'Hybrid serverless endpoints forwarding vectors to OpenAI VPC',
      estimatedDuration: '4 - 6 Months',
      advice: [
        'Isolate all API endpoints with strict bearer token checks.',
        'Index PDF structures directly into pgvector chunks to enable sub-50ms query operations.',
        'Set up automated backup pipelines for vector configurations.',
        isHighPrivacy ? 'Restrict internet egress paths from host GPU nodes to ensure HIPAA/SOC2 compliance.' : 'Enforce API payload size rules.',
      ],
    };
  }

  if (type === 'WEB_APP') {
    const isScale = answers.app_concurrency === '>10k';
    return {
      techStack: ['NestJS', 'Next.js', 'PostgreSQL', 'Prisma ORM', 'Redis Cache', 'Docker', 'Apache Kafka'],
      architecture: isScale ? 'Distributed microservices with Apache Kafka events brokers' : 'Monolithic Next.js/NestJS server using Redis read-through caching',
      estimatedDuration: isScale ? '5 - 6 Months' : '3 - 4 Months',
      advice: [
        'Utilize Prisma database client connection pools to survive scale adjustments.',
        'Configure Redis sessions memory cache to minimize database hits.',
        'Implement transactional isolation modes on financial payments operations.',
        isScale ? 'Distribute compute processes into autonomous microservice nodes.' : 'Keep logic inside decoupled services layers.',
      ],
    };
  }

  if (type === 'DASHBOARD') {
    const isRealTime = answers.dash_frequency === 'Real-Time';
    return {
      techStack: ['Next.js', 'Tailwind CSS', 'Recharts / Chart.js', 'WebSocket client', 'Redis Streams', 'Node.js'],
      architecture: isRealTime ? 'Real-time WebSockets synchronization via Redis Pub/Sub client connection' : 'Periodic HTTP REST fetch caching with 5-minute CDN stale rules',
      estimatedDuration: '2 - 3 Months',
      advice: [
        'Utilize React state bounds to prevent infinite telemetry re-render issues.',
        'Enforce strict CORS policies restricting dashboard consumption to verified host coordinates.',
        isRealTime ? 'Throttle WebSocket messages on the socket server to prevent clients overflow.' : 'Deploy CDN edge cache tags.',
      ],
    };
  }

  return {
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Prisma DB', 'GitHub Actions'],
    architecture: 'Standard Monorepo workspace with shared UI design tokens packages',
    estimatedDuration: '3 Months',
    advice: [
      'Design shared packages with strict interface parameters.',
      'Enforce automatic validation checks on pnpm commit workflows.',
      'Verify candidate codes compile inside standard isolated Docker containers.',
    ],
  };
}
