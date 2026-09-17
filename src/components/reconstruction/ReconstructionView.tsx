import React, { useState } from 'react';
import { DrainageSegment, DrainageNode, FloodAccumulationZone } from '../../data/types';
import { MapViewer, MapLayerVisibility } from '../map/MapViewer';
import { GitFork, Sliders, Play, RefreshCw, CheckCircle2, ArrowRight, Layers, ArrowDown, Database, Cpu, Compass, Info, AlertTriangle } from 'lucide-react';
import { TabType } from '../common/Header';

interface ReconstructionViewProps {
  knownSegments: DrainageSegment[];
  reconstructedSegments: DrainageSegment[];
  nodes: DrainageNode[];
  floodZones: FloodAccumulationZone[];
  selectedSegment: DrainageSegment | null;
  selectedNode: DrainageNode | null;
  onSelectSegment: (segment: DrainageSegment) => void;
  onSelectNode: (node: DrainageNode) => void;
  reconstructionGenerated: boolean;
  setReconstructionGenerated: (val: boolean) => void;
  setActiveTab: (tab: TabType) => void;
}

export const ReconstructionView: React.FC<ReconstructionViewProps> = ({
  knownSegments,
  reconstructedSegments,
  nodes,
  floodZones,
  selectedSegment,
  selectedNode,
  onSelectSegment,
  onSelectNode,
  reconstructionGenerated,
  setReconstructionGenerated,
  setActiveTab,
}) => {
  // Parameters
  const [flowAccumulationThreshold, setFlowAccumulationThreshold] = useState(2.5); // hectares
  const [minSegmentLength, setMinSegmentLength] = useState(150); // meters
  const [urbanConstraintWeight, setUrbanConstraintWeight] = useState(70); // %

  // View state: 'after' shows reconstructed, 'before' shows only known
  const [viewMode, setViewMode] = useState<'before' | 'after'>('after');

  // Generation simulation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  const generationSteps = [
    'Ingesting DEM & computing D8 flow directions...',
    'Thresholding flow accumulation channels (> 2.5 ha)...',
    'Snapping flowlines to urban road corridors & culvert rights-of-way...',
    'Synthesizing candidate graph & assigning preliminary confidence...'
  ];

  const handleRunReconstruction = () => {
    setIsGenerating(true);
    setGenerationStep(0);

    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => {
        if (prev < 3) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setIsGenerating(false);
          setReconstructionGenerated(true);
          setViewMode('after');
          return 3;
        }
      });
    }, 650);
  };

  const layers: MapLayerVisibility = {
    dem: true,
    roads: true,
    buildings: false,
    knownDrainage: true,
    reconstructedDrainage: viewMode === 'after' && (reconstructionGenerated || !isGenerating),
    floodZones: false,
    problemAreas: false,
    junctions: true,
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-105px)] overflow-hidden bg-slate-100">
      {/* Title & Algorithm Explainer Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <GitFork className="w-4 h-4 text-sky-700" />
              Drainage Network Reconstruction
            </h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-300">
              RECONSTRUCTION ENGINE — DEMO
            </span>
          </div>
          <p className="text-xs text-slate-600">
            “Candidate drainage pathways are generated from terrain-driven flow patterns and urban constraints.”
          </p>
        </div>

        {/* Before / After Toggle Buttons */}
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono text-slate-500 font-semibold">VIEWPORT:</span>
          <div className="inline-flex rounded-md shadow-xs" role="group">
            <button
              onClick={() => setViewMode('before')}
              className={`px-3 py-1 text-xs font-semibold rounded-l-md border transition-colors ${
                viewMode === 'before'
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              BEFORE (Incomplete Known)
            </button>
            <button
              onClick={() => setViewMode('after')}
              className={`px-3 py-1 text-xs font-semibold rounded-r-md border-t border-b border-r transition-colors ${
                viewMode === 'after'
                  ? 'bg-sky-700 text-white border-sky-700'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              AFTER (Candidate Reconstructed)
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* LEFT COLUMN: 3-Step Process Flow & Reconstruction Controls (Col span 4) */}
        <div className="lg:col-span-4 bg-white border-r border-slate-200 p-4 overflow-y-auto flex flex-col space-y-4 text-xs">
          {/* 3-Step Algorithm Pipeline Diagram */}
          <div className="rounded border border-slate-200 bg-slate-50 p-3 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
              Reconstruction Methodology
            </span>

            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="p-2 rounded bg-white border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-800">1. Digital Elevation Model (DEM)</span>
                <span className="text-[10px] text-slate-400">Terrain Slope</span>
              </div>
              <div className="flex justify-center text-slate-400">
                <ArrowDown className="w-3.5 h-3.5" />
              </div>

              <div className="p-2 rounded bg-white border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-800">2. Flow Direction + Accumulation</span>
                <span className="text-[10px] text-slate-400">Hydrologic Paths</span>
              </div>
              <div className="flex justify-center text-slate-400">
                <ArrowDown className="w-3.5 h-3.5" />
              </div>

              <div className="p-2 rounded bg-white border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-800">3. Urban Constraints &amp; Road Rights-of-Way</span>
                <span className="text-[10px] text-slate-400">Street Network</span>
              </div>
              <div className="flex justify-center text-slate-400">
                <ArrowDown className="w-3.5 h-3.5" />
              </div>

              <div className="p-2 rounded bg-sky-50 border border-sky-300 text-sky-900 flex items-center justify-between font-bold">
                <span>4. Candidate Drainage Network</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-sky-200 rounded">18 Segments</span>
              </div>
            </div>
          </div>

          {/* Algorithmic Parameter Controls */}
          <div className="rounded border border-slate-200 bg-slate-50 p-3.5 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-700 font-bold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-sky-700" />
                <span>Reconstruction Parameters</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Tuning Controls</span>
            </div>

            {/* Slider 1: Flow Accumulation Threshold */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-700 font-medium">Flow Accumulation Threshold:</span>
                <span className="font-mono font-bold text-sky-800">{flowAccumulationThreshold} ha</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="8.0"
                step="0.5"
                value={flowAccumulationThreshold}
                onChange={(e) => setFlowAccumulationThreshold(parseFloat(e.target.value))}
                disabled={isGenerating}
                className="w-full accent-sky-700 cursor-pointer h-1.5 bg-slate-200 rounded"
              />
              <span className="text-[10px] text-slate-500 block">
                Minimum contributing upslope area required to trigger candidate channel stream initiation.
              </span>
            </div>

            {/* Slider 2: Minimum Segment Length */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-700 font-medium">Minimum Segment Length:</span>
                <span className="font-mono font-bold text-sky-800">{minSegmentLength} m</span>
              </div>
              <input
                type="range"
                min="50"
                max="400"
                step="25"
                value={minSegmentLength}
                onChange={(e) => setMinSegmentLength(parseInt(e.target.value))}
                disabled={isGenerating}
                className="w-full accent-sky-700 cursor-pointer h-1.5 bg-slate-200 rounded"
              />
              <span className="text-[10px] text-slate-500 block">
                Prunes micro-tributary noise shorter than threshold.
              </span>
            </div>

            {/* Slider 3: Urban Constraint Weight */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-700 font-medium">Urban Constraint Snapping Weight:</span>
                <span className="font-mono font-bold text-sky-800">{urbanConstraintWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="5"
                value={urbanConstraintWeight}
                onChange={(e) => setUrbanConstraintWeight(parseInt(e.target.value))}
                disabled={isGenerating}
                className="w-full accent-sky-700 cursor-pointer h-1.5 bg-slate-200 rounded"
              />
              <span className="text-[10px] text-slate-500 block">
                Biases overland flowpaths toward surveyed public street right-of-way corridors.
              </span>
            </div>

            {/* Action Button */}
            <button
              onClick={handleRunReconstruction}
              disabled={isGenerating}
              className={`w-full py-2.5 px-3 rounded font-semibold text-xs flex items-center justify-center space-x-2 shadow-xs transition-all ${
                isGenerating
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-sky-700 hover:bg-sky-800 text-white'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-sky-700" />
                  <span>Synthesizing Candidate Network...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Generate Synthetic Network</span>
                </>
              )}
            </button>

            {/* Progress status card if generating */}
            {isGenerating && (
              <div className="p-2.5 rounded bg-sky-950 text-white space-y-1.5 animate-pulse">
                <div className="flex items-center justify-between text-[11px] font-mono text-sky-300">
                  <span>STEP {generationStep + 1} OF 4</span>
                  <span>{((generationStep + 1) * 25)}%</span>
                </div>
                <p className="text-xs text-slate-200">
                  {generationSteps[generationStep]}
                </p>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div
                    className="bg-sky-400 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${(generationStep + 1) * 25}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Summary Comparison Metrics */}
          <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
              Network Density Comparison
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-slate-500 text-[10px] block">Surveyed Incomplete</span>
                <span className="font-mono text-sm font-bold text-blue-900">42 Segments</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">8.9 km total length</span>
              </div>
              <div className="p-2 bg-sky-50 rounded border border-sky-200">
                <span className="text-sky-800 text-[10px] block">With Reconstructed</span>
                <span className="font-mono text-sm font-bold text-sky-900">60 Segments (+18)</span>
                <span className="text-[10px] text-sky-700 block mt-0.5">14.6 km total length</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('validation')}
              className="w-full mt-2 py-1.5 rounded bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs flex items-center justify-center space-x-1 transition-colors"
            >
              <span>Proceed to Step 3: Validation &amp; Confidence</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive GIS Map Viewer (Col span 8) */}
        <div className="lg:col-span-8 relative flex flex-col h-full bg-slate-200 p-2">
          {/* View Mode Banner */}
          <div className="absolute top-4 left-4 z-20 bg-slate-900/90 text-white px-3 py-1.5 rounded border border-slate-700 text-xs font-mono shadow backdrop-blur-xs flex items-center space-x-2">
            <span className="text-slate-400">ACTIVE DISPLAY:</span>
            <span className="font-bold text-sky-300">
              {viewMode === 'before'
                ? 'BEFORE: Known Incomplete Network (42 segments)'
                : 'AFTER: Reconstructed Candidate Network (42 known + 18 candidate)'}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 bg-amber-900/80 text-amber-300 border border-amber-600 rounded">
              DEMO
            </span>
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
          />
        </div>
      </div>
    </div>
  );
};
