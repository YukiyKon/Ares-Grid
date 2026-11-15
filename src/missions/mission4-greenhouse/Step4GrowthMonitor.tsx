import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Droplets,
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

const GROWTH_LABELS: Record<0 | 1 | 2 | 3, { stage: string; height: string; roots: string }> = {
  0: {
    stage: 'Sementes e Mudas Plantadas',
    height: '2 cm',
    roots: 'Iniciando contato com nutrientes',
  },
  1: {
    stage: 'Germinação Concluída',
    height: '8 cm',
    roots: 'Raízes brancas jovens se expandindo',
  },
  2: {
    stage: 'Desenvolvimento de Folhas',
    height: '19 cm',
    roots: 'Rede radicular forte absorvendo água e sais',
  },
  3: {
    stage: 'Colheita Saudável Pronta!',
    height: '32 cm',
    roots: 'Crescimento vigoroso sem estresse',
  },
};

interface Step4GrowthMonitorProps {
  onComplete: () => void;
  onCapiFeedback: (line: string) => void;
}

export const Step4GrowthMonitor: React.FC<Step4GrowthMonitorProps> = ({
  onComplete,
  onCapiFeedback,
}) => {
  const { state, updateMission4 } = useGameStore();
  const { envSettings, growthStage, selectedCrops } = state.mission4;

  const isBalanced =
    envSettings.light === 'IDEAL' &&
    envSettings.waterNutrient === 'IDEAL' &&
    envSettings.tempHumidity === 'IDEAL';

  const info = GROWTH_LABELS[growthStage];

  const handleAdvanceGrowth = () => {
    if (!isBalanced) {
      soundEngine.playAlert();
      onCapiFeedback(
        'Sinal de estresse nas plantas! Ajuste Iluminação LED, Água/Nutrientes e Temperatura para o nível IDEAL antes de avançar.'
      );
      return;
    }

    if (growthStage < 3) {
      const next = (growthStage + 1) as 1 | 2 | 3;
      soundEngine.playSuccess();
      updateMission4({ growthStage: next });
      if (next === 1) {
        onCapiFeedback(
          'Germinação perfeita! Com luz e umidade certas, as primeiras folhas já estão aparecendo.'
        );
      } else if (next === 2) {
        onCapiFeedback(
          'Raízes e folhas crescendo rápido! Estamos observando a altura e conferindo que não há pragas ou estresse.'
        );
      } else {
        onCapiFeedback(
          'Colheita em Marte! Nossas hortaliças, morangos, trigo e flores cresceram saudáveis dentro do domo!'
        );
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-sm border-2 border-emerald-500/50 bg-slate-900/90 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sprout className="h-4 w-4 text-emerald-300" />
            <h2 className="font-pixel text-[11px] text-emerald-200">
              DESAFIO 4.4 — ACOMPANHANDO O CRESCIMENTO E EVITANDO ESTRESSE
            </h2>
          </div>
          <span className="font-pixel text-[9px] text-cyan-300">
            ESTÁGIO: {growthStage}/3 ({Math.round((growthStage / 3) * 100)}%)
          </span>
        </div>

        <div className="mt-2 h-3 w-full overflow-hidden rounded-sm border border-slate-700 bg-slate-950">
          <div
            style={{ width: `${Math.max(12, Math.round((growthStage / 3) * 100))}%` }}
            className={`h-full transition-all duration-300 ${
              isBalanced ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_1.15fr]">
        {/* Telemetria visual do cultivo */}
        <div className="space-y-3">
          <div className="pixel-box relative flex aspect-video items-center justify-center overflow-hidden bg-slate-900 p-4">
            <img
              src={ASSET_MANIFEST.marsCropsTray.path}
              alt={ASSET_MANIFEST.marsCropsTray.alt}
              className="pixel-art transition-transform duration-500"
              style={{ transform: `scale(${0.75 + growthStage * 0.1})` }}
            />
            <div className="absolute bottom-2 left-2 rounded-sm border border-emerald-400/70 bg-slate-950/90 px-2 py-0.5 font-pixel text-[8px] text-emerald-200">
              {info.stage}
            </div>
          </div>

          <div className="rounded-sm border border-slate-800 bg-slate-900 p-3 font-dialog text-xs text-slate-200">
            <p>
              <strong>Culturas monitoradas:</strong> {selectedCrops.vegetable ?? 'Alface'},{' '}
              {selectedCrops.fruit ?? 'Morango'}, {selectedCrops.grain ?? 'Trigo'} e{' '}
              {selectedCrops.ornamental ?? 'Flores'}
            </p>
            <p className="mt-1">
              <strong>Altura média:</strong> {info.height} • <strong>Raízes:</strong>{' '}
              {info.roots}
            </p>
            <p className="mt-1">
              <strong>Saúde vegetal:</strong>{' '}
              {isBalanced ? (
                <span className="text-emerald-300">Sem sinais de estresse!</span>
              ) : (
                <span className="text-amber-300">
                  Estresse detectado — ajuste os 3 controles para IDEAL!
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Painel de controle ambiental (Luz, Água/Nutrientes, Temperatura) */}
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
                    className={`rounded-sm border px-2 py-1.5 ${
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
                    className={`rounded-sm border px-2 py-1.5 ${
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
                    className={`rounded-sm border px-2 py-1.5 ${
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

          {!isBalanced && (
            <div className="flex items-center gap-2 rounded-sm border border-amber-500/60 bg-amber-950/50 px-2.5 py-2 font-dialog text-xs text-amber-200">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Ajuste Luz, Água/Nutrientes e Temperatura para o nível Ideal.</span>
            </div>
          )}

          {growthStage < 3 ? (
            <button
              type="button"
              onClick={handleAdvanceGrowth}
              className="pixel-btn w-full bg-amber-400 px-4 py-2.5 font-pixel text-[10px] text-slate-950 hover:bg-amber-300"
            >
              Acompanhar Próxima Fase de Crescimento ({growthStage}/3) ▶
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                soundEngine.playSuccess();
                onComplete();
              }}
              className="pixel-btn flex w-full items-center justify-center gap-2 bg-emerald-400 px-4 py-2.5 font-pixel text-[10px] text-slate-950 hover:bg-emerald-300"
            >
              <CheckCircle2 className="h-4 w-4" />
              Integrar Sistema Bioregenerativo (Desafio 4.5) ▶
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
