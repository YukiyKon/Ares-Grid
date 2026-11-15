import React, { useEffect, useState } from 'react';
import {
  BatteryCharging,
  BookOpen,
  Droplets,
  Flame,
  HeartPulse,
  Map,
  Maximize2,
  Minimize2,
  Moon,
  RotateCcw,
  ShieldAlert,
  Timer,
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
import { getSolWeather } from '../../modes/survival30/weatherScheduler';
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
    setScene,
    toggleGameMode,
    triggerSurvivalCrisis,
    resetGame,
  } = useGameStore();
  const { dict, lang, tx } = useLanguage();
  const isSurvival = state.gameMode === 'SURVIVAL_30';
  const survivalWeather = getSolWeather(state.survival.sol);
  const isDangerState =
    isSurvival &&
    state.survival.gameStatus === 'PLAYING' &&
    (state.survival.energy < 30 ||
      state.survival.water < 30 ||
      state.survival.health < 30 ||
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
              <span className="rounded-sm border border-cyan-500/60 bg-cyan-950/70 px-1.5 py-0.5 font-pixel text-[8px] text-cyan-300">
                {isSurvival
                  ? `${dict.common.sol} ${state.survival.sol}/30`
                  : `${dict.common.sol} ${state.stats.sol}`}
              </span>
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
            <p className="truncate font-dialog text-[11px] text-slate-400">
              {isSurvival ? dict.hud.survivalModeTitle : 'Arcadia Planitia'} •{' '}
              {dict.hud.sceneLabels[state.currentScene] ?? state.currentScene}
            </p>
          </div>
        </div>

        {/* Barras de Recursos */}
        {isSurvival ? (
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1 rounded-sm border border-indigo-500/60 bg-slate-900 px-2 py-1 font-dialog text-xs">
              <Timer className="h-3.5 w-3.5 text-indigo-300" />
              <span className="text-slate-400">{dict.common.turns}:</span>
              <strong className={state.survival.turnsLeft === 0 ? 'text-rose-300' : 'text-indigo-200'}>
                {state.survival.turnsLeft}/4
              </strong>
            </div>

            <div className="flex items-center gap-1 rounded-sm border border-emerald-500/60 bg-slate-900 px-2 py-1 font-dialog text-xs">
              <Flame className="h-3.5 w-3.5 text-emerald-300" />
              <span className="text-slate-400">{dict.common.stamina}:</span>
              <strong className={state.survival.stamina < 20 ? 'text-rose-300' : 'text-emerald-300'}>
                {state.survival.stamina}/{state.survival.maxStamina}%
              </strong>
            </div>

            {state.survival.dominoAlerts.length > 0 && (
              <span
                title={state.survival.dominoAlerts.join(' | ')}
                className="rounded-sm border border-rose-500/80 bg-rose-950/90 px-2 py-0.5 font-pixel text-[8px] text-rose-200 animate-pulse"
              >
                ⚠️ {state.survival.dominoAlerts.length} {dict.hud.cascadeBadge}
              </span>
            )}

            <div
              className="flex items-center gap-1 rounded-sm border border-slate-700 bg-slate-900 px-2 py-1 font-dialog text-xs"
              title={`${dict.hud.cascadeTooltipPrefix}: ${state.survival.panelDustPct}%`}
            >
              <BatteryCharging className="h-3.5 w-3.5 text-amber-300" />
              <span className="text-slate-400">{dict.common.energy}:</span>
              <strong className={state.survival.energy <= 25 ? 'text-rose-300' : 'text-amber-200'}>
                {state.survival.energy}%
              </strong>
            </div>

            <div className="flex items-center gap-1 rounded-sm border border-slate-700 bg-slate-900 px-2 py-1 font-dialog text-xs">
              <Droplets className="h-3.5 w-3.5 text-sky-400" />
              <span className="text-slate-400">{dict.common.water}:</span>
              <strong className={state.survival.water <= 25 ? 'text-rose-300' : 'text-sky-300'}>
                {state.survival.water}%
              </strong>
            </div>

            <div className="flex items-center gap-1 rounded-sm border border-slate-700 bg-slate-900 px-2 py-1 font-dialog text-xs">
              <Utensils className="h-3.5 w-3.5 text-lime-300" />
              <span className="text-slate-400">{dict.common.food}:</span>
              <strong className={state.survival.foodRations === 0 ? 'text-rose-300' : 'text-lime-200'}>
                {state.survival.foodRations}
              </strong>
            </div>

            <div className="flex items-center gap-1 rounded-sm border border-slate-700 bg-slate-900 px-2 py-1 font-dialog text-xs">
              <HeartPulse className="h-3.5 w-3.5 text-rose-400" />
              <span className="text-slate-400">{dict.common.health}:</span>
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

        {/* Botões Permanentes (Idioma / Modo / Mapa de Arcadia / Diário / Dormir / Som / Cenas / Reset) */}
        <div className="flex flex-wrap items-center gap-1.5">
          <LanguageToggleButton compact />

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              toggleGameMode();
            }}
            className={`pixel-btn inline-flex min-h-[38px] items-center gap-1 px-2.5 py-1.5 font-dialog text-xs font-bold text-slate-950 ${
              isSurvival
                ? 'bg-emerald-400 hover:bg-emerald-300'
                : 'bg-orange-400 hover:bg-orange-300'
            }`}
          >
            {isSurvival ? dict.hud.switchToTraining : dict.hud.switchToSurvival}
          </button>

          {isSurvival && (
            <button
              type="button"
              onClick={() => {
                triggerSurvivalCrisis();
              }}
              title={dict.hud.simulateCrisisTitle}
              className="pixel-btn inline-flex min-h-[38px] items-center gap-1 bg-rose-500 px-2.5 py-1.5 font-dialog text-xs font-bold text-white hover:bg-rose-400"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              {dict.hud.simulateCrisisBtn}
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              openModal('ARCADIA_MAP');
            }}
            className="pixel-btn inline-flex min-h-[38px] items-center gap-1.5 bg-emerald-400 px-2.5 py-1.5 font-dialog text-xs font-bold text-slate-950 hover:bg-emerald-300 sm:px-3"
          >
            <Map className="h-3.5 w-3.5" />
            {dict.hud.arcadiaMapBtn}
          </button>

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
            onClick={() => {
              soundEngine.playClick();
              openModal('SLEEP_REPORT');
            }}
            className={`pixel-btn inline-flex min-h-[38px] items-center gap-1.5 px-2.5 py-1.5 font-dialog text-xs font-bold text-slate-950 ${
              isSurvival && state.survival.turnsLeft === 0
                ? 'animate-pulse bg-indigo-300 hover:bg-indigo-200'
                : 'bg-indigo-400 hover:bg-indigo-300'
            }`}
          >
            <Moon className="h-3.5 w-3.5" />
            {dict.hud.sleepBtn}
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

          <select
            aria-label={tx('Navigate between mission scenes', 'Navegar entre cenas da Etapa 1')}
            value={state.currentScene}
            onChange={(e) => {
              soundEngine.playClick();
              setScene(e.target.value as GameSceneId);
            }}
            data-lang={lang}
            className="min-h-[38px] rounded-sm border-2 border-slate-700 bg-slate-900 px-1.5 py-1 font-dialog text-[11px] text-cyan-200 focus:border-cyan-400 focus:outline-none"
          >
            {(Object.keys(dict.hud.sceneLabels) as GameSceneId[]).map((sceneId) => (
              <option key={sceneId} value={sceneId}>
                {dict.hud.sceneLabels[sceneId]}
              </option>
            ))}
          </select>

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
