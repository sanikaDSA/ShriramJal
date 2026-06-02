import React from 'react';
import waterCanSplash from '../assets/images/water_can_splash_1780294024326.png';

interface WaterCanVisualProps {
  type: 'cold' | 'normal';
  capacity: '20L' | '10L' | '5L' | '1L';
  className?: string;
  glow?: boolean;
}

export const WaterCanVisual: React.FC<WaterCanVisualProps> = ({
  type,
  capacity,
  className = "w-32 h-44",
  glow = false
}) => {
  const isCold = type === 'cold';

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Background radial soft light for cold or pure items */}
      <div className={`absolute inset-0 rounded-full blur-2xl opacity-30 transition-all ${
        isCold ? 'bg-cyan-500 group-hover:opacity-50 animate-pulse' : 'bg-blue-400 group-hover:opacity-45'
      }`} />

      {/* Realistic high-quality water can image with splashes */}
      <img
        src={waterCanSplash}
        alt={`Shriram Jal ${capacity} ${type}`}
        className="w-full h-[85%] object-contain drop-shadow-2xl transition-all duration-300 group-hover:scale-110 select-none z-10"
        style={{ filter: isCold ? 'hue-rotate(10deg) saturate(1.2)' : 'none' }}
        referrerPolicy="no-referrer"
      />

      {/* Floating ice gems context overlays for COLD items */}
      {isCold && (
        <div className="absolute top-2 right-2 flex space-x-0.5 animate-bounce z-20" style={{ animationDuration: '4s' }}>
          <span className="text-cyan-400 text-lg select-none filter drop-shadow font-bold">❄️</span>
        </div>
      )}

      {/* Temperature status indicators & capacity badge in UI */}
      <span className={`absolute -bottom-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider font-bold shadow-md select-none text-white border z-25 ${
        isCold 
          ? 'bg-gradient-to-r from-sky-500 to-cyan-500 border-sky-300' 
          : 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-400'
      }`}>
        {capacity} • {isCold ? 'COLD' : 'NORMAL'}
      </span>
    </div>
  );
};

export const CustomWaterSplash: React.FC<{ className?: string }> = ({ className = "w-full h-24" }) => {
  return (
    <div className={`relative overflow-hidden select-none ${className}`}>
      {/* Visual dynamic liquid wave vector */}
      <svg
        viewBox="0 0 1440 200"
        className="absolute bottom-0 w-full h-full text-blue-500/10 fill-current"
        preserveAspectRatio="none"
      >
        <path d="M0,128 C280,180 420,40 720,120 C1020,200 1160,80 1440,160 L1440,200 L0,200 Z" stroke="none" />
      </svg>
      <svg
        viewBox="0 0 1440 200"
        className="absolute bottom-0 w-full h-2/3 text-blue-500/20 fill-current animate-pulse"
        preserveAspectRatio="none"
        style={{ animationDuration: '6s' }}
      >
        <path d="M0,160 C320,80 480,180 800,100 C1120,20 1280,140 1440,120 L1440,200 L0,200 Z" stroke="none" />
      </svg>
      <svg
        viewBox="0 0 1440 200"
        className="absolute bottom-0 w-full h-1/2 text-cyan-400/25 fill-current"
        preserveAspectRatio="none"
      >
        <path d="M0,120 C240,160 480,90 720,130 C960,170 1200,110 1440,140 L1440,200 L0,200 Z" stroke="none" />
      </svg>
    </div>
  );
};
