import React from 'react';
import {
  AlertTriangle,
  BatteryCharging,
  Droplets,
  Power,
  ShieldCheck,
  Timer,
  Utensils,
  X,
} from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';
import { useLanguage } from '../../i18n/LanguageContext';

export const BunkerModal: React.FC = () => {
  const {
    state,
    openModal,
    setSurvivalInBunker,
    toggleSurvivalBreaker,
  } = useGameStore();
  const { dict, tx } = useLanguage();

  if (state.gameMode !== 'SURVIVAL_30' || state.activeModal !== 'BUNKER') {
    return null;
  }

  const { survival } = state;
  const { stormEvent, breakers } = survival;
  const rt = dict.survival.realtime;
  const isImpacting = stormEvent.phase === 'IMPACT';
  const isPrep = stormEvent.phase === 'PREP_COUNTDOWN';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={rt.bunkerTitle}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-2 backdrop-blur-sm sm:p-4"
    >
      <div className="pixel-box max-h-[92dvh] w-full max-w-2xl overflow-y-auto border-2 border-amber-400 bg-slate-950 p-3 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-300" />
            <div>
              <h2 className="font-pixel text-[11px] text-amber-200 sm:text-xs">
                {rt.bunkerTitle}
              </h2>
              <p className="font-dialog text-xs text-emerald-300">
                {rt.bunkerSafeBanner}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setSurvivalInBunker(false);
            }}
            className="touch-none select-none inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-sm border border-slate-700 bg-slate-900 text-slate-300 hover:border-amber-400 hover:text-white"
            title={rt.bunkerExitBtn}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Ilustração 16-bit do Interior do Bunker Blindado */}
        <div className="relative mb-3 overflow-hidden rounded-sm border-2 border-amber-500/60 bg-slate-900">
          <img
            src={ASSET_MANIFEST.survivalBunkerInterior.path}
            alt={ASSET_MANIFEST.survivalBunkerInterior.alt}
            className="pixel-art h-48 w-full object-cover sm:h-60"
          />
          {(isImpacting || isPrep) && (
            <div className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-sm border-2 border-rose-400 bg-slate-950/90 px-2.5 py-1 font-pixel text-[9px] text-rose-200 animate-pulse">
              <Timer className="h-3.5 w-3.5" />
              {isImpacting
                ? rt.stormImpactCountdown(Math.ceil(stormEvent.impactSecondsLeft))
                : rt.stormPrepCountdown(Math.ceil(stormEvent.prepSecondsLeft))}
            </div>
          )}
        </div>

        {/* Status de Suprimentos & Racionamento no Bunker */}
        <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div className="rounded-sm border border-slate-700 bg-slate-900 p-2">
            <span className="flex items-center gap-1 font-dialog text-[11px] text-slate-400">
              <BatteryCharging className="h-3.5 w-3.5 text-amber-300" />
              {dict.common.energy}
            </span>
            <strong className="font-pixel text-xs text-amber-200">{survival.energy}%</strong>
          </div>
          <div className="rounded-sm border border-slate-700 bg-slate-900 p-2">
            <span className="flex items-center gap-1 font-dialog text-[11px] text-slate-400">
              <Droplets className="h-3.5 w-3.5 text-sky-400" />
              {dict.common.water}
            </span>
            <strong className="font-pixel text-xs text-sky-300">{survival.water}%</strong>
          </div>
          <div className="rounded-sm border border-slate-700 bg-slate-900 p-2">
            <span className="flex items-center gap-1 font-dialog text-[11px] text-slate-400">
              <Utensils className="h-3.5 w-3.5 text-lime-300" />
              {dict.common.food}
            </span>
            <strong className="font-pixel text-xs text-lime-200">
              {survival.foodRations}
            </strong>
          </div>
          <div className="rounded-sm border border-slate-700 bg-slate-900 p-2">
            <span className="font-dialog text-[11px] text-slate-400">
              {dict.common.health}
            </span>
            <strong className="block font-pixel text-xs text-rose-300">
              {survival.health}%
            </strong>
          </div>
        </div>

        {/* Atalhos de Racionamento Rápido dentro do Bunker */}
        <div className="mb-4 rounded-sm border border-cyan-500/40 bg-slate-900/90 p-3">
          <p className="mb-2 flex items-center gap-1.5 font-pixel text-[9px] text-cyan-300">
            <Power className="h-3.5 w-3.5" />
            {tx('EMERGENCY RATIONING CONSOLE', 'CONSOLE DE RACIONAMENTO EMERGENCIAL')}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                toggleSurvivalBreaker('greenhouseLeds');
              }}
              className={`touch-none select-none min-h-[40px] rounded-sm border px-3 py-1.5 font-dialog text-xs font-bold ${
                breakers.greenhouseLeds
                  ? 'border-lime-400 bg-lime-950/60 text-lime-200'
                  : 'border-slate-600 bg-slate-800 text-slate-300'
              }`}
            >
              {rt.breakerLeds}: {breakers.greenhouseLeds ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                toggleSurvivalBreaker('orbitalRadar');
              }}
              className={`touch-none select-none min-h-[40px] rounded-sm border px-3 py-1.5 font-dialog text-xs font-bold ${
                breakers.orbitalRadar
                  ? 'border-cyan-400 bg-cyan-950/60 text-cyan-200'
                  : 'border-slate-600 bg-slate-800 text-slate-300'
              }`}
            >
              {rt.breakerRadar}: {breakers.orbitalRadar ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                openModal('BREAKERS');
              }}
              className="touch-none select-none min-h-[40px] rounded-sm border border-amber-400/60 bg-amber-950/50 px-3 py-1.5 font-dialog text-xs font-bold text-amber-200"
            >
              ⚡ {rt.breakersTitle}
            </button>
          </div>
        </div>

        {isImpacting && (
          <div className="mb-3 flex items-center gap-2 rounded-sm border border-rose-500/70 bg-rose-950/60 px-3 py-2 font-dialog text-xs text-rose-100">
            <AlertTriangle className="h-4 w-4 shrink-0 text-rose-300" />
            <span>
              {tx(
                'Extreme storm active outside! Exiting before the storm ends exposes you to radiation/dust damage.',
                'Tempestade extrema ativa lá fora! Sair antes do fim expõe o astronauta a dano severo.'
              )}
            </span>
          </div>
        )}

        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setSurvivalInBunker(false);
            }}
            className="pixel-btn touch-none select-none min-h-[44px] bg-amber-400 px-4 py-2 font-pixel text-[10px] text-slate-950 hover:bg-amber-300"
          >
            {rt.bunkerExitBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
