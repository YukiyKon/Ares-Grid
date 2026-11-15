import React, { useEffect, useState } from 'react';
import {
  BatteryCharging,
  BookOpen,
  Droplets,
  HeartPulse,
  Map,
  Maximize2,
  Minimize2,
  Moon,
  RotateCcw,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { type GameSceneId, useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';
import { AstronautAvatar } from './AstronautAvatar';

const SCENE_SHORT_LABELS: Record<GameSceneId, string> = {
  START_SCREEN: '0. Início',
  COUNTDOWN: '1. Contagem',
  LAUNCH: '2. Decolagem',
  CAPI_INTRO: '3. Capi',
  CUSTOMIZE: '3.1 Traje',
  LANDING: '4. Pouso',
  BASE_HUB: 'Base Arcadia',
  MISSION_1: 'Missão 1: Solar',
  MISSION_2: 'Missão 2: Saúde',
  MISSION_3: 'Missão 3: Gelo e Água',
  MISSION_4: 'Missão 4: Estufa',
  MISSION_5: 'Missão 5: Tempestades',
  EARTH_COMMS: '6. Central Terra',
  FUTURE_MARS: '7. Futuro em Marte',
};

const INTRO_SCENES: GameSceneId[] = [
  'START_SCREEN',
  'COUNTDOWN',
  'LAUNCH',
  'CAPI_INTRO',
  'CUSTOMIZE',
  'LANDING',
];

export const TopStatusHUD: React.FC = () => {
  const { state, openModal, setScene, resetGame } = useGameStore();
  const [muted, setMuted] = useState(() => soundEngine.isMuted());
  const [isFullscreen, setIsFullscreen] = useState(() =>
    typeof document !== 'undefined' ? Boolean(document.fullscreenElement) : false
  );

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
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
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          void document.documentElement.requestFullscreen().catch(() => {});
        }
      } else if (document.exitFullscreen) {
        void document.exitFullscreen().catch(() => {});
      }
    } catch {
      // Fallback silencioso caso o navegador bloqueie tela cheia
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b-4 border-slate-800 bg-slate-950/95 px-3 py-2 text-slate-100 shadow-lg backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2">
        {/* Identificação do Astronauta e Sol */}
        <div className="flex items-center gap-2.5">
          <div className="rounded-sm border-2 border-orange-400/80 bg-slate-900 p-0.5">
            <AstronautAvatar profile={state.astronaut} size="sm" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-[10px] text-orange-300">
                {state.astronaut.name}
              </span>
              <span className="rounded-sm border border-cyan-500/60 bg-cyan-950/70 px-1.5 py-0.5 font-pixel text-[8px] text-cyan-300">
                SOL {state.stats.sol}
              </span>
            </div>
            <p className="font-dialog text-[11px] text-slate-400">
              Arcadia Planitia • {SCENE_SHORT_LABELS[state.currentScene]}
            </p>
          </div>
        </div>

        {/* Barras de Recursos */}
        <div className="flex flex-wrap items-center gap-3">
          <div
            className="flex items-center gap-1.5 rounded-sm border border-slate-700 bg-slate-900 px-2 py-1"
            title="Energia do habitat (Painel solar ainda não instalado)"
          >
            <BatteryCharging
              className={`h-4 w-4 ${
                state.stats.solarInstalled ? 'text-emerald-400' : 'text-amber-400'
              }`}
            />
            <div className="font-dialog text-xs">
              <span className="text-slate-400">Energia: </span>
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
            title="Reserva de água da nave"
          >
            <Droplets className="h-4 w-4 text-sky-400" />
            <div className="font-dialog text-xs">
              <span className="text-slate-400">Água: </span>
              <span className="text-sky-300">{state.stats.water}%</span>
            </div>
          </div>

          <div
            className="flex items-center gap-1.5 rounded-sm border border-slate-700 bg-slate-900 px-2 py-1"
            title="Saúde simulada para fins educativos"
          >
            <HeartPulse className="h-4 w-4 text-rose-400" />
            <div className="font-dialog text-xs">
              <span className="text-slate-400">Saúde: </span>
              <span className="text-rose-300">{state.stats.health}%</span>
            </div>
          </div>
        </div>

        {/* Botões Permanentes (Mapa de Arcadia / Diário / Dormir / Som / Cenas / Reset) */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              openModal('ARCADIA_MAP');
            }}
            className="pixel-btn inline-flex items-center gap-1.5 bg-emerald-400 px-3 py-1.5 font-dialog text-xs font-bold text-slate-950 hover:bg-emerald-300"
          >
            <Map className="h-3.5 w-3.5" />
            🗺️ MAPA DE ARCADIA
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              openModal('LOGBOOK');
            }}
            className="pixel-btn inline-flex items-center gap-1.5 bg-amber-400 px-2.5 py-1.5 font-dialog text-xs font-bold text-slate-950 hover:bg-amber-300"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Diário ({state.logbook.length})
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              openModal('SLEEP_REPORT');
            }}
            className="pixel-btn inline-flex items-center gap-1.5 bg-indigo-400 px-2.5 py-1.5 font-dialog text-xs font-bold text-slate-950 hover:bg-indigo-300"
          >
            <Moon className="h-3.5 w-3.5" />
            Dormir
          </button>

          <button
            type="button"
            onClick={handleToggleMute}
            aria-label={muted ? 'Ativar som' : 'Silenciar som'}
            className="rounded-sm border-2 border-slate-700 bg-slate-900 p-1.5 text-slate-200 hover:border-cyan-400"
            title={muted ? 'Ativar áudio procedural' : 'Silenciar áudio'}
          >
            {muted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4 text-cyan-300" />}
          </button>

          <button
            type="button"
            onClick={handleToggleFullscreen}
            aria-label={isFullscreen ? 'Sair da tela cheia' : 'Ativar modo tela cheia'}
            title={isFullscreen ? 'Sair da tela cheia' : 'Expandir para tela cheia'}
            className="inline-flex items-center gap-1 rounded-sm border-2 border-slate-700 bg-slate-900 px-2 py-1 font-dialog text-[11px] font-bold text-slate-200 hover:border-cyan-400 hover:text-cyan-200"
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5 text-amber-300" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5 text-cyan-300" />
            )}
            <span>{isFullscreen ? '⛶ Sair' : '⛶ Tela Cheia'}</span>
          </button>

          <select
            aria-label="Navegar entre cenas da Etapa 1"
            value={state.currentScene}
            onChange={(e) => {
              soundEngine.playClick();
              setScene(e.target.value as GameSceneId);
            }}
            className="rounded-sm border-2 border-slate-700 bg-slate-900 px-1.5 py-1 font-dialog text-[11px] text-cyan-200 focus:border-cyan-400 focus:outline-none"
          >
            {(Object.keys(SCENE_SHORT_LABELS) as GameSceneId[]).map((sceneId) => (
              <option key={sceneId} value={sceneId}>
                {SCENE_SHORT_LABELS[sceneId]}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              resetGame();
            }}
            title="Reiniciar aventura do início (Contagem 10 a 0)"
            aria-label="Reiniciar aventura"
            className="rounded-sm border-2 border-slate-700 bg-slate-900 p-1.5 text-slate-300 hover:border-orange-400 hover:text-orange-300"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
