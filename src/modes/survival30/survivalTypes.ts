import {
  getSolWeather,
  type SolWeatherInfo,
} from './weatherScheduler';

export type GameMode = 'TRAINING' | 'SURVIVAL_30';

export type SurvivalStationId =
  | 'MISSION_1'
  | 'MISSION_2'
  | 'MISSION_3'
  | 'MISSION_4'
  | 'MISSION_5';

export type SurvivalStatus = 'PLAYING' | 'GAME_OVER' | 'VICTORY';

export type CrisisType =
  | 'SOLAR_PROTON_SPIKE'
  | 'HABITAT_MICRO_LEAK'
  | 'PANEL_SHORT_CIRCUIT';

export interface ActiveSurvivalCrisis {
  id: string;
  type: CrisisType;
  title: string;
  capiUrgentWarning: string;
  secondsTotal: number;
  secondsLeft: number;
  penaltySummary: string;
  actionButtonLabel: string;
  progress: number;
  requiredProgress: number;
  stationShortcut: 'MISSION_1' | 'MISSION_5';
}

export interface SurvivalDailyLog {
  exercised: boolean;
  exerciseCount: number;
  exerciseSummary: string;
  ateMeal: boolean;
  mealKcal: number;
  mealSummary: string;
  hydratedToday: boolean;
  hydrationMl: number;
  hydrationSummary: string;
  hygieneCompleted: boolean;
  hygieneSummary: string;
  stationOperations: string[];
}

export interface SurvivalActionDetails {
  exercised?: boolean;
  exerciseCount?: number;
  exerciseSummary?: string;
  ateMeal?: boolean;
  mealKcal?: number;
  mealSummary?: string;
  hydrationMl?: number;
  hydrationSummary?: string;
  hygieneCompleted?: boolean;
  hygieneSummary?: string;
  operationSummary?: string;
}

export function createEmptyDailyLog(): SurvivalDailyLog {
  return {
    exercised: false,
    exerciseCount: 0,
    exerciseSummary: 'Nenhum exercício realizado hoje — queda de condicionamento',
    ateMeal: false,
    mealKcal: 0,
    mealSummary: 'Sem alimentação hoje — déficit energético',
    hydratedToday: false,
    hydrationMl: 0,
    hydrationSummary: 'Hidratação insuficiente hoje',
    hygieneCompleted: false,
    hygieneSummary: 'Higiene pendente — acúmulo de poeira',
    stationOperations: [],
  };
}

export interface SurvivalStats {
  totalWaterExtracted: number;
  totalHarvests: number;
  stormsSurvived: number;
  scienceScore: number;
  cleanPanelsCount: number;
  crisesResolved: number;
  crisesFailed: number;
  totalTurnsUsed: number;
  totalMealsConsumed: number;
  totalKcalConsumed: number;
  totalWaterMlDrank: number;
  daysExercised: number;
  daysHygieneCompleted: number;
}

export interface NightlyReportSummary {
  completedSol: number;
  weather: SolWeatherInfo;
  solarGenerated: number;
  energyConsumed: number;
  waterConsumed: number;
  foodConsumed: number;
  healthDelta: number;
  dustAdded: number;
  stormPenaltyApplied: boolean;
  starvationApplied: boolean;
  untrainedPenaltyApplied: boolean;
  dominoEffects: string[];
  maxStaminaNextSol: number;
  resultingEnergy: number;
  resultingWater: number;
  resultingHealth: number;
  resultingFood: number;
  capiSummary: string;
  dailyLogSnapshot: SurvivalDailyLog;
}

export interface Survival30State {
  sol: number;
  turnsLeft: number;
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
  gameOverSol: number | null;
  stats: SurvivalStats;
  dailyLog: SurvivalDailyLog;
  lastNightlyReport: NightlyReportSummary | null;
  lastActionNotice: string | null;
}

export interface SurvivalStationRule {
  id: SurvivalStationId;
  shortName: string;
  costLabel: string;
  rewardLabel: string;
  minStamina: number;
  minWater?: number;
  minEnergy?: number;
}

export const SURVIVAL_STATION_RULES: Record<SurvivalStationId, SurvivalStationRule> = {
  MISSION_1: {
    id: 'MISSION_1',
    shortName: 'Estação 1: Painéis Solares',
    costLabel: '-1 Turno • -20% Stamina',
    rewardLabel: 'Zera poeira solar • +12% Energia',
    minStamina: 20,
  },
  MISSION_2: {
    id: 'MISSION_2',
    shortName: 'Estação 2: Habitat / Saúde',
    costLabel: '-1 Turno • -1 Ração • -12% Água • -6% Energia',
    rewardLabel: '+22% Saúde • +35% Stamina • restaura Teto de Stamina',
    minStamina: 0,
  },
  MISSION_3: {
    id: 'MISSION_3',
    shortName: 'Estação 3: Jazida de Gelo & Lab',
    costLabel: '-1 Turno • -30% Stamina • -14% Energia',
    rewardLabel: '+26% Água Potável na base',
    minStamina: 30,
    minEnergy: 14,
  },
  MISSION_4: {
    id: 'MISSION_4',
    shortName: 'Estufa ECLSS',
    costLabel: '-1 Turno • -20% Stamina • -16% Água • -10% Energia',
    rewardLabel: '+2 Rações de Comida • +8% Saúde (O₂)',
    minStamina: 20,
    minWater: 16,
    minEnergy: 10,
  },
  MISSION_5: {
    id: 'MISSION_5',
    shortName: 'Estação 5: Abrigo & Proteção Ambiental',
    costLabel: '-1 Turno • -15% Stamina • -8% Energia',
    rewardLabel: 'Protege contra Tempestade/Radiação • -10% Poeira nos filtros',
    minStamina: 15,
    minEnergy: 8,
  },
};

export function computeDominoAlerts(state: {
  energy: number;
  water: number;
  foodRations: number;
  panelDustPct: number;
  maxStamina: number;
  greenhouseInRisk: boolean;
}): string[] {
  const alerts: string[] = [];

  if (state.panelDustPct >= 50) {
    alerts.push(
      `Poeira crítica (${state.panelDustPct}%): rendimento solar derrubado para 30%–62%!`
    );
  }
  if (state.energy < 30 || state.greenhouseInRisk) {
    alerts.push(
      'Energia < 30% → Estufa em risco térmico: perda de colheita (-1 ração) e O₂ (-8% saúde) à noite!'
    );
  }
  if (state.water < 25) {
    alerts.push(
      'Água < 25% → Desidratação ativa: penalidade de saúde noturna e queda de Stamina máxima!'
    );
  }
  if (state.foodRations <= 0) {
    alerts.push(
      'Estoque ZERO de rações → Desnutrição trava o teto de Stamina em 65% e drena saúde!'
    );
  } else if (state.maxStamina < 100) {
    alerts.push(
      `Exaustão acumulada: teto de Stamina limitado a ${state.maxStamina}% até descansar e comer no Habitat.`
    );
  }

  return alerts;
}

export function createInitialSurvival30State(): Survival30State {
  const base = {
    energy: 68,
    water: 64,
    foodRations: 2,
    panelDustPct: 35,
    maxStamina: 100,
    greenhouseInRisk: false,
  };

  return {
    sol: 1,
    turnsLeft: 4,
    stamina: 100,
    maxStamina: base.maxStamina,
    energy: base.energy,
    water: base.water,
    foodRations: base.foodRations,
    health: 90,
    panelDustPct: base.panelDustPct,
    powerSaveActive: false,
    trainedToday: false,
    stormProtectedToday: false,
    greenhouseInRisk: base.greenhouseInRisk,
    dominoAlerts: computeDominoAlerts(base),
    activeCrisis: null,
    gameStatus: 'PLAYING',
    gameOverReason: null,
    gameOverSol: null,
    stats: {
      totalWaterExtracted: 0,
      totalHarvests: 0,
      stormsSurvived: 0,
      scienceScore: 0,
      cleanPanelsCount: 0,
      crisesResolved: 0,
      crisesFailed: 0,
      totalTurnsUsed: 0,
      totalMealsConsumed: 0,
      totalKcalConsumed: 0,
      totalWaterMlDrank: 0,
      daysExercised: 0,
      daysHygieneCompleted: 0,
    },
    dailyLog: createEmptyDailyLog(),
    lastNightlyReport: null,
    lastActionNotice:
      'Sobrevivência extrema iniciada: 4 Turnos por Sol não permitem fazer tudo — priorize energia, água e comida sob risco de cascata!',
  };
}

export function clampPct(val: number, max = 100): number {
  return Math.max(0, Math.min(max, Math.round(val)));
}

export function detectResourceFailure(
  energy: number,
  water: number,
  health: number,
  sol: number
): string | null {
  if (energy <= 0) {
    return `Colapso energético no Sol ${sol}/30! As baterias zeraram e o suporte térmico da base desligou.`;
  }
  if (water <= 0) {
    return `Colapso hídrico no Sol ${sol}/30! Os tanques secaram sem reserva suficiente na Estação 3.`;
  }
  if (health <= 0) {
    return `Colapso médico no Sol ${sol}/30! Exaustão severa, desidratação ou exposição sem abrigo vitimou a tripulação.`;
  }
  return null;
}

export function applySurvivalStationCompletion(
  prev: Survival30State,
  station: SurvivalStationId,
  details?: SurvivalActionDetails
): Survival30State {
  let energy = prev.energy;
  let water = prev.water;
  let health = prev.health;
  let stamina = prev.stamina;
  let maxStamina = prev.maxStamina;
  let foodRations = prev.foodRations;
  let panelDustPct = prev.panelDustPct;
  let trainedToday = prev.trainedToday;
  let stormProtectedToday = prev.stormProtectedToday;
  let greenhouseInRisk = prev.greenhouseInRisk;
  let activeCrisis = prev.activeCrisis;
  let stats: SurvivalStats = {
    ...prev.stats,
    totalTurnsUsed: (prev.stats.totalTurnsUsed ?? 0) + 1,
  };
  const dailyLog: SurvivalDailyLog = {
    ...createEmptyDailyLog(),
    ...prev.dailyLog,
    stationOperations: [...(prev.dailyLog?.stationOperations ?? [])],
  };
  let notice = '';

  switch (station) {
    case 'MISSION_1': {
      stamina = clampPct(stamina - 20, maxStamina);
      panelDustPct = 0;
      energy = clampPct(energy + 12);
      if (activeCrisis?.type === 'PANEL_SHORT_CIRCUIT') {
        activeCrisis = null;
        stats.crisesResolved += 1;
        stats.scienceScore += 25;
      }
      stats = {
        ...stats,
        cleanPanelsCount: stats.cleanPanelsCount + 1,
        scienceScore: stats.scienceScore + 25,
      };
      dailyLog.stationOperations.push(
        details?.operationSummary || 'Painéis Solares limpos (0% poeira) • +12% Energia recuperada'
      );
      notice = 'Painéis Solares limpos (0% poeira)! +12% Energia recuperada (-20% Stamina).';
      break;
    }
    case 'MISSION_2': {
      const hasFood = foodRations > 0;
      const didExercise = details?.exercised ?? dailyLog.exercised;
      if (didExercise) {
        trainedToday = true;
        dailyLog.exercised = true;
        dailyLog.exerciseCount = Math.max(1, details?.exerciseCount ?? dailyLog.exerciseCount);
        dailyLog.exerciseSummary =
          details?.exerciseSummary ||
          `Treino gravitacional concluído (${dailyLog.exerciseCount} exercício${dailyLog.exerciseCount > 1 ? 's' : ''})`;
      }

      if (hasFood) {
        foodRations = Math.max(0, foodRations - 1);
        maxStamina = clampPct(maxStamina + 15);
        const mealKcal =
          details?.mealKcal && details.mealKcal > 0
            ? Math.round(details.mealKcal)
            : dailyLog.mealKcal > 0
            ? dailyLog.mealKcal
            : 740;
        dailyLog.ateMeal = true;
        dailyLog.mealKcal = mealKcal;
        dailyLog.mealSummary =
          details?.mealSummary || `Refeição balanceada: ${mealKcal} kcal`;
        stats.totalMealsConsumed = (stats.totalMealsConsumed ?? 0) + 1;
        stats.totalKcalConsumed = (stats.totalKcalConsumed ?? 0) + mealKcal;
      } else {
        dailyLog.ateMeal = false;
        dailyLog.mealKcal = 0;
        dailyLog.mealSummary = 'Sem ração no estoque — déficit energético';
      }

      water = clampPct(water - 12);
      energy = clampPct(energy - 6);
      health = clampPct(health + (hasFood ? 22 : 8));
      stamina = clampPct(stamina + (hasFood ? 35 : 18), maxStamina);

      const resolvedMl =
        details?.hydrationMl && details.hydrationMl > 0
          ? Math.round(details.hydrationMl)
          : dailyLog.hydrationMl > 0
          ? dailyLog.hydrationMl
          : 350;
      if (resolvedMl > 0) {
        dailyLog.hydratedToday = true;
        dailyLog.hydrationMl = resolvedMl;
        dailyLog.hydrationSummary =
          details?.hydrationSummary ||
          `${resolvedMl} ml ingeridos • Reservatório em ${water}%`;
        stats.totalWaterMlDrank = (stats.totalWaterMlDrank ?? 0) + resolvedMl;
      }

      const didHygiene = details?.hygieneCompleted ?? dailyLog.hygieneCompleted;
      if (didHygiene) {
        dailyLog.hygieneCompleted = true;
        dailyLog.hygieneSummary =
          details?.hygieneSummary || 'Ambiente, mãos e luvas esterilizados';
      }

      const opsParts: string[] = [];
      if (dailyLog.exercised) opsParts.push('treino concluído');
      if (dailyLog.ateMeal) opsParts.push(`${dailyLog.mealKcal} kcal`);
      if (dailyLog.hydratedToday) opsParts.push(`${dailyLog.hydrationMl} ml água`);
      if (dailyLog.hygieneCompleted) opsParts.push('higiene esterilizada');
      dailyLog.stationOperations.push(
        details?.operationSummary ||
          `Habitat & Saúde: ${opsParts.length > 0 ? opsParts.join(' • ') : 'descanso operacional'}`
      );

      stats = {
        ...stats,
        scienceScore: stats.scienceScore + 25,
      };
      notice = hasFood
        ? `Turno no Habitat concluído! +22% Saúde, +35% Stamina (Teto: ${maxStamina}%).`
        : 'Turno no Habitat sem ração no estoque: +8% Saúde e +18% Stamina! Priorize a Estufa!';
      break;
    }
    case 'MISSION_3': {
      stamina = clampPct(stamina - 30, maxStamina);
      energy = clampPct(energy - 14);
      water = clampPct(water + 26);
      stats = {
        ...stats,
        totalWaterExtracted: stats.totalWaterExtracted + 26,
        scienceScore: stats.scienceScore + 35,
      };
      dailyLog.stationOperations.push(
        details?.operationSummary ||
          'Perfuração a 2,2 m & filtro UV: +26% Água Potável extraída'
      );
      notice =
        'Perfuração a 2,2 m e filtro UV concluídos! +26% Água Potável (-14% Energia, -30% Stamina).';
      break;
    }
    case 'MISSION_4': {
      stamina = clampPct(stamina - 20, maxStamina);
      water = clampPct(water - 16);
      energy = clampPct(energy - 10);
      foodRations = foodRations + 2;
      health = clampPct(health + 8);
      greenhouseInRisk = energy < 30 || water < 25;
      stats = {
        ...stats,
        totalHarvests: stats.totalHarvests + 2,
        scienceScore: stats.scienceScore + 35,
      };
      dailyLog.stationOperations.push(
        details?.operationSummary ||
          'Estufa ECLSS: névoa nutritiva e colheita (+2 Rações, +8% O₂/Saúde)'
      );
      notice =
        'Colheita ECLSS concluída! +2 Rações estocadas e +8% Saúde (-16% Água, -10% Energia).';
      break;
    }
    case 'MISSION_5': {
      stamina = clampPct(stamina - 15, maxStamina);
      energy = clampPct(energy - 8);
      panelDustPct = clampPct(panelDustPct - 10);
      stormProtectedToday = true;
      if (
        activeCrisis &&
        (activeCrisis.type === 'SOLAR_PROTON_SPIKE' ||
          activeCrisis.type === 'HABITAT_MICRO_LEAK')
      ) {
        activeCrisis = null;
        stats.crisesResolved += 1;
        stats.scienceScore += 25;
      }
      stats = {
        ...stats,
        scienceScore: stats.scienceScore + 45,
      };
      dailyLog.stationOperations.push(
        details?.operationSummary ||
          'Abrigo & Comunicações: base selada contra tempestade e radiação'
      );
      notice =
        'Protocolo de Abrigo & Vedação ativado (-8% Energia)! Base protegida neste Sol.';
      break;
    }
  }

  greenhouseInRisk = energy < 30 || water < 25;
  const nextTurns = Math.max(0, prev.turnsLeft - 1);
  const failureReason = detectResourceFailure(energy, water, health, prev.sol);
  const dominoAlerts = computeDominoAlerts({
    energy,
    water,
    foodRations,
    panelDustPct,
    maxStamina,
    greenhouseInRisk,
  });

  return {
    ...prev,
    turnsLeft: nextTurns,
    stamina,
    maxStamina,
    energy,
    water,
    foodRations,
    health,
    panelDustPct,
    trainedToday,
    stormProtectedToday,
    greenhouseInRisk,
    dominoAlerts,
    activeCrisis,
    dailyLog,
    gameStatus: failureReason ? 'GAME_OVER' : prev.gameStatus,
    gameOverReason: failureReason,
    gameOverSol: failureReason ? prev.sol : null,
    stats,
    lastActionNotice: notice,
  };
}

const CRISIS_BLUEPRINTS: Record<
  CrisisType,
  Omit<ActiveSurvivalCrisis, 'id' | 'secondsLeft' | 'progress'>
> = {
  SOLAR_PROTON_SPIKE: {
    type: 'SOLAR_PROTON_SPIKE',
    title: 'PICO SÚBITO DE RADIAÇÃO SOLAR!',
    capiUrgentWarning:
      'TEMPESTADE DE PRÓTONS DETECTADA EM ÓRBITA! Acione as comportas de chumbo/água AGORA ou corra para o Abrigo Blindado antes que o contador zere!',
    secondsTotal: 12,
    penaltySummary: '-28% Saúde • -15% Stamina por exposição aguda',
    actionButtonLabel: '🛡️ FECHAR ESCOTILHA BLINDADA AGORA',
    requiredProgress: 3,
    stationShortcut: 'MISSION_5',
  },
  HABITAT_MICRO_LEAK: {
    type: 'HABITAT_MICRO_LEAK',
    title: 'MICRO-VAZAMENTO DE PRESSÃO NO HABITAT!',
    capiUrgentWarning:
      'ALERTA DE DESPRESSURIZAÇÃO! Impacto de micrometeorito abriu fissura no domo! Sele a válvula de contenção imediatamente!',
    secondsTotal: 14,
    penaltySummary: '-22% Energia (aquecimento) • -18% Água • -15% Saúde',
    actionButtonLabel: '🔧 VEDAR FISSURA DO DOMO AGORA',
    requiredProgress: 3,
    stationShortcut: 'MISSION_5',
  },
  PANEL_SHORT_CIRCUIT: {
    type: 'PANEL_SHORT_CIRCUIT',
    title: 'SOBRECARGA E CURTO NOS PAINÉIS SOLARES!',
    capiUrgentWarning:
      'DESCARGA ESTÁTICA DE POEIRA NO BARRAMENTO SOLAR! Desarme o disjuntor de emergência antes que o banco de baterias queime!',
    secondsTotal: 13,
    penaltySummary: '-30% Energia das baterias • +25% Poeira aderida',
    actionButtonLabel: '⚡ DESARMAR DISJUNTOR DE PICO',
    requiredProgress: 3,
    stationShortcut: 'MISSION_1',
  },
};

export function createSurvivalCrisis(
  sol: number,
  preferredType?: CrisisType
): ActiveSurvivalCrisis {
  const pool: CrisisType[] = [
    'SOLAR_PROTON_SPIKE',
    'HABITAT_MICRO_LEAK',
    'PANEL_SHORT_CIRCUIT',
  ];
  const chosenType =
    preferredType ?? pool[(sol + Math.floor(Math.random() * pool.length)) % pool.length];
  const blueprint = CRISIS_BLUEPRINTS[chosenType];

  return {
    ...blueprint,
    id: `crisis_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    secondsLeft: blueprint.secondsTotal,
    progress: 0,
  };
}

export function stepSurvivalCrisisProgress(prev: Survival30State): Survival30State {
  if (!prev.activeCrisis) return prev;

  const nextProgress = prev.activeCrisis.progress + 1;
  if (nextProgress < prev.activeCrisis.requiredProgress) {
    return {
      ...prev,
      activeCrisis: {
        ...prev.activeCrisis,
        progress: nextProgress,
      },
    };
  }

  const resolvedTitle = prev.activeCrisis.title;
  return {
    ...prev,
    activeCrisis: null,
    stats: {
      ...prev.stats,
      crisesResolved: prev.stats.crisesResolved + 1,
      scienceScore: prev.stats.scienceScore + 30,
    },
    lastActionNotice: `Emergência contida a tempo (${resolvedTitle})! +30 pts científicos e base preservada.`,
  };
}

export function resolveSurvivalCrisisTimeout(prev: Survival30State): Survival30State {
  if (!prev.activeCrisis) return prev;

  let energy = prev.energy;
  let water = prev.water;
  let health = prev.health;
  let stamina = prev.stamina;
  let maxStamina = prev.maxStamina;
  let panelDustPct = prev.panelDustPct;
  const failedTitle = prev.activeCrisis.title;

  switch (prev.activeCrisis.type) {
    case 'SOLAR_PROTON_SPIKE': {
      health = clampPct(health - 28);
      stamina = clampPct(stamina - 15, maxStamina);
      break;
    }
    case 'HABITAT_MICRO_LEAK': {
      energy = clampPct(energy - 22);
      water = clampPct(water - 18);
      health = clampPct(health - 15);
      break;
    }
    case 'PANEL_SHORT_CIRCUIT': {
      energy = clampPct(energy - 30);
      panelDustPct = clampPct(panelDustPct + 25);
      break;
    }
  }

  const greenhouseInRisk = energy < 30 || water < 25;
  const failureReason = detectResourceFailure(energy, water, health, prev.sol);
  const dominoAlerts = computeDominoAlerts({
    energy,
    water,
    foodRations: prev.foodRations,
    panelDustPct,
    maxStamina,
    greenhouseInRisk,
  });

  return {
    ...prev,
    energy,
    water,
    health,
    stamina,
    maxStamina,
    panelDustPct,
    greenhouseInRisk,
    dominoAlerts,
    activeCrisis: null,
    gameStatus: failureReason ? 'GAME_OVER' : prev.gameStatus,
    gameOverReason: failureReason,
    gameOverSol: failureReason ? prev.sol : null,
    stats: {
      ...prev.stats,
      crisesFailed: prev.stats.crisesFailed + 1,
    },
    lastActionNotice: `FALHA NA CRISE (${failedTitle}): ${prev.activeCrisis.penaltySummary}!`,
  };
}

export function resolveNightlySolTransition(prev: Survival30State): Survival30State {
  const weather = getSolWeather(prev.sol);

  // Efeito Dominó 1: Poeira acumulada derruba drasticamente a eficiência solar
  const cleanFactor =
    prev.panelDustPct >= 60
      ? 0.3
      : prev.panelDustPct >= 35
      ? 0.62
      : prev.panelDustPct <= 15
      ? 1.05
      : 0.85;
  const baseSolar = 22 * weather.solarMultiplier * cleanFactor;
  const economyWeatherGuard = weather.isModerateAlert && prev.powerSaveActive ? 4 : 0;
  const solarGenerated = Math.max(2, Math.round(baseSolar + economyWeatherGuard));

  // Consumo vital noturno mais apertado
  const energyConsumed = prev.powerSaveActive ? 15 : 24;
  const waterConsumed = 16;
  const hasFood = prev.foodRations > 0;
  const foodConsumed = hasFood ? 1 : 0;

  let healthDelta = 0;
  let extraEnergyLoss = 0;
  let nextFood = Math.max(0, prev.foodRations - foodConsumed);
  let nextMaxStamina = 100;
  const dominoEffects: string[] = [];

  if (prev.panelDustPct >= 50) {
    dominoEffects.push(
      `Poeira (${prev.panelDustPct}%) derrubou geração solar para apenas +${solarGenerated}%.`
    );
  }

  // Modo economia noturno economiza energia, mas reduz aquecimento e descanso
  if (prev.powerSaveActive) {
    healthDelta -= 4;
    nextMaxStamina -= 10;
    dominoEffects.push('Modo Economia noturno causou frio na cabine (-4% Saúde, -10% Stamina).');
  }

  // Efeito Dominó 2: Falta de comida derruba saúde e teto de Stamina do próximo Sol
  if (!hasFood) {
    healthDelta -= 22;
    nextMaxStamina = Math.min(nextMaxStamina, 65);
    dominoEffects.push('Sem rações disponíveis → Fome severa (-22% Saúde e Stamina máxima travada em 65%).');
  }

  // Sem treino no Sol → atrofia por 0,38g
  if (!prev.trainedToday) {
    healthDelta -= 8;
    nextMaxStamina = Math.max(60, nextMaxStamina - 10);
    dominoEffects.push('Sem treino físico no Sol → Perda de tônus (-8% Saúde e -10% Stamina máxima).');
  }

  // Efeito Dominó 3: Tempestades sem abrigo
  const stormPenaltyApplied = weather.isCritical && !prev.stormProtectedToday;
  if (stormPenaltyApplied) {
    extraEnergyLoss = weather.type === 'GLOBAL_DUST_STORM' ? 32 : 24;
    healthDelta -= weather.type === 'SOLAR_RADIATION_FLARE' ? 35 : 28;
    dominoEffects.push(
      `Sem proteção no Abrigo em "${weather.title}" → Dano severo (-${extraEnergyLoss}% Energia, -${weather.type === 'SOLAR_RADIATION_FLARE' ? 35 : 28}% Saúde).`
    );
  }

  const nextEnergy = clampPct(prev.energy + solarGenerated - energyConsumed - extraEnergyLoss);
  const nextWater = clampPct(prev.water - waterConsumed);

  // Efeito Dominó 4: Energia < 30% coloca a Estufa em resfriamento -> estraga colheita & reduz O2
  const greenhouseThermalCrash = prev.energy < 30 || nextEnergy < 30;
  if (greenhouseThermalCrash) {
    healthDelta -= 8;
    if (nextFood > 0) {
      nextFood = Math.max(0, nextFood - 1);
      dominoEffects.push(
        'Energia < 30% → Resfriamento da Estufa estragou -1 Ração e derrubou O₂ (-8% Saúde).'
      );
    } else {
      dominoEffects.push('Energia < 30% → Estufa despressurizada derrubou O₂ (-8% Saúde).');
    }
  }

  // Efeito Dominó 5: Água < 25% agrava desidratação e exaustão física
  if (prev.water < 25 || nextWater < 25) {
    healthDelta -= 10;
    nextMaxStamina = Math.max(55, nextMaxStamina - 15);
    dominoEffects.push('Água < 25% → Desidratação reduziu Saúde (-10%) e teto de Stamina (-15%).');
  }

  const nextHealth = clampPct(prev.health + healthDelta);
  const nextDust = clampPct(prev.panelDustPct + weather.dustAccumulation);
  const nextGreenhouseRisk = nextEnergy < 30 || nextWater < 25;
  const nextStaminaRecovered = clampPct(prev.stamina + (hasFood ? 28 : 16), nextMaxStamina);

  const survivedCritical = weather.isCritical && prev.stormProtectedToday;
  const nextStormsSurvived = prev.stats.stormsSurvived + (survivedCritical ? 1 : 0);
  const nextScienceScore = prev.stats.scienceScore + 15 + (survivedCritical ? 35 : 0);

  const prevLog: SurvivalDailyLog = {
    ...createEmptyDailyLog(),
    ...prev.dailyLog,
    stationOperations: [...(prev.dailyLog?.stationOperations ?? [])],
  };
  const dailyLogSnapshot: SurvivalDailyLog = {
    ...prevLog,
    mealSummary: prevLog.ateMeal
      ? prevLog.mealSummary
      : hasFood
      ? 'Ração básica consumida no descanso (480 kcal)'
      : 'Sem alimentação hoje — déficit energético',
    hydrationSummary: prevLog.hydratedToday
      ? `${prevLog.hydrationMl} ml ingeridos • Reservatório em ${nextWater}%`
      : `Sem hidratação guiada hoje • Reservatório em ${nextWater}%`,
  };

  const nextStats: SurvivalStats = {
    ...prev.stats,
    stormsSurvived: nextStormsSurvived,
    scienceScore: nextScienceScore,
    totalMealsConsumed:
      (prev.stats.totalMealsConsumed ?? 0) + (!prevLog.ateMeal && hasFood ? 1 : 0),
    totalKcalConsumed:
      (prev.stats.totalKcalConsumed ?? 0) + (!prevLog.ateMeal && hasFood ? 480 : 0),
    daysExercised:
      (prev.stats.daysExercised ?? 0) + (prev.trainedToday || prevLog.exercised ? 1 : 0),
    daysHygieneCompleted:
      (prev.stats.daysHygieneCompleted ?? 0) + (prevLog.hygieneCompleted ? 1 : 0),
  };

  const failureReason = detectResourceFailure(nextEnergy, nextWater, nextHealth, prev.sol);
  const nextDominoAlerts = computeDominoAlerts({
    energy: nextEnergy,
    water: nextWater,
    foodRations: nextFood,
    panelDustPct: nextDust,
    maxStamina: nextMaxStamina,
    greenhouseInRisk: nextGreenhouseRisk,
  });

  const capiSummary = failureReason
    ? failureReason
    : dominoEffects.length > 0
    ? `Sol ${prev.sol} tenso! ${dominoEffects[0]}`
    : survivedCritical
    ? `Superamos "${weather.title}" no Sol ${prev.sol}, comandante! Continue racionando os 4 turnos!`
    : `Sol ${prev.sol} encerrado (+${solarGenerated}% Solar / -${energyConsumed}% Energia / -${waterConsumed}% Água).`;

  const report: NightlyReportSummary = {
    completedSol: prev.sol,
    weather,
    solarGenerated,
    energyConsumed: energyConsumed + extraEnergyLoss,
    waterConsumed,
    foodConsumed,
    healthDelta,
    dustAdded: weather.dustAccumulation,
    stormPenaltyApplied,
    starvationApplied: !hasFood,
    untrainedPenaltyApplied: !prev.trainedToday,
    dominoEffects,
    maxStaminaNextSol: nextMaxStamina,
    resultingEnergy: nextEnergy,
    resultingWater: nextWater,
    resultingHealth: nextHealth,
    resultingFood: nextFood,
    capiSummary,
    dailyLogSnapshot,
  };

  if (failureReason) {
    return {
      ...prev,
      energy: nextEnergy,
      water: nextWater,
      foodRations: nextFood,
      health: nextHealth,
      panelDustPct: nextDust,
      maxStamina: nextMaxStamina,
      greenhouseInRisk: nextGreenhouseRisk,
      dominoAlerts: nextDominoAlerts,
      activeCrisis: null,
      stats: nextStats,
      dailyLog: dailyLogSnapshot,
      gameStatus: 'GAME_OVER',
      gameOverReason: failureReason,
      gameOverSol: prev.sol,
      lastNightlyReport: report,
      lastActionNotice: capiSummary,
    };
  }

  if (prev.sol >= 30) {
    return {
      ...prev,
      energy: nextEnergy,
      water: nextWater,
      foodRations: nextFood,
      health: nextHealth,
      panelDustPct: nextDust,
      maxStamina: nextMaxStamina,
      greenhouseInRisk: nextGreenhouseRisk,
      dominoAlerts: nextDominoAlerts,
      activeCrisis: null,
      turnsLeft: 0,
      gameStatus: 'VICTORY',
      stats: {
        ...nextStats,
        scienceScore: nextScienceScore + 200,
      },
      dailyLog: dailyLogSnapshot,
      lastNightlyReport: report,
      lastActionNotice: 'Parabéns! Você sobreviveu todos os 30 Sols extremos em Arcadia Planitia!',
    };
  }

  return {
    ...prev,
    sol: prev.sol + 1,
    turnsLeft: 4,
    stamina: nextStaminaRecovered,
    maxStamina: nextMaxStamina,
    energy: nextEnergy,
    water: nextWater,
    foodRations: nextFood,
    health: nextHealth,
    panelDustPct: nextDust,
    powerSaveActive: false,
    trainedToday: false,
    stormProtectedToday: false,
    greenhouseInRisk: nextGreenhouseRisk,
    dominoAlerts: nextDominoAlerts,
    activeCrisis: null,
    stats: nextStats,
    dailyLog: createEmptyDailyLog(),
    lastNightlyReport: report,
    lastActionNotice: capiSummary,
  };
}
