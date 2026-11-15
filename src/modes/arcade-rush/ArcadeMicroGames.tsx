import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Droplets,
  Flame,
  Hand,
  Lock,
  MoveRight,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { DustScrubCanvas } from '../../components/minigames/DustScrubCanvas';
import { AstronautAvatar } from '../../components/permanent/AstronautAvatar';
import { type AstronautProfile } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';
import { useLanguage } from '../../i18n/LanguageContext';
import type { MicroGameId } from './arcadeStore';

export interface MicroGameComponentProps {
  roundKey: number;
  speedTier: number;
  profile: AstronautProfile;
  paused: boolean;
  onWin: () => void;
  onFail: () => void;
}

/* ============================================================================
 * 1. SCRUB! (Limpar painel solar usando DustScrubCanvas)
 * ============================================================================ */
const ScrubMicroGame: React.FC<MicroGameComponentProps> = ({
  roundKey,
  onWin,
}) => {
  const [pct, setPct] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    doneRef.current = false;
    setPct(0);
  }, [roundKey]);

  return (
    <div className="touch-none select-none flex flex-col items-center gap-3">
      <div className="relative">
        <DustScrubCanvas
          cleanImageSrc={ASSET_MANIFEST.solarPanelClean.path}
          cleanImageAlt={ASSET_MANIFEST.solarPanelClean.alt}
          activeDust={!doneRef.current}
          dustKey={roundKey}
          onScrubProgress={setPct}
          onScrubComplete={() => {
            if (doneRef.current) return;
            doneRef.current = true;
            onWin();
          }}
        />
        {pct < 20 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-1 rounded-full bg-slate-950/75 px-3 py-1.5 text-amber-300 shadow-lg animate-bounce">
              <Hand className="h-5 w-5" />
              <MoveRight className="h-5 w-5" />
            </div>
          </div>
        )}
      </div>

      <div className="h-3 w-48 overflow-hidden rounded-sm border-2 border-slate-700 bg-slate-900">
        <div
          style={{ width: `${pct}%` }}
          className="h-full bg-emerald-400 transition-[width] duration-75"
        />
      </div>
    </div>
  );
};

/* ============================================================================
 * 2. DRILL! (Segurar e soltar a broca térmica até a zona verde sem superaquecer)
 * ============================================================================ */
const DrillMicroGame: React.FC<MicroGameComponentProps> = ({
  roundKey,
  speedTier,
  paused,
  onWin,
  onFail,
}) => {
  const { dict } = useLanguage();
  const [depth, setDepth] = useState(0);
  const [heat, setHeat] = useState(12);
  const [holding, setHolding] = useState(false);

  const depthRef = useRef(0);
  const heatRef = useRef(12);
  const holdingRef = useRef(false);
  const settledRef = useRef(false);
  const lastSoundRef = useRef(0);

  useEffect(() => {
    depthRef.current = 0;
    heatRef.current = 12;
    holdingRef.current = false;
    settledRef.current = false;
    setDepth(0);
    setHeat(12);
    setHolding(false);
  }, [roundKey]);

  useEffect(() => {
    if (paused) return;
    const drillRate = 0.95 + speedTier * 0.08; // ~2.4s total drilling
    const heatRate = 1.45 + speedTier * 0.14; // requires 1 quick cool pulse
    const coolRate = 1.85;

    const timer = window.setInterval(() => {
      if (settledRef.current) return;

      if (holdingRef.current) {
        heatRef.current = Math.min(100, heatRef.current + heatRate);
        depthRef.current = Math.min(100, depthRef.current + drillRate);

        const now = performance.now();
        if (now - lastSoundRef.current > 110) {
          soundEngine.playChargePulse(depthRef.current / 100);
          lastSoundRef.current = now;
        }
      } else {
        heatRef.current = Math.max(8, heatRef.current - coolRate);
      }

      setHeat(Math.round(heatRef.current));
      setDepth(Math.round(depthRef.current));

      if (heatRef.current >= 100) {
        settledRef.current = true;
        holdingRef.current = false;
        setHolding(false);
        onFail();
      } else if (depthRef.current >= 86) {
        settledRef.current = true;
        holdingRef.current = false;
        setHolding(false);
        onWin();
      }
    }, 25);

    return () => window.clearInterval(timer);
  }, [onFail, onWin, paused, speedTier]);

  const setHoldState = (next: boolean) => {
    if (settledRef.current) return;
    holdingRef.current = next;
    setHolding(next);
  };

  return (
    <div className="touch-none select-none flex w-full max-w-sm flex-col items-center gap-3">
      <div className="flex w-full items-center justify-center gap-5">
        {/* Broca visual + profundidade */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="relative flex h-36 w-20 flex-col justify-end overflow-hidden rounded-sm border-2 border-cyan-500/70 bg-slate-900">
            {/* Zona verde alvo */}
            <div
              style={{ height: '16%' }}
              className="w-full border-t-2 border-emerald-300 bg-emerald-500/35"
            />
            <div
              style={{ height: `${depth}%` }}
              className="absolute inset-x-0 top-0 bg-gradient-to-b from-amber-700/70 via-cyan-500/70 to-emerald-400 transition-[height] duration-75"
            />
            <img
              src={ASSET_MANIFEST.drillRig.path}
              alt={ASSET_MANIFEST.drillRig.alt}
              draggable={false}
              className={`pixel-art pointer-events-none relative z-10 mx-auto h-16 w-16 object-contain ${
                holding ? 'cabin-shake' : ''
              }`}
            />
          </div>
          <span className="font-pixel text-[9px] text-emerald-300">{depth}%</span>
        </div>

        {/* Medidor térmico */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="relative flex h-36 w-8 flex-col justify-end overflow-hidden rounded-sm border-2 border-slate-700 bg-slate-900">
            <div
              style={{ height: `${heat}%` }}
              className={`w-full transition-[height] duration-75 ${
                heat >= 78
                  ? 'animate-pulse bg-rose-500'
                  : heat >= 55
                  ? 'bg-amber-400'
                  : 'bg-sky-400'
              }`}
            />
          </div>
          <div className="flex items-center gap-1 font-pixel text-[9px] text-rose-300">
            <Flame className="h-3.5 w-3.5" />
            <span>{heat}%</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onPointerDown={(e) => {
          e.preventDefault();
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {
            // ignore
          }
          setHoldState(true);
        }}
        onPointerUp={() => setHoldState(false)}
        onPointerCancel={() => setHoldState(false)}
        className={`touch-none select-none pixel-btn flex min-h-[56px] w-full items-center justify-center gap-2 px-4 py-3 font-pixel text-xs ${
          holding
            ? 'bg-amber-400 text-slate-950 scale-[0.98]'
            : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
        }`}
      >
        <Hand className="h-5 w-5 animate-pulse" />
        <span>{dict.arcade.hold}</span>
      </button>
    </div>
  );
};

/* ============================================================================
 * 3. SEAL! (Arrastar rapidamente 3 travas de escotilha contra tempestade)
 * ============================================================================ */
const SealMicroGame: React.FC<MicroGameComponentProps> = ({
  roundKey,
  onWin,
}) => {
  const [locks, setLocks] = useState<[number, number, number]>([0, 0, 0]);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const settledRef = useRef(false);

  useEffect(() => {
    settledRef.current = false;
    setLocks([0, 0, 0]);
    setDraggingIdx(null);
  }, [roundKey]);

  const updateTrack = (idx: number, clientX: number) => {
    if (settledRef.current) return;
    const el = trackRefs.current[idx];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const rawPct = Math.round(
      ((clientX - rect.left) / Math.max(1, rect.width)) * 100
    );
    const pct = Math.max(0, Math.min(100, rawPct));
    const snapped = pct >= 82 ? 100 : pct;

    setLocks((prev) => {
      if (prev[idx] >= 100) return prev;
      const next: [number, number, number] = [...prev] as [number, number, number];
      next[idx] = snapped;
      if (snapped === 100) {
        soundEngine.playClick();
      }
      if (!settledRef.current && next.every((v) => v >= 100)) {
        settledRef.current = true;
        onWin();
      }
      return next;
    });
  };

  return (
    <div className="touch-none select-none flex w-full max-w-sm flex-col gap-3">
      {[0, 1, 2].map((idx) => {
        const val = locks[idx];
        const sealed = val >= 100;
        return (
          <div
            key={idx}
            ref={(el) => {
              trackRefs.current[idx] = el;
            }}
            onPointerDown={(e) => {
              if (sealed) return;
              e.preventDefault();
              try {
                e.currentTarget.setPointerCapture(e.pointerId);
              } catch {
                // ignore
              }
              setDraggingIdx(idx);
              updateTrack(idx, e.clientX);
            }}
            onPointerMove={(e) => {
              if (draggingIdx !== idx || sealed) return;
              e.preventDefault();
              updateTrack(idx, e.clientX);
            }}
            onPointerUp={() => setDraggingIdx(null)}
            onPointerCancel={() => setDraggingIdx(null)}
            className={`touch-none select-none relative flex h-14 w-full cursor-pointer items-center overflow-hidden rounded-sm border-2 ${
              sealed
                ? 'border-emerald-400 bg-emerald-950/60'
                : 'border-orange-400/80 bg-slate-900'
            }`}
          >
            <div
              style={{ width: `${val}%` }}
              className={`pointer-events-none absolute inset-y-0 left-0 ${
                sealed ? 'bg-emerald-500/40' : 'bg-amber-500/35'
              }`}
            />

            {!sealed && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-end pr-4 text-emerald-300/60">
                <MoveRight className="h-6 w-6 animate-pulse" />
              </div>
            )}

            <div
              style={{ left: `calc(${Math.min(84, val)}% + 4px)` }}
              className={`pointer-events-none absolute flex h-11 w-12 items-center justify-center rounded-sm border-2 shadow ${
                sealed
                  ? 'border-emerald-200 bg-emerald-400 text-slate-950'
                  : 'border-amber-200 bg-amber-400 text-slate-950'
              }`}
            >
              {sealed ? (
                <ShieldCheck className="h-5 w-5" />
              ) : (
                <Lock className="h-5 w-5" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ============================================================================
 * 4. FILL! (Segurar o dispensador de água e soltar na faixa verde)
 * ============================================================================ */
const TARGET_FILL_MIN = 62;
const TARGET_FILL_MAX = 84;

const FillMicroGame: React.FC<MicroGameComponentProps> = ({
  roundKey,
  speedTier,
  paused,
  onWin,
  onFail,
}) => {
  const { dict } = useLanguage();
  const [level, setLevel] = useState(0);
  const [pouring, setPouring] = useState(false);

  const levelRef = useRef(0);
  const pouringRef = useRef(false);
  const settledRef = useRef(false);
  const lastSoundRef = useRef(0);

  useEffect(() => {
    levelRef.current = 0;
    pouringRef.current = false;
    settledRef.current = false;
    setLevel(0);
    setPouring(false);
  }, [roundKey]);

  useEffect(() => {
    if (paused) return;
    const fillRate = 1.15 + speedTier * 0.14;

    const timer = window.setInterval(() => {
      if (settledRef.current || !pouringRef.current) return;
      levelRef.current = Math.min(100, levelRef.current + fillRate);
      setLevel(Math.round(levelRef.current));

      const now = performance.now();
      if (now - lastSoundRef.current > 100) {
        soundEngine.playChargePulse(levelRef.current / 100);
        lastSoundRef.current = now;
      }

      if (levelRef.current >= 98) {
        settledRef.current = true;
        pouringRef.current = false;
        setPouring(false);
        onFail();
      }
    }, 24);

    return () => window.clearInterval(timer);
  }, [onFail, paused, speedTier]);

  const handleRelease = () => {
    if (!pouringRef.current || settledRef.current) return;
    pouringRef.current = false;
    setPouring(false);

    if (levelRef.current >= TARGET_FILL_MIN && levelRef.current <= TARGET_FILL_MAX) {
      settledRef.current = true;
      onWin();
    } else if (levelRef.current > TARGET_FILL_MAX) {
      settledRef.current = true;
      onFail();
    }
  };

  const inZone = level >= TARGET_FILL_MIN && level <= TARGET_FILL_MAX;

  return (
    <div className="touch-none select-none flex w-full max-w-xs flex-col items-center gap-3">
      {/* Béquer transparente */}
      <div className="relative h-40 w-28 overflow-hidden rounded-b-lg border-4 border-t-2 border-cyan-300/80 bg-slate-900/90 shadow-inner">
        {/* Faixa verde alvo */}
        <div
          style={{
            bottom: `${TARGET_FILL_MIN}%`,
            height: `${TARGET_FILL_MAX - TARGET_FILL_MIN}%`,
          }}
          className="pointer-events-none absolute inset-x-0 z-10 border-y-2 border-emerald-300 bg-emerald-500/30"
        />

        {/* Jato de água animado quando segura */}
        {pouring && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 mx-auto h-full w-2 animate-pulse bg-sky-300/80" />
        )}

        {/* Água subindo */}
        <div
          style={{ height: `${level}%` }}
          className={`absolute inset-x-0 bottom-0 transition-[height] duration-75 ${
            level > TARGET_FILL_MAX
              ? 'bg-rose-400/85'
              : inZone
              ? 'bg-emerald-400/90'
              : 'bg-sky-400/85'
          }`}
        />

        <span className="relative z-20 flex h-full items-center justify-center font-pixel text-xs text-white drop-shadow">
          {level}%
        </span>
      </div>

      <button
        type="button"
        onPointerDown={(e) => {
          if (settledRef.current) return;
          e.preventDefault();
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {
            // ignore
          }
          pouringRef.current = true;
          setPouring(true);
        }}
        onPointerUp={handleRelease}
        onPointerCancel={handleRelease}
        className={`touch-none select-none pixel-btn flex min-h-[56px] w-full items-center justify-center gap-2 px-4 py-3 font-pixel text-xs ${
          pouring
            ? 'bg-sky-300 text-slate-950 scale-[0.98]'
            : 'bg-sky-400 text-slate-950 hover:bg-sky-300'
        }`}
      >
        <Droplets className="h-5 w-5 animate-bounce" />
        <span>{dict.arcade.hold}</span>
      </button>
    </div>
  );
};

/* ============================================================================
 * 5. HARVEST! (Tocar nos frutos maduros da estufa antes do tempo acabar)
 * ============================================================================ */
const CROP_EMOJIS = ['🍓', '🍅', '🥬', '🌶️', '🥕'];

const HarvestMicroGame: React.FC<MicroGameComponentProps> = ({
  roundKey,
  onWin,
}) => {
  const [picked, setPicked] = useState<boolean[]>([false, false, false, false, false]);
  const settledRef = useRef(false);

  useEffect(() => {
    settledRef.current = false;
    setPicked([false, false, false, false, false]);
  }, [roundKey]);

  const handlePick = (idx: number) => {
    if (settledRef.current) return;
    setPicked((prev) => {
      if (prev[idx]) return prev;
      soundEngine.playClick();
      const next = [...prev];
      next[idx] = true;
      if (!settledRef.current && next.every(Boolean)) {
        settledRef.current = true;
        onWin();
      }
      return next;
    });
  };

  return (
    <div className="touch-none select-none flex w-full max-w-sm flex-col items-center gap-3">
      <div className="relative grid w-full grid-cols-3 gap-2.5 rounded-sm border-2 border-emerald-500/60 bg-emerald-950/35 p-3">
        {CROP_EMOJIS.map((emoji, idx) => {
          const isDone = picked[idx];
          return (
            <button
              key={idx}
              type="button"
              disabled={isDone}
              onPointerDown={(e) => {
                e.preventDefault();
                handlePick(idx);
              }}
              className={`touch-none select-none pixel-btn flex min-h-[68px] items-center justify-center text-3xl transition ${
                isDone
                  ? 'border-emerald-500/40 bg-emerald-950/60 opacity-35 scale-90'
                  : 'bg-slate-900 hover:bg-emerald-900/50 animate-pulse'
              }`}
            >
              <span>{isDone ? '✓' : emoji}</span>
            </button>
          );
        })}

        <div className="flex min-h-[68px] items-center justify-center rounded-sm border border-emerald-500/40 bg-slate-950/70">
          <img
            src={ASSET_MANIFEST.marsCropsTray.path}
            alt={ASSET_MANIFEST.marsCropsTray.alt}
            draggable={false}
            className="pixel-art h-12 w-12 object-contain"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {picked.map((done, i) => (
          <Sparkles
            key={i}
            className={`h-4 w-4 ${done ? 'text-emerald-400' : 'text-slate-700'}`}
          />
        ))}
      </div>
    </div>
  );
};

/* ============================================================================
 * 6. RUN! (Guiar astronauta até o abrigo blindado desviando de rochas)
 * ============================================================================ */
const RUN_LANES = 3;
const RUN_COLS = 5;

const RunMicroGame: React.FC<MicroGameComponentProps> = ({
  roundKey,
  profile,
  onWin,
}) => {
  const { dict } = useLanguage();
  const obstacles = useMemo(() => {
    const laneA = roundKey % RUN_LANES;
    const laneB = (roundKey + 1) % RUN_LANES;
    return [
      { lane: laneA, col: 1 },
      { lane: laneB, col: 3 },
    ];
  }, [roundKey]);

  const targetLane = (roundKey + 2) % RUN_LANES;
  const [pos, setPos] = useState<{ lane: number; col: number }>({ lane: 1, col: 0 });
  const [bump, setBump] = useState(false);
  const settledRef = useRef(false);

  useEffect(() => {
    settledRef.current = false;
    setPos({ lane: 1, col: 0 });
    setBump(false);
  }, [roundKey]);

  const isRock = (lane: number, col: number) =>
    obstacles.some((o) => o.lane === lane && o.col === col);

  const tryMove = (dLane: number, dCol: number) => {
    if (settledRef.current) return;
    setPos((prev) => {
      const nextLane = Math.max(0, Math.min(RUN_LANES - 1, prev.lane + dLane));
      const nextCol = Math.max(0, Math.min(RUN_COLS - 1, prev.col + dCol));
      if (nextLane === prev.lane && nextCol === prev.col) return prev;

      if (isRock(nextLane, nextCol)) {
        soundEngine.playAlert();
        setBump(true);
        window.setTimeout(() => setBump(false), 260);
        return prev;
      }

      soundEngine.playClick();
      if (nextCol === RUN_COLS - 1 && nextLane === targetLane) {
        settledRef.current = true;
        onWin();
      }
      return { lane: nextLane, col: nextCol };
    });
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        tryMove(-1, 0);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        tryMove(1, 0);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        tryMove(0, 1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  return (
    <div className="touch-none select-none flex w-full max-w-md flex-col items-center gap-2.5">
      <div
        className={`grid w-full grid-cols-5 gap-1.5 rounded-sm border-2 bg-orange-950/45 p-2 ${
          bump ? 'border-rose-400 cabin-shake' : 'border-amber-500/60'
        }`}
      >
        {Array.from({ length: RUN_LANES }).map((_, lane) =>
          Array.from({ length: RUN_COLS }).map((__, col) => {
            const hasAstro = pos.lane === lane && pos.col === col;
            const rock = isRock(lane, col);
            const shelter = col === RUN_COLS - 1 && lane === targetLane;
            const isAdjacent =
              Math.abs(pos.lane - lane) + Math.abs(pos.col - col) === 1;

            return (
              <button
                key={`${lane}-${col}`}
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  if (isAdjacent) {
                    tryMove(lane - pos.lane, col - pos.col);
                  } else if (col > pos.col) {
                    tryMove(0, 1);
                  } else if (lane !== pos.lane) {
                    tryMove(lane > pos.lane ? 1 : -1, 0);
                  }
                }}
                className={`touch-none select-none flex h-12 items-center justify-center rounded-sm border transition ${
                  shelter
                    ? 'animate-pulse border-emerald-300 bg-emerald-500/35'
                    : rock
                    ? 'border-rose-500/70 bg-rose-950/60'
                    : hasAstro
                    ? 'border-cyan-300 bg-cyan-950/60'
                    : 'border-slate-700/80 bg-slate-900/75'
                }`}
              >
                {hasAstro && <AstronautAvatar profile={profile} size="sm" />}
                {rock && <span className="text-xl">🪨</span>}
                {shelter && !hasAstro && (
                  <ShieldCheck className="h-6 w-6 text-emerald-300" />
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Controles táteis gigantes para dedo */}
      <div className="grid w-full max-w-xs grid-cols-3 gap-2">
        <button
          type="button"
          aria-label={dict.arcade.moveUpAria}
          onPointerDown={(e) => {
            e.preventDefault();
            tryMove(-1, 0);
          }}
          className="touch-none select-none pixel-btn flex min-h-[50px] items-center justify-center bg-cyan-400 text-slate-950 hover:bg-cyan-300"
        >
          <ArrowUp className="h-6 w-6" />
        </button>
        <button
          type="button"
          aria-label={dict.arcade.moveDownAria}
          onPointerDown={(e) => {
            e.preventDefault();
            tryMove(1, 0);
          }}
          className="touch-none select-none pixel-btn flex min-h-[50px] items-center justify-center bg-cyan-400 text-slate-950 hover:bg-cyan-300"
        >
          <ArrowDown className="h-6 w-6" />
        </button>
        <button
          type="button"
          aria-label={dict.arcade.moveRightAria}
          onPointerDown={(e) => {
            e.preventDefault();
            tryMove(0, 1);
          }}
          className="touch-none select-none pixel-btn flex min-h-[50px] items-center justify-center bg-emerald-400 text-slate-950 hover:bg-emerald-300"
        >
          <ArrowRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

/* ============================================================================
 * 7. SYNC! (Acertar a zona verde na barra de ritmo gravitacional)
 * ============================================================================ */
const SyncMicroGame: React.FC<MicroGameComponentProps> = ({
  roundKey,
  speedTier,
  paused,
  onWin,
}) => {
  const { dict } = useLanguage();
  const [cursorPct, setCursorPct] = useState(10);
  const [missFlash, setMissFlash] = useState(false);

  const cursorRef = useRef(10);
  const dirRef = useRef<1 | -1>(1);
  const settledRef = useRef(false);

  const zoneStart = useMemo(() => 30 + ((roundKey * 7) % 24), [roundKey]);
  const zoneWidth = Math.max(18, 28 - speedTier * 1.5);
  const zoneEnd = zoneStart + zoneWidth;

  useEffect(() => {
    cursorRef.current = 8;
    dirRef.current = 1;
    settledRef.current = false;
    setCursorPct(8);
    setMissFlash(false);
  }, [roundKey]);

  useEffect(() => {
    if (paused) return;
    const speedMs = Math.max(620, 1280 - speedTier * 95);
    const step = Math.max(1.1, (100 / speedMs) * 18);

    const timer = window.setInterval(() => {
      if (settledRef.current) return;
      let next = cursorRef.current + dirRef.current * step;
      if (next >= 96) {
        next = 96;
        dirRef.current = -1;
      } else if (next <= 4) {
        next = 4;
        dirRef.current = 1;
      }
      cursorRef.current = next;
      setCursorPct(next);
    }, 18);

    return () => window.clearInterval(timer);
  }, [paused, speedTier]);

  const handleTap = (e?: React.PointerEvent) => {
    if (e) e.preventDefault();
    if (settledRef.current) return;

    if (cursorRef.current >= zoneStart && cursorRef.current <= zoneEnd) {
      settledRef.current = true;
      onWin();
    } else {
      soundEngine.playAlert();
      setMissFlash(true);
      window.setTimeout(() => setMissFlash(false), 320);
    }
  };

  return (
    <div className="touch-none select-none flex w-full max-w-sm flex-col items-center gap-4">
      <div
        onPointerDown={handleTap}
        className={`touch-none select-none relative h-14 w-full cursor-pointer overflow-hidden rounded-sm border-4 bg-slate-900 ${
          missFlash ? 'border-rose-400 cabin-shake' : 'border-cyan-400/70'
        }`}
      >
        <div
          style={{ left: `${zoneStart}%`, width: `${zoneWidth}%` }}
          className="pointer-events-none absolute inset-y-0 border-x-2 border-emerald-200 bg-emerald-500/45 shadow-[0_0_18px_rgba(16,185,129,0.6)]"
        />
        <div
          style={{ left: `calc(${cursorPct}% - 6px)` }}
          className="pointer-events-none absolute inset-y-1 w-3 rounded-sm border border-white bg-amber-300 shadow-[0_0_12px_rgba(252,211,77,0.95)]"
        />
      </div>

      <button
        type="button"
        onPointerDown={handleTap}
        className="touch-none select-none pixel-btn flex min-h-[58px] w-full items-center justify-center gap-2 bg-emerald-400 px-4 py-3 font-pixel text-sm text-slate-950 hover:bg-emerald-300"
      >
        <Zap className="h-5 w-5 animate-bounce" />
        <span>{dict.arcade.tap}</span>
      </button>
    </div>
  );
};

export interface MicroGameRendererProps extends MicroGameComponentProps {
  gameId: MicroGameId;
}

export const ArcadeMicroGameRenderer: React.FC<MicroGameRendererProps> = ({
  gameId,
  ...props
}) => {
  switch (gameId) {
    case 'SCRUB':
      return <ScrubMicroGame {...props} />;
    case 'DRILL':
      return <DrillMicroGame {...props} />;
    case 'SEAL':
      return <SealMicroGame {...props} />;
    case 'FILL':
      return <FillMicroGame {...props} />;
    case 'HARVEST':
      return <HarvestMicroGame {...props} />;
    case 'RUN':
      return <RunMicroGame {...props} />;
    case 'SYNC':
      return <SyncMicroGame {...props} />;
  }
};
