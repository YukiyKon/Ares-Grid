import React, { useEffect, useRef } from 'react';
import { AlertTriangle, ArrowRight, Radio, ShieldAlert, Timer } from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';
import { getSolWeather } from './weatherScheduler';

/**
 * Feedback sensorial de perigo e crises repentinas com cronômetro (12-14s)
 * para o Modo Sobrevivência (30 Sols).
 */
export const SurvivalCrisisOverlay: React.FC = () => {
  const {
    state,
    tickSurvivalCrisis,
    interactSurvivalCrisis,
    triggerSurvivalCrisis,
    resolveCrisisViaStation,
  } = useGameStore();

  const lastCrisisIdRef = useRef<string | null>(null);
  const idleSolAmbushRef = useRef<number | null>(null);
  const crisisSecondsRef = useRef<number>(0);

  const isSurvival = state.gameMode === 'SURVIVAL_30';
  const { survival } = state;
  const crisis = survival.activeCrisis;
  const weather = getSolWeather(survival.sol);

  const isResourceDanger =
    isSurvival &&
    survival.gameStatus === 'PLAYING' &&
    (survival.energy < 30 ||
      survival.water < 30 ||
      survival.health < 30 ||
      (weather.isCritical && !survival.stormProtectedToday));

  useEffect(() => {
    if (crisis) {
      crisisSecondsRef.current = crisis.secondsLeft;
    }
  }, [crisis]);

  // Sirene de emergência ao iniciar uma nova crise
  useEffect(() => {
    if (!isSurvival || !crisis) {
      lastCrisisIdRef.current = null;
      return;
    }
    if (lastCrisisIdRef.current !== crisis.id) {
      lastCrisisIdRef.current = crisis.id;
      soundEngine.playEmergencySiren();
    }
  }, [isSurvival, crisis]);

  // Contador regressivo da crise em tempo real + bipe de radar crescente
  useEffect(() => {
    if (!isSurvival || survival.gameStatus !== 'PLAYING' || !crisis?.id) return;

    const timer = window.setInterval(() => {
      soundEngine.playRadarBeep(Math.max(0, crisisSecondsRef.current - 1));
      tickSurvivalCrisis();
    }, 1000);

    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSurvival, survival.gameStatus, crisis?.id]);

  // Batimento de risco crítico quando energia, água ou saúde ficam abaixo de 30%
  useEffect(() => {
    if (!isResourceDanger || crisis) return;
    const hb = window.setInterval(() => {
      soundEngine.playCriticalHeartbeat();
    }, 6000);
    return () => window.clearInterval(hb);
  }, [isResourceDanger, crisis]);

  // Anti-passividade: ficar parado por 22s na Base no mesmo Sol dispara uma emergência
  useEffect(() => {
    if (
      !isSurvival ||
      survival.gameStatus !== 'PLAYING' ||
      state.currentScene !== 'BASE_HUB' ||
      state.activeModal !== 'NONE' ||
      survival.turnsLeft <= 0 ||
      crisis !== null
    ) {
      return;
    }

    if (idleSolAmbushRef.current === survival.sol) return;

    const timeout = window.setTimeout(() => {
      idleSolAmbushRef.current = survival.sol;
      triggerSurvivalCrisis();
    }, 22000);

    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isSurvival,
    survival.gameStatus,
    survival.sol,
    survival.turnsLeft,
    state.currentScene,
    state.activeModal,
    crisis,
  ]);

  if (!isSurvival || survival.gameStatus !== 'PLAYING') {
    return null;
  }

  const timePct = crisis
    ? Math.max(0, Math.round((crisis.secondsLeft / crisis.secondsTotal) * 100))
    : 0;
  const actionPct = crisis
    ? Math.round((crisis.progress / crisis.requiredProgress) * 100)
    : 0;

  return (
    <>
      {(isResourceDanger || crisis !== null) && (
        <div
          aria-hidden="true"
          className={`pointer-events-none fixed inset-0 z-40 transition-opacity ${
            crisis ? 'crisis-vignette-critical' : 'crisis-vignette-danger'
          }`}
        />
      )}

      {crisis && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-label={crisis.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 backdrop-blur-sm"
        >
          <div
            className={`pixel-box w-full max-w-lg border-4 border-rose-500 bg-slate-950 p-4 shadow-[0_0_40px_rgba(239,68,68,0.55)] ${
              crisis.secondsLeft <= 5 ? 'cabin-shake' : ''
            }`}
          >
            <div className="mb-3 flex items-center justify-between gap-2 border-b-2 border-rose-500/50 pb-2">
              <div className="flex items-center gap-2 text-rose-300">
                <ShieldAlert className="h-5 w-5 animate-pulse text-rose-400" />
                <span className="font-pixel text-[10px] text-rose-200 sm:text-xs">
                  EMERGÊNCIA EM TEMPO REAL!
                </span>
              </div>

              <span
                className={`inline-flex items-center gap-1 rounded-sm border-2 px-2.5 py-1 font-pixel text-xs ${
                  crisis.secondsLeft <= 5
                    ? 'border-rose-300 bg-rose-500 text-slate-950 animate-pulse'
                    : 'border-amber-400 bg-amber-950 text-amber-200'
                }`}
              >
                <Timer className="h-3.5 w-3.5" />
                {crisis.secondsLeft}s
              </span>
            </div>

            <h2 className="font-pixel text-xs text-amber-300 sm:text-sm">
              {crisis.title}
            </h2>

            {/* Barra de tempo restante */}
            <div className="mt-2.5 h-3 w-full overflow-hidden rounded-sm border border-rose-500/70 bg-slate-900">
              <div
                style={{ width: `${timePct}%` }}
                className={`h-full transition-[width] duration-300 ${
                  crisis.secondsLeft <= 5 ? 'bg-rose-500' : 'bg-amber-400'
                }`}
              />
            </div>

            {/* Capi em alerta vermelho */}
            <div className="mt-3 flex items-center gap-3 rounded-sm border-2 border-rose-500/60 bg-rose-950/35 p-2.5">
              <img
                src={ASSET_MANIFEST.capiPortrait.path}
                alt={ASSET_MANIFEST.capiPortrait.alt}
                className="pixel-art h-14 w-14 shrink-0 rounded-sm border border-rose-400/70 bg-slate-900 object-contain"
              />
              <div>
                <span className="inline-flex items-center gap-1 font-pixel text-[8px] text-rose-300">
                  <Radio className="h-3 w-3 animate-pulse" />
                  CAPI • ALERTA IMEDIATO
                </span>
                <p className="mt-0.5 font-dialog text-xs leading-snug text-rose-100">
                  {crisis.capiUrgentWarning}
                </p>
              </div>
            </div>

            <div className="mt-2.5 flex items-center gap-2 rounded-sm border border-amber-500/50 bg-amber-950/30 px-2.5 py-1.5 font-dialog text-xs text-amber-200">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-300" />
              <span>
                <strong>Risco se falhar:</strong> {crisis.penaltySummary}
              </span>
            </div>

            {/* Progresso da reação rápida */}
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between font-dialog text-[11px] text-slate-300">
                <span>Contenção de emergência ({crisis.progress}/{crisis.requiredProgress} acionamentos)</span>
                <span className="font-pixel text-[9px] text-emerald-300">{actionPct}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-sm border border-slate-700 bg-slate-900">
                <div
                  style={{ width: `${actionPct}%` }}
                  className="h-full bg-emerald-400 transition-[width] duration-100"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (crisis.progress + 1 >= crisis.requiredProgress) {
                    soundEngine.playSuccess();
                  } else {
                    soundEngine.playClick();
                  }
                  interactSurvivalCrisis();
                }}
                className="pixel-btn w-full bg-rose-500 px-4 py-3 font-pixel text-[10px] text-white hover:bg-rose-400"
              >
                {crisis.actionButtonLabel} ({crisis.progress}/{crisis.requiredProgress})
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  resolveCrisisViaStation();
                }}
                className="flex w-full items-center justify-center gap-1.5 rounded-sm border border-cyan-400/70 bg-cyan-950/60 px-3 py-2 font-dialog text-xs font-bold text-cyan-200 hover:bg-cyan-900/70"
              >
                <ArrowRight className="h-3.5 w-3.5" />
                Ou correr para a{' '}
                {crisis.stationShortcut === 'MISSION_1'
                  ? 'Estação 1 (Painéis Solares)'
                  : 'Estação 5 (Abrigo & Vedação)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
