import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Database,
  FileSearch,
  HeartPulse,
  Moon,
  Radio,
  Sun,
  Wifi,
  WifiOff,
  X,
} from 'lucide-react';
import { ASSET_MANIFEST } from '../../assets/assetManifest';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';
import { createEmptyDailyLog } from '../../modes/survival30/survivalTypes';
import {
  getNextSolEarlyWarning,
  getSolWeather,
} from '../../modes/survival30/weatherScheduler';

interface SleepStep {
  number: number;
  title: string;
  capiSpeech: string;
  icon: React.ReactNode;
}

export const SleepReportModal: React.FC = () => {
  const { state, openModal, completeSleepCycle } = useGameStore();
  const [step, setStep] = useState(1);
  const [earthSignalAvailable, setEarthSignalAvailable] = useState(true);
  const [cycleFinished, setCycleFinished] = useState(false);

  const isOpen = state.activeModal === 'SLEEP_REPORT';

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCycleFinished(false);
      setEarthSignalAvailable(true);
      soundEngine.playSleepChime();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isSurvival = state.gameMode === 'SURVIVAL_30';
  const nightlyReport = state.survival.lastNightlyReport;
  const nextWeather = isSurvival ? getSolWeather(state.survival.sol) : null;
  const nextWarning = isSurvival ? getNextSolEarlyWarning(state.survival.sol) : null;
  const activeLog = isSurvival
    ? step === 7 && nightlyReport?.dailyLogSnapshot
      ? nightlyReport.dailyLogSnapshot
      : {
          ...createEmptyDailyLog(),
          ...state.survival.dailyLog,
          stationOperations: [...(state.survival.dailyLog?.stationOperations ?? [])],
        }
    : null;

  const coldPowerSave =
    state.survival.powerSaveActive ||
    Boolean(nightlyReport?.dominoEffects.some((d) => d.includes('Modo Economia')));
  const stormInterrupted = Boolean(nightlyReport?.stormPenaltyApplied);
  const sleepHoursReal = activeLog
    ? stormInterrupted
      ? 5.8
      : coldPowerSave
      ? 6.4
      : activeLog.exercised && activeLog.ateMeal
      ? 8.4
      : 7.6
    : state.healthSimulation.sleepHours;
  const sleepQualityReal = activeLog
    ? stormInterrupted
      ? 'Interrompida (alerta climático sem abrigo)'
      : coldPowerSave
      ? 'Reduzida (cabine fria • Modo Economia)'
      : activeLog.exercised && activeLog.ateMeal
      ? 'Excelente (treino + nutrição em dia)'
      : 'Regular (rotina parcial no Habitat)'
    : state.healthSimulation.sleepQuality;
  const thermalConditionLabel = coldPowerSave
    ? 'Cabine em Modo Economia (-4% Saúde, -10% Stamina)'
    : stormInterrupted
    ? 'Impacto climático severo sem abrigo'
    : 'Suporte térmico e O₂ nominais (ECLSS)';

  const criticalVitals = isSurvival
    ? ([
        state.survival.health < 40 ? `Saúde (${state.survival.health}%)` : null,
        state.survival.stamina < 40 ? `Stamina (${state.survival.stamina}%)` : null,
        state.survival.energy < 40 ? `Energia (${state.survival.energy}%)` : null,
        state.survival.water < 40 ? `Água (${state.survival.water}%)` : null,
      ].filter(Boolean) as string[])
    : [];

  const missingHabits: string[] = [];
  if (activeLog) {
    if (!activeLog.exercised) missingHabits.push('treino físico');
    if (!activeLog.ateMeal) missingHabits.push('refeição nutritiva');
    if (!activeLog.hydratedToday) missingHabits.push('hidratação no Habitat');
    if (!activeLog.hygieneCompleted) missingHabits.push('esterilização e higiene');
  }

  const step3CapiSpeech = activeLog
    ? missingHabits.length === 0
      ? `Excelente disciplina no Sol! Você concluiu o treino gravitacional, repôs ${activeLog.mealKcal} kcal, ingeriu ${activeLog.hydrationMl} ml de água e esterilizou o Habitat!`
      : `Atenção nos registros reais de hoje: faltou ${missingHabits.join(
          ', '
        )}. Amanhã priorize o Habitat para evitar queda de saúde e Stamina!`
    : 'Organizei seus registros reais de exercícios, alimentação, hidratação e higiene pessoal realizados na estação.';

  const steps: SleepStep[] = [
    {
      number: 1,
      title: '1. Saúde e Sinais Vitais',
      capiSpeech: isSurvival
        ? `Verifiquei os biossensores da base: Saúde em ${state.survival.health}%, Stamina em ${state.survival.stamina}%/${state.survival.maxStamina}%, Energia em ${state.survival.energy}% e Água em ${state.survival.water}%.`
        : `Verifiquei sua telemetria pós-turno: Saúde em ${state.stats.health}%, Energia da base em ${state.stats.energy}% e Água em ${state.stats.water}%.`,
      icon: <HeartPulse className="h-5 w-5 text-rose-400" />,
    },
    {
      number: 2,
      title: '2. Sono e Recuperação',
      capiSpeech: isSurvival
        ? coldPowerSave
          ? 'O Modo Economia economizou baterias, mas deixou a cabine fria e reduziu seu descanso para 6,4h. Fique de olho no cansaço amanhã!'
          : stormInterrupted
          ? 'Os alertas externos sem proteção no abrigo perturbaram seu sono nesta noite marciana.'
          : 'Aquecimento e O₂ da cabine permaneceram estáveis! Seu descanso reparador ajuda na recuperação física em 0,38g.'
        : 'Analisei sua duração e qualidade do sono com base nos padrões espaciais da missão.',
      icon: <Moon className="h-5 w-5 text-indigo-300" />,
    },
    {
      number: 3,
      title: '3. Atividades Reais do Dia',
      capiSpeech: step3CapiSpeech,
      icon: <Activity className="h-5 w-5 text-emerald-300" />,
    },
    {
      number: 4,
      title: '4. Pesquisas e Fotografias',
      capiSpeech: `Reuni ${state.logbook.length} registro(s) do seu Diário de Bordo científico em um pacote ordenado para arquivo.`,
      icon: <FileSearch className="h-5 w-5 text-amber-300" />,
    },
    {
      number: 5,
      title: '5. Armazenamento no Servidor',
      capiSpeech:
        'Tudo foi salvo com segurança no servidor de bordo da nossa espaçonave para nunca perdermos nenhuma descoberta!',
      icon: <Database className="h-5 w-5 text-cyan-300" />,
    },
    {
      number: 6,
      title: '6. Comunicação com a Terra',
      capiSpeech: earthSignalAvailable
        ? 'Conexão orbital estabelecida! Estou enviando o pacote de dados para os cientistas da NASA na Terra...'
        : 'Sinal direto indisponível neste instante! Os dados ficarão aguardando no servidor até a próxima janela de comunicação.',
      icon: <Radio className="h-5 w-5 text-sky-300" />,
    },
    {
      number: 7,
      title: '7. Confirmação e Amanhecer',
      capiSpeech:
        'Bom dia, comandante! Seu descanso terminou e o relatório real do Sol foi atualizado. Vamos preparar a próxima exploração!',
      icon: <Sun className="h-5 w-5 text-yellow-300" />,
    },
  ];

  const currentStep = steps[step - 1];

  const handleAdvance = () => {
    soundEngine.playClick();
    if (step < 7) {
      const nextStep = step + 1;
      setStep(nextStep);
      if (nextStep === 7 && !cycleFinished) {
        soundEngine.playSuccess();
        completeSleepCycle(earthSignalAvailable);
        setCycleFinished(true);
      }
    } else {
      openModal('NONE');
    }
  };

  const handleInstantSurvivalSleep = () => {
    soundEngine.playClick();
    setStep(7);
    if (!cycleFinished) {
      soundEngine.playSuccess();
      completeSleepCycle(earthSignalAvailable);
      setCycleFinished(true);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-3 backdrop-blur-md transition-opacity duration-500"
      role="dialog"
      aria-modal="true"
      aria-label="Cena Especial: A Capivara Durante o Sono"
    >
      <div className="pixel-box relative w-full max-w-2xl overflow-hidden bg-slate-950 text-slate-100">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b-4 border-slate-800 bg-indigo-950/80 px-4 py-3">
          <div className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-indigo-300" />
            <h2 className="font-pixel text-[11px] text-indigo-200 sm:text-xs">
              A CAPIVARA DURANTE O SONO — ETAPA {step}/7
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              openModal('NONE');
            }}
            className="rounded-sm border-2 border-slate-700 bg-slate-900 p-1 text-slate-300 hover:border-cyan-400"
            aria-label="Fechar relatório de sono"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Barra de progresso das 7 etapas */}
        <div className="grid grid-cols-7 gap-1 bg-slate-900 px-4 py-2">
          {steps.map((s) => (
            <div
              key={s.number}
              className={`h-2 rounded-sm ${
                s.number < step
                  ? 'bg-emerald-400'
                  : s.number === step
                  ? 'animate-pulse bg-cyan-400'
                  : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Conteúdo da etapa atual */}
        <div className="space-y-4 p-4">
          <div className="flex items-center gap-2 text-cyan-200">
            {currentStep.icon}
            <h3 className="font-pixel text-xs">{currentStep.title}</h3>
          </div>

          {/* Card de dados específicos da etapa */}
          <div className="rounded-sm border-2 border-slate-800 bg-slate-900/90 p-3 font-dialog text-xs">
            {step === 1 && (
              <div className="space-y-2">
                {criticalVitals.length > 0 && (
                  <p className="flex items-center gap-2 rounded-sm border border-rose-500/70 bg-rose-950/60 p-2 text-[11px] font-bold text-rose-100">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-rose-300" />
                    ALERTA CRÍTICO (&lt; 40%): {criticalVitals.join(' • ')} em zona de risco!
                  </p>
                )}

                {isSurvival ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-sm bg-slate-950 p-2">
                      <span className="text-slate-400">Saúde Atual:</span>
                      <div
                        className={`text-sm font-bold ${
                          state.survival.health < 40 ? 'text-rose-400' : 'text-emerald-300'
                        }`}
                      >
                        {state.survival.health}%
                      </div>
                    </div>
                    <div className="rounded-sm bg-slate-950 p-2">
                      <span className="text-slate-400">Stamina (Teto):</span>
                      <div
                        className={`text-sm font-bold ${
                          state.survival.stamina < 40 ? 'text-rose-400' : 'text-cyan-300'
                        }`}
                      >
                        {state.survival.stamina}% / {state.survival.maxStamina}%
                      </div>
                    </div>
                    <div className="rounded-sm bg-slate-950 p-2">
                      <span className="text-slate-400">Energia da Base:</span>
                      <div
                        className={`text-sm font-bold ${
                          state.survival.energy < 40 ? 'text-rose-400' : 'text-amber-300'
                        }`}
                      >
                        {state.survival.energy}%
                      </div>
                    </div>
                    <div className="rounded-sm bg-slate-950 p-2">
                      <span className="text-slate-400">Água Potável:</span>
                      <div
                        className={`text-sm font-bold ${
                          state.survival.water < 40 ? 'text-rose-400' : 'text-sky-300'
                        }`}
                      >
                        {state.survival.water}%
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-sm bg-slate-950 p-2">
                      <span className="text-slate-400">Frequência cardíaca:</span>
                      <div className="text-sm font-bold text-rose-300">
                        {state.healthSimulation.simulatedHeartRateBpm} bpm
                      </div>
                    </div>
                    <div className="rounded-sm bg-slate-950 p-2">
                      <span className="text-slate-400">Saúde geral:</span>
                      <div className="text-sm font-bold text-emerald-300">
                        {state.stats.health}%
                      </div>
                    </div>
                    <div className="rounded-sm bg-slate-950 p-2">
                      <span className="text-slate-400">Energia da base:</span>
                      <div className="text-sm font-bold text-amber-300">
                        {state.stats.energy}%
                      </div>
                    </div>
                    <div className="rounded-sm bg-slate-950 p-2">
                      <span className="text-slate-400">Água potável:</span>
                      <div className="text-sm font-bold text-cyan-300">
                        {state.stats.water}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div className="rounded-sm bg-slate-950 p-2">
                  <span className="text-slate-400">Duração do sono:</span>
                  <div className="text-sm font-bold text-indigo-300">
                    {sleepHoursReal.toFixed(1)} horas
                  </div>
                </div>
                <div className="rounded-sm bg-slate-950 p-2">
                  <span className="text-slate-400">Qualidade e recuperação:</span>
                  <div className="text-sm font-bold text-cyan-300">{sleepQualityReal}</div>
                </div>
                {isSurvival && (
                  <div className="rounded-sm bg-slate-950 p-2 sm:col-span-2">
                    <span className="text-slate-400">Condição térmica / ECLSS:</span>
                    <div className="text-xs font-bold text-slate-200">
                      {thermalConditionLabel}
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              isSurvival && activeLog ? (
                <div className="space-y-2">
                  <div className="grid gap-1.5">
                    <div className="flex items-start justify-between gap-2 rounded-sm bg-slate-950 p-2">
                      <div>
                        <span className="font-bold text-slate-300">Exercícios (Habitat 2.1): </span>
                        <span className="text-slate-100">{activeLog.exerciseSummary}</span>
                      </div>
                      <span
                        className={`shrink-0 rounded-xs px-1.5 py-0.5 text-[10px] font-bold ${
                          activeLog.exercised
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {activeLog.exercised ? '✅ Concluído' : '⚠️ Pendente'}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2 rounded-sm bg-slate-950 p-2">
                      <div>
                        <span className="font-bold text-slate-300">Alimentação (Habitat 2.2): </span>
                        <span className="text-slate-100">{activeLog.mealSummary}</span>
                      </div>
                      <span
                        className={`shrink-0 rounded-xs px-1.5 py-0.5 text-[10px] font-bold ${
                          activeLog.ateMeal
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {activeLog.ateMeal ? `✅ ${activeLog.mealKcal} kcal` : '⚠️ Pendente'}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2 rounded-sm bg-slate-950 p-2">
                      <div>
                        <span className="font-bold text-slate-300">Hidratação: </span>
                        <span className="text-slate-100">{activeLog.hydrationSummary}</span>
                      </div>
                      <span
                        className={`shrink-0 rounded-xs px-1.5 py-0.5 text-[10px] font-bold ${
                          activeLog.hydratedToday
                            ? 'bg-cyan-500/20 text-cyan-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {activeLog.hydratedToday ? `💧 ${activeLog.hydrationMl} ml` : '⚠️ Baixa'}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2 rounded-sm bg-slate-950 p-2">
                      <div>
                        <span className="font-bold text-slate-300">Higiene (Habitat 2.3): </span>
                        <span className="text-slate-100">{activeLog.hygieneSummary}</span>
                      </div>
                      <span
                        className={`shrink-0 rounded-xs px-1.5 py-0.5 text-[10px] font-bold ${
                          activeLog.hygieneCompleted
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {activeLog.hygieneCompleted ? '✅ Esterilizado' : '⚠️ Pendente'}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-sm border border-slate-800 bg-slate-950/80 p-2">
                    <span className="block font-bold text-cyan-300">
                      Operações nas Estações neste Sol ({activeLog.stationOperations.length}):
                    </span>
                    {activeLog.stationOperations.length > 0 ? (
                      <ul className="mt-1 space-y-1 text-[11px] text-slate-200">
                        {activeLog.stationOperations.map((op, idx) => (
                          <li key={`${idx}-${op}`}>• {op}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-[11px] text-slate-400">
                        Nenhuma estação externa operada neste Sol.
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <ul className="space-y-1.5 text-slate-200">
                  <li>• Exercícios: {state.healthSimulation.exercisesDone.join(' | ')}</li>
                  <li>• Alimentação: {state.healthSimulation.nutritionStatus}</li>
                  <li>• Hidratação: {state.healthSimulation.hydrationLevel}</li>
                  <li>
                    • Higiene pessoal:{' '}
                    {state.healthSimulation.hygieneChecked
                      ? 'Verificada (ambiente limpo)'
                      : 'Pendente'}
                  </li>
                </ul>
              )
            )}

            {step === 4 && (
              <div className="space-y-1.5">
                <p>
                  Registros organizados no Diário Científico:{' '}
                  <strong className="text-amber-300">{state.logbook.length}</strong>{' '}
                  entrada(s).
                </p>
                {isSurvival && activeLog && (
                  <p className="rounded-sm border border-cyan-500/40 bg-cyan-950/40 px-2 py-1 text-[11px] text-cyan-100">
                    Operações executadas hoje na base:{' '}
                    <strong>{activeLog.stationOperations.length}</strong> turno(s) registrado(s).
                  </p>
                )}
                {(state.currentScene === 'MISSION_5' ||
                  state.mission5.radiationProtocol.enteredShieldedShelter ||
                  state.mission5.mission5Completed) && (
                  <p className="rounded-sm border border-amber-400/60 bg-amber-950/60 px-2 py-1 text-[11px] text-amber-100">
                    Relatório de Segurança e Radiação: tempestade de poeira contida, painéis limpos (480 W) e abrigo blindado (água/hidrogênio + solo marciano) manteve a exposição à radiação em nível seguro.
                  </p>
                )}
                {(state.currentScene === 'MISSION_4' || state.mission4.growthStage > 0) && (
                  <p className="rounded-sm border border-emerald-500/40 bg-emerald-950/40 px-2 py-1 text-[11px] text-emerald-200">
                    Relatório da Estufa: método Hidroponia/Aeroponia, cultivo de{' '}
                    {state.mission4.selectedCrops.vegetable ?? 'hortaliças'},{' '}
                    {state.mission4.selectedCrops.fruit ?? 'morango'},{' '}
                    {state.mission4.selectedCrops.grain ?? 'trigo'} e{' '}
                    {state.mission4.selectedCrops.ornamental ?? 'flores'} (estágio{' '}
                    {state.mission4.growthStage}/3).
                  </p>
                )}
                <p className="text-slate-400">
                  {state.logbook.length > 0
                    ? `Último registro: "${state.logbook[0].event}"`
                    : 'Dica: você também pode adicionar observações e fotos pelo botão Diário.'}
                </p>
              </div>
            )}

            {step === 5 && (
              <div className="flex items-center gap-2 text-cyan-200">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span>
                  PACOTE ARCADIA_SOL_{isSurvival ? state.survival.sol : state.stats.sol}.JSON
                  {' '}gravado no servidor de bordo!
                </span>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-slate-300">
                    Janela de link orbital com a Terra:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setEarthSignalAvailable((prev) => !prev);
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-xs font-bold ${
                      earthSignalAvailable
                        ? 'border-emerald-400 bg-emerald-950/70 text-emerald-200'
                        : 'border-amber-400 bg-amber-950/70 text-amber-200'
                    }`}
                  >
                    {earthSignalAvailable ? (
                      <>
                        <Wifi className="h-3.5 w-3.5" /> Sinal Disponível
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-3.5 w-3.5" /> Sem Sinal (Guardar na Nave)
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Na exploração espacial real, a transmissão depende de janelas de
                  comunicação entre Marte e a Terra.
                </p>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-1.5 text-emerald-200">
                <p className="font-bold">
                  {earthSignalAvailable
                    ? 'CONEXÃO ESTABELECIDA: Dados recebidos pela Central Terrestre!'
                    : 'TRANSMISSÃO PENDENTE: Dados preservados com segurança no servidor da nave.'}
                </p>

                {isSurvival && nightlyReport ? (
                  <div className="space-y-2 rounded-sm border border-amber-400/70 bg-amber-950/35 p-2.5 text-xs text-slate-100">
                    <p className="font-pixel text-[9px] text-amber-300">
                      BALANÇO NOTURNO — SOL {nightlyReport.completedSol}/30 ({nightlyReport.weather.shortBadge} • {nightlyReport.weather.title})
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                      <span className="rounded-sm bg-slate-900/90 px-2 py-1">
                        ☀️ Solar: <strong className="text-amber-300">+{nightlyReport.solarGenerated}%</strong> / -{nightlyReport.energyConsumed}%
                      </span>
                      <span className="rounded-sm bg-slate-900/90 px-2 py-1">
                        💧 Água: <strong className="text-cyan-300">-{nightlyReport.waterConsumed}%</strong> ({nightlyReport.resultingWater}%)
                      </span>
                      <span className="rounded-sm bg-slate-900/90 px-2 py-1">
                        🥗 Comida: <strong className="text-emerald-300">-{nightlyReport.foodConsumed}</strong> ({nightlyReport.resultingFood} rações)
                      </span>
                      <span className="rounded-sm bg-slate-900/90 px-2 py-1">
                        ❤️ Saúde: <strong className={nightlyReport.healthDelta >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{nightlyReport.healthDelta >= 0 ? `+${nightlyReport.healthDelta}` : nightlyReport.healthDelta}%</strong>
                      </span>
                      <span className="rounded-sm bg-slate-900/90 px-2 py-1">
                        🌪️ Poeira: <strong className="text-orange-300">+{nightlyReport.dustAdded}%</strong>
                      </span>
                      <span className="rounded-sm bg-slate-900/90 px-2 py-1">
                        🛡️ Abrigo: <strong className={nightlyReport.stormPenaltyApplied ? 'text-rose-300' : 'text-emerald-300'}>{nightlyReport.stormPenaltyApplied ? 'Sem proteção!' : 'Seguro'}</strong>
                      </span>
                    </div>
                    <p className="text-slate-200">{nightlyReport.capiSummary}</p>
                    {nightlyReport.dailyLogSnapshot && (
                      <div className="space-y-1 rounded-sm border border-cyan-500/40 bg-slate-950/75 p-2 text-[11px] text-slate-200">
                        <span className="block font-pixel text-[8px] text-cyan-300">
                          REGISTRO REAL DO SOL {nightlyReport.completedSol}:
                        </span>
                        <p>• Exercícios: {nightlyReport.dailyLogSnapshot.exerciseSummary}</p>
                        <p>• Alimentação: {nightlyReport.dailyLogSnapshot.mealSummary}</p>
                        <p>• Hidratação: {nightlyReport.dailyLogSnapshot.hydrationSummary}</p>
                        <p>• Higiene: {nightlyReport.dailyLogSnapshot.hygieneSummary}</p>
                        <p>
                          • Estações:{' '}
                          {nightlyReport.dailyLogSnapshot.stationOperations.length > 0
                            ? nightlyReport.dailyLogSnapshot.stationOperations.join(' | ')
                            : 'Nenhuma estação operada antes do descanso'}
                        </p>
                      </div>
                    )}
                    <p className="text-[11px] text-emerald-200">
                      Teto de Stamina no Sol {state.survival.sol}:{' '}
                      <strong>{nightlyReport.maxStaminaNextSol}%</strong>
                    </p>
                    {nightlyReport.dominoEffects.length > 0 && (
                      <div className="space-y-0.5 rounded-sm border border-rose-500/60 bg-rose-950/45 px-2 py-1.5 text-[11px] text-rose-100">
                        <span className="block font-pixel text-[8px] text-rose-300">
                          ⚠️ FALHAS EM CASCATA NA NOITE:
                        </span>
                        {nightlyReport.dominoEffects.map((effect) => (
                          <p key={effect}>• {effect}</p>
                        ))}
                      </div>
                    )}
                    {nextWeather && (
                      <p className="rounded-sm border border-cyan-500/40 bg-slate-900/80 px-2 py-1 text-cyan-200">
                        📡 <strong>Previsão Sol {state.survival.sol}/30:</strong> {nextWeather.shortBadge} ({nextWeather.title}) —{' '}
                        {nextWarning
                          ? `Amanhã (Sol ${nextWarning.sol}): ${nextWarning.title} — ${nextWarning.capiAdvice}`
                          : nextWeather.capiAdvice}
                      </p>
                    )}
                  </div>
                ) : state.mission5.endingUnlocked ? (
                  <p className="rounded-sm border border-cyan-400/70 bg-cyan-950/80 px-2 py-1 text-xs text-cyan-100">
                    📡 Missão 5 concluída com segurança! Todas as 5 missões foram finalizadas e a <strong>Cena 6 — Central de Comunicação com a Terra</strong> foi desbloqueada!
                  </p>
                ) : state.mission4.mission5Unlocked ? (
                  <p className="rounded-sm border border-amber-400/60 bg-amber-950/70 px-2 py-1 text-xs text-amber-100">
                    🌪️ Missão 4 concluída! A <strong>Missão 5 — Alerta! Tempestades em Marte</strong> foi desbloqueada!
                  </p>
                ) : state.mission3.mission4Unlocked ? (
                  <p className="rounded-sm border border-emerald-400/60 bg-emerald-950/70 px-2 py-1 text-xs text-emerald-100">
                    🌱 Missão 3 concluída! A <strong>Missão 4 — A Primeira Estufa de Marte</strong> foi desbloqueada!
                  </p>
                ) : state.mission2.mission3Unlocked ? (
                  <p className="rounded-sm border border-cyan-400/60 bg-cyan-950/70 px-2 py-1 text-xs text-cyan-100">
                    🧊 Missão 2 concluída! A <strong>Missão 3 — O Mistério do Gelo de Marte</strong> foi desbloqueada!
                  </p>
                ) : state.mission1.mission2Unlocked ? (
                  <p className="rounded-sm border border-emerald-400/60 bg-emerald-950/70 px-2 py-1 text-xs text-emerald-100">
                    🎉 Missão 1 concluída! A <strong>Missão 2 — Cuidando do Astronauta</strong> foi desbloqueada!
                  </p>
                ) : null}
                <p className="text-xs text-slate-300">
                  Novo dia iniciado em Arcadia Planitia:{' '}
                  <strong>
                    {isSurvival ? `Sol ${state.survival.sol}/30 (4 Turnos)` : `Sol ${state.stats.sol}`}
                  </strong>.
                </p>
              </div>
            )}
          </div>

          {/* Janela holográfica da Capi explicando a etapa */}
          <div className="flex items-center gap-3 rounded-sm border-2 border-cyan-500/60 bg-cyan-950/30 p-3 hologram-grid">
            <img
              src={ASSET_MANIFEST.capiPortrait.path}
              alt={ASSET_MANIFEST.capiPortrait.alt}
              className="pixel-art h-16 w-16 shrink-0 rounded-sm border border-cyan-400/60 bg-slate-900 object-contain"
            />
            <p className="font-dialog text-xs leading-relaxed text-cyan-50">
              {isSurvival && step === 7 && nightlyReport
                ? nightlyReport.capiSummary
                : currentStep.capiSpeech}
            </p>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            {isSurvival && step < 7 && (
              <button
                type="button"
                onClick={handleInstantSurvivalSleep}
                className="pixel-btn bg-indigo-400 px-3 py-2 font-dialog text-xs font-bold text-slate-950 hover:bg-indigo-300"
              >
                Dormir Rápido &amp; Ver Balanço (Sol {state.survival.sol}) ▶
              </button>
            )}
            <button
              type="button"
              onClick={handleAdvance}
              className="pixel-btn bg-cyan-400 px-4 py-2 font-pixel text-[10px] text-slate-950 hover:bg-cyan-300"
            >
              {step < 7 ? `Próxima Etapa (${step + 1}/7) ▶` : 'Acordar para o Novo Sol ☀'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
