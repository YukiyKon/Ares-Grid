import React, { useState } from 'react';
import { ArrowLeft, Snowflake } from 'lucide-react';
import { CapiAssistant } from '../../components/permanent/CapiAssistant';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';
import { Step1OrbitalRadarMap } from './Step1OrbitalRadarMap';
import { Step2DrillAndSample } from './Step2DrillAndSample';
import { Step3WaterLabAndPotability } from './Step3WaterLabAndPotability';
import { Step4Mission3Conclusion } from './Step4Mission3Conclusion';

export const Mission3IceScene: React.FC = () => {
  const { state, setScene, updateMission3 } = useGameStore();
  const phase =
    state.mission3.phase === 'COMPLETED' ? 'STEP_4_CLOSE' : state.mission3.phase;
  const [dynamicCapiLine, setDynamicCapiLine] = useState<string | null>(null);

  const defaultLinesByPhase: Record<
    'STEP_1_RADAR' | 'STEP_2_DRILL' | 'STEP_3_LAB' | 'STEP_4_CLOSE',
    string[]
  > = {
    STEP_1_RADAR: [
      'Comandante, Arcadia Planitia tem indícios de gelo subterrâneo! Mas não podemos perfurar em qualquer lugar.',
      'Cruze as 3 camadas (Superfície HiRISE, Radar SHARAD e Estudos Prévios da NASA) antes de escolher o ponto!',
    ],
    STEP_2_DRILL: [
      'Estamos no Setor Gama! Use a perfuradora em pequenas profundidades exploratórias para conferir os dados do radar.',
      'Lembre-se: uma pequena perfuração verifica nossas hipóteses. Vamos buscar o testemunho congelado!',
    ],
    STEP_3_LAB: [
      'Hora de transformar o gelo em água no laboratório: separe o solo, derreta, filtre e faça o tratamento químico.',
      'Depois analise os 5 testes de potabilidade! Água transparente pode esconder sais e percloratos invisíveis.',
    ],
    STEP_4_CLOSE: [
      'Que investigação incrível! Agora temos água potável tratada e dados científicos valiosos de Arcadia Planitia!',
      'Registre a descoberta no Diário de Bordo e use a rotina de sono para enviar à Terra e liberar a Missão 4!',
    ],
  };

  const capiLines = dynamicCapiLine
    ? [dynamicCapiLine]
    : defaultLinesByPhase[phase];

  const handleMovePhase = (
    nextPhase: 'STEP_1_RADAR' | 'STEP_2_DRILL' | 'STEP_3_LAB' | 'STEP_4_CLOSE'
  ) => {
    setDynamicCapiLine(null);
    updateMission3({ phase: nextPhase });
  };

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-3 py-4 pb-52 sm:pb-44">
      {/* Cabeçalho modular da Missão 3 */}
      <div className="pixel-box flex flex-wrap items-center justify-between gap-3 bg-slate-950 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Snowflake className="h-5 w-5 text-cyan-300" />
          <div>
            <h1 className="font-pixel text-xs text-cyan-200">
              MISSÃO 3 — O MISTÉRIO DO GELO DE MARTE
            </h1>
            <p className="font-dialog text-xs text-slate-300">
              Arcadia Planitia • Radar SHARAD, Perfuração e Potabilidade
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1 font-pixel text-[8px]">
            {(
              [
                ['STEP_1_RADAR', '3.1/3.2 Radar'],
                ['STEP_2_DRILL', '3.3/3.4 Perfurar'],
                ['STEP_3_LAB', '3.5/3.6 Água'],
                ['STEP_4_CLOSE', 'Fechamento'],
              ] as const
            ).map(([stepId, label]) => {
              const unlocked =
                stepId === 'STEP_1_RADAR' ||
                (stepId === 'STEP_2_DRILL' &&
                  state.mission3.selectedSector === 'GAMMA' &&
                  state.mission3.layersInspected.surface &&
                  state.mission3.layersInspected.radar &&
                  state.mission3.layersInspected.priorStudies) ||
                (stepId === 'STEP_3_LAB' && state.mission3.sampleStored) ||
                (stepId === 'STEP_4_CLOSE' && state.mission3.waterApproved);

              return (
                <button
                  key={stepId}
                  type="button"
                  onClick={() => {
                    if (unlocked) {
                      soundEngine.playClick();
                      handleMovePhase(stepId);
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

      {/* Etapa ativa da Missão 3 */}
      <div className="rounded-sm border-2 border-slate-800 bg-slate-950/95 p-4">
        {phase === 'STEP_1_RADAR' && (
          <Step1OrbitalRadarMap
            onComplete={() => handleMovePhase('STEP_2_DRILL')}
            onCapiFeedback={(line) => setDynamicCapiLine(line)}
          />
        )}

        {phase === 'STEP_2_DRILL' && (
          <Step2DrillAndSample
            onComplete={() => handleMovePhase('STEP_3_LAB')}
            onCapiFeedback={(line) => setDynamicCapiLine(line)}
          />
        )}

        {phase === 'STEP_3_LAB' && (
          <Step3WaterLabAndPotability
            onComplete={() => handleMovePhase('STEP_4_CLOSE')}
            onCapiFeedback={(line) => setDynamicCapiLine(line)}
          />
        )}

        {phase === 'STEP_4_CLOSE' && (
          <Step4Mission3Conclusion onReturnToBase={() => setScene('BASE_HUB')} />
        )}
      </div>

      <CapiAssistant lines={capiLines} compact />
    </section>
  );
};
