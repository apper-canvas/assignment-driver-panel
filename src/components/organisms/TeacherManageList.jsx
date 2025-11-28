import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import assignmentService from "@/services/api/assignmentService";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Switch from "@/components/atoms/Switch";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const TeacherManageList = ({ refreshTrigger }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

const loadAssignments = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await assignmentService.getAll();
      setAssignments(data);
    } catch (err) {
      setError("Failed to load assignments. Please try again.");
      console.error("Error loading assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, [refreshTrigger]);

  const handleDelete = async (id) => {
    try {
      await assignmentService.delete(id);
      toast.success("Assignment deleted successfully!");
      setAssignments(prev => prev.filter(assignment => assignment.Id !== id));
    } catch (error) {
      toast.error("Failed to delete assignment. Please try again.");
      console.error("Error deleting assignment:", error);
    }
  };
  const handleToggleLive = async (assignmentId, currentStatus) => {
    try {
      const updatedAssignment = await assignmentService.toggleLiveStatus(assignmentId);
      
      if (updatedAssignment) {
        setAssignments(prev =>
          prev.map(assignment =>
            assignment.Id === assignmentId
              ? { ...assignment, isLive: updatedAssignment.isLive }
              : assignment
          )
        );
        
        const status = updatedAssignment.isLive ? "activated" : "deactivated";
        toast.success(`Assignment ${status} successfully!`);
      }
    } catch (err) {
      toast.error("Failed to update assignment status");
      console.error("Error toggling live status:", err);
    }
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600">Loading assignments...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <ErrorView message={error} onRetry={loadAssignments} />
      </Card>
    );
  }

  if (assignments.length === 0) {
    return (
      <Card className="p-6">
        <Empty
          title="No Assignments Yet"
          message="You haven't created any assignments yet. Use the form on the left to create your first assignment."
          icon="FileText"
        />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
          <ApperIcon name="List" className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Manage Assignments</h2>
          <p className="text-gray-600 text-sm">{assignments.length} assignment(s) total</p>
        </div>
      </div>

      <div className="space-y-4">
        {assignments.map(assignment => {
          const liveDate = new Date(assignment.liveDate);
          const expireDate = new Date(assignment.expireDate);
          
          return (
            <div key={assignment.Id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-start gap-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{assignment.title}</h3>
                    <Badge variant={assignment.isLive ? "live" : "default"}>
                      {assignment.isLive ? "Live" : "Inactive"}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {assignment.questionText}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Calendar" className="w-3 h-3" />
                      <span>Live: {format(liveDate, "MMM d, yyyy HH:mm")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ApperIcon name="Clock" className="w-3 h-3" />
                      <span>Expires: {format(expireDate, "MMM d, yyyy HH:mm")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ApperIcon name="CheckCircle" className="w-3 h-3" />
                      <span>Answer: <strong>Option {assignment.correctAnswer}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <Switch
                    checked={assignment.isLive}
                    onChange={() => handleToggleLive(assignment.Id, assignment.isLive)}
                  />
                  <span className="text-xs text-gray-500">
                    {assignment.isLive ? "Deactivate" : "Activate"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default TeacherManageList;