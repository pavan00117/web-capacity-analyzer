# Smart Web Application Capacity Analyzer using Azure Load Testing

[![Azure App Service](https://img.shields.io/badge/Azure-App%20Service-0078D4?logo=microsoftazure)](https://azure.microsoft.com/)
[![Azure Load Testing](https://img.shields.io/badge/Azure-Load%20Testing-blue?logo=microsoftazure)](https://azure.microsoft.com/products/load-testing)
[![Node.js](https://img.shields.io/badge/Node.js-v20-339933?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

A cloud performance engineering solution built for a university hackathon that demonstrates how many concurrent users a web application can handle under defined SLA criteria. It performs staged concurrency load generation, empirical latency measurement, rule-based bottleneck identification, and actionable cloud autoscaling recommendations.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Key Features](#2-key-features)
3. [System Architecture](#3-system-architecture)
4. [Technology Stack](#4-technology-stack)
5. [Prerequisites](#5-prerequisites)
6. [Installation & Setup](#6-installation--setup)
7. [Running Locally](#7-running-locally)
8. [Environment Variables](#8-environment-variables)
9. [Azure Deployment (App Service)](#9-azure-deployment-app-service)
10. [Azure Load Testing Setup](#10-azure-load-testing-setup)
11. [How to Run Tests](#11-how-to-run-tests)
12. [How to Interpret Results](#12-how-to-interpret-results)
13. [Capacity Analysis Methodology](#13-capacity-analysis-methodology)
14. [Troubleshooting Guide](#14-troubleshooting-guide)
15. [Future Roadmap](#15-future-roadmap)

---

## 1. Project Overview

When deploying web applications, engineering teams often guess how many simultaneous visitors the system can withstand, leading to either costly overprovisioning or catastrophic server crashes during sudden traffic spikes.

This project delivers an end-to-end performance study that:
- Deploys a realistic full-stack tourism web application (places catalogue, homestay booking, and query search).
- Executes controlled concurrency tests (10 → 25 → 50 → 100 virtual users) via Azure Load Testing.
- Empirically measures throughput (RPS), average latency, P95 latency, error rates, and CPU/memory footprint.
- Performs automated rule-based bottleneck diagnosis.
- Produces rigorous capacity findings adhering to non-presumptive phrasing: *"Observed capacity under the tested configuration"*.

---

## 2. Key Features

- **Full-Stack Tourism Application:** Real Node.js Express REST APIs (`/api/health`, `/api/tourist-places`, `/api/homestays`, `/api/search?q=hyderabad`, `/api/bookings`).
- **Interactive Capacity Dashboard:** Visual pipeline flow (`LOAD` ➔ `PERFORMANCE` ➔ `CAPACITY` ➔ `BOTTLENECK`), 8 core KPI cards, responsive SVG correlation charts, and stage-by-stage progression tables.
- **Configurable SLA Thresholds:** Dynamically adjust Response Time SLA (default: 1000 ms), Error Rate Limit (default: 5.0%), and CPU Warning Threshold (default: 80%) with instant recalculation.
- **Rule-Based Bottleneck Detector:** Diagnostic rules that catch CPU compute saturation, latency regression, error rate spikes, and memory pressure with concrete remediation guidance.
- **Built-in Live Load Runner:** Trigger real-time concurrent load bursts right in front of judges with live stage stepper and progress monitor.
- **Azure Hub & Results Importer:** Ingest official Azure Load Testing CSV summary exports or download generated `azure-load-test-config.yaml` and `test-plan.jmx`.
- **In-App Presentation Mode:** 8-slide presentation deck with slide switcher and a timed 2-3 minute speaker script.

---

## 3. System Architecture

```
                       +----------------------------------+
                       |        Azure Load Testing        |
                       | (Managed Distributed Test Engine)|
                       +----------------+-----------------+
                                        |
                                        | Staged HTTP Load (10 -> 100 VUs)
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

---

## 4. Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons.
- **Backend:** Node.js, Express.js (modular controllers, REST APIs, JSON validation).
- **Cloud Infrastructure:** Microsoft Azure App Service (Linux B1/P1v2).
- **Load Testing Engine:** Azure Load Testing, Apache JMeter (`.jmx`).
- **Telemetry & Monitoring:** Host-level CPU & Memory telemetry, Azure Application Insights.

---

## 5. Prerequisites

- [Node.js](https://nodejs.org/) v20.x or higher installed.
- [npm](https://www.npmjs.com/) v10.x or higher.
- A modern web browser (Chrome, Edge, Firefox, Safari).
- *(Optional for cloud deployment)* Active Azure Account and [Azure CLI](https://learn.microsoft.com/cli/azure/install-azure-cli).

---

## 6. Installation & Setup

Clone the repository and install all dependencies:

```bash
# Clone the repository
git clone https://github.com/<your-username>/web-capacity-analyzer.git
cd web-capacity-analyzer

# Install project dependencies
npm install
```

---

## 7. Running Locally

Start the full-stack Express server with Vite middleware:

```bash
# Start local development server
npm run dev
```

The application will start on `http://localhost:3000`.

### Verifying Core API Endpoints

You can verify the backend endpoints in your browser or via curl:

```bash
# 1. Health check & system telemetry
curl http://localhost:3000/api/health

# 2. Tourist places catalogue
curl http://localhost:3000/api/tourist-places

# 3. Verified homestays
curl http://localhost:3000/api/homestays

# 4. Search query
curl "http://localhost:3000/api/search?q=hyderabad"

# 5. Booking submission
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"guestName":"Ravi Kumar","email":"ravi@example.com","phone":"9876543210","targetId":"stay-1","targetType":"homestay","checkInDate":"2026-10-15","guests":2}'
```

---

## 8. Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `PORT` | HTTP server port | `3000` |
| `NODE_ENV` | Runtime environment (`development` / `production`) | `development` |
| `APP_URL` | Base public URL of the application | `http://localhost:3000` |

---

## 9. Azure Deployment (App Service)

Deploy to Microsoft Azure App Service in just a few CLI commands:

```bash
# 1. Log in to Azure CLI
az login

# 2. Create a Resource Group
az group create --name rg-capacity-analyzer --location eastus

# 3. Create a Linux App Service Plan (B1 Basic)
az appservice plan create \
  --name plan-capacity-analyzer \
  --resource-group rg-capacity-analyzer \
  --sku B1 \
  --is-linux

# 4. Create Web App
az webapp create \
  --resource-group rg-capacity-analyzer \
  --plan plan-capacity-analyzer \
  --name tourist-capacity-demo \
  --runtime "NODE:20-lts"

# 5. Set startup script
az webapp config set \
  --resource-group rg-capacity-analyzer \
  --name tourist-capacity-demo \
  --startup-file "npm start"

# 6. Configure environment variables
az webapp config appsettings set \
  --resource-group rg-capacity-analyzer \
  --name tourist-capacity-demo \
  --settings NODE_ENV="production"
```

---

## 10. Azure Load Testing Setup

1. In the **Azure Portal**, search for **Azure Load Testing** and click **Create**.
2. Name the resource: `alt-capacity-study`.
3. Under **Tests**, click **+ Create** ➔ **Upload a test script**.
4. Select `load-testing/test-plan.jmx` and `load-testing/azure-load-test-config.yaml`.
5. Under **App Components**, link your Azure App Service (`tourist-capacity-demo`) to collect server-side metrics.
6. Click **Run test**.

---

## 11. How to Run Tests

### Option A: Using the In-App Live Load Runner
1. Open the application and switch to the **Live Load Runner** tab.
2. Select target API (`/api/tourist-places`, `/api/homestays`, `/api/search?q=hyderabad`, or `/api/health`).
3. Click **Execute Load Test Progression**.
4. Observe the real-time stage stepper (10 ➔ 25 ➔ 50 ➔ 100 VUs) and live logs.
5. Click **View in Capacity Dashboard** to see results.

### Option B: Importing Real Azure Results
1. In Azure Load Testing, click **Download** ➔ **Metrics report (.csv)**.
2. In the app, switch to **Azure Hub & Import**.
3. Paste your CSV or click **Load Azure Sample CSV**.
4. Click **Import into Capacity Analyzer**.

---

## 12. How to Interpret Results

| Virtual Users | Avg Response Time | Error Rate | Throughput | CPU Usage | Status |
|---|---|---|---|---|---|
| **10 VU** | ~145 ms | 0.00% | 40.2 req/s | 24.5% | **PASS** |
| **25 VU** | ~230 ms | 0.20% | 97.5 req/s | 42.1% | **PASS** |
| **50 VU** | ~520 ms | 1.10% | 186.7 req/s | 68.4% | **PASS** |
| **100 VU** | ~1420 ms | 6.80% | 296.6 req/s | 89.2% | **INVESTIGATE** |

---

## 13. Capacity Analysis Methodology

- **Threshold Compliance:**
  - If `avgResponseTime <= threshold` AND `errorRate <= threshold`: **"Within defined performance criteria"**.
  - Otherwise: **"Performance threshold exceeded"**.
- **Evidence-Based Phrasing:** The finding is formally stated as:
  > *"Observed capacity under the tested configuration: 50 Concurrent Virtual Users."*
- **Rule-Based Bottlenecks:**
  - `CPU > 80%`: *"High CPU utilization detected. Investigate application compute capacity."*
  - `Response Time > SLA`: *"Response time exceeded the defined threshold."*
  - `Error Rate > 5%`: *"Error rate exceeded the defined threshold."*
  - `Memory > 80%`: *"High memory utilization detected."*

---

## 14. Troubleshooting Guide

- **Port 3000 already in use:** Specify another port using `PORT=3001 npm start`.
- **Azure App Service deployment returns 502/503:** Verify that startup command is set to `npm start` in Azure App Service Configuration.
- **CORS issues during external load testing:** The Express server includes permissive CORS middleware headers on `/api/*` routes.

---

## 15. Future Roadmap

- Automated GitHub Actions CI/CD load testing gate on pull requests.
- Managed Azure Database for PostgreSQL with connection pooling.
- Application Insights Profiler flame graphs for hot-path CPU analysis.
- Multi-region distributed load test injection.

---

*Built with ❤️ for University Hackathon 2026.*
