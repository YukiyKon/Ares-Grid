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
    },
  },
  capi: {
    badge: 'CAPI // ASSISTENTE NASA',
    continueBtn: 'Continuar ▶',
    prevBtn: 'Ant',
    nextBtn: 'Próximo',
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
};
