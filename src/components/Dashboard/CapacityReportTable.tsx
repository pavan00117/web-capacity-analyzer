import React from 'react';
import {
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';
import { LoadTestPoint, TestRunReport } from '../../types';

interface CapacityReportTableProps {
  currentRun: TestRunReport;
  allRuns: TestRunReport[];
  onSelectRun: (run: TestRunReport) => void;
}

export const CapacityReportTable: React.FC<CapacityReportTableProps> = ({
  currentRun,
  allRuns,
  onSelectRun
}) => {
  const points = currentRun.dataPoints || [];

  // Export current table as CSV
  const handleExportCSV = () => {
    const headers = [
      'Virtual Users',
      'Average Response Time (ms)',
      'P95 Response Time (ms)',
      'Error Rate (%)',
      'Throughput (req/sec)',
      'Total Requests',
      'CPU (%)',
      'Memory (%)',
      'Status'
    ];

    const rows = points.map((p) => [
      p.virtualUsers,
      p.avgResponseTimeMs,
      p.p95ResponseTimeMs,
      p.errorRatePercent,
      p.requestsPerSecond,
      p.totalRequests,
      p.cpuPercent,
      p.memoryPercent,
      p.status
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `capacity_report_${currentRun.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white">Capacity Progression Report</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Measured stage-by-stage concurrency test progression
          </p>
        </div>

        {/* Source Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {currentRun.source === 'DEMO' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/80 border border-amber-700/80 text-amber-300 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>DEMO DATA — Replace with Azure Load Testing results</span>
            </div>
          )}

          {currentRun.source === 'LIVE_SIMULATION' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-950/80 border border-sky-700/80 text-sky-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 shrink-0 text-sky-400" />
              <span>LIVE TEST RUN — Executed via built-in runner</span>
            </div>
          )}

          {currentRun.source === 'AZURE_IMPORT' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>AZURE IMPORTED DATA — Loaded from Azure Load Testing</span>
            </div>
          )}

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Test Run Switcher */}
      {allRuns.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 whitespace-nowrap">Switch Test Run:</span>
          {allRuns.map((run) => (
            <button
              key={run.id}
              onClick={() => onSelectRun(run)}
              className={`px-3 py-1 rounded-lg border whitespace-nowrap transition-colors ${
                run.id === currentRun.id
                  ? 'bg-blue-600 text-white border-blue-500 font-semibold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              {run.name} ({run.source})
            </button>
          ))}
        </div>
      )}

      {/* Progression Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <th className="py-3 px-4 font-semibold">Virtual Users</th>
              <th className="py-3 px-4 font-semibold">Average Latency</th>
              <th className="py-3 px-4 font-semibold">P95 Latency</th>
              <th className="py-3 px-4 font-semibold">Error Rate</th>
              <th className="py-3 px-4 font-semibold">Throughput</th>
              <th className="py-3 px-4 font-semibold">Total Requests</th>
              <th className="py-3 px-4 font-semibold">CPU Load</th>
              <th className="py-3 px-4 font-semibold">Memory</th>
              <th className="py-3 px-4 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {points.map((row, idx) => {
              const isPass = row.status === 'PASS';
              return (
                <tr
                  key={idx}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    !isPass ? 'bg-rose-950/10' : ''
                  }`}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800 text-slate-200">
                      {row.virtualUsers}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span
                      className={
                        row.avgResponseTimeMs > currentRun.thresholds.avgResponseTimeMs
                          ? 'text-rose-400 font-bold'
                          : 'text-slate-200'
                      }
                    >
                      {row.avgResponseTimeMs} ms
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {row.p95ResponseTimeMs} ms
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span
                      className={
                        row.errorRatePercent > currentRun.thresholds.errorRatePercent
                          ? 'text-rose-400 font-bold'
                          : row.errorRatePercent > 0
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }
                    >
                      {row.errorRatePercent.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-200">
                    {row.requestsPerSecond.toFixed(1)} req/s
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {row.totalRequests.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono">
                    <span
                      className={
                        row.cpuPercent > currentRun.thresholds.cpuWarningPercent
                          ? 'text-amber-400 font-bold'
                          : 'text-slate-300'
                      }
                    >
                      {row.cpuPercent.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-400">
                    {row.memoryPercent.toFixed(1)}%
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        isPass
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse'
                      }`}
                    >
                      {isPass ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>PASS</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3 text-rose-400" />
                          <span>INVESTIGATE</span>
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 pt-1">
        <span>Target: {currentRun.endpointTested}</span>
        <span>Run Timestamp: {new Date(currentRun.executedAt).toLocaleString()}</span>
      </div>
    </div>
  );
};
