import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ReferenceArea,
  AreaChart,
  Area,
} from 'recharts';
import { CalendarDay } from '../types/generator';

interface PostingTimesChartProps {
  calendar: CalendarDay[];
}

// Colors for platforms
const PLATFORM_COLORS: Record<string, string> = {
  instagram: '#E1306C',
  linkedin: '#0A66C2',
  facebook: '#1877F2',
  tiktok: '#111827',
  twitter: '#1D9BF0',
};

const PLATFORM_ICONS: Record<string, string> = {
  instagram: '📸',
  linkedin: '💼',
  facebook: '👥',
  tiktok: '🎵',
  twitter: '𝕏',
};

interface TimezoneOption {
  code: string;
  name: string;
  offsetHours: number;
}

const TIMEZONES: TimezoneOption[] = [
  { code: 'EST', name: 'Eastern (EST/EDT, UTC-5)', offsetHours: 0 }, // base reference
  { code: 'PST', name: 'Pacific (PST/PDT, UTC-8)', offsetHours: -3 },
  { code: 'UTC', name: 'UTC / GMT (London, UTC+0)', offsetHours: 5 },
  { code: 'CET', name: 'Central European (CET, UTC+1)', offsetHours: 6 },
  { code: 'IST', name: 'India Standard (IST, UTC+5:30)', offsetHours: 10.5 },
  { code: 'SGT', name: 'Singapore / Asia (SGT, UTC+8)', offsetHours: 13 },
  { code: 'AEST', name: 'Australian Eastern (AEST, UTC+10)', offsetHours: 15 },
];

// Helper: Parse string like "08:30 AM EST" or "14:15" into decimal hours (e.g. 8.5)
export function parseTimeToDecimal(timeStr: string): number {
  if (!timeStr) return 12;

  const match = timeStr.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/i);
  if (!match) return 12;

  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const meridian = match[3] ? match[3].toUpperCase() : null;

  if (meridian === 'PM' && hours < 12) {
    hours += 12;
  } else if (meridian === 'AM' && hours === 12) {
    hours = 0;
  }

  return Math.min(24, Math.max(0, hours + minutes / 60));
}

// Helper: Format decimal hour (e.g. 14.75) to "2:45 PM"
export function formatDecimalHour(val: number): string {
  let normalized = val % 24;
  if (normalized < 0) normalized += 24;

  const totalMinutes = Math.round(normalized * 60);
  let hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const meridian = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${displayHours}:${displayMinutes} ${meridian}`;
}

// Short label for days, e.g. "Day 1 - Monday" -> "Mon"
function getShortDayLabel(dayStr: string): string {
  if (dayStr.toLowerCase().includes('mon')) return 'Mon';
  if (dayStr.toLowerCase().includes('tue')) return 'Tue';
  if (dayStr.toLowerCase().includes('wed')) return 'Wed';
  if (dayStr.toLowerCase().includes('thu')) return 'Thu';
  if (dayStr.toLowerCase().includes('fri')) return 'Fri';
  if (dayStr.toLowerCase().includes('sat')) return 'Sat';
  if (dayStr.toLowerCase().includes('sun')) return 'Sun';
  return dayStr.slice(0, 5);
}

export const PostingTimesChart: React.FC<PostingTimesChartProps> = ({ calendar }) => {
  const [chartType, setChartType] = useState<'timeline' | 'distribution'>('timeline');
  const [selectedTz, setSelectedTz] = useState<string>('EST');

  const activeTz = TIMEZONES.find((t) => t.code === selectedTz) || TIMEZONES[0];
  const offset = activeTz.offsetHours;

  // Prepare data for recharts with timezone adjustment
  const chartData = calendar.map((item, index) => {
    const rawDecimal = parseTimeToDecimal(item.bestTimeSlot);
    let shiftedDecimal = (rawDecimal + offset) % 24;
    if (shiftedDecimal < 0) shiftedDecimal += 24;

    const shortDay = getShortDayLabel(item.day);
    const platformKey = item.platform.toLowerCase();
    const color = PLATFORM_COLORS[platformKey] || '#4B5563';

    // Engagement window quality
    const isPeak = (shiftedDecimal >= 8 && shiftedDecimal <= 11) || (shiftedDecimal >= 17 && shiftedDecimal <= 20);
    const isModerate = shiftedDecimal > 11 && shiftedDecimal < 17;

    return {
      index,
      day: item.day,
      shortDay,
      platform: item.platform,
      platformKey,
      color,
      theme: item.theme,
      format: item.format,
      bestTimeSlot: item.bestTimeSlot,
      hourDecimal: Math.round(shiftedDecimal * 10) / 10,
      displayTime: formatDecimalHour(shiftedDecimal),
      engagementGrade: isPeak ? '🔥 Peak Window' : isModerate ? '⚡ Moderate' : '🌙 Off-Peak',
    };
  });

  // Calculate high-level stats
  const hoursList = chartData.map((d) => d.hourDecimal);
  const avgHour = hoursList.length > 0 ? hoursList.reduce((a, b) => a + b, 0) / hoursList.length : 12;
  const earliestHour = hoursList.length > 0 ? Math.min(...hoursList) : 8;
  const latestHour = hoursList.length > 0 ? Math.max(...hoursList) : 20;

  // Custom Tooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const icon = PLATFORM_ICONS[data.platformKey] || '📝';
      return (
        <div className="bg-neutral-900 text-white p-3.5 rounded-lg shadow-xl text-xs space-y-1.5 border border-neutral-800 max-w-xs z-50">
          <div className="flex items-center justify-between border-b border-neutral-700 pb-1.5 gap-4">
            <span className="font-bold text-neutral-200">{data.day}</span>
            <span className="font-mono text-amber-300 font-semibold">{data.displayTime} ({selectedTz})</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-neutral-300 capitalize font-medium">
              <span>{icon}</span>
              <span>{data.platform}</span>
              <span className="text-neutral-500">·</span>
              <span>{data.format}</span>
            </div>
            <span className="text-emerald-400 font-medium text-[10px]">{data.engagementGrade}</span>
          </div>
          <div className="text-neutral-400 text-[11px] leading-snug pt-0.5">
            <strong>Theme:</strong> {data.theme}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-neutral-50/60 p-5 rounded-xl border border-neutral-200/90 space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Optimal Posting Times & Audience Heatmap
            </h4>
          </div>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Plotting recommended publication hours across Monday through Sunday.
          </p>
        </div>

        {/* Timezone & Chart Switchers */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* Timezone Selector */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-600 bg-white border border-neutral-200 rounded-lg px-2.5 py-1">
            <span className="text-[11px] font-medium text-neutral-400">TZ:</span>
            <select
              value={selectedTz}
              onChange={(e) => setSelectedTz(e.target.value)}
              className="text-xs font-semibold text-neutral-800 bg-transparent focus:outline-none cursor-pointer"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz.code} value={tz.code}>
                  {tz.code} ({tz.name})
                </option>
              ))}
            </select>
          </div>

          {/* View Switcher Tabs */}
          <div className="flex items-center gap-1 p-0.5 bg-neutral-200/70 rounded-lg">
            <button
              type="button"
              onClick={() => setChartType('timeline')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                chartType === 'timeline'
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Hourly Timeline
            </button>
            <button
              type="button"
              onClick={() => setChartType('distribution')}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                chartType === 'distribution'
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Platform Bars
            </button>
          </div>
        </div>
      </div>

      {/* Recharts Chart Container */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'timeline' ? (
            <AreaChart data={chartData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="timeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              {/* Highlight typical high-engagement window: 8 AM to 6 PM */}
              <ReferenceArea y1={8} y2={18} fill="#F3F4F6" fillOpacity={0.6} />
              <XAxis
                dataKey="shortDay"
                tick={{ fontSize: 11, fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 24]}
                ticks={[0, 6, 9, 12, 15, 18, 21, 24]}
                tickFormatter={(val) => {
                  if (val === 0 || val === 24) return '12 AM';
                  if (val === 12) return '12 PM';
                  return val > 12 ? `${val - 12} PM` : `${val} AM`;
                }}
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="hourDecimal"
                stroke="#4F46E5"
                strokeWidth={2.5}
                fill="url(#timeGradient)"
                dot={({ cx, cy, payload }: any) => {
                  if (cx === undefined || cy === undefined) return <g key={`dot-empty`} />;
                  const icon = PLATFORM_ICONS[payload.platformKey] || '●';
                  return (
                    <g key={`dot-${payload.index}`}>
                      <circle
                        cx={cx}
                        cy={cy}
                        r={8}
                        fill="#FFFFFF"
                        stroke={payload.color}
                        strokeWidth={2.5}
                      />
                      <text
                        x={cx}
                        y={cy + 3}
                        textAnchor="middle"
                        fontSize="8"
                        fontWeight="bold"
                        fill={payload.color}
                      >
                        {icon === '●' ? '●' : payload.shortDay.slice(0, 1)}
                      </text>
                    </g>
                  );
                }}
                activeDot={{ r: 9, fill: '#4F46E5', stroke: '#FFFFFF', strokeWidth: 2 }}
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis
                dataKey="shortDay"
                tick={{ fontSize: 11, fill: '#6B7280' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 24]}
                ticks={[0, 6, 9, 12, 15, 18, 21, 24]}
                tickFormatter={(val) => {
                  if (val === 0 || val === 24) return '12 AM';
                  if (val === 12) return '12 PM';
                  return val > 12 ? `${val - 12} PM` : `${val} AM`;
                }}
                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="hourDecimal" radius={[4, 4, 0, 0]} maxBarSize={36}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend & Summary Insights */}
      <div className="pt-2 border-t border-neutral-200/80 flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Platform Color Legend */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
            Channels:
          </span>
          {Object.entries(PLATFORM_COLORS).map(([key, color]) => (
            <div key={key} className="flex items-center gap-1.5 capitalize text-neutral-700">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
              <span className="text-[11px]">{PLATFORM_ICONS[key]} {key}</span>
            </div>
          ))}
        </div>

        {/* Timezone-Aware Metrics */}
        <div className="flex items-center gap-3 text-neutral-500 font-mono text-[11px] tabular-nums">
          <span>Avg: <strong className="text-neutral-800">{formatDecimalHour(avgHour)}</strong></span>
          <span>·</span>
          <span>Earliest: <strong className="text-neutral-800">{formatDecimalHour(earliestHour)}</strong></span>
          <span>·</span>
          <span>Latest: <strong className="text-neutral-800">{formatDecimalHour(latestHour)}</strong></span>
          <span className="text-neutral-400 font-sans">({selectedTz})</span>
        </div>
      </div>
    </div>
  );
};
