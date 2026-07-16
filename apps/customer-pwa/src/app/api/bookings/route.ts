import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@paddle-club/db';

const prisma = new PrismaClient();

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
    const { courtId, startTime, endTime, splitPhones, isPublic, openSlots, requiredSkill } = body;

    if (!courtId || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (new Date(startTime) < new Date()) {
      return NextResponse.json({ error: 'Cannot book a time slot in the past' }, { status: 400 });
    }

    const userId = cookies().get('paddle_club_user_id')?.value;
    if (!userId) {
       return NextResponse.json({ error: 'Unauthorized: Please log in' }, { status: 401 });
    }

    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
       return NextResponse.json({ error: 'User not found in DB' }, { status: 500 });
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
        paymentStatus: 'PENDING',
        isPublic: isPublic || false,
        openSlots: isPublic ? (openSlots || 0) : 0,
        requiredSkill: isPublic ? requiredSkill : null
      }
    });

    const splitArray: string[] = splitPhones && Array.isArray(splitPhones) && splitPhones.length > 0
      ? [user.phone, ...splitPhones.filter(p => p !== user.phone)]
      : [user.phone];

    // For public games, we divide by 4. For private, we divide by the number of friends.
    const splitAmount = isPublic ? (totalAmount / 4) : (totalAmount / splitArray.length);

    await Promise.all(splitArray.map(async (phone) => {
      const splitUser = await prisma.user.findUnique({ where: { phone } });
      return prisma.paymentSplit.create({
        data: {
          bookingId: newBooking.id,
          userId: splitUser?.id || null,
          phone,
          amount: splitAmount,
          status: 'PENDING'
        }
      });
    }));

    return NextResponse.json({ booking: newBooking }, { status: 201 });
  } catch (error) {
    console.error('Failed to create booking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
