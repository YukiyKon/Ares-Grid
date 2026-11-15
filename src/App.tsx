import React from 'react';
import { ArcadiaMapModal } from './components/permanent/ArcadiaMapModal';
import { LogbookModal } from './components/permanent/LogbookModal';
import { SleepReportModal } from './components/permanent/SleepReportModal';
import { TopStatusHUD } from './components/permanent/TopStatusHUD';
import { GameProvider, useGameStore } from './core/gameStore';
import { SceneManager } from './core/SceneManager';
import { LanguageProvider, LanguageToggleButton } from './i18n/LanguageContext';
import { BreakerPanelModal } from './modes/survival30/BreakerPanelModal';
import { BunkerModal } from './modes/survival30/BunkerModal';
import { FaintRescueOverlay } from './modes/survival30/FaintRescueOverlay';
import { SurvivalCrisisOverlay } from './modes/survival30/SurvivalCrisisOverlay';

const INTRO_FLOATING_LANG_SCENES = new Set([
  'COUNTDOWN',
  'LAUNCH',
  'CAPI_INTRO',
  'CUSTOMIZE',
  'LANDING',
]);

const IntroFloatingLangToggle: React.FC = () => {
  const { state } = useGameStore();
  if (!INTRO_FLOATING_LANG_SCENES.has(state.currentScene)) {
    return null;
  }
  return (
    <div className="fixed right-2 top-2 z-50 sm:right-3 sm:top-3">
      <LanguageToggleButton compact />
    </div>
  );
};

const AppShell: React.FC = () => {
  const { state } = useGameStore();
  const isArcade = state.currentScene === 'ARCADE_RUSH';
  const isBaseHub = state.currentScene === 'BASE_HUB';
  return (
    <div
      className={`flex min-h-[100dvh] w-full flex-col overflow-x-hidden bg-black text-slate-100 ${
        isArcade ? 'pb-4' : isBaseHub ? 'pb-2' : 'pb-36 sm:pb-32'
      }`}
    >
      <TopStatusHUD />
      <IntroFloatingLangToggle />
      <SceneManager />
      <ArcadiaMapModal />
      <LogbookModal />
      <SleepReportModal />
      <BreakerPanelModal />
      <BunkerModal />
      <FaintRescueOverlay />
      <SurvivalCrisisOverlay />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <GameProvider>
        <AppShell />
      </GameProvider>
    </LanguageProvider>
  );
};

export default App;
