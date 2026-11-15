import React, { useEffect, useState } from 'react';
import { BookOpen, Camera, CheckCircle2, Cloud, HardDrive, X } from 'lucide-react';
import { type GameSceneId, useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';
import { AZIMUTH_LABELS, SEASON_INFO } from '../../missions/mission1-solar/mars24SolarMath';

function buildPixelPhotoDataUrl(
  scene: GameSceneId,
  astronautName: string,
  sol: number,
  eventTitle: string,
  solarInstalled: boolean
): string {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 180;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.imageSmoothingEnabled = false;

  if (scene === 'LAUNCH' || scene === 'CAPI_INTRO' || scene === 'CUSTOMIZE') {
    ctx.fillStyle = '#070b1a';
    ctx.fillRect(0, 0, 320, 180);
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 40; i++) {
      const sx = (i * 47 + sol * 13) % 312;
      const sy = (i * 29 + 11) % 100;
      ctx.fillRect(sx, sy, 2, 2);
    }
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(160, 195, 110, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(95, 115, 45, 22);
    ctx.fillRect(175, 108, 52, 26);
  } else {
    ctx.fillStyle = '#9a3412';
    ctx.fillRect(0, 0, 320, 48);
    ctx.fillStyle = '#c2410c';
    ctx.fillRect(0, 48, 320, 44);
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(0, 92, 320, 26);
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(0, 118, 320, 62);

    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(256, 22, 16, 16);

    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(34, 86, 84, 38);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(34, 108, 84, 7);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(46, 94, 16, 10);
    ctx.fillRect(90, 94, 16, 10);

    // Painéis solares instalados ou área demarcada
    if (scene === 'MISSION_5' || scene === 'EARTH_COMMS' || scene === 'FUTURE_MARS') {
      // Abrigo blindado contra radiação com porta de segurança amarela/preta e poeira laranja
      ctx.fillStyle = '#ea580c';
      ctx.globalAlpha = 0.35;
      ctx.fillRect(0, 12, 320, 74);
      ctx.globalAlpha = 1;
      // Cúpula blindada revestida de solo marciano e reservatórios de água (H2O)
      ctx.fillStyle = '#9a3412';
      ctx.fillRect(168, 76, 118, 54);
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(172, 84, 16, 26);
      ctx.fillRect(266, 84, 16, 26);
      // Porta blindada listrada amarela e preta
      ctx.fillStyle = '#eab308';
      ctx.fillRect(204, 92, 46, 38);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(210, 98, 34, 32);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(222, 108, 10, 10);
    } else if (scene === 'MISSION_4') {
      // Domo geodésico da estufa marciana com luzes LED e canteiros verdes
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(166, 118, 128, 14);
      ctx.fillStyle = '#0ea5e9';
      ctx.globalAlpha = 0.28;
      ctx.fillRect(178, 66, 104, 52);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(178, 66, 104, 52);
      // Canteiros verdes hidropônicos e LED magenta de cultivo
      ctx.fillStyle = '#e879f9';
      ctx.fillRect(188, 74, 84, 5);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(188, 94, 24, 18);
      ctx.fillRect(218, 92, 24, 20);
      ctx.fillRect(248, 94, 24, 18);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(224, 96, 4, 4);
      ctx.fillRect(234, 100, 4, 4);
    } else if (scene === 'MISSION_3') {
      // Perfuradora e testemunho de gelo azul-ciano no Setor Gama
      ctx.fillStyle = '#334155';
      ctx.fillRect(190, 96, 10, 34);
      ctx.fillRect(236, 96, 10, 34);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(184, 72, 68, 26);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(212, 80, 12, 54);
      // Tubo de amostra de gelo (ice core)
      ctx.fillStyle = '#c2410c';
      ctx.fillRect(268, 92, 16, 18);
      ctx.fillStyle = '#22d3ee';
      ctx.fillRect(268, 110, 16, 20);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.strokeRect(268, 92, 16, 38);
    } else if (solarInstalled || scene === 'MISSION_1') {
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(192, 114, 6, 16);
      ctx.fillRect(244, 114, 6, 16);
      ctx.fillStyle = '#1d4ed8';
      ctx.fillRect(172, 86, 96, 30);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(172, 86, 96, 9);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.strokeRect(172, 86, 96, 30);
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(216, 120, 8, 8);
    } else {
      ctx.fillStyle = '#64748b';
      ctx.fillRect(206, 112, 12, 14);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.strokeRect(184, 118, 58, 18);
    }
  }

  ctx.strokeStyle = 'rgba(34, 211, 238, 0.85)';
  ctx.lineWidth = 2;
  ctx.strokeRect(8, 8, 304, 164);

  ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
  ctx.fillRect(8, 146, 304, 26);
  ctx.fillStyle = '#67e8f9';
  ctx.font = 'bold 10px monospace';
  ctx.fillText(`ARCADIA PLANITIA • SOL ${sol} • ${astronautName.slice(0, 16)}`, 14, 158);
  ctx.fillStyle = '#fde047';
  ctx.fillText(`REGISTRO: ${(eventTitle || 'OBSERVAÇÃO CIENTÍFICA').slice(0, 34)}`, 14, 169);

  return canvas.toDataURL('image/png');
}

const SCENE_SUGGESTIONS: Record<GameSceneId, { event: string; aspect: string }> = {
  COUNTDOWN: {
    event: 'Contagem regressiva concluída',
    aspect: 'Sistemas da espaçonave acionados antes do lançamento.',
  },
  LAUNCH: {
    event: 'Decolagem da Terra rumo a Marte',
    aspect: 'Nave atravessou a atmosfera terrestre com sistemas de navegação ativos.',
  },
  CAPI_INTRO: {
    event: 'Ativação da assistente virtual Capi',
    aspect: 'Capivara holográfica conectada ao painel central da expedição.',
  },
  CUSTOMIZE: {
    event: 'Configuração do traje espacial',
    aspect: 'Equipamentos pessoais, capacete e mochila preparados para Marte.',
  },
  LANDING: {
    event: 'Pouso em Arcadia Planitia',
    aspect: 'Planície avermelhada observada; alerta de sistema solar ainda não instalado.',
  },
  BASE_HUB: {
    event: 'Inspeção inicial da Base em Arcadia Planitia',
    aspect: 'Habitat e rover prontos; área solar demarcada aguardando Missão 1.',
  },
  MISSION_1: {
    event: 'Instalação e ativação dos painéis solares',
    aspect: 'Local nivelado Ponto C escolhido, inclinação Mars24 calculada e energia estável.',
  },
  MISSION_2: {
    event: 'Rotina de saúde do astronauta concluída',
    aspect: 'Exercícios no habitat, refeição equilibrada sem desperdício de água e higiene realizados.',
  },
  MISSION_3: {
    event: 'Descoberta de gelo subterrâneo e tratamento de água em Arcadia Planitia',
    aspect: 'Radar SHARAD + HiRISE indicaram o Setor Gama; amostra congelada a 2,2 m filtrada, tratada e aprovada nos 5 testes de potabilidade.',
  },
  MISSION_4: {
    event: 'Colheita na Primeira Estufa Bioregenerativa de Marte',
    aspect: 'Estufa conectada à energia solar e água purificada; cultivo hidropônico/aeropônico com LEDs, 4 grupos de plantas e reciclagem ECLSS de ar e água.',
  },
  MISSION_5: {
    event: 'Proteção contra tempestade de poeira e evento de radiação solar',
    aspect: 'Vedação do habitat, limpeza remota dos painéis solares (480 W), proteção no Abrigo Blindado (água/H2O + regolito) e inspeção pós-tempestade concluídas.',
  },
  EARTH_COMMS: {
    event: 'Transmissão do Relatório Geral da Expedição à Central da Terra',
    aspect: 'Servidor da espaçonave empacotou todas as pesquisas, fotografias e dados das 5 missões para envio à NASA.',
  },
  FUTURE_MARS: {
    event: 'Avaliação integrada da Base Arcadia Planitia para o futuro em Marte',
    aspect: 'Sistemas de energia solar, saúde, água purificada, estufa bioregenerativa e proteção ambiental operando de forma sustentável.',
  },
};

export const LogbookModal: React.FC = () => {
  const { state, openModal, addLogbookEntry } = useGameStore();
  const isOpen = state.activeModal === 'LOGBOOK';

  const [eventText, setEventText] = useState('');
  const [aspectText, setAspectText] = useState('');
  const [capturedPhoto, setCapturedPhoto] = useState<string>('');
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (state.currentScene === 'MISSION_5') {
      const m5 = state.mission5;
      setEventText('Alerta Ambiental: Tempestade de Poeira e Radiação Solar');
      setAspectText(
        `Protocolo de vedação e baterias concluído; painéis solares ${
          m5.postDustSolar.remoteCleaningTriggered ? 'limpos remotamente (480 W)' : 'em avaliação'
        }; proteção contra radiação solar realizada no ${
          m5.radiationProtocol.enteredShieldedShelter
            ? 'Abrigo Blindado (água/H2O + solo marciano).'
            : 'habitat.'
        }`
      );
    } else if (state.currentScene === 'MISSION_4') {
      const m4 = state.mission4;
      const cropsCount = Object.values(m4.selectedCrops).filter(Boolean).length;
      const bioregDone =
        m4.bioregLinks.foodProduction &&
        m4.bioregLinks.airRevitalization &&
        m4.bioregLinks.waterRecycling;
      setEventText('Construção e colheita da Primeira Estufa em Marte');
      setAspectText(
        `Cultivo por ${
          m4.selectedMethod === 'HYDRO_AERO'
            ? 'Hidroponia + Aeroponia (raízes livres sem regolito tóxico)'
            : 'bancada experimental'
        } com ${cropsCount}/4 grupos de plantas e ${
          bioregDone || m4.mission4Completed
            ? 'sistema ECLSS fechado (alimentos, O2 e água reciclada).'
            : 'sistema ambiental calibrado.'
        }`
      );
    } else if (state.currentScene === 'MISSION_3') {
      const m3 = state.mission3;
      setEventText('Descoberta de gelo no Setor Gama e purificação de água potável');
      setAspectText(
        `Análise orbital (HiRISE, SHARAD e First Ice Cores) confirmou gelo a 2,2 m no Setor ${
          m3.selectedSector ?? 'GAMMA'
        }. Amostra separada, derretida, filtrada e ${
          m3.waterApproved ? 'aprovada nos 5 testes de potabilidade.' : 'em validação química.'
        }`
      );
    } else if (state.currentScene === 'MISSION_2') {
      const m2 = state.mission2;
      setEventText('Rotina diária de saúde no Habitat de Arcadia Planitia');
      setAspectText(
        `Treinos: ${m2.exercisesCompleted.length}/4 concluídos. Refeição: ${m2.selectedProtein ?? 'proteína'}, ${m2.selectedVeggie ?? 'vegetais'} e ${m2.selectedCarb ?? 'carboidrato'} com 350 ml de água. Higiene verificada.`
      );
    } else if (state.currentScene === 'MISSION_1' || state.stats.solarInstalled) {
      const m1 = state.mission1;
      setEventText('Instalação e ativação dos painéis solares em Arcadia Planitia');
      setAspectText(
        `Local: Ponto C (planície livre de sombras). Estação: ${SEASON_INFO[m1.season].label}. Orientação ${AZIMUTH_LABELS[m1.panelAzimuth]}, inclinação ${m1.panelTiltDeg}° gerando ${m1.generatedWatts || 480} W no painel de controle.`
      );
    } else {
      const suggestion = SCENE_SUGGESTIONS[state.currentScene];
      setEventText(suggestion.event);
      setAspectText(suggestion.aspect);
    }
    setCapturedPhoto('');
    setSavedFeedback(false);
  }, [
    isOpen,
    state.currentScene,
    state.stats.solarInstalled,
    state.mission1,
    state.mission2,
    state.mission3,
    state.mission4,
    state.mission5,
  ]);

  if (!isOpen) return null;

  const handleCapturePhoto = () => {
    soundEngine.playCameraShutter();
    const dataUrl = buildPixelPhotoDataUrl(
      state.currentScene,
      state.astronaut.name,
      state.stats.sol,
      eventText,
      state.stats.solarInstalled
    );
    setCapturedPhoto(dataUrl);
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventText.trim() || !aspectText.trim() || !capturedPhoto) return;

    soundEngine.playSuccess();
    addLogbookEntry({
      sceneLabel: state.currentScene,
      event: eventText.trim(),
      observedAspect: aspectText.trim(),
      photoDataUrl: capturedPhoto,
    });

    setSavedFeedback(true);
    setCapturedPhoto('');
    setTimeout(() => setSavedFeedback(false), 2600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Diário de Bordo Científico"
    >
      <div className="pixel-box-mars relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden bg-slate-950 text-slate-100">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b-4 border-slate-800 bg-slate-900 px-4 py-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-amber-400" />
            <h2 className="font-pixel text-xs text-amber-300 sm:text-sm">
              DIÁRIO DE BORDO CIENTÍFICO
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              openModal('NONE');
            }}
            className="rounded-sm border-2 border-slate-700 bg-slate-800 p-1 text-slate-300 hover:border-orange-400 hover:text-white"
            aria-label="Fechar Diário de Bordo"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-5 overflow-y-auto p-4 md:grid-cols-2">
          {/* Formulário dos 3 registros obrigatórios */}
          <form onSubmit={handleSaveEntry} className="space-y-3">
            <div className="rounded-sm border border-amber-500/40 bg-amber-950/30 p-2.5 font-dialog text-xs text-amber-100">
              Todo bom cientista registra: <strong>1. Evento</strong>,{' '}
              <strong>2. Aspecto observado</strong> e <strong>3. Fotografia</strong>.
            </div>

            <div>
              <label className="mb-1 block font-pixel text-[10px] text-cyan-300">
                1. EVENTO (O QUE ACONTECEU?)
              </label>
              <input
                type="text"
                required
                maxLength={100}
                value={eventText}
                onChange={(e) => setEventText(e.target.value)}
                placeholder="Ex.: Instalação e ativação dos painéis solares"
                className="w-full rounded-sm border-2 border-slate-700 bg-slate-900 px-3 py-2 font-dialog text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block font-pixel text-[10px] text-cyan-300">
                2. ASPECTO OBSERVADO
              </label>
              <textarea
                required
                rows={3}
                maxLength={240}
                value={aspectText}
                onChange={(e) => setAspectText(e.target.value)}
                placeholder="O que você observou no ambiente ou nos equipamentos?"
                className="w-full rounded-sm border-2 border-slate-700 bg-slate-900 px-3 py-2 font-dialog text-xs text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block font-pixel text-[10px] text-cyan-300">
                3. FOTOGRAFIA CIENTÍFICA
              </label>
              <div className="space-y-2 rounded-sm border-2 border-dashed border-slate-700 bg-slate-900/70 p-2.5">
                {capturedPhoto ? (
                  <img
                    src={capturedPhoto}
                    alt="Fotografia científica capturada"
                    className="pixel-art w-full rounded-sm border border-cyan-500/60"
                  />
                ) : (
                  <p className="py-4 text-center font-dialog text-xs text-slate-400">
                    Nenhuma fotografia capturada ainda.
                  </p>
                )}
                <button
                  type="button"
                  onClick={handleCapturePhoto}
                  className="pixel-btn flex w-full items-center justify-center gap-2 bg-cyan-400 px-3 py-2 font-dialog text-xs font-bold text-slate-950 hover:bg-cyan-300"
                >
                  <Camera className="h-4 w-4" />
                  {capturedPhoto ? 'Capturar Nova Foto' : 'Capturar Fotografia do Evento'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={!capturedPhoto || !eventText.trim() || !aspectText.trim()}
              className="pixel-btn flex w-full items-center justify-center gap-2 bg-emerald-400 px-4 py-2.5 font-pixel text-[10px] text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <CheckCircle2 className="h-4 w-4" />
              Salvar no Diário da Nave
            </button>

            {savedFeedback && (
              <p className="rounded-sm border border-emerald-500/60 bg-emerald-950/70 px-3 py-2 text-center font-dialog text-xs text-emerald-200">
                Registro salvo com sucesso no servidor local!
              </p>
            )}
          </form>

          {/* Álbum de registros e fotos salvas */}
          <div className="flex flex-col">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-pixel text-[10px] text-orange-300">
                ÁLBUM E REGISTROS ({state.logbook.length})
              </h3>
              <span className="font-dialog text-[11px] text-slate-400">
                Salvo localmente
              </span>
            </div>

            {state.logbook.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center rounded-sm border-2 border-slate-800 bg-slate-900/50 p-6 text-center">
                <Camera className="mb-2 h-8 w-8 text-slate-600" />
                <p className="font-dialog text-xs text-slate-400">
                  Seu álbum científico está vazio. Preencha os 3 passos ao lado para
                  guardar sua primeira descoberta!
                </p>
              </div>
            ) : (
              <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                {state.logbook.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-sm border-2 border-slate-800 bg-slate-900 p-2.5"
                  >
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <span className="font-pixel text-[9px] text-amber-300">
                        SOL {item.sol} • {item.timestamp}
                      </span>
                      <span className="inline-flex items-center gap-1 font-dialog text-[10px] text-cyan-300">
                        {item.transmittedToEarth ? (
                          <>
                            <Cloud className="h-3 w-3 text-emerald-400" />
                            Enviado à Terra
                          </>
                        ) : (
                          <>
                            <HardDrive className="h-3 w-3 text-amber-300" />
                            Servidor da nave
                          </>
                        )}
                      </span>
                    </div>
                    <p className="font-dialog text-xs font-bold text-white">
                      {item.event}
                    </p>
                    <p className="mt-0.5 font-dialog text-[11px] text-slate-300">
                      {item.observedAspect}
                    </p>
                    {item.photoDataUrl && (
                      <img
                        src={item.photoDataUrl}
                        alt={item.event}
                        className="pixel-art mt-2 w-full rounded-sm border border-slate-700"
                      />
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
