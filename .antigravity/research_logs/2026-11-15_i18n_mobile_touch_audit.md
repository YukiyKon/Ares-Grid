# Pesquisa Técnica: Internacionalização (`EN/PT`), iOS Safari Fullscreen e Responsividade Mobile/Tablet

- **Data:** 2026-11-15
- **Escopo:** `i18n-mobile-architect` — `Mars Adventure: Arcadia Planitia` (React 18 + TypeScript + Vite + Tailwind CSS)

## 1. Estado da Arte e Padrões de Web Games Mobile/Tablet (2025/2026)

1. **Fullscreen API vs. iOS Safari:**
   - O Safari no iOS não implementa `Element.prototype.requestFullscreen()` para elementos HTML genéricos (`document.documentElement`), suportando apenas `webkitEnterFullScreen` nativo em `<video>`.
   - **Solução adotada:** Detectar suporte (`document.fullscreenEnabled && Boolean(document.documentElement.requestFullscreen)`) antes de chamar `requestFullscreen().catch(() => {})` e aplicar um modo **Pseudo-Fullscreen via CSS** (`.pseudo-fullscreen` com `position: fixed; inset: 0; width: 100vw; height: 100dvh; z-index: 9999;`) em dispositivos sem suporte nativo, evitando qualquer exceção no console.

2. **Dynamic Viewport (`100dvh`) e Prevenção de Overflow Horizontal:**
   - Telas mobile sofrem cortes verticais com `100vh` devido à barra dinâmica de endereços do Chrome/Safari móvel. O uso de `min-h-[100dvh]` aliado a `overflow-x: hidden` garante encaixe fluido em retrato (`390x844`), paisagem e tablets (`768x1024`).

3. **Touch-First & PointerEvents:**
   - Controles táteis (`DustScrubCanvas`, `DrillHeatControl`, `TimingBarGame`, drag-and-drop de alimentos, dispensador de água, scanner orbital, borrifador da estufa e travas de tempestade) utilizam `touch-none select-none` (`touch-action: none`) + `onPointerDown`/`onPointerMove`/`onPointerUp`/`setPointerCapture`.
   - Botões e controles de UI utilizam `touch-action: manipulation` e área mínima confortável (`min-h-[40px]` / `44px`) para evitar zoom acidental por duplo toque em crianças (7–12 anos).

4. **Arquitetura Bilíngue (`src/i18n/`):**
   - Inglês (`'en'`) como padrão inicial ao abrir o jogo pela primeira vez (`localStorage` chave `astro_capi_lang`), com alternância instantânea para Português (`'pt'`) preservando integralmente o estado da expedição.
   - Certificados `.PNG`, fotos do Diário de Bordo em canvas, sugestões automáticas e falas dinâmicas da Capi leem o idioma ativo em tempo real.
