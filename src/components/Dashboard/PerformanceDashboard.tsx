import React, { useState, useEffect } from 'react';
import {
  Activity,
  Layers,
  Sparkles,
  RefreshCw,
  Play,
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  Server,
  ArrowRight
} from 'lucide-react';
import {
  TestRunReport,
  LoadTestPoint,
  PerformanceThresholds,
  CapacityEvaluation
} from '../../types';
import { FunnelFlow } from './FunnelFlow';
import { MetricsCards } from './MetricsCards';
import { PerformanceCharts } from './PerformanceCharts';
import { CapacityCard } from './CapacityCard';
import { BottlenecksCard } from './BottlenecksCard';
import { CapacityReportTable } from './CapacityReportTable';

interface PerformanceDashboardProps {
  onNavigateToRunner: () => void;
  onNavigateToAzure: () => void;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  onNavigateToRunner,
  onNavigateToAzure
}) => {
  const [runs, setRuns] = useState<TestRunReport[]>([]);
  const [activeRun, setActiveRun] = useState<TestRunReport | null>(null);
  const [thresholds, setThresholds] = useState<PerformanceThresholds>({
    avgResponseTimeMs: 1000,
    errorRatePercent: 5.0,
    cpuWarningPercent: 80.0,
    memoryWarningPercent: 80.0
  });
  const [evaluation, setEvaluation] = useState<CapacityEvaluation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch test runs from server
  useEffect(() => {
    fetchRuns();
  }, []);

  const fetchRuns = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/load-test/runs');
      const data = await res.json();
      if (data.success && data.runs && data.runs.length > 0) {
        setRuns(data.runs);
        const current = data.runs[0];
        setActiveRun(current);
        if (current.thresholds) {
          setThresholds(current.thresholds);
        }
        recalculateEvaluation(current.dataPoints, current.thresholds || thresholds);
      }
    } catch (err) {
      console.error('Error fetching load test runs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const recalculateEvaluation = async (
    points: LoadTestPoint[],
    activeThresholds: PerformanceThresholds
  ) => {
    try {
      const res = await fetch('/api/load-test/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataPoints: points,
          thresholds: activeThresholds
        })
      });
      const data = await res.json();
      if (data.success && data.evaluation) {
        setEvaluation(data.evaluation);
      }
    } catch (err) {
      console.error('Error calculating evaluation:', err);
    }
  };

  const handleThresholdChange = (newThresholds: PerformanceThresholds) => {
    setThresholds(newThresholds);
    if (activeRun) {
      recalculateEvaluation(activeRun.dataPoints, newThresholds);
    }
  };

  const handleSelectRun = (run: TestRunReport) => {
    setActiveRun(run);
    if (run.thresholds) {
      setThresholds(run.thresholds);
      recalculateEvaluation(run.dataPoints, run.thresholds);
    } else {
      recalculateEvaluation(run.dataPoints, thresholds);
    }
  };

  if (isLoading || !activeRun || !evaluation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400 space-y-4">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-sm">Loading Capacity Analyzer & performance telemetry...</p>
      </div>
    );
  }

  const latestPoint = activeRun.dataPoints[activeRun.dataPoints.length - 1];

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header Overview & Context */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-950 text-blue-400 border border-blue-800">
                CAPACITY STUDY SUITE
              </span>
              <span className="text-xs text-slate-400">
                Azure Load Testing • Application Insights • Node Express
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Smart Web Application Capacity Analyzer
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Empirical study evaluating web application concurrent throughput limits under defined SLA criteria. It performs automated bottleneck detection, latency regression analysis, and autoscaling recommendations.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateToRunner}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/30 transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Live Load Test</span>
            </button>
            <button
              onClick={onNavigateToAzure}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-sky-400" />
              <span>Import Azure CSV</span>
            </button>
          </div>
        </div>

        {/* System & API Quick Summary Grid */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block">Application Status</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live & Accepting Requests
            </span>
          </div>

          <div>
            <span className="text-slate-500 block">Instrumented APIs</span>
            <span className="text-slate-200 font-semibold font-mono mt-0.5 block">
              7 Active Endpoints
            </span>
          </div>

          <div>
            <span className="text-slate-500 block">Active Data Source</span>
            <span className="text-sky-300 font-semibold mt-0.5 block">
              {activeRun.source === 'DEMO'
                ? 'Sample Progression (Demo)'
                : activeRun.source === 'LIVE_SIMULATION'
                ? 'Live Server Benchmark'
                : 'Azure Load Testing Results'}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block">Observed Capacity</span>
            <span className="text-emerald-400 font-mono font-bold mt-0.5 block">
              {evaluation.maxObservedCapacityUsers} Virtual Users
            </span>
          </div>
        </div>
      </div>

      {/* 2. Visual Pipeline Funnel Flow */}
      <FunnelFlow
        virtualUsers={latestPoint.virtualUsers}
        avgLatencyMs={latestPoint.avgResponseTimeMs}
        observedCapacityUsers={evaluation.maxObservedCapacityUsers}
        bottlenecksCount={evaluation.bottlenecks.length}
        isPassing={evaluation.isPassing}
      />

      {/* 3. Core Metric KPI Cards */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider text-slate-300">
            Real-Time Capacity Performance Metrics
          </span>
          <span>Evaluated at {latestPoint.virtualUsers} Virtual Users</span>
        </div>
        <MetricsCards latestPoint={latestPoint} thresholds={thresholds} />
      </div>

      {/* 4. Graphical Analysis Charts */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold uppercase tracking-wider text-slate-300">
            Concurrency Correlation Charts
          </span>
          <span>Virtual Users (10 → 100) vs Telemetry Curves</span>
        </div>
        <PerformanceCharts dataPoints={activeRun.dataPoints} thresholds={thresholds} />
      </div>

      {/* 5. Capacity & Bottleneck Dual Analysis Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CapacityCard
          thresholds={thresholds}
          onThresholdChange={handleThresholdChange}
          evaluation={evaluation}
        />
        <BottlenecksCard
          bottlenecks={evaluation.bottlenecks}
          recommendations={evaluation.recommendations}
        />
      </div>

      {/* 6. Capacity Progression Report Table */}
      <CapacityReportTable
        currentRun={activeRun}
        allRuns={runs}
        onSelectRun={handleSelectRun}
      />
    </div>
  );
};
