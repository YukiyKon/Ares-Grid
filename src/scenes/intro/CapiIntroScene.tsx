import React from 'react';
import { Compass, MapPin, Sparkles } from 'lucide-react';
import { CapiAssistant } from '../../components/permanent/CapiAssistant';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

const CAPI_INTRO_LINES = [
  'Olááá, astronauta! Finalmente vamos nos conhecer! Eu sou a Capi, sua assistente virtual.',
  'Vou monitorar os sistemas da nave, ajudar nos experimentos e lembrar você de cuidar da saúde.',
  'Mas não vou fazer tudo sozinha! Você será o pesquisador responsável pelas descobertas.',
  'Nosso destino é Arcadia Planitia, uma região de Marte cheia de pistas de gelo subterrâneo!',
  'Antes de começarmos, preciso saber quem está comigo nessa aventura! Vamos personalizar seu traje?',
];

export const CapiIntroScene: React.FC = () => {
  const { setScene } = useGameStore();

  const handleGoCustomize = () => {
    soundEngine.playClick();
    setScene('CUSTOMIZE');
  };

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-3 py-4 pb-52 sm:pb-44">
      <div className="pixel-box overflow-hidden bg-slate-950 p-5 hologram-grid">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b-2 border-cyan-500/40 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-300" />
            <h1 className="font-pixel text-xs text-cyan-200 sm:text-sm">
              INTERFACE DE ASSISTÊNCIA VIRTUAL — CAPI
            </h1>
          </div>
          <span className="rounded-sm border border-emerald-400/60 bg-emerald-950/60 px-2 py-0.5 font-dialog text-xs text-emerald-300">
            CONEXÃO HOLOGRÁFICA ATIVA
          </span>
        </div>

        {/* Painel informativo da rota Terra -> Arcadia Planitia */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-sm border-2 border-cyan-500/40 bg-slate-900/90 p-4">
            <div className="mb-2 flex items-center gap-2 text-orange-300">
              <MapPin className="h-4 w-4" />
              <h2 className="font-pixel text-[10px]">DESTINO: ARCADIA PLANITIA</h2>
            </div>
            <p className="font-dialog text-xs leading-relaxed text-slate-200 sm:text-sm">
              Planície extensa no hemisfério norte de Marte. Estudos da NASA indicam
              evidências de gelo subterrâneo raso — um local estratégico para pesquisas
              científicas e futuras bases humanas!
            </p>
          </div>

          <div className="rounded-sm border-2 border-cyan-500/40 bg-slate-900/90 p-4">
            <div className="mb-2 flex items-center gap-2 text-cyan-300">
              <Compass className="h-4 w-4" />
              <h2 className="font-pixel text-[10px]">PAPEL DO PESQUISADOR</h2>
            </div>
            <p className="font-dialog text-xs leading-relaxed text-slate-200 sm:text-sm">
              Durante toda a viagem você vai formular hipóteses, instalar equipamentos,
              fotografar descobertas no Diário de Bordo e enviar dados para a Terra.
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={handleGoCustomize}
            className="pixel-btn bg-orange-400 px-4 py-2.5 font-pixel text-[10px] text-slate-950 hover:bg-orange-300"
          >
            Personalizar Astronauta ▶
          </button>
        </div>
      </div>

      {/* Capi no canto inferior direito */}
      <CapiAssistant
        dialogId="intro_capi_welcome"
        lines={CAPI_INTRO_LINES}
        onComplete={handleGoCustomize}
        completeLabel="Personalizar ▶"
      />
    </section>
  );
};
