import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@hawkedge/database';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        client: { select: { email: true, profile: true } },
        milestones: { orderBy: { createdAt: 'asc' } },
        invoices: { orderBy: { createdAt: 'desc' } },
        files: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json(projects);
  } catch (err) {
    console.error('Error fetching admin projects:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, clientId, budget, startDate, endDate, techStack, repoUrl, envUrl } = await request.json();
    if (!name || !clientId) {
      return NextResponse.json({ error: 'Name and client ID are required.' }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        clientId,
        budget,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        techStack: Array.isArray(techStack) ? techStack : [],
        repoUrl,
        envUrl,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'PROJECT_CREATED',
        details: { projectId: project.id, name, clientId },
      },
    });

    return NextResponse.json(project);
  } catch (err) {
    console.error('Error creating project:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
