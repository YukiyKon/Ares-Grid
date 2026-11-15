import React, { useState } from 'react';
import { ArrowLeft, Snowflake } from 'lucide-react';
import { CapiAssistant } from '../../components/permanent/CapiAssistant';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';
import { useLanguage } from '../../i18n/LanguageContext';
import { SurvivalStationBanner } from '../../modes/survival30/SurvivalStationBanner';
import { Step1OrbitalRadarMap } from './Step1OrbitalRadarMap';
import { Step2DrillAndSample } from './Step2DrillAndSample';
import { Step3WaterLabAndPotability } from './Step3WaterLabAndPotability';
import { Step4Mission3Conclusion } from './Step4Mission3Conclusion';

export const Mission3IceScene: React.FC = () => {
  const { state, setScene, updateMission3 } = useGameStore();
  const { dict, tx } = useLanguage();
  const isSurvival = state.gameMode === 'SURVIVAL_30';
  const phase =
    state.mission3.phase === 'COMPLETED' ? 'STEP_4_CLOSE' : state.mission3.phase;
  const [dynamicCapiLine, setDynamicCapiLine] = useState<string | null>(null);
  const [lockAlert, setLockAlert] = useState(false);

  const defaultLinesByPhase: Record<
    'STEP_1_RADAR' | 'STEP_2_DRILL' | 'STEP_3_LAB' | 'STEP_4_CLOSE',
    string[]
  > = {
    STEP_1_RADAR: [
      tx(
        'Commander, Arcadia Planitia shows signs of buried water ice! But we cannot drill blindly anywhere.',
        'Comandante, Arcadia Planitia tem indícios de gelo subterrâneo! Mas não podemos perfurar em qualquer lugar.'
      ),
      tx(
        'Cross-check all 3 layers (HiRISE Surface, SHARAD Radar, and NASA Prior Studies) before choosing the site!',
        'Cruze as 3 camadas (Superfície HiRISE, Radar SHARAD e Estudos Prévios da NASA) antes de escolher o ponto!'
      ),
    ],
    STEP_2_DRILL: [
      tx(
        'We are in Sector Gamma! Operate the drill at shallow exploratory depths to verify our radar hypothesis.',
        'Estamos no Setor Gama! Use a perfuradora em pequenas profundidades exploratórias para conferir os dados do radar.'
      ),
      tx(
        'Remember: a shallow exploratory borehole confirms ice presence. Let us retrieve the frozen sample!',
        'Lembre-se: uma pequena perfuração verifica nossas hipóteses. Vamos buscar o testemunho congelado!'
      ),
    ],
    STEP_3_LAB: [
      tx(
        'Time to turn buried ice into clean water in the lab: separate soil, melt, filter, and apply UV treatment.',
        'Hora de transformar o gelo em água no laboratório: separe o solo, derreta, filtre e faça o tratamento químico.'
      ),
      tx(
        'Then run all 5 potability tests! Clear water can still hide dissolved salts and perchlorates.',
        'Depois analise os 5 testes de potabilidade! Água transparente pode esconder sais e percloratos invisíveis.'
      ),
    ],
    STEP_4_CLOSE: [
      tx(
        'What an incredible discovery! We now have safe drinking water and valuable science data from Arcadia Planitia!',
        'Que investigação incrível! Agora temos água potável tratada e dados científicos valiosos de Arcadia Planitia!'
      ),
      tx(
        'Record this discovery in the Logbook and use the sleep cycle to send it to Earth and unlock Mission 4!',
        'Registre a descoberta no Diário de Bordo e use a rotina de sono para enviar à Terra e liberar a Missão 4!'
      ),
    ],
  };

  const capiLines = dynamicCapiLine
    ? [dynamicCapiLine]
    : lockAlert
    ? [dict.survival.missionActions.m3LockAlert]
    : defaultLinesByPhase[phase];

  const handleMovePhase = (
    nextPhase: 'STEP_1_RADAR' | 'STEP_2_DRILL' | 'STEP_3_LAB' | 'STEP_4_CLOSE'
  ) => {
    setDynamicCapiLine(null);
    setLockAlert(false);
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
              {tx('MISSION 3 — THE MYSTERY OF MARS ICE', 'MISSÃO 3 — O MISTÉRIO DO GELO DE MARTE')}
            </h1>
            <p className="font-dialog text-xs text-slate-300">
              {tx(
                'Arcadia Planitia • SHARAD Radar, Drilling & Water Potability',
                'Arcadia Planitia • Radar SHARAD, Perfuração e Potabilidade'
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1 font-pixel text-[8px]">
            {(
              [
                ['STEP_1_RADAR', '3.1/3.2 Radar'],
                ['STEP_2_DRILL', tx('3.3/3.4 Drill', '3.3/3.4 Perfurar')],
                ['STEP_3_LAB', tx('3.5/3.6 Water', '3.5/3.6 Água')],
                ['STEP_4_CLOSE', tx('Wrap-up', 'Fechamento')],
              ] as const
            ).map(([stepId, label]) => {
              const unlocked =
                (isSurvival && (stepId === 'STEP_2_DRILL' || stepId === 'STEP_3_LAB')) ||
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
                    } else {
                      soundEngine.playAlert();
                      setDynamicCapiLine(null);
                      setLockAlert(true);
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
            {dict.common.base}
          </button>
        </div>
      </div>

      <SurvivalStationBanner station="MISSION_3" />

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

      <CapiAssistant
        dialogId={dynamicCapiLine || lockAlert ? undefined : `mission3_${phase}`}
        lines={capiLines}
        onDismiss={() => {
          if (dynamicCapiLine) setDynamicCapiLine(null);
          if (lockAlert) setLockAlert(false);
        }}
        compact
      />
    </section>
  );
};
