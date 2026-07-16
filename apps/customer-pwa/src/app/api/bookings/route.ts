import { NextResponse } from 'next/server';
import { PrismaClient } from '@paddle-club/db';

const prisma = new PrismaClient();

// In V1, we are using a hardcoded test user.
const TEST_USER_PHONE = '1234567890';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courtId = searchParams.get('courtId');
  const dateStr = searchParams.get('date');

  if (!courtId || !dateStr) {
    return NextResponse.json({ error: 'Missing courtId or date' }, { status: 400 });
  }

  try {
    const startOfDay = new Date(`${dateStr}T00:00:00.000Z`);
    const endOfDay = new Date(`${dateStr}T23:59:59.999Z`);

    // Fetch all confirmed or pending bookings for this court on this day
    const bookings = await prisma.booking.findMany({
      where: {
        courtId,
        startTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          not: 'CANCELLED',
        },
      },
      select: {
        startTime: true,
        endTime: true,
      }
    });

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Failed to fetch availability:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courtId, startTime, endTime } = body;

    if (!courtId || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (new Date(startTime) < new Date()) {
      return NextResponse.json({ error: 'Cannot book a time slot in the past' }, { status: 400 });
    }

    // Use hardcoded user for prototype
    let user = await prisma.user.findUnique({ where: { phone: TEST_USER_PHONE } });
    if (!user) {
       return NextResponse.json({ error: 'Test user not found in DB' }, { status: 500 });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // Overlap Detection Logic
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        courtId,
        status: { not: 'CANCELLED' },
        AND: [
          { startTime: { lt: end } },
          { endTime: { gt: start } }
        ]
      }
    });

    if (overlappingBooking) {
      return NextResponse.json({ error: 'This time slot is already booked.' }, { status: 409 });
    }

    // Get court to calculate totalAmount
    const court = await prisma.court.findUnique({ where: { id: courtId } });
    if (!court) {
      return NextResponse.json({ error: 'Court not found' }, { status: 404 });
    }

    const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const totalAmount = court.hourlyRate * durationHours;

    const newBooking = await prisma.booking.create({
      data: {
        courtId,
        userId: user.id,
        startTime: start,
        endTime: end,
        totalAmount,
        status: 'PENDING',
        paymentStatus: 'PENDING'
      }
    });

    return NextResponse.json({ booking: newBooking }, { status: 201 });
  } catch (error) {
    console.error('Failed to create booking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
