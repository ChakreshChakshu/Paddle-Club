import { NextResponse } from 'next/server';
import { prisma } from '@paddle-club/db';

export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    // Only fetch available menu items
    const menuItems = await prisma.menuItem.findMany({
      where: { available: true },
      orderBy: { category: 'asc' },
    });
    return NextResponse.json({ menuItems });
  } catch (error) {
    console.error('Failed to fetch menu items:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
