import React, { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  Sliders,
  Sparkles,
  Sun,
  Zap,
} from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';
import {
  ARCADIA_LATITUDE_DEG,
  ARCADIA_LONGITUDE_DEG,
  AZIMUTH_LABELS,
  calculateMars24Solar,
  type MarsSeasonId,
  type MarsSolarHourId,
  type PanelAzimuthId,
  SEASON_INFO,
  SOLAR_HOUR_INFO,
} from './mars24SolarMath';

const AZIMUTH_ORDER: PanelAzimuthId[] = ['NORTH', 'EAST', 'SOUTH', 'WEST'];

interface Step2SolarCalcProps {
  onInstalled: () => void;
}

export const Step2SolarCalc: React.FC<Step2SolarCalcProps> = ({ onInstalled }) => {
  const { state, updateMission1, installSolarSystem } = useGameStore();
  const [showFormula, setShowFormula] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isHoldingSync, setIsHoldingSync] = useState(false);
  const progressRef = useRef(0);
  const lastPulseAtRef = useRef(0);
  const completedRef = useRef(false);

  const { season, solarHour, panelAzimuth, panelTiltDeg } = state.mission1;
  const calc = calculateMars24Solar({
    season,
    solarHour,
    panelAzimuth,
    panelTiltDeg,
    dusty: false,
  });

  const azimuthIndex = Math.max(0, AZIMUTH_ORDER.indexOf(panelAzimuth));
  const canConfirmInstall = calc.efficiencyPct >= 88 && panelAzimuth === calc.recommendedAzimuth;

  useEffect(() => {
    if (!canConfirmInstall) {
      setIsHoldingSync(false);
      progressRef.current = 0;
      setSyncProgress(0);
    }
  }, [canConfirmInstall]);

  useEffect(() => {
    if (!isHoldingSync || !canConfirmInstall || completedRef.current) return;

    const interval = window.setInterval(() => {
      const next = Math.min(100, progressRef.current + 1.7);
      progressRef.current = next;
      setSyncProgress(next);

      const now = performance.now();
      if (now - lastPulseAtRef.current >= 150) {
        soundEngine.playChargePulse(next / 100);
        lastPulseAtRef.current = now;
      }

      if (next >= 100 && !completedRef.current) {
        completedRef.current = true;
        window.clearInterval(interval);
        setIsHoldingSync(false);
        soundEngine.playSuccess();
        installSolarSystem(calc.wattsOutput);
        onInstalled();
      }
    }, 50);

    return () => window.clearInterval(interval);
  }, [isHoldingSync, canConfirmInstall, calc.wattsOutput, installSolarSystem, onInstalled]);

  useEffect(() => {
    if (isHoldingSync || syncProgress <= 0 || syncProgress >= 100) return;

    const decayTimer = window.setInterval(() => {
      const next = Math.max(0, progressRef.current - 2.5);
      progressRef.current = next;
      setSyncProgress(next);
      if (next <= 0) {
        window.clearInterval(decayTimer);
      }
    }, 50);

    return () => window.clearInterval(decayTimer);
  }, [isHoldingSync, syncProgress]);

  // Posição visual do Sol no simulador conforme a elevação e horário
  const sunXPercent =
    solarHour === 'MORNING' ? 20 : solarHour === 'AFTERNOON' ? 80 : 50;
  const sunYPercent = Math.max(12, Math.min(68, 76 - calc.elevationDeg * 0.72));

  const handleStartHoldSync = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!canConfirmInstall || completedRef.current) return;
    e.preventDefault();
    soundEngine.unlock();
    setIsHoldingSync(true);
    lastPulseAtRef.current = 0;
  };

  const handleStopHoldSync = () => {
    setIsHoldingSync(false);
  };

  return (
    <div className="space-y-4">
      {/* Fala inicial do jogador */}
      <div className="rounded-sm border-2 border-cyan-500/50 bg-slate-900/90 p-3">
        <p className="font-dialog text-xs text-cyan-100">
          <strong data-no-i18n="true" className="text-orange-300">
            {state.astronaut.name}:
          </strong>{' '}
          &ldquo;Capi, escolhemos o Ponto C, mas qual é a inclinação correta dos painéis?
          Você pode calcular usando o sistema Mars24 da NASA?&rdquo;
        </p>
      </div>

      {/* Painel Holográfico NASA Mars24 */}
      <div className="grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        <div className="space-y-3 rounded-sm border-2 border-cyan-400/70 bg-slate-950 p-3.5 hologram-grid">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/40 pb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-300" />
              <h2 className="font-pixel text-[10px] text-cyan-200">
                PAINEL HOLOGRÁFICO — NASA GISS MARS24
              </h2>
            </div>
            <span className="rounded-sm border border-cyan-400/50 bg-cyan-950/70 px-2 py-0.5 font-dialog text-[11px] text-cyan-200">
              Lat {ARCADIA_LATITUDE_DEG}°N • Lon {ARCADIA_LONGITUDE_DEG}°E
            </span>
          </div>

          {/* Seleção da Estação Marciana e Horário Solar */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <span className="mb-1 block font-pixel text-[8px] text-amber-300">
                1. ESTAÇÃO EM MARTE
              </span>
              <div className="space-y-1.5">
                {(Object.keys(SEASON_INFO) as MarsSeasonId[]).map((seasonId) => (
                  <button
                    key={seasonId}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      updateMission1({ season: seasonId });
                    }}
                    className={`w-full rounded-sm border px-2.5 py-1.5 text-left font-dialog text-xs transition ${
                      season === seasonId
                        ? 'border-amber-400 bg-amber-950/70 text-amber-100'
                        : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {SEASON_INFO[seasonId].label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="mb-1 block font-pixel text-[8px] text-amber-300">
                2. HORÁRIO SOLAR
              </span>
              <div className="space-y-1.5">
                {(Object.keys(SOLAR_HOUR_INFO) as MarsSolarHourId[]).map((hourId) => (
                  <button
                    key={hourId}
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      updateMission1({ solarHour: hourId });
                    }}
                    className={`w-full rounded-sm border px-2.5 py-1.5 text-left font-dialog text-xs transition ${
                      solarHour === hourId
                        ? 'border-cyan-400 bg-cyan-950/70 text-cyan-100'
                        : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {SOLAR_HOUR_INFO[hourId].label} ({SOLAR_HOUR_INFO[hourId].clockLabel})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Saída do cálculo Mars24 */}
          <div className="grid grid-cols-1 gap-2 rounded-sm border border-cyan-500/40 bg-slate-900/95 p-2.5 text-center font-dialog sm:grid-cols-3">
            <div>
              <span className="block text-[10px] text-slate-400">Elevação Solar (h)</span>
              <strong className="text-sm text-amber-300">{calc.elevationDeg}°</strong>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400">Ângulo Zenital (Z)</span>
              <strong className="text-sm text-cyan-300">{calc.zenithDeg}°</strong>
            </div>
            <div>
              <span className="block text-[10px] text-slate-400">Alvo Recomendado</span>
              <strong className="text-xs text-emerald-300">
                {AZIMUTH_LABELS[calc.recommendedAzimuth].split(' ')[0]} •{' '}
                {calc.idealTiltRange[0]}°–{calc.idealTiltRange[1]}°
              </strong>
            </div>
          </div>

          {/* Card colapsável com a equação NASA Mars24 */}
          <div className="rounded-sm border border-slate-700 bg-slate-900/90">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                setShowFormula((prev) => !prev);
              }}
              className="flex w-full items-center justify-between px-3 py-2 font-pixel text-[9px] text-cyan-300 hover:bg-slate-800/70"
            >
              <span>📐 Ver Fórmula NASA Mars24</span>
              {showFormula ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {showFormula && (
              <div className="space-y-1.5 border-t border-slate-800 px-3 py-2.5 font-dialog text-xs text-slate-200">
                <p className="rounded-sm bg-slate-950 p-2 text-center text-cyan-200">
                  Z = arccos(sin δ · sin φ + cos δ · cos φ · cos H)
                  <br />h = 90° − Z
                </p>
                <p className="text-[11px] text-slate-300">
                  • <strong>Z:</strong> ângulo zenital (da vertical) | <strong>h:</strong>{' '}
                  elevação do Sol acima do horizonte.
                  <br />• <strong>δ:</strong> declinação ({calc.declinationDeg}°) |{' '}
                  <strong>φ:</strong> latitude (39°N) | <strong>H:</strong> ângulo horário (
                  {calc.hourAngleDeg}°).
                  <br />• Não existe um único ângulo fixo em Marte: a inclinação ideal muda
                  conforme a estação e a posição do Sol!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Simulador Visual em Tempo Real + Sliders */}
        <div className="flex flex-col justify-between gap-3 rounded-sm border-2 border-orange-500/60 bg-slate-950 p-3.5">
          {/* Cenário animado com Sol, raios e painel inclinando */}
          <div className="relative h-48 overflow-hidden rounded-sm border-2 border-slate-800 bg-gradient-to-b from-orange-950 via-amber-950/70 to-mars-rust">
            {/* Sol marciano posicionado dinamicamente */}
            <div
              style={{ left: `${sunXPercent}%`, top: `${sunYPercent}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-300/30">
                <Sun className="h-7 w-7 animate-pulse text-yellow-200" />
              </div>
            </div>

            {/* Raios solares animados atingindo o painel */}
            <svg
              viewBox="0 0 320 180"
              className="pointer-events-none absolute inset-0 h-full w-full"
            >
              {[-18, 0, 18].map((offset) => (
                <line
                  key={offset}
                  x1={sunXPercent * 3.2 + offset}
                  y1={sunYPercent * 1.8 + 10}
                  x2={160 + offset * 0.7}
                  y2={125}
                  stroke={
                    isHoldingSync || syncProgress > 0
                      ? '#fef08a'
                      : calc.efficiencyPct >= 88
                      ? '#fde047'
                      : '#fb923c'
                  }
                  strokeWidth={
                    isHoldingSync || syncProgress > 0
                      ? 4 + (syncProgress / 100) * 3
                      : calc.efficiencyPct >= 88
                      ? '3'
                      : '2'
                  }
                  strokeDasharray={isHoldingSync ? undefined : '6 5'}
                  opacity={
                    isHoldingSync || syncProgress > 0
                      ? 0.95
                      : Math.max(0.25, calc.efficiencyPct / 100)
                  }
                />
              ))}
            </svg>

            {/* Sprite do painel solar inclinando conforme slider */}
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 flex-col items-center">
              {(isHoldingSync || syncProgress > 0) && (
                <div
                  style={{ opacity: Math.max(0.25, syncProgress / 100) }}
                  className="pointer-events-none absolute -inset-2 animate-pulse rounded-full bg-yellow-300/30 blur-md"
                />
              )}
              <img
                src={ASSET_MANIFEST.solarPanelClean.path}
                alt={ASSET_MANIFEST.solarPanelClean.alt}
                style={{
                  transform: `rotate(${
                    panelAzimuth === 'WEST'
                      ? -panelTiltDeg * 0.35
                      : panelAzimuth === 'EAST'
                      ? panelTiltDeg * 0.35
                      : 0
                  }deg) scaleY(${Math.max(0.72, 1 - panelTiltDeg * 0.0035)})`,
                }}
                className="pixel-art relative h-24 w-24 object-contain transition-transform duration-200"
              />
            </div>

            {/* Badge de geração em Watts */}
            <div className="absolute right-2 top-2 rounded-sm border border-cyan-400/70 bg-slate-950/90 px-2.5 py-1 text-right">
              <span className="block font-pixel text-[8px] text-cyan-300">GERAÇÃO</span>
              <span
                className={`font-pixel text-xs ${
                  canConfirmInstall ? 'text-emerald-300' : 'text-amber-300'
                }`}
              >
                {calc.wattsOutput} W ({calc.efficiencyPct}%)
              </span>
            </div>
          </div>

          {/* Controle 1: Orientação (Azimute) */}
          <div className="space-y-1.5 rounded-sm border border-slate-800 bg-slate-900 p-2.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="azimuth-slider"
                className="inline-flex items-center gap-1.5 font-pixel text-[9px] text-cyan-300"
              >
                <Compass className="h-3.5 w-3.5" />
                ORIENTAÇÃO (AZIMUTE)
              </label>
              <span className="font-dialog text-xs font-bold text-white">
                {AZIMUTH_LABELS[panelAzimuth]}
              </span>
            </div>
            <input
              id="azimuth-slider"
              type="range"
              min={0}
              max={3}
              step={1}
              value={azimuthIndex}
              onChange={(e) => {
                soundEngine.playClick();
                const idx = Number(e.target.value);
                updateMission1({ panelAzimuth: AZIMUTH_ORDER[idx] ?? 'SOUTH' });
              }}
              className="w-full accent-cyan-400"
            />
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              {AZIMUTH_ORDER.map((az) => (
                <button
                  key={az}
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    updateMission1({ panelAzimuth: az });
                  }}
                  className={`min-h-[38px] rounded-sm border px-2 py-1 font-dialog text-[11px] ${
                    panelAzimuth === az
                      ? 'border-cyan-400 bg-cyan-950 text-cyan-100'
                      : 'border-slate-700 bg-slate-950 text-slate-400'
                  }`}
                >
                  {AZIMUTH_LABELS[az].split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Controle 2: Inclinação do Painel (0° a 60°) */}
          <div className="space-y-1.5 rounded-sm border border-slate-800 bg-slate-900 p-2.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="tilt-slider"
                className="inline-flex items-center gap-1.5 font-pixel text-[9px] text-amber-300"
              >
                <Sliders className="h-3.5 w-3.5" />
                INCLINAÇÃO DO PAINEL
              </label>
              <span className="font-dialog text-xs font-bold text-white">
                {panelTiltDeg}° (0°–60°)
              </span>
            </div>
            <input
              id="tilt-slider"
              type="range"
              min={0}
              max={60}
              step={1}
              value={panelTiltDeg}
              onChange={(e) => {
                updateMission1({ panelTiltDeg: Number(e.target.value) });
              }}
              className="w-full accent-amber-400"
            />
            <div className="h-2.5 w-full overflow-hidden rounded-sm bg-slate-800">
              <div
                style={{ width: `${calc.efficiencyPct}%` }}
                className={`h-full transition-all duration-200 ${
                  canConfirmInstall ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
            </div>
          </div>

          {/* Capacitor de Sincronização Solar + Botão Tátil Segurar 3s */}
          <div className="space-y-2 rounded-sm border border-slate-800 bg-slate-900 p-2.5">
            <div className="flex items-center justify-between font-dialog text-[11px]">
              <span className="inline-flex items-center gap-1 font-pixel text-[8px] text-amber-300">
                <Zap className="h-3.5 w-3.5 text-yellow-300" />
                CAPACITOR DE FEIXE SOLAR
              </span>
              <span className="font-bold text-cyan-200">{Math.round(syncProgress)}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-sm border border-slate-700 bg-slate-950">
              <div
                style={{ width: `${syncProgress}%` }}
                className={`h-full transition-all duration-75 ${
                  syncProgress >= 90
                    ? 'bg-emerald-400'
                    : isHoldingSync
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-300'
                    : 'bg-cyan-500'
                }`}
              />
            </div>

            <button
              type="button"
              disabled={!canConfirmInstall}
              onPointerDown={handleStartHoldSync}
              onPointerUp={handleStopHoldSync}
              onPointerLeave={handleStopHoldSync}
              onPointerCancel={handleStopHoldSync}
              className={`touch-none select-none pixel-btn flex w-full items-center justify-center gap-2 px-4 py-3 font-pixel text-[10px] text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-45 ${
                isHoldingSync
                  ? 'bg-yellow-300 shadow-[0_0_24px_rgba(253,224,71,0.7)]'
                  : 'bg-emerald-400 hover:bg-emerald-300'
              }`}
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>
                {canConfirmInstall
                  ? `⚡ Segurar para Sincronizar Feixe (3s) — ${Math.round(syncProgress)}%`
                  : `Ajuste para ${AZIMUTH_LABELS[calc.recommendedAzimuth].split(' ')[0]} e ${calc.idealTiltRange[0]}°–${calc.idealTiltRange[1]}°`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
