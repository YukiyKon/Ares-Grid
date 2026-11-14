import React, { useState } from 'react';
import { BookOpen, Lock, Moon, Sparkles, SunMedium } from 'lucide-react';
import { ASSET_MANIFEST } from '../assets/assetManifest';
import { AstronautAvatar } from '../components/permanent/AstronautAvatar';
import { CapiAssistant } from '../components/permanent/CapiAssistant';
import { MISSION_REGISTRY } from '../missions/missionRegistry';
import { CapiIntroScene } from '../scenes/intro/CapiIntroScene';
import { CountdownScene } from '../scenes/intro/CountdownScene';
import { CustomizeScene } from '../scenes/intro/CustomizeScene';
import { LandingScene } from '../scenes/intro/LandingScene';
import { LaunchScene } from '../scenes/intro/LaunchScene';
import { useGameStore } from './gameStore';
import { soundEngine } from './soundEngine';

const BASE_HUB_CAPI_LINES = [
  'Bem-vindo à nossa Base em Arcadia Planitia, comandante! Tudo está pronto para a Missão 1.',
  'Nosso objetivo científico será instalar os painéis solares calculando a posição do Sol em Marte com o sistema Mars24 da NASA.',
  'Enquanto preparamos a Etapa 2, experimente registrar sua chegada no Diário de Bordo ou testar a Rotina de Sono!',
];

const BaseHubScene: React.FC = () => {
  const { state, openModal } = useGameStore();
  const [imgError, setImgError] = useState(false);
  const mission1 = MISSION_REGISTRY[0];

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-3 py-4 pb-44 sm:pb-36">
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

          {/* Astronauta personalizado em frente ao habitat */}
          <div className="absolute bottom-[10%] left-[29%] flex flex-col items-center">
            <AstronautAvatar profile={state.astronaut} size="md" />
            <span className="mt-1 rounded-sm border border-cyan-400/70 bg-slate-950/90 px-1.5 py-0.5 font-pixel text-[8px] text-cyan-200">
              {state.astronaut.name}
            </span>
          </div>

          {/* Marcador da área solar aguardando Etapa 2 */}
          <div className="absolute bottom-[28%] right-[11%] rounded-sm border-2 border-amber-300 bg-slate-950/90 px-2.5 py-1.5 text-center shadow-lg">
            <span className="block font-pixel text-[8px] text-amber-300">
              ÁREA SOLAR (MISSÃO 1)
            </span>
            <span className="font-dialog text-[11px] text-slate-200">
              Aguardando instalação
            </span>
          </div>
        </div>
      </div>

      {/* Briefing da Missão 1 + Cartuchos Futuros */}
      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className="rounded-sm border-2 border-amber-400/70 bg-slate-950 p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-amber-300">
              <SunMedium className="h-5 w-5" />
              <h1 className="font-pixel text-xs">{mission1.title}</h1>
            </div>
            <span className="rounded-sm border border-emerald-400/70 bg-emerald-950/70 px-2 py-0.5 font-dialog text-[11px] text-emerald-300">
              ETAPA 2 PRONTA
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

          <ul className="mt-3 space-y-1 font-dialog text-xs text-slate-300">
            {mission1.challengesPreview.map((step) => (
              <li key={step}>• {step}</li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                openModal('LOGBOOK');
              }}
              className="pixel-btn inline-flex items-center gap-1.5 bg-amber-400 px-3 py-1.5 font-dialog text-xs font-bold text-slate-950 hover:bg-amber-300"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Registrar Chegada no Diário
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
              Testar Rotina de Sono (7 Etapas)
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
            {MISSION_REGISTRY.map((mission) => (
              <li
                key={mission.id}
                className={`flex items-start justify-between gap-2 rounded-sm border p-2 ${
                  mission.status === 'AVAILABLE'
                    ? 'border-amber-400/70 bg-amber-950/30'
                    : 'border-slate-800 bg-slate-900/60 opacity-75'
                }`}
              >
                <div>
                  <p className="font-dialog text-xs font-bold text-slate-100">
                    {mission.title}
                  </p>
                  <p className="font-dialog text-[10px] text-slate-400">
                    {mission.subtitle}
                  </p>
                </div>
                {mission.status === 'LOCKED' ? (
                  <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
                ) : (
                  <SunMedium className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <CapiAssistant lines={BASE_HUB_CAPI_LINES} />
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
    default:
      return <CountdownScene />;
  }
};
