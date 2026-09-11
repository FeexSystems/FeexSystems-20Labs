import { useEffect, useState } from "react";

interface SystemStatus {
  label: string;
  connected: boolean;
}

async function fetchSystemStatus(): Promise<SystemStatus> {
  try {
    const res = await fetch("/health", { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error("unhealthy");
    const data = await res.json();
    const isHealthy = data.status === "healthy" || data.status === "alive";
    return {
      label: isHealthy ? "World Model: Active" : "World Model: Degraded",
      connected: isHealthy,
    };
  } catch {
    return { label: "World Model: Offline", connected: false };
  }
}

export function VRHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [status, setStatus] = useState<SystemStatus>({
    label: "World Model: Connecting…",
    connected: false,
  });

  // Live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Poll server health every 30 s
  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      const s = await fetchSystemStatus();
      if (!cancelled) setStatus(s);
    };
    poll();
    const id = setInterval(poll, 30_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const formatDateTime = (date: Date) =>
    date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  return (
    <div className="vr-header">
      <div className="logo">FeexSystems</div>
      <div className="info">
        <span>{formatDateTime(currentTime)}</span>
        {" | "}
        <span
          style={{ color: status.connected ? "#34d399" : "#f59e0b" }}
          aria-label={`System status: ${status.label}`}
        >
          {status.label}
        </span>
      </div>
    </div>
  );
}

