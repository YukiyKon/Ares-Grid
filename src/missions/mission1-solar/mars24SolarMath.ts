// Cálculos astronômicos inspirados no sistema NASA GISS Mars24
// para Arcadia Planitia (Latitude φ ≈ 39°N, Longitude ≈ 188°E)

export type MarsSeasonId = 'SUMMER_NORTH' | 'EQUINOX' | 'WINTER_NORTH';
export type MarsSolarHourId = 'MORNING' | 'NOON' | 'AFTERNOON';
export type PanelAzimuthId = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST';

export const ARCADIA_LATITUDE_DEG = 39;
export const ARCADIA_LONGITUDE_DEG = 188;

export const SEASON_INFO: Record<
  MarsSeasonId,
  { label: string; declinationDeg: number; solarDistanceFactor: number; summary: string }
> = {
  SUMMER_NORTH: {
    label: 'Verão no Norte',
    declinationDeg: 25.2,
    solarDistanceFactor: 0.92,
    summary: 'Sol bem alto no céu de Arcadia Planitia (δ = +25,2°).',
  },
  EQUINOX: {
    label: 'Equinócio (Primavera/Outono)',
    declinationDeg: 0,
    solarDistanceFactor: 1.0,
    summary: 'Dia e noite com duração equilibrada em Marte (δ = 0,0°).',
  },
  WINTER_NORTH: {
    label: 'Inverno no Norte',
    declinationDeg: -25.2,
    solarDistanceFactor: 1.08,
    summary: 'Sol mais baixo próximo ao horizonte sul (δ = -25,2°).',
  },
};

export const SOLAR_HOUR_INFO: Record<
  MarsSolarHourId,
  { label: string; hourAngleDeg: number; clockLabel: string }
> = {
  MORNING: {
    label: 'Manhã Marciana',
    hourAngleDeg: -45,
    clockLabel: '09:00 LMST',
  },
  NOON: {
    label: 'Meio-dia Solar',
    hourAngleDeg: 0,
    clockLabel: '12:00 LMST',
  },
  AFTERNOON: {
    label: 'Tarde Marciana',
    hourAngleDeg: 45,
    clockLabel: '15:00 LMST',
  },
};

export const AZIMUTH_LABELS: Record<PanelAzimuthId, string> = {
  NORTH: 'Norte (N)',
  EAST: 'Leste (L)',
  SOUTH: 'Sul (S)',
  WEST: 'Oeste (O)',
};

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

export interface SolarCalculationResult {
  latitudeDeg: number;
  declinationDeg: number;
  hourAngleDeg: number;
  zenithDeg: number;
  elevationDeg: number;
  sunAzimuthLabel: PanelAzimuthId;
  recommendedAzimuth: PanelAzimuthId;
  recommendedTiltDeg: number;
  idealTiltRange: [number, number];
  incidenceCosine: number;
  efficiencyPct: number;
  wattsOutput: number;
  maxPossibleWatts: number;
  isOptimalZone: boolean;
}

function getPanelNormal(
  azimuth: PanelAzimuthId,
  tiltDeg: number
): [number, number, number] {
  const beta = tiltDeg * DEG_TO_RAD;
  const sinB = Math.sin(beta);
  const cosB = Math.cos(beta);
  switch (azimuth) {
    case 'EAST':
      return [sinB, 0, cosB];
    case 'WEST':
      return [-sinB, 0, cosB];
    case 'NORTH':
      return [0, sinB, cosB];
    case 'SOUTH':
      return [0, -sinB, cosB];
  }
}

export function calculateMars24Solar(params: {
  season: MarsSeasonId;
  solarHour: MarsSolarHourId;
  panelAzimuth: PanelAzimuthId;
  panelTiltDeg: number;
  dusty?: boolean;
}): SolarCalculationResult {
  const { season, solarHour, panelAzimuth, panelTiltDeg, dusty = false } = params;

  const phiDeg = ARCADIA_LATITUDE_DEG;
  const deltaDeg = SEASON_INFO[season].declinationDeg;
  const hAngleDeg = SOLAR_HOUR_INFO[solarHour].hourAngleDeg;

  const phi = phiDeg * DEG_TO_RAD;
  const delta = deltaDeg * DEG_TO_RAD;
  const H = hAngleDeg * DEG_TO_RAD;

  // Equação Mars24: cos(Z) = sin(δ)*sin(φ) + cos(δ)*cos(φ)*cos(H)
  const cosZ = Math.max(
    -1,
    Math.min(1, Math.sin(delta) * Math.sin(phi) + Math.cos(delta) * Math.cos(phi) * Math.cos(H))
  );
  const zenithDeg = Math.acos(cosZ) * RAD_TO_DEG;
  const elevationDeg = Math.max(0, 90 - zenithDeg);

  // Vetor unitário do Sol em coordenadas locais (Leste, Norte, Zênite)
  const sunEast = -Math.cos(delta) * Math.sin(H);
  const sunNorth = Math.sin(delta) * Math.cos(phi) - Math.cos(delta) * Math.sin(phi) * Math.cos(H);
  const sunUp = cosZ;

  // Descobre qual direção cardeal e qual inclinação (0..60) maximizam a captação
  const candidates: PanelAzimuthId[] = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
  let bestAzimuth: PanelAzimuthId = 'SOUTH';
  let bestTilt = 30;
  let bestCos = 0;

  for (const az of candidates) {
    for (let t = 0; t <= 60; t += 1) {
      const [nx, ny, nz] = getPanelNormal(az, t);
      const dot = sunEast * nx + sunNorth * ny + sunUp * nz;
      if (dot > bestCos) {
        bestCos = dot;
        bestAzimuth = az;
        bestTilt = t;
      }
    }
  }

  // Vetor do painel escolhido pelo jogador
  const [px, py, pz] = getPanelNormal(panelAzimuth, panelTiltDeg);
  const rawDot = sunEast * px + sunNorth * py + sunUp * pz;
  const incidenceCosine = Math.max(0, rawDot);

  // Fator de atenuação atmosférica marciana + distância solar + poeira
  const airmassPenalty = sunUp > 0.15 ? 1 : Math.max(0.35, sunUp * 4);
  const dustPenalty = dusty ? 0.62 : 1;
  const peakArrayCapacityW = 600 * SEASON_INFO[season].solarDistanceFactor * airmassPenalty;

  const maxPossibleWatts = Math.round(peakArrayCapacityW * bestCos);
  const wattsOutput = Math.round(peakArrayCapacityW * incidenceCosine * dustPenalty);

  const efficiencyPct =
    bestCos > 0 ? Math.min(100, Math.round((incidenceCosine / bestCos) * 100 * dustPenalty)) : 0;

  const minIdeal = Math.max(0, bestTilt - 8);
  const maxIdeal = Math.min(60, bestTilt + 8);

  const isOptimalZone =
    !dusty &&
    efficiencyPct >= 90 &&
    panelAzimuth === bestAzimuth &&
    panelTiltDeg >= minIdeal &&
    panelTiltDeg <= maxIdeal;

  return {
    latitudeDeg: phiDeg,
    declinationDeg: deltaDeg,
    hourAngleDeg: hAngleDeg,
    zenithDeg: Number(zenithDeg.toFixed(1)),
    elevationDeg: Number(elevationDeg.toFixed(1)),
    sunAzimuthLabel: bestAzimuth,
    recommendedAzimuth: bestAzimuth,
    recommendedTiltDeg: bestTilt,
    idealTiltRange: [minIdeal, maxIdeal],
    incidenceCosine: Number(incidenceCosine.toFixed(2)),
    efficiencyPct,
    wattsOutput,
    maxPossibleWatts,
    isOptimalZone,
  };
}
