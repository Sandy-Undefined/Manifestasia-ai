"use client"

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface FilterTabItem<T extends string = string> {
  value: T
  label: string
  /** Optional count or suffix (e.g. "(5)") */
  suffix?: React.ReactNode
}

export interface FilterTabsProps<T extends string = string>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Available tab options */
  tabs: FilterTabItem<T>[]
  /** Currently selected tab value */
  value: T
  /** Called when a tab is selected */
  onChange: (value: T) => void
}

/**
 * Filter tabs - pill-style tabs for filtering (e.g. All, Active, Fulfilled).
 * Used in vision-gallery, vision-board, etc.
 */
function FilterTabs<T extends string = string>({
  tabs,
  value,
  onChange,
  className,
  ...props
}: FilterTabsProps<T>) {
  return (
    <div
      className={cn('flex gap-2 overflow-x-auto', className)}
      {...props}
    >
      {tabs.map((tab) => {
        const isSelected = value === tab.value
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
              isSelected
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-foreground'
            )}
          >
            {tab.label} {tab.suffix}
          </button>
        )
      })}
    </div>
  )
}

export { FilterTabs }
