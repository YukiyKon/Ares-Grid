import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Droplets,
  Flame,
  GripHorizontal,
  RotateCcw,
  Utensils,
} from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { type WaterDoseId, useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';
import type { SurvivalActionDetails } from '../../modes/survival30/survivalTypes';

type FoodGroup = 'PROTEIN' | 'VEGGIE' | 'CARB';

interface FoodItem {
  name: string;
  kcal: number;
  tag: string;
}

const PROTEINS: FoodItem[] = [
  { name: 'Tofu Proteico', kcal: 140, tag: 'Leve' },
  { name: 'Grão-de-bico Espacial', kcal: 250, tag: 'Moderado' },
  { name: 'Peixe Selado NASA', kcal: 360, tag: 'Alta Energia' },
];

const VEGGIES: FoodItem[] = [
  { name: 'Salada de Folhas Verdes', kcal: 35, tag: 'Ultra Leve' },
  { name: 'Tomates-cereja', kcal: 70, tag: 'Leve' },
  { name: 'Brócolis da Estufa', kcal: 130, tag: 'Nutritivo' },
];

const CARBS: FoodItem[] = [
  { name: 'Tortilha Integral', kcal: 190, tag: 'Leve' },
  { name: 'Quinoa Espacial', kcal: 290, tag: 'Moderado' },
  { name: 'Arroz Integral', kcal: 410, tag: 'Alta Energia' },
];

const ALL_FOODS: FoodItem[] = [...PROTEINS, ...VEGGIES, ...CARBS];

const ACTIVITY_EXPENDITURE_KCAL = 740;
const IDEAL_KCAL_MIN = 650;
const IDEAL_KCAL_MAX = 820;
const MAX_KCAL_SCALE = 1000;

const MAX_CANTEEN_ML = 600;
const IDEAL_MIN_ML = 300;
const IDEAL_MAX_ML = 400;

function getFoodKcal(name: string | null): number {
  if (!name) return 0;
  const normalized = name.trim().toLowerCase();
  const match = ALL_FOODS.find((f) => f.name.toLowerCase() === normalized);
  return match ? match.kcal : 0;
}

interface DraggingFoodState {
  group: FoodGroup;
  item: FoodItem;
  startX: number;
  startY: number;
  x: number;
  y: number;
  moved: boolean;
}

interface Step2NutritionGalleyProps {
  onComplete: () => void;
  onFinishSurvivalTurn?: (details?: SurvivalActionDetails) => void;
  onCapiFeedback: (line: string) => void;
}

export const Step2NutritionGalley: React.FC<Step2NutritionGalleyProps> = ({
  onComplete,
  onFinishSurvivalTurn,
  onCapiFeedback,
}) => {
  const { state, updateMission2, updateStats, recordSurvivalDailyLog } = useGameStore();
  const isSurvival = state.gameMode === 'SURVIVAL_30';
  const noRationsLeft = isSurvival && state.survival.foodRations <= 0;
  const { selectedProtein, selectedVeggie, selectedCarb, waterDose } = state.mission2;

  const [waterMl, setWaterMl] = useState<number>(() => {
    if (waterDose === 'IDEAL') return 350;
    if (waterDose === 'LOW') return 180;
    if (waterDose === 'WASTE') return 510;
    return 0;
  });
  const [isPouring, setIsPouring] = useState(false);
  const [draggingFood, setDraggingFood] = useState<DraggingFoodState | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<FoodGroup | 'TRAY' | null>(null);

  const selectionRef = useRef({
    selectedProtein,
    selectedVeggie,
    selectedCarb,
  });

  useEffect(() => {
    selectionRef.current = {
      selectedProtein,
      selectedVeggie,
      selectedCarb,
    };
  }, [selectedProtein, selectedVeggie, selectedCarb]);

  const waterMlRef = useRef(waterMl);
  const fillTimerRef = useRef<number | null>(null);
  const lastPulseAtRef = useRef(0);
  const isPouringRef = useRef(false);

  useEffect(() => {
    waterMlRef.current = waterMl;
  }, [waterMl]);

  const stopTimer = () => {
    if (fillTimerRef.current !== null) {
      window.clearInterval(fillTimerRef.current);
      fillTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, []);

  const assignFoodToGroup = (group: FoodGroup, item: FoodItem, viaDrag: boolean) => {
    const nextSel = {
      selectedProtein: group === 'PROTEIN' ? item.name : selectionRef.current.selectedProtein,
      selectedVeggie: group === 'VEGGIE' ? item.name : selectionRef.current.selectedVeggie,
      selectedCarb: group === 'CARB' ? item.name : selectionRef.current.selectedCarb,
    };
    selectionRef.current = nextSel;

    if (group === 'PROTEIN') updateMission2({ selectedProtein: item.name });
    if (group === 'VEGGIE') updateMission2({ selectedVeggie: item.name });
    if (group === 'CARB') updateMission2({ selectedCarb: item.name });

    const allChosen = Boolean(
      nextSel.selectedProtein && nextSel.selectedVeggie && nextSel.selectedCarb
    );

    if (allChosen) {
      const nextKcal =
        getFoodKcal(nextSel.selectedProtein) +
        getFoodKcal(nextSel.selectedVeggie) +
        getFoodKcal(nextSel.selectedCarb);

      if (nextKcal < IDEAL_KCAL_MIN) {
        soundEngine.playAlert();
        onCapiFeedback(
          'Atenção, comandante! Você gastou muita energia nos exercícios e essa refeição tem poucas calorias. O astronauta vai ficar sem força — troque por alimentos mais energéticos!'
        );
      } else if (nextKcal <= IDEAL_KCAL_MAX) {
        soundEngine.playSuccess();
        onCapiFeedback(
          'Combinação perfeita! Você repôs exatamente a energia gasta nos treinos com proteínas, vitaminas e carboidratos na medida certa!'
        );
      } else {
        soundEngine.playAlert();
        onCapiFeedback(
          'Essa refeição ultrapassou o gasto energético do dia! Muita energia acumulada pode causar desconforto antes da próxima atividade. Tente equilibrar um item mais leve.'
        );
      }
      return;
    }

    soundEngine.playClick();
    if (viaDrag) {
      onCapiFeedback(
        `Boa! "${item.name}" (+${item.kcal} kcal) encaixado na Bandeja do Astronauta.`
      );
    }
  };

  // Drag & Drop tátil via PointerEvents (compatível com mouse e dedo) + fallback de toque direto
  useEffect(() => {
    if (!draggingFood) return;

    const handleWindowPointerMove = (e: PointerEvent) => {
      const dx = e.clientX - draggingFood.startX;
      const dy = e.clientY - draggingFood.startY;
      const moved = draggingFood.moved || Math.hypot(dx, dy) > 8;

      setDraggingFood((prev) =>
        prev
          ? {
              ...prev,
              x: e.clientX,
              y: e.clientY,
              moved,
            }
          : null
      );

      if (moved) {
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const slotEl = el?.closest('[data-tray-slot]') as HTMLElement | null;
        const trayEl = el?.closest('[data-tray-zone]') as HTMLElement | null;
        if (slotEl) {
          setHoveredSlot((slotEl.dataset.traySlot as FoodGroup) ?? null);
        } else if (trayEl) {
          setHoveredSlot('TRAY');
        } else {
          setHoveredSlot(null);
        }
      }
    };

    const handleWindowPointerUp = (e: PointerEvent) => {
      const current = draggingFood;
      setDraggingFood(null);
      setHoveredSlot(null);

      if (!current.moved) {
        assignFoodToGroup(current.group, current.item, false);
        return;
      }

      const el = document.elementFromPoint(e.clientX, e.clientY);
      const slotEl = el?.closest('[data-tray-slot]') as HTMLElement | null;
      const trayEl = el?.closest('[data-tray-zone]') as HTMLElement | null;
      const droppedSlot = slotEl?.dataset.traySlot as FoodGroup | undefined;

      if (droppedSlot === current.group || (!droppedSlot && trayEl)) {
        assignFoodToGroup(current.group, current.item, true);
      } else if (droppedSlot && droppedSlot !== current.group) {
        soundEngine.playAlert();
        onCapiFeedback(
          'Ops! Solte esse alimento no compartimento correspondente da bandeja (ou dentro da área da bandeja).'
        );
      }
    };

    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', handleWindowPointerUp);
    window.addEventListener('pointercancel', handleWindowPointerUp);
    return () => {
      window.removeEventListener('pointermove', handleWindowPointerMove);
      window.removeEventListener('pointerup', handleWindowPointerUp);
      window.removeEventListener('pointercancel', handleWindowPointerUp);
    };
  }, [draggingFood]);

  const startFoodDrag = (group: FoodGroup, item: FoodItem, e: React.PointerEvent) => {
    e.preventDefault();
    setDraggingFood({
      group,
      item,
      startX: e.clientX,
      startY: e.clientY,
      x: e.clientX,
      y: e.clientY,
      moved: false,
    });
  };

  const evaluateWaterVolume = (ml: number) => {
    if (ml <= 0) return;

    let dose: WaterDoseId;
    if (ml < IDEAL_MIN_ML) {
      dose = 'LOW';
      soundEngine.playAlert();
      onCapiFeedback(
        `Você colocou apenas ${ml} ml! Abaixo de 300 ml é insuficiente após os exercícios. Esvazie o cantil e mire entre 300 ml e 400 ml.`
      );
    } else if (ml <= IDEAL_MAX_ML) {
      dose = 'IDEAL';
      soundEngine.playSuccess();
      onCapiFeedback(
        `Precisão cirúrgica! ${ml} ml está exatamente na faixa ideal (300–400 ml): hidratação completa sem desperdiçar uma gota em Marte!`
      );
    } else {
      dose = 'WASTE';
      soundEngine.playAlert();
      onCapiFeedback(
        `Atenção! ${ml} ml passou da faixa ideal (300–400 ml) e gerou desperdício no reservatório! Esvazie e dose novamente.`
      );
    }
    updateMission2({ waterDose: dose });
  };

  const startPouring = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (waterDose !== null || waterMlRef.current >= MAX_CANTEEN_ML) {
      soundEngine.playAlert();
      onCapiFeedback(
        'Cantil já dosado! Clique em "Esvaziar" caso queira ajustar o volume novamente.'
      );
      return;
    }

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore if unsupported
    }

    isPouringRef.current = true;
    setIsPouring(true);

    fillTimerRef.current = window.setInterval(() => {
      const next = Math.min(MAX_CANTEEN_ML, waterMlRef.current + 12);
      waterMlRef.current = next;
      setWaterMl(next);

      const now = performance.now();
      if (now - lastPulseAtRef.current >= 110) {
        soundEngine.playChargePulse(next / MAX_CANTEEN_ML);
        lastPulseAtRef.current = now;
      }

      if (next >= MAX_CANTEEN_ML) {
        stopTimer();
        isPouringRef.current = false;
        setIsPouring(false);
        evaluateWaterVolume(next);
      }
    }, 45);
  };

  const stopPouring = (e?: React.PointerEvent<HTMLButtonElement>) => {
    if (e) {
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // ignore
      }
    }
    if (!isPouringRef.current) return;
    isPouringRef.current = false;
    setIsPouring(false);
    stopTimer();
    evaluateWaterVolume(waterMlRef.current);
  };

  const handleDrainCanteen = () => {
    stopTimer();
    isPouringRef.current = false;
    setIsPouring(false);
    waterMlRef.current = 0;
    setWaterMl(0);
    updateMission2({ waterDose: null });
    soundEngine.playClick();
    onCapiFeedback(
      'Cantil esvaziado com reciclagem fechada! Segure o dispensador e solte entre 300 ml e 400 ml.'
    );
  };

  const proteinKcal = getFoodKcal(selectedProtein);
  const veggieKcal = getFoodKcal(selectedVeggie);
  const carbKcal = getFoodKcal(selectedCarb);
  const totalKcal = proteinKcal + veggieKcal + carbKcal;

  const hasBalancedPlate = Boolean(selectedProtein && selectedVeggie && selectedCarb);
  const calorieStatus: 'INCOMPLETE' | 'LOW' | 'IDEAL' | 'HIGH' = !hasBalancedPlate
    ? 'INCOMPLETE'
    : totalKcal < IDEAL_KCAL_MIN
    ? 'LOW'
    : totalKcal <= IDEAL_KCAL_MAX
    ? 'IDEAL'
    : 'HIGH';

  const isIdealCalorieRange = calorieStatus === 'IDEAL';
  const hasIdealWater = waterDose === 'IDEAL';
  const canFinish = hasBalancedPlate && isIdealCalorieRange && hasIdealWater;

  const kcalFillPct = Math.min(100, Math.round((totalKcal / MAX_KCAL_SCALE) * 100));
  const idealKcalLeftPct = Math.round((IDEAL_KCAL_MIN / MAX_KCAL_SCALE) * 100);
  const idealKcalWidthPct = Math.round(((IDEAL_KCAL_MAX - IDEAL_KCAL_MIN) / MAX_KCAL_SCALE) * 100);
  const expenditureMarkerPct = Math.round((ACTIVITY_EXPENDITURE_KCAL / MAX_KCAL_SCALE) * 100);

  const waterFillPct = Math.min(100, Math.round((waterMl / MAX_CANTEEN_ML) * 100));
  const idealZoneLeftPct = Math.round((IDEAL_MIN_ML / MAX_CANTEEN_ML) * 100);
  const idealZoneWidthPct = Math.round(((IDEAL_MAX_ML - IDEAL_MIN_ML) / MAX_CANTEEN_ML) * 100);

  const buildNutritionDetails = (): SurvivalActionDetails => {
    const exercised =
      state.mission2.exercisesCompleted.length > 0 || state.survival.dailyLog.exercised;
    const resolvedWater = Math.max(0, Math.round(waterMl));
    if (noRationsLeft) {
      return {
        exercised,
        exerciseCount: state.mission2.exercisesCompleted.length,
        ateMeal: false,
        mealKcal: 0,
        mealSummary: 'Sem ração no estoque — déficit energético',
        hydrationMl: resolvedWater,
      };
    }

    const items = [selectedProtein, selectedVeggie, selectedCarb].filter(Boolean).join(', ');
    return {
      exercised,
      exerciseCount: state.mission2.exercisesCompleted.length,
      ateMeal: hasBalancedPlate,
      mealKcal: totalKcal,
      mealSummary: hasBalancedPlate
        ? `Refeição balanceada: ${totalKcal} kcal (${items})`
        : `Ração parcial (${totalKcal} kcal)`,
      hydrationMl: resolvedWater,
    };
  };

  const syncSurvivalNutritionBeforeAdvance = () => {
    const details = buildNutritionDetails();
    const postUseWater = Math.max(0, state.survival.water - 12);
    recordSurvivalDailyLog({
      exercised: Boolean(details.exercised),
      exerciseCount: details.exerciseCount ?? 0,
      ateMeal: Boolean(details.ateMeal),
      mealKcal: details.mealKcal ?? 0,
      mealSummary: details.mealSummary,
      hydratedToday: (details.hydrationMl ?? 0) > 0,
      hydrationMl: details.hydrationMl ?? 0,
      hydrationSummary:
        (details.hydrationMl ?? 0) > 0
          ? `${details.hydrationMl} ml ingeridos • Reservatório em ${postUseWater}%`
          : `Hidratação insuficiente • Reservatório em ${state.survival.water}%`,
    });
    return details;
  };

  const handleConfirmMeal = () => {
    soundEngine.playSuccess();
    updateMission2({ nutritionCompleted: true });
    if (isSurvival) {
      syncSurvivalNutritionBeforeAdvance();
    } else {
      updateStats({
        water: Math.min(95, state.stats.water + 8),
        energy: Math.min(100, state.stats.energy + 15),
        health: 100,
      });
    }
    onComplete();
  };

  const handleFinishSurvivalNow = () => {
    soundEngine.playSuccess();
    updateMission2({ nutritionCompleted: true });
    const details = buildNutritionDetails();
    onFinishSurvivalTurn?.(details);
  };

  const renderFoodButton = (group: FoodGroup, item: FoodItem, selectedName: string | null) => {
    const isSelected = selectedName?.toLowerCase() === item.name.toLowerCase();
    const borderSelected =
      group === 'PROTEIN'
        ? 'border-orange-400 bg-orange-950/70 text-orange-100'
        : group === 'VEGGIE'
        ? 'border-emerald-400 bg-emerald-950/70 text-emerald-100'
        : 'border-amber-400 bg-amber-950/70 text-amber-100';
    const hoverBorder =
      group === 'PROTEIN'
        ? 'hover:border-orange-400/70'
        : group === 'VEGGIE'
        ? 'hover:border-emerald-400/70'
        : 'hover:border-amber-400/70';
    const badgeColor =
      group === 'PROTEIN'
        ? 'bg-orange-500/20 text-orange-200 border-orange-400/50'
        : group === 'VEGGIE'
        ? 'bg-emerald-500/20 text-emerald-200 border-emerald-400/50'
        : 'bg-amber-500/20 text-amber-200 border-amber-400/50';

    return (
      <button
        key={item.name}
        type="button"
        onPointerDown={(e) => startFoodDrag(group, item, e)}
        className={`touch-none select-none cursor-grab active:cursor-grabbing flex flex-col justify-between rounded-sm border px-2 py-1.5 text-left font-dialog text-[11px] transition ${
          isSelected
            ? borderSelected
            : `border-slate-700 bg-slate-950 text-slate-200 ${hoverBorder}`
        }`}
      >
        <span className="font-bold leading-tight">{item.name}</span>
        <div className="mt-1.5 flex items-center justify-between gap-1">
          <span className="text-[10px] text-slate-400">{item.tag}</span>
          <span
            className={`rounded-xs border px-1.5 py-0.5 font-pixel text-[7px] ${badgeColor}`}
          >
            {item.kcal} kcal
          </span>
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-4">
      {/* Cabeçalho + Gasto Energético do Astronauta */}
      <div className="rounded-sm border-2 border-emerald-500/50 bg-slate-900/90 p-3 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Utensils className="h-4 w-4 text-emerald-300" />
            <h2 className="font-pixel text-[11px] text-emerald-300">
              DESAFIO 2.2 — ALIMENTAÇÃO EQUILIBRADA (KCAL) &amp; HIDRATAÇÃO
            </h2>
          </div>
          <span className="font-dialog text-xs text-slate-300">
            Arraste (ou toque) nos alimentos para repor a energia gasta no Desafio 2.1
          </span>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-sm border border-amber-500/40 bg-slate-950/90 px-3 py-1.5 font-dialog text-xs">
            <span className="flex items-center gap-1.5 text-amber-200">
              <Flame className="h-4 w-4 text-amber-400" />
              Gasto Energético da Atividade ({state.mission2.exercisesCompleted.length}/4 treinos):
            </span>
            <strong className="font-pixel text-[10px] text-amber-300">
              ~{ACTIVITY_EXPENDITURE_KCAL} kcal
            </strong>
          </div>

          <div className="flex items-center justify-between rounded-sm border border-emerald-500/40 bg-slate-950/90 px-3 py-1.5 font-dialog text-xs">
            <span className="flex items-center gap-1.5 text-emerald-200">
              <Activity className="h-4 w-4 text-emerald-400" />
              Meta de Reposição Ideal da Refeição:
            </span>
            <strong className="font-pixel text-[10px] text-emerald-300">
              {IDEAL_KCAL_MIN} – {IDEAL_KCAL_MAX} kcal
            </strong>
          </div>
        </div>
      </div>

      {/* Fantasma flutuante durante o arraste */}
      {draggingFood && draggingFood.moved && (
        <div
          style={{
            left: draggingFood.x,
            top: draggingFood.y,
            transform: 'translate(-50%, -120%)',
          }}
          className="pointer-events-none fixed z-50 rounded-sm border-2 border-amber-300 bg-slate-950/95 px-2.5 py-1 font-dialog text-xs font-bold text-amber-200 shadow-[0_6px_20px_rgba(0,0,0,0.75)]"
        >
          {draggingFood.item.name} ({draggingFood.item.kcal} kcal)
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-[1fr_1.15fr]">
        {/* Coluna Esquerda: Refeitório + Bandeja com Medidor de Balanço Energético */}
        <div className="space-y-3">
          <div className="pixel-box relative aspect-video overflow-hidden bg-slate-900">
            <img
              src={ASSET_MANIFEST.habitatGalley.path}
              alt={ASSET_MANIFEST.habitatGalley.alt}
              className="pixel-art h-full w-full object-cover"
            />
          </div>

          {/* Bandeja interativa + Balanço Energético */}
          <div
            data-tray-zone="true"
            className={`rounded-sm border-2 p-3 transition-colors space-y-3 ${
              hoveredSlot === 'TRAY'
                ? 'border-cyan-300 bg-cyan-950/35'
                : calorieStatus === 'IDEAL'
                ? 'border-emerald-400/70 bg-slate-900'
                : calorieStatus === 'LOW'
                ? 'border-rose-400/70 bg-slate-900'
                : calorieStatus === 'HIGH'
                ? 'border-orange-400/70 bg-slate-900'
                : 'border-slate-700 bg-slate-900'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-pixel text-[9px] text-amber-300">
                BANDEJA DO ASTRONAUTA (SOLTE AQUI)
              </span>
              <span className="font-pixel text-[10px] text-cyan-200">
                Total: {totalKcal} kcal
              </span>
            </div>

            <div className="grid gap-2 sm:grid-cols-3">
              <div
                data-tray-slot="PROTEIN"
                className={`rounded-sm border-2 border-dashed p-2 text-center font-dialog text-[11px] transition ${
                  hoveredSlot === 'PROTEIN' || (draggingFood?.moved && draggingFood.group === 'PROTEIN')
                    ? 'border-orange-300 bg-orange-950/55 text-orange-100'
                    : selectedProtein
                    ? 'border-solid border-orange-400 bg-orange-950/40 text-orange-100'
                    : 'border-slate-700 bg-slate-950 text-slate-400'
                }`}
              >
                <span className="block font-pixel text-[7px] text-orange-300">PROTEÍNA</span>
                <span className="mt-1 block font-bold">
                  {selectedProtein ?? 'Arraste 1 proteína'}
                </span>
                {selectedProtein && (
                  <span className="mt-0.5 block text-[10px] text-orange-200">
                    {proteinKcal} kcal
                  </span>
                )}
              </div>

              <div
                data-tray-slot="VEGGIE"
                className={`rounded-sm border-2 border-dashed p-2 text-center font-dialog text-[11px] transition ${
                  hoveredSlot === 'VEGGIE' || (draggingFood?.moved && draggingFood.group === 'VEGGIE')
                    ? 'border-emerald-300 bg-emerald-950/55 text-emerald-100'
                    : selectedVeggie
                    ? 'border-solid border-emerald-400 bg-emerald-950/40 text-emerald-100'
                    : 'border-slate-700 bg-slate-950 text-slate-400'
                }`}
              >
                <span className="block font-pixel text-[7px] text-emerald-300">VEGETAL</span>
                <span className="mt-1 block font-bold">
                  {selectedVeggie ?? 'Arraste 1 vegetal'}
                </span>
                {selectedVeggie && (
                  <span className="mt-0.5 block text-[10px] text-emerald-200">
                    {veggieKcal} kcal
                  </span>
                )}
              </div>

              <div
                data-tray-slot="CARB"
                className={`rounded-sm border-2 border-dashed p-2 text-center font-dialog text-[11px] transition ${
                  hoveredSlot === 'CARB' || (draggingFood?.moved && draggingFood.group === 'CARB')
                    ? 'border-amber-300 bg-amber-950/55 text-amber-100'
                    : selectedCarb
                    ? 'border-solid border-amber-400 bg-amber-950/40 text-amber-100'
                    : 'border-slate-700 bg-slate-950 text-slate-400'
                }`}
              >
                <span className="block font-pixel text-[7px] text-amber-300">CARBOIDRATO</span>
                <span className="mt-1 block font-bold">
                  {selectedCarb ?? 'Arraste 1 carboidrato'}
                </span>
                {selectedCarb && (
                  <span className="mt-0.5 block text-[10px] text-amber-200">
                    {carbKcal} kcal
                  </span>
                )}
              </div>
            </div>

            {/* Medidor de Balanço Energético (Gasto vs. Reposição) */}
            <div className="rounded-sm border border-slate-800 bg-slate-950/90 p-2.5 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-pixel text-[8px] text-slate-300">
                  BALANÇO ENERGÉTICO VS. GASTO (~{ACTIVITY_EXPENDITURE_KCAL} KCAL)
                </span>
                <span
                  className={`font-dialog text-[11px] font-bold ${
                    calorieStatus === 'IDEAL'
                      ? 'text-emerald-300'
                      : calorieStatus === 'LOW'
                      ? 'text-rose-300'
                      : calorieStatus === 'HIGH'
                      ? 'text-orange-300'
                      : 'text-slate-400'
                  }`}
                >
                  {calorieStatus === 'IDEAL'
                    ? 'Reposição Equilibrada!'
                    : calorieStatus === 'LOW'
                    ? 'Energia Insuficiente (< 650 kcal)'
                    : calorieStatus === 'HIGH'
                    ? 'Excesso Calórico (> 820 kcal)'
                    : `${totalKcal} / ${IDEAL_KCAL_MIN}–${IDEAL_KCAL_MAX} kcal`}
                </span>
              </div>

              <div className="relative h-6 w-full overflow-hidden rounded-sm border border-slate-700 bg-slate-900">
                {/* Zona Ideal 650–820 kcal */}
                <div
                  style={{
                    left: `${idealKcalLeftPct}%`,
                    width: `${idealKcalWidthPct}%`,
                  }}
                  className="pointer-events-none absolute inset-y-0 z-10 border-x-2 border-emerald-300 bg-emerald-500/20"
                >
                  <span className="flex h-full items-center justify-center font-pixel text-[6px] text-emerald-100">
                    IDEAL
                  </span>
                </div>

                {/* Marcador do Gasto (~740 kcal) */}
                <div
                  style={{ left: `${expenditureMarkerPct}%` }}
                  className="pointer-events-none absolute inset-y-0 z-20 w-0.5 bg-white/80"
                />

                {/* Barra preenchida com as calorias da bandeja */}
                <div
                  style={{ width: `${kcalFillPct}%` }}
                  className={`h-full transition-all duration-200 ${
                    calorieStatus === 'IDEAL'
                      ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]'
                      : calorieStatus === 'LOW'
                      ? 'bg-rose-500'
                      : calorieStatus === 'HIGH'
                      ? 'bg-orange-500'
                      : 'bg-amber-400/80'
                  }`}
                />
              </div>

              {calorieStatus !== 'INCOMPLETE' && (
                <p
                  className={`font-dialog text-[11px] ${
                    calorieStatus === 'IDEAL'
                      ? 'text-emerald-200'
                      : calorieStatus === 'LOW'
                      ? 'text-rose-200'
                      : 'text-orange-200'
                  }`}
                >
                  {calorieStatus === 'IDEAL'
                    ? `Excelente! ${totalKcal} kcal compensa perfeitamente os ~${ACTIVITY_EXPENDITURE_KCAL} kcal gastos no treino.`
                    : calorieStatus === 'LOW'
                    ? `Com ${totalKcal} kcal falta combustível para o astronauta. Troque por opções mais calóricas até atingir 650–820 kcal!`
                    : `${totalKcal} kcal ultrapassou a meta de ${IDEAL_KCAL_MAX} kcal! Troque um alimento por uma opção mais leve.`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Alimentos arrastáveis com badges de kcal + Dispensador de Água */}
        <div className="space-y-3">
          {/* Grupo 1: Proteína */}
          <div className="rounded-sm border border-slate-800 bg-slate-900/90 p-2.5">
            <span className="mb-1.5 flex items-center justify-between font-pixel text-[9px] text-orange-300">
              <span>1. PROTEÍNAS (MÚSCULOS)</span>
              <GripHorizontal className="h-3.5 w-3.5 text-slate-500" />
            </span>
            <div className="grid gap-1.5 sm:grid-cols-3">
              {PROTEINS.map((item) => renderFoodButton('PROTEIN', item, selectedProtein))}
            </div>
          </div>

          {/* Grupo 2: Vegetais */}
          <div className="rounded-sm border border-slate-800 bg-slate-900/90 p-2.5">
            <span className="mb-1.5 flex items-center justify-between font-pixel text-[9px] text-emerald-300">
              <span>2. VEGETAIS (VITAMINAS E FIBRAS)</span>
              <GripHorizontal className="h-3.5 w-3.5 text-slate-500" />
            </span>
            <div className="grid gap-1.5 sm:grid-cols-3">
              {VEGGIES.map((item) => renderFoodButton('VEGGIE', item, selectedVeggie))}
            </div>
          </div>

          {/* Grupo 3: Carboidratos */}
          <div className="rounded-sm border border-slate-800 bg-slate-900/90 p-2.5">
            <span className="mb-1.5 flex items-center justify-between font-pixel text-[9px] text-amber-300">
              <span>3. CARBOIDRATOS (ENERGIA)</span>
              <GripHorizontal className="h-3.5 w-3.5 text-slate-500" />
            </span>
            <div className="grid gap-1.5 sm:grid-cols-3">
              {CARBS.map((item) => renderFoodButton('CARB', item, selectedCarb))}
            </div>
          </div>

          {/* Grupo 4: Dispensador de Água Interativo (segurar para encher) */}
          <div className="rounded-sm border-2 border-sky-500/50 bg-slate-900/95 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 font-pixel text-[9px] text-sky-300">
                <Droplets className="h-3.5 w-3.5" />
                4. DISPENSADOR DE ÁGUA (META: 300 – 400 ML)
              </span>
              <span
                className={`font-pixel text-[9px] ${
                  waterDose === 'IDEAL'
                    ? 'text-emerald-300'
                    : waterDose === 'LOW' || waterDose === 'WASTE'
                    ? 'text-rose-300'
                    : 'text-sky-200'
                }`}
              >
                {waterMl} ml / {MAX_CANTEEN_ML} ml
              </span>
            </div>

            {/* Medidor graduado com faixa ideal destacada */}
            <div className="relative mt-2.5 h-7 w-full overflow-hidden rounded-sm border-2 border-slate-700 bg-slate-950">
              {/* Faixa ideal 300-400ml */}
              <div
                style={{
                  left: `${idealZoneLeftPct}%`,
                  width: `${idealZoneWidthPct}%`,
                }}
                className="pointer-events-none absolute inset-y-0 z-10 border-x-2 border-emerald-300 bg-emerald-500/25"
              >
                <span className="flex h-full items-center justify-center font-pixel text-[6px] text-emerald-100">
                  300-400ml
                </span>
              </div>

              {/* Nível da água enchendo */}
              <div
                style={{ width: `${waterFillPct}%` }}
                className={`h-full transition-[width] duration-75 ${
                  waterMl > IDEAL_MAX_ML
                    ? 'bg-rose-500/80'
                    : waterMl >= IDEAL_MIN_ML
                    ? 'bg-emerald-400/85'
                    : 'bg-sky-400/85'
                }`}
              />
            </div>

            <div className="mt-2.5 flex flex-wrap gap-2">
              <button
                type="button"
                onPointerDown={startPouring}
                onPointerUp={stopPouring}
                onPointerLeave={stopPouring}
                onPointerCancel={stopPouring}
                disabled={waterDose !== null}
                className={`touch-none select-none pixel-btn flex flex-1 items-center justify-center gap-2 px-3 py-2 font-pixel text-[9px] disabled:cursor-not-allowed disabled:opacity-45 ${
                  isPouring
                    ? 'bg-cyan-300 text-slate-950 shadow-[0_0_16px_rgba(34,211,238,0.65)]'
                    : 'bg-sky-400 text-slate-950 hover:bg-sky-300'
                }`}
              >
                <Droplets className="h-4 w-4" />
                {isPouring
                  ? 'ENCHENDO CANTIL... SOLTE NA FAIXA VERDE!'
                  : '💧 SEGURAR PARA ENCHER CANTIL'}
              </button>

              {(waterMl > 0 || waterDose !== null) && (
                <button
                  type="button"
                  onClick={handleDrainCanteen}
                  className="pixel-btn flex items-center gap-1.5 bg-slate-700 px-3 py-2 font-pixel text-[8px] text-slate-100 hover:bg-slate-600"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Esvaziar
                </button>
              )}
            </div>
          </div>

          {noRationsLeft && (
            <div className="mb-2 flex flex-col gap-2">
              <button
                type="button"
                disabled={!hasIdealWater}
                onClick={handleConfirmMeal}
                className="pixel-btn flex w-full items-center justify-center gap-2 bg-cyan-400 px-4 py-2 font-pixel text-[9px] text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-45"
              >
                <Droplets className="h-4 w-4" />
                {hasIdealWater
                  ? '💧 Salvar Hidratação (0 Rações) & Ir para Higiene (2.3) ▶'
                  : '0 rações disponíveis — Dose água (300–400 ml) para hidratar'}
              </button>

              {onFinishSurvivalTurn && hasIdealWater && (
                <button
                  type="button"
                  onClick={handleFinishSurvivalNow}
                  className="pixel-btn flex w-full items-center justify-center gap-2 bg-emerald-400 px-4 py-2 font-pixel text-[9px] text-slate-950 hover:bg-emerald-300"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  ✅ Hidratar & Concluir Turno Agora (-1 Turno • +8% Saúde) ▶
                </button>
              )}
            </div>
          )}

          <div className="space-y-2">
            <button
              type="button"
              disabled={!canFinish || noRationsLeft}
              onClick={handleConfirmMeal}
              className="pixel-btn flex w-full items-center justify-center gap-2 bg-emerald-400 px-4 py-2.5 font-pixel text-[10px] text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <CheckCircle2 className="h-4 w-4" />
              {noRationsLeft
                ? 'Estoque zerado (0 rações) — Use a Estufa (Estação 4) ou Hidrate acima'
                : canFinish
                ? isSurvival
                  ? `🥗 Registrar Refeição (${totalKcal} kcal) & Ir para Higiene (2.3) ▶`
                  : `Confirmar Refeição (${totalKcal} kcal) & Ir para Higiene (2.3) ▶`
                : calorieStatus === 'LOW'
                ? `Energia insuficiente (${totalKcal} kcal) — Atinga 650–820 kcal`
                : calorieStatus === 'HIGH'
                ? `Excesso calórico (${totalKcal} kcal) — Reduza para 650–820 kcal`
                : !hasBalancedPlate
                ? 'Monte os 3 grupos alimentares (650–820 kcal)'
                : 'Dose a água entre 300 ml e 400 ml para confirmar'}
            </button>

            {isSurvival && canFinish && !noRationsLeft && onFinishSurvivalTurn && (
              <button
                type="button"
                onClick={handleFinishSurvivalNow}
                className="pixel-btn flex w-full items-center justify-center gap-2 border border-cyan-400/60 bg-cyan-950/70 px-4 py-2 font-pixel text-[9px] text-cyan-200 hover:bg-cyan-900/70"
              >
                <CheckCircle2 className="h-4 w-4" />
                ✅ Concluir Turno no Habitat Agora (Sem Higiene • -1 Turno • +22% Saúde • +35% Stamina) ▶
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
