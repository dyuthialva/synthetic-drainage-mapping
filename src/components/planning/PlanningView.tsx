import React, { useState } from 'react';
import { DrainageSegment, DrainageNode, FloodAccumulationZone, InterventionOption } from '../../data/types';
import { candidateInterventions } from '../../data/interventions';
import { studyArea } from '../../data/studyArea';
import { MapViewer, MapLayerVisibility } from '../map/MapViewer';
import { Cpu, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, Download, FileSpreadsheet, Layers, Sparkles, Building2, TrendingDown } from 'lucide-react';
import { TabType } from '../common/Header';

interface PlanningViewProps {
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

export const PlanningView: React.FC<PlanningViewProps> = ({
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
  const [selectedIntervention, setSelectedIntervention] = useState<InterventionOption>(candidateInterventions[0]);
  const [comparisonMode, setComparisonMode] = useState<'after' | 'before'>('after');
  const [showExportModal, setShowExportModal] = useState(false);

  const layers: MapLayerVisibility = {
    dem: true,
    roads: true,
    buildings: true,
    knownDrainage: true,
    reconstructedDrainage: true,
    floodZones: comparisonMode === 'before', // Before shows full flood zones, After simulates reduced
    problemAreas: true,
    junctions: true,
  };

  // Filter flood zones for after comparison (simulate 50% flood footprint reduction in After mode)
  const displayFloodZones = comparisonMode === 'after'
    ? floodZones.filter((_, idx) => idx % 2 === 0).map(z => ({ ...z, accumulatedAreaHa: parseFloat((z.accumulatedAreaHa * 0.45).toFixed(1)), peakDepthMeters: parseFloat((z.peakDepthMeters * 0.5).toFixed(2)) }))
    : floodZones;

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-105px)] overflow-hidden bg-slate-100">
      {/* Title & Proposition Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-700" />
              Intervention Comparison &amp; Decision Support
            </h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
              PLANNING ENGINE
            </span>
          </div>
          <p className="text-xs text-slate-600">
            “Evaluating candidate stormwater capital improvements against baseline flood risk scenarios.”
          </p>
        </div>

        {/* Before / After Comparison Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono text-slate-500 font-semibold">VIEW SIMULATED IMPACT:</span>
          <div className="inline-flex rounded-md shadow-xs">
            <button
              onClick={() => setComparisonMode('before')}
              className={`px-3 py-1 text-xs font-semibold rounded-l-md border transition-colors ${
                comparisonMode === 'before'
                  ? 'bg-rose-700 text-white border-rose-700'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              BASELINE (Current Bottlenecks)
            </button>
            <button
              onClick={() => setComparisonMode('after')}
              className={`px-3 py-1 text-xs font-semibold rounded-r-md border-t border-b border-r transition-colors ${
                comparisonMode === 'after'
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              WITH PROPOSED INTERVENTION
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (Intervention Options & Summary Dashboard), Right (Map) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* LEFT COLUMN: Interventions & Executive Planning Summary (Col span 5) */}
        <div className="lg:col-span-5 bg-white border-r border-slate-200 p-4 overflow-y-auto flex flex-col space-y-4 text-xs">
          {/* Intervention Selection Cards */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-700 font-bold block">
              Select Proposed Engineering Intervention:
            </span>

            <div className="space-y-2">
              {candidateInterventions.map((intv) => {
                const isSelected = selectedIntervention.id === intv.id;
                return (
                  <button
                    key={intv.id}
                    onClick={() => setSelectedIntervention(intv)}
                    className={`w-full text-left p-3 rounded border transition-all ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-600 ring-1 ring-emerald-600 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900 text-xs">
                        {intv.title}
                      </span>
                      <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded border border-emerald-300 font-semibold">
                        {intv.interventionType.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {intv.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Intervention Before vs After Comparison Card */}
          <div className="rounded border-2 border-emerald-200 bg-emerald-50/40 p-3.5 space-y-3 shadow-xs">
            <div className="flex items-start justify-between border-b border-emerald-200 pb-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-bold block">
                  Simulated Outcome Comparison
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  {selectedIntervention.shortCode}
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white text-emerald-900 border border-emerald-300">
                +{(selectedIntervention.afterMetrics.drainageContinuityScore - selectedIntervention.beforeMetrics.drainageContinuityScore)}% Continuity
              </span>
            </div>

            {/* Before vs After Metric Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Surcharged Nodes */}
              <div className="p-2.5 bg-white rounded border border-slate-200 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 block">SURCHARGED NODES</span>
                <div className="flex items-center justify-between">
                  <span className="text-rose-600 font-mono font-bold line-through">
                    {selectedIntervention.beforeMetrics.surchargedNodes} nodes
                  </span>
                  <span className="text-emerald-700 font-mono font-bold text-sm">
                    &rarr; {selectedIntervention.afterMetrics.surchargedNodes} nodes
                  </span>
                </div>
              </div>

              {/* Flooded Area */}
              <div className="p-2.5 bg-white rounded border border-slate-200 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 block">FLOODED CATCHMENT</span>
                <div className="flex items-center justify-between">
                  <span className="text-rose-600 font-mono font-bold line-through">
                    {selectedIntervention.beforeMetrics.floodedAreaHa} ha
                  </span>
                  <span className="text-emerald-700 font-mono font-bold text-sm">
                    &rarr; {selectedIntervention.afterMetrics.floodedAreaHa} ha
                  </span>
                </div>
              </div>

              {/* Peak Discharge */}
              <div className="p-2.5 bg-white rounded border border-slate-200 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 block">PEAK DISCHARGE</span>
                <div className="flex items-center justify-between">
                  <span className="text-rose-600 font-mono font-bold line-through">
                    {selectedIntervention.beforeMetrics.peakDischargeM3s} m³/s
                  </span>
                  <span className="text-emerald-700 font-mono font-bold text-sm">
                    &rarr; {selectedIntervention.afterMetrics.peakDischargeM3s} m³/s
                  </span>
                </div>
              </div>

              {/* Continuity Index */}
              <div className="p-2.5 bg-white rounded border border-slate-200 space-y-1">
                <span className="text-[10px] font-mono text-slate-500 block">NETWORK CONTINUITY</span>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-mono font-bold">
                    {selectedIntervention.beforeMetrics.drainageContinuityScore}%
                  </span>
                  <span className="text-emerald-700 font-mono font-bold text-sm">
                    &rarr; {selectedIntervention.afterMetrics.drainageContinuityScore}%
                  </span>
                </div>
              </div>
            </div>

            {/* Engineering Notes */}
            <div className="p-2.5 bg-white rounded border border-slate-200 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                Engineering Assessment:
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {selectedIntervention.engineeringNotes}
              </p>
            </div>

            {/* Field Status */}
            <div className="text-[11px] text-slate-600 font-mono flex items-center justify-between">
              <span>Ground Verification:</span>
              <span className="font-semibold text-slate-800">{selectedIntervention.fieldVerificationStatus}</span>
            </div>
          </div>

          {/* Planning Summary Dashboard (Section 9 of user request) */}
          <div className="rounded border border-slate-200 bg-slate-900 text-white p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 font-bold flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Executive Decision Summary</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">Pune Urban Sector</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 bg-slate-800/80 rounded border border-slate-700">
                <span className="text-slate-400 text-[10px] block">CATCHMENT NETWORK</span>
                <span className="font-bold text-slate-100">42 known / 18 reconstructed</span>
              </div>
              <div className="p-2 bg-slate-800/80 rounded border border-slate-700">
                <span className="text-slate-400 text-[10px] block">VALIDATION CONFIDENCE</span>
                <span className="font-bold text-emerald-400">31 validated / 7 low-conf</span>
              </div>
              <div className="p-2 bg-slate-800/80 rounded border border-slate-700">
                <span className="text-slate-400 text-[10px] block">DIAGNOSTIC BOTTLENECKS</span>
                <span className="font-bold text-amber-400">4 candidate problem areas</span>
              </div>
              <div className="p-2 bg-slate-800/80 rounded border border-slate-700">
                <span className="text-slate-400 text-[10px] block">EVALUATED SCENARIOS</span>
                <span className="font-bold text-sky-400">3 storm scenarios tested</span>
              </div>
            </div>

            {/* Recommended Next Step - per instruction item #9 */}
            <div className="p-2.5 rounded bg-sky-950 border border-sky-700 text-sky-200 space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-sky-300 block">
                ★ RECOMMENDED NEXT STEP:
              </span>
              <p className="text-xs font-semibold text-white leading-relaxed">
                “Field verification of low-confidence drainage segments and hydraulic calibration using observed sensor data.”
              </p>
            </div>

            <button
              onClick={() => alert('Summary report exported as GeoJSON / PDF bundle (Simulation Prototype).')}
              className="w-full py-2 rounded bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Geospatial Planning Report</span>
            </button>
          </div>

          {/* Mandatory Engineering Warning Banner */}
          <div className="p-2.5 rounded bg-amber-50 border border-amber-300 text-[10px] text-amber-900 leading-relaxed">
            <strong>PLANNING DISCLAIMER:</strong> Demonstration scenario. Engineering decisions require validated physical infrastructure surveys and calibrated hydraulic models prior to municipal capital expenditure.
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive GIS Map Viewer (Col span 7) */}
        <div className="lg:col-span-7 relative flex flex-col h-full bg-slate-200 p-2">
          <div className="absolute top-4 left-4 z-20 bg-slate-900/90 text-white px-3 py-1.5 rounded border border-slate-700 text-xs font-mono shadow backdrop-blur-xs flex items-center space-x-2">
            <span className="text-slate-400">SIMULATED SCENARIO:</span>
            <span className="font-bold text-emerald-400">
              {comparisonMode === 'after'
                ? `WITH ${selectedIntervention.shortCode}`
                : 'BASELINE NETWORK (No Interventions)'}
            </span>
          </div>

          <MapViewer
            layers={layers}
            knownSegments={knownSegments}
            reconstructedSegments={reconstructedSegments}
            nodes={nodes}
            floodZones={displayFloodZones}
            activeIntervention={comparisonMode === 'after' ? selectedIntervention : null}
            selectedSegment={selectedSegment}
            selectedNode={selectedNode}
            onSelectSegment={onSelectSegment}
            onSelectNode={onSelectNode}
          />
        </div>
      </div>
    </div>
  );
};
