import React, { useEffect, useRef } from 'react';
import { ViewState } from '../types';

export type ThemeVariant = 'landing' | 'onboarding' | 'letter' | 'reflection';

const getViewVariant = (view: ViewState): ThemeVariant => {
  switch (view) {
    case 'LANDING':
    case 'AUTH':
    case 'SUPPORT':
      return 'landing';
    case 'SETUP':
    case 'GENERATING':
      return 'onboarding';
    case 'LETTER':
      return 'letter';
    case 'REFLECTION':
      return 'reflection';
    default:
      return 'landing';
  }
};

// --- Particle System ---
const ParticleBackground: React.FC<{ variant: ThemeVariant }> = ({ variant }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    // x, y, velocity x, velocity y, size, alpha, targetAlpha
    let particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; targetAlpha: number }[] = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    const createParticles = () => {
      const count = window.innerWidth < 768 ? 25 : 50;
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.15, // Very slow motion
          vy: (Math.random() - 0.5) * 0.15,
          size: Math.random() * 2 + 0.5,
          alpha: 0,
          targetAlpha: Math.random() * 0.4 + 0.1
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Gentle color tint based on variant
      let r=200, g=200, b=200; 
      if (variant === 'landing') { r=173; g=146; b=193; } // Lavender tint
      if (variant === 'onboarding') { r=255; g=166; b=124; } // Peach tint
      if (variant === 'letter') { r=251; g=191; b=36; } // Gold tint
      if (variant === 'reflection') { r=98; g=198; b=202; } // Misty tint

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around screen
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Fade in
        if (p.alpha < p.targetAlpha) p.alpha += 0.005;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    createParticles();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [variant]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-60 transition-opacity duration-1000" />;
};

// --- Ambient Gradient ---
export const BreathingBackground: React.FC<{ view: ViewState }> = ({ view }) => {
  const variant = getViewVariant(view);
  
  const getGradientClasses = () => {
    switch (variant) {
      case 'landing': return 'bg-gradient-to-br from-lavender-50 via-misty-50 to-lavender-100';
      case 'onboarding': return 'bg-gradient-to-br from-warm-50 via-peach-50 to-warm-100';
      case 'letter': return 'bg-gradient-to-br from-warm-50 via-amber-50 to-warm-50'; // Golden glow
      case 'reflection': return 'bg-gradient-to-br from-misty-50 via-lavender-50 to-misty-100'; // Twilight
      default: return 'bg-warm-50';
    }
  };

  return (
    <>
      <div className={`fixed inset-0 bg-transition duration-[3000ms] ${getGradientClasses()} -z-20`}></div>
      {/* Subtle pulse overlay */}
      <div className="fixed inset-0 bg-white/20 animate-pulse-slow mix-blend-overlay -z-10 pointer-events-none"></div>
      <ParticleBackground variant={variant} />
      
      {/* Horizon Glow for Letter Page */}
      <div className={`fixed bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-amber-100/40 to-transparent pointer-events-none z-0 transition-opacity duration-[2000ms] ${variant === 'letter' ? 'opacity-100' : 'opacity-0'}`}></div>
    </>
  );
};