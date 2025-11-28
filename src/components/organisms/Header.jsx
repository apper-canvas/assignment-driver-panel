import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const Header = ({ userId, userRole }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <ApperIcon name="GraduationCap" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white gradient-text-white">
                Assignment Hub
              </h1>
              <p className="text-blue-100 text-xs">
                Educational Management System
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-blue-100 text-sm">User ID:</span>
              <Badge variant="primary" className="bg-blue-500 bg-opacity-20 text-blue-100 border border-blue-300">
                {userId}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-blue-100 text-sm">Role:</span>
              <Badge 
                variant={userRole === "teacher" ? "warning" : "success"}
                className="capitalize font-medium"
              >
                {userRole}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;