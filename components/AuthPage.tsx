
import React from 'react';
import { Handshake, Mail, ArrowRight, Github, Key, CheckCircle2 } from 'lucide-react';

interface AuthPageProps {
  onLogin: () => void;
  onSelectKey?: () => void;
  hasCustomKey?: boolean;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onSelectKey, hasCustomKey }) => {
  return (
    <div className="fixed inset-0 z-[150] bg-white dark:bg-slate-950 flex items-center justify-center p-6 overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--primary-glow)] rounded-full blur-[120px] opacity-40"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px] opacity-20"></div>

      <div className="w-full max-w-md relative z-10 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 rounded-[1.8rem] bg-[var(--primary)] flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20">
            <Handshake size={40} />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-none">
              Gateway <span style={{ color: 'var(--primary)' }}>Access</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Secure University Environment</p>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={onLogin}
            className="w-full group bg-slate-900 dark:bg-white text-white dark:text-black font-black py-6 px-8 rounded-2xl flex items-center justify-between transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] shadow-xl"
          >
            <div className="flex items-center gap-4">
              <Mail size={20} />
              <span className="uppercase tracking-widest text-xs">University ID Login</span>
            </div>
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>

          {onSelectKey && (
            <button 
              onClick={onSelectKey}
              className="w-full group bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-bold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-100 dark:border-white/5 active:scale-[0.98]"
            >
              {hasCustomKey ? (
                <>
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span className="uppercase tracking-widest text-[10px]">High Capacity Active</span>
                </>
              ) : (
                <>
                  <Key size={16} />
                  <span className="uppercase tracking-widest text-[10px]">Optimize Quota Access</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="pt-8 flex flex-col items-center gap-6">
          <div className="flex items-center gap-4 w-full">
            <div className="h-px flex-1 bg-slate-100 dark:bg-white/5"></div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Other Access</span>
            <div className="h-px flex-1 bg-slate-100 dark:bg-white/5"></div>
          </div>
          
          <div className="flex gap-4">
            <button className="w-12 h-12 rounded-xl border border-slate-100 dark:border-white/5 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
              <Github size={20} />
            </button>
          </div>

          <p className="text-[10px] text-slate-400 font-bold text-center leading-relaxed max-w-[240px]">
            By accessing this platform, you agree to the <span className="underline cursor-pointer">Community Conduct</span> and verified student terms.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
