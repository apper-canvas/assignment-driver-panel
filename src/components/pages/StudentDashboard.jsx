import { useState } from "react";
import StudentAssignments from "@/components/organisms/StudentAssignments";
import StudentResults from "@/components/organisms/StudentResults";
import AssignmentModal from "@/components/organisms/AssignmentModal";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const StudentDashboard = ({ userId }) => {
  const [currentView, setCurrentView] = useState("assignments");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleStartAssignment = (assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleCloseModal = () => {
    setSelectedAssignment(null);
  };

  const handleSubmissionComplete = () => {
    setRefreshTrigger(prev => prev + 1);
    setSelectedAssignment(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setCurrentView("assignments")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                currentView === "assignments"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <ApperIcon name="BookOpen" className="w-4 h-4" />
                Live Assignments
              </div>
            </button>
            
            <button
              onClick={() => setCurrentView("results")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                currentView === "results"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <ApperIcon name="BarChart3" className="w-4 h-4" />
                My Results
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="py-8">
        {currentView === "assignments" ? (
          <StudentAssignments 
            key={refreshTrigger}
            userId={userId}
            onStartAssignment={handleStartAssignment}
          />
        ) : (
          <StudentResults 
            key={refreshTrigger}
            userId={userId}
          />
        )}
      </div>

      {/* Assignment Modal */}
      {selectedAssignment && (
        <AssignmentModal
          assignment={selectedAssignment}
          userId={userId}
          onClose={handleCloseModal}
          onSubmitted={handleSubmissionComplete}
        />
      )}
    </div>
  );
};

export default StudentDashboard;