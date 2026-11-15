import React, { useEffect, useState } from 'react';
import { Rocket, Sparkles } from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

const SYSTEM_MESSAGES = [
  'DECOLAGEM CONFIRMADA!',
  'Sistemas de navegação ativados.',
  'Destino: MARTE.',
  'Região de exploração: ARCADIA PLANITIA.',
  'Ativando assistente virtual de bordo...',
];

export const LaunchScene: React.FC = () => {
  const { setScene } = useGameStore();
  const [visibleLines, setVisibleLines] = useState(1);
  const [vibrating, setVibrating] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    soundEngine.playLaunchRumble(1.9);
    const stopShake = window.setTimeout(() => setVibrating(false), 1800);
    return () => window.clearTimeout(stopShake);
  }, []);

  useEffect(() => {
    if (visibleLines >= SYSTEM_MESSAGES.length) return;
    const timer = window.setTimeout(() => {
      soundEngine.playClick();
      setVisibleLines((prev) => prev + 1);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [visibleLines]);

  const allShown = visibleLines >= SYSTEM_MESSAGES.length;

  const handleActivateCapi = () => {
    soundEngine.playSuccess();
    setScene('CAPI_INTRO');
  };

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-3 py-4 pb-28 sm:pb-24">
      <div
        className={`pixel-box relative overflow-hidden bg-slate-950 ${
          vibrating ? 'animate-engineShake' : ''
        }`}
      >
        {/* Fundo do cockpit com a Terra vista pelas janelas */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
          {!imgError ? (
            <img
              src={ASSET_MANIFEST.bgCockpitLaunch.path}
              alt={ASSET_MANIFEST.bgCockpitLaunch.alt}
              onError={() => setImgError(true)}
              className="pixel-art h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-900 font-pixel text-xs text-cyan-300">
              {ASSET_MANIFEST.bgCockpitLaunch.fallbackLabel}
            </div>
          )}

          {/* Pequena luz azul pulsante no painel central */}
          <button
            type="button"
            onClick={handleActivateCapi}
            title="Clique na luz central para ativar a Capi"
            className="absolute bottom-[11%] left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border-2 border-cyan-300 bg-cyan-500/80 px-3 py-1 font-pixel text-[8px] text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.95)] transition hover:scale-105"
          >
            <span className="h-2.5 w-2.5 animate-ping rounded-full bg-white" />
            PAINEL CENTRAL
          </button>

          {/* Terminal do Sistema da Espaçonave */}
          <div className="absolute left-4 top-4 w-[calc(100%-2rem)] max-w-md rounded-sm border-2 border-cyan-400/80 bg-slate-950/90 p-3.5 shadow-xl hologram-grid">
            <div className="mb-2 flex items-center gap-2 border-b border-cyan-500/40 pb-1.5">
              <Rocket className="h-4 w-4 text-orange-400" />
              <span className="font-pixel text-[9px] text-cyan-300">
                SISTEMA DA ESPAÇONAVE
              </span>
            </div>

            <ul className="space-y-1 font-dialog text-xs sm:text-sm">
              {SYSTEM_MESSAGES.slice(0, visibleLines).map((line, index) => (
                <li
                  key={line}
                  className={
                    index === 0
                      ? 'font-bold text-emerald-300'
                      : index === SYSTEM_MESSAGES.length - 1
                      ? 'animate-pulse text-cyan-300'
                      : 'text-slate-100'
                  }
                >
                  &gt; {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Ação para avançar para a Cena 3 */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border-2 border-slate-800 bg-slate-950 p-3">
        <p className="font-dialog text-xs text-slate-300 sm:text-sm">
          {allShown
            ? 'Uma pequena luz ciano brilhou no painel central da nave!'
            : 'Atravessando a atmosfera terrestre em direção a Marte...'}
        </p>
        <button
          type="button"
          onClick={handleActivateCapi}
          className="pixel-btn inline-flex items-center gap-2 bg-cyan-400 px-4 py-2 font-pixel text-[10px] text-slate-950 hover:bg-cyan-300"
        >
          <Sparkles className="h-4 w-4" />
          Ativar Assistente Virtual ▶
        </button>
      </div>
    </section>
  );
};
