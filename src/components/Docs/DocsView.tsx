import React, { useState } from 'react';
import {
  FileText,
  Server,
  Cloud,
  Layers,
  CheckCircle,
  Copy,
  Check,
  ExternalLink,
  Code,
  Shield,
  Zap,
  Terminal
} from 'lucide-react';

export const DocsView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'architecture' | 'deployment' | 'loadtesting' | 'manual'>('architecture');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">
          <FileText className="w-4 h-4" />
          <span>Technical Reference & Runbooks</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          System Architecture & Azure Guides
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Comprehensive implementation documentation for Azure App Service hosting, Azure Load Testing configuration, and the 6-hour hackathon execution checklist.
        </p>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-800 flex-wrap">
          <button
            onClick={() => setActiveSection('architecture')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeSection === 'architecture'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Architecture Diagram</span>
          </button>
          <button
            onClick={() => setActiveSection('deployment')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeSection === 'deployment'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Azure App Service Deployment</span>
          </button>
          <button
            onClick={() => setActiveSection('loadtesting')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeSection === 'loadtesting'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Azure Load Testing Setup</span>
          </button>
          <button
            onClick={() => setActiveSection('manual')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeSection === 'manual'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Hackathon Checklist & Manual Azure Steps</span>
          </button>
        </div>
      </div>

      {/* 1. ARCHITECTURE SECTION */}
      {activeSection === 'architecture' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              <span>Cloud & Application Architecture</span>
            </h3>

            {/* ASCII Architecture Diagram */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-xs sm:text-sm text-sky-300 overflow-x-auto leading-relaxed">
              <pre>{`
                          +-----------------------------------+
                          |        Azure Load Testing         |
                          | (Managed Distributed Test Engine) |
                          +-----------------+-----------------+
                                            |
                                            | Staged HTTP Load (10 -> 100 VUs)
                                            v
                          +-----------------+-----------------+
                          |        Azure App Service          |
                          |      (Linux Node.js Runtime)      |
                          +--------+-----------------+--------+
                                   |                 |
                   GET / POST APIs |                 | Azure Monitor
                                   v                 v
                    +--------------+--+     +--------+--------+
                    |  Express API    |     | Application     |
                    |  Controllers    |     | Insights Live   |
                    |  & Mock Stores  |     | Metrics Stream  |
                    +--------+--------+     +--------+--------+
                             |                       |
                             +-----------+-----------+
                                         |
                                         v
                          +--------------+--------------------+
                          |    Web Capacity Analyzer Engine   |
                          | - SLA Threshold Verification      |
                          | - Potential Bottleneck Diagnosis  |
                          | - Scaling Recommendations         |
                          +-----------------------------------+
              `}</pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-white block">1. Azure Load Testing</span>
                <p className="text-slate-400">
                  Provisioned via Azure Portal or YAML script to execute Apache JMeter scripts at controlled concurrency with zero infrastructure overhead.
                </p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-white block">2. Node Express Backend</span>
                <p className="text-slate-400">
                  Handles catalogue search, homestay booking, and system telemetry endpoints with non-blocking async JSON handlers.
                </p>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-white block">3. Capacity Rule Engine</span>
                <p className="text-slate-400">
                  Evaluates P95 and average latency against SLA limits, identifies compute/memory saturation, and outputs observed capacity.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. DEPLOYMENT SECTION */}
      {activeSection === 'deployment' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-400" />
              <span>Azure App Service Deployment Guide</span>
            </h3>

            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <p>
                The application is engineered to work interchangeably in both environments without code changes:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
                <li><strong className="text-white">Local Development:</strong> <code className="bg-slate-950 px-2 py-0.5 rounded text-sky-300">http://localhost:3000</code></li>
                <li><strong className="text-white">Azure Production:</strong> <code className="bg-slate-950 px-2 py-0.5 rounded text-sky-300">https://YOUR-APP.azurewebsites.net</code></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white">Exact Azure CLI Deployment Commands</h4>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative">
                <button
                  onClick={() =>
                    handleCopy(
                      `# 1. Login to Azure\naz login\n\n# 2. Set subscription\naz account set --subscription "<SUBSCRIPTION_ID>"\n\n# 3. Create Resource Group\naz group create --name rg-capacity-analyzer --location eastus\n\n# 4. Create App Service Plan (B1 Basic - Free Tier/Credit compatible)\naz appservice plan create --name plan-capacity-analyzer --resource-group rg-capacity-analyzer --sku B1 --is-linux\n\n# 5. Create Web App\naz webapp create --resource-group rg-capacity-analyzer --plan plan-capacity-analyzer --name tourist-capacity-demo --runtime "NODE:20-lts"\n\n# 6. Set Startup Command & Port\naz webapp config set --resource-group rg-capacity-analyzer --name tourist-capacity-demo --startup-file "npm start"\n\n# 7. Deploy code from local Git or ZIP\naz webapp deployment source config-zip --resource-group rg-capacity-analyzer --name tourist-capacity-demo --src app.zip`,
                      'deploy-cli'
                    )
                  }
                  className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1"
                >
                  {copiedId === 'deploy-cli' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === 'deploy-cli' ? 'Copied' : 'Copy'}</span>
                </button>
                <pre className="font-mono text-xs text-sky-300 overflow-x-auto leading-relaxed">
{`# 1. Login to Azure
az login

# 2. Set subscription
az account set --subscription "<SUBSCRIPTION_ID>"

# 3. Create Resource Group
az group create --name rg-capacity-analyzer --location eastus

# 4. Create App Service Plan (B1 Basic - Student/Free Tier compatible)
az appservice plan create --name plan-capacity-analyzer --resource-group rg-capacity-analyzer --sku B1 --is-linux

# 5. Create Web App with Node 20 LTS
az webapp create --resource-group rg-capacity-analyzer --plan plan-capacity-analyzer --name tourist-capacity-demo --runtime "NODE:20-lts"

# 6. Configure Startup Script
az webapp config set --resource-group rg-capacity-analyzer --name tourist-capacity-demo --startup-file "npm start"

# 7. Configure Environment Variable for Production
az webapp config appsettings set --resource-group rg-capacity-analyzer --name tourist-capacity-demo --settings NODE_ENV="production"`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. LOAD TESTING SETUP SECTION */}
      {activeSection === 'loadtesting' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Cloud className="w-5 h-5 text-sky-400" />
              <span>Azure Load Testing Configuration Guide</span>
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <p>
                Configure Azure Load Testing to run against the following 4 core target endpoints:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <strong className="text-sky-300 font-mono block">GET /api/health</strong>
                  <span className="text-slate-400">Verifies basic server liveness and telemetry response.</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <strong className="text-sky-300 font-mono block">GET /api/tourist-places</strong>
                  <span className="text-slate-400">Read-heavy catalogue retrieval simulating explorer visits.</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <strong className="text-sky-300 font-mono block">GET /api/homestays</strong>
                  <span className="text-sky-300 font-mono block">GET /api/search?q=hyderabad</span>
                  <span className="text-slate-400">Simulates search query scanning across listings.</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <strong className="text-sky-300 font-mono block">POST /api/bookings</strong>
                  <span className="text-slate-400">Write transaction validating booking reservations.</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white">Suggested Test Progression for University Hackathon</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-slate-500 block uppercase text-[10px]">Test 1</span>
                  <strong className="text-base text-blue-400 font-mono block my-1">10 VUs</strong>
                  <span className="text-slate-400">Baseline Health</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-slate-500 block uppercase text-[10px]">Test 2</span>
                  <strong className="text-base text-blue-400 font-mono block my-1">25 VUs</strong>
                  <span className="text-slate-400">Light Concurrency</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-slate-500 block uppercase text-[10px]">Test 3</span>
                  <strong className="text-base text-emerald-400 font-mono block my-1">50 VUs</strong>
                  <span className="text-slate-400">Optimal Load</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <span className="text-slate-500 block uppercase text-[10px]">Test 4</span>
                  <strong className="text-base text-rose-400 font-mono block my-1">100 VUs</strong>
                  <span className="text-slate-400">Saturation Limit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MANUAL AZURE STEPS & CHECKLIST */}
      {activeSection === 'manual' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-sky-400" />
              <span>What You Need to Do in Azure Portal (6-Hour Checklist)</span>
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
                  Create Azure App Service
                </span>
                <p className="text-slate-400 pl-7">
                  Go to Azure Portal ➔ Create a Resource ➔ Web App. Select <strong>Linux</strong>, <strong>Node 20 LTS</strong>, and Pricing Plan <strong>B1 Basic</strong> (or Free F1 for prototyping).
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">2</span>
                  Deploy This Web Capacity Analyzer Codebase
                </span>
                <p className="text-slate-400 pl-7">
                  In App Service, go to <strong>Deployment Center</strong> ➔ Connect your GitHub repository (or use VS Code Azure App Service Extension for 1-click deployment).
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">3</span>
                  Create Azure Load Testing Resource
                </span>
                <p className="text-slate-400 pl-7">
                  In Azure Portal ➔ Create <strong>Azure Load Testing</strong> (name: <code>alt-capacity-study</code>).
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">4</span>
                  Run Test Progression & Download CSV
                </span>
                <p className="text-slate-400 pl-7">
                  In Azure Load Testing, upload <code>load-testing/test-plan.jmx</code> and <code>load-testing/azure-load-test-config.yaml</code>. Run tests at 10, 25, 50, and 100 virtual users. Download the metrics CSV and paste into our in-app <strong>Azure Hub & Import</strong> tab!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
