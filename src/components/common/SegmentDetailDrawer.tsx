import React from 'react';
import { DrainageSegment, DrainageNode } from '../../data/types';
import { X, CheckCircle2, AlertTriangle, XCircle, Info, ShieldAlert, Compass, ArrowDownRight, Layers } from 'lucide-react';

interface SegmentDetailDrawerProps {
  selectedSegment: DrainageSegment | null;
  selectedNode: DrainageNode | null;
  onClose: () => void;
}

export const SegmentDetailDrawer: React.FC<SegmentDetailDrawerProps> = ({
  selectedSegment,
  selectedNode,
  onClose
}) => {
  if (!selectedSegment && !selectedNode) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col text-slate-100 overflow-hidden animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded bg-sky-950 border border-sky-600 text-sky-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              Asset Inspector
            </span>
            <h3 className="text-sm font-bold text-white">
              {selectedSegment ? selectedSegment.id : selectedNode?.id}
            </h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
        {/* If Segment */}
        {selectedSegment && (
          <>
            {/* Title & Classification */}
            <div>
              <h4 className="text-base font-semibold text-white mb-1">
                {selectedSegment.name}
              </h4>
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                    selectedSegment.type === 'known'
                      ? 'bg-blue-950 text-blue-300 border border-blue-700'
                      : selectedSegment.type === 'proposed_intervention'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      : 'bg-sky-950 text-sky-300 border border-sky-700'
                  }`}
                >
                  Type: {selectedSegment.type === 'known' ? 'Surveyed Municipal' : selectedSegment.type === 'proposed_intervention' ? 'Proposed Intervention' : 'Reconstructed Candidate'}
                </span>

                {selectedSegment.confidence && (
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${
                      selectedSegment.confidence === 'HIGH'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                        : selectedSegment.confidence === 'MEDIUM'
                        ? 'bg-amber-950 text-amber-300 border border-amber-600'
                        : 'bg-rose-950 text-rose-300 border border-rose-600'
                    }`}
                  >
                    Confidence: {selectedSegment.confidence}
                  </span>
                )}

                {selectedSegment.isProblemSegment && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-red-950 text-red-300 border border-red-600 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    Problem: {selectedSegment.problemType}
                  </span>
                )}
              </div>
            </div>

            {/* Technical Attributes Grid */}
            <div className="bg-slate-950/70 rounded border border-slate-800 p-3">
              <h5 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                Hydraulic &amp; Geometric Properties
              </h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-slate-900 rounded border border-slate-800/80">
                  <span className="text-slate-400 text-[11px] block">Segment Length</span>
                  <span className="font-mono text-sm font-semibold text-slate-100">
                    {selectedSegment.lengthMeters} m
                  </span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800/80">
                  <span className="text-slate-400 text-[11px] block">Terrain Slope</span>
                  <span className="font-mono text-sm font-semibold text-slate-100">
                    {selectedSegment.slopePercent}%
                  </span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800/80">
                  <span className="text-slate-400 text-[11px] block">Contributing Catchment</span>
                  <span className="font-mono text-sm font-semibold text-slate-100">
                    {selectedSegment.catchmentAreaHa} ha
                  </span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800/80">
                  <span className="text-slate-400 text-[11px] block">Nominal Diameter</span>
                  <span className="font-mono text-sm font-semibold text-slate-100">
                    {selectedSegment.diameterMm || 600} mm
                  </span>
                </div>
              </div>
            </div>

            {/* Evidence Checklist (Crucial for Validation requirement) */}
            {selectedSegment.evidence && selectedSegment.evidence.length > 0 && (
              <div className="bg-slate-950/70 rounded border border-slate-800 p-3 space-y-2">
                <h5 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center justify-between">
                  <span>Validation Evidence Checklist</span>
                  <span className="text-sky-400">
                    {selectedSegment.evidence.filter((e) => e.supported).length}/{selectedSegment.evidence.length} Supported
                  </span>
                </h5>
                <div className="space-y-1.5">
                  {selectedSegment.evidence.map((item) => (
                    <div
                      key={item.id}
                      className={`p-2 rounded border flex items-start space-x-2 ${
                        item.supported
                          ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200'
                          : 'bg-rose-950/30 border-rose-800/40 text-rose-300'
                      }`}
                    >
                      {item.supported ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-semibold text-xs">{item.label}</div>
                        {item.notes && (
                          <div className="text-[11px] text-slate-300 mt-0.5">{item.notes}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Problem Description if applicable */}
            {selectedSegment.isProblemSegment && (
              <div className="bg-rose-950/40 rounded border border-rose-700/60 p-3 space-y-1">
                <div className="flex items-center space-x-1.5 text-rose-300 font-semibold text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Hydraulic Diagnostic Finding</span>
                </div>
                <p className="text-xs text-rose-200 leading-relaxed">
                  {selectedSegment.problemDescription}
                </p>
              </div>
            )}

            {/* Recommendation */}
            <div className="bg-slate-950/70 rounded border border-slate-800 p-3 space-y-1.5">
              <div className="flex items-center space-x-1.5 text-slate-300 font-semibold text-xs">
                <Info className="w-4 h-4 text-sky-400" />
                <span>Actionable Recommendation</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedSegment.recommendation || 'Standard maintenance and periodic CCTV inspection.'}
              </p>
            </div>

            {/* Explicit Notice (Per instruction: Do NOT claim confirmed pipe) */}
            <div className="p-2.5 rounded bg-amber-950/40 border border-amber-600/50 text-[11px] text-amber-300/90 leading-relaxed">
              <span className="font-bold text-amber-200 block mb-0.5">
                NOTICE: DEMONSTRATION RECORD
              </span>
              Reconstructed pathways are mathematical candidates inferred from DEM terrain slopes and street corridors. They do not constitute surveyed physical conduits until validated in the field.
            </div>
          </>
        )}

        {/* If Node */}
        {selectedNode && (
          <>
            <div>
              <h4 className="text-base font-semibold text-white mb-1">
                {selectedNode.name}
              </h4>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  Type: {selectedNode.type.toUpperCase()}
                </span>
                {selectedNode.isSurchargedInHeavyRain && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-red-950 text-red-300 border border-red-700 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    Surcharge Prone
                  </span>
                )}
              </div>
            </div>

            <div className="bg-slate-950/70 rounded border border-slate-800 p-3">
              <h5 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                Elevation &amp; Depth
              </h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Ground Elevation</span>
                  <span className="font-mono text-sm font-semibold text-slate-100">
                    {selectedNode.elevationM} m MSL
                  </span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 text-[11px] block">Manhole Chamber Depth</span>
                  <span className="font-mono text-sm font-semibold text-slate-100">
                    {selectedNode.depthM} m
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/70 rounded border border-slate-800 p-3">
              <h5 className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                Description &amp; Connectivity
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedNode.description}
              </p>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700"
        >
          Close Inspector
        </button>
      </div>
    </div>
  );
};
