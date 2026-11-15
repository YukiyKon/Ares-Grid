import React from 'react';
import {
  BookOpen,
  CheckCircle2,
  Home,
  Moon,
  Radio,
  Satellite,
  Sprout,
  SunMedium,
} from 'lucide-react';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

interface InspectionItem {
  key: 'solarPanels' | 'habitatStructure' | 'greenhouseDome' | 'commsSystems';
  title: string;
  statusDetail: string;
  capiMsg: string;
  icon: React.ReactNode;
}

const INSPECTION_ITEMS: InspectionItem[] = [
  {
    key: 'solarPanels',
    title: '1. Painéis Solares Fotovoltaicos',
    statusDetail: 'Produção estabilizada em 480 W e bancos de baterias carregados',
    capiMsg:
      'Painéis solares intactos e limpos! A produção de energia em Arcadia Planitia voltou ao nível nominal.',
    icon: <SunMedium className="h-4 w-4 text-amber-300" />,
  },
  {
    key: 'habitatStructure',
    title: '2. Estrutura e Vedação do Habitat',
    statusDetail: 'Pressurização normal, filtros limpos e zero vazamento após tempestade',
    capiMsg:
      'Habitat verificado! As comportas vedaram perfeitamente e os sensores internos seguem saudáveis.',
    icon: <Home className="h-4 w-4 text-cyan-300" />,
  },
  {
    key: 'greenhouseDome',
    title: '3. Estufa Bioregenerativa (ECLSS)',
    statusDetail: 'Domo protegido, LEDs de cultivo e reciclagem de água/O2 operacionais',
    capiMsg:
      'Estufa protegida! Nossas hortaliças, morangos, trigo e flores passaram pela tempestade em segurança!',
    icon: <Sprout className="h-4 w-4 text-emerald-300" />,
  },
  {
    key: 'commsSystems',
    title: '4. Antenas e Sistemas de Comunicação',
    statusDetail: 'Alinhamento orbital conferido — link preparado para envio à Terra',
    capiMsg:
      'Comunicações verificadas! Depois do Diário de Bordo e do Relatório de Segurança no Sono, podemos transmitir tudo à Terra!',
    icon: <Radio className="h-4 w-4 text-sky-300" />,
  },
];

interface Step4PostStormInspectionProps {
  onCapiFeedback: (line: string) => void;
  onGoEarthComms: () => void;
}

export const Step4PostStormInspection: React.FC<Step4PostStormInspectionProps> = ({
  onCapiFeedback,
  onGoEarthComms,
}) => {
  const { state, openModal, updateMission5 } = useGameStore();
  const inspection = state.mission5.postStormInspection;
  const doneCount = Object.values(inspection).filter(Boolean).length;
  const allChecked = doneCount === 4;
  const { loggedInDiary, endingUnlocked } = state.mission5;

  const handleInspectItem = (item: InspectionItem) => {
    soundEngine.playSuccess();
    updateMission5({
      postStormInspection: {
        ...inspection,
        [item.key]: true,
      },
    });
    onCapiFeedback(item.capiMsg);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-sm border-2 border-emerald-500/60 bg-slate-900/90 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
            <h2 className="font-pixel text-[11px] text-emerald-200">
              DESAFIO 5.4 — INSPEÇÃO PÓS-TEMPESTADE & RELATÓRIO DE SEGURANÇA
            </h2>
          </div>
          <span className="font-pixel text-[9px] text-cyan-300">
            SISTEMAS VERIFICADOS: {doneCount}/4
          </span>
        </div>
      </div>

      {/* Checklist de 4 sistemas pós-tempestade */}
      <div className="grid gap-3 sm:grid-cols-2">
        {INSPECTION_ITEMS.map((item) => {
          const done = inspection[item.key];
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => handleInspectItem(item)}
              className={`flex items-start justify-between gap-2 rounded-sm border-2 p-3 text-left transition ${
                done
                  ? 'border-emerald-400 bg-emerald-950/50 text-emerald-100'
                  : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-cyan-400'
              }`}
            >
              <div>
                <p className="flex items-center gap-1.5 font-dialog text-xs font-bold">
                  {item.icon}
                  {item.title}
                </p>
                <p className="mt-1 font-dialog text-xs text-slate-300">
                  {item.statusDetail}
                </p>
              </div>
              <CheckCircle2
                className={`mt-0.5 h-5 w-5 shrink-0 ${
                  done ? 'text-emerald-400' : 'text-slate-600'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Fechamento obrigatório da Missão 5 + liberação da Cena 6 */}
      <div className="space-y-3 rounded-sm border-2 border-slate-800 bg-slate-900 p-4">
        <p className="font-dialog text-xs leading-relaxed text-slate-200">
          {allChecked
            ? 'Inspeção pós-tempestade 100% aprovada! Faça o Registro Obrigatório no Diário de Bordo e acione o Sono para a Capi gerar o Relatório de Segurança e Exposição à Radiação, liberando a Cena 6 (Central de Comunicação com a Terra).'
            : 'Inspecione os 4 módulos acima para avaliar possíveis efeitos da tempestade antes do registro final.'}
        </p>

        <div className="grid gap-3 md:grid-cols-2">
          <button
            type="button"
            disabled={!allChecked}
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
              ? '✓ Tempestade Registrada no Diário (Abrir)'
              : '1. Registrar Tempestade e Foto no Diário'}
          </button>

          <button
            type="button"
            disabled={!allChecked}
            onClick={() => {
              soundEngine.playSleepChime();
              openModal('SLEEP_REPORT');
            }}
            className="pixel-btn flex items-center justify-center gap-2 bg-indigo-400 px-4 py-2.5 font-dialog text-xs font-bold text-slate-950 hover:bg-indigo-300 disabled:opacity-45"
          >
            <Moon className="h-4 w-4" />
            2. Dormir — Relatório de Segurança e Radiação
          </button>
        </div>

        {endingUnlocked && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border-2 border-cyan-400 bg-cyan-950/60 p-3.5">
            <div>
              <p className="font-pixel text-[10px] text-cyan-200">
                EXPEDIÇÃO CONCLUÍDA — CENTRAL DA TERRA LIBERADA!
              </p>
              <p className="mt-1 font-dialog text-xs text-slate-200">
                Todas as 5 missões estão finalizadas! Retorne à espaçonave para transmitir o Relatório Geral aos cientistas da Terra.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                soundEngine.playSuccess();
                onGoEarthComms();
              }}
              className="pixel-btn inline-flex items-center gap-2 bg-cyan-400 px-4 py-2.5 font-pixel text-[10px] text-slate-950 hover:bg-cyan-300"
            >
              <Satellite className="h-4 w-4" />
              Ir para Central de Comunicação (Encerrar Expedição) ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
