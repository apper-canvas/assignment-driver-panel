import { useState } from "react";
import TeacherCreateForm from "@/components/organisms/TeacherCreateForm";
import TeacherManageList from "@/components/organisms/TeacherManageList";

const TeacherDashboard = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAssignmentCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Teacher Dashboard</h1>
          <p className="text-gray-600">Create and manage assignments for your students</p>
        </div>

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
  );
};

export default TeacherDashboard;