import React from 'react';

export function CalendarLegend() {
  return (
    <div className="mt-6 flex items-center justify-center space-x-6">
      <LegendItem color="bg-green-50" label="Goals Surpassed" />
      <LegendItem color="bg-red-50" label="Goals Not Met" />
      <LegendItem color="bg-gray-100" label="No Data" />
    </div>
  );
}

interface LegendItemProps {
  color: string;
  label: string;
}

function LegendItem({ color, label }: LegendItemProps) {
  return (
    <div className="flex items-center">
      <div className={`w-4 h-4 ${color} rounded mr-2`} />
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  );
}