import React, { useState } from 'react';
import { Calendar, RotateCw } from 'lucide-react';
import type { GoalSettings } from '../../types/goals';
import { formatDate } from '../../utils/dateUtils';

interface GoalSyncSettingsProps {
  settings: GoalSettings;
  onSettingsChange: (settings: GoalSettings) => void;
}

export function GoalSyncSettings({ settings, onSettingsChange }: GoalSyncSettingsProps) {
  const handleCustomToggle = () => {
    onSettingsChange({
      ...settings,
      useCustom: !settings.useCustom
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.useCustom}
            onChange={handleCustomToggle}
            className="rounded text-blue-600"
          />
          <span className="text-sm text-gray-700">Custom date range</span>
        </label>
      </div>

      {settings.useCustom && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Start Date</label>
              <input
                type="date"
                value={settings.startDate}
                onChange={(e) => onSettingsChange({
                  ...settings,
                  startDate: e.target.value
                })}
                className="w-full rounded-lg border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">End Date</label>
              <input
                type="date"
                value={settings.endDate}
                onChange={(e) => onSettingsChange({
                  ...settings,
                  endDate: e.target.value
                })}
                className="w-full rounded-lg border-gray-300 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Repeat</label>
            <select
              value={settings.repeat || 'none'}
              onChange={(e) => onSettingsChange({
                ...settings,
                repeat: e.target.value as GoalSettings['repeat']
              })}
              className="w-full rounded-lg border-gray-300 text-sm"
            >
              <option value="none">No repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}