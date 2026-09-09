import React, { useEffect, useState } from "react";
import type { MetricsDashboardProps } from "@shared/orchestration";
import { Activity, Database, Server, Wifi } from "lucide-react";

export function MetricsDashboard(props: MetricsDashboardProps) {
  const { widget_type, status, data_points = [], summary } = props;
  const [liveHealth, setLiveHealth] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/health");
        const data = await res.json();
        if (!cancelled) setLiveHealth(data);
      } catch {
        /* non-fatal */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const maxVal = Math.max(...data_points.map((d) => d.value), 1);

  return (
    <div className="w-full h-full overflow-y-auto p-8 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
              <Activity className="text-emerald-400" size={22} />
              Platform Metrics
            </h1>
            <p className="text-xs font-mono text-zinc-500 mt-1 uppercase tracking-widest">
              {widget_type} · {status}
            </p>
          </div>
          <span
            className={`text-xs font-mono px-2.5 py-1 rounded border ${
              status === "LIVE"
                ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                : "border-zinc-600 text-zinc-400"
            }`}
          >
            {status}
          </span>
        </div>

        {summary && <p className="text-sm text-zinc-400 leading-relaxed">{summary}</p>}

        {/* Simple bar chart from data_points */}
        {data_points.length > 0 && (
          <div className="border border-zinc-800 rounded-xl bg-zinc-900/50 p-5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4">
              Series
            </h3>
            <div className="flex items-end gap-1.5 h-32">
              {data_points.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <div
                    className="w-full rounded-t bg-indigo-500/80 group-hover:bg-indigo-400 transition-colors"
                    style={{ height: `${(d.value / maxVal) * 100}%`, minHeight: 4 }}
                    title={`${d.timestamp}: ${d.value}`}
                  />
                  <span className="text-[9px] text-zinc-600 font-mono truncate w-full text-center">
                    {d.timestamp?.slice(-5) || i}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live /health snapshot */}
        {liveHealth && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <HealthCard
              icon={<Server size={16} />}
              label="Overall"
              value={liveHealth.status}
              ok={liveHealth.status === "healthy"}
            />
            <HealthCard
              icon={<Database size={16} />}
              label="Database"
              value={liveHealth.services?.database?.status || "—"}
              ok={liveHealth.services?.database?.status === "healthy"}
            />
            <HealthCard
              icon={<Wifi size={16} />}
              label="Redis"
              value={liveHealth.services?.redis?.status || "—"}
              ok={liveHealth.services?.redis?.status === "healthy"}
            />
          </div>
        )}

        {liveHealth?.uptime != null && (
          <p className="text-xs font-mono text-zinc-600">
            uptime {Math.round(liveHealth.uptime)}s · mem RSS{" "}
            {liveHealth.memory?.rss
              ? `${Math.round(liveHealth.memory.rss / 1024 / 1024)}MB`
              : "—"}
          </p>
        )}
      </div>
    </div>
  );
}

function HealthCard({
  icon,
  label,
  value,
  ok,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  ok: boolean;
}) {
  return (
    <div className="border border-zinc-800 rounded-xl bg-zinc-900/60 p-4 flex items-center gap-3">
      <div className={`p-2 rounded-lg ${ok ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
        {icon}
      </div>
      <div>
        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">{label}</div>
        <div className={`text-sm font-medium ${ok ? "text-emerald-300" : "text-amber-300"}`}>{value}</div>
      </div>
    </div>
  );
}
