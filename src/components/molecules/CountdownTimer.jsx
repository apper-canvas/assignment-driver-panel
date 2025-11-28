import { useState, useEffect } from "react";
import { format, differenceInSeconds } from "date-fns";

const CountdownTimer = ({ expireDate, onExpire, className }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const expire = new Date(expireDate);
      const seconds = differenceInSeconds(expire, now);
      return Math.max(0, seconds);
    };

    const updateTimer = () => {
      const seconds = calculateTimeLeft();
      setTimeLeft(seconds);
      
      if (seconds === 0 && onExpire) {
        onExpire();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expireDate, onExpire]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${minutes}m ${seconds}s`;
  };

  const isExpiringSoon = timeLeft <= 300; // 5 minutes

  return (
    <div className={`countdown-timer ${isExpiringSoon ? 'text-red-600' : 'text-amber-600'} ${className}`}>
      {timeLeft > 0 ? formatTime(timeLeft) : "Expired"}
    </div>
  );
};

export default CountdownTimer;