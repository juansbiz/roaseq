import React from "react";
import { cn } from "@/lib/utils";

/**
 * StylizedButton - ROASEQ flat-yellow CTA (ROASEQ-aligned)
 * Replaces the previous metallic-chrome pink-glow variant.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional classes for button wrapper
 * @param {'sm'|'md'|'lg'} props.size - Button size (default: 'lg')
 * @param {string} props.type - Button type attribute (default: 'button')
 */
export const StylizedButton = ({
  children,
  onClick,
  className = "",
  size = "lg",
  type = "button",
  ...props
}) => {
  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={cn("btn-primary", sizeClasses[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default StylizedButton;
