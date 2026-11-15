import React, { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Drill,
  GripHorizontal,
  PackageCheck,
  RotateCcw,
  Snowflake,
  Sparkles,
  Tag,
} from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import {
  DrillHeatControl,
  getGeologicalLayerInfo,
} from '../../components/minigames/DrillHeatControl';
import { DustScrubCanvas } from '../../components/minigames/DustScrubCanvas';
import { AstronautAvatar } from '../../components/permanent/AstronautAvatar';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

interface Step2DrillAndSampleProps {
  onComplete: () => void;
  onCapiFeedback: (line: string) => void;
}

interface DraggingCoreState {
  startX: number;
  startY: number;
  x: number;
  y: number;
  moved: boolean;
}

export const Step2DrillAndSample: React.FC<Step2DrillAndSampleProps> = ({
  onComplete,
  onCapiFeedback,
}) => {
  const { state, updateMission3 } = useGameStore();
  const { drillDepthStep, sampleExtracted, sampleLabeled, sampleStored } = state.mission3;

  const [liveDepthM, setLiveDepthM] = useState<number>(0);
  const [resetNonce, setResetNonce] = useState<number>(0);
  const [scrubPct, setScrubPct] = useState<number>(0);
  const [draggingCore, setDraggingCore] = useState<DraggingCoreState | null>(null);
  const [hoverVault, setHoverVault] = useState<boolean>(false);

  const hasInitializedRef = useRef(false);

  // Garante que o Desafio 3.3 & 3.4 sempre comece obrigatoriamente em 0,0 m (sem vir pré-concluído)
  useEffect(() => {
    if (hasInitializedRef.current) return;
    hasInitializedRef.current = true;

    if (!state.mission3.waterApproved) {
      setLiveDepthM(0);
      setScrubPct(0);
      setResetNonce((n) => n + 1);
      updateMission3({
        drillDepthStep: 0,
        sampleExtracted: false,
        sampleLabeled: false,
        sampleStored: false,
      });
    } else {
      setLiveDepthM(drillDepthStep >= 3 ? 2.2 : 0);
      setScrubPct(sampleExtracted ? 100 : 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRestartDrill = () => {
    soundEngine.playClick();
    setLiveDepthM(0);
    setScrubPct(0);
    setResetNonce((n) => n + 1);
    updateMission3({
      drillDepthStep: 0,
      sampleExtracted: false,
      sampleLabeled: false,
      sampleStored: false,
    });
    onCapiFeedback(
      'Perfuradora recalibrada em 0,0 m! Segure o botão para perfurar e lembre de pulsar na camada rochosa (0,8 m – 1,5 m).'
    );
  };

  const handleStepReached = (step: 1 | 2 | 3) => {
    updateMission3({ drillDepthStep: step });

    if (step === 1) {
      soundEngine.playLaunchRumble();
      onCapiFeedback(
        '0,8 m! Entramos na Camada Rochosa Densa: o atrito aumenta muito aqui! Solte o botão por 1–2 segundos sempre que a barra aquecer.'
      );
    } else if (step === 2) {
      soundEngine.playLaunchRumble();
      onCapiFeedback(
        '1,5 m ultrapassados! Saímos da rocha dura e já detectamos cristais de gelo puro. Continue até 2,2 m!'
      );
    } else {
      setLiveDepthM(2.2);
      setScrubPct(0);
      soundEngine.playSuccess();
      onCapiFeedback(
        '2,2 m atingidos e Ice Core extraído! Agora no Desafio 3.4: esfregue para limpar o regolito do cilindro e depois arraste-o para o Recipiente Criogênico!'
      );
    }
  };

  const handleDrillOverheat = () => {
    onCapiFeedback(
      'Superaquecimento (100%)! A broca travou por 2,5 segundos para segurança. Pulse o botão segurando e soltando em vez de segurar direto na camada rochosa!'
    );
  };

  const handleCoreScrubComplete = () => {
    if (sampleExtracted) return;
    soundEngine.playSuccess();
    setScrubPct(100);
    updateMission3({
      sampleExtracted: true,
      sampleLabeled: true,
    });
    onCapiFeedback(
      'Regolito removido com perfeição! O cilindro revelou gelo azul-ciano puro (etiqueta ARCADIA-SOL2-GAMA). Agora arraste o cilindro limpo para dentro do Recipiente Criogênico (-73 °C)!'
    );
  };

  const sealSampleInCryoVault = () => {
    if (!sampleExtracted || sampleStored) return;
    soundEngine.playSuccess();
    updateMission3({
      sampleExtracted: true,
      sampleLabeled: true,
      sampleStored: true,
    });
    onCapiFeedback(
      'Selo criogênico (-73 °C) ativado com sucesso! Amostra preservada — clique em "Levar Amostra ao Laboratório (3.5)" para analisar a água!'
    );
  };

  // Drag & Drop do cilindro de gelo limpo para o Recipiente Térmico Científico
  useEffect(() => {
    if (!draggingCore) return;

    const handleMove = (e: PointerEvent) => {
      const moved =
        draggingCore.moved ||
        Math.hypot(e.clientX - draggingCore.startX, e.clientY - draggingCore.startY) > 8;

      setDraggingCore((prev) =>
        prev ? { ...prev, x: e.clientX, y: e.clientY, moved } : null
      );

      const el = document.elementFromPoint(e.clientX, e.clientY);
      const vault = el?.closest('[data-cryo-vault="true"]');
      setHoverVault(Boolean(vault));
    };

    const handleUp = (e: PointerEvent) => {
      const current = draggingCore;
      setDraggingCore(null);
      setHoverVault(false);

      if (!current.moved) {
        // Toque rápido também permite encaixar após limpo
        sealSampleInCryoVault();
        return;
      }

      const el = document.elementFromPoint(e.clientX, e.clientY);
      const vault = el?.closest('[data-cryo-vault="true"]');
      if (vault) {
        sealSampleInCryoVault();
      } else {
        soundEngine.playAlert();
        onCapiFeedback(
          'Quase lá! Arraste o cilindro de gelo limpo até o Recipiente Criogênico (-73 °C) ao lado e solte dentro dele.'
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
  }, [draggingCore]);

  const startCoreDrag = (e: React.PointerEvent) => {
    if (!sampleExtracted || sampleStored) return;
    e.preventDefault();
    setDraggingCore({
      startX: e.clientX,
      startY: e.clientY,
      x: e.clientX,
      y: e.clientY,
      moved: false,
    });
  };

  const layer = getGeologicalLayerInfo(liveDepthM);
  const allSampleActionsDone = sampleExtracted && sampleLabeled && sampleStored;
  const drillBitDepthPct = Math.min(100, Math.round((liveDepthM / 2.2) * 100));

  return (
    <div className="space-y-4 pb-32">
      {/* Cabeçalho */}
      <div className="rounded-sm border-2 border-amber-500/50 bg-slate-900/90 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Drill className="h-4 w-4 text-amber-300" />
            <h2 className="font-pixel text-[11px] text-amber-200">
              DESAFIO 3.3 &amp; 3.4 — PERFURAÇÃO TÉRMICA &amp; BANCADA DO ICE CORE
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-pixel text-[9px] text-cyan-300">
              PROFUNDIDADE: {liveDepthM.toFixed(2).replace('.', ',')} m
            </span>
            <button
              type="button"
              onClick={handleRestartDrill}
              className="inline-flex items-center gap-1 rounded-sm border border-slate-700 bg-slate-950 px-2 py-1 font-dialog text-[11px] text-slate-300 hover:border-amber-400 hover:text-amber-200"
            >
              <RotateCcw className="h-3 w-3" />
              0,0 m
            </button>
          </div>
        </div>
      </div>

      {/* Fantasma flutuante ao arrastar o cilindro limpo */}
      {draggingCore && draggingCore.moved && (
        <div
          style={{
            left: draggingCore.x,
            top: draggingCore.y,
            transform: 'translate(-50%, -120%)',
          }}
          className="pointer-events-none fixed z-50 flex items-center gap-1.5 rounded-sm border-2 border-cyan-300 bg-slate-950/95 px-2.5 py-1 font-pixel text-[8px] text-cyan-200 shadow-xl"
        >
          <Snowflake className="h-4 w-4 text-cyan-300" />
          SOLTE NO RECIPIENTE (-73 °C)
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-[1.1fr_1.15fr]">
        {/* Cenário da Perfuradora + Corte Geológico Animado */}
        <div className="space-y-3">
          <div className="pixel-box relative aspect-video overflow-hidden bg-gradient-to-b from-orange-950 via-red-950 to-stone-950">
            {/* Corte estratigráfico no canto direito do cenário */}
            <div className="absolute right-2 top-2 bottom-2 z-10 flex w-24 flex-col overflow-hidden rounded-sm border-2 border-slate-700 bg-slate-950/90 text-[9px] font-dialog">
              <div className="flex-[8] border-b border-orange-700/60 bg-orange-900/55 px-1 py-0.5 text-orange-100">
                0,0m Regolito
              </div>
              <div className="flex-[7] border-b border-stone-500/70 bg-stone-700/70 px-1 py-0.5 text-stone-100">
                1,0m Rocha
              </div>
              <div className="flex-[7] bg-cyan-900/65 px-1 py-0.5 text-cyan-100">
                2,2m Gelo H₂O
              </div>

              {/* Haste animada da broca descendo pelas camadas */}
              <div
                style={{ height: `${drillBitDepthPct}%` }}
                className="pointer-events-none absolute left-1/2 top-0 w-1.5 -translate-x-1/2 bg-gradient-to-b from-amber-300 to-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-[height] duration-75"
              />
            </div>

            {/* Solo na base da cena */}
            <div className="absolute inset-x-0 bottom-0 h-14 border-t-4 border-orange-700 bg-gradient-to-b from-orange-900 to-cyan-950" />

            <div className="relative z-10 flex h-full items-end justify-start gap-4 px-4 pb-3 pr-28">
              <AstronautAvatar profile={state.astronaut} size="md" />

              <img
                src={ASSET_MANIFEST.drillRig.path}
                alt={ASSET_MANIFEST.drillRig.alt}
                className="pixel-art h-44 w-auto object-contain drop-shadow-[0_6px_14px_rgba(0,0,0,0.75)] sm:h-52"
              />
            </div>
          </div>

          {/* Telemetria instantânea */}
          <div className="rounded-sm border border-slate-700 bg-slate-900 p-3 font-dialog text-xs">
            <div className="flex items-center justify-between border-b border-slate-700 pb-1">
              <span className="font-pixel text-[9px] text-cyan-300">
                TELEMETRIA DE SUBSOLO (SETOR GAMA)
              </span>
              <span className="text-sky-300">
                {drillDepthStep === 3 ? '-73 °C' : liveDepthM >= 0.8 ? '-65 °C' : '-58 °C'}
              </span>
            </div>
            <p className="mt-1.5 font-bold text-amber-200">{layer.label}</p>
            <p className="text-slate-300">
              {drillDepthStep < 3
                ? layer.frictionNote
                : sampleStored
                ? 'Ice Core limpo, etiquetado (ARCADIA-SOL2-GAMA) e selado a -73 °C!'
                : 'Amostra de 2,2 m extraída! Realize a limpeza do regolito e o armazenamento criogênico ao lado.'}
            </p>
          </div>
        </div>

        {/* Coluna Direita: Mini-Game 3.3 (Perfuração) -> Mini-Game 3.4 (Esfregar + Drag & Drop) */}
        <div className="flex flex-col justify-between gap-3">
          {drillDepthStep < 3 ? (
            <DrillHeatControl
              drillDepthStep={drillDepthStep}
              resetNonce={resetNonce}
              onDepthChange={setLiveDepthM}
              onStepReached={handleStepReached}
              onOverheat={handleDrillOverheat}
            />
          ) : (
            <div className="space-y-3">
              {/* AÇÃO 1 DO MINI-GAME 3.4: Esfregar regolito do cilindro de gelo */}
              <div
                className={`rounded-sm border-2 p-3 transition ${
                  sampleExtracted
                    ? 'border-emerald-400 bg-emerald-950/35'
                    : 'border-cyan-500/60 bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-pixel text-[9px] text-amber-200">
                    1. SEPARAR REGOLITO DA AMOSTRA ({sampleExtracted ? '100%' : `${scrubPct}%`})
                  </span>
                  {sampleExtracted && (
                    <span className="flex items-center gap-1 rounded-xs bg-emerald-500/20 px-1.5 py-0.5 font-pixel text-[7px] text-emerald-300">
                      <Sparkles className="h-3 w-3" />
                      CRISTAIS PUROS
                    </span>
                  )}
                </div>

                <div className="mt-2.5 flex flex-col items-center gap-3 sm:flex-row">
                  <div
                    onPointerDown={sampleExtracted && !sampleStored ? startCoreDrag : undefined}
                    className={
                      sampleExtracted && !sampleStored
                        ? 'touch-none select-none cursor-grab active:cursor-grabbing rounded-sm ring-2 ring-cyan-400/80 ring-offset-2 ring-offset-slate-950 transition hover:scale-[1.02]'
                        : ''
                    }
                  >
                    <DustScrubCanvas
                      cleanImageSrc={ASSET_MANIFEST.iceCoreSample.path}
                      cleanImageAlt={ASSET_MANIFEST.iceCoreSample.alt}
                      activeDust={!sampleExtracted}
                      dustKey={resetNonce + 1}
                      onScrubProgress={setScrubPct}
                      onScrubComplete={handleCoreScrubComplete}
                    />
                  </div>

                  <div className="flex-1 space-y-2 font-dialog text-xs">
                    <p className="text-slate-200">
                      {!sampleExtracted
                        ? 'Esfregue com o mouse ou dedo sobre o cilindro ao lado para raspar a crosta de terra/regolito e revelar os cristais azul-ciano (90%+).'
                        : !sampleStored
                        ? 'Cilindro limpo e etiquetado! Agora ARRASTE o cilindro ao lado (ou toque abaixo) para dentro do Recipiente Criogênico!'
                        : 'Testemunho limpo e selado com sucesso!'}
                    </p>

                    <div className="h-2.5 w-full overflow-hidden rounded-sm border border-slate-700 bg-slate-950">
                      <div
                        style={{ width: `${sampleExtracted ? 100 : scrubPct}%` }}
                        className="h-full bg-cyan-400 transition-all duration-150"
                      />
                    </div>

                    {sampleExtracted && (
                      <div className="inline-flex items-center gap-1.5 rounded-sm border border-cyan-500/50 bg-slate-950 px-2 py-1 text-[11px] text-cyan-200">
                        <Tag className="h-3.5 w-3.5 text-amber-300" />
                        ARCADIA-SOL2-GAMA • -73 °C
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* AÇÃO 2 DO MINI-GAME 3.4: Armazenar no Recipiente Criogênico (Drag & Drop) */}
              <div
                data-cryo-vault="true"
                onClick={() => {
                  if (sampleExtracted && !sampleStored) {
                    sealSampleInCryoVault();
                  }
                }}
                className={`rounded-sm border-2 border-dashed p-3 transition ${
                  sampleStored
                    ? 'border-solid border-emerald-400 bg-emerald-950/45'
                    : hoverVault
                    ? 'border-cyan-300 bg-cyan-950/60 scale-[1.01]'
                    : sampleExtracted
                    ? 'cursor-pointer border-cyan-400/80 bg-slate-900 hover:bg-cyan-950/25'
                    : 'border-slate-700 bg-slate-950/60 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <PackageCheck
                      className={`h-5 w-5 ${
                        sampleStored ? 'text-emerald-300' : 'text-cyan-300'
                      }`}
                    />
                    <div>
                      <p className="font-pixel text-[9px] text-cyan-200">
                        2. RECIPIENTE TÉRMICO CRIOGÊNICO (-73 °C)
                      </p>
                      <p className="mt-0.5 font-dialog text-xs text-slate-300">
                        {sampleStored
                          ? 'Selo criogênico travado! Amostra segura para o laboratório.'
                          : sampleExtracted
                          ? 'Arraste e solte o cilindro de gelo limpo aqui (ou toque para encaixar e selar)'
                          : 'Limpe o regolito do cilindro acima primeiro (90%+)'}
                      </p>
                    </div>
                  </div>

                  {sampleStored ? (
                    <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-400" />
                  ) : sampleExtracted ? (
                    <GripHorizontal className="h-5 w-5 shrink-0 animate-pulse text-cyan-300" />
                  ) : null}
                </div>
              </div>

              <button
                type="button"
                disabled={!allSampleActionsDone}
                onClick={() => {
                  soundEngine.playClick();
                  onComplete();
                }}
                className="pixel-btn w-full bg-cyan-400 px-4 py-3 font-pixel text-[10px] text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {allSampleActionsDone
                  ? 'Levar Amostra ao Laboratório (3.5) ▶'
                  : 'Limpe o gelo (90%+) e sele no Recipiente Criogênico'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
