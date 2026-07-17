import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@paddle-club/db';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 });
    }

    const userId = cookies().get('paddle_club_user_id')?.value;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: Please log in' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Wrap in a transaction to prevent race conditions on openSlots
    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id: bookingId },
        include: { paymentSplits: true }
      });

      if (!booking || !booking.isPublic) {
        throw new Error('Game not found or not public');
      }

      if (booking.openSlots <= 0) {
        throw new Error('No open slots left in this game');
      }

      // Check if user is already in this game
      if (booking.paymentSplits.some(s => s.phone === user.phone)) {
        throw new Error('You have already joined this game');
      }

      const joinAmount = booking.totalAmount / 4;

      const newSplit = await tx.paymentSplit.create({
        data: {
          bookingId: booking.id,
          userId: user.id,
          phone: user.phone,
          amount: joinAmount,
          status: 'PENDING'
        }
      });

      const updatedBooking = await tx.booking.update({
        where: { id: booking.id },
        data: {
          openSlots: booking.openSlots - 1
        }
      });

      return { newSplit, updatedBooking };
    });

    return NextResponse.json({ success: true, split: result.newSplit }, { status: 200 });
  } catch (error: any) {
    console.error('Failed to join game:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 400 });
  }
}
