import React, { useState } from 'react';
import {
  FileText,
  Upload,
  Download,
  Copy,
  Check,
  ExternalLink,
  Code,
  Shield,
  Layers,
  ArrowRight,
  Database,
  Cloud
} from 'lucide-react';
import { TestRunReport, PerformanceThresholds } from '../../types';

interface AzureLoadTestingHubProps {
  onImportSuccess: (run: TestRunReport) => void;
  onNavigateToDashboard: () => void;
}

export const AzureLoadTestingHub: React.FC<AzureLoadTestingHubProps> = ({
  onImportSuccess,
  onNavigateToDashboard
}) => {
  const [activeTab, setActiveTab] = useState<'import' | 'config' | 'cli'>('import');
  const [copiedYaml, setCopiedYaml] = useState(false);
  const [copiedCli, setCopiedCli] = useState(false);
  const [importName, setImportName] = useState('Azure Load Test Run #204');
  const [appUrl, setAppUrl] = useState('https://tourist-capacity-demo.azurewebsites.net');
  const [rawCsvInput, setRawCsvInput] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Sample Azure Load Testing CSV Export
  const sampleAzureCsv = `Virtual Users,Requests/sec,Average (ms),Error %,CPU %,Memory %
10,42.5,138,0.00,22.0,36.5
25,102.3,215,0.10,39.4,44.2
50,194.8,490,0.85,64.2,56.8
75,260.1,880,2.40,78.5,71.0
100,312.4,1360,5.80,88.4,81.5`;

  const yamlConfig = `version: v0.1
testId: web-capacity-analyzer-tourist-service
displayName: Smart Web Application Capacity Analyzer
description: Staged concurrency test (10 -> 100 VUs) evaluating response time SLA and CPU bottlenecks

testPlan: test-plan.jmx
engineInstances: 1

env:
  - name: APP_BASE_URL
    value: ${appUrl}
  - name: TARGET_ENDPOINT
    value: /api/tourist-places

# Pass/Fail Failure Criteria for Azure Load Testing pipeline gate
failureCriteria:
  - avg(response_time_ms) > 1000
  - error() > 5.0
  - p95(response_time_ms) > 2000

autoStop:
  errorPercentage: 20
  timeWindow: 30
`;

  const azureCliScript = `# 1. Create Azure Resource Group & Load Testing Resource
az group create --name rg-capacity-analyzer --location eastus

az load create --name alt-tourist-service --resource-group rg-capacity-analyzer --location eastus

# 2. Deploy Azure App Service (B1 Basic or P1v2 Production)
az appservice plan create --name plan-capacity-analyzer --resource-group rg-capacity-analyzer --sku B1 --is-linux

az webapp create --resource-group rg-capacity-analyzer --plan plan-capacity-analyzer --name tourist-capacity-demo --runtime "NODE:20-lts"

# 3. Create and execute Azure Load Test from YAML configuration
az load test create --load-test-resource alt-tourist-service --resource-group rg-capacity-analyzer --test-id capacity-stage-test --load-test-config-file azure-load-test-config.yaml

az load test-run create --load-test-resource alt-tourist-service --resource-group rg-capacity-analyzer --test-id capacity-stage-test --test-run-id run-$(date +%s) --display-name "University Hackathon Run"

# 4. Download Metrics CSV and import into this analyzer
az load test-run download-files --load-test-resource alt-tourist-service --resource-group rg-capacity-analyzer --test-run-id <run-id> --path ./results --export-metric-results
`;

  const handleCopy = (text: string, type: 'yaml' | 'cli') => {
    navigator.clipboard.writeText(text);
    if (type === 'yaml') {
      setCopiedYaml(true);
      setTimeout(() => setCopiedYaml(false), 2000);
    } else {
      setCopiedCli(true);
      setTimeout(() => setCopiedCli(false), 2000);
    }
  };

  const handleLoadSample = () => {
    setRawCsvInput(sampleAzureCsv);
    setImportStatus('Loaded real Azure Load Testing export sample format.');
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawCsvInput.trim()) {
      setImportStatus('Please paste or load CSV results first.');
      return;
    }

    setIsImporting(true);
    setImportStatus(null);

    try {
      const res = await fetch('/api/load-test/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: importName,
          sourceUrl: appUrl,
          rawCsv: rawCsvInput
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to parse Azure CSV');
      }

      setImportStatus('✅ Azure Load Testing results successfully imported!');
      onImportSuccess(data.run);
    } catch (err: any) {
      setImportStatus(`❌ Import Error: ${err.message || 'CSV format error'}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
          <Cloud className="w-4 h-4" />
          <span>Azure Cloud Performance Ecosystem</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Azure Load Testing Hub & Results Importer
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Generate deployment-ready Azure Load Testing YAML configurations, copy CLI setup scripts, or import real Azure test CSV export files to feed the capacity analyzer.
        </p>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'import'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Azure Results (CSV)</span>
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'config'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>azure-load-test-config.yaml</span>
          </button>
          <button
            onClick={() => setActiveTab('cli')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'cli'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Azure CLI Commands</span>
          </button>
        </div>
      </div>

      {/* 1. IMPORT TAB */}
      {activeTab === 'import' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Import Azure Test Results CSV</h3>
                <p className="text-xs text-slate-400">
                  Accepts official Azure Load Testing CSV summary exports or JMeter aggregated metrics
                </p>
              </div>
              <button
                type="button"
                onClick={handleLoadSample}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
              >
                Load Azure Sample CSV
              </button>
            </div>

            {importStatus && (
              <div
                className={`p-3 rounded-xl text-xs font-medium ${
                  importStatus.includes('✅')
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-slate-950 text-sky-300 border border-slate-800'
                }`}
              >
                {importStatus}
              </div>
            )}

            <form onSubmit={handleImportSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Test Run Name
                  </label>
                  <input
                    type="text"
                    value={importName}
                    onChange={(e) => setImportName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tested Azure App URL
                  </label>
                  <input
                    type="text"
                    value={appUrl}
                    onChange={(e) => setAppUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Raw CSV Data (Virtual Users, Requests/sec, Average (ms), Error %, CPU %, Memory %)
                </label>
                <textarea
                  rows={8}
                  value={rawCsvInput}
                  onChange={(e) => setRawCsvInput(e.target.value)}
                  placeholder={`Virtual Users,Requests/sec,Average (ms),Error %,CPU %,Memory %\n10,40.0,150,0.00,20.0,35.0\n...`}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isImporting}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition-colors shadow-lg shadow-blue-600/30 disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isImporting ? 'Ingesting...' : 'Import into Capacity Analyzer'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Guidance Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Cloud className="w-4 h-4 text-sky-400" />
              <span>How to Export from Azure Portal</span>
            </h4>
            <ol className="space-y-3 text-xs text-slate-300 list-decimal list-inside">
              <li>
                In the <strong>Azure Portal</strong>, navigate to your <strong>Azure Load Testing</strong> resource.
              </li>
              <li>
                Click <strong>Tests</strong> in the left pane and select your test run.
              </li>
              <li>
                Under <strong>Test run results</strong>, click <strong>Download</strong> and choose <strong>Metrics report (.csv)</strong>.
              </li>
              <li>
                Paste the CSV rows into this importer, or click <em>Load Azure Sample CSV</em> for instant hackathon demonstration.
              </li>
            </ol>

            <div className="pt-3 border-t border-slate-800">
              <button
                onClick={onNavigateToDashboard}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Go to Capacity Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. CONFIG YAML TAB */}
      {activeTab === 'config' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white font-mono">azure-load-test-config.yaml</h3>
              <p className="text-xs text-slate-400">
                Official Azure Load Testing configuration file ready for Azure CLI or GitHub Actions
              </p>
            </div>
            <button
              onClick={() => handleCopy(yamlConfig, 'yaml')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              {copiedYaml ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedYaml ? 'Copied to Clipboard' : 'Copy YAML File'}</span>
            </button>
          </div>

          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-sky-300 overflow-x-auto leading-relaxed">
            {yamlConfig}
          </pre>
        </div>
      )}

      {/* 3. CLI COMMANDS TAB */}
      {activeTab === 'cli' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">Azure CLI Automation Script</h3>
              <p className="text-xs text-slate-400">
                Copy & paste these commands into Azure Cloud Shell or your local terminal
              </p>
            </div>
            <button
              onClick={() => handleCopy(azureCliScript, 'cli')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              {copiedCli ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCli ? 'Copied Script' : 'Copy CLI Script'}</span>
            </button>
          </div>

          <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
            {azureCliScript}
          </pre>
        </div>
      )}
    </div>
  );
};
