import React from 'react';
import { BatteryCharging, CheckCircle2, Search, Sparkles } from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

interface Step2SolarMaintenanceProps {
  onComplete: () => void;
  onCapiFeedback: (line: string) => void;
}

export const Step2SolarMaintenance: React.FC<Step2SolarMaintenanceProps> = ({
  onComplete,
  onCapiFeedback,
}) => {
  const { state, updateMission5, updateStats } = useGameStore();
  const { inspectedDrop, remoteCleaningTriggered } = state.mission5.postDustSolar;

  const handleInspect = () => {
    soundEngine.playClick();
    updateMission5({
      postDustSolar: {
        ...state.mission5.postDustSolar,
        inspectedDrop: true,
      },
    });
    onCapiFeedback(
      'Diagnóstico concluído! A camada de poeira alaranjada caiu a geração de 480 W para 165 W. Agora ative o sistema remoto de limpeza sem sair em exposição!'
    );
  };

  const handleRemoteClean = () => {
    if (!inspectedDrop) {
      soundEngine.playAlert();
      onCapiFeedback('Antes de limpar, inspecione a telemetria para medir a perda nos painéis!');
      return;
    }
    soundEngine.playSuccess();
    updateMission5({
      postDustSolar: {
        inspectedDrop: true,
        remoteCleaningTriggered: true,
      },
    });
    updateStats({ energy: 100 });
    onCapiFeedback(
      'Limpeza remota concluída! A poeira foi removida dos painéis e nossa geração voltou para 480 W sem colocar o astronauta em risco!'
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-sm border-2 border-amber-500/60 bg-slate-900/90 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BatteryCharging className="h-4 w-4 text-amber-300" />
            <h2 className="font-pixel text-[11px] text-amber-200">
              DESAFIO 5.2 — INSPEÇÃO E LIMPEZA DOS PAINÉIS SOLARES
            </h2>
          </div>
          <span
            className={`font-pixel text-[9px] ${
              remoteCleaningTriggered ? 'text-emerald-300' : 'text-amber-300'
            }`}
          >
            GERAÇÃO ATUAL: {remoteCleaningTriggered ? '480 W (100%)' : '165 W (EMPOEIRADO)'}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_1.15fr]">
        {/* Visual do painel solar empoeirado -> limpo */}
        <div className="pixel-box relative flex aspect-video flex-col items-center justify-center bg-gradient-to-b from-orange-950 to-stone-950 p-4">
          <img
            src={
              remoteCleaningTriggered
                ? ASSET_MANIFEST.solarPanelClean.path
                : ASSET_MANIFEST.solarPanelDusty.path
            }
            alt={
              remoteCleaningTriggered
                ? ASSET_MANIFEST.solarPanelClean.alt
                : ASSET_MANIFEST.solarPanelDusty.alt
            }
            className="pixel-art h-40 w-auto object-contain transition duration-500 sm:h-48"
          />
          <div
            className={`mt-2 rounded-sm border px-3 py-1 font-pixel text-[8px] ${
              remoteCleaningTriggered
                ? 'border-emerald-400 bg-emerald-950/80 text-emerald-200'
                : 'border-orange-400 bg-orange-950/80 text-orange-200'
            }`}
          >
            {remoteCleaningTriggered
              ? 'PAINÉIS LIMPOS • BATERIAS EM 100%'
              : 'CAMADA DENSA DE POEIRA MARCIANA DETECTADA'}
          </div>
        </div>

        {/* Botões de inspeção e limpeza remota */}
        <div className="flex flex-col justify-between gap-3">
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleInspect}
              className={`flex w-full items-start justify-between gap-2 rounded-sm border-2 p-3 text-left transition ${
                inspectedDrop
                  ? 'border-cyan-400 bg-cyan-950/50 text-cyan-100'
                  : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-cyan-400'
              }`}
            >
              <div>
                <p className="flex items-center gap-1.5 font-dialog text-xs font-bold text-cyan-300">
                  <Search className="h-4 w-4" />
                  1. Inspecionar Queda de Energia e Poeira Acumulada
                </p>
                <p className="mt-1 font-dialog text-xs text-slate-300">
                  Mede a perda de watts pelos sensores de bordo antes de liberar saída externa.
                </p>
              </div>
              {inspectedDrop && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />}
            </button>

            <button
              type="button"
              onClick={handleRemoteClean}
              className={`flex w-full items-start justify-between gap-2 rounded-sm border-2 p-3 text-left transition ${
                remoteCleaningTriggered
                  ? 'border-emerald-400 bg-emerald-950/50 text-emerald-100'
                  : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-emerald-400'
              }`}
            >
              <div>
                <p className="flex items-center gap-1.5 font-dialog text-xs font-bold text-emerald-300">
                  <Sparkles className="h-4 w-4" />
                  2. Acionar Limpeza Automatizada de Manutenção
                </p>
                <p className="mt-1 font-dialog text-xs text-slate-300">
                  Escovas eletrostáticas e sopradores removem a poeira sem expor o astronauta.
                </p>
              </div>
              {remoteCleaningTriggered && (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
              )}
            </button>
          </div>

          <button
            type="button"
            disabled={!remoteCleaningTriggered}
            onClick={() => {
              soundEngine.playAlert();
              onComplete();
            }}
            className="pixel-btn w-full bg-emerald-400 px-4 py-2.5 font-pixel text-[10px] text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {remoteCleaningTriggered
              ? 'Energia Restaurada — Próximo Monitoramento (Desafio 5.3) ▶'
              : 'Inspecione e limpe os painéis solares para continuar'}
          </button>
        </div>
      </div>
    </div>
  );
};
