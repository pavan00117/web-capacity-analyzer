import React, { useState } from 'react';
import { LoadTestPoint, PerformanceThresholds } from '../../types';

interface PerformanceChartsProps {
  dataPoints: LoadTestPoint[];
  thresholds: PerformanceThresholds;
}

export const PerformanceCharts: React.FC<PerformanceChartsProps> = ({
  dataPoints,
  thresholds
}) => {
  const [activeTooltip, setActiveTooltip] = useState<{
    x: number;
    y: number;
    title: string;
    details: string[];
  } | null>(null);

  if (!dataPoints || dataPoints.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
        No load test metrics available to plot.
      </div>
    );
  }

  // Chart dimensions
  const width = 380;
  const height = 180;
  const padding = { top: 20, right: 25, bottom: 30, left: 45 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxUsers = Math.max(...dataPoints.map((d) => d.virtualUsers), 10);
  const minUsers = Math.min(...dataPoints.map((d) => d.virtualUsers), 0);

  // Coordinate mappers
  const getX = (vu: number) => {
    if (maxUsers === minUsers) return padding.left + chartW / 2;
    return padding.left + ((vu - minUsers) / (maxUsers - minUsers)) * chartW;
  };

  // 1. LATENCY CHART CALCULATIONS
  const maxLatency = Math.max(
    ...dataPoints.map((d) => Math.max(d.avgResponseTimeMs, d.p95ResponseTimeMs)),
    thresholds.avgResponseTimeMs * 1.25,
    1200
  );
  const getYLatency = (ms: number) => {
    return padding.top + chartH - (ms / maxLatency) * chartH;
  };

  // 2. THROUGHPUT (RPS) CHART CALCULATIONS
  const maxRps = Math.max(...dataPoints.map((d) => d.requestsPerSecond), 100) * 1.2;
  const getYRps = (rps: number) => {
    return padding.top + chartH - (rps / maxRps) * chartH;
  };

  // 3. ERROR RATE CHART CALCULATIONS
  const maxError = Math.max(...dataPoints.map((d) => d.errorRatePercent), thresholds.errorRatePercent * 1.5, 10);
  const getYError = (err: number) => {
    return padding.top + chartH - (err / maxError) * chartH;
  };

  // Generate SVG path string
  const createPath = (getY: (val: number) => number, key: keyof LoadTestPoint) => {
    return dataPoints.reduce((acc, point, index) => {
      const x = getX(point.virtualUsers);
      const y = getY(Number(point[key]) || 0);
      return index === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. USERS VS RESPONSE TIME */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="text-sm font-bold text-white">Users vs Response Time</h4>
            <p className="text-xs text-slate-400">Average & P95 latency vs SLA threshold</p>
          </div>
          <span className="text-[11px] font-mono text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800">
            SLA: {thresholds.avgResponseTimeMs}ms
          </span>
        </div>

        <div className="relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
            {/* Grid Lines */}
            <line
              x1={padding.left}
              y1={padding.top}
              x2={width - padding.right}
              y2={padding.top}
              stroke="#334155"
              strokeDasharray="3 3"
              strokeWidth="0.8"
            />
            <line
              x1={padding.left}
              y1={padding.top + chartH / 2}
              x2={width - padding.right}
              y2={padding.top + chartH / 2}
              stroke="#334155"
              strokeDasharray="3 3"
              strokeWidth="0.8"
            />
            <line
              x1={padding.left}
              y1={padding.top + chartH}
              x2={width - padding.right}
              y2={padding.top + chartH}
              stroke="#475569"
              strokeWidth="1"
            />

            {/* Threshold Line (Red Dash) */}
            <line
              x1={padding.left}
              y1={getYLatency(thresholds.avgResponseTimeMs)}
              x2={width - padding.right}
              y2={getYLatency(thresholds.avgResponseTimeMs)}
              stroke="#f43f5e"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />

            {/* P95 Curve (Indigo) */}
            <path
              d={createPath(getYLatency, 'p95ResponseTimeMs')}
              fill="none"
              stroke="#818cf8"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />

            {/* Avg Response Time Line (Sky Blue) */}
            <path
              d={createPath(getYLatency, 'avgResponseTimeMs')}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Data Circles */}
            {dataPoints.map((pt, i) => (
              <g key={i}>
                <circle
                  cx={getX(pt.virtualUsers)}
                  cy={getYLatency(pt.avgResponseTimeMs)}
                  r="4"
                  fill="#0284c7"
                  stroke="#e0f2fe"
                  strokeWidth="1.5"
                  className="cursor-pointer hover:r-6 transition-all"
                  onMouseEnter={() =>
                    setActiveTooltip({
                      x: getX(pt.virtualUsers),
                      y: getYLatency(pt.avgResponseTimeMs),
                      title: `${pt.virtualUsers} Virtual Users`,
                      details: [
                        `Avg Latency: ${pt.avgResponseTimeMs} ms`,
                        `P95 Latency: ${pt.p95ResponseTimeMs} ms`,
                        `Threshold: ${thresholds.avgResponseTimeMs} ms`
                      ]
                    })
                  }
                  onMouseLeave={() => setActiveTooltip(null)}
                />
              </g>
            ))}

            {/* Axis Labels */}
            <text x={padding.left} y={padding.top - 6} fill="#94a3b8" fontSize="9" textAnchor="start">
              {Math.round(maxLatency)}ms
            </text>
            <text x={padding.left - 6} y={padding.top + chartH + 3} fill="#64748b" fontSize="9" textAnchor="end">
              0ms
            </text>
            {dataPoints.map((pt, i) => (
              <text
                key={i}
                x={getX(pt.virtualUsers)}
                y={padding.top + chartH + 16}
                fill="#94a3b8"
                fontSize="9"
                textAnchor="middle"
              >
                {pt.virtualUsers} VU
              </text>
            ))}
          </svg>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-sky-400 rounded-full"></span>
            <span>Avg Response</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-indigo-400 rounded-full"></span>
            <span>P95 Latency</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-rose-500 rounded-full border border-dashed"></span>
            <span>Threshold</span>
          </div>
        </div>
      </div>

      {/* 2. USERS VS THROUGHPUT (RPS) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="text-sm font-bold text-white">Users vs Throughput</h4>
            <p className="text-xs text-slate-400">Total requests processed per second</p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
            Peak: {Math.max(...dataPoints.map((d) => d.requestsPerSecond)).toFixed(0)} RPS
          </span>
        </div>

        <div className="relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
            {/* Grid Lines */}
            <line
              x1={padding.left}
              y1={padding.top}
              x2={width - padding.right}
              y2={padding.top}
              stroke="#334155"
              strokeDasharray="3 3"
              strokeWidth="0.8"
            />
            <line
              x1={padding.left}
              y1={padding.top + chartH / 2}
              x2={width - padding.right}
              y2={padding.top + chartH / 2}
              stroke="#334155"
              strokeDasharray="3 3"
              strokeWidth="0.8"
            />
            <line
              x1={padding.left}
              y1={padding.top + chartH}
              x2={width - padding.right}
              y2={padding.top + chartH}
              stroke="#475569"
              strokeWidth="1"
            />

            {/* Throughput Curve (Emerald Green) */}
            <path
              d={createPath(getYRps, 'requestsPerSecond')}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Points */}
            {dataPoints.map((pt, i) => (
              <circle
                key={i}
                cx={getX(pt.virtualUsers)}
                cy={getYRps(pt.requestsPerSecond)}
                r="4"
                fill="#059669"
                stroke="#d1fae5"
                strokeWidth="1.5"
                className="cursor-pointer hover:r-6 transition-all"
                onMouseEnter={() =>
                  setActiveTooltip({
                    x: getX(pt.virtualUsers),
                    y: getYRps(pt.requestsPerSecond),
                    title: `${pt.virtualUsers} Virtual Users`,
                    details: [
                      `Throughput: ${pt.requestsPerSecond.toFixed(1)} req/sec`,
                      `Total Volume: ${pt.totalRequests.toLocaleString()} reqs`
                    ]
                  })
                }
                onMouseLeave={() => setActiveTooltip(null)}
              />
            ))}

            {/* Axis Labels */}
            <text x={padding.left} y={padding.top - 6} fill="#94a3b8" fontSize="9" textAnchor="start">
              {Math.round(maxRps)} RPS
            </text>
            <text x={padding.left - 6} y={padding.top + chartH + 3} fill="#64748b" fontSize="9" textAnchor="end">
              0
            </text>
            {dataPoints.map((pt, i) => (
              <text
                key={i}
                x={getX(pt.virtualUsers)}
                y={padding.top + chartH + 16}
                fill="#94a3b8"
                fontSize="9"
                textAnchor="middle"
              >
                {pt.virtualUsers} VU
              </text>
            ))}
          </svg>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-emerald-400 rounded-full"></span>
            <span>Requests/Sec (Throughput)</span>
          </div>
          <span>Ideal: Linear Scaling Curve</span>
        </div>
      </div>

      {/* 3. USERS VS ERROR RATE */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="text-sm font-bold text-white">Users vs Error Rate</h4>
            <p className="text-xs text-slate-400">HTTP 5xx & connection timeouts</p>
          </div>
          <span className="text-[11px] font-mono text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">
            Limit: {thresholds.errorRatePercent}%
          </span>
        </div>

        <div className="relative">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
            {/* Grid */}
            <line
              x1={padding.left}
              y1={padding.top}
              x2={width - padding.right}
              y2={padding.top}
              stroke="#334155"
              strokeDasharray="3 3"
              strokeWidth="0.8"
            />
            <line
              x1={padding.left}
              y1={padding.top + chartH / 2}
              x2={width - padding.right}
              y2={padding.top + chartH / 2}
              stroke="#334155"
              strokeDasharray="3 3"
              strokeWidth="0.8"
            />
            <line
              x1={padding.left}
              y1={padding.top + chartH}
              x2={width - padding.right}
              y2={padding.top + chartH}
              stroke="#475569"
              strokeWidth="1"
            />

            {/* Error Threshold Line (Amber/Rose) */}
            <line
              x1={padding.left}
              y1={getYError(thresholds.errorRatePercent)}
              x2={width - padding.right}
              y2={getYError(thresholds.errorRatePercent)}
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />

            {/* Error Rate Curve */}
            <path
              d={createPath(getYError, 'errorRatePercent')}
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Points */}
            {dataPoints.map((pt, i) => (
              <circle
                key={i}
                cx={getX(pt.virtualUsers)}
                cy={getYError(pt.errorRatePercent)}
                r="4"
                fill={pt.errorRatePercent > thresholds.errorRatePercent ? '#e11d48' : '#10b981'}
                stroke="#fff"
                strokeWidth="1.5"
                className="cursor-pointer hover:r-6 transition-all"
                onMouseEnter={() =>
                  setActiveTooltip({
                    x: getX(pt.virtualUsers),
                    y: getYError(pt.errorRatePercent),
                    title: `${pt.virtualUsers} Virtual Users`,
                    details: [
                      `Error Rate: ${pt.errorRatePercent.toFixed(2)}%`,
                      `Threshold: ${thresholds.errorRatePercent}%`
                    ]
                  })
                }
                onMouseLeave={() => setActiveTooltip(null)}
              />
            ))}

            {/* Axis Labels */}
            <text x={padding.left} y={padding.top - 6} fill="#94a3b8" fontSize="9" textAnchor="start">
              {maxError.toFixed(0)}%
            </text>
            <text x={padding.left - 6} y={padding.top + chartH + 3} fill="#64748b" fontSize="9" textAnchor="end">
              0%
            </text>
            {dataPoints.map((pt, i) => (
              <text
                key={i}
                x={getX(pt.virtualUsers)}
                y={padding.top + chartH + 16}
                fill="#94a3b8"
                fontSize="9"
                textAnchor="middle"
              >
                {pt.virtualUsers} VU
              </text>
            ))}
          </svg>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-rose-500 rounded-full"></span>
            <span>Measured Error %</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-amber-400 rounded-full border border-dashed"></span>
            <span>Max Allowable (5%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
