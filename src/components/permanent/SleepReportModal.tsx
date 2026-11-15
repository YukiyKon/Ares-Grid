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
import { useLanguage } from '../../i18n/LanguageContext';
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
  const { lang, tx, translateText } = useLanguage();
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
      ? tx(
          'Interrupted (weather alert without shelter)',
          'Interrompida (alerta climático sem abrigo)'
        )
      : coldPowerSave
      ? tx(
          'Reduced (cold cabin • Power-Save Mode)',
          'Reduzida (cabine fria • Modo Economia)'
        )
      : activeLog.exercised && activeLog.ateMeal
      ? tx(
          'Excellent (workout + nutrition up to date)',
          'Excelente (treino + nutrição em dia)'
        )
      : tx(
          'Fair (partial Habitat routine)',
          'Regular (rotina parcial no Habitat)'
        )
    : translateText(state.healthSimulation.sleepQuality);
  const thermalConditionLabel = coldPowerSave
    ? tx(
        'Cabin in Power-Save Mode (-4% Health, -10% Stamina)',
        'Cabine em Modo Economia (-4% Saúde, -10% Stamina)'
      )
    : stormInterrupted
    ? tx(
        'Severe weather impact without shelter protection',
        'Impacto climático severo sem abrigo'
      )
    : tx(
        'Thermal & O₂ life support nominal (ECLSS)',
        'Suporte térmico e O₂ nominais (ECLSS)'
      );

  const criticalVitals = isSurvival
    ? ([
        state.survival.health < 40 ? `${tx('Health', 'Saúde')} (${state.survival.health}%)` : null,
        state.survival.stamina < 40 ? `Stamina (${state.survival.stamina}%)` : null,
        state.survival.energy < 40 ? `${tx('Energy', 'Energia')} (${state.survival.energy}%)` : null,
        state.survival.water < 40 ? `${tx('Water', 'Água')} (${state.survival.water}%)` : null,
      ].filter(Boolean) as string[])
    : [];

  const missingHabits: string[] = [];
  if (activeLog) {
    if (!activeLog.exercised) missingHabits.push(tx('physical workout', 'treino físico'));
    if (!activeLog.ateMeal) missingHabits.push(tx('nutritious meal', 'refeição nutritiva'));
    if (!activeLog.hydratedToday) missingHabits.push(tx('Habitat hydration', 'hidratação no Habitat'));
    if (!activeLog.hygieneCompleted) missingHabits.push(tx('sterilization & hygiene', 'esterilização e higiene'));
  }

  const step3CapiSpeech = activeLog
    ? missingHabits.length === 0
      ? tx(
          `Great discipline on this Sol! You completed your gravity workout, ate ${activeLog.mealKcal} kcal, drank ${activeLog.hydrationMl} ml of water, and sterilized the Habitat!`,
          `Excelente disciplina no Sol! Você concluiu o treino gravitacional, repôs ${activeLog.mealKcal} kcal, ingeriu ${activeLog.hydrationMl} ml de água e esterilizou o Habitat!`
        )
      : tx(
          `Heads up on today's real log: missed ${missingHabits.join(
            ', '
          )}. Prioritize the Habitat tomorrow to prevent Health & Stamina loss!`,
          `Atenção nos registros reais de hoje: faltou ${missingHabits.join(
            ', '
          )}. Amanhã priorize o Habitat para evitar queda de saúde e Stamina!`
        )
    : tx(
        'I organized your real logs for exercise, meals, hydration, and personal hygiene at the station.',
        'Organizei seus registros reais de exercícios, alimentação, hidratação e higiene pessoal realizados na estação.'
      );

  const steps: SleepStep[] = [
    {
      number: 1,
      title: tx('1. Health & Vital Signs', '1. Saúde e Sinais Vitais'),
      capiSpeech: isSurvival
        ? tx(
            `I checked the base biosensors: Health at ${state.survival.health}%, Stamina at ${state.survival.stamina}%/${state.survival.maxStamina}%, Energy at ${state.survival.energy}%, and Water at ${state.survival.water}%.`,
            `Verifiquei os biossensores da base: Saúde em ${state.survival.health}%, Stamina em ${state.survival.stamina}%/${state.survival.maxStamina}%, Energia em ${state.survival.energy}% e Água em ${state.survival.water}%.`
          )
        : tx(
            `I checked your post-shift telemetry: Health at ${state.stats.health}%, Base Energy at ${state.stats.energy}%, and Water at ${state.stats.water}%.`,
            `Verifiquei sua telemetria pós-turno: Saúde em ${state.stats.health}%, Energia da base em ${state.stats.energy}% e Água em ${state.stats.water}%.`
          ),
      icon: <HeartPulse className="h-5 w-5 text-rose-400" />,
    },
    {
      number: 2,
      title: tx('2. Sleep & Recovery', '2. Sono e Recuperação'),
      capiSpeech: isSurvival
        ? coldPowerSave
          ? tx(
              'Power-Save Mode conserved batteries, but kept the cabin chilly and cut your rest to 6.4h. Watch out for fatigue tomorrow!',
              'O Modo Economia economizou baterias, mas deixou a cabine fria e reduziu seu descanso para 6,4h. Fique de olho no cansaço amanhã!'
            )
          : stormInterrupted
          ? tx(
              'Outside weather alerts without shelter protection disturbed your sleep this Martian night.',
              'Os alertas externos sem proteção no abrigo perturbaram seu sono nesta noite marciana.'
            )
          : tx(
              'Cabin heating and O₂ stayed stable! Restorative sleep helps physical recovery in 0.38g Mars gravity.',
              'Aquecimento e O₂ da cabine permaneceram estáveis! Seu descanso reparador ajuda na recuperação física em 0,38g.'
            )
        : tx(
            'I analyzed your sleep duration and recovery quality based on spaceflight mission standards.',
            'Analisei sua duração e qualidade do sono com base nos padrões espaciais da missão.'
          ),
      icon: <Moon className="h-5 w-5 text-indigo-300" />,
    },
    {
      number: 3,
      title: tx('3. Real Daily Activities', '3. Atividades Reais do Dia'),
      capiSpeech: step3CapiSpeech,
      icon: <Activity className="h-5 w-5 text-emerald-300" />,
    },
    {
      number: 4,
      title: tx('4. Research & Photos', '4. Pesquisas e Fotografias'),
      capiSpeech: tx(
        `I bundled ${state.logbook.length} Scientific Logbook record(s) into an organized archive packet.`,
        `Reuni ${state.logbook.length} registro(s) do seu Diário de Bordo científico em um pacote ordenado para arquivo.`
      ),
      icon: <FileSearch className="h-5 w-5 text-amber-300" />,
    },
    {
      number: 5,
      title: tx('5. Shipboard Server Storage', '5. Armazenamento no Servidor'),
      capiSpeech: tx(
        'Everything has been safely backed up on our spacecraft server so we never lose a single discovery!',
        'Tudo foi salvo com segurança no servidor de bordo da nossa espaçonave para nunca perdermos nenhuma descoberta!'
      ),
      icon: <Database className="h-5 w-5 text-cyan-300" />,
    },
    {
      number: 6,
      title: tx('6. Earth Communications', '6. Comunicação com a Terra'),
      capiSpeech: earthSignalAvailable
        ? tx(
            'Orbital link established! Sending the science packet to NASA researchers back on Earth...',
            'Conexão orbital estabelecida! Estou enviando o pacote de dados para os cientistas da NASA na Terra...'
          )
        : tx(
            'Direct link unavailable right now! Data stays safely queued on the ship server until the next comms window.',
            'Sinal direto indisponível neste instante! Os dados ficarão aguardando no servidor até a próxima janela de comunicação.'
          ),
      icon: <Radio className="h-5 w-5 text-sky-300" />,
    },
    {
      number: 7,
      title: tx('7. Confirmation & Sunrise', '7. Confirmação e Amanhecer'),
      capiSpeech: tx(
        'Good morning, Commander! Your rest is complete and the real Sol report has been updated. Let us prepare for today’s exploration!',
        'Bom dia, comandante! Seu descanso terminou e o relatório real do Sol foi atualizado. Vamos preparar a próxima exploração!'
      ),
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-2 backdrop-blur-md transition-opacity duration-500 sm:p-3"
      role="dialog"
      aria-modal="true"
      aria-label={tx(
        'Special Scene: Capi While You Sleep',
        'Cena Especial: A Capivara Durante o Sono'
      )}
    >
      <div className="pixel-box relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden bg-slate-950 text-slate-100">
        {/* Cabeçalho */}
        <div className="flex shrink-0 items-center justify-between border-b-4 border-slate-800 bg-indigo-950/80 px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="flex items-center gap-2">
            <Moon className="h-5 w-5 shrink-0 text-indigo-300" />
            <h2 className="font-pixel text-[10px] text-indigo-200 sm:text-xs">
              {tx(
                `CAPI WHILE YOU SLEEP — STEP ${step}/7`,
                `A CAPIVARA DURANTE O SONO — ETAPA ${step}/7`
              )}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              openModal('NONE');
            }}
            className="flex min-h-[40px] min-w-[40px] items-center justify-center rounded-sm border-2 border-slate-700 bg-slate-900 p-1.5 text-slate-300 hover:border-cyan-400"
            aria-label={tx('Close sleep report', 'Fechar relatório de sono')}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Barra de progresso das 7 etapas */}
        <div className="grid shrink-0 grid-cols-7 gap-1 bg-slate-900 px-3 py-2 sm:px-4">
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
        <div className="space-y-4 overflow-y-auto p-3 sm:p-4">
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
                    {tx(
                      `CRITICAL ALERT (< 40%): ${criticalVitals.join(' • ')} in danger zone!`,
                      `ALERTA CRÍTICO (< 40%): ${criticalVitals.join(' • ')} em zona de risco!`
                    )}
                  </p>
                )}

                {isSurvival ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-sm bg-slate-950 p-2">
                      <span className="text-slate-400">{tx('Current Health:', 'Saúde Atual:')}</span>
                      <div
                        className={`text-sm font-bold ${
                          state.survival.health < 40 ? 'text-rose-400' : 'text-emerald-300'
                        }`}
                      >
                        {state.survival.health}%
                      </div>
                    </div>
                    <div className="rounded-sm bg-slate-950 p-2">
                      <span className="text-slate-400">{tx('Stamina (Cap):', 'Stamina (Teto):')}</span>
                      <div
                        className={`text-sm font-bold ${
                          state.survival.stamina < 40 ? 'text-rose-400' : 'text-cyan-300'
                        }`}
                      >
                        {state.survival.stamina}% / {state.survival.maxStamina}%
                      </div>
                    </div>
                    <div className="rounded-sm bg-slate-950 p-2">
                      <span className="text-slate-400">{tx('Base Energy:', 'Energia da Base:')}</span>
                      <div
                        className={`text-sm font-bold ${
                          state.survival.energy < 40 ? 'text-rose-400' : 'text-amber-300'
                        }`}
                      >
                        {state.survival.energy}%
                      </div>
                    </div>
                    <div className="rounded-sm bg-slate-950 p-2">
                      <span className="text-slate-400">{tx('Drinking Water:', 'Água Potável:')}</span>
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
                      <span className="text-slate-400">{tx('Heart rate:', 'Frequência cardíaca:')}</span>
                      <div className="text-sm font-bold text-rose-300">
                        {state.healthSimulation.simulatedHeartRateBpm} bpm
                      </div>
                    </div>
                    <div className="rounded-sm bg-slate-950 p-2">
                      <span className="text-slate-400">{tx('Overall health:', 'Saúde geral:')}</span>
                      <div className="text-sm font-bold text-emerald-300">
                        {state.stats.health}%
                      </div>
                    </div>
                    <div className="rounded-sm bg-slate-950 p-2">
                      <span className="text-slate-400">{tx('Base energy:', 'Energia da base:')}</span>
                      <div className="text-sm font-bold text-amber-300">
                        {state.stats.energy}%
                      </div>
                    </div>
                    <div className="rounded-sm bg-slate-950 p-2">
                      <span className="text-slate-400">{tx('Drinking water:', 'Água potável:')}</span>
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
                  <span className="text-slate-400">{tx('Sleep duration:', 'Duração do sono:')}</span>
                  <div className="text-sm font-bold text-indigo-300">
                    {sleepHoursReal.toFixed(1)} {tx('hours', 'horas')}
                  </div>
                </div>
                <div className="rounded-sm bg-slate-950 p-2">
                  <span className="text-slate-400">{tx('Quality & recovery:', 'Qualidade e recuperação:')}</span>
                  <div className="text-sm font-bold text-cyan-300">{sleepQualityReal}</div>
                </div>
                {isSurvival && (
                  <div className="rounded-sm bg-slate-950 p-2 sm:col-span-2">
                    <span className="text-slate-400">{tx('Thermal / ECLSS status:', 'Condição térmica / ECLSS:')}</span>
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
                        <span className="font-bold text-slate-300">
                          {tx('Workouts (Habitat 2.1): ', 'Exercícios (Habitat 2.1): ')}
                        </span>
                        <span className="text-slate-100">{translateText(activeLog.exerciseSummary)}</span>
                      </div>
                      <span
                        className={`shrink-0 rounded-xs px-1.5 py-0.5 text-[10px] font-bold ${
                          activeLog.exercised
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {activeLog.exercised ? tx('✅ Done', '✅ Concluído') : tx('⚠️ Pending', '⚠️ Pendente')}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2 rounded-sm bg-slate-950 p-2">
                      <div>
                        <span className="font-bold text-slate-300">
                          {tx('Nutrition (Habitat 2.2): ', 'Alimentação (Habitat 2.2): ')}
                        </span>
                        <span className="text-slate-100">{translateText(activeLog.mealSummary)}</span>
                      </div>
                      <span
                        className={`shrink-0 rounded-xs px-1.5 py-0.5 text-[10px] font-bold ${
                          activeLog.ateMeal
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {activeLog.ateMeal ? `✅ ${activeLog.mealKcal} kcal` : tx('⚠️ Pending', '⚠️ Pendente')}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2 rounded-sm bg-slate-950 p-2">
                      <div>
                        <span className="font-bold text-slate-300">
                          {tx('Hydration: ', 'Hidratação: ')}
                        </span>
                        <span className="text-slate-100">{translateText(activeLog.hydrationSummary)}</span>
                      </div>
                      <span
                        className={`shrink-0 rounded-xs px-1.5 py-0.5 text-[10px] font-bold ${
                          activeLog.hydratedToday
                            ? 'bg-cyan-500/20 text-cyan-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {activeLog.hydratedToday ? `💧 ${activeLog.hydrationMl} ml` : tx('⚠️ Low', '⚠️ Baixa')}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2 rounded-sm bg-slate-950 p-2">
                      <div>
                        <span className="font-bold text-slate-300">
                          {tx('Hygiene (Habitat 2.3): ', 'Higiene (Habitat 2.3): ')}
                        </span>
                        <span className="text-slate-100">{translateText(activeLog.hygieneSummary)}</span>
                      </div>
                      <span
                        className={`shrink-0 rounded-xs px-1.5 py-0.5 text-[10px] font-bold ${
                          activeLog.hygieneCompleted
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {activeLog.hygieneCompleted ? tx('✅ Sterilized', '✅ Esterilizado') : tx('⚠️ Pending', '⚠️ Pendente')}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-sm border border-slate-800 bg-slate-950/80 p-2">
                    <span className="block font-bold text-cyan-300">
                      {tx(
                        `Station Operations on this Sol (${activeLog.stationOperations.length}):`,
                        `Operações nas Estações neste Sol (${activeLog.stationOperations.length}):`
                      )}
                    </span>
                    {activeLog.stationOperations.length > 0 ? (
                      <ul className="mt-1 space-y-1 text-[11px] text-slate-200">
                        {activeLog.stationOperations.map((op, idx) => (
                          <li key={`${idx}-${op}`}>• {translateText(op)}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-[11px] text-slate-400">
                        {tx(
                          'No external stations operated on this Sol.',
                          'Nenhuma estação externa operada neste Sol.'
                        )}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <ul className="space-y-1.5 text-slate-200">
                  <li>
                    • {tx('Workouts', 'Exercícios')}:{' '}
                    {state.healthSimulation.exercisesDone.map((ex) => translateText(ex)).join(' | ')}
                  </li>
                  <li>
                    • {tx('Nutrition', 'Alimentação')}:{' '}
                    {translateText(state.healthSimulation.nutritionStatus)}
                  </li>
                  <li>
                    • {tx('Hydration', 'Hidratação')}:{' '}
                    {translateText(state.healthSimulation.hydrationLevel)}
                  </li>
                  <li>
                    • {tx('Personal hygiene', 'Higiene pessoal')}:{' '}
                    {state.healthSimulation.hygieneChecked
                      ? tx('Verified (clean environment)', 'Verificada (ambiente limpo)')
                      : tx('Pending', 'Pendente')}
                  </li>
                </ul>
              )
            )}

            {step === 4 && (
              <div className="space-y-1.5">
                <p>
                  {tx(
                    'Records organized in Scientific Logbook: ',
                    'Registros organizados no Diário Científico: '
                  )}
                  <strong className="text-amber-300">{state.logbook.length}</strong>{' '}
                  {tx('entry(ies).', 'entrada(s).')}
                </p>
                {isSurvival && activeLog && (
                  <p className="rounded-sm border border-cyan-500/40 bg-cyan-950/40 px-2 py-1 text-[11px] text-cyan-100">
                    {tx('Base operations performed today: ', 'Operações executadas hoje na base: ')}
                    <strong>{activeLog.stationOperations.length}</strong>{' '}
                    {tx('shift(s) logged.', 'turno(s) registrado(s).')}
                  </p>
                )}
                {(state.currentScene === 'MISSION_5' ||
                  state.mission5.radiationProtocol.enteredShieldedShelter ||
                  state.mission5.mission5Completed) && (
                  <p className="rounded-sm border border-amber-400/60 bg-amber-950/60 px-2 py-1 text-[11px] text-amber-100">
                    {tx(
                      'Safety & Radiation Report: dust storm contained, solar panels cleaned (480 W), and shielded shelter (H2O/hydrogen + Martian soil) kept radiation exposure at a safe level.',
                      'Relatório de Segurança e Radiação: tempestade de poeira contida, painéis limpos (480 W) e abrigo blindado (água/hidrogênio + solo marciano) manteve a exposição à radiação em nível seguro.'
                    )}
                  </p>
                )}
                {(state.currentScene === 'MISSION_4' || state.mission4.growthStage > 0) && (
                  <p className="rounded-sm border border-emerald-500/40 bg-emerald-950/40 px-2 py-1 text-[11px] text-emerald-200">
                    {tx(
                      `Greenhouse Report: Hydroponics/Aeroponics method, growing ${
                        translateText(state.mission4.selectedCrops.vegetable ?? 'vegetables')
                      }, ${translateText(state.mission4.selectedCrops.fruit ?? 'strawberry')}, ${
                        translateText(state.mission4.selectedCrops.grain ?? 'wheat')
                      }, and ${translateText(state.mission4.selectedCrops.ornamental ?? 'flowers')} (stage ${
                        state.mission4.growthStage
                      }/3).`,
                      `Relatório da Estufa: método Hidroponia/Aeroponia, cultivo de ${
                        state.mission4.selectedCrops.vegetable ?? 'hortaliças'
                      }, ${state.mission4.selectedCrops.fruit ?? 'morango'}, ${
                        state.mission4.selectedCrops.grain ?? 'trigo'
                      } e ${state.mission4.selectedCrops.ornamental ?? 'flores'} (estágio ${
                        state.mission4.growthStage
                      }/3).`
                    )}
                  </p>
                )}
                <p className="text-slate-400">
                  {state.logbook.length > 0
                    ? `${tx('Latest record', 'Último registro')}: "${translateText(state.logbook[0].event)}"`
                    : tx(
                        'Tip: you can also add observations and photos using the Logbook button.',
                        'Dica: você também pode adicionar observações e fotos pelo botão Diário.'
                      )}
                </p>
              </div>
            )}

            {step === 5 && (
              <div className="flex items-center gap-2 text-cyan-200">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                <span>
                  {tx(
                    `PACKET ARCADIA_SOL_${isSurvival ? state.survival.sol : state.stats.sol}.JSON saved to shipboard server!`,
                    `PACOTE ARCADIA_SOL_${isSurvival ? state.survival.sol : state.stats.sol}.JSON gravado no servidor de bordo!`
                  )}
                </span>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-slate-300">
                    {tx('Orbital link window to Earth:', 'Janela de link orbital com a Terra:')}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      setEarthSignalAvailable((prev) => !prev);
                    }}
                    className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-sm border px-2.5 py-1 text-xs font-bold ${
                      earthSignalAvailable
                        ? 'border-emerald-400 bg-emerald-950/70 text-emerald-200'
                        : 'border-amber-400 bg-amber-950/70 text-amber-200'
                    }`}
                  >
                    {earthSignalAvailable ? (
                      <>
                        <Wifi className="h-3.5 w-3.5" /> {tx('Signal Available', 'Sinal Disponível')}
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-3.5 w-3.5" />{' '}
                        {tx('No Signal (Queue on Ship)', 'Sem Sinal (Guardar na Nave)')}
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  {tx(
                    'In real space exploration, transmission depends on communication windows between Mars and Earth.',
                    'Na exploração espacial real, a transmissão depende de janelas de comunicação entre Marte e a Terra.'
                  )}
                </p>
              </div>
            )}

            {step === 7 && (
              <div className="space-y-1.5 text-emerald-200">
                <p className="font-bold">
                  {earthSignalAvailable
                    ? tx(
                        'CONNECTION ESTABLISHED: Data received by Earth Control!',
                        'CONEXÃO ESTABELECIDA: Dados recebidos pela Central Terrestre!'
                      )
                    : tx(
                        'TRANSMISSION QUEUED: Data safely preserved on the ship server.',
                        'TRANSMISSÃO PENDENTE: Dados preservados com segurança no servidor da nave.'
                      )}
                </p>

                {isSurvival && nightlyReport ? (
                  <div className="space-y-2 rounded-sm border border-amber-400/70 bg-amber-950/35 p-2.5 text-xs text-slate-100">
                    <p className="font-pixel text-[9px] text-amber-300">
                      {tx('NIGHTLY BALANCE', 'BALANÇO NOTURNO')} — {tx('SOL', 'SOL')} {nightlyReport.completedSol}/30 (
                      {translateText(nightlyReport.weather.shortBadge)} • {translateText(nightlyReport.weather.title)})
                    </p>
                    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                      <span className="rounded-sm bg-slate-900/90 px-2 py-1">
                        ☀️ {tx('Solar:', 'Solar:')} <strong className="text-amber-300">+{nightlyReport.solarGenerated}%</strong> / -{nightlyReport.energyConsumed}%
                      </span>
                      <span className="rounded-sm bg-slate-900/90 px-2 py-1">
                        💧 {tx('Water:', 'Água:')} <strong className="text-cyan-300">-{nightlyReport.waterConsumed}%</strong> ({nightlyReport.resultingWater}%)
                      </span>
                      <span className="rounded-sm bg-slate-900/90 px-2 py-1">
                        🥗 {tx('Food:', 'Comida:')} <strong className="text-emerald-300">-{nightlyReport.foodConsumed}</strong> ({nightlyReport.resultingFood} {tx('rations', 'rações')})
                      </span>
                      <span className="rounded-sm bg-slate-900/90 px-2 py-1">
                        ❤️ {tx('Health:', 'Saúde:')} <strong className={nightlyReport.healthDelta >= 0 ? 'text-emerald-300' : 'text-rose-300'}>{nightlyReport.healthDelta >= 0 ? `+${nightlyReport.healthDelta}` : nightlyReport.healthDelta}%</strong>
                      </span>
                      <span className="rounded-sm bg-slate-900/90 px-2 py-1">
                        🌪️ {tx('Dust:', 'Poeira:')} <strong className="text-orange-300">+{nightlyReport.dustAdded}%</strong>
                      </span>
                      <span className="rounded-sm bg-slate-900/90 px-2 py-1">
                        🛡️ {tx('Shelter:', 'Abrigo:')} <strong className={nightlyReport.stormPenaltyApplied ? 'text-rose-300' : 'text-emerald-300'}>{nightlyReport.stormPenaltyApplied ? tx('Unprotected!', 'Sem proteção!') : tx('Safe', 'Seguro')}</strong>
                      </span>
                    </div>
                    <p className="text-slate-200">{translateText(nightlyReport.capiSummary)}</p>
                    {nightlyReport.dailyLogSnapshot && (
                      <div className="space-y-1 rounded-sm border border-cyan-500/40 bg-slate-950/75 p-2 text-[11px] text-slate-200">
                        <span className="block font-pixel text-[8px] text-cyan-300">
                          {tx(
                            `REAL SOL ${nightlyReport.completedSol} LOG:`,
                            `REGISTRO REAL DO SOL ${nightlyReport.completedSol}:`
                          )}
                        </span>
                        <p>• {tx('Workouts', 'Exercícios')}: {translateText(nightlyReport.dailyLogSnapshot.exerciseSummary)}</p>
                        <p>• {tx('Nutrition', 'Alimentação')}: {translateText(nightlyReport.dailyLogSnapshot.mealSummary)}</p>
                        <p>• {tx('Hydration', 'Hidratação')}: {translateText(nightlyReport.dailyLogSnapshot.hydrationSummary)}</p>
                        <p>• {tx('Hygiene', 'Higiene')}: {translateText(nightlyReport.dailyLogSnapshot.hygieneSummary)}</p>
                        <p>
                          • {tx('Stations', 'Estações')}:{' '}
                          {nightlyReport.dailyLogSnapshot.stationOperations.length > 0
                            ? nightlyReport.dailyLogSnapshot.stationOperations.map((op) => translateText(op)).join(' | ')
                            : tx('No external stations operated before rest', 'Nenhuma estação operada antes do descanso')}
                        </p>
                      </div>
                    )}
                    <p className="text-[11px] text-emerald-200">
                      {tx('Stamina Cap on Sol', 'Teto de Stamina no Sol')} {state.survival.sol}:{' '}
                      <strong>{nightlyReport.maxStaminaNextSol}%</strong>
                    </p>
                    {nightlyReport.dominoEffects.length > 0 && (
                      <div className="space-y-0.5 rounded-sm border border-rose-500/60 bg-rose-950/45 px-2 py-1.5 text-[11px] text-rose-100">
                        <span className="block font-pixel text-[8px] text-rose-300">
                          {tx('⚠️ NIGHTLY CASCADE FAILURES:', '⚠️ FALHAS EM CASCATA NA NOITE:')}
                        </span>
                        {nightlyReport.dominoEffects.map((effect) => (
                          <p key={effect}>• {translateText(effect)}</p>
                        ))}
                      </div>
                    )}
                    {nextWeather && (
                      <p className="rounded-sm border border-cyan-500/40 bg-slate-900/80 px-2 py-1 text-cyan-200">
                        📡 <strong>{tx(`Forecast Sol ${state.survival.sol}/30:`, `Previsão Sol ${state.survival.sol}/30:`)}</strong>{' '}
                        {translateText(nextWeather.shortBadge)} ({translateText(nextWeather.title)}) —{' '}
                        {nextWarning
                          ? tx(
                              `Tomorrow (Sol ${nextWarning.sol}): ${translateText(nextWarning.title)} — ${translateText(nextWarning.capiAdvice)}`,
                              `Amanhã (Sol ${nextWarning.sol}): ${nextWarning.title} — ${nextWarning.capiAdvice}`
                            )
                          : translateText(nextWeather.capiAdvice)}
                      </p>
                    )}
                  </div>
                ) : state.mission5.endingUnlocked ? (
                  <p className="rounded-sm border border-cyan-400/70 bg-cyan-950/80 px-2 py-1 text-xs text-cyan-100">
                    {tx(
                      '📡 Mission 5 safely completed! All 5 missions are done and Scene 6 — Earth Communications Center is now unlocked!',
                      '📡 Missão 5 concluída com segurança! Todas as 5 missões foram finalizadas e a Cena 6 — Central de Comunicação com a Terra foi desbloqueada!'
                    )}
                  </p>
                ) : state.mission4.mission5Unlocked ? (
                  <p className="rounded-sm border border-amber-400/60 bg-amber-950/70 px-2 py-1 text-xs text-amber-100">
                    {tx(
                      '🌪️ Mission 4 completed! Mission 5 — Alert! Mars Storms is now unlocked!',
                      '🌪️ Missão 4 concluída! A Missão 5 — Alerta! Tempestades em Marte foi desbloqueada!'
                    )}
                  </p>
                ) : state.mission3.mission4Unlocked ? (
                  <p className="rounded-sm border border-emerald-400/60 bg-emerald-950/70 px-2 py-1 text-xs text-emerald-100">
                    {tx(
                      '🌱 Mission 3 completed! Mission 4 — The First Mars Greenhouse is now unlocked!',
                      '🌱 Missão 3 concluída! A Missão 4 — A Primeira Estufa de Marte foi desbloqueada!'
                    )}
                  </p>
                ) : state.mission2.mission3Unlocked ? (
                  <p className="rounded-sm border border-cyan-400/60 bg-cyan-950/70 px-2 py-1 text-xs text-cyan-100">
                    {tx(
                      '🧊 Mission 2 completed! Mission 3 — The Mystery of Mars Ice is now unlocked!',
                      '🧊 Missão 2 concluída! A Missão 3 — O Mistério do Gelo de Marte foi desbloqueada!'
                    )}
                  </p>
                ) : state.mission1.mission2Unlocked ? (
                  <p className="rounded-sm border border-emerald-400/60 bg-emerald-950/70 px-2 py-1 text-xs text-emerald-100">
                    {tx(
                      '🎉 Mission 1 completed! Mission 2 — Caring for the Astronaut is now unlocked!',
                      '🎉 Missão 1 concluída! A Missão 2 — Cuidando do Astronauta foi desbloqueada!'
                    )}
                  </p>
                ) : null}
                <p className="text-xs text-slate-300">
                  {tx('New day started in Arcadia Planitia:', 'Novo dia iniciado em Arcadia Planitia:')}{' '}
                  <strong>
                    {isSurvival
                      ? `${tx('Sol', 'Sol')} ${state.survival.sol}/30 (4 ${tx('Turns', 'Turnos')})`
                      : `Sol ${state.stats.sol}`}
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
              className="pixel-art h-14 w-14 shrink-0 rounded-sm border border-cyan-400/60 bg-slate-900 object-contain sm:h-16 sm:w-16"
            />
            <p className="font-dialog text-xs leading-relaxed text-cyan-50">
              {isSurvival && step === 7 && nightlyReport
                ? translateText(nightlyReport.capiSummary)
                : currentStep.capiSpeech}
            </p>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            {isSurvival && step < 7 && (
              <button
                type="button"
                onClick={handleInstantSurvivalSleep}
                className="pixel-btn min-h-[42px] bg-indigo-400 px-3 py-2 font-dialog text-xs font-bold text-slate-950 hover:bg-indigo-300"
              >
                {lang === 'en'
                  ? `Quick Sleep & View Balance (Sol ${state.survival.sol}) ▶`
                  : `Dormir Rápido & Ver Balanço (Sol ${state.survival.sol}) ▶`}
              </button>
            )}
            <button
              type="button"
              onClick={handleAdvance}
              className="pixel-btn min-h-[42px] bg-cyan-400 px-4 py-2 font-pixel text-[10px] text-slate-950 hover:bg-cyan-300"
            >
              {step < 7
                ? tx(`Next Step (${step + 1}/7) ▶`, `Próxima Etapa (${step + 1}/7) ▶`)
                : tx('Wake Up for New Sol ☀', 'Acordar para o Novo Sol ☀')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
