import { NextResponse } from 'next/server';
import { prisma } from '@hawkedge/database';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const priority = searchParams.get('priority') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = (searchParams.get('order') || 'desc') as 'asc' | 'desc';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { isDeleted: false };

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.leadPriority = priority;
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { [sortBy]: order },
      include: {
        meetings: true,
        quotations: true,
      },
    });

    return NextResponse.json({ leads });
  } catch (e) {
    console.error('Failed to query admin leads', e);
    return NextResponse.json({ error: 'Failed to retrieve database records.' }, { status: 500 });
  }
}
