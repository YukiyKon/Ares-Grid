import React, { useState } from 'react';
import { ArrowLeft, Satellite, ShieldAlert } from 'lucide-react';
import { CapiAssistant } from '../../components/permanent/CapiAssistant';
import { type Mission5Phase, useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';
import { useLanguage } from '../../i18n/LanguageContext';
import { SurvivalStationBanner } from '../../modes/survival30/SurvivalStationBanner';
import { Step1DustStormProtocol } from './Step1DustStormProtocol';
import { Step2SolarMaintenance } from './Step2SolarMaintenance';
import { Step3SolarRadiationShelter } from './Step3SolarRadiationShelter';
import { Step4PostStormInspection } from './Step4PostStormInspection';

type ActiveMission5Phase = Exclude<Mission5Phase, 'COMPLETED'>;

export const Mission5StormsScene: React.FC = () => {
  const { state, setScene, updateMission5, executeSurvivalStationAction } = useGameStore();
  const { dict, tx } = useLanguage();
  const isSurvival = state.gameMode === 'SURVIVAL_30';
  const phase: ActiveMission5Phase =
    state.mission5.phase === 'COMPLETED' ? 'STEP_4_INSPECTION' : state.mission5.phase;
  const [dynamicCapiLine, setDynamicCapiLine] = useState<string | null>(null);
  const [lockAlert, setLockAlert] = useState(false);

  const defaultLinesByPhase: Record<ActiveMission5Phase, string[]> = {
    STEP_1_DUST: [
      tx(
        'COMMANDER! ALERT! I received an environmental warning of a dust storm approaching Arcadia Planitia!',
        'COMANDANTE! ATENÇÃO! Recebi um alerta ambiental de tempestade de poeira se aproximando de Arcadia Planitia!'
      ),
      tx(
        'Execute the protection sequence: seal hatches, pause outdoor tasks, close air filters, and protect batteries!',
        'Execute a sequência de proteção: consulte o painel, interrompa tarefas externas, vede os filtros e gerencie baterias!'
      ),
    ],
    STEP_2_SOLAR_CLEAN: [
      tx(
        'Deposited Martian dust cut sunlight on our solar arrays! Inspect the power drop and trigger remote cleaning.',
        'A poeira depositada diminuiu a luz nos nossos painéis solares! Vamos inspecionar a queda e acionar a limpeza remota.'
      ),
    ],
    STEP_3_RADIATION: [
      tx(
        'SOLAR ACTIVITY ALERT! Unlike dust, solar radiation is invisible — move into the shielded shelter right away!',
        'ALERTA DE ATIVIDADE SOLAR! Diferente da poeira, a radiação não pode ser vista a olho nu — entre no Abrigo Blindado especial!'
      ),
    ],
    STEP_4_INSPECTION: [
      tx(
        'The storm has passed! Inspect the systems, log in the Scientific Logbook, and sleep to validate the Safety Report and unlock Scene 6!',
        'A tempestade passou! Inspecione os sistemas, registre no Diário de Bordo e durma para validar o Relatório de Segurança e liberar a Cena 6!'
      ),
    ],
  };

  const capiLines = dynamicCapiLine
    ? [dynamicCapiLine]
    : lockAlert
    ? [dict.survival.missionActions.m5LockAlert]
    : defaultLinesByPhase[phase];

  const handleMovePhase = (nextPhase: ActiveMission5Phase) => {
    setDynamicCapiLine(null);
    setLockAlert(false);
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
              {tx('MISSION 5 — ALERT! MARS STORMS', 'MISSÃO 5 — ALERTA! TEMPESTADES EM MARTE')}
            </h1>
            <p className="font-dialog text-xs text-slate-300">
              {tx(
                'Martian Dust & Solar Radiation (NASA Dust in the Wind • Real Martians)',
                'Poeira Marciana & Radiação Solar (NASA Dust in the Wind • Real Martians)'
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1 font-pixel text-[8px]">
            {(
              [
                ['STEP_1_DUST', tx('5.1 Dust', '5.1 Poeira')],
                ['STEP_2_SOLAR_CLEAN', tx('5.2 Panels', '5.2 Painéis')],
                ['STEP_3_RADIATION', tx('5.3 Radiation', '5.3 Radiação')],
                ['STEP_4_INSPECTION', tx('5.4 Inspect', '5.4 Inspeção')],
              ] as const
            ).map(([stepId, label]) => {
              const unlocked =
                (isSurvival && (stepId === 'STEP_1_DUST' || stepId === 'STEP_3_RADIATION')) ||
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
                      setDynamicCapiLine(null);
                      setLockAlert(true);
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
              {tx('Scene 6', 'Cena 6')}
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
            {dict.common.base}
          </button>
        </div>
      </div>

      <SurvivalStationBanner station="MISSION_5" />

      {/* Etapa ativa da Missão 5 */}
      <div className="rounded-sm border-2 border-slate-800 bg-slate-950/95 p-4">
        {phase === 'STEP_1_DUST' && (
          <Step1DustStormProtocol
            onComplete={() =>
              isSurvival
                ? executeSurvivalStationAction('MISSION_5')
                : handleMovePhase('STEP_2_SOLAR_CLEAN')
            }
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
            onComplete={() =>
              isSurvival
                ? executeSurvivalStationAction('MISSION_5')
                : handleMovePhase('STEP_4_INSPECTION')
            }
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
