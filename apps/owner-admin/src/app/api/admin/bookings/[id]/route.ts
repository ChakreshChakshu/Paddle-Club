import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@paddle-club/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();

    if (!status || !['CONFIRMED', 'CANCELLED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be CONFIRMED or CANCELLED.' },
        { status: 400 }
      );
    }

    const existing = await prisma.booking.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const updated = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status,
        ...(status === 'CANCELLED' ? { paymentStatus: 'REFUNDED' } : {}),
      },
      include: {
        user: true,
        court: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[API] Failed to update booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}
