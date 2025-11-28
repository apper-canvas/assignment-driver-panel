import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Switch = forwardRef(({ 
  checked, 
  onChange, 
  disabled,
  className,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "toggle-switch relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        checked ? "bg-gradient-to-r from-green-600 to-green-700" : "bg-gray-300",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-150 shadow-sm",
          checked ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
});

Switch.displayName = "Switch";

export default Switch;