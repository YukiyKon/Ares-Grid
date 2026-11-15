import React, { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Flower2,
  GripHorizontal,
  Leaf,
  RotateCcw,
  Sprout,
  Wheat,
} from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

type CropSlot = 'vegetable' | 'fruit' | 'grain' | 'ornamental';

interface CropSeedItem {
  slot: CropSlot;
  name: string;
  capiMsg: string;
}

const VEGETABLE_SEEDS: CropSeedItem[] = [
  {
    slot: 'vegetable',
    name: 'Alface',
    capiMsg: 'Alface plantada no Berço 1! Hortaliças folhosas crescem rápido e dão vitaminas frescas.',
  },
  {
    slot: 'vegetable',
    name: 'Tomate',
    capiMsg: 'Tomate plantado no Berço 1! Frutos vermelhos trazem sabor e nutrientes essenciais à equipe.',
  },
  {
    slot: 'vegetable',
    name: 'Cenoura',
    capiMsg: 'Cenoura plantada no Berço 1! Raízes crocantes enriquecem a dieta do habitat.',
  },
];

const FRUIT_SEEDS: CropSeedItem[] = [
  {
    slot: 'fruit',
    name: 'Morango',
    capiMsg: 'Morango plantado no Berço 2! Pequenas frutíferas produzem alimento rico em antioxidantes.',
  },
];

const GRAIN_SEEDS: CropSeedItem[] = [
  {
    slot: 'grain',
    name: 'Trigo',
    capiMsg: 'Trigo plantado no Berço 3! Cereais garantem carboidratos para missões de longa duração.',
  },
];

const ORNAMENTAL_SEEDS: CropSeedItem[] = [
  {
    slot: 'ornamental',
    name: 'Flores Ornamentais',
    capiMsg:
      'Flores plantadas no Berço 4! Na NASA, cultivar flores também melhora o bem-estar e o humor da tripulação!',
  },
];

interface DraggingSeedState {
  seed: CropSeedItem;
  startX: number;
  startY: number;
  x: number;
  y: number;
  moved: boolean;
}

interface Step3CropSelectionProps {
  onComplete: () => void;
  onCapiFeedback: (line: string) => void;
}

export const Step3CropSelection: React.FC<Step3CropSelectionProps> = ({
  onComplete,
  onCapiFeedback,
}) => {
  const { state, updateMission4 } = useGameStore();
  const crops = state.mission4.selectedCrops;

  const [draggingSeed, setDraggingSeed] = useState<DraggingSeedState | null>(null);
  const [hoveredCradle, setHoveredCradle] = useState<CropSlot | 'TRAY' | null>(null);

  const cropsRef = useRef(crops);
  const hasInitRef = useRef(false);

  useEffect(() => {
    cropsRef.current = crops;
  }, [crops]);

  // Garante berços vazios inicialmente se a missão ainda não foi concluída
  useEffect(() => {
    if (hasInitRef.current) return;
    hasInitRef.current = true;
    if (!state.mission4.mission4Completed && state.mission4.growthStage === 0) {
      updateMission4({
        selectedCrops: {
          vegetable: null,
          fruit: null,
          grain: null,
          ornamental: null,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const plantSeed = (seed: CropSeedItem) => {
    soundEngine.playSuccess();
    const nextCrops = {
      ...cropsRef.current,
      [seed.slot]: seed.name,
    };
    cropsRef.current = nextCrops;
    updateMission4({ selectedCrops: nextCrops });
    onCapiFeedback(seed.capiMsg);
  };

  const handleClearCradles = () => {
    soundEngine.playClick();
    const empty = { vegetable: null, fruit: null, grain: null, ornamental: null };
    cropsRef.current = empty;
    updateMission4({ selectedCrops: empty });
    onCapiFeedback('Berços da bandeja esvaziados! Arraste (ou toque) 1 muda para cada quadrante.');
  };

  useEffect(() => {
    if (!draggingSeed) return;

    const handleMove = (e: PointerEvent) => {
      const moved =
        draggingSeed.moved ||
        Math.hypot(e.clientX - draggingSeed.startX, e.clientY - draggingSeed.startY) > 8;

      setDraggingSeed((prev) =>
        prev ? { ...prev, x: e.clientX, y: e.clientY, moved } : null
      );

      if (moved) {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const slotEl = el?.closest('[data-cradle-slot]') as HTMLElement | null;
        const trayEl = el?.closest('[data-cradle-tray]') as HTMLElement | null;
        if (slotEl) {
          setHoveredCradle((slotEl.dataset.cradleSlot as CropSlot) ?? null);
        } else if (trayEl) {
          setHoveredCradle('TRAY');
        } else {
          setHoveredCradle(null);
        }
      }
    };

    const handleUp = (e: PointerEvent) => {
      const current = draggingSeed;
      setDraggingSeed(null);
      setHoveredCradle(null);

      if (!current.moved) {
        // Toque rápido também planta no berço correspondente
        plantSeed(current.seed);
        return;
      }

      const el = document.elementFromPoint(e.clientX, e.clientY);
      const slotEl = el?.closest('[data-cradle-slot]') as HTMLElement | null;
      const trayEl = el?.closest('[data-cradle-tray]') as HTMLElement | null;
      const targetSlot = slotEl?.dataset.cradleSlot as CropSlot | undefined;

      if (targetSlot === current.seed.slot || (!targetSlot && trayEl)) {
        plantSeed(current.seed);
      } else if (targetSlot && targetSlot !== current.seed.slot) {
        soundEngine.playAlert();
        onCapiFeedback(
          'Ops! Solte essa muda no quadrante correspondente da bandeja (ou na bandeja hidropônica).'
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
  }, [draggingSeed]);

  const startSeedDrag = (seed: CropSeedItem, e: React.PointerEvent) => {
    e.preventDefault();
    setDraggingSeed({
      seed,
      startX: e.clientX,
      startY: e.clientY,
      x: e.clientX,
      y: e.clientY,
      moved: false,
    });
  };

  const plantedCount = [
    crops.vegetable,
    crops.fruit,
    crops.grain,
    crops.ornamental,
  ].filter(Boolean).length;
  const allGroupsPicked = plantedCount === 4;

  const CRADLE_META: { slot: CropSlot; title: string; color: string; hint: string }[] = [
    {
      slot: 'vegetable',
      title: '1. HORTALIÇAS',
      color: 'emerald',
      hint: 'Solte Alface, Tomate ou Cenoura',
    },
    {
      slot: 'fruit',
      title: '2. FRUTÍFERAS',
      color: 'rose',
      hint: 'Solte Morango',
    },
    {
      slot: 'grain',
      title: '3. CEREAIS',
      color: 'amber',
      hint: 'Solte Trigo',
    },
    {
      slot: 'ornamental',
      title: '4. ORNAMENTAIS',
      color: 'fuchsia',
      hint: 'Solte Flores Ornamentais',
    },
  ];

  return (
    <div className="space-y-4 pb-32">
      <div className="rounded-sm border-2 border-emerald-500/50 bg-slate-900/90 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-emerald-300" />
            <h2 className="font-pixel text-[11px] text-emerald-200">
              DESAFIO 4.3 — PLANTIO DRAG &amp; DROP NOS BERÇOS HIDROPÔNICOS
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-dialog text-xs text-slate-300">
              Berços plantados: {plantedCount}/4
            </span>
            <button
              type="button"
              onClick={handleClearCradles}
              className="inline-flex items-center gap-1 rounded-sm border border-slate-700 bg-slate-950 px-2 py-1 font-dialog text-[11px] text-slate-300 hover:border-emerald-400"
            >
              <RotateCcw className="h-3 w-3" />
              Limpar Berços
            </button>
          </div>
        </div>
      </div>

      {/* Fantasma flutuante durante o arraste */}
      {draggingSeed && draggingSeed.moved && (
        <div
          style={{
            left: draggingSeed.x,
            top: draggingSeed.y,
            transform: 'translate(-50%, -120%)',
          }}
          className="pointer-events-none fixed z-50 rounded-sm border-2 border-emerald-300 bg-slate-950/95 px-2.5 py-1 font-dialog text-xs font-bold text-emerald-200 shadow-xl"
        >
          🌱 {draggingSeed.seed.name}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-[1.05fr_1.15fr]">
        {/* Bandeja com os 4 Quadrantes Vazios (Drop Targets) */}
        <div className="space-y-3">
          <div className="pixel-box relative flex aspect-[16/7] items-center justify-center overflow-hidden bg-slate-900 p-2">
            <img
              src={ASSET_MANIFEST.marsCropsTray.path}
              alt={ASSET_MANIFEST.marsCropsTray.alt}
              className="pixel-art max-h-full w-auto object-contain opacity-90"
            />
          </div>

          <div
            data-cradle-tray="true"
            className={`rounded-sm border-2 p-3 transition ${
              hoveredCradle === 'TRAY'
                ? 'border-emerald-300 bg-emerald-950/35'
                : 'border-emerald-500/50 bg-slate-900'
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-pixel text-[9px] text-amber-300">
                BANDEJA HIDROPÔNICA — 4 QUADRANTES (ARRASTE AQUI)
              </span>
              <span className="font-pixel text-[8px] text-emerald-300">{plantedCount}/4</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {CRADLE_META.map((quad) => {
                const value = crops[quad.slot];
                const isTargetHover =
                  hoveredCradle === quad.slot ||
                  (draggingSeed?.moved && draggingSeed.seed.slot === quad.slot);

                return (
                  <div
                    key={quad.slot}
                    data-cradle-slot={quad.slot}
                    className={`flex min-h-[82px] flex-col items-center justify-center rounded-sm border-2 border-dashed p-2 text-center transition ${
                      value
                        ? 'border-solid border-emerald-400 bg-emerald-950/45 text-emerald-100'
                        : isTargetHover
                        ? 'border-cyan-300 bg-cyan-950/45 text-cyan-100 scale-[1.02]'
                        : 'border-slate-700 bg-slate-950 text-slate-400'
                    }`}
                  >
                    <span className="font-pixel text-[7px] text-amber-300">{quad.title}</span>
                    {value ? (
                      <div className="mt-1.5 flex items-center gap-1 font-dialog text-xs font-bold text-emerald-200">
                        <Sprout className="h-4 w-4 text-emerald-400" />
                        <span>{value}</span>
                      </div>
                    ) : (
                      <span className="mt-1.5 font-dialog text-[11px] text-slate-400">
                        {quad.hint}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sementes e Mudas Arrastáveis */}
        <div className="flex flex-col justify-between gap-2.5">
          {/* Grupo 1: Hortaliças */}
          <div className="rounded-sm border border-slate-800 bg-slate-900 p-2.5">
            <span className="mb-1.5 flex items-center justify-between font-pixel text-[9px] text-emerald-300">
              <span>1. HORTALIÇAS (ARRASTE OU TOQUE)</span>
              <GripHorizontal className="h-3.5 w-3.5 text-slate-500" />
            </span>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {VEGETABLE_SEEDS.map((seed) => (
                <button
                  key={seed.name}
                  type="button"
                  onPointerDown={(e) => startSeedDrag(seed, e)}
                  className={`touch-none select-none cursor-grab active:cursor-grabbing min-h-[42px] rounded-sm border px-2 py-2 font-dialog text-xs transition ${
                    crops.vegetable === seed.name
                      ? 'border-emerald-400 bg-emerald-950/70 font-bold text-emerald-100'
                      : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-emerald-400'
                  }`}
                >
                  🥬 {seed.name}
                </button>
              ))}
            </div>
          </div>

          {/* Grupo 2: Frutíferas */}
          <div className="rounded-sm border border-slate-800 bg-slate-900 p-2.5">
            <span className="mb-1.5 flex items-center justify-between font-pixel text-[9px] text-rose-300">
              <span>2. PLANTAS FRUTÍFERAS</span>
              <GripHorizontal className="h-3.5 w-3.5 text-slate-500" />
            </span>
            {FRUIT_SEEDS.map((seed) => (
              <button
                key={seed.name}
                type="button"
                onPointerDown={(e) => startSeedDrag(seed, e)}
                className={`touch-none select-none cursor-grab active:cursor-grabbing flex w-full items-center justify-between rounded-sm border px-3 py-2 font-dialog text-xs ${
                  crops.fruit === seed.name
                    ? 'border-rose-400 bg-rose-950/70 font-bold text-rose-100'
                    : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-rose-400'
                }`}
              >
                <span>🍓 {seed.name} (Porte compacto ideal para estufa)</span>
                {crops.fruit === seed.name && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                )}
              </button>
            ))}
          </div>

          {/* Grupo 3: Cereais */}
          <div className="rounded-sm border border-slate-800 bg-slate-900 p-2.5">
            <span className="mb-1.5 flex items-center justify-between font-pixel text-[9px] text-amber-300">
              <span>3. CEREAIS ENERGÉTICOS</span>
              <GripHorizontal className="h-3.5 w-3.5 text-slate-500" />
            </span>
            {GRAIN_SEEDS.map((seed) => (
              <button
                key={seed.name}
                type="button"
                onPointerDown={(e) => startSeedDrag(seed, e)}
                className={`touch-none select-none cursor-grab active:cursor-grabbing flex w-full items-center justify-between rounded-sm border px-3 py-2 font-dialog text-xs ${
                  crops.grain === seed.name
                    ? 'border-amber-400 bg-amber-950/70 font-bold text-amber-100'
                    : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-amber-400'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Wheat className="h-3.5 w-3.5 text-amber-300" />
                  {seed.name} (Fonte de energia e fibras)
                </span>
                {crops.grain === seed.name && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                )}
              </button>
            ))}
          </div>

          {/* Grupo 4: Ornamentais */}
          <div className="rounded-sm border border-slate-800 bg-slate-900 p-2.5">
            <span className="mb-1.5 flex items-center justify-between font-pixel text-[9px] text-fuchsia-300">
              <span className="flex items-center gap-1">
                <Flower2 className="h-3.5 w-3.5" />
                4. PLANTAS ORNAMENTAIS
              </span>
              <GripHorizontal className="h-3.5 w-3.5 text-slate-500" />
            </span>
            {ORNAMENTAL_SEEDS.map((seed) => (
              <button
                key={seed.name}
                type="button"
                onPointerDown={(e) => startSeedDrag(seed, e)}
                className={`touch-none select-none cursor-grab active:cursor-grabbing flex w-full items-center justify-between rounded-sm border px-3 py-2 font-dialog text-xs ${
                  crops.ornamental === seed.name
                    ? 'border-fuchsia-400 bg-fuchsia-950/70 font-bold text-fuchsia-100'
                    : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-fuchsia-400'
                }`}
              >
                <span>🌸 {seed.name} (Bem-estar psicológico no habitat)</span>
                {crops.ornamental === seed.name && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                )}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={!allGroupsPicked}
            onClick={() => {
              soundEngine.playSuccess();
              onComplete();
            }}
            className="pixel-btn w-full bg-emerald-400 px-4 py-2.5 font-pixel text-[10px] text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {allGroupsPicked
              ? 'Ir para Névoa Nutritiva & Colheita (Desafio 4.4) ▶'
              : `Plante nos 4 quadrantes da bandeja (${plantedCount}/4)`}
          </button>
        </div>
      </div>
    </div>
  );
};
