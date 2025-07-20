import { useEffect, useState } from "react";

export function VRHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="vr-header">
      <div className="logo">FeexSystems</div>
      <div className="info">
        <span>{formatDateTime(currentTime)}</span> | Grok 4 Heavy (4.2.1,
        G4H-Prime) | Colossus: Active, 100% Connection
      </div>
    </div>
  );
}
