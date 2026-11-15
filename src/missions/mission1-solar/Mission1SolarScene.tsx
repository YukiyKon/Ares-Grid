import React, { useState } from 'react';
import { ArrowLeft, SunMedium } from 'lucide-react';
import { CapiAssistant } from '../../components/permanent/CapiAssistant';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';
import { Step1SiteSelection } from './Step1SiteSelection';
import { Step2SolarCalc } from './Step2SolarCalc';
import { Step3SystemTest } from './Step3SystemTest';

export const Mission1SolarScene: React.FC = () => {
  const { state, setScene, updateMission1 } = useGameStore();
  const phase = state.mission1.phase === 'COMPLETED' ? 'STEP_3_TEST' : state.mission1.phase;
  const [dynamicCapiLine, setDynamicCapiLine] = useState<string | null>(null);

  const defaultLinesByPhase: Record<'STEP_1_SITE' | 'STEP_2_CALC' | 'STEP_3_TEST', string[]> = {
    STEP_1_SITE: [
      'Antes de montar os painéis, observe o terreno de Arcadia Planitia! Escolha um ponto com boa luz solar.',
      'Evite sombras de rochas e terrenos inclinados com pedregulhos para facilitar a limpeza da poeira.',
    ],
    STEP_2_CALC: [
      'Vamos calcular a posição do Sol com o sistema Mars24 da NASA! Escolha a estação e o horário solar.',
      'Ajuste a Orientação e a Inclinação (0° a 60°) até maximizar os Watts gerados pelo painel!',
    ],
    STEP_3_TEST: [
      'Nosso sistema começou a produzir energia! Mas Marte tem entardecer, noites e poeira.',
      'Teste a simulação de poeira, limpe o painel, ative a economia e registre tudo no Diário antes de dormir!',
    ],
  };

  const capiLines = dynamicCapiLine
    ? [dynamicCapiLine]
    : defaultLinesByPhase[phase];

  const handleGoToStep2 = () => {
    setDynamicCapiLine(null);
    updateMission1({ phase: 'STEP_2_CALC' });
  };

  const handleInstalled = () => {
    setDynamicCapiLine(null);
    updateMission1({ phase: 'STEP_3_TEST' });
  };

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-3 py-4 pb-52 sm:pb-44">
      {/* Cabeçalho modular da Missão 1 */}
      <div className="pixel-box-mars flex flex-wrap items-center justify-between gap-3 bg-slate-950 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <SunMedium className="h-5 w-5 text-amber-300" />
          <div>
            <h1 className="font-pixel text-xs text-amber-300">
              MISSÃO 1 — ENERGIA PARA EXPLORAR MARTE
            </h1>
            <p className="font-dialog text-xs text-slate-300">
              Arcadia Planitia • Sistema Fotovoltaico & NASA GISS Mars24
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex gap-1 font-pixel text-[8px]">
            {(
              [
                ['STEP_1_SITE', '1.1 Local'],
                ['STEP_2_CALC', '1.2 Mars24'],
                ['STEP_3_TEST', '1.3 Teste'],
              ] as const
            ).map(([stepId, label]) => (
              <button
                key={stepId}
                type="button"
                onClick={() => {
                  if (
                    stepId === 'STEP_1_SITE' ||
                    (stepId === 'STEP_2_CALC' && state.mission1.selectedSite === 'C') ||
                    (stepId === 'STEP_3_TEST' && state.stats.solarInstalled)
                  ) {
                    soundEngine.playClick();
                    setDynamicCapiLine(null);
                    updateMission1({ phase: stepId });
                  } else {
                    soundEngine.playAlert();
                    setDynamicCapiLine(
                      'Conclua os objetivos do desafio atual antes de avançar para esta etapa!'
                    );
                  }
                }}
                className={`rounded-sm border px-2 py-1 ${
                  phase === stepId
                    ? 'border-amber-300 bg-amber-400 text-slate-950'
                    : 'border-slate-700 bg-slate-900 text-slate-400'
                }`}
              >
                {label}
              </button>
            ))}
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
        {phase === 'STEP_1_SITE' && (
          <Step1SiteSelection
            onSiteConfirmed={handleGoToStep2}
            onSiteInspected={(line) => setDynamicCapiLine(line)}
          />
        )}

        {phase === 'STEP_2_CALC' && (
          <Step2SolarCalc onInstalled={handleInstalled} />
        )}

        {phase === 'STEP_3_TEST' && (
          <Step3SystemTest
            onCapiFeedback={(line) => setDynamicCapiLine(line)}
            onReturnToBase={() => setScene('BASE_HUB')}
          />
        )}
      </div>

      <CapiAssistant lines={capiLines} compact />
    </section>
  );
};
