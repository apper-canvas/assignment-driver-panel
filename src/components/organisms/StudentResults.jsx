import { useState, useEffect } from "react";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ScoreBadge from "@/components/molecules/ScoreBadge";
import ApperIcon from "@/components/ApperIcon";
import submissionService from "@/services/api/submissionService";
import assignmentService from "@/services/api/assignmentService";

const StudentResults = ({ userId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError("");
    
    try {
      const [submissionsData, assignmentsData] = await Promise.all([
        submissionService.getByUserId(userId),
        assignmentService.getAll()
      ]);
      
      setSubmissions(submissionsData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError("Failed to load results. Please try again.");
      console.error("Error loading results:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId]);

  const getAssignmentTitle = (assignmentId) => {
    const assignment = assignments.find(a => a.Id.toString() === assignmentId.toString());
    return assignment?.title || "Unknown Assignment";
  };

  const calculateStats = () => {
    if (submissions.length === 0) return { totalScore: 0, totalPossible: 0, percentage: 0 };
    
    const totalScore = submissions.reduce((sum, sub) => sum + sub.score, 0);
    const totalPossible = submissions.reduce((sum, sub) => sum + sub.total, 0);
    const percentage = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;
    
    return { totalScore, totalPossible, percentage };
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

  if (submissions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Empty
          title="No Submissions Yet"
          message="You haven't submitted any assignments yet. Complete some assignments to see your results here."
          icon="BarChart3"
        />
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
            <ApperIcon name="BarChart3" className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Results</h1>
            <p className="text-gray-600">Track your assignment performance and scores</p>
          </div>
        </div>

        {/* Overall Stats */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{submissions.length}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.totalScore}</div>
              <div className="text-sm text-gray-600">Points Earned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.totalPossible}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">{stats.percentage}%</div>
              <div className="text-sm text-gray-600">Average</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {submissions
          .sort((a, b) => new Date(b.submissionTime) - new Date(a.submissionTime))
          .map(submission => (
            <Card key={submission.Id} className="p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">
                    {getAssignmentTitle(submission.assignmentId)}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ApperIcon name="Clock" className="w-3 h-3" />
                    <span>
                      Submitted {format(new Date(submission.submissionTime), "MMM d, yyyy 'at' HH:mm")}
                    </span>
                  </div>
                </div>
                <ScoreBadge score={submission.score} total={submission.total} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Score:</span>
                  <span className="font-medium">
                    {submission.score}/{submission.total} points
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${submission.total > 0 ? (submission.score / submission.total) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Performance</span>
                  <span className="font-medium">
                    {submission.total > 0 ? Math.round((submission.score / submission.total) * 100) : 0}%
                  </span>
                </div>
              </div>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default StudentResults;