'use client';

import * as React from 'react';
import { Booking, BookingInsert, CATEGORIES, Category } from '@/lib/types';
import { createBooking, updateBooking } from '@/actions/bookings';
import { isSlotBooked } from '@/lib/utils';
import { TIME_SLOTS } from '@/lib/constants';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { useToast } from './ui/Toast';
import { CalendarIcon, Clock, Edit2 } from 'lucide-react';

interface BookingFormProps {
  bookings: Booking[];
  selectedDate: string;
  selectedTime: string | null;
  editingBooking: Booking | null;
  onDateChange: (date: string) => void;
  onTimeSelect: (time: string | null) => void;
  onCancelEdit: () => void;
}

export function BookingForm({
  bookings,
  selectedDate,
  selectedTime,
  editingBooking,
  onDateChange,
  onTimeSelect,
  onCancelEdit,
}: BookingFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  // Form state
  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState<Category>(CATEGORIES[0]);
  const [note, setNote] = React.useState('');

  // Sync with editing state
  React.useEffect(() => {
    if (editingBooking) {
      setName(editingBooking.name);
      setCategory(editingBooking.category);
      setNote(editingBooking.note || '');
    } else {
      setName('');
      setCategory(CATEGORIES[0]);
      setNote('');
    }
  }, [editingBooking]);

  // Derived state: available slots for the selected date
  const availableSlots = React.useMemo(() => {
    const bookingsForDate = bookings.filter((b) => b.date === selectedDate && b.id !== editingBooking?.id);
    return TIME_SLOTS.map((slot) => ({
      time: slot,
      isAvailable: !isSlotBooked(slot, bookingsForDate),
    }));
  }, [bookings, selectedDate, editingBooking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !selectedDate || !selectedTime) {
      toast('Please fill all required fields', 'error');
      return;
    }

    setIsLoading(true);

    try {
      if (editingBooking) {
        const result = await updateBooking(editingBooking.id, {
          name,
          date: selectedDate,
          start_time: selectedTime,
          category,
          note,
        });

        if (result.success) {
          toast('Booking updated successfully!', 'success');
          onCancelEdit();
        } else {
          toast(result.error || 'Failed to update booking', 'error');
        }
      } else {
        const result = await createBooking({
          name,
          date: selectedDate,
          start_time: selectedTime,
          category,
          note,
        });

        if (result.success) {
          toast('Booking created successfully!', 'success');
          setName('');
          setNote('');
          onTimeSelect(null);
        } else {
          toast(result.error || 'Failed to create booking', 'error');
        }
      }
    } catch (err) {
      toast('An unexpected error occurred.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
        <CardTitle className="flex items-center gap-2">
          {editingBooking ? (
            <>
              <Edit2 className="h-5 w-5 text-brand-500" />
              Edit Booking
            </>
          ) : (
            'New Booking'
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">Date</label>
              <div className="relative">
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => onDateChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]} // Can't book in the past
                  required
                />
                <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 opacity-50" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="time" className="text-sm font-medium">Time Slot</label>
              <div className="relative">
                <Select
                  id="time"
                  value={selectedTime || ''}
                  onChange={(e) => onTimeSelect(e.target.value)}
                  required
                >
                  <option value="" disabled>Select a time</option>
                  {availableSlots.map((slot) => (
                    <option key={slot.time} value={slot.time} disabled={!slot.isAvailable}>
                      {slot.time} {!slot.isAvailable && '(Booked)'}
                    </option>
                  ))}
                </Select>
                <Clock className="pointer-events-none absolute right-8 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 opacity-50" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">Category</label>
            <Select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="note" className="text-sm font-medium">Note (Optional)</label>
            <textarea
              id="note"
              className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:ring-brand-400 min-h-[100px] resize-y"
              placeholder="Any details we should know?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="pt-2 flex gap-3">
            <Button type="submit" className="flex-1" isLoading={isLoading}>
              {editingBooking ? 'Save Changes' : 'Book Appointment'}
            </Button>
            {editingBooking && (
              <Button type="button" variant="outline" onClick={onCancelEdit} disabled={isLoading}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
