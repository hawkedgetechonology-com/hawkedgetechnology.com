import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@hawkedge/database';

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        client: { select: { email: true, profile: true } },
        milestones: { orderBy: { createdAt: 'asc' } },
        invoices: { orderBy: { createdAt: 'desc' } },
        files: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (err) {
    console.error('Error fetching project detail:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { status, repoUrl, envUrl, budget, endDate } = await request.json();

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (repoUrl !== undefined) updateData.repoUrl = repoUrl;
    if (envUrl !== undefined) updateData.envUrl = envUrl;
    if (budget !== undefined) updateData.budget = budget;
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    await prisma.auditLog.create({
      data: {
        action: 'PROJECT_UPDATED',
        details: { projectId: id, ...updateData },
      },
    });

    return NextResponse.json(project);
  } catch (err) {
    console.error('Error updating project:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
