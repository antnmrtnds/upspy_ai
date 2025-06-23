import * as React from "react"
import { cn } from "@/lib/utils"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative h-2 w-full overflow-hidden rounded bg-secondary", className)}
      {...props}
    >
      <span
        className="block h-full bg-primary transition-transform"
        style={{ transform: `translateX(${value - 100}%)` }}
      />
    </div>
  )
)
Progress.displayName = "Progress"

export { Progress }