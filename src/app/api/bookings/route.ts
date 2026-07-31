import { NextRequest, NextResponse } from 'next/server';
import { getBookings, createBooking, updateBooking, deleteBooking } from '@/actions/bookings';
import { BookingInsert, BookingUpdate } from '@/lib/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date') || undefined;
  const category = searchParams.get('category') || undefined;

  const bookings = await getBookings({ date, category });
  return NextResponse.json({ bookings });
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as BookingInsert;
    
    // Basic validation
    if (!data.name || !data.date || !data.start_time || !data.category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await createBooking(data);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }
    
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
       return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 });
    }

    const data = await request.json() as BookingUpdate;
    const result = await updateBooking(id, data);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');
  
  if (!id) {
     return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 });
  }

  const result = await deleteBooking(id);
  
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  
  return NextResponse.json({ success: true }, { status: 200 });
}
