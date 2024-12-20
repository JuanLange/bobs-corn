import * as React from "react"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: number }
>(({ className, value, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-white/10",
        className
      )}
      {...props}
    >
      <div
        className="h-full flex-1 bg-emerald-400 transition-all duration-300"
        style={{ 
          width: `${value || 0}%`,
        }}
      />
    </div>
  )
})
Progress.displayName = "Progress"

export { Progress }
