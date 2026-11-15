export type SurvivalWeatherType =
  | 'CLEAR'
  | 'DUST_WIND'
  | 'GLOBAL_DUST_STORM'
  | 'SOLAR_RADIATION_FLARE';

export interface SolWeatherInfo {
  sol: number;
  type: SurvivalWeatherType;
  title: string;
  shortBadge: string;
  description: string;
  capiAdvice: string;
  solarMultiplier: number;
  dustAccumulation: number;
  isCritical: boolean;
  isModerateAlert: boolean;
  requiredProtocol?: 'SEAL_HATCHES' | 'RADIATION_SHELTER';
}

const MODERATE_DUST_WIND_SOLS = new Set([3, 5, 9, 11, 14, 18, 21, 24, 27]);
const GLOBAL_STORM_SOLS = new Set([6, 12, 22, 29]);
const RADIATION_FLARE_SOLS = new Set([8, 15, 19, 25, 28]);

export function getSolWeather(sol: number): SolWeatherInfo {
  if (GLOBAL_STORM_SOLS.has(sol)) {
    return {
      sol,
      type: 'GLOBAL_DUST_STORM',
      title: 'Tempestade Global de Poeira',
      shortBadge: 'CRÍTICO: TEMPESTADE',
      description:
        'Ventos intensos carregados de óxido de ferro bloqueiam quase toda a luz solar em Arcadia Planitia e pressionam as comportas do habitat.',
      capiAdvice:
        'ALERTA CRÍTICO! Sem proteção na Estação 5 (Abrigo & Escotilhas) antes de dormir, energia e saúde despencarão!',
      solarMultiplier: 0.22,
      dustAccumulation: 48,
      isCritical: true,
      isModerateAlert: false,
      requiredProtocol: 'SEAL_HATCHES',
    };
  }

  if (RADIATION_FLARE_SOLS.has(sol)) {
    return {
      sol,
      type: 'SOLAR_RADIATION_FLARE',
      title: 'Erupção Solar / Radiação Invisível',
      shortBadge: 'CRÍTICO: RADIAÇÃO',
      description:
        'Tempestade severa de prótons solares atinge Marte! Como o planeta não possui campo magnético global forte, o abrigo blindado é questão de vida ou morte.',
      capiAdvice:
        'ALERTA DE RADIAÇÃO! Corra para a Estação 5 (Abrigo Blindado com H₂O e regolito) antes de encerrar o Sol!',
      solarMultiplier: 0.78,
      dustAccumulation: 18,
      isCritical: true,
      isModerateAlert: false,
      requiredProtocol: 'RADIATION_SHELTER',
    };
  }

  if (MODERATE_DUST_WIND_SOLS.has(sol)) {
    return {
      sol,
      type: 'DUST_WIND',
      title: 'Vento de Poeira / Queda Sazonal',
      shortBadge: 'MODERADO: POEIRA',
      description:
        'Rajadas cobrem rapidamente os painéis solares (+32% de poeira) e cortam a geração fotovoltaica pela metade sem manutenção.',
      capiAdvice:
        'Atenção: limpe os painéis na Estação 1 (Solar) ou ative o Modo Economia sob risco de resfriar a estufa à noite!',
      solarMultiplier: 0.52,
      dustAccumulation: 32,
      isCritical: false,
      isModerateAlert: true,
    };
  }

  return {
    sol,
    type: 'CLEAR',
    title: 'Céu Limpo — Atmosfera Seca',
    shortBadge: 'CÉU LIMPO',
    description:
      'Incidência solar nominal em Arcadia Planitia (~39.2°N), porém poeira fina contínua (+18% por Sol) e consumo rígido de água e energia exigem escolhas cirúrgicas.',
    capiAdvice:
      '4 Turnos não bastam para todas as estações! Priorize apenas o setor crítico deste Sol e monitore o efeito dominó.',
    solarMultiplier: 1.0,
    dustAccumulation: 18,
    isCritical: false,
    isModerateAlert: false,
  };
}

/**
 * Capi sempre avisa 1 Sol antes caso o Sol seguinte tenha alerta moderado ou crítico
 * (em especial Sols 7, 14, 21 e 27 antes das tempestades/erupções).
 */
export function getNextSolEarlyWarning(currentSol: number): SolWeatherInfo | null {
  if (currentSol >= 30) return null;
  const nextWeather = getSolWeather(currentSol + 1);
  if (nextWeather.type === 'CLEAR') return null;
  return nextWeather;
}

export function getOrbitalForecast(currentSol: number, daysAhead = 2): SolWeatherInfo[] {
  const list: SolWeatherInfo[] = [];
  for (let offset = 1; offset <= daysAhead; offset++) {
    const targetSol = currentSol + offset;
    if (targetSol <= 30) {
      list.push(getSolWeather(targetSol));
    }
  }
  return list;
}
