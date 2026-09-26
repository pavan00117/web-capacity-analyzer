# Hackathon Presentation Deck & 2-3 Minute Script

## Project Title
**Smart Web Application Capacity Analyzer using Azure Load Testing**

---

## 8-Slide Presentation Content

### Slide 1: Title & Overview
- **Project:** Smart Web Application Capacity Analyzer using Azure Load Testing
- **Student Developer:** Cloud DevOps & Full-Stack Engineer
- **Core Question:** Exactly how many concurrent users can our web application sustain before breaching performance SLAs?
- **Scope:** Completed and demonstrated within a 6-hour hackathon sprint.

### Slide 2: Problem Statement
- **Cloud Overprovisioning Dilemma:** Developers often guess cloud capacity or blindly upgrade expensive VM/App Service tiers.
- **Unpredictable Surges:** Tourism portals and university registration systems frequently crash under flash traffic.
- **Missing Baseline:** Teams lack empirical, measured data on concurrency thresholds and actual failure points.

### Slide 3: Proposed Solution
- **Real Full-Stack Target Application:** Realistic Hyderabad heritage tourism and homestay booking application with REST APIs.
- **Automated Staged Concurrency:** Progressive load simulation (10 → 25 → 50 → 100 virtual users) using Azure Load Testing.
- **Dynamic Capacity Analyzer:** Configurable SLA thresholds (1000ms latency, 5% error limit) with automated rule-based bottleneck diagnosis.

### Slide 4: System Architecture
- **Load Injection:** Azure Load Testing (managed distributed JMeter engines).
- **Compute Layer:** Azure App Service running Linux Node.js (v20 LTS) Express backend and React SPA.
- **Telemetry Layer:** Azure Monitor & Application Insights capturing server-side CPU, memory, and HTTP response latencies.
- **Analysis Engine:** In-app capacity evaluation pipeline converting raw logs into actionable architectural recommendations.

### Slide 5: Azure Load Testing Methodology
- **Target Endpoints:** `/api/health`, `/api/tourist-places`, `/api/homestays`, `/api/search?q=hyderabad`.
- **Stage Progression:**
  - 10 VUs: Baseline latency (~145 ms, 0.0% error)
  - 25 VUs: Light traffic (~230 ms, 0.2% error)
  - 50 VUs: Optimal production capacity (~520 ms, 1.1% error)
  - 100 VUs: Breaking threshold (~1420 ms, 6.8% error)

### Slide 6: Performance Metrics & Latency Curves
- **Throughput:** Linear growth from 40.2 RPS up to 186.7 RPS at 50 users, plateauing at 296 RPS.
- **Response Time:** Sub-600ms through 50 users; exponential degradation to 1420ms at 100 users.
- **Host Resource Saturation:** Compute CPU rose from 24.5% up to 89.2% at 100 users.

### Slide 7: Capacity Finding & Bottleneck Diagnosis
- **Observed Capacity:** 50 Concurrent Virtual Users under tested single-instance configuration.
- **Status Verdict:** "Performance threshold exceeded" at 100 users.
- **Identified Potential Bottleneck:** High CPU utilization (89.2%) detected, leading to event-loop delay.
- **Actionable Remediation:** Configure Azure App Service autoscale rules at 70% CPU and add Redis/Front Door caching.

### Slide 8: Future Improvements
- **CI/CD Integration:** Automated Azure Load Testing pipeline gate in GitHub Actions.
- **Relational Database:** Azure Database for PostgreSQL with PgBouncer connection pooling.
- **Application Insights Profiler:** Automatic flame graph capture for blocking CPU tasks.

---

## 2-3 Minute Spoken Demo Script

> **[0:00 - 0:30] Introduction & Problem**
> "Good morning judges! We are presenting the *Smart Web Application Capacity Analyzer using Azure Load Testing*. When deploying web applications to the cloud, developers often face a dilemma: How many users can our server handle before breaking? Too often, teams guess or waste budget overprovisioning resources. We built this project to answer that question empirically."

> **[0:30 - 1:00] Architecture & Demo App**
> "Here on screen is our demo target: a full-stack tourism and homestay booking application for Hyderabad heritage. Every feature—from browsing Charminar or Golconda Fort to live searches and reservation forms—is backed by real Express REST APIs. To stress test this platform, we configured Azure Load Testing with a 4-stage progression: 10, 25, 50, and 100 concurrent virtual users."

> **[1:00 - 1:45] The Capacity Dashboard**
> "Now let's switch to our Capacity Dashboard. We defined industry-standard SLAs: an average response time under 1000 milliseconds and an error rate under 5%. As you can see on the interactive charts, up to 50 concurrent users the application stays well within SLA, delivering 186 requests per second at 520 milliseconds latency. But when we step up to 100 users, latency spikes to 1420 milliseconds and error rates rise to 6.8%."

> **[1:45 - 2:30] Bottleneck Diagnosis & Recommendations**
> "Our rule-based diagnostic engine immediately detected the root bottleneck: CPU utilization climbed to 89.2%, causing Node.js event-loop delays. Hence, our formal conclusion is: *Observed capacity under the tested configuration is 50 concurrent virtual users*. To scale further, we recommend configuring Azure App Service autoscale rules and edge caching. In addition, our app features a live test runner and an Azure CSV importer so results can be verified on any machine. Thank you!"
