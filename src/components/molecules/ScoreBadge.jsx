import Badge from "@/components/atoms/Badge";

const ScoreBadge = ({ score, total, className }) => {
  const percentage = total > 0 ? (score / total) * 100 : 0;
  
  const getVariant = () => {
    if (percentage === 100) return "success";
    if (percentage >= 50) return "warning";
    return "danger";
  };

  const getScoreClass = () => {
    if (percentage === 100) return "full-score";
    if (percentage >= 50) return "partial-score";
    return "zero-score";
  };

  return (
    <Badge 
      variant={getVariant()}
      className={`score-badge ${getScoreClass()} ${className}`}
    >
      {score}/{total}
    </Badge>
  );
};

export default ScoreBadge;