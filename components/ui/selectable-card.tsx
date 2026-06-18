"use client"

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SelectableCardProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Whether this card is selected */
  selected?: boolean
  /** Layout variant */
  variant?: 'grid' | 'row' | 'row-with-check'
  /** Optional icon or badge content */
  icon?: React.ReactNode
  /** Optional trailing element (e.g. ChevronRight, Check) */
  trailing?: React.ReactNode
  /** Optional description text below the label */
  description?: React.ReactNode
}

/**
 * Selectable card used for single/multi-select flows (areas, emotional state,
 * intentions, challenges, templates, personas, etc.)
 */
function SelectableCard({
  className,
  selected = false,
  variant = 'row',
  icon,
  trailing,
  description,
  children,
  ...props
}: SelectableCardProps) {
  const baseStyles =
    'rounded-2xl border-2 transition-all text-left disabled:opacity-50 disabled:pointer-events-none'
  const selectedStyles = selected
    ? 'bg-primary/10 border-primary'
    : 'bg-card border-border hover:border-primary/50'

  if (variant === 'grid') {
    return (
      <button
        type="button"
        className={cn(
          baseStyles,
          selectedStyles,
          'flex flex-col items-center gap-3 p-5',
          className
        )}
        {...props}
      >
        {icon && (
          <div
            className={cn(
              'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
              selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            )}
          >
            {icon}
          </div>
        )}
        <span
          className={cn(
            'text-sm font-medium text-center',
            selected ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          {children}
        </span>
      </button>
    )
  }

  return (
    <button
      type="button"
      className={cn(
        baseStyles,
        selectedStyles,
        'w-full flex items-center gap-4 p-4',
        variant === 'row-with-check' && 'justify-between',
        description && 'items-start',
        className
      )}
      {...props}
    >
      {icon && (
        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center shrink-0',
            selected ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
          )}
        >
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0 text-left">
        <span className={cn('font-medium', selected ? 'text-foreground' : 'text-foreground')}>
          {children}
        </span>
        {description && (
          <span className="block text-sm text-muted-foreground mt-0.5">
            {description}
          </span>
        )}
      </div>
      {selected && variant === 'row-with-check' && (
        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
          {trailing}
        </div>
      )}
      {trailing && variant !== 'row-with-check' && (
        <div className="shrink-0 text-muted-foreground">{trailing}</div>
      )}
    </button>
  )
}

export { SelectableCard }
