import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Polygon, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { DrainageSegment, DrainageNode, FloodAccumulationZone, RoadFeature, BuildingFeature, InterventionOption } from '../../data/types';
import { studyArea, sampleRoads, sampleBuildings, demElevationContours } from '../../data/studyArea';
import { Layers, Eye, EyeOff, Info, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

// Fix standard Leaflet icon paths in bundlers if needed
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export interface MapLayerVisibility {
  dem: boolean;
  roads: boolean;
  buildings: boolean;
  knownDrainage: boolean;
  reconstructedDrainage: boolean;
  floodZones: boolean;
  problemAreas: boolean;
  junctions: boolean;
}

interface MapViewerProps {
  layers: MapLayerVisibility;
  knownSegments: DrainageSegment[];
  reconstructedSegments: DrainageSegment[];
  nodes: DrainageNode[];
  floodZones: FloodAccumulationZone[];
  activeIntervention?: InterventionOption | null;
  selectedSegment: DrainageSegment | null;
  selectedNode: DrainageNode | null;
  onSelectSegment: (segment: DrainageSegment) => void;
  onSelectNode: (node: DrainageNode) => void;
  confidenceFilter?: 'ALL' | 'HIGH' | 'MEDIUM' | 'LOW';
  highlightedCoordinates?: [number, number] | null;
}

// Subcomponent to automatically pan to highlighted coordinates or reset bounds
const MapController: React.FC<{ targetCoords?: [number, number] | null }> = ({ targetCoords }) => {
  const map = useMap();
  useEffect(() => {
    if (targetCoords) {
      map.flyTo(targetCoords, 16, { animate: true, duration: 1.0 });
    }
  }, [targetCoords, map]);
  return null;
};

export const MapViewer: React.FC<MapViewerProps> = ({
  layers,
  knownSegments,
  reconstructedSegments,
  nodes,
  floodZones,
  activeIntervention,
  selectedSegment,
  selectedNode,
  onSelectSegment,
  onSelectNode,
  confidenceFilter = 'ALL',
  highlightedCoordinates
}) => {
  const [showLegend, setShowLegend] = useState(true);

  // Filter reconstructed segments based on confidence if requested
  const filteredReconstructed = reconstructedSegments.filter((seg) => {
    if (confidenceFilter === 'ALL') return true;
    return seg.confidence === confidenceFilter;
  });

  return (
    <div className="relative w-full h-full min-h-[420px] bg-slate-200 border border-slate-300 rounded overflow-hidden shadow-inner">
      <MapContainer
        center={studyArea.center}
        zoom={studyArea.zoom}
        className="w-full h-full z-10"
        scrollWheelZoom={true}
      >
        <MapController targetCoords={highlightedCoordinates} />

        {/* Base Map Tiles: Light CartoDB Positron for clean technical GIS clarity */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

        {/* Layer 1: DEM Elevation Contours */}
        {layers.dem &&
          demElevationContours.map((contour, i) => (
            <Polyline
              key={`contour-${i}`}
              positions={contour.coordinates as [number, number][]}
              pathOptions={{
                color: '#94a3b8',
                weight: 1.2,
                dashArray: '3, 4',
                opacity: 0.7,
              }}
            >
              <Tooltip sticky>
                <span className="font-mono text-xs">Elevation: {contour.label}</span>
              </Tooltip>
            </Polyline>
          ))}

        {/* Layer 2: Urban Roads */}
        {layers.roads &&
          sampleRoads.map((road) => (
            <Polyline
              key={road.id}
              positions={road.coordinates}
              pathOptions={{
                color: road.category === 'arterial' ? '#475569' : '#64748b',
                weight: road.category === 'arterial' ? 3.5 : 2,
                opacity: 0.55,
              }}
            >
              <Tooltip sticky>
                <div className="text-xs">
                  <span className="font-semibold text-slate-800">{road.name}</span>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">
                    Category: {road.category}
                  </span>
                </div>
              </Tooltip>
            </Polyline>
          ))}

        {/* Layer 3: Buildings */}
        {layers.buildings &&
          sampleBuildings.map((bld) => (
            <Polygon
              key={bld.id}
              positions={bld.coordinates}
              pathOptions={{
                color: '#94a3b8',
                fillColor: '#cbd5e1',
                fillOpacity: 0.45,
                weight: 1,
              }}
            >
              <Tooltip sticky>
                <span className="text-xs font-mono">Building: {bld.type}</span>
              </Tooltip>
            </Polygon>
          ))}

        {/* Layer 4: Flood Accumulation / Depression Polygons */}
        {layers.floodZones &&
          floodZones.map((zone) => (
            <Polygon
              key={zone.id}
              positions={zone.coordinates}
              pathOptions={{
                color: zone.riskLevel === 'high' ? '#ef4444' : '#f59e0b',
                fillColor: zone.riskLevel === 'high' ? '#ef4444' : '#f59e0b',
                fillOpacity: 0.22,
                weight: 1.5,
                dashArray: '4, 4',
              }}
            >
              <Tooltip sticky>
                <div className="p-1 space-y-0.5">
                  <div className="font-bold text-xs text-rose-700 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {zone.name}
                  </div>
                  <div className="text-[11px] text-slate-700">
                    Contributing Accumulation: <span className="font-mono font-semibold">{zone.accumulatedAreaHa} ha</span>
                  </div>
                  <div className="text-[11px] text-slate-700">
                    Simulated Peak Depth: <span className="font-mono font-semibold">{zone.peakDepthMeters} m</span>
                  </div>
                </div>
              </Tooltip>
            </Polygon>
          ))}

        {/* Layer 5: Known Surveyed Drainage Network (Solid Dark Blue) */}
        {layers.knownDrainage &&
          knownSegments.map((segment) => {
            const isSelected = selectedSegment?.id === segment.id;
            const isProblem = segment.isProblemSegment;

            let color = '#1e3a8a'; // Solid dark blue
            let weight = 4;
            let dashArray: string | undefined = undefined;

            if (isProblem && layers.problemAreas) {
              color = '#dc2626'; // Red for bottleneck / problem
              weight = 4.5;
            }

            return (
              <Polyline
                key={segment.id}
                positions={segment.coordinates}
                pathOptions={{
                  color: isSelected ? '#38bdf8' : color,
                  weight: isSelected ? 6 : weight,
                  opacity: 0.9,
                  dashArray: dashArray,
                }}
                eventHandlers={{
                  click: () => onSelectSegment(segment),
                }}
              >
                <Tooltip sticky>
                  <div className="p-0.5">
                    <div className="font-bold text-xs text-slate-900">{segment.id}: {segment.name}</div>
                    <div className="text-[11px] text-slate-600 font-mono">
                      Type: Surveyed (Known) | L: {segment.lengthMeters}m | S: {segment.slopePercent}%
                    </div>
                    {isProblem && (
                      <div className="text-[10px] text-red-600 font-semibold font-mono mt-0.5">
                        ⚠ Identified Bottleneck / Siltation Issue
                      </div>
                    )}
                  </div>
                </Tooltip>
              </Polyline>
            );
          })}

        {/* Layer 6: Reconstructed Candidate Drainage Network */}
        {layers.reconstructedDrainage &&
          filteredReconstructed.map((segment) => {
            const isSelected = selectedSegment?.id === segment.id;
            const isLowConfidence = segment.confidence === 'LOW';
            const isProblem = segment.isProblemSegment;

            let color = '#0284c7'; // Dashed Sky / Teal
            let dashArray = '6, 6';
            let weight = 3.5;

            if (isLowConfidence) {
              color = '#d97706'; // Dashed Amber
              dashArray = '5, 5';
            }

            if (isProblem && layers.problemAreas) {
              color = '#dc2626'; // Red
              dashArray = '4, 4';
              weight = 4.5;
            }

            return (
              <Polyline
                key={segment.id}
                positions={segment.coordinates}
                pathOptions={{
                  color: isSelected ? '#38bdf8' : color,
                  weight: isSelected ? 6 : weight,
                  opacity: 0.92,
                  dashArray: dashArray,
                }}
                eventHandlers={{
                  click: () => onSelectSegment(segment),
                }}
              >
                <Tooltip sticky>
                  <div className="p-0.5">
                    <div className="font-bold text-xs text-slate-900">
                      {segment.id} (Candidate Reconstruction)
                    </div>
                    <div className="text-[11px] text-slate-600 font-mono">
                      Confidence: {segment.confidence} | L: {segment.lengthMeters}m | S: {segment.slopePercent}%
                    </div>
                    <div className="text-[10px] text-amber-700 font-medium mt-0.5">
                      {segment.recommendation}
                    </div>
                  </div>
                </Tooltip>
              </Polyline>
            );
          })}

        {/* Layer 7: Active Proposed Intervention Overlay (Green Glow Line) */}
        {activeIntervention && (
          <Polyline
            positions={activeIntervention.coordinates}
            pathOptions={{
              color: '#10b981',
              weight: 5,
              opacity: 0.95,
              dashArray: '8, 6',
            }}
          >
            <Tooltip sticky permanent>
              <span className="font-mono text-xs font-bold text-emerald-700 bg-white/90 px-1 py-0.5 rounded shadow">
                ★ {activeIntervention.shortCode}
              </span>
            </Tooltip>
          </Polyline>
        )}

        {/* Layer 8: Junction Nodes & Outfalls */}
        {layers.junctions &&
          nodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const isOutfall = node.type === 'outfall';
            const isSurcharged = node.isSurchargedInHeavyRain;

            return (
              <CircleMarker
                key={node.id}
                center={node.coordinates}
                radius={isOutfall ? 6.5 : isSurcharged ? 5.5 : 4}
                pathOptions={{
                  color: isSelected
                    ? '#38bdf8'
                    : isOutfall
                    ? '#0284c7'
                    : isSurcharged
                    ? '#dc2626'
                    : '#1e293b',
                  fillColor: isOutfall
                    ? '#0369a1'
                    : isSurcharged
                    ? '#ef4444'
                    : '#ffffff',
                  fillOpacity: 1,
                  weight: isSelected ? 3 : 2,
                }}
                eventHandlers={{
                  click: () => onSelectNode(node),
                }}
              >
                <Tooltip sticky>
                  <div className="p-0.5">
                    <div className="font-bold text-xs text-slate-900">{node.id}: {node.name}</div>
                    <div className="text-[11px] text-slate-600 font-mono">
                      Elevation: {node.elevationM}m MSL | Depth: {node.depthM}m
                    </div>
                    {isSurcharged && (
                      <div className="text-[10px] text-red-600 font-semibold mt-0.5">
                        ⚠ Surcharge-Prone Junction
                      </div>
                    )}
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}
      </MapContainer>

      {/* Geospatial Map Legend (Collapsible, Technical Design) */}
      <div className="absolute bottom-3 right-3 z-20 bg-slate-900/95 text-white border border-slate-700 rounded shadow-xl max-w-xs text-xs backdrop-blur-sm transition-all">
        <div
          onClick={() => setShowLegend(!showLegend)}
          className="px-3 py-2 border-b border-slate-800 flex items-center justify-between cursor-pointer select-none bg-slate-950/80 rounded-t"
        >
          <div className="flex items-center space-x-1.5 font-mono text-[11px] font-semibold text-slate-200">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>GIS MAP LEGEND</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 hover:text-white">
            {showLegend ? '[ Hide ]' : '[ Show ]'}
          </span>
        </div>

        {showLegend && (
          <div className="p-3 space-y-2 font-mono text-[11px]">
            {/* Known Drainage */}
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-1 bg-[#1e3a8a] rounded-sm shrink-0"></div>
              <div className="flex flex-col">
                <span className="text-slate-200 font-semibold">Known Drainage</span>
                <span className="text-[9px] text-slate-400">Solid dark blue line</span>
              </div>
            </div>

            {/* Reconstructed Drainage */}
            <div className="flex items-center space-x-2.5">
              <div className="w-6 border-b-2 border-dashed border-[#0284c7] shrink-0"></div>
              <div className="flex flex-col">
                <span className="text-slate-200 font-semibold">Reconstructed Drainage</span>
                <span className="text-[9px] text-slate-400">Dashed sky/teal line</span>
              </div>
            </div>

            {/* Low Confidence */}
            <div className="flex items-center space-x-2.5">
              <div className="w-6 border-b-2 border-dashed border-[#d97706] shrink-0"></div>
              <div className="flex flex-col">
                <span className="text-slate-200 font-semibold">Low Confidence</span>
                <span className="text-[9px] text-slate-400">Dashed amber line</span>
              </div>
            </div>

            {/* Problem Segment */}
            <div className="flex items-center space-x-2.5">
              <div className="w-6 h-1 bg-[#dc2626] rounded-sm shrink-0"></div>
              <div className="flex flex-col">
                <span className="text-slate-200 font-semibold">Problem / Bottleneck</span>
                <span className="text-[9px] text-slate-400">Red highlighted reach</span>
              </div>
            </div>

            {/* Junction & Outfall */}
            <div className="flex items-center space-x-2.5">
              <div className="flex items-center space-x-1 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full border border-slate-300 bg-white"></div>
                <div className="w-3 h-3 rounded-full bg-sky-600 border border-sky-300"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-slate-200 font-semibold">Junction / Outfall</span>
                <span className="text-[9px] text-slate-400">Manhole &amp; Gravity Outfall</span>
              </div>
            </div>

            {/* Flood Accumulation Area */}
            <div className="flex items-center space-x-2.5">
              <div className="w-5 h-3 bg-red-500/30 border border-dashed border-red-400 rounded-sm shrink-0"></div>
              <div className="flex flex-col">
                <span className="text-slate-200 font-semibold">Accumulation Zone</span>
                <span className="text-[9px] text-slate-400">Simulated depression ponding</span>
              </div>
            </div>

            <div className="pt-1.5 border-t border-slate-800 text-[10px] text-amber-400/90 italic">
              * Click any line or node to inspect hydraulic properties &amp; evidence.
            </div>
          </div>
        )}
      </div>

      {/* Floating Spatial Attribution / Catchment Tag */}
      <div className="absolute top-3 left-3 z-20 bg-slate-950/90 text-white px-2.5 py-1.5 rounded border border-slate-700/80 text-[11px] font-mono shadow">
        <span className="text-slate-400 block text-[9px] uppercase">Active Spatial Catchment</span>
        <span className="font-bold text-sky-300">{studyArea.name}</span>
        <span className="text-slate-400 text-[10px] ml-1.5">[{studyArea.center[0]}, {studyArea.center[1]}]</span>
      </div>
    </div>
  );
};
