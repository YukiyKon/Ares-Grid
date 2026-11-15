import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  HeartPulse,
  Lock,
  Moon,
  Snowflake,
  Sparkles,
  Sprout,
  SunMedium,
} from 'lucide-react';
import { ASSET_MANIFEST } from '../assets/assetManifest';
import { AstronautAvatar } from '../components/permanent/AstronautAvatar';
import { CapiAssistant } from '../components/permanent/CapiAssistant';
import { MISSION_REGISTRY } from '../missions/missionRegistry';
import { Mission1SolarScene } from '../missions/mission1-solar/Mission1SolarScene';
import { Mission2HealthScene } from '../missions/mission2-health/Mission2HealthScene';
import { Mission3IceScene } from '../missions/mission3-ice/Mission3IceScene';
import { CapiIntroScene } from '../scenes/intro/CapiIntroScene';
import { CountdownScene } from '../scenes/intro/CountdownScene';
import { CustomizeScene } from '../scenes/intro/CustomizeScene';
import { LandingScene } from '../scenes/intro/LandingScene';
import { LaunchScene } from '../scenes/intro/LaunchScene';
import { useGameStore } from './gameStore';
import { soundEngine } from './soundEngine';

const BaseHubScene: React.FC = () => {
  const { state, setScene, openModal } = useGameStore();
  const [imgError, setImgError] = useState(false);
  const mission1 = MISSION_REGISTRY[0];
  const mission2 = MISSION_REGISTRY[1];
  const mission3 = MISSION_REGISTRY[2];
  const { solarInstalled } = state.stats;
  const { mission1Completed, mission2Unlocked } = state.mission1;
  const { mission2Completed, mission3Unlocked } = state.mission2;
  const { mission3Completed, mission4Unlocked } = state.mission3;

  const capiLines = mission4Unlocked
    ? [
        'Fantástico, comandante! Temos energia solar, saúde monitorada e reserva de água potável em 100%!',
        'A Missão 4 (A Primeira Estufa de Marte) já foi desbloqueada para a próxima etapa da expedição!',
      ]
    : mission3Unlocked
    ? [
        'Incrível, comandante! Energia solar ativa e rotina de saúde em dia no Sol atual!',
        'Clique no Campo de Perfuração (ou em "Iniciar Missão 3: Gelo ▶") para procurar gelo subterrâneo em Arcadia Planitia!',
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

  const handleOpenMission1 = () => {
    soundEngine.playClick();
    setScene('MISSION_1');
  };

  const handleOpenMission2 = () => {
    soundEngine.playClick();
    setScene('MISSION_2');
  };

  const handleOpenMission3 = () => {
    soundEngine.playClick();
    setScene('MISSION_3');
  };

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-3 py-4 pb-52 sm:pb-44">
      {/* Cenário limpo da Base em Arcadia Planitia */}
      <div className="pixel-box-mars relative overflow-hidden bg-slate-950">
        <div className="relative aspect-video w-full overflow-hidden bg-orange-950">
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

          {/* Habitat Principal clicável quando Missão 2 estiver liberada */}
          {mission2Unlocked && (
            <button
              type="button"
              onClick={handleOpenMission2}
              className="absolute left-[11%] top-[34%] rounded-sm border-2 border-cyan-300 bg-slate-950/90 px-2.5 py-1 text-center shadow-lg transition hover:scale-105"
            >
              <span className="block font-pixel text-[8px] text-cyan-300">
                {mission2Completed ? 'HABITAT (SAÚDE OK)' : 'HABITAT (MISSÃO 2)'}
              </span>
              <span className="font-dialog text-[11px] text-slate-200">
                Entrar no módulo ▶
              </span>
            </button>
          )}

          {/* Campo de Perfuração clicável quando Missão 3 estiver liberada */}
          {mission3Unlocked && (
            <button
              type="button"
              onClick={handleOpenMission3}
              className="absolute right-[26%] top-[28%] flex flex-col items-center transition hover:scale-105"
            >
              <img
                src={ASSET_MANIFEST.drillRig.path}
                alt={ASSET_MANIFEST.drillRig.alt}
                className="pixel-art h-16 w-auto drop-shadow-[0_6px_10px_rgba(0,0,0,0.7)]"
              />
              <span className="rounded-sm border-2 border-cyan-300 bg-slate-950/95 px-2 py-0.5 text-center shadow-lg">
                <span className="block font-pixel text-[8px] text-cyan-200">
                  {mission3Completed ? 'GELO CONFIRMADO ✓' : 'PERFURAÇÃO (MISSÃO 3)'}
                </span>
                <span className="font-dialog text-[10px] text-slate-200">
                  {mission3Completed ? 'Rever laboratório ▶' : 'Explorar gelo ▶'}
                </span>
              </span>
            </button>
          )}

          {/* Astronauta personalizado em frente ao habitat */}
          <div className="absolute bottom-[10%] left-[29%] flex flex-col items-center">
            <AstronautAvatar profile={state.astronaut} size="md" />
            <span className="mt-1 rounded-sm border border-cyan-400/70 bg-slate-950/90 px-1.5 py-0.5 font-pixel text-[8px] text-cyan-200">
              {state.astronaut.name}
            </span>
          </div>

          {/* Área Solar clicável no mapa da Base */}
          <button
            type="button"
            onClick={handleOpenMission1}
            className="group absolute bottom-[12%] right-[8%] flex flex-col items-center transition hover:scale-105"
          >
            {solarInstalled ? (
              <img
                src={ASSET_MANIFEST.solarPanelClean.path}
                alt={ASSET_MANIFEST.solarPanelClean.alt}
                className="pixel-art h-24 w-24 drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)]"
              />
            ) : (
              <div className="mb-1 h-14 w-24 rounded-sm border-2 border-dashed border-amber-300 bg-amber-500/20 group-hover:bg-amber-400/30" />
            )}
            <span
              className={`rounded-sm border-2 px-2.5 py-1 text-center shadow-lg ${
                solarInstalled
                  ? 'border-emerald-300 bg-slate-950/95 text-emerald-300'
                  : 'border-amber-300 bg-slate-950/95 text-amber-300'
              }`}
            >
              <span className="block font-pixel text-[8px]">
                {solarInstalled
                  ? `PAINÉIS ATIVOS (${state.mission1.generatedWatts || 480} W)`
                  : 'ÁREA SOLAR (MISSÃO 1)'}
              </span>
              <span className="font-dialog text-[11px] text-slate-200">
                {solarInstalled ? 'Clique para gerenciar' : 'Clique para instalar ▶'}
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Briefing Dinâmico da Missão Atual + Cartuchos da Expedição */}
      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className="rounded-sm border-2 border-amber-400/70 bg-slate-950 p-4">
          {mission3Unlocked ? (
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
            {mission3Unlocked && (
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

            {mission2Unlocked && (
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
            <h2 className="font-pixel text-[10px]">CARTUCHOS DA EXPEDIÇÃO</h2>
          </div>
          <p className="mb-2.5 font-dialog text-[11px] text-slate-400">
            {state.lastEarthSyncStatus}
          </p>
          <ul className="space-y-2">
            {MISSION_REGISTRY.map((mission) => {
              const isM1Done = mission.id === 'MISSION_1' && mission1Completed;
              const isM2Done = mission.id === 'MISSION_2' && mission2Completed;
              const isM3Done = mission.id === 'MISSION_3' && mission3Completed;
              const isM2Unlocked = mission.id === 'MISSION_2' && mission2Unlocked;
              const isM3Unlocked = mission.id === 'MISSION_3' && mission3Unlocked;
              const isM4Unlocked = mission.id === 'MISSION_4' && mission4Unlocked;
              const isDone = isM1Done || isM2Done || isM3Done;
              const isClickable =
                mission.id === 'MISSION_1' || isM2Unlocked || isM3Unlocked;

              return (
                <li key={mission.id}>
                  <button
                    type="button"
                    disabled={!isClickable}
                    onClick={() => {
                      if (mission.id === 'MISSION_1') handleOpenMission1();
                      if (mission.id === 'MISSION_2' && isM2Unlocked) handleOpenMission2();
                      if (mission.id === 'MISSION_3' && isM3Unlocked) handleOpenMission3();
                    }}
                    className={`flex w-full items-start justify-between gap-2 rounded-sm border p-2 text-left transition ${
                      isDone
                        ? 'border-emerald-400/70 bg-emerald-950/30 hover:bg-emerald-950/50'
                        : isM3Unlocked || isM2Unlocked || mission.id === 'MISSION_1'
                        ? 'border-amber-400/70 bg-amber-950/30 hover:bg-amber-950/50'
                        : isM4Unlocked
                        ? 'border-emerald-400/70 bg-emerald-950/20'
                        : 'border-slate-800 bg-slate-900/60 opacity-75'
                    }`}
                  >
                    <div>
                      <p className="font-dialog text-xs font-bold text-slate-100">
                        {mission.title}
                      </p>
                      <p className="font-dialog text-[10px] text-slate-400">
                        {isM4Unlocked
                          ? 'DESBLOQUEADA! Pronta para a Etapa 5.'
                          : isM3Unlocked && !isM3Done
                          ? 'DESBLOQUEADA! Clique para iniciar ▶'
                          : isM2Unlocked && !isM2Done
                          ? 'DESBLOQUEADA! Clique para iniciar ▶'
                          : mission.subtitle}
                      </p>
                    </div>
                    {isDone ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    ) : isM4Unlocked ? (
                      <Sprout className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                    ) : isM3Unlocked ? (
                      <Snowflake className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    ) : isM2Unlocked ? (
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
    </section>
  );
};

export const SceneManager: React.FC = () => {
  const { state } = useGameStore();

  switch (state.currentScene) {
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
    default:
      return <CountdownScene />;
  }
};
