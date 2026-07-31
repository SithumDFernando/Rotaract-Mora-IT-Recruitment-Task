'use client';

import * as React from 'react';
import { Booking } from '@/lib/types';
import { TIME_SLOTS } from '@/lib/constants';
import { isSlotBooked, formatTime, cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Clock } from 'lucide-react';

interface TimeSlotGridProps {
  bookings: Booking[];
  selectedDate: string;
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
}

export function TimeSlotGrid({ bookings, selectedDate, selectedTime, onTimeSelect }: TimeSlotGridProps) {
  // Filter bookings for the selected date
  const bookingsForDate = React.useMemo(() => {
    return bookings.filter((b) => b.date === selectedDate);
  }, [bookings, selectedDate]);

  return (
    <Card className="w-full h-full">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-brand-500" />
          Available Slots
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {TIME_SLOTS.map((slot) => {
            const isBooked = isSlotBooked(slot, bookingsForDate);
            const isSelected = selectedTime === slot;
            
            // Find the specific booking if booked, to show tooltip
            const booking = isBooked 
              ? bookingsForDate.find(b => {
                  const startMins = Number(b.start_time.split(':')[0]) * 60 + Number(b.start_time.split(':')[1]);
                  const checkMins = Number(slot.split(':')[0]) * 60 + Number(slot.split(':')[1]);
                  return checkMins >= startMins && checkMins < startMins + 30; // Assuming 30 min duration
                })
              : null;

            return (
              <button
                key={slot}
                disabled={isBooked}
                onClick={() => onTimeSelect(slot)}
                title={booking ? `Booked by ${booking.name} (${booking.category})` : `Select ${formatTime(slot)}`}
                className={cn(
                  'relative flex flex-col items-center justify-center rounded-lg border p-3 text-sm transition-all duration-200',
                  isSelected
                    ? 'border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500 dark:bg-brand-900/30 dark:text-brand-100'
                    : isBooked
                    ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400 opacity-60 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-500'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-slate-50 hover:text-brand-600 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-brand-700 dark:hover:bg-slate-800/80'
                )}
              >
                <span className="font-semibold">{formatTime(slot)}</span>
                {isBooked && (
                  <span className="mt-1 text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Booked
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
