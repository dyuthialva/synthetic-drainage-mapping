import { InterventionOption } from './types';

export const candidateInterventions: InterventionOption[] = [
  {
    id: 'int-01',
    title: 'Add Drainage Connection at Junction J-08 (Balgandharva Bypass)',
    shortCode: 'INT-01: J-08 Connection',
    description: 'Construct a 260m candidate interconnecting conduit between dead-end node J-13 (Ghole Road) and Node J-08, with direct relief conduit feeding Outfall OF-01.',
    interventionType: 'connection',
    targetNodeOrSegmentId: 'J-08',
    coordinates: [
      [18.5315, 73.8445],
      [18.5300, 73.8465],
      [18.5350, 73.8478],
      [18.5375, 73.8525]
    ],
    estimatedLengthMeters: 260,
    newCapacityM3s: 3.8,
    beforeMetrics: {
      surchargedNodes: 5,
      potentialBottlenecks: 4,
      floodedAreaHa: 8.7,
      peakDischargeM3s: 14.2,
      drainageContinuityScore: 68
    },
    afterMetrics: {
      surchargedNodes: 2,
      potentialBottlenecks: 2,
      floodedAreaHa: 4.1,
      peakDischargeM3s: 9.8,
      drainageContinuityScore: 92
    },
    engineeringNotes: 'Relieves chronic surcharge at Balgandharva depression basin by diverting 4.4 m³/s away from bottleneck segment KN-DR-006 directly to Mutha outfall.',
    fieldVerificationStatus: 'Requires utility clash detection survey (telecom/water mains along JM Road corridor).'
  },
  {
    id: 'int-02',
    title: 'Upgrade Trunk Conduit KN-DR-006 (JM Road Bottleneck)',
    shortCode: 'INT-02: KN-DR-006 Upgrade',
    description: 'Replace undersized 800mm legacy pipe with 1400mm reinforced concrete box conduit over 515m reach from J-07 to J-08.',
    interventionType: 'upgrade',
    targetNodeOrSegmentId: 'KN-DR-006',
    coordinates: [
      [18.5255, 73.8452],
      [18.5300, 73.8465]
    ],
    estimatedLengthMeters: 515,
    newCapacityM3s: 5.2,
    beforeMetrics: {
      surchargedNodes: 5,
      potentialBottlenecks: 4,
      floodedAreaHa: 8.7,
      peakDischargeM3s: 14.2,
      drainageContinuityScore: 68
    },
    afterMetrics: {
      surchargedNodes: 3,
      potentialBottlenecks: 1,
      floodedAreaHa: 5.2,
      peakDischargeM3s: 11.1,
      drainageContinuityScore: 84
    },
    engineeringNotes: 'Doubles hydraulic throughput along primary commercial spine, eliminating the single highest risk bottleneck on JM Road.',
    fieldVerificationStatus: 'Requires geotechnical boring and traffic diversion planning.'
  },
  {
    id: 'int-03',
    title: 'Sambhaji Park Subsurface Detention Vault & Regrading',
    shortCode: 'INT-03: Retention Vault',
    description: 'Construct 4,500 m³ underground stormwater storage vault beneath Sambhaji Park peripheral grounds and regrade adverse slope segment KN-DR-018 from 0.2% to 1.2%.',
    interventionType: 'retention',
    targetNodeOrSegmentId: 'KN-DR-018',
    coordinates: [
      [18.5245, 73.8398],
      [18.5230, 73.8420]
    ],
    estimatedLengthMeters: 280,
    newCapacityM3s: 4.5,
    beforeMetrics: {
      surchargedNodes: 5,
      potentialBottlenecks: 4,
      floodedAreaHa: 8.7,
      peakDischargeM3s: 14.2,
      drainageContinuityScore: 68
    },
    afterMetrics: {
      surchargedNodes: 1,
      potentialBottlenecks: 2,
      floodedAreaHa: 3.5,
      peakDischargeM3s: 8.6,
      drainageContinuityScore: 88
    },
    engineeringNotes: 'Attenuates peak monsoonal flash-flood pulses and eliminates recurrent siltation at Goodluck Chowk junction.',
    fieldVerificationStatus: 'Feasibility study approved in municipal stormwater masterplan draft.'
  }
];
