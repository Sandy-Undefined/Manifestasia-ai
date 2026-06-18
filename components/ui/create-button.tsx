"use client"

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface CreateButtonProps extends React.ComponentProps<typeof Button> {
  /** Icon to show before the label (e.g. Plus) */
  icon?: React.ReactNode
}

/**
 * Create/Add button - medium size with icon, used for "Create First Vision",
 * "Log First Evidence", "Generate Visions", etc.
 */
function CreateButton({
  className,
  icon,
  children,
  ...props
}: CreateButtonProps) {
  return (
    <Button
      className={cn('h-12 px-8 rounded-2xl gap-2', className)}
      {...props}
    >
      {icon}
      {children}
    </Button>
  )
}

export { CreateButton }
