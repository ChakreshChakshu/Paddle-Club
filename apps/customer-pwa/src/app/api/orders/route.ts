import { NextResponse } from 'next/server';
import { PrismaClient } from '@paddle-club/db';

const prisma = new PrismaClient();
const TEST_USER_PHONE = '1234567890';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cartItems, tableNumber } = body; // cartItems is array of { id, quantity }

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }
    if (!tableNumber) {
      return NextResponse.json({ error: 'Table or Court number is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { phone: TEST_USER_PHONE } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Validate items and recalculate price from DB
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
        items: JSON.stringify(orderItems), // Serialize to JSON
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
