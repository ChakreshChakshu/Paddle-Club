import { NextResponse } from 'next/server';
import { prisma } from '@paddle-club/db';

export async function GET() {
  try {
    const [
      totalBookings,
      courtRevenueResult,
      totalOrders,
      cafeRevenueResult,
    ] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.aggregate({ _sum: { totalAmount: true } }),
      prisma.order.count(),
      prisma.order.aggregate({ _sum: { totalAmount: true } }),
    ]);

    return NextResponse.json({
      totalBookings,
      courtRevenue: courtRevenueResult._sum.totalAmount ?? 0,
      totalOrders,
      cafeRevenue: cafeRevenueResult._sum.totalAmount ?? 0,
    });
  } catch (error) {
    console.error('[API] Failed to fetch stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
