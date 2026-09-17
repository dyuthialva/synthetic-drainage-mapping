import React from 'react';
import { TabType } from './Header';
import { Database, GitFork, CheckCircle2, AlertOctagon, CloudRain, Cpu, ArrowRight } from 'lucide-react';

interface WorkflowBarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  reconstructionGenerated: boolean;
  simulationRun: boolean;
}

export const WorkflowBar: React.FC<WorkflowBarProps> = ({
  activeTab,
  setActiveTab,
  reconstructionGenerated,
  simulationRun
}) => {
  const steps: {
    id: TabType;
    stepNumber: number;
    title: string;
    subtitle: string;
    icon: React.ComponentType<{ className?: string }>;
    isReady: boolean;
  }[] = [
    {
      id: 'dashboard',
      stepNumber: 1,
      title: 'Data & Catchment',
      subtitle: 'Incomplete legacy records + DEM',
      icon: Database,
      isReady: true
    },
    {
      id: 'reconstruction',
      stepNumber: 2,
      title: 'Reconstruct',
      subtitle: 'Candidate synthetic pathways',
      icon: GitFork,
      isReady: true
    },
    {
      id: 'validation',
      stepNumber: 3,
      title: 'Validate',
      subtitle: 'Evidence-based confidence',
      icon: CheckCircle2,
      isReady: reconstructionGenerated
    },
    {
      id: 'diagnosis',
      stepNumber: 4,
      title: 'Diagnose',
      subtitle: 'Bottlenecks & flood hot spots',
      icon: AlertOctagon,
      isReady: true
    },
    {
      id: 'simulation',
      stepNumber: 5,
      title: 'Simulate',
      subtitle: 'Rainfall & hydraulic routing',
      icon: CloudRain,
      isReady: true
    },
    {
      id: 'planning',
      stepNumber: 6,
      title: 'Plan',
      subtitle: 'Intervention comparison',
      icon: Cpu,
      isReady: true
    }
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-2 py-0.5">
        <div className="flex items-center space-x-1 sm:space-x-2 text-slate-400 font-mono text-[11px] uppercase tracking-wider shrink-0 mr-1">
          <span className="font-bold text-slate-300">Decision Pipeline:</span>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-1.5 min-w-max">
          {steps.map((step, idx) => {
            const isActive = activeTab === step.id;
            const Icon = step.icon;

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => setActiveTab(step.id)}
                  className={`flex items-center space-x-2 px-2.5 py-1.5 rounded transition-all border text-left ${
                    isActive
                      ? 'bg-sky-950 border-sky-500 text-sky-200 ring-1 ring-sky-500/50'
                      : 'bg-slate-800/80 border-slate-700/70 text-slate-300 hover:bg-slate-800 hover:border-slate-600 hover:text-white'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {step.stepNumber}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-1">
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                      <span className={`font-semibold ${isActive ? 'text-white' : 'text-slate-200'}`}>
                        {step.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 hidden xl:inline">
                      {step.subtitle}
                    </span>
                  </div>
                </button>

                {idx < steps.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0 mx-0.5" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
