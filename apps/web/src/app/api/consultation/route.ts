import { NextResponse } from 'next/server';
import { formatCRMEntry, calculateLeadMetrics } from '../../../components/discovery/logic';
import { prisma } from '@hawkedge/database';

export async function POST(req: Request) {
  try {
    const answers = await req.json();
    
    // Server validation check
    if (!answers.fullName || !answers.companyName || !answers.email || !answers.buildType) {
      return NextResponse.json({ error: 'Missing client coordinates.' }, { status: 400 });
    }

    const { leadScore, leadPriority } = calculateLeadMetrics(answers);

    // Save lead in postgres database
    const lead = await prisma.lead.create({
      data: {
        fullName: answers.fullName,
        companyName: answers.companyName,
        email: answers.email,
        buildType: (answers.buildType || '').toUpperCase(),
        leadScore,
        leadPriority,
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        rawAnswers: answers as any,
        status: 'NEW',
      },
    });

    // System console logs
    console.log('[CRM INTEGRATION DATABASE TRANSACTION OK]', lead.id);

    return NextResponse.json({ success: true, leadId: lead.id, leadScore, leadPriority });
  } catch (e) {
    console.error('Lead processing transaction lock exception', e);
    return NextResponse.json({ error: 'Internal system transaction failure.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = leads.map(l => {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      const answers = l.rawAnswers as Record<string, any>;
      // Call formatter for brief summaries dynamically
      const crmEntry = formatCRMEntry(answers);
      return {
        id: l.id,
        timestamp: l.createdAt.toISOString(),
        leadName: l.fullName,
        company: l.companyName,
        email: l.email,
        buildType: l.buildType,
        leadScore: l.leadScore,
        leadPriority: l.leadPriority,
        status: l.status,
        assignedTo: l.assignedTo,
        internalNotes: l.internalNotes,
        briefSummary: crmEntry.briefSummary,
        rawAnswers: answers,
      };
    });

    return NextResponse.json({ leads: formatted });
  } catch (e) {
    console.error('Failed to get database leads', e);
    return NextResponse.json({ error: 'Internal system transaction failure.' }, { status: 500 });
  }
}

