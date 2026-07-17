import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@paddle-club/db';

export const dynamic = 'force-dynamic';


export async function GET() {
  try {
    const userId = (await cookies()).get('paddle_club_user_id')?.value;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: { court: true, paymentSplits: true },
      orderBy: { startTime: 'desc' }
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Failed to fetch my bookings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { bookingId } = body;

    const userId = (await cookies()).get('paddle_club_user_id')?.value;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    if (booking.userId !== user.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    // Business Rule: Can't cancel if it's already in the past
    if (new Date() > new Date(booking.startTime)) {
      return NextResponse.json({ error: 'Cannot cancel a booking in the past' }, { status: 400 });
    }

    const updated = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELLED',
        paymentStatus: 'REFUNDED'
      }
    });

    return NextResponse.json({ booking: updated });
  } catch (error) {
    console.error('Failed to cancel booking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
