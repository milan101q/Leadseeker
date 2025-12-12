import React, { useState, useCallback } from 'react';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  Play, 
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { SearchParams, BusinessLead, AppStatus, LogEntry } from './types';
import { generateMockBusiness, sleep } from './services/simulator';
import ConsoleLog from './components/ConsoleLog';
import ResultsTable from './components/ResultsTable';

function App() {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [params, setParams] = useState<SearchParams>({
    location: '',
    quantity: 10,
    minReviews: 0,
    maxDistance: 5,
    ratingThreshold: 4.0,
    requireNoWebsite: true
  });
  
  const [leads, setLeads] = useState<BusinessLead[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [progress, setProgress] = useState(0);

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, {
      id: Math.random().toString(36),
      timestamp: new Date(),
      message,
      type
    }]);
  }, []);

  const handleStartScan = async () => {
    if (!params.location) {
      addLog("Error: Location is required.", 'error');
      return;
    }

    setStatus(AppStatus.SCANNING);
    setLeads([]);
    setLogs([]);
    setProgress(0);
    addLog(`Initializing search in ${params.location}...`, 'process');
    addLog(`Criteria: < ${params.ratingThreshold} Stars, ${params.requireNoWebsite ? 'NO Website' : 'Any Website'}.`, 'info');

    let leadsFound = 0;
    let checkedCount = 0;
    
    // Simulate the scanning process
    try {
      while (leadsFound < params.quantity) {
        checkedCount++;
        
        // Safety break
        if (checkedCount > params.quantity * 15) {
            addLog("Max search attempts reached. Stopping.", 'warning');
            break;
        }

        // Simulate network delay
        await sleep(Math.random() * 800 + 200); 

        // Generate a candidate
        const candidate = generateMockBusiness(checkedCount, params.location);
        addLog(`Scanning "${candidate.name}"...`, 'process');

        // Check 1: Website Logic
        if (params.requireNoWebsite && candidate.hasWebsite) {
          addLog(`  -> Skipped: Website detected.`, 'info');
          continue; 
        }

        // Check 2: Rating
        if (candidate.rating >= params.ratingThreshold) {
          addLog(`  -> Skipped: Rating ${candidate.rating} is too high.`, 'info');
          continue;
        }

        // Check 3: Reviews
        if (candidate.reviews < params.minReviews) {
          addLog(`  -> Skipped: Only ${candidate.reviews} reviews (Min: ${params.minReviews}).`, 'info');
          continue;
        }

        // Success
        setLeads(prev => [...prev, candidate]);
        leadsFound++;
        addLog(`  -> MATCH FOUND! ${candidate.name} (${candidate.rating} stars)`, 'success');
        
        const newProgress = Math.round((leadsFound / params.quantity) * 100);
        setProgress(newProgress);
      }
      
      addLog(`Scan complete. Found ${leadsFound} qualified leads.`, 'success');
    } catch (error) {
      addLog(`Scan failed: ${error}`, 'error');
    } finally {
      setStatus(AppStatus.COMPLETED);
    }
  };

  const isScanning = status === AppStatus.SCANNING;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Search size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Business Finder</h1>
              <span className="text-xs text-slate-500 font-medium">No-API Business Finder</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             {status === AppStatus.COMPLETED && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                   <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                   Scan Complete
                </span>
             )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full gap-8 grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Sidebar: Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal className="text-indigo-600" size={20} />
              <h2 className="font-semibold text-slate-800">Search Configuration</h2>
            </div>

            <div className="space-y-4">
              {/* Location Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Target Location <span className="text-red-500">*</span></label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input
                    type="text"
                    disabled={isScanning}
                    value={params.location}
                    onChange={(e) => setParams(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. Austin, TX"
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Lead Quantity</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  disabled={isScanning}
                  value={params.quantity}
                  onChange={(e) => setParams(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:bg-slate-50"
                />
              </div>

              <div className="border-t border-slate-100 my-4 pt-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Filters</p>
                
                {/* Checkbox for Website Requirement */}
                <div className="flex items-start gap-2 mb-4">
                  <input
                    id="requireNoWebsite"
                    type="checkbox"
                    disabled={isScanning}
                    checked={params.requireNoWebsite}
                    onChange={(e) => setParams(prev => ({ ...prev, requireNoWebsite: e.target.checked }))}
                    className="mt-1 w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="requireNoWebsite" className="text-sm text-slate-600">
                    <span className="font-medium text-slate-700 block">Require "No Website"</span>
                    <span className="text-xs text-slate-500">Only find businesses without a listed website</span>
                  </label>
                </div>

                {/* Filters Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Max Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      max="5"
                      disabled={isScanning}
                      value={params.ratingThreshold}
                      onChange={(e) => setParams(prev => ({ ...prev, ratingThreshold: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                   <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Min Reviews</label>
                    <input
                      type="number"
                      min="0"
                      disabled={isScanning}
                      value={params.minReviews}
                      onChange={(e) => setParams(prev => ({ ...prev, minReviews: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                
                 <div className="space-y-1.5 mt-4">
                    <label className="text-xs font-medium text-slate-600">Search Radius</label>
                    <select 
                      disabled={isScanning}
                      value={params.maxDistance}
                      onChange={(e) => setParams(prev => ({ ...prev, maxDistance: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 bg-white"
                    >
                      <option value={5}>5 Miles</option>
                      <option value={10}>10 Miles</option>
                      <option value={25}>25 Miles</option>
                      <option value={50}>50 Miles</option>
                    </select>
                  </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleStartScan}
                disabled={isScanning}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white transition-all shadow-md transform active:scale-95 ${
                  isScanning 
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
                }`}
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="animate-spin" size={20} />
                    Scanning Map...
                  </>
                ) : (
                  <>
                    <Play size={20} className="fill-current" />
                    Start Search
                  </>
                )}
              </button>

              <div className="bg-yellow-50 border border-yellow-100 rounded-md p-3 flex gap-2 items-start mt-4">
                <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={14} />
                <p className="text-xs text-yellow-800 leading-tight">
                  <strong>Simulation Mode:</strong> As per request (no API key), this tool simulates the scraping process logic using the specified parameters.
                </p>
              </div>
            </div>
          </div>

          {/* Progress Card */}
          {status !== AppStatus.IDLE && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="flex justify-between items-end mb-2">
                 <span className="text-sm font-medium text-slate-700">Progress</span>
                 <span className="text-2xl font-bold text-indigo-600">{progress}%</span>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                 <div 
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                    style={{ width: `${progress}%` }}
                  ></div>
               </div>
               <p className="text-xs text-slate-400 mt-2 text-center">
                 {status === AppStatus.COMPLETED ? 'Job Finished' : 'Identifying qualified businesses...'}
               </p>
            </div>
          )}
        </div>

        {/* Right Content: Logs & Results */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <ConsoleLog logs={logs} />
          <ResultsTable leads={leads} />
        </div>

      </main>
    </div>
  );
}

export default App;