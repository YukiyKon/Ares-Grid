import React, { useState } from 'react';
import { Check, Rocket, UserCog } from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import {
  AstronautAvatar,
  BACKPACK_LABELS,
  BADGE_LABELS,
  HELMET_LABELS,
  SUIT_PALETTES,
} from '../../components/permanent/AstronautAvatar';
import { CapiAssistant } from '../../components/permanent/CapiAssistant';
import {
  type BackpackStyleId,
  type BadgeStyleId,
  type HelmetStyleId,
  type SuitColorId,
  useGameStore,
} from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

const SUIT_BUTTON_CLASSES: Record<SuitColorId, string> = {
  white: 'bg-slate-100 text-slate-950 border-slate-300',
  orange: 'bg-orange-400 text-slate-950 border-orange-200',
  cyan: 'bg-sky-400 text-slate-950 border-sky-200',
  emerald: 'bg-emerald-400 text-slate-950 border-emerald-200',
  violet: 'bg-purple-400 text-slate-950 border-purple-200',
};

export const CustomizeScene: React.FC = () => {
  const { state, updateAstronaut, setScene } = useGameStore();
  const [savedConfirmed, setSavedConfirmed] = useState(state.astronaut.isCustomized);

  const capiLines = savedConfirmed
    ? [
        `Prontinho, ${state.astronaut.name}! Agora temos um astronauta preparado para o Planeta Vermelho.`,
        'Atenção, comandante! Nossa primeira tarefa começará assim que pousarmos em Marte!',
      ]
    : [
        'Escolha um nome para seu astronauta e personalize seu traje espacial!',
        'Você pode escolher a cor do uniforme, o capacete, a mochila e a insígnia da roupa.',
      ];

  const handleConfirmProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = state.astronaut.name.trim() || 'Comandante';
    updateAstronaut({ name: cleanName, isCustomized: true });
    soundEngine.playSuccess();
    setSavedConfirmed(true);
  };

  const handleProceedLanding = () => {
    if (!state.astronaut.isCustomized) {
      updateAstronaut({
        name: state.astronaut.name.trim() || 'Comandante',
        isCustomized: true,
      });
    }
    soundEngine.playClick();
    setScene('LANDING');
  };

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-3 py-4 pb-52 sm:pb-44">
      <div className="pixel-box-mars overflow-hidden bg-slate-950 p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between border-b-2 border-orange-500/40 pb-2.5">
          <div className="flex items-center gap-2">
            <UserCog className="h-5 w-5 text-orange-400" />
            <h1 className="font-pixel text-xs text-orange-300 sm:text-sm">
              CENA 3.1 — PERSONALIZAÇÃO DO ASTRONAUTA
            </h1>
          </div>
          <span className="font-dialog text-xs text-slate-400">Salvo no navegador</span>
        </div>

        <form onSubmit={handleConfirmProfile} className="grid gap-6 md:grid-cols-[260px_1fr]">
          {/* Pré-visualização ao vivo do Astronauta */}
          <div className="flex flex-col items-center justify-between rounded-sm border-2 border-slate-800 bg-slate-900/90 p-4 hologram-grid">
            <div className="text-center">
              <span className="font-pixel text-[9px] text-cyan-300">PRÉVIA DO TRAJE</span>
              <p data-no-i18n="true" className="mt-1 font-dialog text-sm font-bold text-white">
                {state.astronaut.name || 'Comandante'}
              </p>
            </div>

            <div className="my-3 flex items-center justify-center rounded-sm border-2 border-cyan-500/40 bg-slate-950/90 p-4">
              <AstronautAvatar profile={state.astronaut} size="lg" />
            </div>

            <div className="flex items-center gap-2 rounded-sm border border-slate-700 bg-slate-950 px-2.5 py-1.5">
              <img
                src={ASSET_MANIFEST.astronautBase.path}
                alt="Modelo base 16-bit"
                className="pixel-art h-8 w-8 object-contain"
              />
              <span className="font-dialog text-[11px] text-slate-300">
                Modelo 16-bit • {SUIT_PALETTES[state.astronaut.suitColor].label}
              </span>
            </div>
          </div>

          {/* Controles de personalização */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="astronaut-name-input"
                className="mb-1.5 block font-pixel text-[10px] text-cyan-300"
              >
                NOME DO ASTRONAUTA
              </label>
              <input
                id="astronaut-name-input"
                type="text"
                maxLength={22}
                required
                value={state.astronaut.name}
                onChange={(e) => {
                  setSavedConfirmed(false);
                  updateAstronaut({ name: e.target.value });
                }}
                placeholder="Digite seu nome de explorador"
                className="w-full rounded-sm border-2 border-slate-700 bg-slate-900 px-3 py-2 font-dialog text-sm text-white focus:border-orange-400 focus:outline-none"
              />
            </div>

            {/* Cor do uniforme */}
            <div>
              <span className="mb-1.5 block font-pixel text-[10px] text-cyan-300">
                COR DO UNIFORME
              </span>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(SUIT_PALETTES) as SuitColorId[]).map((colorId) => {
                  const selected = state.astronaut.suitColor === colorId;
                  return (
                    <button
                      key={colorId}
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setSavedConfirmed(false);
                        updateAstronaut({ suitColor: colorId });
                      }}
                      className={`pixel-btn border-2 px-3 py-1.5 font-dialog text-xs font-bold ${
                        SUIT_BUTTON_CLASSES[colorId]
                      } ${selected ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950' : 'opacity-85'}`}
                    >
                      {SUIT_PALETTES[colorId].label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Capacete */}
            <div>
              <span className="mb-1.5 block font-pixel text-[10px] text-cyan-300">
                CAPACETE E VISOR
              </span>
              <div className="grid gap-2 sm:grid-cols-3">
                {(Object.keys(HELMET_LABELS) as HelmetStyleId[]).map((helmetId) => {
                  const selected = state.astronaut.helmetStyle === helmetId;
                  return (
                    <button
                      key={helmetId}
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setSavedConfirmed(false);
                        updateAstronaut({ helmetStyle: helmetId });
                      }}
                      className={`rounded-sm border-2 px-2.5 py-2 font-dialog text-xs transition ${
                        selected
                          ? 'border-cyan-400 bg-cyan-950/70 text-cyan-100'
                          : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {HELMET_LABELS[helmetId]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mochila */}
            <div>
              <span className="mb-1.5 block font-pixel text-[10px] text-cyan-300">
                MOCHILA DE SUPORTE
              </span>
              <div className="grid gap-2 sm:grid-cols-3">
                {(Object.keys(BACKPACK_LABELS) as BackpackStyleId[]).map((packId) => {
                  const selected = state.astronaut.backpackStyle === packId;
                  return (
                    <button
                      key={packId}
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setSavedConfirmed(false);
                        updateAstronaut({ backpackStyle: packId });
                      }}
                      className={`rounded-sm border-2 px-2.5 py-2 font-dialog text-xs transition ${
                        selected
                          ? 'border-orange-400 bg-orange-950/60 text-orange-100'
                          : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {BACKPACK_LABELS[packId]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Insígnia da roupa */}
            <div>
              <span className="mb-1.5 block font-pixel text-[10px] text-cyan-300">
                INSÍGNIA / DETALHE DA ROUPA
              </span>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(Object.keys(BADGE_LABELS) as BadgeStyleId[]).map((badgeId) => {
                  const selected = state.astronaut.badgeStyle === badgeId;
                  return (
                    <button
                      key={badgeId}
                      type="button"
                      onClick={() => {
                        soundEngine.playClick();
                        setSavedConfirmed(false);
                        updateAstronaut({ badgeStyle: badgeId });
                      }}
                      className={`rounded-sm border-2 px-2 py-1.5 font-dialog text-xs transition ${
                        selected
                          ? 'border-amber-400 bg-amber-950/60 text-amber-100'
                          : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {BADGE_LABELS[badgeId]}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                className="pixel-btn inline-flex items-center gap-1.5 bg-emerald-400 px-4 py-2 font-pixel text-[10px] text-slate-950 hover:bg-emerald-300"
              >
                <Check className="h-4 w-4" />
                Confirmar Traje
              </button>

              <button
                type="button"
                onClick={handleProceedLanding}
                className="pixel-btn inline-flex items-center gap-1.5 bg-orange-400 px-4 py-2 font-pixel text-[10px] text-slate-950 hover:bg-orange-300"
              >
                <Rocket className="h-4 w-4" />
                Ir para Pouso em Marte ▶
              </button>
            </div>
          </div>
        </form>
      </div>

      <CapiAssistant
        lines={capiLines}
        onComplete={savedConfirmed ? handleProceedLanding : undefined}
        completeLabel="Pousar em Marte ▶"
      />
    </section>
  );
};
