/**
 * AuroraBackground Component
 *
 * Provides consistent background styling across all pages:
 * - variant="full": 3-layer subtle yellow aurora for hero sections
 * - variant="base": Solid #101010 background for content sections (no extra DOM)
 *
 * ROASEQ palette: black #101010, yellow #f2ff00, white #ffffff. The aurora
 * effect uses subtle yellow glows (not pink/red) to stay on-brand.
 */

export function AuroraBackground({ variant = "base", className = "", children }) {
  if (variant === "full") {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Subtle yellow streak */}
          <div
            className="absolute top-[10%] left-0 w-[100%] h-[600px] blur-[100px] mix-blend-screen opacity-30 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(242, 255, 0, 0.15), transparent)",
              transform: "rotate(-12deg)",
            }}
          />

          {/* Second subtle yellow streak (intersection) */}
          <div
            className="absolute top-[20%] right-0 w-[100%] h-[400px] blur-[80px] mix-blend-screen opacity-20"
            style={{
              background:
                "linear-gradient(to left, transparent, rgba(242, 255, 0, 0.1), transparent)",
              transform: "rotate(6deg)",
            }}
          />

          {/* Deep vignette to keep edges dark */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at center, transparent 0%, #101010 80%)",
            }}
          />
        </div>

        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }

  // variant="base" - just provides a wrapper (no extra DOM beyond children)
  return (
    <div className={className}>
      {children}
    </div>
  );
}
