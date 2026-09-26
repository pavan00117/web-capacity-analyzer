# Azure Load Testing Methodology & Setup

## Overview

Azure Load Testing is a fully managed cloud service that allows teams to generate high-scale load without configuring complex testing infrastructure. In this project, it is used to measure the empirical capacity boundaries of the tourism web application.

---

## 1. Targeted Endpoints

The testing suite instruments 4 key API endpoints representing typical user workflows:

| Endpoint | Method | Typical Workload Profile |
|---|---|---|
| `/api/health` | GET | Heartbeat / Liveness probe (minimal CPU) |
| `/api/tourist-places` | GET | High-volume read catalogue browsing |
| `/api/homestays` | GET | Inventory and room availability search |
| `/api/search?q=hyderabad` | GET | Query filtering across entities |

---

## 2. Staged Test Progression

To identify performance degradation gracefully, we execute a 4-stage progression:

- **Stage 1 (10 Virtual Users):**
  - **Goal:** Verify baseline health, cold start behavior, and network latency.
  - **Typical Result:** ~145 ms latency, 0.0% error rate, ~40.2 RPS.

- **Stage 2 (25 Virtual Users):**
  - **Goal:** Emulate steady-state concurrent user traffic.
  - **Typical Result:** ~230 ms latency, 0.2% error rate, ~97.5 RPS.

- **Stage 3 (50 Virtual Users):**
  - **Goal:** Verify target operational SLA compliance.
  - **Typical Result:** ~520 ms latency, 1.1% error rate, ~186.7 RPS.

- **Stage 4 (100 Virtual Users):**
  - **Goal:** Identify system breaking point and bottleneck symptoms.
  - **Typical Result:** ~1420 ms latency, 6.8% error rate, ~296.6 RPS.

---

## 3. Azure Load Testing Execution Steps

### Using Azure Portal

1. In the Azure search bar, type **Azure Load Testing** and click **Create**.
2. Name your test resource: `alt-capacity-study`.
3. Click **Tests** -> **+ Create** -> **Upload a test script**.
4. In the wizard:
   - **Test name:** `capacity-progression-test`
   - **Upload script:** Upload `load-testing/test-plan.jmx` and `load-testing/azure-load-test-config.yaml`.
   - **App components:** Add your Azure App Service (`tourist-capacity-demo`) to capture server-side CPU and memory during the test!
5. Click **Review + create** -> **Run test**.

### Exporting and Analyzing Results

1. When the run finishes, click **Download** -> **Metrics report (.csv)**.
2. Open your Web Capacity Analyzer dashboard, navigate to **Azure Hub & Import**, and paste the CSV contents.
3. The dashboard will automatically recalculate the SLA compliance, generate the latency curves, and detect bottlenecks.
