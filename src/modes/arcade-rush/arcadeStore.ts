import { useEffect, useState } from 'react';

/**
 * Mode 3 — Arcade Rush: progresso persistente (recorde, estrelas, pontos acumulados)
 * e cosméticos desbloqueáveis que aparecem nos sprites reais do jogo.
 * Persistido em localStorage na chave `astro_capi_arcade`.
 */

export const ARCADE_STORAGE_KEY = 'astro_capi_arcade';
const ARCADE_CHANGE_EVENT = 'astro-capi-arcade-change';

export type MicroGameId = 'SCRUB' | 'DRILL' | 'SEAL' | 'FILL' | 'HARVEST' | 'RUN' | 'SYNC';

export const MICRO_GAME_IDS: MicroGameId[] = [
  'SCRUB',
  'DRILL',
  'SEAL',
  'FILL',
  'HARVEST',
  'RUN',
  'SYNC',
];

export type SuitSkinId = 'standard_orange' | 'golden_visor' | 'cyber_neon' | 'galaxy_star';
export type RoverSkinId = 'nasa_white' | 'mars_gold' | 'turbo_red';
export type CapiAccessoryId = 'blue_cap' | 'star_sunglasses' | 'golden_crown' | 'mini_jetpack';
export type CosmeticId = SuitSkinId | RoverSkinId | CapiAccessoryId;
export type CosmeticCategory = 'SUIT' | 'ROVER' | 'CAPI';

export interface CosmeticItem {
  id: CosmeticId;
  category: CosmeticCategory;
  /** Pontos acumulados (lifetime) no Arcade Rush necessários para desbloquear */
  cost: number;
}

export const COSMETIC_CATALOG: CosmeticItem[] = [
  { id: 'standard_orange', category: 'SUIT', cost: 0 },
  { id: 'golden_visor', category: 'SUIT', cost: 500 },
  { id: 'cyber_neon', category: 'SUIT', cost: 1500 },
  { id: 'galaxy_star', category: 'SUIT', cost: 3000 },
  { id: 'nasa_white', category: 'ROVER', cost: 0 },
  { id: 'mars_gold', category: 'ROVER', cost: 800 },
  { id: 'turbo_red', category: 'ROVER', cost: 2000 },
  { id: 'blue_cap', category: 'CAPI', cost: 0 },
  { id: 'star_sunglasses', category: 'CAPI', cost: 1000 },
  { id: 'golden_crown', category: 'CAPI', cost: 2500 },
  { id: 'mini_jetpack', category: 'CAPI', cost: 4000 },
];

export interface ArcadeEquipped {
  suit: SuitSkinId;
  rover: RoverSkinId;
  capi: CapiAccessoryId;
}

export interface ArcadeProgress {
  highScore: number;
  bestCombo: number;
  bestStars: number;
  totalPoints: number;
  totalStars: number;
  gamesPlayed: number;
  equipped: ArcadeEquipped;
  /** Itens já vistos na Garagem (para exibir selo NEW!) */
  seenUnlocks: CosmeticId[];
}

export const DEFAULT_ARCADE_PROGRESS: ArcadeProgress = {
  highScore: 0,
  bestCombo: 0,
  bestStars: 0,
  totalPoints: 0,
  totalStars: 0,
  gamesPlayed: 0,
  equipped: {
    suit: 'standard_orange',
    rover: 'nasa_white',
    capi: 'blue_cap',
  },
  seenUnlocks: ['standard_orange', 'nasa_white', 'blue_cap'],
};

const CATALOG_IDS = new Set<string>(COSMETIC_CATALOG.map((item) => item.id));

function safeNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : fallback;
}

function pickEquipped<T extends CosmeticId>(
  value: unknown,
  category: CosmeticCategory,
  fallback: T
): T {
  if (typeof value !== 'string' || !CATALOG_IDS.has(value)) return fallback;
  const item = COSMETIC_CATALOG.find((c) => c.id === value);
  return item && item.category === category ? (value as T) : fallback;
}

export function loadArcadeProgress(): ArcadeProgress {
  if (typeof window === 'undefined') return DEFAULT_ARCADE_PROGRESS;
  try {
    const raw = window.localStorage.getItem(ARCADE_STORAGE_KEY);
    if (!raw) return DEFAULT_ARCADE_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<ArcadeProgress> | null;
    if (!parsed || typeof parsed !== 'object') return DEFAULT_ARCADE_PROGRESS;

    const totalPoints = safeNumber(parsed.totalPoints);
    const equippedRaw = (parsed.equipped ?? {}) as Partial<ArcadeEquipped>;
    const progress: ArcadeProgress = {
      highScore: safeNumber(parsed.highScore),
      bestCombo: safeNumber(parsed.bestCombo),
      bestStars: Math.min(3, safeNumber(parsed.bestStars)),
      totalPoints,
      totalStars: safeNumber(parsed.totalStars),
      gamesPlayed: safeNumber(parsed.gamesPlayed),
      equipped: {
        suit: pickEquipped(equippedRaw.suit, 'SUIT', DEFAULT_ARCADE_PROGRESS.equipped.suit),
        rover: pickEquipped(equippedRaw.rover, 'ROVER', DEFAULT_ARCADE_PROGRESS.equipped.rover),
        capi: pickEquipped(equippedRaw.capi, 'CAPI', DEFAULT_ARCADE_PROGRESS.equipped.capi),
      },
      seenUnlocks: Array.isArray(parsed.seenUnlocks)
        ? (parsed.seenUnlocks.filter((id) => CATALOG_IDS.has(id)) as CosmeticId[])
        : DEFAULT_ARCADE_PROGRESS.seenUnlocks,
    };

    // Nunca permite equipar algo ainda bloqueado (ex.: storage editado manualmente)
    if (!isCosmeticUnlocked(progress.equipped.suit, totalPoints)) {
      progress.equipped.suit = DEFAULT_ARCADE_PROGRESS.equipped.suit;
    }
    if (!isCosmeticUnlocked(progress.equipped.rover, totalPoints)) {
      progress.equipped.rover = DEFAULT_ARCADE_PROGRESS.equipped.rover;
    }
    if (!isCosmeticUnlocked(progress.equipped.capi, totalPoints)) {
      progress.equipped.capi = DEFAULT_ARCADE_PROGRESS.equipped.capi;
    }

    return progress;
  } catch {
    return DEFAULT_ARCADE_PROGRESS;
  }
}

export function saveArcadeProgress(progress: ArcadeProgress): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(ARCADE_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignora cota cheia / modo privado
  }
  window.dispatchEvent(new CustomEvent(ARCADE_CHANGE_EVENT));
}

export function getCosmetic(id: CosmeticId): CosmeticItem {
  return COSMETIC_CATALOG.find((item) => item.id === id) ?? COSMETIC_CATALOG[0];
}

export function isCosmeticUnlocked(id: CosmeticId, totalPoints: number): boolean {
  return totalPoints >= getCosmetic(id).cost;
}

export function getUnlockedIds(totalPoints: number): CosmeticId[] {
  return COSMETIC_CATALOG.filter((item) => totalPoints >= item.cost).map((item) => item.id);
}

/** Tempo limite de cada micro-game: começa em 9s e cai 0,75s a cada 4 rodadas até 4,5s */
export function getRoundTimeLimitMs(round: number): number {
  const tier = Math.floor(Math.max(0, round - 1) / 4);
  return Math.max(4500, 9000 - tier * 750);
}

export function getSpeedTier(round: number): number {
  return Math.min(6, Math.floor(Math.max(0, round - 1) / 4));
}

/** Multiplicador de combo: x1 (1-2 acertos seguidos), x2 (3-5), x3 (6-8), x4 (9+) */
export function getComboMultiplier(streak: number): number {
  return Math.min(4, 1 + Math.floor(Math.max(0, streak) / 3));
}

export function computeRoundPoints(streak: number, remainingFraction: number): number {
  const clamped = Math.max(0, Math.min(1, remainingFraction));
  return Math.round(100 * getComboMultiplier(streak) + 50 * clamped);
}

export function computeStars(score: number): 1 | 2 | 3 {
  if (score >= 2500) return 3;
  if (score >= 1000) return 2;
  return 1;
}

export interface ArcadeRunResult {
  stars: 1 | 2 | 3;
  isNewHighScore: boolean;
  newlyUnlocked: CosmeticId[];
  progress: ArcadeProgress;
}

export function recordArcadeRun(score: number, maxCombo: number): ArcadeRunResult {
  const prev = loadArcadeProgress();
  const stars = computeStars(score);
  const beforeUnlocked = new Set(getUnlockedIds(prev.totalPoints));
  const totalPoints = prev.totalPoints + Math.max(0, Math.floor(score));
  const newlyUnlocked = getUnlockedIds(totalPoints).filter((id) => !beforeUnlocked.has(id));

  const progress: ArcadeProgress = {
    ...prev,
    highScore: Math.max(prev.highScore, score),
    bestCombo: Math.max(prev.bestCombo, maxCombo),
    bestStars: Math.max(prev.bestStars, stars),
    totalPoints,
    totalStars: prev.totalStars + stars,
    gamesPlayed: prev.gamesPlayed + 1,
  };

  saveArcadeProgress(progress);
  return {
    stars,
    isNewHighScore: score > prev.highScore && score > 0,
    newlyUnlocked,
    progress,
  };
}

export function equipCosmetic(id: CosmeticId): ArcadeProgress {
  const prev = loadArcadeProgress();
  if (!isCosmeticUnlocked(id, prev.totalPoints)) return prev;
  const item = getCosmetic(id);
  const slot = item.category === 'SUIT' ? 'suit' : item.category === 'ROVER' ? 'rover' : 'capi';
  const next: ArcadeProgress = {
    ...prev,
    equipped: { ...prev.equipped, [slot]: id },
  };
  saveArcadeProgress(next);
  return next;
}

export function markUnlocksSeen(): void {
  const prev = loadArcadeProgress();
  const unlocked = getUnlockedIds(prev.totalPoints);
  if (unlocked.every((id) => prev.seenUnlocks.includes(id))) return;
  saveArcadeProgress({ ...prev, seenUnlocks: unlocked });
}

/** Hook reativo: qualquer componente (avatar, rover, Capi) re-renderiza ao equipar itens */
export function useArcadeProgress(): ArcadeProgress {
  const [progress, setProgress] = useState<ArcadeProgress>(() => loadArcadeProgress());

  useEffect(() => {
    const refresh = () => setProgress(loadArcadeProgress());
    const onStorage = (e: StorageEvent) => {
      if (e.key === ARCADE_STORAGE_KEY) refresh();
    };
    window.addEventListener(ARCADE_CHANGE_EVENT, refresh);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(ARCADE_CHANGE_EVENT, refresh);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  return progress;
}
