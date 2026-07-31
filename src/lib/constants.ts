import { Category } from './types';

export const OPERATING_HOURS = {
  start: '08:00', // 8:00 AM
  end: '22:00', // 10:00 PM
};

export const SLOT_DURATION_MINUTES = 30;

// Generate all time slots for the day (e.g. 08:00, 08:30, ...)
export const TIME_SLOTS: string[] = (() => {
  const slots: string[] = [];
  let currentHour = parseInt(OPERATING_HOURS.start.split(':')[0], 10);
  let currentMinute = parseInt(OPERATING_HOURS.start.split(':')[1], 10);

  const endHour = parseInt(OPERATING_HOURS.end.split(':')[0], 10);
  const endMinute = parseInt(OPERATING_HOURS.end.split(':')[1], 10);

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMinute < endMinute)
  ) {
    const formattedHour = currentHour.toString().padStart(2, '0');
    const formattedMinute = currentMinute.toString().padStart(2, '0');
    slots.push(`${formattedHour}:${formattedMinute}`);

    currentMinute += SLOT_DURATION_MINUTES;
    if (currentMinute >= 60) {
      currentMinute -= 60;
      currentHour += 1;
    }
  }

  return slots;
})();

export const CATEGORY_COLORS: Record<Category, string> = {
  Meeting: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  Interview: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  Discussion: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'Important Meeting': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  Consultation: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
};
