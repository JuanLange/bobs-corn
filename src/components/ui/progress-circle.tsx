import * as React from "react"

interface ProgressCircleProps {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  label?: string
}

export function ProgressCircle({
  value,
  max,
  size = 120,
  strokeWidth = 10,
  label,
}: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const progress = value / max
  const offset = circumference - progress * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Círculo de fondo */}
        <circle
          className="text-gray-200 dark:text-gray-700"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Círculo de progreso */}
        <circle
          className="text-primary transition-all duration-300 ease-in-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {label && (
        <div className="absolute inset-0 flex items-center justify-center text-lg font-semibold">
          {label}
        </div>
      )}
    </div>
  )
}
