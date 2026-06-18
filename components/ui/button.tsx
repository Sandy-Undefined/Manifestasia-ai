import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * Manifestasia Button Component
 *
 * Variants:
 *   default  - Terracotta primary CTA
 *   secondary - Blush peach soft action
 *   tertiary  - Warm sand subtle action
 *   outline   - Bordered button
 *   ghost     - Transparent hover-reveal
 *   link      - Inline text link
 *   destructive - Danger/delete actions
 *
 * Sizes:
 *   sm      - 36px height, compact padding
 *   default - 44px height, standard (medium)
 *   lg      - 56px height, prominent CTA
 *   icon    - Square icon buttons (sm, default, lg)
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 ease-in-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/85 active:bg-primary/95 rounded-full shadow-sm',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/90 rounded-full',
        tertiary:
          'bg-tertiary text-tertiary-foreground hover:bg-tertiary/80 active:bg-tertiary/90 rounded-full',
        outline:
          'border-2 border-primary bg-transparent text-primary hover:bg-primary/5 active:bg-primary/10 rounded-full',
        ghost:
          'bg-transparent text-foreground hover:bg-accent/40 active:bg-accent/60 rounded-lg',
        link: 'text-muted-foreground underline-offset-4 hover:underline hover:text-foreground p-0 h-auto',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/95 rounded-full shadow-sm',
      },
      size: {
        sm: 'h-9 px-5 text-caption has-[>svg]:px-3',
        default: 'h-11 px-6 text-body has-[>svg]:px-4',
        lg: 'h-14 px-10 text-body has-[>svg]:px-6',
        icon: 'size-11 rounded-full',
        'icon-sm': 'size-9 rounded-full',
        'icon-lg': 'size-14 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
