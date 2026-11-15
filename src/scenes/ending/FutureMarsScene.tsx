import React from 'react';
import {
  Award,
  Camera,
  CheckCircle2,
  Compass,
  Download,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { ArcadiaRegionalMapCanvas } from '../../components/permanent/ArcadiaMapModal';
import { CapiAssistant } from '../../components/permanent/CapiAssistant';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';
import { type Language, useLanguage } from '../../i18n/LanguageContext';

function downloadExpeditionCertificate(
  astronautName: string,
  sol: number,
  logsCount: number,
  lang: Language
) {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 500;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.imageSmoothingEnabled = false;

  // Fundo espacial pixel art
  ctx.fillStyle = '#090d1f';
  ctx.fillRect(0, 0, 800, 500);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 8;
  ctx.strokeRect(18, 18, 764, 464);
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 30, 740, 440);

  // Horizonte marciano inferior
  ctx.fillStyle = '#7c2d12';
  ctx.fillRect(34, 380, 732, 86);
  ctx.fillStyle = '#ea580c';
  ctx.fillRect(34, 372, 732, 8);

  // Títulos
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 26px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(
    lang === 'en'
      ? 'ARCADIA PLANITIA — MARS SCIENCE MISSION'
      : 'ARCADIA PLANITIA — MISSAO CIENTIFICA EM MARTE',
    400,
    92
  );

  ctx.fillStyle = '#67e8f9';
  ctx.font = 'bold 20px monospace';
  ctx.fillText(
    lang === 'en'
      ? 'OFFICIAL SPACE EXPLORER CERTIFICATE'
      : 'CERTIFICADO OFICIAL DE PESQUISADOR ESPACIAL',
    400,
    134
  );

  ctx.fillStyle = '#f8fafc';
  ctx.font = '18px monospace';
  ctx.fillText(
    lang === 'en' ? 'Awarded to Mars Scientist:' : 'Conferido ao explorador cientifico:',
    400,
    185
  );

  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 34px monospace';
  ctx.fillText(astronautName.toUpperCase(), 400, 232);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '16px monospace';
  ctx.fillText(
    lang === 'en'
      ? 'Completed all 5 Missions: Solar, Health, Ice & Water, Greenhouse & Storms.'
      : 'Concluiu as 5 Missoes: Energia Solar, Saude, Gelo e Agua, Estufa e Protecao.',
    400,
    278
  );
  ctx.fillText(
    lang === 'en'
      ? `Expedition Reach: Sol ${sol} | Science Logs Sent to Earth: ${logsCount}`
      : `Alcance da Expedicao: Sol ${sol} | Registros enviados a Terra: ${logsCount}`,
    400,
    308
  );

  ctx.fillStyle = '#fde68a';
  ctx.font = 'bold 18px monospace';
  ctx.fillText(
    lang === 'en'
      ? '"Science opens pathways to new worlds!"'
      : '"A ciencia abre caminhos para novos mundos!"',
    400,
    352
  );

  ctx.fillStyle = '#fef3c7';
  ctx.font = 'bold 14px monospace';
  ctx.fillText(
    lang === 'en'
      ? 'Signed: Capi (Onboard Virtual Assistant) — Arcadia Base'
      : 'Assinado: Capi (Assistente Virtual de Bordo) — Base Arcadia',
    400,
    428
  );

  const link = document.createElement('a');
  const prefix = lang === 'en' ? 'certificate_arcadia' : 'certificado_arcadia';
  link.download = `${prefix}_${astronautName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export const FutureMarsScene: React.FC = () => {
  const { state, setScene, startSurvivalMode, resetGame } = useGameStore();
  const { lang } = useLanguage();

  const capiLines = [
    'Olhe ao nosso redor, comandante! Quando chegamos, encontramos uma paisagem desconhecida e cheia de desafios.',
    'Agora temos energia solar, pesquisas geológicas, água purificada, uma estufa experimental e proteção contra tempestades e radiação!',
    'Será que conseguiremos cultivar mais alimentos e construir habitats sustentáveis? Nossa aventura está apenas começando!',
  ];

  const handleDownloadCertificate = () => {
    soundEngine.playSuccess();
    downloadExpeditionCertificate(
      state.astronaut.name,
      state.stats.sol,
      state.logbook.length,
      lang
    );
  };

  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-3 py-4 pb-52 sm:pb-44">
      {/* Banner Oficial da Cena 7 (página 40 do roteiro) */}
      <div className="pixel-box-mars bg-gradient-to-r from-slate-950 via-orange-950/80 to-slate-950 px-5 py-4 text-center">
        <span className="inline-block rounded-sm border border-amber-400/70 bg-amber-950/60 px-3 py-0.5 font-pixel text-[9px] text-amber-200">
          CENA 7 — O FUTURO DA VIDA EM MARTE
        </span>
        <h1 className="mt-2 font-pixel text-sm text-amber-200 sm:text-base">
          ARCADIA PLANITIA • MISSÃO CIENTÍFICA EM MARTE
        </h1>
        <p className="mt-1 font-dialog text-sm text-cyan-200">
          A ciência abre caminhos para novos mundos! Sua próxima descoberta está esperando por você.
        </p>
        <div className="mt-3 inline-flex flex-wrap items-center justify-center gap-2 rounded-sm border border-emerald-400/70 bg-emerald-950/50 px-3 py-1.5">
          <span className="font-pixel text-[8px] text-emerald-300">
            🔓 MODO 2 DESBLOQUEADO: EXPEDIÇÃO REAL 30 SOLS!
          </span>
          <button
            type="button"
            onClick={() => {
              soundEngine.playSuccess();
              startSurvivalMode();
            }}
            className="pixel-btn bg-emerald-400 px-3 py-1 font-pixel text-[8px] text-slate-950 hover:bg-emerald-300"
          >
            🚀 Iniciar Expedição 30 Sols
          </button>
        </div>
      </div>

      {/* Mapa Regional Completo de Arcadia Planitia com todos os 5 setores ativos */}
      <div className="pixel-box space-y-3 bg-slate-900/90 p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-pixel text-[9px] text-emerald-300">
            ARCADIA PLANITIA • TODOS OS SETORES ATIVOS — SOL {state.stats.sol}
          </span>
          <span className="rounded-sm border border-emerald-400/70 bg-emerald-950/60 px-2 py-0.5 font-pixel text-[8px] text-emerald-200">
            REDE INTEGRADA 5/5 SETORES ✓
          </span>
        </div>
        <ArcadiaRegionalMapCanvas allActive />
      </div>

      {/* Perguntas científicas sobre o futuro + Certificado e Álbum */}
      <div className="grid gap-4 md:grid-cols-[1.1fr_1fr]">
        <div className="space-y-3 rounded-sm border-2 border-cyan-500/50 bg-slate-950 p-4">
          <h2 className="flex items-center gap-2 font-pixel text-[10px] text-cyan-300">
            <Sparkles className="h-4 w-4" />
            GRANDES PERGUNTAS PARA JOVENS PESQUISADORES
          </h2>
          <ul className="space-y-2 font-dialog text-xs leading-relaxed text-slate-200">
            <li className="rounded-sm border border-slate-800 bg-slate-900 p-2.5">
              🌱 <strong>Agricultura Espacial:</strong> Será que conseguiremos cultivar ainda
              mais alimentos para toda a tripulação usando sistemas bioregenerativos?
            </li>
            <li className="rounded-sm border border-slate-800 bg-slate-900 p-2.5">
              🏗️ <strong>Habitats Duradouros:</strong> Será que poderemos construir habitats
              capazes de proteger astronautas durante muitos anos contra poeira e radiação?
            </li>
            <li className="rounded-sm border border-slate-800 bg-slate-900 p-2.5">
              🧊 <strong>Uso de Recursos Locais (ISRU):</strong> Como poderemos aproveitar gelo,
              energia solar e minerais de Marte sem depender tanto da Terra?
            </li>
          </ul>
        </div>

        {/* Certificado & Álbum da Expedição */}
        <div className="flex flex-col justify-between gap-3 rounded-sm border-2 border-amber-400/60 bg-slate-950 p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-1.5 font-pixel text-[10px] text-amber-300">
                <Award className="h-4 w-4" />
                CERTIFICADO & ÁLBUM DA EXPEDIÇÃO
              </h2>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>

            <div className="rounded-sm border-2 border-amber-400/50 bg-gradient-to-br from-slate-900 to-indigo-950/60 p-3 text-center">
              <p className="font-pixel text-[8px] text-cyan-300">PESQUISADOR ESPACIAL CERTIFICADO</p>
              <p data-no-i18n="true" className="mt-1 font-pixel text-xs text-emerald-300">
                {state.astronaut.name}
              </p>
              <p className="mt-1 font-dialog text-[11px] text-slate-300">
                5/5 Missões Científicas Concluídas • Sol {state.stats.sol} • Dados enviados à NASA/Terra
              </p>
            </div>

            {/* Álbum resumido */}
            <div>
              <p className="flex items-center gap-1 font-pixel text-[8px] text-slate-300">
                <Camera className="h-3.5 w-3.5 text-amber-300" />
                FOTOS DO ÁLBUM ({state.logbook.length})
              </p>
              {state.logbook.length > 0 ? (
                <div className="mt-1.5 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                  {state.logbook.slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-sm border border-slate-800 bg-slate-900 p-1"
                    >
                      {item.photoDataUrl ? (
                        <img
                          src={item.photoDataUrl}
                          alt={item.event}
                          className="pixel-art aspect-video w-full object-cover"
                        />
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-1 font-dialog text-[11px] text-slate-400">
                  Você pode abrir a Base e tirar fotos extras pelo Diário a qualquer momento!
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                soundEngine.playSuccess();
                startSurvivalMode();
              }}
              className="pixel-btn flex w-full items-center justify-center gap-2 bg-emerald-400 px-4 py-3 font-pixel text-[9px] text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:bg-emerald-300"
            >
              🚀 Iniciar Expedição 30 Sols (Modo Sobrevivência)
            </button>

            <button
              type="button"
              onClick={handleDownloadCertificate}
              className="pixel-btn flex w-full items-center justify-center gap-2 bg-amber-400 px-4 py-2.5 font-pixel text-[9px] text-slate-950 hover:bg-amber-300"
            >
              <Download className="h-4 w-4" />
              Baixar Certificado da Expedição (.PNG)
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  setScene('BASE_HUB');
                }}
                className="pixel-btn flex items-center justify-center gap-1.5 bg-cyan-400 px-3 py-2 font-dialog text-xs font-bold text-slate-950 hover:bg-cyan-300"
              >
                <Compass className="h-3.5 w-3.5" />
                Explorar Base
              </button>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  resetGame();
                }}
                className="pixel-btn flex items-center justify-center gap-1.5 bg-slate-700 px-3 py-2 font-dialog text-xs font-bold text-slate-100 hover:bg-slate-600"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Jogar Novamente
              </button>
            </div>
          </div>
        </div>
      </div>

      <CapiAssistant dialogId="ending_future_mars" lines={capiLines} compact />
    </section>
  );
};
