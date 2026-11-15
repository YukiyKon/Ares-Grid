import React, { createContext, useContext, useEffect, useState } from 'react';
import type {
  MarsSeasonId,
  MarsSolarHourId,
  PanelAzimuthId,
} from '../missions/mission1-solar/mars24SolarMath';
import {
  applySurvivalStationCompletion,
  canFastForwardNight,
  createEmptyDailyLog,
  createInitialSurvival30State,
  createSurvivalCrisis,
  type CrisisType,
  type GameMode,
  interactGreenhousePlotAction,
  normalizeSurvival30State,
  resolveNightlySolTransition,
  resolveSurvivalCrisisTimeout,
  startStormPrepEvent,
  stepSurvivalCrisisProgress,
  type Survival30State,
  type SurvivalActionDetails,
  type SurvivalBreakers,
  type SurvivalDailyLog,
  type SurvivalLocation,
  type SurvivalStationId,
  tickSurvivalClockSecond,
} from '../modes/survival30/survivalTypes';
import { getSolWeather } from '../modes/survival30/weatherScheduler';

export type GameSceneId =
  | 'START_SCREEN'
  | 'COUNTDOWN'
  | 'LAUNCH'
  | 'CAPI_INTRO'
  | 'CUSTOMIZE'
  | 'LANDING'
  | 'BASE_HUB'
  | 'MISSION_1'
  | 'MISSION_2'
  | 'MISSION_3'
  | 'MISSION_4'
  | 'MISSION_5'
  | 'EARTH_COMMS'
  | 'FUTURE_MARS'
  | 'ARCADE_RUSH';

export type SuitColorId = 'white' | 'orange' | 'cyan' | 'emerald' | 'violet';
export type HelmetStyleId = 'classic' | 'visor_cyan' | 'gold_shield';
export type BackpackStyleId = 'standard' | 'dual_tank' | 'comms_array';
export type BadgeStyleId = 'star' | 'mars' | 'capybara' | 'bolt';

export interface AstronautProfile {
  name: string;
  suitColor: SuitColorId;
  helmetStyle: HelmetStyleId;
  backpackStyle: BackpackStyleId;
  badgeStyle: BadgeStyleId;
  isCustomized: boolean;
}

export interface GameStats {
  energy: number;
  water: number;
  health: number;
  sol: number;
  solarInstalled: boolean;
}

export type Mission1Phase = 'STEP_1_SITE' | 'STEP_2_CALC' | 'STEP_3_TEST' | 'COMPLETED';
export type CandidateSiteId = 'A' | 'B' | 'C';

export interface Mission1State {
  phase: Mission1Phase;
  selectedSite: CandidateSiteId | null;
  season: MarsSeasonId;
  solarHour: MarsSolarHourId;
  panelAzimuth: PanelAzimuthId;
  panelTiltDeg: number;
  generatedWatts: number;
  dustCleaned: boolean;
  powerSaveTested: boolean;
  loggedInDiary: boolean;
  mission1Completed: boolean;
  mission2Unlocked: boolean;
}

export type Mission2Phase =
  | 'STEP_1_GYM'
  | 'STEP_2_GALLEY'
  | 'STEP_3_HYGIENE'
  | 'STEP_4_SLEEP'
  | 'COMPLETED';

export type ExerciseId = 'TREADMILL' | 'RESISTANCE' | 'STRETCH' | 'BALANCE';
export type WaterDoseId = 'LOW' | 'IDEAL' | 'WASTE';

export interface Mission2State {
  phase: Mission2Phase;
  exercisesCompleted: ExerciseId[];
  fitnessScore: number;
  selectedProtein: string | null;
  selectedVeggie: string | null;
  selectedCarb: string | null;
  waterDose: WaterDoseId | null;
  nutritionCompleted: boolean;
  hygieneTasks: {
    teeth: boolean;
    hands: boolean;
    gear: boolean;
  };
  hygieneCompleted: boolean;
  loggedInDiary: boolean;
  mission2Completed: boolean;
  mission3Unlocked: boolean;
}

export type Mission3Phase =
  | 'STEP_1_RADAR'
  | 'STEP_2_DRILL'
  | 'STEP_3_LAB'
  | 'STEP_4_CLOSE'
  | 'COMPLETED';

export type ExplorationSectorId = 'ALPHA' | 'BETA' | 'GAMMA';

export interface Mission3State {
  phase: Mission3Phase;
  layersInspected: {
    surface: boolean;
    radar: boolean;
    priorStudies: boolean;
  };
  selectedSector: ExplorationSectorId | null;
  drillDepthStep: 0 | 1 | 2 | 3;
  sampleExtracted: boolean;
  sampleLabeled: boolean;
  sampleStored: boolean;
  processSteps: {
    separateSoil: boolean;
    meltIce: boolean;
    filterParticles: boolean;
    treatWater: boolean;
  };
  potabilityChecks: {
    ph: boolean;
    conductivity: boolean;
    chemicals: boolean;
    metals: boolean;
    microbiology: boolean;
  };
  waterApproved: boolean;
  loggedInDiary: boolean;
  mission3Completed: boolean;
  mission4Unlocked: boolean;
}

export type Mission4Phase =
  | 'STEP_1_BUILD'
  | 'STEP_2_METHODS'
  | 'STEP_3_CROPS'
  | 'STEP_4_GROWTH'
  | 'STEP_5_BIOREG'
  | 'COMPLETED';

export type EnvSettingLevel = 'LOW' | 'IDEAL' | 'HIGH';
export type TempSettingLevel = 'COLD' | 'IDEAL' | 'HOT';

export interface Mission4State {
  phase: Mission4Phase;
  subsystems: {
    structure: boolean;
    lighting: boolean;
    climate: boolean;
    irrigation: boolean;
    connectedSolar: boolean;
    connectedWater: boolean;
  };
  methodsInspected: {
    hydroponics: boolean;
    aeroponics: boolean;
    rawRegolithTested: boolean;
  };
  selectedMethod: 'HYDRO_AERO' | null;
  selectedCrops: {
    vegetable: string | null;
    fruit: string | null;
    grain: string | null;
    ornamental: string | null;
  };
  envSettings: {
    light: EnvSettingLevel;
    waterNutrient: EnvSettingLevel;
    tempHumidity: TempSettingLevel;
  };
  growthStage: 0 | 1 | 2 | 3;
  bioregLinks: {
    foodProduction: boolean;
    airRevitalization: boolean;
    waterRecycling: boolean;
  };
  loggedInDiary: boolean;
  mission4Completed: boolean;
  mission5Unlocked: boolean;
}

export type Mission5Phase =
  | 'STEP_1_DUST'
  | 'STEP_2_SOLAR_CLEAN'
  | 'STEP_3_RADIATION'
  | 'STEP_4_INSPECTION'
  | 'COMPLETED';

export interface Mission5State {
  phase: Mission5Phase;
  dustProtocol: {
    checkPanel: boolean;
    stopExternalAndReturn: boolean;
    sealCompartmentsAndFilters: boolean;
    protectGearAndBattery: boolean;
  };
  postDustSolar: {
    inspectedDrop: boolean;
    remoteCleaningTriggered: boolean;
  };
  radiationProtocol: {
    alertConsulted: boolean;
    externalStopped: boolean;
    enteredShieldedShelter: boolean;
    shieldingVerified: boolean;
    riskReducedAndReleased: boolean;
  };
  postStormInspection: {
    solarPanels: boolean;
    habitatStructure: boolean;
    greenhouseDome: boolean;
    commsSystems: boolean;
  };
  loggedInDiary: boolean;
  mission5Completed: boolean;
  endingUnlocked: boolean;
  earthTransmissionCompleted: boolean;
}

export interface HealthSimulationData {
  sleepHours: number;
  sleepQuality: 'Excelente' | 'Boa' | 'Regular';
  exercisesDone: string[];
  nutritionStatus: string;
  hydrationLevel: string;
  hygieneChecked: boolean;
  simulatedHeartRateBpm: number;
  adaptationNote: string;
}

export interface LogbookEntry {
  id: string;
  sol: number;
  timestamp: string;
  sceneLabel: string;
  event: string;
  observedAspect: string;
  photoDataUrl: string;
  savedInShipServer: boolean;
  transmittedToEarth: boolean;
}

export type ActiveModalType =
  | 'NONE'
  | 'LOGBOOK'
  | 'SLEEP_REPORT'
  | 'ARCADIA_MAP'
  | 'BREAKERS'
  | 'BUNKER';

export interface GameState {
  currentScene: GameSceneId;
  gameMode: GameMode;
  survival30Unlocked: boolean;
  survival: Survival30State;
  astronaut: AstronautProfile;
  stats: GameStats;
  mission1: Mission1State;
  mission2: Mission2State;
  mission3: Mission3State;
  mission4: Mission4State;
  mission5: Mission5State;
  healthSimulation: HealthSimulationData;
  logbook: LogbookEntry[];
  lastEarthSyncStatus: string;
  activeModal: ActiveModalType;
  seenCapiDialogs: string[];
}

const STORAGE_KEY = 'arcadia_planitia_state_v1';
export const SEEN_DIALOGS_STORAGE_KEY = 'astro_capi_seen_dialogs';

function loadSeenCapiDialogs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(SEEN_DIALOGS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === 'string' && id.length > 0)
      : [];
  } catch {
    return [];
  }
}

function saveSeenCapiDialogs(list: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SEEN_DIALOGS_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore storage quota errors
  }
}

const DEFAULT_MISSION_1: Mission1State = {
  phase: 'STEP_1_SITE',
  selectedSite: null,
  season: 'EQUINOX',
  solarHour: 'NOON',
  panelAzimuth: 'NORTH',
  panelTiltDeg: 10,
  generatedWatts: 0,
  dustCleaned: false,
  powerSaveTested: false,
  loggedInDiary: false,
  mission1Completed: false,
  mission2Unlocked: false,
};

const DEFAULT_MISSION_2: Mission2State = {
  phase: 'STEP_1_GYM',
  exercisesCompleted: [],
  fitnessScore: 0,
  selectedProtein: null,
  selectedVeggie: null,
  selectedCarb: null,
  waterDose: null,
  nutritionCompleted: false,
  hygieneTasks: {
    teeth: false,
    hands: false,
    gear: false,
  },
  hygieneCompleted: false,
  loggedInDiary: false,
  mission2Completed: false,
  mission3Unlocked: false,
};

const DEFAULT_MISSION_3: Mission3State = {
  phase: 'STEP_1_RADAR',
  layersInspected: {
    surface: false,
    radar: false,
    priorStudies: false,
  },
  selectedSector: null,
  drillDepthStep: 0,
  sampleExtracted: false,
  sampleLabeled: false,
  sampleStored: false,
  processSteps: {
    separateSoil: false,
    meltIce: false,
    filterParticles: false,
    treatWater: false,
  },
  potabilityChecks: {
    ph: false,
    conductivity: false,
    chemicals: false,
    metals: false,
    microbiology: false,
  },
  waterApproved: false,
  loggedInDiary: false,
  mission3Completed: false,
  mission4Unlocked: false,
};

const DEFAULT_MISSION_4: Mission4State = {
  phase: 'STEP_1_BUILD',
  subsystems: {
    structure: false,
    lighting: false,
    climate: false,
    irrigation: false,
    connectedSolar: false,
    connectedWater: false,
  },
  methodsInspected: {
    hydroponics: false,
    aeroponics: false,
    rawRegolithTested: false,
  },
  selectedMethod: null,
  selectedCrops: {
    vegetable: null,
    fruit: null,
    grain: null,
    ornamental: null,
  },
  envSettings: {
    light: 'LOW',
    waterNutrient: 'LOW',
    tempHumidity: 'COLD',
  },
  growthStage: 0,
  bioregLinks: {
    foodProduction: false,
    airRevitalization: false,
    waterRecycling: false,
  },
  loggedInDiary: false,
  mission4Completed: false,
  mission5Unlocked: false,
};

const DEFAULT_MISSION_5: Mission5State = {
  phase: 'STEP_1_DUST',
  dustProtocol: {
    checkPanel: false,
    stopExternalAndReturn: false,
    sealCompartmentsAndFilters: false,
    protectGearAndBattery: false,
  },
  postDustSolar: {
    inspectedDrop: false,
    remoteCleaningTriggered: false,
  },
  radiationProtocol: {
    alertConsulted: false,
    externalStopped: false,
    enteredShieldedShelter: false,
    shieldingVerified: false,
    riskReducedAndReleased: false,
  },
  postStormInspection: {
    solarPanels: false,
    habitatStructure: false,
    greenhouseDome: false,
    commsSystems: false,
  },
  loggedInDiary: false,
  mission5Completed: false,
  endingUnlocked: false,
  earthTransmissionCompleted: false,
};

const DEFAULT_SURVIVAL: Survival30State = createInitialSurvival30State();

const DEFAULT_STATE: GameState = {
  currentScene: 'START_SCREEN',
  gameMode: 'TRAINING',
  survival30Unlocked: false,
  survival: DEFAULT_SURVIVAL,
  astronaut: {
    name: 'Comandante Alex',
    suitColor: 'orange',
    helmetStyle: 'visor_cyan',
    backpackStyle: 'standard',
    badgeStyle: 'capybara',
    isCustomized: false,
  },
  stats: {
    energy: 25,
    water: 85,
    health: 100,
    sol: 1,
    solarInstalled: false,
  },
  mission1: DEFAULT_MISSION_1,
  mission2: DEFAULT_MISSION_2,
  mission3: DEFAULT_MISSION_3,
  mission4: DEFAULT_MISSION_4,
  mission5: DEFAULT_MISSION_5,
  healthSimulation: {
    sleepHours: 8.2,
    sleepQuality: 'Boa',
    exercisesDone: ['Nenhum exercício registrado hoje'],
    nutritionStatus: 'Aguardando preparo de refeição no Habitat',
    hydrationLevel: 'Reservatório em 85% (aguardando dosagem)',
    hygieneChecked: false,
    simulatedHeartRateBpm: 76,
    adaptationNote: 'Adaptação inicial à gravidade marciana (~0,38g) monitorada.',
  },
  logbook: [],
  lastEarthSyncStatus: 'Aguardando primeira transmissão orbital.',
  activeModal: 'NONE',
  seenCapiDialogs: [],
};

function loadInitialState(): GameState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  const persistedSeenDialogs = loadSeenCapiDialogs();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        ...DEFAULT_STATE,
        seenCapiDialogs: persistedSeenDialogs,
      };
    }
    const parsed = JSON.parse(raw) as Partial<GameState>;
    const mergedSeenDialogs = Array.from(
      new Set([
        ...(Array.isArray(parsed.seenCapiDialogs)
          ? parsed.seenCapiDialogs.filter(
              (id): id is string => typeof id === 'string' && id.length > 0
            )
          : []),
        ...persistedSeenDialogs,
      ])
    );
    return {
      ...DEFAULT_STATE,
      ...parsed,
      astronaut: { ...DEFAULT_STATE.astronaut, ...(parsed.astronaut ?? {}) },
      stats: { ...DEFAULT_STATE.stats, ...(parsed.stats ?? {}) },
      mission1: { ...DEFAULT_MISSION_1, ...(parsed.mission1 ?? {}) },
      mission2: {
        ...DEFAULT_MISSION_2,
        ...(parsed.mission2 ?? {}),
        hygieneTasks: {
          ...DEFAULT_MISSION_2.hygieneTasks,
          ...(parsed.mission2?.hygieneTasks ?? {}),
        },
      },
      mission3: {
        ...DEFAULT_MISSION_3,
        ...(parsed.mission3 ?? {}),
        layersInspected: {
          ...DEFAULT_MISSION_3.layersInspected,
          ...(parsed.mission3?.layersInspected ?? {}),
        },
        processSteps: {
          ...DEFAULT_MISSION_3.processSteps,
          ...(parsed.mission3?.processSteps ?? {}),
        },
        potabilityChecks: {
          ...DEFAULT_MISSION_3.potabilityChecks,
          ...(parsed.mission3?.potabilityChecks ?? {}),
        },
      },
      mission4: {
        ...DEFAULT_MISSION_4,
        ...(parsed.mission4 ?? {}),
        subsystems: {
          ...DEFAULT_MISSION_4.subsystems,
          ...(parsed.mission4?.subsystems ?? {}),
        },
        methodsInspected: {
          ...DEFAULT_MISSION_4.methodsInspected,
          ...(parsed.mission4?.methodsInspected ?? {}),
        },
        selectedCrops: {
          ...DEFAULT_MISSION_4.selectedCrops,
          ...(parsed.mission4?.selectedCrops ?? {}),
        },
        envSettings: {
          ...DEFAULT_MISSION_4.envSettings,
          ...(parsed.mission4?.envSettings ?? {}),
        },
        bioregLinks: {
          ...DEFAULT_MISSION_4.bioregLinks,
          ...(parsed.mission4?.bioregLinks ?? {}),
        },
      },
      mission5: {
        ...DEFAULT_MISSION_5,
        ...(parsed.mission5 ?? {}),
        dustProtocol: {
          ...DEFAULT_MISSION_5.dustProtocol,
          ...(parsed.mission5?.dustProtocol ?? {}),
        },
        postDustSolar: {
          ...DEFAULT_MISSION_5.postDustSolar,
          ...(parsed.mission5?.postDustSolar ?? {}),
        },
        radiationProtocol: {
          ...DEFAULT_MISSION_5.radiationProtocol,
          ...(parsed.mission5?.radiationProtocol ?? {}),
        },
        postStormInspection: {
          ...DEFAULT_MISSION_5.postStormInspection,
          ...(parsed.mission5?.postStormInspection ?? {}),
        },
      },
      healthSimulation: {
        ...DEFAULT_STATE.healthSimulation,
        ...(parsed.healthSimulation ?? {}),
      },
      survival: normalizeSurvival30State({
        ...DEFAULT_SURVIVAL,
        ...(parsed.survival ?? {}),
        dominoAlerts: Array.isArray(parsed.survival?.dominoAlerts)
          ? parsed.survival.dominoAlerts
          : DEFAULT_SURVIVAL.dominoAlerts,
        activeCrisis: null,
        stats: {
          ...DEFAULT_SURVIVAL.stats,
          ...(parsed.survival?.stats ?? {}),
        },
        dailyLog: {
          ...createEmptyDailyLog(),
          ...(parsed.survival?.dailyLog ?? {}),
          stationOperations: Array.isArray(parsed.survival?.dailyLog?.stationOperations)
            ? parsed.survival.dailyLog.stationOperations
            : [],
        },
      }),
      gameMode: parsed.gameMode === 'SURVIVAL_30' ? 'SURVIVAL_30' : 'TRAINING',
      logbook: Array.isArray(parsed.logbook) ? parsed.logbook : [],
      activeModal: 'NONE',
      seenCapiDialogs: mergedSeenDialogs,
    };
  } catch {
    return {
      ...DEFAULT_STATE,
      seenCapiDialogs: persistedSeenDialogs,
    };
  }
}

const EXERCISE_LABELS: Record<ExerciseId, string> = {
  TREADMILL: 'Esteira com cintos de gravidade',
  RESISTANCE: 'Exercícios de resistência',
  STRETCH: 'Alongamento corporal',
  BALANCE: 'Treinamento de equilíbrio',
};

function buildSyncedHealthSimulation(
  prev: GameState,
  overrideNote?: string,
  overrideSleepHours?: number,
  overrideSleepQuality?: HealthSimulationData['sleepQuality'],
  overrideHeartRateBpm?: number
): HealthSimulationData {
  const m2 = prev.mission2;
  const doneList =
    m2.exercisesCompleted.length > 0
      ? m2.exercisesCompleted.map((id) => EXERCISE_LABELS[id])
      : prev.healthSimulation.exercisesDone;

  const mealSummary =
    m2.selectedProtein && m2.selectedVeggie && m2.selectedCarb
      ? `${m2.selectedProtein} + ${m2.selectedVeggie} + ${m2.selectedCarb}`
      : prev.healthSimulation.nutritionStatus;

  const hydrationSummary =
    m2.waterDose === 'IDEAL'
      ? 'Ideal (350 ml dosados sem desperdício)'
      : m2.waterDose === 'LOW'
      ? 'Baixa (100 ml — reforçar hidratação)'
      : m2.waterDose === 'WASTE'
      ? 'Excesso no dispensador (ajustar reserva)'
      : prev.healthSimulation.hydrationLevel;

  const hygieneOk = m2.hygieneCompleted || prev.healthSimulation.hygieneChecked;

  return {
    sleepHours: overrideSleepHours ?? prev.healthSimulation.sleepHours,
    sleepQuality: overrideSleepQuality ?? prev.healthSimulation.sleepQuality,
    exercisesDone: doneList,
    nutritionStatus: mealSummary,
    hydrationLevel: hydrationSummary,
    hygieneChecked: hygieneOk,
    simulatedHeartRateBpm: overrideHeartRateBpm ?? prev.healthSimulation.simulatedHeartRateBpm,
    adaptationNote: overrideNote ?? prev.healthSimulation.adaptationNote,
  };
}

interface GameContextValue {
  state: GameState;
  setScene: (scene: GameSceneId) => void;
  startSurvivalMode: () => void;
  toggleGameMode: () => void;
  setSurvivalPowerSave: (enabled: boolean) => void;
  executeSurvivalStationAction: (
    station: SurvivalStationId,
    details?: SurvivalActionDetails
  ) => void;
  recordSurvivalDailyLog: (patch: Partial<SurvivalDailyLog>) => void;
  triggerSurvivalCrisis: (preferredType?: CrisisType) => void;
  tickSurvivalCrisis: () => void;
  interactSurvivalCrisis: () => void;
  resolveCrisisViaStation: () => void;
  toggleSurvivalClockPause: () => void;
  toggleSurvivalFastForward2x: () => void;
  toggleSurvivalBreaker: (key: Exclude<keyof SurvivalBreakers, 'lifeSupport'>) => void;
  setSurvivalIndoorState: (insideHabitat: boolean) => void;
  setSurvivalInBunker: (inBunker: boolean) => void;
  sealStormHatchesQuick: () => void;
  triggerSurvivalStormEvent: (
    preferredType?: 'GLOBAL_DUST_STORM' | 'SOLAR_RADIATION_FLARE'
  ) => void;
  interactGreenhousePlot: (plotId: number) => void;
  resolveSurvivalFaint: () => void;
  restartSurvival30: () => void;
  updateAstronaut: (patch: Partial<AstronautProfile>) => void;
  updateStats: (patch: Partial<GameStats>) => void;
  updateMission1: (patch: Partial<Mission1State>) => void;
  updateMission2: (patch: Partial<Mission2State>) => void;
  updateMission3: (patch: Partial<Mission3State>) => void;
  updateMission4: (patch: Partial<Mission4State>) => void;
  updateMission5: (patch: Partial<Mission5State>) => void;
  transmitAllLogsToEarth: () => void;
  installSolarSystem: (watts: number) => void;
  completeMission2SleepScene: (earthConnected: boolean) => void;
  completeMission3WaterDiscovery: () => void;
  openModal: (modal: ActiveModalType) => void;
  addLogbookEntry: (entry: {
    sceneLabel: string;
    event: string;
    observedAspect: string;
    photoDataUrl: string;
  }) => void;
  completeSleepCycle: (earthConnected: boolean) => void;
  markCapiDialogSeen: (
    dialogId?: string,
    options?: { resumeSurvivalClock?: boolean }
  ) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(loadInitialState);

  useEffect(() => {
    try {
      const toPersist: GameState = { ...state, activeModal: 'NONE' };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
    } catch {
      // Ignora erro caso cota do localStorage esteja cheia
    }
  }, [state]);

  // Motor de Tempo Real Contínuo do Modo 2: Sobrevivência (30 Sols)
  // Continua rodando durante os mini-games das estações e nos painéis de Disjuntores/Bunker.
  const shouldRunSurvivalClock =
    state.gameMode === 'SURVIVAL_30' &&
    state.currentScene !== 'START_SCREEN' &&
    state.currentScene !== 'ARCADE_RUSH' &&
    state.activeModal !== 'SLEEP_REPORT' &&
    state.activeModal !== 'LOGBOOK' &&
    state.activeModal !== 'ARCADIA_MAP' &&
    state.survival.gameStatus === 'PLAYING' &&
    !state.survival.clockPaused &&
    state.survival.faintState === 'NONE';

  useEffect(() => {
    if (!shouldRunSurvivalClock) return;
    const timer = window.setInterval(() => {
      setState((prev) => {
        if (
          prev.gameMode !== 'SURVIVAL_30' ||
          prev.survival.gameStatus !== 'PLAYING' ||
          prev.survival.clockPaused ||
          prev.survival.faintState !== 'NONE'
        ) {
          return prev;
        }
        return {
          ...prev,
          survival: tickSurvivalClockSecond(prev.survival, 1),
        };
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [shouldRunSurvivalClock]);

  const buildSurvivalPreparedPatch = (
    prev: GameState,
    targetScene?: GameSceneId,
    solOverride?: number
  ): Partial<GameState> => {
    const activeSol = solOverride ?? prev.survival.sol;
    const weather = getSolWeather(activeSol);
    const patch: Partial<GameState> = {};

    if (!targetScene || targetScene === 'MISSION_1') {
      patch.mission1 = {
        ...prev.mission1,
        phase: 'STEP_3_TEST',
        selectedSite: 'C',
        season: 'EQUINOX',
        solarHour: 'NOON',
        panelAzimuth: 'SOUTH',
        panelTiltDeg: 22,
        generatedWatts: 480,
        dustCleaned: false,
        powerSaveTested: prev.survival.powerSaveActive,
        mission1Completed: false,
      };
    }

    if (!targetScene || targetScene === 'MISSION_2') {
      patch.mission2 = {
        ...prev.mission2,
        phase: 'STEP_1_GYM',
        exercisesCompleted: [],
        fitnessScore: 0,
        selectedProtein: null,
        selectedVeggie: null,
        selectedCarb: null,
        waterDose: null,
        nutritionCompleted: false,
        hygieneTasks: {
          teeth: false,
          hands: false,
          gear: false,
        },
        hygieneCompleted: false,
        mission2Completed: false,
      };
    }

    if (!targetScene || targetScene === 'MISSION_3') {
      patch.mission3 = {
        ...prev.mission3,
        phase: 'STEP_2_DRILL',
        layersInspected: { surface: true, radar: true, priorStudies: true },
        selectedSector: 'GAMMA',
        drillDepthStep: 0,
        sampleExtracted: false,
        sampleLabeled: false,
        sampleStored: false,
        processSteps: {
          separateSoil: false,
          meltIce: false,
          filterParticles: false,
          treatWater: false,
        },
        potabilityChecks: {
          ph: false,
          conductivity: false,
          chemicals: false,
          metals: false,
          microbiology: false,
        },
        waterApproved: false,
        mission3Completed: false,
      };
    }

    if (!targetScene || targetScene === 'MISSION_4') {
      const greenhouseBroken =
        prev.survival.greenhouseInRisk || prev.survival.energy < 30;
      patch.mission4 = {
        ...prev.mission4,
        phase: 'STEP_4_GROWTH',
        subsystems: {
          structure: true,
          lighting: true,
          climate: true,
          irrigation: true,
          connectedSolar: true,
          connectedWater: true,
        },
        selectedMethod: 'HYDRO_AERO',
        selectedCrops: {
          vegetable: prev.mission4.selectedCrops.vegetable ?? 'Alface Crespa',
          fruit: prev.mission4.selectedCrops.fruit ?? 'Morangos',
          grain: prev.mission4.selectedCrops.grain ?? 'Trigo Anão',
          ornamental: prev.mission4.selectedCrops.ornamental ?? 'Flores Coloridas',
        },
        envSettings: greenhouseBroken
          ? {
              light: 'LOW',
              waterNutrient: 'LOW',
              tempHumidity: 'COLD',
            }
          : {
              light: 'IDEAL',
              waterNutrient: 'IDEAL',
              tempHumidity: 'IDEAL',
            },
        growthStage: 0,
        mission4Completed: false,
      };
    }

    if (!targetScene || targetScene === 'MISSION_5') {
      patch.mission5 = {
        ...prev.mission5,
        phase: weather.type === 'SOLAR_RADIATION_FLARE' ? 'STEP_3_RADIATION' : 'STEP_1_DUST',
        dustProtocol: {
          checkPanel: false,
          stopExternalAndReturn: false,
          sealCompartmentsAndFilters: false,
          protectGearAndBattery: false,
        },
        radiationProtocol: {
          alertConsulted: true,
          externalStopped: true,
          enteredShieldedShelter: false,
          shieldingVerified: false,
          riskReducedAndReleased: false,
        },
        mission5Completed: false,
      };
    }

    return patch;
  };

  const setScene = (scene: GameSceneId) => {
    setState((prev) => {
      const stationPatch =
        prev.gameMode === 'SURVIVAL_30' &&
        (scene === 'MISSION_1' ||
          scene === 'MISSION_2' ||
          scene === 'MISSION_3' ||
          scene === 'MISSION_4' ||
          scene === 'MISSION_5')
          ? buildSurvivalPreparedPatch(prev, scene)
          : {};

      const locationMap: Partial<Record<GameSceneId, SurvivalLocation>> = {
        BASE_HUB: 'BASE_HUB',
        MISSION_1: 'SOLAR_ARRAY',
        MISSION_2: 'HABITAT',
        MISSION_3: 'ICE_LAB',
        MISSION_4: 'GREENHOUSE',
        MISSION_5: 'BUNKER',
      };
      const nextLoc = locationMap[scene];
      const nextInside =
        scene === 'MISSION_2' || scene === 'MISSION_5'
          ? true
          : scene === 'BASE_HUB'
          ? prev.survival.safeInsideHabitat
          : false;

      return {
        ...prev,
        ...stationPatch,
        currentScene: scene,
        survival: nextLoc
          ? {
              ...prev.survival,
              playerLocation: nextLoc,
              safeInsideHabitat: nextInside,
              fastForward2x: nextInside ? prev.survival.fastForward2x : false,
            }
          : prev.survival,
        survival30Unlocked:
          prev.survival30Unlocked ||
          scene === 'FUTURE_MARS' ||
          prev.mission5.mission5Completed,
      };
    });
  };

  const startSurvivalMode = () => {
    setState((prev) => {
      const freshSurvival =
        prev.survival.gameStatus !== 'PLAYING'
          ? createInitialSurvival30State()
          : prev.survival;
      const prepared = buildSurvivalPreparedPatch(prev, undefined, freshSurvival.sol);
      return {
        ...prev,
        ...prepared,
        gameMode: 'SURVIVAL_30',
        survival30Unlocked: true,
        survival: freshSurvival,
        currentScene: 'BASE_HUB',
        activeModal: 'NONE',
      };
    });
  };

  const toggleGameMode = () => {
    setState((prev) => {
      const nextMode: GameMode =
        prev.gameMode === 'SURVIVAL_30' ? 'TRAINING' : 'SURVIVAL_30';
      if (nextMode === 'SURVIVAL_30') {
        const prepared = buildSurvivalPreparedPatch(prev);
        return {
          ...prev,
          ...prepared,
          gameMode: 'SURVIVAL_30',
          survival30Unlocked: true,
          currentScene: 'BASE_HUB',
          activeModal: 'NONE',
        };
      }
      return {
        ...prev,
        gameMode: 'TRAINING',
        currentScene: 'BASE_HUB',
        activeModal: 'NONE',
      };
    });
  };

  const setSurvivalPowerSave = (enabled: boolean) => {
    setState((prev) => ({
      ...prev,
      survival: {
        ...prev.survival,
        powerSaveActive: enabled,
      },
    }));
  };

  const recordSurvivalDailyLog = (patch: Partial<SurvivalDailyLog>) => {
    setState((prev) => {
      if (prev.gameMode !== 'SURVIVAL_30') return prev;
      return {
        ...prev,
        survival: {
          ...prev.survival,
          dailyLog: {
            ...createEmptyDailyLog(),
            ...prev.survival.dailyLog,
            ...patch,
          },
        },
      };
    });
  };

  const executeSurvivalStationAction = (
    station: SurvivalStationId,
    details?: SurvivalActionDetails
  ) => {
    setState((prev) => {
      const nextSurvival = applySurvivalStationCompletion(prev.survival, station, details);
      return {
        ...prev,
        survival: {
          ...nextSurvival,
          playerLocation: station === 'MISSION_5' ? 'BUNKER' : 'BASE_HUB',
        },
        currentScene: 'BASE_HUB',
        activeModal: station === 'MISSION_5' ? 'BUNKER' : 'NONE',
      };
    });
  };

  const triggerSurvivalCrisis = (preferredType?: CrisisType) => {
    setState((prev) => {
      if (
        prev.gameMode !== 'SURVIVAL_30' ||
        prev.survival.gameStatus !== 'PLAYING' ||
        prev.survival.activeCrisis
      ) {
        return prev;
      }
      const spawnedCrisis = createSurvivalCrisis(prev.survival.sol, preferredType);
      return {
        ...prev,
        survival: {
          ...prev.survival,
          activeCrisis: spawnedCrisis,
          lastNoticeDescriptor: {
            kind: 'CRISIS_STARTED',
            crisisType: spawnedCrisis.type,
          },
        },
      };
    });
  };

  const tickSurvivalCrisis = () => {
    setState((prev) => {
      const crisis = prev.survival.activeCrisis;
      if (
        prev.gameMode !== 'SURVIVAL_30' ||
        prev.survival.gameStatus !== 'PLAYING' ||
        !crisis
      ) {
        return prev;
      }
      if (crisis.secondsLeft <= 1) {
        return {
          ...prev,
          survival: resolveSurvivalCrisisTimeout(prev.survival),
        };
      }
      return {
        ...prev,
        survival: {
          ...prev.survival,
          activeCrisis: {
            ...crisis,
            secondsLeft: crisis.secondsLeft - 1,
          },
        },
      };
    });
  };

  const interactSurvivalCrisis = () => {
    setState((prev) => {
      if (prev.gameMode !== 'SURVIVAL_30' || !prev.survival.activeCrisis) {
        return prev;
      }
      return {
        ...prev,
        survival: stepSurvivalCrisisProgress(prev.survival),
      };
    });
  };

  const resolveCrisisViaStation = () => {
    setState((prev) => {
      const crisis = prev.survival.activeCrisis;
      if (prev.gameMode !== 'SURVIVAL_30' || !crisis) return prev;
      const targetScene: GameSceneId = crisis.stationShortcut;
      const prepared = buildSurvivalPreparedPatch(prev, targetScene);
      return {
        ...prev,
        ...prepared,
        currentScene: targetScene,
        activeModal: 'NONE',
      };
    });
  };

  const toggleSurvivalClockPause = () => {
    setState((prev) => ({
      ...prev,
      survival: {
        ...prev.survival,
        clockPaused: !prev.survival.clockPaused,
      },
    }));
  };

  const toggleSurvivalFastForward2x = () => {
    setState((prev) => {
      if (!canFastForwardNight(prev.survival)) return prev;
      return {
        ...prev,
        survival: {
          ...prev.survival,
          fastForward2x: !prev.survival.fastForward2x,
        },
      };
    });
  };

  const toggleSurvivalBreaker = (
    key: Exclude<keyof SurvivalBreakers, 'lifeSupport'>
  ) => {
    setState((prev) => {
      const nextVal = !prev.survival.breakers[key];
      const nextBreakers: SurvivalBreakers = {
        ...prev.survival.breakers,
        [key]: nextVal,
      };
      const rationed = !nextBreakers.greenhouseLeds || !nextBreakers.orbitalRadar;
      return {
        ...prev,
        survival: {
          ...prev.survival,
          breakers: nextBreakers,
          stormEvent: {
            ...prev.survival.stormEvent,
            checklist: {
              ...prev.survival.stormEvent.checklist,
              breakersRationed:
                prev.survival.stormEvent.checklist.breakersRationed || rationed,
            },
          },
        },
      };
    });
  };

  const setSurvivalIndoorState = (insideHabitat: boolean) => {
    setState((prev) => ({
      ...prev,
      survival: {
        ...prev.survival,
        safeInsideHabitat: insideHabitat,
        playerLocation: insideHabitat ? 'HABITAT' : 'BASE_HUB',
        fastForward2x: insideHabitat ? prev.survival.fastForward2x : false,
      },
    }));
  };

  const setSurvivalInBunker = (inBunker: boolean) => {
    setState((prev) => ({
      ...prev,
      survival: {
        ...prev.survival,
        playerLocation: inBunker ? 'BUNKER' : 'BASE_HUB',
        safeInsideHabitat: inBunker ? true : prev.survival.safeInsideHabitat,
        stormProtectedToday: inBunker ? true : prev.survival.stormProtectedToday,
        stormEvent: {
          ...prev.survival.stormEvent,
          checklist: {
            ...prev.survival.stormEvent.checklist,
            inBunker,
          },
        },
      },
      activeModal: inBunker ? 'BUNKER' : 'NONE',
    }));
  };

  const sealStormHatchesQuick = () => {
    setState((prev) => ({
      ...prev,
      survival: {
        ...prev.survival,
        stormProtectedToday: true,
        stormEvent: {
          ...prev.survival.stormEvent,
          checklist: {
            ...prev.survival.stormEvent.checklist,
            hatchesSealed: true,
          },
        },
      },
    }));
  };

  const triggerSurvivalStormEvent = (
    preferredType?: 'GLOBAL_DUST_STORM' | 'SOLAR_RADIATION_FLARE'
  ) => {
    setState((prev) => {
      if (prev.gameMode !== 'SURVIVAL_30' || prev.survival.gameStatus !== 'PLAYING') {
        return prev;
      }
      const chosen =
        preferredType ??
        (Math.random() < 0.5 ? 'GLOBAL_DUST_STORM' : 'SOLAR_RADIATION_FLARE');
      return {
        ...prev,
        survival: startStormPrepEvent(prev.survival, chosen),
      };
    });
  };

  const interactGreenhousePlot = (plotId: number) => {
    setState((prev) => {
      if (prev.gameMode !== 'SURVIVAL_30') return prev;
      return {
        ...prev,
        survival: interactGreenhousePlotAction(prev.survival, plotId),
      };
    });
  };

  const resolveSurvivalFaint = () => {
    setState((prev) => {
      if (prev.gameMode !== 'SURVIVAL_30') return prev;
      const nextSurvival = resolveNightlySolTransition(prev.survival, 'FAINTED');
      const prepared =
        nextSurvival.gameStatus === 'PLAYING'
          ? buildSurvivalPreparedPatch(prev, undefined, nextSurvival.sol)
          : {};
      return {
        ...prev,
        ...prepared,
        survival: nextSurvival,
        currentScene: 'BASE_HUB',
        activeModal: 'NONE',
      };
    });
  };

  const restartSurvival30 = () => {
    setState((prev) => {
      const fresh = createInitialSurvival30State();
      const prepared = buildSurvivalPreparedPatch(prev, undefined, fresh.sol);
      return {
        ...prev,
        ...prepared,
        gameMode: 'SURVIVAL_30',
        survival: fresh,
        currentScene: 'BASE_HUB',
        activeModal: 'NONE',
      };
    });
  };

  const updateAstronaut = (patch: Partial<AstronautProfile>) => {
    setState((prev) => ({
      ...prev,
      astronaut: { ...prev.astronaut, ...patch },
    }));
  };

  const updateStats = (patch: Partial<GameStats>) => {
    setState((prev) => ({
      ...prev,
      stats: { ...prev.stats, ...patch },
    }));
  };

  const updateMission1 = (patch: Partial<Mission1State>) => {
    setState((prev) => ({
      ...prev,
      mission1: { ...prev.mission1, ...patch },
    }));
  };

  const updateMission2 = (patch: Partial<Mission2State>) => {
    setState((prev) => {
      const nextMission2 = { ...prev.mission2, ...patch };
      if (prev.gameMode !== 'SURVIVAL_30') {
        return {
          ...prev,
          mission2: nextMission2,
        };
      }

      const prevLog = {
        ...createEmptyDailyLog(),
        ...prev.survival.dailyLog,
      };
      let nextTrainedToday = prev.survival.trainedToday;
      const nextDailyLog: SurvivalDailyLog = { ...prevLog };

      if (nextMission2.exercisesCompleted.length > 0) {
        nextTrainedToday = true;
        nextDailyLog.exercised = true;
        nextDailyLog.exerciseCount = nextMission2.exercisesCompleted.length;
        nextDailyLog.exerciseSummary =
          nextMission2.exercisesCompleted.length >= 4
            ? 'Treino gravitacional concluído (4/4 exercícios)'
            : `Treino gravitacional realizado (${nextMission2.exercisesCompleted.length}/4 exercícios)`;
      }

      if (nextMission2.hygieneCompleted) {
        nextDailyLog.hygieneCompleted = true;
        nextDailyLog.hygieneSummary = 'Ambiente, mãos e luvas esterilizados';
      }

      return {
        ...prev,
        mission2: nextMission2,
        survival: {
          ...prev.survival,
          trainedToday: nextTrainedToday,
          dailyLog: nextDailyLog,
        },
      };
    });
  };

  const updateMission3 = (patch: Partial<Mission3State>) => {
    setState((prev) => ({
      ...prev,
      mission3: { ...prev.mission3, ...patch },
    }));
  };

  const updateMission4 = (patch: Partial<Mission4State>) => {
    setState((prev) => ({
      ...prev,
      mission4: { ...prev.mission4, ...patch },
    }));
  };

  const updateMission5 = (patch: Partial<Mission5State>) => {
    setState((prev) => {
      const nextM5 = { ...prev.mission5, ...patch };
      return {
        ...prev,
        survival30Unlocked:
          prev.survival30Unlocked ||
          nextM5.mission5Completed ||
          nextM5.endingUnlocked,
        mission5: nextM5,
      };
    });
  };

  const transmitAllLogsToEarth = () => {
    setState((prev) => ({
      ...prev,
      survival30Unlocked: true,
      mission5: {
        ...prev.mission5,
        earthTransmissionCompleted: true,
      },
      logbook: prev.logbook.map((item) => ({
        ...item,
        savedInShipServer: true,
        transmittedToEarth: true,
      })),
      lastEarthSyncStatus:
        'Relatório Geral da Expedição transmitido e confirmado pela Central Terrestre da NASA!',
    }));
  };

  const installSolarSystem = (watts: number) => {
    setState((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        solarInstalled: true,
        energy: 100,
      },
      mission1: {
        ...prev.mission1,
        generatedWatts: watts,
        phase: 'STEP_3_TEST',
      },
    }));
  };

  const completeMission3WaterDiscovery = () => {
    setState((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        water: 100,
      },
      mission3: {
        ...prev.mission3,
        waterApproved: true,
      },
    }));
  };

  const completeMission2SleepScene = (earthConnected: boolean) => {
    setState((prev) => {
      const nextSol = Math.max(2, prev.stats.sol + 1);
      return {
        ...prev,
        stats: {
          ...prev.stats,
          sol: nextSol,
          health: 100,
          water: Math.max(70, prev.stats.water),
        },
        mission2: {
          ...prev.mission2,
          phase: 'COMPLETED',
          mission2Completed: true,
          mission3Unlocked: true,
        },
        healthSimulation: buildSyncedHealthSimulation(
          prev,
          `Sol ${nextSol}: Rotina física, nutricional e de higiene concluída! Missão 3 desbloqueada.`,
          8.5,
          'Excelente',
          70
        ),
        logbook: prev.logbook.map((item) => ({
          ...item,
          savedInShipServer: true,
          transmittedToEarth: earthConnected ? true : item.transmittedToEarth,
        })),
        lastEarthSyncStatus: earthConnected
          ? `Relatório da Missão 2 transmitido à Terra no Sol ${prev.stats.sol}.`
          : `Sem sinal direto no Sol ${prev.stats.sol}: relatório da Missão 2 salvo no servidor da nave.`,
      };
    });
  };

  const openModal = (modal: ActiveModalType) => {
    setState((prev) => ({
      ...prev,
      activeModal: modal,
      healthSimulation:
        modal === 'SLEEP_REPORT'
          ? buildSyncedHealthSimulation(prev)
          : prev.healthSimulation,
    }));
  };

  const addLogbookEntry = (entry: {
    sceneLabel: string;
    event: string;
    observedAspect: string;
    photoDataUrl: string;
  }) => {
    const newEntry: LogbookEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      sol: state.stats.sol,
      timestamp: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      sceneLabel: entry.sceneLabel,
      event: entry.event,
      observedAspect: entry.observedAspect,
      photoDataUrl: entry.photoDataUrl,
      savedInShipServer: true,
      transmittedToEarth: false,
    };

    const marksMission1Diary =
      state.currentScene === 'MISSION_1' || entry.sceneLabel === 'MISSION_1';
    const marksMission2Diary =
      state.currentScene === 'MISSION_2' || entry.sceneLabel === 'MISSION_2';
    const marksMission3Diary =
      state.currentScene === 'MISSION_3' || entry.sceneLabel === 'MISSION_3';
    const marksMission4Diary =
      state.currentScene === 'MISSION_4' || entry.sceneLabel === 'MISSION_4';
    const marksMission5Diary =
      state.currentScene === 'MISSION_5' || entry.sceneLabel === 'MISSION_5';

    setState((prev) => ({
      ...prev,
      mission1: marksMission1Diary
        ? { ...prev.mission1, loggedInDiary: true }
        : prev.mission1,
      mission2: marksMission2Diary
        ? { ...prev.mission2, loggedInDiary: true }
        : prev.mission2,
      mission3: marksMission3Diary
        ? { ...prev.mission3, loggedInDiary: true }
        : prev.mission3,
      mission4: marksMission4Diary
        ? { ...prev.mission4, loggedInDiary: true }
        : prev.mission4,
      mission5: marksMission5Diary
        ? { ...prev.mission5, loggedInDiary: true }
        : prev.mission5,
      logbook: [newEntry, ...prev.logbook],
    }));
  };

  const completeSleepCycle = (earthConnected: boolean) => {
    setState((prev) => {
      if (prev.gameMode === 'SURVIVAL_30') {
        const nextSurvival = resolveNightlySolTransition(prev.survival);
        const prepared =
          nextSurvival.gameStatus === 'PLAYING'
            ? buildSurvivalPreparedPatch(prev, undefined, nextSurvival.sol)
            : {};

        return {
          ...prev,
          ...prepared,
          survival: nextSurvival,
          currentScene: 'BASE_HUB',
          lastEarthSyncStatus: earthConnected
            ? `Telemetria do Sol ${prev.survival.sol}/30 enviada à Terra.`
            : `Telemetria do Sol ${prev.survival.sol}/30 salva no servidor de bordo.`,
        };
      }

      const canFinishMission1 =
        prev.stats.solarInstalled &&
        prev.mission1.dustCleaned &&
        prev.mission1.powerSaveTested;

      const canFinishMission2 =
        prev.mission2.phase === 'STEP_4_SLEEP' ||
        prev.mission2.phase === 'COMPLETED' ||
        (prev.mission2.exercisesCompleted.length >= 4 &&
          prev.mission2.nutritionCompleted &&
          prev.mission2.hygieneCompleted);

      const canFinishMission3 = prev.mission3.waterApproved;

      const canFinishMission4 =
        prev.mission4.phase === 'COMPLETED' ||
        (prev.mission4.bioregLinks.foodProduction &&
          prev.mission4.bioregLinks.airRevitalization &&
          prev.mission4.bioregLinks.waterRecycling);

      const canFinishMission5 =
        prev.mission5.phase === 'COMPLETED' ||
        (prev.mission5.postStormInspection.solarPanels &&
          prev.mission5.postStormInspection.habitatStructure &&
          prev.mission5.postStormInspection.greenhouseDome &&
          prev.mission5.postStormInspection.commsSystems);

      const nextSol = canFinishMission2
        ? Math.max(2, prev.stats.sol + 1)
        : prev.stats.sol + 1;

      const note = canFinishMission5
        ? `Sol ${nextSol}: Relatório de segurança e exposição à radiação validados! Central de Comunicação com a Terra (Cena 6) liberada.`
        : canFinishMission4
        ? `Sol ${nextSol}: Relatório da estufa e sistema bioregenerativo atualizados! Missão 5 desbloqueada.`
        : canFinishMission3
        ? `Sol ${nextSol}: Descoberta de gelo e purificação de água concluídas! Missão 4 desbloqueada.`
        : canFinishMission2
        ? `Sol ${nextSol}: Saúde e sono monitorados (NASA Spaceflight Standard Measures)! Missão 3 desbloqueada.`
        : canFinishMission1
        ? `Sol ${nextSol}: Missão 1 concluída! Missão 2 desbloqueada para o novo dia.`
        : `Sol ${nextSol}: recuperação de ciclo concluída com sucesso.`;

      return {
        ...prev,
        survival30Unlocked: prev.survival30Unlocked || canFinishMission5,
        stats: {
          ...prev.stats,
          sol: nextSol,
          health: 100,
          energy: canFinishMission5 ? 100 : prev.stats.energy,
          water: canFinishMission3 ? 100 : prev.stats.water,
        },
        mission1: canFinishMission1
          ? {
              ...prev.mission1,
              phase: 'COMPLETED',
              mission1Completed: true,
              mission2Unlocked: true,
            }
          : prev.mission1,
        mission2: canFinishMission2
          ? {
              ...prev.mission2,
              phase: 'COMPLETED',
              mission2Completed: true,
              mission3Unlocked: true,
            }
          : prev.mission2,
        mission3: canFinishMission3
          ? {
              ...prev.mission3,
              phase: 'COMPLETED',
              mission3Completed: true,
              mission4Unlocked: true,
            }
          : prev.mission3,
        mission4: canFinishMission4
          ? {
              ...prev.mission4,
              phase: 'COMPLETED',
              mission4Completed: true,
              mission5Unlocked: true,
            }
          : prev.mission4,
        mission5: canFinishMission5
          ? {
              ...prev.mission5,
              phase: 'COMPLETED',
              mission5Completed: true,
              endingUnlocked: true,
            }
          : prev.mission5,
        healthSimulation: buildSyncedHealthSimulation(
          prev,
          note,
          canFinishMission2 ? 8.5 : 8.4,
          'Excelente',
          canFinishMission2 ? 70 : 72
        ),
        logbook: prev.logbook.map((item) => ({
          ...item,
          savedInShipServer: true,
          transmittedToEarth: earthConnected ? true : item.transmittedToEarth,
        })),
        lastEarthSyncStatus: earthConnected
          ? `Dados transmitidos à Terra no Sol ${prev.stats.sol}.`
          : `Sem sinal direto no Sol ${prev.stats.sol}: dados salvos no servidor da nave.`,
      };
    });
  };

  const markCapiDialogSeen = (
    dialogId?: string,
    options?: { resumeSurvivalClock?: boolean }
  ) => {
    setState((prev) => {
      const nextSeen =
        dialogId && !prev.seenCapiDialogs.includes(dialogId)
          ? [...prev.seenCapiDialogs, dialogId]
          : prev.seenCapiDialogs;
      if (nextSeen !== prev.seenCapiDialogs) {
        saveSeenCapiDialogs(nextSeen);
      }
      const shouldResumeClock =
        options?.resumeSurvivalClock !== false &&
        prev.gameMode === 'SURVIVAL_30' &&
        prev.survival.clockPaused;
      if (nextSeen === prev.seenCapiDialogs && !shouldResumeClock) {
        return prev;
      }
      return {
        ...prev,
        seenCapiDialogs: nextSeen,
        survival: shouldResumeClock
          ? { ...prev.survival, clockPaused: false }
          : prev.survival,
      };
    });
  };

  const resetGame = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(SEEN_DIALOGS_STORAGE_KEY);
    } catch {
      // ignore
    }
    setState({ ...DEFAULT_STATE });
  };

  return React.createElement(
    GameContext.Provider,
    {
      value: {
        state,
        setScene,
        startSurvivalMode,
        toggleGameMode,
        setSurvivalPowerSave,
        executeSurvivalStationAction,
        recordSurvivalDailyLog,
        triggerSurvivalCrisis,
        tickSurvivalCrisis,
        interactSurvivalCrisis,
        resolveCrisisViaStation,
        toggleSurvivalClockPause,
        toggleSurvivalFastForward2x,
        toggleSurvivalBreaker,
        setSurvivalIndoorState,
        setSurvivalInBunker,
        sealStormHatchesQuick,
        triggerSurvivalStormEvent,
        interactGreenhousePlot,
        resolveSurvivalFaint,
        restartSurvival30,
        updateAstronaut,
        updateStats,
        updateMission1,
        updateMission2,
        updateMission3,
        updateMission4,
        updateMission5,
        transmitAllLogsToEarth,
        installSolarSystem,
        completeMission2SleepScene,
        completeMission3WaterDiscovery,
        openModal,
        addLogbookEntry,
        completeSleepCycle,
        markCapiDialogSeen,
        resetGame,
      },
    },
    children
  );
};

export function useGameStore(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGameStore deve ser usado dentro de GameProvider');
  }
  return ctx;
}
