import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";

const Layout = ({ userId, userRole }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header userId={userId} userRole={userRole} />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;