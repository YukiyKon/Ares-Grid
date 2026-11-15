import React from 'react';
import { Activity, CheckCircle2, Dumbbell, HeartPulse } from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { AstronautAvatar } from '../../components/permanent/AstronautAvatar';
import { type ExerciseId, useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

interface ExerciseOption {
  id: ExerciseId;
  title: string;
  benefit: string;
  capiFeedback: string;
}

const EXERCISES: ExerciseOption[] = [
  {
    id: 'TREADMILL',
    title: 'Caminhada na Esteira',
    benefit: 'Estimula ossos e coração com cintos de tração',
    capiFeedback:
      'Ótima caminhada! Os cintos na esteira simulam o peso da gravidade para proteger seus ossos.',
  },
  {
    id: 'RESISTANCE',
    title: 'Exercícios de Resistência',
    benefit: 'Fortalece braços e pernas contra a baixa gravidade',
    capiFeedback:
      'Força total! Os elásticos de resistência mantêm os músculos fortes mesmo em Marte (~0,38g).',
  },
  {
    id: 'STRETCH',
    title: 'Alongamento',
    benefit: 'Alivia a coluna e melhora a flexibilidade',
    capiFeedback:
      'Muito bom! Alongar depois de usar o traje espacial ajuda a coluna e previne dores.',
  },
  {
    id: 'BALANCE',
    title: 'Treinamento de Equilíbrio',
    benefit: 'Ajusta a coordenação motora à gravidade marciana',
    capiFeedback:
      'Equilíbrio nota 10! Seu cérebro aprende a caminhar com segurança no solo irregular de Marte.',
  },
];

interface Step1ExerciseGymProps {
  onComplete: () => void;
  onCapiFeedback: (line: string) => void;
}

export const Step1ExerciseGym: React.FC<Step1ExerciseGymProps> = ({
  onComplete,
  onCapiFeedback,
}) => {
  const { state, updateMission2, updateStats } = useGameStore();
  const completed = state.mission2.exercisesCompleted;
  const fitnessScore = Math.min(100, completed.length * 25);

  const handleDoExercise = (exercise: ExerciseOption) => {
    if (completed.includes(exercise.id)) {
      soundEngine.playClick();
      onCapiFeedback(exercise.capiFeedback);
      return;
    }

    soundEngine.playSuccess();
    const nextList = [...completed, exercise.id];
    const nextScore = Math.min(100, nextList.length * 25);

    updateMission2({
      exercisesCompleted: nextList,
      fitnessScore: nextScore,
    });
    updateStats({
      water: Math.max(60, state.stats.water - 2),
      energy: Math.max(40, state.stats.energy - 2),
    });
    onCapiFeedback(exercise.capiFeedback);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-sm border-2 border-cyan-500/50 bg-slate-900/90 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-cyan-300" />
            <h2 className="font-pixel text-[11px] text-cyan-200">
              DESAFIO 2.1 — EXERCÍCIOS FÍSICOS NA ESTAÇÃO DE TREINO
            </h2>
          </div>
          <span className="font-pixel text-[9px] text-emerald-300">
            CONDICIONAMENTO: {fitnessScore}%
          </span>
        </div>

        {/* Barra de condicionamento */}
        <div className="mt-2 h-3 w-full overflow-hidden rounded-sm border border-slate-700 bg-slate-950">
          <div
            style={{ width: `${fitnessScore}%` }}
            className="h-full bg-emerald-400 transition-all duration-300"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.1fr_1fr]">
        {/* Cenário 16-bit da academia espacial */}
        <div className="pixel-box relative aspect-video overflow-hidden bg-slate-900">
          <img
            src={ASSET_MANIFEST.habitatGym.path}
            alt={ASSET_MANIFEST.habitatGym.alt}
            className="pixel-art h-full w-full object-cover"
          />
          <div className="absolute bottom-3 left-5 flex items-end gap-2">
            <AstronautAvatar profile={state.astronaut} size="md" />
            <span className="rounded-sm border border-cyan-400/70 bg-slate-950/90 px-2 py-0.5 font-pixel text-[8px] text-cyan-200">
              {completed.length}/4 treinos
            </span>
          </div>
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-sm border border-emerald-400/60 bg-slate-950/90 px-2 py-1 font-dialog text-[11px] text-emerald-300">
            <HeartPulse className="h-3.5 w-3.5 animate-pulse text-rose-400" />
            {76 + completed.length * 8} bpm (simulado)
          </div>
        </div>

        {/* Botões das 4 atividades físicas do roteiro */}
        <div className="flex flex-col justify-between gap-2.5">
          <div className="space-y-2">
            {EXERCISES.map((ex) => {
              const done = completed.includes(ex.id);
              return (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => handleDoExercise(ex)}
                  className={`flex w-full items-center justify-between gap-2 rounded-sm border-2 p-2.5 text-left transition ${
                    done
                      ? 'border-emerald-400 bg-emerald-950/50 text-emerald-100'
                      : 'border-slate-700 bg-slate-900 text-slate-100 hover:border-cyan-400'
                  }`}
                >
                  <div>
                    <p className="font-pixel text-[9px]">{ex.title}</p>
                    <p className="mt-0.5 font-dialog text-[11px] text-slate-300">
                      {ex.benefit}
                    </p>
                  </div>
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                  ) : (
                    <Activity className="h-4 w-4 shrink-0 text-cyan-300" />
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={completed.length < 4}
            onClick={() => {
              soundEngine.playClick();
              onComplete();
            }}
            className="pixel-btn w-full bg-amber-400 px-4 py-2.5 font-pixel text-[10px] text-slate-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {completed.length >= 4
              ? 'Ir para o Refeitório Espacial (Desafio 2.2) ▶'
              : `Complete os 4 exercícios (${completed.length}/4)`}
          </button>
        </div>
      </div>
    </div>
  );
};
