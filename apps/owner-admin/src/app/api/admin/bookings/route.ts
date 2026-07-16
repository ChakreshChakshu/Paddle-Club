import { NextResponse } from 'next/server';
import { prisma } from '@paddle-club/db';

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: true,
        court: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('[API] Failed to fetch bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
