import React, { useEffect, useState } from 'react';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { soundEngine } from '../../core/soundEngine';

export interface CapiAssistantProps {
  lines: string[];
  badge?: string;
  onComplete?: () => void;
  completeLabel?: string;
  compact?: boolean;
}

export const CapiAssistant: React.FC<CapiAssistantProps> = ({
  lines,
  badge = 'CAPI // ASSISTENTE NASA',
  onComplete,
  completeLabel = 'Continuar ▶',
  compact = false,
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  const safeLines = lines.length > 0 ? lines : ['Olá, comandante! Estou pronta para ajudar.'];
  const currentText = safeLines[Math.min(stepIndex, safeLines.length - 1)];
  const isLast = stepIndex >= safeLines.length - 1;

  // Reinicia para a primeira fala quando o roteiro da cena muda
  const linesSignature = safeLines.join('|');
  useEffect(() => {
    setStepIndex(0);
  }, [linesSignature]);

  const handleNext = () => {
    soundEngine.playCapiVoiceBeep();
    if (!isLast) {
      setStepIndex((prev) => prev + 1);
    } else if (onComplete) {
      soundEngine.playClick();
      onComplete();
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      soundEngine.playClick();
      setStepIndex((prev) => prev - 1);
    }
  };

  return (
    <aside
      aria-label="Janela holográfica da Capivara Capi"
      className={`fixed bottom-3 right-3 z-40 w-[calc(100%-1.5rem)] ${
        compact ? 'sm:w-[390px]' : 'sm:w-[440px]'
      }`}
    >
      <div className="pixel-box relative overflow-hidden bg-slate-950/95 p-3 text-cyan-50 hologram-grid">
        <div className="pointer-events-none absolute inset-0 scanlines opacity-75" />

        {/* Cabeçalho holográfico */}
        <div className="relative z-10 mb-2 flex items-center justify-between border-b-2 border-cyan-500/40 pb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 animate-pulse bg-cyan-400" />
            <span className="font-pixel text-[9px] tracking-wide text-cyan-300">
              {badge}
            </span>
          </div>
          <span className="font-dialog text-[11px] text-cyan-300/90">
            {stepIndex + 1}/{safeLines.length}
          </span>
        </div>

        {/* Conteúdo: retrato pixelado + balão curto (2-3 linhas) */}
        <div className="relative z-10 flex items-end gap-3">
          <div className="relative shrink-0 rounded-sm border-2 border-cyan-400/70 bg-cyan-950/60 p-1 shadow-[0_0_16px_rgba(34,211,238,0.28)]">
            {!imgError ? (
              <img
                src={ASSET_MANIFEST.capiPortrait.path}
                alt={ASSET_MANIFEST.capiPortrait.alt}
                onError={() => setImgError(true)}
                className="pixel-art h-20 w-20 animate-floatSlow object-contain"
              />
            ) : (
              <div className="flex h-20 w-20 flex-col items-center justify-center bg-cyan-900/60 text-center">
                <Sparkles className="h-6 w-6 text-cyan-300" />
                <span className="mt-1 font-pixel text-[7px] text-cyan-200">CAPI</span>
              </div>
            )}
          </div>

          <div className="flex min-h-[84px] flex-1 flex-col justify-between rounded-sm border-2 border-cyan-400/50 bg-slate-900/90 p-2.5">
            <p className="font-dialog text-sm leading-snug text-cyan-50">
              {currentText}
            </p>

            <div className="mt-2 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={stepIndex === 0}
                className="inline-flex items-center gap-0.5 rounded-sm border border-cyan-700/80 bg-slate-800 px-2 py-1 font-dialog text-[11px] text-cyan-200 transition hover:bg-slate-700 disabled:opacity-30"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Ant
              </button>

              {(!isLast || onComplete) && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="pixel-btn inline-flex items-center gap-1 bg-cyan-400 px-3 py-1 font-dialog text-xs font-bold text-slate-950 hover:bg-cyan-300"
                >
                  {isLast ? completeLabel : 'Próximo'}
                  {!isLast && <ChevronRight className="h-3.5 w-3.5" />}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
