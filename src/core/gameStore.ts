import React, { createContext, useContext, useEffect, useState } from 'react';
import type {
  MarsSeasonId,
  MarsSolarHourId,
  PanelAzimuthId,
} from '../missions/mission1-solar/mars24SolarMath';

export type GameSceneId =
  | 'COUNTDOWN'
  | 'LAUNCH'
  | 'CAPI_INTRO'
  | 'CUSTOMIZE'
  | 'LANDING'
  | 'BASE_HUB'
  | 'MISSION_1'
  | 'MISSION_2'
  | 'MISSION_3';

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

export type ActiveModalType = 'NONE' | 'LOGBOOK' | 'SLEEP_REPORT';

export interface GameState {
  currentScene: GameSceneId;
  astronaut: AstronautProfile;
  stats: GameStats;
  mission1: Mission1State;
  mission2: Mission2State;
  mission3: Mission3State;
  healthSimulation: HealthSimulationData;
  logbook: LogbookEntry[];
  lastEarthSyncStatus: string;
  activeModal: ActiveModalType;
}

const STORAGE_KEY = 'arcadia_planitia_state_v1';

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

const DEFAULT_STATE: GameState = {
  currentScene: 'COUNTDOWN',
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
  healthSimulation: {
    sleepHours: 8.2,
    sleepQuality: 'Boa',
    exercisesDone: ['Treinamento pré-voo concluído', 'Alongamento de adaptação (simulado)'],
    nutritionStatus: 'Ração espacial balanceada (simulada)',
    hydrationLevel: 'Adequada (85% reservatório)',
    hygieneChecked: true,
    simulatedHeartRateBpm: 76,
    adaptationNote: 'Adaptação inicial à gravidade marciana (~0,38g) monitorada.',
  },
  logbook: [],
  lastEarthSyncStatus: 'Aguardando primeira transmissão orbital.',
  activeModal: 'NONE',
};

function loadInitialState(): GameState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<GameState>;
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
      healthSimulation: {
        ...DEFAULT_STATE.healthSimulation,
        ...(parsed.healthSimulation ?? {}),
      },
      logbook: Array.isArray(parsed.logbook) ? parsed.logbook : [],
      activeModal: 'NONE',
    };
  } catch {
    return DEFAULT_STATE;
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
  updateAstronaut: (patch: Partial<AstronautProfile>) => void;
  updateStats: (patch: Partial<GameStats>) => void;
  updateMission1: (patch: Partial<Mission1State>) => void;
  updateMission2: (patch: Partial<Mission2State>) => void;
  updateMission3: (patch: Partial<Mission3State>) => void;
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

  const setScene = (scene: GameSceneId) => {
    setState((prev) => ({ ...prev, currentScene: scene }));
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
    setState((prev) => ({
      ...prev,
      mission2: { ...prev.mission2, ...patch },
    }));
  };

  const updateMission3 = (patch: Partial<Mission3State>) => {
    setState((prev) => ({
      ...prev,
      mission3: { ...prev.mission3, ...patch },
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
      logbook: [newEntry, ...prev.logbook],
    }));
  };

  const completeSleepCycle = (earthConnected: boolean) => {
    setState((prev) => {
      const canFinishMission1 =
        prev.stats.solarInstalled &&
        prev.mission1.dustCleaned &&
        prev.mission1.powerSaveTested;

      const canFinishMission2 =
        prev.currentScene === 'MISSION_2' ||
        (prev.mission2.exercisesCompleted.length >= 4 &&
          prev.mission2.nutritionCompleted &&
          prev.mission2.hygieneCompleted);

      const canFinishMission3 = prev.mission3.waterApproved;

      const nextSol = canFinishMission2
        ? Math.max(2, prev.stats.sol + 1)
        : prev.stats.sol + 1;

      const note = canFinishMission3
        ? `Sol ${nextSol}: Descoberta de gelo e purificação de água concluídas! Missão 4 desbloqueada.`
        : canFinishMission2
        ? `Sol ${nextSol}: Saúde e sono monitorados (NASA Spaceflight Standard Measures)! Missão 3 desbloqueada.`
        : canFinishMission1
        ? `Sol ${nextSol}: Missão 1 concluída! Missão 2 desbloqueada para o novo dia.`
        : `Sol ${nextSol}: recuperação simulada concluída com sucesso.`;

      return {
        ...prev,
        stats: {
          ...prev.stats,
          sol: nextSol,
          health: 100,
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

  const resetGame = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
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
        updateAstronaut,
        updateStats,
        updateMission1,
        updateMission2,
        updateMission3,
        installSolarSystem,
        completeMission2SleepScene,
        completeMission3WaterDiscovery,
        openModal,
        addLogbookEntry,
        completeSleepCycle,
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
