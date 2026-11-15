import React, { useState } from 'react';
import { ArrowLeft, Sprout } from 'lucide-react';
import { CapiAssistant } from '../../components/permanent/CapiAssistant';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';
import { useLanguage } from '../../i18n/LanguageContext';
import { SurvivalStationBanner } from '../../modes/survival30/SurvivalStationBanner';
import { Step1BuildGreenhouse } from './Step1BuildGreenhouse';
import { Step2CultivationMethods } from './Step2CultivationMethods';
import { Step3CropSelection } from './Step3CropSelection';
import { Step4GrowthMonitor } from './Step4GrowthMonitor';
import { Step5BioregenerativeSystem } from './Step5BioregenerativeSystem';

export const Mission4GreenhouseScene: React.FC = () => {
  const { state, setScene, updateMission4, executeSurvivalStationAction } = useGameStore();
  const { dict, tx } = useLanguage();
  const isSurvival = state.gameMode === 'SURVIVAL_30';
  const phase =
    state.mission4.phase === 'COMPLETED' ? 'STEP_5_BIOREG' : state.mission4.phase;
  const [dynamicCapiLine, setDynamicCapiLine] = useState<string | null>(null);
  const [lockAlert, setLockAlert] = useState(false);

  const defaultLinesByPhase: Record<
    | 'STEP_1_BUILD'
    | 'STEP_2_METHODS'
    | 'STEP_3_CROPS'
    | 'STEP_4_GROWTH'
    | 'STEP_5_BIOREG',
    string[]
  > = {
    STEP_1_BUILD: [
      tx(
        'Commander, can we actually harvest tomatoes, strawberries, or a bright flower right here on Mars?',
        'Comandante, será que conseguimos colher tomate, morango ou uma flor colorida aqui em Marte?'
      ),
      tx(
        'Install the experimental greenhouse subsystems and link them to our Solar Array and Drinking Water!',
        'Instale os subsistemas da estufa experimental e conecte-a à nossa Energia Solar e à Água Potável!'
      ),
    ],
    STEP_2_METHODS: [
      tx(
        'We can grow crops without traditional soil using Hydroponics (water roots) and Aeroponics (nutrient mist)!',
        'Podemos cultivar sem solo tradicional usando Hidroponia (raízes na água) e Aeroponia (névoa nutritiva)!'
      ),
      tx(
        'Test both methods and discover why raw Martian regolith cannot be used directly!',
        'Experimente os métodos e veja por que o regolito marciano bruto não pode ser usado direto!'
      ),
    ],
    STEP_3_CROPS: [
      tx(
        'Let us pick our crops from the 4 research groups: Vegetables, Fruits, Grains, and Ornamentals!',
        'Vamos escolher nossas plantas nos 4 grupos de pesquisa: Hortaliças, Frutíferas, Cereais e Ornamentais!'
      ),
      tx(
        'Each plant group plays an important role in crew nutrition and psychological well-being in the Habitat.',
        'Cada grupo tem um papel importante para alimentação e bem-estar no habitat.'
      ),
    ],
    STEP_4_GROWTH: [
      tx(
        'Time to monitor germination, roots, and leaves! Balance light, water, and temperature to avoid plant stress.',
        'Hora de acompanhar a germinação, raízes e folhas! Ajuste luz, água e temperatura para evitar estresse nas plantas.'
      ),
    ],
    STEP_5_BIOREG: [
      tx(
        'Excellent! Integrate food crops, oxygen (O2), and recycled water into one bioregenerative system!',
        'Excelente! Integre produção de alimentos, oxigênio (O2) e água reciclada em um sistema bioregenerativo!'
      ),
      tx(
        'Then record it in your Logbook and sleep so I can transmit the greenhouse report and unlock Mission 5!',
        'Depois faça o registro no Diário e durma para eu enviar o relatório da estufa e liberar a Missão 5!'
      ),
    ],
  };

  const capiLines = dynamicCapiLine
    ? [dynamicCapiLine]
    : lockAlert
    ? [dict.survival.missionActions.m4LockAlert]
    : defaultLinesByPhase[phase];

  const handleMovePhase = (
    nextPhase:
      | 'STEP_1_BUILD'
      | 'STEP_2_METHODS'
      | 'STEP_3_CROPS'
      | 'STEP_4_GROWTH'
      | 'STEP_5_BIOREG'
  ) => {
    setDynamicCapiLine(null);
    setLockAlert(false);
    updateMission4({ phase: nextPhase });
  };

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-3 py-4 pb-52 sm:pb-44">
      {/* Cabeçalho modular da Missão 4 */}
      <div className="pixel-box flex flex-wrap items-center justify-between gap-3 bg-slate-950 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Sprout className="h-5 w-5 text-emerald-300" />
          <div>
            <h1 className="font-pixel text-xs text-emerald-200">
              {tx('MISSION 4 — THE FIRST MARS GREENHOUSE', 'MISSÃO 4 — A PRIMEIRA ESTUFA DE MARTE')}
            </h1>
            <p className="font-dialog text-xs text-slate-300">
              {tx(
                'Space Agriculture & Bioregenerative Systems (NASA ECLSS)',
                'Agricultura Espacial & Sistemas Bioregenerativos (NASA ECLSS)'
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1 font-pixel text-[8px]">
            {(
              [
                ['STEP_1_BUILD', tx('4.1 Dome', '4.1 Estufa')],
                ['STEP_2_METHODS', tx('4.2 Growth', '4.2 Cultivo')],
                ['STEP_3_CROPS', tx('4.3 Plants', '4.3 Plantas')],
                ['STEP_4_GROWTH', tx('4.4 Grow', '4.4 Crescer')],
                ['STEP_5_BIOREG', '4.5 ECLSS'],
              ] as const
            ).map(([stepId, label]) => {
              const subsReady = Object.values(state.mission4.subsystems).every(Boolean);
              const cropsReady = Boolean(
                state.mission4.selectedCrops.vegetable &&
                  state.mission4.selectedCrops.fruit &&
                  state.mission4.selectedCrops.grain &&
                  state.mission4.selectedCrops.ornamental
              );
              const unlocked =
                (isSurvival && stepId === 'STEP_4_GROWTH') ||
                stepId === 'STEP_1_BUILD' ||
                (stepId === 'STEP_2_METHODS' && subsReady) ||
                (stepId === 'STEP_3_CROPS' &&
                  state.mission4.selectedMethod === 'HYDRO_AERO') ||
                (stepId === 'STEP_4_GROWTH' && cropsReady) ||
                (stepId === 'STEP_5_BIOREG' && state.mission4.growthStage === 3);

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
                      ? 'border-emerald-300 bg-emerald-400 text-slate-950'
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

      <SurvivalStationBanner station="MISSION_4" />

      {/* Etapa ativa da Missão 4 */}
      <div className="rounded-sm border-2 border-slate-800 bg-slate-950/95 p-4">
        {phase === 'STEP_1_BUILD' && (
          <Step1BuildGreenhouse
            onComplete={() => handleMovePhase('STEP_2_METHODS')}
            onCapiFeedback={(line) => setDynamicCapiLine(line)}
          />
        )}

        {phase === 'STEP_2_METHODS' && (
          <Step2CultivationMethods
            onComplete={() => handleMovePhase('STEP_3_CROPS')}
            onCapiFeedback={(line) => setDynamicCapiLine(line)}
          />
        )}

        {phase === 'STEP_3_CROPS' && (
          <Step3CropSelection
            onComplete={() => handleMovePhase('STEP_4_GROWTH')}
            onCapiFeedback={(line) => setDynamicCapiLine(line)}
          />
        )}

        {phase === 'STEP_4_GROWTH' && (
          <Step4GrowthMonitor
            onComplete={() =>
              isSurvival
                ? executeSurvivalStationAction('MISSION_4')
                : handleMovePhase('STEP_5_BIOREG')
            }
            onCapiFeedback={(line) => setDynamicCapiLine(line)}
          />
        )}

        {phase === 'STEP_5_BIOREG' && (
          <Step5BioregenerativeSystem
            onCapiFeedback={(line) => setDynamicCapiLine(line)}
            onReturnToBase={() => setScene('BASE_HUB')}
          />
        )}
      </div>

      <CapiAssistant
        dialogId={dynamicCapiLine || lockAlert ? undefined : `mission4_${phase}`}
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
