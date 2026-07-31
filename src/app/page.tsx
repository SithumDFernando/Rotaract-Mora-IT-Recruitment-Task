import { getBookings } from '@/actions/bookings';
import { DashboardClient } from '@/components/DashboardClient';
import { ToastProvider } from '@/components/ui/Toast';
import { CalendarIcon } from 'lucide-react';

export const revalidate = 0; // Disable static rendering for this page

export default async function Home() {
  const bookings = await getBookings();

  return (
    <ToastProvider>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-3">
          <div className="bg-brand-500 p-2 rounded-xl">
            <CalendarIcon className="h-6 w-6 text-white" />
          </div>
          Time Slot Booking
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400 text-lg">
          Select an available slot below to book your appointment.
        </p>
      </div>

      <DashboardClient initialBookings={bookings} />
    </ToastProvider>
  );
}
