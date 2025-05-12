import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartData, type ChartOptions } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { InfoTooltip } from '../accessibility/Tooltip';
import { useDailyMacros } from '../../hooks/useDailyMacros';

ChartJS.register(ArcElement, Tooltip, Legend);

export function MacrosPieChart() {
  const macros = useDailyMacros();
  const hasData = macros.calories > 0;

  const chartData: ChartData<'pie'> = {
    labels: ['Fat', 'Protein', 'Carbs'],
    datasets: [
      {
        data: [macros.fat * 9, macros.protein * 4, macros.carbs * 4],
        backgroundColor: [
          'rgb(251, 146, 60)',
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const percentage = ((value / (macros.calories || 1)) * 100).toFixed(1);
            return `${context.label}: ${percentage}% (${value.toFixed(0)} kcal)`;
          },
        },
      },
    },
  };

  if (!hasData) {
    return (
      <div className="w-full max-w-[200px] mx-auto text-center py-8">
        <p className="text-gray-500">No data available for selected date</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[200px] mx-auto">
      <div className="flex items-center justify-center gap-2 mb-4">
        <h3 className="text-lg font-semibold">Macro Distribution</h3>
        <InfoTooltip content="Shows the proportion of calories from each macro nutrient" />
      </div>
      <Pie data={chartData} options={options} />
      <div className="grid grid-cols-3 gap-4 mt-4 text-center">
        <MacroTotal label="Total Calories" value={macros.calories} />
        <MacroTotal label="Protein" value={macros.protein} unit="g" />
        <MacroTotal label="Fat" value={macros.fat} unit="g" />
      </div>
    </div>
  );
}

interface MacroTotalProps {
  label: string;
  value: number;
  unit?: string;
}

function MacroTotal({ label, value, unit = '' }: MacroTotalProps) {
  return (
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="font-semibold">
        {value}
        {unit}
      </p>
    </div>
  );
}