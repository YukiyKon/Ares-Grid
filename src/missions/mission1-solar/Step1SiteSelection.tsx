import React from 'react';
import { AlertTriangle, CheckCircle2, MapPin, ShieldCheck, Sun } from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { type CandidateSiteId, useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

interface SiteOption {
  id: CandidateSiteId;
  title: string;
  subtitle: string;
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
  const selectedSite = SITE_OPTIONS.find((s) => s.id === selectedId) ?? null;

  const handleSelectSite = (site: SiteOption) => {
    if (site.isIdeal) {
      soundEngine.playSuccess();
    } else {
      soundEngine.playAlert();
    }
    updateMission1({ selectedSite: site.id });
    onSiteInspected(site.capiComment);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-sm border-2 border-orange-500/50 bg-slate-900/90 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-orange-400" />
            <h2 className="font-pixel text-[11px] text-orange-300">
              DESAFIO 1.1 — ESCOLHENDO O LOCAL DE INSTALAÇÃO
            </h2>
          </div>
          <span className="font-dialog text-xs text-slate-300">
            Inspecione os 3 pontos em Arcadia Planitia
          </span>
        </div>
        <p className="mt-1.5 font-dialog text-xs text-slate-300">
          Precisamos de um local com boa exposição solar, sem sombras de elevações, seguro
          para fixação e fácil de limpar quando acumular poeira marciana.
        </p>
      </div>

      {/* 3 Pontos Candidatos */}
      <div className="grid gap-3 md:grid-cols-3">
        {SITE_OPTIONS.map((site) => {
          const isSelected = selectedId === site.id;
          return (
            <button
              key={site.id}
              type="button"
              onClick={() => handleSelectSite(site)}
              className={`flex flex-col justify-between rounded-sm border-2 p-3 text-left transition ${
                isSelected
                  ? site.isIdeal
                    ? 'border-emerald-400 bg-emerald-950/40 shadow-[0_0_16px_rgba(52,211,153,0.25)]'
                    : 'border-amber-400 bg-amber-950/40'
                  : 'border-slate-700 bg-slate-900/80 hover:border-cyan-400'
              }`}
            >
              <div>
                <div className="mb-2 flex h-28 items-center justify-center rounded-sm border border-slate-800 bg-orange-950/50 p-2">
                  {site.imagePath ? (
                    <img
                      src={site.imagePath}
                      alt={site.imageAlt}
                      className="pixel-art h-24 w-24 object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-center">
                      <Sun className="h-10 w-10 animate-pulse text-amber-300" />
                      <span className="rounded-sm border border-emerald-400/70 bg-emerald-950/80 px-2 py-0.5 font-pixel text-[8px] text-emerald-200">
                        PLANÍCIE ENSOLARADA
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="font-pixel text-[10px] leading-snug text-white">
                  {site.title}
                </h3>
                <p className="mt-1 font-dialog text-xs text-cyan-200">{site.subtitle}</p>
              </div>

              <div className="mt-3 space-y-1 border-t border-slate-800 pt-2 font-dialog text-[11px] text-slate-300">
                <div>• Luz Solar: {site.sunExposure}</div>
                <div>• Terreno: {site.stability}</div>
                <div>• Manutenção: {site.maintenance}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback científico e confirmação */}
      {selectedSite && (
        <div
          className={`flex flex-wrap items-center justify-between gap-3 rounded-sm border-2 p-3 ${
            selectedSite.isIdeal
              ? 'border-emerald-400 bg-emerald-950/50 text-emerald-100'
              : 'border-amber-400 bg-amber-950/50 text-amber-100'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {selectedSite.isIdeal ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
            ) : (
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            )}
            <p className="max-w-xl font-dialog text-xs leading-relaxed">
              {selectedSite.capiComment}
            </p>
          </div>

          {selectedSite.isIdeal && (
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onSiteConfirmed();
              }}
              className="pixel-btn inline-flex items-center gap-1.5 bg-emerald-400 px-4 py-2 font-pixel text-[10px] text-slate-950 hover:bg-emerald-300"
            >
              <ShieldCheck className="h-4 w-4" />
              Confirmar Ponto C e Calcular Sol ▶
            </button>
          )}
        </div>
      )}
    </div>
  );
};
