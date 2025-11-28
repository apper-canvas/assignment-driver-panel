import { useState, useEffect } from 'react';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';
import { assignmentService } from '@/services/api/assignmentService';

const AssignmentSummaryCards = ({ refreshTrigger }) => {
  const [summary, setSummary] = useState({
    total: 0,
    live: 0,
    expired: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);
        const data = await assignmentService.getAssignmentSummary();
        setSummary(data);
      } catch (error) {
        console.error('Failed to load assignment summary:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, [refreshTrigger]);

  const cards = [
    {
      title: 'Total Assignments',
      count: summary.total,
      icon: 'FileText',
      bgGradient: 'from-blue-100 to-blue-200',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-700'
    },
    {
      title: 'Live Assignments',
      count: summary.live,
      icon: 'Radio',
      bgGradient: 'from-green-100 to-green-200',
      iconColor: 'text-green-600',
      textColor: 'text-green-700'
    },
    {
      title: 'Expired Assignments',
      count: summary.expired,
      icon: 'Clock',
      bgGradient: 'from-red-100 to-red-200',
      iconColor: 'text-red-600',
      textColor: 'text-red-700'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <Card key={index} className="p-6 hover:shadow-card-hover transition-all duration-200">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 bg-gradient-to-br ${card.bgGradient} rounded-lg flex items-center justify-center`}>
              <ApperIcon name={card.icon} className={`w-6 h-6 ${card.iconColor}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                {card.title}
              </h3>
              <p className={`text-2xl font-bold ${card.textColor}`}>
                {card.count}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AssignmentSummaryCards;