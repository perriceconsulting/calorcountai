import React from 'react';
import { CalendarView } from './CalendarView';
import { CalendarLegend } from './CalendarLegend';
import { CalendarFilters } from './CalendarFilters';
import { CalendarInsights } from './CalendarInsights';

export function CalendarPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Macro Tracking Calendar</h1>
      
      <CalendarInsights />
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <CalendarFilters />
        <CalendarView />
        <CalendarLegend />
      </div>
    </div>
  );
}