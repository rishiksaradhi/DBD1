
import React, { useState, useEffect } from 'react';
import { Home, Compass, PlusSquare, Bell, User as UserIcon, LogOut, Sun, Moon, ShieldCheck, Palette, Check, Sparkles, Cloud, CloudOff } from 'lucide-react';
import { User } from '../types';
import { isSupabaseConnected } from '../lib/supabase';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onCreateClick: () => void;
  user: User;
  isSyncing?: boolean;
  onLogout?: () => void;
}

const ACCENT_COLORS = [
  { id: 'blue', name: 'Sovereign Blue', hex: '#1e40af', class: 'bg-blue-800', glow: 'rgba(30, 64, 175, 0.1)' },
  { id: 'gold', name: 'Imperial Gold', hex: '#b45309', class: 'bg-amber-700', glow: 'rgba(180, 83, 9, 0.1)' },
  { id: 'ruby', name: 'Midnight Ruby', hex: '#9f1239', class: 'bg-rose-900', glow: 'rgba(159, 18, 57, 0.1)' },
  { id: 'onyx', name: 'Forest Onyx', hex: '#064e3b', class: 'bg-emerald-950', glow: 'rgba(6, 78, 59, 0.1)' },
];

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onCreateClick, user, isSyncing, onLogout }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [accent, setAccent] = useState(ACCENT_COLORS[0]);
  const connected = isSupabaseConnected();

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', accent.hex);
    document.documentElement.style.setProperty('--primary-glow', accent.glow);
  }, [accent]);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  };

  const navItems = [
    { id: 'home', icon: <Home />, label: 'Pulse Feed' },
    { id: 'explore', icon: <Compass />, label: 'Discover' },
    { id: 'plus', icon: <PlusSquare />, label: 'Post Activity', action: onCreateClick },
    { id: 'notifications', icon: <Bell />, label: 'Alerts' },
    { id: 'profile', icon: <UserIcon />, label: 'My Profile' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-light bg-white dark:bg-slate-950 transition-colors duration-500">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 h-screen sticky top-0 p-8 z-40 border-r border-slate-100 dark:border-white/5 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl">
        <div className="flex items-center gap-4 mb-14 px-2">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-2xl transition-all duration-700 transform hover:rotate-6`} style={{ backgroundColor: accent.hex }}>
            <ShieldCheck size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white leading-none uppercase">Campus</h1>
            <span className="text-[9px] font-black tracking-[0.4em] uppercase opacity-80" style={{ color: accent.hex }}>Connect Elite</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => item.action ? item.action() : setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                  isActive 
                    ? 'text-white shadow-lg' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
                style={isActive ? { backgroundColor: accent.hex } : {}}
              >
                <div className={`transition-colors duration-300 relative z-10 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-opacity-100'}`} style={!isActive ? { color: 'inherit' } : {}}>
                  {React.cloneElement(item.icon as React.ReactElement<any>, { size: 18, strokeWidth: isActive ? 2.5 : 2 })}
                </div>
                <span className={`text-sm tracking-tight relative z-10 ${isActive ? 'font-bold' : 'font-semibold'}`}>{item.label}</span>
                {isActive && (
                   <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto space-y-6">
          {/* Appearance Config */}
          <div className="p-6 bg-slate-100/50 dark:bg-black/40 rounded-3xl border border-slate-200 dark:border-white/5 space-y-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                <Palette size={12} />
                Appearance
              </div>
              <button 
                onClick={toggleDarkMode}
                className="p-2 bg-white dark:bg-slate-800 hover:scale-110 rounded-xl shadow-sm transition-all border border-slate-200 dark:border-slate-700"
              >
                {darkMode ? <Sun size={14} className="text-amber-500" /> : <Moon size={14} style={{ color: accent.hex }} />}
              </button>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              {ACCENT_COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setAccent(c)}
                  className={`aspect-square rounded-xl flex items-center justify-center transition-all ${c.class} ${accent.id === c.id ? 'ring-2 ring-offset-2 ring-slate-300 dark:ring-offset-slate-900 scale-110 shadow-lg' : 'opacity-40 hover:opacity-100 hover:scale-105'}`}
                >
                  {accent.id === c.id && <Check size={12} className="text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* User Profile Footer */}
          <div className="space-y-2">
            <div 
              className={`p-4 bg-white dark:bg-slate-900/60 rounded-2xl flex items-center gap-4 border transition-all shadow-sm group ${activeTab === 'profile' ? 'border-[var(--primary)] bg-slate-50 dark:bg-slate-800' : 'border-slate-200 dark:border-white/5 hover:border-slate-300'}`}
            >
              <div className="relative shrink-0 cursor-pointer" onClick={() => setActiveTab('profile')}>
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 dark:border-slate-800" />
                ) : (
                  <div className="w-10 h-10 rounded-full border-2 border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    <UserIcon size={16} />
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-white dark:border-slate-900 rounded-full" style={{ backgroundColor: accent.hex }}></div>
              </div>
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setActiveTab('profile')}>
                <p className="text-xs font-black truncate text-slate-900 dark:text-white uppercase tracking-wider">
                  {user.name || 'Anonymous'}
                </p>
                <div className="flex items-center gap-2">
                   <p className="text-[9px] text-slate-500 dark:text-slate-400 truncate font-black tracking-widest uppercase opacity-60">Elite Verified</p>
                </div>
              </div>
              {onLogout && (
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onLogout();
                  }}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                  title="Secure Logout"
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>
            
            {/* Supabase Connectivity Indicator */}
            <div className="px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {connected ? (
                  <Cloud size={10} className={isSyncing ? "text-indigo-400 animate-pulse" : "text-emerald-500"} />
                ) : (
                  <CloudOff size={10} className="text-slate-400" />
                )}
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {connected ? (isSyncing ? 'Syncing...' : 'Cloud Active') : 'Local Mode'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 md:px-12 py-8 md:py-14 relative z-10 pb-32 md:pb-14">
        {children}
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-slate-200 dark:border-white/10 z-50 transition-all duration-300 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around items-center h-16 px-4">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => item.action ? item.action() : setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-300 relative ${isActive ? 'scale-110' : 'text-slate-400'}`}
              >
                <div className={`transition-all duration-300 ${isActive ? 'text-white p-2 rounded-lg shadow-lg' : 'p-2'}`} style={isActive ? { backgroundColor: accent.hex } : {}}>
                  {React.cloneElement(item.icon as React.ReactElement<any>, { size: 20, strokeWidth: isActive ? 2.5 : 2 })}
                </div>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
