
import React from 'react';
import { Trophy, BookOpen, Users, Sparkles, ArrowRight, ShieldCheck, Zap, Globe, Heart, CheckCircle2, GraduationCap } from 'lucide-react';

interface PublicPageProps {
  onLogin: () => void;
  onSelectKey: () => void;
  hasCustomKey: boolean;
}

const LandingPage: React.FC<PublicPageProps> = ({ onLogin, onSelectKey, hasCustomKey }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 flex justify-between items-center glass border-b border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
            <ShieldCheck size={24} />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">Campus <span className="text-indigo-600">Connect</span></span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onLogin}
            className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl"
          >
            Authenticate
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-6xl mx-auto text-center space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-full border border-indigo-100 dark:border-indigo-500/20 animate-in fade-in slide-in-from-top-4 duration-700">
            <Sparkles size={14} className="text-indigo-600" />
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">The Elite Student Network</span>
          </div>
          
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Don't Just <span className="text-indigo-600">Attend.</span> <br /> 
            Actually <span className="italic">Connect.</span>
          </h1>
          
          <p className="max-w-xl mx-auto text-slate-500 dark:text-slate-400 font-semibold text-lg leading-relaxed animate-in fade-in duration-1000 delay-300">
            Instantly find sports teammates, study partners, and project collaborators within your verified campus community.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            <button 
              onClick={onLogin}
              className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-2xl shadow-indigo-500/40 uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95"
            >
              Get Started <ArrowRight size={18} />
            </button>
            <button 
              onClick={onSelectKey}
              className="w-full sm:w-auto px-10 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 font-black rounded-2xl uppercase text-xs tracking-[0.2em] transition-all hover:bg-slate-50 dark:hover:bg-white/10"
            >
              {hasCustomKey ? 'Access Optimized' : 'Optimize Performance'}
            </button>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 px-6 bg-slate-50 dark:bg-black/20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: <Trophy size={32} />, 
              title: "Instant Sports", 
              desc: "Need a sub for basketball or a gym partner? Find teammates in seconds, not hours." 
            },
            { 
              icon: <BookOpen size={32} />, 
              title: "Smart Study", 
              desc: "Connect with students in your major for finals prep or project collaboration." 
            },
            { 
              icon: <Users size={32} />, 
              title: "Social Pulse", 
              desc: "From casual hangouts to club meetups, stay in the loop with what's happening live." 
            }
          ].map((feature, i) => (
            <div key={i} className="group p-10 bg-white dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-200 dark:border-white/5 transition-all hover:shadow-2xl hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-4">{feature.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-black uppercase tracking-tighter">Verified & Secure</h2>
            <p className="text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-[0.4em]">Institutional Integrity Only</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-6 p-6 bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-white/5 text-left">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="font-black text-xs uppercase tracking-widest mb-1">Email Verification</p>
                <p className="text-[10px] font-bold text-slate-400 leading-relaxed">Only students with a valid university email can access the pulse.</p>
              </div>
            </div>
            <div className="flex items-center gap-6 p-6 bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-white/5 text-left">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                <GraduationCap size={24} />
              </div>
              <div>
                <p className="font-black text-xs uppercase tracking-widest mb-1">Peer Reputation</p>
                <p className="text-[10px] font-bold text-slate-400 leading-relaxed">System-wide participation scores ensure a high-quality community.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-100 dark:border-white/5 text-center space-y-8">
        <div className="flex flex-col items-center gap-4">
           <div className="flex items-center gap-3 grayscale opacity-50">
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-black">
              <ShieldCheck size={18} />
            </div>
            <span className="text-sm font-black tracking-tighter uppercase">Campus Connect</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">&copy; 2025 Institutional Intelligence Platform</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
