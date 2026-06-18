/**
 * FeatureList - Renders a list of features with bullet indicators.
 * Uses the design system's primary color for bullet dots.
 */

interface FeatureListProps {
  features: string[]
}

export function FeatureList({ features }: FeatureListProps) {
  return (
    <ul className="flex flex-col gap-5" role="list">
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-4">
          <span
            className="mt-1.5 h-3 w-3 shrink-0 rounded-full bg-primary"
            aria-hidden="true"
          />
          <span className="text-body font-medium text-foreground leading-relaxed">
            {feature}
          </span>
        </li>
      ))}
    </ul>
  )
}
