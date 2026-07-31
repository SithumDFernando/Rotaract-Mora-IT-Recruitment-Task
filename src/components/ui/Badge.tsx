import * as React from 'react';
import { cn } from '@/lib/utils';
import { Category } from '@/lib/types';
import { CATEGORY_COLORS } from '@/lib/constants';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  category?: Category;
}

export function Badge({ className, category, children, ...props }: BadgeProps) {
  const colorClass = category 
    ? CATEGORY_COLORS[category] 
    : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        colorClass,
        className
      )}
      {...props}
    >
      {category || children}
    </div>
  );
}
