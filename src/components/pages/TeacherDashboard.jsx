import React, { useState } from "react";
import TeacherCreateForm from "@/components/organisms/TeacherCreateForm";
import TeacherManageList from "@/components/organisms/TeacherManageList";
import AssignmentSummaryCards from "@/components/organisms/AssignmentSummaryCards";

const TeacherDashboard = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAssignmentCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="space-y-8">
          <AssignmentSummaryCards refreshTrigger={refreshTrigger} />
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <TeacherCreateForm onAssignmentCreated={handleAssignmentCreated} />
            </div>
            
            <div className="lg:col-span-3">
              <TeacherManageList refreshTrigger={refreshTrigger} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;