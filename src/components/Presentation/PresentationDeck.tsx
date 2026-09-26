import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Mic,
  Presentation,
  CheckCircle,
  Cpu,
  Layers,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';

export const PresentationDeck: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showScript, setShowScript] = useState(false);

  const slides = [
    {
      number: 1,
      title: 'Smart Web Application Capacity Analyzer',
      subtitle: 'Evaluating Application Throughput & Bottlenecks using Azure Load Testing',
      category: 'Project Title & Overview',
      points: [
        'Developer & Cloud Architect: Student Hackathon Team',
        'Stack: React, Vite, Node.js Express, Azure App Service, Azure Load Testing',
        'Objective: Determine empirical concurrent user capacity under SLA constraints (<1000ms latency, <5% error rate)'
      ],
      callout: 'Target: Real-world tourism and homestay booking application under staged concurrency (10 → 100 virtual users)'
    },
    {
      number: 2,
      title: 'Problem Statement: The Cloud Overprovisioning Dilemma',
      subtitle: 'Why guess when you can measure?',
      category: 'Problem & Motivation',
      points: [
        'Unpredictable Traffic Surges: University portals, ticketing systems, and tourism apps crash during sudden flash loads.',
        'Blind Cloud Spending: Teams often blindly upgrade App Service tiers ($$$) without knowing if CPU, memory, or database queries are the real bottleneck.',
        'Lack of Objective Capacity Baseline: Production deployments lack empirical data on how many concurrent users the service can safely handle before degrading.'
      ],
      callout: 'Core Question: Exactly how many concurrent users can our application handle before breaching our 1000ms SLA?'
    },
    {
      number: 3,
      title: 'Proposed Solution: Automated Capacity Analyzer',
      subtitle: 'A closed-loop performance measurement and diagnosis platform',
      category: 'Solution Architecture',
      points: [
        'Full-Stack Tourism Platform: Deployed on Azure App Service with catalogue, homestay booking, and query endpoints.',
        'Automated Staged Load Injection: Azure Load Testing engine simulates 10, 25, 50, and 100 concurrent virtual users.',
        'Rule-Based Bottleneck Diagnosis: Real-time telemetry evaluates CPU saturation, memory exhaustion, and latency spikes against SLA rules.',
        'Actionable Cloud Recommendations: Suggests auto-scale rules, CDN caching, and connection pooling adjustments.'
      ],
      callout: 'Delivers "Observed capacity under the tested configuration" backed by rigorous empirical measurements.'
    },
    {
      number: 4,
      title: 'End-to-End System Architecture',
      subtitle: 'Cloud-native integration on Microsoft Azure',
      category: 'Architecture',
      points: [
        'Load Layer: Azure Load Testing (managed distributed JMeter test engine generating HTTP traffic).',
        'Compute Layer: Azure App Service (Linux Node.js runtime) hosting Express REST APIs and React SPA.',
        'Monitoring Layer: Azure Monitor & Application Insights capturing server response times, CPU, and memory telemetry.',
        'Analytics Dashboard: Web Capacity Analyzer parsing raw metrics, rendering correlation curves, and diagnosing bottlenecks.'
      ],
      callout: 'Architecture: Azure Load Testing ➔ HTTP Requests ➔ Azure App Service ➔ Telemetry Ingestion ➔ Capacity Analyzer'
    },
    {
      number: 5,
      title: 'Azure Load Testing Methodology',
      subtitle: 'Scientific 4-stage progression testing',
      category: 'Testing Methodology',
      points: [
        'Stage 1 (10 VUs): Baseline verification — verifies core API health and baseline latency (~145 ms).',
        'Stage 2 (25 VUs): Light production traffic — confirms smooth linear throughput growth (~97.5 req/sec).',
        'Stage 3 (50 VUs): Target operational capacity — optimal throughput (~186.7 req/sec) with ~520 ms latency.',
        'Stage 4 (100 VUs): Stress & Saturation — tests system breaking point; observed latency exceeding 1400 ms.'
      ],
      callout: 'Controlled duration (60s stages) suitable for agile student hackathons without incurring excessive cloud costs.'
    },
    {
      number: 6,
      title: 'Measured Performance Metrics & Curves',
      subtitle: 'Clear visualization of the saturation threshold',
      category: 'Data & Metrics',
      points: [
        'Latency Curve: Maintained sub-600ms latency up to 50 concurrent users; hockey-stick surge to 1420ms at 100 users.',
        'Throughput Curve: Linear scaling from 40.2 RPS (10 VU) to 186.7 RPS (50 VU), then plateauing at 296 RPS.',
        'Error Rate: Near zero (0.0% - 1.1%) through 50 users; escalated to 6.8% at 100 users due to connection queue saturation.',
        'Resource Saturation: Host CPU climbed to 89.2% and Memory to 82.5% at 100 users.'
      ],
      callout: 'Key Insight: The system scales smoothly up to 50 users, after which compute saturation causes exponential latency degradation.'
    },
    {
      number: 7,
      title: 'Capacity Finding & Bottleneck Analysis',
      subtitle: 'Evidence-based engineering conclusions',
      category: 'Capacity Analysis',
      points: [
        'Observed Capacity: 50 Concurrent Virtual Users under the tested single-instance configuration.',
        'Status Verdict: "Performance threshold exceeded" when pushed to 100 users (latency > 1000ms & errors > 5%).',
        'Primary Bottleneck: CPU utilization reached 89.2%, causing Node.js single-thread event loop queue delays.',
        'Remediation Plan: Configure Azure App Service Autoscale (scale out to 2 instances when CPU > 75%) and enable Redis caching.'
      ],
      callout: 'No unsubstantiated guesses: all findings correspond directly to measured telemetry.'
    },
    {
      number: 8,
      title: 'Future Roadmap & Hackathon Takeaways',
      subtitle: 'Production readiness and next iterations',
      category: 'Future Improvements',
      points: [
        'CI/CD Pipeline Gate: Integrate Azure Load Testing into GitHub Actions to fail pull requests that regress latency.',
        'Distributed Relational DB: Connect Azure Database for PostgreSQL with PgBouncer connection pooling.',
        'AI Regression Detection: Automated root-cause correlation comparing flame graphs with code commits.',
        'Multi-Region Testing: Simulate geo-distributed traffic from multiple Azure cloud regions.'
      ],
      callout: 'Built and verified in under 6 hours: Complete full-stack app + Azure Load Testing configuration + analyzer.'
    }
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">
            <Presentation className="w-4 h-4" />
            <span>Interactive Presentation Mode</span>
          </div>
          <h2 className="text-2xl font-black text-white">Hackathon Presentation Deck</h2>
          <p className="text-xs text-slate-400">
            Slide {currentSlide + 1} of {slides.length} • Includes 2-3 minute speaker script for judges
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowScript(!showScript)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors border ${
              showScript
                ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-sky-400" />
            <span>{showScript ? 'Hide Speaker Script' : 'Show Speaker Script'}</span>
          </button>
        </div>
      </div>

      {/* Main Slide Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative min-h-[460px] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-950 text-blue-300 border border-blue-800 uppercase tracking-wider">
              {slides[currentSlide].category}
            </span>
            <span className="text-sm font-mono text-slate-500">
              Slide {currentSlide + 1} / {slides.length}
            </span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-2">
            {slides[currentSlide].title}
          </h3>
          <p className="text-sm sm:text-base text-sky-300 font-medium mb-8">
            {slides[currentSlide].subtitle}
          </p>

          <div className="space-y-4 mb-8">
            {slides[currentSlide].points.map((pt, idx) => (
              <div key={idx} className="flex items-start gap-3 text-slate-200 text-sm sm:text-base">
                <div className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 border border-blue-500/40">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>
                <span>{pt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Slide Callout Banner */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium text-slate-300">
            {slides[currentSlide].callout}
          </span>
        </div>

        {/* Slide Navigation Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-800 mt-6">
          <button
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Slide</span>
          </button>

          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentSlide ? 'bg-blue-500 w-6' : 'bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white rounded-xl text-xs font-semibold transition-colors shadow-lg shadow-blue-600/30"
          >
            <span>Next Slide</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2-3 Minute Presentation Script Panel */}
      {showScript && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
            <Mic className="w-4 h-4" />
            <span>2-3 Minute Spoken Presentation Script for Judges</span>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-4 leading-relaxed font-sans">
            <p>
              <strong className="text-white">Opening (0:00 - 0:30):</strong> "Good morning judges! We are proud to present our project: the <em>Smart Web Application Capacity Analyzer using Azure Load Testing</em>. When deploying cloud applications, developers often ask: <em>How many users can our server actually handle before breaking?</em> Too often, teams guess or over-provision costly cloud resources. We decided to solve this with empirical measurement."
            </p>
            <p>
              <strong className="text-white">System Architecture & Demo App (0:30 - 1:00):</strong> "We built a full-stack tourism and homestay booking application hosted on Azure App Service with Node.js Express. All endpoints—from catalogue browsing to searches and bookings—are real REST APIs. To test its limits, we integrated Azure Load Testing, running a controlled 4-stage progression of 10, 25, 50, and 100 concurrent virtual users."
            </p>
            <p>
              <strong className="text-white">Live Findings & Capacity Analysis (1:00 - 1:45):</strong> "Looking at our Capacity Dashboard, we established SLA thresholds: an average response time under 1000 milliseconds and an error rate below 5%. As you can see on the charts, at 10 and 25 users, the application responds in under 250 milliseconds with zero errors. At 50 users, throughput reaches 186 requests per second, well within SLA. However, when we pushed to 100 users, response time climbed to 1420 milliseconds and error rates touched 6.8%."
            </p>
            <p>
              <strong className="text-white">Bottleneck Identification & Closing (1:45 - 2:30):</strong> "Our automated diagnostic engine flagged the root issue: CPU utilization spiked to 89.2%, causing thread worker queue delays. Therefore, our formal finding is: <em>Observed capacity under the tested configuration is 50 concurrent virtual users</em>. Based on this, we recommend Azure App Service autoscale rules triggered at 70% CPU and edge caching for catalogue routes. Thank you, and we welcome your questions!"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
