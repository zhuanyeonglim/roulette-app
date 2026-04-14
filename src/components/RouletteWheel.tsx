import React, { useState, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface RouletteWheelProps {
  onSpinEnd: () => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
  labels: string[];
  targetIndex: number; // The index of the segment we want to land on
}

export const RouletteWheel: React.FC<RouletteWheelProps> = ({ 
  onSpinEnd, 
  isSpinning, 
  setIsSpinning,
  labels,
  targetIndex
}) => {
  const controls = useAnimation();
  const [rotation, setRotation] = useState(0);
  const [currentLabel, setCurrentLabel] = useState(labels[0]);
  const rotationValue = useMotionValue(0);
  const segmentAngle = labels.length > 0 ? 360 / labels.length : 360;

  useEffect(() => {
    if (labels.length === 0) return;
    const unsubscribe = rotationValue.on('change', (latest) => {
      const index = (Math.round(-latest / segmentAngle) % labels.length + labels.length) % labels.length;
      setCurrentLabel(labels[index]);
    });
    return () => unsubscribe();
  }, [labels, segmentAngle, rotationValue]);

  const spin = async () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    
    const extraRotations = 5 + Math.floor(Math.random() * 2);
    const targetRotation = -(targetIndex * segmentAngle);
    
    const currentBaseRotation = Math.floor(rotation / 360) * 360;
    let finalRotation = currentBaseRotation + (extraRotations * 360) + targetRotation;
    
    if (finalRotation <= rotation) {
      finalRotation += 360;
    }
    
    await controls.start({
      rotate: finalRotation,
      transition: {
        duration: 5,
        ease: [0.15, 0, 0.15, 1]
      }
    });
    
    setRotation(finalRotation);
    setIsSpinning(false);
    onSpinEnd();
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Dynamic Result Label */}
      <div className="h-16 flex flex-col items-center justify-center relative">
        <motion.div
          key={currentLabel}
          initial={{ opacity: 0.5, y: 5, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.1 }}
          className="text-4xl md:text-6xl font-heading font-bold text-[#c5a059] uppercase tracking-widest text-center"
        >
          {currentLabel}
        </motion.div>
        <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-[#c5a059] to-transparent mt-4 opacity-60" />
      </div>

      <div className="relative w-80 h-80 md:w-[460px] md:h-[460px]">
        {/* Pointer - More Intricate */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-40 drop-shadow-[0_0_25px_rgba(197,160,89,0.6)]">
          <svg width="60" height="80" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 80L0 0H60L30 80Z" fill="url(#pointerGradient)"/>
            <path d="M30 70L5 5H55L30 70Z" fill="#c5a059" fillOpacity="0.2"/>
            <circle cx="30" cy="15" r="5" fill="white" fillOpacity="0.5"/>
            <defs>
              <linearGradient id="pointerGradient" x1="30" y1="0" x2="30" y2="80" gradientUnits="userSpaceOnUse">
                <stop stopColor="#c5a059"/>
                <stop offset="1" stopColor="#8a6d3b"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Wheel Container */}
        <motion.div
          animate={controls}
          initial={{ rotate: 0 }}
          style={{ rotate: rotationValue }}
          onUpdate={(latest) => {
            if (typeof latest.rotate === 'number') {
              rotationValue.set(latest.rotate);
            }
          }}
          className="w-full h-full rounded-full border-[12px] border-[#c5a059]/30 bg-black shadow-[0_0_150px_rgba(0,0,0,0.8),0_0_50px_rgba(197,160,89,0.1)] relative overflow-visible p-2"
        >
          {/* Inner Glow Ring */}
          <div className="absolute inset-0 rounded-full border border-[#c5a059]/10 pointer-events-none" />
          
          <svg viewBox="0 0 100 100" className="w-full h-full rounded-full overflow-visible">
            <defs>
              <radialGradient id="segmentMaroon" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#6a0a0a" />
                <stop offset="100%" stopColor="#3a0303" />
              </radialGradient>
              <radialGradient id="segmentDark" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2a2a2a" />
                <stop offset="100%" stopColor="#0a0a0a" />
              </radialGradient>
              <filter id="goldGlow">
                <feGaussianBlur stdDeviation="0.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            
            {labels.map((label, i) => {
              const startAngle = (i * segmentAngle - 90 - segmentAngle / 2) * Math.PI / 180;
              const endAngle = (i * segmentAngle - 90 + segmentAngle / 2) * Math.PI / 180;
              const x1 = 50 + 50 * Math.cos(startAngle);
              const y1 = 50 + 50 * Math.sin(startAngle);
              const x2 = 50 + 50 * Math.cos(endAngle);
              const y2 = 50 + 50 * Math.sin(endAngle);
              
              return (
                <g key={i} className="select-none">
                  <path 
                    d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                    fill={i % 2 === 0 ? 'url(#segmentMaroon)' : 'url(#segmentDark)'}
                    stroke="#c5a059"
                    strokeWidth="0.15"
                    strokeOpacity="0.4"
                  />
                  <text
                    x="84"
                    y="50"
                    transform={`rotate(${i * segmentAngle - 90}, 50, 50)`}
                    fill="#c5a059"
                    textAnchor="middle"
                    className="text-[2.2px] font-heading font-bold tracking-widest uppercase"
                    style={{ dominantBaseline: 'middle', filter: 'url(#goldGlow)' }}
                  >
                    {label}
                  </text>
                </g>
              );
            })}
            
            {/* Intricate Outer Ring Decor */}
            <circle cx="50" cy="50" r="49" fill="none" stroke="#c5a059" strokeWidth="0.5" strokeOpacity="0.2" />
            <circle cx="50" cy="50" r="47" fill="none" stroke="#c5a059" strokeWidth="0.1" strokeOpacity="0.1" />
            
            {/* Decorative Dots */}
            {labels.map((_, i) => {
              const angle = (i * segmentAngle - 90) * Math.PI / 180;
              const x = 50 + 48.5 * Math.cos(angle);
              const y = 50 + 48.5 * Math.sin(angle);
              return <circle key={i} cx={x} cy={y} r="0.4" fill="#c5a059" fillOpacity="0.8" />;
            })}
          </svg>
          
          {/* Center Hub - Premium Layered Look */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 z-30">
            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full bg-[#4a0404] border-[2px] border-[#c5a059]/40 shadow-[0_0_40px_rgba(0,0,0,0.6)]" />
            {/* Inner Ring */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#c5a059] via-[#8a6d3b] to-[#c5a059] p-[2px] shadow-lg">
              <div className="w-full h-full rounded-full bg-[#4a0404] flex items-center justify-center border border-black/20">
                <div className="w-16 h-16 bg-gradient-to-tr from-[#c5a059]/20 to-transparent rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-[#c5a059] rounded-full shadow-[0_0_20px_rgba(197,160,89,0.8)] animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Button
        size="lg"
        onClick={spin}
        disabled={isSpinning}
        className="w-[calc(100%-2rem)] md:w-auto md:px-24 py-8 md:py-12 text-lg md:text-2xl gold-button rounded-none shadow-[0_0_50px_rgba(197,160,89,0.3)] hover:scale-105 active:scale-95 disabled:opacity-50 transition-all duration-500 whitespace-normal h-auto text-center"
      >
        {isSpinning ? (
          <div className="flex items-center justify-center gap-4">
            <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin shrink-0" />
            <span>CONSULTING THE STARS...</span>
          </div>
        ) : (
          'REVEAL MY DESTINY DATE'
        )}
      </Button>
    </div>
  );
};
