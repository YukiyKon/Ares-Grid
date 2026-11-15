import React, { useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Radar,
  ShieldCheck,
  Sun,
} from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { type CandidateSiteId, useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

interface SiteOption {
  id: CandidateSiteId;
  title: string;
  subtitle: string;
  x: number;
  y: number;
  slopeLabel: string;
  solarIncidenceLabel: string;
  reliefLabel: string;
  sunExposure: string;
  stability: string;
  maintenance: string;
  isIdeal: boolean;
  capiComment: string;
  imagePath?: string;
  imageAlt?: string;
}

const SITE_OPTIONS: SiteOption[] = [
  {
    id: 'A',
    title: 'Ponto A — Perto da Elevação Rochosa',
    subtitle: 'Sombra parcial durante parte do dia',
    x: 20,
    y: 52,
    slopeLabel: '14° (Sombra de rocha)',
    solarIncidenceLabel: '42% (Sombra parcial)',
    reliefLabel: 'Paredão rochoso projeta sombra longa',
    sunExposure: 'Baixa (sombra da rocha)',
    stability: 'Média',
    maintenance: 'Difícil acesso',
    isIdeal: false,
    capiComment:
      'Cuidado, comandante! A elevação rochosa projeta sombra no Ponto A e reduz a luz solar nos painéis!',
    imagePath: ASSET_MANIFEST.terrainSpotShadow.path,
    imageAlt: ASSET_MANIFEST.terrainSpotShadow.alt,
  },
  {
    id: 'B',
    title: 'Ponto B — Terreno Inclinado com Pedregulhos',
    subtitle: 'Risco para fixar os suportes metálicos',
    x: 50,
    y: 58,
    slopeLabel: '27° (Pedregulhos)',
    solarIncidenceLabel: '61% (Irregular)',
    reliefLabel: 'Declive instável com rochas soltas',
    sunExposure: 'Irregular',
    stability: 'Baixa (muitas pedras)',
    maintenance: 'Risco de tropeços',
    isIdeal: false,
    capiComment:
      'Hmm... o Ponto B é muito inclinado e cheio de pedregulhos! Fica difícil fixar os suportes com segurança.',
    imagePath: ASSET_MANIFEST.terrainSpotRocky.path,
    imageAlt: ASSET_MANIFEST.terrainSpotRocky.alt,
  },
  {
    id: 'C',
    title: 'Ponto C — Planície Aberta e Nivelada',
    subtitle: 'Sol pleno e acesso fácil para limpeza',
    x: 80,
    y: 48,
    slopeLabel: '1.5° (Plano e firme)',
    solarIncidenceLabel: '98% (Sol pleno)',
    reliefLabel: 'Horizonte livre, zero sombras',
    sunExposure: 'Excelente (sem sombras)',
    stability: 'Alta (solo plano)',
    maintenance: 'Fácil limpeza de poeira',
    isIdeal: true,
    capiComment:
      'Excelente escolha científica! O Ponto C tem sol direto, solo firme e facilita limpar a poeira sem atrapalhar o rover!',
  },
];

interface Step1SiteSelectionProps {
  onSiteConfirmed: () => void;
  onSiteInspected: (capiLine: string) => void;
}

export const Step1SiteSelection: React.FC<Step1SiteSelectionProps> = ({
  onSiteConfirmed,
  onSiteInspected,
}) => {
  const { state, updateMission1 } = useGameStore();
  const selectedId = state.mission1.selectedSite;
  const alreadyConfirmedC = selectedId === 'C';

  const [scannedSites, setScannedSites] = useState<Record<CandidateSiteId, boolean>>(() =>
    alreadyConfirmedC
      ? { A: true, B: true, C: true }
      : { A: false, B: false, C: false }
  );
  const [scannerPos, setScannerPos] = useState<{ x: number; y: number }>(() =>
    alreadyConfirmedC ? { x: 80, y: 48 } : { x: 14, y: 34 }
  );
  const [isDragging, setIsDragging] = useState(false);
  const [hoverSiteId, setHoverSiteId] = useState<CandidateSiteId | null>(() =>
    alreadyConfirmedC ? 'C' : null
  );

  const lastHitSpotRef = useRef<CandidateSiteId | null>(alreadyConfirmedC ? 'C' : null);

  const selectedSite = SITE_OPTIONS.find((s) => s.id === selectedId) ?? null;
  const activeLensSite =
    SITE_OPTIONS.find((s) => s.id === hoverSiteId) ?? selectedSite ?? null;
  const scannedCount = Object.values(scannedSites).filter(Boolean).length;
  const allScanned = scannedSites.A && scannedSites.B && scannedSites.C;

  const inspectSite = (site: SiteOption, moveScanner = false) => {
    setScannedSites((prev) => ({ ...prev, [site.id]: true }));
    if (moveScanner) {
      setScannerPos({ x: site.x, y: site.y });
      setHoverSiteId(site.id);
    }
    if (site.isIdeal) {
      soundEngine.playSuccess();
    } else {
      soundEngine.playAlert();
    }
    updateMission1({ selectedSite: site.id });
    onSiteInspected(site.capiComment);
  };

  const handleScannerCoords = (clientX: number, clientY: number, rect: DOMRect) => {
    const rawX = ((clientX - rect.left) / Math.max(1, rect.width)) * 100;
    const rawY = ((clientY - rect.top) / Math.max(1, rect.height)) * 100;
    const x = Math.max(8, Math.min(92, rawX));
    const y = Math.max(14, Math.min(86, rawY));
    setScannerPos({ x, y });

    let matchedSite: SiteOption | null = null;
    for (const site of SITE_OPTIONS) {
      const dist = Math.hypot(x - site.x, y - site.y);
      if (dist <= 14) {
        matchedSite = site;
        break;
      }
    }

    if (matchedSite) {
      setHoverSiteId(matchedSite.id);
      if (lastHitSpotRef.current !== matchedSite.id) {
        lastHitSpotRef.current = matchedSite.id;
        inspectSite(matchedSite, false);
      }
    } else {
      lastHitSpotRef.current = null;
      setHoverSiteId(null);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore if unsupported
    }
    setIsDragging(true);
    handleScannerCoords(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect());
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    handleScannerCoords(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect());
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      try {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
      } catch {
        // ignore
      }
    }
    setIsDragging(false);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-sm border-2 border-orange-500/50 bg-slate-900/90 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Radar className="h-4 w-4 text-cyan-300" />
            <h2 className="font-pixel text-[11px] text-orange-300">
              DESAFIO 1.1 — SCANNER ORBITAL DE TERRENO
            </h2>
          </div>
          <span
            className={`rounded-sm border px-2 py-0.5 font-pixel text-[8px] ${
              allScanned
                ? 'border-emerald-400 bg-emerald-950/70 text-emerald-200'
                : 'border-cyan-400 bg-cyan-950/70 text-cyan-200'
            }`}
          >
            PONTOS ESCANEADOS: {scannedCount}/3
          </span>
        </div>
        <p className="mt-1.5 font-dialog text-xs text-slate-300">
          Arraste a lente do scanner com o mouse ou dedo sobre os <strong>Pontos A, B e C</strong> em
          Arcadia Planitia para revelar sombras de relevo, inclinação e incidência solar antes de escolher.
        </p>
      </div>

      {/* Arena Interativa do Scanner Orbital */}
      <div className="space-y-2">
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          role="application"
          aria-label="Mapa tátil do Scanner Orbital de Arcadia Planitia"
          className="touch-none select-none relative h-64 w-full cursor-grab overflow-hidden rounded-sm border-2 border-cyan-400/80 bg-gradient-to-b from-orange-950 via-amber-950 to-stone-950 shadow-inner active:cursor-grabbing"
        >
          {/* Grade topográfica sutil */}
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(34,211,238,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(34,211,238,0.4) 1px, transparent 1px)',
              backgroundSize: '44px 44px',
            }}
          />

          {/* Sol e raios marcianos no canto superior direito */}
          <div className="pointer-events-none absolute right-5 top-3 flex items-center gap-1.5 rounded-full border border-amber-300/60 bg-amber-400/20 px-2.5 py-1">
            <Sun className="h-4 w-4 animate-pulse text-yellow-200" />
            <span className="font-pixel text-[7px] text-amber-200">SOL • ARCADIA</span>
          </div>

          {/* Elevação rochosa e sombra no Ponto A */}
          <div className="pointer-events-none absolute left-[6%] top-[28%] h-16 w-20 rounded-t-md border border-stone-600 bg-stone-800/90 opacity-90" />
          <div
            className={`pointer-events-none absolute left-[13%] top-[44%] h-16 w-24 -skew-x-12 rounded-sm bg-black/65 transition-opacity ${
              scannedSites.A ? 'opacity-90' : 'opacity-40'
            }`}
          />

          {/* Marcadores dos 3 pontos no terreno */}
          {SITE_OPTIONS.map((site) => {
            const scanned = scannedSites[site.id];
            const isHovered = hoverSiteId === site.id;
            return (
              <div
                key={site.id}
                style={{ left: `${site.x}%`, top: `${site.y}%` }}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition ${
                    isHovered
                      ? 'scale-110 border-cyan-300 bg-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.65)]'
                      : scanned
                      ? site.isIdeal
                        ? 'border-emerald-400 bg-emerald-500/25'
                        : 'border-amber-400 bg-amber-500/25'
                      : 'animate-pulse border-slate-300/80 bg-slate-900/75'
                  }`}
                >
                  {site.imagePath ? (
                    <img
                      src={site.imagePath}
                      alt={site.imageAlt}
                      className={`pixel-art h-9 w-9 object-contain transition-opacity ${
                        scanned ? 'opacity-100' : 'opacity-45'
                      }`}
                    />
                  ) : (
                    <Sun
                      className={`h-6 w-6 ${
                        scanned ? 'text-emerald-300' : 'text-amber-200 opacity-60'
                      }`}
                    />
                  )}
                </div>
                <span
                  className={`mt-1 whitespace-nowrap rounded-sm border px-1.5 py-0.5 font-pixel text-[8px] ${
                    scanned
                      ? site.isIdeal
                        ? 'border-emerald-300 bg-slate-950/95 text-emerald-200'
                        : 'border-amber-300 bg-slate-950/95 text-amber-200'
                      : 'border-slate-500 bg-slate-950/90 text-slate-200'
                  }`}
                >
                  PONTO {site.id} {scanned ? '✓' : '?'}
                </span>
              </div>
            );
          })}

          {/* Lente / Visor Holográfico Arrastável */}
          <div
            style={{ left: `${scannerPos.x}%`, top: `${scannerPos.y}%` }}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
          >
            <div
              className={`relative flex h-24 w-24 items-center justify-center rounded-full border-4 transition-shadow ${
                activeLensSite
                  ? activeLensSite.isIdeal
                    ? 'border-emerald-300 bg-emerald-400/15 shadow-[0_0_26px_rgba(52,211,153,0.75)]'
                    : 'border-amber-300 bg-amber-400/15 shadow-[0_0_26px_rgba(251,191,36,0.65)]'
                  : 'border-cyan-300 bg-cyan-400/15 shadow-[0_0_24px_rgba(34,211,238,0.6)]'
              }`}
            >
              {/* Retículo interno */}
              <div className="h-full w-px bg-cyan-300/45" />
              <div className="absolute h-px w-full bg-cyan-300/45" />
              <span className="rounded-sm bg-slate-950/85 px-1 font-pixel text-[7px] text-cyan-200">
                {hoverSiteId ? `SCAN ${hoverSiteId}` : 'ARRASTE'}
              </span>
            </div>
          </div>

          {/* Barra superior de telemetria ao vivo do visor */}
          <div className="pointer-events-none absolute bottom-2 left-2 right-2 flex flex-wrap items-center justify-between gap-2 rounded-sm border border-cyan-500/50 bg-slate-950/90 px-3 py-1.5 font-dialog text-xs">
            {activeLensSite && scannedSites[activeLensSite.id] ? (
              <>
                <span className="font-bold text-cyan-200">
                  <MapPin className="mr-1 inline h-3.5 w-3.5 text-amber-300" />
                  {activeLensSite.title}
                </span>
                <span className="text-amber-200">
                  Inclinação: <strong>{activeLensSite.slopeLabel}</strong>
                </span>
                <span className="text-emerald-200">
                  Sol: <strong>{activeLensSite.solarIncidenceLabel}</strong>
                </span>
              </>
            ) : (
              <span className="text-cyan-200">
                🛰️ Arraste o círculo azul sobre os pontos A, B e C para ler o relevo e a luz solar...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3 Cartões com dados revelados pelo Scanner */}
      <div className="grid gap-3 md:grid-cols-3">
        {SITE_OPTIONS.map((site) => {
          const isSelected = selectedId === site.id;
          const isScanned = scannedSites[site.id];
          return (
            <button
              key={site.id}
              type="button"
              onClick={() => {
                if (isScanned) {
                  inspectSite(site, true);
                } else {
                  soundEngine.playAlert();
                  onSiteInspected(
                    `Arraste o visor do scanner sobre o Ponto ${site.id} no mapa acima para liberar os dados do solo!`
                  );
                }
              }}
              className={`flex flex-col justify-between rounded-sm border-2 p-3 text-left transition ${
                isSelected
                  ? site.isIdeal
                    ? 'border-emerald-400 bg-emerald-950/40 shadow-[0_0_16px_rgba(52,211,153,0.25)]'
                    : 'border-amber-400 bg-amber-950/40'
                  : isScanned
                  ? 'border-slate-700 bg-slate-900/85 hover:border-cyan-400'
                  : 'border-slate-800 bg-slate-950/75 opacity-80'
              }`}
            >
              <div>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <span className="font-pixel text-[9px] text-white">{site.title}</span>
                  <span
                    className={`shrink-0 rounded-sm px-1.5 py-0.5 font-pixel text-[7px] ${
                      isScanned
                        ? 'bg-emerald-950 text-emerald-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isScanned ? 'ESCANEADO ✓' : 'PENDENTE'}
                  </span>
                </div>
                <p className="font-dialog text-xs text-cyan-200">
                  {isScanned ? site.subtitle : 'Passe o scanner orbital neste ponto...'}
                </p>
              </div>

              <div className="mt-2.5 space-y-1 border-t border-slate-800 pt-2 font-dialog text-[11px] text-slate-300">
                <div>• Relevo: {isScanned ? site.reliefLabel : '???'}</div>
                <div>• Inclinação: {isScanned ? site.slopeLabel : '???'}</div>
                <div>• Incidência solar: {isScanned ? site.solarIncidenceLabel : '???'}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback científico e confirmação */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 rounded-sm border-2 p-3 ${
          allScanned && selectedSite?.isIdeal
            ? 'border-emerald-400 bg-emerald-950/50 text-emerald-100'
            : 'border-amber-400/70 bg-amber-950/40 text-amber-100'
        }`}
      >
        <div className="flex items-start gap-2.5">
          {allScanned && selectedSite?.isIdeal ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
          ) : (
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
          )}
          <p className="max-w-xl font-dialog text-xs leading-relaxed">
            {!allScanned
              ? `Escaneie os 3 pontos candidatos arrastando o visor no terreno (${scannedCount}/3 escaneados) para comparar antes de instalar.`
              : selectedSite
              ? selectedSite.capiComment
              : 'Agora selecione o Ponto C (planície firme sem sombras) para confirmar a instalação.'}
          </p>
        </div>

        <button
          type="button"
          disabled={!allScanned || selectedId !== 'C'}
          onClick={() => {
            soundEngine.playClick();
            onSiteConfirmed();
          }}
          className="pixel-btn inline-flex items-center gap-1.5 bg-emerald-400 px-4 py-2 font-pixel text-[10px] text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-45"
        >
          <ShieldCheck className="h-4 w-4" />
          {!allScanned
            ? `Escaneie A, B e C (${scannedCount}/3)`
            : selectedId !== 'C'
            ? 'Selecione o Ponto C para avançar'
            : 'Confirmar Ponto C e Calcular Sol ▶'}
        </button>
      </div>
    </div>
  );
};
