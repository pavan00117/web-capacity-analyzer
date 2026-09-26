import React from 'react';
import {
  Users,
  Activity,
  ShieldCheck,
  AlertOctagon,
  ArrowRight,
  TrendingUp,
  Cpu,
  Zap
} from 'lucide-react';

interface FunnelFlowProps {
  virtualUsers: number;
  avgLatencyMs: number;
  observedCapacityUsers: number;
  bottlenecksCount: number;
  isPassing: boolean;
}

export const FunnelFlow: React.FC<FunnelFlowProps> = ({
  virtualUsers,
  avgLatencyMs,
  observedCapacityUsers,
  bottlenecksCount,
  isPassing
}) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-blue-400" />
          <span>Capacity Engineering Pipeline Flow</span>
        </h4>
        <span className="text-[11px] text-slate-500 hidden sm:inline">
          Systematic 4-Stage Capacity Determination
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative">
        {/* STAGE 1: LOAD */}
        <div className="bg-slate-950/80 border border-blue-900/60 rounded-xl p-4 relative overflow-hidden group hover:border-blue-500 transition-colors">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
          <div className="flex items-center justify-between text-xs text-blue-400 font-bold mb-2">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              1. LOAD
            </span>
            <span className="text-[10px] text-slate-500">Input</span>
          </div>
          <div className="text-2xl font-black text-white font-mono">{virtualUsers} VU</div>
          <p className="text-[11px] text-slate-400 mt-1">
            Concurrent virtual user traffic generated via Azure Load Testing / JMeter
          </p>
        </div>

        {/* STAGE 2: PERFORMANCE */}
        <div className="bg-slate-950/80 border border-indigo-900/60 rounded-xl p-4 relative overflow-hidden group hover:border-indigo-500 transition-colors">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-sky-500"></div>
          <div className="flex items-center justify-between text-xs text-indigo-400 font-bold mb-2">
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" />
              2. PERFORMANCE
            </span>
            <span className="text-[10px] text-slate-500">Measured</span>
          </div>
          <div className="text-2xl font-black text-white font-mono">{avgLatencyMs} ms</div>
          <p className="text-[11px] text-slate-400 mt-1">
            Observed response latency, throughput curve, and error response rate
          </p>
        </div>

        {/* STAGE 3: CAPACITY */}
        <div className="bg-slate-950/80 border border-emerald-900/60 rounded-xl p-4 relative overflow-hidden group hover:border-emerald-500 transition-colors">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
          <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-2">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              3. CAPACITY
            </span>
            <span className="text-[10px] text-slate-500">Evaluation</span>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {observedCapacityUsers} Users
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Max observed safe concurrency adhering to &lt;1000ms SLA and &lt;5% errors
          </p>
        </div>

        {/* STAGE 4: BOTTLENECK */}
        <div className="bg-slate-950/80 border border-amber-900/60 rounded-xl p-4 relative overflow-hidden group hover:border-amber-500 transition-colors">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-rose-500"></div>
          <div className="flex items-center justify-between text-xs text-amber-400 font-bold mb-2">
            <span className="flex items-center gap-1">
              <AlertOctagon className="w-3.5 h-3.5" />
              4. BOTTLENECK
            </span>
            <span className="text-[10px] text-slate-500">Diagnosis</span>
          </div>
          <div
            className={`text-2xl font-black font-mono ${
              bottlenecksCount > 0 ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {bottlenecksCount > 0 ? `${bottlenecksCount} Areas` : 'Clear'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Compute utilization, CPU thresholds, memory saturation, or I/O locks
          </p>
        </div>
      </div>
    </div>
  );
};
