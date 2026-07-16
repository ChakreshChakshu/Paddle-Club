import { NextResponse } from 'next/server';
import { PrismaClient } from '@paddle-club/db';

const prisma = new PrismaClient();
const TEST_USER_PHONE = '1234567890';

export async function GET() {
  try {
    const user = await prisma.user.findUnique({ where: { phone: TEST_USER_PHONE } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Failed to fetch my orders:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
