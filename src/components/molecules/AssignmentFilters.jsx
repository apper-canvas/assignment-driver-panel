import { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Switch from "@/components/atoms/Switch";
import Label from "@/components/atoms/Label";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";

const AssignmentFilters = ({ filters, onFiltersChange, compact = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterUpdate = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      startDate: "",
      endDate: "",
      showLive: true,
      showExpired: false
    });
  };

  const hasActiveFilters = filters.startDate || filters.endDate || !filters.showLive || filters.showExpired;

  if (compact) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ApperIcon name="Filter" className="w-4 h-4 text-gray-600" />
            <h3 className="font-medium text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <ApperIcon 
              name={isExpanded ? "ChevronUp" : "ChevronDown"} 
              className="w-4 h-4" 
            />
          </Button>
        </div>

        {isExpanded && (
          <div className="space-y-4">
            {/* Date Range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Start Date">
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterUpdate("startDate", e.target.value)}
                  className="text-sm"
                />
              </FormField>
              <FormField label="End Date">
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterUpdate("endDate", e.target.value)}
                  className="text-sm"
                />
              </FormField>
            </div>

            {/* Status Filters */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-gray-700">Assignment Status</h4>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={filters.showLive}
                    onChange={(checked) => handleFilterUpdate("showLive", checked)}
                  />
                  <Label className="text-sm">Show Live</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={filters.showExpired}
                    onChange={(checked) => handleFilterUpdate("showExpired", checked)}
                  />
                  <Label className="text-sm">Show Expired</Label>
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="pt-3 border-t border-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ApperIcon name="X" className="w-3 h-3 mr-1" />
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card className="p-6 h-fit sticky top-6">
      <div className="flex items-center gap-2 mb-6">
        <ApperIcon name="Filter" className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Filter Assignments</h3>
        {hasActiveFilters && (
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        )}
      </div>

      <div className="space-y-6">
        {/* Date Range Section */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 flex items-center gap-2">
            <ApperIcon name="Calendar" className="w-4 h-4" />
            Date Range
          </h4>
          
          <FormField label="Start Date">
            <Input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterUpdate("startDate", e.target.value)}
              placeholder="Select start date"
            />
          </FormField>

          <FormField label="End Date">
            <Input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterUpdate("endDate", e.target.value)}
              placeholder="Select end date"
              min={filters.startDate || undefined}
            />
          </FormField>
        </div>

        {/* Status Section */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 flex items-center gap-2">
            <ApperIcon name="Clock" className="w-4 h-4" />
            Assignment Status
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <Label className="font-medium">Live Assignments</Label>
              </div>
              <Switch
                checked={filters.showLive}
                onChange={(checked) => handleFilterUpdate("showLive", checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <Label className="font-medium">Expired Assignments</Label>
              </div>
              <Switch
                checked={filters.showExpired}
                onChange={(checked) => handleFilterUpdate("showExpired", checked)}
              />
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={clearAllFilters}
              className="w-full text-gray-600 hover:text-gray-900"
            >
              <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Filter Summary */}
        {hasActiveFilters && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2 text-sm">Active Filters:</h5>
            <div className="space-y-1 text-xs text-blue-700">
              {filters.startDate && (
                <div>• Start: {new Date(filters.startDate).toLocaleDateString()}</div>
              )}
              {filters.endDate && (
                <div>• End: {new Date(filters.endDate).toLocaleDateString()}</div>
              )}
              {filters.showLive && <div>• Live assignments included</div>}
              {filters.showExpired && <div>• Expired assignments included</div>}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AssignmentFilters;