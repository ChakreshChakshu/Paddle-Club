import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { PrismaClient } from '@paddle-club/db';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cartItems, tableNumber } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }
    if (!tableNumber) {
      return NextResponse.json({ error: 'Table or Court number is required' }, { status: 400 });
    }

    const userId = cookies().get('paddle_club_user_id')?.value;
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    let totalAmount = 0;
    const orderItems = [];

    for (const cartItem of cartItems) {
      const menuItem = await prisma.menuItem.findUnique({ where: { id: cartItem.id } });
      if (!menuItem) {
        return NextResponse.json({ error: `Item ${cartItem.id} not found` }, { status: 404 });
      }
      if (!menuItem.available) {
        return NextResponse.json({ error: `${menuItem.name} is no longer available` }, { status: 400 });
      }

      totalAmount += menuItem.price * cartItem.quantity;
      orderItems.push({
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: cartItem.quantity
      });
    }

    const newOrder = await prisma.order.create({
      data: {
        userId: user.id,
        items: JSON.stringify(orderItems),
        totalAmount,
        status: 'PENDING',
        tableNumber
      }
    });

    return NextResponse.json({ order: newOrder }, { status: 201 });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
