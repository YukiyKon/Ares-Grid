import React from 'react';
import { AlertTriangle, CheckCircle2, Droplets, Sprout, Wind } from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

interface Step2CultivationMethodsProps {
  onComplete: () => void;
  onCapiFeedback: (line: string) => void;
}

export const Step2CultivationMethods: React.FC<Step2CultivationMethodsProps> = ({
  onComplete,
  onCapiFeedback,
}) => {
  const { state, updateMission4 } = useGameStore();
  const { methodsInspected, selectedMethod } = state.mission4;
  const bothCleanTested =
    methodsInspected.hydroponics && methodsInspected.aeroponics;

  return (
    <div className="space-y-4">
      <div className="rounded-sm border-2 border-cyan-500/50 bg-slate-900/90 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sprout className="h-4 w-4 text-emerald-300" />
            <h2 className="font-pixel text-[11px] text-cyan-200">
              DESAFIO 4.2 — MÉTODOS DE CULTIVO (HIDROPONIA, AEROPONIA E REGOLITO)
            </h2>
          </div>
          <span className="font-dialog text-xs text-slate-300">
            Explore os métodos acima antes de confirmar
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.05fr_1.15fr]">
        <div className="pixel-box relative aspect-video overflow-hidden bg-slate-900">
          <img
            src={ASSET_MANIFEST.hydroAeroStation.path}
            alt={ASSET_MANIFEST.hydroAeroStation.alt}
            className="pixel-art h-full w-full object-cover"
          />
          <div className="absolute bottom-2 left-2 rounded-sm border border-emerald-400/70 bg-slate-950/90 px-2 py-0.5 font-pixel text-[8px] text-emerald-200">
            HIDROPONIA (ESQ.) • AEROPONIA (DIR.)
          </div>
        </div>

        <div className="flex flex-col justify-between gap-2.5">
          {/* Hidroponia */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playSuccess();
              updateMission4({
                methodsInspected: { ...methodsInspected, hydroponics: true },
              });
              onCapiFeedback(
                'Hidroponia ativada! As raízes ficam em canais com água e nutrientes minerais dosados, sem precisar de solo!'
              );
            }}
            className={`flex items-start justify-between gap-2 rounded-sm border-2 p-2.5 text-left transition ${
              methodsInspected.hydroponics
                ? 'border-cyan-400 bg-cyan-950/50 text-cyan-100'
                : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-cyan-400'
            }`}
          >
            <div>
              <p className="flex items-center gap-1.5 font-pixel text-[9px] text-cyan-300">
                <Droplets className="h-3.5 w-3.5" />
                MÉTODO A — HIDROPONIA
              </p>
              <p className="mt-1 font-dialog text-xs text-slate-300">
                Raízes recebem água oxigenada com nutrientes dissolvidos em canais limpos.
              </p>
            </div>
            {methodsInspected.hydroponics && (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
            )}
          </button>

          {/* Aeroponia */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playSuccess();
              updateMission4({
                methodsInspected: { ...methodsInspected, aeroponics: true },
              });
              onCapiFeedback(
                'Aeroponia ativada! As raízes ficam suspensas recebendo uma névoa nutritiva super econômica em água!'
              );
            }}
            className={`flex items-start justify-between gap-2 rounded-sm border-2 p-2.5 text-left transition ${
              methodsInspected.aeroponics
                ? 'border-emerald-400 bg-emerald-950/50 text-emerald-100'
                : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-emerald-400'
            }`}
          >
            <div>
              <p className="flex items-center gap-1.5 font-pixel text-[9px] text-emerald-300">
                <Wind className="h-3.5 w-3.5" />
                MÉTODO B — AEROPONIA
              </p>
              <p className="mt-1 font-dialog text-xs text-slate-300">
                Raízes suspensas recebem névoa controlada de água e nutrientes.
              </p>
            </div>
            {methodsInspected.aeroponics && (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
            )}
          </button>

          {/* Teste / Alerta do Regolito Marciano Bruto */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playAlert();
              updateMission4({
                methodsInspected: { ...methodsInspected, rawRegolithTested: true },
              });
              onCapiFeedback(
                'Atenção científica! O regolito marciano bruto pode conter percloratos e não é adequado para plantar direto sem tratamento prévio!'
              );
            }}
            className={`flex items-start justify-between gap-2 rounded-sm border-2 p-2.5 text-left transition ${
              methodsInspected.rawRegolithTested
                ? 'border-amber-400 bg-amber-950/50 text-amber-100'
                : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-amber-400'
            }`}
          >
            <div>
              <p className="flex items-center gap-1.5 font-pixel text-[9px] text-amber-300">
                <AlertTriangle className="h-3.5 w-3.5" />
                TESTAR REGOLITO MARCIANO BRUTO
              </p>
              <p className="mt-1 font-dialog text-xs text-slate-300">
                Solo direto de Marte — exige tratamento químico/mineral antes de qualquer uso agrícola.
              </p>
            </div>
            {methodsInspected.rawRegolithTested && (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-amber-300" />
            )}
          </button>

          <button
            type="button"
            disabled={!bothCleanTested}
            onClick={() => {
              soundEngine.playSuccess();
              updateMission4({ selectedMethod: 'HYDRO_AERO' });
              onComplete();
            }}
            className="pixel-btn mt-1 w-full bg-emerald-400 px-4 py-2.5 font-pixel text-[10px] text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {selectedMethod === 'HYDRO_AERO' || bothCleanTested
              ? 'Adotar Hidroponia + Aeroponia (Desafio 4.3) ▶'
              : 'Teste Hidroponia e Aeroponia para continuar'}
          </button>
        </div>
      </div>
    </div>
  );
};
