"use client"

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BackButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon to show (default: ArrowLeft) */
  icon?: React.ReactNode
}

/**
 * Circular back button used for navigation across screens.
 * Standard styling: w-10 h-10 rounded-full bg-card border border-border
 */
function BackButton({
  className,
  icon,
  children,
  'aria-label': ariaLabel = 'Back',
  ...props
}: BackButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={cn(
        'w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center',
        className
      )}
      {...props}
    >
      {icon ?? children}
    </button>
  )
}

export { BackButton }
