import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@paddle-club/db';

export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    const userId = cookies().get('paddle_club_user_id')?.value;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
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
