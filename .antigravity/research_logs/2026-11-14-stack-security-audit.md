# Auditoria de Segurança e Pesquisa Tecnológica — Stack Web (14/11/2026)

## Projeto
**Aventura em Marte: Arcadia Planitia** (SPA educativa em Pixel Art 16-bit para crianças de 7 a 12 anos).

## 1. Estado da Arte da Stack (2026)
- **React 18 (`^18.3.1`) + TypeScript (`^5.6.3`) + Vite (`^6.4.1` / `^7.x`) + Tailwind CSS (`^3.4.17`)**:
  - Arquitetura 100% Single Page Application (SPA) rodando exclusivamente no navegador, com persistência local via `localStorage` e áudio procedural via Web Audio API nativa.
  - Fontes Google Fonts: `Press Start 2P` (títulos, placares, contagem regressiva) e `Silkscreen` (diálogos curtos legíveis para crianças).

## 2. Análise de Segurança e Mitigações (Últimos 3–6 meses em 2026)
- **Vite Development Server (`CVE-2026-39363`, `CVE-2026-39364`, `CVE-2026-53571`, `CVE-2026-112946`, `CVE-2026-112947`)**:
  - **Risco:** Falhas de traversal e exposição de arquivos locais no dev server do Vite (incluindo ADS/8.3 no Windows e WebSocket sem validação de Origin).
  - **Mitigação aplicada:**
    1. Utilizar versão atualizada do Vite (`>= 6.4.4` ou `>= 7.3.7` / `8.x` se compatível).
    2. Configurar `server.fs.strict: true` e `server.fs.deny: ['.env', '.env.*', '*.{crt,pem}', 'package.json']` no `vite.config.ts`.
    3. Não expor o dev server publicamente (`host: '127.0.0.1'` / padrão localhost).
- **React Ecosystem (`CVE-2025-55182` — React Server Components RCE)**:
  - **Risco:** Vulnerabilidades críticas em adaptadores React Server Components (RSC).
  - **Mitigação aplicada:** O projeto é uma SPA puramente client-side sem RSC, SSR ou backend exposto, mantendo-se isento dessa classe de ataque.
- **XSS e Sanitização em React/Tailwind**:
  - Proibido o uso de `dangerouslySetInnerHTML`.
  - Proibida interpolação dinâmica de strings em classes Tailwind (ex.: ``bg-${color}-500``); todas as variantes de cores do traje espacial utilizam mapas/whitelists estáticas em TypeScript.
  - Modo `"strict": true` ativado no `tsconfig.json`.

## 3. Fundamentação Científica Oficial da NASA Incorporada
- **NASA GISS — Mars24 Algorithm**: Cálculo da posição aparente do Sol em Marte (ângulo zenital, elevação e azimute solares).
- **NASA — First Ice Cores from Mars & MRO SHARAD**: Metodologia em camadas (orbital, radar, estudos prévios, perfurações exploratórias) aplicada em Arcadia Planitia.
- **NASA — Spaceflight Standard Measures**: Inspiração para o painel simulado de saúde, actigrafia/sono e registro de atividades (com aviso pedagógico claro de que os dados do jogo são simulados).
