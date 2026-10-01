import React, { useState, useEffect } from 'react';

interface AnimatedMaskedFieldProps {
  isComplete: boolean;
}

const TYPING_ATTEMPTS = [
  '******91',
  '*****a7*',
  '*******#38',
  '********82*',
  '******x91',
  '********74*',
  '*******@92',
  '*********35*',
  '********b80',
  '••••••••••',
];

export const AnimatedMaskedField: React.FC<AnimatedMaskedFieldProps> = ({ isComplete }) => {
  const [text, setText] = useState('****');

  useEffect(() => {
    if (isComplete) {
      setText('••••••••••');
      return;
    }

    let isCancelled = false;
    let attemptIdx = 0;
    let currentStr = '****';

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const runTypingLoop = async () => {
      while (!isCancelled && attemptIdx < TYPING_ATTEMPTS.length - 1) {
        const target = TYPING_ATTEMPTS[attemptIdx];

        // 1. Backspace down to a common prefix (e.g. 3-4 chars)
        while (!isCancelled && currentStr.length > 3) {
          currentStr = currentStr.slice(0, -1);
          setText(currentStr);
          await sleep(50 + Math.random() * 40);
        }

        await sleep(140);

        // 2. Type target character by character
        for (let i = currentStr.length; i < target.length; i++) {
          if (isCancelled) break;
          currentStr += target[i];
          setText(currentStr);
          await sleep(70 + Math.random() * 60);
        }

        // 3. Pause at completed attempt (700ms to 1000ms)
        await sleep(750 + Math.random() * 200);

        attemptIdx++;
      }
    };

    runTypingLoop();

    return () => {
      isCancelled = true;
    };
  }, [isComplete]);

  return (
    <div
      tabIndex={-1}
      className="w-full h-[48px] bg-[#0F141A] border border-[#232C36] rounded-[4px] px-3 font-mono text-[14px] flex items-center select-none pointer-events-none transition-colors"
    >
      <span className="tracking-widest font-semibold text-white/80 select-none">
        {isComplete ? '••••••••••' : text}
      </span>
      {/* NO BADGE/LABEL ON RIGHT SIDE AT ALL */}
    </div>
  );
};
