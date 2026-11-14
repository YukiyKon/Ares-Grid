import React, { createContext, useContext, useEffect, useState } from 'react';

export type GameSceneId =
  | 'COUNTDOWN'
  | 'LAUNCH'
  | 'CAPI_INTRO'
  | 'CUSTOMIZE'
  | 'LANDING'
  | 'BASE_HUB';

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
  healthSimulation: HealthSimulationData;
  logbook: LogbookEntry[];
  lastEarthSyncStatus: string;
  activeModal: ActiveModalType;
}

const STORAGE_KEY = 'arcadia_planitia_state_v1';

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

interface GameContextValue {
  state: GameState;
  setScene: (scene: GameSceneId) => void;
  updateAstronaut: (patch: Partial<AstronautProfile>) => void;
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

  const openModal = (modal: ActiveModalType) => {
    setState((prev) => ({ ...prev, activeModal: modal }));
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

    setState((prev) => ({
      ...prev,
      logbook: [newEntry, ...prev.logbook],
    }));
  };

  const completeSleepCycle = (earthConnected: boolean) => {
    setState((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        sol: prev.stats.sol + 1,
        health: 100,
      },
      healthSimulation: {
        ...prev.healthSimulation,
        sleepHours: 8.4,
        sleepQuality: 'Excelente',
        simulatedHeartRateBpm: 72,
        adaptationNote: `Sol ${prev.stats.sol + 1}: recuperação simulada concluída com sucesso.`,
      },
      logbook: prev.logbook.map((item) => ({
        ...item,
        savedInShipServer: true,
        transmittedToEarth: earthConnected ? true : item.transmittedToEarth,
      })),
      lastEarthSyncStatus: earthConnected
        ? `Dados transmitidos à Terra no Sol ${prev.stats.sol}.`
        : `Sem sinal direto no Sol ${prev.stats.sol}: dados salvos no servidor da nave.`,
    }));
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
