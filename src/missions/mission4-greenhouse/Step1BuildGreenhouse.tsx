import React from 'react';
import {
  BatteryCharging,
  CheckCircle2,
  Droplets,
  Hammer,
  Lightbulb,
  Shield,
  Wind,
} from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { AstronautAvatar } from '../../components/permanent/AstronautAvatar';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

interface SubsystemItem {
  key:
    | 'structure'
    | 'lighting'
    | 'climate'
    | 'irrigation'
    | 'connectedSolar'
    | 'connectedWater';
  title: string;
  detail: string;
  capiTip: string;
  icon: React.ReactNode;
}

const SUBSYSTEMS: SubsystemItem[] = [
  {
    key: 'structure',
    title: '1. Estrutura de Proteção (Domo)',
    detail: 'Cúpula transparente contra baixa pressão e frio externo',
    capiTip:
      'Estrutura instalada! O domo cria uma barreira segura contra a atmosfera fina e gelada de Marte.',
    icon: <Shield className="h-4 w-4 text-cyan-300" />,
  },
  {
    key: 'lighting',
    title: '2. Iluminação LED Controlada',
    detail: 'Painéis LED vermelhos e azuis para fotossíntese eficiente',
    capiTip:
      'LEDs ligados! Em Marte a luz solar é mais fraca que na Terra, então LEDs otimizados ajudam muito as folhas.',
    icon: <Lightbulb className="h-4 w-4 text-fuchsia-300" />,
  },
  {
    key: 'climate',
    title: '3. Ventilação e Controle Térmico',
    detail: 'Mantém temperatura amena (~22 °C) e ar circulando',
    capiTip:
      'Ventilação e aquecimento ativos! Plantas precisam de temperatura estável para germinar.',
    icon: <Wind className="h-4 w-4 text-emerald-300" />,
  },
  {
    key: 'irrigation',
    title: '4. Reservatório e Irrigação',
    detail: 'Tubulação fechada de distribuição e sensores de umidade',
    capiTip:
      'Irrigação pronta! Cada gota de água dentro da estufa será monitorada e reaproveitada.',
    icon: <Droplets className="h-4 w-4 text-sky-300" />,
  },
  {
    key: 'connectedSolar',
    title: '5. Conectar à Energia Solar (Missão 1)',
    detail: 'Alimenta LEDs e aquecedores pelos painéis fotovoltaicos',
    capiTip:
      'Conectada aos nossos painéis solares de Arcadia Planitia! Energia limpa garantida para o cultivo.',
    icon: <BatteryCharging className="h-4 w-4 text-amber-300" />,
  },
  {
    key: 'connectedWater',
    title: '6. Conectar à Água Potável (Missão 3)',
    detail: 'Abastece o tanque da estufa com a água purificada do gelo',
    capiTip:
      'Água conectada! Graças à Missão 3, temos reserva potável tratada pronta para nutrir nossas plantas.',
    icon: <Droplets className="h-4 w-4 text-cyan-300" />,
  },
];

interface Step1BuildGreenhouseProps {
  onComplete: () => void;
  onCapiFeedback: (line: string) => void;
}

export const Step1BuildGreenhouse: React.FC<Step1BuildGreenhouseProps> = ({
  onComplete,
  onCapiFeedback,
}) => {
  const { state, updateMission4 } = useGameStore();
  const subs = state.mission4.subsystems;
  const completedCount = Object.values(subs).filter(Boolean).length;
  const allReady = completedCount === 6;

  const handleInstall = (item: SubsystemItem) => {
    soundEngine.playSuccess();
    updateMission4({
      subsystems: {
        ...subs,
        [item.key]: true,
      },
    });
    onCapiFeedback(item.capiTip);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-sm border-2 border-emerald-500/50 bg-slate-900/90 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Hammer className="h-4 w-4 text-emerald-300" />
            <h2 className="font-pixel text-[11px] text-emerald-200">
              DESAFIO 4.1 — CONSTRUINDO E CONECTANDO A ESTUFA
            </h2>
          </div>
          <span className="font-pixel text-[9px] text-cyan-300">
            SUBSISTEMAS: {completedCount}/6
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.05fr_1.15fr]">
        {/* Domo da estufa sobre o solo de Marte */}
        <div className="pixel-box relative aspect-video overflow-hidden bg-gradient-to-b from-orange-950 via-red-950 to-stone-950">
          <div className="absolute inset-x-0 bottom-0 h-14 border-t-4 border-orange-800 bg-orange-950" />
          <div className="relative z-10 flex h-full items-end justify-around px-4 pb-3">
            <AstronautAvatar profile={state.astronaut} size="md" />
            <img
              src={ASSET_MANIFEST.greenhouseDome.path}
              alt={ASSET_MANIFEST.greenhouseDome.alt}
              className={`pixel-art h-48 w-auto object-contain transition duration-500 sm:h-56 ${
                subs.structure ? 'opacity-100 drop-shadow-[0_0_18px_rgba(52,211,153,0.45)]' : 'opacity-45 grayscale'
              }`}
            />
          </div>
          <div className="absolute left-2 top-2 rounded-sm border border-emerald-400/60 bg-slate-950/90 px-2 py-0.5 font-pixel text-[8px] text-emerald-200">
            {allReady ? 'ESTUFA INTEGRADA E ONLINE' : 'EM MONTAGEM NO HABITAT'}
          </div>
        </div>

        {/* Lista dos 6 passos de construção e conexão */}
        <div className="flex flex-col justify-between gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {SUBSYSTEMS.map((item) => {
              const done = subs[item.key];
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleInstall(item)}
                  className={`flex items-start justify-between gap-2 rounded-sm border-2 p-2.5 text-left transition ${
                    done
                      ? 'border-emerald-400 bg-emerald-950/50 text-emerald-100'
                      : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-emerald-400'
                  }`}
                >
                  <div>
                    <p className="flex items-center gap-1.5 font-dialog text-xs font-bold">
                      {item.icon}
                      {item.title}
                    </p>
                    <p className="mt-1 font-dialog text-[11px] text-slate-300">
                      {item.detail}
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
          </div>

          <button
            type="button"
            disabled={!allReady}
            onClick={() => {
              soundEngine.playSuccess();
              onComplete();
            }}
            className="pixel-btn w-full bg-emerald-400 px-4 py-2.5 font-pixel text-[10px] text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {allReady
              ? 'Escolher Métodos de Cultivo (Desafio 4.2) ▶'
              : `Instale e conecte todos os 6 itens (${completedCount}/6)`}
          </button>
        </div>
      </div>
    </div>
  );
};
