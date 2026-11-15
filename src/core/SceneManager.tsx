import React, { useState } from 'react';
import { Map, ShieldCheck } from 'lucide-react';
import { ASSET_MANIFEST } from '../assets/assetManifest';
import { AstronautAvatar } from '../components/permanent/AstronautAvatar';
import { CapiAssistant } from '../components/permanent/CapiAssistant';
import { useLanguage } from '../i18n/LanguageContext';
import { Mission1SolarScene } from '../missions/mission1-solar/Mission1SolarScene';
import { Mission2HealthScene } from '../missions/mission2-health/Mission2HealthScene';
import { Mission3IceScene } from '../missions/mission3-ice/Mission3IceScene';
import { Mission4GreenhouseScene } from '../missions/mission4-greenhouse/Mission4GreenhouseScene';
import { Mission5StormsScene } from '../missions/mission5-storms/Mission5StormsScene';
import {
  formatNoticeDescriptor,
  getLocalizedDominoAlerts,
  getLocalizedWeather,
} from '../modes/survival30/survivalI18n';
import { SurvivalResultOverlay } from '../modes/survival30/SurvivalResultOverlay';
import {
  formatMarsClock,
  getCelestialArcProgress,
  getMarsSkyPhase,
  SURVIVAL_STATION_RULES,
  type SurvivalNoticeDescriptor,
  type SurvivalStationId,
} from '../modes/survival30/survivalTypes';
import {
  computeSolarEfficiency,
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
  const {
    state,
    setScene,
    openModal,
    setSurvivalInBunker,
  } = useGameStore();
  const { dict, tx, translateText } = useLanguage();
  const [imgError, setImgError] = useState(false);
  const [hubFeedback, setHubFeedback] = useState<HubFeedback>(null);
  const isSurvival = state.gameMode === 'SURVIVAL_30';
  const rawWeather = getSolWeather(state.survival.sol, state.survival.stormSchedule);
  const survivalWeather = getLocalizedWeather(rawWeather.type, dict);
  const earlyWarning = isSurvival
    ? getNextSolEarlyWarning(
        state.survival.sol,
        state.survival.stormSchedule,
        state.survival.breakers.orbitalRadar
      )
    : null;
  const clockStr = formatMarsClock(state.survival.clockMinutes);
  const skyPhase = isSurvival ? getMarsSkyPhase(state.survival.clockMinutes) : 'NOON';
  const celestialArc = getCelestialArcProgress(state.survival.clockMinutes);
  const solarCalc = computeSolarEfficiency(
    state.survival.clockMinutes,
    state.survival.panelDustPct,
    rawWeather.type,
    state.survival.stormEvent.phase === 'IMPACT'
  );
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
  const { mission2Unlocked } = state.mission1;
  const { mission2Completed, mission3Unlocked } = state.mission2;
  const { mission4Unlocked } = state.mission3;
  const { mission5Unlocked } = state.mission4;
  const { endingUnlocked } = state.mission5;

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
    `Sol ${state.survival.sol}/30 • ${clockStr} (${dict.survival.realtime.dayPhase[skyPhase]}) • ${survivalWeather.shortBadge}`,
    earlyWarningText ??
      tx(
        `Solar: ${solarCalc.outputWatts}W | Hunger: ${state.survival.hunger}% | Thirst: ${state.survival.thirst}% | Dust: ${state.survival.panelDustPct}%. Sleep before 02:00 AM!`,
        `Solar: ${solarCalc.outputWatts}W | Fome: ${state.survival.hunger}% | Sede: ${state.survival.thirst}% | Poeira: ${state.survival.panelDustPct}%. Durma antes das 02:00!`
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

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-2 py-2 sm:px-4">
      {/* Cenário limpo da Base em Arcadia Planitia */}
      <div className="pixel-box-mars relative w-full max-w-[min(64rem,calc((100dvh-150px)*16/9))] overflow-hidden bg-slate-950">
        <div className="relative aspect-[16/10] min-h-[225px] w-full overflow-hidden bg-orange-950 sm:aspect-video">
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

          {/* Transição visual de luz solar/noturna & tempestade no céu da Base */}
          {isSurvival && (
            <>
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 transition-colors duration-1000 ${
                  state.survival.stormEvent.phase === 'PREP_COUNTDOWN' ||
                  state.survival.stormEvent.phase === 'IMPACT'
                    ? 'bg-gradient-to-b from-rose-950/65 via-orange-950/45 to-slate-950/55'
                    : skyPhase === 'NIGHT'
                    ? 'bg-gradient-to-b from-slate-950/80 via-indigo-950/60 to-slate-950/70'
                    : skyPhase === 'DUSK'
                    ? 'bg-gradient-to-b from-orange-700/35 via-amber-900/20 to-slate-950/35'
                    : skyPhase === 'DAWN'
                    ? 'bg-gradient-to-b from-amber-600/25 via-rose-900/15 to-transparent'
                    : 'bg-transparent'
                }`}
              />

              {/* Estrelas marcianas visíveis à noite */}
              {skyPhase === 'NIGHT' && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-1/2 opacity-80"
                  style={{
                    backgroundImage:
                      'radial-gradient(2px 2px at 14% 25%, #e0f2fe, transparent), radial-gradient(2px 2px at 31% 18%, #fef08a, transparent), radial-gradient(1.5px 1.5px at 56% 12%, #fff, transparent), radial-gradient(2px 2px at 74% 28%, #bae6fd, transparent), radial-gradient(1.5px 1.5px at 88% 20%, #fff, transparent)',
                  }}
                />
              )}

              {/* Sol / Lua percorrendo o céu de Arcadia Planitia */}
              <div
                aria-hidden="true"
                style={{
                  left: `${8 + Math.round(celestialArc.progress * 82)}%`,
                  top: `${Math.max(6, Math.round(34 - Math.sin(celestialArc.progress * Math.PI) * 26))}%`,
                }}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 select-none text-lg drop-shadow-[0_0_10px_rgba(251,191,36,0.75)] transition-all duration-700 sm:text-2xl"
              >
                {celestialArc.isNight ? '🌙' : '☀️'}
              </div>
            </>
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
            className={`absolute left-[8%] top-[23%] z-10 min-h-[38px] rounded-sm border-2 bg-slate-950/90 px-2 py-1 text-center shadow-lg transition hover:scale-105 sm:left-[12%] sm:top-[27%] sm:px-2.5 ${
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
                ? tx('Health & Sleep ▶', 'Saúde & Sono ▶')
                : mission2Completed
                  ? tx('Health OK ✓', 'Saúde OK ✓')
                  : mission2Unlocked
                    ? tx('Mission 2: Health ▶', 'Missão 2: Saúde ▶')
                    : tx('Requires Solar', 'Requer Painel Solar')}
            </span>
          </button>

          {/* Sprites 16-bit + Pins de Disjuntores (Parede Esq. Habitat) e Bunker (Terreno Dir.) */}
          {isSurvival && (
            <>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  openModal('BREAKERS');
                }}
                className="group touch-none select-none absolute left-[9%] top-[59%] z-20 flex flex-col items-center transition hover:scale-105 sm:left-[10%] sm:top-[58%]"
              >
                <img
                  src={ASSET_MANIFEST.survivalBreakerBox.path}
                  alt={ASSET_MANIFEST.survivalBreakerBox.alt}
                  className="pixel-art h-9 w-9 drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)] sm:h-12 sm:w-12"
                />
                <span className="-mt-1 rounded-sm border-2 border-cyan-400 bg-slate-950/95 px-1.5 py-0.5 text-center shadow-lg">
                  <span className="block font-pixel text-[6px] text-cyan-300 sm:text-[7px]">
                    {tx('BREAKERS', 'DISJUNTORES')}
                  </span>
                  <span className="hidden font-dialog text-[9px] text-slate-200 sm:block">
                    LED:{state.survival.breakers.greenhouseLeds ? 'ON' : 'OFF'} •{' '}
                    {tx('Heat', 'Aq')}:{state.survival.breakers.habitatHeater ? 'ON' : 'OFF'}
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setSurvivalInBunker(true);
                }}
                className="group touch-none select-none absolute right-[5%] top-[36%] z-10 flex flex-col items-center transition hover:scale-105 sm:right-[7%] sm:top-[35%]"
              >
                <span
                  className={`mb-0.5 flex items-center gap-1 rounded-sm border-2 px-1.5 py-0.5 text-center shadow-lg ${
                    state.survival.stormEvent.phase === 'PREP_COUNTDOWN' ||
                    state.survival.stormEvent.phase === 'IMPACT'
                      ? 'animate-pulse border-rose-400 bg-rose-950/95 text-rose-100'
                      : 'border-amber-400 bg-slate-950/95 text-amber-200'
                  }`}
                >
                  <ShieldCheck className="h-3 w-3 shrink-0" />
                  <span className="font-pixel text-[6px] sm:text-[7px]">BUNKER</span>
                </span>
                <img
                  src={ASSET_MANIFEST.survivalBunkerEntrance.path}
                  alt={ASSET_MANIFEST.survivalBunkerEntrance.alt}
                  className="pixel-art h-14 w-14 drop-shadow-[0_6px_10px_rgba(0,0,0,0.85)] sm:h-20 sm:w-20"
                />
              </button>
            </>
          )}

          {/* 2. Astronauta personalizado (em frente à porta do Habitat) */}
          <div className="pointer-events-none absolute bottom-[5%] left-[25%] z-10 flex flex-col items-center sm:bottom-[8%] sm:left-[28%]">
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
            className="absolute bottom-[6%] left-[49%] z-10 flex min-h-[38px] -translate-x-1/2 flex-col items-center rounded-sm border-2 border-amber-300 bg-slate-950/90 px-2 py-1 text-center shadow-lg transition hover:scale-105 sm:bottom-[9%] sm:px-2.5"
          >
            <RoverSprite size="sm" />
            <span className="inline-flex items-center gap-1 font-pixel text-[6.5px] text-amber-300 sm:text-[8px]">
              <Map className="h-3 w-3 shrink-0" />
              {tx('EXPLORER ROVER', 'ROVER EXPLORADOR')}
            </span>
            <span className="block font-dialog text-[10px] text-slate-200 sm:text-[11px]">
              {tx('🗺️ Arcadia Map ▶', '🗺️ Mapa de Arcadia ▶')}
            </span>
          </button>

          {/* 4. Área Solar clicável no mapa da Base (direita) — Missão 1 */}
          <button
            type="button"
            onClick={handleOpenMission1}
            className="group absolute bottom-[5%] right-[3%] z-10 flex flex-col items-center transition hover:scale-105 sm:bottom-[7%] sm:right-[5%]"
          >
            {isSurvival || solarInstalled ? (
              <img
                src={
                  isSurvival && state.survival.panelDustPct >= 40
                    ? ASSET_MANIFEST.solarPanelDirty.path
                    : ASSET_MANIFEST.solarPanelClean.path
                }
                alt={ASSET_MANIFEST.solarPanelClean.alt}
                className="pixel-art h-12 w-12 drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)] sm:h-20 sm:w-20"
              />
            ) : (
              <div className="mb-1 h-9 w-14 rounded-sm border-2 border-dashed border-amber-300 bg-amber-500/20 group-hover:bg-amber-400/30 sm:h-14 sm:w-24" />
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
              <span className="block font-pixel text-[6px] sm:text-[8px]">
                {isSurvival
                  ? tx(
                      `PANELS (${state.survival.panelDustPct}% DUST)`,
                      `PAINÉIS (${state.survival.panelDustPct}% POEIRA)`
                    )
                  : solarInstalled
                    ? tx(
                        `PANELS ACTIVE (${state.mission1.generatedWatts || 480} W)`,
                        `PAINÉIS ATIVOS (${state.mission1.generatedWatts || 480} W)`
                      )
                    : tx('SOLAR AREA (MISSION 1)', 'ÁREA SOLAR (MISSÃO 1)')}
              </span>
              <span className="font-dialog text-[10px] text-slate-200 sm:text-[11px]">
                {isSurvival
                  ? tx('Clean dust (Real-time) ▶', 'Limpar poeira (Ao Vivo) ▶')
                  : solarInstalled
                    ? tx('Click to manage', 'Clique para gerenciar')
                    : tx('Click to install ▶', 'Clique para instalar ▶')}
              </span>
            </span>
          </button>
        </div>
      </div>

      <CapiAssistant lines={capiLines} compact />
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
