import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  BatteryCharging,
  CheckCircle2,
  ClipboardCheck,
  Lock,
  RotateCcw,
  ShieldAlert,
  Timer,
  Wind,
} from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

type HatchKey =
  | 'checkPanel'
  | 'stopExternalAndReturn'
  | 'sealCompartmentsAndFilters'
  | 'protectGearAndBattery';

interface HatchConfig {
  key: HatchKey;
  title: string;
  detail: string;
  capiMsg: string;
  icon: React.ReactNode;
}

const HATCHES: HatchConfig[] = [
  {
    key: 'checkPanel',
    title: '1. Trava do Painel Ambiental',
    detail: 'Isolar sensores externos antes da rajada de poeira',
    capiMsg:
      'Painel isolado! Tempestades marcianas reduzem drasticamente a luz solar que chega à base.',
    icon: <AlertTriangle className="h-4 w-4 text-amber-300" />,
  },
  {
    key: 'stopExternalAndReturn',
    title: '2. Escotilha de Acesso Externo',
    detail: 'Recolher equipe externa e vedar comporta principal',
    capiMsg:
      'Comporta principal vedada! Todos os astronautas estão seguros dentro do habitat pressurizado.',
    icon: <ShieldAlert className="h-4 w-4 text-orange-300" />,
  },
  {
    key: 'sealCompartmentsAndFilters',
    title: '3. Válvula dos Filtros HEPA/Poeira',
    detail: 'Selar dutos internos contra partículas finas de regolito',
    capiMsg:
      'Filtros vedados! Partículas microscópicas podem danificar eletrônicos e pulmões se entrarem.',
    icon: <ClipboardCheck className="h-4 w-4 text-cyan-300" />,
  },
  {
    key: 'protectGearAndBattery',
    title: '4. Chave de Economia de Baterias',
    detail: 'Transferir sistemas vitais para modo reserva protegido',
    capiMsg:
      'Baterias em modo protegido! A tempestade está passando sobre Arcadia Planitia sem afetar nossa equipe.',
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

  const [leverPct, setLeverPct] = useState<Record<HatchKey, number>>({
    checkPanel: 0,
    stopExternalAndReturn: 0,
    sealCompartmentsAndFilters: 0,
    protectGearAndBattery: 0,
  });
  const [draggingKey, setDraggingKey] = useState<HatchKey | null>(null);
  const [stormSeconds, setStormSeconds] = useState<number>(45);

  const trackRefs = useRef<Record<HatchKey, HTMLDivElement | null>>({
    checkPanel: null,
    stopExternalAndReturn: null,
    sealCompartmentsAndFilters: null,
    protectGearAndBattery: null,
  });
  const protoRef = useRef(proto);
  const hasInitRef = useRef(false);

  useEffect(() => {
    protoRef.current = proto;
  }, [proto]);

  // Garante início destravado para o mini-game de alavancas caso a missão não esteja finalizada
  useEffect(() => {
    if (hasInitRef.current) return;
    hasInitRef.current = true;

    if (!state.mission5.mission5Completed) {
      const resetProto = {
        checkPanel: false,
        stopExternalAndReturn: false,
        sealCompartmentsAndFilters: false,
        protectGearAndBattery: false,
      };
      protoRef.current = resetProto;
      updateMission5({ dustProtocol: resetProto });
      setLeverPct({
        checkPanel: 0,
        stopExternalAndReturn: 0,
        sealCompartmentsAndFilters: 0,
        protectGearAndBattery: 0,
      });
    } else {
      setLeverPct({
        checkPanel: proto.checkPanel ? 100 : 0,
        stopExternalAndReturn: proto.stopExternalAndReturn ? 100 : 0,
        sealCompartmentsAndFilters: proto.sealCompartmentsAndFilters ? 100 : 0,
        protectGearAndBattery: proto.protectGearAndBattery ? 100 : 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doneCount = Object.values(proto).filter(Boolean).length;
  const allReady = doneCount === 4;

  // Cronômetro regressivo de aproximação da tempestade
  useEffect(() => {
    if (allReady) return;

    const timer = window.setInterval(() => {
      setStormSeconds((prev) => {
        if (prev <= 1) {
          soundEngine.playAlert();
          onCapiFeedback(
            'A tempestade atingiu a janela externa! Arraste as travas restantes rapidamente até VEDADO!'
          );
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [allReady, onCapiFeedback]);

  const handleRestartHatches = () => {
    soundEngine.playClick();
    const resetProto = {
      checkPanel: false,
      stopExternalAndReturn: false,
      sealCompartmentsAndFilters: false,
      protectGearAndBattery: false,
    };
    protoRef.current = resetProto;
    updateMission5({ dustProtocol: resetProto });
    setLeverPct({
      checkPanel: 0,
      stopExternalAndReturn: 0,
      sealCompartmentsAndFilters: 0,
      protectGearAndBattery: 0,
    });
    setStormSeconds(45);
    onCapiFeedback('Escotilhas destravadas para simulado! Arraste cada alavanca até 100% (VEDADO).');
  };

  const lockHatch = (hatch: HatchConfig) => {
    soundEngine.playSuccess();
    setLeverPct((prev) => ({ ...prev, [hatch.key]: 100 }));
    const nextProto = {
      ...protoRef.current,
      [hatch.key]: true,
    };
    protoRef.current = nextProto;
    updateMission5({ dustProtocol: nextProto });
    if (hatch.key === 'protectGearAndBattery') {
      updateStats({ energy: Math.max(45, Math.min(state.stats.energy, 70)) });
    }
    onCapiFeedback(hatch.capiMsg);
  };

  const updateSliderFromClientX = (key: HatchKey, clientX: number) => {
    const trackEl = trackRefs.current[key];
    if (!trackEl) return;
    const rect = trackEl.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, Math.round(((clientX - rect.left) / Math.max(1, rect.width)) * 100)));

    setLeverPct((prev) => ({ ...prev, [key]: pct }));

    if (pct >= 84) {
      const hatch = HATCHES.find((h) => h.key === key);
      if (hatch && !protoRef.current[key]) {
        setDraggingKey(null);
        lockHatch(hatch);
      }
    }
  };

  useEffect(() => {
    if (!draggingKey) return;

    const handleMove = (e: PointerEvent) => {
      updateSliderFromClientX(draggingKey, e.clientX);
    };

    const handleUp = () => {
      const key = draggingKey;
      setDraggingKey(null);
      if (!protoRef.current[key]) {
        // Retorna alavanca se não chegou ao travamento
        setLeverPct((prev) => ({ ...prev, [key]: 0 }));
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
  }, [draggingKey]);

  const startHatchDrag = (hatch: HatchConfig, e: React.PointerEvent) => {
    if (proto[hatch.key]) return;
    e.preventDefault();
    setDraggingKey(hatch.key);
    updateSliderFromClientX(hatch.key, e.clientX);
  };

  return (
    <div className="space-y-4 pb-32">
      <div className="rounded-sm border-2 border-orange-500/70 bg-orange-950/40 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-orange-300" />
            <h2 className="font-pixel text-[11px] text-orange-200">
              DESAFIO 5.1 — VEDAÇÃO DE EMERGÊNCIA DO HABITAT (ESCOTILHAS)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 font-pixel text-[8px] ${
                allReady
                  ? 'border-emerald-400 bg-emerald-950/80 text-emerald-200'
                  : 'animate-pulse border-orange-400 bg-orange-500/20 text-orange-100'
              }`}
            >
              <Timer className="h-3 w-3" />
              {allReady ? 'HABITAT VEDADO!' : `TEMPESTADE EM ${stormSeconds}s • ${doneCount}/4`}
            </span>
            <button
              type="button"
              onClick={handleRestartHatches}
              className="inline-flex items-center gap-1 rounded-sm border border-slate-700 bg-slate-950 px-2 py-1 font-dialog text-[11px] text-slate-300 hover:border-orange-400"
            >
              <RotateCcw className="h-3 w-3" />
              Reiniciar
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
        {/* Janela externa com tempestade de poeira batendo */}
        <div className="space-y-3">
          <div className="pixel-box-mars relative aspect-video overflow-hidden bg-orange-950">
            <img
              src={ASSET_MANIFEST.dustStormScene.path}
              alt={ASSET_MANIFEST.dustStormScene.alt}
              className="pixel-art h-full w-full object-cover"
            />

            {/* Efeito de rajadas de poeira batendo na janela antes da vedação total */}
            {!allReady && (
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-orange-600/25 via-amber-500/15 to-orange-900/35 animate-pulse" />
            )}

            <div className="absolute left-2 top-2 rounded-sm border border-orange-400 bg-slate-950/90 px-2 py-1 font-pixel text-[8px] text-orange-200">
              {allReady
                ? 'ESCOTILHAS SELADAS • INTERNO SEGURO'
                : 'RAJADAS NA JANELA • VEDE AS 4 TRAVAS'}
            </div>
            <div className="absolute bottom-2 right-2 rounded-sm border border-cyan-400/70 bg-slate-950/90 px-2 py-1 font-dialog text-[11px] text-cyan-200">
              Ref.: NASA Dust in the Wind
            </div>
          </div>

          <div className="rounded-sm border border-slate-800 bg-slate-900 p-3 font-dialog text-xs text-slate-200">
            <p>
              <strong className="text-orange-300">Como vedar:</strong> deslize cada alavanca da
              esquerda (<strong>DESTRAVADO</strong>) até o final à direita (
              <strong>VEDADO</strong>) usando o mouse ou dedo antes da poeira fina invadir o
              habitat!
            </p>
          </div>
        </div>

        {/* 4 Escotilhas / Alavancas deslizáveis por arraste */}
        <div className="flex flex-col justify-between gap-2.5">
          {HATCHES.map((hatch) => {
            const locked = proto[hatch.key];
            const pct = locked ? 100 : leverPct[hatch.key];
            return (
              <div
                key={hatch.key}
                className={`rounded-sm border-2 p-2.5 transition ${
                  locked
                    ? 'border-emerald-400 bg-emerald-950/45'
                    : 'border-slate-700 bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="flex items-center gap-1.5 font-dialog text-xs font-bold text-slate-100">
                      {hatch.icon}
                      {hatch.title}
                    </p>
                    <p className="font-dialog text-[11px] text-slate-300">{hatch.detail}</p>
                  </div>
                  {locked ? (
                    <span className="inline-flex items-center gap-1 rounded-xs bg-emerald-500/25 px-2 py-0.5 font-pixel text-[8px] text-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      VEDADO
                    </span>
                  ) : (
                    <span className="rounded-xs bg-rose-500/20 px-2 py-0.5 font-pixel text-[8px] text-rose-200">
                      DESTRAVADO
                    </span>
                  )}
                </div>

                {/* Trilha arrastável da trava */}
                <div
                  ref={(el) => {
                    trackRefs.current[hatch.key] = el;
                  }}
                  onPointerDown={(e) => startHatchDrag(hatch, e)}
                  className={`touch-none select-none relative mt-2 h-8 w-full overflow-hidden rounded-sm border-2 ${
                    locked
                      ? 'border-emerald-400 bg-emerald-950/60'
                      : 'cursor-grab active:cursor-grabbing border-orange-400/70 bg-slate-950'
                  }`}
                >
                  <div
                    style={{ width: `${pct}%` }}
                    className={`h-full transition-[width] duration-75 ${
                      locked ? 'bg-emerald-500/50' : 'bg-orange-500/45'
                    }`}
                  />

                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-pixel text-[8px] text-slate-200">
                    {locked ? '🔒 TRAVA VEDADA (100%)' : 'ARRASTE A TRAVA ATÉ AQUI ▶▶▶'}
                  </span>

                  {/* Alavanca deslizante */}
                  {!locked && (
                    <div
                      style={{ left: `calc(${Math.min(86, pct)}% + 2px)` }}
                      className="pointer-events-none absolute top-0.5 bottom-0.5 flex w-10 items-center justify-center rounded-xs border-2 border-amber-200 bg-orange-400 font-pixel text-[8px] text-slate-950 shadow-md"
                    >
                      <Lock className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              </div>
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
              ? 'Poeira Baixou — Limpar Painéis Solares (Desafio 5.2) ▶'
              : `Arraste as 4 escotilhas até VEDADO (${doneCount}/4)`}
          </button>
        </div>
      </div>
    </div>
  );
};
