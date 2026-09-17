import { RainfallScenario } from './types';

export const rainfallScenarios: RainfallScenario[] = [
  {
    id: 'sc-light',
    name: 'Demo Light Rainfall (1-Year Event)',
    type: 'light',
    totalRainfallMm: 15.0,
    durationMinutes: 60,
    peakIntensityMmHr: 22.5,
    returnPeriod: '1-Year Return Period (Pune Monsoonal Baseline)',
    hyetograph: [
      { minute: 0, intensityMmHr: 4.0, cumulativeMm: 0.0 },
      { minute: 10, intensityMmHr: 8.5, cumulativeMm: 1.2 },
      { minute: 20, intensityMmHr: 18.0, cumulativeMm: 3.5 },
      { minute: 30, intensityMmHr: 22.5, cumulativeMm: 7.2 },
      { minute: 40, intensityMmHr: 16.0, cumulativeMm: 10.8 },
      { minute: 50, intensityMmHr: 8.0, cumulativeMm: 13.2 },
      { minute: 60, intensityMmHr: 2.0, cumulativeMm: 15.0 }
    ],
    simulationSummary: {
      peakRunoffM3s: 2.4,
      timeToPeakMinutes: 32,
      totalVolumeM3: 4850,
      surchargedNodesCount: 0,
      floodedCatchmentHa: 0.4,
      criticalBottlenecksCount: 0
    },
    hydrograph: [
      { minute: 0, baselineDischargeM3s: 0.1, reconstructedDischargeM3s: 0.1, withInterventionDischargeM3s: 0.1 },
      { minute: 10, baselineDischargeM3s: 0.4, reconstructedDischargeM3s: 0.5, withInterventionDischargeM3s: 0.4 },
      { minute: 20, baselineDischargeM3s: 1.2, reconstructedDischargeM3s: 1.4, withInterventionDischargeM3s: 1.1 },
      { minute: 30, baselineDischargeM3s: 2.3, reconstructedDischargeM3s: 2.5, withInterventionDischargeM3s: 1.8 },
      { minute: 40, baselineDischargeM3s: 1.9, reconstructedDischargeM3s: 2.0, withInterventionDischargeM3s: 1.5 },
      { minute: 50, baselineDischargeM3s: 0.9, reconstructedDischargeM3s: 1.0, withInterventionDischargeM3s: 0.7 },
      { minute: 60, baselineDischargeM3s: 0.3, reconstructedDischargeM3s: 0.3, withInterventionDischargeM3s: 0.2 }
    ]
  },
  {
    id: 'sc-moderate',
    name: 'Demo Moderate Rainfall (5-Year Event)',
    type: 'moderate',
    totalRainfallMm: 38.0,
    durationMinutes: 60,
    peakIntensityMmHr: 54.0,
    returnPeriod: '5-Year Return Period (Design Storm Standard)',
    hyetograph: [
      { minute: 0, intensityMmHr: 8.0, cumulativeMm: 0.0 },
      { minute: 10, intensityMmHr: 22.0, cumulativeMm: 3.2 },
      { minute: 20, intensityMmHr: 45.0, cumulativeMm: 9.8 },
      { minute: 30, intensityMmHr: 54.0, cumulativeMm: 19.5 },
      { minute: 40, intensityMmHr: 36.0, cumulativeMm: 28.2 },
      { minute: 50, intensityMmHr: 16.0, cumulativeMm: 34.0 },
      { minute: 60, intensityMmHr: 5.0, cumulativeMm: 38.0 }
    ],
    simulationSummary: {
      peakRunoffM3s: 6.8,
      timeToPeakMinutes: 34,
      totalVolumeM3: 14200,
      surchargedNodesCount: 2,
      floodedCatchmentHa: 3.2,
      criticalBottlenecksCount: 2
    },
    hydrograph: [
      { minute: 0, baselineDischargeM3s: 0.2, reconstructedDischargeM3s: 0.2, withInterventionDischargeM3s: 0.2 },
      { minute: 10, baselineDischargeM3s: 1.1, reconstructedDischargeM3s: 1.4, withInterventionDischargeM3s: 1.0 },
      { minute: 20, baselineDischargeM3s: 3.8, reconstructedDischargeM3s: 4.5, withInterventionDischargeM3s: 3.2 },
      { minute: 30, baselineDischargeM3s: 6.8, reconstructedDischargeM3s: 7.2, withInterventionDischargeM3s: 4.9 },
      { minute: 40, baselineDischargeM3s: 5.2, reconstructedDischargeM3s: 5.6, withInterventionDischargeM3s: 3.8 },
      { minute: 50, baselineDischargeM3s: 2.6, reconstructedDischargeM3s: 2.9, withInterventionDischargeM3s: 1.9 },
      { minute: 60, baselineDischargeM3s: 0.8, reconstructedDischargeM3s: 0.9, withInterventionDischargeM3s: 0.6 }
    ]
  },
  {
    id: 'sc-heavy',
    name: 'Demo Heavy Rainfall (25-Year Monsoonal Cloudburst)',
    type: 'heavy',
    totalRainfallMm: 75.0,
    durationMinutes: 60,
    peakIntensityMmHr: 112.0,
    returnPeriod: '25-Year Extreme Monsoonal Storm Pulse',
    hyetograph: [
      { minute: 0, intensityMmHr: 14.0, cumulativeMm: 0.0 },
      { minute: 10, intensityMmHr: 42.0, cumulativeMm: 6.5 },
      { minute: 20, intensityMmHr: 88.0, cumulativeMm: 19.8 },
      { minute: 30, intensityMmHr: 112.0, cumulativeMm: 39.5 },
      { minute: 40, intensityMmHr: 72.0, cumulativeMm: 57.0 },
      { minute: 50, intensityMmHr: 31.0, cumulativeMm: 68.5 },
      { minute: 60, intensityMmHr: 9.0, cumulativeMm: 75.0 }
    ],
    simulationSummary: {
      peakRunoffM3s: 14.2,
      timeToPeakMinutes: 35,
      totalVolumeM3: 31500,
      surchargedNodesCount: 5,
      floodedCatchmentHa: 8.7,
      criticalBottlenecksCount: 4
    },
    hydrograph: [
      { minute: 0, baselineDischargeM3s: 0.4, reconstructedDischargeM3s: 0.4, withInterventionDischargeM3s: 0.4 },
      { minute: 10, baselineDischargeM3s: 2.8, reconstructedDischargeM3s: 3.2, withInterventionDischargeM3s: 2.2 },
      { minute: 20, baselineDischargeM3s: 8.6, reconstructedDischargeM3s: 9.8, withInterventionDischargeM3s: 6.5 },
      { minute: 30, baselineDischargeM3s: 14.2, reconstructedDischargeM3s: 15.6, withInterventionDischargeM3s: 9.8 },
      { minute: 40, baselineDischargeM3s: 11.4, reconstructedDischargeM3s: 12.3, withInterventionDischargeM3s: 7.9 },
      { minute: 50, baselineDischargeM3s: 5.8, reconstructedDischargeM3s: 6.2, withInterventionDischargeM3s: 4.1 },
      { minute: 60, baselineDischargeM3s: 1.9, reconstructedDischargeM3s: 2.0, withInterventionDischargeM3s: 1.3 }
    ]
  }
];
