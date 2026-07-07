import { Injectable, NotFoundException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { NotificationService } from '@hawkedge/notifications';
import { ProposalStatus } from '@hawkedge/database';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProposalService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  private readonly notification = new NotificationService();

  async onModuleInit() {
    // Seed default proposal templates for different categories
    const templates = [
      {
        title: 'Custom Systems Engineering Template',
        serviceCategory: 'SOFTWARE',
        sections: {
          projectUnderstanding: 'The client requires a high-availability software application, custom NestJS APIs, and scalable monorepos engineered for microsecond performance and long-term maintainability.',
          scopeOfWork: 'Phase 1: relational database schemas and endpoint mapping. Phase 2: backend logic core compile. Phase 3: front-end client portal integrations and telemetry SLA handoff.',
          deliverables: '1. Production monorepo with 100% test coverage. 2. Terraform IaC scripts. 3. Prometheus metric dashboards.',
          techStack: 'Next.js, NestJS, PostgreSQL, Redis, Docker, Terraform',
          timeline: '8 - 16 Weeks standard execution path.',
          teamStructure: '1 Lead Systems Architect, 1 Senior Backend Engineer, 1 Senior Frontend Architect.',
          assumptions: 'All legacy access coordinates and database credentials will be provided by the client team.',
          exclusions: 'Integration of legacy manual spreadsheet parsing is excluded from core sprints.',
          support: '30 days of direct post-launch SLA technical support and hotfix response times.',
          terms: '50% upfront retainer, 50% upon repository control credentials handoff.',
          acceptance: 'Acceptance triggers client invitation, project assembly, and resource workspace provisioning.',
        },
      },
      {
        title: 'AI & ML Pipeline Integration Template',
        serviceCategory: 'AI',
        sections: {
          projectUnderstanding: 'Deploy custom cognitive infrastructure, enterprise RAG search layers, and agentic task runners validated against private databases.',
          scopeOfWork: 'Phase 1: Token budget forecast and data ingestion OCR pipelines. Phase 2: LLM model tuning and pgvector index configurations. Phase 3: Verification loop calibration and accuracy compliance runs.',
          deliverables: '1. Private GPU container models. 2. Vector indexing pipelines. 3. Output guardrail validation script runs.',
          techStack: 'Python, PyTorch, pgvector, HuggingFace, FastAPI, LangChain, Next.js',
          timeline: '10 - 18 Weeks execution path.',
          teamStructure: '1 ML Engineer, 1 Integration Architect, 1 Data Pipeline Analyst.',
          assumptions: 'Models will run inside private cloud instances to guarantee compliance.',
          exclusions: 'Public web token API expenses are excluded from estimated build budgets.',
          support: '45 days of cognitive calibration support.',
          terms: '40% upfront, 30% phase 1, 30% pipeline compilation.',
          acceptance: 'Acceptance triggers client onboarding workflows.',
        },
      },
      {
        title: 'Cloud Native Infrastructure Template',
        serviceCategory: 'DEVOPS',
        sections: {
          projectUnderstanding: 'Standardize systems deployment with modular Terraform configurations, automated CI/CD pipelines, Kubernetes orchestration, and telemetry dashboards.',
          scopeOfWork: 'Phase 1: Server and latency performance audit. Phase 2: IaC scripts compilation. Phase 3: Grafana metric dashboards deployment and Canary rollout checks.',
          deliverables: '1. 100% declarative Terraform configurations. 2. GitHub Actions CI/CD workflows. 3. Active Prometheus alerting integrations.',
          techStack: 'AWS, Terraform, Kubernetes, GitHub Actions, Prometheus, Grafana',
          timeline: '6 - 12 Weeks execution path.',
          teamStructure: '1 Senior Site Reliability Engineer, 1 Systems Architect.',
          assumptions: 'Cloud provider billing limits will be handled directly by the client.',
          exclusions: 'Manual physical server configuration or bare-metal rack assembly is excluded.',
          support: '30 days of SLA site recovery monitoring.',
          terms: '50% retainer, 50% dashboard telemetry handoff.',
          acceptance: 'Acceptance triggers environment provisioning controls.',
        },
      },
    ];

    for (const t of templates) {
      await this.prisma.proposalTemplate.upsert({
        where: { serviceCategory: t.serviceCategory },
        update: { title: t.title, sections: t.sections },
        create: {
          title: t.title,
          serviceCategory: t.serviceCategory,
          sections: t.sections,
        },
      });
    }
  }

  async listTemplates() {
    return this.prisma.proposalTemplate.findMany();
  }

  async createProposal(leadId: string, title: string, serviceCategory: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Lead coordinates not found.');

    const template = await this.prisma.proposalTemplate.findUnique({
      where: { serviceCategory },
    });
    if (!template) throw new BadRequestException(`No template seeded for category: ${serviceCategory}`);

    // Create proposal
    const proposal = await this.prisma.proposal.create({
      data: {
        leadId,
        title,
        status: 'DRAFT',
        currentVersion: 1,
      },
    });

    // Save initial version
    const version = await this.prisma.proposalVersion.create({
      data: {
        proposalId: proposal.id,
        version: 1,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sections: template.sections as any,
      },
    });

    return {
      ...proposal,
      sections: version.sections,
    };
  }

  async getProposal(id: string) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id },
      include: {
        lead: true,
        versions: { orderBy: { version: 'desc' } },
        revisions: { orderBy: { createdAt: 'desc' } },
        quotations: { include: { items: true } },
      },
    });
    if (!proposal) throw new NotFoundException('Proposal not found.');

    const currentVersion = proposal.versions[0];
    return {
      ...proposal,
      sections: currentVersion ? currentVersion.sections : {},
    };
  }

  async listProposals(leadId?: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (leadId) where.leadId = leadId;

    return this.prisma.proposal.findMany({
      where,
      include: {
        lead: true,
        versions: { orderBy: { version: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateProposal(id: string, title: string, sections: any) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id },
      include: { versions: { orderBy: { version: 'desc' } } },
    });
    if (!proposal) throw new NotFoundException('Proposal not found.');

    const newVersionNum = proposal.currentVersion + 1;

    // Create a new ProposalVersion snapshot
    const version = await this.prisma.proposalVersion.create({
      data: {
        proposalId: id,
        version: newVersionNum,
        sections,
      },
    });

    // Update parent proposal pointer
    const updated = await this.prisma.proposal.update({
      where: { id },
      data: {
        title,
        currentVersion: newVersionNum,
      },
    });

    return {
      ...updated,
      sections: version.sections,
    };
  }

  async duplicateProposal(id: string) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id },
      include: { versions: { orderBy: { version: 'desc' }, take: 1 } },
    });
    if (!proposal) throw new NotFoundException('Proposal not found.');

    const currentVersion = proposal.versions[0];

    const duplicated = await this.prisma.proposal.create({
      data: {
        leadId: proposal.leadId,
        title: `${proposal.title} (Duplicate)`,
        status: 'DRAFT',
        currentVersion: 1,
      },
    });

    await this.prisma.proposalVersion.create({
      data: {
        proposalId: duplicated.id,
        version: 1,
        sections: currentVersion ? currentVersion.sections : {},
      },
    });

    return duplicated;
  }

  async updateStatus(id: string, status: ProposalStatus) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id },
      include: { lead: true },
    });
    if (!proposal) throw new NotFoundException('Proposal not found.');

    const updated = await this.prisma.proposal.update({
      where: { id },
      data: { status },
    });

    // System notifications and audit log
    await this.prisma.auditLog.create({
      data: {
        action: 'PROPOSAL_STATUS_UPDATED',
        details: {
          proposalId: id,
          status,
          companyName: proposal.lead.companyName,
        },
      },
    });

    // Automatic acceptance provisioning
    if (status === 'ACCEPTED') {
      await this.provisionClientEnvironment(proposal);
    }

    return updated;
  }

  async requestRevision(id: string, comments: string) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id },
      include: { lead: true },
    });
    if (!proposal) throw new NotFoundException('Proposal not found.');

    // Save revision request log
    const revision = await this.prisma.proposalRevision.create({
      data: {
        proposalId: id,
        comments,
        status: 'PENDING',
      },
    });

    // Set proposal to REJECTED/REVISION state
    await this.prisma.proposal.update({
      where: { id },
      data: { status: 'REJECTED' },
    });

    // Update Lead status & Log activity
    await this.prisma.lead.update({
      where: { id: proposal.leadId },
      data: { status: 'CONTACTED' },
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'PROPOSAL_REVISION_REQUESTED',
        details: {
          proposalId: id,
          comments,
          leadId: proposal.leadId,
        },
      },
    });

    await this.notification.sendNotification(['EMAIL'], {
      recipient: 'admin@hawkedge.tech',
      subject: `Revision Requested for Proposal: ${proposal.title}`,
      body: `Client at ${proposal.lead.companyName} requested a revision. Comments: ${comments}`,
    });

    return revision;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async provisionClientEnvironment(proposal: any) {
    const lead = proposal.lead;

    // 1. Update associated Lead status to CLOSED_WON
    await this.prisma.lead.update({
      where: { id: lead.id },
      data: { status: 'CLOSED_WON' },
    });

    // 2. Client Account Provisioning (check if User exists)
    let user = await this.prisma.user.findUnique({ where: { email: lead.email } });
    const tempPassword = 'WelcomeHawkEdge2026!';
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: lead.email,
          passwordHash,
          status: 'ACTIVE',
          rank: 'CLIENT',
          emailVerified: true,
          profile: {
            create: {
              firstName: lead.fullName.split(' ')[0] || 'Client',
              lastName: lead.fullName.split(' ')[1] || 'Partner',
              companyName: lead.companyName,
            },
          },
        },
      });
    }

    // 3. Project Creation
    const budgetEstimate = lead.rawAnswers?.web_budget || lead.rawAnswers?.ai_budget || '$50,000';
    const project = await this.prisma.project.create({
      data: {
        name: `${lead.companyName} Core System Engineering`,
        description: `relational project environment compiled from Proposal ID: ${proposal.id}`,
        status: 'IN_PROGRESS',
        clientId: user.id,
        budget: budgetEstimate,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 3600 * 1000), // 60 days
      },
    });

    // 4. Client Workspace Milestones Provisioning
    await this.prisma.milestone.createMany({
      data: [
        {
          projectId: project.id,
          title: 'System Architecture Specification',
          description: 'SOW design schema compilation and schema validation sign-offs.',
          status: 'UPCOMING',
          dateLabel: 'Sprint 1',
          owner: 'Systems Architect',
        },
        {
          projectId: project.id,
          title: 'API Gateway & Services Assembly',
          description: 'Core backend compiler integration and mock test suite setup.',
          status: 'UPCOMING',
          dateLabel: 'Sprint 3',
          owner: 'Lead Backend Developer',
        },
        {
          projectId: project.id,
          title: 'Canary Deployment & Telemetry Handover',
          description: 'Grafana alerting panels configurations and production handovers.',
          status: 'UPCOMING',
          dateLabel: 'Sprint 5',
          owner: 'Site Reliability Engineer',
        },
      ],
    });

    // 5. Send automated invitation
    await this.notification.sendNotification(['EMAIL'], {
      recipient: lead.email,
      subject: 'HawkEdge Engineering Workspace Initialized',
      body: `Your project proposal has been accepted! Your secure client workspace is ready.
Credentials:
Portal URL: http://localhost:3000/login
User Email: ${lead.email}
One-time Key: ${tempPassword}
Please change your password upon initial login.`,
    });

    await this.prisma.auditLog.create({
      data: {
        action: 'PROJECT_PROVISIONED',
        details: {
          leadId: lead.id,
          projectId: project.id,
          clientId: user.id,
        },
      },
    });
  }

  async getMetrics() {
    const total = await this.prisma.proposal.count();
    const accepted = await this.prisma.proposal.count({ where: { status: 'ACCEPTED' } });
    const draft = await this.prisma.proposal.count({ where: { status: 'DRAFT' } });
    const sent = await this.prisma.proposal.count({ where: { status: 'SENT' } });

    const quotations = await this.prisma.quotation.findMany();
    const totalForecast = quotations.reduce((acc, q) => acc + q.totalAmount, 0);

    const conversionRate = total > 0 ? (accepted / total) * 100 : 0;

    return {
      total,
      accepted,
      draft,
      sent,
      conversionRate: Math.round(conversionRate * 10) / 10,
      totalForecast,
    };
  }
}
