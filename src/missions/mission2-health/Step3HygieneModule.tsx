import React, { useState } from 'react';
import { CheckCircle2, Hand, ShieldCheck, Sparkles } from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { DustScrubCanvas } from '../../components/minigames/DustScrubCanvas';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

interface HygieneButtonAction {
  key: 'teeth' | 'hands';
  title: string;
  detail: string;
  capiTip: string;
}

const HYGIENE_BUTTON_ACTIONS: HygieneButtonAction[] = [
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
  const [scrubPct, setScrubPct] = useState(tasks.gear ? 100 : 0);

  const doneCount = [tasks.teeth, tasks.hands, tasks.gear].filter(Boolean).length;
  const allDone = doneCount === 3;

  const handlePerformButtonTask = (action: HygieneButtonAction) => {
    soundEngine.playSuccess();
    const nextTasks = { ...tasks, [action.key]: true };
    const completedAll = nextTasks.teeth && nextTasks.hands && nextTasks.gear;
    updateMission2({
      hygieneTasks: nextTasks,
      hygieneCompleted: completedAll,
    });
    onCapiFeedback(action.capiTip);
  };

  const handleCompleteGearScrub = () => {
    if (tasks.gear) return;
    soundEngine.playSuccess();
    const nextTasks = { ...tasks, gear: true };
    const completedAll = nextTasks.teeth && nextTasks.hands && nextTasks.gear;
    updateMission2({
      hygieneTasks: nextTasks,
      hygieneCompleted: completedAll,
    });
    onCapiFeedback(
      'Bancada de sensores e luvas esterilizadas! Remover a poeira fina de Marte protege nossos equipamentos e evita inalação.'
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-sm border-2 border-purple-400/50 bg-slate-900/90 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-purple-300" />
            <h2 className="font-pixel text-[11px] text-purple-200">
              DESAFIO 2.3 — HIGIENE PESSOAL & ESTERILIZAÇÃO TÁTIL
            </h2>
          </div>
          <span className="font-pixel text-[9px] text-cyan-300">
            CONCLUÍDO: {doneCount}/3
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.15fr_1fr]">
        {/* Módulo visual + Mini-game de Esfregar Poeira das Luvas/Bancada */}
        <div className="space-y-3">
          <div className="pixel-box relative flex flex-col items-center justify-center gap-2 bg-slate-900 p-3">
            <div className="flex w-full items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-pixel text-[9px] text-amber-300">
                <Hand className="h-3.5 w-3.5" />
                3. ESFREGAR LUVAS & BANCADA ({tasks.gear ? '100%' : `${scrubPct}%`})
              </span>
              {tasks.gear && (
                <span className="flex items-center gap-1 rounded-xs bg-emerald-500/20 px-1.5 py-0.5 font-pixel text-[8px] text-emerald-300">
                  <Sparkles className="h-3 w-3" />
                  ESTERILIZADO
                </span>
              )}
            </div>

            <DustScrubCanvas
              cleanImageSrc={ASSET_MANIFEST.habitatHygiene.path}
              cleanImageAlt={ASSET_MANIFEST.habitatHygiene.alt}
              activeDust={!tasks.gear}
              dustKey={1}
              onScrubProgress={setScrubPct}
              onScrubComplete={handleCompleteGearScrub}
            />

            {/* Barra de esterilização */}
            <div className="w-full space-y-1">
              <div className="h-2.5 w-full overflow-hidden rounded-sm border border-slate-700 bg-slate-950">
                <div
                  style={{ width: `${tasks.gear ? 100 : scrubPct}%` }}
                  className="h-full bg-purple-400 transition-all duration-150"
                />
              </div>
              <p className="text-center font-dialog text-[11px] text-slate-300">
                {tasks.gear
                  ? 'Bancada de sensores e luvas completamente descontaminadas!'
                  : 'Esfregue com o mouse ou dedo sobre a imagem acima até atingir 90%+'}
              </p>
            </div>
          </div>
        </div>

        {/* Etapas complementares de higiene + avanço */}
        <div className="flex flex-col justify-between gap-3">
          <div className="space-y-2.5">
            {HYGIENE_BUTTON_ACTIONS.map((action) => {
              const checked = tasks[action.key];
              return (
                <button
                  key={action.key}
                  type="button"
                  onClick={() => handlePerformButtonTask(action)}
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

            {/* Card de status da tarefa de esfregar */}
            <div
              className={`flex w-full items-center justify-between gap-2 rounded-sm border-2 p-3 text-left ${
                tasks.gear
                  ? 'border-emerald-400 bg-emerald-950/45 text-emerald-100'
                  : 'border-amber-500/60 bg-amber-950/25 text-amber-100'
              }`}
            >
              <div>
                <p className="font-pixel text-[9px]">
                  Esterilizar Equipamentos e Bancadas
                </p>
                <p className="mt-1 font-dialog text-xs text-slate-300">
                  {tasks.gear
                    ? 'Poeira marciana removida com sucesso'
                    : 'Use o módulo de limpeza ao lado (esfregar 90%+)'}
                </p>
              </div>
              <CheckCircle2
                className={`h-5 w-5 shrink-0 ${
                  tasks.gear ? 'text-emerald-400' : 'text-amber-300/60'
                }`}
              />
            </div>
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
