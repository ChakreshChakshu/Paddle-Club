import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from '@paddle-club/db';

export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    const userId = cookies().get('paddle_club_user_id')?.value;
    if (!userId) return NextResponse.json({ user: null });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ user: null });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
