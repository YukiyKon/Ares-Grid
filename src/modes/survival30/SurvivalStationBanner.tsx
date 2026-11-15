import React from 'react';
import { Flame, Sparkles, Timer } from 'lucide-react';
import { useGameStore } from '../../core/gameStore';
import {
  SURVIVAL_STATION_RULES,
  type SurvivalStationId,
} from './survivalTypes';
import { getSolWeather } from './weatherScheduler';

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
  if (state.gameMode !== 'SURVIVAL_30') return null;

  const rule = SURVIVAL_STATION_RULES[station];
  const weather = getSolWeather(state.survival.sol);

  return (
    <div className="rounded-sm border-2 border-emerald-400/75 bg-gradient-to-r from-emerald-950/80 via-slate-950 to-cyan-950/60 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-sm border border-emerald-400 bg-emerald-950 px-2 py-0.5 font-pixel text-[8px] text-emerald-200">
            MODO SOBREVIVÊNCIA • SOL {state.survival.sol}/30
          </span>
          <span className="inline-flex items-center gap-1 rounded-sm border border-amber-400/60 bg-slate-900 px-2 py-0.5 font-pixel text-[8px] text-amber-200">
            <Timer className="h-3 w-3" /> TURNOS: {state.survival.turnsLeft}/4
          </span>
          <span className="inline-flex items-center gap-1 rounded-sm border border-cyan-400/60 bg-slate-900 px-2 py-0.5 font-pixel text-[8px] text-cyan-200">
            <Flame className="h-3 w-3 text-emerald-300" /> STAMINA: {state.survival.stamina}%
          </span>
          <span className="rounded-sm border border-slate-700 bg-slate-900 px-2 py-0.5 font-dialog text-[11px] text-slate-200">
            Clima: {weather.shortBadge}
          </span>
        </div>

        {onCompleteTurn && (
          <button
            type="button"
            disabled={!canCompleteTurn}
            onClick={onCompleteTurn}
            className="pixel-btn inline-flex items-center gap-1.5 bg-emerald-400 px-3 py-1.5 font-pixel text-[9px] text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {completeButtonLabel ?? `Concluir Operação (${rule.costLabel}) ▶`}
          </button>
        )}
      </div>

      <p className="mt-1.5 font-dialog text-xs text-slate-200">
        <strong className="text-amber-300">Custo:</strong> {rule.costLabel} &nbsp;|&nbsp;{' '}
        <strong className="text-emerald-300">Recompensa:</strong> {rule.rewardLabel}
      </p>
    </div>
  );
};
