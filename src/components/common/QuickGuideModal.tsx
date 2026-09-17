import React from 'react';
import { X, PlayCircle, ArrowRight, CheckCircle2, Compass, Layers, ShieldCheck, AlertOctagon, CloudRain, Cpu } from 'lucide-react';
import { TabType } from './Header';

interface QuickGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToStep: (tab: TabType) => void;
}

export const QuickGuideModal: React.FC<QuickGuideModalProps> = ({ isOpen, onClose, onJumpToStep }) => {
  if (!isOpen) return null;

  const demoSteps = [
    {
      step: 1,
      tab: 'dashboard' as TabType,
      title: 'Open Dashboard',
      narration: '“We start with incomplete drainage information.”',
      action: 'Explore Pune catchment boundary & surveyed baseline assets.',
      icon: Layers
    },
    {
      step: 2,
      tab: 'dashboard' as TabType,
      title: 'Inspect Available Data Layers',
      narration: '“These are the data sources we have: DEM elevation, street corridors, and incomplete municipal lines.”',
      action: 'Toggle DEM, Road, and Known Drainage layers in the left sidebar.',
      icon: Compass
    },
    {
      step: 3,
      tab: 'reconstruction' as TabType,
      title: 'Reconstruct Candidate Network',
      narration: '“The system reconstructs candidate drainage pathways from terrain slopes and urban constraints.”',
      action: 'Click [Generate Synthetic Network] and watch the 4-stage pipeline run.',
      icon: PlayCircle
    },
    {
      step: 4,
      tab: 'validation' as TabType,
      title: 'Validate & Assign Confidence',
      narration: '“We don’t treat this as ground truth. We assign confidence based on available evidence.”',
      action: 'Click candidate segment SYN-DR-014 to inspect the evidence checklist & recommendation.',
      icon: ShieldCheck
    },
    {
      step: 5,
      tab: 'diagnosis' as TabType,
      title: 'Diagnose Flood Bottlenecks',
      narration: '“We pinpoint potential hydraulic bottlenecks, low-slope silting conduits, and flow discontinuities.”',
      action: 'Select Potential Bottleneck (KN-DR-006 / Balgandharva depression).',
      icon: AlertOctagon
    },
    {
      step: 6,
      tab: 'simulation' as TabType,
      title: 'Run EPA SWMM-Style Simulation',
      narration: '“We simulate design storm pulses (e.g. 75mm cloudburst) through the candidate network.”',
      action: 'Select Demo Heavy Rainfall and click [Run Hydraulic Simulation].',
      icon: CloudRain
    },
    {
      step: 7,
      tab: 'planning' as TabType,
      title: 'Intervention Decision Support',
      narration: '“We compare Before vs After planning interventions to support municipal engineering decisions.”',
      action: 'Select J-08 Bypass or KN-DR-006 Upgrade and toggle Before vs After.',
      icon: Cpu
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-2xl w-full shadow-2xl text-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded bg-sky-950 border border-sky-600 text-sky-400">
              <PlayCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Presentation Playbook
              </span>
              <h3 className="text-base font-bold text-white">
                2-Minute Demonstration Flow
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Script Content */}
        <div className="p-4 overflow-y-auto space-y-3 text-xs flex-1">
          <div className="p-2.5 rounded bg-sky-950/60 border border-sky-700/60 text-sky-200">
            <p className="font-semibold text-xs text-white mb-0.5">
              Live Demo Goal:
            </p>
            <p className="text-[11px] leading-relaxed">
              Demonstrate how the system transitions from incomplete urban data to candidate pathway reconstruction, rigorous evidence validation, flood diagnosis, dynamic simulation, and intervention comparison.
            </p>
          </div>

          <div className="space-y-2">
            {demoSteps.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="p-2.5 rounded border border-slate-800 bg-slate-950/50 flex items-start justify-between gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start space-x-2.5">
                    <div className="w-5 h-5 rounded bg-slate-800 text-sky-400 font-mono font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      {s.step}
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <Icon className="w-3.5 h-3.5 text-sky-400" />
                        <span>{s.title}</span>
                      </div>
                      <div className="text-[11px] text-amber-300 font-medium italic">
                        {s.narration}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Action: {s.action}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onJumpToStep(s.tab);
                      onClose();
                    }}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-sky-700 text-slate-200 hover:text-white font-mono text-[10px] shrink-0 border border-slate-700 transition-colors"
                  >
                    Go &rarr;
                  </button>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded bg-slate-950 border border-slate-800 text-slate-300 space-y-1">
            <span className="font-bold text-sky-400 text-xs block">
              FINAL CLOSING STATEMENT:
            </span>
            <p className="text-xs italic text-white leading-relaxed">
              “We move from incomplete data to a reconstructed and validated network, then use simulation to support flood diagnosis and intervention planning.”
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold"
          >
            Start Presentation
          </button>
        </div>
      </div>
    </div>
  );
};
