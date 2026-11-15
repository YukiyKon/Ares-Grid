import React from 'react';
import { ArcadiaMapModal } from './components/permanent/ArcadiaMapModal';
import { LogbookModal } from './components/permanent/LogbookModal';
import { SleepReportModal } from './components/permanent/SleepReportModal';
import { TopStatusHUD } from './components/permanent/TopStatusHUD';
import { GameProvider, useGameStore } from './core/gameStore';
import { SceneManager } from './core/SceneManager';
import { LanguageProvider, LanguageToggleButton } from './i18n/LanguageContext';
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

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <GameProvider>
        <div className="min-h-[100dvh] w-full overflow-x-hidden bg-black pb-36 text-slate-100 sm:pb-32">
          <TopStatusHUD />
          <IntroFloatingLangToggle />
          <SceneManager />
          <ArcadiaMapModal />
          <LogbookModal />
          <SleepReportModal />
          <SurvivalCrisisOverlay />
        </div>
      </GameProvider>
    </LanguageProvider>
  );
};

export default App;
