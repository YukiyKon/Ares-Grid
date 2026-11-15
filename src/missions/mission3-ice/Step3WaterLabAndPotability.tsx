import React, { useState } from 'react';
import {
  AlertTriangle,
  Beaker,
  CheckCircle2,
  Droplets,
  FlaskConical,
  ShieldCheck,
} from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

interface ProcessStepItem {
  key: 'separateSoil' | 'meltIce' | 'filterParticles' | 'treatWater';
  title: string;
  prereq?: 'separateSoil' | 'meltIce' | 'filterParticles';
  capiMsg: string;
}

const PROCESS_STEPS: ProcessStepItem[] = [
  {
    key: 'separateSoil',
    title: '1. Separar solo e pedregulhos',
    capiMsg: 'Partículas grossas de regolito separadas! Agora podemos derreter o gelo puro.',
  },
  {
    key: 'meltIce',
    title: '2. Derreter gelo em câmara controlada',
    prereq: 'separateSoil',
    capiMsg: 'Gelo derretido em água líquida! Mas ela ainda contém poeira fina em suspensão.',
  },
  {
    key: 'filterParticles',
    title: '3. Filtrar partículas em suspensão',
    prereq: 'meltIce',
    capiMsg: 'Filtração física concluída! Porém, água transparente ainda pode ter contaminantes invisíveis.',
  },
  {
    key: 'treatWater',
    title: '4. Tratar água (ionização e UV)',
    prereq: 'filterParticles',
    capiMsg: 'Tratamento químico concluído! Agora abra os 5 testes do Painel de Potabilidade antes de beber.',
  },
];

interface PotabilityMetric {
  key: 'ph' | 'conductivity' | 'chemicals' | 'metals' | 'microbiology';
  label: string;
  reading: string;
}

const POTABILITY_METRICS: PotabilityMetric[] = [
  {
    key: 'ph',
    label: 'pH da Água',
    reading: '7,1 — Neutro ideal (critério: 6,5 a 8,5)',
  },
  {
    key: 'conductivity',
    label: 'Condutividade / Sais',
    reading: '180 µS/cm — Concentração segura',
  },
  {
    key: 'chemicals',
    label: 'Contaminantes Químicos',
    reading: '0,00 mg/L — Percloratos removidos',
  },
  {
    key: 'metals',
    label: 'Metais Pesados',
    reading: 'Ausentes — Abaixo do limite',
  },
  {
    key: 'microbiology',
    label: 'Indicadores Microrganismos',
    reading: 'Ausentes — Esterilização aprovada',
  },
];

interface Step3WaterLabAndPotabilityProps {
  onComplete: () => void;
  onCapiFeedback: (line: string) => void;
}

export const Step3WaterLabAndPotability: React.FC<Step3WaterLabAndPotabilityProps> = ({
  onComplete,
  onCapiFeedback,
}) => {
  const { state, updateMission3, completeMission3WaterDiscovery } = useGameStore();
  const { processSteps, potabilityChecks } = state.mission3;
  const [safetyBlockedWarning, setSafetyBlockedWarning] = useState(false);

  const allProcessed =
    processSteps.separateSoil &&
    processSteps.meltIce &&
    processSteps.filterParticles &&
    processSteps.treatWater;

  const allPotabilityChecked =
    potabilityChecks.ph &&
    potabilityChecks.conductivity &&
    potabilityChecks.chemicals &&
    potabilityChecks.metals &&
    potabilityChecks.microbiology;

  const isWaterSafeToDrink = allProcessed && allPotabilityChecked;

  const handleRunProcess = (item: ProcessStepItem) => {
    soundEngine.playSuccess();
    setSafetyBlockedWarning(false);
    updateMission3({
      processSteps: {
        ...processSteps,
        [item.key]: true,
      },
    });
    onCapiFeedback(item.capiMsg);
  };

  const handleCheckMetric = (metric: PotabilityMetric) => {
    soundEngine.playClick();
    setSafetyBlockedWarning(false);
    updateMission3({
      potabilityChecks: {
        ...potabilityChecks,
        [metric.key]: true,
      },
    });
    onCapiFeedback(`Indicador verificado — ${metric.label}: ${metric.reading}.`);
  };

  const handleTryDrinkOrApprove = () => {
    if (!isWaterSafeToDrink) {
      soundEngine.playAlert();
      setSafetyBlockedWarning(true);
      onCapiFeedback(
        'Segurança em primeiro lugar! Uma água transparente pode conter sais ou contaminantes químicos invisíveis. Conclua o tratamento e verifique os 5 testes antes de beber!'
      );
      return;
    }

    soundEngine.playSuccess();
    completeMission3WaterDiscovery();
    onComplete();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-sm border-2 border-cyan-500/50 bg-slate-900/90 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-cyan-300" />
            <h2 className="font-pixel text-[11px] text-cyan-200">
              DESAFIO 3.5 & 3.6 — DERRETIMENTO, FILTRAGEM E TESTE DE POTABILIDADE
            </h2>
          </div>
          <span className="font-dialog text-xs text-slate-300">
            Processamento:{' '}
            {Object.values(processSteps).filter(Boolean).length}/4 • Potabilidade:{' '}
            {Object.values(potabilityChecks).filter(Boolean).length}/5
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.05fr_1.15fr]">
        {/* Bancada do laboratório de água */}
        <div className="space-y-3">
          <div className="pixel-box relative aspect-video overflow-hidden bg-slate-900">
            <img
              src={ASSET_MANIFEST.waterLabStation.path}
              alt={ASSET_MANIFEST.waterLabStation.alt}
              className="pixel-art h-full w-full object-cover"
            />
            <div className="absolute bottom-2 left-2 rounded-sm border border-cyan-400/70 bg-slate-950/90 px-2 py-1 font-pixel text-[8px] text-cyan-200">
              {isWaterSafeToDrink
                ? 'ÁGUA POTÁVEL APROVADA!'
                : allProcessed
                ? 'AGUARDANDO ANÁLISE DE POTABILIDADE'
                : 'PROCESSAMENTO EM ANDAMENTO'}
            </div>
          </div>

          {/* Tentativa precoce ou liberação final da água */}
          <div className="space-y-2 rounded-sm border-2 border-slate-800 bg-slate-900 p-3">
            {safetyBlockedWarning && (
              <div className="flex items-start gap-2 rounded-sm border-2 border-rose-400 bg-rose-950/70 p-2.5 font-dialog text-xs text-rose-100">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />
                <span>
                  <strong>Bloqueado pela Capi:</strong> Segurança em primeiro lugar! Termine as
                  4 etapas de processamento e aprove os 5 indicadores antes de liberar a água
                  para consumo.
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={handleTryDrinkOrApprove}
              className={`pixel-btn flex w-full items-center justify-center gap-2 px-3 py-2.5 font-pixel text-[10px] ${
                isWaterSafeToDrink
                  ? 'bg-emerald-400 text-slate-950 hover:bg-emerald-300'
                  : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
              }`}
            >
              <Droplets className="h-4 w-4" />
              {isWaterSafeToDrink
                ? 'Liberar Água Potável & Abastecer Base (100%) ▶'
                : 'Tentar Beber / Liberar Água Agora'}
            </button>
          </div>
        </div>

        {/* Etapas de processamento + Painel de potabilidade */}
        <div className="space-y-3">
          <div className="rounded-sm border border-slate-800 bg-slate-900 p-3">
            <span className="mb-2 flex items-center gap-1.5 font-pixel text-[9px] text-cyan-300">
              <Beaker className="h-3.5 w-3.5" />
              SEQUÊNCIA DE EXTRAÇÃO E PURIFICAÇÃO
            </span>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {PROCESS_STEPS.map((item) => {
                const done = processSteps[item.key];
                const enabled = !item.prereq || processSteps[item.prereq];
                return (
                  <button
                    key={item.key}
                    type="button"
                    disabled={!enabled}
                    onClick={() => handleRunProcess(item)}
                    className={`flex items-center justify-between gap-2 rounded-sm border-2 px-2.5 py-2 text-left font-dialog text-xs disabled:opacity-45 ${
                      done
                        ? 'border-emerald-400 bg-emerald-950/50 text-emerald-100'
                        : 'border-slate-700 bg-slate-950 text-slate-200 hover:border-cyan-400'
                    }`}
                  >
                    <span>{item.title}</span>
                    {done && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-sm border border-slate-800 bg-slate-900 p-3">
            <span className="mb-2 flex items-center gap-1.5 font-pixel text-[9px] text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" />
              PAINEL DE TESTE DE POTABILIDADE (VERIFIQUE OS 5 ITENS)
            </span>
            <div className="space-y-1.5">
              {POTABILITY_METRICS.map((metric) => {
                const checked = potabilityChecks[metric.key];
                return (
                  <button
                    key={metric.key}
                    type="button"
                    disabled={!allProcessed}
                    onClick={() => handleCheckMetric(metric)}
                    className={`flex w-full items-center justify-between gap-2 rounded-sm border px-2.5 py-1.5 text-left font-dialog text-xs disabled:opacity-45 ${
                      checked
                        ? 'border-emerald-400 bg-emerald-950/45 text-emerald-100'
                        : 'border-slate-700 bg-slate-950 text-slate-200 hover:border-emerald-400'
                    }`}
                  >
                    <div>
                      <span className="font-bold">{metric.label}: </span>
                      <span className="text-[11px] text-slate-300">
                        {checked ? metric.reading : 'Clique para analisar amostra'}
                      </span>
                    </div>
                    <CheckCircle2
                      className={`h-4 w-4 shrink-0 ${
                        checked ? 'text-emerald-400' : 'text-slate-600'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
