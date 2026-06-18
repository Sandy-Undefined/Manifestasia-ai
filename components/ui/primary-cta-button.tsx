"use client"

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface PrimaryCTAButtonProps
  extends React.ComponentProps<typeof Button> {
  /** Optional icon to show before the label */
  icon?: React.ReactNode
}

/**
 * Full-width primary CTA button used for main actions across the app.
 * Standard styling: w-full h-14 text-lg font-medium rounded-2xl
 */
function PrimaryCTAButton({
  className,
  icon,
  children,
  ...props
}: PrimaryCTAButtonProps) {
  return (
    <Button
      className={cn(
        'w-full h-14 text-lg font-medium rounded-2xl',
        icon && 'gap-2',
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </Button>
  )
}

export { PrimaryCTAButton }
