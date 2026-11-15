import React from 'react';
import {
  AlertTriangle,
  BatteryCharging,
  CheckCircle2,
  ClipboardCheck,
  ShieldAlert,
  Wind,
} from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

interface DustStep {
  key:
    | 'checkPanel'
    | 'stopExternalAndReturn'
    | 'sealCompartmentsAndFilters'
    | 'protectGearAndBattery';
  title: string;
  detail: string;
  capiMsg: string;
  icon: React.ReactNode;
}

const DUST_PROTOCOL_STEPS: DustStep[] = [
  {
    key: 'checkPanel',
    title: '1. Consultar Painel Ambiental',
    detail: 'Identificar alerta de tempestade de poeira e queda da luminosidade solar no horizonte',
    capiMsg:
      'Alerta confirmado! Tempestades marcianas podem ser locais, regionais ou até globais — e reduzem a luz solar que chega aos painéis.',
    icon: <AlertTriangle className="h-4 w-4 text-amber-300" />,
  },
  {
    key: 'stopExternalAndReturn',
    title: '2. Interromper Atividades Externas',
    detail: 'Suspender caminhadas em Arcadia Planitia e retornar ao habitat com segurança',
    capiMsg:
      'Boa decisão, comandante! Sempre que há alerta de poeira ou ventos intensos, devemos interromper atividades externas e voltar ao habitat.',
    icon: <ShieldAlert className="h-4 w-4 text-orange-300" />,
  },
  {
    key: 'sealCompartmentsAndFilters',
    title: '3. Fechar Compartimentos e Verificar Filtros',
    detail: 'Vedar comportas e checar filtragem para impedir entrada de poeira fina nos sistemas',
    capiMsg:
      'Compartimentos vedados e filtros ativos! Partículas finas podem prejudicar equipamentos e o ar interno se não forem barradas.',
    icon: <ClipboardCheck className="h-4 w-4 text-cyan-300" />,
  },
  {
    key: 'protectGearAndBattery',
    title: '4. Proteger Equipamentos e Gerenciar Baterias',
    detail: 'Recolher sensores externos sensíveis e acionar economia de energia nas baterias',
    capiMsg:
      'Energia protegida! Durante a tempestade acompanhamos tudo de dentro do habitat mantendo apenas equipamentos essenciais nas baterias.',
    icon: <BatteryCharging className="h-4 w-4 text-emerald-300" />,
  },
];

interface Step1DustStormProtocolProps {
  onComplete: () => void;
  onCapiFeedback: (line: string) => void;
}

export const Step1DustStormProtocol: React.FC<Step1DustStormProtocolProps> = ({
  onComplete,
  onCapiFeedback,
}) => {
  const { state, updateMission5, updateStats } = useGameStore();
  const proto = state.mission5.dustProtocol;
  const doneCount = Object.values(proto).filter(Boolean).length;
  const allReady = doneCount === 4;

  const handleStep = (step: DustStep) => {
    const canExecute =
      step.key === 'checkPanel' ||
      (step.key === 'stopExternalAndReturn' && proto.checkPanel) ||
      (step.key === 'sealCompartmentsAndFilters' && proto.stopExternalAndReturn) ||
      (step.key === 'protectGearAndBattery' && proto.sealCompartmentsAndFilters);

    if (!canExecute && !proto[step.key]) {
      soundEngine.playAlert();
      onCapiFeedback(
        'Siga a sequência de segurança! Primeiro consulte o painel ambiental, depois retorne ao habitat, feche os filtros e então proteja as baterias.'
      );
      return;
    }

    soundEngine.playSuccess();
    updateMission5({
      dustProtocol: {
        ...proto,
        [step.key]: true,
      },
    });
    if (step.key === 'protectGearAndBattery') {
      updateStats({ energy: Math.max(45, Math.min(state.stats.energy, 70)) });
    }
    onCapiFeedback(step.capiMsg);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-sm border-2 border-orange-500/70 bg-orange-950/40 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-orange-300" />
            <h2 className="font-pixel text-[11px] text-orange-200">
              DESAFIO 5.1 — TEMPESTADE DE POEIRA (PROTOCOLO DE VEDAÇÃO)
            </h2>
          </div>
          <span className="animate-pulse rounded-sm border border-orange-400 bg-orange-500/20 px-2 py-0.5 font-pixel text-[8px] text-orange-200">
            ALERTA DE POEIRA • ETAPAS {doneCount}/4
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.05fr_1.15fr]">
        {/* Cenário visual da tempestade se aproximando + telemetria solar */}
        <div className="space-y-3">
          <div className="pixel-box-mars relative aspect-video overflow-hidden bg-orange-950">
            <img
              src={ASSET_MANIFEST.dustStormScene.path}
              alt={ASSET_MANIFEST.dustStormScene.alt}
              className="pixel-art h-full w-full object-cover"
            />
            <div className="absolute left-2 top-2 rounded-sm border border-orange-400 bg-slate-950/90 px-2 py-1 font-pixel text-[8px] text-orange-200">
              TEMPESTADE NO HORIZONTE • LUZ SOLAR: {allReady ? '32% (PROTEGIDO)' : '28% (CAINDO)'}
            </div>
            <div className="absolute bottom-2 right-2 rounded-sm border border-cyan-400/70 bg-slate-950/90 px-2 py-1 font-dialog text-[11px] text-cyan-200">
              Ref.: NASA Dust in the Wind
            </div>
          </div>

          <div className="rounded-sm border border-slate-800 bg-slate-900 p-3 font-dialog text-xs text-slate-200">
            <p>
              <strong className="text-orange-300">Por que agir rápido?</strong> A poeira
              suspensa bloqueia parte dos raios do Sol e pode se acumular sobre células
              fotovoltaicas e juntas mecânicas.
            </p>
          </div>
        </div>

        {/* Sequência interativa de 4 ações */}
        <div className="flex flex-col justify-between gap-2.5">
          {DUST_PROTOCOL_STEPS.map((step) => {
            const done = proto[step.key];
            return (
              <button
                key={step.key}
                type="button"
                onClick={() => handleStep(step)}
                className={`flex items-start justify-between gap-2 rounded-sm border-2 p-2.5 text-left transition ${
                  done
                    ? 'border-emerald-400 bg-emerald-950/50 text-emerald-100'
                    : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-orange-400'
                }`}
              >
                <div>
                  <p className="flex items-center gap-1.5 font-dialog text-xs font-bold">
                    {step.icon}
                    {step.title}
                  </p>
                  <p className="mt-1 font-dialog text-[11px] text-slate-300">
                    {step.detail}
                  </p>
                </div>
                <CheckCircle2
                  className={`mt-0.5 h-4 w-4 shrink-0 ${
                    done ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                />
              </button>
            );
          })}

          <button
            type="button"
            disabled={!allReady}
            onClick={() => {
              soundEngine.playSuccess();
              onComplete();
            }}
            className="pixel-btn mt-1 w-full bg-orange-400 px-4 py-2.5 font-pixel text-[10px] text-slate-950 hover:bg-orange-300 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {allReady
              ? 'Poeira Baixou — Inspecionar Painéis Solares (Desafio 5.2) ▶'
              : `Conclua o protocolo em ordem (${doneCount}/4)`}
          </button>
        </div>
      </div>
    </div>
  );
};
