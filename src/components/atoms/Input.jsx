import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className,
  type = "text",
  error,
  ...props 
}, ref) => {
  const baseClasses = "form-input w-full px-4 py-2.5 rounded-lg border-2 transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 focus:outline-none";
  const errorClasses = error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-blue-500 focus:ring-blue-500";
  
  return (
    <input
      type={type}
      ref={ref}
      className={cn(baseClasses, errorClasses, className)}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;