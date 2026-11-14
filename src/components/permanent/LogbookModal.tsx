import React, { useState } from 'react';
import { BookOpen, Camera, CheckCircle2, Cloud, HardDrive, X } from 'lucide-react';
import { type GameSceneId, useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

function buildPixelPhotoDataUrl(
  scene: GameSceneId,
  astronautName: string,
  sol: number,
  eventTitle: string
): string {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 180;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.imageSmoothingEnabled = false;

  // Fundo temático por cena
  if (scene === 'LAUNCH' || scene === 'CAPI_INTRO' || scene === 'CUSTOMIZE') {
    ctx.fillStyle = '#070b1a';
    ctx.fillRect(0, 0, 320, 180);
    // Estrelas
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 40; i++) {
      const sx = (i * 47 + sol * 13) % 312;
      const sy = (i * 29 + 11) % 100;
      ctx.fillRect(sx, sy, 2, 2);
    }
    // Terra azul
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(160, 195, 110, Math.PI, 0);
    ctx.fill();
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(95, 115, 45, 22);
    ctx.fillRect(175, 108, 52, 26);
  } else {
    // Céu marciano e solo de Arcadia Planitia
    ctx.fillStyle = '#9a3412';
    ctx.fillRect(0, 0, 320, 48);
    ctx.fillStyle = '#c2410c';
    ctx.fillRect(0, 48, 320, 44);
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(0, 92, 320, 26);
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(0, 118, 320, 62);

    // Sol marciano
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(256, 22, 16, 16);

    // Habitat científico simplificado
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(42, 86, 84, 38);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(42, 108, 84, 7);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(54, 94, 16, 10);
    ctx.fillRect(98, 94, 16, 10);

    // Pedestal aguardando painel solar
    ctx.fillStyle = '#64748b';
    ctx.fillRect(206, 112, 12, 14);
    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.strokeRect(184, 118, 58, 18);
  }

  // Mira fotográfica científica + telemetria
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.85)';
  ctx.lineWidth = 2;
  ctx.strokeRect(8, 8, 304, 164);

  ctx.fillStyle = 'rgba(2, 6, 23, 0.82)';
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
};

export const LogbookModal: React.FC = () => {
  const { state, openModal, addLogbookEntry } = useGameStore();
  const suggestion = SCENE_SUGGESTIONS[state.currentScene];

  const [eventText, setEventText] = useState(suggestion.event);
  const [aspectText, setAspectText] = useState(suggestion.aspect);
  const [capturedPhoto, setCapturedPhoto] = useState<string>('');
  const [savedFeedback, setSavedFeedback] = useState(false);

  if (state.activeModal !== 'LOGBOOK') return null;

  const handleCapturePhoto = () => {
    soundEngine.playCameraShutter();
    const dataUrl = buildPixelPhotoDataUrl(
      state.currentScene,
      state.astronaut.name,
      state.stats.sol,
      eventText
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
                maxLength={90}
                value={eventText}
                onChange={(e) => setEventText(e.target.value)}
                placeholder="Ex.: Pouso em Arcadia Planitia"
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
                maxLength={220}
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
