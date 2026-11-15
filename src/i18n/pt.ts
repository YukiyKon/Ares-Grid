import type { CosmeticId, MicroGameId } from '../modes/arcade-rush/arcadeStore';

export interface UiDictionary {
  meta: {
    pageTitle: string;
    htmlLang: string;
  };
  common: {
    base: string;
    close: string;
    reset: string;
    backToBase: string;
    playAgain: string;
    locked: string;
    available: string;
    completed: string;
    sol: string;
    turns: string;
    stamina: string;
    energy: string;
    water: string;
    food: string;
    health: string;
    rations: string;
    warning: string;
    critical: string;
  };
  start: {
    badge: string;
    title: string;
    subtitlePrefix: string;
    mode1Label: string;
    subtitleMiddle: string;
    mode2Label: string;
    mode1Tag: string;
    mode1Title: string;
    mode1Desc: string;
    mode1Btn: string;
    mode2Tag: string;
    mode2Title: string;
    mode2Desc: string;
    mode2Btn: string;
    windowedBtn: string;
    langHint: string;
  };
  hud: {
    survivalModeTitle: string;
    cascadeBadge: string;
    cascadeTooltipPrefix: string;
    weatherSolar: string;
    weatherStorm: string;
    weatherDust: string;
    weatherClear: string;
    tooltipSolarInactive: string;
    tooltipWaterShip: string;
    tooltipHealthSim: string;
    switchToTraining: string;
    switchToSurvival: string;
    simulateCrisisBtn: string;
    simulateCrisisTitle: string;
    arcadiaMapBtn: string;
    logbookBtn: string;
    sleepBtn: string;
    soundOffTitle: string;
    soundOnTitle: string;
    fullscreenExitTitle: string;
    fullscreenEnterTitle: string;
    fullscreenExitShort: string;
    fullscreenEnterShort: string;
    restartTitle: string;
    restartShort: string;
    sceneLabels: Record<string, string>;
  };
  capi: {
    badge: string;
    continueBtn: string;
    prevBtn: string;
    nextBtn: string;
    skipBtn: string;
    finishBtn: string;
    closeAria: string;
    minimizeLabel: string;
    reopenLabel: string;
    defaultGreeting: string;
    openShort: string;
  };
  map: {
    modalAria: string;
    title: string;
    subtitle: string;
    closeAria: string;
    orbitalSource: string;
    activeBadge: string;
    freeModeBadge: string;
    goToBaseBtn: string;
    mission1Short: string;
    mission2Short: string;
    exploreSectorBtn: string;
    sectorLockedBtn: string;
    quickNavLabel: string;
  };
  logbook: {
    modalAria: string;
    headerTitle: string;
    closeAria: string;
    introPrefix: string;
    step1Highlight: string;
    step2Highlight: string;
    andWord: string;
    step3Highlight: string;
    field1Label: string;
    field1Placeholder: string;
    field2Label: string;
    field2Placeholder: string;
    field3Label: string;
    photoCaptured: string;
    noPhotoYet: string;
    captureNewPhoto: string;
    captureEventPhoto: string;
    needPhotoFirst: string;
    needTextFields: string;
    saveBtn: string;
    savedToast: string;
    albumTitle: string;
    savedLocally: string;
    emptyAlbum: string;
    sentToEarth: string;
    shipServer: string;
    canvasHeaderPrefix: string;
    canvasRecordPrefix: string;
    defaultObservationTitle: string;
  };
  survival: {
    weather: Record<
      'CLEAR' | 'DUST_WIND' | 'GLOBAL_DUST_STORM' | 'SOLAR_RADIATION_FLARE',
      {
        title: string;
        shortBadge: string;
        description: string;
        capiAdvice: string;
      }
    >;
    stations: Record<
      'MISSION_1' | 'MISSION_2' | 'MISSION_3' | 'MISSION_4' | 'MISSION_5',
      {
        title: string;
        shortTitle: string;
        costLabel: string;
        rewardLabel: string;
        operationTag: string;
        blockedReason: string;
        hubPinSub: string;
        quickBtn: string;
      }
    >;
    crises: Record<
      'SOLAR_PROTON_SPIKE' | 'HABITAT_MICRO_LEAK' | 'PANEL_SHORT_CIRCUIT',
      {
        title: string;
        capiUrgentWarning: string;
        penaltySummary: string;
        actionButtonLabel: string;
      }
    >;
    failureReasons: {
      ENERGY: (sol: number) => string;
      WATER: (sol: number) => string;
      HEALTH: (sol: number) => string;
    };
    dominoAlerts: {
      panelDustCritical: (dustPct: number) => string;
      greenhouseThermalRisk: string;
      waterDehydration: string;
      foodZeroStarvation: string;
      staminaCapExhaustion: (maxStamina: number) => string;
    };
    nightlyDominoEffects: {
      panelDustPenalty: (dustPct: number, solarGenerated: number) => string;
      powerSavePenalty: string;
      starvationPenalty: string;
      untrainedPenalty: string;
      unprotectedStormPenalty: (weatherTitle: string, energyLoss: number, healthLoss: number) => string;
      greenhouseCrashWithFood: string;
      greenhouseCrashNoFood: string;
      dehydrationPenalty: string;
      faintedPenalty: string;
    };
    dailyLog: {
      exerciseDone: (count: number) => string;
      exercisePending: string;
      mealBalanced: (kcal: number, items?: string) => string;
      mealNightRation: string;
      mealMissing: string;
      hydrationDone: (ml: number, waterPct: number) => string;
      hydrationNightFallback: (waterPct: number) => string;
      hydrationInsufficient: string;
      hygieneDone: string;
      hygienePending: string;
      stationOpHabitat: (parts: string[]) => string;
      habitatPartExercise: string;
      habitatPartKcal: (kcal: number) => string;
      habitatPartHydrate: (ml: number) => string;
      habitatPartHygiene: string;
      habitatPartRest: string;
    };
    stationOps: {
      MISSION_1: string;
      MISSION_3: string;
      MISSION_4: string;
      MISSION_5: string;
    };
    notices: {
      initial: string;
      zeroTurnsLeft: string;
      insufficientStamina: (stationTitle: string, cost: number, current: number) => string;
      insufficientWater: (stationTitle: string, minWater: number, current: number) => string;
      insufficientEnergy: (stationTitle: string, minEnergy: number, current: number) => string;
      stationComplete: {
        MISSION_1: string;
        MISSION_2_HYDRATION: string;
        MISSION_2_FULL: (maxStamina: number) => string;
        MISSION_3: string;
        MISSION_4: string;
        MISSION_5: string;
      };
      crisisStarted: (title: string) => string;
      crisisContained: (title: string) => string;
      crisisTimeout: (title: string, penaltySummary: string) => string;
      fainted0200: string;
      stormPrepStarted: (title: string) => string;
      stormImpactStarted: (title: string) => string;
      stormCleared: string;
      victory: string;
      sleepCycleDone: (sol: number, shortBadge: string, isCritical: boolean, stormProtected: boolean) => string;
      syncCompleted: (sol: number) => string;
      syncQueued: string;
    };
    nightlySummary: {
      tense: (completedSol: number, firstDominoEffect: string) => string;
      survivedCritical: (completedSol: number, weatherTitle: string) => string;
      standard: (completedSol: number, solarGenerated: number, energyConsumed: number, waterConsumed: number) => string;
    };
    baseHub: {
      expeditionBadge: (sol: number) => string;
      turnsOfSol: string;
      physicalStamina: string;
      staminaMaxLabel: (max: number) => string;
      panelDust: string;
      weatherToday: string;
      earlyWarning: (nextSol: number, title: string, advice: string) => string;
      cascadeTitle: string;
      sleepBtn: string;
      lastActionPrefix: string;
      capiTurnZero: (sol: number) => string;
      capiMain: (sol: number, turnsLeft: number, dustPct: number, shortBadge: string) => string;
      capiCascadeWarning: (count: number) => string;
      cartridgesTitle: string;
      cartridgesDesc: string;
      cartridgeCostPrefix: string;
      availableNow: string;
      mission1Sub: string;
      mission2Sub: string;
      mission3Sub: string;
      mission4Sub: string;
      mission5Sub: string;
    };
    stationBanner: {
      badgeTitle: (sol: number) => string;
      turnsLabel: string;
      weatherLabel: string;
      completeDefaultBtn: string;
      costPrefix: string;
      rewardPrefix: string;
    };
    missionActions: {
      m1Badge: string;
      m1Title: string;
      m1TabSite: string;
      m1TabCalc: string;
      m1TabTest: string;
      m1LockAlert: string;
      m1SurvivalCardTitle: (sol: number) => string;
      m1SurvivalDustLabel: string;
      m1SurvivalReadyDesc: string;
      m1SurvivalPendingDesc: string;
      m1SurvivalBtn: string;
      m2Badge: string;
      m2Title: string;
      m2TabExercise: string;
      m2TabNutrition: string;
      m2TabHygiene: string;
      m2TabSleep: string;
      m2LockAlert: string;
      m2HygieneFallback: string;
      m2HydrationOnlyBtn: string;
      m2HydrationNeedWater: string;
      m2HydrationQuickTurnBtn: string;
      m2StockEmptyBtn: string;
      m2MealStepBtn: (kcal: number) => string;
      m2MealQuickTurnBtn: string;
      m2HygieneTitle: string;
      m2HygieneDone: string;
      m2HygienePending: string;
      m2HygieneCompleteBtn: string;
      m2HygieneProgressBtn: (done: number) => string;
      m3Badge: string;
      m3Title: string;
      m3TabOrbital: string;
      m3TabDrill: string;
      m3TabLab: string;
      m3LockAlert: string;
      m3SurvivalBtn: string;
      m4Badge: string;
      m4Title: string;
      m4TabMethod: string;
      m4TabSoil: string;
      m4TabPlants: string;
      m4TabGrowth: string;
      m4TabBioreg: string;
      m4LockAlert: string;
      m4SurvivalBtn: string;
      m5Badge: string;
      m5Title: string;
      m5TabDust: string;
      m5TabSolar: string;
      m5TabShelter: string;
      m5TabInspect: string;
      m5LockAlert: string;
      m5DustReadyBtn: string;
      m5DustPendingBtn: (done: number) => string;
      m5ShelterReadyBtn: string;
      m5ShelterPendingBtn: string;
    };
    realtime: {
      clockBadge: (sol: number, timeStr: string) => string;
      dayPhase: {
        DAWN: string;
        MORNING: string;
        NOON: string;
        DUSK: string;
        NIGHT: string;
      };
      pauseBtn: string;
      resumeBtn: string;
      pausedTag: string;
      fastForwardBtn: string;
      fastForwardHintDisabled: string;
      hungerLabel: string;
      thirstLabel: string;
      solarOutputLabel: (watts: number, effPct: number) => string;
      habitatIndoorSafe: string;
      habitatEnterBtn: string;
      habitatExitBtn: string;
      breakersTitle: string;
      breakersSub: string;
      breakersMandatory: string;
      breakerLifeSupport: string;
      breakerLifeSupportDesc: string;
      breakerLeds: string;
      breakerLedsDesc: string;
      breakerHeater: string;
      breakerHeaterDesc: string;
      breakerRadar: string;
      breakerRadarDesc: string;
      faintTitle: string;
      faintBadge: string;
      faintSpeech: string;
      faintPenaltyHealth: string;
      faintPenaltyWake: string;
      faintPenaltyStamina: string;
      faintWakeBtn: string;
      bunkerTitle: string;
      bunkerEnterBtn: string;
      bunkerExitBtn: string;
      bunkerSafeBanner: string;
      bunkerDangerBanner: string;
      stormChecklistTitle: string;
      stormPrepCountdown: (sec: number) => string;
      stormImpactCountdown: (sec: number) => string;
      stormCheckHatches: string;
      stormCheckCrops: string;
      stormCheckBreakers: string;
      stormCheckBunker: string;
      stormPostBanner: string;
      cropStage: {
        EMPTY: string;
        SEED: string;
        SPROUT: string;
        GROWING: string;
        MATURE: string;
      };
      cropPlantAction: string;
      cropTendAction: string;
      cropHarvestAction: string;
      cropPausedLed: string;
    };
  };
  arcade: {
    modeTag: string;
    modeTitle: string;
    startBtn: string;
    hudBtn: string;
    play: string;
    garage: string;
    exit: string;
    go: string;
    speedUp: string;
    hold: string;
    tap: string;
    commands: Record<MicroGameId, string>;
    score: string;
    best: string;
    combo: string;
    maxCombo: string;
    round: string;
    newRecord: string;
    gameOver: string;
    playAgain: string;
    menu: string;
    unlocked: string;
    newBadge: string;
    totalPoints: string;
    totalStars: string;
    categories: Record<'SUIT' | 'ROVER' | 'CAPI', string>;
    equip: string;
    equipped: string;
    cosmetics: Record<CosmeticId, string>;
    gameAreaAria: string;
    moveUpAria: string;
    moveDownAria: string;
    moveRightAria: string;
  };
}

export const UI_PT: UiDictionary = {
  meta: {
    pageTitle: 'Aventura em Marte: Arcadia Planitia',
    htmlLang: 'pt-BR',
  },
  common: {
    base: 'Base',
    close: 'Fechar',
    reset: 'Reiniciar',
    backToBase: 'Voltar à Base',
    playAgain: 'Jogar Novamente',
    locked: 'Bloqueado',
    available: 'DISPONÍVEL',
    completed: 'CONCLUÍDA',
    sol: 'SOL',
    turns: 'Turnos',
    stamina: 'Stamina',
    energy: 'Energia',
    water: 'Água',
    food: 'Comida',
    health: 'Saúde',
    rations: 'rações',
    warning: 'AVISO',
    critical: 'CRÍTICO',
  },
  start: {
    badge: 'NASA • ARCADIA PLANITIA (~39.2°N)',
    title: 'AVENTURA EM MARTE: ARCADIA PLANITIA',
    subtitlePrefix: 'Escolha seu modo de missão: aprenda os sistemas científicos no ',
    mode1Label: 'Modo 1 (Treinamento de Cadete)',
    subtitleMiddle: ' ou encare o desafio estratégico no ',
    mode2Label: 'Modo 2 (Sobreviver 30 Sols)',
    mode1Tag: 'MODO 1 • TUTORIAL GUIADO',
    mode1Title: 'Treinamento de Cadete (5 Missões + História)',
    mode1Desc:
      'Contagem regressiva, personalização de traje e mini-games passo a passo com a Capi.',
    mode1Btn: '🚀 INICIAR TREINAMENTO',
    mode2Tag: 'MODO 2 • DESAFIO DE SOBREVIVÊNCIA',
    mode2Title: 'Expedição Real: 30 Sols em Arcadia',
    mode2Desc:
      'Mapa livre, 4 turnos/Sol, gestão de Stamina, energia, água, comida e tempestades!',
    mode2Btn: '🚀 Iniciar Expedição 30 Sols',
    windowedBtn: 'Jogar Treinamento em janela normal',
    langHint: 'Idioma da Missão / Mission Language',
  },
  hud: {
    survivalModeTitle: 'Modo Sobrevivência (30 Sols)',
    cascadeBadge: 'CASCATA',
    cascadeTooltipPrefix: 'Poeira nos painéis',
    weatherSolar: '☢️ Alerta Solar',
    weatherStorm: '🌪️ Tempestade',
    weatherDust: '🌪️ Poeira',
    weatherClear: '☀️ Céu Limpo',
    tooltipSolarInactive: 'Energia do habitat (Painel solar ainda não instalado)',
    tooltipWaterShip: 'Reserva de água da nave',
    tooltipHealthSim: 'Saúde simulada para fins educativos',
    switchToTraining: '⚡ Modo Sobrevivência (Ir p/ Treino)',
    switchToSurvival: '⚡ Modo Sobrevivência',
    simulateCrisisBtn: '🚨 Simular Crise',
    simulateCrisisTitle: 'Disparar evento de crise cronometrada em tempo real',
    arcadiaMapBtn: '🗺️ MAPA',
    logbookBtn: 'Diário',
    sleepBtn: 'Dormir',
    soundOffTitle: 'Ativar som',
    soundOnTitle: 'Silenciar som',
    fullscreenExitTitle: 'Sair da tela cheia',
    fullscreenEnterTitle: 'Ativar modo tela cheia',
    fullscreenExitShort: '⛶ Sair',
    fullscreenEnterShort: '⛶ Tela',
    restartTitle: 'Reiniciar aventura do início (Contagem 10 a 0)',
    restartShort: 'Reiniciar aventura',
    sceneLabels: {
      START_SCREEN: '0. Início',
      COUNTDOWN: '1. Contagem',
      LAUNCH: '2. Decolagem',
      CAPI_INTRO: '3. Capi',
      CUSTOMIZE: '3.1 Traje',
      LANDING: '4. Pouso',
      BASE_HUB: 'Base Arcadia',
      MISSION_1: 'Missão 1: Solar',
      MISSION_2: 'Missão 2: Saúde',
      MISSION_3: 'Missão 3: Gelo e Água',
      MISSION_4: 'Missão 4: Estufa',
      MISSION_5: 'Missão 5: Tempestades',
      EARTH_COMMS: '6. Central Terra',
      FUTURE_MARS: '7. Futuro em Marte',
      ARCADE_RUSH: '⚡ Arcade Rush',
    },
  },
  capi: {
    badge: 'CAPI // ASSISTENTE NASA',
    continueBtn: 'Continuar ▶',
    prevBtn: 'Ant',
    nextBtn: 'Próximo',
    skipBtn: 'Pular',
    finishBtn: 'Entendido! ▶',
    closeAria: 'Fechar diálogo da Capi',
    minimizeLabel: 'Minimizar janela da Capi',
    reopenLabel: 'Botão para reabrir janela da Capivara Capi',
    defaultGreeting: 'Olá, comandante! Estou pronta para ajudar.',
    openShort: 'CAPI',
  },
  map: {
    modalAria: 'Mapa Regional de Arcadia Planitia (HiRISE ESP_046254_2170)',
    title: 'MAPA DE ARCADIA PLANITIA — ESP_046254_2170',
    subtitle: 'Toque ou clique em qualquer setor liberado para navegar pela região',
    closeAria: 'Fechar Mapa de Arcadia',
    orbitalSource: 'Fonte Orbital: NASA/JPL-Caltech/UArizona • HiRISE ESP_046254_2170 (~39.2°N)',
    activeBadge: 'ATIVO ✓',
    freeModeBadge: 'LIVRE (MODO 30 SOLS) ▶',
    goToBaseBtn: 'Ir para Base Arcadia',
    mission1Short: 'Missão 1: Solar',
    mission2Short: 'Missão 2: Saúde',
    exploreSectorBtn: 'Explorar Setor ▶',
    sectorLockedBtn: 'Setor Bloqueado',
    quickNavLabel: 'Acesso rápido aos setores:',
  },
  logbook: {
    modalAria: 'Diário de Bordo Científico',
    headerTitle: 'DIÁRIO DE BORDO CIENTÍFICO',
    closeAria: 'Fechar Diário de Bordo',
    introPrefix: 'Todo bom cientista registra: ',
    step1Highlight: '1. Evento',
    step2Highlight: '2. Aspecto observado',
    andWord: ' e ',
    step3Highlight: '3. Fotografia',
    field1Label: '1. EVENTO (O QUE ACONTECEU?)',
    field1Placeholder: 'Ex.: Instalação e ativação dos painéis solares',
    field2Label: '2. ASPECTO OBSERVADO',
    field2Placeholder: 'O que você observou no ambiente ou nos equipamentos?',
    field3Label: '3. FOTOGRAFIA CIENTÍFICA',
    photoCaptured: 'Fotografia científica capturada',
    noPhotoYet: 'Nenhuma fotografia capturada ainda.',
    captureNewPhoto: 'Capturar Nova Foto',
    captureEventPhoto: 'Capturar Fotografia do Evento',
    needPhotoFirst: '1º Clique em "Capturar Fotografia do Evento" acima 📸',
    needTextFields: 'Preencha o evento e o aspecto observado acima',
    saveBtn: 'Salvar no Diário da Nave ▶',
    savedToast: 'Registro salvo com sucesso no servidor local!',
    albumTitle: 'ÁLBUM E REGISTROS',
    savedLocally: 'Salvo localmente',
    emptyAlbum:
      'Seu álbum científico está vazio. Preencha os 3 passos ao lado para guardar sua primeira descoberta!',
    sentToEarth: 'Enviado à Terra',
    shipServer: 'Servidor da nave',
    canvasHeaderPrefix: 'ARCADIA PLANITIA • SOL',
    canvasRecordPrefix: 'REGISTRO',
    defaultObservationTitle: 'OBSERVAÇÃO CIENTÍFICA',
  },
  survival: {
    weather: {
      CLEAR: {
        title: 'Céu Marciano Limpo',
        shortBadge: '☀️ Céu Limpo',
        description:
          'Boa incidência solar (~600 W/m² em Arcadia). Poeira atmosférica moderada se acumulando.',
        capiAdvice:
          'Sol favorável para gerar energia! Lembre-se de limpar os painéis, extrair gelo ou colher na estufa.',
      },
      DUST_WIND: {
        title: 'Vento de Poeira Fina',
        shortBadge: '🌪️ Vento de Poeira',
        description:
          'Rajadas de vento depositam poeira rápida sobre os painéis solares (-30% de eficiência solar).',
        capiAdvice:
          'Poeira em alta! Limpe os painéis solares no Setor 1 para evitar queda de energia no fechamento do Sol.',
      },
      GLOBAL_DUST_STORM: {
        title: 'Tempestade Global de Poeira',
        shortBadge: '⛈️ Tempestade Crítica',
        description:
          'Bloqueio solar severo! Se você não ativar a proteção na Estação 5 hoje, a base perderá -22% Energia e -18% Saúde à noite.',
        capiAdvice:
          'PERIGO! Vá à Estação 5 (Tempestades) vedar as escotilhas antes de dormir para evitar o colapso da base!',
      },
      SOLAR_RADIATION_FLARE: {
        title: 'Tempestade de Radiação Solar',
        shortBadge: '☢️ Alerta Solar',
        description:
          'Partículas solares de alta energia atingem Marte. Ative o Abrigo Blindado na Estação 5 hoje ou perca -25% de Saúde!',
        capiAdvice:
          'ALERTA SOLAR CRÍTICO! Opere a Estação 5 (Abrigo Blindado) agora para proteger sua saúde da radiação!',
      },
    },
    stations: {
      MISSION_1: {
        title: 'Estação 1: Painéis Solares',
        shortTitle: 'Painéis Solares',
        costLabel: '-15% Stamina • Tempo real',
        rewardLabel: 'Zera poeira solar • +10% Energia',
        operationTag: 'Painéis Solares limpos (0% poeira) • +10% Energia recuperada',
        blockedReason: 'Stamina insuficiente (mín. 10%) para operar os Painéis Solares! Alimente-se no Habitat.',
        hubPinSub: '-15% Stam • Poeira 0%',
        quickBtn: '1. Solar (Limpar Poeira)',
      },
      MISSION_2: {
        title: 'Estação 2: Habitat / Saúde',
        shortTitle: 'Habitat & Saúde',
        costLabel: '-1 Ração • -8% Água • -4% Energia',
        rewardLabel: '+68% Fome/Sede • +20% Saúde • +40% Stamina',
        operationTag: 'Rotina do Habitat (treino, refeição, hidratação e higiene)',
        blockedReason: 'Recursos insuficientes no Habitat!',
        hubPinSub: '+Fome/Sede • +20% Saúde',
        quickBtn: '2. Habitat (Comer/Beber)',
      },
      MISSION_3: {
        title: 'Estação 3: Jazida de Gelo & Lab',
        shortTitle: 'Gelo & Água',
        costLabel: '-24% Stamina • -12% Energia',
        rewardLabel: '+28% Água Potável na base',
        operationTag: 'Perfuração a 2,2 m & filtro UV: +28% Água Potável extraída',
        blockedReason: 'Stamina insuficiente (mín. 18%) para perfurar o gelo marciano! Recupere-se no Habitat.',
        hubPinSub: '-24% Stam • +28% Água',
        quickBtn: '3. Gelo (+28% Água)',
      },
      MISSION_4: {
        title: 'Estufa ECLSS (2-3 Sols)',
        shortTitle: 'Estufa Hidropônica',
        costLabel: '-14% Stamina • -10% Água • -6% Energia',
        rewardLabel: 'Planta/rega em tempo real ou colhe +2 Rações',
        operationTag: 'Estufa ECLSS: manejo contínuo e colheita (+Rações, +8% O₂/Saúde)',
        blockedReason: 'Stamina insuficiente (mín. 10%) para manejar a Estufa Hidropônica!',
        hubPinSub: 'Crescimento Contínuo 2-3 Sols',
        quickBtn: '4. Estufa (Cultivo)',
      },
      MISSION_5: {
        title: 'Estação 5: Bunker & Vedação',
        shortTitle: 'Bunker & Proteção',
        costLabel: '-10% Stamina • -5% Energia',
        rewardLabel: 'Veda base e abre acesso ao Bunker Blindado',
        operationTag: 'Bunker & Escotilhas: base vedada contra tempestade e radiação',
        blockedReason: 'Stamina insuficiente (mín. 5%) para vedar a base!',
        hubPinSub: 'Abrigo Contra Tempestades',
        quickBtn: '5. Bunker & Vedação',
      },
    },
    crises: {
      SOLAR_PROTON_SPIKE: {
        title: 'PICO SÚBITO DE RADIAÇÃO SOLAR!',
        capiUrgentWarning: 'TEMPESTADE DE PRÓTONS DETECTADA EM ÓRBITA! Acione as comportas de chumbo/água AGORA ou corra para o Abrigo Blindado antes que o contador zere!',
        penaltySummary: '-28% Saúde • -15% Stamina por exposição aguda',
        actionButtonLabel: '🛡️ FECHAR ESCOTILHA BLINDADA AGORA',
      },
      HABITAT_MICRO_LEAK: {
        title: 'MICRO-VAZAMENTO DE PRESSÃO NO HABITAT!',
        capiUrgentWarning: 'ALERTA DE DESPRESSURIZAÇÃO! Impacto de micrometeorito abriu fissura no domo! Sele a válvula de contenção imediatamente!',
        penaltySummary: '-22% Energia (aquecimento) • -18% Água • -15% Saúde',
        actionButtonLabel: '🔧 VEDAR FISSURA DO DOMO AGORA',
      },
      PANEL_SHORT_CIRCUIT: {
        title: 'SOBRECARGA E CURTO NOS PAINÉIS SOLARES!',
        capiUrgentWarning: 'DESCARGA ESTÁTICA DE POEIRA NO BARRAMENTO SOLAR! Desarme o disjuntor de emergência antes que o banco de baterias queime!',
        penaltySummary: '-30% Energia das baterias • +25% Poeira aderida',
        actionButtonLabel: '⚡ DESARMAR DISJUNTOR DE PICO',
      },
    },
    failureReasons: {
      ENERGY: (sol) => `Colapso energético no Sol ${sol}/30! As baterias zeraram e o suporte térmico da base desligou.`,
      WATER: (sol) => `Colapso hídrico no Sol ${sol}/30! Os tanques secaram sem reserva suficiente na Estação 3.`,
      HEALTH: (sol) => `Colapso médico no Sol ${sol}/30! Exaustão severa, desidratação ou exposição sem abrigo vitimou a tripulação.`,
    },
    dominoAlerts: {
      panelDustCritical: (dustPct) => `Poeira crítica (${dustPct}%): rendimento solar derrubado para 30%–62%!`,
      greenhouseThermalRisk: 'Energia < 30% → Estufa em risco térmico: perda de colheita (-1 ração) e O₂ (-8% saúde) à noite!',
      waterDehydration: 'Água < 25% → Desidratação ativa: penalidade de saúde noturna e queda de Stamina máxima!',
      foodZeroStarvation: 'Estoque ZERO de rações → Desnutrição trava o teto de Stamina em 65% e drena saúde!',
      staminaCapExhaustion: (maxStamina) => `Exaustão acumulada: teto de Stamina limitado a ${maxStamina}% até descansar e comer no Habitat.`,
    },
    nightlyDominoEffects: {
      panelDustPenalty: (dustPct, solarGenerated) => `Poeira (${dustPct}%) derrubou geração solar para apenas +${solarGenerated}%.`,
      powerSavePenalty: 'Modo Economia noturno causou frio na cabine (-4% Saúde, -10% Stamina).',
      starvationPenalty: 'Sem rações disponíveis → Fome severa (-22% Saúde e Stamina máxima travada em 65%).',
      untrainedPenalty: 'Sem treino físico no Sol → Perda de tônus (-8% Saúde e -10% Stamina máxima).',
      unprotectedStormPenalty: (weatherTitle, energyLoss, healthLoss) =>
        `Sem proteção no Abrigo em "${weatherTitle}" → Dano severo (-${energyLoss}% Energia, -${healthLoss}% Saúde).`,
      greenhouseCrashWithFood: 'Energia < 30% → Resfriamento da Estufa estragou -1 Ração e derrubou O₂ (-8% Saúde).',
      greenhouseCrashNoFood: 'Energia < 30% → Estufa despressurizada derrubou O₂ (-8% Saúde).',
      dehydrationPenalty: 'Água < 25% → Desidratação reduziu Saúde (-10%) e teto de Stamina (-15%).',
      faintedPenalty: 'Desmaio às 02:00 AM → Resgate de exaustão (-25% Saúde, acordou às 09:00 com 40% Stamina).',
    },
    dailyLog: {
      exerciseDone: (count) => `Treino gravitacional concluído (${count} ${count > 1 ? 'exercícios' : 'exercício'})`,
      exercisePending: 'Nenhum exercício realizado hoje — queda de condicionamento',
      mealBalanced: (kcal, items) =>
        items ? `Refeição balanceada: ${kcal} kcal (${items})` : `Refeição balanceada: ${kcal} kcal`,
      mealNightRation: 'Ração básica consumida no descanso (480 kcal)',
      mealMissing: 'Sem alimentação hoje — déficit energético',
      hydrationDone: (ml, waterPct) => `${ml} ml ingeridos • Reservatório em ${waterPct}%`,
      hydrationNightFallback: (waterPct) => `Sem hidratação guiada hoje • Reservatório em ${waterPct}%`,
      hydrationInsufficient: 'Hidratação insuficiente hoje',
      hygieneDone: 'Ambiente, mãos e luvas esterilizados',
      hygienePending: 'Higiene pendente — acúmulo de poeira',
      stationOpHabitat: (parts) => `Habitat & Saúde: ${parts.length > 0 ? parts.join(' • ') : 'descanso operacional'}`,
      habitatPartExercise: 'treino concluído',
      habitatPartKcal: (kcal) => `${kcal} kcal`,
      habitatPartHydrate: (ml) => `${ml} ml água`,
      habitatPartHygiene: 'higiene esterilizada',
      habitatPartRest: 'descanso operacional',
    },
    stationOps: {
      MISSION_1: 'Painéis Solares limpos (0% poeira) • +12% Energia recuperada',
      MISSION_3: 'Perfuração a 2,2 m & filtro UV: +26% Água Potável extraída',
      MISSION_4: 'Estufa ECLSS: névoa nutritiva e colheita (+2 Rações, +8% O₂/Saúde)',
      MISSION_5: 'Abrigo & Comunicações: base selada contra tempestade e radiação',
    },
    notices: {
      initial: 'Sobrevivência em tempo real iniciada às 06:00! Gerencie o pico solar, disjuntores à noite, Fome & Sede e durma antes das 02:00 AM.',
      zeroTurnsLeft: 'Já é tarde em Marte! Vá dormir no Habitat antes das 02:00 AM para recuperar 100% Stamina e +15% Saúde.',
      insufficientStamina: (stationTitle, cost, current) =>
        `Stamina insuficiente para operar ${stationTitle}! Precisa de ${cost}% (atual: ${current}%). Alimente-se no Habitat!`,
      insufficientWater: (stationTitle, minWater, current) =>
        `Água insuficiente para operar ${stationTitle}! Precisa de ${minWater}% no reservatório (atual: ${current}%). Perfure gelo na Estação 3!`,
      insufficientEnergy: (stationTitle, minEnergy, current) =>
        `Energia baixa demais para operar ${stationTitle}! Precisa de ${minEnergy}% (atual: ${current}%). Limpe os painéis na Estação 1!`,
      stationComplete: {
        MISSION_1: 'Painéis Solares limpos (0% poeira)! +12% Energia recuperada (-20% Stamina).',
        MISSION_2_HYDRATION: 'Turno no Habitat sem ração no estoque: +8% Saúde e +18% Stamina! Priorize a Estufa!',
        MISSION_2_FULL: (maxStamina) => `Turno no Habitat concluído! +22% Saúde, +35% Stamina (Teto: ${maxStamina}%).`,
        MISSION_3: 'Perfuração a 2,2 m e filtro UV concluídos! +26% Água Potável (-14% Energia, -30% Stamina).',
        MISSION_4: 'Colheita ECLSS concluída! +2 Rações estocadas e +8% Saúde (-16% Água, -10% Energia).',
        MISSION_5: 'Protocolo de Abrigo & Vedação ativado (-8% Energia)! Base protegida neste Sol.',
      },
      crisisStarted: (title) => `EMERGÊNCIA SÚBITA: ${title}! Resolva antes que o tempo acabe!`,
      crisisContained: (title) => `Emergência contida a tempo (${title})! +30 pts científicos e base preservada.`,
      crisisTimeout: (title, penaltySummary) => `FALHA NA CRISE (${title}): ${penaltySummary}!`,
      fainted0200: '02:00 AM! Exaustão extrema — você desmaiou fora da cama e a Capi realizou o resgate!',
      stormPrepStarted: (title) => `ALERTA DE TEMPESTADE EXTREMA (${title}): Complete o checklist e entre no Bunker em 35s!`,
      stormImpactStarted: (title) => `IMPACTO SEVERO (${title})! Permaneça dentro do Bunker Blindado até passar!`,
      stormCleared: 'Tempestade extrema encerrada! Poeira espessa nos painéis — limpe o Setor 1 urgentemente!',
      victory: 'Parabéns! Você sobreviveu todos os 30 Sols extremos em Arcadia Planitia!',
      sleepCycleDone: (sol, shortBadge, isCritical, stormProtected) =>
        `Sol ${sol} encerrado (${shortBadge}). ${isCritical && !stormProtected ? 'Dano climático noturno aplicado!' : 'Base avançou para o amanhecer!'}`,
      syncCompleted: (sol) => `Relatório real do Sol ${sol} enviado com sucesso para a Central Terrestre!`,
      syncQueued: 'Dados salvos no servidor da nave. Aguardando janela de comunicação com a Terra.',
    },
    nightlySummary: {
      tense: (completedSol, firstDominoEffect) => `Sol ${completedSol} tenso! ${firstDominoEffect}`,
      survivedCritical: (completedSol, weatherTitle) =>
        `Superamos "${weatherTitle}" no Sol ${completedSol}, comandante! Continue racionando os 4 turnos!`,
      standard: (completedSol, solarGenerated, energyConsumed, waterConsumed) =>
        `Sol ${completedSol} encerrado (+${solarGenerated}% Solar / -${energyConsumed}% Energia / -${waterConsumed}% Água).`,
    },
    baseHub: {
      expeditionBadge: (sol) => `EXPEDIÇÃO REAL: 30 SOLS • SOL ${sol}/30`,
      turnsOfSol: 'Turnos do Sol',
      physicalStamina: 'Stamina Física',
      staminaMaxLabel: (max) => `(Máx ${max}%)`,
      panelDust: 'Poeira nos Painéis',
      weatherToday: 'Clima Hoje',
      earlyWarning: (nextSol, title, advice) => `AVISO SOL ${nextSol}: ${title} — ${advice}`,
      cascadeTitle: 'ALERTA DE CASCATA ATIVO:',
      sleepBtn: '🌙 Dormir & Fechar Sol',
      lastActionPrefix: 'Última Ação:',
      capiTurnZero: (sol) => `Turnos do Sol ${sol} esgotados (0/4)! Hora de dormir, salvar os dados na Terra e avançar para o próximo amanhecer em Arcadia.`,
      capiMain: (sol, turnsLeft, dustPct, shortBadge) => `Sol ${sol}/30 • ${turnsLeft} turno(s) restante(s) • Poeira solar em ${dustPct}% • Clima: ${shortBadge}.`,
      capiCascadeWarning: (count) => `⚠️ ATENÇÃO (${count} alerta(s) de cascata)! Resolva o clima/recursos críticos agora!`,
      cartridgesTitle: 'Cartuchos da Expedição (5 Missões)',
      cartridgesDesc: 'No Modo Sobrevivência, todas as 5 estações estão liberadas desde o Sol 1/30!',
      cartridgeCostPrefix: 'Custo:',
      availableNow: 'DISPONÍVEL AGORA',
      mission1Sub: 'Site ESP_046254_2170 & 480 W',
      mission2Sub: 'Exercícios, Kcal, Água & Higiene',
      mission3Sub: 'Sonda SHARAD, Broca & Potabilidade',
      mission4Sub: 'Hidroponia/Aeroponia, Solo & O2',
      mission5Sub: 'Poeira, Limpeza & Abrigo Blindado',
    },
    stationBanner: {
      badgeTitle: (sol) => `MODO SOBREVIVÊNCIA • SOL ${sol}/30`,
      turnsLabel: 'TURNOS:',
      weatherLabel: 'Clima:',
      completeDefaultBtn: 'Concluir Operação',
      costPrefix: 'Custo:',
      rewardPrefix: 'Recompensa:',
    },
    missionActions: {
      m1Badge: 'MISSÃO 1 • ARCADIA SOLAR',
      m1Title: 'GERENCIAMENTO SOLAR DE ARCADIA',
      m1TabSite: '1.1 Local & Mapa',
      m1TabCalc: '1.2 Montagem 480 W',
      m1TabTest: '1.3 Poeira & Teste',
      m1LockAlert: 'Conclua o desafio anterior para liberar esta etapa da Missão 1!',
      m1SurvivalCardTitle: (sol) => `MANUTENÇÃO SOLAR REAL — SOL ${sol}/30`,
      m1SurvivalDustLabel: 'Poeira atual na base:',
      m1SurvivalReadyDesc: 'Painel solar limpo e calibrado! Conclua a manutenção para zerar a poeira acumulada na base e recuperar +12% de Energia.',
      m1SurvivalPendingDesc: 'Esfregue toda a poeira sobre o painel acima até atingir 90%+ para liberar o registro de manutenção.',
      m1SurvivalBtn: '☀️ Concluir Manutenção Solar (-15% Stamina • +10% Energia) ▶',
      m2Badge: 'MISSÃO 2 • HABITAT HUMANO',
      m2Title: 'CUIDANDO DO ASTRONAUTA',
      m2TabExercise: '2.1 Exercício',
      m2TabNutrition: '2.2 Refeição & Água',
      m2TabHygiene: '2.3 Higiene',
      m2TabSleep: '2.4 Sono & Capi',
      m2LockAlert: 'Conclua a etapa anterior dentro do Habitat antes de avançar!',
      m2HygieneFallback: 'Ambiente, mãos e luvas esterilizados',
      m2HydrationOnlyBtn: '💧 Salvar Hidratação (0 Rações) & Ir para Higiene (2.3) ▶',
      m2HydrationNeedWater: '0 rações disponíveis — Dose água (300–400 ml) para hidratar',
      m2HydrationQuickTurnBtn: '✅ Hidratar Agora (+65% Sede • +8% Saúde) ▶',
      m2StockEmptyBtn: 'Estoque zerado (0 rações) — Use a Estufa (Estação 4) ou Hidrate acima',
      m2MealStepBtn: (kcal) => `🥗 Registrar Refeição (${kcal} kcal) & Ir para Higiene (2.3) ▶`,
      m2MealQuickTurnBtn: '✅ Concluir Refeição & Hidratação (+68% Fome/Sede • +20% Saúde) ▶',
      m2HygieneTitle: 'Esterilizar Equipamentos e Bancadas',
      m2HygieneDone: 'Poeira marciana removida com sucesso',
      m2HygienePending: 'Use o módulo de limpeza ao lado (esfregar 90%+)',
      m2HygieneCompleteBtn: '🧼 Concluir Esterilização & Aplicar (+Fome/Sede/Saúde) ▶',
      m2HygieneProgressBtn: (done) => `Realize as 3 etapas de higiene (${done}/3)`,
      m3Badge: 'MISSÃO 3 • ARCADIA NORTE',
      m3Title: 'O MISTÉRIO DO GELO DE MARTE',
      m3TabOrbital: '3.1-3.2 Radar Orbital',
      m3TabDrill: '3.3-3.4 Perfuração',
      m3TabLab: '3.5 Laboratório de Água',
      m3LockAlert: 'Conclua a etapa anterior do radar/perfuração para desbloquear este módulo!',
      m3SurvivalBtn: '💧 Abastecer Base (+28% Água Potável • -24% Stamina) ▶',
      m4Badge: 'MISSÃO 4 • ESTUFA DE MARTE',
      m4Title: 'A PRIMEIRA ESTUFA DE MARTE',
      m4TabMethod: '4.1 Método',
      m4TabSoil: '4.2 Solo vs H₂O',
      m4TabPlants: '4.3 Plantas',
      m4TabGrowth: '4.4 Cultivo & O₂',
      m4TabBioreg: '4.5 Biorregenerativo',
      m4LockAlert: 'Conclua o desafio anterior da Estufa para liberar esta etapa!',
      m4SurvivalBtn: '🌱 Concluir Manejo da Estufa (+Rações • +8% O₂/Saúde) ▶',
      m5Badge: 'MISSÃO 5 • EMERGÊNCIAS EM MARTE',
      m5Title: 'ALERTA! TEMPESTADES EM MARTE',
      m5TabDust: '5.1 Tempestade Poeira',
      m5TabSolar: '5.2 Painéis 480 W',
      m5TabShelter: '5.3 Radiação Solar',
      m5TabInspect: '5.4 Inspeção Final',
      m5LockAlert: 'Conclua o protocolo de segurança anterior para avançar!',
      m5DustReadyBtn: '🛡️ Vedar Base & Entrar no Bunker (-10% Stamina) ▶',
      m5DustPendingBtn: (done) => `Arraste as 4 escotilhas até VEDADO (${done}/4)`,
      m5ShelterReadyBtn: '🛡️ Vedar Base & Entrar no Bunker (-10% Stamina) ▶',
      m5ShelterPendingBtn: 'Guie o astronauta até a porta do Abrigo Blindado ▶',
    },
    realtime: {
      clockBadge: (sol, timeStr) => `SOL ${sol}/30 • ${timeStr}`,
      dayPhase: {
        DAWN: '🌅 Amanhecer',
        MORNING: '☀️ Manhã',
        NOON: '🔆 Pico Solar',
        DUSK: '🌇 Entardecer',
        NIGHT: '🌙 Noite Marciana',
      },
      pauseBtn: '⏸ Pausar',
      resumeBtn: '▶ Continuar',
      pausedTag: 'PAUSADO',
      fastForwardBtn: '⏩ 2x Noite',
      fastForwardHintDisabled: 'Disponível somente à noite (18:00+) estando seguro dentro do Habitat!',
      hungerLabel: 'Fome',
      thirstLabel: 'Sede',
      solarOutputLabel: (watts, effPct) => `Solar: ${watts} W (${effPct}%)`,
      habitatIndoorSafe: 'Dentro do Habitat (Seguro)',
      habitatEnterBtn: '🏠 Entrar no Habitat',
      habitatExitBtn: '🚪 Sair para o Terreno',
      breakersTitle: 'QUADRO DE DISJUNTORES',
      breakersSub: 'Racionamento noturno de bateria: gerencie os sistemas ativos da base em tempo real.',
      breakersMandatory: 'OBRIGATÓRIO',
      breakerLifeSupport: 'Suporte de Vida (O₂)',
      breakerLifeSupportDesc: 'Consumo base contínuo. Não pode ser desligado.',
      breakerLeds: 'LEDs da Estufa',
      breakerLedsDesc: 'Alto gasto noturno. Se desligar à noite, plantas pausam o crescimento sem morrer.',
      breakerHeater: 'Aquecedor do Habitat',
      breakerHeaterDesc: 'Se desligar no frio noturno, reduz recuperação de Stamina e aumenta Fome.',
      breakerRadar: 'Radar Orbital',
      breakerRadarDesc: 'Se desligar, poupa bateria mas reduz o tempo de aviso antecipado de tempestades.',
      faintTitle: '02:00 AM — DESMAIO POR EXAUSTÃO!',
      faintBadge: 'RESGATE EMERGENCIAL DA CAPI',
      faintSpeech: 'Comandante! Você passou das 02:00 AM acordado e caiu exausto! Eu arrastei você para a enfermaria a tempo, mas perdemos 3 horas de sol.',
      faintPenaltyHealth: '-25% de Saúde por exaustão extrema',
      faintPenaltyWake: 'Acordou atrasado às 09:00 AM (-3h de luz solar)',
      faintPenaltyStamina: 'Inicia o novo Sol exausto (apenas 40% de Stamina)',
      faintWakeBtn: '🌅 Acordar às 09:00 e Continuar ▶',
      bunkerTitle: 'BUNKER BLINDADO SUBTERRÂNEO',
      bunkerEnterBtn: '🛡️ Entrar no Bunker',
      bunkerExitBtn: '⬆️ Sair do Bunker',
      bunkerSafeBanner: 'SEGURO DENTRO DO BUNKER — Radiação e ventos extremos bloqueados!',
      bunkerDangerBanner: 'PERIGO! Você está exposto fora do Bunker! Entre agora!',
      stormChecklistTitle: 'ALERTA EXTREMO • PROTOCOLO DE TEMPESTADE',
      stormPrepCountdown: (sec) => `IMPACTO EM: ${sec}s`,
      stormImpactCountdown: (sec) => `TEMPESTADE ATIVA: ${sec}s`,
      stormCheckHatches: 'Vedar escotilhas externas (Estação 5 / Botão)',
      stormCheckCrops: 'Garantir/colher plantas maduras na Estufa',
      stormCheckBreakers: 'Desligar disjuntor não essencial (LEDs/Radar)',
      stormCheckBunker: 'Entrar fisicamente no Bunker Blindado',
      stormPostBanner: 'PÓS-TEMPESTADE: Poeira espessa cobriu os painéis solares! Limpe no Setor 1!',
      cropStage: {
        EMPTY: 'Vazia (Plantar)',
        SEED: 'Semente (Fase 1)',
        SPROUT: 'Broto (Fase 2)',
        GROWING: 'Crescendo (Fase 3)',
        MATURE: 'Madura! Colher +2',
      },
      cropPlantAction: '🌱 Plantar (-5% Água)',
      cropTendAction: '💦 Borrifar Névoa (+6h)',
      cropHarvestAction: '🍓 Colher (+2 Rações)',
      cropPausedLed: 'Crescimento pausado (LED desligado à noite)',
    },
  },
  arcade: {
    modeTag: 'MODO 3 • ARCADE RÁPIDO',
    modeTitle: 'Arcade Rush: Micro-Games Frenéticos',
    startBtn: '⚡ ARCADE RUSH',
    hudBtn: '⚡ ARCADE',
    play: '▶ JOGAR',
    garage: '🎨 CUSTOMIZAR / GARAGEM',
    exit: 'SAIR',
    go: 'JÁ!',
    speedUp: 'MAIS RÁPIDO!',
    hold: 'SEGURE',
    tap: 'TOQUE',
    commands: {
      SCRUB: 'LIMPE!',
      DRILL: 'PERFURE!',
      SEAL: 'VEDE!',
      FILL: 'ENCHA!',
      HARVEST: 'COLHA!',
      RUN: 'CORRA!',
      SYNC: 'SINCRONIZE!',
    },
    score: 'PONTOS',
    best: 'RECORDE',
    combo: 'COMBO',
    maxCombo: 'COMBO MÁX.',
    round: 'RODADA',
    newRecord: 'NOVO RECORDE!',
    gameOver: 'FIM DE RODADA',
    playAgain: '↻ DE NOVO',
    menu: '☰ MENU',
    unlocked: 'DESBLOQUEADO!',
    newBadge: 'NOVO!',
    totalPoints: 'PTS TOTAIS',
    totalStars: 'ESTRELAS',
    categories: {
      SUIT: '👨‍🚀 TRAJE',
      ROVER: '🚙 ROVER',
      CAPI: '🦫 CAPI',
    },
    equip: 'EQUIPAR',
    equipped: '✓ EM USO',
    cosmetics: {
      standard_orange: 'Laranja Padrão',
      golden_visor: 'Visor Dourado',
      cyber_neon: 'Cyber Neon',
      galaxy_star: 'Estrela Galáctica',
      nasa_white: 'Branco NASA',
      mars_gold: 'Ouro de Marte',
      turbo_red: 'Vermelho Turbo',
      blue_cap: 'Boina Azul',
      star_sunglasses: 'Óculos Estrela',
      golden_crown: 'Coroa Dourada',
      mini_jetpack: 'Mini Jetpack',
    },
    gameAreaAria: 'Área do micro-game do Arcade Rush',
    moveUpAria: 'Mover para cima',
    moveDownAria: 'Mover para baixo',
    moveRightAria: 'Avançar para a direita',
  },
};
