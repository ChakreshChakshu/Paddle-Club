import { NextResponse } from 'next/server';
import { prisma } from '@paddle-club/db';


export async function POST(request: Request) {
  try {
    const { splitId } = await request.json();

    if (!splitId) {
      return NextResponse.json({ error: 'Missing splitId' }, { status: 400 });
    }

    // 1. Mark the specific split as PAID
    const updatedSplit = await prisma.paymentSplit.update({
      where: { id: splitId },
      data: {
        status: 'PAID',
        paymentId: `MOCK_TXN_${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      }
    });

    // 2. Check if all splits for this booking are PAID
    const allSplits = await prisma.paymentSplit.findMany({
      where: { bookingId: updatedSplit.bookingId }
    });

    const allPaid = allSplits.every(split => split.status === 'PAID');

    // 3. If everyone paid, confirm the booking
    if (allPaid) {
      await prisma.booking.update({
        where: { id: updatedSplit.bookingId },
        data: {
          status: 'CONFIRMED',
          paymentStatus: 'PAID'
        }
      });
    } else {
      // If not everyone paid, mark the booking payment status as PARTIAL
      await prisma.booking.update({
        where: { id: updatedSplit.bookingId },
        data: {
          paymentStatus: 'PARTIAL'
        }
      });
    }

    return NextResponse.json({ success: true, allPaid }, { status: 200 });
  } catch (error) {
    console.error('Failed to process mock webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
