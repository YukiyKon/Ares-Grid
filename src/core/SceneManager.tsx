import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  HeartPulse,
  Lock,
  Map,
  Moon,
  Satellite,
  ShieldAlert,
  Snowflake,
  Sparkles,
  Sprout,
  SunMedium,
} from 'lucide-react';
import { ASSET_MANIFEST } from '../assets/assetManifest';
import { AstronautAvatar } from '../components/permanent/AstronautAvatar';
import { CapiAssistant } from '../components/permanent/CapiAssistant';
import { useLanguage } from '../i18n/LanguageContext';
import { MISSION_REGISTRY } from '../missions/missionRegistry';
import { Mission1SolarScene } from '../missions/mission1-solar/Mission1SolarScene';
import { Mission2HealthScene } from '../missions/mission2-health/Mission2HealthScene';
import { Mission3IceScene } from '../missions/mission3-ice/Mission3IceScene';
import { Mission4GreenhouseScene } from '../missions/mission4-greenhouse/Mission4GreenhouseScene';
import { Mission5StormsScene } from '../missions/mission5-storms/Mission5StormsScene';
import {
  formatNoticeDescriptor,
  getLocalizedDominoAlerts,
  getLocalizedEarthSyncStatus,
  getLocalizedStationRule,
  getLocalizedWeather,
} from '../modes/survival30/survivalI18n';
import { SurvivalResultOverlay } from '../modes/survival30/SurvivalResultOverlay';
import {
  SURVIVAL_STATION_RULES,
  type SurvivalNoticeDescriptor,
  type SurvivalStationId,
} from '../modes/survival30/survivalTypes';
import {
  getNextSolEarlyWarning,
  getSolWeather,
} from '../modes/survival30/weatherScheduler';
import { EarthCommsScene } from '../scenes/ending/EarthCommsScene';
import { FutureMarsScene } from '../scenes/ending/FutureMarsScene';
import { ArcadeRushScene } from '../modes/arcade-rush/ArcadeRushScene';
import { RoverSprite } from '../modes/arcade-rush/CosmeticSprites';
import { CapiIntroScene } from '../scenes/intro/CapiIntroScene';
import { CountdownScene } from '../scenes/intro/CountdownScene';
import { CustomizeScene } from '../scenes/intro/CustomizeScene';
import { LandingScene } from '../scenes/intro/LandingScene';
import { LaunchScene } from '../scenes/intro/LaunchScene';
import { StartScreenScene } from '../scenes/intro/StartScreenScene';
import { useGameStore } from './gameStore';
import { soundEngine } from './soundEngine';

type HubFeedback =
  | { kind: 'LOCKED_MISSION'; missionId: string }
  | { kind: 'SURVIVAL_NOTICE'; descriptor: SurvivalNoticeDescriptor }
  | null;

const BaseHubScene: React.FC = () => {
  const { state, setScene, openModal } = useGameStore();
  const { dict, tx, translateText } = useLanguage();
  const [imgError, setImgError] = useState(false);
  const [hubFeedback, setHubFeedback] = useState<HubFeedback>(null);
  const mission1 = MISSION_REGISTRY[0];
  const mission2 = MISSION_REGISTRY[1];
  const mission3 = MISSION_REGISTRY[2];
  const mission4 = MISSION_REGISTRY[3];
  const mission5 = MISSION_REGISTRY[4];
  const isSurvival = state.gameMode === 'SURVIVAL_30';
  const rawWeather = getSolWeather(state.survival.sol);
  const survivalWeather = getLocalizedWeather(rawWeather.type, dict);
  const earlyWarning = isSurvival ? getNextSolEarlyWarning(state.survival.sol) : null;
  const earlyWarningWeather = earlyWarning
    ? getLocalizedWeather(earlyWarning.type, dict)
    : null;
  const earlyWarningText =
    earlyWarning && earlyWarningWeather
      ? tx(
          `⚠️ Orbital Alert for tomorrow (Sol ${earlyWarning.sol}): ${earlyWarningWeather.title} — ${earlyWarningWeather.capiAdvice}`,
          `⚠️ Aviso Orbital para amanhã (Sol ${earlyWarning.sol}): ${earlyWarningWeather.title} — ${earlyWarningWeather.capiAdvice}`
        )
      : null;

  const { solarInstalled } = state.stats;
  const { mission1Completed, mission2Unlocked } = state.mission1;
  const { mission2Completed, mission3Unlocked } = state.mission2;
  const { mission3Completed, mission4Unlocked } = state.mission3;
  const { mission4Completed, mission5Unlocked } = state.mission4;
  const { mission5Completed, endingUnlocked } = state.mission5;

  const localizedDominoAlerts = isSurvival
    ? getLocalizedDominoAlerts(state.survival, dict)
    : [];
  const localizedLastNotice = isSurvival
    ? formatNoticeDescriptor(
        state.survival.lastNoticeDescriptor,
        dict,
        state.survival.lastActionNotice,
        translateText
      )
    : null;

  const survivalCapiLines = [
    ...(localizedDominoAlerts.length > 0
      ? [
          tx(
            `⚠️ ACTIVE CASCADE ALERT: ${localizedDominoAlerts[0]}`,
            `⚠️ EFEITO DOMINÓ ATIVO: ${localizedDominoAlerts[0]}`
          ),
        ]
      : []),
    ...(localizedLastNotice ? [localizedLastNotice] : []),
    `Sol ${state.survival.sol}/30 • ${survivalWeather.shortBadge}: ${survivalWeather.capiAdvice}`,
    earlyWarningText ??
      tx(
        `Turns left: ${state.survival.turnsLeft}/4 | Stamina: ${state.survival.stamina}/${state.survival.maxStamina}% | Panel dust: ${state.survival.panelDustPct}%.`,
        `Turnos restantes: ${state.survival.turnsLeft}/4 | Stamina: ${state.survival.stamina}/${state.survival.maxStamina}% | Poeira nos painéis: ${state.survival.panelDustPct}%.`
      ),
  ];

  const defaultCapiLines = isSurvival
    ? survivalCapiLines
    : endingUnlocked
    ? [
        'Missão 5 concluída com segurança! Todas as 5 missões científicas em Arcadia Planitia foram finalizadas!',
        'Clique em "Central de Comunicação (Cena 6)" para enviar o Relatório Geral da Expedição aos cientistas da Terra!',
      ]
    : mission5Unlocked
    ? [
        'ALERTA AMBIENTAL, comandante! Detectamos uma tempestade de poeira e atividade solar em Arcadia Planitia!',
        'Clique em "Iniciar Missão 5: Tempestades ▶" ou abra o Mapa de Arcadia (Setor Sul) para proteger a base!',
      ]
    : mission4Unlocked
    ? [
        'Fantástico, comandante! Temos energia solar, saúde monitorada e reserva de água potável em 100%!',
        'A Missão 4 (A Primeira Estufa de Marte) já está desbloqueada! Clique no botão verde ou abra o Mapa de Arcadia (Setor Leste)!',
      ]
    : mission3Unlocked
    ? [
        'Incrível, comandante! Energia solar ativa e rotina de saúde em dia no Sol atual!',
        'Clique em "Iniciar Missão 3: Gelo ▶" ou abra o Mapa de Arcadia (Setor Norte) para investigar gelo subterrâneo!',
      ]
    : mission2Unlocked
    ? [
        'Nosso sistema solar está funcionando perfeitamente! Agora precisamos cuidar da sua saúde no habitat.',
        'Clique no Habitat Principal ou em "Iniciar Missão 2: Saúde ▶" para começar a rotina de treino, comida e sono!',
      ]
    : solarInstalled
    ? [
        'Nossos painéis solares estão instalados na área leste! Continue os testes e o registro no Diário.',
        'Clique na Área Solar ou em "Abrir Painel da Missão 1" para concluir e liberar a Missão 2!',
      ]
    : [
        'Bem-vindo à nossa Base em Arcadia Planitia, comandante! Tudo está pronto para a Missão 1.',
        'Nosso objetivo será instalar os painéis solares calculando a posição do Sol com o sistema Mars24 da NASA.',
        'Clique em "Iniciar Missão 1: Energia Solar" ou direto na Área Solar marcada no terreno!',
      ];

  const getLockedMissionHint = (missionId: string) => {
    switch (missionId) {
      case 'MISSION_2':
        return 'O Habitat precisa de energia elétrica primeiro! Conclua a Missão 1 (Energia Solar) e durma na etapa final para liberar a Missão 2.';
      case 'MISSION_3':
        return 'Conclua a Missão 2 (Cuidando do Astronauta) e finalize o relatório do sono para liberar a Missão 3 — O Mistério do Gelo!';
      case 'MISSION_4':
        return 'Conclua a Missão 3 (Gelo e Água Potável) para abastecer a base e liberar a Missão 4 — A Primeira Estufa de Marte!';
      case 'MISSION_5':
        return 'Conclua a Missão 4 (A Primeira Estufa de Marte) para liberar a Missão 5 — Alerta! Tempestades em Marte!';
      default:
        return 'Complete as missões anteriores na ordem para desbloquear esta etapa.';
    }
  };

  const resolvedFeedbackLine =
    hubFeedback?.kind === 'LOCKED_MISSION'
      ? getLockedMissionHint(hubFeedback.missionId)
      : hubFeedback?.kind === 'SURVIVAL_NOTICE'
      ? formatNoticeDescriptor(hubFeedback.descriptor, dict)
      : null;

  const capiLines = resolvedFeedbackLine ? [resolvedFeedbackLine] : defaultCapiLines;

  const tryOpenSurvivalStation = (stationId: SurvivalStationId) => {
    if (isSurvival) {
      const rule = SURVIVAL_STATION_RULES[stationId];
      if (state.survival.turnsLeft <= 0) {
        soundEngine.playAlert();
        setHubFeedback({
          kind: 'SURVIVAL_NOTICE',
          descriptor: { kind: 'ZERO_TURNS_LEFT' },
        });
        return;
      }
      if (state.survival.stamina < rule.minStamina) {
        soundEngine.playAlert();
        setHubFeedback({
          kind: 'SURVIVAL_NOTICE',
          descriptor: {
            kind: 'INSUFFICIENT_STAMINA',
            station: stationId,
            cost: rule.minStamina,
            current: state.survival.stamina,
          },
        });
        return;
      }
      if (rule.minWater && state.survival.water < rule.minWater) {
        soundEngine.playAlert();
        setHubFeedback({
          kind: 'SURVIVAL_NOTICE',
          descriptor: {
            kind: 'INSUFFICIENT_WATER',
            station: stationId,
            minWater: rule.minWater,
            current: state.survival.water,
          },
        });
        return;
      }
      if (rule.minEnergy && state.survival.energy < rule.minEnergy) {
        soundEngine.playAlert();
        setHubFeedback({
          kind: 'SURVIVAL_NOTICE',
          descriptor: {
            kind: 'INSUFFICIENT_ENERGY',
            station: stationId,
            minEnergy: rule.minEnergy,
            current: state.survival.energy,
          },
        });
        return;
      }
    }
    setHubFeedback(null);
    soundEngine.playClick();
    setScene(stationId);
  };

  const handleOpenMission1 = () => tryOpenSurvivalStation('MISSION_1');
  const handleOpenMission2 = () => tryOpenSurvivalStation('MISSION_2');
  const handleOpenMission3 = () => tryOpenSurvivalStation('MISSION_3');
  const handleOpenMission4 = () => tryOpenSurvivalStation('MISSION_4');
  const handleOpenMission5 = () => tryOpenSurvivalStation('MISSION_5');

  const handleOpenEarthComms = () => {
    soundEngine.playClick();
    setScene('EARTH_COMMS');
  };

  const handleOpenFutureMars = () => {
    soundEngine.playClick();
    setScene('FUTURE_MARS');
  };

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-3 py-4 pb-52 sm:pb-44">
      {/* Cenário limpo da Base em Arcadia Planitia */}
      <div className="pixel-box-mars relative overflow-hidden bg-slate-950">
        <div className="relative aspect-[4/3] min-h-[245px] w-full overflow-hidden bg-orange-950 sm:aspect-video">
          {!imgError ? (
            <img
              src={ASSET_MANIFEST.bgArcadiaBase.path}
              alt={ASSET_MANIFEST.bgArcadiaBase.alt}
              onError={() => setImgError(true)}
              className="pixel-art h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-pixel text-xs text-orange-200">
              {ASSET_MANIFEST.bgArcadiaBase.fallbackLabel}
            </div>
          )}

          {/* 1. Habitat Principal (esquerda) — Missão 2: Interior e Saúde */}
          <button
            type="button"
            onClick={() => {
              if (isSurvival || mission2Unlocked) {
                setHubFeedback(null);
                handleOpenMission2();
              } else {
                soundEngine.playAlert();
                setHubFeedback({ kind: 'LOCKED_MISSION', missionId: 'MISSION_2' });
              }
            }}
            aria-disabled={!isSurvival && !mission2Unlocked}
            className={`absolute left-[3%] top-[8%] min-h-[40px] rounded-sm border-2 bg-slate-950/90 px-2 py-1 text-center shadow-lg transition hover:scale-105 sm:left-[10%] sm:top-[34%] sm:px-2.5 ${
              isSurvival || mission2Unlocked
                ? 'cursor-pointer border-cyan-300'
                : 'cursor-pointer border-slate-500/80 opacity-90'
            }`}
          >
            <span
              className={`block font-pixel text-[7px] sm:text-[8px] ${
                isSurvival || mission2Unlocked ? 'text-cyan-300' : 'text-slate-300'
              }`}
            >
              HABITAT
            </span>
            <span className="font-dialog text-[10px] text-slate-200 sm:text-[11px]">
              {isSurvival
                ? tx('Health & Training (-1 Turn) ▶', 'Saúde & Treino (-1 Turno) ▶')
                : mission2Completed
                  ? 'Saúde OK ✓'
                  : mission2Unlocked
                    ? 'Missão 2: Saúde ▶'
                    : 'Requer Painel Solar'}
            </span>
          </button>

          {/* 2. Astronauta personalizado (centro-esquerda) */}
          <div className="absolute bottom-[7%] left-[5%] flex flex-col items-center sm:bottom-[10%] sm:left-[29%]">
            <AstronautAvatar profile={state.astronaut} size="md" />
            <span
              data-no-i18n="true"
              className="mt-1 max-w-[92px] truncate rounded-sm border border-cyan-400/70 bg-slate-950/90 px-1.5 py-0.5 font-pixel text-[7px] text-cyan-200 sm:max-w-none sm:text-[8px]"
            >
              {state.astronaut.name}
            </span>
          </div>

          {/* 3. Rover Explorador (centro) — abre o Mapa Regional de Arcadia */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              openModal('ARCADIA_MAP');
            }}
            className="absolute bottom-[8%] left-[48%] flex min-h-[40px] -translate-x-1/2 flex-col items-center rounded-sm border-2 border-amber-300 bg-slate-950/90 px-2 py-1 text-center shadow-lg transition hover:scale-105 sm:bottom-[14%] sm:left-[46%] sm:translate-x-0 sm:px-2.5"
          >
            <RoverSprite size="sm" />
            <span className="inline-flex items-center gap-1 font-pixel text-[7px] text-amber-300 sm:text-[8px]">
              <Map className="h-3 w-3 shrink-0" />
              ROVER EXPLORADOR
            </span>
            <span className="block font-dialog text-[10px] text-slate-200 sm:text-[11px]">
              🗺️ Mapa de Arcadia ▶
            </span>
          </button>

          {/* 4. Área Solar clicável no mapa da Base (direita) — Missão 1 */}
          <button
            type="button"
            onClick={handleOpenMission1}
            className="group absolute bottom-[7%] right-[3%] flex flex-col items-center transition hover:scale-105 sm:bottom-[11%] sm:right-[6%]"
          >
            {isSurvival || solarInstalled ? (
              <img
                src={
                  isSurvival && state.survival.panelDustPct >= 40
                    ? ASSET_MANIFEST.solarPanelDirty.path
                    : ASSET_MANIFEST.solarPanelClean.path
                }
                alt={ASSET_MANIFEST.solarPanelClean.alt}
                className="pixel-art h-14 w-14 drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)] sm:h-24 sm:w-24"
              />
            ) : (
              <div className="mb-1 h-10 w-16 rounded-sm border-2 border-dashed border-amber-300 bg-amber-500/20 group-hover:bg-amber-400/30 sm:h-14 sm:w-24" />
            )}
            <span
              className={`rounded-sm border-2 px-1.5 py-0.5 text-center shadow-lg sm:px-2.5 sm:py-1 ${
                isSurvival
                  ? state.survival.panelDustPct >= 40
                    ? 'border-orange-300 bg-slate-950/95 text-orange-300'
                    : 'border-emerald-300 bg-slate-950/95 text-emerald-300'
                  : solarInstalled
                    ? 'border-emerald-300 bg-slate-950/95 text-emerald-300'
                    : 'border-amber-300 bg-slate-950/95 text-amber-300'
              }`}
            >
              <span className="block font-pixel text-[6.5px] sm:text-[8px]">
                {isSurvival
                  ? tx(
                      `PANELS (${state.survival.panelDustPct}% DUST)`,
                      `PAINÉIS (${state.survival.panelDustPct}% POEIRA)`
                    )
                  : solarInstalled
                    ? `PAINÉIS ATIVOS (${state.mission1.generatedWatts || 480} W)`
                    : 'ÁREA SOLAR (MISSÃO 1)'}
              </span>
              <span className="font-dialog text-[10px] text-slate-200 sm:text-[11px]">
                {isSurvival
                  ? tx('Clean dust (-1 Turn) ▶', 'Limpar poeira (-1 Turno) ▶')
                  : solarInstalled
                    ? 'Clique para gerenciar'
                    : 'Clique para instalar ▶'}
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Briefing Dinâmico da Missão Atual + Cartuchos da Expedição */}
      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className="rounded-sm border-2 border-amber-400/70 bg-slate-950 p-4">
          {isSurvival ? (
            <>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-amber-300">
                  <SunMedium className="h-5 w-5 text-amber-300" />
                  <h1 className="font-pixel text-xs">
                    {dict.survival.baseHub.expeditionBadge(state.survival.sol)}
                  </h1>
                </div>
                <span className="rounded-sm border border-amber-400/70 bg-amber-950/60 px-2 py-0.5 font-dialog text-[11px] font-bold text-amber-200">
                  {survivalWeather.shortBadge} — {survivalWeather.title}
                </span>
              </div>

              <p className="font-dialog text-xs leading-relaxed text-slate-200 sm:text-sm">
                {tx(
                  'Open operation across all 5 Arcadia Planitia sectors. Each Sol has ',
                  'Operação livre pelos 5 setores de Arcadia Planitia. Cada Sol tem '
                )}
                <strong className="text-amber-300">
                  {tx('4 Action Turns', '4 Turnos de Ação')}
                </strong>
                {tx(
                  `. Manage Stamina, Solar Dust (${state.survival.panelDustPct}%), Water, Food, and Storm Protection before sleeping!`,
                  `. Gerencie Stamina, Poeira Solar (${state.survival.panelDustPct}%), Água, Comida e Proteção contra Tempestades antes de dormir!`
                )}
              </p>

              {localizedDominoAlerts.length > 0 && (
                <div className="mt-2.5 space-y-1 rounded-sm border-2 border-rose-500/75 bg-rose-950/50 px-3 py-2 font-dialog text-xs text-rose-100">
                  <span className="block font-pixel text-[8px] text-rose-300">
                    ⚠️ {dict.survival.baseHub.cascadeTitle} ({localizedDominoAlerts.length})
                  </span>
                  {localizedDominoAlerts.map((alert) => (
                    <p key={alert}>• {alert}</p>
                  ))}
                </div>
              )}

              {earlyWarningText && (
                <div className="mt-2.5 rounded-sm border border-orange-400/70 bg-orange-950/50 px-3 py-2 font-dialog text-xs text-orange-100">
                  {earlyWarningText}
                </div>
              )}

              {state.survival.turnsLeft <= 0 && (
                <div className="mt-2.5 rounded-sm border border-indigo-400 bg-indigo-950/60 px-3 py-2 font-dialog text-xs font-bold text-indigo-100">
                  {tx(
                    `Turns for Sol ${state.survival.sol} depleted (0/4). Click "Sleep" to advance to Sol ${Math.min(30, state.survival.sol + 1)}/30!`,
                    `Turnos do Sol ${state.survival.sol} esgotados (0/4). Clique em "Dormir" para avançar para o Sol ${Math.min(30, state.survival.sol + 1)}/30!`
                  )}
                </div>
              )}
            </>
          ) : mission5Unlocked ? (
            <>
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-orange-300">
                  <ShieldAlert className="h-5 w-5 text-orange-300" />
                  <h1 className="font-pixel text-xs">{mission5.title}</h1>
                </div>
                <span
                  className={`rounded-sm border px-2 py-0.5 font-dialog text-[11px] ${
                    mission5Completed
                      ? 'border-emerald-400 bg-emerald-950/80 text-emerald-300'
                      : 'border-orange-400 bg-orange-950/60 text-orange-200'
                  }`}
                >
                  {mission5Completed ? '✓ CONCLUÍDA' : 'DESBLOQUEADA'}
                </span>
              </div>

              <p className="font-dialog text-xs leading-relaxed text-slate-200 sm:text-sm">
                {mission5.scientificObjective}
              </p>

              <div className="mt-3 rounded-sm border border-orange-500/40 bg-slate-900 p-2.5">
                <span className="block font-pixel text-[8px] text-orange-300">
                  REFERÊNCIA CIENTÍFICA ({mission5.nasaReference})
                </span>
                <p className="mt-1 font-dialog text-xs text-orange-100">
                  Tempestade de Poeira • Limpeza Remota • Abrigo Blindado contra Radiação Solar (H2O + Regolito)
                </p>
              </div>
            </>
          ) : mission4Unlocked ? (
            <>
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-emerald-300">
                  <Sprout className="h-5 w-5 text-emerald-300" />
                  <h1 className="font-pixel text-xs">{mission4.title}</h1>
                </div>
                <span
                  className={`rounded-sm border px-2 py-0.5 font-dialog text-[11px] ${
                    mission4Completed
                      ? 'border-emerald-400 bg-emerald-950/80 text-emerald-300'
                      : 'border-emerald-400 bg-emerald-950/60 text-emerald-200'
                  }`}
                >
                  {mission4Completed ? '✓ CONCLUÍDA' : 'DESBLOQUEADA'}
                </span>
              </div>

              <p className="font-dialog text-xs leading-relaxed text-slate-200 sm:text-sm">
                {mission4.scientificObjective}
              </p>

              <div className="mt-3 rounded-sm border border-emerald-500/40 bg-slate-900 p-2.5">
                <span className="block font-pixel text-[8px] text-emerald-300">
                  REFERÊNCIA CIENTÍFICA ({mission4.nasaReference})
                </span>
                <p className="mt-1 font-dialog text-xs text-emerald-100">
                  Hidroponia & Aeroponia • Controle LED e Clima • Ciclo Bioregenerativo (Comida + O2 + Água)
                </p>
              </div>
            </>
          ) : mission3Unlocked ? (
            <>
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-cyan-300">
                  <Snowflake className="h-5 w-5 text-cyan-300" />
                  <h1 className="font-pixel text-xs">{mission3.title}</h1>
                </div>
                <span
                  className={`rounded-sm border px-2 py-0.5 font-dialog text-[11px] ${
                    mission3Completed
                      ? 'border-emerald-400 bg-emerald-950/80 text-emerald-300'
                      : 'border-cyan-400 bg-cyan-950/70 text-cyan-200'
                  }`}
                >
                  {mission3Completed ? '✓ CONCLUÍDA' : 'DESBLOQUEADA'}
                </span>
              </div>

              <p className="font-dialog text-xs leading-relaxed text-slate-200 sm:text-sm">
                {mission3.scientificObjective}
              </p>

              <div className="mt-3 rounded-sm border border-cyan-500/40 bg-slate-900 p-2.5">
                <span className="block font-pixel text-[8px] text-cyan-300">
                  REFERÊNCIA CIENTÍFICA ({mission3.nasaReference})
                </span>
                <p className="mt-1 font-dialog text-xs text-cyan-100">
                  HiRISE + Radar SHARAD • Perfuração Exploratória • Filtragem e Potabilidade
                </p>
              </div>
            </>
          ) : mission2Unlocked ? (
            <>
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-cyan-300">
                  <HeartPulse className="h-5 w-5 text-rose-400" />
                  <h1 className="font-pixel text-xs">{mission2.title}</h1>
                </div>
                <span
                  className={`rounded-sm border px-2 py-0.5 font-dialog text-[11px] ${
                    mission2Completed
                      ? 'border-emerald-400 bg-emerald-950/80 text-emerald-300'
                      : 'border-cyan-400 bg-cyan-950/70 text-cyan-200'
                  }`}
                >
                  {mission2Completed ? '✓ CONCLUÍDA' : 'DESBLOQUEADA'}
                </span>
              </div>

              <p className="font-dialog text-xs leading-relaxed text-slate-200 sm:text-sm">
                {mission2.scientificObjective}
              </p>

              <div className="mt-3 rounded-sm border border-cyan-500/40 bg-slate-900 p-2.5">
                <span className="block font-pixel text-[8px] text-cyan-300">
                  REFERÊNCIA CIENTÍFICA ({mission2.nasaReference})
                </span>
                <p className="mt-1 font-dialog text-xs text-cyan-100">
                  Estação de Treino • Refeitório Equilibrado • Higiene Espacial • Cena Especial da Capi
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-amber-300">
                  <SunMedium className="h-5 w-5" />
                  <h1 className="font-pixel text-xs">{mission1.title}</h1>
                </div>
                <span
                  className={`rounded-sm border px-2 py-0.5 font-dialog text-[11px] ${
                    mission1Completed
                      ? 'border-emerald-400 bg-emerald-950/80 text-emerald-300'
                      : 'border-amber-400 bg-amber-950/70 text-amber-200'
                  }`}
                >
                  {mission1Completed ? '✓ CONCLUÍDA' : 'DISPONÍVEL'}
                </span>
              </div>

              <p className="font-dialog text-xs leading-relaxed text-slate-200 sm:text-sm">
                {mission1.scientificObjective}
              </p>

              <div className="mt-3 rounded-sm border border-cyan-500/40 bg-slate-900 p-2.5">
                <span className="block font-pixel text-[8px] text-cyan-300">
                  MODELO SOLAR DE REFERÊNCIA ({mission1.nasaReference})
                </span>
                <p className="mt-1 font-dialog text-xs text-cyan-100">
                  Z = arccos(sin δ · sin φ + cos δ · cos φ · cos H) &nbsp;|&nbsp; h = 90° − Z
                </p>
              </div>
            </>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {isSurvival && (
              <>
                <button
                  type="button"
                  onClick={handleOpenMission1}
                  className="pixel-btn inline-flex items-center gap-1.5 bg-amber-400 px-3 py-2 font-pixel text-[9px] text-slate-950 hover:bg-amber-300"
                >
                  <SunMedium className="h-3.5 w-3.5" />
                  {tx('1. Solar', '1. Solar')}
                </button>
                <button
                  type="button"
                  onClick={handleOpenMission2}
                  className="pixel-btn inline-flex items-center gap-1.5 bg-cyan-400 px-3 py-2 font-pixel text-[9px] text-slate-950 hover:bg-cyan-300"
                >
                  <HeartPulse className="h-3.5 w-3.5" />
                  {tx('2. Health', '2. Saúde')}
                </button>
                <button
                  type="button"
                  onClick={handleOpenMission3}
                  className="pixel-btn inline-flex items-center gap-1.5 bg-sky-400 px-3 py-2 font-pixel text-[9px] text-slate-950 hover:bg-sky-300"
                >
                  <Snowflake className="h-3.5 w-3.5" />
                  {tx('3. Ice/Water', '3. Gelo/Água')}
                </button>
                <button
                  type="button"
                  onClick={handleOpenMission4}
                  className="pixel-btn inline-flex items-center gap-1.5 bg-emerald-400 px-3 py-2 font-pixel text-[9px] text-slate-950 hover:bg-emerald-300"
                >
                  <Sprout className="h-3.5 w-3.5" />
                  {tx('4. Greenhouse', '4. Estufa')}
                </button>
                <button
                  type="button"
                  onClick={handleOpenMission5}
                  className="pixel-btn inline-flex items-center gap-1.5 bg-orange-400 px-3 py-2 font-pixel text-[9px] text-slate-950 hover:bg-orange-300"
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                  {tx('5. Shelter', '5. Abrigo')}
                </button>
              </>
            )}

            {!isSurvival && endingUnlocked && (
              <>
                <button
                  type="button"
                  onClick={handleOpenEarthComms}
                  className="pixel-btn inline-flex items-center gap-1.5 bg-cyan-400 px-3.5 py-2 font-pixel text-[10px] text-slate-950 hover:bg-cyan-300"
                >
                  <Satellite className="h-4 w-4" />
                  Central de Comunicação (Cena 6) ▶
                </button>
                <button
                  type="button"
                  onClick={handleOpenFutureMars}
                  className="pixel-btn inline-flex items-center gap-1.5 bg-amber-300 px-3.5 py-2 font-pixel text-[10px] text-slate-950 hover:bg-amber-200"
                >
                  <Sparkles className="h-4 w-4" />
                  Futuro em Marte (Cena 7) ▶
                </button>
              </>
            )}

            {!isSurvival && mission5Unlocked && (
              <button
                type="button"
                onClick={handleOpenMission5}
                className="pixel-btn inline-flex items-center gap-1.5 bg-orange-400 px-3.5 py-2 font-pixel text-[10px] text-slate-950 hover:bg-orange-300"
              >
                <ShieldAlert className="h-4 w-4" />
                {mission5Completed
                  ? 'Rever Missão 5: Tempestades ▶'
                  : 'Iniciar Missão 5: Tempestades em Marte ▶'}
              </button>
            )}

            {!isSurvival && mission4Unlocked && (
              <button
                type="button"
                onClick={handleOpenMission4}
                className="pixel-btn inline-flex items-center gap-1.5 bg-emerald-400 px-3.5 py-2 font-pixel text-[10px] text-slate-950 hover:bg-emerald-300"
              >
                <Sprout className="h-4 w-4" />
                {mission4Completed
                  ? 'Rever Missão 4: Estufa ▶'
                  : 'Iniciar Missão 4: A Primeira Estufa ▶'}
              </button>
            )}

            {!isSurvival && mission3Unlocked && (
              <button
                type="button"
                onClick={handleOpenMission3}
                className="pixel-btn inline-flex items-center gap-1.5 bg-sky-400 px-3.5 py-2 font-pixel text-[10px] text-slate-950 hover:bg-sky-300"
              >
                <Snowflake className="h-4 w-4" />
                {mission3Completed
                  ? 'Rever Missão 3: Gelo ▶'
                  : 'Iniciar Missão 3: O Mistério do Gelo ▶'}
              </button>
            )}

            {!isSurvival && mission2Unlocked && (
              <button
                type="button"
                onClick={handleOpenMission2}
                className="pixel-btn inline-flex items-center gap-1.5 bg-cyan-400 px-3.5 py-2 font-pixel text-[10px] text-slate-950 hover:bg-cyan-300"
              >
                <HeartPulse className="h-4 w-4" />
                {mission2Completed
                  ? 'Rever Missão 2: Saúde ▶'
                  : 'Iniciar Missão 2: Cuidando do Astronauta ▶'}
              </button>
            )}

            {!isSurvival && (
              <button
                type="button"
                onClick={handleOpenMission1}
                className="pixel-btn inline-flex items-center gap-1.5 bg-emerald-400 px-3.5 py-2 font-pixel text-[10px] text-slate-950 hover:bg-emerald-300"
              >
                <SunMedium className="h-4 w-4" />
                {solarInstalled
                  ? 'Painel da Missão 1 ▶'
                  : 'Iniciar Missão 1: Energia Solar ▶'}
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                openModal('ARCADIA_MAP');
              }}
              className="pixel-btn inline-flex items-center gap-1.5 bg-cyan-400 px-3 py-1.5 font-dialog text-xs font-bold text-slate-950 hover:bg-cyan-300"
            >
              <Map className="h-3.5 w-3.5" />
              Mapa de Arcadia
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                openModal('LOGBOOK');
              }}
              className="pixel-btn inline-flex items-center gap-1.5 bg-amber-400 px-3 py-1.5 font-dialog text-xs font-bold text-slate-950 hover:bg-amber-300"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Diário
            </button>

            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                openModal('SLEEP_REPORT');
              }}
              className="pixel-btn inline-flex items-center gap-1.5 bg-indigo-400 px-3 py-1.5 font-dialog text-xs font-bold text-slate-950 hover:bg-indigo-300"
            >
              <Moon className="h-3.5 w-3.5" />
              Dormir
            </button>
          </div>
        </div>

        {/* Registro modular das 5 missões */}
        <div className="rounded-sm border-2 border-slate-800 bg-slate-950 p-4">
          <div className="mb-2 flex items-center gap-2 text-cyan-300">
            <Sparkles className="h-4 w-4" />
            <h2 className="font-pixel text-[10px]">
              {tx('EXPEDITION CARTRIDGES', 'CARTUCHOS DA EXPEDIÇÃO')}
            </h2>
          </div>
          <p className="mb-2.5 font-dialog text-[11px] text-slate-400">
            {getLocalizedEarthSyncStatus(state.lastEarthSyncStatus, dict, translateText)}
          </p>
          <ul className="space-y-2">
            {MISSION_REGISTRY.map((mission) => {
              const isM1Done = mission.id === 'MISSION_1' && mission1Completed;
              const isM2Done = mission.id === 'MISSION_2' && mission2Completed;
              const isM3Done = mission.id === 'MISSION_3' && mission3Completed;
              const isM4Done = mission.id === 'MISSION_4' && mission4Completed;
              const isM5Done = mission.id === 'MISSION_5' && mission5Completed;
              const isM2Unlocked = mission.id === 'MISSION_2' && mission2Unlocked;
              const isM3Unlocked = mission.id === 'MISSION_3' && mission3Unlocked;
              const isM4Unlocked = mission.id === 'MISSION_4' && mission4Unlocked;
              const isM5Unlocked = mission.id === 'MISSION_5' && mission5Unlocked;
              const isDone = !isSurvival && (isM1Done || isM2Done || isM3Done || isM4Done || isM5Done);
              const isClickable =
                isSurvival ||
                mission.id === 'MISSION_1' ||
                isM2Unlocked ||
                isM3Unlocked ||
                isM4Unlocked ||
                isM5Unlocked;
              const survivalRule = isSurvival
                ? getLocalizedStationRule(mission.id as SurvivalStationId, dict)
                : null;

              return (
                <li key={mission.id}>
                  <button
                    type="button"
                    aria-disabled={!isClickable}
                    onClick={() => {
                      if (!isClickable) {
                        soundEngine.playAlert();
                        setHubFeedback({ kind: 'LOCKED_MISSION', missionId: mission.id });
                        return;
                      }
                      setHubFeedback(null);
                      if (mission.id === 'MISSION_1') handleOpenMission1();
                      if (mission.id === 'MISSION_2') handleOpenMission2();
                      if (mission.id === 'MISSION_3') handleOpenMission3();
                      if (mission.id === 'MISSION_4') handleOpenMission4();
                      if (mission.id === 'MISSION_5') handleOpenMission5();
                    }}
                    className={`flex w-full cursor-pointer items-start justify-between gap-2 rounded-sm border p-2 text-left transition ${
                      isDone
                        ? 'border-emerald-400/70 bg-emerald-950/30 hover:bg-emerald-950/50'
                        : isClickable
                        ? 'border-amber-400/70 bg-amber-950/30 hover:bg-amber-950/50'
                        : 'border-slate-800 bg-slate-900/60 opacity-80 hover:border-slate-600'
                    }`}
                  >
                    <div>
                      <p className="font-dialog text-xs font-bold text-slate-100">
                        {survivalRule ? survivalRule.title : mission.title}
                      </p>
                      <p className="font-dialog text-[10px] text-slate-400">
                        {survivalRule
                          ? `${survivalRule.costLabel} • ${survivalRule.rewardLabel}`
                          : isM5Unlocked && !isM5Done
                          ? 'DESBLOQUEADA! Clique para iniciar ▶'
                          : isM4Unlocked && !isM4Done
                          ? 'DESBLOQUEADA! Clique para iniciar ▶'
                          : isM3Unlocked && !isM3Done
                          ? 'DESBLOQUEADA! Clique para iniciar ▶'
                          : isM2Unlocked && !isM2Done
                          ? 'DESBLOQUEADA! Clique para iniciar ▶'
                          : mission.subtitle}
                      </p>
                    </div>
                    {isDone ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    ) : isM5Unlocked || (isSurvival && mission.id === 'MISSION_5') ? (
                      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-orange-300" />
                    ) : isM4Unlocked || (isSurvival && mission.id === 'MISSION_4') ? (
                      <Sprout className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    ) : isM3Unlocked || (isSurvival && mission.id === 'MISSION_3') ? (
                      <Snowflake className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    ) : isM2Unlocked || (isSurvival && mission.id === 'MISSION_2') ? (
                      <HeartPulse className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />
                    ) : mission.id === 'MISSION_1' ? (
                      <SunMedium className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                    ) : (
                      <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <CapiAssistant lines={capiLines} />
      <SurvivalResultOverlay />
    </section>
  );
};

export const SceneManager: React.FC = () => {
  const { state } = useGameStore();

  switch (state.currentScene) {
    case 'START_SCREEN':
      return <StartScreenScene />;
    case 'COUNTDOWN':
      return <CountdownScene />;
    case 'LAUNCH':
      return <LaunchScene />;
    case 'CAPI_INTRO':
      return <CapiIntroScene />;
    case 'CUSTOMIZE':
      return <CustomizeScene />;
    case 'LANDING':
      return <LandingScene />;
    case 'BASE_HUB':
      return <BaseHubScene />;
    case 'MISSION_1':
      return <Mission1SolarScene />;
    case 'MISSION_2':
      return <Mission2HealthScene />;
    case 'MISSION_3':
      return <Mission3IceScene />;
    case 'MISSION_4':
      return <Mission4GreenhouseScene />;
    case 'MISSION_5':
      return <Mission5StormsScene />;
    case 'EARTH_COMMS':
      return <EarthCommsScene />;
    case 'FUTURE_MARS':
      return <FutureMarsScene />;
    case 'ARCADE_RUSH':
      return <ArcadeRushScene />;
    default:
      return <StartScreenScene />;
  }
};
