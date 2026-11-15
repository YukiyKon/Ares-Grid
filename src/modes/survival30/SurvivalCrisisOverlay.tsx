import React, { useEffect, useRef } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Power,
  Radio,
  ShieldAlert,
  ShieldCheck,
  Sprout,
  Timer,
} from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';
import { useLanguage } from '../../i18n/LanguageContext';
import { getLocalizedCrisis, getLocalizedWeather } from './survivalI18n';
import { getSolWeather } from './weatherScheduler';

/**
 * Feedback sensorial de perigo + Checklist da Tempestade Extrema em 3 fases (35s Prep -> Impacto -> Pós-Tempestade)
 * e crises emergenciais rápidas no Modo Sobrevivência (30 Sols).
 */
export const SurvivalCrisisOverlay: React.FC = () => {
  const {
    state,
    openModal,
    setScene,
    tickSurvivalCrisis,
    interactSurvivalCrisis,
    resolveCrisisViaStation,
    sealStormHatchesQuick,
    setSurvivalInBunker,
  } = useGameStore();
  const { dict, tx } = useLanguage();

  const lastCrisisIdRef = useRef<string | null>(null);
  const lastStormPhaseRef = useRef<string>('NONE');
  const crisisSecondsRef = useRef<number>(0);

  const isSurvival = state.gameMode === 'SURVIVAL_30';
  const { survival } = state;
  const rawCrisis = survival.activeCrisis;
  const crisis = rawCrisis ? getLocalizedCrisis(rawCrisis, dict) : null;
  const weather = getSolWeather(survival.sol, survival.stormSchedule);
  const rt = dict.survival.realtime;
  const { stormEvent } = survival;

  const isResourceDanger =
    isSurvival &&
    survival.gameStatus === 'PLAYING' &&
    (survival.energy < 25 ||
      survival.water < 25 ||
      survival.health < 30 ||
      survival.hunger <= 15 ||
      survival.thirst <= 15 ||
      stormEvent.phase === 'IMPACT');

  useEffect(() => {
    if (crisis) {
      crisisSecondsRef.current = crisis.secondsLeft;
    }
  }, [crisis]);

  // Sirene de emergência ao iniciar crise ou fase de preparo da tempestade
  useEffect(() => {
    if (!isSurvival) return;
    if (stormEvent.phase !== lastStormPhaseRef.current) {
      lastStormPhaseRef.current = stormEvent.phase;
      if (stormEvent.phase === 'PREP_COUNTDOWN' || stormEvent.phase === 'IMPACT') {
        soundEngine.playEmergencySiren();
      }
    }
  }, [isSurvival, stormEvent.phase]);

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

  // Bipe de radar durante contagem regressiva de preparo de tempestade
  useEffect(() => {
    if (!isSurvival || survival.gameStatus !== 'PLAYING') return;
    if (stormEvent.phase !== 'PREP_COUNTDOWN') return;
    if (stormEvent.prepSecondsLeft <= 10) {
      soundEngine.playRadarBeep(Math.max(0, Math.ceil(stormEvent.prepSecondsLeft)));
    }
  }, [isSurvival, survival.gameStatus, stormEvent.phase, stormEvent.prepSecondsLeft]);

  // Contador regressivo da crise manual
  useEffect(() => {
    if (!isSurvival || survival.gameStatus !== 'PLAYING' || !crisis?.id) return;

    const timer = window.setInterval(() => {
      soundEngine.playRadarBeep(Math.max(0, crisisSecondsRef.current - 1));
      tickSurvivalCrisis();
    }, 1000);

    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSurvival, survival.gameStatus, crisis?.id]);

  // Batimento cardíaco em risco crítico
  useEffect(() => {
    if (!isResourceDanger || crisis) return;
    const hb = window.setInterval(() => {
      soundEngine.playCriticalHeartbeat();
    }, 6000);
    return () => window.clearInterval(hb);
  }, [isResourceDanger, crisis]);

  if (
    !isSurvival ||
    survival.gameStatus !== 'PLAYING' ||
    survival.faintState !== 'NONE' ||
    state.currentScene === 'ARCADE_RUSH'
  ) {
    return null;
  }

  const timePct = crisis
    ? Math.max(0, Math.round((crisis.secondsLeft / Math.max(1, crisis.totalSeconds)) * 100))
    : 0;
  const actionPct = crisis
    ? Math.round((crisis.progress / Math.max(1, crisis.requiredSteps)) * 100)
    : 0;

  const localizedStormWeather = getLocalizedWeather(stormEvent.weatherType, dict);
  const inBunker = stormEvent.checklist.inBunker || survival.playerLocation === 'BUNKER';
  const showStormBanner =
    (stormEvent.phase === 'PREP_COUNTDOWN' ||
      stormEvent.phase === 'IMPACT' ||
      stormEvent.phase === 'POST_STORM') &&
    state.activeModal === 'NONE';

  return (
    <>
      {(isResourceDanger || crisis !== null || stormEvent.phase === 'PREP_COUNTDOWN') && (
        <div
          aria-hidden="true"
          className={`pointer-events-none fixed inset-0 z-40 transition-opacity ${
            crisis || stormEvent.phase === 'IMPACT'
              ? 'crisis-vignette-critical'
              : 'crisis-vignette-danger'
          }`}
        />
      )}

      {/* Checklist Flutuante da Tempestade em 3 Fases (Prep -> Impacto -> Pós-Tempestade) */}
      {showStormBanner && (
        <div className="fixed bottom-20 left-2 right-2 z-40 mx-auto max-w-xl sm:bottom-24">
          <div
            className={`pixel-box border-2 p-3 shadow-2xl ${
              stormEvent.phase === 'POST_STORM'
                ? 'border-amber-400 bg-amber-950/95'
                : 'border-rose-500 bg-slate-950/95'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 animate-pulse text-rose-300" />
                <span className="font-pixel text-[9px] text-rose-200 sm:text-[10px]">
                  {stormEvent.phase === 'POST_STORM'
                    ? weather.shortBadge
                    : `${rt.stormChecklistTitle} • ${localizedStormWeather.shortBadge}`}
                </span>
              </div>

              {stormEvent.phase === 'PREP_COUNTDOWN' && (
                <span className="inline-flex items-center gap-1 rounded-sm border border-rose-300 bg-rose-500 px-2 py-0.5 font-pixel text-[9px] text-slate-950 animate-pulse">
                  <Timer className="h-3 w-3" />
                  {rt.stormPrepCountdown(Math.ceil(stormEvent.prepSecondsLeft))}
                </span>
              )}
              {stormEvent.phase === 'IMPACT' && (
                <span className="inline-flex items-center gap-1 rounded-sm border border-amber-300 bg-rose-950 px-2 py-0.5 font-pixel text-[9px] text-rose-200">
                  <Timer className="h-3 w-3" />
                  {rt.stormImpactCountdown(Math.ceil(stormEvent.impactSecondsLeft))}
                </span>
              )}
            </div>

            {stormEvent.phase === 'POST_STORM' ? (
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <p className="font-dialog text-xs text-amber-100">{rt.stormPostBanner}</p>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setScene('MISSION_1');
                  }}
                  className="pixel-btn touch-none select-none min-h-[38px] bg-amber-400 px-3 py-1.5 font-pixel text-[8px] text-slate-950 hover:bg-amber-300"
                >
                  🧹 {dict.survival.stations.MISSION_1.quickBtn}
                </button>
              </div>
            ) : (
              <>
                <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playSuccess();
                      sealStormHatchesQuick();
                    }}
                    className={`touch-none select-none flex min-h-[38px] items-center gap-1.5 rounded-sm border px-2 py-1 text-left font-dialog text-xs ${
                      stormEvent.checklist.hatchesSealed
                        ? 'border-emerald-400 bg-emerald-950/60 text-emerald-200'
                        : 'border-amber-400/70 bg-slate-900 text-amber-100 hover:bg-slate-800'
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{rt.stormCheckHatches}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setScene('MISSION_4');
                    }}
                    className={`touch-none select-none flex min-h-[38px] items-center gap-1.5 rounded-sm border px-2 py-1 text-left font-dialog text-xs ${
                      stormEvent.checklist.cropsSecured
                        ? 'border-emerald-400 bg-emerald-950/60 text-emerald-200'
                        : 'border-lime-400/70 bg-slate-900 text-lime-100 hover:bg-slate-800'
                    }`}
                  >
                    <Sprout className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{rt.stormCheckCrops}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      openModal('BREAKERS');
                    }}
                    className={`touch-none select-none flex min-h-[38px] items-center gap-1.5 rounded-sm border px-2 py-1 text-left font-dialog text-xs ${
                      stormEvent.checklist.breakersRationed
                        ? 'border-emerald-400 bg-emerald-950/60 text-emerald-200'
                        : 'border-cyan-400/70 bg-slate-900 text-cyan-100 hover:bg-slate-800'
                    }`}
                  >
                    <Power className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{rt.stormCheckBreakers}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playSuccess();
                      setSurvivalInBunker(true);
                    }}
                    className={`touch-none select-none flex min-h-[38px] items-center gap-1.5 rounded-sm border px-2 py-1 text-left font-dialog text-xs font-bold ${
                      inBunker
                        ? 'border-emerald-400 bg-emerald-500 text-slate-950'
                        : 'animate-pulse border-rose-400 bg-rose-500 text-white hover:bg-rose-400'
                    }`}
                  >
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{rt.bunkerEnterBtn}</span>
                  </button>
                </div>

                {stormEvent.phase === 'IMPACT' && !inBunker && (
                  <p className="mt-2 font-dialog text-xs font-bold text-rose-300">
                    ⚠️ {rt.bunkerDangerBanner}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {crisis && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-label={crisis.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-2 backdrop-blur-sm sm:p-3"
        >
          <div
            className={`pixel-box max-h-[92dvh] w-full max-w-lg overflow-y-auto border-4 border-rose-500 bg-slate-950 p-3.5 shadow-[0_0_40px_rgba(239,68,68,0.55)] sm:p-4 ${
              crisis.secondsLeft <= 5 ? 'cabin-shake' : ''
            }`}
          >
            <div className="mb-3 flex items-center justify-between gap-2 border-b-2 border-rose-500/50 pb-2">
              <div className="flex items-center gap-2 text-rose-300">
                <ShieldAlert className="h-5 w-5 animate-pulse text-rose-400" />
                <span className="font-pixel text-[10px] text-rose-200 sm:text-xs">
                  {tx('REAL-TIME EMERGENCY!', 'EMERGÊNCIA EM TEMPO REAL!')}
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

            <div className="mt-2.5 h-3 w-full overflow-hidden rounded-sm border border-rose-500/70 bg-slate-900">
              <div
                style={{ width: `${timePct}%` }}
                className={`h-full transition-[width] duration-300 ${
                  crisis.secondsLeft <= 5 ? 'bg-rose-500' : 'bg-amber-400'
                }`}
              />
            </div>

            <div className="mt-3 flex items-center gap-3 rounded-sm border-2 border-rose-500/60 bg-rose-950/35 p-2.5">
              <img
                src={ASSET_MANIFEST.capiPortrait.path}
                alt={ASSET_MANIFEST.capiPortrait.alt}
                className="pixel-art h-14 w-14 shrink-0 rounded-sm border border-rose-400/70 bg-slate-900 object-contain"
              />
              <div>
                <span className="inline-flex items-center gap-1 font-pixel text-[8px] text-rose-300">
                  <Radio className="h-3 w-3 animate-pulse" />
                  {tx('CAPI • IMMEDIATE ALERT', 'CAPI • ALERTA IMEDIATO')}
                </span>
                <p className="mt-0.5 font-dialog text-xs leading-snug text-rose-100">
                  {crisis.capiUrgentWarning}
                </p>
              </div>
            </div>

            <div className="mt-2.5 flex items-center gap-2 rounded-sm border border-amber-500/50 bg-amber-950/30 px-2.5 py-1.5 font-dialog text-xs text-amber-200">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-300" />
              <span>
                <strong>{tx('Risk if failed:', 'Risco se falhar:')}</strong>{' '}
                {crisis.penaltySummary}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between font-dialog text-[11px] text-slate-300">
                <span>
                  {tx(
                    `Emergency containment (${crisis.progress}/${crisis.requiredSteps} actions)`,
                    `Contenção de emergência (${crisis.progress}/${crisis.requiredSteps} acionamentos)`
                  )}
                </span>
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
                  if (crisis.progress + 1 >= crisis.requiredSteps) {
                    soundEngine.playSuccess();
                  } else {
                    soundEngine.playClick();
                  }
                  interactSurvivalCrisis();
                }}
                className="pixel-btn touch-none select-none min-h-[44px] w-full bg-rose-500 px-4 py-3 font-pixel text-[10px] text-white hover:bg-rose-400"
              >
                {crisis.actionButtonLabel} ({crisis.progress}/{crisis.requiredSteps})
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  resolveCrisisViaStation();
                }}
                className="touch-none select-none flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-sm border border-cyan-400/70 bg-cyan-950/60 px-3 py-2 font-dialog text-xs font-bold text-cyan-200 hover:bg-cyan-900/70"
              >
                <ArrowRight className="h-3.5 w-3.5" />
                {tx('Or rush to ', 'Ou correr para a ')}
                {crisis.stationShortcut === 'MISSION_1'
                  ? tx('Station 1 (Solar Panels)', 'Estação 1 (Painéis Solares)')
                  : tx('Station 5 (Bunker & Sealing)', 'Estação 5 (Bunker & Vedação)')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
