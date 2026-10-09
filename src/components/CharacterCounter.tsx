import React from 'react';

interface CharacterCounterProps {
  currentLength: number;
  maxLength: number;
  foldLimit?: number;
  label?: string;
  showRadialGauge?: boolean;
  className?: string;
}

export const CharacterCounter: React.FC<CharacterCounterProps> = ({
  currentLength,
  maxLength,
  foldLimit,
  label,
  showRadialGauge = true,
  className = '',
}) => {
  const percentage = Math.min(100, Math.round((currentLength / maxLength) * 100));
  const remaining = maxLength - currentLength;
  const isOver = currentLength > maxLength;
  const isWarning = !isOver && remaining <= Math.max(20, Math.round(maxLength * 0.1));

  // Circular gauge calculations
  const radius = 9;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, percentage) / 100) * circumference;

  let gaugeColor = '#10B981'; // emerald-500
  let textColor = 'text-neutral-500';
  let badgeBg = 'bg-neutral-100 text-neutral-600 border-neutral-200';

  if (isOver) {
    gaugeColor = '#EF4444'; // red-500
    textColor = 'text-red-600 font-bold';
    badgeBg = 'bg-red-50 text-red-700 border-red-200 font-bold';
  } else if (isWarning) {
    gaugeColor = '#F59E0B'; // amber-500
    textColor = 'text-amber-700 font-semibold';
    badgeBg = 'bg-amber-50 text-amber-800 border-amber-200';
  }

  // Fold status (e.g. Instagram 125 chars or LinkedIn 140 chars)
  const isPastFold = foldLimit ? currentLength > foldLimit : false;

  return (
    <div className={`flex flex-wrap items-center gap-2.5 text-xs ${className}`}>
      {label && <span className="text-neutral-500 font-medium">{label}</span>}

      {/* Fold indicator if applicable */}
      {foldLimit && foldLimit < maxLength && (
        <span
          className={`text-[10px] font-mono px-1.5 py-0.5 rounded border transition-colors ${
            isPastFold
              ? 'bg-neutral-100 text-neutral-600 border-neutral-300'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold'
          }`}
          title={
            isPastFold
              ? `First ${foldLimit} characters visible before user clicks "...more"`
              : `Entire message fits before mobile "...more" fold (${foldLimit} chars)`
          }
        >
          {isPastFold ? `Fold at ${foldLimit}c` : `✓ Fits Fold (${currentLength}/${foldLimit})`}
        </span>
      )}

      {/* Main Counter & Radial Gauge */}
      <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-mono tabular-nums ${badgeBg}`}>
        {showRadialGauge && (
          <svg className="w-4 h-4 transform -rotate-90 shrink-0" viewBox="0 0 24 24">
            {/* Background ring */}
            <circle
              cx="12"
              cy="12"
              r={radius}
              stroke="#E5E7EB"
              strokeWidth="2.5"
              fill="none"
            />
            {/* Filled progress ring */}
            <circle
              cx="12"
              cy="12"
              r={radius}
              stroke={gaugeColor}
              strokeWidth="2.5"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-150"
            />
          </svg>
        )}

        <span className={textColor}>
          {currentLength.toLocaleString()} / {maxLength.toLocaleString()}
        </span>

        <span className="text-[10px] font-sans opacity-70">
          {isOver
            ? `(${Math.abs(remaining).toLocaleString()} over limit)`
            : `(${remaining.toLocaleString()} left)`}
        </span>
      </div>

      {isOver && (
        <span className="text-[11px] text-red-600 font-semibold animate-pulse flex items-center gap-1">
          <span>⚠️</span>
          <span>Exceeds platform limit</span>
        </span>
      )}
    </div>
  );
};
