import { cn } from "@/utils/cn";

const Loading = ({ className, ...props }) => {
  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50", className)} {...props}>
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-gray-700">Loading Assignment Hub</p>
          <p className="text-sm text-gray-500">Please wait while we fetch your assignments...</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;