import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@paddle-club/db';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { phone, name } = await req.json();
    if (!phone) return NextResponse.json({ error: 'Phone is required' }, { status: 400 });

    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          phone,
          name: name || 'New Player',
          role: 'CUSTOMER'
        }
      });
    }

    cookies().set('paddle_club_user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
