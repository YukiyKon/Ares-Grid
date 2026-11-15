import React from 'react';
import {
  Activity,
  AlertOctagon,
  CheckCircle2,
  Droplets,
  Layers,
  Radio,
  ShieldCheck,
} from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { AstronautAvatar } from '../../components/permanent/AstronautAvatar';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

interface RadiationStep {
  key:
    | 'alertConsulted'
    | 'externalStopped'
    | 'enteredShieldedShelter'
    | 'shieldingVerified'
    | 'riskReducedAndReleased';
  title: string;
  detail: string;
  capiMsg: string;
  icon: React.ReactNode;
}

const RADIATION_STEPS: RadiationStep[] = [
  {
    key: 'alertConsulted',
    title: '1. Consultar Instrumentos de Radiação Solar',
    detail: 'Confirmar ejeção de massa coronal e elevação de partículas energéticas solares',
    capiMsg:
      'Alerta confirmado! Ao contrário da poeira visível, a radiação solar é invisível a olho nu — só sabemos por meio dos sensores!',
    icon: <Radio className="h-4 w-4 text-rose-300" />,
  },
  {
    key: 'externalStopped',
    title: '2. Interromper Tarefas Externas Imediatamente',
    detail: 'Recolher toda atividade em área aberta antes da chegada das partículas',
    capiMsg:
      'Tarefas externas encerradas! Nenhum astronauta deve ficar exposto na superfície durante tempestades de partículas solares.',
    icon: <AlertOctagon className="h-4 w-4 text-amber-300" />,
  },
  {
    key: 'enteredShieldedShelter',
    title: '3. Entrar no Abrigo Blindado (Água/H2O + Solo)',
    detail: 'Ir para o abrigo especial reforçado — não basta entrar em uma sala comum',
    capiMsg:
      'No abrigo blindado! Tanques de água (rica em hidrogênio) e camadas de solo marciano absorvem partículas energéticas muito melhor que paredes finas!',
    icon: <ShieldCheck className="h-4 w-4 text-cyan-300" />,
  },
  {
    key: 'shieldingVerified',
    title: '4. Confirmar Blindagem e Monitoramento Interno',
    detail: 'Verificar níveis internos de exposição e barreiras de água/regolito',
    capiMsg:
      'Sensores internos estáveis! O estudo NASA Real Martians explica como materiais ricos em hidrogênio e camadas de solo ajudam na proteção.',
    icon: <Layers className="h-4 w-4 text-emerald-300" />,
  },
  {
    key: 'riskReducedAndReleased',
    title: '5. Aguardar Redução do Risco e Liberar Protocolo',
    detail: 'Confirmar retorno da radiação externa ao nível seguro antes de sair',
    capiMsg:
      'Tempestade solar dissipada com segurança! Você diferenciou poeira visível de radiação invisível e protegeu a tripulação como um cientista!',
    icon: <Activity className="h-4 w-4 text-emerald-300" />,
  },
];

interface Step3SolarRadiationShelterProps {
  onComplete: () => void;
  onCapiFeedback: (line: string) => void;
}

export const Step3SolarRadiationShelter: React.FC<Step3SolarRadiationShelterProps> = ({
  onComplete,
  onCapiFeedback,
}) => {
  const { state, updateMission5 } = useGameStore();
  const rad = state.mission5.radiationProtocol;
  const doneCount = Object.values(rad).filter(Boolean).length;
  const allSafe = doneCount === 5;

  const radiationLevel = rad.riskReducedAndReleased
    ? { label: 'BAIXO (SEGURO)', pct: 18, color: 'bg-emerald-400 text-emerald-200' }
    : rad.enteredShieldedShelter
    ? { label: 'BLINDADO NO ABRIGO', pct: 32, color: 'bg-cyan-400 text-cyan-200' }
    : { label: 'ALTO — ALERTA SOLAR!', pct: 92, color: 'bg-rose-500 text-rose-200' };

  const handleAction = (step: RadiationStep) => {
    const canRun =
      step.key === 'alertConsulted' ||
      (step.key === 'externalStopped' && rad.alertConsulted) ||
      (step.key === 'enteredShieldedShelter' && rad.externalStopped) ||
      (step.key === 'shieldingVerified' && rad.enteredShieldedShelter) ||
      (step.key === 'riskReducedAndReleased' && rad.shieldingVerified);

    if (!canRun && !rad[step.key]) {
      soundEngine.playAlert();
      onCapiFeedback(
        'Siga o protocolo de emergência em ordem: monitore o alerta, pare saídas, entre no Abrigo Blindado e valide a queda do risco!'
      );
      return;
    }

    soundEngine.playSuccess();
    updateMission5({
      radiationProtocol: {
        ...rad,
        [step.key]: true,
      },
    });
    onCapiFeedback(step.capiMsg);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-sm border-2 border-rose-500/80 bg-rose-950/50 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertOctagon className="h-4 w-4 text-rose-300" />
            <h2 className="font-pixel text-[11px] text-rose-200">
              DESAFIO 5.3 — ALERTA DE ATIVIDADE SOLAR E RADIAÇÃO INVISÍVEL
            </h2>
          </div>
          <span
            className={`rounded-sm border px-2 py-0.5 font-pixel text-[8px] ${
              allSafe
                ? 'border-emerald-400 bg-emerald-950/70 text-emerald-200'
                : 'animate-pulse border-rose-400 bg-rose-900/70 text-rose-100'
            }`}
          >
            {radiationLevel.label} • {doneCount}/5
          </span>
        </div>

        {/* Barra de exposição à radiação */}
        <div className="mt-2.5 space-y-1">
          <div className="flex items-center justify-between font-dialog text-[11px] text-slate-200">
            <span>Monitor de Partículas Energéticas (Radiação Invisível):</span>
            <span>{radiationLevel.pct}% de pico</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-sm border border-slate-700 bg-slate-950">
            <div
              style={{ width: `${radiationLevel.pct}%` }}
              className={`h-full transition-all duration-500 ${radiationLevel.color.split(' ')[0]}`}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.05fr_1.15fr]">
        {/* Visual do Abrigo Blindado contra Radiação + nota científica NASA Real Martians */}
        <div className="space-y-3">
          <div className="pixel-box relative flex aspect-video items-end justify-center gap-4 overflow-hidden bg-gradient-to-b from-slate-950 via-red-950/60 to-stone-950 px-4 pb-3">
            <img
              src={ASSET_MANIFEST.radiationShelter.path}
              alt={ASSET_MANIFEST.radiationShelter.alt}
              className="pixel-art h-44 w-auto object-contain drop-shadow-[0_0_16px_rgba(34,211,238,0.35)] sm:h-52"
            />
            {!rad.enteredShieldedShelter ? (
              <div className="flex flex-col items-center">
                <AstronautAvatar profile={state.astronaut} size="md" />
                <span className="mt-1 rounded-sm bg-rose-950/90 px-1.5 py-0.5 font-pixel text-[7px] text-rose-200">
                  EM ALERTA EXTERNO
                </span>
              </div>
            ) : (
              <div className="mb-4 rounded-sm border-2 border-cyan-400 bg-cyan-950/90 px-2.5 py-1.5 text-center shadow-lg">
                <span className="block font-pixel text-[8px] text-cyan-200">
                  {state.astronaut.name}
                </span>
                <span className="font-dialog text-xs text-emerald-200">
                  ✓ Protegido no Abrigo
                </span>
              </div>
            )}
            <div className="absolute left-2 top-2 rounded-sm border border-cyan-400/60 bg-slate-950/90 px-2 py-0.5 font-pixel text-[8px] text-cyan-200">
              CAMADAS DE REGOLITO + H2O
            </div>
          </div>

          <div className="rounded-sm border-2 border-cyan-500/40 bg-slate-900 p-3 font-dialog text-xs text-slate-200">
            <p className="flex items-center gap-1.5 font-pixel text-[9px] text-cyan-300">
              <Droplets className="h-3.5 w-3.5" />
              POR QUE NÃO BASTA QUALQUER SALA COMUM?
            </p>
            <p className="mt-1.5 leading-relaxed">
              Diferente da poeira, a <strong>radiação espacial é invisível a olho nu</strong>.
              Paredes comuns não detêm partículas solares energéticas; a blindagem combina{' '}
              <strong>água/materiais ricos em hidrogênio</strong> e camadas de{' '}
              <strong>solo marciano</strong> (<em>NASA Real Martians</em>).
            </p>
          </div>
        </div>

        {/* 5 botões do protocolo de radiação */}
        <div className="flex flex-col justify-between gap-2">
          {RADIATION_STEPS.map((step) => {
            const done = rad[step.key];
            return (
              <button
                key={step.key}
                type="button"
                onClick={() => handleAction(step)}
                className={`flex items-start justify-between gap-2 rounded-sm border-2 p-2.5 text-left transition ${
                  done
                    ? 'border-emerald-400 bg-emerald-950/50 text-emerald-100'
                    : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-cyan-400'
                }`}
              >
                <div>
                  <p className="flex items-center gap-1.5 font-dialog text-xs font-bold">
                    {step.icon}
                    {step.title}
                  </p>
                  <p className="mt-0.5 font-dialog text-[11px] text-slate-300">
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
            disabled={!allSafe}
            onClick={() => {
              soundEngine.playSuccess();
              onComplete();
            }}
            className="pixel-btn mt-1 w-full bg-emerald-400 px-4 py-2.5 font-pixel text-[10px] text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {allSafe
              ? 'Risco Dissipado — Inspeção Pós-Tempestade (Desafio 5.4) ▶'
              : `Execute os 5 passos de proteção contra radiação (${doneCount}/5)`}
          </button>
        </div>
      </div>
    </div>
  );
};
