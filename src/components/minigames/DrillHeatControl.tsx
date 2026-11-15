import React, { useEffect, useRef, useState } from 'react';
import { Flame, Settings, Snowflake } from 'lucide-react';
import { soundEngine } from '../../core/soundEngine';

export interface DrillHeatControlProps {
  drillDepthStep: 0 | 1 | 2 | 3;
  resetNonce?: number;
  onDepthChange?: (depthM: number) => void;
  onStepReached: (step: 1 | 2 | 3) => void;
  onOverheat: () => void;
}

const OVERHEAT_LOCK_MS = 2500;

export function getGeologicalLayerInfo(depthM: number): {
  id: 'REGOLITH' | 'ROCK' | 'ICE';
  label: string;
  frictionNote: string;
} {
  if (depthM < 0.8) {
    return {
      id: 'REGOLITH',
      label: '0,0 m – 0,8 m • Regolito Superficial',
      frictionNote: 'Atrito moderado — solo arenoso seco',
    };
  }
  if (depthM < 1.5) {
    return {
      id: 'ROCK',
      label: '0,8 m – 1,5 m • Camada Rochosa Densa',
      frictionNote: 'ALTO ATRITO! Pulse e solte 1–2s para resfriar',
    };
  }
  return {
    id: 'ICE',
    label: '1,5 m – 2,2 m • Depósito de Gelo Subterrâneo',
    frictionNote: 'Cristais de H₂O detectados — avanço estável',
  };
}

export const DrillHeatControl: React.FC<DrillHeatControlProps> = ({
  drillDepthStep,
  resetNonce = 0,
  onDepthChange,
  onStepReached,
  onOverheat,
}) => {
  const [depthM, setDepthM] = useState<number>(0);
  const [heatPct, setHeatPct] = useState<number>(10);
  const [isDrilling, setIsDrilling] = useState(false);
  const [overheatMsLeft, setOverheatMsLeft] = useState<number>(0);

  const depthRef = useRef(0);
  const heatRef = useRef(10);
  const isDrillingRef = useRef(false);
  const overheatMsRef = useRef(0);
  const reachedStepRef = useRef<0 | 1 | 2 | 3>(drillDepthStep);
  const lastSoundAtRef = useRef(0);

  // Reinicia obrigatoriamente em 0,0 m quando resetNonce muda ou drillDepthStep volta a 0
  useEffect(() => {
    depthRef.current = 0;
    heatRef.current = 10;
    isDrillingRef.current = false;
    overheatMsRef.current = 0;
    reachedStepRef.current = 0;
    setDepthM(0);
    setHeatPct(10);
    setIsDrilling(false);
    setOverheatMsLeft(0);
    onDepthChange?.(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetNonce]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (overheatMsRef.current > 0) {
        const nextLock = Math.max(0, overheatMsRef.current - 45);
        overheatMsRef.current = nextLock;
        setOverheatMsLeft(nextLock);

        const cooled = Math.max(20, heatRef.current - 1.5);
        heatRef.current = cooled;
        setHeatPct(Math.round(cooled));

        if (nextLock === 0) {
          soundEngine.playClick();
        }
        return;
      }

      if (isDrillingRef.current && depthRef.current < 2.2) {
        const cur = depthRef.current;
        const isRockLayer = cur >= 0.8 && cur < 1.5;

        const depthGain = isRockLayer ? 0.02 : cur < 0.8 ? 0.03 : 0.028;
        const heatGain = isRockLayer ? 4.3 : cur < 0.8 ? 2.1 : 2.3;

        const nextDepth = Math.min(2.2, Number((cur + depthGain).toFixed(3)));
        const nextHeat = Math.min(100, heatRef.current + heatGain);

        depthRef.current = nextDepth;
        heatRef.current = nextHeat;
        setDepthM(nextDepth);
        setHeatPct(Math.round(nextHeat));
        onDepthChange?.(nextDepth);

        const now = performance.now();
        if (now - lastSoundAtRef.current >= 150) {
          soundEngine.playChargePulse(nextHeat / 100);
          lastSoundAtRef.current = now;
        }

        if (nextDepth >= 0.8 && reachedStepRef.current < 1) {
          reachedStepRef.current = 1;
          onStepReached(1);
        } else if (nextDepth >= 1.5 && reachedStepRef.current < 2) {
          reachedStepRef.current = 2;
          onStepReached(2);
        } else if (nextDepth >= 2.2 && reachedStepRef.current < 3) {
          reachedStepRef.current = 3;
          isDrillingRef.current = false;
          setIsDrilling(false);
          onStepReached(3);
          return;
        }

        if (nextHeat >= 100 && nextDepth < 2.2) {
          overheatMsRef.current = OVERHEAT_LOCK_MS;
          isDrillingRef.current = false;
          setOverheatMsLeft(OVERHEAT_LOCK_MS);
          setIsDrilling(false);
          soundEngine.playAlert();
          onOverheat();
        }
      } else if (heatRef.current > 10) {
        const cooled = Math.max(10, heatRef.current - 3.8);
        heatRef.current = cooled;
        setHeatPct(Math.round(cooled));
      }
    }, 45);

    return () => window.clearInterval(timer);
  }, [onDepthChange, onOverheat, onStepReached]);

  const startDrilling = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (overheatMsRef.current > 0 || depthRef.current >= 2.2) {
      if (overheatMsRef.current > 0) soundEngine.playAlert();
      return;
    }
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    isDrillingRef.current = true;
    setIsDrilling(true);
  };

  const stopDrilling = (e?: React.PointerEvent<HTMLButtonElement>) => {
    if (e) {
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // ignore
      }
    }
    if (!isDrillingRef.current) return;
    isDrillingRef.current = false;
    setIsDrilling(false);
  };

  const overheated = overheatMsLeft > 0;
  const depthPct = Math.min(100, Math.round((depthM / 2.2) * 100));
  const layer = getGeologicalLayerInfo(depthM);

  return (
    <div className="space-y-3 rounded-sm border-2 border-amber-500/50 bg-slate-900/95 p-3">
      {/* Camada atual & Profundidade contínua */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-pixel text-[9px] text-cyan-300">
            CAMADAS DO SUBSOLO (0,0 m → 2,2 m)
          </span>
          <span className="font-pixel text-[10px] text-amber-200">
            {depthM.toFixed(2).replace('.', ',')} m / 2,20 m
          </span>
        </div>

        <div className="relative h-6 w-full overflow-hidden rounded-sm border border-slate-700 bg-slate-950">
          {/* Zonas das 3 camadas */}
          <div
            style={{ left: '0%', width: `${(0.8 / 2.2) * 100}%` }}
            className="pointer-events-none absolute inset-y-0 border-r border-slate-600/70 bg-orange-950/35"
          />
          <div
            style={{
              left: `${(0.8 / 2.2) * 100}%`,
              width: `${(0.7 / 2.2) * 100}%`,
            }}
            className="pointer-events-none absolute inset-y-0 border-r border-cyan-300/60 bg-stone-700/40"
          />
          <div
            style={{
              left: `${(1.5 / 2.2) * 100}%`,
              width: `${(0.7 / 2.2) * 100}%`,
            }}
            className="pointer-events-none absolute inset-y-0 bg-cyan-950/45"
          />

          {/* Progresso da broca */}
          <div
            style={{ width: `${depthPct}%` }}
            className={`relative z-10 h-full transition-[width] duration-75 ${
              layer.id === 'ROCK'
                ? 'bg-amber-500/85'
                : layer.id === 'ICE'
                ? 'bg-cyan-400/90'
                : 'bg-orange-400/85'
            }`}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-1 font-dialog text-[11px]">
          <span className="font-bold text-slate-200">{layer.label}</span>
          <span
            className={
              layer.id === 'ROCK'
                ? 'font-bold text-amber-300'
                : layer.id === 'ICE'
                ? 'text-cyan-300'
                : 'text-slate-400'
            }
          >
            {layer.frictionNote}
          </span>
        </div>
      </div>

      {/* Barra de Temperatura da Broca (0% -> 100%) */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
          <span className="flex items-center gap-1.5 font-pixel text-[9px] text-orange-300">
            {overheated ? (
              <Snowflake className="h-3.5 w-3.5 animate-spin text-sky-300" />
            ) : (
              <Flame className="h-3.5 w-3.5 text-orange-400" />
            )}
            TEMPERATURA DA BROCA ({heatPct}%)
          </span>
          <span
            className={`font-dialog text-[11px] font-bold ${
              overheated
                ? 'text-rose-300'
                : heatPct >= 75
                ? 'text-amber-300'
                : 'text-emerald-300'
            }`}
          >
            {overheated
              ? `TRAVA TÉRMICA: ${(overheatMsLeft / 1000).toFixed(1).replace('.', ',')}s`
              : heatPct >= 75
              ? 'Zona crítica! Solte 1–2s para resfriar!'
              : 'Temperatura controlada'}
          </span>
        </div>

        <div className="relative mt-1.5 h-4 w-full overflow-hidden rounded-sm border border-slate-700 bg-slate-950">
          {/* Zona vermelha (>= 80%) */}
          <div
            style={{ left: '80%', width: '20%' }}
            className="pointer-events-none absolute inset-y-0 z-10 border-l-2 border-rose-300 bg-rose-500/25"
          />
          <div
            style={{ width: `${heatPct}%` }}
            className={`h-full transition-[width] duration-75 ${
              heatPct >= 80
                ? 'bg-rose-500'
                : heatPct >= 55
                ? 'bg-amber-400'
                : 'bg-emerald-400'
            }`}
          />
        </div>
      </div>

      <button
        type="button"
        onPointerDown={startDrilling}
        onPointerUp={stopDrilling}
        onPointerLeave={stopDrilling}
        onPointerCancel={stopDrilling}
        disabled={overheated || depthM >= 2.2}
        className={`touch-none select-none pixel-btn flex w-full items-center justify-center gap-2 px-4 py-3 font-pixel text-[10px] disabled:cursor-not-allowed disabled:opacity-45 ${
          overheated
            ? 'bg-rose-500 text-white'
            : isDrilling
            ? 'bg-amber-300 text-slate-950 shadow-[0_0_16px_rgba(251,191,36,0.65)]'
            : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
        }`}
      >
        <Settings className={`h-4 w-4 ${isDrilling ? 'animate-spin' : ''}`} />
        {overheated
          ? `TRAVADA POR CALOR — AGUARDE ${(overheatMsLeft / 1000).toFixed(1).replace('.', ',')}s`
          : isDrilling
          ? 'PERFURANDO... SOLTE SE ESQUENTAR!'
          : '⚙️ SEGURAR PARA PERFURAR (0,0 m → 2,2 m)'}
      </button>
    </div>
  );
};
