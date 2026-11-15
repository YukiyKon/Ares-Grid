---
name: etapa1-intro-arquitetura
description: Monta a arquitetura modular de "Aventura em Marte: Arcadia Planitia" e implementa exclusivamente a Etapa 1 (Sprites da Abertura via Nano Banana, Cenas 1 a 4, Personalização do Astronauta, Capi e Mecânicas Permanentes).
---

# Escopo e Arquitetura — Etapa 1 (Abertura e Núcleo do Jogo)

## 1. Arquitetura Modular Obrigatória (`src/`)

Estruture o projeto em React 18 + TypeScript + Vite + Tailwind CSS para permitir
adicionar cada missão depois como um módulo isolado:

- `src/core/gameStore.ts`: Estado global persistido em `localStorage` (perfil do
  astronauta personalizado, cena atual, missão desbloqueada, energia, água,
  saúde simulada e álbum de fotos do diário).
- `src/core/SceneManager.tsx`: Máquina de estados que controla o fluxo:
  `COUNTDOWN` -> `LAUNCH` -> `CAPI_INTRO` -> `CUSTOMIZE` -> `LANDING` ->
  `BASE_HUB` -> `MISSION_1` (stub inicial para a Etapa 2).
- `src/core/soundEngine.ts`: Sintetizador Web Audio API (bipes de contagem
  regressiva, som crescente de motores na decolagem, efeitos de clique e alerta
  de pouso).
- `src/assets/assetManifest.ts`: Registro centralizado dos caminhos de sprites
  em `public/assets/sprites/` com fallback visual elegante caso um sprite de
  missão futura ainda não tenha sido gerado.
- `src/components/permanent/`:
  - `CapiAssistant.tsx`: Janela holográfica no canto inferior direito com o
    retrato pixelado da Capivara **Capi**, exibindo diálogos curtos (2 a 3
    linhas por balão) com botão `Próximo ▶`.
  - `LogbookModal.tsx`: Diário de Bordo com 3 registros rápidos (`1. Evento`,
    `2. Aspecto observado`, `3. Fotografia`).
  - `SleepReportModal.tsx`: Cena especial do sono onde a Capi processa as 7
    etapas (saúde simulada, sono, atividades, pesquisas, servidor de bordo,
    envio à Terra e confirmação).
- `src/scenes/intro/`: `CountdownScene.tsx`, `LaunchScene.tsx`,
  `CapiIntroScene.tsx`, `CustomizeScene.tsx` e `LandingScene.tsx`.

## 2. Direção de Arte Pixel Art 16-bit (Nano Banana)

- Todos os sprites devem ser gerados no estilo **Pixel Art 16-bit vibrante
  (Stardew Valley / Pokémon GBA)** com `image-rendering: pixelated;` no CSS e
  fontes pixeladas legíveis (`Silkscreen` / `Press Start 2P`).
- Sprites de personagens e objetos isolados devem ter o fundo recortado
  (transparência real `.png` RGBA).

## 3. Regra de Contenção de Escopo

- **NÃO implemente ainda as Missões 2, 3, 4 ou 5.**
- Na **Cena 4 (Pouso em Arcadia Planitia)**, ao clicar em **"Iniciar Missão 1:
  Energia Solar"**, leve o jogador para a tela limpa da Base em Arcadia Planitia
  com a Capi apresentando o objetivo da Missão 1 (pronto para a próxima etapa de
  desenvolvimento).

---
name: i18n-mobile-architect
description: Implementa arquitetura bilíngue (Inglês padrão + Português opcional) e adapta toda a interface, HUD e mini-games táteis para celulares e tablets com validação visual no navegador integrado.
---

# Padrões de Internacionalização (EN/PT) e Responsividade Mobile/Tablet

Ao refatorar o projeto para suporte bilíngue e dispositivos móveis, siga
rigorosamente estas regras:

## 1. Arquitetura Bilíngue (`src/i18n/`)

- Crie um contexto leve `LanguageContext.tsx` com dicionários tipados `en.ts`
  (padrão inicial: `'en'`) e `pt.ts` (`'pt'`), salvando a preferência do jogador
  em `localStorage` (`astro_capi_lang`).
- **Zero strings hardcoded:** Varra todos os componentes (`StartScreen`,
  `TopStatusHUD`, cenas de introdução, `BASE_HUB`, `ArcadiaMapModal`, `mission1`
  a `mission5`, `survival30`, `LogbookModal`, `SleepReportModal`,
  `EarthCommsScene`, `FutureMarsScene` e falas da `Capi`) para que todo texto
  visível venha da função `t('chave')`.
- **Certificado e Diário Dinâmicos:** O certificado baixado em `.png` e os
  registros gerados no Diário de Bordo e no Relatório de Sono devem respeitar o
  idioma ativo no momento da geração.

## 2. Adaptação para Mobile e Tablet (Touch-First & Responsive UI)

- **Viewport Mobile Real:** Use `min-h-[100dvh]` em vez de `100vh` para evitar
  cortes causados pela barra de endereço do Chrome/Safari mobile.
- **Alvos de Toque (Touch Targets):** Todos os botões, abas e controles
  interativos devem ter altura mínima de `44px` (`min-h-[44px]`) e espaçamento
  adequado para dedos de crianças (7–12 anos).
- **Prevenção de Scroll Acidental:** Todos os mini-games de arrastar, esfregar
  ou segurar (`DustScrubCanvas`, scanner orbital, bandeja de alimentos,
  dispensador de água, broca térmica, vedação de escotilhas e corrida para o
  abrigo) devem conter `touch-none select-none` e `onPointerDown` /
  `onPointerMove` / `onPointerUp` com `setPointerCapture`.
- **Janela da Capi Responsiva:** Em telas menores que `768px` (`md`), a caixa
  holográfica da **Capi** deve ocupar a largura inferior (`inset-x-2 bottom-2`)
  de forma compacta ou recolhível, e o conteúdo principal deve ter `pb-36` para
  nunca obstruir botões de ação.
- **Orientação e Grids:** Converta layouts de duas colunas fixas em grids
  responsivos (`grid-cols-1 lg:grid-cols-2`), permitindo jogar confortavelmente
  tanto em tablets (`768x1024`) quanto em smartphones (`390x844`).

## 3. Validação Obrigatória

- Teste no navegador integrado do Antigravity em três resoluções: **Desktop
  (`1366x768`)**, **Tablet (`768x1024`)** e **Mobile (`390x844`)**, alternando o
  seletor `EN / PT` em tempo real e verificando se não há overflow horizontal
  (`overflow-x-hidden`) nem textos cortados.
