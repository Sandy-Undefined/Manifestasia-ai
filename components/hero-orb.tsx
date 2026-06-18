/**
 * HeroOrb - Concentric radial gradient orb for the Manifestasia brand hero.
 * Renders layered peach/blush circles with a smooth pulsing animation.
 * Mobile-only design, centered within its container.
 */
export function HeroOrb() {
  return (
    <div
      className="relative mx-auto flex items-center justify-center"
      aria-hidden="true"
    >
      {/* Outer glow - pulsing */}
      <div
        className="relative h-72 w-72 rounded-full bg-secondary/40"
        style={{ animation: 'orb-pulse 4s ease-in-out infinite' }}
      >
        {/* Middle ring */}
        <div
          className="absolute inset-4 rounded-full bg-secondary/60"
          style={{ animation: 'orb-pulse 4s ease-in-out infinite 0.3s' }}
        >
          {/* Inner warm glow */}
          <div
            className="absolute inset-6 rounded-full bg-secondary/80"
            style={{ animation: 'orb-pulse 4s ease-in-out infinite 0.6s' }}
          >
            {/* Core highlight */}
            <div
              className="absolute inset-8 rounded-full bg-tertiary/50"
              style={{ animation: 'orb-pulse 4s ease-in-out infinite 0.9s' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
