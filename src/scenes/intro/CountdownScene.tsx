import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../core/gameStore';
import { soundEngine } from '../../core/soundEngine';

export const CountdownScene: React.FC = () => {
  const { setScene } = useGameStore();
  const [count, setCount] = useState(10);

  useEffect(() => {
    const unlockHandler = () => soundEngine.unlock();
    window.addEventListener('pointerdown', unlockHandler, { once: true });
    window.addEventListener('keydown', unlockHandler, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlockHandler);
      window.removeEventListener('keydown', unlockHandler);
    };
  }, []);

  useEffect(() => {
    soundEngine.playCountdownBeep(count);
    if (count === 2) {
      soundEngine.playLaunchRumble(2.2);
    }

    if (count === 0) {
      const doneTimer = window.setTimeout(() => {
        setScene('LAUNCH');
      }, 800);
      return () => window.clearTimeout(doneTimer);
    }

    const tickTimer = window.setTimeout(() => {
      setCount((prev) => Math.max(0, prev - 1));
    }, 680);

    return () => window.clearTimeout(tickTimer);
  }, [count, setScene]);

  const shouldShake = count <= 3;

  return (
    <main
      onClick={() => soundEngine.unlock()}
      className="fixed inset-0 flex select-none items-center justify-center bg-black"
      aria-label={`Contagem regressiva: ${count}`}
    >
      <span
        className={`font-pixel text-7xl tracking-wider sm:text-9xl ${
          count === 0
            ? 'text-orange-400 drop-shadow-[0_0_24px_rgba(251,146,60,0.85)]'
            : count <= 3
            ? 'text-amber-300'
            : 'text-white'
        } ${shouldShake ? 'animate-engineShake' : ''}`}
      >
        {count}
      </span>
    </main>
  );
};
