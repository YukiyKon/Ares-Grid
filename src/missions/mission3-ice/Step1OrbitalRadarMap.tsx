import React, { useState } from 'react';
import { CheckCircle2, Compass, Layers, MapPin, Radar, ShieldAlert } from 'lucide-react';
import { type ExplorationSectorId, useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

type MapLayerId = 'SURFACE' | 'RADAR' | 'STUDIES';

interface SectorInfo {
  id: ExplorationSectorId;
  name: string;
  coords: string;
  radarSignal: string;
  terrain: string;
  priorStudy: string;
  isIdeal: boolean;
  posClass: string;
  capiFeedback: string;
}

const SECTORS: SectorInfo[] = [
  {
    id: 'ALPHA',
    name: 'Setor Alfa — Borda de Cratera',
    coords: '39,5°N • Declive 24°',
    radarSignal: 'Moderado',
    terrain: 'Rochoso e inclinado (risco para broca)',
    priorStudy: 'Não perfurado',
    isIdeal: false,
    posClass: 'left-[14%] top-[24%]',
    capiFeedback:
      'Cuidado! O Setor Alfa tem relevo muito inclinado e pedregulhos na imagem HiRISE. Nossa perfuradora pode tombar ou quebrar a broca!',
  },
  {
    id: 'BETA',
    name: 'Setor Beta — Planície Sul',
    coords: '38,8°N • Declive 3°',
    radarSignal: 'Fraco (~0,4 m seco)',
    terrain: 'Plano e arenoso',
    priorStudy: 'Já estudado pela NASA (sem depósito espesso)',
    isIdeal: false,
    posClass: 'left-[22%] bottom-[18%]',
    capiFeedback:
      'Olhe os estudos prévios da NASA: o Setor Beta já foi investigado antes e o radar SHARAD mostra pouco gelo ali. Vamos evitar repetir sem necessidade!',
  },
  {
    id: 'GAMMA',
    name: 'Setor Gama — Planície Central Arcadia',
    coords: '39,2°N • Declive 1°',
    radarSignal: 'MUITO FORTE (reflexão a 1,8 m)',
    terrain: 'Plano e estável (HiRISE seguro)',
    priorStudy: 'Área prioritária (First Ice Cores from Mars)',
    isIdeal: true,
    posClass: 'right-[16%] top-[36%]',
    capiFeedback:
      'Excelente análise científica! O Setor Gama combina forte reflexão de gelo no radar SHARAD, terreno plano seguro na câmera HiRISE e recomendação no relatório First Ice Cores from Mars!',
  },
];

interface Step1OrbitalRadarMapProps {
  onComplete: () => void;
  onCapiFeedback: (line: string) => void;
}

export const Step1OrbitalRadarMap: React.FC<Step1OrbitalRadarMapProps> = ({
  onComplete,
  onCapiFeedback,
}) => {
  const { state, updateMission3 } = useGameStore();
  const [activeLayer, setActiveLayer] = useState<MapLayerId>('SURFACE');

  const { layersInspected, selectedSector } = state.mission3;
  const allLayersChecked =
    layersInspected.surface && layersInspected.radar && layersInspected.priorStudies;
  const chosenInfo = SECTORS.find((s) => s.id === selectedSector);
  const canProceed = allLayersChecked && selectedSector === 'GAMMA';

  // Marca a camada inicial de superfície como já inspecionada ao abrir se ainda false
  React.useEffect(() => {
    if (!state.mission3.layersInspected.surface) {
      updateMission3({
        layersInspected: {
          ...state.mission3.layersInspected,
          surface: true,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectLayer = (layer: MapLayerId) => {
    soundEngine.playClick();
    setActiveLayer(layer);
    const nextLayers = {
      surface: layersInspected.surface || layer === 'SURFACE',
      radar: layersInspected.radar || layer === 'RADAR',
      priorStudies: layersInspected.priorStudies || layer === 'STUDIES',
    };
    updateMission3({ layersInspected: nextLayers });

    if (layer === 'SURFACE') {
      onCapiFeedback(
        'Camada Superfície (HiRISE): observe o relevo. Evite bordas de crateras íngremes e procure uma planície plana e segura.'
      );
    } else if (layer === 'RADAR') {
      onCapiFeedback(
        'Camada Radar SHARAD (MRO): ondas de rádio atravessam o solo! Manchas azul-ciano fortes indicam possíveis depósitos de gelo subterrâneo.'
      );
    } else {
      onCapiFeedback(
        'Estudos Prévios da NASA (First Ice Cores from Mars): não devemos repetir perfurações já descartadas no sul se há áreas inéditas promissoras!'
      );
    }
  };

  const handleSelectSector = (sector: SectorInfo) => {
    if (sector.isIdeal) {
      soundEngine.playSuccess();
    } else {
      soundEngine.playAlert();
    }
    updateMission3({ selectedSector: sector.id });
    onCapiFeedback(sector.capiFeedback);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-sm border-2 border-cyan-500/50 bg-slate-900/90 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Radar className="h-4 w-4 text-cyan-300" />
            <h2 className="font-pixel text-[11px] text-cyan-200">
              DESAFIO 3.1 & 3.2 — ANÁLISE ORBITAL (HiRISE + RADAR SHARAD)
            </h2>
          </div>
          <span className="font-dialog text-xs text-slate-300">
            Camadas verificadas:{' '}
            {[
              layersInspected.surface,
              layersInspected.radar,
              layersInspected.priorStudies,
            ].filter(Boolean).length}
            /3
          </span>
        </div>
      </div>

      {/* Controles das 3 camadas científicas */}
      <div className="grid gap-2 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => handleSelectLayer('SURFACE')}
          className={`flex items-center justify-between rounded-sm border-2 px-3 py-2 text-left font-dialog text-xs transition ${
            activeLayer === 'SURFACE'
              ? 'border-amber-400 bg-amber-950/60 text-amber-100'
              : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-amber-400/60'
          }`}
        >
          <span className="flex items-center gap-1.5 font-bold">
            <Layers className="h-4 w-4 text-amber-300" />
            1. Superfície (HiRISE)
          </span>
          {layersInspected.surface && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
        </button>

        <button
          type="button"
          onClick={() => handleSelectLayer('RADAR')}
          className={`flex items-center justify-between rounded-sm border-2 px-3 py-2 text-left font-dialog text-xs transition ${
            activeLayer === 'RADAR'
              ? 'border-cyan-400 bg-cyan-950/60 text-cyan-100'
              : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-cyan-400/60'
          }`}
        >
          <span className="flex items-center gap-1.5 font-bold">
            <Radar className="h-4 w-4 text-cyan-300" />
            2. Radar (SHARAD / MRO)
          </span>
          {layersInspected.radar && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
        </button>

        <button
          type="button"
          onClick={() => handleSelectLayer('STUDIES')}
          className={`flex items-center justify-between rounded-sm border-2 px-3 py-2 text-left font-dialog text-xs transition ${
            activeLayer === 'STUDIES'
              ? 'border-emerald-400 bg-emerald-950/60 text-emerald-100'
              : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-emerald-400/60'
          }`}
        >
          <span className="flex items-center gap-1.5 font-bold">
            <Compass className="h-4 w-4 text-emerald-300" />
            3. Estudos Prévios NASA
          </span>
          {layersInspected.priorStudies && (
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          )}
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.25fr_1fr]">
        {/* Mapa Interativo de Arcadia Planitia com camadas orbitais */}
        <div className="pixel-box relative aspect-video overflow-hidden bg-orange-950">
          {/* Base marciana estilizada */}
          <div
            className={`absolute inset-0 transition-colors duration-300 ${
              activeLayer === 'RADAR'
                ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900'
                : activeLayer === 'STUDIES'
                ? 'bg-gradient-to-br from-stone-900 via-slate-900 to-emerald-950'
                : 'bg-gradient-to-br from-orange-900 via-amber-900 to-red-950'
            }`}
          />

          {/* Grade cartográfica */}
          <div className="pointer-events-none absolute inset-0 hologram-grid opacity-45" />

          {/* Feições visuais por camada */}
          {activeLayer === 'SURFACE' && (
            <>
              {/* Cratera escarpada em Alfa */}
              <div className="pointer-events-none absolute left-[8%] top-[14%] h-24 w-28 rounded-full border-4 border-stone-500/80 bg-stone-900/65 shadow-inner" />
              <div className="pointer-events-none absolute left-[10%] top-[10%] rounded-sm bg-slate-950/80 px-1.5 py-0.5 font-dialog text-[10px] text-amber-200">
                Encosta íngreme / Rochas
              </div>
              {/* Planície nivelada em Gama */}
              <div className="pointer-events-none absolute right-[10%] top-[24%] h-28 w-40 rounded-sm border-2 border-dashed border-emerald-300/60 bg-orange-800/35" />
            </>
          )}

          {activeLayer === 'RADAR' && (
            <>
              {/* Sinal moderado em Alfa */}
              <div className="pointer-events-none absolute left-[12%] top-[20%] h-20 w-20 rounded-full bg-sky-400/25 blur-sm" />
              {/* Sinal fraco em Beta */}
              <div className="pointer-events-none absolute left-[20%] bottom-[14%] h-16 w-24 rounded-full bg-slate-400/15" />
              {/* Forte reflexão SHARAD de gelo em Gama */}
              <div className="pointer-events-none absolute right-[12%] top-[26%] h-28 w-36 animate-pulse rounded-full border-2 border-cyan-300 bg-cyan-400/45 shadow-[0_0_28px_rgba(34,211,238,0.65)]" />
              <div className="pointer-events-none absolute right-[13%] top-[20%] rounded-sm bg-slate-950/90 px-2 py-0.5 font-pixel text-[8px] text-cyan-200">
                ECOS SHARAD: FORTE (-1,8m)
              </div>
            </>
          )}

          {activeLayer === 'STUDIES' && (
            <>
              <div className="pointer-events-none absolute left-[16%] bottom-[12%] rounded-sm border border-amber-400/80 bg-amber-950/90 px-2 py-1 font-dialog text-[10px] text-amber-100">
                Sonda Antiga: Baixo Gelo (Já pesquisado)
              </div>
              <div className="pointer-events-none absolute right-[11%] top-[22%] rounded-sm border border-emerald-400/80 bg-emerald-950/90 px-2 py-1 font-dialog text-[10px] text-emerald-100">
                Relatório First Ice Cores: Prioritário
              </div>
            </>
          )}

          {/* Setores clicáveis */}
          {SECTORS.map((sector) => {
            const isSelected = selectedSector === sector.id;
            return (
              <button
                key={sector.id}
                type="button"
                onClick={() => handleSelectSector(sector)}
                className={`absolute ${sector.posClass} flex items-center gap-1.5 rounded-sm border-2 px-2.5 py-1.5 font-pixel text-[9px] shadow-lg transition hover:scale-105 ${
                  isSelected
                    ? sector.isIdeal
                      ? 'border-emerald-300 bg-emerald-950 text-emerald-200'
                      : 'border-rose-400 bg-rose-950 text-rose-200'
                    : 'border-white/70 bg-slate-950/90 text-white'
                }`}
              >
                <MapPin className="h-3.5 w-3.5 shrink-0 text-cyan-300" />
                <span>{sector.id === 'ALPHA' ? 'Alfa' : sector.id === 'BETA' ? 'Beta' : 'Gama'}</span>
              </button>
            );
          })}

          <div className="pointer-events-none absolute bottom-2 right-2 rounded-sm bg-slate-950/85 px-2 py-0.5 font-dialog text-[10px] text-cyan-200">
            Arcadia Planitia • ~39,2°N • Camada: {activeLayer}
          </div>
        </div>

        {/* Painel de inspeção do setor selecionado */}
        <div className="flex flex-col justify-between gap-3 rounded-sm border border-slate-800 bg-slate-900 p-3">
          {chosenInfo ? (
            <div className="space-y-2 font-dialog text-xs">
              <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-2">
                <strong className="font-pixel text-[10px] text-cyan-200">
                  {chosenInfo.name}
                </strong>
                <span className="text-[11px] text-slate-400">{chosenInfo.coords}</span>
              </div>
              <p>
                <span className="text-slate-400">Superfície (HiRISE): </span>
                <span className="text-slate-100">{chosenInfo.terrain}</span>
              </p>
              <p>
                <span className="text-slate-400">Radar SHARAD: </span>
                <span className="text-cyan-200">{chosenInfo.radarSignal}</span>
              </p>
              <p>
                <span className="text-slate-400">Estudos NASA: </span>
                <span className="text-emerald-200">{chosenInfo.priorStudy}</span>
              </p>

              {!chosenInfo.isIdeal && (
                <div className="flex items-start gap-2 rounded-sm border border-rose-500/60 bg-rose-950/50 p-2 text-[11px] text-rose-200">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    Local não recomendado para perfuração segura. Compare as 3 camadas e teste
                    outro setor!
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-1 flex-col justify-center font-dialog text-xs text-slate-300">
              <p>
                1. Alterne pelos botões <strong>Superfície</strong>,{' '}
                <strong>Radar SHARAD</strong> e <strong>Estudos Prévios NASA</strong> acima do
                mapa.
              </p>
              <p className="mt-2 text-cyan-200">
                2. Clique nos setores <strong>Alfa</strong>, <strong>Beta</strong> ou{' '}
                <strong>Gama</strong> no mapa para escolher o melhor local para perfurar!
              </p>
            </div>
          )}

          {!allLayersChecked && (
            <p className="rounded-sm border border-amber-500/50 bg-amber-950/40 px-2.5 py-1.5 font-dialog text-[11px] text-amber-200">
              Dica científica: clique em todas as 3 camadas orbitais acima antes de autorizar a
              perfuração.
            </p>
          )}

          <button
            type="button"
            disabled={!canProceed}
            onClick={() => {
              soundEngine.playSuccess();
              onComplete();
            }}
            className="pixel-btn w-full bg-cyan-400 px-3 py-2.5 font-pixel text-[10px] text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {canProceed
              ? 'Autorizar Perfuração no Setor Gama (Desafio 3.3) ▶'
              : 'Analise as 3 camadas e selecione o Setor Gama'}
          </button>
        </div>
      </div>
    </div>
  );
};
