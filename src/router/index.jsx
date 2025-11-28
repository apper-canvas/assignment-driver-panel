import React, { Suspense, lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import Layout from "@/components/organisms/Layout";

// Lazy load page components
const TeacherDashboard = lazy(() => import("@/components/pages/TeacherDashboard"));
const StudentDashboard = lazy(() => import("@/components/pages/StudentDashboard"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const loadingFallback = (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
);

export const router = (user) => {
  if (!user) {
    return createBrowserRouter([
      {
        path: "*",
        element: <div>Loading...</div>
      }
    ]);
  }

  const isTeacher = user.role === "teacher";

  const routes = [
    {
      path: "/",
      element: <Layout userId={user.userId} userRole={user.role} />,
      children: [
        {
          path: "",
          index: true,
          element: isTeacher ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/assignments" replace />
          )
        },
        // Teacher routes
        ...(isTeacher ? [
          {
            path: "dashboard",
            element: (
              <Suspense fallback={loadingFallback}>
                <TeacherDashboard />
              </Suspense>
            )
          }
        ] : []),
        // Student routes
        ...(!isTeacher ? [
          {
            path: "assignments",
            element: (
              <Suspense fallback={loadingFallback}>
                <StudentDashboard userId={user.userId} view="assignments" />
              </Suspense>
            )
          },
          {
            path: "results", 
            element: (
              <Suspense fallback={loadingFallback}>
                <StudentDashboard userId={user.userId} view="results" />
              </Suspense>
            )
          }
        ] : []),
        {
          path: "*",
          element: (
            <Suspense fallback={loadingFallback}>
              <NotFound />
            </Suspense>
          )
        }
      ]
    }
];

  return createBrowserRouter(routes);
};