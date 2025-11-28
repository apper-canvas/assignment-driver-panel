import { Outlet, useLocation, useNavigate } from "react-router-dom";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Header from "@/components/organisms/Header";

function Layout({ userId, userRole }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isStudent = userRole === "student";
return (
    <div className="min-h-screen bg-slate-50">
    <Header userId={userId} userRole={userRole} />
    {/* Student Navigation Tabs */}
    {isStudent && <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6">
            <div className="flex space-x-8">
                <button
                    onClick={() => navigate("/assignments")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${location.pathname === "/assignments" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
                    <div className="flex items-center gap-2">
                        <ApperIcon name="BookOpen" className="w-4 h-4" />Live Assignments
                                        </div>
                </button>
                <button
                    onClick={() => navigate("/results")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${location.pathname === "/results" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}>
                    <div className="flex items-center gap-2">
                        <ApperIcon name="BarChart3" className="w-4 h-4" />My Results
                                        </div>
                </button>
            </div>
        </div>
    </div>}
    <main>
        <Outlet />
    </main>
</div>
  );
};

export default Layout;