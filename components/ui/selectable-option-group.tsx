"use client"

import * as React from 'react'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectableOptionItem<T = string> {
  value: T
  label: string
  icon?: React.ComponentType<{ className?: string }>
  /** Show lock icon for premium options */
  locked?: boolean
}

export interface SelectableOptionGroupProps<T = string>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Label for the group */
  label?: string
  /** Available options */
  options: SelectableOptionItem<T>[]
  /** Currently selected value */
  value: T
  /** Called when an option is selected */
  onChange: (value: T) => void
  /** Layout: horizontal (flex) or vertical */
  layout?: 'horizontal' | 'vertical'
  /** Called when a locked option is clicked (e.g. show upgrade prompt) */
  onLockedClick?: () => void
}

/**
 * Selectable option group - for media type, model tier, layout selector, etc.
 * Renders a row or column of selectable buttons.
 */
function SelectableOptionGroup<T extends string = string>({
  label,
  options,
  value,
  onChange,
  layout = 'horizontal',
  onLockedClick,
  className,
  ...props
}: SelectableOptionGroupProps<T>) {
  return (
    <div className={cn('mb-5', className)} {...props}>
      {label && (
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex gap-2',
          layout === 'vertical' && 'flex-col'
        )}
      >
        {options.map((opt) => {
          const Icon = opt.icon
          const isSelected = value === opt.value
          const isLocked = opt.locked

          return (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => {
                if (isLocked && onLockedClick) {
                  onLockedClick()
                  return
                }
                onChange(opt.value)
              }}
              className={cn(
                'flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl text-sm font-medium transition-colors relative',
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground'
              )}
            >
              {Icon && <Icon className="w-5 h-5" />}
              {opt.label}
              {isLocked && (
                <Lock className="w-3 h-3 absolute top-2 right-2 text-muted-foreground" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { SelectableOptionGroup }
