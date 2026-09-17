import React, { useState } from 'react';
import { DrainageSegment, DrainageNode, FloodAccumulationZone, InterventionOption } from '../../data/types';
import { studyArea } from '../../data/studyArea';
import { MapViewer, MapLayerVisibility } from '../map/MapViewer';
import { Layers, Database, CheckSquare, Square, AlertTriangle, ShieldCheck, MapPin, RefreshCw, FileText, ArrowRight } from 'lucide-react';
import { TabType } from '../common/Header';

interface DashboardViewProps {
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

export const DashboardView: React.FC<DashboardViewProps> = ({
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
  // Layer visibility state
  const [layers, setLayers] = useState<MapLayerVisibility>({
    dem: true,
    roads: true,
    buildings: true,
    knownDrainage: true,
    reconstructedDrainage: true,
    floodZones: true,
    problemAreas: true,
    junctions: true,
  });

  const toggleLayer = (layerKey: keyof MapLayerVisibility) => {
    setLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const setAllLayers = (val: boolean) => {
    setLayers({
      dem: val,
      roads: val,
      buildings: val,
      knownDrainage: val,
      reconstructedDrainage: val,
      floodZones: val,
      problemAreas: val,
      junctions: val,
    });
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-105px)] overflow-hidden bg-slate-100">
      {/* Landing Sub-Header / Proposition */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Synthetic Drainage Mapping for Urban Flood Diagnosis
            </h2>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
              GIS Decision-Support
            </span>
          </div>
          <p className="text-xs text-slate-600 italic">
            “From incomplete drainage data to actionable planning intelligence.”
          </p>
        </div>

        {/* Quick Workflow Action Button */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('reconstruction')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Start Reconstruction Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 3-Column Layout: Left Sidebar (Data Layers), Center (Map), Right Sidebar (Network Status) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* LEFT SIDEBAR: Study Area & Data Layers (Col span 3) */}
        <div className="lg:col-span-3 bg-white border-r border-slate-200 p-3.5 overflow-y-auto flex flex-col space-y-4 text-xs">
          {/* Study Area Box */}
          <div className="rounded border border-slate-200 p-3 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                Study Area
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold">
                ACTIVE
              </span>
            </div>
            <div className="font-semibold text-slate-900 text-sm">
              {studyArea.name}
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              {studyArea.region}
            </p>

            <div className="pt-2 border-t border-slate-200/80 grid grid-cols-2 gap-1.5 font-mono text-[11px]">
              <div>
                <span className="text-slate-400 block text-[9px]">CATCHMENT AREA</span>
                <span className="font-semibold text-slate-800">{studyArea.areaSqKm} km²</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">AVG ELEVATION</span>
                <span className="font-semibold text-slate-800">{studyArea.averageElevationM} m</span>
              </div>
            </div>

            <button
              onClick={() => {}}
              className="w-full mt-2 py-1.5 px-2.5 rounded bg-slate-800 hover:bg-slate-900 text-white font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
              <span>Reload Catchment Extent</span>
            </button>
          </div>

          {/* Data Layers Checkbox Panel */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-700" />
                <span>Geospatial Data Layers</span>
              </span>
              <div className="flex items-center space-x-1 text-[10px] font-mono">
                <button
                  onClick={() => setAllLayers(true)}
                  className="text-sky-700 hover:underline"
                >
                  All
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={() => setAllLayers(false)}
                  className="text-slate-500 hover:underline"
                >
                  None
                </button>
              </div>
            </div>

            <div className="space-y-1 bg-slate-50 rounded border border-slate-200 p-2">
              {/* Layer 1: Elevation DEM */}
              <label
                onClick={() => toggleLayer('dem')}
                className="flex items-center justify-between p-1.5 rounded hover:bg-slate-100 cursor-pointer text-slate-700 select-none"
              >
                <div className="flex items-center space-x-2">
                  {layers.dem ? (
                    <CheckSquare className="w-4 h-4 text-sky-700" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                  <span>Elevation Contours / DEM</span>
                </div>
                <span className="w-2.5 h-0.5 bg-slate-400"></span>
              </label>

              {/* Layer 2: Roads */}
              <label
                onClick={() => toggleLayer('roads')}
                className="flex items-center justify-between p-1.5 rounded hover:bg-slate-100 cursor-pointer text-slate-700 select-none"
              >
                <div className="flex items-center space-x-2">
                  {layers.roads ? (
                    <CheckSquare className="w-4 h-4 text-sky-700" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                  <span>Road Corridors</span>
                </div>
                <span className="w-3 h-0.5 bg-slate-600"></span>
              </label>

              {/* Layer 3: Buildings */}
              <label
                onClick={() => toggleLayer('buildings')}
                className="flex items-center justify-between p-1.5 rounded hover:bg-slate-100 cursor-pointer text-slate-700 select-none"
              >
                <div className="flex items-center space-x-2">
                  {layers.buildings ? (
                    <CheckSquare className="w-4 h-4 text-sky-700" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                  <span>Building Footprints</span>
                </div>
                <span className="w-2.5 h-2.5 bg-slate-300 border border-slate-400"></span>
              </label>

              {/* Layer 4: Known Drainage */}
              <label
                onClick={() => toggleLayer('knownDrainage')}
                className="flex items-center justify-between p-1.5 rounded hover:bg-slate-100 cursor-pointer text-slate-900 font-medium select-none bg-blue-50/50"
              >
                <div className="flex items-center space-x-2">
                  {layers.knownDrainage ? (
                    <CheckSquare className="w-4 h-4 text-blue-900" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                  <span>Known Surveyed Drainage</span>
                </div>
                <span className="w-4 h-1 bg-[#1e3a8a] rounded-xs"></span>
              </label>

              {/* Layer 5: Reconstructed Drainage */}
              <label
                onClick={() => toggleLayer('reconstructedDrainage')}
                className="flex items-center justify-between p-1.5 rounded hover:bg-slate-100 cursor-pointer text-slate-900 font-medium select-none bg-sky-50/50"
              >
                <div className="flex items-center space-x-2">
                  {layers.reconstructedDrainage ? (
                    <CheckSquare className="w-4 h-4 text-sky-700" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                  <span>Reconstructed Candidate Network</span>
                </div>
                <span className="w-4 border-b-2 border-dashed border-[#0284c7]"></span>
              </label>

              {/* Layer 6: Flood Accumulation */}
              <label
                onClick={() => toggleLayer('floodZones')}
                className="flex items-center justify-between p-1.5 rounded hover:bg-slate-100 cursor-pointer text-slate-700 select-none"
              >
                <div className="flex items-center space-x-2">
                  {layers.floodZones ? (
                    <CheckSquare className="w-4 h-4 text-sky-700" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                  <span>Flood Accumulation Depressions</span>
                </div>
                <span className="w-3 h-2 bg-red-400/40 border border-red-500"></span>
              </label>

              {/* Layer 7: Problem Areas */}
              <label
                onClick={() => toggleLayer('problemAreas')}
                className="flex items-center justify-between p-1.5 rounded hover:bg-slate-100 cursor-pointer text-red-900 font-medium select-none bg-red-50/50"
              >
                <div className="flex items-center space-x-2">
                  {layers.problemAreas ? (
                    <CheckSquare className="w-4 h-4 text-red-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                  <span>Problem Bottlenecks / Discontinuities</span>
                </div>
                <span className="w-4 h-1 bg-red-600 rounded-xs"></span>
              </label>

              {/* Layer 8: Junctions & Outfalls */}
              <label
                onClick={() => toggleLayer('junctions')}
                className="flex items-center justify-between p-1.5 rounded hover:bg-slate-100 cursor-pointer text-slate-700 select-none"
              >
                <div className="flex items-center space-x-2">
                  {layers.junctions ? (
                    <CheckSquare className="w-4 h-4 text-sky-700" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                  <span>Junction Nodes &amp; Outfalls</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-slate-800"></span>
              </label>
            </div>
          </div>

          {/* Data Provenance Notice */}
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1 leading-normal">
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-slate-500" />
              Catchment Data Sources
            </span>
            <p>
              • SRTM 30m / DEM interpolation<br />
              • OpenStreetMap Open Road &amp; Building footprints<br />
              • Synthetic Candidate Drainage Reconstruction Engine
            </p>
          </div>
        </div>

        {/* CENTER: Main GIS Map (Col span 6) */}
        <div className="lg:col-span-6 relative flex flex-col h-full bg-slate-200 p-2">
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
          />
        </div>

        {/* RIGHT SIDEBAR: Network Status KPI & Metrics (Col span 3) */}
        <div className="lg:col-span-3 bg-white border-l border-slate-200 p-3.5 overflow-y-auto flex flex-col space-y-4 text-xs">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                Current Network Status
              </span>
              <span className="text-xs text-slate-600 font-medium">
                Asset Inventory Overview
              </span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
              DEMO VALUES
            </span>
          </div>

          {/* Metric Cards Grid */}
          <div className="space-y-2">
            {/* Known Drainage */}
            <div className="p-2.5 rounded border border-blue-200 bg-blue-50/50 flex items-center justify-between">
              <div>
                <span className="text-slate-600 text-[11px] font-medium block">
                  Known Drainage Segments
                </span>
                <span className="text-[10px] text-blue-800">
                  Surveyed municipal GIS baseline
                </span>
              </div>
              <span className="font-mono text-xl font-bold text-blue-900">
                {studyArea.knownSegmentsCount}
              </span>
            </div>

            {/* Reconstructed Segments */}
            <div className="p-2.5 rounded border border-sky-200 bg-sky-50/50 flex items-center justify-between">
              <div>
                <span className="text-slate-700 text-[11px] font-medium block">
                  Reconstructed Segments
                </span>
                <span className="text-[10px] text-sky-800">
                  Terrain + road candidate pathways
                </span>
              </div>
              <span className="font-mono text-xl font-bold text-sky-800">
                {studyArea.reconstructedSegmentsCount}
              </span>
            </div>

            {/* Validated Segments */}
            <div className="p-2.5 rounded border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
              <div>
                <span className="text-slate-700 text-[11px] font-medium block">
                  Validated Segments
                </span>
                <span className="text-[10px] text-emerald-800">
                  High / partial confidence agreement
                </span>
              </div>
              <span className="font-mono text-xl font-bold text-emerald-700">
                {studyArea.validatedCount}
              </span>
            </div>

            {/* Low Confidence Segments */}
            <div className="p-2.5 rounded border border-amber-200 bg-amber-50/50 flex items-center justify-between">
              <div>
                <span className="text-slate-700 text-[11px] font-medium block">
                  Low-Confidence Segments
                </span>
                <span className="text-[10px] text-amber-800">
                  Requires physical ground audit
                </span>
              </div>
              <span className="font-mono text-xl font-bold text-amber-700">
                {studyArea.lowConfidenceCount}
              </span>
            </div>

            {/* Potential Bottlenecks */}
            <div className="p-2.5 rounded border border-red-200 bg-red-50/50 flex items-center justify-between">
              <div>
                <span className="text-slate-700 text-[11px] font-medium block">
                  Potential Bottlenecks
                </span>
                <span className="text-[10px] text-red-800">
                  Simulated surcharge hot spots
                </span>
              </div>
              <span className="font-mono text-xl font-bold text-red-700">
                {studyArea.bottlenecksCount}
              </span>
            </div>
          </div>

          {/* Quick Step Guide to Demo Presentation */}
          <div className="p-3 rounded bg-slate-900 text-slate-200 border border-slate-800 space-y-2">
            <div className="flex items-center space-x-1.5 text-sky-400 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Demonstration Workflow</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              1. Inspect incomplete baseline data on map.<br />
              2. Proceed to <strong className="text-white font-semibold">Reconstruction</strong> to generate candidates.<br />
              3. Review <strong className="text-white font-semibold">Validation &amp; Confidence</strong> evidence.<br />
              4. Test <strong className="text-white font-semibold">Simulation &amp; Planning</strong>.
            </p>
            <button
              onClick={() => setActiveTab('reconstruction')}
              className="w-full py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-colors"
            >
              Next: Drainage Reconstruction &rarr;
            </button>
          </div>

          {/* Mandatory Demo Disclaimer */}
          <div className="p-2.5 rounded bg-slate-100 border border-slate-200 text-[10px] text-slate-500 leading-tight">
            <strong>IMPORTANT:</strong> Demonstration values and candidate networks are for prototype presentation only and are not real-world municipal engineering measurements.
          </div>
        </div>
      </div>
    </div>
  );
};
