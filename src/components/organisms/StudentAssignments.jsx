import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import AssignmentStatus from "@/components/molecules/AssignmentStatus";
import ApperIcon from "@/components/ApperIcon";
import AssignmentFilters from "@/components/molecules/AssignmentFilters";
import assignmentService from "@/services/api/assignmentService";
import submissionService from "@/services/api/submissionService";

const StudentAssignments = ({ userId, onStartAssignment }) => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    showLive: true,
    showExpired: false
  });
const loadData = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError("");
    
    try {
      const [assignmentsData, submissionsData] = await Promise.all([
        assignmentService.getFilteredAssignments(filters),
        submissionService.getByUserId(userId)
      ]);
      
      setAssignments(assignmentsData);
      setSubmissions(submissionsData);
    } catch (err) {
      setError("Failed to load assignments. Please try again.");
      console.error("Error loading assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  const isAssignmentSubmitted = (assignmentId) => {
    return submissions.some(sub => sub.assignmentId === assignmentId.toString());
  };

  const handleExpire = (assignmentId) => {
    setAssignments(prev => 
      prev.filter(assignment => assignment.Id !== assignmentId)
    );
    toast.info("Assignment has expired and is no longer available.");
  };

  if (loading) {
    return <Loading className="min-h-[400px]" />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <ErrorView message={error} onRetry={loadData} />
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Empty
          title="No Live Assignments"
          message="There are no assignments available right now. Check back later for new assignments."
          icon="BookOpen"
        />
      </div>
    );
  }

  return (
<div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
            <ApperIcon name="BookOpen" className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
            <p className="text-gray-600">Complete your assignments before they expire</p>
          </div>
        </div>
      </div>

<div className="flex gap-8">
        {/* Filter Sidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <AssignmentFilters 
            filters={filters}
            onFiltersChange={handleFilterChange}
          />
        </div>

        {/* Mobile Filter Toggle - Show on smaller screens */}
        <div className="lg:hidden w-full mb-6">
          <AssignmentFilters 
            filters={filters}
            onFiltersChange={handleFilterChange}
            compact={true}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {assignments.map(assignment => {
              const isSubmitted = isAssignmentSubmitted(assignment.Id);
              
              return (
                <Card key={assignment.Id} className="p-6 h-full">
                  <div className="flex flex-col h-full">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-bold text-lg text-gray-900 leading-tight">
                          {assignment.title}
                        </h3>
                        <AssignmentStatus 
                          assignment={assignment}
                          isSubmitted={isSubmitted}
                          onExpire={() => handleExpire(assignment.Id)}
                        />
                      </div>
                      
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {assignment.questionText}
                      </p>
                      
                      <div className="space-y-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Clock" className="w-3 h-3" />
                          <span>Expires: {new Date(assignment.expireDate).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 mt-4">
                      <Button
                        onClick={() => onStartAssignment(assignment)}
                        disabled={isSubmitted}
                        className="w-full"
                        variant={isSubmitted ? "secondary" : "primary"}
                      >
                        {isSubmitted ? (
                          <>
                            <ApperIcon name="CheckCircle" className="w-4 h-4 mr-2" />
                            Completed
                          </>
                        ) : (
                          <>
                            <ApperIcon name="Play" className="w-4 h-4 mr-2" />
                            Start Assignment
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAssignments;