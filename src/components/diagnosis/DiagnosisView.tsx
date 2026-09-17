import React, { useState } from 'react';
import { DrainageSegment, DrainageNode, FloodAccumulationZone, DiagnosticIssue } from '../../data/types';
import { diagnosticIssues } from '../../data/floodZones';
import { MapViewer, MapLayerVisibility } from '../map/MapViewer';
import { AlertOctagon, AlertTriangle, ShieldAlert, CheckCircle2, ArrowRight, Eye, MapPin, Activity, HelpCircle } from 'lucide-react';
import { TabType } from '../common/Header';

interface DiagnosisViewProps {
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

export const DiagnosisView: React.FC<DiagnosisViewProps> = ({
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
  const [activeIssue, setActiveIssue] = useState<DiagnosticIssue>(diagnosticIssues[0]);

  const handleSelectIssue = (issue: DiagnosticIssue) => {
    setActiveIssue(issue);
    // Find matching segment if any
    const seg =
      knownSegments.find((s) => s.id === issue.segmentOrNodeId) ||
      reconstructedSegments.find((s) => s.id === issue.segmentOrNodeId);
    if (seg) {
      onSelectSegment(seg);
    } else {
      const node = nodes.find((n) => n.id === issue.segmentOrNodeId);
      if (node) onSelectNode(node);
    }
  };

  const layers: MapLayerVisibility = {
    dem: true,
    roads: true,
    buildings: false,
    knownDrainage: true,
    reconstructedDrainage: true,
    floodZones: true,
    problemAreas: true,
    junctions: true,
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-105px)] overflow-hidden bg-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-red-600" />
              Urban Flood Diagnosis &amp; Defect Identification
            </h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-300">
              CANDIDATE ISSUES (DEMO)
            </span>
          </div>
          <p className="text-xs text-slate-600">
            “Spatial synthesis of flow accumulation, slope anomalies, and network bottlenecks for flood risk pinpointing.”
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-500 font-mono">IDENTIFIED DEFECTS:</span>
          <span className="font-mono font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
            {diagnosticIssues.length} Potential Issues
          </span>
        </div>
      </div>

      {/* Main Grid: Left Column (Issues List & Diagnostic Deep-Dive), Right Column (Map) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* LEFT COLUMN: Issues & Detailed Findings (Col span 5) */}
        <div className="lg:col-span-5 bg-white border-r border-slate-200 p-4 overflow-y-auto flex flex-col space-y-4 text-xs">
          {/* Active Issue Card */}
          {activeIssue && (
            <div className="rounded border-2 border-red-300 bg-red-50/40 p-3.5 space-y-3 shadow-xs">
              <div className="flex items-start justify-between border-b border-red-200 pb-2">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-red-700 font-bold block">
                    Diagnostic Finding
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    {activeIssue.title}
                  </h3>
                  <span className="text-xs font-mono font-semibold text-slate-700">
                    Target Asset: {activeIssue.segmentOrNodeId}
                  </span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    activeIssue.severity === 'critical'
                      ? 'bg-red-600 text-white'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  {activeIssue.severity} Risk
                </span>
              </div>

              {/* Reason */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600 font-bold block">
                  Root Cause / Diagnostic Reason:
                </span>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {activeIssue.reason}
                </p>
              </div>

              {/* Technical Details */}
              <div className="p-2.5 bg-white rounded border border-slate-200 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                  Hydraulic Simulation Observation:
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-mono">
                  {activeIssue.technicalDetails}
                </p>
              </div>

              {/* Suggested Engineering Action */}
              <div className="p-2.5 bg-slate-900 text-white rounded space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-bold block">
                  Suggested Remedial Action:
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {activeIssue.suggestedAction}
                </p>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-slate-600">
                <span>Validation Status:</span>
                <span className="font-semibold text-amber-800">{activeIssue.status}</span>
              </div>
            </div>
          )}

          {/* Clickable Issue Cards List */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-700 font-bold block">
              Candidate Diagnostic Issues ({diagnosticIssues.length})
            </span>

            <div className="space-y-2">
              {diagnosticIssues.map((issue) => {
                const isSelected = activeIssue.id === issue.id;
                return (
                  <button
                    key={issue.id}
                    onClick={() => handleSelectIssue(issue)}
                    className={`w-full text-left p-3 rounded border transition-all ${
                      isSelected
                        ? 'bg-red-50 border-red-500 ring-1 ring-red-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-900 text-xs flex items-center gap-1.5">
                        <AlertTriangle className={`w-3.5 h-3.5 ${issue.severity === 'critical' ? 'text-red-600' : 'text-amber-600'}`} />
                        {issue.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                        {issue.segmentOrNodeId}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {issue.reason}
                    </p>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setActiveTab('simulation')}
              className="w-full mt-3 py-2 rounded bg-sky-700 hover:bg-sky-800 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
            >
              <span>Next: Rainfall &amp; Hydraulic Simulation &rarr;</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive GIS Map Viewer (Col span 7) */}
        <div className="lg:col-span-7 relative flex flex-col h-full bg-slate-200 p-2">
          <div className="absolute top-4 left-4 z-20 bg-slate-900/90 text-white px-3 py-1.5 rounded border border-slate-700 text-xs font-mono shadow backdrop-blur-xs flex items-center space-x-2">
            <span className="text-slate-400">ACTIVE DIAGNOSTIC TARGET:</span>
            <span className="font-bold text-red-400">{activeIssue.title} ({activeIssue.segmentOrNodeId})</span>
          </div>

          <MapViewer
            layers={layers}
            knownSegments={knownSegments}
            reconstructedSegments={reconstructedSegments}
            nodes={nodes}
            floodZones={floodZones}
            selectedSegment={selectedSegment}
            selectedNode={selectedNode}
            onSelectSegment={onSelectSegment}
            onSelectNode={onSelectNode}
            highlightedCoordinates={activeIssue.coordinates}
          />
        </div>
      </div>
    </div>
  );
};
