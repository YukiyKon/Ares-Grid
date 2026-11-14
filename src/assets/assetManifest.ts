export interface SpriteEntry {
  id: string;
  path: string;
  alt: string;
  transparent: boolean;
  missionScope: 'INTRO' | 'MISSION_1' | 'FUTURE';
  fallbackLabel: string;
}

export const ASSET_MANIFEST: Record<string, SpriteEntry> = {
  capiPortrait: {
    id: 'capiPortrait',
    path: '/assets/sprites/capi_portrait.png',
    alt: 'Capivara Capi — Assistente Virtual da Missão em Marte',
    transparent: true,
    missionScope: 'INTRO',
    fallbackLabel: 'CAPI HOLOGRAMA',
  },
  astronautBase: {
    id: 'astronautBase',
    path: '/assets/sprites/astronaut_base.png',
    alt: 'Astronauta Explorador de Arcadia Planitia',
    transparent: true,
    missionScope: 'INTRO',
    fallbackLabel: 'ASTRONAUTA',
  },
  bgCockpitLaunch: {
    id: 'bgCockpitLaunch',
    path: '/assets/sprites/bg_cockpit_launch.png',
    alt: 'Interior da espaçonave durante decolagem da Terra',
    transparent: false,
    missionScope: 'INTRO',
    fallbackLabel: 'COCKPIT DE DECOLAGEM',
  },
  bgMarsLanding: {
    id: 'bgMarsLanding',
    path: '/assets/sprites/bg_mars_landing.png',
    alt: 'Pouso em Arcadia Planitia, Marte',
    transparent: false,
    missionScope: 'INTRO',
    fallbackLabel: 'POUSO EM ARCADIA PLANITIA',
  },
  bgArcadiaBase: {
    id: 'bgArcadiaBase',
    path: '/assets/sprites/bg_arcadia_base.png',
    alt: 'Base Científica em Arcadia Planitia',
    transparent: false,
    missionScope: 'MISSION_1',
    fallbackLabel: 'BASE ARCADIA PLANITIA',
  },
  // Placeholders estruturais para futuras etapas (com fallback elegante)
  solarArrayStub: {
    id: 'solarArrayStub',
    path: '/assets/sprites/solar_array_future.png',
    alt: 'Painéis Solares Fotovoltaicos (Etapa 2)',
    transparent: true,
    missionScope: 'FUTURE',
    fallbackLabel: 'PAINÉIS SOLARES (ETAPA 2)',
  },
};

export type AssetKey = keyof typeof ASSET_MANIFEST;
