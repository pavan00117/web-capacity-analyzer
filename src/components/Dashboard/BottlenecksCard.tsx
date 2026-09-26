import React from 'react';
import {
  AlertOctagon,
  Cpu,
  Clock,
  AlertTriangle,
  HardDrive,
  Lightbulb,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { BottleneckItem } from '../../types';

interface BottlenecksCardProps {
  bottlenecks: BottleneckItem[];
  recommendations: string[];
}

export const BottlenecksCard: React.FC<BottlenecksCardProps> = ({
  bottlenecks,
  recommendations
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Bottleneck Identification</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Rule-based diagnostic evaluation of measured application bottlenecks
          </p>
        </div>

        <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
          {bottlenecks.length === 0 ? '0 Detected' : `${bottlenecks.length} Potential Bottlenecks`}
        </span>
      </div>

      {/* Bottlenecks List */}
      {bottlenecks.length === 0 ? (
        <div className="bg-emerald-950/30 border border-emerald-800/60 rounded-xl p-5 text-center space-y-2">
          <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-semibold text-emerald-300">
            No Critical Bottlenecks Detected
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Under the tested concurrent load, compute, memory, latency, and error metrics remained within defined thresholds.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <span>Potential Bottlenecks</span>
            <span className="text-[10px] text-slate-500 lowercase font-normal">
              (observed correlations; not unverified causations)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {bottlenecks.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${
                        item.severity === 'critical'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {item.metric.includes('CPU') && <Cpu className="w-3 h-3" />}
                      {item.metric.includes('Response') && <Clock className="w-3 h-3" />}
                      {item.metric.includes('Error') && <AlertTriangle className="w-3 h-3" />}
                      {item.metric.includes('Memory') && <HardDrive className="w-3 h-3" />}
                      <span>{item.metric}</span>
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Observed: <strong className="text-white">{item.observedValue}</strong> vs SLA {item.thresholdValue}
                    </span>
                  </div>

                  <h5 className="font-bold text-slate-200 text-sm mb-1">{item.title}</h5>
                  <p className="text-xs text-slate-400 mb-3">{item.description}</p>
                </div>

                <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 text-[11px] text-sky-300 flex items-start gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <span><strong>Remediation:</strong> {item.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strategic Performance Recommendations */}
      {recommendations.length > 0 && (
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
            <Lightbulb className="w-4 h-4" />
            <span>Azure Cloud Optimization Recommendations</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-white block">1. Scale-Out Architecture</span>
              <p className="text-slate-400">
                Configure Azure App Service Autoscale rules based on 70% CPU or 1000 HTTP Queue depth to spawn secondary instances automatically.
              </p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-white block">2. Caching & Edge CDN</span>
              <p className="text-slate-400">
                Place Azure Front Door or Redis Cache in front of read-heavy catalogue queries (/tourist-places, /homestays) to slash origin hits.
              </p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <span className="font-bold text-white block">3. Profiler Diagnostics</span>
              <p className="text-slate-400">
                Enable Application Insights Profiler to sample CPU call stacks during peak load to detect blocking synchronous loops.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
