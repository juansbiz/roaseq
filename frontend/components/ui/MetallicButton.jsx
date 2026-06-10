import { forwardRef, memo } from "react";
import { cn } from "@/lib/utils";

/**
 * MetallicButton - Primary CTA button (ROASEQ flat-yellow style, ROASEQ-aligned)
 *
 * Provides a flat yellow CTA matching the ROASEQ unified design system.
 * Replaces the previous metallic-chrome pink glow with a clean, flat, accessible
 * button per the ROASEQ palette: yellow #f2ff00 on dark #101010.
 *
 * @example
 * <MetallicButton variant="primary" onClick={handleClick}>
 *   Click Me
 * </MetallicButton>
 */
const MetallicButton = memo(
  forwardRef(
    (
      {
        children,
        variant = "primary",
        size = "md",
        className,
        disabled = false,
        ...props
      },
      ref,
    ) => {
      const sizeClasses = {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base",
      };

      const variantClasses = {
        primary: "btn-primary",
        secondary: "btn-secondary",
      };

      return (
        <button
          ref={ref}
          disabled={disabled}
          className={cn(
            variantClasses[variant],
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
            sizeClasses[size],
            className,
          )}
          {...props}
        >
          {children}
        </button>
      );
    },
  ),
);

MetallicButton.displayName = "MetallicButton";

export default MetallicButton;
