import Badge from "@/components/atoms/Badge";
import CountdownTimer from "@/components/molecules/CountdownTimer";

const AssignmentStatus = ({ assignment, isSubmitted, onExpire }) => {
  const now = new Date();
  const liveDate = new Date(assignment.liveDate);
  const expireDate = new Date(assignment.expireDate);

  const isExpired = now > expireDate;
  const isNotYetLive = now < liveDate;
  const isCurrentlyLive = assignment.isLive && now >= liveDate && now <= expireDate;

  if (isSubmitted) {
    return <Badge variant="submitted">Submitted</Badge>;
  }

  if (isExpired) {
    return <Badge variant="expired">Expired</Badge>;
  }

  if (isNotYetLive) {
    return <Badge variant="default">Not Live Yet</Badge>;
  }

  if (isCurrentlyLive) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="live">Live</Badge>
        <CountdownTimer 
          expireDate={assignment.expireDate}
          onExpire={onExpire}
          className="text-xs font-semibold"
        />
      </div>
    );
  }

  return <Badge variant="default">Inactive</Badge>;
};

export default AssignmentStatus;