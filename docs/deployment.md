# Azure App Service Deployment Runbook

This guide explains how to deploy the Web Capacity Analyzer to Microsoft Azure App Service.

## Prerequisites

1. An active Microsoft Azure account (Free student account / Free trial / Pay-As-You-Go).
2. [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) installed or use **Azure Cloud Shell** in your browser.
3. Node.js 20+ installed locally.

---

## 1. Local Testing Verification

Verify that the application runs cleanly on your workstation:

```bash
# Install dependencies
npm install

# Build client production bundle
npm run build

# Start local server (Runs on http://localhost:3000)
npm start
```

Visit `http://localhost:3000` to verify that all pages, tourism catalogues, and the capacity dashboard load properly.

---

## 2. Deployment via Azure CLI

Run these commands in your bash terminal or Azure Cloud Shell:

```bash
# Step 1: Log in to Azure
az login

# Step 2: Set your active subscription
az account set --subscription "<YOUR_SUBSCRIPTION_ID>"

# Step 3: Create Resource Group
az group create --name rg-capacity-analyzer --location eastus

# Step 4: Create App Service Plan (Linux B1 Basic tier)
az appservice plan create \
  --name plan-capacity-analyzer \
  --resource-group rg-capacity-analyzer \
  --sku B1 \
  --is-linux

# Step 5: Create App Service Web App
az webapp create \
  --resource-group rg-capacity-analyzer \
  --plan plan-capacity-analyzer \
  --name tourist-capacity-demo \
  --runtime "NODE:20-lts"

# Step 6: Configure Startup Command
az webapp config set \
  --resource-group rg-capacity-analyzer \
  --name tourist-capacity-demo \
  --startup-file "npm start"

# Step 7: Set Environment Variables
az webapp config appsettings set \
  --resource-group rg-capacity-analyzer \
  --name tourist-capacity-demo \
  --settings NODE_ENV="production" PORT="8080"
```

---

## 3. Deployment via GitHub Actions (CI/CD)

1. Push your repository to GitHub.
2. In Azure Portal, navigate to your App Service (`tourist-capacity-demo`).
3. Under **Deployment Center**, select **GitHub**.
4. Choose your repository and `main` branch.
5. Azure will automatically generate a `.github/workflows/azure-webapps-node.yml` workflow and trigger deployment!

---

## 4. Verifying Azure Deployment

Once deployment completes:
1. Open `https://tourist-capacity-demo.azurewebsites.net/api/health`.
2. Ensure you receive an HTTP 200 JSON response:
```json
{
  "status": "healthy",
  "service": "tourist-capacity-demo",
  "version": "1.0.0"
}
```
3. Open `https://tourist-capacity-demo.azurewebsites.net` to view the full application live on Azure.
