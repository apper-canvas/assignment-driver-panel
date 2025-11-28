import { useState, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { router } from "@/router";
import Loading from "@/components/ui/Loading";

const __firebase_config = {
  apiKey: "mock-api-key",
  authDomain: "assignment-hub.firebaseapp.com",
  projectId: "assignment-hub",
  storageBucket: "assignment-hub.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const __initial_auth_token = "TEACHER_ID_PLACEHOLDER";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate Firebase authentication
    const initializeAuth = async () => {
      try {
        // Simulate auth check with delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        let userId;
        
        // Try to authenticate with initial token
        if (__initial_auth_token) {
          userId = __initial_auth_token;
        } else {
          // Fallback to anonymous sign-in
          userId = "anonymous_" + Math.random().toString(36).substr(2, 9);
        }
        
        // Determine user role based on userId
        const IS_TEACHER = userId === "TEACHER_ID_PLACEHOLDER";
        const userRole = IS_TEACHER ? "teacher" : "student";
        
        setUser({
          userId,
          role: userRole
        });
      } catch (error) {
        console.error("Authentication error:", error);
        // Fallback authentication
        setUser({
          userId: "guest_" + Math.random().toString(36).substr(2, 9),
          role: "student"
        });
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  if (loading) {
    return <Loading />;
  }

  // Create router with user context
  const routerWithContext = router(user);

  return (
    <>
      <RouterProvider router={routerWithContext} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;