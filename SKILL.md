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
