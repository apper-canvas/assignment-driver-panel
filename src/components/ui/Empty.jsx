import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title, 
  message, 
  actionLabel, 
  onAction, 
  icon = "FileText",
  className, 
  ...props 
}) => {
  return (
    <div className={cn("flex items-center justify-center p-8 min-h-[300px]", className)} {...props}>
      <div className="text-center space-y-6 max-w-md mx-auto">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="w-10 h-10 text-slate-600" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">
            {title || "No items found"}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {message || "Get started by creating your first item."}
          </p>
        </div>

        {onAction && actionLabel && (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default Empty;