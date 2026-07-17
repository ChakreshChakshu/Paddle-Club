import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  (await cookies()).delete('paddle_club_user_id');
  return NextResponse.json({ success: true });
}
