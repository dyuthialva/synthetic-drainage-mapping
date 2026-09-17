import { StudyAreaInfo, RoadFeature, BuildingFeature } from './types';

export const studyArea: StudyAreaInfo = {
  id: 'pune-urban-catchment-01',
  name: 'Pune Urban Catchment',
  region: 'Mutha River Basin Sub-watershed (Shivajinagar - Deccan - Model Colony Sector)',
  state: 'Maharashtra, India',
  center: [18.5285, 73.8420],
  zoom: 15,
  bounds: [
    [18.5150, 73.8250],
    [18.5420, 73.8600]
  ],
  areaSqKm: 4.85,
  averageElevationM: 559.4,
  slopeRange: '0.4% – 5.2% (Terrain drops towards Mutha River channel)',
  soilHydrologicGroup: 'Group C / D (Moderate to High Runoff Potential, Urban Clayey Silt)',
  knownSegmentsCount: 42,
  reconstructedSegmentsCount: 18,
  validatedCount: 31,
  lowConfidenceCount: 7,
  bottlenecksCount: 4,
  description: 'Dense urban catchment characterized by rapid urbanization, incomplete legacy storm-sewer records, and localized monsoon waterlogging along road underpasses and natural terrain depressions.'
};

export const sampleRoads: RoadFeature[] = [
  {
    id: 'rd-fc-road',
    name: 'Fergusson College Road (Arterial)',
    category: 'arterial',
    coordinates: [
      [18.5205, 73.8385],
      [18.5245, 73.8398],
      [18.5290, 73.8412],
      [18.5340, 73.8428],
      [18.5385, 73.8440]
    ]
  },
  {
    id: 'rd-jm-road',
    name: 'Jangali Maharaj Road',
    category: 'arterial',
    coordinates: [
      [18.5210, 73.8440],
      [18.5255, 73.8452],
      [18.5300, 73.8465],
      [18.5350, 73.8478],
      [18.5390, 73.8488]
    ]
  },
  {
    id: 'rd-senapati-bapat',
    name: 'Senapati Bapat Road Link',
    category: 'collector',
    coordinates: [
      [18.5320, 73.8290],
      [18.5345, 73.8335],
      [18.5365, 73.8390],
      [18.5380, 73.8435]
    ]
  },
  {
    id: 'rd-ghole-road',
    name: 'Ghole Road Collector Corridor',
    category: 'collector',
    coordinates: [
      [18.5230, 73.8420],
      [18.5270, 73.8432],
      [18.5315, 73.8445],
      [18.5360, 73.8458]
    ]
  },
  {
    id: 'rd-river-corridor',
    name: 'Mutha Riverfront Embankment Road',
    category: 'collector',
    coordinates: [
      [18.5185, 73.8480],
      [18.5230, 73.8505],
      [18.5280, 73.8525],
      [18.5335, 73.8540],
      [18.5395, 73.8552]
    ]
  },
  {
    id: 'rd-deep-bungalow',
    name: 'Deep Bungalow Chowk Connector',
    category: 'local',
    coordinates: [
      [18.5350, 73.8350],
      [18.5330, 73.8380],
      [18.5310, 73.8415]
    ]
  },
  {
    id: 'rd-prabhat-road',
    name: 'Prabhat Road Sector Corridor',
    category: 'local',
    coordinates: [
      [18.5170, 73.8340],
      [18.5200, 73.8360],
      [18.5230, 73.8380]
    ]
  }
];

export const sampleBuildings: BuildingFeature[] = [
  {
    id: 'bld-01',
    type: 'institutional',
    coordinates: [
      [18.5240, 73.8380],
      [18.5255, 73.8382],
      [18.5253, 73.8395],
      [18.5238, 73.8393]
    ]
  },
  {
    id: 'bld-02',
    type: 'commercial',
    coordinates: [
      [18.5275, 73.8420],
      [18.5288, 73.8423],
      [18.5286, 73.8436],
      [18.5273, 73.8433]
    ]
  },
  {
    id: 'bld-03',
    type: 'commercial',
    coordinates: [
      [18.5310, 73.8450],
      [18.5322, 73.8453],
      [18.5320, 73.8465],
      [18.5308, 73.8462]
    ]
  },
  {
    id: 'bld-04',
    type: 'residential',
    coordinates: [
      [18.5340, 73.8380],
      [18.5352, 73.8382],
      [18.5350, 73.8395],
      [18.5338, 73.8393]
    ]
  },
  {
    id: 'bld-05',
    type: 'institutional',
    coordinates: [
      [18.5220, 73.8470],
      [18.5235, 73.8472],
      [18.5233, 73.8488],
      [18.5218, 73.8485]
    ]
  }
];

export const demElevationContours = [
  { elevation: 575, label: '575m (Western Ridge)', coordinates: [[18.522, 73.828], [18.528, 73.830], [18.535, 73.832], [18.540, 73.835]] },
  { elevation: 565, label: '565m (Mid Slope)', coordinates: [[18.520, 73.835], [18.526, 73.837], [18.533, 73.840], [18.538, 73.842]] },
  { elevation: 555, label: '555m (Urban Terrace)', coordinates: [[18.518, 73.842], [18.524, 73.844], [18.530, 73.846], [18.536, 73.848]] },
  { elevation: 545, label: '545m (Mutha Floodplain)', coordinates: [[18.516, 73.849], [18.522, 73.852], [18.528, 73.854], [18.534, 73.856]] }
];
