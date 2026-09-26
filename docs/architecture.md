# System Architecture: Smart Web Application Capacity Analyzer

## Overview

The **Web Capacity Analyzer** is an integrated performance analysis and cloud capacity evaluation system. It demonstrates how to empirically determine how many concurrent virtual users a cloud-hosted web application can sustain under defined performance criteria.

## High-Level Architecture Diagram

```
                       +----------------------------------+
                       |        Azure Load Testing        |
                       | (Managed Distributed Test Engine)|
                       +----------------+-----------------+
                                        |
                                        | HTTP Requests (10 -> 100 VUs)
                                        v
                       +----------------+-----------------+
                       |        Azure App Service         |
                       |     (Linux Node.js Runtime)      |
                       +--------+----------------+--------+
                                |                |
                GET / POST APIs |                | Telemetry Stream
                                v                v
                 +--------------+--+    +--------+--------+
                 |  Express API    |    | Application     |
                 |  Controllers    |    | Insights /      |
                 |  & Data Store   |    | Azure Monitor   |
                 +--------+--------+    +--------+--------+
                          |                      |
                          +-----------+----------+
                                      |
                                      v
                       +--------------+-------------------+
                       |    Web Capacity Analyzer Engine  |
                       | - Latency & SLA Evaluation       |
                       | - Rule-Based Bottleneck Detector |
                       | - Autoscale Recommendations      |
                       +----------------------------------+
```

## Key Architectural Components

### 1. Target Web Application (Hyderabad Heritage Tourism)
- **Role:** Represents a realistic production web application with multi-route catalog retrieval, complex text searches, and transaction bookings.
- **Runtime:** Node.js (v20 LTS), Express.js framework, Vite-bundled React SPA frontend.
- **Data Layer:** In-memory high-performance data store simulating tourism places, verified homestays, and user reservations.

### 2. Azure App Service
- **Role:** Cloud compute hosting tier running on Linux.
- **Port Handling:** Uses standard `process.env.PORT || 3000` to bind seamlessly in local Docker/development and Azure App Service reverse proxy.
- **Scaling:** Tested in B1/P1v2 single-instance plan to establish baseline compute thresholds.

### 3. Azure Load Testing
- **Role:** Managed load injection service executing Apache JMeter (`.jmx`) scripts with configurable thread concurrency (10, 25, 50, 100 virtual users).
- **Failure Gates:** Configured with criteria rules (`avg(response_time_ms) > 1000` and `error() > 5.0%`).

### 4. Automated Capacity & Bottleneck Engine
- **SLA Threshold Verification:** Compares empirical metrics against configurable response time, error rate, and CPU warning thresholds.
- **Terminology Discipline:** Labels findings as "Observed capacity under the tested configuration" rather than claiming an absolute theoretical ceiling.
- **Diagnostic Rules:** Identifies CPU exhaustion, memory pressure, and connection queue saturation with actionable remediation guidance.
