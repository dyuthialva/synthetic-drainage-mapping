export type SegmentType = 'known' | 'reconstructed' | 'proposed_intervention';
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type ValidationStatus = 'validated' | 'partially_validated' | 'unvalidated' | 'requires_verification';
export type ProblemSeverity = 'critical' | 'warning' | 'advisory';

export interface EvidenceItem {
  id: string;
  label: string;
  supported: boolean;
  notes?: string;
}

export interface DrainageSegment {
  id: string;
  name: string;
  type: SegmentType;
  coordinates: [number, number][]; // Lat, Lng polyline
  lengthMeters: number;
  slopePercent: number;
  catchmentAreaHa: number;
  diameterMm?: number;
  invertLevelM?: number;
  confidence?: ConfidenceLevel;
  validationStatus: ValidationStatus;
  evidence?: EvidenceItem[];
  recommendation?: string;
  isProblemSegment?: boolean;
  problemType?: 'bottleneck' | 'discontinuity' | 'low_slope' | 'high_accumulation';
  problemDescription?: string;
  flowDirectionDeg?: number;
  statusNotes?: string;
  upstreamNodeId?: string;
  downstreamNodeId?: string;
}

export interface DrainageNode {
  id: string;
  name: string;
  type: 'junction' | 'inlet' | 'outfall' | 'storage';
  coordinates: [number, number]; // Lat, Lng
  elevationM: number;
  depthM: number;
  isSurchargedInHeavyRain?: boolean;
  description: string;
}

export interface FloodAccumulationZone {
  id: string;
  name: string;
  coordinates: [number, number][]; // polygon lat, lng
  riskLevel: 'high' | 'moderate' | 'low';
  accumulatedAreaHa: number;
  peakDepthMeters: number;
  cause: string;
}

export interface RoadFeature {
  id: string;
  name: string;
  coordinates: [number, number][];
  category: 'arterial' | 'collector' | 'local';
}

export interface BuildingFeature {
  id: string;
  coordinates: [number, number][];
  type: 'commercial' | 'residential' | 'institutional';
}

export interface StudyAreaInfo {
  id: string;
  name: string;
  region: string;
  state: string;
  center: [number, number];
  zoom: number;
  bounds: [[number, number], [number, number]];
  areaSqKm: number;
  averageElevationM: number;
  slopeRange: string;
  soilHydrologicGroup: string;
  knownSegmentsCount: number;
  reconstructedSegmentsCount: number;
  validatedCount: number;
  lowConfidenceCount: number;
  bottlenecksCount: number;
  description: string;
}

export interface RainfallScenario {
  id: string;
  name: string;
  type: 'light' | 'moderate' | 'heavy';
  totalRainfallMm: number;
  durationMinutes: number;
  peakIntensityMmHr: number;
  returnPeriod: string;
  hyetograph: { minute: number; intensityMmHr: number; cumulativeMm: number }[];
  simulationSummary: {
    peakRunoffM3s: number;
    timeToPeakMinutes: number;
    totalVolumeM3: number;
    surchargedNodesCount: number;
    floodedCatchmentHa: number;
    criticalBottlenecksCount: number;
  };
  hydrograph: {
    minute: number;
    baselineDischargeM3s: number;
    reconstructedDischargeM3s: number;
    withInterventionDischargeM3s: number;
  }[];
}

export interface InterventionOption {
  id: string;
  title: string;
  shortCode: string;
  description: string;
  interventionType: 'connection' | 'upgrade' | 'outfall' | 'retention';
  targetNodeOrSegmentId: string;
  coordinates: [number, number][];
  estimatedLengthMeters?: number;
  newCapacityM3s?: number;
  beforeMetrics: {
    surchargedNodes: number;
    potentialBottlenecks: number;
    floodedAreaHa: number;
    peakDischargeM3s: number;
    drainageContinuityScore: number;
  };
  afterMetrics: {
    surchargedNodes: number;
    potentialBottlenecks: number;
    floodedAreaHa: number;
    peakDischargeM3s: number;
    drainageContinuityScore: number;
  };
  engineeringNotes: string;
  fieldVerificationStatus: string;
}

export interface DiagnosticIssue {
  id: string;
  title: string;
  category: 'High Accumulation' | 'Network Discontinuity' | 'Potential Bottleneck' | 'Low-Slope Segment';
  segmentOrNodeId: string;
  severity: ProblemSeverity;
  coordinates: [number, number];
  reason: string;
  technicalDetails: string;
  suggestedAction: string;
  status: string;
}
