"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"
import { cva, VariantProps } from "class-variance-authority"

const progressVariants = cva(
  "h-full w-full flex-1 transition-all bg-primary ",
  {
    variants: {
      variant: {
        default: "bg-sky-600",
        success: "bg-emerald-700",
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof progressVariants> { }

type CombinedProgressProps = ProgressProps & React.ComponentPropsWithoutRef<
  typeof ProgressPrimitive.Root>

function Progress({
  className,
  value,
  variant,
  ...props
}: CombinedProgressProps,
) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(progressVariants({ variant }))}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
