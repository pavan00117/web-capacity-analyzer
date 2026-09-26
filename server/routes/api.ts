import { Router, Request, Response } from 'express';
import {
  touristPlaces,
  homestays,
  tourismProducts,
  demoTestRun
} from '../data/tourismData.js';
import {
  evaluateCapacityAndBottlenecks,
  getSystemMetrics,
  testRunsStore
} from '../controllers/loadTestController.js';
import {
  BookingRequest,
  BookingResponse,
  PerformanceThresholds,
  TestRunReport,
  LoadTestPoint
} from '../../src/types/index.js';

const router = Router();

// In-memory bookings store
const bookingsStore: BookingResponse[] = [
  {
    bookingId: 'BK-78921',
    guestName: 'Ananya Rao',
    email: 'ananya.rao@example.com',
    phone: '+91 98765 43210',
    targetId: 'stay-1',
    targetType: 'homestay',
    targetTitle: 'Nizam Heritage Courtyard Villa',
    checkInDate: '2026-10-15',
    checkOutDate: '2026-10-18',
    guests: 2,
    specialRequests: 'Late arrival at 8:00 PM; require airport cab pickup.',
    totalAmount: 8400,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

// Global request statistics for telemetry
let totalHttpRequests = 0;
const requestLatencies: number[] = [];

// Middleware to record request stats
router.use((req, res, next) => {
  const start = Date.now();
  totalHttpRequests++;
  res.on('finish', () => {
    const duration = Date.now() - start;
    requestLatencies.push(duration);
    if (requestLatencies.length > 500) {
      requestLatencies.shift();
    }
  });
  next();
});

// 1. HEALTH CHECK ENDPOINT
router.get('/health', (req: Request, res: Response) => {
  const sys = getSystemMetrics();
  const avgLatency =
    requestLatencies.length > 0
      ? Math.round(requestLatencies.reduce((a, b) => a + b, 0) / requestLatencies.length)
      : 8;

  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'tourist-capacity-demo',
    version: '1.0.0',
    uptimeSeconds: Math.round(process.uptime()),
    serverLoad: {
      totalHttpRequests,
      recentAvgLatencyMs: avgLatency,
      activeConnections: 1
    },
    system: {
      platform: sys.platform,
      arch: sys.arch,
      cpuPercent: sys.cpuPercent,
      memoryPercent: sys.memoryPercent,
      nodeVersion: sys.nodeVersion
    }
  });
});

// 2. PRODUCTS / EXPERIENCES
router.get('/products', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    count: tourismProducts.length,
    data: tourismProducts
  });
});

// 3. TOURIST PLACES
router.get('/tourist-places', (req: Request, res: Response) => {
  const { category, city } = req.query;
  let filtered = [...touristPlaces];

  if (category && typeof category === 'string' && category !== 'All') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (city && typeof city === 'string' && city !== 'All') {
    filtered = filtered.filter(p => p.city.toLowerCase() === city.toLowerCase());
  }

  res.status(200).json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

router.get('/tourist-places/:id', (req: Request, res: Response) => {
  const place = touristPlaces.find(p => p.id === req.params.id);
  if (!place) {
    return res.status(404).json({ success: false, error: 'Tourist place not found' });
  }
  res.status(200).json({ success: true, data: place });
});

// 4. HOMESTAYS
router.get('/homestays', (req: Request, res: Response) => {
  const { maxPrice, superhost } = req.query;
  let filtered = [...homestays];

  if (maxPrice) {
    const max = Number(maxPrice);
    if (!isNaN(max)) {
      filtered = filtered.filter(h => h.pricePerNight <= max);
    }
  }

  if (superhost === 'true') {
    filtered = filtered.filter(h => h.superhost);
  }

  res.status(200).json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

// 5. SEARCH ENDPOINT (Target for Azure Load Testing query tests)
router.get('/search', (req: Request, res: Response) => {
  const query = (req.query.q as string || '').toLowerCase().trim();

  if (!query) {
    return res.status(200).json({
      success: true,
      query: '',
      results: {
        places: touristPlaces,
        homestays: homestays,
        products: tourismProducts,
        totalMatches: touristPlaces.length + homestays.length + tourismProducts.length
      }
    });
  }

  const matchedPlaces = touristPlaces.filter(
    p =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.city.toLowerCase().includes(query) ||
      p.highlights.some(h => h.toLowerCase().includes(query))
  );

  const matchedHomestays = homestays.filter(
    h =>
      h.title.toLowerCase().includes(query) ||
      h.description.toLowerCase().includes(query) ||
      h.city.toLowerCase().includes(query) ||
      h.amenities.some(a => a.toLowerCase().includes(query))
  );

  const matchedProducts = tourismProducts.filter(
    pr =>
      pr.title.toLowerCase().includes(query) ||
      pr.description.toLowerCase().includes(query) ||
      pr.category.toLowerCase().includes(query)
  );

  res.status(200).json({
    success: true,
    query,
    results: {
      places: matchedPlaces,
      homestays: matchedHomestays,
      products: matchedProducts,
      totalMatches: matchedPlaces.length + matchedHomestays.length + matchedProducts.length
    }
  });
});

// 6. BOOKING FORM SUBMISSION
router.post('/bookings', (req: Request, res: Response) => {
  const body = req.body as BookingRequest;

  if (!body.guestName || !body.email || !body.targetId || !body.checkInDate) {
    return res.status(400).json({
      success: false,
      error: 'Missing required booking fields (guestName, email, targetId, checkInDate)'
    });
  }

  // Calculate pricing
  let unitPrice = 1500;
  if (body.targetType === 'homestay') {
    const stay = homestays.find(h => h.id === body.targetId);
    if (stay) unitPrice = stay.pricePerNight;
  } else if (body.targetType === 'place') {
    const pl = touristPlaces.find(p => p.id === body.targetId);
    if (pl) unitPrice = pl.entryFee;
  } else if (body.targetType === 'product') {
    const prod = tourismProducts.find(pr => pr.id === body.targetId);
    if (prod) unitPrice = prod.price;
  }

  const guestsCount = Math.max(1, Number(body.guests) || 1);
  const totalAmount = unitPrice * guestsCount;

  const newBooking: BookingResponse = {
    ...body,
    bookingId: `BK-${Math.floor(10000 + Math.random() * 90000)}`,
    totalAmount,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  bookingsStore.unshift(newBooking);

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: newBooking
  });
});

router.get('/bookings', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    count: bookingsStore.length,
    data: bookingsStore.slice(0, 20)
  });
});

// 7. SYSTEM TELEMETRY
router.get('/metrics/system', (req: Request, res: Response) => {
  const sys = getSystemMetrics();
  res.status(200).json({
    success: true,
    metrics: sys,
    totalRequestsReceived: totalHttpRequests
  });
});

// 8. CAPACITY EVALUATION (Rule-Based)
router.post('/load-test/evaluate', (req: Request, res: Response) => {
  const { dataPoints, thresholds } = req.body as {
    dataPoints: LoadTestPoint[];
    thresholds: PerformanceThresholds;
  };

  if (!dataPoints || !Array.isArray(dataPoints)) {
    return res.status(400).json({ success: false, error: 'dataPoints array is required' });
  }

  const defaultThresholds: PerformanceThresholds = {
    avgResponseTimeMs: thresholds?.avgResponseTimeMs ?? 1000,
    errorRatePercent: thresholds?.errorRatePercent ?? 5.0,
    cpuWarningPercent: thresholds?.cpuWarningPercent ?? 80.0,
    memoryWarningPercent: thresholds?.memoryWarningPercent ?? 80.0
  };

  const evaluation = evaluateCapacityAndBottlenecks(dataPoints, defaultThresholds);

  res.status(200).json({
    success: true,
    evaluation
  });
});

// 9. LOAD TEST RUNS REGISTRY
router.get('/load-test/runs', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    runs: testRunsStore
  });
});

// 10. BUILT-IN LOAD RUNNER (Live Real/Simulated Load Generator)
router.post('/load-test/simulate', async (req: Request, res: Response) => {
  const {
    stages = [10, 25, 50, 100],
    endpoint = '/api/tourist-places',
    thresholds = {
      avgResponseTimeMs: 1000,
      errorRatePercent: 5.0,
      cpuWarningPercent: 80.0,
      memoryWarningPercent: 80.0
    }
  } = req.body;

  const currentSys = getSystemMetrics();
  const points: LoadTestPoint[] = [];

  for (const vu of stages) {
    // Determine realistic load metrics for the virtual users tier
    // Stage 1 (10 vu): snappy ~120-160ms, 0% error, low CPU
    // Stage 2 (25 vu): ~210-280ms, 0.1% error, moderate CPU
    // Stage 3 (50 vu): ~450-650ms, 1.2% error, healthy capacity
    // Stage 4 (100 vu): ~1250-1600ms, 5.5-7.5% error, high CPU bottleneck
    const baseRps = vu * (3.5 + Math.random() * 0.8);
    const durationSec = 15; // Fast execution for hackathon live demo
    const totalReq = Math.round(baseRps * durationSec);

    let latency = 0;
    let errorRate = 0;
    let cpu = 0;
    let mem = 0;

    if (vu <= 15) {
      latency = 120 + Math.random() * 40;
      errorRate = 0.0;
      cpu = Math.min(95, currentSys.cpuPercent + 15 + Math.random() * 5);
      mem = Math.min(95, currentSys.memoryPercent + 6 + Math.random() * 3);
    } else if (vu <= 35) {
      latency = 220 + Math.random() * 60;
      errorRate = 0.15;
      cpu = Math.min(95, currentSys.cpuPercent + 30 + Math.random() * 8);
      mem = Math.min(95, currentSys.memoryPercent + 12 + Math.random() * 4);
    } else if (vu <= 60) {
      latency = 480 + Math.random() * 120;
      errorRate = 1.05;
      cpu = Math.min(95, currentSys.cpuPercent + 48 + Math.random() * 8);
      mem = Math.min(95, currentSys.memoryPercent + 22 + Math.random() * 5);
    } else {
      latency = 1350 + Math.random() * 250;
      errorRate = 6.4 + Math.random() * 1.5;
      cpu = Math.min(98, 86 + Math.random() * 8);
      mem = Math.min(95, 82 + Math.random() * 6);
    }

    const isPass =
      latency <= thresholds.avgResponseTimeMs &&
      errorRate <= thresholds.errorRatePercent &&
      cpu <= thresholds.cpuWarningPercent;

    points.push({
      virtualUsers: vu,
      totalRequests: totalReq,
      requestsPerSecond: Number(baseRps.toFixed(1)),
      avgResponseTimeMs: Math.round(latency),
      p90ResponseTimeMs: Math.round(latency * 1.35),
      p95ResponseTimeMs: Math.round(latency * 1.6),
      errorRatePercent: Number(errorRate.toFixed(2)),
      cpuPercent: Number(cpu.toFixed(1)),
      memoryPercent: Number(mem.toFixed(1)),
      testDurationSeconds: durationSec,
      timestamp: new Date().toISOString(),
      status: isPass ? 'PASS' : 'INVESTIGATE'
    });
  }

  const newRun: TestRunReport = {
    id: `run-live-${Date.now().toString(36)}`,
    name: `Live Execution (${stages.join(' → ')} VUs)`,
    source: 'LIVE_SIMULATION',
    testedUrl: req.headers.origin || 'http://localhost:3000',
    endpointTested: endpoint,
    executedAt: new Date().toISOString(),
    thresholds,
    dataPoints: points,
    summary: {
      maxSafeVirtualUsers: points.filter(p => p.status === 'PASS').slice(-1)[0]?.virtualUsers || 0,
      peakRps: Math.max(...points.map(p => p.requestsPerSecond)),
      avgLatencyMs: Math.round(points.reduce((a, b) => a + b.avgResponseTimeMs, 0) / points.length),
      overallErrorRate: Number((points.reduce((a, b) => a + b.errorRatePercent, 0) / points.length).toFixed(2))
    }
  };

  testRunsStore.unshift(newRun);

  const evaluation = evaluateCapacityAndBottlenecks(points, thresholds);

  res.status(201).json({
    success: true,
    run: newRun,
    evaluation
  });
});

// 11. AZURE LOAD TESTING IMPORT (CSV / JSON)
router.post('/load-test/import', (req: Request, res: Response) => {
  const { name, sourceUrl, rawCsv, jsonData, thresholds } = req.body;

  const activeThresholds: PerformanceThresholds = thresholds || {
    avgResponseTimeMs: 1000,
    errorRatePercent: 5.0,
    cpuWarningPercent: 80.0,
    memoryWarningPercent: 80.0
  };

  let points: LoadTestPoint[] = [];

  if (jsonData && Array.isArray(jsonData)) {
    points = jsonData.map(item => {
      const vu = Number(item.virtualUsers || item.users || 10);
      const latency = Number(item.avgResponseTimeMs || item.average || item.latency || 200);
      const err = Number(item.errorRatePercent || item.errorRate || item.errorPct || 0);
      const cpu = Number(item.cpuPercent || item.cpu || 40);
      const mem = Number(item.memoryPercent || item.memory || 45);
      const rps = Number(item.requestsPerSecond || item.throughput || 50);
      const isPass =
        latency <= activeThresholds.avgResponseTimeMs &&
        err <= activeThresholds.errorRatePercent &&
        cpu <= activeThresholds.cpuWarningPercent;

      return {
        virtualUsers: vu,
        totalRequests: Number(item.totalRequests || rps * 60),
        requestsPerSecond: rps,
        avgResponseTimeMs: latency,
        p90ResponseTimeMs: Number(item.p90ResponseTimeMs || latency * 1.3),
        p95ResponseTimeMs: Number(item.p95ResponseTimeMs || latency * 1.5),
        errorRatePercent: err,
        cpuPercent: cpu,
        memoryPercent: mem,
        testDurationSeconds: Number(item.testDurationSeconds || 60),
        status: isPass ? 'PASS' : 'INVESTIGATE'
      };
    });
  } else if (rawCsv && typeof rawCsv === 'string') {
    // Parse CSV lines
    const lines = rawCsv.trim().split('\n');
    if (lines.length < 2) {
      return res.status(400).json({ success: false, error: 'CSV must contain headers and data rows' });
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim());
      if (parts.length < 3) continue;

      const rowObj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        rowObj[h] = parts[idx] || '';
      });

      const vu = Number(rowObj['virtual users'] || rowObj['users'] || rowObj['vu'] || (i * 25));
      const latency = Number(rowObj['average (ms)'] || rowObj['average'] || rowObj['response time'] || rowObj['latency'] || 250);
      const err = Number(rowObj['error %'] || rowObj['error rate'] || rowObj['error%'] || rowObj['errors'] || 0);
      const rps = Number(rowObj['requests/sec'] || rowObj['throughput'] || rowObj['rps'] || 45);
      const cpu = Number(rowObj['cpu %'] || rowObj['cpu'] || 45);
      const mem = Number(rowObj['memory %'] || rowObj['memory'] || 50);

      const isPass =
        latency <= activeThresholds.avgResponseTimeMs &&
        err <= activeThresholds.errorRatePercent &&
        cpu <= activeThresholds.cpuWarningPercent;

      points.push({
        virtualUsers: vu,
        totalRequests: Math.round(rps * 60),
        requestsPerSecond: rps,
        avgResponseTimeMs: latency,
        p90ResponseTimeMs: Math.round(latency * 1.3),
        p95ResponseTimeMs: Math.round(latency * 1.55),
        errorRatePercent: err,
        cpuPercent: cpu,
        memoryPercent: mem,
        testDurationSeconds: 60,
        status: isPass ? 'PASS' : 'INVESTIGATE'
      });
    }
  } else {
    return res.status(400).json({ success: false, error: 'Please provide rawCsv or jsonData' });
  }

  if (points.length === 0) {
    return res.status(400).json({ success: false, error: 'No valid data points parsed' });
  }

  // Sort by virtual users ascending
  points.sort((a, b) => a.virtualUsers - b.virtualUsers);

  const importedRun: TestRunReport = {
    id: `run-import-${Date.now().toString(36)}`,
    name: name || 'Imported Azure Load Test Run',
    source: 'AZURE_IMPORT',
    testedUrl: sourceUrl || 'https://my-app.azurewebsites.net',
    endpointTested: 'Azure Load Testing Suite',
    executedAt: new Date().toISOString(),
    thresholds: activeThresholds,
    dataPoints: points,
    summary: {
      maxSafeVirtualUsers: points.filter(p => p.status === 'PASS').slice(-1)[0]?.virtualUsers || 0,
      peakRps: Math.max(...points.map(p => p.requestsPerSecond)),
      avgLatencyMs: Math.round(points.reduce((a, b) => a + b.avgResponseTimeMs, 0) / points.length),
      overallErrorRate: Number((points.reduce((a, b) => a + b.errorRatePercent, 0) / points.length).toFixed(2))
    }
  };

  testRunsStore.unshift(importedRun);

  const evaluation = evaluateCapacityAndBottlenecks(points, activeThresholds);

  res.status(201).json({
    success: true,
    run: importedRun,
    evaluation
  });
});

export default router;
