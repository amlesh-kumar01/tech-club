import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({ orderBy: { createdAt: 'asc' } });
    return NextResponse.json(bookings);
  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Check for overlap
    const conflict = await prisma.booking.findFirst({
      where: { date: data.date, slot: data.slot, status: 'Approved' }
    });
    
    if (conflict) {
      return NextResponse.json({ error: `Time-slot overlap! Reserved by ${conflict.memberName}. Please select another slot.` }, { status: 409 });
    }

    const booking = await prisma.booking.create({ data });
    return NextResponse.json(booking, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id, status } = await req.json();
    if (!id || !status) return NextResponse.json({ error: 'ID and status required' }, { status: 400 });

    const updated = await prisma.booking.update({
      where: { id },
      data: { status }
    });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
