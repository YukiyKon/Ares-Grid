import type { Language } from '../../i18n/LanguageContext';
import type { UiDictionary } from '../../i18n/pt';
import type {
  ActiveSurvivalCrisis,
  NightlyDominoDescriptor,
  NightlyReportSummary,
  StationOpDescriptor,
  Survival30State,
  SurvivalDailyLog,
  SurvivalFailureCause,
  SurvivalNoticeDescriptor,
  SurvivalStationId,
} from './survivalTypes';
import type { SurvivalWeatherType } from './weatherScheduler';

const FOOD_NAME_EN_MAP: Record<string, string> = {
  'tofu proteico': 'Protein Tofu',
  'grão-de-bico espacial': 'Space Chickpeas',
  'peixe selado nasa': 'NASA Sealed Fish',
  'salada de folhas verdes': 'Leafy Greens Salad',
  'tomates-cereja': 'Cherry Tomatoes',
  'brócolis da estufa': 'Greenhouse Broccoli',
  'tortilha integral': 'Whole-Wheat Tortilla',
  'quinoa espacial': 'Space Quinoa',
  'arroz integral': 'Brown Rice',
};

export function translateFoodItemsForLang(
  items: string[] | undefined,
  lang: Language
): string {
  if (!items || items.length === 0) return '';
  if (lang === 'pt') return items.join(' + ');
  return items
    .map((item) => FOOD_NAME_EN_MAP[item.trim().toLowerCase()] ?? item)
    .join(' + ');
}

export function getLocalizedWeather(
  weatherType: SurvivalWeatherType,
  dict: UiDictionary
) {
  return dict.survival.weather[weatherType];
}

export function getLocalizedStationRule(
  stationId: SurvivalStationId,
  dict: UiDictionary
) {
  return dict.survival.stations[stationId];
}

export function getLocalizedCrisis(
  crisis: ActiveSurvivalCrisis,
  dict: UiDictionary
) {
  const localized = dict.survival.crises[crisis.type];
  return {
    ...crisis,
    title: localized.title,
    capiUrgentWarning: localized.capiUrgentWarning,
    penaltySummary: localized.penaltySummary,
    actionButtonLabel: localized.actionButtonLabel,
  };
}

export function getLocalizedDominoAlerts(
  state: Pick<
    Survival30State,
    'energy' | 'water' | 'foodRations' | 'panelDustPct' | 'maxStamina' | 'greenhouseInRisk'
  >,
  dict: UiDictionary
): string[] {
  const alerts: string[] = [];
  if (state.panelDustPct >= 50) {
    alerts.push(dict.survival.dominoAlerts.panelDustCritical(state.panelDustPct));
  }
  if (state.energy < 30 || state.greenhouseInRisk) {
    alerts.push(dict.survival.dominoAlerts.greenhouseThermalRisk);
  }
  if (state.water < 25) {
    alerts.push(dict.survival.dominoAlerts.waterDehydration);
  }
  if (state.foodRations <= 0) {
    alerts.push(dict.survival.dominoAlerts.foodZeroStarvation);
  } else if (state.maxStamina < 100) {
    alerts.push(dict.survival.dominoAlerts.staminaCapExhaustion(state.maxStamina));
  }
  return alerts;
}

export function formatNightlyDominoEffect(
  descriptor: NightlyDominoDescriptor,
  dict: UiDictionary
): string {
  switch (descriptor.code) {
    case 'PANEL_DUST':
      return dict.survival.nightlyDominoEffects.panelDustPenalty(
        descriptor.dustPct,
        descriptor.solarGenerated
      );
    case 'POWER_SAVE':
      return dict.survival.nightlyDominoEffects.powerSavePenalty;
    case 'STARVATION':
      return dict.survival.nightlyDominoEffects.starvationPenalty;
    case 'UNTRAINED':
      return dict.survival.nightlyDominoEffects.untrainedPenalty;
    case 'UNPROTECTED_STORM':
      return dict.survival.nightlyDominoEffects.unprotectedStormPenalty(
        dict.survival.weather[descriptor.weatherType].title,
        descriptor.energyLoss,
        descriptor.healthLoss
      );
    case 'GREENHOUSE_CRASH_FOOD':
      return dict.survival.nightlyDominoEffects.greenhouseCrashWithFood;
    case 'GREENHOUSE_CRASH_NO_FOOD':
      return dict.survival.nightlyDominoEffects.greenhouseCrashNoFood;
    case 'DEHYDRATION':
      return dict.survival.nightlyDominoEffects.dehydrationPenalty;
    case 'FAINTED_0200':
      return dict.survival.nightlyDominoEffects.faintedPenalty;
  }
}

export function formatStationOperation(
  op: StationOpDescriptor,
  dict: UiDictionary
): string {
  switch (op.station) {
    case 'MISSION_1':
      return dict.survival.stationOps.MISSION_1;
    case 'MISSION_3':
      return dict.survival.stationOps.MISSION_3;
    case 'MISSION_4':
      return dict.survival.stationOps.MISSION_4;
    case 'MISSION_5':
      return dict.survival.stationOps.MISSION_5;
    case 'MISSION_2': {
      const parts: string[] = [];
      if (op.exercised) parts.push(dict.survival.dailyLog.habitatPartExercise);
      if (op.ateMeal) parts.push(dict.survival.dailyLog.habitatPartKcal(op.mealKcal));
      if (op.hydratedToday) parts.push(dict.survival.dailyLog.habitatPartHydrate(op.hydrationMl));
      if (op.hygieneCompleted) parts.push(dict.survival.dailyLog.habitatPartHygiene);
      return dict.survival.dailyLog.stationOpHabitat(parts);
    }
  }
}

export function getLocalizedDailyLog(
  log: SurvivalDailyLog,
  dict: UiDictionary,
  lang: Language,
  fallbackWaterPct?: number
) {
  const exerciseSummary = log.exercised
    ? dict.survival.dailyLog.exerciseDone(Math.max(1, log.exerciseCount))
    : dict.survival.dailyLog.exercisePending;

  const mealSummary = log.ateMeal
    ? dict.survival.dailyLog.mealBalanced(
        log.mealKcal,
        translateFoodItemsForLang(log.mealItems, lang)
      )
    : log.nightRationFallback
    ? dict.survival.dailyLog.mealNightRation
    : dict.survival.dailyLog.mealMissing;

  const waterPct = log.hydrationWaterAfter ?? fallbackWaterPct ?? 0;
  const hydrationSummary = log.hydratedToday
    ? dict.survival.dailyLog.hydrationDone(log.hydrationMl, waterPct)
    : log.hydrationWaterAfter !== undefined || fallbackWaterPct !== undefined
    ? dict.survival.dailyLog.hydrationNightFallback(waterPct)
    : dict.survival.dailyLog.hydrationInsufficient;

  const hygieneSummary = log.hygieneCompleted
    ? dict.survival.dailyLog.hygieneDone
    : dict.survival.dailyLog.hygienePending;

  const stationOperations =
    log.stationOpRecords && log.stationOpRecords.length > 0
      ? log.stationOpRecords.map((op) => formatStationOperation(op, dict))
      : log.stationOperations;

  return {
    ...log,
    exerciseSummary,
    mealSummary,
    hydrationSummary,
    hygieneSummary,
    stationOperations,
  };
}

export function getLocalizedNightlySummary(
  report: Pick<
    NightlyReportSummary,
    | 'completedSol'
    | 'weather'
    | 'solarGenerated'
    | 'energyConsumed'
    | 'waterConsumed'
    | 'stormPenaltyApplied'
    | 'dominoEffectDescriptors'
    | 'dominoEffects'
  >,
  dict: UiDictionary
): string {
  const descriptors = report.dominoEffectDescriptors ?? [];
  if (descriptors.length > 0) {
    const first = formatNightlyDominoEffect(descriptors[0], dict);
    return dict.survival.nightlySummary.tense(report.completedSol, first);
  }
  if (report.dominoEffects.length > 0) {
    return dict.survival.nightlySummary.tense(report.completedSol, report.dominoEffects[0]);
  }
  if (report.weather.isCritical && !report.stormPenaltyApplied) {
    return dict.survival.nightlySummary.survivedCritical(
      report.completedSol,
      dict.survival.weather[report.weather.type].title
    );
  }
  return dict.survival.nightlySummary.standard(
    report.completedSol,
    report.solarGenerated,
    report.energyConsumed,
    report.waterConsumed
  );
}

export function getLocalizedFailureReason(
  cause: SurvivalFailureCause | null | undefined,
  sol: number,
  dict: UiDictionary,
  fallbackReason?: string | null,
  translateFallback?: (t: string) => string
): string | null {
  if (cause) {
    return dict.survival.failureReasons[cause](sol);
  }
  if (!fallbackReason) return null;
  return translateFallback ? translateFallback(fallbackReason) : fallbackReason;
}

export function formatNoticeDescriptor(
  descriptor: SurvivalNoticeDescriptor | null | undefined,
  dict: UiDictionary,
  fallback?: string | null,
  translateFallback?: (t: string) => string
): string | null {
  if (!descriptor) {
    if (!fallback) return null;
    return translateFallback ? translateFallback(fallback) : fallback;
  }

  switch (descriptor.kind) {
    case 'INITIAL':
      return dict.survival.notices.initial;
    case 'ZERO_TURNS_LEFT':
      return dict.survival.notices.zeroTurnsLeft;
    case 'INSUFFICIENT_STAMINA':
      return dict.survival.notices.insufficientStamina(
        dict.survival.stations[descriptor.station].title,
        descriptor.cost,
        descriptor.current
      );
    case 'INSUFFICIENT_WATER':
      return dict.survival.notices.insufficientWater(
        dict.survival.stations[descriptor.station].title,
        descriptor.minWater,
        descriptor.current
      );
    case 'INSUFFICIENT_ENERGY':
      return dict.survival.notices.insufficientEnergy(
        dict.survival.stations[descriptor.station].title,
        descriptor.minEnergy,
        descriptor.current
      );
    case 'STATION_COMPLETE': {
      if (descriptor.station === 'MISSION_2') {
        return descriptor.hasFood
          ? dict.survival.notices.stationComplete.MISSION_2_FULL(descriptor.maxStamina ?? 100)
          : dict.survival.notices.stationComplete.MISSION_2_HYDRATION;
      }
      return dict.survival.notices.stationComplete[descriptor.station];
    }
    case 'CRISIS_STARTED':
      return dict.survival.notices.crisisStarted(
        dict.survival.crises[descriptor.crisisType].title
      );
    case 'CRISIS_CONTAINED':
      return dict.survival.notices.crisisContained(
        dict.survival.crises[descriptor.crisisType].title
      );
    case 'CRISIS_TIMEOUT': {
      const c = dict.survival.crises[descriptor.crisisType];
      return dict.survival.notices.crisisTimeout(c.title, c.penaltySummary);
    }
    case 'FAINTED_0200':
      return dict.survival.notices.fainted0200;
    case 'STORM_PREP_STARTED':
      return dict.survival.notices.stormPrepStarted(
        dict.survival.weather[descriptor.weatherType].title
      );
    case 'STORM_IMPACT_STARTED':
      return dict.survival.notices.stormImpactStarted(
        dict.survival.weather[descriptor.weatherType].title
      );
    case 'STORM_CLEARED':
      return dict.survival.notices.stormCleared;
    case 'VICTORY':
      return dict.survival.notices.victory;
    case 'FAILURE':
      return dict.survival.failureReasons[descriptor.cause](descriptor.sol);
    case 'NIGHTLY_REPORT': {
      const { report } = descriptor;
      if (report.dominoEffectDescriptors.length > 0) {
        return dict.survival.nightlySummary.tense(
          report.completedSol,
          formatNightlyDominoEffect(report.dominoEffectDescriptors[0], dict)
        );
      }
      const weatherInfo = dict.survival.weather[report.weatherType];
      const isCritical =
        report.weatherType === 'GLOBAL_DUST_STORM' ||
        report.weatherType === 'SOLAR_RADIATION_FLARE';
      if (isCritical && !report.stormPenaltyApplied) {
        return dict.survival.nightlySummary.survivedCritical(
          report.completedSol,
          weatherInfo.title
        );
      }
      return dict.survival.nightlySummary.standard(
        report.completedSol,
        report.solarGenerated,
        report.energyConsumed,
        report.waterConsumed
      );
    }
  }
}

export function getLocalizedEarthSyncStatus(
  status: string,
  dict: UiDictionary,
  translateFallback?: (t: string) => string
): string {
  const solMatch = status.match(/Sol\s+(\d+)/i);
  if (
    status.includes('Central Terrestre') ||
    status.includes('enviada à Terra') ||
    status.includes('transmitido à Terra') ||
    status.includes('transmitidos à Terra') ||
    status.includes('Earth Control') ||
    status.includes('transmitted successfully')
  ) {
    const sol = solMatch ? Number(solMatch[1]) : 1;
    return dict.survival.notices.syncCompleted(sol);
  }
  if (
    status.includes('servidor') ||
    status.includes('spacecraft server') ||
    status.includes('Aguardando janela') ||
    status.includes('Waiting for')
  ) {
    return dict.survival.notices.syncQueued;
  }
  return translateFallback ? translateFallback(status) : status;
}
