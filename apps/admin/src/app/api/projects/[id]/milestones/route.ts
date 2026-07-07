import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@hawkedge/database';

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id: projectId } = await context.params;
    const { title, description, status, dateLabel, owner, completion } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required.' }, { status: 400 });
    }

    const milestone = await prisma.milestone.create({
      data: {
        projectId,
        title,
        description,
        status: status || 'UPCOMING',
        dateLabel,
        owner,
        completion: completion !== undefined ? Number(completion) : 0,
      },
    });

    // Notify client of project update
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (project) {
      await prisma.notification.create({
        data: {
          userId: project.clientId,
          type: 'PROJECT_UPDATE',
          title: `New Milestone Added: ${title}`,
          message: `Milestone "${title}" has been scheduled under target date: ${dateLabel || 'TBD'}.`,
        },
      });
    }

    return NextResponse.json(milestone);
  } catch (err) {
    console.error('Error creating project milestone:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { milestoneId, status, completion, title, dateLabel, owner } = await request.json();
    if (!milestoneId) {
      return NextResponse.json({ error: 'Milestone ID is required.' }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (completion !== undefined) updateData.completion = Number(completion);
    if (title) updateData.title = title;
    if (dateLabel !== undefined) updateData.dateLabel = dateLabel;
    if (owner !== undefined) updateData.owner = owner;

    const milestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: updateData,
    });

    return NextResponse.json(milestone);
  } catch (err) {
    console.error('Error updating project milestone:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
