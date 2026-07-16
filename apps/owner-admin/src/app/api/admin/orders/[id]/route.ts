import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@paddle-club/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json();

    if (!status || !['PENDING', 'PREPARING', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be PENDING, PREPARING, COMPLETED, or CANCELLED.' },
        { status: 400 }
      );
    }

    const existing = await prisma.order.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const updated = await prisma.order.update({
      where: { id: params.id },
      data: { status },
      include: {
        user: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[API] Failed to update order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
