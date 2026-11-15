import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Database,
  FileCheck2,
  Radio,
  Satellite,
  Sparkles,
} from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { AstronautAvatar } from '../../components/permanent/AstronautAvatar';
import { CapiAssistant } from '../../components/permanent/CapiAssistant';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

const EXPEDITION_MISSIONS = [
  {
    title: 'Missão 1 — Energia solar',
    summary: 'Instalação e monitoramento dos painéis solares (NASA Mars24).',
  },
  {
    title: 'Missão 2 — Saúde humana',
    summary: 'Monitoramento da saúde e rotina do astronauta (Spaceflight Standard Measures).',
  },
  {
    title: 'Missão 3 — Geologia e água',
    summary: 'Radar SHARAD, perfurações, amostras e estudos de água (First Ice Cores from Mars).',
  },
  {
    title: 'Missão 4 — Agricultura espacial',
    summary: 'Construção da estufa e acompanhamento das plantas (Sistemas Bioregenerativos ECLSS).',
  },
  {
    title: 'Missão 5 — Proteção ambiental',
    summary: 'Tempestades de poeira, radiação solar e proteção (NASA Dust in the Wind & Real Martians).',
  },
];

type TransmitStage =
  | 'IDLE'
  | 'PREPARING'
  | 'SEARCHING_SIGNAL'
  | 'CONFIRMING'
  | 'DELIVERED';

export const EarthCommsScene: React.FC = () => {
  const { state, setScene, transmitAllLogsToEarth } = useGameStore();
  const [stage, setStage] = useState<TransmitStage>(
    state.mission5.earthTransmissionCompleted ? 'DELIVERED' : 'IDLE'
  );

  useEffect(() => {
    if (stage === 'PREPARING') {
      const t = window.setTimeout(() => {
        soundEngine.playClick();
        setStage('SEARCHING_SIGNAL');
      }, 900);
      return () => window.clearTimeout(t);
    }
    if (stage === 'SEARCHING_SIGNAL') {
      const t = window.setTimeout(() => {
        soundEngine.playClick();
        setStage('CONFIRMING');
      }, 1100);
      return () => window.clearTimeout(t);
    }
    if (stage === 'CONFIRMING') {
      const t = window.setTimeout(() => {
        soundEngine.playSuccess();
        transmitAllLogsToEarth();
        setStage('DELIVERED');
      }, 1000);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [stage, transmitAllLogsToEarth]);

  const handleStartTransmission = () => {
    soundEngine.playClick();
    setStage('PREPARING');
  };

  const capiLines =
    stage === 'DELIVERED'
      ? [
          'CONSEGUIMOS! Os cientistas da Terra receberam nossas informações!',
          'Descobrimos como instalar um sistema de energia solar, investigamos o solo, estudamos a água, construímos uma estufa e aprendemos a nos proteger dos fenômenos ambientais de Marte.',
          'Você não é apenas um astronauta. É um pesquisador!',
        ]
      : stage === 'IDLE'
      ? [
          'Comandante, conseguimos realizar todas as nossas missões!',
          'Mas ainda precisamos compartilhar nossos resultados com os cientistas da Terra. Vamos conferir nosso diário de bordo e clicar em "Transmitir Dados à Terra"!',
        ]
      : [
          'Organizando pacotes no servidor da espaçonave e buscando o alinhamento orbital com a Central Terrestre...',
        ];

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-3 py-4 pb-52 sm:pb-44">
      <div className="pixel-box flex flex-wrap items-center justify-between gap-2 bg-slate-950 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Satellite className="h-5 w-5 text-cyan-300" />
          <div>
            <h1 className="font-pixel text-xs text-cyan-200">
              CENA 6 — A CENTRAL DE COMUNICAÇÃO COM A TERRA
            </h1>
            <p className="font-dialog text-xs text-slate-300">
              Retorno à espaçonave • Empacotamento do Diário Científico e Envio Orbital
            </p>
          </div>
        </div>
        <span className="rounded-sm border border-cyan-400/70 bg-cyan-950/70 px-2.5 py-1 font-pixel text-[8px] text-cyan-200">
          {stage === 'DELIVERED' ? 'DADOS RECEBIDOS PELA TERRA ✓' : 'SERVIDOR PRONTO'}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.05fr_1.15fr]">
        {/* Cenário 16-bit da sala de comunicação + Terminal de Transmissão */}
        <div className="space-y-3">
          <div className="pixel-box relative aspect-video overflow-hidden bg-slate-950">
            <img
              src={ASSET_MANIFEST.earthCommsRoom.path}
              alt={ASSET_MANIFEST.earthCommsRoom.alt}
              className="pixel-art h-full w-full object-cover"
            />
            <div className="absolute bottom-2 left-3 flex items-end gap-2">
              <AstronautAvatar profile={state.astronaut} size="md" />
              <span className="rounded-sm border border-cyan-400/70 bg-slate-950/90 px-2 py-0.5 font-pixel text-[8px] text-cyan-200">
                {state.astronaut.name}
              </span>
            </div>
            <div className="absolute right-2 top-2 rounded-sm border border-emerald-400/70 bg-slate-950/90 px-2 py-0.5 font-pixel text-[8px] text-emerald-200">
              PLANETA TERRA NA ESCUTA
            </div>
          </div>

          {/* Terminal da espaçonave com animação fiel ao roteiro (página 38) */}
          <div className="rounded-sm border-2 border-cyan-500/50 bg-slate-950 p-3 font-dialog text-xs">
            <div className="mb-2 grid grid-cols-2 gap-2">
              <div className="rounded-sm border border-slate-800 bg-slate-900 p-2">
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Database className="h-3.5 w-3.5 text-emerald-300" />
                  Servidor da espaçonave
                </span>
                <span className="mt-0.5 block font-bold text-emerald-300">
                  Dados organizados ({state.logbook.length} registro{state.logbook.length === 1 ? '' : 's'})
                </span>
              </div>
              <div className="rounded-sm border border-slate-800 bg-slate-900 p-2">
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Radio className="h-3.5 w-3.5 text-cyan-300" />
                  Central terrestre
                </span>
                <span
                  className={`mt-0.5 block font-bold ${
                    stage === 'DELIVERED' ? 'text-emerald-300' : 'text-amber-300'
                  }`}
                >
                  {stage === 'DELIVERED'
                    ? 'Transmissão confirmada ✓'
                    : stage === 'IDLE'
                    ? 'Aguardando transmissão'
                    : 'Transmitindo pacote...'}
                </span>
              </div>
            </div>

            <div className="space-y-1 rounded-sm border border-slate-800 bg-black p-2.5 font-mono text-[11px] text-cyan-200">
              {stage === 'IDLE' && (
                <p className="text-slate-400">&gt; PRONTO PARA EMPACOTAR FOTOS E DIÁRIO DE BORDO.</p>
              )}
              {stage !== 'IDLE' && <p>&gt; PACOTE DE DADOS PREPARADO.</p>}
              {(stage === 'SEARCHING_SIGNAL' ||
                stage === 'CONFIRMING' ||
                stage === 'DELIVERED') && <p>&gt; TRANSMISSÃO INICIADA. BUSCANDO SINAL DA TERRA...</p>}
              {(stage === 'CONFIRMING' || stage === 'DELIVERED') && (
                <p>&gt; AGUARDANDO CONFIRMAÇÃO DA CENTRAL TERRESTRE...</p>
              )}
              {stage === 'DELIVERED' && (
                <>
                  <p className="font-bold text-emerald-300">&gt; CONEXÃO ESTABELECIDA!</p>
                  <p className="font-bold text-emerald-300">&gt; DADOS RECEBIDOS!</p>
                  <p className="text-cyan-100">
                    &gt; RELATÓRIO DA EXPEDIÇÃO ENCAMINHADO PARA ANÁLISE CIENTÍFICA.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Relatório Geral da Expedição (5 missões) + Fotos do Diário + Ação */}
        <div className="flex flex-col justify-between gap-3 rounded-sm border-2 border-slate-800 bg-slate-950 p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-1.5 font-pixel text-[10px] text-amber-300">
                <FileCheck2 className="h-4 w-4" />
                RELATÓRIO GERAL DA EXPEDIÇÃO
              </h2>
              <span className="font-pixel text-[8px] text-emerald-300">5/5 CONCLUÍDAS</span>
            </div>

            <ul className="space-y-2">
              {EXPEDITION_MISSIONS.map((m) => (
                <li
                  key={m.title}
                  className="flex items-start gap-2 rounded-sm border border-emerald-500/40 bg-emerald-950/25 p-2"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                  <div>
                    <p className="font-dialog text-xs font-bold text-emerald-200">{m.title}</p>
                    <p className="font-dialog text-[11px] text-slate-300">{m.summary}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Prévia das fotografias armazenadas no Servidor */}
            <div className="rounded-sm border border-slate-800 bg-slate-900 p-2.5">
              <p className="font-pixel text-[8px] text-cyan-300">
                FOTOGRAFIAS E DIÁRIO EMPACOTADOS ({state.logbook.length})
              </p>
              {state.logbook.length > 0 ? (
                <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                  {state.logbook.slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      className="w-36 shrink-0 rounded-sm border border-slate-700 bg-slate-950 p-1"
                    >
                      {item.photoDataUrl ? (
                        <img
                          src={item.photoDataUrl}
                          alt={item.event}
                          className="pixel-art aspect-video w-full object-cover"
                        />
                      ) : (
                        <div className="flex aspect-video items-center justify-center bg-slate-900 text-[9px] text-slate-500">
                          LOG
                        </div>
                      )}
                      <p className="mt-1 whitespace-normal font-dialog text-[9px] leading-tight text-slate-300">
                        {item.event}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-1 font-dialog text-[11px] text-slate-400">
                  Pacote inclui os registros automáticos das 5 missões e saúde simulada.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {stage !== 'DELIVERED' ? (
              <button
                type="button"
                disabled={stage !== 'IDLE'}
                onClick={handleStartTransmission}
                className="pixel-btn flex w-full items-center justify-center gap-2 bg-cyan-400 px-4 py-3 font-pixel text-[10px] text-slate-950 hover:bg-cyan-300 disabled:opacity-60"
              >
                <Satellite className="h-4 w-4" />
                {stage === 'IDLE'
                  ? 'Transmitir Dados à Terra ▶'
                  : 'Transmitindo para Central Terrestre...'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  soundEngine.playSuccess();
                  setScene('FUTURE_MARS');
                }}
                className="pixel-btn flex w-full items-center justify-center gap-2 bg-emerald-400 px-4 py-3 font-pixel text-[10px] text-slate-950 hover:bg-emerald-300"
              >
                <Sparkles className="h-4 w-4" />
                Avançar para Cena 7 — O Futuro da Vida em Marte ▶
              </button>
            )}
          </div>
        </div>
      </div>

      <CapiAssistant lines={capiLines} compact />
    </section>
  );
};
