import { NextResponse } from 'next/server';
import { PrismaClient } from '@paddle-club/db';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const courts = await prisma.court.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ courts });
  } catch (error) {
    console.error('Failed to fetch courts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
