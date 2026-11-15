import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, SunMedium } from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { AstronautAvatar } from '../../components/permanent/AstronautAvatar';
import { CapiAssistant } from '../../components/permanent/CapiAssistant';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

const CAPI_LANDING_LINES = [
  'Conseguimos, comandante! Estamos em Marte! Olhe pela janela que lugar diferente!',
  'Mas temos um problema: precisamos garantir energia para iluminação, comunicação e o laboratório.',
  'Não podemos colocar os painéis solares em qualquer posição! Precisamos calcular onde e como instalá-los.',
  'Clique em "Iniciar Missão 1: Energia Solar" para entrarmos na Base de Arcadia Planitia!',
];

export const LandingScene: React.FC = () => {
  const { state, setScene } = useGameStore();
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    soundEngine.playAlert();
  }, []);

  const handleStartMission1 = () => {
    soundEngine.playSuccess();
    setScene('BASE_HUB');
  };

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-3 py-4 pb-52 sm:pb-44">
      <div className="pixel-box-mars relative overflow-hidden bg-slate-950">
        <div className="relative aspect-video w-full overflow-hidden bg-orange-950">
          {!imgError ? (
            <img
              src={ASSET_MANIFEST.bgMarsLanding.path}
              alt={ASSET_MANIFEST.bgMarsLanding.alt}
              onError={() => setImgError(true)}
              className="pixel-art h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-orange-950 font-pixel text-xs text-orange-200">
              {ASSET_MANIFEST.bgMarsLanding.fallbackLabel}
            </div>
          )}

          {/* Avatar do astronauta personalizado pousando */}
          <div className="absolute bottom-4 left-6 flex items-end gap-2">
            <AstronautAvatar profile={state.astronaut} size="md" />
            <span className="rounded-sm border border-orange-400 bg-slate-950/90 px-2 py-0.5 font-pixel text-[8px] text-orange-200">
              {state.astronaut.name}
            </span>
          </div>

          {/* Painel do Sistema da Espaçonave no Pouso */}
          <div className="absolute left-4 top-4 w-[calc(100%-2rem)] max-w-lg rounded-sm border-2 border-orange-400 bg-slate-950/92 p-3.5 shadow-xl">
            <div className="mb-2 flex items-center gap-2 border-b border-orange-500/40 pb-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="font-pixel text-[9px] text-orange-300">
                SISTEMA DA ESPAÇONAVE — POUSO CONFIRMADO!
              </span>
            </div>

            <ul className="space-y-1 font-dialog text-xs text-slate-100">
              <li>
                <span className="text-slate-400">Localização:</span> Arcadia Planitia – Marte
              </li>
              <li>
                <span className="text-slate-400">Sistemas de suporte à vida:</span>{' '}
                <span className="font-bold text-emerald-300">OPERACIONAIS</span>
              </li>
              <li>
                <span className="text-slate-400">Equipamentos científicos:</span>{' '}
                <span className="font-bold text-emerald-300">OPERACIONAIS</span>
              </li>
              <li className="mt-1 flex items-center gap-1.5 rounded-sm border border-amber-400/70 bg-amber-950/80 px-2 py-1 text-amber-200">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-300" />
                <span>
                  <strong>Energia externa:</strong> SISTEMA SOLAR AINDA NÃO INSTALADO.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border-2 border-orange-500/40 bg-slate-950 p-3">
        <div>
          <h2 className="font-pixel text-[11px] text-orange-300">
            CENA 4 — POUSO EM ARCADIA PLANITIA
          </h2>
          <p className="mt-1 font-dialog text-xs text-slate-300">
            Primeira missão obrigatória pronta para iniciar na base marciana.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartMission1}
          className="pixel-btn inline-flex items-center gap-2 bg-amber-400 px-4 py-2.5 font-pixel text-[10px] text-slate-950 hover:bg-amber-300"
        >
          <SunMedium className="h-4 w-4" />
          Iniciar Missão 1: Energia Solar
        </button>
      </div>

      <CapiAssistant
        lines={CAPI_LANDING_LINES}
        onComplete={handleStartMission1}
        completeLabel="Missão 1 ▶"
      />
    </section>
  );
};
