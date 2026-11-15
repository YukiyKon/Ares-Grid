import React from 'react';
import type {
  AstronautProfile,
  BackpackStyleId,
  BadgeStyleId,
  HelmetStyleId,
  SuitColorId,
} from '../../core/gameStore';
import { type SuitSkinId, useArcadeProgress } from '../../modes/arcade-rush/arcadeStore';

interface SuitPalette {
  main: string;
  shade: string;
  accent: string;
  boot: string;
  label: string;
}

export const SUIT_PALETTES: Record<SuitColorId, SuitPalette> = {
  white: {
    main: '#f1f5f9',
    shade: '#cbd5e1',
    accent: '#f97316',
    boot: '#334155',
    label: 'Branco NASA',
  },
  orange: {
    main: '#fb923c',
    shade: '#c2410c',
    accent: '#facc15',
    boot: '#431407',
    label: 'Laranja Explorador',
  },
  cyan: {
    main: '#38bdf8',
    shade: '#0284c7',
    accent: '#fde047',
    boot: '#0f172a',
    label: 'Azul Orbital',
  },
  emerald: {
    main: '#4ade80',
    shade: '#15803d',
    accent: '#fde047',
    boot: '#14532d',
    label: 'Verde Botânico',
  },
  violet: {
    main: '#c084fc',
    shade: '#7e22ce',
    accent: '#22d3ee',
    boot: '#3b0764',
    label: 'Roxo Estelar',
  },
};

export const HELMET_LABELS: Record<HelmetStyleId, string> = {
  classic: 'Clássico Transparente',
  visor_cyan: 'Visor Ciano Polarizado',
  gold_shield: 'Escudo Solar Dourado',
};

export const BACKPACK_LABELS: Record<BackpackStyleId, string> = {
  standard: 'Suporte Padrão',
  dual_tank: 'Tanques Duplos',
  comms_array: 'Antena + Radar',
};

export const BADGE_LABELS: Record<BadgeStyleId, string> = {
  capybara: 'Capivara Capi',
  mars: 'Planeta Marte',
  star: 'Estrela Polar',
  bolt: 'Energia Solar',
};

interface AstronautAvatarProps {
  profile: AstronautProfile;
  size?: 'sm' | 'md' | 'lg';
  suitSkinOverride?: SuitSkinId | null;
}

export const AstronautAvatar: React.FC<AstronautAvatarProps> = ({
  profile,
  size = 'md',
  suitSkinOverride,
}) => {
  const arcade = useArcadeProgress();
  const activeSkin =
    suitSkinOverride !== undefined ? suitSkinOverride : arcade.equipped.suit;

  const basePalette = SUIT_PALETTES[profile.suitColor] ?? SUIT_PALETTES.orange;
  const palette: SuitPalette =
    activeSkin === 'cyber_neon'
      ? {
          main: '#0f172a',
          shade: '#1e1b4b',
          accent: '#22d3ee',
          boot: '#ec4899',
          label: 'Cyber Neon',
        }
      : activeSkin === 'galaxy_star'
      ? {
          main: '#1e1b4b',
          shade: '#0f172a',
          accent: '#fde047',
          boot: '#6366f1',
          label: 'Galaxy Star',
        }
      : activeSkin === 'golden_visor'
      ? {
          ...basePalette,
          accent: '#facc15',
        }
      : suitSkinOverride === 'standard_orange'
      ? SUIT_PALETTES.orange
      : basePalette;

  const sizeClass =
    size === 'sm' ? 'w-11 h-11' : size === 'lg' ? 'w-44 h-44' : 'w-20 h-20';

  const effectiveHelmetStyle: HelmetStyleId =
    activeSkin === 'golden_visor'
      ? 'gold_shield'
      : activeSkin === 'cyber_neon'
      ? 'visor_cyan'
      : profile.helmetStyle;

  const visorColor =
    activeSkin === 'galaxy_star'
      ? '#312e81'
      : activeSkin === 'cyber_neon'
      ? '#06b6d4'
      : effectiveHelmetStyle === 'gold_shield'
      ? '#f59e0b'
      : effectiveHelmetStyle === 'visor_cyan'
      ? '#0ea5e9'
      : '#1e3a5f';

  const visorHighlight =
    activeSkin === 'cyber_neon'
      ? '#ec4899'
      : activeSkin === 'galaxy_star'
      ? '#fef08a'
      : effectiveHelmetStyle === 'gold_shield'
      ? '#fef08a'
      : '#a5f3fc';

  return (
    <svg
      viewBox="0 0 32 32"
      className={`${sizeClass} pixel-art select-none`}
      role="img"
      aria-label={`Astronauta ${profile.name}`}
    >
      {/* Mochila traseira */}
      {profile.backpackStyle === 'standard' && (
        <g>
          <rect x="7" y="14" width="18" height="10" fill={palette.shade} stroke="#0f172a" strokeWidth="1" />
          <rect x="22" y="9" width="2" height="6" fill="#94a3b8" />
          <rect x="21" y="7" width="4" height="2" fill={palette.accent} />
        </g>
      )}
      {profile.backpackStyle === 'dual_tank' && (
        <g>
          <rect x="6" y="13" width="6" height="12" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1" />
          <rect x="20" y="13" width="6" height="12" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1" />
          <rect x="7" y="15" width="4" height="2" fill={palette.accent} />
          <rect x="21" y="15" width="4" height="2" fill={palette.accent} />
        </g>
      )}
      {profile.backpackStyle === 'comms_array' && (
        <g>
          <rect x="7" y="14" width="18" height="10" fill={palette.shade} stroke="#0f172a" strokeWidth="1" />
          <rect x="8" y="6" width="2" height="8" fill="#cbd5e1" />
          <rect x="22" y="5" width="2" height="9" fill="#cbd5e1" />
          <rect x="7" y="5" width="4" height="2" fill="#22d3ee" />
          <rect x="21" y="4" width="4" height="2" fill="#facc15" />
        </g>
      )}

      {/* Pernas e Botas */}
      <rect x="10" y="23" width="5" height="5" fill={palette.shade} stroke="#0f172a" strokeWidth="1" />
      <rect x="17" y="23" width="5" height="5" fill={palette.shade} stroke="#0f172a" strokeWidth="1" />
      <rect x="9" y="27" width="6" height="3" fill={palette.boot} stroke="#0f172a" strokeWidth="1" />
      <rect x="17" y="27" width="6" height="3" fill={palette.boot} stroke="#0f172a" strokeWidth="1" />
      <rect x="10" y="27" width="4" height="1" fill={palette.accent} />
      <rect x="18" y="27" width="4" height="1" fill={palette.accent} />

      {/* Tronco do traje */}
      <rect x="9" y="15" width="14" height="9" fill={palette.main} stroke="#0f172a" strokeWidth="1" />
      {/* Braços e Luvas */}
      <rect x="6" y="15" width="3" height="6" fill={palette.main} stroke="#0f172a" strokeWidth="1" />
      <rect x="23" y="15" width="3" height="6" fill={palette.main} stroke="#0f172a" strokeWidth="1" />
      <rect x="6" y="20" width="3" height="3" fill={palette.accent} stroke="#0f172a" strokeWidth="1" />
      <rect x="23" y="20" width="3" height="3" fill={palette.accent} stroke="#0f172a" strokeWidth="1" />

      {/* Cinto e painel */}
      <rect x="9" y="21" width="14" height="2" fill={palette.accent} stroke="#0f172a" strokeWidth="0.8" />
      <rect x="14" y="21" width="4" height="2" fill="#22d3ee" />

      {/* Insígnia peitoral */}
      <rect x="12" y="16" width="8" height="4" fill="#1e293b" stroke="#0f172a" strokeWidth="0.8" />
      {profile.badgeStyle === 'capybara' && (
        <g>
          <rect x="13" y="17" width="4" height="2" fill="#d97706" />
          <rect x="17" y="17" width="2" height="1" fill="#22d3ee" />
        </g>
      )}
      {profile.badgeStyle === 'mars' && (
        <g>
          <rect x="14" y="17" width="4" height="2" fill="#ef4444" />
          <rect x="15" y="17" width="1" height="1" fill="#fca5a5" />
        </g>
      )}
      {profile.badgeStyle === 'star' && (
        <g>
          <rect x="15" y="17" width="2" height="2" fill="#facc15" />
          <rect x="14" y="18" width="4" height="1" fill="#fef08a" />
        </g>
      )}
      {profile.badgeStyle === 'bolt' && (
        <g>
          <rect x="15" y="17" width="2" height="1" fill="#fde047" />
          <rect x="14" y="18" width="3" height="1" fill="#facc15" />
        </g>
      )}

      {/* Capacete */}
      <rect x="8" y="3" width="16" height="13" rx="3" fill={palette.main} stroke="#0f172a" strokeWidth="1" />
      <rect x="10" y="14" width="12" height="2" fill={palette.accent} stroke="#0f172a" strokeWidth="0.8" />
      {/* Visor */}
      <rect x="10" y="5" width="12" height="9" rx="2" fill={visorColor} stroke="#0f172a" strokeWidth="1" />
      {effectiveHelmetStyle === 'classic' && activeSkin !== 'galaxy_star' ? (
        <g>
          <rect x="12" y="7" width="8" height="6" fill="#f5c6a5" />
          <rect x="13" y="9" width="1" height="2" fill="#0f172a" />
          <rect x="18" y="9" width="1" height="2" fill="#0f172a" />
          <rect x="15" y="11" width="2" height="1" fill="#0f172a" />
        </g>
      ) : (
        <g>
          <rect x="12" y="8" width="2" height="2" fill="#e0f2fe" opacity="0.65" />
          <rect x="18" y="8" width="2" height="2" fill="#e0f2fe" opacity="0.65" />
        </g>
      )}
      {/* Brilho e estrelas/neon extras dos trajes do Arcade */}
      <rect x="11" y="6" width="4" height="1" fill={visorHighlight} />
      <rect x="11" y="7" width="2" height="1" fill={visorHighlight} />
      {activeSkin === 'golden_visor' && (
        <rect x="9" y="4" width="14" height="1" fill="#fde047" />
      )}
      {activeSkin === 'cyber_neon' && (
        <g>
          <rect x="7" y="16" width="1" height="4" fill="#ec4899" />
          <rect x="24" y="16" width="1" height="4" fill="#ec4899" />
          <rect x="12" y="10" width="8" height="1" fill="#67e8f9" />
        </g>
      )}
      {activeSkin === 'galaxy_star' && (
        <g>
          <rect x="12" y="8" width="1" height="1" fill="#fef08a" />
          <rect x="18" y="11" width="1" height="1" fill="#fef08a" />
          <rect x="10" y="17" width="1" height="1" fill="#facc15" />
          <rect x="21" y="18" width="1" height="1" fill="#facc15" />
          <rect x="15" y="1" width="2" height="2" fill="#fde047" />
        </g>
      )}
    </svg>
  );
};
