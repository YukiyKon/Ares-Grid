import React, { useEffect, useState } from 'react';
import {
  BatteryCharging,
  BookOpen,
  Clock,
  Droplets,
  FastForward,
  Flame,
  HeartPulse,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Sun,
  Utensils,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  isFullscreenActive,
  PSEUDO_FULLSCREEN_EVENT,
  toggleSafeFullscreen,
} from '../../core/fullscreen';
import { type GameSceneId, useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';
import { LanguageToggleButton, useLanguage } from '../../i18n/LanguageContext';
import { getLocalizedDominoAlerts } from '../../modes/survival30/survivalI18n';
import {
  canFastForwardNight,
  formatMarsClock,
  getCelestialArcProgress,
  isMarsNight,
} from '../../modes/survival30/survivalTypes';
import { computeSolarEfficiency, getSolWeather } from '../../modes/survival30/weatherScheduler';
import { AstronautAvatar } from './AstronautAvatar';

const INTRO_SCENES: GameSceneId[] = [
  'START_SCREEN',
  'COUNTDOWN',
  'LAUNCH',
  'CAPI_INTRO',
  'CUSTOMIZE',
  'LANDING',
];

export const TopStatusHUD: React.FC = () => {
  const {
    state,
    openModal,
    toggleSurvivalClockPause,
    toggleSurvivalFastForward2x,
    resetGame,
  } = useGameStore();
  const { dict } = useLanguage();
  const isArcade = state.currentScene === 'ARCADE_RUSH';
  const isSurvival = !isArcade && state.gameMode === 'SURVIVAL_30';
  const survivalWeather = getSolWeather(state.survival.sol, state.survival.stormSchedule);
  const clockStr = formatMarsClock(state.survival.clockMinutes);
  const nightNow = isMarsNight(state.survival.clockMinutes);
  const arcInfo = getCelestialArcProgress(state.survival.clockMinutes);
  const fastForwardAllowed = canFastForwardNight(state.survival);
  const solarCalc = computeSolarEfficiency(
    state.survival.clockMinutes,
    state.survival.panelDustPct,
    survivalWeather.type,
    state.survival.stormEvent.phase === 'IMPACT'
  );
  const isDangerState =
    isSurvival &&
    state.survival.gameStatus === 'PLAYING' &&
    (state.survival.energy < 25 ||
      state.survival.water < 25 ||
      state.survival.health < 30 ||
      state.survival.hunger <= 20 ||
      state.survival.thirst <= 20 ||
      state.survival.stormEvent.phase !== 'NONE' ||
      state.survival.activeCrisis !== null);

  const weatherBadgeText =
    survivalWeather.type === 'SOLAR_RADIATION_FLARE'
      ? dict.hud.weatherSolar
      : survivalWeather.type === 'GLOBAL_DUST_STORM'
      ? dict.hud.weatherStorm
      : survivalWeather.type === 'DUST_WIND'
      ? dict.hud.weatherDust
      : dict.hud.weatherClear;
  const [muted, setMuted] = useState(() => soundEngine.isMuted());
  const [isFullscreen, setIsFullscreen] = useState(() => isFullscreenActive());

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(isFullscreenActive());
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener(PSEUDO_FULLSCREEN_EVENT, handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener(PSEUDO_FULLSCREEN_EVENT, handleFullscreenChange);
    };
  }, []);

  // Oculta a barra superior durante toda a abertura (Start + Cenas 1 a 4) para imersão total
  if (INTRO_SCENES.includes(state.currentScene)) {
    return null;
  }

  const handleToggleMute = () => {
    const next = soundEngine.toggleMute();
    setMuted(next);
    if (!next) soundEngine.playClick();
  };

  const handleToggleFullscreen = () => {
    soundEngine.playClick();
    void toggleSafeFullscreen();
  };

  return (
    <header
      className={`sticky top-0 z-30 border-b-4 px-2.5 py-2 text-slate-100 shadow-lg backdrop-blur transition-colors sm:px-3 ${
        isDangerState
          ? 'border-rose-500 bg-rose-950/90'
          : isArcade
          ? 'border-fuchsia-500/80 bg-slate-950/95'
          : 'border-slate-800 bg-slate-950/95'
      }`}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
        {/* Identificação do Astronauta e Sol */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <div className="shrink-0 rounded-sm border-2 border-orange-400/80 bg-slate-900 p-0.5">
            <AstronautAvatar profile={state.astronaut} size="sm" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span
                data-no-i18n="true"
                className="max-w-[130px] truncate font-pixel text-[9px] text-orange-300 sm:max-w-none sm:text-[10px]"
              >
                {state.astronaut.name}
              </span>
              {!isArcade && (
                <span className="rounded-sm border border-cyan-500/60 bg-cyan-950/70 px-1.5 py-0.5 font-pixel text-[8px] text-cyan-300">
                  {isSurvival
                    ? `${dict.common.sol} ${state.survival.sol}/30`
                    : `${dict.common.sol} ${state.stats.sol}`}
                </span>
              )}
              {isArcade && (
                <span className="rounded-sm border border-fuchsia-400/70 bg-fuchsia-950/80 px-1.5 py-0.5 font-pixel text-[8px] text-fuchsia-200">
                  {dict.arcade.hudBtn}
                </span>
              )}
              {isSurvival && (
                <span
                  className={`rounded-sm border px-1.5 py-0.5 font-dialog text-[11px] font-bold ${
                    survivalWeather.isCritical
                      ? 'border-rose-400 bg-rose-950/80 text-rose-200 animate-pulse'
                      : survivalWeather.isModerateAlert
                      ? 'border-amber-400 bg-amber-950/80 text-amber-200'
                      : 'border-emerald-400/60 bg-emerald-950/70 text-emerald-200'
                  }`}
                >
                  {weatherBadgeText}
                </span>
              )}
            </div>
            {!isArcade && (
              <p className="truncate font-dialog text-[11px] text-slate-400">
                {isSurvival ? dict.hud.survivalModeTitle : 'Arcadia Planitia'} •{' '}
                {dict.hud.sceneLabels[state.currentScene] ?? state.currentScene}
              </p>
            )}
          </div>
        </div>

        {/* Barras de Recursos + Relógio em Tempo Real */}
        {isArcade ? null : isSurvival ? (
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Relógio Digital Marciano + Arco Solar/Lunar */}
            <div
              className={`flex items-center gap-1.5 rounded-sm border px-2 py-1 font-dialog text-xs ${
                state.survival.clockMinutes >= 1080
                  ? 'border-rose-400 bg-rose-950/80 text-rose-100 animate-pulse'
                  : nightNow
                  ? 'border-indigo-400/70 bg-indigo-950/70 text-indigo-100'
                  : 'border-amber-400/70 bg-slate-900 text-amber-100'
              }`}
              title={dict.survival.realtime.solarOutputLabel(
                solarCalc.outputWatts,
                solarCalc.effectivePct
              )}
            >
              <Clock className="h-3.5 w-3.5 text-cyan-300" />
              <strong className="font-pixel text-[9px]">
                {dict.survival.realtime.clockBadge(state.survival.sol, clockStr)}
              </strong>
              {/* Mini arco visual Sol/Lua */}
              <span className="relative inline-block h-3.5 w-10 overflow-hidden rounded-t-full border-b border-slate-600 bg-slate-950/90">
                <span
                  style={{
                    left: `${Math.round(arcInfo.progress * 82)}%`,
                    bottom: `${Math.round(Math.sin(arcInfo.progress * Math.PI) * 55)}%`,
                  }}
                  className="absolute text-[9px] leading-none"
                >
                  {arcInfo.isNight ? '🌙' : '☀️'}
                </span>
              </span>
              <span className="hidden text-[10px] text-amber-300 sm:inline">
                {solarCalc.outputWatts}W
              </span>
            </div>

            {/* Botão Pausar / Continuar */}
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                toggleSurvivalClockPause();
              }}
              className={`touch-none select-none inline-flex min-h-[34px] items-center gap-1 rounded-sm border px-2 py-1 font-pixel text-[8px] ${
                state.survival.clockPaused
                  ? 'border-amber-400 bg-amber-400 text-slate-950 animate-pulse'
                  : 'border-slate-600 bg-slate-900 text-slate-200 hover:border-cyan-400'
              }`}
              title={
                state.survival.clockPaused
                  ? dict.survival.realtime.resumeBtn
                  : dict.survival.realtime.pauseBtn
              }
            >
              {state.survival.clockPaused ? (
                <Play className="h-3 w-3" />
              ) : (
                <Pause className="h-3 w-3" />
              )}
              <span className="hidden md:inline">
                {state.survival.clockPaused ? dict.survival.realtime.pausedTag : '⏸'}
              </span>
            </button>

            {/* Botão 2x Acelerar Noite (apenas à noite dentro do Habitat) */}
            <button
              type="button"
              disabled={!fastForwardAllowed}
              onClick={() => {
                soundEngine.playClick();
                toggleSurvivalFastForward2x();
              }}
              title={
                fastForwardAllowed
                  ? dict.survival.realtime.fastForwardBtn
                  : dict.survival.realtime.fastForwardHintDisabled
              }
              className={`touch-none select-none inline-flex min-h-[34px] items-center gap-1 rounded-sm border px-2 py-1 font-pixel text-[8px] ${
                !fastForwardAllowed
                  ? 'cursor-not-allowed border-slate-800 bg-slate-900/50 text-slate-500 opacity-55'
                  : state.survival.fastForward2x
                  ? 'border-indigo-300 bg-indigo-400 text-slate-950 animate-pulse'
                  : 'border-indigo-500/70 bg-indigo-950/70 text-indigo-200 hover:bg-indigo-900'
              }`}
            >
              <FastForward className="h-3 w-3" />
              2x
            </button>

            <div className="flex items-center gap-1 rounded-sm border border-emerald-500/60 bg-slate-900 px-2 py-1 font-dialog text-xs">
              <Flame className="h-3.5 w-3.5 text-emerald-300" />
              <span className="hidden text-slate-400 sm:inline">{dict.common.stamina}:</span>
              <strong className={state.survival.stamina < 25 ? 'text-rose-300' : 'text-emerald-300'}>
                {state.survival.stamina}%
              </strong>
            </div>

            <div className="flex items-center gap-1 rounded-sm border border-orange-500/50 bg-slate-900 px-2 py-1 font-dialog text-xs">
              <Utensils className="h-3.5 w-3.5 text-orange-300" />
              <span className="hidden text-slate-400 lg:inline">{dict.survival.realtime.hungerLabel}:</span>
              <strong className={state.survival.hunger <= 25 ? 'text-rose-300' : 'text-orange-200'}>
                {state.survival.hunger}%
              </strong>
            </div>

            <div className="flex items-center gap-1 rounded-sm border border-cyan-500/50 bg-slate-900 px-2 py-1 font-dialog text-xs">
              <Droplets className="h-3.5 w-3.5 text-cyan-300" />
              <span className="hidden text-slate-400 lg:inline">{dict.survival.realtime.thirstLabel}:</span>
              <strong className={state.survival.thirst <= 25 ? 'text-rose-300' : 'text-cyan-200'}>
                {state.survival.thirst}%
              </strong>
            </div>

            {(() => {
              const alerts = getLocalizedDominoAlerts(state.survival, dict);
              return alerts.length > 0 ? (
                <span
                  title={alerts.join(' | ')}
                  className="rounded-sm border border-rose-500/80 bg-rose-950/90 px-2 py-0.5 font-pixel text-[8px] text-rose-200 animate-pulse"
                >
                  ⚠️ {alerts.length}
                </span>
              ) : null;
            })()}

            <div
              className="flex items-center gap-1 rounded-sm border border-slate-700 bg-slate-900 px-2 py-1 font-dialog text-xs"
              title={`${dict.hud.cascadeTooltipPrefix}: ${state.survival.panelDustPct}%`}
            >
              <BatteryCharging className="h-3.5 w-3.5 text-amber-300" />
              <strong className={state.survival.energy <= 25 ? 'text-rose-300' : 'text-amber-200'}>
                {state.survival.energy}%
              </strong>
            </div>

            <div className="flex items-center gap-1 rounded-sm border border-slate-700 bg-slate-900 px-2 py-1 font-dialog text-xs">
              <Sun className="h-3.5 w-3.5 text-sky-400" />
              <strong className={state.survival.water <= 25 ? 'text-rose-300' : 'text-sky-300'}>
                {state.survival.water}%
              </strong>
            </div>

            <div className="flex items-center gap-1 rounded-sm border border-slate-700 bg-slate-900 px-2 py-1 font-dialog text-xs">
              <HeartPulse className="h-3.5 w-3.5 text-rose-400" />
              <strong className={state.survival.health <= 30 ? 'text-rose-400' : 'text-rose-300'}>
                {state.survival.health}%
              </strong>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div
              className="flex items-center gap-1.5 rounded-sm border border-slate-700 bg-slate-900 px-2 py-1"
              title={dict.hud.tooltipSolarInactive}
            >
              <BatteryCharging
                className={`h-4 w-4 ${
                  state.stats.solarInstalled ? 'text-emerald-400' : 'text-amber-400'
                }`}
              />
              <div className="font-dialog text-xs">
                <span className="text-slate-400">{dict.common.energy}: </span>
                <span
                  className={
                    state.stats.solarInstalled ? 'text-emerald-300' : 'text-amber-300'
                  }
                >
                  {state.stats.energy}%
                </span>
              </div>
            </div>

            <div
              className="flex items-center gap-1.5 rounded-sm border border-slate-700 bg-slate-900 px-2 py-1"
              title={dict.hud.tooltipWaterShip}
            >
              <Droplets className="h-4 w-4 text-sky-400" />
              <div className="font-dialog text-xs">
                <span className="text-slate-400">{dict.common.water}: </span>
                <span className="text-sky-300">{state.stats.water}%</span>
              </div>
            </div>

            <div
              className="flex items-center gap-1.5 rounded-sm border border-slate-700 bg-slate-900 px-2 py-1"
              title={dict.hud.tooltipHealthSim}
            >
              <HeartPulse className="h-4 w-4 text-rose-400" />
              <div className="font-dialog text-xs">
                <span className="text-slate-400">{dict.common.health}: </span>
                <span className="text-rose-300">{state.stats.health}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Botões Permanentes (Idioma / Diário / Som / Tela Cheia / Reset) */}
        <div className="flex flex-wrap items-center gap-1.5">
          <LanguageToggleButton compact />

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              openModal('LOGBOOK');
            }}
            className="pixel-btn inline-flex min-h-[38px] items-center gap-1.5 bg-amber-400 px-2.5 py-1.5 font-dialog text-xs font-bold text-slate-950 hover:bg-amber-300"
          >
            <BookOpen className="h-3.5 w-3.5" />
            {dict.hud.logbookBtn} ({state.logbook.length})
          </button>

          <button
            type="button"
            onClick={handleToggleMute}
            aria-label={muted ? dict.hud.soundOffTitle : dict.hud.soundOnTitle}
            className="flex min-h-[38px] min-w-[38px] items-center justify-center rounded-sm border-2 border-slate-700 bg-slate-900 p-1.5 text-slate-200 hover:border-cyan-400"
            title={muted ? dict.hud.soundOffTitle : dict.hud.soundOnTitle}
          >
            {muted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4 text-cyan-300" />}
          </button>

          <button
            type="button"
            onClick={handleToggleFullscreen}
            aria-label={isFullscreen ? dict.hud.fullscreenExitTitle : dict.hud.fullscreenEnterTitle}
            title={isFullscreen ? dict.hud.fullscreenExitTitle : dict.hud.fullscreenEnterTitle}
            className="inline-flex min-h-[38px] items-center gap-1 rounded-sm border-2 border-slate-700 bg-slate-900 px-2 py-1 font-dialog text-[11px] font-bold text-slate-200 hover:border-cyan-400 hover:text-cyan-200"
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5 text-amber-300" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5 text-cyan-300" />
            )}
            <span>{isFullscreen ? dict.hud.fullscreenExitShort : dict.hud.fullscreenEnterShort}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              resetGame();
            }}
            title={dict.hud.restartTitle}
            aria-label={dict.hud.restartShort}
            className="flex min-h-[38px] min-w-[38px] items-center justify-center rounded-sm border-2 border-slate-700 bg-slate-900 p-1.5 text-slate-300 hover:border-orange-400 hover:text-orange-300"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
