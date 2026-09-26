# Azure Load Testing Guide

This directory contains the configuration files and test artifacts for running staged concurrency tests on Microsoft Azure Load Testing.

## Files Included

- `azure-load-test-config.yaml`: The official test configuration file defining failure criteria, parameters, and test targets.
- `test-plan.jmx`: The Apache JMeter test plan used by Azure Load Testing engines to execute requests against target endpoints.

## Target Endpoints Tested

1. `GET /api/health` - Baseline liveness probe
2. `GET /api/tourist-places` - Read-heavy catalogue retrieval
3. `GET /api/homestays` - Homestay inventory query
4. `GET /api/search?q=hyderabad` - Full-text search endpoint

## Suggested Concurrency Stages

- **Stage 1 (10 VUs):** Warmup & baseline latency verification (~145ms)
- **Stage 2 (25 VUs):** Light production load (~230ms, 97 RPS)
- **Stage 3 (50 VUs):** Optimal production load (~520ms, 186 RPS)
- **Stage 4 (100 VUs):** Saturation stress test (~1420ms, evaluating bottleneck degradation)

## How to Run in Azure Portal

1. Open **Azure Portal** and search for **Azure Load Testing**.
2. Click **Create** to provision a test resource (e.g., `alt-capacity-study`).
3. Under **Tests**, click **+ Create** -> **Upload a test script**.
4. Select `test-plan.jmx` and `azure-load-test-config.yaml`.
5. Enter your deployed App Service URL: `https://<YOUR-APP>.azurewebsites.net`.
6. Click **Review + create** -> **Run test**.
7. Once finished, click **Download** -> **Metrics report (.csv)**.
8. Open the Web Capacity Analyzer, go to **Azure Hub & Import**, and import your CSV for automated capacity analysis!
