'use client';

import * as React from 'react';
import { CATEGORIES, Category } from '@/lib/types';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Search, FilterX } from 'lucide-react';
import { Button } from './ui/Button';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  categoryFilter: Category | 'All';
  onCategoryChange: (category: Category | 'All') => void;
}

export function FilterBar({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
}: FilterBarProps) {
  const hasFilters = searchTerm !== '' || categoryFilter !== 'All';

  const clearFilters = () => {
    onSearchChange('');
    onCategoryChange('All');
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center mb-6 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Search bookings by name or note..." 
          className="pl-9 bg-slate-50 border-transparent dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-50"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex w-full sm:w-auto items-center gap-2">
        <Select 
          className="w-full sm:w-[180px] bg-slate-50 border-transparent dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-slate-50"
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value as any)}
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map(cat => (
             <option key={cat} value={cat}>{cat}</option>
          ))}
        </Select>
        
        {hasFilters && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={clearFilters}
            title="Clear filters"
            className="shrink-0 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          >
            <FilterX className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
