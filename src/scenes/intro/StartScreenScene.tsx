import React, { useState } from 'react';
import { Maximize2, Rocket, Sparkles } from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

export const StartScreenScene: React.FC = () => {
  const { setScene, startSurvivalMode } = useGameStore();
  const [imgError, setImgError] = useState(false);

  const handleStartFullscreen = () => {
    soundEngine.unlock();
    soundEngine.playSuccess();
    try {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        void document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch {
      // Fallback silencioso caso o navegador bloqueie tela cheia
    }
    setScene('COUNTDOWN');
  };

  const handleStartWindowed = () => {
    soundEngine.unlock();
    soundEngine.playClick();
    setScene('COUNTDOWN');
  };

  const handleStartSurvival30 = () => {
    soundEngine.unlock();
    soundEngine.playSuccess();
    try {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
        void document.documentElement.requestFullscreen().catch(() => {});
      }
    } catch {
      // Fallback silencioso caso o navegador bloqueie tela cheia
    }
    startSurvivalMode();
  };

  return (
    <main className="fixed inset-0 z-40 flex select-none flex-col items-center justify-center overflow-y-auto bg-gradient-to-b from-black via-slate-950 to-orange-950/80 px-4 py-8 text-center">
      {/* Campo estrelado sutil em pixel art */}
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.85) 1px, transparent 1px), radial-gradient(circle, rgba(56,189,248,0.65) 1px, transparent 1px)',
          backgroundSize: '48px 48px, 84px 84px',
          backgroundPosition: '0 0, 22px 30px',
        }}
      />

      <div className="pixel-box relative z-10 flex w-full max-w-2xl flex-col items-center gap-5 bg-slate-950/92 px-6 py-8 shadow-[0_0_50px_rgba(249,115,22,0.25)] sm:px-10">
        <span className="inline-flex items-center gap-2 rounded-sm border border-cyan-400/70 bg-cyan-950/70 px-3 py-1 font-pixel text-[9px] text-cyan-200">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          NASA • ARCADIA PLANITIA (~39.2°N)
        </span>

        {/* Retrato pixelado da Capi */}
        <div className="relative flex h-28 w-28 items-center justify-center rounded-sm border-2 border-cyan-400/80 bg-cyan-950/50 p-2 shadow-[0_0_28px_rgba(34,211,238,0.3)]">
          {!imgError ? (
            <img
              src={ASSET_MANIFEST.capiPortrait.path}
              alt={ASSET_MANIFEST.capiPortrait.alt}
              onError={() => setImgError(true)}
              className="pixel-art h-24 w-24 animate-floatSlow object-contain"
            />
          ) : (
            <Rocket className="h-12 w-12 text-amber-300" />
          )}
        </div>

        <div className="space-y-3">
          <h1 className="font-pixel text-lg leading-relaxed text-amber-300 drop-shadow-[0_3px_0_rgba(124,45,18,0.9)] sm:text-2xl">
            AVENTURA EM MARTE: ARCADIA PLANITIA
          </h1>
          <p className="mx-auto max-w-lg font-dialog text-sm leading-relaxed text-slate-200 sm:text-base">
            Escolha seu modo de missão: aprenda os sistemas científicos no{' '}
            <strong className="text-amber-200">Modo 1 (Treinamento de Cadete)</strong> ou encare
            o desafio estratégico no{' '}
            <strong className="text-emerald-300">Modo 2 (Sobreviver 30 Sols)</strong>!
          </p>
        </div>

        <div className="grid w-full gap-3 pt-2 sm:grid-cols-2">
          <div className="flex flex-col justify-between gap-2.5 rounded-sm border-2 border-amber-400/70 bg-slate-900/90 p-3.5 text-left">
            <div>
              <span className="font-pixel text-[8px] text-amber-300">
                MODO 1 • TUTORIAL GUIADO
              </span>
              <h2 className="mt-1 font-dialog text-sm font-bold text-slate-100">
                Treinamento de Cadete (5 Missões + História)
              </h2>
              <p className="mt-0.5 font-dialog text-xs text-slate-300">
                Contagem regressiva, personalização de traje e mini-games passo a passo com a Capi.
              </p>
            </div>
            <button
              type="button"
              onClick={handleStartFullscreen}
              className="pixel-btn flex w-full items-center justify-center gap-2 bg-amber-400 px-4 py-3 font-pixel text-[10px] leading-snug text-slate-950 shadow-[0_0_24px_rgba(251,191,36,0.35)] transition hover:scale-[1.02] hover:bg-amber-300"
            >
              <Maximize2 className="h-4 w-4 shrink-0" />
              <span>🚀 INICIAR TREINAMENTO</span>
            </button>
          </div>

          <div className="flex flex-col justify-between gap-2.5 rounded-sm border-2 border-emerald-400/75 bg-emerald-950/35 p-3.5 text-left">
            <div>
              <span className="font-pixel text-[8px] text-emerald-300">
                MODO 2 • DESAFIO DE SOBREVIVÊNCIA
              </span>
              <h2 className="mt-1 font-dialog text-sm font-bold text-slate-100">
                Expedição Real: 30 Sols em Arcadia
              </h2>
              <p className="mt-0.5 font-dialog text-xs text-slate-300">
                Mapa livre, 4 turnos/Sol, gestão de Stamina, energia, água, comida e tempestades!
              </p>
            </div>
            <button
              type="button"
              onClick={handleStartSurvival30}
              className="pixel-btn flex w-full items-center justify-center gap-2 bg-emerald-400 px-4 py-3 font-pixel text-[10px] leading-snug text-slate-950 shadow-[0_0_24px_rgba(52,211,153,0.35)] transition hover:scale-[1.02] hover:bg-emerald-300"
            >
              <Rocket className="h-4 w-4 shrink-0" />
              <span>🚀 Iniciar Expedição 30 Sols</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleStartWindowed}
          className="rounded-sm border border-slate-700 bg-slate-900/70 px-4 py-1.5 font-dialog text-xs text-slate-300 underline-offset-2 transition hover:border-cyan-400 hover:text-cyan-200"
        >
          Jogar Treinamento em janela normal
        </button>
      </div>
    </main>
  );
};
