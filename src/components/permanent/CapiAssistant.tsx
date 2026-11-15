import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, MessageSquare, X } from 'lucide-react';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';
import { useLanguage } from '../../i18n/LanguageContext';
import { CapiBadgePortrait } from '../../modes/arcade-rush/CosmeticSprites';

export interface CapiAssistantProps {
  lines: string[];
  dialogId?: string;
  badge?: string;
  onComplete?: () => void;
  onDismiss?: () => void;
  completeLabel?: string;
  compact?: boolean;
}

export const CapiAssistant: React.FC<CapiAssistantProps> = ({
  lines,
  dialogId,
  badge,
  onComplete,
  onDismiss,
  completeLabel,
  compact = false,
}) => {
  const { state, markCapiDialogSeen } = useGameStore();
  const { dict, translateText } = useLanguage();
  const [stepIndex, setStepIndex] = useState(0);
  const [minimized, setMinimized] = useState(false);
  const [dismissedKey, setDismissedKey] = useState<string | null>(null);

  const safeLines = lines.length > 0 ? lines : [dict.capi.defaultGreeting];
  const resetKey = dialogId ?? safeLines.join('|');
  const alreadySeen = Boolean(dialogId && state.seenCapiDialogs.includes(dialogId));
  const rawCurrentText = safeLines[Math.min(stepIndex, safeLines.length - 1)];
  const currentText = translateText(rawCurrentText);
  const resolvedBadge = badge ? translateText(badge) : dict.capi.badge;
  const resolvedCompleteLabel = completeLabel
    ? translateText(completeLabel)
    : dict.capi.finishBtn;
  const isLast = stepIndex >= safeLines.length - 1;

  // Reinicia apenas quando o ID do diálogo (ou novo roteiro sem ID) muda — nunca por ticks em tempo real
  useEffect(() => {
    setStepIndex(0);
    setMinimized(false);
  }, [resetKey]);

  if (alreadySeen || dismissedKey === resetKey) {
    return null;
  }

  const handleFinishOrDismiss = (triggerComplete: boolean) => {
    soundEngine.playClick();
    if (dialogId) {
      markCapiDialogSeen(dialogId, { resumeSurvivalClock: true });
    } else if (state.gameMode === 'SURVIVAL_30' && state.survival.clockPaused) {
      markCapiDialogSeen(undefined, { resumeSurvivalClock: true });
    }
    setDismissedKey(resetKey);
    if (triggerComplete && onComplete) {
      onComplete();
    } else {
      onDismiss?.();
    }
  };

  const handleNext = () => {
    soundEngine.playCapiVoiceBeep();
    if (!isLast) {
      setStepIndex((prev) => prev + 1);
    } else {
      handleFinishOrDismiss(true);
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
          <CapiBadgePortrait size="xs" />
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

        <button
          type="button"
          onClick={() => handleFinishOrDismiss(false)}
          aria-label={dict.capi.closeAria}
          title={dict.capi.closeAria}
          className="absolute right-3 top-3 z-50 cursor-pointer rounded-sm p-1 text-cyan-400 transition hover:bg-slate-800 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Cabeçalho holográfico */}
        <div className="relative z-10 mb-2 flex items-center justify-between gap-2 border-b-2 border-cyan-500/40 pb-1.5 pr-8">
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
              className="flex min-h-[30px] min-w-[30px] items-center justify-center rounded-sm border border-cyan-700/70 bg-slate-900 px-1 py-0.5 text-cyan-300 hover:bg-slate-800"
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Conteúdo: retrato pixelado + balão curto (2-3 linhas) */}
        <div className="relative z-10 flex items-end gap-2.5 sm:gap-3">
          <div className="relative shrink-0 rounded-sm border-2 border-cyan-400/70 bg-cyan-950/60 p-1 shadow-[0_0_16px_rgba(34,211,238,0.28)]">
            <CapiBadgePortrait size="md" />
          </div>

          <div className="flex min-h-[76px] flex-1 flex-col justify-between rounded-sm border-2 border-cyan-400/50 bg-slate-900/90 p-2 sm:min-h-[84px] sm:p-2.5">
            <p className="font-dialog text-xs leading-snug text-cyan-50 sm:text-sm">
              {currentText}
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={stepIndex === 0}
                  className="inline-flex min-h-[34px] items-center gap-0.5 rounded-sm border border-cyan-700/80 bg-slate-800 px-2 py-1 font-dialog text-[11px] text-cyan-200 transition hover:bg-slate-700 disabled:opacity-30"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  {dict.capi.prevBtn}
                </button>

                <button
                  type="button"
                  onClick={() => handleFinishOrDismiss(false)}
                  className="inline-flex min-h-[34px] cursor-pointer items-center gap-1 rounded-sm border border-slate-600 bg-slate-900 px-2 py-1 font-dialog text-[11px] text-slate-300 transition hover:border-cyan-400 hover:text-white"
                >
                  {dict.capi.skipBtn}
                  <X className="h-3 w-3" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="pixel-btn inline-flex min-h-[34px] items-center gap-1 bg-cyan-400 px-3 py-1 font-dialog text-xs font-bold text-slate-950 hover:bg-cyan-300"
              >
                {isLast
                  ? resolvedCompleteLabel
                  : `${dict.capi.nextBtn} (${stepIndex + 1}/${safeLines.length})`}
                {!isLast && <ChevronRight className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
