import React, { useState } from 'react';
import { CalendarDay, PlatformKey } from '../types/generator';
import { exportCalendarToCsv, downloadFile } from '../utils/exportUtils';
import { PostingTimesChart } from './PostingTimesChart';

interface ContentCalendarViewProps {
  calendar: CalendarDay[];
  onUpdateDay: (index: number, updatedDay: Partial<CalendarDay>) => void;
  onRegenerateCalendar: () => void;
  isRegenerating: boolean;
}

const PLATFORM_ICONS: Record<PlatformKey | string, string> = {
  instagram: '📸',
  linkedin: '💼',
  facebook: '👥',
  tiktok: '🎵',
};

export const ContentCalendarView: React.FC<ContentCalendarViewProps> = ({
  calendar,
  onUpdateDay,
  onRegenerateCalendar,
  isRegenerating,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showChart, setShowChart] = useState<boolean>(true);

  const handleExportCsv = () => {
    const csv = exportCalendarToCsv(calendar);
    downloadFile(
      csv,
      `book-kaaro-content-calendar-${new Date().toISOString().slice(0, 10)}.csv`,
      'text/csv;charset=utf-8;'
    );
  };

  return (
    <div id="calendar-view" className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden space-y-6 p-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <h3 className="text-lg font-bold text-neutral-900 tracking-tight">
            7-Day Multi-Channel Publishing Schedule
          </h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            Balanced weekly rhythm designed for sustainable creator consistency and peak audience windows.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Chart Button */}
          <button
            type="button"
            onClick={() => setShowChart(!showChart)}
            className="px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>📊</span>
            <span>{showChart ? 'Hide Time Chart' : 'Show Time Chart'}</span>
          </button>

          <button
            onClick={onRegenerateCalendar}
            disabled={isRegenerating}
            className="px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          >
            <span>↻</span>
            <span>{isRegenerating ? 'Planning...' : 'Regenerate Calendar'}</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <span>📥</span>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Recharts Optimal Posting Times Visualization */}
      {showChart && calendar.length > 0 && (
        <PostingTimesChart calendar={calendar} />
      )}

      {/* Calendar Grid / Table */}
      <div className="overflow-x-auto border border-neutral-200 rounded-lg">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-600 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 w-32">Day</th>
              <th className="py-3 px-4 w-32">Platform</th>
              <th className="py-3 px-4 w-40">Format</th>
              <th className="py-3 px-4">Theme & Angle</th>
              <th className="py-3 px-4 w-36">Optimal Time Slot</th>
              <th className="py-3 px-4 w-20 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200/80">
            {calendar.map((item, index) => {
              const isEditing = editingIndex === index;
              const pIcon = PLATFORM_ICONS[item.platform.toLowerCase()] || '📝';

              return (
                <tr key={index} className="hover:bg-neutral-50/50 transition-colors">
                  {/* Day */}
                  <td className="py-3 px-4 font-semibold text-neutral-900 whitespace-nowrap">
                    {item.day}
                  </td>

                  {/* Platform */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 font-medium text-neutral-800 capitalize">
                      <span>{pIcon}</span>
                      <span>{item.platform}</span>
                    </span>
                  </td>

                  {/* Format */}
                  <td className="py-3 px-4 whitespace-nowrap text-neutral-600">
                    {isEditing ? (
                      <input
                        type="text"
                        value={item.format}
                        onChange={(e) => onUpdateDay(index, { format: e.target.value })}
                        className="w-full border border-neutral-300 rounded px-2 py-1 text-xs"
                      />
                    ) : (
                      <span>{item.format}</span>
                    )}
                  </td>

                  {/* Theme & Caption Summary */}
                  <td className="py-3 px-4">
                    {isEditing ? (
                      <div className="space-y-1.5 py-1">
                        <input
                          type="text"
                          value={item.theme}
                          onChange={(e) => onUpdateDay(index, { theme: e.target.value })}
                          placeholder="Theme..."
                          className="w-full border border-neutral-300 rounded px-2 py-1 text-xs font-medium text-neutral-900"
                        />
                        <textarea
                          rows={2}
                          value={item.captionSummary}
                          onChange={(e) => onUpdateDay(index, { captionSummary: e.target.value })}
                          placeholder="Caption summary..."
                          className="w-full border border-neutral-300 rounded px-2 py-1 text-xs text-neutral-700"
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="font-semibold text-neutral-900 mb-0.5">{item.theme}</div>
                        <div className="text-neutral-500 line-clamp-2">{item.captionSummary}</div>
                      </div>
                    )}
                  </td>

                  {/* Time Slot */}
                  <td className="py-3 px-4 whitespace-nowrap text-neutral-800 font-mono tabular-nums">
                    {isEditing ? (
                      <input
                        type="text"
                        value={item.bestTimeSlot}
                        onChange={(e) => onUpdateDay(index, { bestTimeSlot: e.target.value })}
                        className="w-full border border-neutral-300 rounded px-2 py-1 text-xs font-mono"
                      />
                    ) : (
                      <span className="font-medium bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200/80">
                        {item.bestTimeSlot}
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => setEditingIndex(isEditing ? null : index)}
                      className="text-neutral-500 hover:text-neutral-900 font-medium text-[11px] underline cursor-pointer"
                    >
                      {isEditing ? 'Done' : 'Edit'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
