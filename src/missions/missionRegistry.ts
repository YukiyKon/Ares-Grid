export type MissionId =
  | 'MISSION_1'
  | 'MISSION_2'
  | 'MISSION_3'
  | 'MISSION_4'
  | 'MISSION_5';

export type MissionStatus = 'AVAILABLE' | 'LOCKED' | 'COMPLETED';

export interface MissionDefinition {
  id: MissionId;
  order: number;
  title: string;
  subtitle: string;
  status: MissionStatus;
  scientificObjective: string;
  nasaReference: string;
  challengesPreview: string[];
}

export const MISSION_REGISTRY: MissionDefinition[] = [
  {
    id: 'MISSION_1',
    order: 1,
    title: 'Missão 1 — Energia para Explorar Marte',
    subtitle: 'Sistema Fotovoltaico em Arcadia Planitia',
    status: 'AVAILABLE',
    scientificObjective:
      'Instalar o sistema de painéis solares e compreender a relação entre posição aparente do Sol (Mars24), inclinação, poeira e produção de energia.',
    nasaReference: 'NASA GISS — Mars24 Algorithm & Photovoltaic Arrays for Martian Surface Power',
    challengesPreview: [
      'Desafio 1.1: Escolhendo o local de instalação livre de sombras e poeira',
      'Desafio 1.2: Capi calcula elevação e azimute solar (equação Mars24)',
      'Desafio 1.3: Testando produção de energia, baterias e alerta de poeira',
    ],
  },
  {
    id: 'MISSION_2',
    order: 2,
    title: 'Missão 2 — Cuidando do Astronauta',
    subtitle: 'Saúde, Exercícios, Nutrição, Higiene e Sono',
    status: 'LOCKED',
    scientificObjective:
      'Investigar como o ambiente espacial influencia o organismo humano e aplicar rotinas simuladas de cuidado e descanso.',
    nasaReference: 'NASA Spaceflight Standard Measures (Actigrafia e Questionários)',
    challengesPreview: [
      'Desafio 2.1: Exercícios físicos contra a baixa gravidade',
      'Desafio 2.2 e 2.3: Refeição equilibrada, hidratação e higiene',
      'Desafio 2.4: Cena Especial da Capivara Durante o Sono (7 etapas)',
    ],
  },
  {
    id: 'MISSION_3',
    order: 3,
    title: 'Missão 3 — O Mistério do Gelo de Marte',
    subtitle: 'Radar SHARAD, Perfuração e Potabilidade',
    status: 'LOCKED',
    scientificObjective:
      'Analisar camadas de radar orbital, estudos prévios e realizar pequenas perfurações exploratórias em busca de gelo subterrâneo.',
    nasaReference: 'NASA First Ice Cores from Mars & MRO SHARAD',
    challengesPreview: [
      'Desafio 3.1 e 3.2: Camadas HiRISE, Radar SHARAD e Estudos Prévios',
      'Desafio 3.3 e 3.4: Perfuração exploratória e coleta de ice core',
      'Desafio 3.5 e 3.6: Filtragem, tratamento e painel de potabilidade',
    ],
  },
  {
    id: 'MISSION_4',
    order: 4,
    title: 'Missão 4 — A Primeira Estufa de Marte',
    subtitle: 'Agricultura Espacial e Sistema Bioregenerativo',
    status: 'LOCKED',
    scientificObjective:
      'Construir uma estufa controlada com hidroponia e aeroponia para pesquisar suporte à vida sustentável.',
    nasaReference: 'NASA Sistemas Bioregenerativos de Suporte à Vida (ECLSS)',
    challengesPreview: [
      'Disponível nas próximas etapas de desenvolvimento.',
    ],
  },
  {
    id: 'MISSION_5',
    order: 5,
    title: 'Missão 5 — Alerta! Tempestades em Marte',
    subtitle: 'Poeira Marciana e Eventos de Radiação Solar',
    status: 'LOCKED',
    scientificObjective:
      'Diferenciar tempestades de poeira de eventos de radiação solar e aplicar protocolos de proteção do habitat.',
    nasaReference: 'NASA Dust in the Wind & Real Martians',
    challengesPreview: [
      'Disponível nas próximas etapas de desenvolvimento.',
    ],
  },
];
