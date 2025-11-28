import { useState } from "react";
import StudentAssignments from "@/components/organisms/StudentAssignments";
import StudentResults from "@/components/organisms/StudentResults";
import AssignmentModal from "@/components/organisms/AssignmentModal";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const StudentDashboard = ({ userId, view = "assignments" }) => {
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
      <div className="py-8">
        {view === "assignments" ? (
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