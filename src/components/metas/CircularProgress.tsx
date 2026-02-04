import * as React from "react";

interface CircularProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
  isNearComplete?: boolean;
}

export function CircularProgress({
  value,
  size = 140,
  strokeWidth = 10,
  showPercentage = false,
  isNearComplete = false,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  const gradientId = React.useId();

  return (
    <svg
      width={size}
      height={size}
      className="transform -rotate-90"
      style={{
        filter: isNearComplete
          ? "drop-shadow(0 0 12px hsl(160 84% 50% / 0.6))"
          : "none",
      }}
    >
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="hsl(var(--muted))"
        strokeWidth={strokeWidth}
        fill="none"
        className="opacity-40"
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700 ease-out"
      />
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(270, 91%, 65%)" />
          <stop offset="100%" stopColor="hsl(160, 84%, 45%)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
