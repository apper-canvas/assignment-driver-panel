import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Switch from "@/components/atoms/Switch";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ScoreBadge from "@/components/molecules/ScoreBadge";
import ApperIcon from "@/components/ApperIcon";
import submissionService from "@/services/api/submissionService";
import assignmentService from "@/services/api/assignmentService";
import Chart from "react-apexcharts";

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

const [chartView, setChartView] = useState('time'); // 'time' or 'assignments'

  const calculateStats = () => {
    if (submissions.length === 0) return { totalScore: 0, totalPossible: 0, percentage: 0 };
    
    const totalScore = submissions.reduce((sum, sub) => sum + sub.score, 0);
    const totalPossible = submissions.reduce((sum, sub) => sum + sub.total, 0);
    const percentage = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;
    
    return { totalScore, totalPossible, percentage };
  };

  const timeSeriesData = useMemo(() => {
    if (submissions.length === 0) return { series: [], categories: [] };
    
    const sortedSubmissions = [...submissions].sort((a, b) => 
      new Date(a.submissionTime) - new Date(b.submissionTime)
    );
    
    const categories = sortedSubmissions.map(sub => 
      format(new Date(sub.submissionTime), "MMM d")
    );
    
    const percentageData = sortedSubmissions.map(sub => 
      sub.total > 0 ? Math.round((sub.score / sub.total) * 100) : 0
    );
    
    return {
      series: [{
        name: 'Performance %',
        data: percentageData,
        color: '#2563eb'
      }],
      categories
    };
  }, [submissions]);

  const assignmentData = useMemo(() => {
    if (submissions.length === 0) return { series: [], categories: [] };
    
    const assignmentPerformance = submissions.map(sub => ({
      name: getAssignmentTitle(sub.assignmentId),
      percentage: sub.total > 0 ? Math.round((sub.score / sub.total) * 100) : 0
    }));
    
    const categories = assignmentPerformance.map(item => item.name);
    const data = assignmentPerformance.map(item => item.percentage);
    
    return {
      series: [{
        name: 'Performance %',
        data,
        color: '#10b981'
      }],
      categories
    };
  }, [submissions, assignments]);

  const chartOptions = {
    chart: {
      type: chartView === 'time' ? 'line' : 'bar',
      toolbar: { show: false },
      background: 'transparent',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    colors: [chartView === 'time' ? '#2563eb' : '#10b981'],
    dataLabels: { enabled: false },
    stroke: chartView === 'time' ? {
      curve: 'smooth',
      width: 3
    } : { width: 0 },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } }
    },
    xaxis: {
      categories: chartView === 'time' ? timeSeriesData.categories : assignmentData.categories,
      labels: {
        style: { colors: '#6b7280', fontSize: '12px' },
        rotate: -45,
        maxHeight: 60
      },
      axisBorder: { color: '#e5e7eb' },
      axisTicks: { color: '#e5e7eb' }
    },
    yaxis: {
      min: 0,
      max: 100,
      labels: {
        style: { colors: '#6b7280', fontSize: '12px' },
        formatter: (value) => `${value}%`
      }
    },
    tooltip: {
      theme: 'light',
      y: { formatter: (value) => `${value}%` }
    },
    responsive: [{
      breakpoint: 768,
      options: {
        chart: { height: 300 },
        xaxis: { labels: { rotate: -45, maxHeight: 40 } }
      }
    }]
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

        {/* Performance Chart */}
        {submissions.length > 0 && (
          <Card className="p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Performance Visualization</h2>
                <p className="text-sm text-gray-600">
                  {chartView === 'time' 
                    ? 'Track your performance trends over time' 
                    : 'Compare your scores across different assignments'
                  }
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ApperIcon name="TrendingUp" className="w-4 h-4" />
                  <span>Over Time</span>
                </div>
                <Switch
                  checked={chartView === 'assignments'}
                  onCheckedChange={(checked) => setChartView(checked ? 'assignments' : 'time')}
                />
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ApperIcon name="BarChart3" className="w-4 h-4" />
                  <span>By Assignment</span>
                </div>
              </div>
            </div>
            
            <div className="w-full">
              <Chart
                options={chartOptions}
                series={chartView === 'time' ? timeSeriesData.series : assignmentData.series}
                type={chartView === 'time' ? 'line' : 'bar'}
                height={400}
                width="100%"
              />
            </div>
          </Card>
        )}
      </div>

{/* Individual Assignment Results */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <ApperIcon name="FileText" className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Assignment Details</h2>
          </div>
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