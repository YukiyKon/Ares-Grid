import React, { useState } from 'react';
import { ArrowLeft, Satellite, ShieldAlert } from 'lucide-react';
import { CapiAssistant } from '../../components/permanent/CapiAssistant';
import { type Mission5Phase, useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';
import { Step1DustStormProtocol } from './Step1DustStormProtocol';
import { Step2SolarMaintenance } from './Step2SolarMaintenance';
import { Step3SolarRadiationShelter } from './Step3SolarRadiationShelter';
import { Step4PostStormInspection } from './Step4PostStormInspection';

type ActiveMission5Phase = Exclude<Mission5Phase, 'COMPLETED'>;

export const Mission5StormsScene: React.FC = () => {
  const { state, setScene, updateMission5 } = useGameStore();
  const phase: ActiveMission5Phase =
    state.mission5.phase === 'COMPLETED' ? 'STEP_4_INSPECTION' : state.mission5.phase;
  const [dynamicCapiLine, setDynamicCapiLine] = useState<string | null>(null);

  const defaultLinesByPhase: Record<ActiveMission5Phase, string[]> = {
    STEP_1_DUST: [
      'COMANDANTE! ATENÇÃO! Recebi um alerta ambiental de tempestade de poeira se aproximando de Arcadia Planitia!',
      'Execute a sequência de proteção: consulte o painel, interrompa tarefas externas, vede os filtros e gerencie baterias!',
    ],
    STEP_2_SOLAR_CLEAN: [
      'A poeira depositada diminuiu a luz nos nossos painéis solares! Vamos inspecionar a queda e acionar a limpeza remota.',
    ],
    STEP_3_RADIATION: [
      'ALERTA DE ATIVIDADE SOLAR! Diferente da poeira, a radiação não pode ser vista a olho nu — entre no Abrigo Blindado especial!',
    ],
    STEP_4_INSPECTION: [
      'A tempestade passou! Inspecione os sistemas, registre no Diário de Bordo e durma para validar o Relatório de Segurança e liberar a Cena 6!',
    ],
  };

  const capiLines = dynamicCapiLine
    ? [dynamicCapiLine]
    : defaultLinesByPhase[phase];

  const handleMovePhase = (nextPhase: ActiveMission5Phase) => {
    setDynamicCapiLine(null);
    updateMission5({ phase: nextPhase });
  };

  const dustDone = Object.values(state.mission5.dustProtocol).every(Boolean);
  const solarDone = state.mission5.postDustSolar.remoteCleaningTriggered;
  const radDone = Object.values(state.mission5.radiationProtocol).every(Boolean);

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-3 py-4 pb-52 sm:pb-44">
      {/* Cabeçalho modular da Missão 5 */}
      <div className="pixel-box flex flex-wrap items-center justify-between gap-3 bg-slate-950 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="h-5 w-5 text-orange-400" />
          <div>
            <h1 className="font-pixel text-xs text-orange-200">
              MISSÃO 5 — ALERTA! TEMPESTADES EM MARTE
            </h1>
            <p className="font-dialog text-xs text-slate-300">
              Poeira Marciana & Radiação Solar (NASA Dust in the Wind • Real Martians)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1 font-pixel text-[8px]">
            {(
              [
                ['STEP_1_DUST', '5.1 Poeira'],
                ['STEP_2_SOLAR_CLEAN', '5.2 Painéis'],
                ['STEP_3_RADIATION', '5.3 Radiação'],
                ['STEP_4_INSPECTION', '5.4 Inspeção'],
              ] as const
            ).map(([stepId, label]) => {
              const unlocked =
                stepId === 'STEP_1_DUST' ||
                (stepId === 'STEP_2_SOLAR_CLEAN' && dustDone) ||
                (stepId === 'STEP_3_RADIATION' && solarDone) ||
                (stepId === 'STEP_4_INSPECTION' && radDone);

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
                      ? 'border-orange-300 bg-orange-400 text-slate-950'
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

          {state.mission5.endingUnlocked && (
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setScene('EARTH_COMMS');
              }}
              className="inline-flex items-center gap-1 rounded-sm border border-cyan-400 bg-cyan-950 px-2.5 py-1 font-pixel text-[8px] text-cyan-200 hover:bg-cyan-900"
            >
              <Satellite className="h-3.5 w-3.5" />
              Cena 6
            </button>
          )}

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

      {/* Etapa ativa da Missão 5 */}
      <div className="rounded-sm border-2 border-slate-800 bg-slate-950/95 p-4">
        {phase === 'STEP_1_DUST' && (
          <Step1DustStormProtocol
            onComplete={() => handleMovePhase('STEP_2_SOLAR_CLEAN')}
            onCapiFeedback={(line) => setDynamicCapiLine(line)}
          />
        )}

        {phase === 'STEP_2_SOLAR_CLEAN' && (
          <Step2SolarMaintenance
            onComplete={() => handleMovePhase('STEP_3_RADIATION')}
            onCapiFeedback={(line) => setDynamicCapiLine(line)}
          />
        )}

        {phase === 'STEP_3_RADIATION' && (
          <Step3SolarRadiationShelter
            onComplete={() => handleMovePhase('STEP_4_INSPECTION')}
            onCapiFeedback={(line) => setDynamicCapiLine(line)}
          />
        )}

        {phase === 'STEP_4_INSPECTION' && (
          <Step4PostStormInspection
            onCapiFeedback={(line) => setDynamicCapiLine(line)}
            onGoEarthComms={() => setScene('EARTH_COMMS')}
          />
        )}
      </div>

      <CapiAssistant lines={capiLines} compact />
    </section>
  );
};
