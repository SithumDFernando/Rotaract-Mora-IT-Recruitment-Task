'use client';

import * as React from 'react';
import { Booking } from '@/lib/types';
import { formatDate, formatTime } from '@/lib/utils';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { CalendarDays, Clock, Edit2, Trash2 } from 'lucide-react';
import { deleteBooking } from '@/actions/bookings';
import { useToast } from './ui/Toast';

interface BookingListProps {
  bookings: Booking[];
  onEdit: (booking: Booking) => void;
}

export function BookingList({ bookings, onEdit }: BookingListProps) {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    
    try {
      const result = await deleteBooking(deletingId);
      if (result.success) {
        toast('Booking deleted successfully', 'success');
      } else {
        toast(result.error || 'Failed to delete booking', 'error');
      }
    } catch (err) {
      toast('An unexpected error occurred.', 'error');
    } finally {
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
          <CalendarDays className="h-12 w-12 text-slate-300 mb-4 dark:text-slate-700" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">No bookings yet</h3>
          <p className="mt-2 text-sm">Select a date and time to create your first booking.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {bookings.map((booking) => (
          <Card key={booking.id} className="group relative overflow-hidden transition-all hover:shadow-md">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-500" />
            <div className="p-5 pl-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-lg">
                    {booking.name}
                  </h4>
                  <Badge category={booking.category} className="mt-1" />
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full" 
                    onClick={() => onEdit(booking)}
                    title="Edit booking"
                  >
                    <Edit2 className="h-4 w-4 text-slate-500" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/40" 
                    onClick={() => setDeletingId(booking.id)}
                    title="Delete booking"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-slate-400" />
                  <span>{formatDate(booking.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span>{formatTime(booking.start_time)} – {formatTime(booking.end_time)}</span>
                </div>
              </div>

              {booking.note && (
                <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800/50 dark:text-slate-300">
                  <span className="font-medium text-slate-700 dark:text-slate-200">Note: </span>
                  {booking.note}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Delete Booking"
        description="Are you sure you want to delete this booking? This action cannot be undone and the time slot will become available again."
        footer={
          <>
            <Button variant="outline" onClick={() => setDeletingId(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} isLoading={isDeleting}>
              Delete
            </Button>
          </>
        }
      >
        <div className="p-1">
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md border border-red-200 dark:border-red-800/50">
            Warning: The user will lose this reservation permanently.
          </p>
        </div>
      </Modal>
    </>
  );
}
