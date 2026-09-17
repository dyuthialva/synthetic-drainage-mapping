import { FloodAccumulationZone, DiagnosticIssue } from './types';

// Flow accumulation polygons and flood-prone depression zones (Simulated Demo Output)
export const floodAccumulationZones: FloodAccumulationZone[] = [
  {
    id: 'FL-ZONE-01',
    name: 'Balgandharva / JM Road Low Depression Basin',
    coordinates: [
      [18.5285, 73.8445],
      [18.5315, 73.8440],
      [18.5320, 73.8480],
      [18.5290, 73.8485]
    ],
    riskLevel: 'high',
    accumulatedAreaHa: 14.5,
    peakDepthMeters: 0.65,
    cause: 'Inadequate downstream trunk capacity (bottleneck at KN-DR-006) coupled with natural saddle depression.'
  },
  {
    id: 'FL-ZONE-02',
    name: 'FC Road - Goodluck Chowk Intersection Zone',
    coordinates: [
      [18.5235, 73.8385],
      [18.5260, 73.8380],
      [18.5265, 73.8415],
      [18.5240, 73.8420]
    ],
    riskLevel: 'moderate',
    accumulatedAreaHa: 8.2,
    peakDepthMeters: 0.38,
    cause: 'High impervious surface cover (88%) and sudden confluence of hill slope runoff with urban collector.'
  },
  {
    id: 'FL-ZONE-03',
    name: 'Sambhaji Park Flat Basin & Ghole Road Confluence',
    coordinates: [
      [18.5220, 73.8410],
      [18.5250, 73.8405],
      [18.5255, 73.8440],
      [18.5225, 73.8445]
    ],
    riskLevel: 'moderate',
    accumulatedAreaHa: 6.8,
    peakDepthMeters: 0.32,
    cause: 'Adverse 0.2% pipe slope on segment KN-DR-018 causing backwater surcharge during intense storm pulses.'
  },
  {
    id: 'FL-ZONE-04',
    name: 'Shivajinagar Station Underpass Corridor',
    coordinates: [
      [18.5370, 73.8425],
      [18.5400, 73.8420],
      [18.5405, 73.8465],
      [18.5375, 73.8470]
    ],
    riskLevel: 'high',
    accumulatedAreaHa: 18.2,
    peakDepthMeters: 0.85,
    cause: 'Major catchment convergence point receiving runoff from Model Colony, Deep Bungalow, and FC Road trunks.'
  }
];

// Diagnostic issues for the Flood Diagnosis page
export const diagnosticIssues: DiagnosticIssue[] = [
  {
    id: 'DIAG-001',
    title: 'Potential Hydraulic Bottleneck',
    category: 'Potential Bottleneck',
    segmentOrNodeId: 'KN-DR-006',
    severity: 'critical',
    coordinates: [18.5278, 73.8458],
    reason: 'High upstream contributing area (10.8 ha) relative to simulated pipe capacity (800mm diameter, 0.6% slope).',
    technicalDetails: 'Simulated storm flow of 4.2 m³/s exceeds conduit full-flow capacity of 1.85 m³/s by 127%. Upstream junction J-07 experiences surface surcharge.',
    suggestedAction: 'Upsize segment KN-DR-006 to 1400mm or create bypass relief link to Mutha River outfall.',
    status: 'Requires hydraulic verification & ground survey'
  },
  {
    id: 'DIAG-002',
    title: 'Network Discontinuity / Dead-End Lateral',
    category: 'Network Discontinuity',
    segmentOrNodeId: 'J-13',
    severity: 'warning',
    coordinates: [18.5315, 73.8445],
    reason: 'Ghole Road collector terminates abruptly at Node J-13 with no documented downstream gravity outfall in municipal survey.',
    technicalDetails: 'Runoff accumulating at J-13 spills overland along street grade into Balgandharva depression rather than entering underground network.',
    suggestedAction: 'Verify synthetic reconstructed link SYN-DR-002 (connecting J-13 to J-08) or construct new 260m cross-connection.',
    status: 'Candidate connection identified (SYN-DR-002)'
  },
  {
    id: 'DIAG-003',
    title: 'High Flow Accumulation Corridor',
    category: 'High Accumulation',
    segmentOrNodeId: 'SYN-DR-018',
    severity: 'critical',
    coordinates: [18.5262, 73.8426],
    reason: 'Surface DEM flow routing generates high contributing accumulation (6.2 ha) across dense commercial corridor.',
    technicalDetails: 'No recorded large-diameter storm drain in this sub-catchment. Reconstructed candidate segment SYN-DR-018 has low confidence score.',
    suggestedAction: 'Conduct physical manhole search and dye test. If absent, prioritize for new municipal storm drain capital plan.',
    status: 'Candidate pathway with Low Confidence — Field verification required'
  },
  {
    id: 'DIAG-004',
    title: 'Low-Slope Backwater Siltation Segment',
    category: 'Low-Slope Segment',
    segmentOrNodeId: 'KN-DR-018',
    severity: 'warning',
    coordinates: [18.5238, 73.8409],
    reason: 'Sub-standard gradient (0.2% slope) fails to achieve self-cleansing velocity (0.45 m/s vs minimum 0.9 m/s required).',
    technicalDetails: 'Severe sediment accumulation reduces effective flow cross-section by estimated 40%, aggravating monsoon backwater flooding at Goodluck Chowk.',
    suggestedAction: 'Immediate mechanical desilting and grade regrading assessment.',
    status: 'Confirmed physical asset with hydraulic deficiency'
  }
];
