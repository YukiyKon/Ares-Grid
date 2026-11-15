import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Zap } from 'lucide-react';
import { soundEngine } from '../../core/soundEngine';

export interface TimingBarGameProps {
  exerciseId: string;
  exerciseTitle: string;
  zoneStart: number;
  zoneEnd: number;
  speedMs: number;
  isCompleted: boolean;
  onSuccess: () => void;
  onMiss: () => void;
}

export const TimingBarGame: React.FC<TimingBarGameProps> = ({
  exerciseId,
  exerciseTitle,
  zoneStart,
  zoneEnd,
  speedMs,
  isCompleted,
  onSuccess,
  onMiss,
}) => {
  const [cursorPct, setCursorPct] = useState(12);
  const [feedbackState, setFeedbackState] = useState<'IDLE' | 'HIT' | 'MISS'>('IDLE');

  const cursorRef = useRef(12);
  const directionRef = useRef<1 | -1>(1);
  const feedbackTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setFeedbackState(isCompleted ? 'HIT' : 'IDLE');
    cursorRef.current = 12;
    directionRef.current = 1;
    setCursorPct(12);
  }, [exerciseId, isCompleted]);

  useEffect(() => {
    if (isCompleted) return;

    // speedMs controla o tempo aproximado de ida (0 -> 100%); garantimos passo consistente a ~60Hz
    const stepPerTick = Math.max(0.75, (100 / Math.max(450, speedMs)) * 18);

    const timer = window.setInterval(() => {
      let next = cursorRef.current + directionRef.current * stepPerTick;
      if (next >= 98) {
        next = 98;
        directionRef.current = -1;
      } else if (next <= 2) {
        next = 2;
        directionRef.current = 1;
      }
      cursorRef.current = next;
      setCursorPct(next);
    }, 18);

    return () => window.clearInterval(timer);
  }, [exerciseId, isCompleted, speedMs]);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current !== null) {
        window.clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, []);

  const triggerLock = (e?: React.PointerEvent) => {
    if (e) e.preventDefault();
    if (isCompleted) return;

    const current = cursorRef.current;
    const isInZone = current >= zoneStart && current <= zoneEnd;

    if (feedbackTimeoutRef.current !== null) {
      window.clearTimeout(feedbackTimeoutRef.current);
    }

    if (isInZone) {
      setFeedbackState('HIT');
      soundEngine.playSuccess();
      onSuccess();
    } else {
      setFeedbackState('MISS');
      soundEngine.playAlert();
      onMiss();
      feedbackTimeoutRef.current = window.setTimeout(() => {
        setFeedbackState('IDLE');
      }, 650);
    }
  };

  return (
    <div
      className={`rounded-sm border-2 p-3 transition-colors ${
        isCompleted
          ? 'border-emerald-400 bg-emerald-950/35'
          : feedbackState === 'MISS'
          ? 'border-rose-400 bg-rose-950/40'
          : 'border-cyan-500/60 bg-slate-900/95'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-pixel text-[9px] text-cyan-200">
          BARRA DE TRAÇÃO GRAVITACIONAL — {exerciseTitle.toUpperCase()}
        </span>
        <span
          className={`font-dialog text-[11px] font-bold ${
            isCompleted
              ? 'text-emerald-300'
              : feedbackState === 'MISS'
              ? 'text-rose-300'
              : 'text-amber-200'
          }`}
        >
          {isCompleted
            ? 'Impulso travado na faixa ideal!'
            : feedbackState === 'MISS'
            ? 'Fora da zona verde! Tente de novo!'
            : 'Toque quando o marcador cruzar a zona verde'}
        </span>
      </div>

      {/* Barra interativa de precisão */}
      <div
        onPointerDown={triggerLock}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            triggerLock();
          }
        }}
        aria-label={`Barra de precisão para ${exerciseTitle}`}
        className="touch-none select-none relative mt-2.5 h-9 w-full cursor-pointer overflow-hidden rounded-sm border-2 border-slate-700 bg-slate-950 shadow-inner"
      >
        {/* Escala sutil de fundo */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-rose-950/50 via-slate-900/40 to-rose-950/50" />

        {/* Zona verde alvo */}
        <div
          style={{
            left: `${zoneStart}%`,
            width: `${zoneEnd - zoneStart}%`,
          }}
          className="pointer-events-none absolute inset-y-0 border-x-2 border-emerald-300 bg-emerald-500/35 shadow-[0_0_14px_rgba(16,185,129,0.45)]"
        >
          <span className="flex h-full items-center justify-center font-pixel text-[7px] text-emerald-100">
            ALVO
          </span>
        </div>

        {/* Marcador móvel */}
        {!isCompleted && (
          <div
            style={{ left: `calc(${cursorPct}% - 5px)` }}
            className="pointer-events-none absolute inset-y-0.5 w-2.5 rounded-xs border border-white bg-amber-300 shadow-[0_0_10px_rgba(252,211,77,0.9)]"
          />
        )}
      </div>

      <button
        type="button"
        disabled={isCompleted}
        onPointerDown={triggerLock}
        className={`touch-none select-none pixel-btn mt-2.5 flex w-full items-center justify-center gap-2 px-3 py-2 font-pixel text-[10px] ${
          isCompleted
            ? 'bg-emerald-500/30 text-emerald-200 cursor-default'
            : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300 active:translate-y-0.5'
        }`}
      >
        {isCompleted ? (
          <>
            <CheckCircle2 className="h-4 w-4" />
            TREINO CONCLUÍDO! SELECIONE O PRÓXIMO
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" />
            ⚡ TRAVAR IMPULSO NA ZONA VERDE!
          </>
        )}
      </button>
    </div>
  );
};
