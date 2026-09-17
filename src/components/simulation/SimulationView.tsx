import React, { useState } from 'react';
import { DrainageSegment, DrainageNode, FloodAccumulationZone, RainfallScenario } from '../../data/types';
import { rainfallScenarios } from '../../data/rainfallScenarios';
import { MapViewer, MapLayerVisibility } from '../map/MapViewer';
import { CloudRain, Play, RefreshCw, Activity, ArrowRight, Layers, BarChart3, AlertTriangle, CheckCircle2, ShieldAlert, Sliders } from 'lucide-react';
import { TabType } from '../common/Header';
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface SimulationViewProps {
  knownSegments: DrainageSegment[];
  reconstructedSegments: DrainageSegment[];
  nodes: DrainageNode[];
  floodZones: FloodAccumulationZone[];
  selectedSegment: DrainageSegment | null;
  selectedNode: DrainageNode | null;
  onSelectSegment: (segment: DrainageSegment) => void;
  onSelectNode: (node: DrainageNode) => void;
  simulationRun: boolean;
  setSimulationRun: (val: boolean) => void;
  setActiveTab: (tab: TabType) => void;
}

export const SimulationView: React.FC<SimulationViewProps> = ({
  knownSegments,
  reconstructedSegments,
  nodes,
  floodZones,
  selectedSegment,
  selectedNode,
  onSelectSegment,
  onSelectNode,
  simulationRun,
  setSimulationRun,
  setActiveTab,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('sc-heavy');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStage, setSimulationStage] = useState(0);

  const activeScenario: RainfallScenario =
    rainfallScenarios.find((s) => s.id === selectedScenarioId) || rainfallScenarios[2];

  const stages = [
    'Preparing spatial rainfall hyetograph...',
    'Computing Horton infiltration & overland runoff...',
    '1D Dynamic wave hydraulic routing through candidate conduits...',
    'Analyzing node water depth, surcharge & bottleneck velocities...',
    'Hydrograph generation complete.'
  ];

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulationStage(0);

    const interval = setInterval(() => {
      setSimulationStage((prev) => {
        if (prev < 4) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setIsSimulating(false);
          setSimulationRun(true);
          return 4;
        }
      });
    }, 600);
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
      {/* Title & Engine Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-sky-700" />
              Rainfall &amp; Hydraulic Simulation
            </h2>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300">
              EPA SWMM INTERFACE PREVIEW
            </span>
          </div>
          <p className="text-xs text-slate-600">
            “Simulating 1D dynamic wave routing across reconstructed network under design storm pulses.”
          </p>
        </div>

        <div className="px-3 py-1 bg-amber-50 border border-amber-300 rounded text-[11px] font-mono font-bold text-amber-900 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
          <span>SIMULATED DEMO OUTPUT — NOT CALIBRATED</span>
        </div>
      </div>

      {/* Main Grid: Left (SWMM Controls & Hydrographs), Right (Map) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* LEFT COLUMN: SWMM Simulation Controls & Charts (Col span 6) */}
        <div className="lg:col-span-6 bg-white border-r border-slate-200 p-4 overflow-y-auto flex flex-col space-y-4 text-xs">
          {/* Controls Box */}
          <div className="rounded border border-slate-200 bg-slate-50 p-3.5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-700 font-bold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-sky-700" />
                <span>Hydraulic Model Parameters</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">1D St. Venant Solver</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {/* Scenario */}
              <div>
                <label className="text-slate-600 font-medium block mb-1">
                  Rainfall Scenario:
                </label>
                <select
                  value={selectedScenarioId}
                  onChange={(e) => setSelectedScenarioId(e.target.value)}
                  disabled={isSimulating}
                  className="w-full p-1.5 bg-white border border-slate-300 rounded font-semibold text-slate-800 text-xs focus:ring-1 focus:ring-sky-600 outline-hidden"
                >
                  <option value="sc-light">Demo Light (15mm / 1-Yr)</option>
                  <option value="sc-moderate">Demo Moderate (38mm / 5-Yr)</option>
                  <option value="sc-heavy">Demo Heavy (75mm / 25-Yr)</option>
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="text-slate-600 font-medium block mb-1">
                  Storm Duration:
                </label>
                <input
                  type="text"
                  value="60 minutes"
                  disabled
                  className="w-full p-1.5 bg-slate-100 border border-slate-300 rounded font-mono text-slate-700 text-xs"
                />
              </div>

              {/* Network */}
              <div>
                <label className="text-slate-600 font-medium block mb-1">
                  Active Network:
                </label>
                <input
                  type="text"
                  value="Synthetic (60 Seg)"
                  disabled
                  className="w-full p-1.5 bg-slate-100 border border-slate-300 rounded font-mono text-slate-700 text-xs"
                />
              </div>
            </div>

            {/* Run Simulation Action */}
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className={`w-full py-2.5 px-3 rounded font-semibold text-xs flex items-center justify-center space-x-2 shadow-xs transition-all ${
                isSimulating
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-sky-700 hover:bg-sky-800 text-white'
              }`}
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-sky-700" />
                  <span>Executing 1D Dynamic Routing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Run Hydraulic Simulation</span>
                </>
              )}
            </button>

            {/* Step Pipeline Progress Card */}
            {isSimulating && (
              <div className="p-3 rounded bg-slate-900 text-white space-y-1.5 animate-pulse">
                <div className="flex items-center justify-between text-[11px] font-mono text-sky-400">
                  <span>SWMM ENGINE EXECUTION</span>
                  <span>{((simulationStage + 1) * 20)}%</span>
                </div>
                <p className="text-xs text-slate-200">
                  {stages[simulationStage]}
                </p>
                <div className="w-full bg-slate-800 rounded-full h-1.5">
                  <div
                    className="bg-sky-400 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${(simulationStage + 1) * 20}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Simulation Output KPI Cards */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-700 font-bold">
                Simulation Response Metrics ({activeScenario.returnPeriod})
              </span>
              <span className="text-[10px] font-mono text-amber-700 font-semibold">
                DEMO RESULTS
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block">PEAK RUNOFF</span>
                <span className="text-base font-bold text-sky-900">
                  {activeScenario.simulationSummary.peakRunoffM3s} m³/s
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">
                  @ {activeScenario.simulationSummary.timeToPeakMinutes} min
                </span>
              </div>

              <div className="p-2.5 bg-red-50 rounded border border-red-200">
                <span className="text-[10px] text-red-700 block">SURCHARGED NODES</span>
                <span className="text-base font-bold text-red-800">
                  {activeScenario.simulationSummary.surchargedNodesCount}
                </span>
                <span className="text-[9px] text-red-600 block mt-0.5">
                  (J-05, J-08 prone)
                </span>
              </div>

              <div className="p-2.5 bg-amber-50 rounded border border-amber-200">
                <span className="text-[10px] text-amber-700 block">FLOODED CATCHMENT</span>
                <span className="text-base font-bold text-amber-800">
                  {activeScenario.simulationSummary.floodedCatchmentHa} ha
                </span>
                <span className="text-[9px] text-amber-600 block mt-0.5">
                  Depression ponding
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block">TOTAL VOLUME</span>
                <span className="text-base font-bold text-slate-800">
                  {activeScenario.simulationSummary.totalVolumeM3.toLocaleString()} m³
                </span>
                <span className="text-[9px] text-slate-400 block mt-0.5">
                  60-min volume
                </span>
              </div>
            </div>
          </div>

          {/* Chart 1: Hyetograph (Rainfall Intensity vs Time) */}
          <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-700 font-bold flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-sky-700" />
                <span>Storm Hyetograph (Rainfall Intensity vs Time)</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Peak: {activeScenario.peakIntensityMmHr} mm/hr
              </span>
            </div>

            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activeScenario.hyetograph}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
                  <XAxis dataKey="minute" unit="m" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis unit=" mm/h" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '11px', borderRadius: '4px' }}
                    formatter={(val: any) => [`${val} mm/hr`, 'Rainfall Intensity']}
                    labelFormatter={(label) => `Minute ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="intensityMmHr"
                    stroke="#0284c7"
                    fill="#38bdf8"
                    fillOpacity={0.35}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Hydrograph (Network Runoff Response vs Time) */}
          <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-700 font-bold flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-700" />
                <span>Simulated Hydrograph Response (Discharge vs Time)</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Outfall Conduit OF-01
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={activeScenario.hydrograph}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
                  <XAxis dataKey="minute" unit="m" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis unit=" m³/s" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', fontSize: '11px', borderRadius: '4px' }}
                    labelFormatter={(label) => `Minute ${label}`}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                  <Line
                    type="monotone"
                    dataKey="baselineDischargeM3s"
                    name="Surveyed Baseline"
                    stroke="#1e3a8a"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="reconstructedDischargeM3s"
                    name="With Reconstructed (Synthetic)"
                    stroke="#0284c7"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={{ r: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="withInterventionDischargeM3s"
                    name="With Proposed Planning Intervention"
                    stroke="#16a34a"
                    strokeWidth={2.5}
                    dot={{ r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('planning')}
            className="w-full mt-2 py-2 rounded bg-sky-700 hover:bg-sky-800 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
          >
            <span>Next: Intervention Comparison &amp; Decision Planning &rarr;</span>
          </button>
        </div>

        {/* RIGHT COLUMN: Interactive GIS Map Viewer (Col span 6) */}
        <div className="lg:col-span-6 relative flex flex-col h-full bg-slate-200 p-2">
          <div className="absolute top-4 left-4 z-20 bg-slate-900/90 text-white px-3 py-1.5 rounded border border-slate-700 text-xs font-mono shadow backdrop-blur-xs flex items-center space-x-2">
            <span className="text-slate-400">SIMULATED SCENARIO:</span>
            <span className="font-bold text-sky-300">{activeScenario.name}</span>
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
