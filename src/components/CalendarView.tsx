'use client';

import * as React from 'react';
import { Booking } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  bookings: Booking[];
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export function CalendarView({ bookings, selectedDate, onDateSelect }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    const d = new Date(selectedDate);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  // Calculate days to display
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Group bookings by date to show indicators
  const bookingsByDate = React.useMemo(() => {
    const grouped: Record<string, number> = {};
    bookings.forEach(b => {
      grouped[b.date] = (grouped[b.date] || 0) + 1;
    });
    return grouped;
  }, [bookings]);

  return (
    <Card>
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarIcon className="h-5 w-5 text-brand-500" />
            Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium w-24 text-center">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-xs font-medium text-slate-500">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-sm">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="h-8" />
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            // Format to local YYYY-MM-DD correctly avoiding timezone shifts
            const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
            
            const isSelected = dateStr === selectedDate;
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            const bookingCount = bookingsByDate[dateStr] || 0;
            const isPast = dateStr < new Date().toISOString().split('T')[0];

            return (
              <button
                key={day}
                onClick={() => onDateSelect(dateStr)}
                className={cn(
                  'relative h-9 w-full rounded-md flex items-center justify-center transition-all',
                  isSelected 
                    ? 'bg-brand-600 text-white font-semibold shadow-sm' 
                    : 'hover:bg-slate-100 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800',
                  isToday && !isSelected && 'text-brand-600 font-bold bg-brand-50 dark:bg-brand-900/20 dark:text-brand-400',
                  isPast && !isSelected && 'text-slate-400 dark:text-slate-600 opacity-60'
                )}
              >
                {day}
                
                {/* Dots indicator for bookings */}
                {bookingCount > 0 && (
                  <div className="absolute bottom-1 flex gap-[2px]">
                    <div 
                      className={cn(
                        "h-1 w-1 rounded-full",
                        isSelected ? "bg-white" : "bg-brand-500"
                      )} 
                    />
                    {bookingCount > 1 && (
                       <div 
                        className={cn(
                          "h-1 w-1 rounded-full",
                          isSelected ? "bg-white/70" : "bg-brand-400/70"
                        )} 
                      />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
