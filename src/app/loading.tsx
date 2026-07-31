import { CalendarIcon } from 'lucide-react';

export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-slate-200 dark:bg-slate-800 p-2 rounded-xl h-10 w-10" />
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-md" />
        </div>
        <div className="h-5 w-96 bg-slate-200 dark:bg-slate-800 rounded-md mt-4" />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column Skeleton */}
        <div className="w-full lg:w-[400px] flex flex-col gap-6 shrink-0">
          <div className="h-80 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-[500px] w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>

        {/* Right Column Skeleton */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <div className="h-96 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
          
          <div className="mt-4">
             <div className="flex justify-between items-center mb-4">
               <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-md" />
               <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded-md" />
             </div>
             
             <div className="h-16 w-full bg-slate-200 dark:bg-slate-800 rounded-xl mb-6" />

             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="h-40 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="h-40 w-full bg-slate-200 dark:bg-slate-800 rounded-xl" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
