import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children, 
  variant = "default", 
  size = "md",
  className,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full transition-all duration-200";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800",
    success: "bg-gradient-to-r from-green-100 to-green-200 text-green-800",
    warning: "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800",
    danger: "bg-gradient-to-r from-red-100 to-red-200 text-red-800",
    live: "bg-gradient-to-r from-green-500 to-green-600 text-white live-indicator",
    expired: "bg-gradient-to-r from-gray-500 to-gray-600 text-white",
    submitted: "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
  };
  
  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1.5 text-xs",
    lg: "px-3 py-2 text-sm"
  };
  
  return (
    <span
      ref={ref}
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;