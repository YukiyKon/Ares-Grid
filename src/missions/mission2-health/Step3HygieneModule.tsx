import React from 'react';
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

interface HygieneAction {
  key: 'teeth' | 'hands' | 'gear';
  title: string;
  detail: string;
  capiTip: string;
}

const HYGIENE_ACTIONS: HygieneAction[] = [
  {
    key: 'teeth',
    title: 'Escovar os Dentes',
    detail: 'Com pasta espacial e reciclagem de água',
    capiTip:
      'Dentes limpos! Na nave usamos pouca água e nenhum resíduo é desperdiçado.',
  },
  {
    key: 'hands',
    title: 'Higienizar Mãos e Corpo',
    detail: 'Reduz microrganismos no ambiente fechado',
    capiTip:
      'Mãos higienizadas! Em um habitat fechado, isso evita que germes se espalhem pela equipe.',
  },
  {
    key: 'gear',
    title: 'Esterilizar Equipamentos e Bancadas',
    detail: 'Limpar sensores e luvas pós-exploração',
    capiTip:
      'Tudo esterilizado! Poeira marciana e sujeira podem danificar instrumentos científicos sensíveis.',
  },
];

interface Step3HygieneModuleProps {
  onComplete: () => void;
  onCapiFeedback: (line: string) => void;
}

export const Step3HygieneModule: React.FC<Step3HygieneModuleProps> = ({
  onComplete,
  onCapiFeedback,
}) => {
  const { state, updateMission2 } = useGameStore();
  const tasks = state.mission2.hygieneTasks;
  const doneCount = [tasks.teeth, tasks.hands, tasks.gear].filter(Boolean).length;
  const allDone = doneCount === 3;

  const handlePerformTask = (action: HygieneAction) => {
    soundEngine.playSuccess();
    const nextTasks = { ...tasks, [action.key]: true };
    const completedAll = nextTasks.teeth && nextTasks.hands && nextTasks.gear;
    updateMission2({
      hygieneTasks: nextTasks,
      hygieneCompleted: completedAll,
    });
    onCapiFeedback(action.capiTip);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-sm border-2 border-purple-400/50 bg-slate-900/90 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-purple-300" />
            <h2 className="font-pixel text-[11px] text-purple-200">
              DESAFIO 2.3 — HIGIENE PESSOAL NO HABITAT
            </h2>
          </div>
          <span className="font-pixel text-[9px] text-cyan-300">
            CONCLUÍDO: {doneCount}/3
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.1fr_1fr]">
        <div className="pixel-box relative aspect-video overflow-hidden bg-slate-900">
          <img
            src={ASSET_MANIFEST.habitatHygiene.path}
            alt={ASSET_MANIFEST.habitatHygiene.alt}
            className="pixel-art h-full w-full object-cover"
          />
          {allDone && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-sm border border-emerald-400 bg-slate-950/90 px-2.5 py-1 font-pixel text-[9px] text-emerald-300">
              <Sparkles className="h-3.5 w-3.5" />
              AMBIENTE ESTERILIZADO
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between gap-3">
          <div className="space-y-2.5">
            {HYGIENE_ACTIONS.map((action) => {
              const checked = tasks[action.key];
              return (
                <button
                  key={action.key}
                  type="button"
                  onClick={() => handlePerformTask(action)}
                  className={`flex w-full items-center justify-between gap-2 rounded-sm border-2 p-3 text-left transition ${
                    checked
                      ? 'border-emerald-400 bg-emerald-950/45 text-emerald-100'
                      : 'border-slate-700 bg-slate-900 text-slate-100 hover:border-purple-400'
                  }`}
                >
                  <div>
                    <p className="font-pixel text-[9px]">{action.title}</p>
                    <p className="mt-1 font-dialog text-xs text-slate-300">
                      {action.detail}
                    </p>
                  </div>
                  <CheckCircle2
                    className={`h-5 w-5 shrink-0 ${
                      checked ? 'text-emerald-400' : 'text-slate-600'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={!allDone}
            onClick={() => {
              soundEngine.playClick();
              onComplete();
            }}
            className="pixel-btn w-full bg-indigo-400 px-4 py-2.5 font-pixel text-[10px] text-slate-950 hover:bg-indigo-300 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {allDone
              ? 'Ir para Cabine de Descanso (Desafio 2.4) ▶'
              : `Realize as 3 etapas de higiene (${doneCount}/3)`}
          </button>
        </div>
      </div>
    </div>
  );
};
