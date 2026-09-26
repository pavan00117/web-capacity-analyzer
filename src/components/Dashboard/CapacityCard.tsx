import React from 'react';
import {
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Users,
  Clock,
  Percent,
  Cpu,
  Info
} from 'lucide-react';
import { PerformanceThresholds, CapacityEvaluation } from '../../types';

interface CapacityCardProps {
  thresholds: PerformanceThresholds;
  onThresholdChange: (newThresholds: PerformanceThresholds) => void;
  evaluation: CapacityEvaluation;
}

export const CapacityCard: React.FC<CapacityCardProps> = ({
  thresholds,
  onThresholdChange,
  evaluation
}) => {
  const isPassing = evaluation.isPassing;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">Capacity & SLA Analysis</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Configurable SLA thresholds compared against measured virtual load
          </p>
        </div>

        {/* Status Badge with Required Exact Wording */}
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
            isPassing
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80 shadow-lg shadow-emerald-950/50'
              : 'bg-rose-950/80 text-rose-300 border-rose-700/80 shadow-lg shadow-rose-950/50'
          }`}
        >
          {isPassing ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          )}
          <span>{evaluation.status}</span>
        </div>
      </div>

      {/* Threshold Configurator Form */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <span>Configurable Performance Thresholds</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
          {/* 1. Response Time Threshold */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-300 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                Response Time SLA
              </span>
              <span className="font-mono text-sky-400 font-bold">{thresholds.avgResponseTimeMs} ms</span>
            </div>
            <input
              type="range"
              min="200"
              max="3000"
              step="50"
              value={thresholds.avgResponseTimeMs}
              onChange={(e) =>
                onThresholdChange({
                  ...thresholds,
                  avgResponseTimeMs: Number(e.target.value)
                })
              }
              className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <span className="text-[10px] text-slate-500 block mt-1">Default: 1000 ms</span>
          </div>

          {/* 2. Error Rate Threshold */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-300 font-medium flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-rose-400" />
                Error Rate Limit
              </span>
              <span className="font-mono text-rose-400 font-bold">{thresholds.errorRatePercent}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={thresholds.errorRatePercent}
              onChange={(e) =>
                onThresholdChange({
                  ...thresholds,
                  errorRatePercent: Number(e.target.value)
                })
              }
              className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <span className="text-[10px] text-slate-500 block mt-1">Default: 5.0%</span>
          </div>

          {/* 3. CPU Warning Threshold */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-300 font-medium flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                CPU Warning
              </span>
              <span className="font-mono text-amber-400 font-bold">{thresholds.cpuWarningPercent}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={thresholds.cpuWarningPercent}
              onChange={(e) =>
                onThresholdChange({
                  ...thresholds,
                  cpuWarningPercent: Number(e.target.value)
                })
              }
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <span className="text-[10px] text-slate-500 block mt-1">Default: 80.0%</span>
          </div>
        </div>
      </div>

      {/* Observed Capacity Statement */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/30 p-4 rounded-xl border border-blue-900/40 flex items-start gap-3">
        <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg shrink-0 mt-0.5">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Capacity Finding</h4>
          <p className="text-sm text-slate-300 mt-1">
            <span className="font-medium text-sky-300">
              Observed capacity under the tested configuration:
            </span>{' '}
            <strong className="text-white font-mono text-base bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
              {evaluation.maxObservedCapacityUsers} Concurrent Virtual Users
            </strong>
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
            <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>
              Note: This finding indicates sustained capacity within the defined SLA ({thresholds.avgResponseTimeMs}ms, {thresholds.errorRatePercent}% err) on current hardware/tier, not an absolute theoretical upper limit.
            </span>
          </div>
        </div>
      </div>

      {/* Capacity Observations List */}
      {evaluation.observations.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Performance Observations
          </span>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {evaluation.observations.map((obs, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                <span className="text-blue-400 font-bold shrink-0">•</span>
                <span>{obs}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
