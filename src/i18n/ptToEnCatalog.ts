const EXACT_PAIRS: Record<string, string> = {
  // === Intro Scenes ===
  'NASA • ARCADIA PLANITIA (~39.2°N)': 'NASA • ARCADIA PLANITIA (~39.2°N)',
  'AVENTURA EM MARTE: ARCADIA PLANITIA': 'MARS ADVENTURE: ARCADIA PLANITIA',
  'Escolha seu modo de missão: aprenda os sistemas científicos no':
    'Choose your mission mode: learn the science systems in',
  'Modo 1 (Treinamento de Cadete)': 'Mode 1 (Cadet Training)',
  'ou encare o desafio estratégico no': 'or take on the strategic challenge in',
  'Modo 2 (Sobreviver 30 Sols)': 'Mode 2 (Survive 30 Sols)',
  'MODO 1 • TUTORIAL GUIADO': 'MODE 1 • GUIDED TUTORIAL',
  'Treinamento de Cadete (5 Missões + História)': 'Cadet Training (5 Missions + Story)',
  'Contagem regressiva, personalização de traje e mini-games passo a passo com a Capi.':
    'Launch countdown, spacesuit customization, and step-by-step mini-games with Capi.',
  '🚀 INICIAR TREINAMENTO': '🚀 START TRAINING',
  'MODO 2 • DESAFIO DE SOBREVIVÊNCIA': 'MODE 2 • SURVIVAL CHALLENGE',
  'Expedição Real: 30 Sols em Arcadia': 'Real Expedition: 30 Sols in Arcadia',
  'Mapa livre, 4 turnos/Sol, gestão de Stamina, energia, água, comida e tempestades!':
    'Open map, 4 turns/Sol, manage Stamina, power, water, food, and storms!',
  '🚀 Iniciar Expedição 30 Sols': '🚀 Start 30-Sol Expedition',
  'Jogar Treinamento em janela normal': 'Play Training in windowed mode',

  // LaunchScene
  'DECOLAGEM CONFIRMADA!': 'LIFTOFF CONFIRMED!',
  'Sistemas de navegação ativados.': 'Navigation systems activated.',
  'Destino: MARTE.': 'Destination: MARS.',
  'Região de exploração: ARCADIA PLANITIA.': 'Exploration region: ARCADIA PLANITIA.',
  'Ativando assistente virtual de bordo...': 'Activating onboard virtual assistant...',
  'Clique na luz central para ativar a Capi': 'Tap the glowing cyan light to activate Capi',
  'PAINEL CENTRAL': 'CENTER CONSOLE',
  'SISTEMA DA ESPAÇONAVE': 'SPACECRAFT SYSTEM',
  'Uma pequena luz ciano brilhou no painel central da nave!':
    'A small cyan light began glowing on the center console!',
  'Atravessando a atmosfera terrestre em direção a Marte...':
    'Passing through Earth’s atmosphere on course to Mars...',
  'Ativar Assistente Virtual ▶': 'Activate Virtual Assistant ▶',

  // CapiIntroScene
  'Olááá, astronauta! Finalmente vamos nos conhecer! Eu sou a Capi, sua assistente virtual.':
    "Hiii, Astronaut! We finally get to meet! I'm Capi, your virtual mission assistant.",
  'Vou monitorar os sistemas da nave, ajudar nos experimentos e lembrar você de cuidar da saúde.':
    "I'll monitor spacecraft systems, help with experiments, and remind you to take care of your health.",
  'Mas não vou fazer tudo sozinha! Você será o pesquisador responsável pelas descobertas.':
    "But I won't do everything alone! You'll be the lead scientist in charge of our discoveries.",
  'Nosso destino é Arcadia Planitia, uma região de Marte cheia de pistas de gelo subterrâneo!':
    'Our destination is Arcadia Planitia, a Martian plain full of clues of underground water ice!',
  'Antes de começarmos, preciso saber quem está comigo nessa aventura! Vamos personalizar seu traje?':
    "Before we begin, I need to know who's joining me on this adventure! Ready to customize your spacesuit?",
  'INTERFACE DE ASSISTÊNCIA VIRTUAL — CAPI': 'VIRTUAL ASSISTANT INTERFACE — CAPI',
  'CONEXÃO HOLOGRÁFICA ATIVA': 'HOLOGRAPHIC LINK ACTIVE',
  'DESTINO: ARCADIA PLANITIA': 'DESTINATION: ARCADIA PLANITIA',
  'Planície extensa no hemisfério norte de Marte. Estudos da NASA indicam evidências de gelo subterrâneo raso — um local estratégico para pesquisas científicas e futuras bases humanas!':
    'A vast plain in Mars’s northern hemisphere. NASA studies reveal shallow buried water ice — a strategic site for science missions and future human bases!',
  'PAPEL DO PESQUISADOR': 'RESEARCHER ROLE',
  'Durante toda a viagem você vai formular hipóteses, instalar equipamentos, fotografar descobertas no Diário de Bordo e enviar dados para a Terra.':
    'Throughout the mission you will form hypotheses, deploy equipment, snap discovery photos in your Logbook, and beam data back to Earth.',
  'Personalizar Astronauta ▶': 'Customize Astronaut ▶',
  'Personalizar ▶': 'Customize ▶',

  // CustomizeScene
  'Atenção, comandante! Nossa primeira tarefa começará assim que pousarmos em Marte!':
    'Heads up, Commander! Our first mission begins as soon as we touch down on Mars!',
  'Escolha um nome para seu astronauta e personalize seu traje espacial!':
    'Choose a name for your astronaut and customize your spacesuit!',
  'Você pode escolher a cor do uniforme, o capacete, a mochila e a insígnia da roupa.':
    'You can pick your suit color, helmet visor, life-support pack, and mission patch.',
  'Comandante': 'Commander',
  'CENA 3.1 — PERSONALIZAÇÃO DO ASTRONAUTA': 'SCENE 3.1 — ASTRONAUT CUSTOMIZATION',
  'Salvo no navegador': 'Saved in browser',
  'PRÉVIA DO TRAJE': 'SUIT PREVIEW',
  'Modelo base 16-bit': '16-bit Base Model',
  'NOME DO ASTRONAUTA': 'ASTRONAUT NAME',
  'Digite seu nome de explorador': 'Enter your explorer name',
  'COR DO UNIFORME': 'SUIT COLOR',
  'CAPACETE E VISOR': 'HELMET & VISOR',
  'MOCHILA DE SUPORTE': 'LIFE-SUPPORT PACK',
  'INSÍGNIA / DETALHE DA ROUPA': 'MISSION PATCH',
  'Confirmar Traje': 'Save Suit',
  'Ir para Pouso em Marte ▶': 'Proceed to Mars Landing ▶',
  'Pousar em Marte ▶': 'Land on Mars ▶',

  // AstronautAvatar labels
  'Branco NASA': 'NASA White',
  'Laranja Explorador': 'Explorer Orange',
  'Azul Orbital': 'Orbital Blue',
  'Verde Botânico': 'Botanical Green',
  'Roxo Estelar': 'Stellar Purple',
  'Clássico Transparente': 'Clear Classic',
  'Visor Ciano Polarizado': 'Polarized Cyan Visor',
  'Escudo Solar Dourado': 'Gold Solar Shield',
  'Suporte Padrão': 'Standard Pack',
  'Tanques Duplos': 'Twin O₂ Tanks',
  'Antena + Radar': 'Antenna + Radar',
  'Capivara Capi': 'Capi Capybara',
  'Planeta Marte': 'Planet Mars',
  'Estrela Polar': 'Polar Star',
  'Energia Solar': 'Solar Power',

  // LandingScene
  'Conseguimos, comandante! Estamos em Marte! Olhe pela janela que lugar diferente!':
    'We made it, Commander! We are on Mars! Look out the window at this incredible world!',
  'Mas temos um problema: precisamos garantir energia para iluminação, comunicação e o laboratório.':
    'Wait—we have a problem: we need reliable power for lighting, communications, and the lab.',
  'Não podemos colocar os painéis solares em qualquer posição! Precisamos calcular onde e como instalá-los.':
    "We can't just place solar panels anywhere! We need to calculate where and how to angle them.",
  'Clique em "Iniciar Missão 1: Energia Solar" para entrarmos na Base de Arcadia Planitia!':
    'Tap "Start Mission 1: Solar Power" to step outside into Arcadia Planitia Base!',
  'SISTEMA DA ESPAÇONAVE — POUSO CONFIRMADO!': 'SPACECRAFT SYSTEM — TOUCHDOWN CONFIRMED!',
  'Localização:': 'Location:',
  'Arcadia Planitia – Marte': 'Arcadia Planitia – Mars',
  'Sistemas de suporte à vida:': 'Life support systems:',
  'OPERACIONAIS': 'OPERATIONAL',
  'Equipamentos científicos:': 'Science gear:',
  'Energia externa:': 'External power:',
  'SISTEMA SOLAR AINDA NÃO INSTALADO.': 'SOLAR ARRAY NOT INSTALLED YET.',
  'CENA 4 — POUSO EM ARCADIA PLANITIA': 'SCENE 4 — LANDING AT ARCADIA PLANITIA',
  'Primeira missão obrigatória pronta para iniciar na base marciana.':
    'First required mission ready to start at Mars Base.',
  'Iniciar Missão 1: Energia Solar': 'Start Mission 1: Solar Power',
  'Missão 1 ▶': 'Mission 1 ▶',

  // Capi & HUD & Navigation
  'CAPI // ASSISTENTE NASA': 'CAPI // NASA ASSISTANT',
  'Continuar ▶': 'Continue ▶',
  'Olá, comandante! Estou pronta para ajudar.': 'Hello, Commander! Ready to assist you.',
  'Botão para reabrir janela da Capivara Capi': 'Reopen Capi holographic assistant',
  'Janela holográfica da Capivara Capi': 'Capi holographic assistant window',
  'Minimizar janela da Capi': 'Minimize Capi window',
  'Minimizar janela': 'Minimize window',
  'Ant': 'Prev',
  'Próximo': 'Next',
  'Base': 'Base',
  'Reiniciar': 'Reset',

  // BaseHubScene & SceneManager
  'Missão 5 concluída com segurança! Todas as 5 missões científicas em Arcadia Planitia foram finalizadas!':
    'Mission 5 safely completed! All 5 science missions in Arcadia Planitia are finished!',
  'Clique em "Central de Comunicação (Cena 6)" para enviar o Relatório Geral da Expedição aos cientistas da Terra!':
    'Tap "Earth Comms Center (Scene 6)" to send the General Expedition Report to scientists on Earth!',
  'ALERTA AMBIENTAL, comandante! Detectamos uma tempestade de poeira e atividade solar em Arcadia Planitia!':
    'ENVIRONMENTAL ALERT, Commander! A dust storm and solar activity are heading for Arcadia Planitia!',
  'Clique em "Iniciar Missão 5: Tempestades ▶" ou abra o Mapa de Arcadia (Setor Sul) para proteger a base!':
    'Tap "Start Mission 5: Storms ▶" or open the Arcadia Map (South Sector) to protect the base!',
  'Fantástico, comandante! Temos energia solar, saúde monitorada e reserva de água potável em 100%!':
    'Fantastic, Commander! We have solar power, crew health online, and 100% clean drinking water!',
  'A Missão 4 (A Primeira Estufa de Marte) já está desbloqueada! Clique no botão verde ou abra o Mapa de Arcadia (Setor Leste)!':
    'Mission 4 (The First Mars Greenhouse) is now unlocked! Tap the green button or open the Arcadia Map (East Sector)!',
  'Incrível, comandante! Energia solar ativa e rotina de saúde em dia no Sol atual!':
    'Awesome, Commander! Solar power is online and today’s health routine is complete!',
  'Clique em "Iniciar Missão 3: Gelo ▶" ou abra o Mapa de Arcadia (Setor Norte) para investigar gelo subterrâneo!':
    'Tap "Start Mission 3: Ice ▶" or open the Arcadia Map (North Sector) to search for underground ice!',
  'Nosso sistema solar está funcionando perfeitamente! Agora precisamos cuidar da sua saúde no habitat.':
    'Our solar power system is working great! Now we need to take care of your health inside the habitat.',
  'Clique no Habitat Principal ou em "Iniciar Missão 2: Saúde ▶" para começar a rotina de treino, comida e sono!':
    'Tap the Main Habitat or "Start Mission 2: Health ▶" to begin exercise, nutrition, and sleep routines!',
  'Nossos painéis solares estão instalados na área leste! Continue os testes e o registro no Diário.':
    'Our solar panels are installed on the east plain! Finish testing and record it in your Logbook.',
  'Clique na Área Solar ou em "Abrir Painel da Missão 1" para concluir e liberar a Missão 2!':
    'Tap the Solar Area or "Open Mission 1 Panel" to wrap up and unlock Mission 2!',
  'Bem-vindo à nossa Base em Arcadia Planitia, comandante! Tudo está pronto para a Missão 1.':
    'Welcome to Arcadia Planitia Base, Commander! Everything is ready for Mission 1.',
  'Nosso objetivo será instalar os painéis solares calculando a posição do Sol com o sistema Mars24 da NASA.':
    'Our goal is to install the solar arrays by calculating the Sun’s position with NASA’s Mars24 model.',
  'Clique em "Iniciar Missão 1: Energia Solar" ou direto na Área Solar marcada no terreno!':
    'Tap "Start Mission 1: Solar Power" or click straight on the Solar Area on the ground!',
  'Complete as missões anteriores na ordem para desbloquear esta etapa.':
    'Complete the earlier missions in order to unlock this stage.',
  'Todos os 4 Turnos deste Sol acabaram! Clique em "🌙 Dormir" para processar o balanço noturno e avançar para o próximo Sol.':
    'All 4 Turns for this Sol are used up! Tap "🌙 Sleep" to process the night report and advance to the next Sol.',
  'Saúde & Treino (-1 Turno) ▶': 'Health & Training (-1 Turn) ▶',
  'Saúde OK ✓': 'Health OK ✓',
  'Missão 2: Saúde ▶': 'Mission 2: Health ▶',
  'Requer Painel Solar': 'Requires Solar Array',
  'ROVER EXPLORADOR': 'EXPLORATION ROVER',
  '🗺️ Mapa de Arcadia ▶': '🗺️ Arcadia Map ▶',
  'ÁREA SOLAR (MISSÃO 1)': 'SOLAR ARRAY (MISSION 1)',
  'Limpar poeira (-1 Turno) ▶': 'Clean dust (-1 Turn) ▶',
  'Clique para gerenciar': 'Tap to manage',
  'Clique para instalar ▶': 'Tap to install ▶',
  '1. Solar': '1. Solar',
  '2. Saúde': '2. Health',
  '3. Gelo/Água': '3. Ice/Water',
  '4. Estufa': '4. Greenhouse',
  '5. Abrigo': '5. Shelter',
  'Central de Comunicação (Cena 6) ▶': 'Earth Comms Center (Scene 6) ▶',
  'Futuro em Marte (Cena 7) ▶': 'Future on Mars (Scene 7) ▶',
  'Rever Missão 5: Tempestades ▶': 'Revisit Mission 5: Storms ▶',
  'Iniciar Missão 5: Tempestades em Marte ▶': 'Start Mission 5: Mars Storms ▶',
  'Rever Missão 4: Estufa ▶': 'Revisit Mission 4: Greenhouse ▶',
  'Iniciar Missão 4: A Primeira Estufa ▶': 'Start Mission 4: First Greenhouse ▶',
  'Rever Missão 3: Gelo ▶': 'Revisit Mission 3: Ice ▶',
  'Iniciar Missão 3: O Mistério do Gelo ▶': 'Start Mission 3: Ice Mystery ▶',
  'Rever Missão 2: Saúde ▶': 'Revisit Mission 2: Health ▶',
  'Iniciar Missão 2: Cuidando do Astronauta ▶': 'Start Mission 2: Astronaut Care ▶',
  'Painel da Missão 1 ▶': 'Mission 1 Panel ▶',
  'Iniciar Missão 1: Energia Solar ▶': 'Start Mission 1: Solar Power ▶',
  'Mapa de Arcadia': 'Arcadia Map',
  'Diário': 'Logbook',
  'Dormir': 'Sleep',
  'CARTUCHOS DA EXPEDIÇÃO': 'MISSION CARTRIDGES',
  'DESBLOQUEADA! Clique para iniciar ▶': 'UNLOCKED! Tap to start ▶',
  'DISPONÍVEL': 'AVAILABLE',
  '✓ CONCLUÍDA': '✓ COMPLETED',
  'Tempestade de Poeira • Limpeza Remota • Abrigo Blindado contra Radiação Solar (H2O + Regolito)':
    'Dust Storm Protocol • Remote Panel Cleaning • Shielded Radiation Shelter (H2O + Regolith)',
  'Hidroponia & Aeroponia • Controle LED e Clima • Ciclo Bioregenerativo (Comida + O2 + Água)':
    'Hydroponics & Aeroponics • LED & Climate Control • Bioregenerative Loop (Food + O2 + Water)',
  'HiRISE + Radar SHARAD • Perfuração Exploratória • Filtragem e Potabilidade':
    'HiRISE + SHARAD Radar • Core Drilling • Filtration & Potability Lab',
  'Estação de Treino • Refeitório Equilibrado • Higiene Espacial • Cena Especial da Capi':
    'Gym Station • Balanced Galley • Space Hygiene • Capi Special Sleep Report',

  // Mission Registry
  'Missão 1 — Energia para Explorar Marte': 'Mission 1 — Power to Explore Mars',
  'Sistema Fotovoltaico em Arcadia Planitia': 'Photovoltaic Array at Arcadia Planitia',
  'Instalar o sistema de painéis solares e compreender a relação entre posição aparente do Sol (Mars24), inclinação, poeira e produção de energia.':
    'Install the solar panel array and learn how the Sun’s position (Mars24), tilt angle, and dust affect power generation.',
  'NASA GISS — Mars24 Algorithm & Photovoltaic Arrays for Martian Surface Power':
    'NASA GISS — Mars24 Algorithm & Photovoltaic Arrays for Martian Surface Power',
  'Desafio 1.1: Escolhendo o local de instalação livre de sombras e poeira':
    'Challenge 1.1: Picking a shadow-free, dust-friendly solar site',
  'Desafio 1.2: Capi calcula elevação e azimute solar (equação Mars24)':
    'Challenge 1.2: Capi computes solar elevation & azimuth (Mars24 equation)',
  'Desafio 1.3: Testando produção de energia, baterias e alerta de poeira':
    'Challenge 1.3: Testing power output, batteries, and dust scrub alerts',
  'Missão 2 — Cuidando do Astronauta': 'Mission 2 — Caring for the Astronaut',
  'Saúde, Exercícios, Nutrição, Higiene e Sono': 'Health, Exercise, Nutrition, Hygiene & Sleep',
  'Investigar como o ambiente espacial influencia o organismo humano e aplicar rotinas simuladas de cuidado e descanso.':
    'Explore how Mars’s lower gravity affects the human body and practice daily crew care and sleep routines.',
  'NASA Spaceflight Standard Measures (Actigrafia e Questionários)':
    'NASA Spaceflight Standard Measures (Actigraphy & Questionnaires)',
  'Desafio 2.1: Exercícios físicos contra a baixa gravidade':
    'Challenge 2.1: Gravitational resistance workouts against 0.38g',
  'Desafio 2.2 e 2.3: Refeição equilibrada, hidratação e higiene':
    'Challenges 2.2 & 2.3: Balanced nutrition, hydration, and hygiene sterilization',
  'Desafio 2.4: Cena Especial da Capivara Durante o Sono (7 etapas)':
    'Challenge 2.4: Capi Special Nighttime Sleep Report (7 steps)',
  'Missão 3 — O Mistério do Gelo de Marte': 'Mission 3 — The Mystery of Mars Ice',
  'Radar SHARAD, Perfuração e Potabilidade': 'SHARAD Radar, Core Drilling & Water Potability',
  'Analisar camadas de radar orbital, estudos prévios e realizar pequenas perfurações exploratórias em busca de gelo subterrâneo.':
    'Analyze orbital radar layers and NASA surveys, then drill shallow exploratory cores in search of buried ice.',
  'NASA First Ice Cores from Mars & MRO SHARAD':
    'NASA First Ice Cores from Mars & MRO SHARAD',
  'Desafio 3.1 e 3.2: Camadas HiRISE, Radar SHARAD e Estudos Prévios':
    'Challenges 3.1 & 3.2: HiRISE Imagery, SHARAD Radar & Prior NASA Studies',
  'Desafio 3.3 e 3.4: Perfuração exploratória e coleta de ice core':
    'Challenges 3.3 & 3.4: Thermal Core Drilling & Cryogenic Ice Core Storage',
  'Desafio 3.5 e 3.6: Filtragem, tratamento e painel de potabilidade':
    'Challenges 3.5 & 3.6: Melt Filtration, UV Treatment & Potability Testing',
  'Missão 4 — A Primeira Estufa de Marte': 'Mission 4 — The First Mars Greenhouse',
  'Agricultura Espacial e Sistema Bioregenerativo': 'Space Agriculture & Bioregenerative Systems',
  'Construir uma estufa controlada com hidroponia e aeroponia para pesquisar suporte à vida sustentável.':
    'Build a controlled greenhouse with hydroponics and aeroponics for sustainable life support.',
  'NASA Sistemas Bioregenerativos de Suporte à Vida (ECLSS)':
    'NASA Bioregenerative Life Support Systems (ECLSS)',
  'Desafio 4.1 e 4.2: Construir a estufa com LED e testar hidroponia vs. aeroponia':
    'Challenges 4.1 & 4.2: Build LED Greenhouse & Compare Hydroponics vs. Aeroponics',
  'Desafio 4.3 e 4.4: Escolher os 4 grupos de plantas e controlar luz, água e clima':
    'Challenges 4.3 & 4.4: Plant 4 Crop Groups & Control Light, Water, and Climate',
  'Desafio 4.5: Fechar o Sistema Bioregenerativo (ECLSS: comida, O2 e água reciclada)':
    'Challenge 4.5: Close the Bioregenerative ECLSS Loop (Food, O2 & Recycled Water)',
  'Missão 5 — Alerta! Tempestades em Marte': 'Mission 5 — Alert! Storms on Mars',
  'Poeira Marciana e Eventos de Radiação Solar': 'Martian Dust Storms & Solar Radiation Events',
  'Diferenciar tempestades de poeira de eventos de radiação solar e aplicar protocolos de proteção do habitat.':
    'Tell dust storms apart from invisible solar radiation events and execute habitat protection protocols.',
  'NASA Dust in the Wind & Real Martians': 'NASA Dust in the Wind & Real Martians',
  'Desafio 5.1 e 5.2: Protocolo contra tempestade de poeira e limpeza remota dos painéis':
    'Challenges 5.1 & 5.2: Dust Storm Sealing & Post-Storm Solar Cleaning',
  'Desafio 5.3: Alerta de radiação solar invisível e entrada no Abrigo Blindado (H2O + regolito)':
    'Challenge 5.3: Invisible Solar Radiation Alert & Shielded Shelter (H2O + Regolith)',
  'Desafio 5.4: Inspeção pós-tempestade da base, Diário de Bordo e Relatório de Segurança':
    'Challenge 5.4: Post-Storm Inspection, Logbook Entry & Safety Report',

  // Mission 1
  'Verão no Norte': 'Northern Summer',
  'Sol bem alto no céu de Arcadia Planitia (δ = +25,2°).':
    'Sun high in the Arcadia Planitia sky (δ = +25.2°).',
  'Equinócio (Primavera/Outono)': 'Equinox (Spring/Fall)',
  'Dia e noite com duração equilibrada em Marte (δ = 0,0°).':
    'Balanced Martian day and night length (δ = 0.0°).',
  'Inverno no Norte': 'Northern Winter',
  'Sol mais baixo próximo ao horizonte sul (δ = -25,2°).':
    'Low Sun near the southern horizon (δ = -25.2°).',
  'Manhã Marciana': 'Martian Morning',
  'Meio-dia Solar': 'Solar Noon',
  'Tarde Marciana': 'Martian Afternoon',
  'Norte (N)': 'North (N)',
  'Leste (L)': 'East (E)',
  'Sul (S)': 'South (S)',
  'Oeste (O)': 'West (W)',
  'Antes de montar os painéis, observe o terreno de Arcadia Planitia! Escolha um ponto com boa luz solar.':
    'Before assembling the panels, scan the Arcadia Planitia terrain! Pick a spot with strong sunlight.',
  'Evite sombras de rochas e terrenos inclinados com pedregulhos para facilitar a limpeza da poeira.':
    'Avoid rocky cliff shadows and steep boulder slopes so dusting the panels stays easy.',
  'Vamos calcular a posição do Sol com o sistema Mars24 da NASA! Escolha a estação e o horário solar.':
    "Let's calculate the Sun's position with NASA's Mars24 model! Pick a season and solar time.",
  'Ajuste a Orientação e a Inclinação (0° a 60°) até maximizar os Watts gerados pelo painel!':
    'Adjust Orientation (Azimuth) and Panel Tilt (0° to 60°) to maximize solar Watts!',
  'Nosso sistema começou a produzir energia! Mas Marte tem entardecer, noites e poeira.':
    'Our system is generating electricity! But Mars brings sunset, chilly nights, and windblown dust.',
  'Teste a simulação de poeira, limpe o painel, ative a economia e registre tudo no Diário antes de dormir!':
    'Run the dust test, scrub the panel clean, enable Eco Mode, and log your findings before sleeping!',
  'MISSÃO 1 — ENERGIA PARA EXPLORAR MARTE': 'MISSION 1 — POWER TO EXPLORE MARS',
  'Arcadia Planitia • Sistema Fotovoltaico & NASA GISS Mars24':
    'Arcadia Planitia • Photovoltaic Array & NASA GISS Mars24',
  '1.1 Local': '1.1 Site',
  '1.2 Mars24': '1.2 Mars24',
  '1.3 Teste': '1.3 Test',
  'Conclua os objetivos do desafio atual antes de avançar para esta etapa!':
    'Complete the current challenge goals before advancing to this step!',
  'Ponto A — Perto da Elevação Rochosa': 'Site A — Near Rocky Ridge',
  'Sombra parcial durante parte do dia': 'Partial shadow part of the day',
  '14° (Sombra de rocha)': '14° (Rock shadow)',
  'Paredão rochoso projeta sombra longa': 'Cliff wall casts a long shadow',
  'Baixa (sombra da rocha)': 'Low (cliff shadow)',
  'Média': 'Medium',
  'Difícil acesso': 'Hard access',
  'Cuidado, comandante! A elevação rochosa projeta sombra no Ponto A e reduz a luz solar nos painéis!':
    'Watch out, Commander! The rocky ridge casts shadows over Site A and cuts solar power!',
  'Ponto B — Terreno Inclinado com Pedregulhos': 'Site B — Steep Boulder Slope',
  'Risco para fixar os suportes metálicos': 'Risky footing for support mounts',
  '27° (Pedregulhos)': '27° (Boulders)',
  'Declive instável com rochas soltas': 'Unstable slope with loose rocks',
  'Irregular': 'Uneven',
  'Baixa (muitas pedras)': 'Low (rocky terrain)',
  'Risco de tropeços': 'Tripping hazard',
  'Hmm... o Ponto B é muito inclinado e cheio de pedregulhos! Fica difícil fixar os suportes com segurança.':
    'Hmm... Site B is way too steep and rocky! Anchoring the panel mounts safely will be tough.',
  'Ponto C — Planície Aberta e Nivelada': 'Site C — Flat Open Plain',
  'Sol pleno e acesso fácil para limpeza': 'Full sunlight & easy dust access',
  '1.5° (Plano e firme)': '1.5° (Flat & firm)',
  'Horizonte livre, zero sombras': 'Open horizon, zero shadows',
  'Excelente (sem sombras)': 'Excellent (no shadows)',
  'Alta (solo plano)': 'High (flat ground)',
  'Fácil limpeza de poeira': 'Easy dust cleaning',
  'Excelente escolha científica! O Ponto C tem sol direto, solo firme e facilita limpar a poeira sem atrapalhar o rover!':
    'Awesome scientific choice! Site C gets direct Sun on level ground and leaves plenty of room for cleaning around the rover!',
  'DESAFIO 1.1 — SCANNER ORBITAL DE TERRENO': 'CHALLENGE 1.1 — ORBITAL TERRAIN SCANNER',
  'PONTOS ESCANEADOS:': 'SCANNED SITES:',
  'Arraste a lente do scanner com o mouse ou dedo sobre os':
    'Drag the scanner lens with your mouse or finger across',
  'Pontos A, B e C': 'Sites A, B, and C',
  'em Arcadia Planitia para revelar sombras de relevo, inclinação e incidência solar antes de escolher.':
    'in Arcadia Planitia to reveal terrain shadows, slope steepness, and sunlight before choosing.',
  'Mapa tátil do Scanner Orbital de Arcadia Planitia':
    'Interactive Arcadia Planitia Orbital Scanner map',
  'SOL • ARCADIA': 'SUN • ARCADIA',
  'PONTO': 'SITE',
  'Inclinação:': 'Slope:',
  'Sol:': 'Sun:',
  '🛰️ Arraste o círculo azul sobre os pontos A, B e C para ler o relevo e a luz solar...':
    '🛰️ Drag the blue scanner circle over Sites A, B, and C to read terrain slope and sunlight...',
  'ESCANEADO ✓': 'SCANNED ✓',
  'Passe o scanner orbital neste ponto...': 'Move the orbital scanner over this site...',
  '• Relevo:': '• Terrain:',
  '• Inclinação:': '• Slope:',
  '• Incidência solar:': '• Sunlight:',
  'Agora selecione o Ponto C (planície firme sem sombras) para confirmar a instalação.':
    'Now select Site C (flat firm plain with zero shadows) to confirm installation.',
  'Selecione o Ponto C para avançar': 'Select Site C to continue',
  'Confirmar Ponto C e Calcular Sol ▶': 'Confirm Site C & Calculate Sun ▶',
  '“Capi, escolhemos o Ponto C, mas qual é a inclinação correta dos painéis? Você pode calcular usando o sistema Mars24 da NASA?”':
    '“Capi, we picked Site C, but what tilt angle should our panels have? Can you compute it using NASA’s Mars24 model?”',
  'PAINEL HOLOGRÁFICO — NASA GISS MARS24': 'HOLOGRAPHIC CONSOLE — NASA GISS MARS24',
  '1. ESTAÇÃO EM MARTE': '1. MARTIAN SEASON',
  '2. HORÁRIO SOLAR': '2. SOLAR TIME',
  'Elevação Solar (h)': 'Solar Elevation (h)',
  'Ângulo Zenital (Z)': 'Zenith Angle (Z)',
  'Alvo Recomendado': 'Recommended Target',
  '📐 Ver Fórmula NASA Mars24': '📐 View NASA Mars24 Formula',
  'ângulo zenital (da vertical) |': 'zenith angle (from vertical) |',
  'elevação do Sol acima do horizonte.': 'Sun elevation above the horizon.',
  'declinação (': 'declination (',
  'latitude (39°N) |': 'latitude (39°N) |',
  'ângulo horário (': 'hour angle (',
  '• Não existe um único ângulo fixo em Marte: a inclinação ideal muda conforme a estação e a posição do Sol!':
    '• There is no single fixed angle on Mars: the best panel tilt shifts with the season and time of day!',
  'GERAÇÃO': 'OUTPUT',
  'ORIENTAÇÃO (AZIMUTE)': 'ORIENTATION (AZIMUTH)',
  'INCLINAÇÃO DO PAINEL': 'PANEL TILT ANGLE',
  'CAPACITOR DE FEIXE SOLAR': 'SOLAR BEAM CAPACITOR',
  'Olhe o painel! O Sol baixou no entardecer e o vento trouxe poeira marciana. Esfregue a camada laranja sobre o painel até limpar 90%+!':
    'Look at the array! Sunset is approaching and wind carried orange Martian dust onto the cells. Scrub the dust until it reaches 90%+ clean!',
  'Muito bem! Ao esfregar toda a poeira, as células fotovoltaicas voltaram a captar muito mais luz solar!':
    'Nice work! Once you scrubbed off the dust, the solar cells jumped right back to peak sunlight capture!',
  'Modo Economia ativado! Reduzimos o consumo do habitat para proteger as baterias durante a noite marciana.':
    'Eco Mode enabled! We lowered habitat power draw to protect the batteries through the freezing Martian night.',
  'DESAFIO 1.3 — PAINEL DE CONTROLE SOLAR, BATERIA E POEIRA':
    'CHALLENGE 1.3 — SOLAR ARRAY, BATTERY & DUST CONTROL',
  '☀ Dia em Arcadia Planitia': '☀ Daytime at Arcadia Planitia',
  '🌇 Entardecer Marciano': '🌇 Martian Dusk',
  'Limpeza do Painel:': 'Panel Cleanliness:',
  '(meta: 90%+)': '(goal: 90%+)',
  '🧹 ESFREGUE O PAINEL PARA LIMPAR': '🧹 SCRUB THE PANEL TO CLEAN',
  '✨ PAINEL LIMPO COM SUCESSO': '✨ PANEL CLEANED SUCCESSFULLY',
  '✨ PAINEL SOLAR LIMPO': '✨ SOLAR PANEL CLEAN',
  'Energia Gerada': 'Power Output',
  'Carga da Bateria': 'Battery Charge',
  'Consumo do Habitat': 'Habitat Draw',
  'Saldo energético:': 'Net power balance:',
  'Simular Entardecer + Poeira': 'Simulate Dusk + Dust Storm',
  'Primeiro clique em "Simular Entardecer + Poeira" ao lado para cobrir o painel com poeira marciana e poder limpá-lo!':
    'First tap "Simulate Dusk + Dust Storm" beside this panel to coat it with Martian dust!',
  '✓ Poeira Limpa (90%+)': '✓ Dust Cleared (90%+)',
  '🧹 Aguardando Simulação de Poeira': '🧹 Waiting for Dust Simulation',
  '✓ Modo Economia Ativo (180 W)': '✓ Eco Mode Active (180 W)',
  '🔋 Ativar Economia de Energia': '🔋 Enable Power Eco Mode',
  'Poeira atual na base:': 'Current base panel dust:',
  'Painel solar limpo e calibrado! Conclua a manutenção para zerar a poeira acumulada na base e recuperar +15% de Energia.':
    'Solar panel scrubbed and calibrated! Finish maintenance to reset dust to 0% and recover +15% Power.',
  'Esfregue toda a poeira sobre o painel acima até atingir 90%+ para liberar o registro de manutenção.':
    'Scrub all orange dust off the solar panel above to 90%+ to unlock the maintenance log.',
  '☀️ Concluir Manutenção Solar (-1 Turno • -15% Stamina • +15% Energia) ▶':
    '☀️ Complete Solar Maintenance (-1 Turn • -15% Stamina • +15% Power) ▶',
  'FECHAMENTO DA MISSÃO 1 — REGISTRO E TRANSMISSÃO':
    'MISSION 1 WRAP-UP — LOGBOOK & EARTH LINK',
  '✓ MISSÃO 2 DESBLOQUEADA!': '✓ MISSION 2 UNLOCKED!',
  'Excelente trabalho! Agora faça o registro científico obrigatório no Diário de Bordo e vá dormir para que a Capi envie os dados à Terra e libere a Missão 2.':
    'Great job! Now save the required science entry in your Logbook and go to sleep so Capi can send telemetry to Earth and unlock Mission 2.',
  'Para liberar o encerramento, teste a simulação de poeira + limpeza do painel e ative o modo de economia de energia.':
    'To unlock completion, run the dust + scrubbing test and switch on Eco Mode.',
  '✓ 1. Diário Registrado (Abrir)': '✓ 1. Logbook Saved (Open)',
  '1. Registrar Missão 1 no Diário': '1. Log Mission 1 in Logbook',
  '✓ 2. Sono Concluído (Reabrir)': '✓ 2. Sleep Complete (Reopen)',
  '2. Dormir e Desbloquear Missão 2': '2. Sleep & Unlock Mission 2',
  'Voltar à Base (Missão 2 Pronta) ▶': 'Back to Base (Mission 2 Ready) ▶',
  'Área interativa para esfregar e limpar a poeira marciana do painel solar':
    'Interactive canvas to scrub Martian dust off the solar panel',

  // Mission 2
  'Comandante, nosso sistema de energia solar está funcionando! Agora precisamos cuidar da sua saúde.':
    'Commander, our solar array is online! Now it’s time to take care of your crew health.',
  'A gravidade menor de Marte enfraquece músculos e ossos. Escolha os 4 exercícios na estação de treino!':
    "Mars's weaker gravity thins muscles and bones. Complete all 4 workouts at the gym station!",
  'Hora de preparar uma refeição equilibrada! Combine proteínas, vegetais e carboidratos.':
    'Time to build a balanced space meal! Combine proteins, veggies, and healthy carbs.',
  'Não esqueça da água! Escolha a quantidade ideal sem desperdícios, pois ela é preciosa em Marte.':
    'Don’t forget water! Dispense the ideal amount with zero waste—water is precious on Mars.',
  'Hora da higiene! Escove os dentes, higienize as mãos e limpe seus equipamentos.':
    'Hygiene time! Brush your teeth, sanitize your hands, and wipe Martian dust off your gear.',
  'A higiene reduz riscos de contaminação e mantém todo o habitat saudável!':
    'Good hygiene cuts contamination risks and keeps the whole closed habitat healthy!',
  'Nosso dia de exploração terminou! Confira suas tarefas e prepare seu descanso na cabine.':
    'Our exploration Sol is winding down! Review your checklist and head into the sleep cabin.',
  'Quando você dormir, eu vou abrir o Painel de Saúde e organizar tudo no servidor da nave!':
    "Once you sleep, I'll open the Health Telemetry Console and back up every record on the ship server!",
  'MISSÃO 2 — CUIDANDO DO ASTRONAUTA': 'MISSION 2 — CARING FOR THE ASTRONAUT',
  'Rotina no Habitat • Exercícios, Nutrição, Higiene e Sono':
    'Habitat Routine • Exercise, Nutrition, Hygiene & Sleep',
  '2.1 Treino': '2.1 Workout',
  '2.2 Nutrição': '2.2 Nutrition',
  '2.3 Higiene': '2.3 Hygiene',
  '2.4 Sono': '2.4 Sleep',
  'Caminhada na Esteira': 'Treadmill Walk',
  'Estimula ossos e coração com cintos de tração': 'Loads bones and heart using resistance harnesses',
  'Ótima caminhada! Os cintos na esteira simulam o peso da gravidade para proteger seus ossos.':
    'Awesome walk! The treadmill bungees mimic Earth weight to protect your bones in 0.38g.',
  'Exercícios de Resistência': 'Resistance Workouts',
  'Fortalece braços e pernas contra a baixa gravidade': 'Strengthens arms and legs against low gravity',
  'Força total! Os elásticos de resistência mantêm os músculos fortes mesmo em Marte (~0,38g).':
    'Full power! Resistance bands keep astronaut muscles strong even in Martian gravity (~0.38g).',
  'Alongamento': 'Full-Body Stretching',
  'Alivia a coluna e melhora a flexibilidade': 'Relieves spine tension and boosts flexibility',
  'Muito bom! Alongar depois de usar o traje espacial ajuda a coluna e previne dores.':
    'Very good! Stretching after an EVA spacesuit walk protects your back and joints.',
  'Treinamento de Equilíbrio': 'Balance Training',
  'Ajusta a coordenação motora à gravidade marciana': 'Re-tunes motor coordination to Martian 0.38g',
  'Equilíbrio nota 10! Seu cérebro aprende a caminhar com segurança no solo irregular de Marte.':
    '10/10 balance! Your inner ear and brain learn to walk steadily across rocky Martian terrain.',
  'Quase lá! Em baixa gravidade marciana (~0,38g), sincronize o movimento exatamente dentro da zona verde.':
    'So close! In low Martian gravity (~0.38g), lock the marker right inside the green zone.',
  'DESAFIO 2.1 — EXERCÍCIOS FÍSICOS COM TRAÇÃO GRAVITACIONAL':
    'CHALLENGE 2.1 — GRAVITY-HARNESS WORKOUTS',
  'CONDICIONAMENTO:': 'FITNESS:',
  '/4 treinos': '/4 workouts',
  'bpm (simulado)': 'bpm (simulated)',
  'ATIVO': 'ACTIVE',
  'Ir para o Refeitório Espacial (Desafio 2.2) ▶': 'Go to Space Galley (Challenge 2.2) ▶',
  'Impulso travado na faixa ideal!': 'Thrust locked inside the green zone!',
  'Fora da zona verde! Tente de novo!': 'Missed the green zone! Try again!',
  'Toque quando o marcador cruzar a zona verde': 'Tap when the marker crosses the green target zone',
  'ALVO': 'TARGET',
  'TREINO CONCLUÍDO! SELECIONE O PRÓXIMO': 'WORKOUT DONE! SELECT THE NEXT ONE',
  '⚡ TRAVAR IMPULSO NA ZONA VERDE!': '⚡ LOCK THRUST IN GREEN ZONE!',
  'Tofu Proteico': 'Protein Tofu',
  'Leve': 'Light',
  'Grão-de-bico Espacial': 'Space Chickpeas',
  'Moderado': 'Balanced',
  'Peixe Selado NASA': 'NASA Sealed Fish',
  'Alta Energia': 'High Energy',
  'Salada de Folhas Verdes': 'Green Leaf Salad',
  'Ultra Leve': 'Ultra Light',
  'Tomates-cereja': 'Cherry Tomatoes',
  'Brócolis da Estufa': 'Greenhouse Broccoli',
  'Nutritivo': 'Nutrient-Rich',
  'Tortilha Integral': 'Whole-Wheat Tortilla',
  'Quinoa Espacial': 'Space Quinoa',
  'Arroz Integral': 'Brown Rice',
  'Atenção, comandante! Você gastou muita energia nos exercícios e essa refeição tem poucas calorias. O astronauta vai ficar sem força — troque por alimentos mais energéticos!':
    'Heads up, Commander! You burned lots of energy exercising and this meal is too low in calories. Swap for higher-energy items!',
  'Combinação perfeita! Você repôs exatamente a energia gasta nos treinos com proteínas, vitaminas e carboidratos na medida certa!':
    'Perfect combo! You refueled the exact workout calories with balanced protein, vitamins, and carbs!',
  'Essa refeição ultrapassou o gasto energético do dia! Muita energia acumulada pode causar desconforto antes da próxima atividade. Tente equilibrar um item mais leve.':
    'This meal goes over today’s calorie burn! Swap one item for a lighter choice to stay comfortable.',
  'Ops! Solte esse alimento no compartimento correspondente da bandeja (ou dentro da área da bandeja).':
    'Oops! Drop that food onto its matching tray compartment (or anywhere inside the meal tray).',
  'Cantil já dosado! Clique em "Esvaziar" caso queira ajustar o volume novamente.':
    'Canteen already filled! Tap "Empty" if you want to dispense water again.',
  'Cantil esvaziado com reciclagem fechada! Segure o dispensador e solte entre 300 ml e 400 ml.':
    'Canteen emptied via closed-loop recycler! Hold the dispenser and release between 300 ml and 400 ml.',
  'DESAFIO 2.2 — ALIMENTAÇÃO EQUILIBRADA (KCAL) & HIDRATAÇÃO':
    'CHALLENGE 2.2 — BALANCED MEAL (KCAL) & HYDRATION',
  'Arraste (ou toque) nos alimentos para repor a energia gasta no Desafio 2.1':
    'Drag (or tap) foods to replenish the energy burned in Challenge 2.1',
  'Gasto Energético da Atividade (': 'Workout Energy Burn (',
  '/4 treinos):': '/4 workouts):',
  'Meta de Reposição Ideal da Refeição:': 'Ideal Meal Fuel Target:',
  'BANDEJA DO ASTRONAUTA (SOLTE AQUI)': 'ASTRONAUT MEAL TRAY (DROP HERE)',
  'Total:': 'Total:',
  'PROTEÍNA': 'PROTEIN',
  'Arraste 1 proteína': 'Drag 1 protein',
  'VEGETAL': 'VEGGIE',
  'Arraste 1 vegetal': 'Drag 1 veggie',
  'CARBOIDRATO': 'CARB',
  'Arraste 1 carboidrato': 'Drag 1 carb',
  'Reposição Equilibrada!': 'Balanced Fuel!',
  'Energia Insuficiente (< 650 kcal)': 'Too Few Calories (< 650 kcal)',
  'Excesso Calórico (> 820 kcal)': 'Too Many Calories (> 820 kcal)',
  'IDEAL': 'IDEAL',
  '1. PROTEÍNAS (MÚSCULOS)': '1. PROTEINS (MUSCLE)',
  '2. VEGETAIS (VITAMINAS E FIBRAS)': '2. VEGGIES (VITAMINS & FIBER)',
  '3. CARBOIDRATOS (ENERGIA)': '3. CARBS (ENERGY)',
  '4. DISPENSADOR DE ÁGUA (META: 300 – 400 ML)':
    '4. WATER DISPENSER (TARGET: 300 – 400 ML)',
  'ENCHENDO CANTIL... SOLTE NA FAIXA VERDE!': 'FILLING CANTEEN... RELEASE IN GREEN ZONE!',
  '💧 SEGURAR PARA ENCHER CANTIL': '💧 HOLD TO FILL CANTEEN',
  'Esvaziar': 'Empty',
  '💧 Salvar Hidratação (0 Rações) & Ir para Higiene (2.3) ▶':
    '💧 Save Hydration (0 Rations) & Go to Hygiene (2.3) ▶',
  '0 rações disponíveis — Dose água (300–400 ml) para hidratar':
    '0 rations in stock — Dispense 300–400 ml water to hydrate',
  '✅ Hidratar & Concluir Turno Agora (-1 Turno • +8% Saúde) ▶':
    '✅ Hydrate & Finish Turn Now (-1 Turn • +8% Health) ▶',
  'Estoque zerado (0 rações) — Use a Estufa (Estação 4) ou Hidrate acima':
    'Zero rations left — Harvest the Greenhouse (Station 4) or Hydrate above',
  'Monte os 3 grupos alimentares (650–820 kcal)': 'Build all 3 food groups (650–820 kcal)',
  'Dose a água entre 300 ml e 400 ml para confirmar':
    'Dispense between 300 ml and 400 ml of water to confirm',
  '✅ Concluir Turno no Habitat Agora (Sem Higiene • -1 Turno • +22% Saúde • +35% Stamina) ▶':
    '✅ Finish Habitat Turn Now (Skip Hygiene • -1 Turn • +22% Health • +35% Stamina) ▶',
  'Escovar os Dentes': 'Brush Teeth',
  'Com pasta espacial e reciclagem de água': 'With swallow-safe toothpaste & water recycling',
  'Dentes limpos! Na nave usamos pouca água e nenhum resíduo é desperdiçado.':
    'Sparkling teeth! On Mars we use minimal water and recycle every single drop.',
  'Higienizar Mãos e Corpo': 'Sanitize Hands & Body',
  'Reduz microrganismos no ambiente fechado': 'Cuts microbes inside the closed habitat',
  'Mãos higienizadas! Em um habitat fechado, isso evita que germes se espalhem pela equipe.':
    'Hands sanitized! In a closed habitat, this stops germs from spreading among the crew.',
  'Bancada de sensores e luvas esterilizadas! Remover a poeira fina de Marte protege nossos equipamentos e evita inalação.':
    'Gloves and sensor bench sterilized! Clearing toxic Martian dust protects electronics and lungs.',
  'DESAFIO 2.3 — HIGIENE PESSOAL & ESTERILIZAÇÃO TÁTIL':
    'CHALLENGE 2.3 — HYGIENE & TACTILE STERILIZATION',
  'CONCLUÍDO:': 'COMPLETED:',
  'ESTERILIZADO': 'STERILIZED',
  'Bancada de sensores e luvas completamente descontaminadas!':
    'Gloves and sensor bench 100% decontaminated!',
  'Esfregue com o mouse ou dedo sobre a imagem acima até atingir 90%+':
    'Scrub over the dust image above with your mouse or finger until 90%+',
  'Esterilizar Equipamentos e Bancadas': 'Sterilize Gear & Workbench',
  'Poeira marciana removida com sucesso': 'Martian dust cleanly removed',
  'Use o módulo de limpeza ao lado (esfregar 90%+)':
    'Use the scrub canvas next to this panel (reach 90%+)',
  '🧼 Concluir Esterilização & Encerrar Turno (-1 Turno) ▶':
    '🧼 Complete Sterilization & End Turn (-1 Turn) ▶',
  'Ir para Cabine de Descanso (Desafio 2.4) ▶': 'Head to Sleep Quarters (Challenge 2.4) ▶',
  'Boa noite, comandante! Agora vou processar as 7 etapas da Cena Especial de Sono no servidor de bordo.':
    'Goodnight, Commander! Now I will run the 7 steps of your Special Sleep Report on the ship server.',
  'AMANHECER EM ARCADIA PLANITIA — NOVO SOL!': 'SUNRISE AT ARCADIA PLANITIA — A NEW SOL!',
  'DESAFIO 2.4 — HORA DE DORMIR!': 'CHALLENGE 2.4 — TIME TO SLEEP!',
  'VERIFICAÇÃO ANTES DE DORMIR': 'PRE-SLEEP CHECKLIST',
  'Alimentação equilibrada e hidratação (350 ml)': 'Balanced nutrition & hydration (350 ml)',
  'Higiene pessoal e limpeza dos equipamentos': 'Personal hygiene & gear decontamination',
  'Ao dormir, a tela escurece e a': 'When you sleep, the lights dim and',
  'processa as 7 etapas do relatório noturno (NASA Spaceflight Standard Measures), avançando o Sol e desbloqueando a Missão 3!':
    'processes all 7 steps of the overnight report (NASA Spaceflight Standard Measures), advancing the Sol and unlocking Mission 3!',
  '✓ Registro da Missão 2 Salvo (Abrir Diário)': '✓ Mission 2 Logged (Open Logbook)',
  'Registrar Missão 2 no Diário de Bordo': 'Log Mission 2 in Science Logbook',
  'Dormir (Iniciar Cena da Capi) 🌙': 'Sleep (Start Capi Night Report) 🌙',
  'Você completou os exercícios físicos, preparou uma refeição equilibrada sem desperdiçar água, cuidou da higiene e concluiu as 7 etapas noturnas da Capi!':
    'You finished your gravitational workouts, ate a balanced meal with zero water waste, stayed clean, and reviewed Capi’s 7-step sleep telemetry!',
  'foi desbloqueada na Base de Arcadia Planitia!': 'has been unlocked at Arcadia Planitia Base!',
  'Voltar à Base': 'Back to Base',
  'Iniciar Missão 3 (Gelo) ▶': 'Start Mission 3 (Ice) ▶',

  // Mission 3
  'Comandante, Arcadia Planitia tem indícios de gelo subterrâneo! Mas não podemos perfurar em qualquer lugar.':
    'Commander, Arcadia Planitia shows signs of buried ice—but we must check orbital data before drilling!',
  'Cruze as 3 camadas (Superfície HiRISE, Radar SHARAD e Estudos Prévios da NASA) antes de escolher o ponto!':
    'Cross-check all 3 data layers (HiRISE Surface, SHARAD Radar & NASA Prior Studies) first!',
  'Estamos no Setor Gama! Use a perfuradora em pequenas profundidades exploratórias para conferir os dados do radar.':
    "We're at Gamma Sector! Drill a shallow exploratory core to verify our orbital radar readings.",
  'Lembre-se: uma pequena perfuração verifica nossas hipóteses. Vamos buscar o testemunho congelado!':
    'Remember: shallow drilling tests our hypothesis. Let’s retrieve that frozen ice core!',
  'Hora de transformar o gelo em água no laboratório: separe o solo, derreta, filtre e faça o tratamento químico.':
    'Time to turn Mars ice into drinking water: separate soil, melt, filter, and chemically treat it.',
  'Depois analise os 5 testes de potabilidade! Água transparente pode esconder sais e percloratos invisíveis.':
    'Then run all 5 potability checks! Crystal-clear water can still hide invisible salts and perchlorates.',
  'Que investigação incrível! Agora temos água potável tratada e dados científicos valiosos de Arcadia Planitia!':
    'What an incredible investigation! Now we have safe drinking water and priceless Arcadia Planitia science!',
  'Registre a descoberta no Diário de Bordo e use a rotina de sono para enviar à Terra e liberar a Missão 4!':
    'Record the discovery in your Logbook and sleep to send data to Earth and unlock Mission 4!',
  'MISSÃO 3 — O MISTÉRIO DO GELO DE MARTE': 'MISSION 3 — THE MYSTERY OF MARS ICE',
  'Arcadia Planitia • Radar SHARAD, Perfuração e Potabilidade':
    'Arcadia Planitia • SHARAD Radar, Core Drilling & Water Lab',
  '3.1/3.2 Radar': '3.1/3.2 Radar',
  '3.3/3.4 Perfurar': '3.3/3.4 Drill',
  '3.5/3.6 Água': '3.5/3.6 Water',
  'Fechamento': 'Wrap-Up',
  'Setor Alfa — Borda de Cratera': 'Alpha Sector — Crater Rim',
  '39,5°N • Declive 24°': '39.5°N • 24° Slope',
  'Moderado (~0,8 m rocha)': 'Moderate (~0.8 m rock)',
  'Rochoso e inclinado (risco para broca)': 'Rocky & steep (drill hazard)',
  'Não perfurado': 'Undrilled',
  'Cuidado! O Setor Alfa tem relevo muito inclinado e pedregulhos na imagem HiRISE. Nossa perfuradora pode tombar ou quebrar a broca!':
    'Careful! Alpha Sector has a steep crater rim and jagged boulders in HiRISE imagery. Our drill rig could tip or snap a bit!',
  'Setor Beta — Planície Sul': 'Beta Sector — Southern Plain',
  '38,8°N • Declive 3°': '38.8°N • 3° Slope',
  'Fraco (~0,4 m seco)': 'Weak (~0.4 m dry soil)',
  'Plano e arenoso': 'Flat & sandy',
  'Já estudado pela NASA (sem depósito espesso)': 'Already surveyed by NASA (thin ice)',
  'Olhe os estudos prévios da NASA: o Setor Beta já foi investigado antes e o radar SHARAD mostra pouco gelo ali. Vamos evitar repetir sem necessidade!':
    'Check NASA’s prior archive: Beta Sector was already surveyed and SHARAD shows weak ice signals there. No need to re-drill!',
  'Setor Gama — Planície Central Arcadia': 'Gamma Sector — Central Arcadia Plain',
  '39,2°N • Declive 1°': '39.2°N • 1° Slope',
  'MUITO FORTE (reflexão a 1,8 m)': 'VERY STRONG (echo at 1.8 m)',
  'Plano e estável (HiRISE seguro)': 'Flat & stable (HiRISE safe)',
  'Área prioritária (First Ice Cores from Mars)': 'Priority zone (First Ice Cores from Mars)',
  'Excelente análise científica! O Setor Gama combina forte reflexão de gelo no radar SHARAD, terreno plano seguro na câmera HiRISE e recomendação no relatório First Ice Cores from Mars!':
    'Brilliant scientific detective work! Gamma Sector pairs a strong SHARAD subsurface ice echo, safe flat HiRISE terrain, and top priority in NASA’s First Ice Cores from Mars report!',
  '-1,8 m (DEPÓSITO DE GELO PURO!)': '-1.8 m (PURE WATER-ICE DEPOSIT!)',
  '-0,8 m (Rocha fragmentada)': '-0.8 m (Fractured rock)',
  '-0,4 m (Regolito seco)': '-0.4 m (Dry regolith)',
  'Varrendo solo marciano...': 'Scanning Martian subsurface...',
  'Camada Superfície (HiRISE): observe o relevo. Evite bordas de crateras íngremes e procure uma planície plana e segura.':
    'HiRISE Surface Layer: check terrain slope. Avoid steep crater edges and find safe level ground.',
  'Radar SHARAD ativado! Arraste a sonda circular azul pelo mapa para detectar onde existe o maior eco de gelo subterrâneo.':
    'SHARAD Radar active! Drag the glowing blue probe across the map to pinpoint the strongest buried ice echo.',
  'Estudos Prévios da NASA (First Ice Cores from Mars): não devemos repetir perfurações já descartadas no sul se há áreas inéditas promissoras!':
    'Prior NASA Studies (First Ice Cores from Mars): skip already-ruled-out southern sites and focus on promising unexplored targets!',
  'Eco SHARAD máximo localizado no Setor Gama (-1,8 m)! Forte assinatura de gelo de água puro abaixo do regolito!':
    'Peak SHARAD radar echo detected at Gamma Sector (-1.8 m)! Strong pure water-ice signature beneath the regolith!',
  'DESAFIO 3.1 & 3.2 — VARREDURA ORBITAL (HiRISE + RADAR SHARAD)':
    'CHALLENGES 3.1 & 3.2 — ORBITAL SCAN (HiRISE + SHARAD RADAR)',
  'Camadas verificadas:': 'Layers checked:',
  '1. Superfície (HiRISE)': '1. Surface (HiRISE)',
  '2. Radar (SHARAD / MRO)': '2. Radar (SHARAD / MRO)',
  '3. Estudos Prévios NASA': '3. Prior NASA Studies',
  'Encosta íngreme / Rochas': 'Steep Slope / Boulders',
  'ECOS SHARAD: FORTE (-1,8m)': 'SHARAD ECHO: STRONG (-1.8m)',
  'SONDA SHARAD': 'SHARAD PROBE',
  'Sonda Antiga: Baixo Gelo (Já pesquisado)': 'Past Probe: Low Ice (Already Studied)',
  'Relatório First Ice Cores: Prioritário': 'First Ice Cores Report: Priority',
  'Alfa': 'Alpha',
  'Beta': 'Beta',
  'Gama': 'Gamma',
  'Arcadia Planitia • ~39,2°N • Camada:': 'Arcadia Planitia • ~39.2°N • Layer:',
  'ECOSCOPIO SHARAD': 'SHARAD SOUNDER',
  '(ARRASTE NO MAPA)': '(DRAG ON MAP)',
  '(ATIVE RADAR)': '(ENABLE RADAR)',
  'Superfície (HiRISE):': 'Surface (HiRISE):',
  'Radar SHARAD:': 'SHARAD Radar:',
  'Estudos NASA:': 'NASA Studies:',
  'Local não recomendado para perfuração segura. Compare as 3 camadas e varra o mapa com o Radar SHARAD!':
    'Site not safe or promising for drilling. Compare all 3 layers and sweep the map with SHARAD Radar!',
  '1. Alterne pelos botões': '1. Switch across the buttons',
  'Superfície': 'Surface',
  '2. Radar (SHARAD)': '2. Radar (SHARAD)',
  '2. Com o': '2. With',
  'Radar SHARAD': 'SHARAD Radar',
  'ativo, arraste a sonda pelo mapa até localizar o maior eco de gelo no':
    'active, drag the probe across the map until you lock onto the peak ice echo at',
  'Setor Gama': 'Gamma Sector',
  'Varra o mapa na camada Radar SHARAD até encontrar o depósito em Gama (-1,8m).':
    'Sweep the map in the SHARAD Radar layer to locate the Gamma ice deposit (-1.8m).',
  'Dica científica: clique em todas as 3 camadas orbitais acima antes de perfurar.':
    'Science tip: inspect all 3 orbital layers above before drilling.',
  'Autorizar Perfuração no Setor Gama (Desafio 3.3) ▶':
    'Authorize Drilling at Gamma Sector (Challenge 3.3) ▶',
  'Varra com o Radar SHARAD e valide as 3 camadas':
    'Sweep with SHARAD Radar & inspect all 3 layers',

  // DrillHeatControl & Step2DrillAndSample
  '0,0 m – 0,8 m • Regolito Superficial': '0.0 m – 0.8 m • Surface Regolith',
  'Atrito moderado — solo arenoso seco': 'Moderate friction — dry sandy soil',
  '0,8 m – 1,5 m • Camada Rochosa Densa': '0.8 m – 1.5 m • Dense Bedrock Layer',
  'ALTO ATRITO! Pulse e solte 1–2s para resfriar': 'HIGH FRICTION! Pulse & release 1–2s to cool',
  '1,5 m – 2,2 m • Depósito de Gelo Subterrâneo': '1.5 m – 2.2 m • Buried Water-Ice Deposit',
  'Cristais de H₂O detectados — avanço estável': 'H₂O ice crystals detected — steady drilling',
  'CAMADAS DO SUBSOLO (0,0 m → 2,2 m)': 'SUBSURFACE LAYERS (0.0 m → 2.2 m)',
  'm / 2,20 m': 'm / 2.20 m',
  'TEMPERATURA DA BROCA (': 'DRILL BIT TEMPERATURE (',
  'Zona crítica! Solte 1–2s para resfriar!': 'Critical zone! Release 1–2s to cool!',
  'Temperatura controlada': 'Temperature controlled',
  'PERFURANDO... SOLTE SE ESQUENTAR!': 'DRILLING... RELEASE IF OVERHEATING!',
  '⚙️ SEGURAR PARA PERFURAR (0,0 m → 2,2 m)': '⚙️ HOLD TO DRILL (0.0 m → 2.2 m)',
  'Perfuradora recalibrada em 0,0 m! Segure o botão para perfurar e lembre de pulsar na camada rochosa (0,8 m – 1,5 m).':
    'Drill recalibrated at 0.0 m! Hold to drill and remember to pulse the button through the dense rock layer (0.8 m – 1.5 m).',
  '0,8 m! Entramos na Camada Rochosa Densa: o atrito aumenta muito aqui! Solte o botão por 1–2 segundos sempre que a barra aquecer.':
    '0.8 m! Entering Dense Bedrock: friction shoots up here! Release the button for 1–2 seconds whenever heat climbs.',
  '1,5 m ultrapassados! Saímos da rocha dura e já detectamos cristais de gelo puro. Continue até 2,2 m!':
    '1.5 m cleared! Past the hard rock and hitting pure blue water-ice crystals. Keep drilling down to 2.2 m!',
  '2,2 m atingidos e Ice Core extraído! Agora no Desafio 3.4: esfregue para limpar o regolito do cilindro e depois arraste-o para o Recipiente Criogênico!':
    '2.2 m reached and Ice Core extracted! Now in Challenge 3.4: scrub the regolith dirt off the core, then drag it into the Cryo Vault!',
  'Superaquecimento (100%)! A broca travou por 2,5 segundos para segurança. Pulse o botão segurando e soltando em vez de segurar direto na camada rochosa!':
    'Overheated (100%)! Thermal safety lock engaged for 2.5 seconds. Pulse the drill button instead of holding non-stop through rock!',
  'Regolito removido com perfeição! O cilindro revelou gelo azul-ciano puro (etiqueta ARCADIA-SOL2-GAMA). Agora arraste o cilindro limpo para dentro do Recipiente Criogênico (-73 °C)!':
    'Regolith scraped off cleanly! Pure cyan water ice revealed (tag ARCADIA-SOL2-GAMA). Now drag the clean core into the Cryo Vault (-73 °C)!',
  'Selo criogênico (-73 °C) ativado com sucesso! Amostra preservada — clique em "Levar Amostra ao Laboratório (3.5)" para analisar a água!':
    'Cryogenic seal (-73 °C) locked! Core preserved — tap "Take Sample to Water Lab (3.5)" to analyze the water!',
  'Quase lá! Arraste o cilindro de gelo limpo até o Recipiente Criogênico (-73 °C) ao lado e solte dentro dele.':
    'Almost! Drag the clean ice core straight over to the Cryo Vault (-73 °C) and drop it inside.',
  'DESAFIO 3.3 & 3.4 — PERFURAÇÃO TÉRMICA & BANCADA DO ICE CORE':
    'CHALLENGES 3.3 & 3.4 — THERMAL DRILLING & ICE CORE BENCH',
  'PROFUNDIDADE:': 'DEPTH:',
  'SOLTE NO RECIPIENTE (-73 °C)': 'DROP IN CRYO VAULT (-73 °C)',
  '0,0m Regolito': '0.0m Regolith',
  '1,0m Rocha': '1.0m Bedrock',
  '2,2m Gelo H₂O': '2.2m H₂O Ice',
  'TELEMETRIA DE SUBSOLO (SETOR GAMA)': 'SUBSURFACE TELEMETRY (GAMMA SECTOR)',
  'Ice Core limpo, etiquetado (ARCADIA-SOL2-GAMA) e selado a -73 °C!':
    'Ice Core cleaned, tagged (ARCADIA-SOL2-GAMA), and sealed at -73 °C!',
  'Amostra de 2,2 m extraída! Realize a limpeza do regolito e o armazenamento criogênico ao lado.':
    '2.2 m core extracted! Clean off the regolith layer and store it in the cryo vault beside this panel.',
  '1. SEPARAR REGOLITO DA AMOSTRA (': '1. SCRUB REGOLITH OFF CORE (',
  'CRISTAIS PUROS': 'PURE CRYSTALS',
  'Esfregue com o mouse ou dedo sobre o cilindro ao lado para raspar a crosta de terra/regolito e revelar os cristais azul-ciano (90%+).':
    'Scrub over the core cylinder with your mouse or finger to strip away Martian dirt and reveal cyan ice crystals (90%+).',
  'Cilindro limpo e etiquetado! Agora ARRASTE o cilindro ao lado (ou toque abaixo) para dentro do Recipiente Criogênico!':
    'Core cleaned and tagged! Now DRAG the ice core (or tap below) into the Cryogenic Vault!',
  'Testemunho limpo e selado com sucesso!': 'Core cleaned and cryogenically sealed!',
  '2. RECIPIENTE TÉRMICO CRIOGÊNICO (-73 °C)': '2. CRYOGENIC VAULT (-73 °C)',
  'Selo criogênico travado! Amostra segura para o laboratório.':
    'Cryo lock active! Sample ready for the water lab.',
  'Arraste e solte o cilindro de gelo limpo aqui (ou toque para encaixar e selar)':
    'Drag & drop the clean ice core here (or tap to insert & seal)',
  'Limpe o regolito do cilindro acima primeiro (90%+)':
    'Clean the regolith off the core above first (90%+)',
  'Levar Amostra ao Laboratório (3.5) ▶': 'Take Sample to Water Lab (3.5) ▶',
  'Limpe o gelo (90%+) e sele no Recipiente Criogênico':
    'Clean ice core (90%+) & seal in Cryo Vault',

  // Step3WaterLabAndPotability & Step4Mission3Conclusion
  '1. Separar solo e pedregulhos': '1. Separate soil & gravel',
  'Partículas grossas de regolito separadas! Agora podemos derreter o gelo puro.':
    'Coarse regolith particles removed! Now we can melt the clean water ice.',
  '2. Derreter gelo em câmara controlada': '2. Melt ice in sealed chamber',
  'Gelo derretido em água líquida! Mas ela ainda contém poeira fina em suspensão.':
    'Ice melted into liquid water! It still holds fine suspended dust though.',
  '3. Filtrar partículas em suspensão': '3. Filter suspended particles',
  'Filtração física concluída! Porém, água transparente ainda pode ter contaminantes invisíveis.':
    'Physical filtration done! Even clear water can still hide invisible chemicals or microbes.',
  '4. Tratar água (ionização e UV)': '4. Treat water (ionization & UV)',
  'Tratamento iniciado! Agora arraste a Pipeta de Reagente para os 4 tubos e segure o Filtro UV antes de beber.':
    'Treatment ready! Drag the Reagent Pipette to all 4 test tubes and hold the UV Filter before drinking.',
  'pH da Água': 'Water pH',
  '7,1 — Neutro ideal (6,5 a 8,5)': '7.1 — Ideal neutral (6.5 to 8.5)',
  'Condutividade / Sais': 'Conductivity / Salts',
  '180 µS/cm — Concentração segura': '180 µS/cm — Safe concentration',
  'Contaminantes Químicos': 'Chemical Contaminants',
  '0,00 mg/L — Percloratos removidos': '0.00 mg/L — Perchlorates removed',
  'Metais Pesados': 'Heavy Metals',
  'Ausentes — Abaixo do limite': 'None detected — Below safe limit',
  'Complete primeiro as 4 etapas de purificação acima antes de testar a água.':
    'Complete the 4 purification stages above before testing the water tubes.',
  'Esterilização UV 100% concluída! Indicadores de microrganismos zerados: água segura para consumo da tripulação!':
    '100% UV sterilization complete! Microbes eliminated: water is officially safe for the crew!',
  'Segurança em primeiro lugar! Uma água transparente pode conter sais ou microrganismos invisíveis. Conclua o tratamento, aplique a pipeta nos 4 tubos e finalize o Filtro UV!':
    'Safety first! Clear water can still hide invisible salts or microbes. Finish treatment, test all 4 tubes with the pipette, and run the UV Filter to 100%!',
  'DESAFIO 3.5 & 3.6 — LABORATÓRIO TÁTIL: PIPETA & FILTRO UV':
    'CHALLENGES 3.5 & 3.6 — WATER LAB: PIPETTE & UV FILTER',
  'Processamento:': 'Processing:',
  '/4 • Potabilidade:': '/4 • Potability:',
  'SOLTE NO TUBO': 'DROP ON TUBE',
  'ÁGUA POTÁVEL APROVADA!': 'DRINKING WATER APPROVED!',
  'APLIQUE PIPETA + FILTRO UV': 'APPLY PIPETTE + UV FILTER',
  'PROCESSAMENTO EM ANDAMENTO': 'PROCESSING IN PROGRESS',
  'Bloqueado pela Capi:': 'Blocked by Capi:',
  'Segurança em primeiro lugar! Termine as 4 etapas físicas, analise os 4 tubos com a pipeta e conclua 100% do Filtro UV.':
    'Safety first! Complete all 4 processing stages, test all 4 tubes with the pipette, and finish 100% UV Filter!',
  '💧 Abastecer Base (+35% Água Potável • -1 Turno) ▶':
    '💧 Supply Base (+35% Clean Water • -1 Turn) ▶',
  'Liberar Água Potável & Abastecer Base (100%) ▶':
    'Approve Drinking Water & Refill Base (100%) ▶',
  'Tentar Beber / Liberar Água Agora': 'Try Drinking / Releasing Water Now',
  '1. SEQUÊNCIA DE EXTRAÇÃO E PURIFICAÇÃO': '1. EXTRACTION & PURIFICATION SEQUENCE',
  '2. BANCADA DE POTABILIDADE (5 TESTES)': '2. POTABILITY BENCH (5 CHECKS)',
  'ARRASTE A PIPETA AOS TUBOS': 'DRAG PIPETTE TO TEST TUBES',
  'Solte a pipeta (ou toque)': 'Drop pipette (or tap)',
  '5. MICRORGANISMOS (ESTERILIZADOR UV)': '5. MICROBES (UV STERILIZER)',
  'Ausentes (0 UFC/100mL)': 'None (0 CFU/100mL)',
  'FILTRO UV APROVADO (100% ESTERILIZADO)': 'UV FILTER APPROVED (100% STERILE)',
  '🔆 SEGURAR FILTRO UV (ATÉ 100%)': '🔆 HOLD UV FILTER (TO 100%)',
  'FECHAMENTO DA MISSÃO 3 — ÁGUA POTÁVEL CONFIRMADA!':
    'MISSION 3 WRAP-UP — CLEAN WATER CONFIRMED!',
  'ÁGUA DA BASE:': 'BASE WATER:',
  'Comandante, os dados orbitais do': 'Commander, orbital readings from',
  ', imagens': ', imagery from',
  'e a perfuração no': 'and our core drill at',
  'Setor Gama (2,2 m)': 'Gamma Sector (2.2 m)',
  'confirmaram gelo subterrâneo em Arcadia Planitia! Após separação, derretimento, filtragem e aprovação nos 5 indicadores químicos e microbiológicos, nossa reserva de água chegou a':
    'confirmed buried ice in Arcadia Planitia! After separating, melting, filtering, and passing all 5 chemical & microbe checks, our clean water reserve reached',
  '✓ Descoberta Registrada no Diário (Abrir)': '✓ Discovery Saved in Logbook (Open)',
  '1. Registrar Descoberta e Foto no Diário': '1. Log Discovery & Photo in Logbook',
  '2. Dormir e Enviar Dados à Terra (Liberar Missão 4)':
    '2. Sleep & Send Data to Earth (Unlock Mission 4)',
  'Missão 3 finalizada e sincronizada!': 'Mission 3 completed and synced!',
  'desbloqueada na Base!': 'unlocked at Arcadia Base!',
  'Voltar à Base (Missão 4 Desbloqueada) ▶': 'Back to Base (Mission 4 Unlocked) ▶',
  'Concluir Missão 3 e Voltar à Base ▶': 'Complete Mission 3 & Back to Base ▶',
  'Registre a foto no Diário acima para concluir':
    'Log your discovery photo above to continue',

  // Mission 4
  'Comandante, será que conseguimos colher tomate, morango ou uma flor colorida aqui em Marte?':
    'Commander, can we actually harvest tomatoes, strawberries, or a colorful flower right here on Mars?',
  'Instale os subsistemas da estufa experimental e conecte-a à nossa Energia Solar e à Água Potável!':
    'Install the greenhouse subsystems and wire them up to our Solar Power and Clean Water!',
  'Podemos cultivar sem solo tradicional usando Hidroponia (raízes na água) e Aeroponia (névoa nutritiva)!':
    'We can grow plants without soil using Hydroponics (nutrient water) and Aeroponics (nutrient mist)!',
  'Experimente os métodos e veja por que o regolito marciano bruto não pode ser usado direto!':
    'Test each method and discover why raw Martian regolith cannot be used straight from the ground!',
  'Vamos escolher nossas plantas nos 4 grupos de pesquisa: Hortaliças, Frutíferas, Cereais e Ornamentais!':
    'Let’s pick crops across 4 research groups: Vegetables, Fruits, Grains, and Ornament Flowers!',
  'Cada grupo tem um papel importante para alimentação e bem-estar no habitat.':
    'Every plant group supports either astronaut nutrition or crew mood inside the habitat.',
  'Hora de acompanhar a germinação, raízes e folhas! Ajuste luz, água e temperatura para evitar estresse nas plantas.':
    'Time to help our sprouts grow! Tune LED light, water, and temperature so the crops thrive stress-free.',
  'Excelente! Integre produção de alimentos, oxigênio (O2) e água reciclada em um sistema bioregenerativo!':
    'Awesome! Connect food growth, oxygen (O2), and recycled water into one bioregenerative life-support loop!',
  'Depois faça o registro no Diário e durma para eu enviar o relatório da estufa e liberar a Missão 5!':
    'Then log your work in the Logbook and sleep so I can send the greenhouse report and unlock Mission 5!',
  'MISSÃO 4 — A PRIMEIRA ESTUFA DE MARTE': 'MISSION 4 — THE FIRST MARS GREENHOUSE',
  'Agricultura Espacial & Sistemas Bioregenerativos (NASA ECLSS)':
    'Space Agriculture & Bioregenerative Systems (NASA ECLSS)',
  '4.1 Estufa': '4.1 Build',
  '4.2 Cultivo': '4.2 Methods',
  '4.3 Plantas': '4.3 Crops',
  '4.4 Crescer': '4.4 Grow',
  '4.5 ECLSS': '4.5 ECLSS',
  '1. Estrutura de Proteção (Domo)': '1. Protective Dome Structure',
  'Cúpula transparente contra baixa pressão e frio externo':
    'Clear pressurized dome shielding plants from extreme cold',
  'Estrutura instalada! O domo cria uma barreira segura contra a atmosfera fina e gelada de Marte.':
    'Dome installed! It builds a safe pressurized barrier against Mars’s thin, freezing atmosphere.',
  '2. Iluminação LED Controlada': '2. Tuned LED Grow Lights',
  'Painéis LED vermelhos e azuis para fotossíntese eficiente':
    'Red & blue LED bars for high-efficiency photosynthesis',
  'LEDs ligados! Em Marte a luz solar é mais fraca que na Terra, então LEDs otimizados ajudam muito as folhas.':
    'LEDs on! Sunlight on Mars is weaker than on Earth, so red/blue grow lights supercharge photosynthesis.',
  '3. Ventilação e Controle Térmico': '3. Airflow & Thermal Control',
  'Mantém temperatura amena (~22 °C) e ar circulando':
    'Keeps cabin warm (~22 °C) and air circulating cleanly',
  'Ventilação e aquecimento ativos! Plantas precisam de temperatura estável para germinar.':
    'Heating & airflow online! Young seedlings need steady warmth to sprout.',
  '4. Reservatório e Irrigação': '4. Closed-Loop Water Tank',
  'Tubulação fechada de distribuição e sensores de umidade':
    'Sealed water delivery pipes and moisture sensors',
  'Irrigação pronta! Agora arraste o Cabo Amarelo de Energia Solar e o Tubo Azul de Água Potável até o Domo!':
    'Irrigation ready! Now drag the Yellow Solar Cable and Blue Water Pipe onto the Greenhouse Dome ports!',
  'Bancada reiniciada! Monte os 4 subsistemas do domo e arraste os cabos de Energia Solar e Água Potável.':
    'Bench reset! Install all 4 dome modules and connect both the Solar Cable and Water Pipe.',
  'Faísca confirmada! Cabo amarelo de Energia Solar (Missão 1) encaixado no Domo da Estufa!':
    'Power spark confirmed! Yellow Solar Cable (Mission 1) snapped into the Greenhouse Dome!',
  'Fluxo hidráulico ativo! Tubo azul de Água Potável (Missão 3) conectado ao tanque ECLSS da estufa!':
    'Water flow active! Blue Clean Water Pipe (Mission 3) locked into the ECLSS greenhouse tank!',
  'Terminal errado! Arraste o cabo amarelo de Energia Solar até a entrada amarela (SOLAR) do Domo.':
    'Wrong port! Drag the yellow Solar Cable to the yellow Solar Power terminal on the Dome.',
  'Válvula errada! Arraste o tubo azul de Água Potável até a válvula azul (ÁGUA) do Domo.':
    'Wrong valve! Drag the blue Water Pipe to the blue Water Valve on the Dome.',
  'DESAFIO 4.1 — MONTAGEM DO DOMO & CONEXÃO ECLSS POR ARRASTE':
    'CHALLENGE 4.1 — DOME ASSEMBLY & DRAG-AND-DROP ECLSS WIRING',
  'SUBSISTEMAS:': 'SUBSYSTEMS:',
  'ESTUFA INTEGRADA E ONLINE': 'GREENHOUSE INTEGRATED & ONLINE',
  'CONECTE SOLAR + ÁGUA AO DOMO': 'CONNECT SOLAR + WATER TO DOME',
  '5 & 6. ARRASTE OS CABOS E TUBOS ATÉ OS TERMINAIS DO DOMO':
    '5 & 6. DRAG CABLE & PIPE TO DOME PORTS',
  'Cabo Solar (480W)': 'Solar Cable (480W)',
  'Tubo Água H₂O': 'Water Pipe H₂O',
  'Domo • Energia': 'Dome • Power',
  'SOLTE': 'DROP',
  'Domo • Válvula H₂O': 'Dome • Water Valve',
  'Status da Integração ECLSS:': 'ECLSS Integration Status:',
  'Solar Conectado (480W)': 'Solar Connected (480W)',
  'Aguardando Cabo Solar': 'Waiting for Solar Cable',
  'Água Potável Ligada': 'Clean Water Connected',
  'Aguardando Tubo H₂O': 'Waiting for Water Pipe',
  'Escolher Métodos de Cultivo (Desafio 4.2) ▶': 'Choose Growing Methods (Challenge 4.2) ▶',
  'DESAFIO 4.2 — MÉTODOS DE CULTIVO (HIDROPONIA, AEROPONIA E REGOLITO)':
    'CHALLENGE 4.2 — GROWING METHODS (HYDROPONICS, AEROPONICS & REGOLITH)',
  'Explore os métodos acima antes de confirmar': 'Test the methods above before confirming',
  'HIDROPONIA (ESQ.) • AEROPONIA (DIR.)': 'HYDROPONICS (LEFT) • AEROPONICS (RIGHT)',
  'Hidroponia ativada! As raízes ficam em canais com água e nutrientes minerais dosados, sem precisar de solo!':
    'Hydroponics active! Roots sit directly in mineral-rich oxygenated water channels with zero soil!',
  'MÉTODO A — HIDROPONIA': 'METHOD A — HYDROPONICS',
  'Raízes recebem água oxigenada com nutrientes dissolvidos em canais limpos.':
    'Roots absorb oxygen-rich water with dissolved plant nutrients in clean trays.',
  'Aeroponia ativada! As raízes ficam suspensas recebendo uma névoa nutritiva super econômica em água!':
    'Aeroponics active! Suspended roots drink a ultra-water-saving nutrient mist in mid-air!',
  'MÉTODO B — AEROPONIA': 'METHOD B — AEROPONICS',
  'Raízes suspensas recebem névoa controlada de água e nutrientes.':
    'Hanging roots absorb a fine, measured mist of water and minerals.',
  'Atenção científica! O regolito marciano bruto pode conter percloratos e não é adequado para plantar direto sem tratamento prévio!':
    'Science alert! Raw Martian regolith contains toxic perchlorates and cannot grow crops safely without chemical cleanup first!',
  'TESTAR REGOLITO MARCIANO BRUTO': 'TEST RAW MARTIAN REGOLITH',
  'Solo direto de Marte — exige tratamento químico/mineral antes de qualquer uso agrícola.':
    'Untreated Martian dirt — requires chemical & mineral processing before any farming.',
  'Adotar Hidroponia + Aeroponia (Desafio 4.3) ▶':
    'Adopt Hydroponics + Aeroponics (Challenge 4.3) ▶',
  'Teste Hidroponia e Aeroponia para continuar':
    'Test both Hydroponics and Aeroponics to continue',
  'Alface': 'Lettuce',
  'Alface plantada no Berço 1! Hortaliças folhosas crescem rápido e dão vitaminas frescas.':
    'Lettuce planted in Cradle 1! Leafy greens grow fast and give astronauts fresh vitamins.',
  'Tomate': 'Tomato',
  'Tomate plantado no Berço 1! Frutos vermelhos trazem sabor e nutrientes essenciais à equipe.':
    'Tomatoes planted in Cradle 1! Fresh red tomatoes add flavor and key nutrients for the crew.',
  'Cenoura': 'Carrot',
  'Cenoura plantada no Berço 1! Raízes crocantes enriquecem a dieta do habitat.':
    'Carrots planted in Cradle 1! Crunchy roots add variety and vitamins to habitat meals.',
  'Morango': 'Strawberry',
  'Morango plantado no Berço 2! Pequenas frutíferas produzem alimento rico em antioxidantes.':
    'Strawberries planted in Cradle 2! Compact berries pack antioxidants and sweet morale!',
  'Trigo': 'Wheat',
  'Trigo plantado no Berço 3! Cereais garantem carboidratos para missões de longa duração.':
    'Dwarf wheat planted in Cradle 3! Grains supply steady carbs for multi-year Mars stays.',
  'Flores Ornamentais': 'Ornamental Flowers',
  'Flores plantadas no Berço 4! Na NASA, cultivar flores também melhora o bem-estar e o humor da tripulação!':
    'Flowers planted in Cradle 4! NASA research proves growing real flowers boosts astronaut mood!',
  'Berços da bandeja esvaziados! Arraste (ou toque) 1 muda para cada quadrante.':
    'Tray cradles cleared! Drag (or tap) 1 seedling into each of the 4 compartments.',
  'Ops! Solte essa muda no quadrante correspondente da bandeja (ou na bandeja hidropônica).':
    'Oops! Drop that seedling into its matching cradle slot on the hydroponic tray.',
  '1. HORTALIÇAS': '1. VEGETABLES',
  'Solte Alface, Tomate ou Cenoura': 'Drop Lettuce, Tomato, or Carrot',
  '2. FRUTÍFERAS': '2. FRUITS',
  'Solte Morango': 'Drop Strawberry',
  '3. CEREAIS': '3. GRAINS',
  'Solte Trigo': 'Drop Wheat',
  '4. ORNAMENTAIS': '4. FLOWERS',
  'Solte Flores Ornamentais': 'Drop Flowers',
  'DESAFIO 4.3 — PLANTIO DRAG & DROP NOS BERÇOS HIDROPÔNICOS':
    'CHALLENGE 4.3 — DRAG & DROP PLANTING IN HYDROPONIC CRADLES',
  'Berços plantados:': 'Planted cradles:',
  'Limpar Berços': 'Clear Cradles',
  'BANDEJA HIDROPÔNICA — 4 QUADRANTES (ARRASTE AQUI)':
    'HYDROPONIC TRAY — 4 QUADRANTS (DROP HERE)',
  '1. HORTALIÇAS (ARRASTE OU TOQUE)': '1. VEGETABLES (DRAG OR TAP)',
  '2. PLANTAS FRUTÍFERAS': '2. FRUIT PLANTS',
  '(Porte compacto ideal para estufa)': '(Compact variety ideal for domes)',
  '3. CEREAIS ENERGÉTICOS': '3. ENERGY GRAINS',
  '(Fonte de energia e fibras)': '(Energy & dietary fiber source)',
  '4. PLANTAS ORNAMENTAIS': '4. ORNAMENTAL FLOWERS',
  '(Bem-estar psicológico no habitat)': '(Boosts crew psychological well-being)',
  'Ir para Névoa Nutritiva & Colheita (Desafio 4.4) ▶':
    'Go to Nutrient Mist & Harvest (Challenge 4.4) ▶',
  'Sementes Plantadas (Borrife para Germinar)': 'Seeds Planted (Mist to Sprout)',
  'Aguardando névoa nutritiva': 'Waiting for nutrient mist',
  'Broto em Crescimento (Borrife Mais)': 'Growing Sprouts (Mist More)',
  'Raízes brancas jovens se expandindo': 'Healthy white roots expanding',
  'Folhas Vigorosas (Rumo à Colheita)': 'Lush Leaves (Nearly Ready)',
  'Rede radicular forte absorvendo nutrientes': 'Strong root network absorbing nutrients',
  'Colheita Madura! Toque nos 4 Frutos/Plantas!': 'Ripe Harvest! Tap All 4 Crops to Pick!',
  'Crescimento completo sem estresse': 'Full growth with zero plant stress',
  'Estufa zerada no estágio de Sementes! Ajuste os 3 parâmetros para IDEAL e passe o borrifador sobre a bandeja.':
    'Greenhouse reset to Seed stage! Set all 3 controls to IDEAL and sweep the mister across the tray.',
  'Estresse vegetal detectado! Antes de borrifar a névoa nutritiva, ajuste Iluminação LED, Água/Nutrientes e Temperatura para o nível IDEAL.':
    'Plant stress detected! Before misting, set LED Light, Water/Nutrients, and Temperature to IDEAL.',
  'Germinação concluída (1/3)! Os primeiros brotos apareceram. Borrife novamente para nutrir o desenvolvimento das folhas!':
    'Germination done (1/3)! First green shoots are up. Keep sweeping the nutrient mist to grow big leaves!',
  'Folhas vigorosas (2/3)! Continue passando o borrifador aeropônico até alcançar o estágio de Colheita (3/3)!':
    'Strong healthy leaves (2/3)! Keep sweeping the aeroponic mister to reach full Harvest stage (3/3)!',
  'Estágio 3/3 alcançado — Colheita Pronta! Agora clique/toque diretamente sobre cada um dos 4 frutos e plantas maduros na bandeja para colher!':
    'Stage 3/3 reached — Harvest Ready! Now tap each of the 4 ripe crops on the tray to harvest them!',
  'Colheita marciana completa (4/4)! Todos os alimentos e flores foram colhidos saudáveis. Agora avance para integrar o sistema ECLSS!':
    'Mars harvest complete (4/4)! Fresh food and flowers harvested healthy. Now advance to integrate ECLSS!',
  'DESAFIO 4.4 — BORRIFADOR DE NÉVOA & COLHEITA INTERATIVA':
    'CHALLENGE 4.4 — NUTRIENT MISTER & INTERACTIVE HARVEST',
  'ESTÁGIO:': 'STAGE:',
  'BORRIFANDO NÉVOA...': 'MISTING CROPS...',
  'PASSE O DEDO/MOUSE AQUI': 'SWEEP FINGER / MOUSE HERE',
  'NÉVOA NUTRITIVA (ESTÁGIO': 'NUTRIENT MIST (STAGE',
  'Com os 3 controles ao lado em': 'With all 3 climate controls set to',
  ', arraste sobre as folhas na bandeja acima até atingir 100% para avançar o crescimento.':
    ', sweep your finger/mouse over the leaves above to hit 100% and reach the next growth stage.',
  'COLHEITA MADURA! TOQUE NOS 4 ITENS PARA COLHER:': 'RIPE HARVEST! TAP ALL 4 CROPS TO PICK:',
  '✓ COLHIDO': '✓ PICKED',
  'TOCAR PARA COLHER': 'TAP TO HARVEST',
  'Altura média:': 'Average height:',
  'Raízes:': 'Roots:',
  'Saúde vegetal:': 'Plant health:',
  'Ambiente equilibrado sem estresse!': 'Balanced climate with zero stress!',
  'Ajuste Luz, Água/Nutrientes e Temperatura ao lado para IDEAL antes de borrifar!':
    'Set Light, Water/Nutrients & Temperature beside this panel to IDEAL before misting!',
  'ILUMINAÇÃO LED': 'LED LIGHTING',
  'Fraca': 'Dim',
  'Ideal (16h)': 'Ideal (16h)',
  'Excesso': 'Too Bright',
  'ÁGUA E NUTRIENTES': 'WATER & NUTRIENTS',
  'Seca': 'Dry',
  'Equilibrada': 'Balanced',
  'Encharcada': 'Flooded',
  'TEMPERATURA E UMIDADE': 'TEMPERATURE & HUMIDITY',
  'Fria (8 °C)': 'Cold (8 °C)',
  'Ideal (22 °C)': 'Ideal (22 °C)',
  'Quente (36 °C)': 'Hot (36 °C)',
  'Ajuste os 3 parâmetros para Ideal antes de usar o borrifador.':
    'Tune all 3 settings to Ideal before spraying nutrient mist.',
  '🌱 Colher & Armazenar (+3 Rações • +10% Saúde • -1 Turno) ▶':
    '🌱 Harvest & Store (+3 Rations • +10% Health • -1 Turn) ▶',
  'Integrar Sistema Bioregenerativo (Desafio 4.5) ▶':
    'Integrate Bioregenerative Loop (Challenge 4.5) ▶',
  '1. Produção Contínua de Alimentos': '1. Continuous Fresh Food',
  'Hortaliças, morangos e trigo frescos complementam as rações da Terra':
    'Fresh greens, berries & wheat supplement Earth supply rations',
  'Ciclo de alimentos integrado! Produzir comida fresca em Marte reduz a dependência de cargas enviadas da Terra.':
    'Food loop online! Growing fresh crops on Mars reduces dependence on Earth cargo rockets.',
  '2. Revitalização do Ar (O2 ↔ CO2)': '2. Air Revitalization (O2 ↔ CO2)',
  'Plantas absorvem CO2 expirado pelos astronautas e liberam oxigênio (O2)':
    'Plants absorb crew CO2 and release breathable oxygen (O2)',
  'Revitalização do ar ativa! A fotossíntese das plantas ajuda a renovar o oxigênio do habitat!':
    'Air loop online! Plant photosynthesis naturally refreshes oxygen inside the habitat!',
  '3. Reciclagem Bioregenerativa de Água': '3. Bioregenerative Water Recycling',
  'Vapor transpirado pelas folhas é condensado e volta puro ao reservatório':
    'Water vapor from leaves condenses back into pure drinking water',
  'Reciclagem de água fechada! Sistemas bioregenerativos (ECLSS) da NASA integram plantas, ar e água em um ciclo vivo!':
    'Closed-loop water active! NASA ECLSS connects crops, cabin air, and clean water in one living cycle!',
  'DESAFIO 4.5 — SISTEMA BIOREGENERATIVO DE SUPORTE À VIDA (ECLSS)':
    'CHALLENGE 4.5 — BIOREGENERATIVE LIFE SUPPORT (ECLSS)',
  'ELOS INTEGRADOS:': 'ACTIVE LOOPS:',
  'Todos os ciclos bioregenerativos estão operando em conjunto! Faça o Registro Científico Obrigatório no Diário de Bordo e acione o Sono para a Capi enviar o relatório da estufa à Terra e desbloquear a Missão 5.':
    'All bioregenerative loops are running together! Save your Science Logbook entry and go to sleep so Capi can send the greenhouse report and unlock Mission 5.',
  'Clique nos 3 cartões acima para conectar alimentos, oxigênio (O2) e água reciclada ao habitat marciano.':
    'Tap all 3 cards above to link fresh food, oxygen (O2), and recycled water to the Mars habitat.',
  '✓ Estufa Registrada no Diário (Abrir)': '✓ Greenhouse Logged (Open)',
  '1. Registrar Estufa e Foto no Diário': '1. Log Greenhouse & Photo in Logbook',
  '2. Dormir — Relatório da Estufa (Liberar Missão 5)':
    '2. Sleep — Greenhouse Report (Unlock Mission 5)',
  'Voltar à Base (Missão 5 Pronta) ▶': 'Back to Base (Mission 5 Ready) ▶',

  // Mission 5
  'COMANDANTE! ATENÇÃO! Recebi um alerta ambiental de tempestade de poeira se aproximando de Arcadia Planitia!':
    'COMMANDER! ALERT! I just received an orbital warning: a Martian dust storm is sweeping toward Arcadia Planitia!',
  'Execute a sequência de proteção: consulte o painel, interrompa tarefas externas, vede os filtros e gerencie baterias!':
    'Run the protection sequence: seal external panels, close airlocks, lock dust filters, and guard the batteries!',
  'A poeira depositada diminuiu a luz nos nossos painéis solares! Vamos inspecionar a queda e acionar a limpeza remota.':
    'Settled dust cut power output on our solar panels! Let’s scrub the post-storm layer and restore full wattage.',
  'ALERTA DE ATIVIDADE SOLAR! Diferente da poeira, a radiação não pode ser vista a olho nu — entre no Abrigo Blindado especial!':
    'SOLAR RADIATION ALERT! Unlike visible dust, energetic radiation is invisible — race into the Shielded Shelter!',
  'A tempestade passou! Inspecione os sistemas, registre no Diário de Bordo e durma para validar o Relatório de Segurança e liberar a Cena 6!':
    'The storm passed! Inspect all 4 systems, update your Logbook, and sleep to validate the Safety Report and unlock Scene 6!',
  'MISSÃO 5 — ALERTA! TEMPESTADES EM MARTE': 'MISSION 5 — ALERT! STORMS ON MARS',
  'Poeira Marciana & Radiação Solar (NASA Dust in the Wind • Real Martians)':
    'Martian Dust & Solar Radiation (NASA Dust in the Wind • Real Martians)',
  '5.1 Poeira': '5.1 Dust',
  '5.2 Painéis': '5.2 Panels',
  '5.3 Radiação': '5.3 Radiation',
  '5.4 Inspeção': '5.4 Inspect',
  'Cena 6': 'Scene 6',
  '1. Trava do Painel Ambiental': '1. Weather Sensor Lock',
  'Isolar sensores externos antes da rajada de poeira':
    'Isolate outside probes before dust gusts hit',
  'Painel isolado! Tempestades marcianas reduzem drasticamente a luz solar que chega à base.':
    'Console isolated! Martian dust storms dramatically dim the sunlight reaching our base.',
  '2. Escotilha de Acesso Externo': '2. Main Airlock Hatch',
  'Recolher equipe externa e vedar comporta principal':
    'Bring crew inside and seal main hatch',
  'Comporta principal vedada! Todos os astronautas estão seguros dentro do habitat pressurizado.':
    'Main airlock sealed! Every astronaut is safe inside the pressurized habitat.',
  '3. Válvula dos Filtros HEPA/Poeira': '3. HEPA Dust Filter Valve',
  'Selar dutos internos contra partículas finas de regolito':
    'Seal air ducts against ultra-fine regolith dust',
  'Filtros vedados! Partículas microscópicas podem danificar eletrônicos e pulmões se entrarem.':
    'Filters locked! Microscopic Martian dust can clog electronics and hurt lungs if it gets inside.',
  '4. Chave de Economia de Baterias': '4. Battery Reserve Switch',
  'Transferir sistemas vitais para modo reserva protegido':
    'Switch life-support systems to protected reserve power',
  'Baterias em modo protegido! A tempestade está passando sobre Arcadia Planitia sem afetar nossa equipe.':
    'Batteries protected! The dust storm is sweeping over Arcadia Planitia while our crew stays safe.',
  'A tempestade atingiu a janela externa! Arraste as travas restantes rapidamente até VEDADO!':
    'The dust storm hit the habitat windows! Slide the remaining latches to SEALED fast!',
  'Escotilhas destravadas para simulado! Arraste cada alavanca até 100% (VEDADO).':
    'Hatches unlocked for drill! Slide every lever to 100% (SEALED).',
  'DESAFIO 5.1 — VEDAÇÃO DE EMERGÊNCIA DO HABITAT (ESCOTILHAS)':
    'CHALLENGE 5.1 — EMERGENCY HABITAT SEALING (AIRLOCKS)',
  'HABITAT VEDADO!': 'HABITAT SEALED!',
  'ESCOTILHAS SELADAS • INTERNO SEGURO': 'HATCHES SEALED • INTERIOR SAFE',
  'RAJADAS NA JANELA • VEDE AS 4 TRAVAS': 'GUSTS ON WINDOWS • SEAL ALL 4 LATCHES',
  'Ref.: NASA Dust in the Wind': 'Ref.: NASA Dust in the Wind',
  'Como vedar:': 'How to seal:',
  'deslize cada alavanca da esquerda (': 'slide each lever from the left (',
  'DESTRAVADO': 'UNLOCKED',
  ') até o final à direita (': ') all the way to the right (',
  'VEDADO': 'SEALED',
  ') usando o mouse ou dedo antes da poeira fina invadir o habitat!':
    ') using your mouse or finger before fine Martian dust breaches the habitat!',
  '🔒 TRAVA VEDADA (100%)': '🔒 LATCH SEALED (100%)',
  'ARRASTE A TRAVA ATÉ AQUI ▶▶▶': 'SLIDE LATCH HERE ▶▶▶',
  '🛡️ Ativar Proteção da Base (-1 Turno • -10% Stamina) ▶':
    '🛡️ Activate Base Protection (-1 Turn • -10% Stamina) ▶',
  'Poeira Baixou — Limpar Painéis Solares (Desafio 5.2) ▶':
    'Dust Settled — Clean Solar Panels (Challenge 5.2) ▶',
  'Camada pós-tempestade aplicada! Esfregue o painel solar até atingir 90%+ limpo e restaurar 480 W.':
    'Post-storm dust coated the panels! Scrub the array until 90%+ clean to restore 480 W.',
  'Painel restaurado para 480 W (100%)! Você removeu toda a poeira marciana depositada pela tempestade.':
    'Panel restored to 480 W (100%)! You cleared away every speck of storm dust.',
  'DESAFIO 5.2 — LIMPEZA PÓS-TEMPESTADE NO PAINEL SOLAR':
    'CHALLENGE 5.2 — POST-STORM SOLAR PANEL SCRUBBING',
  'GERAÇÃO:': 'OUTPUT:',
  '480 W OK': '480 W OK',
  'PAINÉIS LIMPOS • 480 W RESTAURADOS!': 'PANELS CLEAN • 480 W RESTORED!',
  'CAMADA ESPESSA DE POEIRA PÓS-TEMPESTADE': 'THICK POST-STORM DUST LAYER',
  'TELEMETRIA FOTOVOLTAICA EM TEMPO REAL': 'LIVE PHOTOVOLTAIC TELEMETRY',
  'A tempestade depositou uma crosta espessa de regolito sobre os painéis, reduzindo a geração para':
    'The storm left a thick crust of regolith dust over the solar array, dropping output down to',
  'Potência Recuperada:': 'Power Recovered:',
  'Limpeza concluída (> 90%)! Baterias da Base Arcadia recarregadas para 100%.':
    'Scrubbing complete (> 90%)! Arcadia Base batteries recharged to 100%.',
  'Limpe pelo menos 90% da poeira no quadro ao lado para restaurar 480 W.':
    'Scrub at least 90% of the dust on the panel canvas to restore 480 W.',
  'Energia Restaurada — Alerta Solar (Desafio 5.3) ▶':
    'Power Restored — Solar Radiation Alert (Challenge 5.3) ▶',
  'Alerta solar ativo! Guie o astronauta pelo terreno desviando das 2 rochas até o Abrigo Blindado antes da radiação atingir 100%!':
    'Solar alert active! Guide the astronaut across the grid around both boulders to the Shielded Shelter before radiation hits 100%!',
  'Radiação crítica (100%)! Recomece a corrida imediatamente usando as setas ou tocando nas células à frente até o Abrigo Blindado!':
    'Critical radiation (100%)! Restart the dash immediately using the directional buttons or tapping cells toward the Shielded Shelter!',
  'Pedregulho marciano bloqueando essa faixa! Contorne subindo ou descendo para chegar ao Abrigo Blindado!':
    'Martian boulder blocking that lane! Move UP or DOWN to detour around it toward the Shielded Shelter!',
  'Salvo no Abrigo Blindado! Camadas de água (hidrogênio) e solo marciano detiveram a radiação invisível com segurança total (NASA Real Martians)!':
    'Safe inside the Shielded Shelter! Thick water (hydrogen) walls and packed regolith stopped invisible solar radiation completely (NASA Real Martians)!',
  'DESAFIO 5.3 — CORRIDA PARA O ABRIGO BLINDADO CONTRA RADIAÇÃO':
    'CHALLENGE 5.3 — DASH TO THE RADIATION SHIELDED SHELTER',
  'BLINDADO NO ABRIGO!': 'SAFE INSIDE SHELTER!',
  'Exposição a Partículas Energéticas (Radiação Invisível):':
    'Energetic Particle Exposure (Invisible Radiation):',
  'ABRIGO': 'SHELTER',
  'ROCHA': 'ROCK',
  'SUBIR': 'UP',
  'DESCER': 'DOWN',
  'AVANÇAR': 'FORWARD',
  'POR QUE BUSCAR O ABRIGO BLINDADO?': 'WHY ENTER THE SHIELDED SHELTER?',
  'Diferente da poeira visível, a': 'Unlike visible dust storms,',
  'radiação solar é invisível a olho nu': 'solar radiation is invisible to the human eye',
  '. Paredes comuns não detêm partículas energéticas; o abrigo usa reservas de':
    '. Thin walls cannot stop high-energy protons; the shelter uses dense reserves of',
  'água (hidrogênio)': 'water (hydrogen)',
  'e espessas camadas de': 'and thick layers of',
  'regolito': 'regolith soil',
  'Use os botões táteis (ou setas/toque no terreno) para desviar das 2 rochas e alcançar o Abrigo à direita!':
    'Use the touch controls (or arrow keys / tap cells) to dodge both rocks and reach the Shelter on the right!',
  'Risco Dissipado — Inspeção Pós-Tempestade (Desafio 5.4) ▶':
    'Radiation Clear — Post-Storm Check (Challenge 5.4) ▶',
  'Guie o astronauta até a porta do Abrigo Blindado ▶':
    'Guide the astronaut to the Shielded Shelter door ▶',
  '1. Painéis Solares Fotovoltaicos': '1. Photovoltaic Solar Panels',
  'Produção estabilizada em 480 W e bancos de baterias carregados':
    'Output steady at 480 W and battery banks fully charged',
  'Painéis solares intactos e limpos! A produção de energia em Arcadia Planitia voltou ao nível nominal.':
    'Solar arrays clean and undamaged! Arcadia Planitia power generation is back to nominal levels.',
  '2. Estrutura e Vedação do Habitat': '2. Habitat Structure & Airlocks',
  'Pressurização normal, filtros limpos e zero vazamento após tempestade':
    'Normal air pressure, clean filters & zero leaks after the storm',
  'Habitat verificado! As comportas vedaram perfeitamente e os sensores internos seguem saudáveis.':
    'Habitat checked! Airlocks held tight and internal cabin sensors remain green.',
  '3. Estufa Bioregenerativa (ECLSS)': '3. Bioregenerative Greenhouse (ECLSS)',
  'Domo protegido, LEDs de cultivo e reciclagem de água/O2 operacionais':
    'Dome intact, LED grow bars & water/O2 recycling online',
  'Estufa protegida! Nossas hortaliças, morangos, trigo e flores passaram pela tempestade em segurança!':
    'Greenhouse safe! Every crop of lettuce, berries, wheat, and flowers weathered the storm!',
  '4. Antenas e Sistemas de Comunicação': '4. Deep-Space Comms Dish',
  'Alinhamento orbital conferido — link preparado para envio à Terra':
    'Orbital dish aligned — ready to beam mission logs to Earth',
  'Comunicações verificadas! Depois do Diário de Bordo e do Relatório de Segurança no Sono, podemos transmitir tudo à Terra!':
    'Comms online! After logging your report and running the Sleep Safety check, we can transmit everything to Earth!',
  'DESAFIO 5.4 — INSPEÇÃO PÓS-TEMPESTADE & RELATÓRIO DE SEGURANÇA':
    'CHALLENGE 5.4 — POST-STORM INSPECTION & SAFETY REPORT',
  'SISTEMAS VERIFICADOS:': 'SYSTEMS VERIFIED:',
  'Inspeção pós-tempestade 100% aprovada! Faça o Registro Obrigatório no Diário de Bordo e acione o Sono para a Capi gerar o Relatório de Segurança e Exposição à Radiação, liberando a Cena 6 (Central de Comunicação com a Terra).':
    'Post-storm inspection 100% passed! Save your mandatory Logbook entry and go to Sleep so Capi creates the Safety & Radiation Report and unlocks Scene 6 (Earth Comms Center).',
  'Inspecione os 4 módulos acima para avaliar possíveis efeitos da tempestade antes do registro final.':
    'Inspect all 4 modules above for storm damage before filing your final logbook entry.',
  '✓ Tempestade Registrada no Diário (Abrir)': '✓ Storm Logged in Logbook (Open)',
  '1. Registrar Tempestade e Foto no Diário': '1. Log Storm & Photo in Logbook',
  '2. Dormir — Relatório de Segurança e Radiação':
    '2. Sleep — Safety & Radiation Report',
  'EXPEDIÇÃO CONCLUÍDA — CENTRAL DA TERRA LIBERADA!':
    'TRAINING COMPLETE — EARTH COMMS UNLOCKED!',
  'Todas as 5 missões estão finalizadas! Retorne à espaçonave para transmitir o Relatório Geral aos cientistas da Terra.':
    'All 5 missions are complete! Head back to your spacecraft to beam the General Report to Earth scientists.',
  'Ir para Central de Comunicação (Encerrar Expedição) ▶':
    'Go to Earth Comms Center (Wrap Up) ▶',

  // Survival 30 + Weather + Crises + GameStore
  'PICO SÚBITO DE RADIAÇÃO SOLAR!': 'SUDDEN SOLAR RADIATION SPIKE!',
  'TEMPESTADE DE PRÓTONS DETECTADA EM ÓRBITA! Acione as comportas de chumbo/água AGORA ou corra para o Abrigo Blindado antes que o contador zere!':
    'SOLAR PROTON STORM IN ORBIT! Lock the water/lead shutters RIGHT NOW or dash to the Shielded Shelter before the timer hits zero!',
  '-28% Saúde • -15% Stamina por exposição aguda': '-28% Health • -15% Stamina from acute exposure',
  '🛡️ FECHAR ESCOTILHA BLINDADA AGORA': '🛡️ LOCK SHIELDED HATCH NOW',
  'MICRO-VAZAMENTO DE PRESSÃO NO HABITAT!': 'HABITAT MICRO-PRESSURE LEAK!',
  'ALERTA DE DESPRESSURIZAÇÃO! Impacto de micrometeorito abriu fissura no domo! Sele a válvula de contenção imediatamente!':
    'DEPRESSURIZATION ALERT! A micrometeorite cracked the dome seal! Shut the containment valve immediately!',
  '-22% Energia (aquecimento) • -18% Água • -15% Saúde':
    '-22% Energy (heating) • -18% Water • -15% Health',
  '🔧 VEDAR FISSURA DO DOMO AGORA': '🔧 SEAL DOME CRACK NOW',
  'SOBRECARGA E CURTO NOS PAINÉIS SOLARES!': 'SOLAR ARRAY SHORT & SURGE!',
  'DESCARGA ESTÁTICA DE POEIRA NO BARRAMENTO SOLAR! Desarme o disjuntor de emergência antes que o banco de baterias queime!':
    'STATIC DUST DISCHARGE ON SOLAR BUS! Trip the emergency breaker before the battery bank fries!',
  '-30% Energia das baterias • +25% Poeira aderida': '-30% Battery Power • +25% Panel Dust',
  '⚡ DESARMAR DISJUNTOR DE PICO': '⚡ TRIP SURGE BREAKER NOW',
  'EMERGÊNCIA EM TEMPO REAL!': 'LIVE EMERGENCY!',
  'CAPI • ALERTA IMEDIATO': 'CAPI • IMMEDIATE ALERT',
  'Risco se falhar:': 'Penalty if failed:',
  'Ou correr para a': 'Or run to',
  'Estação 1 (Painéis Solares)': 'Station 1 (Solar Panels)',
  'Estação 5 (Abrigo & Vedação)': 'Station 5 (Shelter & Seals)',
  'Nenhum exercício realizado hoje — queda de condicionamento':
    'No exercise today — conditioning drop',
  'Sem alimentação hoje — déficit energético': 'No meal today — calorie deficit',
  'Hidratação insuficiente hoje': 'Insufficient hydration today',
  'Higiene pendente — acúmulo de poeira': 'Hygiene pending — dust buildup',
  'Estação 1: Painéis Solares': 'Station 1: Solar Panels',
  '-1 Turno • -20% Stamina': '-1 Turn • -20% Stamina',
  'Zera poeira solar • +12% Energia': 'Clears solar dust • +12% Power',
  'Estação 2: Habitat / Saúde': 'Station 2: Habitat / Health',
  '-1 Turno • -1 Ração • -12% Água • -6% Energia':
    '-1 Turn • -1 Ration • -12% Water • -6% Power',
  '+22% Saúde • +35% Stamina • restaura Teto de Stamina':
    '+22% Health • +35% Stamina • restores Stamina Cap',
  'Estação 3: Jazida de Gelo & Lab': 'Station 3: Ice Deposit & Lab',
  '-1 Turno • -30% Stamina • -14% Energia': '-1 Turn • -30% Stamina • -14% Power',
  '+26% Água Potável na base': '+26% Clean Water at base',
  'Estufa ECLSS': 'ECLSS Greenhouse',
  '-1 Turno • -20% Stamina • -16% Água • -10% Energia':
    '-1 Turn • -20% Stamina • -16% Water • -10% Power',
  '+2 Rações de Comida • +8% Saúde (O₂)': '+2 Food Rations • +8% Health (O₂)',
  'Estação 5: Abrigo & Proteção Ambiental': 'Station 5: Shelter & Storm Seals',
  '-1 Turno • -15% Stamina • -8% Energia': '-1 Turn • -15% Stamina • -8% Power',
  'Protege contra Tempestade/Radiação • -10% Poeira nos filtros':
    'Protects against Storm/Radiation • -10% Filter Dust',
  'Energia < 30% → Estufa em risco térmico: perda de colheita (-1 ração) e O₂ (-8% saúde) à noite!':
    'Power < 30% → Greenhouse thermal risk: lose -1 ration and -8% health (O₂) tonight!',
  'Água < 25% → Desidratação ativa: penalidade de saúde noturna e queda de Stamina máxima!':
    'Water < 25% → Active dehydration: overnight health loss and max Stamina drop!',
  'Estoque ZERO de rações → Desnutrição trava o teto de Stamina em 65% e drena saúde!':
    'ZERO rations left → Malnutrition caps max Stamina at 65% and drains health!',
  'Sobrevivência extrema iniciada: 4 Turnos por Sol não permitem fazer tudo — priorize energia, água e comida sob risco de cascata!':
    '30-Sol Survival started: 4 Turns per Sol won’t cover everything — prioritize power, water, and food carefully!',
  'Tempestade Global de Poeira': 'Global Dust Storm',
  'CRÍTICO: TEMPESTADE': 'CRITICAL: STORM',
  'Ventos intensos carregados de óxido de ferro bloqueiam quase toda a luz solar em Arcadia Planitia e pressionam as comportas do habitat.':
    'Fierce iron-oxide dust winds block almost all sunlight at Arcadia Planitia and batter the habitat hatches.',
  'ALERTA CRÍTICO! Sem proteção na Estação 5 (Abrigo & Escotilhas) antes de dormir, energia e saúde despencarão!':
    'CRITICAL ALERT! Without protection at Station 5 (Shelter & Seals) before sleep, power and health will plummet!',
  'Erupção Solar / Radiação Invisível': 'Solar Flare / Invisible Radiation',
  'CRÍTICO: RADIAÇÃO': 'CRITICAL: RADIATION',
  'Tempestade severa de prótons solares atinge Marte! Como o planeta não possui campo magnético global forte, o abrigo blindado é questão de vida ou morte.':
    'A severe solar proton storm hits Mars! Since Mars lacks a strong magnetic field, entering the shielded shelter saves lives.',
  'ALERTA DE RADIAÇÃO! Corra para a Estação 5 (Abrigo Blindado com H₂O e regolito) antes de encerrar o Sol!':
    'RADIATION ALERT! Get to Station 5 (Shielded Shelter with H₂O and regolith) before ending this Sol!',
  'Vento de Poeira / Queda Sazonal': 'Dust Gust / Seasonal Dip',
  'MODERADO: POEIRA': 'MODERATE: DUST',
  'Rajadas cobrem rapidamente os painéis solares (+32% de poeira) e cortam a geração fotovoltaica pela metade sem manutenção.':
    'Wind gusts coat solar arrays fast (+32% dust) and slash solar output in half without brushing!',
  'Atenção: limpe os painéis na Estação 1 (Solar) ou ative o Modo Economia sob risco de resfriar a estufa à noite!':
    'Heads up: brush the panels at Station 1 (Solar) or watch out for greenhouse freezing overnight!',
  'Céu Limpo — Atmosfera Seca': 'Clear Sky — Dry Atmosphere',
  'CÉU LIMPO': 'CLEAR SKY',
  'Incidência solar nominal em Arcadia Planitia (~39.2°N), porém poeira fina contínua (+18% por Sol) e consumo rígido de água e energia exigem escolhas cirúrgicas.':
    'Nominal sunshine at Arcadia Planitia (~39.2°N), yet steady dust settling (+18%/Sol) and strict water/power use demand smart choices.',
  '4 Turnos não bastam para todas as estações! Priorize apenas o setor crítico deste Sol e monitore o efeito dominó.':
    "4 Turns aren't enough for every station! Pick the most urgent sector each Sol and watch for cascade alerts.",
  'Modo Economia noturno causou frio na cabine (-4% Saúde, -10% Stamina).':
    'Nighttime Eco Mode chilled the cabin (-4% Health, -10% Stamina).',
  'Sem rações disponíveis → Fome severa (-22% Saúde e Stamina máxima travada em 65%).':
    'Zero rations available → Severe hunger (-22% Health & max Stamina capped at 65%).',
  'Sem treino físico no Sol → Perda de tônus (-8% Saúde e -10% Stamina máxima).':
    'No exercise today → Muscle loss (-8% Health & -10% max Stamina).',
  'Energia < 30% → Resfriamento da Estufa estragou -1 Ração e derrubou O₂ (-8% Saúde).':
    'Power < 30% → Greenhouse chill spoiled -1 Ration and dropped O₂ (-8% Health).',
  'Energia < 30% → Estufa despressurizada derrubou O₂ (-8% Saúde).':
    'Power < 30% → Chilled greenhouse dropped O₂ levels (-8% Health).',
  'Água < 25% → Desidratação reduziu Saúde (-10%) e teto de Stamina (-15%).':
    'Water < 25% → Dehydration cut Health (-10%) and max Stamina (-15%).',
  'Ração básica consumida no descanso (480 kcal)': 'Basic emergency ration eaten at night (480 kcal)',
  'Parabéns! Você sobreviveu todos os 30 Sols extremos em Arcadia Planitia!':
    'Congratulations! You survived all 30 extreme Sols at Arcadia Planitia!',
  'MODO SOBREVIVÊNCIA • SOL': 'SURVIVAL MODE • SOL',
  'Custo:': 'Cost:',
  'Recompensa:': 'Reward:',
  'Clima:': 'Weather:',

  // GameStore defaults & labels
  'Boa': 'Good',
  'Nenhum exercício registrado hoje': 'No workouts logged today',
  'Aguardando preparo de refeição no Habitat': 'Waiting for balanced meal in Habitat',
  'Reservatório em 85% (aguardando dosagem)': 'Tank at 85% (awaiting dispensing)',
  'Adaptação inicial à gravidade marciana (~0,38g) monitorada.':
    'Initial adaptation to Martian gravity (~0.38g) monitored.',
  'Aguardando primeira transmissão orbital.': 'Awaiting first orbital transmission.',
  'Esteira com cintos de gravidade': 'Treadmill with gravity straps',
  'Alongamento corporal': 'Full-body stretching',
  'Ideal (350 ml dosados sem desperdício)': 'Ideal (350 ml dispensed with zero waste)',
  'Baixa (100 ml — reforçar hidratação)': 'Low (100 ml — drink more next time)',
  'Excesso no dispensador (ajustar reserva)': 'Dispenser overflow (watch water supply)',
  'Alface Crespa': 'Curly Lettuce',
  'Morangos': 'Strawberries',
  'Trigo Anão': 'Dwarf Wheat',
  'Flores Coloridas': 'Colorful Flowers',
  'Treino gravitacional concluído (4/4 exercícios)':
    'Gravitational workout completed (4/4 exercises)',
  'Ambiente, mãos e luvas esterilizados': 'Habitat, hands, and gloves sterilized',
  'Relatório Geral da Expedição transmitido e confirmado pela Central Terrestre da NASA!':
    'General Expedition Report transmitted and confirmed by NASA Earth Control!',
  'Excelente': 'Excellent',

  // EarthCommsScene & FutureMarsScene
  'Missão 1 — Energia solar': 'Mission 1 — Solar Power',
  'Instalação e monitoramento dos painéis solares (NASA Mars24).':
    'Solar panel installation & output calculation (NASA Mars24).',
  'Missão 2 — Saúde humana': 'Mission 2 — Crew Health',
  'Monitoramento da saúde e rotina do astronauta (Spaceflight Standard Measures).':
    'Astronaut health, workouts, nutrition & sleep telemetry (Spaceflight Standard Measures).',
  'Missão 3 — Geologia e água': 'Mission 3 — Geology & Water',
  'Radar SHARAD, perfurações, amostras e estudos de água (First Ice Cores from Mars).':
    'SHARAD radar, ice core drilling & potability lab (First Ice Cores from Mars).',
  'Missão 4 — Agricultura espacial': 'Mission 4 — Space Farming',
  'Construção da estufa e acompanhamento das plantas (Sistemas Bioregenerativos ECLSS).':
    'Greenhouse construction & hydroponic/aeroponic crops (NASA ECLSS).',
  'Missão 5 — Proteção ambiental': 'Mission 5 — Environmental Defense',
  'Tempestades de poeira, radiação solar e proteção (NASA Dust in the Wind & Real Martians).':
    'Dust storms, solar radiation & shielded shelter (NASA Dust in the Wind & Real Martians).',
  'CONSEGUIMOS! Os cientistas da Terra receberam nossas informações!':
    'WE DID IT! Scientists back on Earth received all our mission data!',
  'Descobrimos como instalar um sistema de energia solar, investigamos o solo, estudamos a água, construímos uma estufa e aprendemos a nos proteger dos fenômenos ambientais de Marte.':
    'We built a solar power system, drilled for buried water ice, launched a Mars greenhouse, and mastered storm and radiation safety.',
  'Você não é apenas um astronauta. É um pesquisador!':
    "You aren't just an astronaut anymore — you're a Mars scientist!",
  'Comandante, conseguimos realizar todas as nossas missões!':
    'Commander, we completed every single training mission!',
  'Mas ainda precisamos compartilhar nossos resultados com os cientistas da Terra. Vamos conferir nosso diário de bordo e clicar em "Transmitir Dados à Terra"!':
    'Before we celebrate, let’s check our science logbook and tap "Transmit Data to Earth"!',
  'Organizando pacotes no servidor da espaçonave e buscando o alinhamento orbital com a Central Terrestre...':
    'Packaging data on the spacecraft server and locking orbital signal onto Earth Control...',
  'CENA 6 — A CENTRAL DE COMUNICAÇÃO COM A TERRA':
    'SCENE 6 — EARTH COMMUNICATIONS CENTER',
  'Retorno à espaçonave • Empacotamento do Diário Científico e Envio Orbital':
    'Back aboard ship • Packaging the Science Logbook & Orbital Downlink',
  'DADOS RECEBIDOS PELA TERRA ✓': 'DATA RECEIVED BY EARTH ✓',
  'SERVIDOR PRONTO': 'SERVER READY',
  'PLANETA TERRA NA ESCUTA': 'EARTH LISTENING',
  'Servidor da espaçonave': 'Spacecraft Server',
  'Central terrestre': 'Earth Control',
  'Transmissão confirmada ✓': 'Downlink confirmed ✓',
  'Aguardando transmissão': 'Awaiting transmission',
  'Transmitindo pacote...': 'Transmitting data packet...',
  '> PRONTO PARA EMPACOTAR FOTOS E DIÁRIO DE BORDO.':
    '> READY TO PACKAGE LOGBOOK PHOTOS & ENTRIES.',
  '> PACOTE DE DADOS PREPARADO.': '> DATA PACKET COMPILED.',
  '> TRANSMISSÃO INICIADA. BUSCANDO SINAL DA TERRA...':
    '> TRANSMISSION STARTED. LOCKING EARTH SIGNAL...',
  '> AGUARDANDO CONFIRMAÇÃO DA CENTRAL TERRESTRE...':
    '> AWAITING EARTH CONTROL HANDSHAKE...',
  '> CONEXÃO ESTABELECIDA!': '> CONNECTION ESTABLISHED!',
  '> DADOS RECEBIDOS!': '> DATA RECEIVED!',
  '> RELATÓRIO DA EXPEDIÇÃO ENCAMINHADO PARA ANÁLISE CIENTÍFICA.':
    '> EXPEDITION REPORT ROUTED TO NASA SCIENCE TEAM.',
  'RELATÓRIO GERAL DA EXPEDIÇÃO': 'GENERAL EXPEDITION REPORT',
  '5/5 CONCLUÍDAS': '5/5 COMPLETE',
  'Pacote inclui os registros automáticos das 5 missões e saúde simulada.':
    'Bundle includes automatic logs from all 5 missions and simulated health telemetry.',
  'Transmitir Dados à Terra ▶': 'Transmit Data to Earth ▶',
  'Transmitindo para Central Terrestre...': 'Transmitting to Earth Control...',
  'Avançar para Cena 7 — O Futuro da Vida em Marte ▶':
    'Advance to Scene 7 — Future of Life on Mars ▶',
  'Olhe ao nosso redor, comandante! Quando chegamos, encontramos uma paisagem desconhecida e cheia de desafios.':
    'Look around us, Commander! When we landed, Arcadia Planitia was an unknown dusty frontier.',
  'Agora temos energia solar, pesquisas geológicas, água purificada, uma estufa experimental e proteção contra tempestades e radiação!':
    'Now we have solar power, ice core geology, clean water, a thriving greenhouse, and storm & radiation protection!',
  'Será que conseguiremos cultivar mais alimentos e construir habitats sustentáveis? Nossa aventura está apenas começando!':
    'Can we grow even more food and build permanent Mars habitats? Our adventure has only just begun!',
  'CENA 7 — O FUTURO DA VIDA EM MARTE': 'SCENE 7 — THE FUTURE OF LIFE ON MARS',
  'ARCADIA PLANITIA • MISSÃO CIENTÍFICA EM MARTE':
    'ARCADIA PLANITIA • MARS SCIENCE EXPEDITION',
  'A ciência abre caminhos para novos mundos! Sua próxima descoberta está esperando por você.':
    'Science opens pathways to new worlds! Your next discovery is waiting.',
  '🔓 MODO 2 DESBLOQUEADO: EXPEDIÇÃO REAL 30 SOLS!':
    '🔓 MODE 2 UNLOCKED: 30-SOL REAL EXPEDITION!',
  'REDE INTEGRADA 5/5 SETORES ✓': 'INTEGRATED GRID 5/5 SECTORS ✓',
  'GRANDES PERGUNTAS PARA JOVENS PESQUISADORES':
    'BIG QUESTIONS FOR YOUNG EXPLORERS',
  'Agricultura Espacial:': 'Space Farming:',
  'Será que conseguiremos cultivar ainda mais alimentos para toda a tripulação usando sistemas bioregenerativos?':
    'Could future crews grow all their own fresh food on Mars using bioregenerative greenhouses?',
  'Habitats Duradouros:': 'Long-Term Habitats:',
  'Será que poderemos construir habitats capazes de proteger astronautas durante muitos anos contra poeira e radiação?':
    'How can engineers build permanent Martian homes that block cosmic radiation and fine dust for years?',
  'Uso de Recursos Locais (ISRU):': 'In-Situ Resource Utilization (ISRU):',
  'Como poderemos aproveitar gelo, energia solar e minerais de Marte sem depender tanto da Terra?':
    'How can astronauts live off Martian ice, sunlight, and minerals without waiting for Earth supply ships?',
  'CERTIFICADO & ÁLBUM DA EXPEDIÇÃO': 'CERTIFICATE & EXPEDITION ALBUM',
  'PESQUISADOR ESPACIAL CERTIFICADO': 'CERTIFIED MARS EXPLORER',
  '• Dados enviados à NASA/Terra': '• Telemetry beamed to NASA / Earth',
  'Você pode abrir a Base e tirar fotos extras pelo Diário a qualquer momento!':
    'You can revisit Arcadia Base and snap extra Logbook photos anytime!',
  '🚀 Iniciar Expedição 30 Sols (Modo Sobrevivência)':
    '🚀 Start 30-Sol Expedition (Survival Mode)',
  'Baixar Certificado da Expedição (.PNG)': 'Download Mission Certificate (.PNG)',
  'Explorar Base': 'Explore Base',
  'Jogar Novamente': 'Play Again',
  'Setor Bloqueado': 'Sector Locked',
  'Explorar Setor ▶': 'Explore Sector ▶',
  'Ir para Base Arcadia': 'Go to Arcadia Base',
  'Missão 1: Solar': 'Mission 1: Solar',
  'Missão 2: Saúde': 'Mission 2: Health',
  'ATIVO ✓': 'ACTIVE ✓',
  'LIVRE (MODO 30 SOLS) ▶': 'OPEN (30-SOL MODE) ▶',
  'SETOR NORTE': 'NORTH SECTOR',
  'Jazida de Gelo Subterrâneo (Radar SHARAD)': 'Buried Ice Deposit (SHARAD Radar)',
  'Missão 3 — Análise orbital HiRISE/SHARAD, perfuração e purificação de água.':
    'Mission 3 — HiRISE/SHARAD orbital analysis, core drilling & water purification.',
  'Conclua a Missão 2 (Saúde no Habitat) para liberar o Setor Norte.':
    'Complete Mission 2 (Habitat Health) to unlock the North Sector.',
  'PLATAFORMA OESTE': 'WEST LAUNCHPAD',
  'Espaçonave & Antena Terra': 'Spacecraft & Earth Dish',
  'Cena 6 — Servidor de bordo e transmissão do Relatório Geral à Terra.':
    'Scene 6 — Shipboard server and General Report uplink to Earth.',
  'Conclua todas as 5 missões para liberar a Central de Comunicação com a Terra.':
    'Finish all 5 missions to unlock the Earth Communications Center.',
  'SETOR CENTRAL': 'CENTER SECTOR',
  'Base Arcadia & Painéis Solares': 'Arcadia Base & Solar Panels',
  'Acampamento principal • Missão 1 (Energia Solar) e Missão 2 (Saúde).':
    'Main camp • Mission 1 (Solar Power) and Mission 2 (Astronaut Health).',
  'Sempre disponível.': 'Always accessible.',
  'SETOR LESTE': 'EAST SECTOR',
  'Domo da Estufa Experimental (ECLSS)': 'Experimental Greenhouse Dome (ECLSS)',
  'Missão 4 — Hidroponia, aeroponia e sistema bioregenerativo sustentável.':
    'Mission 4 — Hydroponics, aeroponics, and bioregenerative ECLSS life support.',
  'Conclua a Missão 3 (Gelo e Água) para liberar o Setor Leste.':
    'Complete Mission 3 (Ice & Water) to unlock the East Sector.',
  'SETOR SUL': 'SOUTH SECTOR',
  'Abrigo Blindado & Estação Ambiental': 'Shielded Shelter & Weather Station',
  'Missão 5 — Protocolos contra tempestades de poeira e radiação solar.':
    'Mission 5 — Dust storm sealing and solar radiation shelter protocols.',
  'Conclua a Missão 4 (Estufa) para liberar o Setor Sul.':
    'Complete Mission 4 (Greenhouse) to unlock the South Sector.',
};

const PATTERN_RULES: Array<[RegExp, string | ((...args: string[]) => string)]> = [
  // Exact isolated lowercase 'e' surrounded by spaces inside split JSX text
  [/^(\s+)e(\s+)$/, '$1and$2'],
  // Comma decimals to dots in telemetry units
  [/(\d+),(\d+)(\s*(?:m\b|s\b|h\b|g\b|°N|°|mg\/L))/g, '$1.$2$3'],

  // Dynamic messages from Customize / Landing / Survival / GameStore / Missions
  [
    /^Prontinho,\s*(.+?)!\s*Agora temos um astronauta preparado para o Planeta Vermelho\.$/,
    'All set, $1! Now our explorer is suited up for the Red Planet.',
  ],
  [/^Contagem regressiva:\s*(\d+)$/, 'Launch countdown: $1'],
  [/^Astronauta\s+(.+)$/, 'Astronaut $1'],
  [/^Modelo 16-bit •\s*(.+)$/, '16-bit Model • $1'],
  [/^EXPEDIÇÃO REAL: 30 SOLS \(SOL\s*$/, 'REAL EXPEDITION: 30 SOLS (SOL '],
  [
    /^Operação livre pelos 5 setores de Arcadia Planitia\. Cada Sol tem\s*$/,
    'Open exploration across all 5 Arcadia Planitia sectors. Each Sol has ',
  ],
  [/^4 Turnos de Ação$/, '4 Action Turns'],
  [
    /^\. Gerencie Stamina, Poeira Solar \($/,
    '. Manage Stamina, Solar Dust (',
  ],
  [
    /^%\), Água, Comida e Proteção contra Tempestades antes de dormir!$/,
    '%), Water, Food & Storm Protection before sleeping!',
  ],
  [/^⚠️ EFEITO DOMINÓ EM CASCATA \($/, '⚠️ CASCADE DOMINO ALERT ('],
  [/^Turnos do Sol\s*$/, 'Sol Turns '],
  [
    /^esgotados \(0\/4\)\. Clique em "Dormir" para avançar para o Sol\s*$/,
    'used up (0/4). Tap "Sleep" to advance to Sol ',
  ],
  [/^REFERÊNCIA CIENTÍFICA \($/, 'SCIENCE REFERENCE ('],
  [/^MODELO SOLAR DE REFERÊNCIA \($/, 'SOLAR MODEL REFERENCE ('],
  [
    /^PAINÉIS \((\d+)% POEIRA\)$/,
    'PANELS ($1% DUST)',
  ],
  [
    /^PAINÉIS ATIVOS \((\d+)\s*W\)$/,
    'ACTIVE PANELS ($1 W)',
  ],
  [
    /^⚠️ Aviso Orbital para amanhã \(Sol (\d+)\):\s*(.+?)\s*—\s*(.+)$/,
    '⚠️ Orbital Forecast for Tomorrow (Sol $1): $2 — $3',
  ],
  [/^⚠️ EFEITO DOMINÓ ATIVO:\s*(.+)$/, '⚠️ CASCADE ALERT: $1'],
  [
    /^Turnos restantes:\s*(\d+\/4)\s*\|\s*Stamina:\s*([\d\/]+%)\s*\|\s*Poeira nos painéis:\s*(\d+%)\.$/,
    'Turns left: $1 | Stamina: $2 | Panel Dust: $3.',
  ],
  [
    /^Stamina insuficiente \((\d+% < \d+%)\) para operar (.+?)\. Visite o Habitat \(Estação 2\) ou clique em "🌙 Dormir" para descansar!$/,
    'Not enough Stamina ($1) to run $2. Visit the Habitat (Station 2) or tap "🌙 Sleep" to recover!',
  ],
  [
    /^Água insuficiente \((\d+% < \d+%)\) para (.+?)\. Extraia gelo na Estação 3 \(Setor Norte\) primeiro!$/,
    'Not enough Water ($1) for $2. Drill water ice at Station 3 (North Sector) first!',
  ],
  [
    /^Energia insuficiente \((\d+% < \d+%)\) para (.+?)\. Limpe os painéis na Estação 1 \(Painéis Solares\) primeiro!$/,
    'Not enough Power ($1) for $2. Brush dust at Station 1 (Solar Panels) first!',
  ],

  // Mission 1 dynamics
  [/^SCAN ([A-C])$/, 'SCAN $1'],
  [/^PONTO\s*$/, 'SITE '],
  [
    /^Arraste o visor do scanner sobre o Ponto ([A-C]) no mapa acima para liberar os dados do solo!$/,
    'Drag the scanner lens over Site $1 on the map above to inspect terrain readings!',
  ],
  [
    /^Escaneie os 3 pontos candidatos arrastando o visor no terreno \((\d+)\/3 escaneados\) para comparar antes de instalar\.$/,
    'Scan all 3 candidate sites by dragging the lens over the map ($1/3 scanned) to compare them.',
  ],
  [/^Escaneie A, B e C \((\d+)\/3\)$/, 'Scan A, B, C ($1/3)'],
  [
    /^⚡ Segurar para Sincronizar Feixe \(3s\) — (\d+)%$/,
    '⚡ Hold to Sync Solar Beam (3s) — $1%',
  ],
  [
    /^Ajuste para (.+?) e (\d+°–\d+°)$/,
    'Set Orientation to $1 and Tilt to $2',
  ],
  [/^(\+\d+ W) \(carregando baterias\)$/, '$1 (charging batteries)'],
  [/^(-\d+ W) \(usando reserva das baterias\)$/, '$1 (drawing from battery bank)'],
  [
    /^Use o mouse ou dedo diretamente sobre a poeira laranja no painel à esquerda! Limpeza atual: (\d+)% \(meta: 90%\)\.$/,
    'Scrub with your mouse or finger directly across the orange dust on the solar panel! Progress: $1% (goal: 90%).',
  ],
  [/^🧹 Esfregue o Painel \((\d+)%\/90%\)$/, '🧹 Scrub Panel ($1%/90%)'],

  // Mission 2 dynamics
  [/^BARRA DE TRAÇÃO GRAVITACIONAL —\s*$/, 'GRAVITY HARNESS BAR — '],
  [/^Barra de precisão para (.+)$/, 'Precision timing bar for $1'],
  [
    /^Equipamento pronto: (.+?)! Trave o marcador dentro da zona verde na barra de tração\.$/,
    'Equipment ready: $1! Lock the marker inside the green target zone on the bar.',
  ],
  [
    /^Complete os 4 treinos na barra \((\d+)\/4\)$/,
    'Finish all 4 workouts on the bar ($1/4)',
  ],
  [
    /^Boa! "(.+?)" \(\+(\d+) kcal\) encaixado na Bandeja do Astronauta\.$/,
    'Nice! "$1" (+$2 kcal) placed on the Astronaut Tray.',
  ],
  [
    /^Você colocou apenas (\d+) ml! Abaixo de 300 ml é insuficiente após os exercícios\. Esvazie o cantil e mire entre 300 ml e 400 ml\.$/,
    'Only $1 ml! Under 300 ml is not enough after exercising. Empty the canteen and aim between 300 ml and 400 ml.',
  ],
  [
    /^Precisão cirúrgica! (\d+) ml está exatamente na faixa ideal \(300–400 ml\): hidratação completa sem desperdiçar uma gota em Marte!$/,
    'Spot on! $1 ml hits the ideal 300–400 ml target: full hydration without wasting a single drop on Mars!',
  ],
  [
    /^Atenção! (\d+) ml passou da faixa ideal \(300–400 ml\) e gerou desperdício no reservatório! Esvazie e dose novamente\.$/,
    'Watch out! $1 ml overflowed the 300–400 ml limit and wasted tank water! Empty and dispense again.',
  ],
  [/^BALANÇO ENERGÉTICO VS\. GASTO \(~$/, 'CALORIE BALANCE VS. BURN (~'],
  [
    /^Excelente! (\d+) kcal compensa perfeitamente os ~(\d+) kcal gastos no treino\.$/,
    'Great balance! $1 kcal perfectly replenishes the ~$2 kcal burned in training.',
  ],
  [
    /^Com (\d+) kcal falta combustível para o astronauta\. Troque por opções mais calóricas até atingir 650–820 kcal!$/,
    '$1 kcal leaves your astronaut low on energy. Swap for higher-calorie foods to reach 650–820 kcal!',
  ],
  [
    /^(\d+) kcal ultrapassou a meta de (\d+) kcal! Troque um alimento por uma opção mais leve\.$/,
    '$1 kcal goes over the $2 kcal target! Swap one food for a lighter option.',
  ],
  [
    /^🥗 Registrar Refeição \((\d+) kcal\) & Ir para Higiene \(2\.3\) ▶$/,
    '🥗 Save Meal ($1 kcal) & Go to Hygiene (2.3) ▶',
  ],
  [
    /^Confirmar Refeição \((\d+) kcal\) & Ir para Higiene \(2\.3\) ▶$/,
    'Confirm Meal ($1 kcal) & Go to Hygiene (2.3) ▶',
  ],
  [/^Energia insuficiente \((\d+) kcal\) — Atinga 650–820 kcal$/, 'Too low ($1 kcal) — Reach 650–820 kcal'],
  [/^Excesso calórico \((\d+) kcal\) — Reduza para 650–820 kcal$/, 'Too high ($1 kcal) — Lower to 650–820 kcal'],
  [/^3\. ESFREGAR LUVAS & BANCADA \($/, '3. SCRUB GLOVES & BENCH ('],
  [/^Realize as 3 etapas de higiene \((\d+)\/3\)$/, 'Complete all 3 hygiene tasks ($1/3)'],
  [/^Exercícios físicos concluídos \($/, 'Workouts completed ('],
  [/^MISSÃO 2 CONCLUÍDA! BOM DIA, COMANDANTE! \(SOL\s*$/, 'MISSION 2 COMPLETE! GOOD MORNING, COMMANDER! (SOL '],

  // Mission 3 dynamics
  [/^TRAVA TÉRMICA: ([\d,\.]+)s$/, 'THERMAL LOCK: $1s'],
  [/^TRAVADA POR CALOR — AGUARDE ([\d,\.]+)s$/, 'OVERHEATED — COOLING DOWN $1s'],
  [
    /^Reagente aplicado em "(.+?)": (.+)\.$/,
    'Reagent tested on "$1": $2.',
  ],
  [/^(\d+)% esterilizado$/, '$1% sterilized'],
  [/^IRRADIANDO UV\.\.\. \((\d+)%\)$/, 'STERILIZING WITH UV... ($1%)'],

  // Mission 4 dynamics
  [
    /^Instale os 4 módulos e conecte Solar \+ Água ao lado \((\d+)\/6\)$/,
    'Install all 4 modules and wire Solar + Water ($1/6)',
  ],
  [/^Plante nos 4 quadrantes da bandeja \((\d+)\/4\)$/, 'Plant all 4 tray cradles ($1/4)'],
  [/^• COLHEITA (\d+)\/4$/, '• HARVEST $1/4'],
  [
    /^(.+?) colhido \((\d+)\/4\)! Toque nas plantas maduras restantes na bandeja\.$/,
    '$1 harvested ($2/4)! Tap the remaining ripe crops on the tray.',
  ],
  [/^Borrife névoa na bandeja \((\d+)\/3 estágios\)$/, 'Mist the tray ($1/3 stages)'],
  [/^Colha os 4 vegetais\/frutos maduros \((\d+)\/4\)$/, 'Pick all 4 ripe crops ($1/4)'],
  [/^🌪️ Missão 5 — Alerta! Tempestades em Marte desbloqueada para o Sol\s*$/, '🌪️ Mission 5 — Alert! Storms on Mars unlocked for Sol '],

  // Mission 5 dynamics
  [/^TEMPESTADE EM (\d+)s • (\d+)\/4$/, 'STORM HITS IN $1s • $2/4'],
  [
    /^Arraste as 4 escotilhas até VEDADO \((\d+)\/4\)$/,
    'Slide all 4 latches to SEALED ($1/4)',
  ],
  [/^(\d+)% limpo$/, '$1% clean'],
  [/^ESFREGUE COM O MOUSE OU DEDO \($/, 'SCRUB WITH MOUSE OR FINGER ('],
  [
    /^Esfregue o painel até limpar 90%\+ \((\d+)%\)$/,
    'Scrub the panel to 90%+ clean ($1%)',
  ],
  [/^RADIAÇÃO: (\d+)%$/, 'RADIATION: $1%'],
  [
    /^Abrigo Blindado alcançado! (.+?) está 100% protegido\.$/,
    'Shielded Shelter reached! $1 is 100% protected from radiation.',
  ],

  // Survival & GameStore dynamic messages
  [/^Concluir Operação \((.+?)\) ▶$/, 'Complete Station ($1) ▶'],
  [/^Poeira crítica \((\d+)%\): rendimento solar derrubado para 30%–62%!$/, 'Critical dust ($1%): solar output dropped to 30%–62%!'],
  [/^Exaustão acumulada: teto de Stamina limitado a (\d+)% até descansar e comer no Habitat\.$/, 'Severe fatigue: max Stamina capped at $1% until you eat and rest in the Habitat.'],
  [/^Colapso energético no Sol (\d+)\/30! As baterias zeraram e o suporte térmico da base desligou\.$/, 'Power blackout on Sol $1/30! Batteries ran dry and habitat heating shut down.'],
  [/^Colapso hídrico no Sol (\d+)\/30! Os tanques secaram sem reserva suficiente na Estação 3\.$/, 'Water depletion on Sol $1/30! Reserve tanks ran dry with no Station 3 ice backup.'],
  [/^Colapso médico no Sol (\d+)\/30! Exaustão severa, desidratação ou exposição sem abrigo vitimou a tripulação\.$/, 'Medical collapse on Sol $1/30! Exhaustion, dehydration, or radiation took the crew down.'],
  [/^Emergência contida a tempo \((.+?)\)! \+30 pts científicos e base preservada\.$/, 'Emergency contained in time ($1)! +30 science pts and base saved.'],
  [/^FALHA NA CRISE \((.+?)\): (.+)!$/, 'CRISIS FAILED ($1): $2!'],
  [/^Poeira \((\d+)%\) derrubou geração solar para apenas \+(\d+)%\.$/, 'Dust ($1%) slashed solar recharge to just +$2%.'],
  [/^Sem proteção no Abrigo em "(.+?)" → Dano severo \(-\s*(\d+)% Energia, -\s*(\d+)% Saúde\)\.$/, 'No Shelter during "$1" → Heavy damage (-$2% Power, -$3% Health).'],
  [/^(\d+) ml ingeridos • Reservatório em (\d+)%$/, '$1 ml drunk • Tank at $2%'],
  [/^Sem hidratação guiada hoje • Reservatório em (\d+)%$/, 'No guided water today • Tank at $1%'],
  [/^Sol (\d+) tenso! (.+)$/, 'Rough Sol $1! $2'],
  [/^Superamos "(.+?)" no Sol (\d+), comandante! Continue racionando os 4 turnos!$/, 'We weathered "$1" on Sol $2, Commander! Keep rationing your 4 turns!'],
  [/^Sol (\d+) encerrado \(\+(\d+)% Solar \/ -(\d+)% Energia \/ -(\d+)% Água\)\.$/, 'Sol $1 wrapped up (+$2% Solar / -$3% Power / -$4% Water).'],
  [/^Refeição balanceada: (\d+) kcal \((.+)\)$/, 'Balanced meal: $1 kcal ($2)'],
  [/^Ração parcial \((\d+) kcal\)$/, 'Partial ration ($1 kcal)'],
  [/^Treino gravitacional realizado \((\d+)\/4 exercícios\)$/, 'Gravitational workout done ($1/4 exercises)'],
  [/^Telemetria do Sol (\d+)\/30 enviada à Terra\.$/, 'Sol $1/30 telemetry transmitted to Earth.'],
  [/^Telemetria do Sol (\d+)\/30 salva no servidor de bordo\.$/, 'Sol $1/30 telemetry saved on ship server.'],
  [/^Relatório da Missão 2 transmitido à Terra no Sol (\d+)\.$/, 'Mission 2 report sent to Earth on Sol $1.'],
  [/^Sem sinal direto no Sol (\d+): relatório da Missão 2 salvo no servidor da nave\.$/, 'No direct link on Sol $1: Mission 2 report saved on ship server.'],
  [/^Dados transmitidos à Terra no Sol (\d+)\.$/, 'Data transmitted to Earth on Sol $1.'],
  [/^Sem sinal direto no Sol (\d+): dados salvos no servidor da nave\.$/, 'No direct link on Sol $1: data saved on ship server.'],
  [/^Sol (\d+): Relatório de segurança e exposição à radiação validados! Central de Comunicação com a Terra \(Cena 6\) liberada\.$/, 'Sol $1: Safety & radiation report cleared! Earth Comms Center (Scene 6) unlocked.'],
  [/^Sol (\d+): Relatório da estufa e sistema bioregenerativo atualizados! Missão 5 desbloqueada\.$/, 'Sol $1: Greenhouse & ECLSS report synced! Mission 5 unlocked.'],
  [/^Sol (\d+): Descoberta de gelo e purificação de água concluídas! Missão 4 desbloqueada\.$/, 'Sol $1: Buried ice discovery & water lab complete! Mission 4 unlocked.'],
  [/^Sol (\d+): Saúde e sono monitorados \(NASA Spaceflight Standard Measures\)! Missão 3 desbloqueada\.$/, 'Sol $1: Health & sleep monitored (NASA Spaceflight Standard Measures)! Mission 3 unlocked.'],
  [/^Sol (\d+): Missão 1 concluída! Missão 2 desbloqueada para o novo dia\.$/, 'Sol $1: Mission 1 complete! Mission 2 unlocked for the new Sol.'],
  [/^Sol (\d+): recuperação de ciclo concluída com sucesso\.$/, 'Sol $1: recovery sleep cycle completed.'],
  [/^Contenção de emergência \($/, 'Emergency override ('],
  [/^acionamentos\)$/, 'taps)'],

  // EarthComms / FutureMars / SleepReport leftovers
  [/^ARCADIA PLANITIA • TODOS OS SETORES ATIVOS — SOL\s*$/, 'ARCADIA PLANITIA • ALL SECTORS ONLINE — SOL '],
  [/^5\/5 Missões Científicas Concluídas • Sol\s*$/, '5/5 Science Missions Completed • Sol '],
  [/^FOTOS DO ÁLBUM \($/, 'ALBUM PHOTOS ('],
  [/^Dados organizados \($/, 'Packaged data ('],
  [/^FOTOGRAFIAS E DIÁRIO EMPACOTADOS \($/, 'PHOTOS & LOGBOOK PACKAGED ('],
  [/^registro$/, 'entry'],
  [/^registros$/, 'entries'],
];

export function translatePtToEn(input: string): string {
  if (!input || !/[A-Za-zÀ-ÿ]/.test(input)) return input;

  // Preserve leading and trailing whitespace so inline JSX spacing stays intact
  const wsMatch = input.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (!wsMatch) return input;
  const [, lead, core, trail] = wsMatch;
  if (!core) {
    return input;
  }

  // Handle standalone whitespace-padded ' e '
  if (core === 'e' && (lead.length > 0 || trail.length > 0)) {
    return `${lead}and${trail}`;
  }

  const collapsed = core.replace(/\s+/g, ' ');
  const exact = EXACT_PAIRS[collapsed];
  if (exact) {
    return `${lead}${exact}${trail}`;
  }

  let out = collapsed;
  for (const [pattern, replacement] of PATTERN_RULES) {
    if (typeof replacement === 'string') {
      out = out.replace(pattern, replacement);
    } else {
      out = out.replace(pattern, replacement);
    }
  }

  if (out !== collapsed) {
    return `${lead}${out}${trail}`;
  }

  // Also check unit decimals inside un-matched strings with Portuguese words or numbers
  return input;
}
