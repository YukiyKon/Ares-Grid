import React, { useState } from 'react';
import {
  CheckCircle2,
  Compass,
  HeartPulse,
  Lock,
  Map as MapIcon,
  Satellite,
  ShieldAlert,
  Snowflake,
  Sprout,
  SunMedium,
  X,
} from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { type GameSceneId, useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';
import { useLanguage } from '../../i18n/LanguageContext';

export interface RegionalSector {
  id: 'NORTH' | 'WEST' | 'CENTER' | 'EAST' | 'SOUTH';
  shortLabel: string;
  title: string;
  description: string;
  targetScene: GameSceneId;
  unlockHint: string;
  positionClass: string;
  pinColorClass: string;
  icon: React.ReactNode;
}

interface ArcadiaRegionalMapCanvasProps {
  allActive?: boolean;
  onNavigate?: () => void;
}

export const ArcadiaRegionalMapCanvas: React.FC<ArcadiaRegionalMapCanvasProps> = ({
  allActive = false,
  onNavigate,
}) => {
  const { state, setScene } = useGameStore();
  const { dict, tx } = useLanguage();
  const [imgError, setImgError] = useState(false);
  const [selectedSectorId, setSelectedSectorId] = useState<RegionalSector['id']>('CENTER');

  const sectors: RegionalSector[] = [
    {
      id: 'NORTH',
      shortLabel: tx('NORTH SECTOR', 'SETOR NORTE'),
      title: tx('Buried Ice Deposit (SHARAD Radar)', 'Jazida de Gelo Subterrâneo (Radar SHARAD)'),
      description: tx(
        'Mission 3 — HiRISE/SHARAD orbital analysis, core drilling & water purification.',
        'Missão 3 — Análise orbital HiRISE/SHARAD, perfuração e purificação de água.'
      ),
      targetScene: 'MISSION_3',
      unlockHint: tx(
        'Complete Mission 2 (Habitat Health) to unlock the North Sector.',
        'Conclua a Missão 2 (Saúde no Habitat) para liberar o Setor Norte.'
      ),
      positionClass: 'left-[50%] top-[4%] -translate-x-1/2 sm:top-[6%]',
      pinColorClass: 'border-cyan-300 text-cyan-200',
      icon: <Snowflake className="h-3.5 w-3.5 text-cyan-300" />,
    },
    {
      id: 'WEST',
      shortLabel: tx('WEST PAD', 'PLATAFORMA OESTE'),
      title: tx('Spacecraft & Earth Dish', 'Espaçonave & Antena Terra'),
      description: tx(
        'Scene 6 — Shipboard server and General Report uplink to Earth.',
        'Cena 6 — Servidor de bordo e transmissão do Relatório Geral à Terra.'
      ),
      targetScene: 'EARTH_COMMS',
      unlockHint: tx(
        'Finish all 5 missions to unlock the Earth Communications Center.',
        'Conclua todas as 5 missões para liberar a Central de Comunicação com a Terra.'
      ),
      positionClass: 'left-[2%] top-[47%] -translate-y-1/2 sm:left-[6%] sm:top-[46%]',
      pinColorClass: 'border-sky-300 text-sky-200',
      icon: <Satellite className="h-3.5 w-3.5 text-sky-300" />,
    },
    {
      id: 'CENTER',
      shortLabel: tx('CENTER SECTOR', 'SETOR CENTRAL'),
      title: tx('Arcadia Base & Solar Panels', 'Base Arcadia & Painéis Solares'),
      description: tx(
        'Main camp • Mission 1 (Solar Power) and Mission 2 (Astronaut Health).',
        'Acampamento principal • Missão 1 (Energia Solar) e Missão 2 (Saúde).'
      ),
      targetScene: 'BASE_HUB',
      unlockHint: tx('Always accessible.', 'Sempre disponível.'),
      positionClass: 'left-[50%] top-[47%] -translate-x-1/2 -translate-y-1/2 sm:top-[48%]',
      pinColorClass: 'border-amber-300 text-amber-200',
      icon: <SunMedium className="h-3.5 w-3.5 text-amber-300" />,
    },
    {
      id: 'EAST',
      shortLabel: tx('EAST SECTOR', 'SETOR LESTE'),
      title: tx('Experimental Greenhouse Dome (ECLSS)', 'Domo da Estufa Experimental (ECLSS)'),
      description: tx(
        'Mission 4 — Hydroponics, aeroponics, and bioregenerative ECLSS life support.',
        'Missão 4 — Hidroponia, aeroponia e sistema bioregenerativo sustentável.'
      ),
      targetScene: 'MISSION_4',
      unlockHint: tx(
        'Complete Mission 3 (Ice & Water) to unlock the East Sector.',
        'Conclua a Missão 3 (Gelo e Água) para liberar o Setor Leste.'
      ),
      positionClass: 'right-[2%] top-[47%] -translate-y-1/2 sm:right-[6%] sm:top-[46%]',
      pinColorClass: 'border-emerald-300 text-emerald-200',
      icon: <Sprout className="h-3.5 w-3.5 text-emerald-300" />,
    },
    {
      id: 'SOUTH',
      shortLabel: tx('SOUTH SECTOR', 'SETOR SUL'),
      title: tx('Shielded Shelter & Weather Station', 'Abrigo Blindado & Estação Ambiental'),
      description: tx(
        'Mission 5 — Dust storm sealing and solar radiation shelter protocols.',
        'Missão 5 — Protocolos contra tempestades de poeira e radiação solar.'
      ),
      targetScene: 'MISSION_5',
      unlockHint: tx(
        'Complete Mission 4 (Greenhouse) to unlock the South Sector.',
        'Conclua a Missão 4 (Estufa) para liberar o Setor Sul.'
      ),
      positionClass: 'left-[50%] bottom-[13%] -translate-x-1/2 sm:bottom-[9%]',
      pinColorClass: 'border-orange-300 text-orange-200',
      icon: <ShieldAlert className="h-3.5 w-3.5 text-orange-300" />,
    },
  ];

  const isSurvival = state.gameMode === 'SURVIVAL_30';

  const getSectorStatus = (id: RegionalSector['id']) => {
    if (allActive) {
      return { unlocked: true, completed: true, label: dict.map.activeBadge };
    }
    if (isSurvival) {
      return { unlocked: true, completed: false, label: dict.map.freeModeBadge };
    }
    const completedLabel = tx('COMPLETED ✓', 'CONCLUÍDO ✓');
    const openLabel = tx('OPEN ▶', 'DISPONÍVEL ▶');
    const lockedLabel = tx('LOCKED', 'BLOQUEADO');

    switch (id) {
      case 'CENTER': {
        const completed =
          state.mission1.mission1Completed && state.mission2.mission2Completed;
        return {
          unlocked: true,
          completed,
          label: completed ? completedLabel : openLabel,
        };
      }
      case 'NORTH':
        return {
          unlocked: state.mission2.mission3Unlocked,
          completed: state.mission3.mission3Completed,
          label: state.mission3.mission3Completed
            ? completedLabel
            : state.mission2.mission3Unlocked
            ? openLabel
            : lockedLabel,
        };
      case 'EAST':
        return {
          unlocked: state.mission3.mission4Unlocked,
          completed: state.mission4.mission4Completed,
          label: state.mission4.mission4Completed
            ? completedLabel
            : state.mission3.mission4Unlocked
            ? openLabel
            : lockedLabel,
        };
      case 'SOUTH':
        return {
          unlocked: state.mission4.mission5Unlocked,
          completed: state.mission5.mission5Completed,
          label: state.mission5.mission5Completed
            ? completedLabel
            : state.mission4.mission5Unlocked
            ? openLabel
            : lockedLabel,
        };
      case 'WEST':
        return {
          unlocked: state.mission5.endingUnlocked,
          completed: state.mission5.earthTransmissionCompleted,
          label: state.mission5.earthTransmissionCompleted
            ? completedLabel
            : state.mission5.endingUnlocked
            ? openLabel
            : lockedLabel,
        };
    }
  };

  const handleGoToScene = (scene: GameSceneId) => {
    soundEngine.playSuccess();
    setScene(scene);
    onNavigate?.();
  };

  const selectedSector =
    sectors.find((s) => s.id === selectedSectorId) ?? sectors[2];
  const selectedStatus = getSectorStatus(selectedSector.id);

  return (
    <div className="space-y-3">
      <div className="pixel-box-mars relative aspect-[4/3] min-h-[265px] w-full overflow-hidden bg-gradient-to-br from-orange-950 via-amber-950 to-stone-950 sm:aspect-video sm:min-h-[360px]">
        {!imgError ? (
          <img
            src={ASSET_MANIFEST.arcadiaWorldMap.path}
            alt={ASSET_MANIFEST.arcadiaWorldMap.alt}
            onError={() => setImgError(true)}
            className="pixel-art h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-pixel text-xs text-amber-200">
            {ASSET_MANIFEST.arcadiaWorldMap.fallbackLabel}
          </div>
        )}

        {/* Grade orbital discreta estilo cartografia NASA */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(251,191,36,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(251,191,36,0.35) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        {/* Linhas de rota conectando a Base Central aos 4 setores cardeais */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-55"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <line x1="50" y1="20" x2="50" y2="82" stroke="#fcd34d" strokeWidth="0.5" strokeDasharray="1.8 1.5" />
          <line x1="16" y1="48" x2="86" y2="48" stroke="#fcd34d" strokeWidth="0.5" strokeDasharray="1.8 1.5" />
        </svg>

        {/* 5 Pins interativos responsivos sem sobreposição em mobile/tablet */}
        {sectors.map((sector) => {
          const status = getSectorStatus(sector.id);
          const isSelected = selectedSectorId === sector.id;
          return (
            <button
              key={sector.id}
              type="button"
              onClick={() => {
                setSelectedSectorId(sector.id);
                if (status.unlocked) {
                  handleGoToScene(sector.targetScene);
                } else {
                  soundEngine.playAlert();
                }
              }}
              onMouseEnter={() => setSelectedSectorId(sector.id)}
              className={`group absolute ${sector.positionClass} flex w-[96px] flex-col items-center rounded-sm border-2 px-1.5 py-1 text-center shadow-xl transition hover:scale-105 sm:w-[214px] sm:px-2.5 sm:py-1.5 ${
                status.completed
                  ? 'border-emerald-300 bg-slate-950/95'
                  : status.unlocked
                  ? `${sector.pinColorClass} bg-slate-950/95 ring-2 ring-amber-300/40`
                  : 'border-slate-700 bg-slate-950/85 opacity-80'
              } ${isSelected ? 'ring-2 ring-cyan-300' : ''}`}
            >
              <span className="flex items-center gap-1 font-pixel text-[6.5px] leading-tight sm:text-[8px]">
                {status.completed ? (
                  <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-400 sm:h-3.5 sm:w-3.5" />
                ) : status.unlocked ? (
                  sector.icon
                ) : (
                  <Lock className="h-3 w-3 shrink-0 text-slate-400" />
                )}
                <span className="truncate">{sector.shortLabel}</span>
              </span>
              <span className="mt-0.5 hidden whitespace-normal font-dialog text-[11px] font-bold leading-tight text-slate-100 sm:block">
                {sector.title}
              </span>
              <span
                className={`mt-0.5 rounded-sm px-1 py-0.5 font-pixel text-[5.5px] sm:px-1.5 sm:text-[7px] ${
                  status.completed
                    ? 'bg-emerald-950 text-emerald-300'
                    : status.unlocked
                    ? 'bg-amber-950 text-amber-200'
                    : 'bg-slate-900 text-slate-400'
                }`}
              >
                {status.label}
              </span>
            </button>
          );
        })}

        {/* Crédito orbital oficial discreto */}
        <div className="pointer-events-none absolute bottom-1 right-1.5 left-1.5 truncate rounded-sm border border-slate-700/80 bg-slate-950/85 px-2 py-0.5 text-right font-dialog text-[9px] text-slate-300 sm:left-auto sm:bottom-1.5 sm:right-2 sm:text-[10px]">
          {dict.map.orbitalSource}
        </div>
      </div>

      {/* Seletor rápido de toque para celular */}
      <div className="flex flex-wrap items-center gap-1.5 sm:hidden">
        {sectors.map((sector) => {
          const isSelected = selectedSectorId === sector.id;
          return (
            <button
              key={sector.id}
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setSelectedSectorId(sector.id);
              }}
              className={`min-h-[36px] rounded-sm border px-2 py-1 font-pixel text-[7px] ${
                isSelected
                  ? 'border-cyan-300 bg-cyan-950 text-cyan-200'
                  : 'border-slate-700 bg-slate-900 text-slate-300'
              }`}
            >
              {sector.shortLabel}
            </button>
          );
        })}
      </div>

      {/* Painel de Telemetria do Setor Selecionado + Ações Diretas */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border-2 border-slate-800 bg-slate-900/95 p-3">
        <div className="min-w-[200px] flex-1">
          <div className="flex items-center gap-2">
            {selectedSector.icon}
            <p className="font-pixel text-[9px] text-amber-200">
              {selectedSector.shortLabel} — {selectedSector.title}
            </p>
          </div>
          <p className="mt-1 font-dialog text-xs text-slate-200">
            {selectedStatus.unlocked
              ? selectedSector.description
              : `${selectedSector.description} (${selectedSector.unlockHint})`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedSector.id === 'CENTER' ? (
            <>
              <button
                type="button"
                onClick={() => handleGoToScene('BASE_HUB')}
                className="pixel-btn inline-flex min-h-[40px] items-center gap-1 bg-amber-400 px-2.5 py-1.5 font-dialog text-xs font-bold text-slate-950 hover:bg-amber-300"
              >
                <Compass className="h-3.5 w-3.5" />
                {dict.map.goToBaseBtn}
              </button>
              <button
                type="button"
                onClick={() => handleGoToScene('MISSION_1')}
                className="pixel-btn inline-flex min-h-[40px] items-center gap-1 bg-emerald-400 px-2.5 py-1.5 font-dialog text-xs font-bold text-slate-950 hover:bg-emerald-300"
              >
                <SunMedium className="h-3.5 w-3.5" />
                {dict.map.mission1Short}
              </button>
              <button
                type="button"
                disabled={!allActive && !isSurvival && !state.mission1.mission2Unlocked}
                onClick={() => handleGoToScene('MISSION_2')}
                className="pixel-btn inline-flex min-h-[40px] items-center gap-1 bg-cyan-400 px-2.5 py-1.5 font-dialog text-xs font-bold text-slate-950 hover:bg-cyan-300 disabled:opacity-45"
              >
                <HeartPulse className="h-3.5 w-3.5" />
                {dict.map.mission2Short}
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={!selectedStatus.unlocked}
              onClick={() => handleGoToScene(selectedSector.targetScene)}
              className="pixel-btn inline-flex min-h-[40px] items-center gap-1.5 bg-cyan-400 px-3.5 py-2 font-pixel text-[9px] text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-45"
            >
              {selectedStatus.unlocked ? dict.map.exploreSectorBtn : dict.map.sectorLockedBtn}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const ArcadiaMapModal: React.FC = () => {
  const { state, openModal } = useGameStore();
  const { dict } = useLanguage();

  if (state.activeModal !== 'ARCADIA_MAP') return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-2 backdrop-blur-sm sm:p-3"
      role="dialog"
      aria-modal="true"
      aria-label={dict.map.modalAria}
    >
      <div className="pixel-box relative max-h-[92dvh] w-full max-w-4xl overflow-y-auto bg-slate-950 text-slate-100">
        <div className="flex items-center justify-between gap-2 border-b-4 border-slate-800 bg-slate-900 px-3 py-3 sm:px-4">
          <div className="flex min-w-0 items-center gap-2">
            <MapIcon className="h-5 w-5 shrink-0 text-emerald-300" />
            <div className="min-w-0">
              <h2 className="truncate font-pixel text-[10px] text-emerald-200 sm:text-xs">
                {dict.map.title}
              </h2>
              <p className="font-dialog text-xs text-slate-300">
                {dict.map.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              openModal('NONE');
            }}
            aria-label={dict.map.closeAria}
            className="flex min-h-[40px] min-w-[40px] shrink-0 items-center justify-center rounded-sm border-2 border-slate-700 bg-slate-950 p-1 text-slate-300 hover:border-cyan-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-3 sm:p-4">
          <ArcadiaRegionalMapCanvas onNavigate={() => openModal('NONE')} />
        </div>
      </div>
    </div>
  );
};
