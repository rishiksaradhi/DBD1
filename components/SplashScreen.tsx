
import React from 'react';
import { Handshake, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = () => {
  return (
    <div className="fixed inset-0 z-[200] bg-white dark:bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--primary-glow)] rounded-full blur-[100px] opacity-50"></div>
      
      <div className="relative flex flex-col items-center gap-12 animate-in fade-in zoom-in duration-1000">
        <div className="relative">
          <div className="w-32 h-32 rounded-[2.5rem] bg-[var(--primary)] flex items-center justify-center text-white shadow-2xl animate-float animate-pulse-glow">
            <Handshake size={64} strokeWidth={1.5} />
          </div>
          <div className="absolute -top-4 -right-4 text-[var(--primary)] animate-bounce delay-150">
            <Sparkles size={32} />
          </div>
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
            Campus <span style={{ color: 'var(--primary)' }}>Connect</span>
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-8 bg-slate-200 dark:bg-white/10"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Elite Networking</p>
            <div className="h-px w-8 bg-slate-200 dark:bg-white/10"></div>
          </div>
        </div>

        <div className="w-48 h-1 bg-slate-100 dark:bg-white/5 rounded-full mt-4 overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full bg-[var(--primary)] w-1/3 rounded-full animate-[loading-bar_2s_infinite_ease-in-out]"></div>
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { left: -33%; width: 33%; }
          50% { left: 33%; width: 50%; }
          100% { left: 100%; width: 33%; }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
