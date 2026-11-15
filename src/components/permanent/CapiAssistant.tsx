import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, MessageSquare, Sparkles } from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { soundEngine } from '../../core/soundEngine';
import { useLanguage } from '../../i18n/LanguageContext';

export interface CapiAssistantProps {
  lines: string[];
  badge?: string;
  onComplete?: () => void;
  completeLabel?: string;
  compact?: boolean;
}

export const CapiAssistant: React.FC<CapiAssistantProps> = ({
  lines,
  badge,
  onComplete,
  completeLabel,
  compact = false,
}) => {
  const { dict, translateText } = useLanguage();
  const [stepIndex, setStepIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const safeLines = lines.length > 0 ? lines : [dict.capi.defaultGreeting];
  const rawCurrentText = safeLines[Math.min(stepIndex, safeLines.length - 1)];
  const currentText = translateText(rawCurrentText);
  const resolvedBadge = badge ? translateText(badge) : dict.capi.badge;
  const resolvedCompleteLabel = completeLabel
    ? translateText(completeLabel)
    : dict.capi.continueBtn;
  const isLast = stepIndex >= safeLines.length - 1;

  // Reinicia para a primeira fala quando o roteiro da cena muda
  const linesSignature = safeLines.join('|');
  useEffect(() => {
    setStepIndex(0);
    setMinimized(false);
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

  if (minimized) {
    return (
      <aside
        aria-label={dict.capi.reopenLabel}
        className="fixed bottom-2 right-2 z-40"
      >
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            setMinimized(false);
          }}
          className="pixel-box flex min-h-[40px] items-center gap-1.5 bg-slate-950/95 px-3 py-1.5 text-cyan-200 hover:bg-slate-900"
        >
          <img
            src={ASSET_MANIFEST.capiPortrait.path}
            alt="Capi"
            className="pixel-art h-6 w-6 object-contain"
          />
          <MessageSquare className="h-3.5 w-3.5 text-cyan-300" />
          <span className="font-pixel text-[8px]">{dict.capi.openShort}</span>
          <span className="rounded bg-cyan-500/20 px-1 font-mono text-[10px] text-cyan-300">
            {stepIndex + 1}/{safeLines.length}
          </span>
        </button>
      </aside>
    );
  }

  return (
    <aside
      aria-label={dict.capi.reopenLabel}
      className={`fixed inset-x-2 bottom-2 z-40 w-auto md:inset-x-auto md:bottom-3 md:right-3 ${
        compact ? 'md:w-[390px]' : 'md:w-[440px]'
      }`}
    >
      <div className="pixel-box relative overflow-hidden bg-slate-950/95 p-2.5 text-cyan-50 hologram-grid sm:p-3">
        <div className="pointer-events-none absolute inset-0 scanlines opacity-75" />

        {/* Cabeçalho holográfico */}
        <div className="relative z-10 mb-2 flex items-center justify-between gap-2 border-b-2 border-cyan-500/40 pb-1.5">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 shrink-0 animate-pulse bg-cyan-400" />
            <span className="truncate font-pixel text-[8px] tracking-wide text-cyan-300 sm:text-[9px]">
              {resolvedBadge}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="font-dialog text-[11px] text-cyan-300/90">
              {stepIndex + 1}/{safeLines.length}
            </span>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setMinimized(true);
              }}
              aria-label={dict.capi.minimizeLabel}
              title={dict.capi.minimizeLabel}
              className="flex min-h-[32px] min-w-[32px] items-center justify-center rounded-sm border border-cyan-700/70 bg-slate-900 px-1.5 py-0.5 text-cyan-300 hover:bg-slate-800"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Conteúdo: retrato pixelado + balão curto (2-3 linhas) */}
        <div className="relative z-10 flex items-end gap-2.5 sm:gap-3">
          <div className="relative shrink-0 rounded-sm border-2 border-cyan-400/70 bg-cyan-950/60 p-1 shadow-[0_0_16px_rgba(34,211,238,0.28)]">
            {!imgError ? (
              <img
                src={ASSET_MANIFEST.capiPortrait.path}
                alt={ASSET_MANIFEST.capiPortrait.alt}
                onError={() => setImgError(true)}
                className="pixel-art h-14 w-14 animate-floatSlow object-contain sm:h-20 sm:w-20"
              />
            ) : (
              <div className="flex h-14 w-14 flex-col items-center justify-center bg-cyan-900/60 text-center sm:h-20 sm:w-20">
                <Sparkles className="h-5 w-5 text-cyan-300 sm:h-6 sm:w-6" />
                <span className="mt-1 font-pixel text-[7px] text-cyan-200">{dict.capi.openShort}</span>
              </div>
            )}
          </div>

          <div className="flex min-h-[76px] flex-1 flex-col justify-between rounded-sm border-2 border-cyan-400/50 bg-slate-900/90 p-2 sm:min-h-[84px] sm:p-2.5">
            <p className="font-dialog text-xs leading-snug text-cyan-50 sm:text-sm">
              {currentText}
            </p>

            <div className="mt-2 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handlePrev}
                disabled={stepIndex === 0}
                className="inline-flex min-h-[36px] items-center gap-0.5 rounded-sm border border-cyan-700/80 bg-slate-800 px-2.5 py-1 font-dialog text-[11px] text-cyan-200 transition hover:bg-slate-700 disabled:opacity-30"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                {dict.capi.prevBtn}
              </button>

              {(!isLast || onComplete) && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="pixel-btn inline-flex min-h-[36px] items-center gap-1 bg-cyan-400 px-3 py-1 font-dialog text-xs font-bold text-slate-950 hover:bg-cyan-300"
                >
                  {isLast ? resolvedCompleteLabel : dict.capi.nextBtn}
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
