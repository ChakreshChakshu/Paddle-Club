import { NextResponse } from 'next/server';
import { prisma } from '@paddle-club/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const now = new Date();

    const openGames = await prisma.booking.findMany({
      where: {
        isPublic: true,
        openSlots: { gt: 0 },
        status: { not: 'CANCELLED' },
        startTime: { gt: now }
      },
      include: {
        court: true,
        user: { select: { name: true, id: true } },
        paymentSplits: true
      },
      orderBy: { startTime: 'asc' }
    });

    return NextResponse.json({ games: openGames });
  } catch (error) {
    console.error('Failed to fetch community games:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
