export interface SpriteEntry {
  id: string;
  path: string;
  alt: string;
  transparent: boolean;
  missionScope:
    | 'INTRO'
    | 'MISSION_1'
    | 'MISSION_2'
    | 'MISSION_3'
    | 'MISSION_4'
    | 'MISSION_5'
    | 'ENDING'
    | 'FUTURE';
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
  // Sprites da Missão 4 — A Primeira Estufa de Marte (Etapa 5)
  greenhouseDome: {
    id: 'greenhouseDome',
    path: '/assets/sprites/mission4/greenhouse_dome.png',
    alt: 'Domo experimental futurista da primeira estufa em Marte com luzes LED de cultivo',
    transparent: true,
    missionScope: 'MISSION_4',
    fallbackLabel: 'ESTUFA DE MARTE',
  },
  hydroAeroStation: {
    id: 'hydroAeroStation',
    path: '/assets/sprites/mission4/hydro_aero_station.png',
    alt: 'Interior da estufa marciana com sistemas de hidroponia e aeroponia',
    transparent: false,
    missionScope: 'MISSION_4',
    fallbackLabel: 'ESTAÇÃO HIDROPONIA E AEROPONIA',
  },
  marsCropsTray: {
    id: 'marsCropsTray',
    path: '/assets/sprites/mission4/mars_crops_tray.png',
    alt: 'Bandeja científica com hortaliças, morangos, trigo e flores ornamentais',
    transparent: true,
    missionScope: 'MISSION_4',
    fallbackLabel: 'BANDEJA DE CULTURAS',
  },
  // Sprites da Missão 5 e Cena Final 6 (Etapa 6)
  radiationShelter: {
    id: 'radiationShelter',
    path: '/assets/sprites/mission5/radiation_shelter.png',
    alt: 'Abrigo blindado contra radiação com camadas de solo marciano e reservatórios de água',
    transparent: true,
    missionScope: 'MISSION_5',
    fallbackLabel: 'ABRIGO DE RADIAÇÃO',
  },
  dustStormScene: {
    id: 'dustStormScene',
    path: '/assets/sprites/mission5/dust_storm_scene.png',
    alt: 'Tempestade de poeira marciana se aproximando dos painéis solares e da base',
    transparent: false,
    missionScope: 'MISSION_5',
    fallbackLabel: 'TEMPESTADE DE POEIRA',
  },
  earthCommsRoom: {
    id: 'earthCommsRoom',
    path: '/assets/sprites/mission5/earth_comms_room.png',
    alt: 'Sala de comando e comunicação com a Terra brilhando pela janela espacial',
    transparent: false,
    missionScope: 'ENDING',
    fallbackLabel: 'CENTRAL DE COMUNICAÇÃO',
  },
  arcadiaWorldMap: {
    id: 'arcadiaWorldMap',
    path: '/assets/sprites/arcadia_world_map.png',
    alt: 'Mapa regional top-down de Arcadia Planitia baseado na foto orbital NASA HiRISE ESP_046254_2170',
    transparent: false,
    missionScope: 'INTRO',
    fallbackLabel: 'MAPA ORBITAL ARCADIA PLANITIA (ESP_046254_2170)',
  },
  // Sprites do Modo 2: Sobrevivência em Tempo Real (30 Sols)
  survivalBreakerPanel: {
    id: 'survivalBreakerPanel',
    path: '/assets/sprites/survival/breaker_panel.jpg',
    alt: 'Painel de disjuntores elétricos da base em Arcadia Planitia com medidores de carga LED',
    transparent: false,
    missionScope: 'MISSION_1',
    fallbackLabel: 'PAINEL DE DISJUNTORES',
  },
  survivalBunkerInterior: {
    id: 'survivalBunkerInterior',
    path: '/assets/sprites/survival/bunker_interior.jpg',
    alt: 'Interior blindado do abrigo subterrâneo contra tempestades e radiação solar em Marte',
    transparent: false,
    missionScope: 'MISSION_5',
    fallbackLabel: 'BUNKER BLINDADO',
  },
  survivalFaintRescue: {
    id: 'survivalFaintRescue',
    path: '/assets/sprites/survival/faint_rescue.jpg',
    alt: 'Cena de resgate da mascote Capi socorrendo o astronauta exausto às 02:00 em Marte',
    transparent: false,
    missionScope: 'MISSION_2',
    fallbackLabel: 'RESGATE DE EXAUSTÃO (02:00)',
  },
  survivalCropSeed: {
    id: 'survivalCropSeed',
    path: '/assets/sprites/survival/crop_seed.jpg',
    alt: 'Bandeja hidropônica marciana no estágio 1 de sementes recém-plantadas',
    transparent: false,
    missionScope: 'MISSION_4',
    fallbackLabel: 'ESTÁGIO 1: SEMENTES',
  },
  survivalCropSprout: {
    id: 'survivalCropSprout',
    path: '/assets/sprites/survival/crop_sprout.jpg',
    alt: 'Bandeja hidropônica marciana no estágio 2 com brotos verdes sob LED',
    transparent: false,
    missionScope: 'MISSION_4',
    fallbackLabel: 'ESTÁGIO 2: BROTO',
  },
  survivalCropGrowing: {
    id: 'survivalCropGrowing',
    path: '/assets/sprites/survival/crop_growing.jpg',
    alt: 'Bandeja hidropônica marciana no estágio 3 com planta frondosa e botões florais',
    transparent: false,
    missionScope: 'MISSION_4',
    fallbackLabel: 'ESTÁGIO 3: CRESCIMENTO',
  },
  survivalCropMature: {
    id: 'survivalCropMature',
    path: '/assets/sprites/survival/crop_mature.jpg',
    alt: 'Bandeja hidropônica marciana no estágio 4 madura pronta para colheita',
    transparent: false,
    missionScope: 'MISSION_4',
    fallbackLabel: 'ESTÁGIO 4: MADURA',
  },
  survivalBreakerBox: {
    id: 'survivalBreakerBox',
    path: '/assets/sprites/survival/breaker_box.png',
    alt: 'Quadro industrial externo de disjuntores instalado na parede do Habitat em Marte',
    transparent: true,
    missionScope: 'MISSION_1',
    fallbackLabel: 'QUADRO DE DISJUNTORES',
  },
  survivalBunkerEntrance: {
    id: 'survivalBunkerEntrance',
    path: '/assets/sprites/survival/bunker_entrance.png',
    alt: 'Entrada blindada de bunker subterrâneo marciano com escotilha de aço e luz de alerta',
    transparent: true,
    missionScope: 'MISSION_5',
    fallbackLabel: 'ENTRADA DO BUNKER',
  },
};

export type AssetKey = keyof typeof ASSET_MANIFEST;
