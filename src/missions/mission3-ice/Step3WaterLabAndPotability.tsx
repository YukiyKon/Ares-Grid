import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Beaker,
  CheckCircle2,
  Droplets,
  FlaskConical,
  Pipette,
  ShieldCheck,
  Sun,
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
    capiMsg: 'Tratamento iniciado! Agora arraste a Pipeta de Reagente para os 4 tubos e segure o Filtro UV antes de beber.',
  },
];

type PipetteTubeKey = 'ph' | 'conductivity' | 'chemicals' | 'metals';

interface PipetteTubeMetric {
  key: PipetteTubeKey;
  label: string;
  reading: string;
}

const PIPETTE_METRICS: PipetteTubeMetric[] = [
  {
    key: 'ph',
    label: 'pH da Água',
    reading: '7,1 — Neutro ideal (6,5 a 8,5)',
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
];

interface DraggingPipetteState {
  startX: number;
  startY: number;
  x: number;
  y: number;
  moved: boolean;
}

interface Step3WaterLabAndPotabilityProps {
  onComplete: () => void;
  onCapiFeedback: (line: string) => void;
}

export const Step3WaterLabAndPotability: React.FC<Step3WaterLabAndPotabilityProps> = ({
  onComplete,
  onCapiFeedback,
}) => {
  const {
    state,
    updateMission3,
    completeMission3WaterDiscovery,
    executeSurvivalStationAction,
  } = useGameStore();
  const isSurvival = state.gameMode === 'SURVIVAL_30';
  const { processSteps, potabilityChecks } = state.mission3;
  const [safetyBlockedWarning, setSafetyBlockedWarning] = useState(false);

  const [draggingPipette, setDraggingPipette] = useState<DraggingPipetteState | null>(null);
  const [hoveredTube, setHoveredTube] = useState<PipetteTubeKey | null>(null);

  const [uvProgress, setUvProgress] = useState<number>(potabilityChecks.microbiology ? 100 : 0);
  const [isHoldingUv, setIsHoldingUv] = useState(false);
  const uvProgressRef = useRef(uvProgress);
  const uvTimerRef = useRef<number | null>(null);
  const isHoldingUvRef = useRef(false);
  const lastUvSoundAtRef = useRef(0);
  const potabilityChecksRef = useRef(potabilityChecks);

  useEffect(() => {
    potabilityChecksRef.current = potabilityChecks;
  }, [potabilityChecks]);

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

  useEffect(() => {
    uvProgressRef.current = uvProgress;
  }, [uvProgress]);

  const stopUvTimer = () => {
    if (uvTimerRef.current !== null) {
      window.clearInterval(uvTimerRef.current);
      uvTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopUvTimer();
    };
  }, []);

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

  const applyPipetteToTube = (tubeKey: PipetteTubeKey) => {
    const metric = PIPETTE_METRICS.find((m) => m.key === tubeKey);
    if (!metric) return;
    soundEngine.playSuccess();
    setSafetyBlockedWarning(false);
    const nextChecks = {
      ...potabilityChecksRef.current,
      [tubeKey]: true,
    };
    potabilityChecksRef.current = nextChecks;
    updateMission3({
      potabilityChecks: nextChecks,
    });
    onCapiFeedback(`Reagente aplicado em "${metric.label}": ${metric.reading}.`);
  };

  // Arrastar Pipeta de Reagente (PointerEvents)
  useEffect(() => {
    if (!draggingPipette) return;

    const handleMove = (e: PointerEvent) => {
      const moved =
        draggingPipette.moved ||
        Math.hypot(e.clientX - draggingPipette.startX, e.clientY - draggingPipette.startY) > 6;

      setDraggingPipette((prev) =>
        prev ? { ...prev, x: e.clientX, y: e.clientY, moved } : null
      );

      const el = document.elementFromPoint(e.clientX, e.clientY);
      const tubeEl = el?.closest('[data-tube-key]') as HTMLElement | null;
      setHoveredTube((tubeEl?.dataset.tubeKey as PipetteTubeKey) ?? null);
    };

    const handleUp = (e: PointerEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const tubeEl = el?.closest('[data-tube-key]') as HTMLElement | null;
      const targetKey = tubeEl?.dataset.tubeKey as PipetteTubeKey | undefined;

      setDraggingPipette(null);
      setHoveredTube(null);

      if (targetKey && allProcessed) {
        applyPipetteToTube(targetKey);
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
  }, [draggingPipette, allProcessed]);

  const startPipetteDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!allProcessed) {
      soundEngine.playAlert();
      onCapiFeedback('Complete primeiro as 4 etapas de purificação acima antes de testar a água.');
      return;
    }
    e.preventDefault();
    setDraggingPipette({
      startX: e.clientX,
      startY: e.clientY,
      x: e.clientX,
      y: e.clientY,
      moved: false,
    });
  };

  // Segurar Filtro UV até 100%
  const startUvSterilizer = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!allProcessed || potabilityChecks.microbiology) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    isHoldingUvRef.current = true;
    setIsHoldingUv(true);

    uvTimerRef.current = window.setInterval(() => {
      const next = Math.min(100, uvProgressRef.current + 4);
      uvProgressRef.current = next;
      setUvProgress(next);

      const now = performance.now();
      if (now - lastUvSoundAtRef.current >= 120) {
        soundEngine.playChargePulse(next / 100);
        lastUvSoundAtRef.current = now;
      }

      if (next >= 100) {
        stopUvTimer();
        isHoldingUvRef.current = false;
        setIsHoldingUv(false);
        soundEngine.playSuccess();
        setSafetyBlockedWarning(false);
        const nextChecks = {
          ...potabilityChecksRef.current,
          microbiology: true,
        };
        potabilityChecksRef.current = nextChecks;
        updateMission3({
          potabilityChecks: nextChecks,
        });
        onCapiFeedback(
          'Esterilização UV 100% concluída! Indicadores de microrganismos zerados: água segura para consumo da tripulação!'
        );
      }
    }, 45);
  };

  const stopUvSterilizer = (e?: React.PointerEvent<HTMLButtonElement>) => {
    if (e) {
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // ignore
      }
    }
    if (!isHoldingUvRef.current) return;
    isHoldingUvRef.current = false;
    setIsHoldingUv(false);
    stopUvTimer();
  };

  const handleTryDrinkOrApprove = () => {
    if (!isWaterSafeToDrink) {
      soundEngine.playAlert();
      setSafetyBlockedWarning(true);
      onCapiFeedback(
        'Segurança em primeiro lugar! Uma água transparente pode conter sais ou microrganismos invisíveis. Conclua o tratamento, aplique a pipeta nos 4 tubos e finalize o Filtro UV!'
      );
      return;
    }

    soundEngine.playSuccess();
    if (isSurvival) {
      executeSurvivalStationAction('MISSION_3');
      return;
    }
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
              DESAFIO 3.5 & 3.6 — LABORATÓRIO TÁTIL: PIPETA & FILTRO UV
            </h2>
          </div>
          <span className="font-dialog text-xs text-slate-300">
            Processamento:{' '}
            {Object.values(processSteps).filter(Boolean).length}/4 • Potabilidade:{' '}
            {Object.values(potabilityChecks).filter(Boolean).length}/5
          </span>
        </div>
      </div>

      {/* Pipeta flutuante seguindo o cursor/dedo durante o arraste */}
      {draggingPipette && draggingPipette.moved && (
        <div
          style={{
            left: draggingPipette.x,
            top: draggingPipette.y,
            transform: 'translate(-50%, -120%)',
          }}
          className="pointer-events-none fixed z-50 flex items-center gap-1.5 rounded-sm border-2 border-cyan-300 bg-slate-950/95 px-2.5 py-1 font-pixel text-[8px] text-cyan-200 shadow-xl"
        >
          <Pipette className="h-4 w-4 text-cyan-300" />
          SOLTE NO TUBO
        </div>
      )}

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
                ? 'APLIQUE PIPETA + FILTRO UV'
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
                  4 etapas físicas, analise os 4 tubos com a pipeta e conclua 100% do Filtro UV.
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
                ? isSurvival
                  ? '💧 Abastecer Base (+35% Água Potável • -1 Turno) ▶'
                  : 'Liberar Água Potável & Abastecer Base (100%) ▶'
                : 'Tentar Beber / Liberar Água Agora'}
            </button>
          </div>
        </div>

        {/* Etapas de processamento + Bancada Tátil de Pipeta & UV */}
        <div className="space-y-3">
          <div className="rounded-sm border border-slate-800 bg-slate-900 p-3">
            <span className="mb-2 flex items-center gap-1.5 font-pixel text-[9px] text-cyan-300">
              <Beaker className="h-3.5 w-3.5" />
              1. SEQUÊNCIA DE EXTRAÇÃO E PURIFICAÇÃO
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

          {/* Bancada de Potabilidade: Pipeta Arrastável + Filtro UV */}
          <div className="rounded-sm border border-slate-800 bg-slate-900 p-3">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 font-pixel text-[9px] text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" />
                2. BANCADA DE POTABILIDADE (5 TESTES)
              </span>

              {/* Pipeta arrastável */}
              <div
                onPointerDown={startPipetteDrag}
                role="button"
                tabIndex={0}
                className={`touch-none select-none flex items-center gap-1.5 rounded-sm border-2 px-2.5 py-1 font-pixel text-[8px] transition ${
                  allProcessed
                    ? 'cursor-grab active:cursor-grabbing border-cyan-300 bg-cyan-950 text-cyan-100 hover:bg-cyan-900'
                    : 'cursor-not-allowed border-slate-700 bg-slate-950 text-slate-500 opacity-55'
                }`}
              >
                <Pipette className="h-3.5 w-3.5 text-cyan-300" />
                ARRASTE A PIPETA AOS TUBOS
              </div>
            </div>

            <div className="grid gap-1.5 sm:grid-cols-2">
              {PIPETTE_METRICS.map((metric) => {
                const checked = potabilityChecks[metric.key];
                const isHovered = hoveredTube === metric.key;
                return (
                  <button
                    key={metric.key}
                    data-tube-key={metric.key}
                    type="button"
                    disabled={!allProcessed}
                    onClick={() => applyPipetteToTube(metric.key)}
                    className={`flex items-center justify-between gap-2 rounded-sm border-2 px-2.5 py-2 text-left font-dialog text-xs transition disabled:opacity-45 ${
                      isHovered
                        ? 'border-cyan-300 bg-cyan-950/70 text-cyan-100 scale-[1.02]'
                        : checked
                        ? 'border-emerald-400 bg-emerald-950/45 text-emerald-100'
                        : 'border-slate-700 bg-slate-950 text-slate-200 hover:border-emerald-400'
                    }`}
                  >
                    <div>
                      <span className="block font-bold">{metric.label}</span>
                      <span className="text-[11px] text-slate-300">
                        {checked ? metric.reading : 'Solte a pipeta (ou toque)'}
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

            {/* 5º Item: Esterilizador UV Interativo */}
            <div className="mt-2.5 rounded-sm border border-purple-500/50 bg-slate-950/90 p-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-pixel text-[8px] text-purple-200">
                  <Sun className="h-3.5 w-3.5 text-purple-300" />
                  5. MICRORGANISMOS (ESTERILIZADOR UV)
                </span>
                <span className="font-dialog text-[11px] text-purple-200">
                  {potabilityChecks.microbiology
                    ? 'Ausentes (0 UFC/100mL)'
                    : `${uvProgress}% esterilizado`}
                </span>
              </div>

              <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-sm border border-slate-700 bg-slate-900">
                <div
                  style={{ width: `${potabilityChecks.microbiology ? 100 : uvProgress}%` }}
                  className={`h-full transition-[width] duration-75 ${
                    potabilityChecks.microbiology ? 'bg-emerald-400' : 'bg-purple-400'
                  }`}
                />
              </div>

              <button
                type="button"
                onPointerDown={startUvSterilizer}
                onPointerUp={stopUvSterilizer}
                onPointerLeave={stopUvSterilizer}
                onPointerCancel={stopUvSterilizer}
                disabled={!allProcessed || potabilityChecks.microbiology}
                className={`touch-none select-none pixel-btn mt-2 flex w-full items-center justify-center gap-2 px-3 py-2 font-pixel text-[9px] disabled:cursor-not-allowed disabled:opacity-45 ${
                  potabilityChecks.microbiology
                    ? 'bg-emerald-500/35 text-emerald-200'
                    : isHoldingUv
                    ? 'bg-purple-300 text-slate-950 shadow-[0_0_16px_rgba(192,132,252,0.75)]'
                    : 'bg-purple-400 text-slate-950 hover:bg-purple-300'
                }`}
              >
                <Sun className={`h-3.5 w-3.5 ${isHoldingUv ? 'animate-spin' : ''}`} />
                {potabilityChecks.microbiology
                  ? 'FILTRO UV APROVADO (100% ESTERILIZADO)'
                  : isHoldingUv
                  ? `IRRADIANDO UV... (${uvProgress}%)`
                  : '🔆 SEGURAR FILTRO UV (ATÉ 100%)'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
