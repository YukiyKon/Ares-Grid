import React, { useEffect, useRef } from 'react';
import { soundEngine } from '../../core/soundEngine';

export interface DustScrubCanvasProps {
  cleanImageSrc: string;
  cleanImageAlt: string;
  activeDust: boolean;
  dustKey: number;
  onScrubProgress: (cleanPercent: number) => void;
  onScrubComplete: () => void;
}

const CANVAS_SIZE = 220;
const BRUSH_RADIUS = 24;
const COMPLETION_THRESHOLD_PCT = 90;

function drawMartianDustLayer(ctx: CanvasRenderingContext2D, seedKey: number): void {
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // Camada base granulada de poeira fina alaranjada sobre o painel
  ctx.fillStyle = 'rgba(194, 65, 12, 0.84)';
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  const palette = ['#c2410c', '#ea580c', '#f59e0b', '#7c2d12'];

  // Partículas e grãos de poeira em estilo pixel-art (sem borrar)
  let seed = (seedKey + 1) * 9301 + 49297;
  const nextRand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < 650; i++) {
    ctx.fillStyle = palette[i % palette.length];
    const x = Math.floor(nextRand() * (CANVAS_SIZE / 4)) * 4;
    const y = Math.floor(nextRand() * (CANVAS_SIZE / 4)) * 4;
    const size = i % 3 === 0 ? 6 : 4;
    ctx.globalAlpha = 0.65 + nextRand() * 0.35;
    ctx.fillRect(x, y, size, size);
  }
  ctx.globalAlpha = 1;
}

function measureCleanPercent(ctx: CanvasRenderingContext2D): number {
  const imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE).data;
  let cleared = 0;
  let sampled = 0;

  // Amostragem em passo 4x4 px para calcular a limpeza em tempo real sem travar
  for (let y = 0; y < CANVAS_SIZE; y += 4) {
    for (let x = 0; x < CANVAS_SIZE; x += 4) {
      const alpha = imageData[(y * CANVAS_SIZE + x) * 4 + 3];
      sampled += 1;
      if (alpha < 25) {
        cleared += 1;
      }
    }
  }

  if (sampled === 0) return 100;
  return Math.min(100, Math.round((cleared / sampled) * 100));
}

export const DustScrubCanvas: React.FC<DustScrubCanvasProps> = ({
  cleanImageSrc,
  cleanImageAlt,
  activeDust,
  dustKey,
  onScrubProgress,
  onScrubComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPointerDownRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const completedRef = useRef(false);
  const lastSoundAtRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    completedRef.current = false;
    isPointerDownRef.current = false;
    lastPosRef.current = null;

    if (activeDust) {
      drawMartianDustLayer(ctx, dustKey);
      onScrubProgress(0);
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      onScrubProgress(100);
    }
  }, [activeDust, dustKey]);

  const toCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / Math.max(1, rect.width)) * CANVAS_SIZE;
    const y = ((e.clientY - rect.top) / Math.max(1, rect.height)) * CANVAS_SIZE;
    return {
      x: Math.max(0, Math.min(CANVAS_SIZE, x)),
      y: Math.max(0, Math.min(CANVAS_SIZE, y)),
    };
  };

  const scrubAt = (pos: { x: number; y: number }) => {
    if (!activeDust || completedRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 44;

    if (lastPosRef.current) {
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, BRUSH_RADIUS, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    lastPosRef.current = pos;

    const now = performance.now();
    if (now - lastSoundAtRef.current >= 90) {
      soundEngine.playScrubGrain();
      lastSoundAtRef.current = now;
    }

    const pct = measureCleanPercent(ctx);
    if (pct >= COMPLETION_THRESHOLD_PCT) {
      completedRef.current = true;
      isPointerDownRef.current = false;
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      onScrubProgress(100);
      onScrubComplete();
    } else {
      onScrubProgress(pct);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activeDust || completedRef.current) return;
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore if unsupported
    }
    isPointerDownRef.current = true;
    const pos = toCanvasCoords(e);
    lastPosRef.current = pos;
    scrubAt(pos);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPointerDownRef.current || !activeDust || completedRef.current) return;
    e.preventDefault();
    scrubAt(toCanvasCoords(e));
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPointerDownRef.current) {
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // ignore
      }
    }
    isPointerDownRef.current = false;
    lastPosRef.current = null;
  };

  return (
    <div className="relative h-44 w-44 overflow-hidden rounded-sm border-2 border-slate-700 bg-slate-950/70">
      <img
        src={cleanImageSrc}
        alt={cleanImageAlt}
        draggable={false}
        className="pixel-art pointer-events-none h-full w-full select-none object-contain p-2"
      />
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        aria-label="Área interativa para esfregar e limpar a poeira marciana do painel solar"
        className={`touch-none select-none absolute inset-0 h-full w-full ${
          activeDust ? 'cursor-crosshair' : 'pointer-events-none'
        }`}
      />
    </div>
  );
};
