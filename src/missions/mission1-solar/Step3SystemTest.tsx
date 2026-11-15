import React, { useState } from 'react';
import {
  BatteryCharging,
  BookOpen,
  CheckCircle2,
  Clock,
  Moon,
  Sparkles,
  Wind,
  Zap,
} from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

interface Step3SystemTestProps {
  onCapiFeedback: (line: string) => void;
  onReturnToBase: () => void;
}

export const Step3SystemTest: React.FC<Step3SystemTestProps> = ({
  onCapiFeedback,
  onReturnToBase,
}) => {
  const { state, updateMission1, openModal } = useGameStore();
  const [timePhase, setTimePhase] = useState<'DAY' | 'DUSK'>('DAY');
  const [hasDust, setHasDust] = useState(false);
  const [economyMode, setEconomyMode] = useState(state.mission1.powerSaveTested);

  const baseWatts = Math.max(360, state.mission1.generatedWatts || 480);
  const sunMultiplier = timePhase === 'DAY' ? 1 : 0.48;
  const dustMultiplier = hasDust ? 0.62 : 1;
  const currentGenerationW = Math.round(baseWatts * sunMultiplier * dustMultiplier);
  const habitatConsumptionW = economyMode ? 180 : 320;
  const netBalanceW = currentGenerationW - habitatConsumptionW;
  const batteryPercent =
    timePhase === 'DAY'
      ? hasDust
        ? 82
        : 100
      : economyMode
      ? hasDust
        ? 68
        : 84
      : 42;

  const readyForClosure = state.mission1.dustCleaned && state.mission1.powerSaveTested;

  const handleSimulateTimeAndDust = () => {
    soundEngine.playAlert();
    setTimePhase('DUSK');
    setHasDust(true);
    onCapiFeedback(
      'Olhe o painel! O Sol baixou no entardecer e o vento trouxe poeira marciana. A geração caiu!'
    );
  };

  const handleCleanPanel = () => {
    soundEngine.playSuccess();
    setHasDust(false);
    updateMission1({ dustCleaned: true });
    onCapiFeedback(
      'Muito bem! Sem a poeira acumulada, as células fotovoltaicas voltaram a captar muito mais luz solar.'
    );
  };

  const handleToggleEconomy = () => {
    soundEngine.playClick();
    const next = !economyMode;
    setEconomyMode(next);
    if (next) {
      updateMission1({ powerSaveTested: true });
      onCapiFeedback(
        'Modo Economia ativado! Reduzimos o consumo do habitat para proteger as baterias durante a noite marciana.'
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-sm border-2 border-emerald-500/50 bg-slate-900/90 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-400" />
            <h2 className="font-pixel text-[11px] text-emerald-300">
              DESAFIO 1.3 — PAINEL DE CONTROLE SOLAR, BATERIA E POEIRA
            </h2>
          </div>
          <span className="rounded-sm border border-cyan-400/50 bg-cyan-950/60 px-2 py-0.5 font-dialog text-xs text-cyan-200">
            {timePhase === 'DAY' ? '☀ Dia em Arcadia Planitia' : '🌇 Entardecer Marciano'}
          </span>
        </div>
      </div>

      {/* Painel de Controle Solar + Visual do Painel */}
      <div className="grid gap-4 md:grid-cols-[260px_1fr]">
        <div className="flex flex-col items-center justify-center rounded-sm border-2 border-slate-800 bg-orange-950/50 p-4">
          <img
            src={
              hasDust
                ? ASSET_MANIFEST.solarPanelDusty.path
                : ASSET_MANIFEST.solarPanelClean.path
            }
            alt={
              hasDust
                ? ASSET_MANIFEST.solarPanelDusty.alt
                : ASSET_MANIFEST.solarPanelClean.alt
            }
            className="pixel-art h-36 w-36 object-contain"
          />
          <span
            className={`mt-2 rounded-sm border px-2 py-0.5 font-pixel text-[8px] ${
              hasDust
                ? 'border-amber-400 bg-amber-950/80 text-amber-200'
                : 'border-emerald-400 bg-emerald-950/80 text-emerald-200'
            }`}
          >
            {hasDust ? '⚠ POEIRA MARCIANA DETECTADA' : '✨ PAINEL LIMPO'}
          </span>
        </div>

        <div className="space-y-3 rounded-sm border-2 border-cyan-500/50 bg-slate-950 p-4">
          <div className="grid gap-2.5 sm:grid-cols-3">
            <div className="rounded-sm border border-slate-800 bg-slate-900 p-2.5">
              <span className="block font-dialog text-[11px] text-slate-400">
                Energia Gerada
              </span>
              <strong
                className={`font-pixel text-sm ${
                  currentGenerationW >= habitatConsumptionW
                    ? 'text-emerald-300'
                    : 'text-amber-300'
                }`}
              >
                {currentGenerationW} W
              </strong>
            </div>

            <div className="rounded-sm border border-slate-800 bg-slate-900 p-2.5">
              <span className="block font-dialog text-[11px] text-slate-400">
                Carga da Bateria
              </span>
              <strong className="font-pixel text-sm text-cyan-300">
                {batteryPercent}%
              </strong>
            </div>

            <div className="rounded-sm border border-slate-800 bg-slate-900 p-2.5">
              <span className="block font-dialog text-[11px] text-slate-400">
                Consumo do Habitat
              </span>
              <strong className="font-pixel text-sm text-orange-300">
                {habitatConsumptionW} W
              </strong>
            </div>
          </div>

          <div className="rounded-sm border border-slate-800 bg-slate-900/90 px-3 py-2 font-dialog text-xs">
            Saldo energético:{' '}
            <strong className={netBalanceW >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
              {netBalanceW >= 0 ? `+${netBalanceW} W (carregando baterias)` : `${netBalanceW} W (usando reserva das baterias)`}
            </strong>
          </div>

          {/* Botões de simulação interativa */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleSimulateTimeAndDust}
              className="pixel-btn inline-flex items-center gap-1.5 bg-amber-400 px-3 py-2 font-dialog text-xs font-bold text-slate-950 hover:bg-amber-300"
            >
              <Clock className="h-3.5 w-3.5" />
              Simular Entardecer + Poeira
            </button>

            <button
              type="button"
              disabled={!hasDust && state.mission1.dustCleaned}
              onClick={handleCleanPanel}
              className="pixel-btn inline-flex items-center gap-1.5 bg-cyan-400 px-3 py-2 font-dialog text-xs font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
            >
              <Wind className="h-3.5 w-3.5" />
              {state.mission1.dustCleaned && !hasDust
                ? '✓ Limpeza Testada'
                : '🧹 Limpar Poeira do Painel'}
            </button>

            <button
              type="button"
              onClick={handleToggleEconomy}
              className={`pixel-btn inline-flex items-center gap-1.5 px-3 py-2 font-dialog text-xs font-bold text-slate-950 ${
                economyMode
                  ? 'bg-emerald-400 hover:bg-emerald-300'
                  : 'bg-indigo-300 hover:bg-indigo-200'
              }`}
            >
              <BatteryCharging className="h-3.5 w-3.5" />
              {economyMode
                ? '✓ Modo Economia Ativo (180 W)'
                : '🔋 Ativar Economia de Energia'}
            </button>
          </div>
        </div>
      </div>

      {/* Fechamento Obrigatório da Missão 1 */}
      <div
        className={`rounded-sm border-2 p-4 ${
          readyForClosure
            ? 'border-emerald-400 bg-emerald-950/30'
            : 'border-slate-800 bg-slate-950/90'
        }`}
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-300" />
            <h3 className="font-pixel text-[10px] text-amber-300">
              FECHAMENTO DA MISSÃO 1 — REGISTRO E TRANSMISSÃO
            </h3>
          </div>
          {state.mission1.mission2Unlocked && (
            <span className="rounded-sm border border-emerald-400 bg-emerald-900/70 px-2 py-0.5 font-pixel text-[8px] text-emerald-200">
              ✓ MISSÃO 2 DESBLOQUEADA!
            </span>
          )}
        </div>

        <p className="mb-3 font-dialog text-xs text-slate-300">
          {readyForClosure
            ? 'Excelente trabalho! Agora faça o registro científico obrigatório no Diário de Bordo e vá dormir para que a Capi envie os dados à Terra e libere a Missão 2.'
            : 'Para liberar o encerramento, teste a simulação de poeira + limpeza do painel e ative o modo de economia de energia.'}
        </p>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            disabled={!readyForClosure}
            onClick={() => {
              soundEngine.playClick();
              openModal('LOGBOOK');
            }}
            className="pixel-btn inline-flex items-center gap-1.5 bg-amber-400 px-3.5 py-2 font-dialog text-xs font-bold text-slate-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <BookOpen className="h-4 w-4" />
            {state.mission1.loggedInDiary
              ? '✓ 1. Diário Registrado (Abrir)'
              : '1. Registrar Missão 1 no Diário'}
          </button>

          <button
            type="button"
            disabled={!readyForClosure}
            onClick={() => {
              soundEngine.playClick();
              openModal('SLEEP_REPORT');
            }}
            className="pixel-btn inline-flex items-center gap-1.5 bg-indigo-400 px-3.5 py-2 font-dialog text-xs font-bold text-slate-950 hover:bg-indigo-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Moon className="h-4 w-4" />
            {state.mission1.mission2Unlocked
              ? '✓ 2. Sono Concluído (Reabrir)'
              : '2. Dormir e Desbloquear Missão 2'}
          </button>

          {state.mission1.mission2Unlocked && (
            <button
              type="button"
              onClick={() => {
                soundEngine.playSuccess();
                onReturnToBase();
              }}
              className="pixel-btn inline-flex items-center gap-1.5 bg-emerald-400 px-3.5 py-2 font-pixel text-[10px] text-slate-950 hover:bg-emerald-300"
            >
              <CheckCircle2 className="h-4 w-4" />
              Voltar à Base (Missão 2 Pronta) ▶
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
