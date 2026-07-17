import { NextResponse } from 'next/server';
import { prisma } from '@paddle-club/db';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { available } = await req.json();
    const { id } = await params;

    const updated = await prisma.menuItem.update({
      where: { id },
      data: { available },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[API] Failed to update menu item:', error);
    return NextResponse.json(
      { error: 'Failed to update menu item' },
      { status: 500 }
    );
  }
}
