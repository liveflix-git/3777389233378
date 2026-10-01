import React, { useState, useEffect, useRef } from 'react';

export interface TypewriterTextProps {
  text: string;
  speed?: number; // ms per character
  delay?: number; // ms initial delay before typing starts
  cursor?: boolean;
  cursorChar?: string;
  cursorClassName?: string;
  className?: string;
  once?: boolean;
  onStart?: () => void;
  onComplete?: () => void;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 20,
  delay = 100,
  cursor = true,
  cursorChar = '│',
  cursorClassName = 'inline-block ml-0.5 text-[#3B82F6] font-bold animate-pulse',
  className = '',
  once = true,
  onStart,
  onComplete,
}) => {
  const [typedChars, setTypedChars] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const onStartRef = useRef(onStart);
  const onCompleteRef = useRef(onComplete);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    onStartRef.current = onStart;
    onCompleteRef.current = onComplete;
  }, [onStart, onComplete]);

  useEffect(() => {
    // Accessibility: Respect user preference for reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setTypedChars(text.length);
      setIsComplete(true);
      onCompleteRef.current?.();
      return;
    }

    if (once && hasAnimatedRef.current) {
      setTypedChars(text.length);
      setIsComplete(true);
      return;
    }

    hasAnimatedRef.current = true;
    let startTimeout: NodeJS.Timeout;
    let typingInterval: NodeJS.Timeout;

    startTimeout = setTimeout(() => {
      onStartRef.current?.();

      let count = 0;
      typingInterval = setInterval(() => {
        count++;
        setTypedChars(count);

        if (count >= text.length) {
          clearInterval(typingInterval);
          setIsComplete(true);
          onCompleteRef.current?.();
        }
      }, Math.max(10, speed));
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (typingInterval) clearInterval(typingInterval);
    };
  }, [text, speed, delay, once]);

  const currentTypedText = text.slice(0, typedChars);

  return (
    <span className={className}>
      {currentTypedText}
      {cursor && !isComplete && (
        <span className={cursorClassName}>{cursorChar}</span>
      )}
    </span>
  );
};
