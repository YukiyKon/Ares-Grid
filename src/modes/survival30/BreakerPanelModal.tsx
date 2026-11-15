import React from 'react';
import {
  BatteryCharging,
  Flame,
  Lightbulb,
  Power,
  Radar,
  ShieldCheck,
  Sun,
  X,
} from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';
import { useLanguage } from '../../i18n/LanguageContext';
import { computeSolarEfficiency, getSolWeather } from './weatherScheduler';
import { isMarsNight } from './survivalTypes';

export const BreakerPanelModal: React.FC = () => {
  const { state, openModal, toggleSurvivalBreaker } = useGameStore();
  const { dict, tx } = useLanguage();

  if (state.gameMode !== 'SURVIVAL_30' || state.activeModal !== 'BREAKERS') {
    return null;
  }

  const { survival } = state;
  const { breakers } = survival;
  const rt = dict.survival.realtime;
  const nightNow = isMarsNight(survival.clockMinutes);
  const weather = getSolWeather(survival.sol, survival.stormSchedule);
  const solar = computeSolarEfficiency(
    survival.clockMinutes,
    survival.panelDustPct,
    weather.type,
    survival.stormEvent.phase === 'IMPACT'
  );

  const estimatedDrainW =
    85 +
    (breakers.greenhouseLeds ? (nightNow ? 110 : 40) : 0) +
    (breakers.habitatHeater ? (nightNow ? 80 : 30) : 0) +
    (breakers.orbitalRadar ? 45 : 0);
  const netWatts = solar.outputWatts - estimatedDrainW;

  const toggleItem = (key: 'greenhouseLeds' | 'habitatHeater' | 'orbitalRadar') => {
    soundEngine.playClick();
    toggleSurvivalBreaker(key);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={rt.breakersTitle}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-2 backdrop-blur-sm sm:p-4"
    >
      <div className="pixel-box max-h-[92dvh] w-full max-w-2xl overflow-y-auto border-2 border-cyan-400 bg-slate-950 p-3 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Power className="h-5 w-5 text-cyan-300" />
            <div>
              <h2 className="font-pixel text-[11px] text-cyan-200 sm:text-xs">
                {rt.breakersTitle}
              </h2>
              <p className="font-dialog text-xs text-slate-300">{rt.breakersSub}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              openModal('NONE');
            }}
            className="touch-none select-none inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-sm border border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Visual Sprite + Balanço Elétrico Ao Vivo */}
        <div className="mb-4 grid gap-3 sm:grid-cols-[160px_1fr]">
          <div className="overflow-hidden rounded-sm border-2 border-cyan-500/40 bg-slate-900">
            <img
              src={ASSET_MANIFEST.survivalBreakerPanel.path}
              alt={ASSET_MANIFEST.survivalBreakerPanel.alt}
              className="pixel-art h-36 w-full object-cover sm:h-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-sm border border-slate-700 bg-slate-900 p-2.5">
              <span className="flex items-center gap-1 font-dialog text-[11px] text-slate-400">
                <Sun className="h-3.5 w-3.5 text-amber-300" />
                {tx('Solar Input', 'Geração Solar')}
              </span>
              <strong className="mt-0.5 block font-pixel text-xs text-amber-300">
                +{solar.outputWatts} W
              </strong>
              <span className="font-dialog text-[10px] text-slate-400">
                {nightNow
                  ? tx('Night (0 W)', 'Noite (0 W)')
                  : `${solar.effectivePct}% ${tx('net', 'útil')}`}
              </span>
            </div>

            <div className="rounded-sm border border-slate-700 bg-slate-900 p-2.5">
              <span className="flex items-center gap-1 font-dialog text-[11px] text-slate-400">
                <BatteryCharging className="h-3.5 w-3.5 text-cyan-300" />
                {tx('Battery Load', 'Consumo Rede')}
              </span>
              <strong
                className={`mt-0.5 block font-pixel text-xs ${
                  netWatts >= 0 ? 'text-emerald-300' : 'text-rose-300'
                }`}
              >
                {netWatts >= 0 ? `+${netWatts}` : netWatts} W
              </strong>
              <span className="font-dialog text-[10px] text-slate-400">
                {tx('Battery', 'Bateria')}: {survival.energy}%
              </span>
            </div>

            <div className="col-span-2 rounded-sm border border-indigo-500/40 bg-indigo-950/35 px-2.5 py-2 font-dialog text-xs text-indigo-100">
              {nightNow
                ? tx(
                    '🌙 Nighttime: 0 W solar! Turn off non-essential LEDs/Radar to survive until 06:00 AM.',
                    '🌙 Noite marciana: 0 W solares! Desligue LEDs/Radar não essenciais para aguentar até as 06:00.'
                  )
                : tx(
                    '☀️ Daytime: Solar curve peaks between 11:00 and 14:30. Keep dust at 0%!',
                    '☀️ Dia marciano: pico solar entre 11:00 e 14:30. Mantenha a poeira em 0%!'
                  )}
            </div>
          </div>
        </div>

        {/* 4 Disjuntores Interativos */}
        <div className="space-y-2.5">
          {/* 1. Suporte de Vida O2 (Obrigatório) */}
          <div className="flex items-center justify-between gap-3 rounded-sm border-2 border-emerald-500/60 bg-emerald-950/25 p-3">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
              <div>
                <p className="font-pixel text-[10px] text-emerald-200">
                  {rt.breakerLifeSupport}
                </p>
                <p className="mt-0.5 font-dialog text-xs text-slate-300">
                  {rt.breakerLifeSupportDesc}
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-sm border border-emerald-400 bg-emerald-900/70 px-2.5 py-1.5 font-pixel text-[8px] text-emerald-200">
              ON • {rt.breakersMandatory}
            </span>
          </div>

          {/* 2. LEDs da Estufa */}
          <div
            className={`flex items-center justify-between gap-3 rounded-sm border-2 p-3 transition ${
              breakers.greenhouseLeds
                ? 'border-lime-400/70 bg-lime-950/25'
                : 'border-slate-700 bg-slate-900/80'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <Lightbulb
                className={`mt-0.5 h-5 w-5 shrink-0 ${
                  breakers.greenhouseLeds ? 'text-lime-300' : 'text-slate-500'
                }`}
              />
              <div>
                <p className="font-pixel text-[10px] text-lime-200">
                  {rt.breakerLeds}{' '}
                  <span className="font-dialog text-[11px] text-amber-300">
                    ({nightNow ? '-110 W' : '-40 W'})
                  </span>
                </p>
                <p className="mt-0.5 font-dialog text-xs text-slate-300">
                  {rt.breakerLedsDesc}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggleItem('greenhouseLeds')}
              className={`pixel-btn touch-none select-none min-h-[44px] shrink-0 px-3.5 py-2 font-pixel text-[9px] ${
                breakers.greenhouseLeds
                  ? 'bg-lime-400 text-slate-950 hover:bg-lime-300'
                  : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              {breakers.greenhouseLeds ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* 3. Aquecedor do Habitat */}
          <div
            className={`flex items-center justify-between gap-3 rounded-sm border-2 p-3 transition ${
              breakers.habitatHeater
                ? 'border-orange-400/70 bg-orange-950/25'
                : 'border-slate-700 bg-slate-900/80'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <Flame
                className={`mt-0.5 h-5 w-5 shrink-0 ${
                  breakers.habitatHeater ? 'text-orange-300' : 'text-slate-500'
                }`}
              />
              <div>
                <p className="font-pixel text-[10px] text-orange-200">
                  {rt.breakerHeater}{' '}
                  <span className="font-dialog text-[11px] text-amber-300">
                    ({nightNow ? '-80 W' : '-30 W'})
                  </span>
                </p>
                <p className="mt-0.5 font-dialog text-xs text-slate-300">
                  {rt.breakerHeaterDesc}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggleItem('habitatHeater')}
              className={`pixel-btn touch-none select-none min-h-[44px] shrink-0 px-3.5 py-2 font-pixel text-[9px] ${
                breakers.habitatHeater
                  ? 'bg-orange-400 text-slate-950 hover:bg-orange-300'
                  : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              {breakers.habitatHeater ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* 4. Radar Orbital */}
          <div
            className={`flex items-center justify-between gap-3 rounded-sm border-2 p-3 transition ${
              breakers.orbitalRadar
                ? 'border-cyan-400/70 bg-cyan-950/25'
                : 'border-slate-700 bg-slate-900/80'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <Radar
                className={`mt-0.5 h-5 w-5 shrink-0 ${
                  breakers.orbitalRadar ? 'text-cyan-300' : 'text-slate-500'
                }`}
              />
              <div>
                <p className="font-pixel text-[10px] text-cyan-200">
                  {rt.breakerRadar}{' '}
                  <span className="font-dialog text-[11px] text-amber-300">(-45 W)</span>
                </p>
                <p className="mt-0.5 font-dialog text-xs text-slate-300">
                  {rt.breakerRadarDesc}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggleItem('orbitalRadar')}
              className={`pixel-btn touch-none select-none min-h-[44px] shrink-0 px-3.5 py-2 font-pixel text-[9px] ${
                breakers.orbitalRadar
                  ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300'
                  : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
              }`}
            >
              {breakers.orbitalRadar ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
