"use client"

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface ActionButtonProps extends React.ComponentProps<typeof Button> {
  /** Optional icon to show before the label */
  icon?: React.ReactNode
}

/**
 * Secondary action button - outline style, flex-1, used for secondary actions
 * (e.g. Reflect, Archive, Photo). Often used in a row with other action buttons.
 */
function ActionButton({
  className,
  icon,
  children,
  variant = 'outline',
  ...props
}: ActionButtonProps) {
  return (
    <Button
      variant={variant}
      className={cn(
        'flex-1 h-11 rounded-xl gap-2 bg-transparent',
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </Button>
  )
}

export { ActionButton }
