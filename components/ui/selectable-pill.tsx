"use client"

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SelectablePillProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Whether this pill is selected */
  selected?: boolean
  /** Size variant */
  size?: 'sm' | 'default'
  /** Unselected style: bordered card or muted (for tag chips) */
  unselectedVariant?: 'bordered' | 'muted'
}

/**
 * Selectable pill/chip used for tags, filters, challenges, realism boosters, etc.
 * - sm: px-3 py-1.5 text-xs (evidence tracker tags)
 * - default: px-4 py-2 text-sm (challenges, filter tabs, boosters)
 */
function SelectablePill({
  className,
  selected = false,
  size = 'default',
  unselectedVariant = 'bordered',
  children,
  ...props
}: SelectablePillProps) {
  const sizeStyles =
    size === 'sm'
      ? 'px-3 py-1.5 text-xs font-medium'
      : 'px-4 py-2 text-sm font-medium'

  const selectedStyles = selected
    ? 'bg-primary text-primary-foreground border-primary'
    : unselectedVariant === 'muted'
      ? 'bg-muted text-muted-foreground border-transparent hover:border-primary/50'
      : 'bg-card border border-border text-foreground hover:border-primary/50'

  return (
    <button
      type="button"
      className={cn(
        'rounded-full border-2 transition-colors disabled:opacity-50 disabled:pointer-events-none',
        sizeStyles,
        selectedStyles,
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export { SelectablePill }
