import os from 'os';
import {
  LoadTestPoint,
  PerformanceThresholds,
  CapacityEvaluation,
  BottleneckItem,
  TestRunReport
} from '../../src/types/index.js';
import { demoTestRun } from '../data/tourismData.js';

// In-memory test run registry
export const testRunsStore: TestRunReport[] = [
  demoTestRun
];

/**
 * Perform rule-based capacity and bottleneck analysis
 * Strictly follows specified non-presumptive phrasing:
 * "Observed capacity under the tested configuration"
 * "Within defined performance criteria" vs "Performance threshold exceeded"
 */
export function evaluateCapacityAndBottlenecks(
  points: LoadTestPoint[],
  thresholds: PerformanceThresholds
): CapacityEvaluation {
  const bottlenecks: BottleneckItem[] = [];
  const observations: string[] = [];
  const recommendations: string[] = [];

  let maxSafeUsers = 0;
  let hasThresholdBreached = false;

  for (const point of points) {
    const isPointPassing =
      point.avgResponseTimeMs <= thresholds.avgResponseTimeMs &&
      point.errorRatePercent <= thresholds.errorRatePercent &&
      point.cpuPercent <= thresholds.cpuWarningPercent;

    if (isPointPassing) {
      if (point.virtualUsers > maxSafeUsers) {
        maxSafeUsers = point.virtualUsers;
      }
    } else {
      hasThresholdBreached = true;

      // Identify potential bottlenecks at this stage
      if (point.cpuPercent > thresholds.cpuWarningPercent) {
        bottlenecks.push({
          id: `cpu-${point.virtualUsers}`,
          metric: 'CPU Utilization',
          observedValue: `${point.cpuPercent.toFixed(1)}%`,
          thresholdValue: `${thresholds.cpuWarningPercent}%`,
          severity: point.cpuPercent > 90 ? 'critical' : 'warning',
          title: 'High CPU utilization detected',
          description: `Observed ${point.cpuPercent.toFixed(1)}% compute load at ${point.virtualUsers} virtual users. Investigate application compute capacity.`,
          recommendation: 'Consider horizontal scaling (more App Service instances) or optimizing synchronous JSON serialization.'
        });
      }

      if (point.avgResponseTimeMs > thresholds.avgResponseTimeMs) {
        bottlenecks.push({
          id: `latency-${point.virtualUsers}`,
          metric: 'Average Response Time',
          observedValue: `${point.avgResponseTimeMs.toFixed(0)} ms`,
          thresholdValue: `${thresholds.avgResponseTimeMs} ms`,
          severity: point.avgResponseTimeMs > thresholds.avgResponseTimeMs * 1.5 ? 'critical' : 'warning',
          title: 'Response time exceeded the defined threshold',
          description: `Observed average latency of ${point.avgResponseTimeMs.toFixed(0)} ms at ${point.virtualUsers} virtual users exceeds the SLA threshold of ${thresholds.avgResponseTimeMs} ms.`,
          recommendation: 'Evaluate database/query indexing, in-memory caching (Redis/MemoryCache), and API compression (gzip/brotli).'
        });
      }

      if (point.errorRatePercent > thresholds.errorRatePercent) {
        bottlenecks.push({
          id: `error-${point.virtualUsers}`,
          metric: 'Error Rate',
          observedValue: `${point.errorRatePercent.toFixed(2)}%`,
          thresholdValue: `${thresholds.errorRatePercent}%`,
          severity: 'critical',
          title: 'Error rate exceeded the defined threshold',
          description: `HTTP 5xx or connection drop rate of ${point.errorRatePercent.toFixed(2)}% exceeds threshold ${thresholds.errorRatePercent}% at ${point.virtualUsers} virtual users.`,
          recommendation: 'Examine reverse proxy timeout settings, connection pool exhaustion, and server thread worker capacity.'
        });
      }

      if (point.memoryPercent > thresholds.memoryWarningPercent) {
        bottlenecks.push({
          id: `mem-${point.virtualUsers}`,
          metric: 'Memory Utilization',
          observedValue: `${point.memoryPercent.toFixed(1)}%`,
          thresholdValue: `${thresholds.memoryWarningPercent}%`,
          severity: 'warning',
          title: 'High memory utilization detected',
          description: `Memory footprint of ${point.memoryPercent.toFixed(1)}% exceeds safety threshold of ${thresholds.memoryWarningPercent}%.`,
          recommendation: 'Audit memory retention in request contexts and consider Node.js --max-old-space-size or scaling App Service tier.'
        });
      }
    }
  }

  // De-duplicate bottlenecks by title/metric
  const uniqueBottlenecks: BottleneckItem[] = [];
  const seenKeys = new Set<string>();
  for (const b of bottlenecks) {
    const key = `${b.metric}-${b.title}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueBottlenecks.push(b);
    }
  }

  // Observations
  if (points.length > 0) {
    const highestTestedUsers = points[points.length - 1].virtualUsers;
    observations.push(
      `Observed capacity under the tested configuration is approximately ${maxSafeUsers} concurrent virtual users.`
    );
    if (hasThresholdBreached) {
      observations.push(
        `Performance degradation began between ${maxSafeUsers} and ${highestTestedUsers} virtual users under test conditions.`
      );
    } else {
      observations.push(
        `All tested loads (up to ${highestTestedUsers} virtual users) operated within the specified SLA thresholds.`
      );
    }
  }

  // Actionable recommendations
  if (uniqueBottlenecks.length === 0) {
    recommendations.push('Application meets baseline performance requirements under the tested configuration.');
    recommendations.push('Proceed with incremental staging load tests (e.g., 150-200 users) if target production traffic is higher.');
  } else {
    recommendations.push('Scale Azure App Service Plan to multi-instance autoscale (B2/S1 or higher) to distribute concurrent load.');
    recommendations.push('Implement HTTP Cache-Control response headers for read-heavy tourist places and homestays catalogue.');
    recommendations.push('Enable Azure Application Insights Profiler to inspect CPU flame graphs and event-loop lag.');
  }

  return {
    status: hasThresholdBreached
      ? 'Performance threshold exceeded'
      : 'Within defined performance criteria',
    isPassing: !hasThresholdBreached,
    maxObservedCapacityUsers: maxSafeUsers,
    testedVirtualUsers: points.length > 0 ? points[points.length - 1].virtualUsers : 0,
    bottlenecks: uniqueBottlenecks,
    observations,
    recommendations
  };
}

/**
 * Capture current host system metrics (local dev or Azure App Service container)
 */
export function getSystemMetrics() {
  const freeMem = os.freemem();
  const totalMem = os.totalmem();
  const memoryPercent = ((totalMem - freeMem) / totalMem) * 100;
  const loadAvg = os.loadavg();
  const cpuCount = os.cpus().length || 1;
  const cpuPercent = Math.min(100, Math.max(5, (loadAvg[0] / cpuCount) * 100));

  return {
    platform: os.platform(),
    arch: os.arch(),
    cpuCores: cpuCount,
    cpuPercent: Number(cpuPercent.toFixed(1)),
    totalMemoryMB: Math.round(totalMem / (1024 * 1024)),
    freeMemoryMB: Math.round(freeMem / (1024 * 1024)),
    memoryPercent: Number(memoryPercent.toFixed(1)),
    uptimeSeconds: Math.round(os.uptime()),
    nodeVersion: process.version
  };
}
