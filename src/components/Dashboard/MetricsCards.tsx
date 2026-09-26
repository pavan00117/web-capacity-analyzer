import React from 'react';
import {
  Users,
  Repeat,
  Zap,
  Clock,
  AlertTriangle,
  Cpu,
  HardDrive,
  Timer,
  CheckCircle2
} from 'lucide-react';
import { LoadTestPoint, PerformanceThresholds } from '../../types';

interface MetricsCardsProps {
  latestPoint: LoadTestPoint;
  thresholds: PerformanceThresholds;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({
  latestPoint,
  thresholds
}) => {
  const isLatencyPass = latestPoint.avgResponseTimeMs <= thresholds.avgResponseTimeMs;
  const isErrorPass = latestPoint.errorRatePercent <= thresholds.errorRatePercent;
  const isCpuPass = latestPoint.cpuPercent <= thresholds.cpuWarningPercent;
  const isOverallPass = latestPoint.status === 'PASS';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {/* 1. Virtual Users */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-lg">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Virtual Users</span>
          <Users className="w-4 h-4 text-blue-400" />
        </div>
        <div className="mt-2">
          <span className="text-2xl font-black text-white font-mono">{latestPoint.virtualUsers}</span>
          <span className="text-xs text-slate-500 ml-1">threads</span>
        </div>
        <span className="text-[10px] text-slate-400 mt-1">Concurrency target</span>
      </div>

      {/* 2. Average Response Time */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-lg">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Avg Response Time</span>
          <Clock className="w-4 h-4 text-sky-400" />
        </div>
        <div className="mt-2">
          <span
            className={`text-2xl font-black font-mono ${
              isLatencyPass ? 'text-sky-400' : 'text-rose-400'
            }`}
          >
            {latestPoint.avgResponseTimeMs}
          </span>
          <span className="text-xs text-slate-500 ml-1">ms</span>
        </div>
        <span className="text-[10px] text-slate-400 mt-1">
          Threshold: {thresholds.avgResponseTimeMs}ms
        </span>
      </div>

      {/* 3. Requests Per Second */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-lg">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Throughput</span>
          <Zap className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="mt-2">
          <span className="text-2xl font-black text-emerald-400 font-mono">
            {latestPoint.requestsPerSecond.toFixed(1)}
          </span>
          <span className="text-xs text-slate-500 ml-1">req/s</span>
        </div>
        <span className="text-[10px] text-slate-400 mt-1">
          Total: {latestPoint.totalRequests.toLocaleString()}
        </span>
      </div>

      {/* 4. Error Rate */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-lg">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Error Rate</span>
          <AlertTriangle className="w-4 h-4 text-rose-400" />
        </div>
        <div className="mt-2">
          <span
            className={`text-2xl font-black font-mono ${
              isErrorPass ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {latestPoint.errorRatePercent.toFixed(2)}%
          </span>
        </div>
        <span className="text-[10px] text-slate-400 mt-1">
          Limit: {thresholds.errorRatePercent}%
        </span>
      </div>

      {/* 5. CPU Utilization */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-lg">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>CPU Utilization</span>
          <Cpu className="w-4 h-4 text-amber-400" />
        </div>
        <div className="mt-2">
          <span
            className={`text-2xl font-black font-mono ${
              isCpuPass ? 'text-slate-200' : 'text-amber-400'
            }`}
          >
            {latestPoint.cpuPercent.toFixed(1)}%
          </span>
        </div>
        <span className="text-[10px] text-slate-400 mt-1">
          Warning: {thresholds.cpuWarningPercent}%
        </span>
      </div>

      {/* 6. Memory Utilization */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-lg">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Memory Usage</span>
          <HardDrive className="w-4 h-4 text-purple-400" />
        </div>
        <div className="mt-2">
          <span className="text-2xl font-black text-slate-200 font-mono">
            {latestPoint.memoryPercent.toFixed(1)}%
          </span>
        </div>
        <span className="text-[10px] text-slate-400 mt-1">App Service memory</span>
      </div>

      {/* 7. Total Requests */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-lg">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Total Requests</span>
          <Repeat className="w-4 h-4 text-blue-400" />
        </div>
        <div className="mt-2">
          <span className="text-2xl font-black text-white font-mono">
            {latestPoint.totalRequests.toLocaleString()}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 mt-1">Delivered requests</span>
      </div>

      {/* 8. Test Duration */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-lg">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Test Duration</span>
          <Timer className="w-4 h-4 text-sky-400" />
        </div>
        <div className="mt-2">
          <span className="text-2xl font-black text-white font-mono">
            {latestPoint.testDurationSeconds}s
          </span>
        </div>
        <span className="text-[10px] text-slate-400 mt-1">Standard run duration</span>
      </div>

      {/* 9 & 10. Performance Status Badge */}
      <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-lg">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Performance Status</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-lg text-sm font-bold font-mono ${
              isOverallPass
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                : 'bg-rose-950 text-rose-300 border border-rose-800'
            }`}
          >
            {isOverallPass ? 'STATUS: PASS' : 'STATUS: INVESTIGATE'}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 mt-1 truncate">
          At {latestPoint.virtualUsers} VU stage evaluation
        </span>
      </div>
    </div>
  );
};
