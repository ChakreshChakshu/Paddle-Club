import { NextResponse } from 'next/server';
import { prisma } from '@paddle-club/db';

export async function GET() {
  try {
    const items = await prisma.menuItem.findMany({
      orderBy: { category: 'asc' }
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('[API] Failed to fetch menu items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}
