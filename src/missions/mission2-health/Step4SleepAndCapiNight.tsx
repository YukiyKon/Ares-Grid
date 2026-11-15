import React from 'react';
import { BookOpen, CheckCircle2, Moon, Snowflake, Sun } from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { AstronautAvatar } from '../../components/permanent/AstronautAvatar';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

interface Step4SleepAndCapiNightProps {
  onCapiFeedback: (line: string) => void;
  onReturnToBase: () => void;
  onStartMission3?: () => void;
}

export const Step4SleepAndCapiNight: React.FC<Step4SleepAndCapiNightProps> = ({
  onCapiFeedback,
  onReturnToBase,
  onStartMission3,
}) => {
  const { state, openModal } = useGameStore();
  const isSleepingModalOpen = state.activeModal === 'SLEEP_REPORT';
  const isMorningUnlocked = state.mission2.mission3Unlocked;

  const handleGoToSleep = () => {
    soundEngine.playSleepChime();
    onCapiFeedback(
      'Boa noite, comandante! Agora vou processar as 7 etapas da Cena Especial de Sono no servidor de bordo.'
    );
    openModal('SLEEP_REPORT');
  };

  return (
    <div
      className={`space-y-4 rounded-sm border-2 p-4 transition-colors duration-700 ${
        isSleepingModalOpen
          ? 'border-indigo-500/80 bg-slate-950'
          : 'border-slate-800 bg-slate-900/60'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isMorningUnlocked ? (
            <Sun className="h-4 w-4 text-yellow-300" />
          ) : (
            <Moon className="h-4 w-4 text-indigo-300" />
          )}
          <h2 className="font-pixel text-[11px] text-indigo-200">
            {isMorningUnlocked
              ? 'AMANHECER EM ARCADIA PLANITIA — NOVO SOL!'
              : 'DESAFIO 2.4 — HORA DE DORMIR!'}
          </h2>
        </div>

        <span className="rounded-sm border border-indigo-400/60 bg-indigo-950/70 px-2 py-0.5 font-dialog text-xs text-indigo-200">
          Sol {state.stats.sol}
        </span>
      </div>

      {/* Antes de dormir: Cabine de descanso + Checklist + botão que abre imediatamente SleepReportModal */}
      {!isMorningUnlocked && (
        <div className="grid gap-4 md:grid-cols-[1.1fr_1fr]">
          <div className="pixel-box relative aspect-video overflow-hidden bg-slate-900">
            <img
              src={ASSET_MANIFEST.habitatQuarters.path}
              alt={ASSET_MANIFEST.habitatQuarters.alt}
              className="pixel-art h-full w-full object-cover"
            />
            <div className="absolute bottom-3 left-5">
              <AstronautAvatar profile={state.astronaut} size="md" />
            </div>
          </div>

          <div className="flex flex-col justify-between gap-3">
            <div className="space-y-2 rounded-sm border border-slate-700 bg-slate-950 p-3 font-dialog text-xs">
              <span className="block font-pixel text-[9px] text-amber-300">
                VERIFICAÇÃO ANTES DE DORMIR
              </span>
              <ul className="space-y-1.5 text-emerald-200">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Exercícios físicos concluídos ({state.mission2.exercisesCompleted.length}/4)
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Alimentação equilibrada e hidratação (350 ml)
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Higiene pessoal e limpeza dos equipamentos
                </li>
              </ul>
              <p className="pt-1 text-[11px] text-cyan-200">
                Ao dormir, a tela escurece e a <strong>Capi</strong> processa as 7 etapas do
                relatório noturno (NASA Spaceflight Standard Measures), avançando o Sol e
                desbloqueando a Missão 3!
              </p>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  openModal('LOGBOOK');
                }}
                className="pixel-btn flex w-full items-center justify-center gap-2 bg-amber-400 px-3 py-2 font-dialog text-xs font-bold text-slate-950 hover:bg-amber-300"
              >
                <BookOpen className="h-4 w-4" />
                {state.mission2.loggedInDiary
                  ? '✓ Registro da Missão 2 Salvo (Abrir Diário)'
                  : 'Registrar Missão 2 no Diário de Bordo'}
              </button>

              <button
                type="button"
                onClick={handleGoToSleep}
                className="pixel-btn flex w-full items-center justify-center gap-2 bg-indigo-400 px-4 py-2.5 font-pixel text-[10px] text-slate-950 hover:bg-indigo-300"
              >
                <Moon className="h-4 w-4" />
                Dormir (Iniciar Cena da Capi) 🌙
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Amanhecer e Desbloqueio da Missão 3 */}
      {isMorningUnlocked && (
        <div className="space-y-3 rounded-sm border-2 border-emerald-400 bg-emerald-950/30 p-4">
          <div className="flex items-center gap-2 text-emerald-300">
            <CheckCircle2 className="h-5 w-5" />
            <h3 className="font-pixel text-xs">
              MISSÃO 2 CONCLUÍDA! BOM DIA, COMANDANTE! (SOL {state.stats.sol})
            </h3>
          </div>
          <p className="font-dialog text-xs leading-relaxed text-slate-100">
            Você completou os exercícios físicos, preparou uma refeição equilibrada sem
            desperdiçar água, cuidou da higiene e concluiu as 7 etapas noturnas da Capi!
          </p>
          <p className="rounded-sm border border-cyan-400/60 bg-cyan-950/60 px-3 py-2 font-dialog text-xs text-cyan-200">
            🧊 <strong>Missão 3 — O Mistério do Gelo de Marte</strong> foi desbloqueada na
            Base de Arcadia Planitia!
          </p>

          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onReturnToBase();
              }}
              className="pixel-btn bg-slate-700 px-4 py-2 font-pixel text-[10px] text-white hover:bg-slate-600"
            >
              Voltar à Base
            </button>
            {onStartMission3 && (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playSuccess();
                  onStartMission3();
                }}
                className="pixel-btn inline-flex items-center gap-1.5 bg-cyan-400 px-4 py-2 font-pixel text-[10px] text-slate-950 hover:bg-cyan-300"
              >
                <Snowflake className="h-4 w-4" />
                Iniciar Missão 3 (Gelo) ▶
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
