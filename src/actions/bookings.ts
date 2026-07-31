'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { Booking, BookingInsert, BookingUpdate } from '@/lib/types';
import { isSlotBooked, getEndTime } from '@/lib/utils';

export async function getBookings(filters?: { date?: string; category?: string }): Promise<Booking[]> {
  const supabase = await createClient();
  let query = supabase.from('bookings').select('*').order('date', { ascending: true }).order('start_time', { ascending: true });

  if (filters?.date) {
    query = query.eq('date', filters.date);
  }
  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
  return data as Booking[];
}

export async function createBooking(data: BookingInsert): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // 1. Calculate end_time based on 30-min slot duration
    const end_time = getEndTime(data.start_time);
    
    // 2. Fetch existing bookings for that date to check overlap server-side
    const { data: existingBookings, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('date', data.date);

    if (fetchError) {
      return { success: false, error: 'Database error while validating booking.' };
    }

    // 3. Server-side overlap validation
    if (isSlotBooked(data.start_time, existingBookings as Booking[])) {
      return { success: false, error: 'This time slot is already booked.' };
    }

    // 4. Insert into Supabase
    // The PostgreSQL exclusion constraint acts as our final bulletproof layer.
    const { error: insertError } = await supabase.from('bookings').insert([{
      ...data,
      end_time,
    }]);

    if (insertError) {
      console.error('Insert error:', insertError);
      // Supabase error for exclusion constraint violation code is usually '23P01' (exclusion_violation)
      if (insertError.code === '23P01') {
        return { success: false, error: 'This time slot was just booked by someone else!' };
      }
      return { success: false, error: 'Failed to create booking.' };
    }

    revalidatePath('/');
    return { success: true };
  } catch (err) {
    console.error('Unexpected error in createBooking:', err);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function updateBooking(id: string, data: BookingUpdate): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    
    let end_time = data.end_time;
    if (data.start_time) {
       end_time = getEndTime(data.start_time);
    }

    // If date or time changed, we need to validate overlaps
    if (data.date || data.start_time) {
      // First get the original booking to check if date/time actually changed
      const { data: originalBooking } = await supabase.from('bookings').select('*').eq('id', id).single();
      
      const newDate = data.date || originalBooking?.date;
      const newStartTime = data.start_time || originalBooking?.start_time;

      if (newDate && newStartTime) {
         const { data: existingBookings } = await supabase
          .from('bookings')
          .select('*')
          .eq('date', newDate)
          .neq('id', id); // exclude current booking from overlap check

         if (existingBookings && isSlotBooked(newStartTime, existingBookings as Booking[])) {
           return { success: false, error: 'This time slot is already booked.' };
         }
      }
    }

    const updatePayload = { ...data };
    if (end_time) updatePayload.end_time = end_time;

    const { error: updateError } = await supabase
      .from('bookings')
      .update(updatePayload)
      .eq('id', id);

    if (updateError) {
       console.error('Update error:', updateError);
       if (updateError.code === '23P01') {
        return { success: false, error: 'This time slot was just booked by someone else!' };
      }
       return { success: false, error: 'Failed to update booking.' };
    }

    revalidatePath('/');
    return { success: true };
  } catch (err) {
    console.error('Unexpected error in updateBooking:', err);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}

export async function deleteBooking(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    
    if (error) {
      console.error('Delete error:', error);
      return { success: false, error: 'Failed to delete booking.' };
    }

    revalidatePath('/');
    return { success: true };
  } catch (err) {
    console.error('Unexpected error in deleteBooking:', err);
    return { success: false, error: 'An unexpected error occurred.' };
  }
}
