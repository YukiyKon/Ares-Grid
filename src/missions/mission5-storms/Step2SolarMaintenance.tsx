import React, { useEffect, useRef, useState } from 'react';
import { BatteryCharging, CheckCircle2, Hand, RotateCcw, Sparkles } from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { DustScrubCanvas } from '../../components/minigames/DustScrubCanvas';
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
  const { remoteCleaningTriggered } = state.mission5.postDustSolar;

  const [scrubPct, setScrubPct] = useState(0);
  const [dustKey, setDustKey] = useState(1);
  const hasInitRef = useRef(false);

  // Garante início empoeirado pós-tempestade para exigir limpeza real no canvas
  useEffect(() => {
    if (hasInitRef.current) return;
    hasInitRef.current = true;
    if (!state.mission5.mission5Completed) {
      setScrubPct(0);
      setDustKey((k) => k + 1);
      updateMission5({
        postDustSolar: {
          inspectedDrop: true,
          remoteCleaningTriggered: false,
        },
      });
    } else if (remoteCleaningTriggered) {
      setScrubPct(100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRestartDust = () => {
    soundEngine.playClick();
    setScrubPct(0);
    setDustKey((k) => k + 1);
    updateMission5({
      postDustSolar: {
        inspectedDrop: true,
        remoteCleaningTriggered: false,
      },
    });
    onCapiFeedback(
      'Camada pós-tempestade aplicada! Esfregue o painel solar até atingir 90%+ limpo e restaurar 480 W.'
    );
  };

  const handleScrubComplete = () => {
    if (remoteCleaningTriggered) return;
    soundEngine.playSuccess();
    setScrubPct(100);
    updateMission5({
      postDustSolar: {
        inspectedDrop: true,
        remoteCleaningTriggered: true,
      },
    });
    updateStats({ energy: 100 });
    onCapiFeedback(
      'Painel restaurado para 480 W (100%)! Você removeu toda a poeira marciana depositada pela tempestade.'
    );
  };

  const liveWatts = remoteCleaningTriggered
    ? 480
    : Math.round(165 + (scrubPct / 100) * (480 - 165));

  return (
    <div className="space-y-4 pb-32">
      <div className="rounded-sm border-2 border-amber-500/60 bg-slate-900/90 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BatteryCharging className="h-4 w-4 text-amber-300" />
            <h2 className="font-pixel text-[11px] text-amber-200">
              DESAFIO 5.2 — LIMPEZA PÓS-TEMPESTADE NO PAINEL SOLAR
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`font-pixel text-[9px] ${
                remoteCleaningTriggered ? 'text-emerald-300' : 'text-amber-300'
              }`}
            >
              GERAÇÃO: {liveWatts} W ({remoteCleaningTriggered ? '100%' : `${scrubPct}% limpo`})
            </span>
            <button
              type="button"
              onClick={handleRestartDust}
              className="inline-flex items-center gap-1 rounded-sm border border-slate-700 bg-slate-950 px-2 py-1 font-dialog text-[11px] text-slate-300 hover:border-amber-400"
            >
              <RotateCcw className="h-3 w-3" />
              Reiniciar
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.05fr_1.15fr]">
        {/* Canvas interativo de esfregar poeira pós-tempestade */}
        <div className="pixel-box flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-orange-950 to-stone-950 p-4">
          <div className="flex w-full items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-pixel text-[9px] text-amber-200">
              <Hand className="h-3.5 w-3.5 text-amber-300" />
              ESFREGUE COM O MOUSE OU DEDO ({remoteCleaningTriggered ? '100%' : `${scrubPct}%`})
            </span>
            {remoteCleaningTriggered && (
              <span className="flex items-center gap-1 rounded-xs bg-emerald-500/20 px-2 py-0.5 font-pixel text-[8px] text-emerald-300">
                <Sparkles className="h-3 w-3" />
                480 W OK
              </span>
            )}
          </div>

          <DustScrubCanvas
            cleanImageSrc={ASSET_MANIFEST.solarPanelClean.path}
            cleanImageAlt={ASSET_MANIFEST.solarPanelClean.alt}
            activeDust={!remoteCleaningTriggered}
            dustKey={dustKey}
            onScrubProgress={setScrubPct}
            onScrubComplete={handleScrubComplete}
          />

          <div
            className={`rounded-sm border px-3 py-1 font-pixel text-[8px] ${
              remoteCleaningTriggered
                ? 'border-emerald-400 bg-emerald-950/80 text-emerald-200'
                : 'border-orange-400 bg-orange-950/80 text-orange-200'
            }`}
          >
            {remoteCleaningTriggered
              ? 'PAINÉIS LIMPOS • 480 W RESTAURADOS!'
              : 'CAMADA ESPESSA DE POEIRA PÓS-TEMPESTADE'}
          </div>
        </div>

        {/* Telemetria em tempo real e avanço */}
        <div className="flex flex-col justify-between gap-3">
          <div className="space-y-3 rounded-sm border border-slate-800 bg-slate-900 p-3 font-dialog text-xs">
            <p className="font-pixel text-[9px] text-cyan-300">
              TELEMETRIA FOTOVOLTAICA EM TEMPO REAL
            </p>
            <p className="text-slate-200">
              A tempestade depositou uma crosta espessa de regolito sobre os painéis, reduzindo a
              geração para <strong>165 W</strong>.
            </p>

            {/* Barra de potência restaurada */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-300">Potência Recuperada:</span>
                <strong className={remoteCleaningTriggered ? 'text-emerald-300' : 'text-amber-300'}>
                  {liveWatts} W / 480 W
                </strong>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-sm border border-slate-700 bg-slate-950">
                <div
                  style={{ width: `${Math.round((liveWatts / 480) * 100)}%` }}
                  className={`h-full transition-all duration-150 ${
                    remoteCleaningTriggered ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-sm border border-slate-700 bg-slate-950 p-2.5">
              <CheckCircle2
                className={`h-5 w-5 shrink-0 ${
                  remoteCleaningTriggered ? 'text-emerald-400' : 'text-slate-600'
                }`}
              />
              <span className="text-slate-200">
                {remoteCleaningTriggered
                  ? 'Limpeza concluída (> 90%)! Baterias da Base Arcadia recarregadas para 100%.'
                  : 'Limpe pelo menos 90% da poeira no quadro ao lado para restaurar 480 W.'}
              </span>
            </div>
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
              ? 'Energia Restaurada — Alerta Solar (Desafio 5.3) ▶'
              : `Esfregue o painel até limpar 90%+ (${scrubPct}%)`}
          </button>
        </div>
      </div>
    </div>
  );
};
