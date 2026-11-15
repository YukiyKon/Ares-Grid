export type SurvivalWeatherType =
  | 'CLEAR'
  | 'DUST_WIND'
  | 'GLOBAL_DUST_STORM'
  | 'SOLAR_RADIATION_FLARE';

export type CampaignStormSchedule = Record<
  number,
  'GLOBAL_DUST_STORM' | 'SOLAR_RADIATION_FLARE'
>;

export interface SolWeatherInfo {
  sol: number;
  type: SurvivalWeatherType;
  title: string;
  shortBadge: string;
  description: string;
  capiAdvice: string;
  solarEfficiencyMultiplier: number;
  dailyDustAccumulation: number;
  isCritical: boolean;
  isModerateAlert: boolean;
}

const DEFAULT_STORM_SCHEDULE: CampaignStormSchedule = {
  8: 'GLOBAL_DUST_STORM',
  17: 'SOLAR_RADIATION_FLARE',
  25: 'GLOBAL_DUST_STORM',
};

const MODERATE_DUST_WIND_SOLS = new Set([4, 11, 14, 21, 24, 28]);

/**
 * Gera uma programação aleatória de 2 a 3 tempestades extremas raras
 * distribuídas ao longo dos 30 Sols da campanha.
 */
export function generateCampaignStormSchedule(): CampaignStormSchedule {
  const count = Math.random() < 0.45 ? 2 : 3;
  const pickRange = (min: number, max: number) =>
    min + Math.floor(Math.random() * (max - min + 1));

  const solA = pickRange(5, 10);
  const solB = pickRange(14, 20);
  const solC = pickRange(23, 28);

  const schedule: CampaignStormSchedule = {};
  const flip = Math.random() < 0.5;
  schedule[solA] = flip ? 'GLOBAL_DUST_STORM' : 'SOLAR_RADIATION_FLARE';
  schedule[solB] = flip ? 'SOLAR_RADIATION_FLARE' : 'GLOBAL_DUST_STORM';

  if (count === 3) {
    schedule[solC] = Math.random() < 0.5 ? 'GLOBAL_DUST_STORM' : 'SOLAR_RADIATION_FLARE';
  }

  return schedule;
}

export function getSolWeather(
  sol: number,
  stormSchedule?: CampaignStormSchedule
): SolWeatherInfo {
  const safeSol = Math.max(1, Math.min(30, sol));
  const schedule =
    stormSchedule && Object.keys(stormSchedule).length > 0
      ? stormSchedule
      : DEFAULT_STORM_SCHEDULE;

  const criticalType = schedule[safeSol];

  if (criticalType === 'SOLAR_RADIATION_FLARE') {
    return {
      sol: safeSol,
      type: 'SOLAR_RADIATION_FLARE',
      title: 'Tempestade de Radiação Solar',
      shortBadge: '☢️ Alerta Solar',
      description:
        'Partículas solares de alta energia atingem Marte. Entre no Bunker Blindado antes do impacto!',
      capiAdvice:
        'ALERTA SOLAR CRÍTICO! Desligue disjuntores não essenciais e abrigue-se no Bunker!',
      solarEfficiencyMultiplier: 0.9,
      dailyDustAccumulation: 10,
      isCritical: true,
      isModerateAlert: false,
    };
  }

  if (criticalType === 'GLOBAL_DUST_STORM') {
    return {
      sol: safeSol,
      type: 'GLOBAL_DUST_STORM',
      title: 'Tempestade Global de Poeira',
      shortBadge: '⛈️ Tempestade Crítica',
      description:
        'Tempestade marciana extrema com ventos e poeira espessa! Abrigue-se no Bunker e limpe os painéis depois.',
      capiAdvice:
        'PERIGO! Complete o checklist de tempestade e entre no Bunker Blindado antes que o contador zere!',
      solarEfficiencyMultiplier: 0.18,
      dailyDustAccumulation: 36,
      isCritical: true,
      isModerateAlert: false,
    };
  }

  if (MODERATE_DUST_WIND_SOLS.has(safeSol)) {
    return {
      sol: safeSol,
      type: 'DUST_WIND',
      title: 'Vento de Poeira Fina',
      shortBadge: '🌪️ Vento de Poeira',
      description:
        'Rajadas de vento depositam poeira rápida sobre os painéis solares (-28% de eficiência solar).',
      capiAdvice:
        'Poeira em alta! Limpe os painéis solares no Setor 1 para manter o pico de geração do meio-dia.',
      solarEfficiencyMultiplier: 0.72,
      dailyDustAccumulation: 22,
      isCritical: false,
      isModerateAlert: true,
    };
  }

  return {
    sol: safeSol,
    type: 'CLEAR',
    title: 'Céu Marciano Limpo',
    shortBadge: '☀️ Céu Limpo',
    description:
      'Boa incidência solar (~590 W/m² em Arcadia). Poeira atmosférica moderada se acumulando.',
    capiAdvice:
      'Sol favorável para carregar baterias ao meio-dia! Cuide da estufa, água e comida.',
    solarEfficiencyMultiplier: 1,
    dailyDustAccumulation: 10,
    isCritical: false,
    isModerateAlert: false,
  };
}

/**
 * Calcula a eficiência solar proporcional ao ângulo do Sol no relógio marciano:
 * - Noite (18:00–06:00 / clockMinutes >= 720): 0% (0 W)
 * - Manhã (07:00 / 60m): ~30%
 * - Pico Meio-Dia (11:00–14:30 / 300m–510m): 100%
 * - Entardecer (17:00 / 660m): ~25%
 * Sempre descontando a poeira acumulada e multiplicadores climáticos.
 */
export function computeSolarEfficiency(
  clockMinutes: number,
  panelDustPct: number,
  weatherType: SurvivalWeatherType,
  stormActive = false
): {
  angleFactor: number;
  anglePct: number;
  effectivePct: number;
  outputWatts: number;
} {
  // Noite marciana (18:00 até 02:00+): 0 W
  if (clockMinutes >= 720 || clockMinutes < 0) {
    return {
      angleFactor: 0,
      anglePct: 0,
      effectivePct: 0,
      outputWatts: 0,
    };
  }

  let angleFactor = 0;
  if (clockMinutes < 60) {
    // 06:00 (0m) -> 07:00 (60m): 0.12 -> 0.30
    angleFactor = 0.12 + (clockMinutes / 60) * 0.18;
  } else if (clockMinutes < 300) {
    // 07:00 (60m) -> 11:00 (300m): 0.30 -> 1.00
    angleFactor = 0.3 + ((clockMinutes - 60) / 240) * 0.7;
  } else if (clockMinutes <= 510) {
    // 11:00 (300m) -> 14:30 (510m): pico 100%
    angleFactor = 1.0;
  } else if (clockMinutes < 660) {
    // 14:30 (510m) -> 17:00 (660m): 1.00 -> 0.25
    angleFactor = 1.0 - ((clockMinutes - 510) / 150) * 0.75;
  } else {
    // 17:00 (660m) -> 18:00 (720m): 0.25 -> 0.00
    angleFactor = Math.max(0, 0.25 * (1 - (clockMinutes - 660) / 60));
  }

  const weatherFactor = stormActive
    ? 0.14
    : weatherType === 'GLOBAL_DUST_STORM'
    ? 0.22
    : weatherType === 'DUST_WIND'
    ? 0.72
    : weatherType === 'SOLAR_RADIATION_FLARE'
    ? 0.9
    : 1.0;

  const dustFactor = Math.max(0.15, 1 - (panelDustPct / 100) * 0.85);
  const effectiveFactor = Math.max(0, Math.min(1, angleFactor * weatherFactor * dustFactor));

  return {
    angleFactor,
    anglePct: Math.round(angleFactor * 100),
    effectivePct: Math.round(effectiveFactor * 100),
    outputWatts: Math.round(480 * effectiveFactor),
  };
}

/**
 * Aviso antecipado de tempestades:
 * Com Radar Orbital LIGADO, avisa com até 2 Sols de antecedência.
 * Com Radar Orbital DESLIGADO, avisa apenas no próprio Sol / janela reduzida (1 Sol máx com baixa antecedência).
 */
export function getNextSolEarlyWarning(
  currentSol: number,
  stormSchedule?: CampaignStormSchedule,
  radarActive = true
): (SolWeatherInfo & { solsAhead: number }) | null {
  if (currentSol >= 30) return null;
  const maxLookahead = radarActive ? 2 : 1;

  for (let offset = 1; offset <= maxLookahead; offset++) {
    const candidateSol = currentSol + offset;
    if (candidateSol > 30) break;
    const candidate = getSolWeather(candidateSol, stormSchedule);
    if (candidate.isCritical || (radarActive && offset === 1 && candidate.isModerateAlert)) {
      return { ...candidate, solsAhead: offset };
    }
  }
  return null;
}

export function getOrbitalForecast(
  currentSol: number,
  daysAhead = 3,
  stormSchedule?: CampaignStormSchedule
): SolWeatherInfo[] {
  const result: SolWeatherInfo[] = [];
  for (let offset = 1; offset <= daysAhead; offset++) {
    const targetSol = currentSol + offset;
    if (targetSol <= 30) {
      result.push(getSolWeather(targetSol, stormSchedule));
    }
  }
  return result;
}
