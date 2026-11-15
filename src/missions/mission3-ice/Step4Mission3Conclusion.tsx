import React from 'react';
import { BookOpen, CheckCircle2, Droplets, Moon, Sprout } from 'lucide-react';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

interface Step4Mission3ConclusionProps {
  onReturnToBase: () => void;
}

export const Step4Mission3Conclusion: React.FC<Step4Mission3ConclusionProps> = ({
  onReturnToBase,
}) => {
  const { state, openModal, updateMission3 } = useGameStore();
  const { loggedInDiary, mission4Unlocked } = state.mission3;

  const handleOpenSleepToUnlockMission4 = () => {
    soundEngine.playSleepChime();
    openModal('SLEEP_REPORT');
  };

  const handleUnlockAndReturn = () => {
    soundEngine.playSuccess();
    updateMission3({
      phase: 'COMPLETED',
      mission3Completed: true,
      mission4Unlocked: true,
    });
    onReturnToBase();
  };

  return (
    <div className="space-y-4 rounded-sm border-2 border-emerald-400/70 bg-slate-900/90 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-emerald-300">
          <Droplets className="h-5 w-5 text-cyan-300" />
          <h2 className="font-pixel text-xs">
            FECHAMENTO DA MISSÃO 3 — ÁGUA POTÁVEL CONFIRMADA!
          </h2>
        </div>
        <span className="rounded-sm border border-cyan-400/70 bg-cyan-950/70 px-2.5 py-0.5 font-pixel text-[9px] text-cyan-200">
          ÁGUA DA BASE: {state.stats.water}%
        </span>
      </div>

      <p className="font-dialog text-xs leading-relaxed text-slate-200 sm:text-sm">
        Comandante, os dados orbitais do <strong>SHARAD</strong>, imagens{' '}
        <strong>HiRISE</strong> e a perfuração no <strong>Setor Gama (2,2 m)</strong> confirmaram
        gelo subterrâneo em Arcadia Planitia! Após separação, derretimento, filtragem e aprovação
        nos 5 indicadores químicos e microbiológicos, nossa reserva de água chegou a{' '}
        <strong>100%</strong>.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            openModal('LOGBOOK');
          }}
          className={`pixel-btn flex items-center justify-center gap-2 px-4 py-2.5 font-dialog text-xs font-bold ${
            loggedInDiary
              ? 'bg-emerald-400 text-slate-950 hover:bg-emerald-300'
              : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          {loggedInDiary
            ? '✓ Descoberta Registrada no Diário (Abrir)'
            : '1. Registrar Descoberta e Foto no Diário'}
        </button>

        <button
          type="button"
          onClick={handleOpenSleepToUnlockMission4}
          className="pixel-btn flex items-center justify-center gap-2 bg-indigo-400 px-4 py-2.5 font-dialog text-xs font-bold text-slate-950 hover:bg-indigo-300"
        >
          <Moon className="h-4 w-4" />
          2. Dormir e Enviar Dados à Terra (Liberar Missão 4)
        </button>
      </div>

      {mission4Unlocked ? (
        <div className="space-y-3 rounded-sm border-2 border-emerald-400 bg-emerald-950/40 p-3">
          <div className="flex items-center gap-2 font-dialog text-xs font-bold text-emerald-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>
              Missão 3 finalizada e sincronizada!{' '}
              <Sprout className="inline h-4 w-4 text-emerald-300" />{' '}
              <strong>Missão 4 — A Primeira Estufa de Marte</strong> desbloqueada na Base!
            </span>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onReturnToBase();
              }}
              className="pixel-btn bg-emerald-400 px-4 py-2 font-pixel text-[10px] text-slate-950 hover:bg-emerald-300"
            >
              Voltar à Base (Missão 4 Desbloqueada) ▶
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-end">
          <button
            type="button"
            disabled={!loggedInDiary}
            onClick={handleUnlockAndReturn}
            className="pixel-btn bg-cyan-400 px-4 py-2 font-pixel text-[10px] text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {loggedInDiary
              ? 'Concluir Missão 3 e Voltar à Base ▶'
              : 'Registre a foto no Diário acima para concluir'}
          </button>
        </div>
      )}
    </div>
  );
};
