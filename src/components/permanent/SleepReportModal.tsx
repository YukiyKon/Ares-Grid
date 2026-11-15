import React, { useEffect, useState } from 'react';
import {
  Activity,
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

  const steps: SleepStep[] = [
    {
      number: 1,
      title: '1. Saúde (Dados Simulados)',
      capiSpeech:
        'Enquanto você descansa, atualizei os sensores simulados do seu organismo inspirados no NASA Spaceflight Standard Measures!',
      icon: <HeartPulse className="h-5 w-5 text-rose-400" />,
    },
    {
      number: 2,
      title: '2. Sono e Descanso',
      capiSpeech:
        'Verifiquei sua duração e qualidade do sono. Dormir bem ajuda os astronautas a tomar ótimas decisões científicas!',
      icon: <Moon className="h-5 w-5 text-indigo-300" />,
    },
    {
      number: 3,
      title: '3. Atividades do Dia',
      capiSpeech:
        'Organizei seus registros de exercícios, alimentação, hidratação e higiene pessoal realizados na expedição.',
      icon: <Activity className="h-5 w-5 text-emerald-300" />,
    },
    {
      number: 4,
      title: '4. Pesquisas e Fotografias',
      capiSpeech:
        'Reuni todos os eventos, observações e fotografias do seu Diário de Bordo científico em um pacote ordenado.',
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
        'Bom dia, comandante! Seu descanso terminou e o relatório foi atualizado. Vamos preparar a próxima exploração!',
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
                <p className="rounded-sm border border-amber-500/60 bg-amber-950/50 p-2 text-[11px] text-amber-100">
                  <strong>Aviso educativo:</strong> Dados simulados para fins educativos. Não
                  representam medições clínicas reais. Referência científica:{' '}
                  <strong>NASA Spaceflight Standard Measures</strong> (actigrafia e
                  questionários de sono e adaptação).
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-sm bg-slate-950 p-2">
                    <span className="text-slate-400">Ritmo cardíaco simulado:</span>
                    <div className="text-sm font-bold text-rose-300">
                      {state.healthSimulation.simulatedHeartRateBpm} bpm
                    </div>
                  </div>
                  <div className="rounded-sm bg-slate-950 p-2">
                    <span className="text-slate-400">Saúde geral (simulada):</span>
                    <div className="text-sm font-bold text-emerald-300">
                      {state.stats.health}%
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-sm bg-slate-950 p-2">
                  <span className="text-slate-400">Duração do sono:</span>
                  <div className="text-sm font-bold text-indigo-300">
                    {state.healthSimulation.sleepHours} horas
                  </div>
                </div>
                <div className="rounded-sm bg-slate-950 p-2">
                  <span className="text-slate-400">Qualidade (actigrafia simulada):</span>
                  <div className="text-sm font-bold text-cyan-300">
                    {state.healthSimulation.sleepQuality}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
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
            )}

            {step === 4 && (
              <div className="space-y-1.5">
                <p>
                  Registros organizados no Diário Científico:{' '}
                  <strong className="text-amber-300">{state.logbook.length}</strong>{' '}
                  entrada(s).
                </p>
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
                  PACOTE ARCADIA_SOL_{state.stats.sol}.JSON gravado no servidor de bordo!
                </span>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-slate-300">
                    Simular disponibilidade do link orbital com a Terra:
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
                {state.mission5.endingUnlocked ? (
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
                  Novo dia iniciado em Arcadia Planitia: <strong>Sol {state.stats.sol}</strong>.
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
              {currentStep.capiSpeech}
            </p>
          </div>

          <div className="flex justify-end">
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
