'use client';

import * as React from 'react';
import { Booking, Category } from '@/lib/types';
import { BookingForm } from './BookingForm';
import { TimeSlotGrid } from './TimeSlotGrid';
import { BookingList } from './BookingList';
import { CalendarView } from './CalendarView';
import { FilterBar } from './FilterBar';

export function DashboardClient({ initialBookings }: { initialBookings: Booking[] }) {
  // Global State
  const [selectedDate, setSelectedDate] = React.useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
  const [editingBooking, setEditingBooking] = React.useState<Booking | null>(null);

  // Filter State
  const [searchTerm, setSearchTerm] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<Category | 'All'>('All');

  // Derive filtered bookings for the list
  const filteredBookings = React.useMemo(() => {
    let result = initialBookings;

    // We only show bookings for the currently selected date in the list for better UX,
    // OR we show all if they search. Let's show all matching filters, but default to selectedDate if no filters.
    if (searchTerm === '' && categoryFilter === 'All') {
      result = result.filter(b => b.date === selectedDate);
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(b => 
        b.name.toLowerCase().includes(lower) || 
        b.note?.toLowerCase().includes(lower)
      );
    }

    if (categoryFilter !== 'All') {
      result = result.filter(b => b.category === categoryFilter);
    }

    return result;
  }, [initialBookings, selectedDate, searchTerm, categoryFilter]);

  // Handlers
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(null);
    if (editingBooking && editingBooking.date !== date) {
      setEditingBooking(null);
    }
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setSelectedDate(booking.date);
    setSelectedTime(booking.start_time);
    // Clear filters so they see the context
    setSearchTerm('');
    setCategoryFilter('All');
    
    // Scroll to top where form is
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column - Form & Calendar */}
        <div className="w-full lg:w-[400px] flex flex-col gap-6 shrink-0">
          <CalendarView 
            bookings={initialBookings} 
            selectedDate={selectedDate} 
            onDateSelect={handleDateSelect} 
          />
          <BookingForm
            bookings={initialBookings}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            editingBooking={editingBooking}
            onDateChange={handleDateSelect}
            onTimeSelect={setSelectedTime}
            onCancelEdit={() => setEditingBooking(null)}
          />
        </div>

        {/* Right Column - Grid & List */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <TimeSlotGrid
            bookings={initialBookings}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onTimeSelect={setSelectedTime}
          />

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Bookings {searchTerm === '' && categoryFilter === 'All' && `for ${selectedDate}`}
              </h3>
              <div className="text-sm text-slate-500">
                {filteredBookings.length} found
              </div>
            </div>
            
            <FilterBar 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
            />

            <BookingList 
              bookings={filteredBookings} 
              onEdit={handleEdit} 
            />
          </div>
        </div>

      </div>
    </div>
  );
}
