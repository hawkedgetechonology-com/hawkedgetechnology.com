import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@hawkedge/database';
import { createHash, randomBytes } from 'crypto';

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { status } = await request.json();
    if (!status) return NextResponse.json({ error: 'Status is required.' }, { status: 400 });

    const proposal = await prisma.proposal.update({
      where: { id },
      data: { status },
      include: { lead: true },
    });

    // ── Automated Acceptance Workflow ──────────────────────────────────────────
    // Lead → Proposal Accepted → Lead Status = Closed Won → Client Account
    // Invitation → Project Creation → Client Workspace Provisioning
    if (status === 'ACCEPTED') {
      const lead = proposal.lead;

      // 1. Lead → CLOSED_WON
      await prisma.lead.update({
        where: { id: lead.id },
        data: { status: 'CLOSED_WON' },
      });

      // 2. Client Account Provisioning (create User if not exists)
      let user = await prisma.user.findUnique({ where: { email: lead.email } });
      const tempPassword = `HE-${randomBytes(8).toString('hex')}`;
      // Use SHA-256 hash as initial password hash (user must reset on first login)
      const passwordHash = createHash('sha256').update(tempPassword).digest('hex');

      if (!user) {
        user = await prisma.user.create({
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
      const rawAnswers = lead.rawAnswers as Record<string, string> | null;
      const budgetEstimate =
        rawAnswers?.web_budget || rawAnswers?.ai_budget || '$50,000';

      const project = await prisma.project.create({
        data: {
          name: `${lead.companyName} Core System Engineering`,
          description: `Project environment provisioned from Proposal ID: ${proposal.id}`,
          status: 'IN_PROGRESS',
          clientId: user.id,
          budget: budgetEstimate,
          startDate: new Date(),
          endDate: new Date(Date.now() + 60 * 24 * 3600 * 1000), // 60 days
        },
      });

      // 4. Client Workspace Milestones Provisioning
      await prisma.milestone.createMany({
        data: [
          {
            projectId: project.id,
            title: 'System Architecture Specification',
            description:
              'SOW design schema compilation and schema validation sign-offs.',
            status: 'UPCOMING',
            dateLabel: 'Sprint 1',
            owner: 'Systems Architect',
          },
          {
            projectId: project.id,
            title: 'API Gateway & Services Assembly',
            description:
              'Core backend integration and mock test suite setup.',
            status: 'UPCOMING',
            dateLabel: 'Sprint 3',
            owner: 'Lead Backend Developer',
          },
          {
            projectId: project.id,
            title: 'Canary Deployment & Telemetry Handover',
            description:
              'Grafana alerting panels configurations and production handovers.',
            status: 'UPCOMING',
            dateLabel: 'Sprint 5',
            owner: 'Site Reliability Engineer',
          },
        ],
      });

      // 5. Audit logging for project provisioning
      await prisma.auditLog.create({
        data: {
          action: 'PROJECT_PROVISIONED',
          details: {
            leadId: lead.id,
            projectId: project.id,
            clientId: user.id,
            proposalId: id,
          },
        },
      });
    }

    // General audit log for all status changes
    await prisma.auditLog.create({
      data: {
        action: `PROPOSAL_STATUS_${status}`,
        details: { proposalId: id, status, leadId: proposal.leadId },
      },
    });

    return NextResponse.json(proposal);
  } catch (err) {
    console.error('Proposal status update error:', err);
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 },
    );
  }
}
