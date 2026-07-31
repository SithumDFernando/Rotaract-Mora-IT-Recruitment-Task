export const CATEGORIES = [
  'Meeting',
  'Interview',
  'Discussion',
  'Important Meeting',
  'Consultation',
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Booking {
  id: string;
  name: string;
  date: string; // ISO date string (YYYY-MM-DD)
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  category: Category;
  note: string | null;
  created_at: string;
}

export type BookingInsert = Omit<Booking, 'id' | 'created_at' | 'end_time'> & { end_time?: string };
export type BookingUpdate = Partial<BookingInsert>;
