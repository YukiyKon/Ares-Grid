import React, { useEffect, useRef, useState } from 'react';
import {
  BatteryCharging,
  CheckCircle2,
  Droplets,
  Hammer,
  Lightbulb,
  PlugZap,
  RotateCcw,
  Shield,
  Sparkles,
  Wind,
} from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { AstronautAvatar } from '../../components/permanent/AstronautAvatar';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

type StructuralKey = 'structure' | 'lighting' | 'climate' | 'irrigation';
type EclssPortType = 'SOLAR' | 'WATER';

interface SubsystemItem {
  key: StructuralKey;
  title: string;
  detail: string;
  capiTip: string;
  icon: React.ReactNode;
}

const STRUCTURAL_SUBSYSTEMS: SubsystemItem[] = [
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
      'Irrigação pronta! Agora arraste o Cabo Amarelo de Energia Solar e o Tubo Azul de Água Potável até o Domo!',
    icon: <Droplets className="h-4 w-4 text-sky-300" />,
  },
];

interface DragWireState {
  port: EclssPortType;
  startX: number;
  startY: number;
  curX: number;
  curY: number;
  moved: boolean;
}

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

  const [dragWire, setDragWire] = useState<DragWireState | null>(null);
  const [hoveredPort, setHoveredPort] = useState<EclssPortType | null>(null);
  const [recentSparkPort, setRecentSparkPort] = useState<EclssPortType | null>(null);

  const boardRef = useRef<HTMLDivElement | null>(null);
  const subsRef = useRef(subs);
  const hasInitRef = useRef(false);

  useEffect(() => {
    subsRef.current = subs;
  }, [subs]);

  // Garante que o desafio de conexão por arraste não comece pré-concluído
  useEffect(() => {
    if (hasInitRef.current) return;
    hasInitRef.current = true;
    if (!state.mission4.mission4Completed) {
      updateMission4({
        subsystems: {
          ...subs,
          connectedSolar: false,
          connectedWater: false,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRestartConnections = () => {
    soundEngine.playClick();
    updateMission4({
      subsystems: {
        structure: false,
        lighting: false,
        climate: false,
        irrigation: false,
        connectedSolar: false,
        connectedWater: false,
      },
    });
    onCapiFeedback(
      'Bancada reiniciada! Monte os 4 subsistemas do domo e arraste os cabos de Energia Solar e Água Potável.'
    );
  };

  const handleInstallStructural = (item: SubsystemItem) => {
    soundEngine.playSuccess();
    const next = {
      ...subsRef.current,
      [item.key]: true,
    };
    subsRef.current = next;
    updateMission4({ subsystems: next });
    onCapiFeedback(item.capiTip);
  };

  const connectPort = (port: EclssPortType) => {
    const next = {
      ...subsRef.current,
      connectedSolar: port === 'SOLAR' ? true : subsRef.current.connectedSolar,
      connectedWater: port === 'WATER' ? true : subsRef.current.connectedWater,
    };
    subsRef.current = next;
    updateMission4({ subsystems: next });
    soundEngine.playSuccess();
    setRecentSparkPort(port);
    window.setTimeout(() => setRecentSparkPort(null), 900);

    if (port === 'SOLAR') {
      onCapiFeedback(
        'Faísca confirmada! Cabo amarelo de Energia Solar (Missão 1) encaixado no Domo da Estufa!'
      );
    } else {
      onCapiFeedback(
        'Fluxo hidráulico ativo! Tubo azul de Água Potável (Missão 3) conectado ao tanque ECLSS da estufa!'
      );
    }
  };

  useEffect(() => {
    if (!dragWire) return;

    const toBoardCoords = (clientX: number, clientY: number) => {
      const rect = boardRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return {
        x: Math.max(0, Math.min(rect.width, clientX - rect.left)),
        y: Math.max(0, Math.min(rect.height, clientY - rect.top)),
      };
    };

    const handleMove = (e: PointerEvent) => {
      const coords = toBoardCoords(e.clientX, e.clientY);
      const moved =
        dragWire.moved ||
        Math.hypot(coords.x - dragWire.startX, coords.y - dragWire.startY) > 6;

      setDragWire((prev) =>
        prev ? { ...prev, curX: coords.x, curY: coords.y, moved } : null
      );

      const el = document.elementFromPoint(e.clientX, e.clientY);
      const target = el?.closest('[data-eclss-port]') as HTMLElement | null;
      setHoveredPort((target?.dataset.eclssPort as EclssPortType) ?? null);
    };

    const handleUp = (e: PointerEvent) => {
      const current = dragWire;
      setDragWire(null);
      setHoveredPort(null);

      const el = document.elementFromPoint(e.clientX, e.clientY);
      const target = el?.closest('[data-eclss-port]') as HTMLElement | null;
      const targetPort = target?.dataset.eclssPort as EclssPortType | undefined;

      if (targetPort === current.port) {
        connectPort(current.port);
      } else if (targetPort && targetPort !== current.port) {
        soundEngine.playAlert();
        onCapiFeedback(
          current.port === 'SOLAR'
            ? 'Terminal errado! Arraste o cabo amarelo de Energia Solar até a entrada amarela (SOLAR) do Domo.'
            : 'Válvula errada! Arraste o tubo azul de Água Potável até a válvula azul (ÁGUA) do Domo.'
        );
      }
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };
  }, [dragWire]);

  const startWireDrag = (port: EclssPortType, e: React.PointerEvent) => {
    const alreadyDone = port === 'SOLAR' ? subs.connectedSolar : subs.connectedWater;
    if (alreadyDone) return;
    e.preventDefault();
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDragWire({
      port,
      startX: x,
      startY: y,
      curX: x,
      curY: y,
      moved: false,
    });
  };

  const completedCount = Object.values(subs).filter(Boolean).length;
  const allReady = completedCount === 6;

  return (
    <div className="space-y-4 pb-32">
      <div className="rounded-sm border-2 border-emerald-500/50 bg-slate-900/90 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Hammer className="h-4 w-4 text-emerald-300" />
            <h2 className="font-pixel text-[11px] text-emerald-200">
              DESAFIO 4.1 — MONTAGEM DO DOMO &amp; CONEXÃO ECLSS POR ARRASTE
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[9px] text-cyan-300">
              SUBSISTEMAS: {completedCount}/6
            </span>
            <button
              type="button"
              onClick={handleRestartConnections}
              className="inline-flex items-center gap-1 rounded-sm border border-slate-700 bg-slate-950 px-2 py-1 font-dialog text-[11px] text-slate-300 hover:border-emerald-400"
            >
              <RotateCcw className="h-3 w-3" />
              Reiniciar
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.05fr_1.15fr]">
        {/* Coluna Esquerda: Domo da estufa + Bancada de Conexão por Arraste */}
        <div className="space-y-3">
          <div className="pixel-box relative aspect-video overflow-hidden bg-gradient-to-b from-orange-950 via-red-950 to-stone-950">
            <div className="absolute inset-x-0 bottom-0 h-14 border-t-4 border-orange-800 bg-orange-950" />
            <div className="relative z-10 flex h-full items-end justify-around px-4 pb-3">
              <AstronautAvatar profile={state.astronaut} size="md" />
              <img
                src={ASSET_MANIFEST.greenhouseDome.path}
                alt={ASSET_MANIFEST.greenhouseDome.alt}
                className={`pixel-art h-44 w-auto object-contain transition duration-500 sm:h-52 ${
                  subs.structure
                    ? 'opacity-100 drop-shadow-[0_0_18px_rgba(52,211,153,0.45)]'
                    : 'opacity-45 grayscale'
                }`}
              />
            </div>
            <div className="absolute left-2 top-2 rounded-sm border border-emerald-400/60 bg-slate-950/90 px-2 py-0.5 font-pixel text-[8px] text-emerald-200">
              {allReady ? 'ESTUFA INTEGRADA E ONLINE' : 'CONECTE SOLAR + ÁGUA AO DOMO'}
            </div>
          </div>

          {/* Painel Interativo de Conexão de Cabos e Tubos ECLSS */}
          <div
            ref={boardRef}
            className="touch-none select-none relative overflow-hidden rounded-sm border-2 border-cyan-500/60 bg-slate-900 p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-pixel text-[9px] text-cyan-200">
                <PlugZap className="h-3.5 w-3.5 text-amber-300" />
                5 &amp; 6. ARRASTE OS CABOS E TUBOS ATÉ OS TERMINAIS DO DOMO
              </span>
            </div>

            {/* SVG dinâmico para cabos/tubos durante o arraste e após conectados */}
            <svg className="pointer-events-none absolute inset-0 h-full w-full">
              {subs.connectedSolar && (
                <line
                  x1="36%"
                  y1="43%"
                  x2="64%"
                  y2="43%"
                  stroke="#facc15"
                  strokeWidth="5"
                  strokeDasharray="8 5"
                />
              )}
              {subs.connectedWater && (
                <line
                  x1="36%"
                  y1="77%"
                  x2="64%"
                  y2="77%"
                  stroke="#38bdf8"
                  strokeWidth="5"
                  strokeDasharray="8 5"
                />
              )}
              {dragWire && dragWire.moved && (
                <line
                  x1={dragWire.startX}
                  y1={dragWire.startY}
                  x2={dragWire.curX}
                  y2={dragWire.curY}
                  stroke={dragWire.port === 'SOLAR' ? '#facc15' : '#38bdf8'}
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              )}
            </svg>

            <div className="relative z-10 grid grid-cols-2 gap-6 font-dialog text-xs">
              {/* Origens à esquerda (arrastáveis) */}
              <div className="space-y-2.5">
                <div
                  onPointerDown={(e) => startWireDrag('SOLAR', e)}
                  role="button"
                  tabIndex={0}
                  className={`touch-none select-none flex items-center justify-between gap-2 rounded-sm border-2 px-2.5 py-2 transition ${
                    subs.connectedSolar
                      ? 'border-amber-400 bg-amber-950/70 text-amber-100'
                      : 'cursor-grab active:cursor-grabbing border-amber-400/80 bg-slate-950 text-amber-200 hover:bg-amber-950/35'
                  }`}
                >
                  <span className="flex items-center gap-1.5 font-bold">
                    <BatteryCharging className="h-4 w-4 text-amber-300" />
                    Cabo Solar (480W)
                  </span>
                  <span className="h-3 w-3 rounded-full bg-amber-400 shadow-[0_0_8px_#facc15]" />
                </div>

                <div
                  onPointerDown={(e) => startWireDrag('WATER', e)}
                  role="button"
                  tabIndex={0}
                  className={`touch-none select-none flex items-center justify-between gap-2 rounded-sm border-2 px-2.5 py-2 transition ${
                    subs.connectedWater
                      ? 'border-sky-400 bg-sky-950/70 text-sky-100'
                      : 'cursor-grab active:cursor-grabbing border-sky-400/80 bg-slate-950 text-sky-200 hover:bg-sky-950/35'
                  }`}
                >
                  <span className="flex items-center gap-1.5 font-bold">
                    <Droplets className="h-4 w-4 text-sky-300" />
                    Tubo Água H₂O
                  </span>
                  <span className="h-3 w-3 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                </div>
              </div>

              {/* Conectores do Domo à direita (alvos de encaixe) */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  data-eclss-port="SOLAR"
                  onClick={() => {
                    if (!subs.connectedSolar) connectPort('SOLAR');
                  }}
                  className={`flex w-full items-center justify-between gap-2 rounded-sm border-2 border-dashed px-2.5 py-2 text-left transition ${
                    subs.connectedSolar
                      ? 'border-solid border-emerald-400 bg-emerald-950/60 text-emerald-100'
                      : hoveredPort === 'SOLAR' || dragWire?.port === 'SOLAR'
                      ? 'border-amber-300 bg-amber-950/50 text-amber-100 scale-[1.02]'
                      : 'border-amber-500/60 bg-slate-950 text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-1.5 font-bold">
                    <span className="h-3 w-3 rounded-full border-2 border-amber-300 bg-slate-900" />
                    Domo • Energia
                  </span>
                  {recentSparkPort === 'SOLAR' ? (
                    <Sparkles className="h-4 w-4 animate-ping text-amber-300" />
                  ) : subs.connectedSolar ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <span className="font-pixel text-[7px] text-amber-300">SOLTE</span>
                  )}
                </button>

                <button
                  type="button"
                  data-eclss-port="WATER"
                  onClick={() => {
                    if (!subs.connectedWater) connectPort('WATER');
                  }}
                  className={`flex w-full items-center justify-between gap-2 rounded-sm border-2 border-dashed px-2.5 py-2 text-left transition ${
                    subs.connectedWater
                      ? 'border-solid border-emerald-400 bg-emerald-950/60 text-emerald-100'
                      : hoveredPort === 'WATER' || dragWire?.port === 'WATER'
                      ? 'border-sky-300 bg-sky-950/50 text-sky-100 scale-[1.02]'
                      : 'border-sky-500/60 bg-slate-950 text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-1.5 font-bold">
                    <span className="h-3 w-3 rounded-full border-2 border-sky-300 bg-slate-900" />
                    Domo • Válvula H₂O
                  </span>
                  {recentSparkPort === 'WATER' ? (
                    <Sparkles className="h-4 w-4 animate-ping text-cyan-300" />
                  ) : subs.connectedWater ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <span className="font-pixel text-[7px] text-sky-300">SOLTE</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Os 4 subsistemas do domo + avanço */}
        <div className="flex flex-col justify-between gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {STRUCTURAL_SUBSYSTEMS.map((item) => {
              const done = subs[item.key];
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleInstallStructural(item)}
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

          <div className="rounded-sm border border-slate-800 bg-slate-900/80 p-3 font-dialog text-xs text-slate-300">
            Status da Integração ECLSS:{' '}
            <strong className={subs.connectedSolar ? 'text-amber-300' : 'text-slate-400'}>
              {subs.connectedSolar ? 'Solar Conectado (480W)' : 'Aguardando Cabo Solar'}
            </strong>{' '}
            •{' '}
            <strong className={subs.connectedWater ? 'text-sky-300' : 'text-slate-400'}>
              {subs.connectedWater ? 'Água Potável Ligada' : 'Aguardando Tubo H₂O'}
            </strong>
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
              : `Instale os 4 módulos e conecte Solar + Água ao lado (${completedCount}/6)`}
          </button>
        </div>
      </div>
    </div>
  );
};
