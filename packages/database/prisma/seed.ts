import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('// STARTING SYSTEM DATABASE SEED...');

  // 1. Create Roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN_ROLE' },
    update: {},
    create: {
      name: 'SUPER_ADMIN_ROLE',
      description: 'Full administrative access coordinates.',
    },
  });

  const clientRole = await prisma.role.upsert({
    where: { name: 'CLIENT_ROLE' },
    update: {},
    create: {
      name: 'CLIENT_ROLE',
      description: 'Access to personal client workspace.',
    },
  });

  // 2. Create Users
  const passwordHash = '$2b$10$rHpnQGKTsLUxxtYz6PyNE.bvA7LMk7HNgnhv3dpqFGRZiXjdlNQZC';

  // Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@hawkedge.tech' },
    update: {},
    create: {
      email: 'admin@hawkedge.tech',
      passwordHash,
      status: 'ACTIVE',
      rank: 'SUPER_ADMIN',
      emailVerified: true,
      profile: {
        create: {
          firstName: 'System',
          lastName: 'Architect',
          phone: '+919999999999',
          preferences: { timezone: 'IST' },
        },
      },
      userRoles: {
        create: {
          roleId: adminRole.id,
        },
      },
    },
  });

  // Client User
  const clientUser = await prisma.user.upsert({
    where: { email: 'client@logixflow.com' },
    update: {},
    create: {
      email: 'client@logixflow.com',
      passwordHash,
      status: 'ACTIVE',
      rank: 'CLIENT',
      emailVerified: true,
      profile: {
        create: {
          firstName: 'Sarah',
          lastName: 'Jenkins',
          phone: '+14155552671',
          companyName: 'LogixFlow Global',
          companyWebsite: 'https://logixflow.com',
          preferences: { timezone: 'EST' },
        },
      },
      userRoles: {
        create: {
          roleId: clientRole.id,
        },
      },
    },
  });

  // 3. Create Leads
  const lead1 = await prisma.lead.create({
    data: {
      fullName: 'Sarah Jenkins',
      companyName: 'LogixFlow Global',
      email: 'client@logixflow.com',
      buildType: 'WEBSITE',
      leadScore: 78,
      leadPriority: 'HIGH',
      status: 'CLOSED_WON',
      rawAnswers: {
        buildType: 'website',
        web_business_type: 'B2B SaaS',
        web_goal: 'Lead Generation',
        web_audience: 'C-Suite Buyers',
        web_pages: '15-50 pages',
        web_features: ['Headless CMS', 'Client Portal', 'CRM Sync'],
        web_timeline: 'Standard (2-4 months)',
        web_budget: '$25k - $50k',
        fullName: 'Sarah Jenkins',
        companyName: 'LogixFlow Global',
        email: 'client@logixflow.com',
      },
    },
  });

  const lead2 = await prisma.lead.create({
    data: {
      fullName: 'David Chen',
      companyName: 'NeuralDoc Systems',
      email: 'dchen@neuraldoc.ai',
      buildType: 'AI_SOLUTION',
      leadScore: 92,
      leadPriority: 'HIGH',
      status: 'PROPOSAL_SENT',
      rawAnswers: {
        buildType: 'ai_solution',
        ai_industry: 'Healthcare',
        ai_problem: 'Agentic Task Loops',
        ai_data: 'Unstructured Text',
        ai_privacy: 'Private Cloud VPC',
        ai_timeline: 'Comprehensive (4-6 months)',
        ai_budget: '$100k - $250k',
        fullName: 'David Chen',
        companyName: 'NeuralDoc Systems',
        email: 'dchen@neuraldoc.ai',
      },
    },
  });

  // 4. Create Project for Client
  const project = await prisma.project.create({
    data: {
      name: 'LogixFlow Enterprise Platform',
      description: 'Refactoring of public-facing web systems and integration of client analytics dashboards.',
      status: 'IN_PROGRESS',
      clientId: clientUser.id,
      budget: '$25k - $50k',
      startDate: new Date(),
      endDate: new Date(Date.now() + 90 * 24 * 3600 * 1000), // 90 days out
      milestones: {
        createMany: {
          data: [
            {
              title: 'System Specification & Scope Definition',
              description: 'Completed discovery session and detailed architecture mapping.',
              status: 'COMPLETED',
              dateLabel: 'Sprint 1',
              owner: 'System Architect',
            },
            {
              title: 'Database Schema & API Gateway Architecture',
              description: 'Creation of PostgreSQL data models and authentication controls.',
              status: 'IN_PROGRESS',
              dateLabel: 'Sprint 2',
              owner: 'Lead Backend Engineer',
            },
            {
              title: 'Client Portal & Mission Control Ingestion',
              description: 'Frontend workspace rendering and telemetry metrics dashboard setup.',
              status: 'UPCOMING',
              dateLabel: 'Sprint 3',
              owner: 'Senior Frontend Architect',
            },
          ],
        },
      },
      invoices: {
        createMany: {
          data: [
            {
              invoiceNumber: 'INV-2026-001',
              amount: 10000.0,
              dueDate: new Date(Date.now() - 5 * 24 * 3600 * 1000), // 5 days ago
              status: 'PAID',
            },
            {
              invoiceNumber: 'INV-2026-002',
              amount: 15000.0,
              dueDate: new Date(Date.now() + 25 * 24 * 3600 * 1000), // 25 days from now
              status: 'UNPAID',
            },
          ],
        },
      },
    },
  });

  // 5. Create Quotation for Lead
  await prisma.quotation.create({
    data: {
      quotationNumber: 'Q-2026-001',
      leadId: lead2.id,
      totalAmount: 125000.0,
      validUntil: new Date(Date.now() + 30 * 24 * 3600 * 1000),
      paymentTerms: '50% upfront, 50% upon deployment',
      status: 'SENT',
      items: {
        create: [
          { description: 'Data Ingestion & OCR pipeline config', quantity: 1, rate: 35000.0, amount: 35000.0 },
          { description: 'LLM Agentic loop model fine-tuning', quantity: 1, rate: 55000.0, amount: 55000.0 },
          { description: 'VPC deployment & SOC2 validation', quantity: 1, rate: 35000.0, amount: 35000.0 },
        ]
      }
    },
  });

  // 6. Create Meeting
  await prisma.meeting.create({
    data: {
      leadId: lead2.id,
      title: 'Architecture & Security Ingestion Review',
      scheduledAt: new Date(Date.now() + 2 * 24 * 3600 * 1000), // 2 days from now
      durationMinutes: 45,
      status: 'SCHEDULED',
      meetingLink: 'https://meet.hawkedge.tech/neuraldoc-review',
    },
  });

  // 7. Create Support Request
  await prisma.supportRequest.create({
    data: {
      userId: clientUser.id,
      subject: 'Prisma Client Ingestion Failure',
      message: 'Client portal is throwing connection errors when fetching the timeline logs.',
      status: 'OPEN',
      priority: 'HIGH',
      category: 'TECHNICAL',
    },
  });

  // 8. Create Project Files
  await prisma.projectFile.createMany({
    data: [
      {
        projectId: project.id,
        fileName: 'Master_Service_Agreement_v1.pdf',
        fileUrl: 'https://cdn.hawkedge.tech/storage/assets/msa_v1.pdf',
        fileSize: 450120,
        mimeType: 'application/pdf',
        category: 'CONTRACTS',
        version: 1,
        uploadedBy: 'admin@hawkedge.tech',
      },
      {
        projectId: project.id,
        fileName: 'Architecture_Blueprint_Diagram.png',
        fileUrl: 'https://cdn.hawkedge.tech/storage/assets/blueprint.png',
        fileSize: 1205300,
        mimeType: 'image/png',
        category: 'DESIGNS',
        version: 1,
        uploadedBy: 'admin@hawkedge.tech',
      },
      {
        projectId: project.id,
        fileName: 'Systems_Discovery_Notes.docx',
        fileUrl: 'https://cdn.hawkedge.tech/storage/assets/discovery_notes.docx',
        fileSize: 85200,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        category: 'DOCUMENTS',
        version: 1,
        uploadedBy: 'admin@hawkedge.tech',
      },
      {
        projectId: project.id,
        fileName: 'Database_Schema_Validation_Signed.pdf',
        fileUrl: 'https://cdn.hawkedge.tech/storage/assets/validation_signed.pdf',
        fileSize: 220150,
        mimeType: 'application/pdf',
        category: 'DELIVERABLES',
        version: 2,
        uploadedBy: 'admin@hawkedge.tech',
      },
    ]
  });

  // 9. Create Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: clientUser.id,
        type: 'PROJECT_UPDATE',
        title: 'Project Environment Initialized',
        message: 'Your LogixFlow Enterprise Platform development workspace is ready for ingestion.',
        isRead: false,
      },
      {
        userId: clientUser.id,
        type: 'INVOICE_UPDATE',
        title: 'Invoice Issued: INV-2026-001',
        message: 'SLA milestone kickoff invoice has been generated for amount $10,000.00.',
        isRead: true,
      },
      {
        userId: clientUser.id,
        type: 'SUPPORT_REPLY',
        title: 'Response to ticket Prisma Client Ingestion Failure',
        message: 'A systems analyst has responded to your technical desk query.',
        isRead: false,
      },
    ]
  });

  console.log('// DATABASE SEED COMPLETED SUCCESSFULLY.');
}

main()
  .catch((e) => {
    console.error('// DATABASE SEED ERROR:', e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
