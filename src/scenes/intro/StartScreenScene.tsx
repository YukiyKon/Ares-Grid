import React, { useState } from 'react';
import { Maximize2, Rocket, Sparkles } from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { enterSafeFullscreen } from '../../core/fullscreen';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';
import { LanguageToggleButton, useLanguage } from '../../i18n/LanguageContext';

export const StartScreenScene: React.FC = () => {
  const { setScene, startSurvivalMode } = useGameStore();
  const { dict } = useLanguage();
  const [imgError, setImgError] = useState(false);

  const handleStartFullscreen = () => {
    soundEngine.unlock();
    soundEngine.playSuccess();
    void enterSafeFullscreen();
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
    void enterSafeFullscreen();
    startSurvivalMode();
  };

  return (
    <main className="fixed inset-0 z-40 flex min-h-[100dvh] select-none flex-col items-center justify-start overflow-y-auto overflow-x-hidden bg-gradient-to-b from-black via-slate-950 to-orange-950/80 px-3 py-5 text-center sm:justify-center sm:px-4 sm:py-8">
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

      <div className="pixel-box relative z-10 flex w-full max-w-2xl flex-col items-center gap-4 bg-slate-950/92 px-4 py-6 shadow-[0_0_50px_rgba(249,115,22,0.25)] sm:gap-5 sm:px-10 sm:py-8">
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2 rounded-sm border border-cyan-400/70 bg-cyan-950/70 px-2.5 py-1 font-pixel text-[8px] text-cyan-200 sm:px-3 sm:text-[9px]">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-300" />
            {dict.start.badge}
          </span>
          <LanguageToggleButton />
        </div>

        {/* Retrato pixelado da Capi */}
        <div className="relative flex h-24 w-24 items-center justify-center rounded-sm border-2 border-cyan-400/80 bg-cyan-950/50 p-2 shadow-[0_0_28px_rgba(34,211,238,0.3)] sm:h-28 sm:w-28">
          {!imgError ? (
            <img
              src={ASSET_MANIFEST.capiPortrait.path}
              alt={ASSET_MANIFEST.capiPortrait.alt}
              onError={() => setImgError(true)}
              className="pixel-art h-20 w-20 animate-floatSlow object-contain sm:h-24 sm:w-24"
            />
          ) : (
            <Rocket className="h-12 w-12 text-amber-300" />
          )}
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          <h1 className="font-pixel text-base leading-relaxed text-amber-300 drop-shadow-[0_3px_0_rgba(124,45,18,0.9)] sm:text-2xl">
            {dict.start.title}
          </h1>
          <p className="mx-auto max-w-lg font-dialog text-sm leading-relaxed text-slate-200 sm:text-base">
            {dict.start.subtitlePrefix}
            <strong className="text-amber-200">{dict.start.mode1Label}</strong>
            {dict.start.subtitleMiddle}
            <strong className="text-emerald-300">{dict.start.mode2Label}</strong>!
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-3 pt-1 sm:grid-cols-2 sm:pt-2">
          <div className="flex flex-col justify-between gap-2.5 rounded-sm border-2 border-amber-400/70 bg-slate-900/90 p-3.5 text-left">
            <div>
              <span className="font-pixel text-[8px] text-amber-300">
                {dict.start.mode1Tag}
              </span>
              <h2 className="mt-1 font-dialog text-sm font-bold text-slate-100">
                {dict.start.mode1Title}
              </h2>
              <p className="mt-0.5 font-dialog text-xs text-slate-300">
                {dict.start.mode1Desc}
              </p>
            </div>
            <button
              type="button"
              onClick={handleStartFullscreen}
              className="pixel-btn flex min-h-[44px] w-full items-center justify-center gap-2 bg-amber-400 px-4 py-3 font-pixel text-[10px] leading-snug text-slate-950 shadow-[0_0_24px_rgba(251,191,36,0.35)] transition hover:scale-[1.02] hover:bg-amber-300"
            >
              <Maximize2 className="h-4 w-4 shrink-0" />
              <span>{dict.start.mode1Btn}</span>
            </button>
          </div>

          <div className="flex flex-col justify-between gap-2.5 rounded-sm border-2 border-emerald-400/75 bg-emerald-950/35 p-3.5 text-left">
            <div>
              <span className="font-pixel text-[8px] text-emerald-300">
                {dict.start.mode2Tag}
              </span>
              <h2 className="mt-1 font-dialog text-sm font-bold text-slate-100">
                {dict.start.mode2Title}
              </h2>
              <p className="mt-0.5 font-dialog text-xs text-slate-300">
                {dict.start.mode2Desc}
              </p>
            </div>
            <button
              type="button"
              onClick={handleStartSurvival30}
              className="pixel-btn flex min-h-[44px] w-full items-center justify-center gap-2 bg-emerald-400 px-4 py-3 font-pixel text-[10px] leading-snug text-slate-950 shadow-[0_0_24px_rgba(52,211,153,0.35)] transition hover:scale-[1.02] hover:bg-emerald-300"
            >
              <Rocket className="h-4 w-4 shrink-0" />
              <span>{dict.start.mode2Btn}</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleStartWindowed}
          className="min-h-[40px] rounded-sm border border-slate-700 bg-slate-900/70 px-4 py-2 font-dialog text-xs text-slate-300 underline-offset-2 transition hover:border-cyan-400 hover:text-cyan-200"
        >
          {dict.start.windowedBtn}
        </button>
      </div>
    </main>
  );
};
