import React from 'react';
import { ArcadiaMapModal } from './components/permanent/ArcadiaMapModal';
import { LogbookModal } from './components/permanent/LogbookModal';
import { SleepReportModal } from './components/permanent/SleepReportModal';
import { TopStatusHUD } from './components/permanent/TopStatusHUD';
import { GameProvider } from './core/gameStore';
import { SceneManager } from './core/SceneManager';

export const App: React.FC = () => {
  return (
    <GameProvider>
      <div className="min-h-screen bg-black pb-28 text-slate-100">
        <TopStatusHUD />
        <SceneManager />
        <ArcadiaMapModal />
        <LogbookModal />
        <SleepReportModal />
      </div>
    </GameProvider>
  );
};

export default App;
