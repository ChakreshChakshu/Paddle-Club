import { NextResponse } from 'next/server';
import { prisma } from '@paddle-club/db';

export async function GET() {
  try {
    const members = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      }
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error('Members fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}
