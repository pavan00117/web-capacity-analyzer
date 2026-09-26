import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { PerformanceDashboard } from './components/Dashboard/PerformanceDashboard';
import { TourismView } from './components/TourismApp/TourismView';
import { LiveLoadRunner } from './components/LoadRunner/LiveLoadRunner';
import { AzureLoadTestingHub } from './components/AzureTools/AzureLoadTestingHub';
import { PresentationDeck } from './components/Presentation/PresentationDeck';
import { DocsView } from './components/Docs/DocsView';
import { TestRunReport } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'tourism' | 'dashboard' | 'runner' | 'azure' | 'presentation' | 'docs'>('dashboard');
  const [systemHealth, setSystemHealth] = useState<{
    status: string;
    uptimeSeconds?: number;
    cpuPercent?: number;
    memoryPercent?: number;
  } | null>(null);

  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      if (data.status) {
        setSystemHealth({
          status: data.status,
          uptimeSeconds: data.uptimeSeconds,
          cpuPercent: data.system?.cpuPercent,
          memoryPercent: data.system?.memoryPercent
        });
      }
    } catch (err) {
      console.warn('System health ping failed:', err);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleRunCompleted = (run: TestRunReport) => {
    setActiveTab('dashboard');
  };

  const handleImportSuccess = (run: TestRunReport) => {
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        systemHealth={systemHealth}
        refreshHealth={fetchHealth}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && (
          <PerformanceDashboard
            onNavigateToRunner={() => setActiveTab('runner')}
            onNavigateToAzure={() => setActiveTab('azure')}
          />
        )}

        {activeTab === 'tourism' && <TourismView />}

        {activeTab === 'runner' && (
          <LiveLoadRunner
            onRunCompleted={handleRunCompleted}
            onNavigateToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'azure' && (
          <AzureLoadTestingHub
            onImportSuccess={handleImportSuccess}
            onNavigateToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'presentation' && <PresentationDeck />}

        {activeTab === 'docs' && <DocsView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Web Capacity Analyzer</span>
            <span>•</span>
            <span>University Hackathon Solution</span>
            <span>•</span>
            <span>Powered by Azure Load Testing & App Service</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setActiveTab('dashboard')} className="hover:text-white">
              Dashboard
            </button>
            <button onClick={() => setActiveTab('tourism')} className="hover:text-white">
              Tourism App
            </button>
            <button onClick={() => setActiveTab('runner')} className="hover:text-white">
              Live Runner
            </button>
            <button onClick={() => setActiveTab('presentation')} className="hover:text-white">
              Presentation Deck
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
