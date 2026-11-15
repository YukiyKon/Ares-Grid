import React from 'react';
import { Clock, Droplets, Flame, Sparkles, Utensils } from 'lucide-react';
import { useGameStore } from '../../core/gameStore';
import { useLanguage } from '../../i18n/LanguageContext';
import { getLocalizedStationRule, getLocalizedWeather } from './survivalI18n';
import {
  formatMarsClock,
  type SurvivalStationId,
} from './survivalTypes';
import { computeSolarEfficiency, getSolWeather } from './weatherScheduler';

interface SurvivalStationBannerProps {
  station: SurvivalStationId;
  onCompleteTurn?: () => void;
  canCompleteTurn?: boolean;
  completeButtonLabel?: string;
}

export const SurvivalStationBanner: React.FC<SurvivalStationBannerProps> = ({
  station,
  onCompleteTurn,
  canCompleteTurn = false,
  completeButtonLabel,
}) => {
  const { state } = useGameStore();
  const { dict } = useLanguage();
  if (state.gameMode !== 'SURVIVAL_30') return null;

  const rule = getLocalizedStationRule(station, dict);
  const baseWeather = getSolWeather(state.survival.sol, state.survival.stormSchedule);
  const weather = getLocalizedWeather(baseWeather.type, dict);
  const b = dict.survival.stationBanner;
  const rt = dict.survival.realtime;
  const clockStr = formatMarsClock(state.survival.clockMinutes);
  const solar = computeSolarEfficiency(
    state.survival.clockMinutes,
    state.survival.panelDustPct,
    baseWeather.type,
    state.survival.stormEvent.phase === 'IMPACT'
  );

  return (
    <div className="rounded-sm border-2 border-emerald-400/75 bg-gradient-to-r from-emerald-950/80 via-slate-950 to-cyan-950/60 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-sm border border-emerald-400 bg-emerald-950 px-2 py-0.5 font-pixel text-[8px] text-emerald-200">
            <Clock className="h-3 w-3 text-cyan-300" />
            {rt.clockBadge(state.survival.sol, clockStr)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-sm border border-cyan-400/60 bg-slate-900 px-2 py-0.5 font-pixel text-[8px] text-cyan-200">
            <Flame className="h-3 w-3 text-emerald-300" /> {dict.common.stamina.toUpperCase()}: {state.survival.stamina}%
          </span>
          <span className="inline-flex items-center gap-1 rounded-sm border border-orange-400/60 bg-slate-900 px-2 py-0.5 font-pixel text-[8px] text-orange-200">
            <Utensils className="h-3 w-3" /> {state.survival.hunger}%
          </span>
          <span className="inline-flex items-center gap-1 rounded-sm border border-sky-400/60 bg-slate-900 px-2 py-0.5 font-pixel text-[8px] text-sky-200">
            <Droplets className="h-3 w-3" /> {state.survival.thirst}%
          </span>
          <span className="rounded-sm border border-amber-400/50 bg-slate-900 px-2 py-0.5 font-dialog text-[11px] text-amber-200">
            {rt.solarOutputLabel(solar.outputWatts, solar.effectivePct)}
          </span>
          <span className="rounded-sm border border-slate-700 bg-slate-900 px-2 py-0.5 font-dialog text-[11px] text-slate-200">
            {b.weatherLabel} {weather.shortBadge}
          </span>
        </div>

        {onCompleteTurn && (
          <button
            type="button"
            disabled={!canCompleteTurn}
            onClick={onCompleteTurn}
            className="pixel-btn touch-none select-none inline-flex items-center gap-1.5 bg-emerald-400 px-3 py-1.5 font-pixel text-[9px] text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {completeButtonLabel ?? `${b.completeDefaultBtn} ▶`}
          </button>
        )}
      </div>

      <p className="mt-1.5 font-dialog text-xs text-slate-200">
        <strong className="text-amber-300">{b.costPrefix}</strong> {rule.costLabel} &nbsp;|&nbsp;{' '}
        <strong className="text-emerald-300">{b.rewardPrefix}</strong> {rule.rewardLabel}
      </p>
    </div>
  );
};
