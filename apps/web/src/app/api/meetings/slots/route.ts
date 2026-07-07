import { NextResponse } from 'next/server';
import { prisma } from '@hawkedge/database';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const dateString = searchParams.get('date');

    if (!dateString) {
      return NextResponse.json({ error: 'Date query parameters are required.' }, { status: 400 });
    }

    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) {
      return NextResponse.json({ error: 'Invalid date format query.' }, { status: 400 });
    }

    const year = dateObj.getUTCFullYear();
    const month = dateObj.getUTCMonth();
    const day = dateObj.getUTCDate();

    // 1. Business Days Check: Monday - Friday
    const dayOfWeek = dateObj.getUTCDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return NextResponse.json({ slots: [] });
    }

    // 2. Generate standard business 30-min slots: 09:00 - 17:00 UTC
    const slots: Date[] = [];
    for (let hour = 9; hour < 17; hour++) {
      for (const minute of [0, 30]) {
        slots.push(new Date(Date.UTC(year, month, day, hour, minute)));
      }
    }

    // 3. Fetch booked meetings
    const startOfDay = new Date(Date.UTC(year, month, day, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(year, month, day, 23, 59, 59));

    const booked = await prisma.meeting.findMany({
      where: {
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          not: 'CANCELLED',
        },
      },
    });

    const bookedTimes = booked.map(m => m.scheduledAt.getTime());
    const available = slots
      .filter(s => !bookedTimes.includes(s.getTime()))
      .map(s => s.toISOString());

    return NextResponse.json({ slots: available });
  } catch (e) {
    console.error('Failed to query available slots', e);
    return NextResponse.json({ error: 'Database transaction lock exception' }, { status: 500 });
  }
}
