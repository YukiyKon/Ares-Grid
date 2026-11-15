import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Palette,
  RotateCcw,
  Shield,
  ShieldOff,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from 'lucide-react';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';
import { useLanguage } from '../../i18n/LanguageContext';
import { ArcadeGarageModal } from './ArcadeGarageModal';
import { ArcadeMicroGameRenderer } from './ArcadeMicroGames';
import {
  type ArcadeRunResult,
  MICRO_GAME_IDS,
  type MicroGameId,
  computeRoundPoints,
  getComboMultiplier,
  getRoundTimeLimitMs,
  getSpeedTier,
  recordArcadeRun,
  useArcadeProgress,
} from './arcadeStore';
import { CapiBadgePortrait, type CapiMood } from './CosmeticSprites';

type RushPhase = 'PLAYING' | 'BETWEEN' | 'GAME_OVER';

const MAX_SHIELDS = 3;

function pickNextGame(prev: MicroGameId | null): MicroGameId {
  const pool = prev ? MICRO_GAME_IDS.filter((id) => id !== prev) : MICRO_GAME_IDS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export const ArcadeRushScene: React.FC = () => {
  const { state, setScene } = useGameStore();
  const { dict } = useLanguage();
  const arcade = useArcadeProgress();

  const [phase, setPhase] = useState<RushPhase>('PLAYING');
  const [round, setRound] = useState(1);
  const [roundKey, setRoundKey] = useState(1);
  const [shields, setShields] = useState(MAX_SHIELDS);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxCombo, setMaxCombo] = useState(1);
  const [gameId, setGameId] = useState<MicroGameId>(() => pickNextGame(null));
  const [timeLeftMs, setTimeLeftMs] = useState(() => getRoundTimeLimitMs(1));
  const [garageOpen, setGarageOpen] = useState(false);

  const [betweenOutcome, setBetweenOutcome] = useState<'WIN' | 'FAIL'>('WIN');
  const [lastGain, setLastGain] = useState(0);
  const [speedUpFlash, setSpeedUpFlash] = useState(false);
  const [runResult, setRunResult] = useState<ArcadeRunResult | null>(null);

  const roundStartAtRef = useRef<number>(performance.now());
  const pauseStartedAtRef = useRef<number | null>(null);
  const lastSecBeepRef = useRef<number>(-1);
  const settledRoundRef = useRef<boolean>(false);
  const transitionTimerRef = useRef<number | null>(null);

  const timeLimitMs = getRoundTimeLimitMs(round);
  const speedTier = getSpeedTier(round);
  const multiplier = getComboMultiplier(streak);
  const timeFraction = Math.max(0, Math.min(1, timeLeftMs / Math.max(1, timeLimitMs)));

  const clearTransitionTimer = () => {
    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTransitionTimer();
  }, []);

  const resetRun = () => {
    clearTransitionTimer();
    soundEngine.unlock();
    soundEngine.playClick();
    settledRoundRef.current = false;
    lastSecBeepRef.current = -1;
    roundStartAtRef.current = performance.now();
    setPhase('PLAYING');
    setRound(1);
    setRoundKey((k) => k + 1);
    setShields(MAX_SHIELDS);
    setScore(0);
    setStreak(0);
    setMaxCombo(1);
    setGameId(pickNextGame(null));
    setTimeLeftMs(getRoundTimeLimitMs(1));
    setSpeedUpFlash(false);
    setRunResult(null);
  };

  // Pausa limpa do relógio quando o modal da Garagem abre
  useEffect(() => {
    if (garageOpen) {
      if (pauseStartedAtRef.current === null) {
        pauseStartedAtRef.current = performance.now();
      }
    } else if (pauseStartedAtRef.current !== null) {
      const pausedDelta = performance.now() - pauseStartedAtRef.current;
      roundStartAtRef.current += pausedDelta;
      pauseStartedAtRef.current = null;
    }
  }, [garageOpen]);

  const advanceToNextRound = useCallback(
    (nextRound: number, nextShields: number, finalScore: number, bestRunCombo: number) => {
      if (nextShields <= 0) {
        const result = recordArcadeRun(finalScore, bestRunCombo);
        setRunResult(result);
        setPhase('GAME_OVER');
        soundEngine.playStarFanfare(result.stars);
        return;
      }

      const prevTier = getSpeedTier(nextRound - 1);
      const nextTier = getSpeedTier(nextRound);
      setSpeedUpFlash(nextTier > prevTier);
      setRound(nextRound);
      setRoundKey((k) => k + 1);
      setGameId((prev) => pickNextGame(prev));
      setTimeLeftMs(getRoundTimeLimitMs(nextRound));
      lastSecBeepRef.current = -1;
      roundStartAtRef.current = performance.now();
      settledRoundRef.current = false;
      setPhase('PLAYING');
    },
    []
  );

  const handleRoundWin = useCallback(() => {
    if (phase !== 'PLAYING' || settledRoundRef.current) return;
    settledRoundRef.current = true;

    const elapsed = performance.now() - roundStartAtRef.current;
    const remainFrac = Math.max(0, 1 - elapsed / Math.max(1, timeLimitMs));
    const nextStreak = streak + 1;
    const nextMultiplier = getComboMultiplier(nextStreak);
    const gained = computeRoundPoints(nextStreak, remainFrac);
    const nextScore = score + gained;
    const nextMaxCombo = Math.max(maxCombo, nextMultiplier);

    soundEngine.playComboChime(nextMultiplier);

    setScore(nextScore);
    setStreak(nextStreak);
    setMaxCombo(nextMaxCombo);
    setLastGain(gained);
    setBetweenOutcome('WIN');
    setPhase('BETWEEN');

    clearTransitionTimer();
    transitionTimerRef.current = window.setTimeout(() => {
      advanceToNextRound(round + 1, shields, nextScore, nextMaxCombo);
    }, 680);
  }, [advanceToNextRound, maxCombo, phase, round, score, shields, streak, timeLimitMs]);

  const handleRoundFail = useCallback(() => {
    if (phase !== 'PLAYING' || settledRoundRef.current) return;
    settledRoundRef.current = true;

    soundEngine.playShieldBreak();

    const nextShields = shields - 1;
    setShields(nextShields);
    setStreak(0);
    setLastGain(0);
    setBetweenOutcome('FAIL');
    setPhase('BETWEEN');

    clearTransitionTimer();
    transitionTimerRef.current = window.setTimeout(() => {
      advanceToNextRound(round + 1, nextShields, score, maxCombo);
    }, 780);
  }, [advanceToNextRound, maxCombo, phase, round, score, shields]);

  // Cronômetro visual de alta precisão por rodada
  useEffect(() => {
    if (phase !== 'PLAYING' || garageOpen) return;

    const timer = window.setInterval(() => {
      const elapsed = performance.now() - roundStartAtRef.current;
      const remain = Math.max(0, timeLimitMs - elapsed);
      setTimeLeftMs(remain);

      const secLeft = Math.ceil(remain / 1000);
      if (secLeft > 0 && secLeft <= 3 && secLeft !== lastSecBeepRef.current) {
        lastSecBeepRef.current = secLeft;
        soundEngine.playTimerTick(secLeft <= 1);
      }

      if (remain <= 0 && !settledRoundRef.current) {
        handleRoundFail();
      }
    }, 33);

    return () => window.clearInterval(timer);
  }, [garageOpen, handleRoundFail, phase, timeLimitMs]);

  const capiMood: CapiMood =
    phase === 'BETWEEN'
      ? betweenOutcome === 'WIN'
        ? multiplier >= 2
          ? 'COOL'
          : 'CHEER'
        : 'HURT'
      : timeFraction <= 0.35
      ? 'WORRIED'
      : multiplier >= 3
      ? 'COOL'
      : 'IDLE';

  return (
    <section
      aria-label={dict.arcade.gameAreaAria}
      className="touch-none select-none mx-auto flex min-h-[calc(100dvh-64px)] w-full max-w-3xl flex-col justify-between gap-2 px-2.5 py-2.5 sm:px-4 sm:py-4"
    >
      {/* Placar compacto: Escudos | Pontos | Combo | Rodada | Garagem */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-sm border-2 border-cyan-500/50 bg-slate-950/95 px-2.5 py-2 shadow-lg">
        {/* 3 Escudos de Energia */}
        <div className="flex items-center gap-1" aria-label="Energy Shields">
          {Array.from({ length: MAX_SHIELDS }).map((_, idx) => {
            const alive = idx < shields;
            return alive ? (
              <Shield
                key={idx}
                className="h-6 w-6 fill-cyan-400/30 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.65)]"
              />
            ) : (
              <ShieldOff key={idx} className="h-6 w-6 text-rose-500/60" />
            );
          })}
        </div>

        {/* Pontuação & Combo */}
        <div className="flex items-center gap-2">
          <div className="rounded-sm border border-amber-400/60 bg-amber-950/50 px-2.5 py-1 text-center">
            <span className="block font-pixel text-[6.5px] text-amber-300">
              {dict.arcade.score}
            </span>
            <strong className="font-pixel text-[11px] text-white sm:text-xs">
              {score}
            </strong>
          </div>

          <div
            className={`rounded-sm border px-2 py-1 text-center transition ${
              multiplier >= 3
                ? 'animate-pulse border-fuchsia-400 bg-fuchsia-950/70'
                : multiplier >= 2
                ? 'border-emerald-400 bg-emerald-950/60'
                : 'border-slate-700 bg-slate-900'
            }`}
          >
            <span className="block font-pixel text-[6.5px] text-slate-300">
              {dict.arcade.combo}
            </span>
            <strong
              className={`font-pixel text-[11px] sm:text-xs ${
                multiplier >= 3
                  ? 'text-fuchsia-300'
                  : multiplier >= 2
                  ? 'text-emerald-300'
                  : 'text-slate-200'
              }`}
            >
              x{multiplier}
            </strong>
          </div>

          <div className="hidden rounded-sm border border-slate-700 bg-slate-900 px-2 py-1 text-center sm:block">
            <span className="block font-pixel text-[6.5px] text-slate-400">
              {dict.arcade.round}
            </span>
            <strong className="font-pixel text-[11px] text-cyan-200">
              #{round}
            </strong>
          </div>
        </div>

        {/* Botão Garagem & Sair */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setGarageOpen(true);
            }}
            className="pixel-btn inline-flex min-h-[38px] items-center gap-1 bg-fuchsia-400 px-2.5 py-1.5 font-pixel text-[8px] text-slate-950 hover:bg-fuchsia-300"
          >
            <Palette className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{dict.arcade.garage}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setScene('START_SCREEN');
            }}
            className="pixel-btn min-h-[38px] bg-slate-800 px-2.5 py-1.5 font-pixel text-[8px] text-slate-200 hover:bg-slate-700"
          >
            {dict.arcade.exit}
          </button>
        </div>
      </div>

      {/* Palco Principal Zero-Texto */}
      {phase === 'GAME_OVER' && runResult ? (
        <div className="pixel-box relative flex flex-1 flex-col items-center justify-center gap-4 overflow-hidden bg-slate-950/95 p-5 text-center sm:p-8">
          {/* Chuva de partículas / estrelas animadas */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60">
            {Array.from({ length: 14 }).map((_, i) => (
              <Sparkles
                key={i}
                style={{
                  left: `${(i * 19 + 7) % 92}%`,
                  top: `${(i * 23 + 11) % 85}%`,
                  animationDelay: `${(i % 5) * 180}ms`,
                }}
                className="absolute h-4 w-4 animate-ping text-amber-300"
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-col items-center gap-3">
            <CapiBadgePortrait mood={runResult.stars >= 2 ? 'COOL' : 'CHEER'} size="lg" />

            <h2 className="font-pixel text-base text-amber-300 sm:text-xl">
              {dict.arcade.gameOver}
            </h2>

            {runResult.isNewHighScore && (
              <span className="animate-bounce rounded-sm border-2 border-yellow-300 bg-yellow-400 px-3 py-1 font-pixel text-[9px] text-slate-950">
                ★ {dict.arcade.newRecord} ★
              </span>
            )}

            {/* Medalha 1-3 Estrelas */}
            <div className="flex items-center gap-3 py-1">
              {[1, 2, 3].map((n) => {
                const earned = n <= runResult.stars;
                return (
                  <Star
                    key={n}
                    className={`h-11 w-11 transition sm:h-14 sm:w-14 ${
                      earned
                        ? 'animate-bounce fill-yellow-300 text-yellow-300 drop-shadow-[0_0_16px_rgba(253,224,71,0.85)]'
                        : 'text-slate-700'
                    }`}
                  />
                );
              })}
            </div>

            {/* Cards numéricos sem parágrafos */}
            <div className="grid w-full max-w-md grid-cols-3 gap-2">
              <div className="rounded-sm border-2 border-amber-400/70 bg-slate-900 p-2.5">
                <span className="block font-pixel text-[7px] text-amber-300">
                  {dict.arcade.score}
                </span>
                <strong className="mt-1 block font-pixel text-sm text-white">
                  {score}
                </strong>
              </div>
              <div className="rounded-sm border-2 border-cyan-400/70 bg-slate-900 p-2.5">
                <span className="block font-pixel text-[7px] text-cyan-300">
                  {dict.arcade.best}
                </span>
                <strong className="mt-1 block font-pixel text-sm text-cyan-200">
                  {runResult.progress.highScore}
                </strong>
              </div>
              <div className="rounded-sm border-2 border-fuchsia-400/70 bg-slate-900 p-2.5">
                <span className="block font-pixel text-[7px] text-fuchsia-300">
                  {dict.arcade.maxCombo}
                </span>
                <strong className="mt-1 block font-pixel text-sm text-fuchsia-200">
                  x{maxCombo}
                </strong>
              </div>
            </div>

            {/* Aviso visual de novo cosmético desbloqueado */}
            {runResult.newlyUnlocked.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 rounded-sm border-2 border-emerald-400 bg-emerald-950/60 px-3 py-2">
                <Trophy className="h-4 w-4 text-yellow-300" />
                <span className="font-pixel text-[8px] text-emerald-200">
                  {dict.arcade.unlocked}:{' '}
                  {runResult.newlyUnlocked
                    .map((id) => dict.arcade.cosmetics[id])
                    .join(' • ')}
                </span>
              </div>
            )}

            {/* Ações Finais */}
            <div className="mt-2 flex w-full max-w-md flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={resetRun}
                className="pixel-btn flex min-h-[48px] flex-1 items-center justify-center gap-2 bg-emerald-400 px-4 py-3 font-pixel text-[10px] text-slate-950 hover:bg-emerald-300"
              >
                <RotateCcw className="h-4 w-4" />
                <span>{dict.arcade.playAgain}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setGarageOpen(true);
                }}
                className="pixel-btn flex min-h-[48px] flex-1 items-center justify-center gap-2 bg-fuchsia-400 px-4 py-3 font-pixel text-[10px] text-slate-950 hover:bg-fuchsia-300"
              >
                <Palette className="h-4 w-4" />
                <span>{dict.arcade.garage}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setScene('START_SCREEN');
                }}
                className="pixel-btn min-h-[48px] bg-slate-800 px-4 py-3 font-pixel text-[10px] text-slate-200 hover:bg-slate-700"
              >
                {dict.arcade.menu}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`pixel-box relative flex flex-1 flex-col justify-between overflow-hidden bg-slate-950/95 p-3 sm:p-5 ${
            phase === 'BETWEEN' && betweenOutcome === 'FAIL'
              ? 'border-rose-500 cabin-shake'
              : phase === 'BETWEEN' && betweenOutcome === 'WIN'
              ? 'border-emerald-400'
              : ''
          }`}
        >
          {/* Barra de tempo visual do micro-game */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap
                className={`h-4 w-4 shrink-0 ${
                  timeFraction <= 0.35
                    ? 'animate-ping text-rose-400'
                    : 'text-amber-300'
                }`}
              />
              <div className="h-4 flex-1 overflow-hidden rounded-sm border-2 border-slate-700 bg-slate-900">
                <div
                  style={{ width: `${Math.round(timeFraction * 100)}%` }}
                  className={`h-full transition-[width] duration-75 ${
                    timeFraction <= 0.3
                      ? 'bg-rose-500'
                      : timeFraction <= 0.6
                      ? 'bg-amber-400'
                      : 'bg-cyan-400'
                  }`}
                />
              </div>
              <span className="w-12 text-right font-pixel text-[10px] text-slate-200">
                {(timeLeftMs / 1000).toFixed(1)}s
              </span>
            </div>

            {/* 1 PALAVRA DE COMANDO GIGANTE + Capi reagindo */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {speedUpFlash && (
                  <span className="animate-bounce rounded-sm bg-fuchsia-400 px-2 py-1 font-pixel text-[8px] text-slate-950">
                    ⚡ {dict.arcade.speedUp}
                  </span>
                )}
              </div>

              <h1 className="text-center font-pixel text-xl tracking-wider text-amber-300 drop-shadow-[0_3px_0_rgba(124,45,18,0.95)] sm:text-3xl">
                {dict.arcade.commands[gameId]}
              </h1>

              <div className="flex items-center justify-end">
                <CapiBadgePortrait mood={capiMood} size="sm" showMoodBadge />
              </div>
            </div>
          </div>

          {/* Centro: Micro-Game ativo ou Flash rápido entre rodadas */}
          <div className="my-2 flex flex-1 items-center justify-center py-2">
            {phase === 'BETWEEN' ? (
              <div className="flex flex-col items-center gap-2 text-center">
                {betweenOutcome === 'WIN' ? (
                  <>
                    <span className="animate-bounce font-pixel text-3xl text-emerald-300">
                      ★ +{lastGain} ★
                    </span>
                    {multiplier >= 2 && (
                      <span className="rounded-sm bg-fuchsia-500 px-3 py-1 font-pixel text-xs text-white">
                        COMBO x{multiplier}!
                      </span>
                    )}
                  </>
                ) : (
                  <span className="font-pixel text-3xl text-rose-400">
                    💥 -1 🛡️
                  </span>
                )}
              </div>
            ) : (
              <ArcadeMicroGameRenderer
                key={roundKey}
                gameId={gameId}
                roundKey={roundKey}
                speedTier={speedTier}
                profile={state.astronaut}
                paused={garageOpen}
                onWin={handleRoundWin}
                onFail={handleRoundFail}
              />
            )}
          </div>

          {/* Rodapé numérico mínimo: High Score & Total */}
          <div className="flex items-center justify-between border-t border-slate-800/90 pt-2 font-pixel text-[8px] text-slate-400">
            <span>
              {dict.arcade.best}: <strong className="text-cyan-300">{arcade.highScore}</strong>
            </span>
            <span>
              ★ <strong className="text-yellow-300">{arcade.totalStars}</strong> •{' '}
              {dict.arcade.totalPoints}: <strong className="text-amber-300">{arcade.totalPoints}</strong>
            </span>
          </div>
        </div>
      )}

      <ArcadeGarageModal
        open={garageOpen}
        onClose={() => setGarageOpen(false)}
        profile={state.astronaut}
      />
    </section>
  );
};
