import React, { useState, useEffect } from 'react';

interface AnimatedMaskedFieldProps {
  isComplete: boolean;
  onSimulationComplete?: () => void;
  onErrorStateChange?: (show: boolean) => void;
}

// 12 to 14 seconds total simulation time
const MIN_SIMULATION_TIME = 12000;

// Simulated fake targets
const FAKE_TARGETS = [
  '********a7',
  '**********0',
  '*******e2',
  '*********c',
  '******9x',
  '********4k',
  '*******b80',
  '**********5',
  '********z1',
  '*******p93',
  '*********m1',
  '••••••••••',
];

const randomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const AnimatedMaskedField: React.FC<AnimatedMaskedFieldProps> = ({
  isComplete,
  onSimulationComplete,
  onErrorStateChange,
}) => {
  const [displayedText, setDisplayedText] = useState<string>('');

  useEffect(() => {
    if (isComplete) {
      setDisplayedText('••••••••••');
      onErrorStateChange?.(false);
      return;
    }

    let isCancelled = false;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const timer = setTimeout(() => {
          resolve();
        }, ms);
        if (isCancelled) clearTimeout(timer);
      });

    const runSimulationLoop = async () => {
      const startTime = Date.now();
      let attemptIndex = 0;

      // Loop attempts while total elapsed time is less than MIN_SIMULATION_TIME (12s)
      while (!isCancelled && Date.now() - startTime < MIN_SIMULATION_TIME) {
        const target = FAKE_TARGETS[attemptIndex % (FAKE_TARGETS.length - 1)];
        let current = '';

        // A) Starts typing -> Error message is HIDDEN
        onErrorStateChange?.(false);

        // 1. Type character by character (40ms to 90ms per char)
        for (let i = 0; i < target.length; i++) {
          if (isCancelled) return;
          current += target[i];
          setDisplayedText(current);
          await sleep(randomBetween(40, 90));
        }

        // B) Finishes typing -> Validation pause (150ms to 300ms)
        if (isCancelled) return;
        await sleep(randomBetween(150, 300));

        // C) Show error message ("A senha que você inseriu está incorreta.")
        if (isCancelled) return;
        onErrorStateChange?.(true);

        // D) Keep message visible for 300ms to 550ms
        await sleep(randomBetween(300, 550));

        // E) Hide message before erasing
        if (isCancelled) return;
        onErrorStateChange?.(false);

        // F) Erase character by character (25ms to 60ms per char)
        while (current.length > 0) {
          if (isCancelled) return;
          current = current.slice(0, -1);
          setDisplayedText(current);
          await sleep(randomBetween(25, 60));
        }

        // G) Pause on empty field before next attempt (80ms to 180ms)
        if (isCancelled) return;
        await sleep(randomBetween(80, 180));

        attemptIndex++;
      }

      // FINAL ATTEMPT (executed strictly after 12+ seconds elapsed)
      if (isCancelled) return;
      onErrorStateChange?.(false); // Never show error message on final attempt

      const finalTarget = '••••••••••';
      let finalCurrent = '';

      for (let i = 0; i < finalTarget.length; i++) {
        if (isCancelled) return;
        finalCurrent += finalTarget[i];
        setDisplayedText(finalCurrent);
        await sleep(randomBetween(40, 80));
      }

      // Small final validation pause before success
      if (isCancelled) return;
      await sleep(randomBetween(150, 300));

      // Keep final masked password frozen and trigger success
      if (!isCancelled && onSimulationComplete) {
        onSimulationComplete();
      }
    };

    runSimulationLoop();

    return () => {
      isCancelled = true;
      onErrorStateChange?.(false);
    };
  }, [isComplete, onSimulationComplete, onErrorStateChange]);

  return (
    <div
      tabIndex={-1}
      className="w-full h-[48px] bg-[#0F141A] border border-[#232C36] rounded-[4px] px-3 font-mono text-[14px] flex items-center select-none pointer-events-none transition-colors"
    >
      <span className="tracking-wider font-medium text-white/90 select-none min-h-[20px] flex items-center">
        {displayedText}
      </span>
    </div>
  );
};
