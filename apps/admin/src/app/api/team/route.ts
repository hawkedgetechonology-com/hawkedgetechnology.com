import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@hawkedge/database';

export async function GET() {
  try {
    const employees = await prisma.user.findMany({
      where: {
        rank: {
          in: ['SUPER_ADMIN', 'ADMIN', 'HR', 'MENTOR', 'TRAINER'],
        },
      },
      include: {
        profile: true,
        userRoles: { include: { role: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    const roles = await prisma.role.findMany({
      include: { rolePermissions: { include: { permission: true } } },
    });

    return NextResponse.json({ employees, roles });
  } catch (err) {
    console.error('Error fetching admin team members:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId, rank, companyName } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    const data: Record<string, unknown> = {};
    if (rank) data.rank = rank;

    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    if (companyName) {
      await prisma.profile.update({
        where: { userId },
        data: { companyName },
      });
    }

    await prisma.auditLog.create({
      data: {
        action: 'TEAM_MEMBER_UPDATED',
        details: { userId, rank },
      },
    });

    return NextResponse.json(user);
  } catch (err) {
    console.error('Error updating team member:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
