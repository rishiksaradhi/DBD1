
import React, { useState, useEffect } from 'react';
import { Trophy, Sparkles, ArrowRight, ShieldCheck, Zap, CheckCircle2, GraduationCap, Fingerprint, Lock, Mail, Users, Star, Globe } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onSelectKey: () => void;
  hasCustomKey: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onSelectKey, hasCustomKey }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showLoginOverlay, setShowLoginOverlay] = useState(false);
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    // Simulate high-security identity verification
    setTimeout(() => {
      onLogin();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-indigo-500/30 overflow-x-hidden relative font-sans">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] dark:opacity-20 opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[120px] dark:opacity-10 opacity-30"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 md:px-12 flex justify-between items-center glass border-b border-slate-100 dark:border-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20 group-hover:rotate-12 transition-transform duration-500">
            <ShieldCheck size={26} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter uppercase leading-none">Campus <span className="text-indigo-600">Connect</span></span>
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400">Elite Platform</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <a href="#" className="hover:text-indigo-600 transition-colors">Network</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Security</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
          </div>
          <button 
            onClick={() => setShowLoginOverlay(true)}
            className="px-7 py-3 bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-2xl hover:shadow-indigo-500/20"
          >
            Authenticate
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 pt-44 pb-32 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
        <div className="flex-1 space-y-12 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-full border border-indigo-100 dark:border-indigo-500/20 animate-in fade-in slide-in-from-top-4 duration-1000">
            <Sparkles size={16} className="text-indigo-600 animate-pulse" />
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Institutional Intelligence Active</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl xl:text-9xl font-black tracking-tighter leading-[0.8] uppercase animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Elevate Your <br />
            Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Pulse.</span>
          </h1>
          
          <p className="max-w-xl mx-auto lg:mx-0 text-slate-500 dark:text-slate-400 font-semibold text-xl leading-relaxed animate-in fade-in duration-1000 delay-300">
            The exclusive student interaction platform for high-frequency activity pairing, study syndicates, and elite networking.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            <button 
              onClick={() => setShowLoginOverlay(true)}
              className="w-full sm:w-auto px-12 py-6 bg-indigo-600 text-white font-black rounded-3xl shadow-[0_20px_40px_rgba(79,70,229,0.3)] uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-4 transition-all hover:scale-105 active:scale-95 hover:bg-indigo-700"
            >
              Get Access Now <ArrowRight size={20} />
            </button>
            <button 
              onClick={onSelectKey}
              className="w-full sm:w-auto px-12 py-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 font-black rounded-3xl uppercase text-xs tracking-[0.2em] transition-all hover:bg-slate-50 dark:hover:bg-white/10 flex items-center justify-center gap-3"
            >
              <Zap size={18} className={hasCustomKey ? "text-amber-500" : ""} />
              {hasCustomKey ? 'Capacity Optimized' : 'Quota Optimizer'}
            </button>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-8 pt-10 border-t border-slate-100 dark:border-white/5 animate-in fade-in duration-1000 delay-700">
             <div className="flex -space-x-3">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-950 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                   <Users size={14} className="text-slate-400" />
                 </div>
               ))}
               <div className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-950 bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">
                 +2k
               </div>
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Join 2,000+ Verified Students</p>
          </div>
        </div>

        {/* Hero Illustration / Visual */}
        <div className="flex-1 relative hidden lg:block animate-in fade-in zoom-in duration-1000 delay-500">
           <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-indigo-600/5 rounded-[4rem] rotate-6 scale-105 blur-2xl"></div>
              <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-[4rem] border border-slate-100 dark:border-white/10 shadow-2xl p-10 flex flex-col justify-between">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500"><Zap size={28}/></div>
                       <div>
                          <p className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Active Pulse</p>
                          <p className="text-[10px] font-bold text-slate-400">Library Floor 3 // 8 Live</p>
                       </div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-slate-100 dark:border-white/5 flex items-center justify-center text-indigo-600"><Star size={20} fill="currentColor"/></div>
                 </div>

                 <div className="space-y-6">
                    <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl space-y-4">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">Upcoming Synergy</span>
                          <span className="text-[9px] font-bold text-slate-400">14:00 PM</span>
                       </div>
                       <h4 className="text-2xl font-black uppercase tracking-tight">CS101 Final Review</h4>
                       <div className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-500" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3/5 Slots Occupied</span>
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10"></div>
                       <p className="text-[10px] font-black uppercase tracking-widest">Sarah Chen // Host</p>
                    </div>
                    <div className="px-4 py-2 bg-indigo-600 text-white text-[9px] font-black rounded-xl uppercase tracking-widest">Join Synergy</div>
                 </div>
              </div>
           </div>
        </div>
      </main>

      {/* Login Overlay Modal */}
      {showLoginOverlay && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-500">
          <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xl" onClick={() => !isAuthenticating && setShowLoginOverlay(false)}></div>
          
          <div className="relative w-full max-w-xl bg-white dark:bg-[#0b0f1a] rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-200 dark:border-white/10 animate-in zoom-in slide-in-from-bottom-10 duration-500">
            {isAuthenticating ? (
              <div className="p-16 text-center space-y-10 animate-in fade-in duration-700">
                <div className="relative w-32 h-32 mx-auto">
                   <div className="absolute inset-0 rounded-full border-4 border-indigo-600/20"></div>
                   <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                      <ShieldCheck size={48} className="animate-pulse" />
                   </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Synchronizing Identity</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] max-w-xs mx-auto leading-relaxed">Verifying credentials against institutional peer-to-peer directory...</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row h-full">
                {/* Left Branding Panel */}
                <div className="hidden md:flex w-48 bg-slate-900 dark:bg-indigo-950 p-10 flex-col justify-between text-white border-r border-white/5">
                   <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center"><Fingerprint size={28}/></div>
                   <div className="space-y-4">
                      <div className="w-2 h-10 bg-indigo-500 rounded-full"></div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed opacity-60">Verified Institutional Access Only</p>
                   </div>
                </div>

                <div className="flex-1 p-10 md:p-14 space-y-10">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                       <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Identity <br/> <span className="text-indigo-600">Verification</span></h2>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connect with your student ID</p>
                    </div>
                    <button onClick={() => setShowLoginOverlay(false)} className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl transition-all text-slate-400">
                       <Mail size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-1">Institutional Roll Number</label>
                       <div className="relative group">
                          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"><GraduationCap size={18}/></div>
                          <input 
                            required
                            value={rollNumber}
                            onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                            placeholder="e.g. AP21-CS-105"
                            className="w-full py-5 pl-14 pr-6 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm font-bold uppercase tracking-widest placeholder:normal-case placeholder:tracking-tight"
                          />
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-1">Access Token (Password)</label>
                       <div className="relative group">
                          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"><Lock size={18}/></div>
                          <input 
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter security password"
                            className="w-full py-5 pl-14 pr-6 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all text-sm font-bold"
                          />
                       </div>
                    </div>

                    <button 
                      type="submit"
                      className="w-full py-6 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
                    >
                      Initialize Session <ArrowRight size={18} />
                    </button>
                  </form>

                  <div className="flex items-center justify-between pt-4">
                     <div className="flex items-center gap-2 cursor-pointer group">
                        <div className="w-4 h-4 rounded border border-slate-200 dark:border-white/10 group-hover:border-indigo-500 transition-colors"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-600 transition-colors">Stay Synchronized</span>
                     </div>
                     <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest cursor-pointer hover:underline">Lost Access?</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Features Showcase */}
      <section className="py-32 px-6 bg-slate-50 dark:bg-white/[0.02] border-y border-slate-100 dark:border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { 
              icon: <Zap size={32} />, 
              title: "Pulse Feed", 
              desc: "Real-time stream of every activity happening on campus. Join, host, or broadcast in seconds." 
            },
            { 
              icon: <Globe size={32} />, 
              title: "Global Major Matching", 
              desc: "Our AI aligns your major and interests with elite peers for optimized collaboration." 
            },
            { 
              icon: <ShieldCheck size={32} />, 
              title: "Behavior Scoring", 
              desc: "Maintain an elite reputation through high participation and positive community conduct." 
            }
          ].map((feature, i) => (
            <div key={i} className="group p-12 bg-white dark:bg-slate-900/40 rounded-[3rem] border border-slate-200 dark:border-white/5 transition-all hover:shadow-2xl hover:-translate-y-3">
              <div className="w-20 h-20 rounded-[2rem] bg-indigo-50 dark:bg-indigo-600/10 text-indigo-600 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-5">{feature.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust & Verification */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-5xl font-black uppercase tracking-tighter">Verified Integrity</h2>
            <div className="flex items-center justify-center gap-4">
               <div className="h-px w-10 bg-indigo-600"></div>
               <p className="text-indigo-600 font-black uppercase text-[10px] tracking-[0.5em]">Exclusive Security Layers</p>
               <div className="h-px w-10 bg-indigo-600"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex items-start gap-8 p-10 bg-white dark:bg-slate-900/40 rounded-[3rem] border border-slate-200 dark:border-white/5 text-left group hover:bg-indigo-600 transition-all duration-700">
              <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 group-hover:bg-white group-hover:text-indigo-600 flex items-center justify-center shrink-0 transition-all">
                <CheckCircle2 size={32} />
              </div>
              <div className="space-y-3">
                <p className="font-black text-sm uppercase tracking-widest text-slate-900 dark:text-white group-hover:text-white transition-colors">Credential Lockdown</p>
                <p className="text-xs font-bold text-slate-400 leading-relaxed group-hover:text-indigo-100 transition-colors">Every student undergoes multi-factor institutional verification before gaining access to the campus pulse.</p>
              </div>
            </div>
            <div className="flex items-start gap-8 p-10 bg-white dark:bg-slate-900/40 rounded-[3rem] border border-slate-200 dark:border-white/5 text-left group hover:bg-indigo-600 transition-all duration-700">
              <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 group-hover:bg-white flex items-center justify-center shrink-0 transition-all">
                <GraduationCap size={32} />
              </div>
              <div className="space-y-3">
                <p className="font-black text-sm uppercase tracking-widest text-slate-900 dark:text-white group-hover:text-white transition-colors">Identity Provenance</p>
                <p className="text-xs font-bold text-slate-400 leading-relaxed group-hover:text-indigo-100 transition-colors">Cross-campus reputation scores ensure interaction quality remains elite across sports, study, and social domains.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 border-t border-slate-100 dark:border-white/5 text-center space-y-12">
        <div className="flex flex-col items-center gap-6">
           <div className="flex items-center gap-4 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-black shadow-lg">
              <ShieldCheck size={24} />
            </div>
            <span className="text-lg font-black tracking-tighter uppercase">Campus Connect</span>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
             <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Infrastructure</a>
             <a href="#" className="hover:text-indigo-600 transition-colors">Conduct Protocol</a>
             <a href="#" className="hover:text-indigo-600 transition-colors">System Status</a>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em] pt-4">&copy; 2025 Institutional Intelligence // SR-09X-B</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
