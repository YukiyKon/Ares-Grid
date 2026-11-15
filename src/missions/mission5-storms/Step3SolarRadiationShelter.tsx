import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertOctagon,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  Droplets,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { AstronautAvatar } from '../../components/permanent/AstronautAvatar';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

const GRID_LANES = 3; // 0 (topo), 1 (meio), 2 (base)
const GRID_COLS = 6; // 0 (início) .. 5 (porta do abrigo blindado)

// Exatamente 2 rochas marcianas no percurso para o jogador desviar
const ROCK_OBSTACLES = [
  { lane: 1, col: 2 },
  { lane: 0, col: 4 },
];

function isRockCell(lane: number, col: number): boolean {
  return ROCK_OBSTACLES.some((r) => r.lane === lane && r.col === col);
}

interface Step3SolarRadiationShelterProps {
  onComplete: () => void;
  onCapiFeedback: (line: string) => void;
}

export const Step3SolarRadiationShelter: React.FC<Step3SolarRadiationShelterProps> = ({
  onComplete,
  onCapiFeedback,
}) => {
  const { state, updateMission5 } = useGameStore();
  const rad = state.mission5.radiationProtocol;
  const reachedShelter = Boolean(rad.enteredShieldedShelter && rad.riskReducedAndReleased);

  const [astroPos, setAstroPos] = useState<{ lane: number; col: number }>({
    lane: 1,
    col: 0,
  });
  const [radiationPct, setRadiationPct] = useState<number>(18);
  const [bumpWarning, setBumpWarning] = useState<boolean>(false);

  const astroPosRef = useRef(astroPos);
  const reachedRef = useRef(reachedShelter);
  const hasInitRef = useRef(false);

  useEffect(() => {
    astroPosRef.current = astroPos;
  }, [astroPos]);

  useEffect(() => {
    reachedRef.current = reachedShelter;
  }, [reachedShelter]);

  // Garante início no terreno externo (sem vir pré-concluído)
  useEffect(() => {
    if (hasInitRef.current) return;
    hasInitRef.current = true;
    if (!state.mission5.mission5Completed) {
      setAstroPos({ lane: 1, col: 0 });
      setRadiationPct(18);
      reachedRef.current = false;
      updateMission5({
        radiationProtocol: {
          alertConsulted: true,
          externalStopped: true,
          enteredShieldedShelter: false,
          shieldingVerified: false,
          riskReducedAndReleased: false,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRestartRun = () => {
    soundEngine.playClick();
    setAstroPos({ lane: 1, col: 0 });
    astroPosRef.current = { lane: 1, col: 0 };
    setRadiationPct(18);
    setBumpWarning(false);
    reachedRef.current = false;
    updateMission5({
      radiationProtocol: {
        alertConsulted: true,
        externalStopped: true,
        enteredShieldedShelter: false,
        shieldingVerified: false,
        riskReducedAndReleased: false,
      },
    });
    onCapiFeedback(
      'Alerta solar ativo! Guie o astronauta pelo terreno desviando das 2 rochas até o Abrigo Blindado antes da radiação atingir 100%!'
    );
  };

  // Barra de radiação solar subindo continuamente enquanto estiver fora do abrigo
  useEffect(() => {
    if (reachedShelter) return;

    const timer = window.setInterval(() => {
      setRadiationPct((prev) => {
        const next = Math.min(100, prev + 1.8);
        if (next >= 100) {
          soundEngine.playAlert();
          setAstroPos({ lane: 1, col: 0 });
          astroPosRef.current = { lane: 1, col: 0 };
          onCapiFeedback(
            'Radiação crítica (100%)! Recomece a corrida imediatamente usando as setas ou tocando nas células à frente até o Abrigo Blindado!'
          );
          return 20;
        }
        return Number(next.toFixed(1));
      });
    }, 250);

    return () => window.clearInterval(timer);
  }, [reachedShelter, onCapiFeedback]);

  const moveAstronaut = useCallback(
    (dLane: number, dCol: number) => {
      if (reachedRef.current) return;
      const cur = astroPosRef.current;
      const nextLane = Math.max(0, Math.min(GRID_LANES - 1, cur.lane + dLane));
      const nextCol = Math.max(0, Math.min(GRID_COLS - 1, cur.col + dCol));

      if (nextLane === cur.lane && nextCol === cur.col) return;

      if (isRockCell(nextLane, nextCol)) {
        soundEngine.playAlert();
        setBumpWarning(true);
        window.setTimeout(() => setBumpWarning(false), 600);
        onCapiFeedback(
          'Pedregulho marciano bloqueando essa faixa! Contorne subindo ou descendo para chegar ao Abrigo Blindado!'
        );
        return;
      }

      soundEngine.playClick();
      const updated = { lane: nextLane, col: nextCol };
      astroPosRef.current = updated;
      setAstroPos(updated);

      if (nextCol === GRID_COLS - 1) {
        reachedRef.current = true;
        soundEngine.playSuccess();
        setRadiationPct(15);
        updateMission5({
          radiationProtocol: {
            alertConsulted: true,
            externalStopped: true,
            enteredShieldedShelter: true,
            shieldingVerified: true,
            riskReducedAndReleased: true,
          },
        });
        onCapiFeedback(
          'Salvo no Abrigo Blindado! Camadas de água (hidrogênio) e solo marciano detiveram a radiação invisível com segurança total (NASA Real Martians)!'
        );
      }
    },
    [onCapiFeedback, updateMission5]
  );

  // Suporte às setas do teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (reachedRef.current) return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        moveAstronaut(-1, 0);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        moveAstronaut(1, 0);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        moveAstronaut(0, 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        moveAstronaut(0, -1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [moveAstronaut]);

  const handleTapGridCell = (targetLane: number, targetCol: number) => {
    if (reachedRef.current) return;
    const cur = astroPosRef.current;
    const dLane = Math.sign(targetLane - cur.lane);
    const dCol = Math.sign(targetCol - cur.col);
    // Prioriza movimento ortogonal em direção ao ponto tocado
    if (dCol !== 0 && !isRockCell(cur.lane, cur.col + dCol)) {
      moveAstronaut(0, dCol);
    } else if (dLane !== 0) {
      moveAstronaut(dLane, 0);
    } else if (dCol !== 0) {
      moveAstronaut(0, dCol);
    }
  };

  return (
    <div className="space-y-4 pb-32">
      <div className="rounded-sm border-2 border-rose-500/80 bg-rose-950/50 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertOctagon className="h-4 w-4 text-rose-300" />
            <h2 className="font-pixel text-[11px] text-rose-200">
              DESAFIO 5.3 — CORRIDA PARA O ABRIGO BLINDADO CONTRA RADIAÇÃO
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`rounded-sm border px-2 py-0.5 font-pixel text-[8px] ${
                reachedShelter
                  ? 'border-emerald-400 bg-emerald-950/80 text-emerald-200'
                  : 'animate-pulse border-rose-400 bg-rose-900/80 text-rose-100'
              }`}
            >
              {reachedShelter ? 'BLINDADO NO ABRIGO!' : `RADIAÇÃO: ${Math.round(radiationPct)}%`}
            </span>
            <button
              type="button"
              onClick={handleRestartRun}
              className="inline-flex items-center gap-1 rounded-sm border border-slate-700 bg-slate-950 px-2 py-1 font-dialog text-[11px] text-slate-300 hover:border-rose-400"
            >
              <RotateCcw className="h-3 w-3" />
              Reiniciar
            </button>
          </div>
        </div>

        {/* Barra de radiação solar subindo em tempo real */}
        <div className="mt-2.5 space-y-1">
          <div className="flex items-center justify-between font-dialog text-[11px] text-slate-200">
            <span>Exposição a Partículas Energéticas (Radiação Invisível):</span>
            <strong className={reachedShelter ? 'text-emerald-300' : 'text-rose-200'}>
              {reachedShelter ? '15% — Blindagem H₂O + Regolito Ativa' : `${Math.round(radiationPct)}% / 100%`}
            </strong>
          </div>
          <div className="h-3.5 w-full overflow-hidden rounded-sm border border-slate-700 bg-slate-950">
            <div
              style={{ width: `${reachedShelter ? 15 : radiationPct}%` }}
              className={`h-full transition-all duration-150 ${
                reachedShelter
                  ? 'bg-emerald-400'
                  : radiationPct >= 75
                  ? 'bg-rose-500'
                  : 'bg-amber-400'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Arena Tátil de Corrida no Terreno Marciano */}
      <div className="grid gap-4 md:grid-cols-[1.25fr_1fr]">
        <div className="space-y-2.5">
          <div
            className={`touch-none select-none pixel-box relative overflow-hidden bg-gradient-to-r from-orange-950 via-red-950/80 to-slate-950 p-2 ${
              bumpWarning ? 'ring-2 ring-rose-400' : ''
            }`}
          >
            <div className="grid grid-rows-3 gap-1.5">
              {Array.from({ length: GRID_LANES }).map((_, laneIdx) => (
                <div key={laneIdx} className="grid grid-cols-6 gap-1.5">
                  {Array.from({ length: GRID_COLS }).map((__, colIdx) => {
                    const isPlayer = astroPos.lane === laneIdx && astroPos.col === colIdx;
                    const isRock = isRockCell(laneIdx, colIdx);
                    const isShelterDoor = colIdx === GRID_COLS - 1;

                    return (
                      <button
                        key={colIdx}
                        type="button"
                        onPointerDown={(e) => {
                          e.preventDefault();
                          handleTapGridCell(laneIdx, colIdx);
                        }}
                        className={`touch-none select-none relative flex h-16 items-center justify-center rounded-sm border transition ${
                          isShelterDoor
                            ? reachedShelter && isPlayer
                              ? 'border-emerald-300 bg-emerald-950/75'
                              : 'border-cyan-400/80 bg-cyan-950/45 hover:bg-cyan-900/50'
                            : isRock
                            ? 'border-stone-500 bg-stone-900/90'
                            : isPlayer
                            ? 'border-amber-300 bg-amber-950/40'
                            : 'border-orange-900/60 bg-orange-950/35 hover:border-amber-400/60'
                        }`}
                      >
                        {isShelterDoor && !isPlayer && laneIdx === 1 && (
                          <img
                            src={ASSET_MANIFEST.radiationShelter.path}
                            alt={ASSET_MANIFEST.radiationShelter.alt}
                            draggable={false}
                            className="pixel-art pointer-events-none h-14 w-auto object-contain"
                          />
                        )}
                        {isShelterDoor && !isPlayer && laneIdx !== 1 && (
                          <span className="font-pixel text-[7px] text-cyan-200">ABRIGO</span>
                        )}
                        {isRock && (
                          <span className="flex flex-col items-center font-pixel text-[7px] text-stone-300">
                            <span className="text-xl leading-none">🪨</span>
                            ROCHA
                          </span>
                        )}
                        {isPlayer && (
                          <div className="flex flex-col items-center">
                            <AstronautAvatar profile={state.astronaut} size="sm" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Controles Direcionais Táteis (para celular e mouse) */}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={reachedShelter}
              onPointerDown={(e) => {
                e.preventDefault();
                moveAstronaut(-1, 0);
              }}
              className="touch-none select-none pixel-btn flex items-center justify-center gap-1.5 bg-slate-800 px-3 py-2.5 font-pixel text-[9px] text-slate-100 hover:bg-slate-700 disabled:opacity-45"
            >
              <ArrowUp className="h-4 w-4 text-cyan-300" />
              SUBIR
            </button>

            <button
              type="button"
              disabled={reachedShelter}
              onPointerDown={(e) => {
                e.preventDefault();
                moveAstronaut(1, 0);
              }}
              className="touch-none select-none pixel-btn flex items-center justify-center gap-1.5 bg-slate-800 px-3 py-2.5 font-pixel text-[9px] text-slate-100 hover:bg-slate-700 disabled:opacity-45"
            >
              <ArrowDown className="h-4 w-4 text-cyan-300" />
              DESCER
            </button>

            <button
              type="button"
              disabled={reachedShelter}
              onPointerDown={(e) => {
                e.preventDefault();
                moveAstronaut(0, 1);
              }}
              className="touch-none select-none pixel-btn flex items-center justify-center gap-1.5 bg-cyan-400 px-3 py-2.5 font-pixel text-[9px] text-slate-950 hover:bg-cyan-300 disabled:opacity-45"
            >
              AVANÇAR
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Nota científica + status do abrigo + botão de conclusão */}
        <div className="flex flex-col justify-between gap-3">
          <div className="space-y-3 rounded-sm border-2 border-cyan-500/40 bg-slate-900 p-3 font-dialog text-xs text-slate-200">
            <p className="flex items-center gap-1.5 font-pixel text-[9px] text-cyan-300">
              <Droplets className="h-3.5 w-3.5" />
              POR QUE BUSCAR O ABRIGO BLINDADO?
            </p>
            <p className="leading-relaxed">
              Diferente da poeira visível, a <strong>radiação solar é invisível a olho nu</strong>.
              Paredes comuns não detêm partículas energéticas; o abrigo usa reservas de{' '}
              <strong>água (hidrogênio)</strong> e espessas camadas de <strong>regolito</strong>{' '}
              (<em>NASA Real Martians</em>).
            </p>

            <div
              className={`flex items-center gap-2 rounded-sm border p-2.5 ${
                reachedShelter
                  ? 'border-emerald-400 bg-emerald-950/50 text-emerald-100'
                  : 'border-rose-400/60 bg-rose-950/40 text-rose-100'
              }`}
            >
              {reachedShelter ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
              ) : (
                <ShieldCheck className="h-5 w-5 shrink-0 text-rose-300" />
              )}
              <span>
                {reachedShelter
                  ? `Abrigo Blindado alcançado! ${state.astronaut.name} está 100% protegido.`
                  : 'Use os botões táteis (ou setas/toque no terreno) para desviar das 2 rochas e alcançar o Abrigo à direita!'}
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={!reachedShelter}
            onClick={() => {
              soundEngine.playSuccess();
              onComplete();
            }}
            className="pixel-btn w-full bg-emerald-400 px-4 py-2.5 font-pixel text-[10px] text-slate-950 hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {reachedShelter
              ? 'Risco Dissipado — Inspeção Pós-Tempestade (Desafio 5.4) ▶'
              : 'Guie o astronauta até a porta do Abrigo Blindado ▶'}
          </button>
        </div>
      </div>
    </div>
  );
};
