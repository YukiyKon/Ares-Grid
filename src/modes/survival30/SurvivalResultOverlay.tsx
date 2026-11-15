import React from 'react';
import { Award, Download, RotateCcw, Skull, Sparkles } from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';
import { useLanguage } from '../../i18n/LanguageContext';
import { getLocalizedFailureReason } from './survivalI18n';

/**
 * Sobreposição de fim de expedição no Modo 2 (30 Sols):
 * exibe Game Over ("Missão Interrompida") com causa e relatório consolidado da Capi,
 * ou Vitória dos 30 Sols com balanço real acumulado e certificado .PNG baixável.
 */
export const SurvivalResultOverlay: React.FC = () => {
  const { state, restartSurvival30, toggleGameMode } = useGameStore();
  const { lang, dict, tx, translateText } = useLanguage();
  const { survival, astronaut } = state;

  if (state.gameMode !== 'SURVIVAL_30' || survival.gameStatus === 'PLAYING') {
    return null;
  }

  const totalTurnsUsed = survival.stats.totalTurnsUsed ?? 0;
  const totalMealsConsumed = survival.stats.totalMealsConsumed ?? 0;
  const totalKcalConsumed = survival.stats.totalKcalConsumed ?? 0;
  const totalWaterExtracted = survival.stats.totalWaterExtracted ?? 0;
  const totalWaterMlDrank = survival.stats.totalWaterMlDrank ?? 0;
  const totalHarvests = survival.stats.totalHarvests ?? 0;
  const cleanPanelsCount = survival.stats.cleanPanelsCount ?? 0;
  const stormsSurvived = survival.stats.stormsSurvived ?? 0;
  const crisesResolved = survival.stats.crisesResolved ?? 0;
  const daysExercised = survival.stats.daysExercised ?? 0;
  const daysHygieneCompleted = survival.stats.daysHygieneCompleted ?? 0;
  const logbookCount = state.logbook.length;
  const reachedSol = survival.gameOverSol ?? survival.sol;

  const metricCards = [
    {
      label: tx('Sols Survived', 'Sols Sobrevividos'),
      value: survival.gameStatus === 'VICTORY' ? '30/30 Sols' : `${reachedSol}/30 Sols`,
      color: 'text-amber-300',
    },
    {
      label: tx('Turns Operated', 'Turnos Executados'),
      value: `${totalTurnsUsed} ${tx('turns', 'turnos')}`,
      color: 'text-cyan-300',
    },
    {
      label: tx('Meals & Calories', 'Refeições & Calorias'),
      value: `${totalMealsConsumed} (${totalKcalConsumed} kcal)`,
      color: 'text-emerald-300',
    },
    {
      label: tx('Water Drawn / Consumed', 'Água Extraída / Bebida'),
      value: `+${totalWaterExtracted}% • ${totalWaterMlDrank} ml`,
      color: 'text-sky-300',
    },
    {
      label: tx('Greenhouse Harvests', 'Colheitas na Estufa'),
      value: `${totalHarvests} ${tx('rations', 'rações')}`,
      color: 'text-lime-300',
    },
    {
      label: tx('Solar Panel Cleans', 'Limpezas Solares'),
      value: `${cleanPanelsCount}x`,
      color: 'text-yellow-300',
    },
    {
      label: tx('Storms / Crises', 'Tempestades / Crises'),
      value: `${stormsSurvived} ${tx('storms', 'temp.')} • ${crisesResolved} ${tx('crises', 'crises')}`,
      color: 'text-orange-300',
    },
    {
      label: tx('Workouts & Hygiene', 'Treinos & Higiene'),
      value: `${daysExercised} ${tx('workouts', 'treinos')} • ${daysHygieneCompleted} ${tx('hyg.', 'hig.')}`,
      color: 'text-indigo-300',
    },
    {
      label: tx('Science Logbook', 'Diário Científico'),
      value: `${logbookCount} ${tx('entries', 'registros')}`,
      color: 'text-purple-300',
    },
  ];

  const renderCapiConsolidatedReport = (isVictory: boolean) => {
    const speech = isVictory
      ? tx(
          `Commander ${astronaut.name}, I reviewed every black-box log of our mission! We completed ${totalTurnsUsed} turns, ate ${totalKcalConsumed} kcal across ${totalMealsConsumed} meals, hydrated ${totalWaterMlDrank} ml, weathered ${stormsSurvived} storms, and resolved ${crisesResolved} emergencies!`,
          `Comandante ${astronaut.name}, conferi toda a caixa-preta real da expedição! Executamos ${totalTurnsUsed} turnos, ingerimos ${totalKcalConsumed} kcal em ${totalMealsConsumed} refeições, hidratamos ${totalWaterMlDrank} ml, vencemos ${stormsSurvived} tempestades e resolvemos ${crisesResolved} emergências!`
        )
      : tx(
          `I analyzed your real mission telemetry up to Sol ${reachedSol}/30: ${totalTurnsUsed} turns completed, ${totalMealsConsumed} meals (${totalKcalConsumed} kcal), ${daysExercised} Sols with workouts, and ${crisesResolved} emergencies contained. Let's use this data on your next attempt!`,
          `Analisei seus registros reais até o Sol ${reachedSol}/30: foram ${totalTurnsUsed} turnos operados, ${totalMealsConsumed} refeições (${totalKcalConsumed} kcal), ${daysExercised} Sols com treino físico e ${crisesResolved} crises contidas. Vamos usar esses dados reais na próxima tentativa!`
        );

    return (
      <div className="mt-4 space-y-3 text-left">
        <div className="flex items-center gap-3 rounded-sm border border-cyan-500/50 bg-cyan-950/35 p-3">
          <img
            src={ASSET_MANIFEST.capiPortrait.path}
            alt={ASSET_MANIFEST.capiPortrait.alt}
            className="pixel-art h-14 w-14 shrink-0 rounded-sm border border-cyan-400/60 bg-slate-900 object-contain"
          />
          <div className="space-y-1">
            <span className="block font-pixel text-[9px] text-cyan-300">
              {tx("CAPI'S REAL FINAL TELEMETRY REPORT", 'RELATÓRIO FINAL REAL DA CAPI')}
            </span>
            <p className="font-dialog text-xs leading-relaxed text-slate-100">{speech}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {metricCards.map((item) => (
            <div
              key={item.label}
              className={`rounded-sm border p-2 ${
                isVictory
                  ? 'border-emerald-500/35 bg-slate-900/90'
                  : 'border-slate-800 bg-slate-900/90'
              }`}
            >
              <span className="block font-dialog text-[10px] text-slate-400">
                {item.label}
              </span>
              <span className={`font-dialog text-xs font-bold ${item.color}`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleDownloadCertificate = () => {
    soundEngine.playSuccess();
    const canvas = document.createElement('canvas');
    canvas.width = 960;
    canvas.height = 540;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const grad = ctx.createLinearGradient(0, 0, 960, 540);
    grad.addColorStop(0, '#090d1a');
    grad.addColorStop(0.6, '#1f1210');
    grad.addColorStop(1, '#3b150c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 960, 540);

    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, 920, 500);
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.strokeRect(32, 32, 896, 476);

    ctx.fillStyle = '#fde68a';
    ctx.font = 'bold 28px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(
      lang === 'en'
        ? 'OFFICIAL CERTIFICATE — ARCADIA PLANITIA EXPEDITION'
        : 'CERTIFICADO OFICIAL — EXPEDIÇÃO ARCADIA PLANITIA',
      480,
      86
    );

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(
      lang === 'en'
        ? 'FULL 30-SOL SURVIVAL ON MARS'
        : 'SOBREVIVÊNCIA INTEGRAL DE 30 SOLS EM MARTE',
      480,
      122
    );

    ctx.fillStyle = '#f8fafc';
    ctx.font = '20px sans-serif';
    ctx.fillText(
      lang === 'en' ? 'Awarded to Commander:' : 'Conferido ao(à) Comandante:',
      480,
      172
    );

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 34px monospace';
    ctx.fillText(astronaut.name.toUpperCase(), 480, 218);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '17px sans-serif';
    ctx.fillText(
      lang === 'en'
        ? 'Operated Arcadia Base for 30 consecutive Sols managing Solar Power, Buried Water,'
        : 'Operou a base por 30 Sols consecutivos gerenciando Energia Solar, Água Subterrânea,',
      480,
      264
    );
    ctx.fillText(
      lang === 'en'
        ? 'ECLSS Nutrition, Hydroponic Greenhouse, and Dust Storm & Radiation Protocols.'
        : 'Nutrição ECLSS, Estufa Hidropônica e Protocolos contra Tempestades e Radiação Solar.',
      480,
      290
    );

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(60, 322, 840, 132);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 322, 840, 132);

    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(
      lang === 'en'
        ? `SOLS: 30/30  |  TURNS: ${totalTurnsUsed}  |  SCIENCE: ${survival.stats.scienceScore} PTS  |  LOGS: ${logbookCount}`
        : `SOLS: 30/30  |  TURNOS: ${totalTurnsUsed}  |  CIÊNCIA: ${survival.stats.scienceScore} PTS  |  DIÁRIO: ${logbookCount} REG.`,
      480,
      356
    );
    ctx.fillStyle = '#67e8f9';
    ctx.font = '14px monospace';
    ctx.fillText(
      lang === 'en'
        ? `MEALS: ${totalMealsConsumed} (${totalKcalConsumed} kcal)  |  WATER: +${totalWaterExtracted}% DRAWN / ${totalWaterMlDrank} ml DRUNK`
        : `REFEIÇÕES: ${totalMealsConsumed} (${totalKcalConsumed} kcal)  |  ÁGUA: +${totalWaterExtracted}% EXTR. / ${totalWaterMlDrank} ml BEB.`,
      480,
      392
    );
    ctx.fillStyle = '#86efac';
    ctx.font = '14px monospace';
    ctx.fillText(
      lang === 'en'
        ? `PANELS CLEANED: ${cleanPanelsCount}x  |  HARVESTS: ${totalHarvests} RATIONS  |  STORMS: ${stormsSurvived}  |  CRISES: ${crisesResolved}`
        : `PAINÉIS LIMPOS: ${cleanPanelsCount}x  |  COLHEITAS: ${totalHarvests} RAÇÕES  |  TEMPESTADES: ${stormsSurvived}  |  CRISES: ${crisesResolved}`,
      480,
      428
    );

    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px monospace';
    ctx.fillText(
      lang === 'en'
        ? 'ARES GRID SYSTEM • CAPI ORBITAL MONITOR • ARCADIA PLANITIA (ESP_046254_2170)'
        : 'SISTEMA ARES GRID • CAPI ORBITAL MONITOR • ARCADIA PLANITIA (ESP_046254_2170)',
      480,
      488
    );

    const link = document.createElement('a');
    const prefix = lang === 'en' ? 'certificate-30-sols' : 'certificado-30-sols';
    link.download = `${prefix}-${astronaut.name.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (survival.gameStatus === 'GAME_OVER') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-2 backdrop-blur-sm sm:p-3">
        <div className="pixel-box max-h-[92dvh] w-full max-w-2xl overflow-y-auto border-rose-500 bg-slate-950 p-4 text-center shadow-2xl sm:p-5">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-sm border-2 border-rose-400 bg-rose-950/80 text-rose-300">
            <Skull className="h-7 w-7" />
          </div>
          <p className="font-pixel text-xs text-rose-300">
            {tx('MISSION INTERRUPTED', 'MISSÃO INTERROMPIDA')}
          </p>
          <h2 className="mt-2 font-dialog text-xl font-bold text-white">
            {tx(`Base Collapse on Sol ${reachedSol}/30`, `Colapso na Base no Sol ${reachedSol}/30`)}
          </h2>
          <p className="mt-3 rounded-sm border border-rose-500/50 bg-rose-950/40 p-3 font-dialog text-sm leading-relaxed text-rose-100">
            {getLocalizedFailureReason(
              survival.gameOverCause,
              reachedSol,
              dict,
              survival.gameOverReason,
              translateText
            ) ??
              tx(
                'One of the base life-support systems hit 0%. Adjust your power, water, and shelter priorities on the next run.',
                'Um dos sistemas vitais da base chegou a 0%. Ajuste a prioridade de energia, água e abrigo nos próximos Sols.'
              )}
          </p>

          {renderCapiConsolidatedReport(false)}

          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                restartSurvival30();
              }}
              className="pixel-btn inline-flex min-h-[42px] items-center gap-2 bg-amber-400 px-4 py-2 font-pixel text-[10px] text-slate-950 hover:bg-amber-300"
            >
              <RotateCcw className="h-4 w-4" />
              {tx('Restart 30 Sols (Sol 1/30)', 'Reiniciar 30 Sols (Sol 1/30)')}
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                toggleGameMode();
              }}
              className="pixel-btn min-h-[42px] bg-slate-700 px-4 py-2 font-dialog text-xs font-bold text-slate-100 hover:bg-slate-600"
            >
              {tx('Back to Training', 'Voltar ao Treinamento')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-2 backdrop-blur-sm sm:p-3">
      <div className="pixel-box max-h-[92dvh] w-full max-w-2xl overflow-y-auto border-emerald-400 bg-slate-950 p-4 text-center shadow-2xl sm:p-5">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-sm border-2 border-amber-300 bg-emerald-950/80 text-amber-300">
          <Award className="h-7 w-7" />
        </div>
        <p className="inline-flex items-center gap-1.5 font-pixel text-xs text-emerald-300">
          <Sparkles className="h-4 w-4" />
          {tx('30-SOL EXPEDITION COMPLETE!', 'EXPEDIÇÃO 30 SOLS CONCLUÍDA!')}
        </p>
        <h2 className="mt-2 font-dialog text-xl font-bold text-white">
          {tx(
            `Congratulations, Commander ${astronaut.name}! You survived 30 Sols at Arcadia Planitia!`,
            `Parabéns, Comandante ${astronaut.name}! Você sobreviveu 30 Sols em Arcadia Planitia!`
          )}
        </h2>
        <p className="mt-2 font-dialog text-sm leading-relaxed text-slate-300">
          {tx(
            `Your base maintained power (${survival.energy}%), water (${survival.water}%), health (${survival.health}%), and habitat integrity through global dust storms and solar flares all the way to Sol 30/30.`,
            `Sua base manteve energia (${survival.energy}%), água (${survival.water}%), saúde (${survival.health}%) e integridade contra tempestades globais e erupções solares até o Sol 30/30.`
          )}
        </p>

        {renderCapiConsolidatedReport(true)}

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={handleDownloadCertificate}
            className="pixel-btn inline-flex min-h-[42px] items-center gap-2 bg-emerald-400 px-4 py-2 font-pixel text-[10px] text-slate-950 hover:bg-emerald-300"
          >
            <Download className="h-4 w-4" />
            {tx('Download 30-Sol Certificate (.PNG)', 'Baixar Certificado 30 Sols (.PNG)')}
          </button>
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              restartSurvival30();
            }}
            className="pixel-btn inline-flex min-h-[42px] items-center gap-2 bg-amber-400 px-4 py-2 font-dialog text-xs font-bold text-slate-950 hover:bg-amber-300"
          >
            <RotateCcw className="h-4 w-4" />
            {tx('Play 30 Sols Again', 'Jogar 30 Sols Novamente')}
          </button>
        </div>
      </div>
    </div>
  );
};
