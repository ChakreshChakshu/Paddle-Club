import { NextResponse } from 'next/server';
import { prisma } from '@paddle-club/db';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('[API] Failed to fetch orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
