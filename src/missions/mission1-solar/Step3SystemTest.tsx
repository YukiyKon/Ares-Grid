import React, { useState } from 'react';
import {
  BatteryCharging,
  BookOpen,
  CheckCircle2,
  Clock,
  Moon,
  Sparkles,
  SunMedium,
  Wind,
  Zap,
} from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { DustScrubCanvas } from '../../components/minigames/DustScrubCanvas';
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
  const {
    state,
    updateMission1,
    openModal,
    executeSurvivalStationAction,
    setSurvivalPowerSave,
  } = useGameStore();
  const isSurvival = state.gameMode === 'SURVIVAL_30';
  const [timePhase, setTimePhase] = useState<'DAY' | 'DUSK'>('DAY');
  const [hasDust, setHasDust] = useState(isSurvival);
  const [cleanPercent, setCleanPercent] = useState(
    isSurvival ? Math.max(0, 100 - Math.max(40, state.survival.panelDustPct)) : 100
  );
  const [survivalScrubDone, setSurvivalScrubDone] = useState(false);
  const [dustKey, setDustKey] = useState(0);
  const [economyMode, setEconomyMode] = useState(
    isSurvival ? state.survival.powerSaveActive : state.mission1.powerSaveTested
  );

  const baseWatts = Math.max(360, state.mission1.generatedWatts || 480);
  const sunMultiplier = timePhase === 'DAY' ? 1 : 0.48;
  const dustMultiplier = hasDust ? 0.58 + (cleanPercent / 100) * 0.42 : 1;
  const currentGenerationW = Math.round(baseWatts * sunMultiplier * dustMultiplier);
  const habitatConsumptionW = economyMode ? 180 : 320;
  const netBalanceW = currentGenerationW - habitatConsumptionW;
  const effectiveClean = hasDust ? cleanPercent / 100 : 1;
  const batteryPercent =
    timePhase === 'DAY'
      ? hasDust
        ? Math.round(82 + effectiveClean * 18)
        : 100
      : economyMode
      ? hasDust
        ? Math.round(68 + effectiveClean * 16)
        : 84
      : Math.round(42 + effectiveClean * 20);

  const readyForClosure = state.mission1.dustCleaned && state.mission1.powerSaveTested;

  const handleSimulateTimeAndDust = () => {
    soundEngine.playAlert();
    setTimePhase('DUSK');
    setHasDust(true);
    setCleanPercent(0);
    setDustKey((prev) => prev + 1);
    onCapiFeedback(
      'Olhe o painel! O Sol baixou no entardecer e o vento trouxe poeira marciana. Esfregue a camada laranja sobre o painel até limpar 90%+!'
    );
  };

  const handleCleanPanel = () => {
    soundEngine.playSuccess();
    setHasDust(false);
    setCleanPercent(100);
    setSurvivalScrubDone(true);
    updateMission1({ dustCleaned: true });
    onCapiFeedback(
      'Muito bem! Ao esfregar toda a poeira, as células fotovoltaicas voltaram a captar muito mais luz solar!'
    );
  };

  const handleToggleEconomy = () => {
    soundEngine.playClick();
    const next = !economyMode;
    setEconomyMode(next);
    if (isSurvival) {
      setSurvivalPowerSave(next);
    }
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

      {/* Painel de Controle Solar + Canvas Interativo de Limpeza de Poeira */}
      <div className="grid gap-4 md:grid-cols-[270px_1fr]">
        <div className="flex flex-col items-center justify-center rounded-sm border-2 border-slate-800 bg-orange-950/50 p-4">
          <DustScrubCanvas
            cleanImageSrc={ASSET_MANIFEST.solarPanelClean.path}
            cleanImageAlt={ASSET_MANIFEST.solarPanelClean.alt}
            activeDust={hasDust}
            dustKey={dustKey}
            onScrubProgress={setCleanPercent}
            onScrubComplete={handleCleanPanel}
          />

          <div className="mt-3 w-full space-y-1.5">
            <div className="flex items-center justify-between font-dialog text-[11px]">
              <span className="text-slate-300">Limpeza do Painel:</span>
              <strong
                className={
                  hasDust && cleanPercent < 90 ? 'text-amber-300' : 'text-emerald-300'
                }
              >
                {cleanPercent}% {hasDust ? '(meta: 90%+)' : '✓'}
              </strong>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-sm border border-slate-700 bg-slate-900">
              <div
                style={{ width: `${cleanPercent}%` }}
                className={`h-full transition-all duration-75 ${
                  cleanPercent >= 90 ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
            </div>
          </div>

          <span
            className={`mt-2.5 rounded-sm border px-2 py-0.5 text-center font-pixel text-[8px] ${
              hasDust
                ? 'border-amber-400 bg-amber-950/80 text-amber-200'
                : 'border-emerald-400 bg-emerald-950/80 text-emerald-200'
            }`}
          >
            {hasDust
              ? '🧹 ESFREGUE O PAINEL PARA LIMPAR'
              : state.mission1.dustCleaned
              ? '✨ PAINEL LIMPO COM SUCESSO'
              : '✨ PAINEL SOLAR LIMPO'}
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
              onClick={() => {
                if (hasDust) {
                  soundEngine.playAlert();
                  onCapiFeedback(
                    `Use o mouse ou dedo diretamente sobre a poeira laranja no painel à esquerda! Limpeza atual: ${cleanPercent}% (meta: 90%).`
                  );
                } else {
                  soundEngine.playAlert();
                  onCapiFeedback(
                    'Primeiro clique em "Simular Entardecer + Poeira" ao lado para cobrir o painel com poeira marciana e poder limpá-lo!'
                  );
                }
              }}
              className="pixel-btn inline-flex items-center gap-1.5 bg-cyan-400 px-3 py-2 font-dialog text-xs font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
            >
              <Wind className="h-3.5 w-3.5" />
              {hasDust
                ? `🧹 Esfregue o Painel (${cleanPercent}%/90%)`
                : state.mission1.dustCleaned
                ? '✓ Poeira Limpa (90%+)'
                : '🧹 Aguardando Simulação de Poeira'}
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

      {/* Fechamento Obrigatório da Missão 1 / Operação no Modo Sobrevivência */}
      {isSurvival ? (
        <div
          className={`rounded-sm border-2 p-4 ${
            survivalScrubDone
              ? 'border-emerald-400 bg-emerald-950/30'
              : 'border-amber-500/60 bg-slate-950/90'
          }`}
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <SunMedium className="h-4 w-4 text-amber-300" />
              <h3 className="font-pixel text-[10px] text-amber-300">
                MANUTENÇÃO SOLAR REAL — SOL {state.survival.sol}/30
              </h3>
            </div>
            <span className="rounded-sm border border-amber-400/70 bg-amber-950/60 px-2 py-0.5 font-dialog text-[11px] text-amber-200">
              Poeira atual na base: {state.survival.panelDustPct}%
            </span>
          </div>

          <p className="mb-3 font-dialog text-xs text-slate-300">
            {survivalScrubDone
              ? 'Painel solar limpo e calibrado! Conclua a manutenção para zerar a poeira acumulada na base e recuperar +15% de Energia.'
              : 'Esfregue toda a poeira sobre o painel acima até atingir 90%+ para liberar o registro de manutenção.'}
          </p>

          <button
            type="button"
            disabled={!survivalScrubDone}
            onClick={() => {
              soundEngine.playSuccess();
              executeSurvivalStationAction('MISSION_1');
            }}
            className="pixel-btn inline-flex items-center gap-2 bg-amber-400 px-4 py-2.5 font-pixel text-[10px] text-slate-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <SunMedium className="h-4 w-4" />
            ☀️ Concluir Manutenção Solar (-1 Turno • -15% Stamina • +15% Energia) ▶
          </button>
        </div>
      ) : (
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
      )}
    </div>
  );
};
