import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Booking } from './types';
import { SLOT_DURATION_MINUTES } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatTime(timeString: string): string {
  // Expected input: HH:MM:SS or HH:MM
  const [hourStr, minStr] = timeString.split(':');
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour ? hour : 12; // 0 should be 12
  return `${hour}:${minStr} ${ampm}`;
}

export function addMinutesToTime(time: string, minutesToAdd: number): string {
  const [hourStr, minStr] = time.split(':');
  let hour = parseInt(hourStr, 10);
  let min = parseInt(minStr, 10);

  min += minutesToAdd;
  if (min >= 60) {
    hour += Math.floor(min / 60);
    min = min % 60;
  }

  return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
}

export function getEndTime(startTime: string): string {
  return addMinutesToTime(startTime, SLOT_DURATION_MINUTES);
}

// Checks if a given time slot (startTime) conflicts with any existing booking for that date
export function isSlotBooked(startTime: string, bookings: Booking[]): boolean {
  const [checkHour, checkMin] = startTime.split(':').map(Number);
  const checkTimeInMins = checkHour * 60 + checkMin;

  return bookings.some((booking) => {
    const [startHour, startMin] = booking.start_time.split(':').map(Number);
    const bookingStartMins = startHour * 60 + startMin;
    
    // We assume all bookings have length SLOT_DURATION_MINUTES
    const bookingEndMins = bookingStartMins + SLOT_DURATION_MINUTES;

    // A slot overlaps if it starts exactly when another slot starts (in our strict 30-min block grid)
    return checkTimeInMins >= bookingStartMins && checkTimeInMins < bookingEndMins;
  });
}
