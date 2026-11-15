import React from 'react';
import { CheckCircle2, Flower2, Leaf } from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

const VEGETABLES = ['Alface', 'Tomate', 'Cenoura'];
const FRUITS = ['Morango'];
const GRAINS = ['Trigo'];
const ORNAMENTALS = ['Flores Ornamentais'];

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

  const allGroupsPicked = Boolean(
    crops.vegetable && crops.fruit && crops.grain && crops.ornamental
  );

  return (
    <div className="space-y-4">
      <div className="rounded-sm border-2 border-emerald-500/50 bg-slate-900/90 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-emerald-300" />
            <h2 className="font-pixel text-[11px] text-emerald-200">
              DESAFIO 4.3 — SELECIONANDO AS ESPÉCIES VEGETAIS (4 GRUPOS)
            </h2>
          </div>
          <span className="font-dialog text-xs text-slate-300">
            Grupos selecionados:{' '}
            {[crops.vegetable, crops.fruit, crops.grain, crops.ornamental].filter(Boolean)
              .length}
            /4
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_1.15fr]">
        <div className="space-y-3">
          <div className="pixel-box relative flex aspect-video items-center justify-center overflow-hidden bg-slate-900 p-4">
            <img
              src={ASSET_MANIFEST.marsCropsTray.path}
              alt={ASSET_MANIFEST.marsCropsTray.alt}
              className="pixel-art max-h-full w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.65)]"
            />
          </div>

          <div className="rounded-sm border border-slate-800 bg-slate-900 p-3 font-dialog text-xs text-slate-200">
            <span className="block font-pixel text-[9px] text-amber-300">
              PLANO BOTÂNICO DA ESTUFA
            </span>
            <ul className="mt-2 space-y-1">
              <li>• 1. Hortaliças: {crops.vegetable ?? 'Escolha abaixo'}</li>
              <li>• 2. Frutíferas: {crops.fruit ?? 'Escolha abaixo'}</li>
              <li>• 3. Cereais: {crops.grain ?? 'Escolha abaixo'}</li>
              <li>• 4. Ornamentais: {crops.ornamental ?? 'Escolha abaixo'}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-2.5">
          {/* Grupo 1: Hortaliças */}
          <div className="rounded-sm border border-slate-800 bg-slate-900 p-2.5">
            <span className="mb-1.5 block font-pixel text-[9px] text-emerald-300">
              1. HORTALIÇAS E VEGETAIS
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {VEGETABLES.map((veg) => (
                <button
                  key={veg}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    updateMission4({
                      selectedCrops: { ...crops, vegetable: veg },
                    });
                    onCapiFeedback(
                      `${veg} selecionado! Hortaliças crescem rápido e fornecem vitaminas frescas para a equipe.`
                    );
                  }}
                  className={`rounded-sm border px-2 py-1.5 font-dialog text-xs ${
                    crops.vegetable === veg
                      ? 'border-emerald-400 bg-emerald-950/70 text-emerald-100 font-bold'
                      : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-emerald-400'
                  }`}
                >
                  {veg}
                </button>
              ))}
            </div>
          </div>

          {/* Grupo 2: Frutíferas */}
          <div className="rounded-sm border border-slate-800 bg-slate-900 p-2.5">
            <span className="mb-1.5 block font-pixel text-[9px] text-rose-300">
              2. PLANTAS FRUTÍFERAS
            </span>
            {FRUITS.map((fruit) => (
              <button
                key={fruit}
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  updateMission4({
                    selectedCrops: { ...crops, fruit },
                  });
                  onCapiFeedback(
                    'Morango adicionado! Pequenas frutíferas produzem alimento rico em antioxidantes dentro da estufa.'
                  );
                }}
                className={`flex w-full items-center justify-between rounded-sm border px-3 py-2 font-dialog text-xs ${
                  crops.fruit === fruit
                    ? 'border-rose-400 bg-rose-950/70 text-rose-100 font-bold'
                    : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-rose-400'
                }`}
              >
                <span>{fruit} (Porte compacto ideal para estufa espacial)</span>
                {crops.fruit === fruit && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
              </button>
            ))}
          </div>

          {/* Grupo 3: Cereais */}
          <div className="rounded-sm border border-slate-800 bg-slate-900 p-2.5">
            <span className="mb-1.5 block font-pixel text-[9px] text-amber-300">
              3. CEREAIS ENERGÉTICOS
            </span>
            {GRAINS.map((grain) => (
              <button
                key={grain}
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  updateMission4({
                    selectedCrops: { ...crops, grain },
                  });
                  onCapiFeedback(
                    'Trigo selecionado! Cereais ajudam a produzir carboidratos para missões de longa duração.'
                  );
                }}
                className={`flex w-full items-center justify-between rounded-sm border px-3 py-2 font-dialog text-xs ${
                  crops.grain === grain
                    ? 'border-amber-400 bg-amber-950/70 text-amber-100 font-bold'
                    : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-amber-400'
                }`}
              >
                <span>{grain} (Fonte de energia e fibras)</span>
                {crops.grain === grain && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
              </button>
            ))}
          </div>

          {/* Grupo 4: Ornamentais */}
          <div className="rounded-sm border border-slate-800 bg-slate-900 p-2.5">
            <span className="mb-1.5 flex items-center gap-1 font-pixel text-[9px] text-fuchsia-300">
              <Flower2 className="h-3.5 w-3.5" />
              4. PLANTAS ORNAMENTAIS (BEM-ESTAR)
            </span>
            {ORNAMENTALS.map((orn) => (
              <button
                key={orn}
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  updateMission4({
                    selectedCrops: { ...crops, ornamental: orn },
                  });
                  onCapiFeedback(
                    'Flores escolhidas! Na NASA, cultivar flores também melhora o bem-estar e o humor dos astronautas longe da Terra!'
                  );
                }}
                className={`flex w-full items-center justify-between rounded-sm border px-3 py-2 font-dialog text-xs ${
                  crops.ornamental === orn
                    ? 'border-fuchsia-400 bg-fuchsia-950/70 text-fuchsia-100 font-bold'
                    : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-fuchsia-400'
                }`}
              >
                <span>{orn} (Apoio psicológico à equipe no habitat)</span>
                {crops.ornamental === orn && (
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
              ? 'Plantar e Acompanhar Crescimento (Desafio 4.4) ▶'
              : 'Selecione 1 espécie de cada um dos 4 grupos'}
          </button>
        </div>
      </div>
    </div>
  );
};
