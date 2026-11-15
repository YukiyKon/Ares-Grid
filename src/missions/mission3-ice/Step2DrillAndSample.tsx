import React from 'react';
import { CheckCircle2, Drill, PackageCheck, Tag } from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { AstronautAvatar } from '../../components/permanent/AstronautAvatar';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

const DEPTH_TELEMETRY: Record<
  0 | 1 | 2 | 3,
  { meters: string; layer: string; temp: string; summary: string }
> = {
  0: {
    meters: '0,0 m (Superfície)',
    layer: 'Poeira e regolito superficial',
    temp: '-58 °C',
    summary: 'Perfuradora posicionada e nivelada no Setor Gama de Arcadia Planitia.',
  },
  1: {
    meters: '0,6 m',
    layer: 'Regolito seco avermelhado',
    temp: '-62 °C',
    summary: 'Solo oxidado rico em ferro. Ainda sem sinal direto de cristais de gelo.',
  },
  2: {
    meters: '1,4 m',
    layer: 'Solo congelado misto (permafrost)',
    temp: '-69 °C',
    summary: 'Primeiros grãos cimentados por gelo! Estamos bem perto da camada indicada pelo SHARAD.',
  },
  3: {
    meters: '2,2 m',
    layer: 'Depósito de Gelo Subterrâneo (H2O)',
    temp: '-73 °C',
    summary: 'Amostra cilíndrica confirmada! Cristais brilhantes azul-ciano extraídos abaixo do regolito.',
  },
};

interface Step2DrillAndSampleProps {
  onComplete: () => void;
  onCapiFeedback: (line: string) => void;
}

export const Step2DrillAndSample: React.FC<Step2DrillAndSampleProps> = ({
  onComplete,
  onCapiFeedback,
}) => {
  const { state, updateMission3 } = useGameStore();
  const { drillDepthStep, sampleExtracted, sampleLabeled, sampleStored } = state.mission3;
  const telemetry = DEPTH_TELEMETRY[drillDepthStep];
  const allSampleActionsDone = sampleExtracted && sampleLabeled && sampleStored;

  const handleDrillDeeper = () => {
    if (drillDepthStep >= 3) return;
    const nextStep = (drillDepthStep + 1) as 1 | 2 | 3;
    updateMission3({ drillDepthStep: nextStep });

    if (nextStep === 1) {
      soundEngine.playLaunchRumble();
      onCapiFeedback(
        '0,6 m alcançados! Encontramos regolito seco na superfície. Uma pequena perfuração ajuda a testar nossa hipótese aos poucos!'
      );
    } else if (nextStep === 2) {
      soundEngine.playLaunchRumble();
      onCapiFeedback(
        '1,4 m! O solo está bem mais frio e misturado com gelo. Vamos perfurar até 2,2 m para coletar o testemunho completo!'
      );
    } else {
      soundEngine.playSuccess();
      onCapiFeedback(
        'Olha só, comandante! Aos 2,2 m encontramos material congelado brilhante abaixo do regolito! Agora vamos separar, etiquetar e armazenar a amostra.'
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-sm border-2 border-amber-500/50 bg-slate-900/90 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Drill className="h-4 w-4 text-amber-300" />
            <h2 className="font-pixel text-[11px] text-amber-200">
              DESAFIO 3.3 & 3.4 — PERFURAÇÃO EXPLORATÓRIA E COLETA (ICE CORE)
            </h2>
          </div>
          <span className="font-pixel text-[9px] text-cyan-300">
            PROFUNDIDADE: {telemetry.meters}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.15fr_1fr]">
        {/* Cenário da perfuradora marciana + amostra encontrada */}
        <div className="pixel-box relative aspect-video overflow-hidden bg-gradient-to-b from-orange-950 via-red-950 to-stone-950">
          {/* Solo em subsuperfície na base da cena */}
          <div className="absolute inset-x-0 bottom-0 h-16 border-t-4 border-orange-700 bg-gradient-to-b from-orange-900 to-cyan-950" />

          <div className="relative z-10 flex h-full items-end justify-around px-4 pb-3">
            <div className="flex flex-col items-center">
              <AstronautAvatar profile={state.astronaut} size="md" />
            </div>

            <img
              src={ASSET_MANIFEST.drillRig.path}
              alt={ASSET_MANIFEST.drillRig.alt}
              className="pixel-art h-48 w-auto object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.75)] sm:h-56"
            />

            {drillDepthStep === 3 && (
              <div className="flex flex-col items-center rounded-sm border-2 border-cyan-400/80 bg-slate-950/90 p-2 shadow-lg">
                <img
                  src={ASSET_MANIFEST.iceCoreSample.path}
                  alt={ASSET_MANIFEST.iceCoreSample.alt}
                  className="pixel-art h-32 w-auto object-contain"
                />
                <span className="mt-1 font-pixel text-[7px] text-cyan-200">
                  ICE CORE 2,2m
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Telemetria e ações de perfuração / armazenamento */}
        <div className="flex flex-col justify-between gap-3">
          <div className="space-y-2 rounded-sm border border-slate-700 bg-slate-900 p-3 font-dialog text-xs">
            <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
              <span className="font-pixel text-[9px] text-cyan-300">
                TELEMETRIA DE SUBSOLO (SETOR GAMA)
              </span>
              <span className="text-sky-300">{telemetry.temp}</span>
            </div>
            <p className="text-amber-200 font-bold">{telemetry.layer}</p>
            <p className="text-slate-300">{telemetry.summary}</p>
          </div>

          {drillDepthStep < 3 ? (
            <button
              type="button"
              onClick={handleDrillDeeper}
              className="pixel-btn flex w-full items-center justify-center gap-2 bg-amber-400 px-4 py-3 font-pixel text-[10px] text-slate-950 hover:bg-amber-300"
            >
              <Drill className="h-4 w-4" />
              Acionar Perfuradora Exploratória ({drillDepthStep + 1}/3)
            </button>
          ) : (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playSuccess();
                  updateMission3({ sampleExtracted: true });
                  onCapiFeedback(
                    'Material separado cuidadosamente! Separamos o regolito do topo da camada congelada azul-ciano.'
                  );
                }}
                className={`flex w-full items-center justify-between rounded-sm border-2 px-3 py-2 text-left font-dialog text-xs ${
                  sampleExtracted
                    ? 'border-emerald-400 bg-emerald-950/50 text-emerald-100'
                    : 'border-slate-700 bg-slate-900 text-slate-100 hover:border-cyan-400'
                }`}
              >
                <span>1. Separar material congelado do solo</span>
                {sampleExtracted && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
              </button>

              <button
                type="button"
                disabled={!sampleExtracted}
                onClick={() => {
                  soundEngine.playSuccess();
                  updateMission3({ sampleLabeled: true });
                  onCapiFeedback(
                    'Etiqueta aplicada: Arcadia Planitia • Setor Gama (39,2°N) • Profundidade 1,4 m – 2,2 m!'
                  );
                }}
                className={`flex w-full items-center justify-between rounded-sm border-2 px-3 py-2 text-left font-dialog text-xs disabled:opacity-45 ${
                  sampleLabeled
                    ? 'border-emerald-400 bg-emerald-950/50 text-emerald-100'
                    : 'border-slate-700 bg-slate-900 text-slate-100 hover:border-cyan-400'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-amber-300" />
                  2. Etiquetar localização e profundidade
                </span>
                {sampleLabeled && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
              </button>

              <button
                type="button"
                disabled={!sampleLabeled}
                onClick={() => {
                  soundEngine.playSuccess();
                  updateMission3({ sampleStored: true });
                  onCapiFeedback(
                    'Amostra selada no recipiente científico térmico! Parte seguirá preservada para análise detalhada e outra irá ao nosso laboratório da base.'
                  );
                }}
                className={`flex w-full items-center justify-between rounded-sm border-2 px-3 py-2 text-left font-dialog text-xs disabled:opacity-45 ${
                  sampleStored
                    ? 'border-emerald-400 bg-emerald-950/50 text-emerald-100'
                    : 'border-slate-700 bg-slate-900 text-slate-100 hover:border-cyan-400'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <PackageCheck className="h-3.5 w-3.5 text-cyan-300" />
                  3. Armazenar em recipiente térmico científico
                </span>
                {sampleStored && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
              </button>

              <button
                type="button"
                disabled={!allSampleActionsDone}
                onClick={() => {
                  soundEngine.playClick();
                  onComplete();
                }}
                className="pixel-btn w-full bg-cyan-400 px-4 py-2.5 font-pixel text-[10px] text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {allSampleActionsDone
                  ? 'Levar Amostra ao Laboratório (Desafio 3.5) ▶'
                  : 'Complete as 3 ações da coleta acima'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
