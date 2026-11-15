import React, { useEffect } from 'react';
import { AlertTriangle, Clock, HeartPulse, ShieldAlert } from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';
import { useLanguage } from '../../i18n/LanguageContext';

export const FaintRescueOverlay: React.FC = () => {
  const { state, resolveSurvivalFaint } = useGameStore();
  const { dict } = useLanguage();

  const isVisible =
    state.gameMode === 'SURVIVAL_30' &&
    state.survival.gameStatus === 'PLAYING' &&
    state.survival.faintState === 'FAINTED_0200';

  useEffect(() => {
    if (isVisible) {
      soundEngine.playAlert();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const rt = dict.survival.realtime;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-label={rt.faintTitle}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-3 backdrop-blur-sm"
    >
      <div className="pixel-box max-h-[92dvh] w-full max-w-xl overflow-y-auto border-4 border-rose-500 bg-slate-950 p-4 shadow-[0_0_50px_rgba(244,63,94,0.45)] sm:p-5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-rose-500/40 pb-2">
          <div className="flex items-center gap-2 text-rose-300">
            <ShieldAlert className="h-5 w-5 animate-pulse" />
            <h2 className="font-pixel text-[11px] text-rose-200 sm:text-xs">
              {rt.faintTitle}
            </h2>
          </div>
          <span className="rounded-sm border border-amber-400 bg-amber-950 px-2 py-0.5 font-pixel text-[8px] text-amber-200">
            {rt.faintBadge}
          </span>
        </div>

        {/* Ilustração 16-bit de Resgate às 02:00 AM */}
        <div className="mb-3 overflow-hidden rounded-sm border-2 border-amber-400/50 bg-slate-900">
          <img
            src={ASSET_MANIFEST.survivalFaintRescue.path}
            alt={ASSET_MANIFEST.survivalFaintRescue.alt}
            className="pixel-art h-48 w-full object-cover sm:h-56"
          />
        </div>

        {/* Fala da Capi */}
        <div className="mb-3 flex items-start gap-3 rounded-sm border-2 border-cyan-500/50 bg-cyan-950/35 p-3">
          <img
            src={ASSET_MANIFEST.capiPortrait.path}
            alt={ASSET_MANIFEST.capiPortrait.alt}
            className="pixel-art h-12 w-12 shrink-0 rounded-sm border border-cyan-400/60 bg-slate-900 object-contain"
          />
          <p className="font-dialog text-xs leading-relaxed text-cyan-100 sm:text-sm">
            “{rt.faintSpeech}”
          </p>
        </div>

        {/* Lista de Penalidades Estilo Harvest Moon */}
        <div className="mb-4 space-y-1.5 rounded-sm border border-rose-500/60 bg-rose-950/40 p-3 font-dialog text-xs text-rose-100">
          <p className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4 shrink-0 text-rose-400" />
            {rt.faintPenaltyHealth}
          </p>
          <p className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0 text-amber-300" />
            {rt.faintPenaltyWake}
          </p>
          <p className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-orange-300" />
            {rt.faintPenaltyStamina}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            resolveSurvivalFaint();
          }}
          className="pixel-btn touch-none select-none min-h-[46px] w-full bg-amber-400 px-4 py-3 font-pixel text-[10px] text-slate-950 hover:bg-amber-300"
        >
          {rt.faintWakeBtn}
        </button>
      </div>
    </div>
  );
};
