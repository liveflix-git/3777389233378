import React, { useEffect, useRef } from 'react';

interface MatrixBackgroundProps {
  opacity?: number;
  speed?: number;
}

export const MatrixBackground: React.FC<MatrixBackgroundProps> = ({
  opacity = 0.85,
  speed = 0.6,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Intelligence telemetry tokens, hex, coordinates and system telemetry
    const techTokens = [
      '0x7F', 'NODE_04', 'LAT -23.55', 'LON -46.63', 'SIG_INT', 'SHA256',
      'SYNC', 'PACKET', 'TLS1.3', 'SEC_ENCR', 'ROUTE_OK', 'IP_MASK',
      '01', 'FF', '3B82', '4F46', '2563', '7C3A', 'STREAM', 'ANON',
      'PORT:443', 'CH:88', 'INTEL_V2', 'BEACON', 'CIPHER', 'HEX_DECR'
    ];

    const chars = '0123456789ABCDEFabcdef:;._-/>#%&*';
    const charArray = chars.split('');

    const fontSize = width < 640 ? 12 : 13;
    let columns = Math.floor(width / (fontSize * 1.6));

    interface ColumnData {
      y: number;
      speed: number;
      tokenTimer: number;
      currentToken: string;
      isTechString: boolean;
    }

    let columnsData: ColumnData[] = [];
    const initColumns = () => {
      columns = Math.floor(width / (fontSize * 1.6));
      columnsData = [];
      for (let i = 0; i < columns; i++) {
        columnsData[i] = {
          y: Math.floor(Math.random() * -80),
          speed: 0.35 + Math.random() * 0.45,
          tokenTimer: 0,
          currentToken: techTokens[Math.floor(Math.random() * techTokens.length)],
          isTechString: Math.random() > 0.65,
        };
      }
    };
    initColumns();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initColumns();
    };

    window.addEventListener('resize', handleResize);

    let lastTime = 0;
    const interval = 45 / speed;

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);

      if (time - lastTime < interval) return;
      lastTime = time;

      // Deep fading clear in black (smooth trail)
      ctx.fillStyle = 'rgba(5, 5, 7, 0.12)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < columnsData.length; i++) {
        const col = columnsData[i];
        const x = i * (fontSize * 1.6);
        const y = col.y * fontSize;

        col.tokenTimer++;
        if (col.tokenTimer > 15) {
          col.tokenTimer = 0;
          if (Math.random() > 0.35) {
            col.currentToken = techTokens[Math.floor(Math.random() * techTokens.length)];
            col.isTechString = Math.random() > 0.55;
          }
        }

        const rand = Math.random();
        if (rand > 0.96) {
          // Bright electric cyan/blue highlight with glow
          ctx.fillStyle = '#38BDF8';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#0284C7';
        } else if (rand > 0.88) {
          // Vivid electric blue
          ctx.fillStyle = '#60A5FA';
          ctx.shadowBlur = 6;
          ctx.shadowColor = '#2563EB';
        } else if (rand > 0.80) {
          // Indigo & purple cyber tone
          ctx.fillStyle = '#818CF8';
          ctx.shadowBlur = 4;
          ctx.shadowColor = '#4F46E5';
        } else if (rand > 0.72) {
          // Cyber violet highlight
          ctx.fillStyle = '#A78BFA';
          ctx.shadowBlur = 3;
          ctx.shadowColor = '#7C3AED';
        } else {
          // Crisp readable technical blue-slate
          ctx.fillStyle = 'rgba(148, 163, 184, 0.42)';
          ctx.shadowBlur = 0;
        }

        const displayChar = col.isTechString
          ? col.currentToken.charAt(Math.floor(col.y) % col.currentToken.length)
          : charArray[Math.floor(Math.random() * charArray.length)];

        ctx.fillText(displayChar, x, y);

        // Reset column
        if (y > height && Math.random() > 0.98) {
          col.y = Math.floor(Math.random() * -30);
          col.isTechString = Math.random() > 0.55;
        }

        col.y += col.speed;
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [speed]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ opacity }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      {/* Soft gradient edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050507]/60 via-transparent to-[#050507]/75" />
    </div>
  );
};
