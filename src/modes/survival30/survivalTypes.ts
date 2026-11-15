import {
  type CampaignStormSchedule,
  computeSolarEfficiency,
  generateCampaignStormSchedule,
  getSolWeather,
  type SolWeatherInfo,
  type SurvivalWeatherType,
} from './weatherScheduler';

export type GameMode = 'TRAINING' | 'SURVIVAL_30';

export type SurvivalStationId =
  | 'MISSION_1'
  | 'MISSION_2'
  | 'MISSION_3'
  | 'MISSION_4'
  | 'MISSION_5';

export type SurvivalLocation =
  | 'BASE_HUB'
  | 'SOLAR_ARRAY'
  | 'HABITAT'
  | 'ICE_LAB'
  | 'GREENHOUSE'
  | 'BUNKER';

export type SurvivalStatus = 'PLAYING' | 'GAME_OVER' | 'VICTORY';

export type SurvivalFailureCause = 'ENERGY' | 'WATER' | 'HEALTH';

export type CrisisType =
  | 'SOLAR_PROTON_SPIKE'
  | 'HABITAT_MICRO_LEAK'
  | 'PANEL_SHORT_CIRCUIT';

export type CropGrowthStage = 'EMPTY' | 'SEED' | 'SPROUT' | 'GROWING' | 'MATURE';

export interface GreenhousePlot {
  id: number;
  cropKey: 'LETTUCE' | 'STRAWBERRY' | 'WHEAT' | 'HERBS';
  stage: CropGrowthStage;
  growthHours: number;
  targetHours: number;
  needsWater: boolean;
}

export interface SurvivalBreakers {
  lifeSupport: true;
  greenhouseLeds: boolean;
  habitatHeater: boolean;
  orbitalRadar: boolean;
}

export type StormEventPhase = 'NONE' | 'PREP_COUNTDOWN' | 'IMPACT' | 'POST_STORM';

export interface SurvivalStormEvent {
  phase: StormEventPhase;
  weatherType: 'GLOBAL_DUST_STORM' | 'SOLAR_RADIATION_FLARE';
  prepSecondsLeft: number;
  impactSecondsLeft: number;
  triggeredOnSol: number | null;
  checklist: {
    hatchesSealed: boolean;
    cropsSecured: boolean;
    breakersRationed: boolean;
    inBunker: boolean;
  };
}

export interface SurvivalResourceAccum {
  energy: number;
  water: number;
  hunger: number;
  thirst: number;
  health: number;
  stamina: number;
  dust: number;
}

export interface ActiveSurvivalCrisis {
  id: string;
  type: CrisisType;
  title: string;
  capiUrgentWarning: string;
  penaltySummary: string;
  actionButtonLabel: string;
  secondsLeft: number;
  totalSeconds: number;
  progress: number;
  requiredSteps: number;
  stationShortcut: SurvivalStationId;
}

export interface SurvivalDailyLog {
  exercised: boolean;
  exerciseCount: number;
  exerciseSummary: string;
  ateMeal: boolean;
  mealKcal: number;
  mealItems: string[];
  mealSummary: string;
  hydratedToday: boolean;
  hydrationMl: number;
  hydrationWaterAfter?: number;
  hydrationSummary: string;
  hygieneCompleted: boolean;
  hygieneSummary: string;
  nightRationFallback: boolean;
  stationOperations: string[];
  stationOpRecords: StationOpDescriptor[];
}

export type StationOpDescriptor =
  | { station: 'MISSION_1' | 'MISSION_3' | 'MISSION_4' | 'MISSION_5' }
  | {
      station: 'MISSION_2';
      exercised: boolean;
      ateMeal: boolean;
      mealKcal: number;
      hydratedToday: boolean;
      hydrationMl: number;
      hygieneCompleted: boolean;
    };

export interface SurvivalStats {
  totalTurnsUsed: number;
  totalMealsConsumed: number;
  totalKcalConsumed: number;
  totalWaterExtracted: number;
  totalWaterMlDrank: number;
  totalHarvests: number;
  cleanPanelsCount: number;
  stormsSurvived: number;
  crisesResolved: number;
  daysExercised: number;
  daysHygieneCompleted: number;
  faintCount: number;
  scienceScore: number;
}

export type NightlyDominoDescriptor =
  | { code: 'PANEL_DUST'; dustPct: number; solarGenerated: number }
  | { code: 'POWER_SAVE' }
  | { code: 'STARVATION' }
  | { code: 'UNTRAINED' }
  | {
      code: 'UNPROTECTED_STORM';
      weatherType: SurvivalWeatherType;
      energyLoss: number;
      healthLoss: number;
    }
  | { code: 'GREENHOUSE_CRASH_FOOD' }
  | { code: 'GREENHOUSE_CRASH_NO_FOOD' }
  | { code: 'DEHYDRATION' }
  | { code: 'FAINTED_0200' };

export interface NightlyReportSummary {
  completedSol: number;
  weather: SolWeatherInfo;
  solarGenerated: number;
  energyConsumed: number;
  waterConsumed: number;
  foodConsumed: number;
  dustAdded: number;
  stormPenaltyApplied: boolean;
  powerSaveTriggered: boolean;
  starvationApplied: boolean;
  dehydrationApplied: boolean;
  greenhouseCrashed: boolean;
  resultingEnergy: number;
  resultingWater: number;
  resultingFood: number;
  resultingHealth: number;
  healthDelta: number;
  resultingStamina: number;
  resultingMaxStamina: number;
  maxStaminaNextSol: number;
  dominoEffects: string[];
  dominoEffectDescriptors: NightlyDominoDescriptor[];
  capiSummary: string;
  dailyLogSnapshot: SurvivalDailyLog;
  sleepMode: 'VOLUNTARY' | 'FAINTED';
}

export type SurvivalNoticeDescriptor =
  | { kind: 'INITIAL' }
  | { kind: 'ZERO_TURNS_LEFT' }
  | { kind: 'FAINTED_0200' }
  | { kind: 'STORM_PREP_STARTED'; weatherType: 'GLOBAL_DUST_STORM' | 'SOLAR_RADIATION_FLARE' }
  | { kind: 'STORM_IMPACT_STARTED'; weatherType: 'GLOBAL_DUST_STORM' | 'SOLAR_RADIATION_FLARE' }
  | { kind: 'STORM_CLEARED' }
  | {
      kind: 'INSUFFICIENT_STAMINA';
      station: SurvivalStationId;
      cost: number;
      current: number;
    }
  | {
      kind: 'INSUFFICIENT_WATER';
      station: SurvivalStationId;
      minWater: number;
      current: number;
    }
  | {
      kind: 'INSUFFICIENT_ENERGY';
      station: SurvivalStationId;
      minEnergy: number;
      current: number;
    }
  | {
      kind: 'STATION_COMPLETE';
      station: SurvivalStationId;
      hasFood?: boolean;
      maxStamina?: number;
    }
  | { kind: 'CRISIS_STARTED'; crisisType: CrisisType }
  | { kind: 'CRISIS_CONTAINED'; crisisType: CrisisType }
  | { kind: 'CRISIS_TIMEOUT'; crisisType: CrisisType }
  | { kind: 'VICTORY' }
  | { kind: 'FAILURE'; cause: SurvivalFailureCause; sol: number }
  | {
      kind: 'NIGHTLY_REPORT';
      report: {
        completedSol: number;
        weatherType: SurvivalWeatherType;
        solarGenerated: number;
        energyConsumed: number;
        waterConsumed: number;
        stormPenaltyApplied: boolean;
        dominoEffectDescriptors: NightlyDominoDescriptor[];
      };
    };

export interface Survival30State {
  sol: number;
  /** Deprecado no modo contínuo (mantido em 4 por compatibilidade visual herdada se necessário) */
  turnsLeft: number;
  /** Minutos marcianos desde as 06:00 (0 = 06:00, 720 = 18:00, 1200 = 02:00) */
  clockMinutes: number;
  clockPaused: boolean;
  fastForward2x: boolean;
  playerLocation: SurvivalLocation;
  safeInsideHabitat: boolean;
  hunger: number;
  thirst: number;
  breakers: SurvivalBreakers;
  stormSchedule: CampaignStormSchedule;
  stormEvent: SurvivalStormEvent;
  faintState: 'NONE' | 'FAINTED_0200';
  lastSleepMode: 'VOLUNTARY' | 'FAINTED';
  greenhousePlots: GreenhousePlot[];
  _accum: SurvivalResourceAccum;
  stamina: number;
  maxStamina: number;
  energy: number;
  water: number;
  foodRations: number;
  health: number;
  panelDustPct: number;
  powerSaveActive: boolean;
  trainedToday: boolean;
  stormProtectedToday: boolean;
  greenhouseInRisk: boolean;
  dominoAlerts: string[];
  activeCrisis: ActiveSurvivalCrisis | null;
  gameStatus: SurvivalStatus;
  gameOverReason: string | null;
  gameOverCause: SurvivalFailureCause | null;
  gameOverSol: number | null;
  stats: SurvivalStats;
  dailyLog: SurvivalDailyLog;
  lastNightlyReport: NightlyReportSummary | null;
  lastActionNotice: string;
  lastNoticeDescriptor: SurvivalNoticeDescriptor;
}

export interface SurvivalActionDetails {
  exerciseCount?: number;
  exercised?: boolean;
  ateMeal?: boolean;
  mealSummary?: string;
  mealKcal?: number;
  mealItems?: string[];
  hydratedToday?: boolean;
  hydrationMl?: number;
  hygieneCompleted?: boolean;
  hygieneSummary?: string;
}

export interface SurvivalStationRule {
  id: SurvivalStationId;
  title: string;
  shortTitle: string;
  costLabel: string;
  rewardLabel: string;
  minStamina: number;
  minWater?: number;
  minEnergy?: number;
}

export const DAY_START_MINUTES = 0; // 06:00
export const DUSK_MINUTES = 720; // 18:00 (12h em 120s -> 6 min/s)
export const NIGHT_END_MINUTES = 1200; // 02:00 (8h em 60s -> 8 min/s)
export const FAINT_WAKE_MINUTES = 180; // 09:00

/**
 * Converte clockMinutes (0 = 06:00, 720 = 18:00, 1200 = 02:00) em string HH:MM.
 */
export function formatMarsClock(clockMinutes: number): string {
  const safe = Math.max(0, Math.floor(clockMinutes));
  const totalMinutesOfDay = (360 + safe) % 1440;
  const hh = Math.floor(totalMinutesOfDay / 60);
  const mm = totalMinutesOfDay % 60;
  const roundedMm = Math.floor(mm / 5) * 5;
  return `${String(hh).padStart(2, '0')}:${String(roundedMm).padStart(2, '0')}`;
}

export function isMarsNight(clockMinutes: number): boolean {
  return clockMinutes >= DUSK_MINUTES;
}

export function isAstronautIndoors(state: Survival30State): boolean {
  return (
    state.safeInsideHabitat ||
    state.playerLocation === 'HABITAT' ||
    state.playerLocation === 'BUNKER' ||
    state.stormEvent.checklist.inBunker
  );
}

export function canFastForwardNight(state: Survival30State): boolean {
  return (
    state.gameStatus === 'PLAYING' &&
    state.faintState === 'NONE' &&
    isMarsNight(state.clockMinutes) &&
    isAstronautIndoors(state) &&
    state.stormEvent.phase === 'NONE'
  );
}

export function getMarsSkyPhase(
  clockMinutes: number
): 'DAWN' | 'MORNING' | 'NOON' | 'DUSK' | 'NIGHT' {
  if (clockMinutes >= DUSK_MINUTES) return 'NIGHT';
  if (clockMinutes < 120) return 'DAWN'; // 06:00–08:00
  if (clockMinutes < 300) return 'MORNING'; // 08:00–11:00
  if (clockMinutes <= 540) return 'NOON'; // 11:00–15:00
  return 'DUSK'; // 15:00–18:00
}

export function getCelestialArcProgress(clockMinutes: number): {
  isNight: boolean;
  progress: number;
} {
  if (clockMinutes < DUSK_MINUTES) {
    return {
      isNight: false,
      progress: Math.max(0, Math.min(1, clockMinutes / DUSK_MINUTES)),
    };
  }
  return {
    isNight: true,
    progress: Math.max(
      0,
      Math.min(1, (clockMinutes - DUSK_MINUTES) / (NIGHT_END_MINUTES - DUSK_MINUTES))
    ),
  };
}

export const SURVIVAL_STATION_RULES: Record<SurvivalStationId, SurvivalStationRule> = {
  MISSION_1: {
    id: 'MISSION_1',
    title: 'Estação 1: Painéis Solares',
    shortTitle: 'Painéis Solares',
    costLabel: '-15% Stamina • Tempo real',
    rewardLabel: 'Zera poeira solar • +10% Energia',
    minStamina: 10,
  },
  MISSION_2: {
    id: 'MISSION_2',
    title: 'Estação 2: Habitat / Saúde',
    shortTitle: 'Habitat & Saúde',
    costLabel: '-1 Ração • -8% Água • -4% Energia',
    rewardLabel: '+65% Fome/Sede • +20% Saúde • +40% Stamina',
    minStamina: 0,
  },
  MISSION_3: {
    id: 'MISSION_3',
    title: 'Estação 3: Jazida de Gelo & Lab',
    shortTitle: 'Gelo & Água',
    costLabel: '-24% Stamina • -12% Energia',
    rewardLabel: '+28% Água Potável na base',
    minStamina: 18,
    minEnergy: 12,
  },
  MISSION_4: {
    id: 'MISSION_4',
    title: 'Estufa ECLSS (Crescimento 2-3 Sols)',
    shortTitle: 'Estufa Hidropônica',
    costLabel: '-14% Stamina • -12% Água • -6% Energia',
    rewardLabel: 'Planta, rega ou colhe +2 Rações',
    minStamina: 10,
    minWater: 12,
    minEnergy: 6,
  },
  MISSION_5: {
    id: 'MISSION_5',
    title: 'Estação 5: Bunker & Vedação',
    shortTitle: 'Bunker & Proteção',
    costLabel: '-10% Stamina • -5% Energia',
    rewardLabel: 'Veda escotilhas / Abrigo blindado',
    minStamina: 5,
    minEnergy: 5,
  },
};

export function createInitialGreenhousePlots(): GreenhousePlot[] {
  return [
    {
      id: 1,
      cropKey: 'LETTUCE',
      stage: 'GROWING',
      growthHours: 24,
      targetHours: 42, // ~2.1 Sols totais (0.9 Sol restante)
      needsWater: false,
    },
    {
      id: 2,
      cropKey: 'STRAWBERRY',
      stage: 'SPROUT',
      growthHours: 14,
      targetHours: 48, // ~2.4 Sols
      needsWater: false,
    },
    {
      id: 3,
      cropKey: 'WHEAT',
      stage: 'SEED',
      growthHours: 4,
      targetHours: 52, // ~2.6 Sols
      needsWater: false,
    },
    {
      id: 4,
      cropKey: 'HERBS',
      stage: 'EMPTY',
      growthHours: 0,
      targetHours: 40,
      needsWater: false,
    },
  ];
}

export function createIdleStormEvent(): SurvivalStormEvent {
  return {
    phase: 'NONE',
    weatherType: 'GLOBAL_DUST_STORM',
    prepSecondsLeft: 0,
    impactSecondsLeft: 0,
    triggeredOnSol: null,
    checklist: {
      hatchesSealed: false,
      cropsSecured: false,
      breakersRationed: false,
      inBunker: false,
    },
  };
}

export function createEmptyDailyLog(): SurvivalDailyLog {
  return {
    exercised: false,
    exerciseCount: 0,
    exerciseSummary: 'Nenhum exercício realizado ainda hoje',
    ateMeal: false,
    mealKcal: 0,
    mealItems: [],
    mealSummary: 'Nenhuma refeição preparada ainda',
    hydratedToday: false,
    hydrationMl: 0,
    hydrationSummary: 'Hidratação no Habitat pendente',
    hygieneCompleted: false,
    hygieneSummary: 'Higiene e esterilização pendentes',
    nightRationFallback: false,
    stationOperations: [],
    stationOpRecords: [],
  };
}

export function computeDominoAlerts(state: {
  energy: number;
  water: number;
  foodRations: number;
  panelDustPct: number;
  maxStamina: number;
  greenhouseInRisk: boolean;
  hunger?: number;
  thirst?: number;
}): string[] {
  const alerts: string[] = [];
  if ((state.hunger ?? 100) <= 25) {
    alerts.push(`Fome crítica (${Math.round(state.hunger ?? 0)}%): coma no Habitat agora!`);
  }
  if ((state.thirst ?? 100) <= 25) {
    alerts.push(`Sede crítica (${Math.round(state.thirst ?? 0)}%): hidrate-se agora!`);
  }
  if (state.panelDustPct >= 50) {
    alerts.push(`Poeira crítica (${state.panelDustPct}%): rendimento solar derrubado!`);
  }
  if (state.energy < 30 || state.greenhouseInRisk) {
    alerts.push('Energia < 30% → Racionamento urgente nos Disjuntores!');
  }
  if (state.water < 25) {
    alerts.push('Água < 25% → Desidratação e pausa nas plantas!');
  }
  if (state.foodRations <= 0) {
    alerts.push('Estoque ZERO de rações → Colha a Estufa!');
  }
  return alerts;
}

export function createInitialSurvival30State(): Survival30State {
  return {
    sol: 1,
    turnsLeft: 4,
    clockMinutes: 0, // 06:00 AM
    clockPaused: false,
    fastForward2x: false,
    playerLocation: 'BASE_HUB',
    safeInsideHabitat: false,
    hunger: 88,
    thirst: 88,
    breakers: {
      lifeSupport: true,
      greenhouseLeds: true,
      habitatHeater: true,
      orbitalRadar: true,
    },
    stormSchedule: generateCampaignStormSchedule(),
    stormEvent: createIdleStormEvent(),
    faintState: 'NONE',
    lastSleepMode: 'VOLUNTARY',
    greenhousePlots: createInitialGreenhousePlots(),
    _accum: {
      energy: 0,
      water: 0,
      hunger: 0,
      thirst: 0,
      health: 0,
      stamina: 0,
      dust: 0,
    },
    stamina: 100,
    maxStamina: 100,
    energy: 82,
    water: 82,
    foodRations: 4,
    health: 95,
    panelDustPct: 10,
    powerSaveActive: false,
    trainedToday: false,
    stormProtectedToday: false,
    greenhouseInRisk: false,
    dominoAlerts: [],
    activeCrisis: null,
    gameStatus: 'PLAYING',
    gameOverReason: null,
    gameOverCause: null,
    gameOverSol: null,
    stats: {
      totalTurnsUsed: 0,
      totalMealsConsumed: 0,
      totalKcalConsumed: 0,
      totalWaterExtracted: 0,
      totalWaterMlDrank: 0,
      totalHarvests: 0,
      cleanPanelsCount: 0,
      stormsSurvived: 0,
      crisesResolved: 0,
      daysExercised: 0,
      daysHygieneCompleted: 0,
      faintCount: 0,
      scienceScore: 0,
    },
    dailyLog: createEmptyDailyLog(),
    lastNightlyReport: null,
    lastActionNotice:
      'Relógio marciano iniciado às 06:00! Gerencie energia solar, disjuntores à noite, fome, sede e vá dormir antes das 02:00.',
    lastNoticeDescriptor: { kind: 'INITIAL' },
  };
}

/**
 * Normaliza saves antigos ou parciais do Modo Sobrevivência para o motor em tempo real.
 */
export function normalizeSurvival30State(
  raw: Partial<Survival30State> | undefined
): Survival30State {
  const base = createInitialSurvival30State();
  if (!raw) return base;
  return {
    ...base,
    ...raw,
    clockMinutes: typeof raw.clockMinutes === 'number' ? raw.clockMinutes : 0,
    clockPaused: Boolean(raw.clockPaused),
    fastForward2x: Boolean(raw.fastForward2x),
    playerLocation: raw.playerLocation ?? 'BASE_HUB',
    safeInsideHabitat: Boolean(raw.safeInsideHabitat),
    hunger: typeof raw.hunger === 'number' ? raw.hunger : 85,
    thirst: typeof raw.thirst === 'number' ? raw.thirst : 85,
    breakers: {
      lifeSupport: true,
      greenhouseLeds: raw.breakers?.greenhouseLeds ?? true,
      habitatHeater: raw.breakers?.habitatHeater ?? true,
      orbitalRadar: raw.breakers?.orbitalRadar ?? true,
    },
    stormSchedule:
      raw.stormSchedule && Object.keys(raw.stormSchedule).length > 0
        ? raw.stormSchedule
        : base.stormSchedule,
    stormEvent: raw.stormEvent?.phase
      ? raw.stormEvent
      : createIdleStormEvent(),
    faintState: raw.faintState ?? 'NONE',
    lastSleepMode: raw.lastSleepMode ?? 'VOLUNTARY',
    greenhousePlots:
      Array.isArray(raw.greenhousePlots) && raw.greenhousePlots.length > 0
        ? raw.greenhousePlots
        : base.greenhousePlots,
    _accum: raw._accum ?? base._accum,
    stats: {
      ...base.stats,
      ...(raw.stats ?? {}),
      faintCount: raw.stats?.faintCount ?? 0,
    },
    dailyLog: {
      ...createEmptyDailyLog(),
      ...(raw.dailyLog ?? {}),
      stationOperations: raw.dailyLog?.stationOperations ?? [],
      stationOpRecords: raw.dailyLog?.stationOpRecords ?? [],
    },
    lastNoticeDescriptor: raw.lastNoticeDescriptor ?? { kind: 'INITIAL' },
  };
}

const CRISIS_POOL: Array<Omit<ActiveSurvivalCrisis, 'id' | 'secondsLeft' | 'progress'>> = [
  {
    type: 'SOLAR_PROTON_SPIKE',
    title: 'PICO SÚBITO DE RADIAÇÃO SOLAR!',
    capiUrgentWarning:
      'TEMPESTADE DE PRÓTONS DETECTADA EM ÓRBITA! Acione as comportas de chumbo/água AGORA ou corra para o Bunker Blindado antes que o contador zere!',
    penaltySummary: '-24% Saúde • -15% Stamina por exposição aguda',
    actionButtonLabel: '🛡️ FECHAR ESCOTILHA BLINDADA AGORA',
    totalSeconds: 15,
    requiredSteps: 3,
    stationShortcut: 'MISSION_5',
  },
  {
    type: 'HABITAT_MICRO_LEAK',
    title: 'MICRO-VAZAMENTO DE PRESSÃO NO HABITAT!',
    capiUrgentWarning:
      'ALERTA DE DESPRESSURIZAÇÃO! Impacto de micrometeorito abriu fissura no domo! Sele a válvula de contenção imediatamente!',
    penaltySummary: '-18% Energia (aquecimento) • -14% Água • -12% Saúde',
    actionButtonLabel: '🔧 VEDAR FISSURA DO DOMO AGORA',
    totalSeconds: 15,
    requiredSteps: 3,
    stationShortcut: 'MISSION_2',
  },
  {
    type: 'PANEL_SHORT_CIRCUIT',
    title: 'SOBRECARGA E CURTO NOS PAINÉIS SOLARES!',
    capiUrgentWarning:
      'DESCARGA ESTÁTICA DE POEIRA NO BARRAMENTO SOLAR! Desarme o disjuntor de emergência antes que o banco de baterias queime!',
    penaltySummary: '-25% Energia das baterias • +20% Poeira aderida',
    actionButtonLabel: '⚡ DESARMAR DISJUNTOR DE PICO',
    totalSeconds: 14,
    requiredSteps: 3,
    stationShortcut: 'MISSION_1',
  },
];

export function createSurvivalCrisis(
  sol: number,
  preferredType?: CrisisType
): ActiveSurvivalCrisis {
  const weather = getSolWeather(sol);
  const template = preferredType
    ? CRISIS_POOL.find((c) => c.type === preferredType) ?? CRISIS_POOL[0]
    : weather.type === 'SOLAR_RADIATION_FLARE'
    ? CRISIS_POOL[0]
    : weather.type === 'DUST_WIND'
    ? CRISIS_POOL[2]
    : CRISIS_POOL[Math.floor(Math.random() * CRISIS_POOL.length)];

  return {
    ...template,
    id: `crisis_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    secondsLeft: template.totalSeconds,
    progress: 0,
  };
}

export function stepSurvivalCrisisProgress(prev: Survival30State): Survival30State {
  if (!prev.activeCrisis) return prev;
  const nextProgress = prev.activeCrisis.progress + 1;
  if (nextProgress >= prev.activeCrisis.requiredSteps) {
    const containedCrisis = prev.activeCrisis;
    return {
      ...prev,
      activeCrisis: null,
      stormProtectedToday: true,
      stats: {
        ...prev.stats,
        crisesResolved: prev.stats.crisesResolved + 1,
        scienceScore: prev.stats.scienceScore + 30,
      },
      lastActionNotice: `Emergência contida a tempo (${containedCrisis.title})! +30 pts científicos e base preservada.`,
      lastNoticeDescriptor: {
        kind: 'CRISIS_CONTAINED',
        crisisType: containedCrisis.type,
      },
    };
  }
  return {
    ...prev,
    activeCrisis: {
      ...prev.activeCrisis,
      progress: nextProgress,
    },
  };
}

export function resolveSurvivalCrisisTimeout(prev: Survival30State): Survival30State {
  if (!prev.activeCrisis) return prev;
  const failed = prev.activeCrisis;
  let nextEnergy = prev.energy;
  let nextWater = prev.water;
  let nextHealth = prev.health;
  let nextStamina = prev.stamina;
  let nextDust = prev.panelDustPct;

  if (failed.type === 'SOLAR_PROTON_SPIKE') {
    nextHealth = Math.max(0, prev.health - 24);
    nextStamina = Math.max(0, prev.stamina - 15);
  } else if (failed.type === 'HABITAT_MICRO_LEAK') {
    nextEnergy = Math.max(0, prev.energy - 18);
    nextWater = Math.max(0, prev.water - 14);
    nextHealth = Math.max(0, prev.health - 12);
  } else {
    nextEnergy = Math.max(0, prev.energy - 25);
    nextDust = Math.min(100, prev.panelDustPct + 20);
  }

  let gameStatus: SurvivalStatus = prev.gameStatus;
  let gameOverCause: SurvivalFailureCause | null = prev.gameOverCause;
  let gameOverReason: string | null = prev.gameOverReason;
  let gameOverSol: number | null = prev.gameOverSol;

  if (nextEnergy <= 0) {
    gameStatus = 'GAME_OVER';
    gameOverCause = 'ENERGY';
    gameOverReason = `Colapso energético no Sol ${prev.sol}/30 após sobrecarga elétrica.`;
    gameOverSol = prev.sol;
  } else if (nextWater <= 0) {
    gameStatus = 'GAME_OVER';
    gameOverCause = 'WATER';
    gameOverReason = `Colapso hídrico no Sol ${prev.sol}/30 após vazamento no domo.`;
    gameOverSol = prev.sol;
  } else if (nextHealth <= 0) {
    gameStatus = 'GAME_OVER';
    gameOverCause = 'HEALTH';
    gameOverReason = `Colapso médico no Sol ${prev.sol}/30 após emergência sem contenção.`;
    gameOverSol = prev.sol;
  }

  return {
    ...prev,
    energy: nextEnergy,
    water: nextWater,
    health: nextHealth,
    stamina: nextStamina,
    panelDustPct: nextDust,
    activeCrisis: null,
    dominoAlerts: computeDominoAlerts({
      ...prev,
      energy: nextEnergy,
      water: nextWater,
      panelDustPct: nextDust,
    }),
    gameStatus,
    gameOverCause,
    gameOverReason,
    gameOverSol,
    lastActionNotice: `FALHA NA CRISE (${failed.title}): ${failed.penaltySummary}!`,
    lastNoticeDescriptor: {
      kind: 'CRISIS_TIMEOUT',
      crisisType: failed.type,
    },
  };
}

/**
 * Dispara manualmente ou automaticamente o evento de tempestade extrema de 3 fases.
 */
export function startStormPrepEvent(
  prev: Survival30State,
  weatherType: 'GLOBAL_DUST_STORM' | 'SOLAR_RADIATION_FLARE'
): Survival30State {
  const prepSec = prev.breakers.orbitalRadar ? 35 : 20;
  const alreadyBunker = prev.playerLocation === 'BUNKER' || prev.stormEvent.checklist.inBunker;
  return {
    ...prev,
    fastForward2x: false,
    stormEvent: {
      phase: 'PREP_COUNTDOWN',
      weatherType,
      prepSecondsLeft: prepSec,
      impactSecondsLeft: 0,
      triggeredOnSol: prev.sol,
      checklist: {
        hatchesSealed: false,
        cropsSecured: false,
        breakersRationed: !prev.breakers.greenhouseLeds || !prev.breakers.orbitalRadar,
        inBunker: alreadyBunker,
      },
    },
    lastNoticeDescriptor: {
      kind: 'STORM_PREP_STARTED',
      weatherType,
    },
  };
}

/**
 * Avança 1 segundo REAL da simulação contínua de Marte:
 * - Relógio (06:00->18:00 em 120s, 18:00->02:00 em 60s; 2x à noite dentro do Habitat)
 * - Geração solar dinâmica pela posição do Sol menos poeira
 * - Consumo dos disjuntores (Suporte O2, LEDs Estufa, Aquecedor, Radar Orbital)
 * - Fome & Sede contínuas
 * - Crescimento real multi-Sol (2–3 Sols) da estufa
 * - Tempestades extremas em 3 fases & desmaio automático às 02:00
 */
export function tickSurvivalClockSecond(
  prev: Survival30State,
  dtRealSeconds = 1
): Survival30State {
  if (
    prev.gameStatus !== 'PLAYING' ||
    prev.clockPaused ||
    prev.faintState !== 'NONE'
  ) {
    return prev;
  }

  const normalized = normalizeSurvival30State(prev);
  const nightNow = isMarsNight(normalized.clockMinutes);
  const indoors = isAstronautIndoors(normalized);
  const fastForwardActive =
    normalized.fastForward2x && canFastForwardNight(normalized);
  const speed = fastForwardActive ? 2 : 1;
  const effectiveDt = dtRealSeconds * speed;

  // Taxa do relógio: 6 min/s de dia (120s para 12h), 8 min/s à noite (60s para 8h)
  const clockStep = (nightNow ? 8 : 6) * effectiveDt;
  const nextClockMinutes = normalized.clockMinutes + clockStep;

  // Verifica desmaio às 02:00!
  if (nextClockMinutes >= NIGHT_END_MINUTES) {
    return {
      ...normalized,
      clockMinutes: NIGHT_END_MINUTES,
      fastForward2x: false,
      faintState: 'FAINTED_0200',
      lastActionNotice: '02:00 AM! O astronauta desmaiou por exaustão! Resgate da Capi em andamento.',
      lastNoticeDescriptor: { kind: 'FAINTED_0200' },
    };
  }

  const weather = getSolWeather(normalized.sol, normalized.stormSchedule);
  const stormImpacting = normalized.stormEvent.phase === 'IMPACT';
  const solar = computeSolarEfficiency(
    normalized.clockMinutes,
    normalized.panelDustPct,
    weather.type,
    stormImpacting
  );

  // Disjuntores: consumo elétrico por segundo
  const b = normalized.breakers;
  const lifeSupportDrain = 0.17;
  const ledsDrain = b.greenhouseLeds ? (nightNow ? 0.22 : 0.08) : 0;
  const heaterDrain = b.habitatHeater ? (nightNow ? 0.16 : 0.06) : 0;
  const radarDrain = b.orbitalRadar ? 0.09 : 0;
  const totalPowerDrain = lifeSupportDrain + ledsDrain + heaterDrain + radarDrain;

  // Geração solar convertida para %/s (pico 100% -> ~0.58%/s contra ~0.40%/s diurno)
  const solarGainPerSec = solar.effectivePct * 0.0058;
  const netEnergyDelta = (solarGainPerSec - totalPowerDrain) * effectiveDt;

  // Fome e Sede contínuas
  const hungerDrainRate =
    (indoors ? 0.21 : 0.34) + (nightNow && !b.habitatHeater ? 0.16 : 0);
  const thirstDrainRate = indoors ? 0.26 : 0.42;

  const hungerDelta = -hungerDrainRate * effectiveDt;
  const thirstDelta = -thirstDrainRate * effectiveDt;

  // Água da base: reciclagem lenta + irrigação ativa se houver culturas crescendo
  const activePlotsCount = normalized.greenhousePlots.filter(
    (p) => p.stage === 'SEED' || p.stage === 'SPROUT' || p.stage === 'GROWING'
  ).length;
  const waterDrainRate = 0.04 + activePlotsCount * 0.025;
  const waterDelta = -waterDrainRate * effectiveDt;

  // Poeira gradual nos painéis
  const dustGainRate =
    weather.type === 'GLOBAL_DUST_STORM'
      ? 0.28
      : weather.type === 'DUST_WIND'
      ? 0.16
      : 0.05;
  const dustDelta = dustGainRate * effectiveDt;

  // Stamina & Saúde contínuas
  let staminaDelta = indoors
    ? b.habitatHeater
      ? 0.18 * effectiveDt
      : -0.06 * effectiveDt
    : -0.04 * effectiveDt;

  let healthDelta = 0;
  if (normalized.hunger <= 0) healthDelta -= 1.35 * effectiveDt;
  if (normalized.thirst <= 0) healthDelta -= 1.45 * effectiveDt;
  if (nightNow && !b.habitatHeater && indoors) healthDelta -= 0.08 * effectiveDt;

  // Tempestade em 3 fases (automática nos 2-3 Sols críticos após 09:00)
  let nextStormEvent = {
    ...normalized.stormEvent,
    checklist: { ...normalized.stormEvent.checklist },
  };
  let nextNoticeDescriptor = normalized.lastNoticeDescriptor;
  let nextNotice = normalized.lastActionNotice;
  let nextProtected = normalized.stormProtectedToday;
  let extraDust = 0;
  let stormSurvivedInc = 0;

  if (
    weather.isCritical &&
    nextStormEvent.phase === 'NONE' &&
    nextStormEvent.triggeredOnSol !== normalized.sol &&
    nextClockMinutes >= FAINT_WAKE_MINUTES
  ) {
    const stormType =
      weather.type === 'SOLAR_RADIATION_FLARE'
        ? 'SOLAR_RADIATION_FLARE'
        : 'GLOBAL_DUST_STORM';
    const triggered = startStormPrepEvent(normalized, stormType);
    nextStormEvent = triggered.stormEvent;
    nextNoticeDescriptor = triggered.lastNoticeDescriptor;
  } else if (nextStormEvent.phase === 'PREP_COUNTDOWN') {
    const left = Math.max(0, nextStormEvent.prepSecondsLeft - dtRealSeconds);
    // Atualiza checklist se o astronauta estiver no Bunker ou racionalizou disjuntores
    if (normalized.playerLocation === 'BUNKER') {
      nextStormEvent.checklist.inBunker = true;
    }
    if (!b.greenhouseLeds || !b.orbitalRadar) {
      nextStormEvent.checklist.breakersRationed = true;
    }
    if (left <= 0) {
      nextStormEvent = {
        ...nextStormEvent,
        phase: 'IMPACT',
        prepSecondsLeft: 0,
        impactSecondsLeft: 50,
      };
      nextNoticeDescriptor = {
        kind: 'STORM_IMPACT_STARTED',
        weatherType: nextStormEvent.weatherType,
      };
      nextNotice = `IMPACTO DE TEMPESTADE (${weather.title})! Permaneça dentro do Bunker Blindado!`;
    } else {
      nextStormEvent.prepSecondsLeft = left;
    }
  } else if (nextStormEvent.phase === 'IMPACT') {
    const inBunker =
      nextStormEvent.checklist.inBunker || normalized.playerLocation === 'BUNKER';
    if (!inBunker) {
      healthDelta -= 1.65 * dtRealSeconds;
      staminaDelta -= 0.55 * dtRealSeconds;
    }
    const impLeft = Math.max(0, nextStormEvent.impactSecondsLeft - dtRealSeconds);
    if (impLeft <= 0) {
      extraDust =
        nextStormEvent.weatherType === 'GLOBAL_DUST_STORM' ? 48 : 22;
      nextStormEvent = {
        ...nextStormEvent,
        phase: 'POST_STORM',
        impactSecondsLeft: 0,
      };
      nextProtected = inBunker;
      if (inBunker) stormSurvivedInc = 1;
      nextNoticeDescriptor = { kind: 'STORM_CLEARED' };
      nextNotice =
        'Tempestade dissipada! Poeira espessa cobriu os painéis solares — limpe no Setor 1!';
    } else {
      nextStormEvent.impactSecondsLeft = impLeft;
    }
  }

  // Acumuladores fracionários para evitar perda de sub-unidades inteiras
  const acc = { ...normalized._accum };
  const applyFrac = (
    current: number,
    delta: number,
    key: keyof SurvivalResourceAccum,
    min = 0,
    max = 100
  ) => {
    const rawTotal = acc[key] + delta;
    const whole = rawTotal >= 0 ? Math.floor(rawTotal) : Math.ceil(rawTotal);
    acc[key] = rawTotal - whole;
    return Math.max(min, Math.min(max, current + whole));
  };

  const nextEnergy = applyFrac(normalized.energy, netEnergyDelta, 'energy');
  const nextWater = applyFrac(normalized.water, waterDelta, 'water');
  const nextHunger = applyFrac(normalized.hunger, hungerDelta, 'hunger');
  const nextThirst = applyFrac(normalized.thirst, thirstDelta, 'thirst');
  const nextHealth = applyFrac(normalized.health, healthDelta, 'health');
  const nextStamina = applyFrac(
    normalized.stamina,
    staminaDelta,
    'stamina',
    0,
    normalized.maxStamina
  );
  const nextDust = Math.min(
    100,
    applyFrac(normalized.panelDustPct, dustDelta + extraDust, 'dust')
  );

  // Crescimento multi-Sol da Estufa (2 a 3 Sols reais)
  const canGrowCrops = normalized.water > 10 && (!nightNow || b.greenhouseLeds);
  const growthHoursStep = canGrowCrops ? clockStep / 60 : 0;
  const nextPlots: GreenhousePlot[] = normalized.greenhousePlots.map((plot) => {
    if (plot.stage === 'EMPTY' || plot.stage === 'MATURE' || growthHoursStep <= 0) {
      return plot;
    }
    const nextHours = Math.min(plot.targetHours, plot.growthHours + growthHoursStep);
    const pct = nextHours / Math.max(1, plot.targetHours);
    let nextStage: CropGrowthStage = plot.stage;
    if (pct >= 1) nextStage = 'MATURE';
    else if (pct >= 0.55) nextStage = 'GROWING';
    else if (pct >= 0.2) nextStage = 'SPROUT';
    else nextStage = 'SEED';

    return {
      ...plot,
      growthHours: nextHours,
      stage: nextStage,
    };
  });

  // Checagem de Game Over contínuo
  let gameStatus: SurvivalStatus = normalized.gameStatus;
  let gameOverCause: SurvivalFailureCause | null = null;
  let gameOverReason: string | null = null;
  let gameOverSol: number | null = null;

  if (nextEnergy <= 0) {
    gameStatus = 'GAME_OVER';
    gameOverCause = 'ENERGY';
    gameOverReason = `Colapso energético no Sol ${normalized.sol}/30! As baterias zeraram e o suporte de vida parou.`;
    gameOverSol = normalized.sol;
    nextNoticeDescriptor = { kind: 'FAILURE', cause: 'ENERGY', sol: normalized.sol };
  } else if (nextWater <= 0) {
    gameStatus = 'GAME_OVER';
    gameOverCause = 'WATER';
    gameOverReason = `Colapso hídrico no Sol ${normalized.sol}/30! Os reservatórios de água secaram.`;
    gameOverSol = normalized.sol;
    nextNoticeDescriptor = { kind: 'FAILURE', cause: 'WATER', sol: normalized.sol };
  } else if (nextHealth <= 0) {
    gameStatus = 'GAME_OVER';
    gameOverCause = 'HEALTH';
    gameOverReason = `Colapso médico no Sol ${normalized.sol}/30 por fome, desidratação ou tempestade sem abrigo.`;
    gameOverSol = normalized.sol;
    nextNoticeDescriptor = { kind: 'FAILURE', cause: 'HEALTH', sol: normalized.sol };
  }

  return {
    ...normalized,
    clockMinutes: nextClockMinutes,
    fastForward2x: fastForwardActive,
    energy: nextEnergy,
    water: nextWater,
    hunger: nextHunger,
    thirst: nextThirst,
    health: nextHealth,
    stamina: nextStamina,
    panelDustPct: nextDust,
    stormProtectedToday: nextProtected,
    stormEvent: nextStormEvent,
    greenhousePlots: nextPlots,
    _accum: acc,
    greenhouseInRisk: nextEnergy < 30 || !b.greenhouseLeds,
    dominoAlerts: computeDominoAlerts({
      energy: nextEnergy,
      water: nextWater,
      foodRations: normalized.foodRations,
      panelDustPct: nextDust,
      maxStamina: normalized.maxStamina,
      greenhouseInRisk: nextEnergy < 30,
      hunger: nextHunger,
      thirst: nextThirst,
    }),
    stats: {
      ...normalized.stats,
      stormsSurvived: normalized.stats.stormsSurvived + stormSurvivedInc,
    },
    gameStatus,
    gameOverCause,
    gameOverReason,
    gameOverSol,
    lastActionNotice: nextNotice,
    lastNoticeDescriptor: nextNoticeDescriptor,
  };
}

/**
 * Executa uma ação operacional em qualquer uma das 5 estações (tempo contínuo, sem bloqueio por turnos).
 */
export function applySurvivalStationCompletion(
  prev: Survival30State,
  station: SurvivalStationId,
  details?: SurvivalActionDetails
): Survival30State {
  if (prev.gameStatus !== 'PLAYING') return prev;
  const normalized = normalizeSurvival30State(prev);
  const rule = SURVIVAL_STATION_RULES[station];

  if (normalized.stamina < rule.minStamina) {
    return {
      ...normalized,
      lastActionNotice: `Stamina insuficiente (${normalized.stamina}%) para operar ${rule.shortTitle}! Coma ou descanse no Habitat.`,
      lastNoticeDescriptor: {
        kind: 'INSUFFICIENT_STAMINA',
        station,
        cost: rule.minStamina,
        current: normalized.stamina,
      },
    };
  }
  if (rule.minWater && normalized.water < rule.minWater) {
    return {
      ...normalized,
      lastActionNotice: `Água insuficiente (${normalized.water}%)! Perfure gelo na Estação 3.`,
      lastNoticeDescriptor: {
        kind: 'INSUFFICIENT_WATER',
        station,
        minWater: rule.minWater,
        current: normalized.water,
      },
    };
  }
  if (rule.minEnergy && normalized.energy < rule.minEnergy) {
    return {
      ...normalized,
      lastActionNotice: `Energia baixa demais (${normalized.energy}%)! Limpe os painéis ou ajuste os Disjuntores.`,
      lastNoticeDescriptor: {
        kind: 'INSUFFICIENT_ENERGY',
        station,
        minEnergy: rule.minEnergy,
        current: normalized.energy,
      },
    };
  }

  let nextStamina = normalized.stamina;
  let nextMaxStamina = normalized.maxStamina;
  let nextEnergy = normalized.energy;
  let nextWater = normalized.water;
  let nextFood = normalized.foodRations;
  let nextHealth = normalized.health;
  let nextHunger = normalized.hunger;
  let nextThirst = normalized.thirst;
  let nextDust = normalized.panelDustPct;
  let nextTrained = normalized.trainedToday;
  let nextStormProtected = normalized.stormProtectedToday;
  const nextStats = { ...normalized.stats, totalTurnsUsed: normalized.stats.totalTurnsUsed + 1 };
  const nextDailyLog: SurvivalDailyLog = {
    ...createEmptyDailyLog(),
    ...normalized.dailyLog,
    stationOperations: [...normalized.dailyLog.stationOperations],
    stationOpRecords: [...(normalized.dailyLog.stationOpRecords ?? [])],
  };
  let nextStormEvent = {
    ...normalized.stormEvent,
    checklist: { ...normalized.stormEvent.checklist },
  };
  let notice = '';
  let noticeDescriptor: SurvivalNoticeDescriptor = { kind: 'STATION_COMPLETE', station };

  switch (station) {
    case 'MISSION_1': {
      nextStamina = Math.max(0, nextStamina - 15);
      nextDust = 0;
      nextEnergy = Math.min(100, nextEnergy + 10);
      nextStats.cleanPanelsCount += 1;
      nextStats.scienceScore += 15;
      if (nextStormEvent.phase === 'POST_STORM') {
        nextStormEvent = createIdleStormEvent();
      }
      nextDailyLog.stationOperations.push('Painéis Solares limpos (0% poeira)');
      nextDailyLog.stationOpRecords.push({ station: 'MISSION_1' });
      notice = 'Painéis Solares limpos (0% poeira) e +10% de carga recuperada!';
      break;
    }

    case 'MISSION_2': {
      const hasFood = details?.ateMeal !== false && normalized.foodRations > 0;
      const didExercise = Boolean(
        details?.exercised || (details?.exerciseCount && details.exerciseCount > 0)
      );
      const didHygiene = Boolean(details?.hygieneCompleted);

      if (hasFood) {
        nextFood = Math.max(0, nextFood - 1);
        nextWater = Math.max(0, nextWater - 8);
        nextEnergy = Math.max(0, nextEnergy - 4);
        nextHealth = Math.min(100, nextHealth + 20);
        nextMaxStamina = Math.min(100, nextMaxStamina + 15);
        nextStamina = Math.min(nextMaxStamina, nextStamina + 40);
        nextHunger = Math.min(100, nextHunger + 68);
        nextThirst = Math.min(100, nextThirst + 68);
        nextStats.totalMealsConsumed += 1;
        nextStats.totalKcalConsumed += details?.mealKcal ?? 700;
        nextStats.totalWaterMlDrank += details?.hydrationMl ?? 350;
        notice = `Refeição completa e hidratação no Habitat! Fome/Sede +68%, Saúde +20%.`;
      } else {
        nextWater = Math.max(0, nextWater - 8);
        nextHealth = Math.min(100, nextHealth + 8);
        nextStamina = Math.min(nextMaxStamina, nextStamina + 18);
        nextThirst = Math.min(100, nextThirst + 65);
        nextStats.totalWaterMlDrank += details?.hydrationMl ?? 350;
        notice = 'Hidratação no Habitat concluída (0 rações em estoque)! Colha alimentos na Estufa!';
      }

      if (didExercise) {
        nextTrained = true;
        nextDailyLog.exercised = true;
        nextDailyLog.exerciseCount = Math.max(nextDailyLog.exerciseCount, details?.exerciseCount ?? 4);
      }
      nextDailyLog.ateMeal = hasFood;
      nextDailyLog.mealKcal = hasFood ? (details?.mealKcal ?? 700) : 0;
      nextDailyLog.mealItems = hasFood ? (details?.mealItems ?? []) : [];
      if (details?.mealSummary) {
        nextDailyLog.mealSummary = details.mealSummary;
      }
      nextDailyLog.hydratedToday = true;
      nextDailyLog.hydrationMl = details?.hydrationMl ?? 350;
      nextDailyLog.hydrationWaterAfter = nextWater;
      if (didHygiene) {
        nextDailyLog.hygieneCompleted = true;
        if (details?.hygieneSummary) {
          nextDailyLog.hygieneSummary = details.hygieneSummary;
        }
      }
      nextDailyLog.stationOpRecords.push({
        station: 'MISSION_2',
        exercised: nextDailyLog.exercised,
        ateMeal: nextDailyLog.ateMeal,
        mealKcal: nextDailyLog.mealKcal,
        hydratedToday: true,
        hydrationMl: nextDailyLog.hydrationMl,
        hygieneCompleted: nextDailyLog.hygieneCompleted,
      });
      nextStats.scienceScore += 15;
      noticeDescriptor = {
        kind: 'STATION_COMPLETE',
        station: 'MISSION_2',
        hasFood,
        maxStamina: nextMaxStamina,
      };
      break;
    }

    case 'MISSION_3': {
      nextStamina = Math.max(0, nextStamina - 24);
      nextEnergy = Math.max(0, nextEnergy - 12);
      nextWater = Math.min(100, nextWater + 28);
      nextStats.totalWaterExtracted += 28;
      nextStats.scienceScore += 20;
      nextDailyLog.stationOperations.push('Extração de gelo e filtro UV: +28% Água Potável');
      nextDailyLog.stationOpRecords.push({ station: 'MISSION_3' });
      notice = '+28% de Água Potável bombeada dos depósitos de gelo para a base!';
      break;
    }

    case 'MISSION_4': {
      nextStamina = Math.max(0, nextStamina - 14);
      nextWater = Math.max(0, nextWater - 10);
      nextEnergy = Math.max(0, nextEnergy - 6);
      nextHealth = Math.min(100, nextHealth + 8);
      // Além dos plots contínuos, concluir o manejo de estufa garante nutrição/O2 ou colhe maduras
      const matureCount = normalized.greenhousePlots.filter((p) => p.stage === 'MATURE').length;
      const harvestGain = Math.max(2, matureCount * 2);
      nextFood += harvestGain;
      nextStats.totalHarvests += harvestGain;
      nextStats.scienceScore += 20;
      nextStormEvent.checklist.cropsSecured = true;
      nextDailyLog.stationOperations.push(
        `Estufa ECLSS: manejo e colheita (+${harvestGain} Rações, +8% O₂/Saúde)`
      );
      nextDailyLog.stationOpRecords.push({ station: 'MISSION_4' });
      notice = `Estufa cuidada! +${harvestGain} Rações e +8% Saúde (O₂) registrados.`;
      break;
    }

    case 'MISSION_5': {
      nextStamina = Math.max(0, nextStamina - 10);
      nextEnergy = Math.max(0, nextEnergy - 5);
      nextStormProtected = true;
      nextDust = Math.max(0, nextDust - 10);
      nextStormEvent.checklist.hatchesSealed = true;
      nextStormEvent.checklist.inBunker = true;
      nextStats.scienceScore += 25;
      nextDailyLog.stationOperations.push('Escotilhas vedadas & Bunker Blindado ativado');
      nextDailyLog.stationOpRecords.push({ station: 'MISSION_5' });
      notice = 'Base vedada e protocolo do Bunker Blindado concluído!';
      break;
    }
  }

  return {
    ...normalized,
    stamina: nextStamina,
    maxStamina: nextMaxStamina,
    energy: nextEnergy,
    water: nextWater,
    foodRations: nextFood,
    health: nextHealth,
    hunger: nextHunger,
    thirst: nextThirst,
    panelDustPct: nextDust,
    trainedToday: nextTrained,
    stormProtectedToday: nextStormProtected,
    stormEvent: nextStormEvent,
    greenhouseInRisk: nextEnergy < 30,
    dominoAlerts: computeDominoAlerts({
      energy: nextEnergy,
      water: nextWater,
      foodRations: nextFood,
      panelDustPct: nextDust,
      maxStamina: nextMaxStamina,
      greenhouseInRisk: nextEnergy < 30,
      hunger: nextHunger,
      thirst: nextThirst,
    }),
    stats: nextStats,
    dailyLog: nextDailyLog,
    lastActionNotice: notice,
    lastNoticeDescriptor: noticeDescriptor,
  };
}

/**
 * Planta, rega/acelera ou colhe uma bandeja específica da estufa em tempo real.
 */
export function interactGreenhousePlotAction(
  prev: Survival30State,
  plotId: number
): Survival30State {
  if (prev.gameStatus !== 'PLAYING') return prev;
  const target = prev.greenhousePlots.find((p) => p.id === plotId);
  if (!target) return prev;

  if (target.stage === 'EMPTY') {
    if (prev.water < 5 || prev.stamina < 5) return prev;
    return {
      ...prev,
      water: Math.max(0, prev.water - 5),
      stamina: Math.max(0, prev.stamina - 5),
      greenhousePlots: prev.greenhousePlots.map((p) =>
        p.id === plotId ? { ...p, stage: 'SEED', growthHours: 0 } : p
      ),
      lastActionNotice: 'Nova semente plantada! Crescerá ao longo de ~2,2 Sols.',
    };
  }

  if (target.stage === 'MATURE') {
    const nextStats = {
      ...prev.stats,
      totalHarvests: prev.stats.totalHarvests + 2,
      scienceScore: prev.stats.scienceScore + 15,
    };
    return {
      ...prev,
      foodRations: prev.foodRations + 2,
      health: Math.min(100, prev.health + 6),
      hunger: Math.min(100, prev.hunger + 12),
      stats: nextStats,
      stormEvent: {
        ...prev.stormEvent,
        checklist: { ...prev.stormEvent.checklist, cropsSecured: true },
      },
      greenhousePlots: prev.greenhousePlots.map((p) =>
        p.id === plotId ? { ...p, stage: 'SEED', growthHours: 2 } : p
      ),
      lastActionNotice: 'Colheita madura recolhida! +2 Rações frescas e bandeja replantada!',
    };
  }

  // Rega e impulsiona crescimento de brotos/plantas em desenvolvimento
  if (prev.water < 6 || prev.stamina < 6) return prev;
  return {
    ...prev,
    water: Math.max(0, prev.water - 6),
    stamina: Math.max(0, prev.stamina - 6),
    greenhousePlots: prev.greenhousePlots.map((p) => {
      if (p.id !== plotId) return p;
      const boosted = Math.min(p.targetHours, p.growthHours + 6);
      const pct = boosted / Math.max(1, p.targetHours);
      const nextStage: CropGrowthStage =
        pct >= 1 ? 'MATURE' : pct >= 0.55 ? 'GROWING' : pct >= 0.2 ? 'SPROUT' : 'SEED';
      return { ...p, growthHours: boosted, stage: nextStage };
    }),
    lastActionNotice: 'Névoa nutritiva aplicada na bandeja! (+6h de crescimento vegetal)',
  };
}

/**
 * Avança de um Sol para o seguinte:
 * - VOLUNTARY (dormir antes das 02:00): recupera 100% Stamina, +15% Saúde, acorda às 06:00.
 * - FAINTED (desmaiar às 02:00): penalidade -25% Saúde, acorda tarde às 09:00 com apenas 40% Stamina.
 */
export function resolveNightlySolTransition(
  prev: Survival30State,
  mode: 'VOLUNTARY' | 'FAINTED' = 'VOLUNTARY'
): Survival30State {
  if (prev.gameStatus !== 'PLAYING') return prev;
  const normalized = normalizeSurvival30State(prev);
  const weather = getSolWeather(normalized.sol, normalized.stormSchedule);
  const descriptors: NightlyDominoDescriptor[] = [];
  const dominoEffects: string[] = [];

  let nextHealth = normalized.health;
  let nextStamina = normalized.stamina;
  let nextMaxStamina = normalized.maxStamina;
  let nextEnergy = normalized.energy;
  let nextWater = normalized.water;
  let nextFood = normalized.foodRations;

  if (mode === 'FAINTED') {
    nextHealth = Math.max(0, nextHealth - 25);
    nextStamina = 40;
    descriptors.push({ code: 'FAINTED_0200' });
    dominoEffects.push(
      'Desmaio às 02:00 AM! Resgate de emergência da Capi: -25% Saúde, acordou às 09:00 com 40% Stamina.'
    );
  } else {
    nextHealth = Math.min(100, nextHealth + 15);
    nextMaxStamina = 100;
    nextStamina = 100;
  }

  // Avanço noturno leve da estufa se LEDs permanecerem ligados até o amanhecer
  const overnightGrowthHours = normalized.breakers.greenhouseLeds && nextWater > 15 ? 4 : 0;
  const nextPlots = normalized.greenhousePlots.map((p) => {
    if (p.stage === 'EMPTY' || p.stage === 'MATURE' || overnightGrowthHours <= 0) return p;
    const h = Math.min(p.targetHours, p.growthHours + overnightGrowthHours);
    const pct = h / Math.max(1, p.targetHours);
    const stage: CropGrowthStage =
      pct >= 1 ? 'MATURE' : pct >= 0.55 ? 'GROWING' : pct >= 0.2 ? 'SPROUT' : 'SEED';
    return { ...p, growthHours: h, stage };
  });

  // Consome energia noturna residual apenas se dormir bem cedo
  const remainingHours = Math.max(0, (NIGHT_END_MINUTES - normalized.clockMinutes) / 60);
  const sleepPowerDrain = Math.round(
    remainingHours *
      (normalized.breakers.greenhouseLeds ? 1.5 : 0.7) *
      (normalized.breakers.habitatHeater ? 1.3 : 0.8)
  );
  nextEnergy = Math.max(0, nextEnergy - sleepPowerDrain);
  nextWater = Math.max(0, nextWater - 4);

  const dailyLogSnapshot: SurvivalDailyLog = {
    ...createEmptyDailyLog(),
    ...normalized.dailyLog,
  };

  if (normalized.dailyLog.exercised) {
    normalized.stats.daysExercised += 1;
  }
  if (normalized.dailyLog.hygieneCompleted) {
    normalized.stats.daysHygieneCompleted += 1;
  }

  const report: NightlyReportSummary = {
    completedSol: normalized.sol,
    weather,
    solarGenerated: Math.round(
      computeSolarEfficiency(360, normalized.panelDustPct, weather.type).effectivePct
    ),
    energyConsumed: sleepPowerDrain,
    waterConsumed: 4,
    foodConsumed: 0,
    dustAdded: 4,
    stormPenaltyApplied: false,
    powerSaveTriggered: !normalized.breakers.habitatHeater,
    starvationApplied: normalized.hunger <= 0,
    dehydrationApplied: normalized.thirst <= 0,
    greenhouseCrashed: !normalized.breakers.greenhouseLeds,
    resultingEnergy: nextEnergy,
    resultingWater: nextWater,
    resultingFood: nextFood,
    resultingHealth: nextHealth,
    healthDelta: nextHealth - normalized.health,
    resultingStamina: nextStamina,
    resultingMaxStamina: nextMaxStamina,
    maxStaminaNextSol: nextMaxStamina,
    dominoEffects,
    dominoEffectDescriptors: descriptors,
    capiSummary:
      mode === 'FAINTED'
        ? `Resgate de emergência concluído! Você acordou tarde às 09:00 no Sol ${normalized.sol + 1}.`
        : `Bom dia, Comandante! Sono restaurador 100%: +15% Saúde e 100% Stamina às 06:00!`,
    dailyLogSnapshot,
    sleepMode: mode,
  };

  if (nextEnergy <= 0 || nextWater <= 0 || nextHealth <= 0) {
    const cause: SurvivalFailureCause =
      nextEnergy <= 0 ? 'ENERGY' : nextWater <= 0 ? 'WATER' : 'HEALTH';
    return {
      ...normalized,
      energy: nextEnergy,
      water: nextWater,
      health: nextHealth,
      stamina: nextStamina,
      faintState: 'NONE',
      lastSleepMode: mode,
      gameStatus: 'GAME_OVER',
      gameOverCause: cause,
      gameOverReason: `Colapso ao encerrar o Sol ${normalized.sol}/30.`,
      gameOverSol: normalized.sol,
      lastNightlyReport: report,
      lastNoticeDescriptor: { kind: 'FAILURE', cause, sol: normalized.sol },
    };
  }

  if (normalized.sol >= 30) {
    return {
      ...normalized,
      energy: nextEnergy,
      water: nextWater,
      health: nextHealth,
      stamina: 100,
      faintState: 'NONE',
      lastSleepMode: mode,
      gameStatus: 'VICTORY',
      stats: {
        ...normalized.stats,
        scienceScore: normalized.stats.scienceScore + 250,
      },
      lastNightlyReport: report,
      lastActionNotice: 'Parabéns! Você sobreviveu todos os 30 Sols contínuos em Arcadia Planitia!',
      lastNoticeDescriptor: { kind: 'VICTORY' },
    };
  }

  return {
    ...normalized,
    sol: normalized.sol + 1,
    clockMinutes: mode === 'FAINTED' ? FAINT_WAKE_MINUTES : DAY_START_MINUTES,
    clockPaused: false,
    fastForward2x: false,
    faintState: 'NONE',
    lastSleepMode: mode,
    playerLocation: 'HABITAT',
    safeInsideHabitat: true,
    energy: nextEnergy,
    water: nextWater,
    foodRations: nextFood,
    health: nextHealth,
    stamina: nextStamina,
    maxStamina: nextMaxStamina,
    hunger: Math.max(mode === 'FAINTED' ? 35 : 55, normalized.hunger - 12),
    thirst: Math.max(mode === 'FAINTED' ? 35 : 55, normalized.thirst - 14),
    panelDustPct: Math.min(100, normalized.panelDustPct + 4),
    trainedToday: false,
    stormProtectedToday: false,
    stormEvent:
      normalized.stormEvent.phase === 'POST_STORM'
        ? normalized.stormEvent
        : createIdleStormEvent(),
    greenhousePlots: nextPlots,
    stats: {
      ...normalized.stats,
      faintCount: normalized.stats.faintCount + (mode === 'FAINTED' ? 1 : 0),
    },
    dailyLog: createEmptyDailyLog(),
    lastNightlyReport: report,
    lastActionNotice: report.capiSummary,
    lastNoticeDescriptor: {
      kind: 'NIGHTLY_REPORT',
      report: {
        completedSol: report.completedSol,
        weatherType: weather.type,
        solarGenerated: report.solarGenerated,
        energyConsumed: report.energyConsumed,
        waterConsumed: report.waterConsumed,
        stormPenaltyApplied: false,
        dominoEffectDescriptors: descriptors,
      },
    },
  };
}
