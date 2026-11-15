import React from 'react';
import { CheckCircle2, Droplets, Utensils } from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { type WaterDoseId, useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

const PROTEINS = ['Grão-de-bico espacial', 'Tofu proteico', 'Peixe selado NASA'];
const VEGGIES = ['Brócolis da estufa', 'Tomates-cereja', 'Salada de folhas verdes'];
const CARBS = ['Quinoa espacial', 'Arroz integral', 'Tortilha integral'];

const WATER_OPTIONS: { id: WaterDoseId; label: string; note: string; feedback: string }[] = [
  {
    id: 'LOW',
    label: 'Pouca Água (100 ml)',
    note: 'Insuficiente após exercícios',
    feedback: 'Cuidado! 100 ml é pouco depois dos exercícios físicos. O corpo precisa se hidratar bem!',
  },
  {
    id: 'IDEAL',
    label: 'Dose Equilibrada (350 ml)',
    note: 'Hidratação certa sem desperdício',
    feedback: 'Perfeito! 350 ml repõe o líquido gasto no treino sem desperdiçar nossa preciosa reserva de água em Marte.',
  },
  {
    id: 'WASTE',
    label: 'Dispensador Aberto (900 ml)',
    note: 'Desperdício no reservatório',
    feedback: 'Ops! Abrir água demais gera desperdício. Em Marte cada gota é reciclada e controlada!',
  },
];

interface Step2NutritionGalleyProps {
  onComplete: () => void;
  onCapiFeedback: (line: string) => void;
}

export const Step2NutritionGalley: React.FC<Step2NutritionGalleyProps> = ({
  onComplete,
  onCapiFeedback,
}) => {
  const { state, updateMission2, updateStats } = useGameStore();
  const { selectedProtein, selectedVeggie, selectedCarb, waterDose } = state.mission2;

  const hasBalancedPlate = Boolean(selectedProtein && selectedVeggie && selectedCarb);
  const hasIdealWater = waterDose === 'IDEAL';
  const canFinish = hasBalancedPlate && hasIdealWater;

  const handleSelectWater = (opt: (typeof WATER_OPTIONS)[number]) => {
    if (opt.id === 'IDEAL') {
      soundEngine.playSuccess();
    } else {
      soundEngine.playAlert();
    }
    updateMission2({ waterDose: opt.id });
    onCapiFeedback(opt.feedback);
  };

  const handleConfirmMeal = () => {
    soundEngine.playSuccess();
    updateMission2({ nutritionCompleted: true });
    updateStats({
      water: Math.min(95, state.stats.water + 8),
      health: 100,
    });
    onComplete();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-sm border-2 border-emerald-500/50 bg-slate-900/90 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Utensils className="h-4 w-4 text-emerald-300" />
            <h2 className="font-pixel text-[11px] text-emerald-300">
              DESAFIO 2.2 — ALIMENTAÇÃO EQUILIBRADA E HIDRATAÇÃO
            </h2>
          </div>
          <span className="font-dialog text-xs text-slate-300">
            Combine os 3 grupos nutricionais + dose exata de água
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_1.15fr]">
        {/* Cenário 16-bit do refeitório */}
        <div className="space-y-3">
          <div className="pixel-box relative aspect-video overflow-hidden bg-slate-900">
            <img
              src={ASSET_MANIFEST.habitatGalley.path}
              alt={ASSET_MANIFEST.habitatGalley.alt}
              className="pixel-art h-full w-full object-cover"
            />
          </div>

          {/* Prato montado pelo jogador */}
          <div className="rounded-sm border-2 border-slate-800 bg-slate-900 p-3 font-dialog text-xs">
            <span className="block font-pixel text-[9px] text-amber-300">
              BANDEJA DO ASTRONAUTA
            </span>
            <ul className="mt-2 space-y-1 text-slate-200">
              <li>• Proteína: {selectedProtein ?? 'Escolha 1 opção'}</li>
              <li>• Vegetal: {selectedVeggie ?? 'Escolha 1 opção'}</li>
              <li>• Carboidrato: {selectedCarb ?? 'Escolha 1 opção'}</li>
              <li>
                • Hidratação:{' '}
                {waterDose
                  ? WATER_OPTIONS.find((w) => w.id === waterDose)?.label
                  : 'Escolha a dose'}
              </li>
            </ul>
          </div>
        </div>

        {/* Minigame de combinação nutricional e água */}
        <div className="space-y-3">
          {/* Grupo 1: Proteína */}
          <div className="rounded-sm border border-slate-800 bg-slate-900/90 p-2.5">
            <span className="mb-1.5 block font-pixel text-[9px] text-orange-300">
              1. PROTEÍNAS (MÚSCULOS)
            </span>
            <div className="grid gap-1.5 sm:grid-cols-3">
              {PROTEINS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    updateMission2({ selectedProtein: item });
                  }}
                  className={`rounded-sm border px-2 py-1.5 font-dialog text-[11px] ${
                    selectedProtein === item
                      ? 'border-orange-400 bg-orange-950/70 text-orange-100'
                      : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Grupo 2: Vegetais */}
          <div className="rounded-sm border border-slate-800 bg-slate-900/90 p-2.5">
            <span className="mb-1.5 block font-pixel text-[9px] text-emerald-300">
              2. VEGETAIS (VITAMINAS E FIBRAS)
            </span>
            <div className="grid gap-1.5 sm:grid-cols-3">
              {VEGGIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    updateMission2({ selectedVeggie: item });
                  }}
                  className={`rounded-sm border px-2 py-1.5 font-dialog text-[11px] ${
                    selectedVeggie === item
                      ? 'border-emerald-400 bg-emerald-950/70 text-emerald-100'
                      : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Grupo 3: Carboidratos */}
          <div className="rounded-sm border border-slate-800 bg-slate-900/90 p-2.5">
            <span className="mb-1.5 block font-pixel text-[9px] text-amber-300">
              3. CARBOIDRATOS (ENERGIA)
            </span>
            <div className="grid gap-1.5 sm:grid-cols-3">
              {CARBS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    updateMission2({ selectedCarb: item });
                  }}
                  className={`rounded-sm border px-2 py-1.5 font-dialog text-[11px] ${
                    selectedCarb === item
                      ? 'border-amber-400 bg-amber-950/70 text-amber-100'
                      : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Grupo 4: Hidratação sem desperdício */}
          <div className="rounded-sm border border-slate-800 bg-slate-900/90 p-2.5">
            <span className="mb-1.5 inline-flex items-center gap-1.5 font-pixel text-[9px] text-sky-300">
              <Droplets className="h-3.5 w-3.5" />
              4. DOSAGEM DE ÁGUA (EVITE DESPERDÍCIO)
            </span>
            <div className="grid gap-1.5 sm:grid-cols-3">
              {WATER_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectWater(opt)}
                  className={`rounded-sm border p-2 text-left font-dialog text-[11px] ${
                    waterDose === opt.id
                      ? opt.id === 'IDEAL'
                        ? 'border-sky-400 bg-sky-950/70 text-sky-100'
                        : 'border-rose-400 bg-rose-950/60 text-rose-100'
                      : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <strong className="block">{opt.label}</strong>
                  <span className="text-[10px] text-slate-400">{opt.note}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={!canFinish}
            onClick={handleConfirmMeal}
            className="pixel-btn flex w-full items-center justify-center gap-2 bg-emerald-400 px-4 py-2.5 font-pixel text-[10px] text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <CheckCircle2 className="h-4 w-4" />
            {canFinish
              ? 'Confirmar Refeição & Ir para Higiene (Desafio 2.3) ▶'
              : 'Monte os 3 grupos alimentares e escolha a dose ideal (350 ml)'}
          </button>
        </div>
      </div>
    </div>
  );
};
