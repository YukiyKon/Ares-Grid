import React from 'react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import {
  type CapiAccessoryId,
  type RoverSkinId,
  useArcadeProgress,
} from './arcadeStore';

export type CapiMood = 'IDLE' | 'CHEER' | 'WORRIED' | 'COOL' | 'HURT';

interface RoverPalette {
  body: string;
  shade: string;
  trim: string;
  panel: string;
  wheel: string;
  glow?: string;
}

const ROVER_PALETTES: Record<RoverSkinId, RoverPalette> = {
  nasa_white: {
    body: '#f8fafc',
    shade: '#94a3b8',
    trim: '#38bdf8',
    panel: '#1e3a8a',
    wheel: '#1e293b',
  },
  mars_gold: {
    body: '#fbbf24',
    shade: '#b45309',
    trim: '#fef08a',
    panel: '#312e81',
    wheel: '#292524',
    glow: '#fde047',
  },
  turbo_red: {
    body: '#ef4444',
    shade: '#991b1b',
    trim: '#facc15',
    panel: '#0f172a',
    wheel: '#18181b',
    glow: '#fb923c',
  },
};

export interface RoverSpriteProps {
  skinOverride?: RoverSkinId;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const RoverSprite: React.FC<RoverSpriteProps> = ({
  skinOverride,
  size = 'md',
  animated = false,
}) => {
  const arcade = useArcadeProgress();
  const skin = skinOverride ?? arcade.equipped.rover;
  const p = ROVER_PALETTES[skin] ?? ROVER_PALETTES.nasa_white;

  const sizeClass =
    size === 'sm' ? 'h-10 w-14' : size === 'lg' ? 'h-24 w-32' : 'h-14 w-20';

  return (
    <svg
      viewBox="0 0 36 24"
      className={`${sizeClass} pixel-art select-none ${animated ? 'animate-floatSlow' : ''}`}
      role="img"
      aria-label={`Mars Rover (${skin})`}
    >
      {/* Chamas turbo para Turbo Red */}
      {skin === 'turbo_red' && (
        <g>
          <rect x="0" y="13" width="4" height="2" fill="#facc15" />
          <rect x="1" y="12" width="3" height="1" fill="#fb923c" />
          <rect x="2" y="15" width="3" height="1" fill="#fb923c" />
        </g>
      )}

      {/* Brilho dourado sutil */}
      {skin === 'mars_gold' && (
        <g>
          <rect x="4" y="4" width="2" height="2" fill="#fef08a" />
          <rect x="30" y="3" width="2" height="2" fill="#fde047" />
        </g>
      )}

      {/* Mastro + Câmera orbital */}
      <rect x="22" y="3" width="2" height="8" fill={p.shade} stroke="#0f172a" strokeWidth="0.8" />
      <rect x="20" y="1" width="8" height="4" fill={p.body} stroke="#0f172a" strokeWidth="0.9" />
      <rect x="25" y="2" width="2" height="2" fill={p.trim} />
      {/* Antena traseira */}
      <rect x="8" y="4" width="1" height="6" fill="#cbd5e1" />
      <rect x="7" y="3" width="3" height="2" fill={p.trim} />

      {/* Painel Solar traseiro */}
      <rect x="6" y="8" width="11" height="3" fill={p.panel} stroke="#0f172a" strokeWidth="0.9" />
      <rect x="7" y="9" width="9" height="1" fill="#38bdf8" opacity="0.65" />

      {/* Chassi principal */}
      <rect x="5" y="11" width="22" height="6" rx="1" fill={p.body} stroke="#0f172a" strokeWidth="1" />
      <rect x="5" y="14" width="22" height="3" fill={p.shade} stroke="#0f172a" strokeWidth="0.6" />
      {/* Faixa lateral */}
      <rect x="7" y="12" width="18" height="2" fill={p.trim} />
      {skin === 'mars_gold' && <rect x="13" y="12" width="6" height="2" fill="#ffffff" opacity="0.7" />}

      {/* 3 Rodas articuladas */}
      {[7, 16, 25].map((cx) => (
        <g key={cx}>
          <rect x={cx - 1} y="16" width="2" height="2" fill="#64748b" />
          <circle cx={cx} cy="20" r="3" fill={p.wheel} stroke="#0f172a" strokeWidth="1" />
          <rect x={cx - 1} y="19" width="2" height="2" fill={p.trim} />
        </g>
      ))}
    </svg>
  );
};

export interface CapiBadgePortraitProps {
  accessoryOverride?: CapiAccessoryId;
  mood?: CapiMood;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showMoodBadge?: boolean;
}

export const CapiBadgePortrait: React.FC<CapiBadgePortraitProps> = ({
  accessoryOverride,
  mood = 'IDLE',
  size = 'md',
  showMoodBadge = false,
}) => {
  const arcade = useArcadeProgress();
  const accessory = accessoryOverride ?? arcade.equipped.capi;

  const boxSize =
    size === 'xs'
      ? 'h-8 w-8'
      : size === 'sm'
      ? 'h-14 w-14'
      : size === 'lg'
      ? 'h-24 w-24'
      : 'h-20 w-20';

  const moodMotion =
    mood === 'CHEER' || mood === 'COOL'
      ? 'animate-bounce'
      : mood === 'WORRIED' || mood === 'HURT'
      ? 'cabin-shake'
      : 'animate-floatSlow';

  return (
    <div className={`relative inline-flex shrink-0 items-center justify-center ${boxSize}`}>
      {/* Mini Jetpack atrás da Capi */}
      {accessory === 'mini_jetpack' && (
        <svg
          viewBox="0 0 32 32"
          className="pixel-art pointer-events-none absolute inset-0 z-0 h-full w-full"
          aria-hidden="true"
        >
          <rect x="2" y="14" width="6" height="10" fill="#64748b" stroke="#0f172a" strokeWidth="1" />
          <rect x="24" y="14" width="6" height="10" fill="#64748b" stroke="#0f172a" strokeWidth="1" />
          <rect x="3" y="15" width="4" height="2" fill="#22d3ee" />
          <rect x="25" y="15" width="4" height="2" fill="#22d3ee" />
          {/* Chamas propulsoras */}
          <rect x="3" y="24" width="4" height="5" fill="#fb923c" />
          <rect x="4" y="25" width="2" height="5" fill="#fef08a" />
          <rect x="25" y="24" width="4" height="5" fill="#fb923c" />
          <rect x="26" y="25" width="2" height="5" fill="#fef08a" />
        </svg>
      )}

      <img
        src={ASSET_MANIFEST.capiPortrait.path}
        alt={ASSET_MANIFEST.capiPortrait.alt}
        draggable={false}
        className={`pixel-art relative z-10 h-full w-full select-none object-contain ${moodMotion} ${
          mood === 'HURT' ? 'brightness-110 saturate-150' : ''
        }`}
      />

      {/* Sobreposição pixel-art dos acessórios da Capi */}
      <svg
        viewBox="0 0 32 32"
        className="pixel-art pointer-events-none absolute inset-0 z-20 h-full w-full"
        aria-hidden="true"
      >
        {accessory === 'blue_cap' && (
          <g>
            {/* Pequeno broche estrela NASA na boina azul */}
            <rect x="19" y="7" width="3" height="2" fill="#38bdf8" />
            <rect x="20" y="6" width="1" height="4" fill="#fef08a" />
          </g>
        )}

        {accessory === 'star_sunglasses' && (
          <g>
            {/* Óculos estrelados estilizados cobrindo o visor */}
            <rect x="6" y="12" width="20" height="5" fill="#0f172a" opacity="0.88" />
            <rect x="7" y="13" width="7" height="3" fill="#facc15" />
            <rect x="15" y="13" width="7" height="3" fill="#22d3ee" />
            <rect x="9" y="12" width="3" height="5" fill="#fef08a" />
            <rect x="17" y="12" width="3" height="5" fill="#a5f3fc" />
            <rect x="8" y="13" width="2" height="1" fill="#ffffff" />
            <rect x="16" y="13" width="2" height="1" fill="#ffffff" />
          </g>
        )}

        {accessory === 'golden_crown' && (
          <g>
            {/* Coroa Dourada em pixel art sobre a cabeça */}
            <rect x="10" y="3" width="12" height="3" fill="#f59e0b" stroke="#0f172a" strokeWidth="0.7" />
            <rect x="10" y="0" width="2" height="3" fill="#facc15" stroke="#0f172a" strokeWidth="0.6" />
            <rect x="15" y="0" width="2" height="3" fill="#facc15" stroke="#0f172a" strokeWidth="0.6" />
            <rect x="20" y="0" width="2" height="3" fill="#facc15" stroke="#0f172a" strokeWidth="0.6" />
            <rect x="15" y="4" width="2" height="1" fill="#ef4444" />
            <rect x="11" y="4" width="1" height="1" fill="#22d3ee" />
            <rect x="20" y="4" width="1" height="1" fill="#22d3ee" />
          </g>
        )}
      </svg>

      {showMoodBadge && mood !== 'IDLE' && (
        <span
          className={`absolute -right-1 -top-1 z-30 flex h-5 w-5 items-center justify-center rounded-full border border-slate-950 text-[11px] shadow ${
            mood === 'CHEER'
              ? 'bg-emerald-400 text-slate-950'
              : mood === 'COOL'
              ? 'bg-amber-300 text-slate-950'
              : mood === 'WORRIED'
              ? 'bg-amber-400 text-slate-950'
              : 'bg-rose-500 text-white'
          }`}
        >
          {mood === 'CHEER'
            ? '★'
            : mood === 'COOL'
            ? '😎'
            : mood === 'WORRIED'
            ? '!'
            : '✕'}
        </span>
      )}
    </div>
  );
};
