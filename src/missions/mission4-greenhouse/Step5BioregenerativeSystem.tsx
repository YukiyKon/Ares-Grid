import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  Droplets,
  Moon,
  Recycle,
  Sprout,
  Wind,
} from 'lucide-react';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

interface BioregCycle {
  key: 'foodProduction' | 'airRevitalization' | 'waterRecycling';
  title: string;
  detail: string;
  capiMsg: string;
  icon: React.ReactNode;
}

const BIOREG_CYCLES: BioregCycle[] = [
  {
    key: 'foodProduction',
    title: '1. Produção Contínua de Alimentos',
    detail: 'Hortaliças, morangos e trigo frescos complementam as rações da Terra',
    capiMsg:
      'Ciclo de alimentos integrado! Produzir comida fresca em Marte reduz a dependência de cargas enviadas da Terra.',
    icon: <Sprout className="h-4 w-4 text-emerald-300" />,
  },
  {
    key: 'airRevitalization',
    title: '2. Revitalização do Ar (O2 ↔ CO2)',
    detail: 'Plantas absorvem CO2 expirado pelos astronautas e liberam oxigênio (O2)',
    capiMsg:
      'Revitalização do ar ativa! A fotossíntese das plantas ajuda a renovar o oxigênio do habitat!',
    icon: <Wind className="h-4 w-4 text-cyan-300" />,
  },
  {
    key: 'waterRecycling',
    title: '3. Reciclagem Bioregenerativa de Água',
    detail: 'Vapor transpirado pelas folhas é condensado e volta puro ao reservatório',
    capiMsg:
      'Reciclagem de água fechada! Sistemas bioregenerativos (ECLSS) da NASA integram plantas, ar e água em um ciclo vivo!',
    icon: <Droplets className="h-4 w-4 text-sky-300" />,
  },
];

interface Step5BioregenerativeSystemProps {
  onCapiFeedback: (line: string) => void;
  onReturnToBase: () => void;
}

export const Step5BioregenerativeSystem: React.FC<Step5BioregenerativeSystemProps> = ({
  onCapiFeedback,
  onReturnToBase,
}) => {
  const { state, openModal, updateMission4 } = useGameStore();
  const { bioregLinks, loggedInDiary, mission5Unlocked } = state.mission4;
  const allLinked =
    bioregLinks.foodProduction &&
    bioregLinks.airRevitalization &&
    bioregLinks.waterRecycling;

  const handleToggleCycle = (cycle: BioregCycle) => {
    soundEngine.playSuccess();
    updateMission4({
      bioregLinks: {
        ...bioregLinks,
        [cycle.key]: true,
      },
    });
    onCapiFeedback(cycle.capiMsg);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-sm border-2 border-emerald-500/50 bg-slate-900/90 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Recycle className="h-4 w-4 text-emerald-300" />
            <h2 className="font-pixel text-[11px] text-emerald-200">
              DESAFIO 4.5 — SISTEMA BIOREGENERATIVO DE SUPORTE À VIDA (ECLSS)
            </h2>
          </div>
          <span className="font-pixel text-[9px] text-cyan-300">
            ELOS INTEGRADOS: {Object.values(bioregLinks).filter(Boolean).length}/3
          </span>
        </div>
      </div>

      {/* 3 elos do sistema bioregenerativo */}
      <div className="grid gap-3 md:grid-cols-3">
        {BIOREG_CYCLES.map((cycle) => {
          const done = bioregLinks[cycle.key];
          return (
            <button
              key={cycle.key}
              type="button"
              onClick={() => handleToggleCycle(cycle)}
              className={`flex flex-col justify-between gap-2 rounded-sm border-2 p-3 text-left transition ${
                done
                  ? 'border-emerald-400 bg-emerald-950/50 text-emerald-100'
                  : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-cyan-400'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="flex items-center gap-1.5 font-pixel text-[9px]">
                  {cycle.icon}
                  {cycle.title}
                </span>
                <CheckCircle2
                  className={`h-4 w-4 shrink-0 ${
                    done ? 'text-emerald-400' : 'text-slate-600'
                  }`}
                />
              </div>
              <p className="font-dialog text-xs text-slate-300">{cycle.detail}</p>
            </button>
          );
        })}
      </div>

      {/* Fechamento obrigatório da Missão 4 */}
      <div className="space-y-3 rounded-sm border-2 border-slate-800 bg-slate-900 p-4">
        <p className="font-dialog text-xs leading-relaxed text-slate-200">
          {allLinked
            ? 'Todos os ciclos bioregenerativos estão operando em conjunto! Faça o Registro Científico Obrigatório no Diário de Bordo e acione o Sono para a Capi enviar o relatório da estufa à Terra e desbloquear a Missão 5.'
            : 'Clique nos 3 cartões acima para conectar alimentos, oxigênio (O2) e água reciclada ao habitat marciano.'}
        </p>

        <div className="grid gap-3 md:grid-cols-2">
          <button
            type="button"
            disabled={!allLinked}
            onClick={() => {
              soundEngine.playClick();
              openModal('LOGBOOK');
            }}
            className={`pixel-btn flex items-center justify-center gap-2 px-4 py-2.5 font-dialog text-xs font-bold disabled:opacity-45 ${
              loggedInDiary
                ? 'bg-emerald-400 text-slate-950 hover:bg-emerald-300'
                : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            {loggedInDiary
              ? '✓ Estufa Registrada no Diário (Abrir)'
              : '1. Registrar Estufa e Foto no Diário'}
          </button>

          <button
            type="button"
            disabled={!allLinked}
            onClick={() => {
              soundEngine.playSleepChime();
              openModal('SLEEP_REPORT');
            }}
            className="pixel-btn flex items-center justify-center gap-2 bg-indigo-400 px-4 py-2.5 font-dialog text-xs font-bold text-slate-950 hover:bg-indigo-300 disabled:opacity-45"
          >
            <Moon className="h-4 w-4" />
            2. Dormir — Relatório da Estufa (Liberar Missão 5)
          </button>
        </div>

        {mission5Unlocked && (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-sm border-2 border-emerald-400 bg-emerald-950/40 p-3">
            <span className="font-dialog text-xs font-bold text-emerald-200">
              🌪️ Missão 5 — Alerta! Tempestades em Marte desbloqueada para o Sol{' '}
              {state.stats.sol}!
            </span>
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onReturnToBase();
              }}
              className="pixel-btn bg-emerald-400 px-4 py-2 font-pixel text-[10px] text-slate-950 hover:bg-emerald-300"
            >
              Voltar à Base (Missão 5 Pronta) ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
