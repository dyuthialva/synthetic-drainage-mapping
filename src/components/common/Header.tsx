import React from 'react';
import { Layers, Activity, AlertTriangle, HelpCircle, MapPin, Compass } from 'lucide-react';

export type TabType = 'dashboard' | 'reconstruction' | 'validation' | 'diagnosis' | 'simulation' | 'planning';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenQuickGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenQuickGuide }) => {
  const navItems: { id: TabType; label: string; number: string }[] = [
    { id: 'dashboard', label: 'Dashboard', number: '01' },
    { id: 'reconstruction', label: 'Reconstruction', number: '02' },
    { id: 'validation', label: 'Validation', number: '03' },
    { id: 'diagnosis', label: 'Diagnosis', number: '04' },
    { id: 'simulation', label: 'Simulation', number: '05' },
    { id: 'planning', label: 'Planning', number: '06' },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm">
      {/* Top Meta Bar */}
      <div className="px-4 py-1.5 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 font-mono text-[11px] text-sky-400 font-medium">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>GIS DECISION SUPPORT SYSTEM</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-200 font-medium">Area: Pune Urban Catchment</span>
            <span className="text-slate-400 hidden sm:inline">(Mutha River Basin Sector)</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-950/70 border border-amber-600/40 text-amber-300 text-[11px] font-mono font-medium">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>STATUS: DEMO / PROTOTYPE</span>
          </div>
          <button
            onClick={onOpenQuickGuide}
            className="flex items-center space-x-1 text-slate-400 hover:text-sky-300 transition-colors px-2 py-0.5 rounded hover:bg-slate-800 text-[11px]"
            title="Open 2-Minute Demo Presentation Guide"
          >
            <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">2-Min Presentation Flow</span>
          </button>
        </div>
      </div>

      {/* Main Header & Navigation */}
      <div className="px-4 py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Title & Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded bg-sky-900/80 border border-sky-600 flex items-center justify-center text-sky-300 font-bold shadow-inner">
            <Layers className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                Synthetic Drainage Mapping
              </h1>
              <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                v1.0-PROTO
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Urban Flood Diagnosis &amp; Smart City Planning
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center overflow-x-auto pb-1 md:pb-0 space-x-1 sm:space-x-1.5 text-xs font-medium">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded transition-all whitespace-nowrap border ${
                  isActive
                    ? 'bg-sky-600 text-white border-sky-500 font-semibold shadow-sm'
                    : 'bg-slate-800/70 text-slate-300 border-slate-700/60 hover:bg-slate-800 hover:text-white hover:border-slate-600'
                }`}
              >
                <span className={`text-[10px] font-mono ${isActive ? 'text-sky-200' : 'text-slate-400'}`}>
                  {item.number}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
