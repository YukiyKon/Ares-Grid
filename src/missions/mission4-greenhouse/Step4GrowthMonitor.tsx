import React, { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Droplets,
  RotateCcw,
  Sparkles,
  SprayCan,
  Sprout,
  Sun,
  Thermometer,
} from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import {
  type EnvSettingLevel,
  type TempSettingLevel,
  useGameStore,
} from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';
import { useLanguage } from '../../i18n/LanguageContext';
import { isMarsNight } from '../../modes/survival30/survivalTypes';

const GROWTH_LABELS: Record<0 | 1 | 2 | 3, { stage: string; height: string; roots: string }> = {
  0: {
    stage: 'Sementes Plantadas (Borrife para Germinar)',
    height: '2 cm',
    roots: 'Aguardando névoa nutritiva',
  },
  1: {
    stage: 'Broto em Crescimento (Borrife Mais)',
    height: '10 cm',
    roots: 'Raízes brancas jovens se expandindo',
  },
  2: {
    stage: 'Folhas Vigorosas (Rumo à Colheita)',
    height: '21 cm',
    roots: 'Rede radicular forte absorvendo nutrientes',
  },
  3: {
    stage: 'Colheita Madura! Toque nos 4 Frutos/Plantas!',
    height: '32 cm',
    roots: 'Crescimento completo sem estresse',
  },
};

type HarvestSlot = 'vegetable' | 'fruit' | 'grain' | 'ornamental';

interface MistParticle {
  id: number;
  x: number;
  y: number;
}

interface Step4GrowthMonitorProps {
  onComplete: () => void;
  onCapiFeedback: (line: string) => void;
}

export const Step4GrowthMonitor: React.FC<Step4GrowthMonitorProps> = ({
  onComplete,
  onCapiFeedback,
}) => {
  const { state, updateMission4, interactGreenhousePlot } = useGameStore();
  const { dict, tx } = useLanguage();
  const isSurvival = state.gameMode === 'SURVIVAL_30';
  const { envSettings, growthStage, selectedCrops } = state.mission4;

  const [mistPct, setMistPct] = useState(0);
  const [isSpraying, setIsSpraying] = useState(false);
  const [mistParticles, setMistParticles] = useState<MistParticle[]>([]);
  const [harvested, setHarvested] = useState<Record<HarvestSlot, boolean>>({
    vegetable: false,
    fruit: false,
    grain: false,
    ornamental: false,
  });

  const mistPctRef = useRef(0);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const lastSoundAtRef = useRef(0);
  const particleIdRef = useRef(0);
  const hasInitRef = useRef(false);

  const isBalanced =
    envSettings.light === 'IDEAL' &&
    envSettings.waterNutrient === 'IDEAL' &&
    envSettings.tempHumidity === 'IDEAL';

  // Garante que o desafio 4.4 comece do estágio 0 para jogar o borrifador e a colheita
  useEffect(() => {
    if (hasInitRef.current) return;
    hasInitRef.current = true;
    if (isSurvival || !state.mission4.mission4Completed) {
      mistPctRef.current = 0;
      setMistPct(0);
      setHarvested({
        vegetable: false,
        fruit: false,
        grain: false,
        ornamental: false,
      });
      updateMission4({ growthStage: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResetGrowth = () => {
    soundEngine.playClick();
    mistPctRef.current = 0;
    setMistPct(0);
    setHarvested({
      vegetable: false,
      fruit: false,
      grain: false,
      ornamental: false,
    });
    updateMission4({ growthStage: 0 });
    onCapiFeedback(
      'Estufa zerada no estágio de Sementes! Ajuste os 3 parâmetros para IDEAL e passe o borrifador sobre a bandeja.'
    );
  };

  const applyMistAtPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (growthStage >= 3) return;
    if (!isBalanced) {
      const now = performance.now();
      if (now - lastSoundAtRef.current > 600) {
        soundEngine.playAlert();
        lastSoundAtRef.current = now;
        onCapiFeedback(
          'Estresse vegetal detectado! Antes de borrifar a névoa nutritiva, ajuste Iluminação LED, Água/Nutrientes e Temperatura para o nível IDEAL.'
        );
      }
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const relX = Math.max(8, Math.min(92, ((e.clientX - rect.left) / Math.max(1, rect.width)) * 100));
    const relY = Math.max(12, Math.min(88, ((e.clientY - rect.top) / Math.max(1, rect.height)) * 100));

    let gain = 6;
    if (lastPosRef.current) {
      const movedDist = Math.hypot(
        e.clientX - lastPosRef.current.x,
        e.clientY - lastPosRef.current.y
      );
      if (movedDist < 3) return;
      gain = Math.min(12, Math.max(5, Math.round(movedDist / 3)));
    }
    lastPosRef.current = { x: e.clientX, y: e.clientY };

    const pid = ++particleIdRef.current;
    setMistParticles((prev) => [...prev.slice(-10), { id: pid, x: relX, y: relY }]);

    const now = performance.now();
    if (now - lastSoundAtRef.current >= 120) {
      soundEngine.playScrubGrain();
      lastSoundAtRef.current = now;
    }

    const nextMist = Math.min(100, mistPctRef.current + gain);
    mistPctRef.current = nextMist;
    setMistPct(nextMist);

    if (nextMist >= 100) {
      mistPctRef.current = 0;
      setMistPct(0);
      setIsSpraying(false);
      lastPosRef.current = null;
      soundEngine.playSuccess();

      const nextStage = Math.min(3, growthStage + 1) as 1 | 2 | 3;
      updateMission4({ growthStage: nextStage });

      if (nextStage === 1) {
        onCapiFeedback(
          'Germinação concluída (1/3)! Os primeiros brotos apareceram. Borrife novamente para nutrir o desenvolvimento das folhas!'
        );
      } else if (nextStage === 2) {
        onCapiFeedback(
          'Folhas vigorosas (2/3)! Continue passando o borrifador aeropônico até alcançar o estágio de Colheita (3/3)!'
        );
      } else {
        onCapiFeedback(
          'Estágio 3/3 alcançado — Colheita Pronta! Agora clique/toque diretamente sobre cada um dos 4 frutos e plantas maduros na bandeja para colher!'
        );
      }
    }
  };

  const handleSprayStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if (growthStage >= 3) return;
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setIsSpraying(true);
    lastPosRef.current = null;
    applyMistAtPointer(e);
  };

  const handleSprayMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isSpraying || growthStage >= 3) return;
    e.preventDefault();
    applyMistAtPointer(e);
  };

  const handleSprayEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isSpraying) return;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }
    setIsSpraying(false);
    lastPosRef.current = null;
  };

  const harvestCount = Object.values(harvested).filter(Boolean).length;
  const allHarvested = growthStage === 3 && harvestCount === 4;

  const handleHarvestCrop = (slot: HarvestSlot, label: string) => {
    if (harvested[slot]) return;
    soundEngine.playSuccess();
    const next = { ...harvested, [slot]: true };
    setHarvested(next);
    const total = Object.values(next).filter(Boolean).length;
    if (total < 4) {
      onCapiFeedback(`${label} colhido (${total}/4)! Toque nas plantas maduras restantes na bandeja.`);
    } else {
      onCapiFeedback(
        'Colheita marciana completa (4/4)! Todos os alimentos e flores foram colhidos saudáveis. Agora avance para integrar o sistema ECLSS!'
      );
    }
  };

  const info = GROWTH_LABELS[growthStage];

  const HARVEST_ITEMS: { slot: HarvestSlot; icon: string; name: string }[] = [
    { slot: 'vegetable', icon: '🥬', name: selectedCrops.vegetable ?? 'Alface' },
    { slot: 'fruit', icon: '🍓', name: selectedCrops.fruit ?? 'Morango' },
    { slot: 'grain', icon: '🌾', name: selectedCrops.grain ?? 'Trigo' },
    { slot: 'ornamental', icon: '🌸', name: selectedCrops.ornamental ?? 'Flores Ornamentais' },
  ];

  const nightNow = isMarsNight(state.survival.clockMinutes);
  const ledsOffAtNight = nightNow && !state.survival.breakers.greenhouseLeds;
  const rt = dict.survival.realtime;

  const cropStageImage = (stage: 'EMPTY' | 'SEED' | 'SPROUT' | 'GROWING' | 'MATURE') => {
    switch (stage) {
      case 'MATURE':
        return ASSET_MANIFEST.survivalCropMature.path;
      case 'GROWING':
        return ASSET_MANIFEST.survivalCropGrowing.path;
      case 'SPROUT':
        return ASSET_MANIFEST.survivalCropSprout.path;
      case 'SEED':
      case 'EMPTY':
      default:
        return ASSET_MANIFEST.survivalCropSeed.path;
    }
  };

  return (
    <div className="space-y-4 pb-32">
      {/* Estufa em Tempo Real Multi-Sol (2 a 3 Sols) no Modo Sobrevivência */}
      {isSurvival && (
        <div className="rounded-sm border-2 border-lime-400/75 bg-slate-950 p-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sprout className="h-4 w-4 text-lime-300" />
              <h2 className="font-pixel text-[10px] text-lime-200 sm:text-[11px]">
                {tx(
                  'LIVE HYDROPONIC TRAYS (2–3 SOL MATURATION)',
                  'BANDEJAS HIDROPÔNICAS AO VIVO (CRESCIMENTO EM 2–3 SOLS)'
                )}
              </h2>
            </div>
            {ledsOffAtNight && (
              <span className="rounded-sm border border-amber-400 bg-amber-950/70 px-2 py-0.5 font-dialog text-[11px] text-amber-200">
                💡 {rt.cropPausedLed}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {state.survival.greenhousePlots.map((plot) => {
              const pct = Math.min(
                100,
                Math.round((plot.growthHours / Math.max(1, plot.targetHours)) * 100)
              );
              const cropNames: Record<'LETTUCE' | 'STRAWBERRY' | 'WHEAT' | 'HERBS', string> = {
                LETTUCE: tx('Space Lettuce', 'Alface Espacial'),
                STRAWBERRY: tx('Mars Strawberries', 'Morango Marciano'),
                WHEAT: tx('Dwarf Wheat', 'Trigo Anão'),
                HERBS: tx('Medicinal Herbs', 'Ervas & Flores'),
              };
              const actionText =
                plot.stage === 'EMPTY'
                  ? rt.cropPlantAction
                  : plot.stage === 'MATURE'
                  ? rt.cropHarvestAction
                  : rt.cropTendAction;

              return (
                <div
                  key={plot.id}
                  className={`flex flex-col justify-between rounded-sm border-2 p-2 ${
                    plot.stage === 'MATURE'
                      ? 'border-amber-400 bg-amber-950/30'
                      : 'border-emerald-500/40 bg-slate-900'
                  }`}
                >
                  <div>
                    <img
                      src={cropStageImage(plot.stage)}
                      alt={cropNames[plot.cropKey]}
                      className={`pixel-art mb-1.5 h-20 w-full rounded-sm object-cover ${
                        plot.stage === 'EMPTY' ? 'opacity-35 grayscale' : ''
                      }`}
                    />
                    <p className="font-pixel text-[8px] text-cyan-200">
                      #{plot.id} {cropNames[plot.cropKey]}
                    </p>
                    <p className="mt-0.5 font-dialog text-[11px] text-emerald-200">
                      {rt.cropStage[plot.stage]}
                    </p>
                    {plot.stage !== 'EMPTY' && (
                      <div className="mt-1">
                        <div className="h-2 w-full overflow-hidden rounded-sm bg-slate-950">
                          <div
                            style={{ width: `${pct}%` }}
                            className={`h-full ${
                              plot.stage === 'MATURE' ? 'bg-amber-400' : 'bg-lime-400'
                            }`}
                          />
                        </div>
                        <span className="font-dialog text-[10px] text-slate-400">
                          {Math.floor(plot.growthHours)}h / {plot.targetHours}h ({pct}%)
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playSuccess();
                      interactGreenhousePlot(plot.id);
                    }}
                    className={`pixel-btn touch-none select-none mt-2 min-h-[38px] w-full px-2 py-1 font-dialog text-[11px] font-bold text-slate-950 ${
                      plot.stage === 'MATURE'
                        ? 'bg-amber-400 hover:bg-amber-300'
                        : 'bg-emerald-400 hover:bg-emerald-300'
                    }`}
                  >
                    {actionText}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-sm border-2 border-emerald-500/50 bg-slate-900/90 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sprout className="h-4 w-4 text-emerald-300" />
            <h2 className="font-pixel text-[11px] text-emerald-200">
              DESAFIO 4.4 — BORRIFADOR DE NÉVOA &amp; COLHEITA INTERATIVA
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[9px] text-cyan-300">
              ESTÁGIO: {growthStage}/3 {growthStage === 3 ? `• COLHEITA ${harvestCount}/4` : ''}
            </span>
            <button
              type="button"
              onClick={handleResetGrowth}
              className="inline-flex items-center gap-1 rounded-sm border border-slate-700 bg-slate-950 px-2 py-1 font-dialog text-[11px] text-slate-300 hover:border-emerald-400"
            >
              <RotateCcw className="h-3 w-3" />
              Reiniciar
            </button>
          </div>
        </div>

        <div className="mt-2 h-3 w-full overflow-hidden rounded-sm border border-slate-700 bg-slate-950">
          <div
            style={{ width: `${Math.max(10, Math.round((growthStage / 3) * 100))}%` }}
            className={`h-full transition-all duration-300 ${
              isBalanced ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.05fr_1.15fr]">
        {/* Coluna Esquerda: Bandeja Interativa (Borrifar nos estágios 0-2, Colher no estágio 3) */}
        <div className="space-y-3">
          {growthStage < 3 ? (
            <div className="space-y-2">
              <div
                data-mist-zone="true"
                onPointerDown={handleSprayStart}
                onPointerMove={handleSprayMove}
                onPointerUp={handleSprayEnd}
                onPointerCancel={handleSprayEnd}
                className={`touch-none select-none pixel-box relative flex aspect-video items-center justify-center overflow-hidden bg-slate-900 p-4 ${
                  isBalanced ? 'cursor-crosshair' : 'cursor-not-allowed'
                }`}
              >
                <img
                  src={ASSET_MANIFEST.marsCropsTray.path}
                  alt={ASSET_MANIFEST.marsCropsTray.alt}
                  draggable={false}
                  className="pixel-art pointer-events-none select-none transition-transform duration-500"
                  style={{ transform: `scale(${0.68 + growthStage * 0.14})` }}
                />

                {/* Partículas animadas de névoa nutritiva */}
                {mistParticles.map((p) => (
                  <div
                    key={p.id}
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    className="pointer-events-none absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-cyan-300/45"
                  />
                ))}

                {/* Badge do borrifador */}
                <div className="pointer-events-none absolute right-2 top-2 flex items-center gap-1.5 rounded-sm border border-cyan-400/80 bg-slate-950/90 px-2 py-1 font-pixel text-[8px] text-cyan-200">
                  <SprayCan className="h-3.5 w-3.5 text-cyan-300" />
                  {isSpraying ? 'BORRIFANDO NÉVOA...' : 'PASSE O DEDO/MOUSE AQUI'}
                </div>

                <div className="pointer-events-none absolute bottom-2 left-2 rounded-sm border border-emerald-400/70 bg-slate-950/90 px-2 py-0.5 font-pixel text-[8px] text-emerald-200">
                  {info.stage}
                </div>
              </div>

              {/* Barra da névoa aplicada no estágio atual */}
              <div className="rounded-sm border border-cyan-500/40 bg-slate-900 p-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-pixel text-[8px] text-cyan-300">
                    NÉVOA NUTRITIVA (ESTÁGIO {growthStage + 1}/3)
                  </span>
                  <span className="font-pixel text-[9px] text-emerald-300">{mistPct}%</span>
                </div>
                <div className="mt-1.5 h-3 w-full overflow-hidden rounded-sm border border-slate-700 bg-slate-950">
                  <div
                    style={{ width: `${mistPct}%` }}
                    className="h-full bg-cyan-400 transition-[width] duration-75"
                  />
                </div>
                <p className="mt-1 font-dialog text-[11px] text-slate-300">
                  Com os 3 controles ao lado em <strong>IDEAL</strong>, arraste sobre as folhas na
                  bandeja acima até atingir 100% para avançar o crescimento.
                </p>
              </div>
            </div>
          ) : (
            /* Estágio 3/3: Colheita interativa clicando/tocando nos frutos/vegetais maduros */
            <div className="pixel-box space-y-3 bg-slate-900 p-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-pixel text-[9px] text-emerald-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  COLHEITA MADURA! TOQUE NOS 4 ITENS PARA COLHER:
                </span>
                <span className="font-pixel text-[9px] text-amber-300">{harvestCount}/4</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {HARVEST_ITEMS.map((item) => {
                  const done = harvested[item.slot];
                  return (
                    <button
                      key={item.slot}
                      type="button"
                      onClick={() => handleHarvestCrop(item.slot, item.name)}
                      className={`touch-none select-none flex flex-col items-center justify-center rounded-sm border-2 p-3 text-center transition ${
                        done
                          ? 'border-emerald-400 bg-emerald-950/50 text-emerald-200'
                          : 'cursor-pointer border-amber-300 bg-slate-950 text-amber-100 hover:scale-[1.03] hover:bg-amber-950/35 shadow-[0_0_12px_rgba(251,191,36,0.2)]'
                      }`}
                    >
                      <span className="text-2xl">{done ? '🧺' : item.icon}</span>
                      <span className="mt-1 font-dialog text-xs font-bold">{item.name}</span>
                      <span className="mt-0.5 font-pixel text-[7px]">
                        {done ? '✓ COLHIDO' : 'TOCAR PARA COLHER'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="rounded-sm border border-slate-800 bg-slate-900 p-3 font-dialog text-xs text-slate-200">
            <p>
              <strong>Altura média:</strong> {info.height} • <strong>Raízes:</strong>{' '}
              {info.roots}
            </p>
            <p className="mt-1">
              <strong>Saúde vegetal:</strong>{' '}
              {isBalanced ? (
                <span className="text-emerald-300">Ambiente equilibrado sem estresse!</span>
              ) : (
                <span className="text-amber-300">
                  Ajuste Luz, Água/Nutrientes e Temperatura ao lado para IDEAL antes de borrifar!
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Coluna Direita: Painel Ambiental + Avanço */}
        <div className="flex flex-col justify-between gap-3">
          <div className="space-y-2.5">
            {/* Luz LED */}
            <div className="rounded-sm border border-slate-800 bg-slate-900 p-2.5">
              <span className="mb-1.5 flex items-center gap-1.5 font-pixel text-[9px] text-fuchsia-300">
                <Sun className="h-3.5 w-3.5" />
                ILUMINAÇÃO LED
              </span>
              <div className="grid grid-cols-3 gap-1.5 font-dialog text-xs">
                {(
                  [
                    ['LOW', 'Fraca'],
                    ['IDEAL', 'Ideal (16h)'],
                    ['HIGH', 'Excesso'],
                  ] as [EnvSettingLevel, string][]
                ).map(([lvl, label]) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      updateMission4({ envSettings: { ...envSettings, light: lvl } });
                    }}
                    className={`min-h-[40px] rounded-sm border px-1.5 py-1.5 text-[11px] sm:px-2 sm:text-xs ${
                      envSettings.light === lvl
                        ? lvl === 'IDEAL'
                          ? 'border-emerald-400 bg-emerald-950/70 text-emerald-100'
                          : 'border-amber-400 bg-amber-950/70 text-amber-100'
                        : 'border-slate-700 bg-slate-950 text-slate-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Água e Nutrientes */}
            <div className="rounded-sm border border-slate-800 bg-slate-900 p-2.5">
              <span className="mb-1.5 flex items-center gap-1.5 font-pixel text-[9px] text-cyan-300">
                <Droplets className="h-3.5 w-3.5" />
                ÁGUA E NUTRIENTES
              </span>
              <div className="grid grid-cols-3 gap-1.5 font-dialog text-xs">
                {(
                  [
                    ['LOW', 'Seca'],
                    ['IDEAL', 'Equilibrada'],
                    ['HIGH', 'Encharcada'],
                  ] as [EnvSettingLevel, string][]
                ).map(([lvl, label]) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      updateMission4({
                        envSettings: { ...envSettings, waterNutrient: lvl },
                      });
                    }}
                    className={`min-h-[40px] rounded-sm border px-1.5 py-1.5 text-[11px] sm:px-2 sm:text-xs ${
                      envSettings.waterNutrient === lvl
                        ? lvl === 'IDEAL'
                          ? 'border-emerald-400 bg-emerald-950/70 text-emerald-100'
                          : 'border-amber-400 bg-amber-950/70 text-amber-100'
                        : 'border-slate-700 bg-slate-950 text-slate-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Temperatura e Umidade */}
            <div className="rounded-sm border border-slate-800 bg-slate-900 p-2.5">
              <span className="mb-1.5 flex items-center gap-1.5 font-pixel text-[9px] text-amber-300">
                <Thermometer className="h-3.5 w-3.5" />
                TEMPERATURA E UMIDADE
              </span>
              <div className="grid grid-cols-3 gap-1.5 font-dialog text-xs">
                {(
                  [
                    ['COLD', 'Fria (8 °C)'],
                    ['IDEAL', 'Ideal (22 °C)'],
                    ['HOT', 'Quente (36 °C)'],
                  ] as [TempSettingLevel, string][]
                ).map(([lvl, label]) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      updateMission4({
                        envSettings: { ...envSettings, tempHumidity: lvl },
                      });
                    }}
                    className={`min-h-[40px] rounded-sm border px-1.5 py-1.5 text-[11px] sm:px-2 sm:text-xs ${
                      envSettings.tempHumidity === lvl
                        ? lvl === 'IDEAL'
                          ? 'border-emerald-400 bg-emerald-950/70 text-emerald-100'
                          : 'border-amber-400 bg-amber-950/70 text-amber-100'
                        : 'border-slate-700 bg-slate-950 text-slate-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {!isBalanced && growthStage < 3 && (
            <div className="flex items-center gap-2 rounded-sm border border-amber-500/60 bg-amber-950/50 px-2.5 py-2 font-dialog text-xs text-amber-200">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Ajuste os 3 parâmetros para Ideal antes de usar o borrifador.</span>
            </div>
          )}

          <button
            type="button"
            disabled={!allHarvested}
            onClick={() => {
              soundEngine.playSuccess();
              onComplete();
            }}
            className="pixel-btn flex w-full items-center justify-center gap-2 bg-emerald-400 px-4 py-2.5 font-pixel text-[10px] text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <CheckCircle2 className="h-4 w-4" />
            {allHarvested
              ? isSurvival
                ? dict.survival.missionActions.m4SurvivalBtn
                : 'Integrar Sistema Bioregenerativo (Desafio 4.5) ▶'
              : growthStage < 3
              ? `Borrife névoa na bandeja (${growthStage}/3 estágios)`
              : `Colha os 4 vegetais/frutos maduros (${harvestCount}/4)`}
          </button>
        </div>
      </div>
    </div>
  );
};
