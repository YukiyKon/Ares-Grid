import React from 'react';
import { LogbookModal } from './components/permanent/LogbookModal';
import { SleepReportModal } from './components/permanent/SleepReportModal';
import { TopStatusHUD } from './components/permanent/TopStatusHUD';
import { GameProvider } from './core/gameStore';
import { SceneManager } from './core/SceneManager';

export const App: React.FC = () => {
  return (
    <GameProvider>
      <div className="min-h-screen bg-black text-slate-100">
        <TopStatusHUD />
        <SceneManager />
        <LogbookModal />
        <SleepReportModal />
      </div>
    </GameProvider>
  );
};

export default App;
