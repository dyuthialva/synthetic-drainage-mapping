import React, { useState } from 'react';
import { DrainageSegment, DrainageNode, FloodAccumulationZone, ConfidenceLevel } from '../../data/types';
import { MapViewer, MapLayerVisibility } from '../map/MapViewer';
import { CheckCircle2, AlertTriangle, XCircle, Filter, Info, ShieldCheck, ArrowRight, Eye, Layers } from 'lucide-react';
import { TabType } from '../common/Header';

interface ValidationViewProps {
  knownSegments: DrainageSegment[];
  reconstructedSegments: DrainageSegment[];
  nodes: DrainageNode[];
  floodZones: FloodAccumulationZone[];
  selectedSegment: DrainageSegment | null;
  selectedNode: DrainageNode | null;
  onSelectSegment: (segment: DrainageSegment) => void;
  onSelectNode: (node: DrainageNode) => void;
  setActiveTab: (tab: TabType) => void;
}

export const ValidationView: React.FC<ValidationViewProps> = ({
  knownSegments,
  reconstructedSegments,
  nodes,
  floodZones,
  selectedSegment,
  selectedNode,
  onSelectSegment,
  onSelectNode,
  setActiveTab,
}) => {
  const [confidenceFilter, setConfidenceFilter] = useState<'ALL' | ConfidenceLevel>('ALL');

  // Count by confidence level
  const highCount = reconstructedSegments.filter((s) => s.confidence === 'HIGH').length;
  const medCount = reconstructedSegments.filter((s) => s.confidence === 'MEDIUM').length;
  const lowCount = reconstructedSegments.filter((s) => s.confidence === 'LOW').length;

  const filteredSegments = reconstructedSegments.filter((s) => {
    if (confidenceFilter === 'ALL') return true;
    return s.confidence === confidenceFilter;
  });

  // Default to SYN-DR-014 if none selected to match prompt's prime demo case!
  const activeSegment =
    selectedSegment && selectedSegment.type === 'reconstructed'
      ? selectedSegment
      : reconstructedSegments.find((s) => s.id === 'SYN-DR-014') || reconstructedSegments[0];

  const layers: MapLayerVisibility = {
    dem: true,
    roads: true,
    buildings: true,
    knownDrainage: true,
    reconstructedDrainage: true,
    floodZones: false,
    problemAreas: false,
    junctions: true,
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-105px)] overflow-hidden bg-slate-100">
      {/* Title & Proposition Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-700" />
              Validation &amp; Confidence Scoring
            </h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
              CONFIDENCE MATRIX
            </span>
          </div>
          <p className="text-xs text-slate-600">
            “Reconstructed drainage is not treated as ground truth. Each segment is assigned a confidence level based on available evidence.”
          </p>
        </div>

        {/* Confidence Category Filter Buttons */}
        <div className="flex items-center space-x-1.5 text-xs">
          <span className="text-[11px] font-mono text-slate-500 font-semibold mr-1">FILTER:</span>
          <button
            onClick={() => setConfidenceFilter('ALL')}
            className={`px-2.5 py-1 rounded text-xs font-semibold border transition-all ${
              confidenceFilter === 'ALL'
                ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            All (18)
          </button>
          <button
            onClick={() => setConfidenceFilter('HIGH')}
            className={`px-2.5 py-1 rounded text-xs font-semibold border transition-all ${
              confidenceFilter === 'HIGH'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                : 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50'
            }`}
          >
            High ({highCount})
          </button>
          <button
            onClick={() => setConfidenceFilter('MEDIUM')}
            className={`px-2.5 py-1 rounded text-xs font-semibold border transition-all ${
              confidenceFilter === 'MEDIUM'
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-white text-amber-800 border-amber-300 hover:bg-amber-50'
            }`}
          >
            Medium ({medCount})
          </button>
          <button
            onClick={() => setConfidenceFilter('LOW')}
            className={`px-2.5 py-1 rounded text-xs font-semibold border transition-all ${
              confidenceFilter === 'LOW'
                ? 'bg-rose-700 text-white border-rose-700 shadow-xs'
                : 'bg-white text-rose-800 border-rose-300 hover:bg-rose-50'
            }`}
          >
            Low ({lowCount})
          </button>
        </div>
      </div>

      {/* Main Grid: Left (Evidence & Inspector), Right (GIS Map Viewer) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* LEFT COLUMN: Segment Evidence Card & Segment List (Col span 5) */}
        <div className="lg:col-span-5 bg-white border-r border-slate-200 p-4 overflow-y-auto flex flex-col space-y-4 text-xs">
          {/* Segment Deep-Dive Evidence Card */}
          {activeSegment && (
            <div className="rounded border-2 border-slate-300 bg-slate-50 p-3.5 space-y-3 shadow-xs">
              <div className="flex items-start justify-between border-b border-slate-200 pb-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                    Candidate Segment Inspection
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Segment {activeSegment.id}
                  </h3>
                  <span className="text-xs text-slate-600">{activeSegment.name}</span>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                      activeSegment.confidence === 'HIGH'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-400'
                        : activeSegment.confidence === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-900 border border-amber-400'
                        : 'bg-rose-100 text-rose-800 border border-rose-400'
                    }`}
                  >
                    CONFIDENCE: {activeSegment.confidence}
                  </span>
                </div>
              </div>

              {/* Physical Attributes */}
              <div className="grid grid-cols-3 gap-2 font-mono text-center">
                <div className="p-2 bg-white rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">LENGTH</span>
                  <span className="font-bold text-slate-800">{activeSegment.lengthMeters} m</span>
                </div>
                <div className="p-2 bg-white rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">SLOPE</span>
                  <span className="font-bold text-slate-800">{activeSegment.slopePercent}%</span>
                </div>
                <div className="p-2 bg-white rounded border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">CATCHMENT</span>
                  <span className="font-bold text-slate-800">{activeSegment.catchmentAreaHa} ha</span>
                </div>
              </div>

              {/* Evidence Checklist */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-700 font-bold block">
                  Evidence Evaluation Factors:
                </span>
                <div className="space-y-1.5">
                  {activeSegment.evidence?.map((item) => (
                    <div
                      key={item.id}
                      className={`p-2 rounded border flex items-start space-x-2 ${
                        item.supported
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                          : 'bg-amber-50/70 border-amber-200 text-amber-900'
                      }`}
                    >
                      {item.supported ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-semibold text-xs">{item.label}</div>
                        {item.notes && (
                          <div className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                            {item.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Engineering Recommendation */}
              <div className="p-2.5 rounded bg-slate-800 text-white space-y-1">
                <div className="flex items-center space-x-1.5 text-sky-300 font-mono text-[11px] font-bold">
                  <Info className="w-3.5 h-3.5" />
                  <span>RECOMMENDATION:</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {activeSegment.recommendation}
                </p>
              </div>

              {/* Warning Notice */}
              <div className="p-2 rounded bg-amber-50 border border-amber-300 text-[10px] text-amber-800 leading-tight">
                <strong>ENGINEERING NOTICE:</strong> Do NOT designate candidate synthetic conduits as confirmed physical infrastructure in municipal planning records without on-site field validation.
              </div>
            </div>
          )}

          {/* Reconstructed Candidate Segments Table / List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-700 font-bold">
                Reconstructed Network Candidates ({filteredSegments.length})
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Select to Inspect</span>
            </div>

            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {filteredSegments.map((seg) => {
                const isSelected = activeSegment?.id === seg.id;
                return (
                  <button
                    key={seg.id}
                    onClick={() => onSelectSegment(seg)}
                    className={`w-full text-left p-2.5 rounded border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-sky-50 border-sky-600 shadow-xs ring-1 ring-sky-600'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                        <span>{seg.id}</span>
                        <span className="text-[10px] font-normal text-slate-500 truncate max-w-[200px]">
                          ({seg.name})
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        L: {seg.lengthMeters}m | S: {seg.slopePercent}% | Area: {seg.catchmentAreaHa}ha
                      </div>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                        seg.confidence === 'HIGH'
                          ? 'bg-emerald-100 text-emerald-800'
                          : seg.confidence === 'MEDIUM'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {seg.confidence}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setActiveTab('diagnosis')}
              className="w-full mt-2 py-2 rounded bg-sky-700 hover:bg-sky-800 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
            >
              <span>Next: Flood Diagnosis &rarr;</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive GIS Map Viewer (Col span 7) */}
        <div className="lg:col-span-7 relative flex flex-col h-full bg-slate-200 p-2">
          <div className="absolute top-4 left-4 z-20 bg-slate-900/90 text-white px-3 py-1.5 rounded border border-slate-700 text-xs font-mono shadow backdrop-blur-xs flex items-center space-x-2">
            <span className="text-slate-400">ACTIVE CONFIDENCE FILTER:</span>
            <span className="font-bold text-sky-300">{confidenceFilter} CONFIDENCE SEGMENTS</span>
          </div>

          <MapViewer
            layers={layers}
            knownSegments={knownSegments}
            reconstructedSegments={reconstructedSegments}
            nodes={nodes}
            floodZones={floodZones}
            selectedSegment={activeSegment}
            selectedNode={selectedNode}
            onSelectSegment={onSelectSegment}
            onSelectNode={onSelectNode}
            confidenceFilter={confidenceFilter}
          />
        </div>
      </div>
    </div>
  );
};
