import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className,
  hover = true,
  ...props 
}, ref) => {
  const baseClasses = "bg-white rounded-lg shadow-card border border-gray-100 transition-all duration-200";
  const hoverClasses = hover ? "assignment-card" : "";
  
  return (
    <div
      ref={ref}
      className={cn(baseClasses, hoverClasses, className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;