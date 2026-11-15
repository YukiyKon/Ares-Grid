import React, { useState } from 'react';
import { ArrowLeft, HeartPulse } from 'lucide-react';
import { CapiAssistant } from '../../components/permanent/CapiAssistant';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';
import { Step1ExerciseGym } from './Step1ExerciseGym';
import { Step2NutritionGalley } from './Step2NutritionGalley';
import { Step3HygieneModule } from './Step3HygieneModule';
import { Step4SleepAndCapiNight } from './Step4SleepAndCapiNight';

export const Mission2HealthScene: React.FC = () => {
  const { state, setScene, updateMission2 } = useGameStore();
  const phase =
    state.mission2.phase === 'COMPLETED' ? 'STEP_4_SLEEP' : state.mission2.phase;
  const [dynamicCapiLine, setDynamicCapiLine] = useState<string | null>(null);

  const defaultLinesByPhase: Record<
    'STEP_1_GYM' | 'STEP_2_GALLEY' | 'STEP_3_HYGIENE' | 'STEP_4_SLEEP',
    string[]
  > = {
    STEP_1_GYM: [
      'Comandante, nosso sistema de energia solar está funcionando! Agora precisamos cuidar da sua saúde.',
      'A gravidade menor de Marte enfraquece músculos e ossos. Escolha os 4 exercícios na estação de treino!',
    ],
    STEP_2_GALLEY: [
      'Hora de preparar uma refeição equilibrada! Combine proteínas, vegetais e carboidratos.',
      'Não esqueça da água! Escolha a quantidade ideal sem desperdícios, pois ela é preciosa em Marte.',
    ],
    STEP_3_HYGIENE: [
      'Hora da higiene! Escove os dentes, higienize as mãos e limpe seus equipamentos.',
      'A higiene reduz riscos de contaminação e mantém todo o habitat saudável!',
    ],
    STEP_4_SLEEP: [
      'Nosso dia de exploração terminou! Confira suas tarefas e prepare seu descanso na cabine.',
      'Quando você dormir, eu vou abrir o Painel de Saúde e organizar tudo no servidor da nave!',
    ],
  };

  const capiLines = dynamicCapiLine
    ? [dynamicCapiLine]
    : defaultLinesByPhase[phase];

  const handleMovePhase = (
    nextPhase: 'STEP_1_GYM' | 'STEP_2_GALLEY' | 'STEP_3_HYGIENE' | 'STEP_4_SLEEP'
  ) => {
    setDynamicCapiLine(null);
    updateMission2({ phase: nextPhase });
  };

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-3 py-4 pb-52 sm:pb-44">
      {/* Cabeçalho modular da Missão 2 */}
      <div className="pixel-box flex flex-wrap items-center justify-between gap-3 bg-slate-950 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <HeartPulse className="h-5 w-5 text-rose-400" />
          <div>
            <h1 className="font-pixel text-xs text-cyan-200">
              MISSÃO 2 — CUIDANDO DO ASTRONAUTA
            </h1>
            <p className="font-dialog text-xs text-slate-300">
              Rotina no Habitat • Exercícios, Nutrição, Higiene e Sono
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1 font-pixel text-[8px]">
            {(
              [
                ['STEP_1_GYM', '2.1 Treino'],
                ['STEP_2_GALLEY', '2.2 Nutrição'],
                ['STEP_3_HYGIENE', '2.3 Higiene'],
                ['STEP_4_SLEEP', '2.4 Sono'],
              ] as const
            ).map(([stepId, label]) => {
              const unlocked =
                stepId === 'STEP_1_GYM' ||
                (stepId === 'STEP_2_GALLEY' && state.mission2.exercisesCompleted.length >= 4) ||
                (stepId === 'STEP_3_HYGIENE' && state.mission2.nutritionCompleted) ||
                (stepId === 'STEP_4_SLEEP' && state.mission2.hygieneCompleted);

              return (
                <button
                  key={stepId}
                  type="button"
                  onClick={() => {
                    if (unlocked) {
                      soundEngine.playClick();
                      handleMovePhase(stepId);
                    } else {
                      soundEngine.playAlert();
                      setDynamicCapiLine(
                        'Conclua os objetivos do desafio atual antes de avançar para esta etapa!'
                      );
                    }
                  }}
                  className={`rounded-sm border px-2 py-1 ${
                    phase === stepId
                      ? 'border-cyan-300 bg-cyan-400 text-slate-950'
                      : unlocked
                      ? 'border-slate-600 bg-slate-800 text-slate-200'
                      : 'border-slate-800 bg-slate-900 text-slate-500'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setScene('BASE_HUB');
            }}
            className="inline-flex items-center gap-1 rounded-sm border border-slate-700 bg-slate-900 px-2.5 py-1 font-dialog text-xs text-slate-200 hover:border-cyan-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Base
          </button>
        </div>
      </div>

      {/* Corpo do desafio atual */}
      <div className="rounded-sm border-2 border-slate-800 bg-slate-950/95 p-4">
        {phase === 'STEP_1_GYM' && (
          <Step1ExerciseGym
            onComplete={() => handleMovePhase('STEP_2_GALLEY')}
            onCapiFeedback={(line) => setDynamicCapiLine(line)}
          />
        )}

        {phase === 'STEP_2_GALLEY' && (
          <Step2NutritionGalley
            onComplete={() => handleMovePhase('STEP_3_HYGIENE')}
            onCapiFeedback={(line) => setDynamicCapiLine(line)}
          />
        )}

        {phase === 'STEP_3_HYGIENE' && (
          <Step3HygieneModule
            onComplete={() => handleMovePhase('STEP_4_SLEEP')}
            onCapiFeedback={(line) => setDynamicCapiLine(line)}
          />
        )}

        {phase === 'STEP_4_SLEEP' && (
          <Step4SleepAndCapiNight
            onCapiFeedback={(line) => setDynamicCapiLine(line)}
            onReturnToBase={() => setScene('BASE_HUB')}
            onStartMission3={() => setScene('MISSION_3')}
          />
        )}
      </div>

      <CapiAssistant lines={capiLines} compact />
    </section>
  );
};
