import { NextResponse } from 'next/server';
import { prisma } from '@paddle-club/db';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone || phone.length !== 10) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { phone }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.role !== 'OWNER' && user.role !== 'ADMIN' && user.role !== 'CHEF') {
      return NextResponse.json({ error: 'Unauthorized role' }, { status: 403 });
    }

    // Set a simple mock cookie to persist the role on the client if needed (though client state is enough for now)
    cookies().set('admin-auth', user.id, { path: '/' });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('[AUTH] Login Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
