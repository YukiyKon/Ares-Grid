export interface SpriteEntry {
  id: string;
  path: string;
  alt: string;
  transparent: boolean;
  missionScope: 'INTRO' | 'MISSION_1' | 'MISSION_2' | 'MISSION_3' | 'FUTURE';
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
  // Sprites da Missão 1 — Energia para Explorar Marte (Etapa 2)
  solarPanelClean: {
    id: 'solarPanelClean',
    path: '/assets/sprites/mission1/solar_panel_clean.png',
    alt: 'Painel solar fotovoltaico azul limpo sobre suporte marciano',
    transparent: true,
    missionScope: 'MISSION_1',
    fallbackLabel: 'PAINEL SOLAR LIMPO',
  },
  solarPanelDusty: {
    id: 'solarPanelDusty',
    path: '/assets/sprites/mission1/solar_panel_dusty.png',
    alt: 'Painel solar coberto por poeira fina alaranjada de Marte',
    transparent: true,
    missionScope: 'MISSION_1',
    fallbackLabel: 'PAINEL COM POEIRA',
  },
  terrainSpotRocky: {
    id: 'terrainSpotRocky',
    path: '/assets/sprites/mission1/terrain_spot_rocky.png',
    alt: 'Terreno inclinado com pedregulhos em Arcadia Planitia',
    transparent: true,
    missionScope: 'MISSION_1',
    fallbackLabel: 'TERRENO ROCHOSO',
  },
  terrainSpotShadow: {
    id: 'terrainSpotShadow',
    path: '/assets/sprites/mission1/terrain_spot_shadow.png',
    alt: 'Terreno próximo a elevação rochosa com sombra projetada',
    transparent: true,
    missionScope: 'MISSION_1',
    fallbackLabel: 'TERRENO COM SOMBRA',
  },
  // Sprites da Missão 2 — Cuidando do Astronauta (Etapa 3)
  habitatGym: {
    id: 'habitatGym',
    path: '/assets/sprites/mission2/habitat_gym.png',
    alt: 'Estação de exercícios espaciais dentro do habitat em Marte',
    transparent: false,
    missionScope: 'MISSION_2',
    fallbackLabel: 'ESTAÇÃO DE TREINO',
  },
  habitatGalley: {
    id: 'habitatGalley',
    path: '/assets/sprites/mission2/habitat_galley.png',
    alt: 'Refeitório espacial com mesa metálica, vegetais e dispensador de água',
    transparent: false,
    missionScope: 'MISSION_2',
    fallbackLabel: 'REFEITÓRIO ESPACIAL',
  },
  habitatHygiene: {
    id: 'habitatHygiene',
    path: '/assets/sprites/mission2/habitat_hygiene.png',
    alt: 'Módulo de higiene espacial com pia recicladora, kit dental e esterilizador',
    transparent: false,
    missionScope: 'MISSION_2',
    fallbackLabel: 'MÓDULO DE HIGIENE',
  },
  habitatQuarters: {
    id: 'habitatQuarters',
    path: '/assets/sprites/mission2/habitat_quarters.png',
    alt: 'Cabine de descanso com cama espacial e janela para o entardecer de Marte',
    transparent: false,
    missionScope: 'MISSION_2',
    fallbackLabel: 'CABINE DE DESCANSO',
  },
  // Sprites da Missão 3 — O Mistério do Gelo de Marte (Etapa 4)
  drillRig: {
    id: 'drillRig',
    path: '/assets/sprites/mission3/drill_rig.png',
    alt: 'Perfuradora científica marciana com broca vertical e painel de telemetria',
    transparent: true,
    missionScope: 'MISSION_3',
    fallbackLabel: 'PERFURADORA MARCIANA',
  },
  iceCoreSample: {
    id: 'iceCoreSample',
    path: '/assets/sprites/mission3/ice_core_sample.png',
    alt: 'Amostra cilíndrica de solo congelado com regolito no topo e gelo azul-ciano embaixo',
    transparent: true,
    missionScope: 'MISSION_3',
    fallbackLabel: 'AMOSTRA DE GELO',
  },
  waterLabStation: {
    id: 'waterLabStation',
    path: '/assets/sprites/mission3/water_lab_station.png',
    alt: 'Bancada de laboratório para derretimento, filtragem e análise de potabilidade da água',
    transparent: false,
    missionScope: 'MISSION_3',
    fallbackLabel: 'LABORATÓRIO DE ÁGUA',
  },
};

export type AssetKey = keyof typeof ASSET_MANIFEST;
