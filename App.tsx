
// @ts-nocheck
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Search, Sparkles, Bell, User as UserIcon, Calendar, MapPin, CheckCircle2, Edit3, ShieldCheck, Loader2, Award, Share2, Plus, PlusCircle, ArrowUpRight, GraduationCap, Fingerprint, Clock, Activity as ActivityIcon, Shield, Heart, LogOut, Hash, Key, AlertCircle, X as CloseIcon, ChevronRight, Circle, Command, Cloud, CloudOff, History, LayoutDashboard, Trash2, BellOff, Zap, Globe, AlertTriangle, Layers, Settings, LogOut as LogoutIcon, Power, TrendingUp, Users, Map, Info, Check } from 'lucide-react';
import Layout from './components/Layout';
import ActivityCard from './components/ActivityCard';
import CreateModal from './components/CreateModal';
import EditProfileModal from './components/EditProfileModal';
import JoinModal from './components/JoinModal';
import SplashScreen from './components/SplashScreen';
import LandingPage from './LandingPage';
import { Activity, Category, MatchSuggestion, User, Participant } from './types';
import { CATEGORIES, MOCK_ACTIVITIES, MOCK_USER } from './constants';
import { getSmartMatches, getQuickGreeting, QuotaExhaustedError } from './services/geminiService';
import { supabase, isSupabaseConnected } from './lib/supabase';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

const AvatarPlaceholder: React.FC<{ size?: string; iconSize?: number; className?: string }> = ({ size = "w-48 h-48 md:w-56 md:h-56", iconSize = 64, className = "" }) => (
  <div className={`${size} rounded-[3.5rem] border-[8px] border-white dark:border-slate-800 shadow-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 dark:text-slate-500 overflow-hidden relative ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-transparent dark:from-slate-700/50 opacity-50"></div>
    <UserIcon size={iconSize} strokeWidth={1.5} className="relative z-10" />
  </div>
);

const App: React.FC = () => {
  // Persistence Helpers
  const getStoredUser = () => {
    const saved = localStorage.getItem('campus_connect_user');
    return saved ? JSON.parse(saved) : MOCK_USER;
  };

  const getStoredActivities = () => {
    const saved = localStorage.getItem('campus_connect_activities');
    return saved ? JSON.parse(saved) : MOCK_ACTIVITIES;
  };

  const getStoredNotifications = () => {
    const saved = localStorage.getItem('campus_connect_notifications');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: "Jordan Smith joined your Basketball Scrimmage", time: "2m ago", read: false, type: 'join' },
      { id: 2, text: "CS101 Final Review is starting in 30 minutes", time: "15m ago", read: false, type: 'reminder' },
      { id: 3, text: "New matching activity: 'E-Sports Valorant' fits your interests", time: "1h ago", read: true, type: 'match' },
    ];
  };

  const [activeTab, setActiveTab] = useState('home');
  const [activities, setActivities] = useState<Activity[]>(getStoredActivities);
  const [user, setUser] = useState<User>(getStoredUser);
  const [notifications, setNotifications] = useState(getStoredNotifications);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [joiningActivity, setJoiningActivity] = useState<Activity | null>(null);
  
  const [greeting, setGreeting] = useState("Exploring elite opportunities.");
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAppInitializing, setIsAppInitializing] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('campus_connect_logged_in') === 'true');
  const [hasCompletedSetup, setHasCompletedSetup] = useState(localStorage.getItem('campus_connect_setup') === 'true');
  const [hasCustomKey, setHasCustomKey] = useState(false);
  const [quotaExhausted, setQuotaExhausted] = useState(false);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [profileSubTab, setProfileSubTab] = useState<'overview' | 'engagements'>('overview');
  
  const searchRef = useRef<HTMLDivElement>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('campus_connect_user', JSON.stringify(user));
    localStorage.setItem('campus_connect_activities', JSON.stringify(activities));
    localStorage.setItem('campus_connect_notifications', JSON.stringify(notifications));
    localStorage.setItem('campus_connect_logged_in', isLoggedIn.toString());
    localStorage.setItem('campus_connect_setup', hasCompletedSetup.toString());
  }, [user, activities, notifications, isLoggedIn, hasCompletedSetup]);

  const fetchCloudData = useCallback(async () => {
    if (!isSupabaseConnected()) return;
    setIsCloudSyncing(true);
    try {
      const { data: cloudActivities, error: actError } = await supabase
        .from('activities')
        .select(`*, participants (*)`)
        .order('created_at', { ascending: false });
      if (cloudActivities && !actError) {
        setActivities(cloudActivities.map(act => ({
          ...act,
          slotsTotal: act.slots_total,
          slotsTaken: act.slots_taken,
          creatorId: act.creator_id,
          createdAt: act.created_at,
          participants: act.participants?.map(p => ({ ...p, skillLevel: p.skill_level })) || []
        })));
      }
    } catch (e) { console.error(e); } finally { setIsCloudSyncing(false); }
  }, []);

  const fetchAiData = useCallback(async () => {
    setIsAiLoading(true);
    setQuotaExhausted(false);
    try {
      const [aiGreeting, aiMatches] = await Promise.all([
        getQuickGreeting(user).catch(e => {
          if (e instanceof QuotaExhaustedError) setQuotaExhausted(true);
          return `Welcome back, ${user.name.split(' ')[0]}!`;
        }),
        getSmartMatches(user, activities).catch(e => [])
      ]);
      setGreeting(aiGreeting);
      setSuggestions(aiMatches);
    } catch (err) { console.error(err); } finally { setIsAiLoading(false); }
  }, [user, activities]);

  useEffect(() => {
    const init = async () => {
      if (window.aistudio) setHasCustomKey(await window.aistudio.hasSelectedApiKey());
      setTimeout(() => setIsAppInitializing(false), 2000);
      if (isLoggedIn) {
        await fetchCloudData();
        await fetchAiData();
      }
    };
    init();
  }, [isLoggedIn, fetchCloudData, fetchAiData]);

  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasCustomKey(true);
      if (isLoggedIn) await fetchAiData();
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('campus_connect_logged_in', 'true');
    // If first time login, trigger profile setup immediately
    if (!hasCompletedSetup) {
      setTimeout(() => setIsEditProfileOpen(true), 100);
    }
  };

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    localStorage.setItem('campus_connect_logged_in', 'false');
    setActiveTab('home');
    // Reset transient states
    setSearchQuery('');
    setSelectedCategory('All');
  }, []);

  const handleCreateActivity = (data: any) => {
    const newActivity: Activity = {
      ...data,
      id: `a${Date.now()}`,
      creatorId: user.id,
      creatorName: user.name,
      creatorAvatar: user.avatar,
      createdAt: new Date().toISOString(),
      participants: [],
      slotsTaken: 0,
      status: 'Upcoming'
    };
    setActivities(prev => [newActivity, ...prev]);
    setIsCreateOpen(false);
    setNotifications(prev => [{ id: Date.now(), text: `Pulse broadcasted: "${newActivity.title}"`, time: "Just now", read: false, type: 'broadcast' }, ...prev]);
  };

  const handleJoinConfirm = (skillLevel: string) => {
    if (!joiningActivity) return;
    setActivities(prev => prev.map(act => act.id === joiningActivity.id ? {
      ...act,
      slotsTaken: act.slotsTaken + 1,
      participants: [...act.participants, { id: user.id, name: user.name, avatar: user.avatar, skillLevel }]
    } : act));
    setJoiningActivity(null);
    setNotifications(prev => [{ id: Date.now(), text: `Authorization success: Joined "${joiningActivity.title}"`, time: "Just now", read: false, type: 'join' }, ...prev]);
  };

  const handleDeleteActivity = (id: string) => {
    if (window.confirm("Permanently terminate this pulse?")) {
      setActivities(prev => prev.filter(a => a.id !== id));
      setNotifications(prev => [{ id: Date.now(), text: "Engagement terminated successfully.", time: "Just now", read: false, type: 'system' }, ...prev]);
    }
  };

  const markNotificationRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const filteredActivities = useMemo(() => activities.filter(act => {
    const matchesSearch = act.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || act.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }), [activities, searchQuery, selectedCategory]);

  const userCreations = useMemo(() => activities.filter(act => act.creatorId === user.id), [activities, user.id]);

  if (isAppInitializing) return <SplashScreen />;
  
  if (!isLoggedIn) {
    return (
      <LandingPage 
        onLogin={handleLogin} 
        onSelectKey={handleOpenKeySelector} 
        hasCustomKey={hasCustomKey} 
      />
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onCreateClick={() => setIsCreateOpen(true)} user={user} isSyncing={isCloudSyncing} onLogout={handleLogout}>
      
      {activeTab === 'home' && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <header className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">System Live // {user.rollNumber}</p>
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white uppercase leading-[0.9]">{greeting}</h1>
          </header>

          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={20} />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search active campus pulses..." className="w-full bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[2rem] py-7 pl-16 pr-6 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-900 dark:text-white font-bold text-lg shadow-sm" />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
            <button onClick={() => setSelectedCategory('All')} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${selectedCategory === 'All' ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-2xl' : 'bg-white dark:bg-white/5 text-slate-400 border border-slate-100 dark:border-white/5'}`}>All Channels</button>
            {CATEGORIES.filter(c => !c.parent).map(cat => (
              <button key={cat.name} onClick={() => setSelectedCategory(cat.name)} className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${selectedCategory === cat.name ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-2xl' : 'bg-white dark:bg-white/5 text-slate-400 border border-slate-100 dark:border-white/5'}`}>{cat.icon}{cat.name}</button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {filteredActivities.map(act => <ActivityCard key={act.id} activity={act} onJoin={() => setJoiningActivity(act)} onUnjoin={id => setActivities(prev => prev.map(a => a.id === id ? { ...a, slotsTaken: Math.max(0, a.slotsTaken - 1), participants: a.participants.filter(p => p.id !== user.id) } : a))} onDelete={handleDeleteActivity} currentUserId={user.id} />)}
          </div>
        </div>
      )}

      {activeTab === 'explore' && (
        <div className="space-y-12 animate-in fade-in duration-700">
          <header className="space-y-2">
            <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Discover</h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Campus Trends & Peer Heatmap</p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 p-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
               <div className="relative z-10 space-y-6">
                 <div className="px-4 py-1.5 bg-white/20 rounded-full w-fit text-[10px] font-black uppercase tracking-widest backdrop-blur-md">Trending Channel</div>
                 <h3 className="text-4xl font-black uppercase tracking-tighter leading-none">The Basketball <br/> High-Frequency</h3>
                 <p className="text-indigo-100 font-semibold max-w-sm">9 active pulses detected at Main Gym Court today. Jump in before the slots fill up.</p>
                 <button onClick={() => { setSelectedCategory('Basketball'); setActiveTab('home'); }} className="px-8 py-4 bg-white text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all">View All Hoops</button>
               </div>
               <TrendingUp className="absolute right-[-20px] bottom-[-20px] w-64 h-64 text-white/10 group-hover:scale-110 transition-transform duration-1000" />
            </div>

            <div className="p-8 bg-white dark:bg-slate-900/60 rounded-[3rem] border border-slate-100 dark:border-white/5 space-y-6">
               <div className="flex items-center gap-3">
                 <Map className="text-emerald-500" size={24} />
                 <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Top Venues</span>
               </div>
               <div className="space-y-4">
                  {[
                    { name: 'Central Library', status: '8 Live', color: 'bg-emerald-500' },
                    { name: 'Main Gym Court', status: '6 Live', color: 'bg-amber-500' },
                    { name: 'Student Lounge', status: '3 Live', color: 'bg-indigo-500' }
                  ].map(v => (
                    <div key={v.name} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-black/20 rounded-2xl group cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
                       <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{v.name}</span>
                       <div className="flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${v.color} animate-pulse`}></div>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{v.status}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </section>

          <section className="space-y-8">
             <div className="flex items-center gap-3 px-2">
               <Users className="text-indigo-500" size={20} />
               <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">Elite Peer Discovery</h3>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[{ name: 'Elena Gilbert', major: 'CS', age: 20 }, { name: 'Marcus Lee', major: 'Math', age: 21 }, { name: 'Sarah Chen', major: 'Design', age: 19 }, { name: 'Jordan Smith', major: 'Sports Science', age: 22 }].map(p => (
                  <div key={p.name} className="p-6 bg-white dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-100 dark:border-white/5 text-center space-y-4 hover:shadow-xl transition-all group">
                     <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 mx-auto flex items-center justify-center text-slate-300 group-hover:scale-110 transition-transform"><UserIcon size={32}/></div>
                     <div>
                       <p className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">{p.name}</p>
                       <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{p.major} // {p.age}</p>
                     </div>
                     <button className="w-full py-2.5 bg-indigo-600/10 text-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">Connect</button>
                  </div>
                ))}
             </div>
          </section>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-top-4 duration-700">
           <header className="flex items-center justify-between">
             <div className="space-y-2">
                <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">Alerts</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Pulse Status & Interaction Log</p>
             </div>
             {notifications.length > 0 && (
               <button onClick={clearAllNotifications} className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all">Clear Pulse</button>
             )}
           </header>

           <div className="space-y-4">
              {notifications.length > 0 ? notifications.map(notif => (
                <div key={notif.id} onClick={() => markNotificationRead(notif.id)} className={`p-6 rounded-[2rem] border transition-all flex items-center gap-6 group cursor-pointer ${notif.read ? 'bg-white dark:bg-slate-900/40 border-slate-100 dark:border-white/5 opacity-60' : 'bg-white dark:bg-indigo-500/5 border-indigo-100 dark:border-indigo-500/20 shadow-lg'}`}>
                   <div className={`p-4 rounded-2xl ${notif.read ? 'bg-slate-100 dark:bg-white/5 text-slate-400' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20'}`}>
                      {notif.type === 'join' ? <Users size={20}/> : notif.type === 'reminder' ? <Clock size={20}/> : <Info size={20}/>}
                   </div>
                   <div className="flex-1 space-y-1">
                      <p className={`text-sm font-bold ${notif.read ? 'text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>{notif.text}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{notif.time}</p>
                   </div>
                   {!notif.read && <div className="w-2 h-2 rounded-full bg-indigo-600"></div>}
                </div>
              )) : (
                <div className="py-24 text-center space-y-4 bg-slate-50 dark:bg-white/5 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/10">
                   <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl mx-auto flex items-center justify-center text-slate-300 shadow-sm"><BellOff size={32}/></div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No active alerts at this frequency.</p>
                </div>
              )}
           </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="space-y-16 animate-in fade-in slide-in-from-right-8 duration-1000">
           <div className="flex flex-col lg:flex-row gap-16 items-center lg:items-start">
             <div className="relative group"><AvatarPlaceholder/><div className="absolute -bottom-4 -right-4 w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl animate-bounce"><Award size={32}/></div></div>
             <div className="flex-1 text-center lg:text-left space-y-8">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                    <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-[0.85]">{user.name}</h2>
                    <div className="px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">Verified Elite</div>
                  </div>
                  <p className="text-sm font-black uppercase tracking-[0.6em] text-indigo-600/80">{user.major} // {user.rollNumber}</p>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-semibold text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0">{user.bio || "Student identity initialized. Background sync pending."}</p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-6">
                  <button onClick={() => setIsEditProfileOpen(true)} className="w-full sm:w-auto px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-[1.25rem] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"><Edit3 size={16}/> Sync Pulse Profile</button>
                  <button onClick={handleLogout} className="w-full sm:w-auto px-10 py-5 bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[10px] font-black uppercase tracking-[0.3em] rounded-[1.25rem] transition-all hover:bg-rose-500 hover:text-white flex items-center justify-center gap-3 shadow-lg"><Power size={16}/> Exit Identity Session</button>
                </div>
             </div>
           </div>

           <div className="flex border-b border-slate-100 dark:border-white/5 pb-4 gap-12">
              <button onClick={() => setProfileSubTab('overview')} className={`flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${profileSubTab === 'overview' ? 'text-indigo-600' : 'text-slate-400'}`}><Settings size={14}/> Overview{profileSubTab === 'overview' && <div className="absolute -bottom-[17px] left-0 w-full h-1 bg-indigo-600 rounded-full"></div>}</button>
              <button onClick={() => setProfileSubTab('engagements')} className={`flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${profileSubTab === 'engagements' ? 'text-indigo-600' : 'text-slate-400'}`}><Layers size={14}/> My Engagements <span className="bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-md text-[9px]">{userCreations.length}</span>{profileSubTab === 'engagements' && <div className="absolute -bottom-[17px] left-0 w-full h-1 bg-indigo-600 rounded-full"></div>}</button>
           </div>

           {profileSubTab === 'overview' ? (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-500">
                {[{ label: 'Participation Rate', value: `${user.participationRate}%`, icon: <Zap size={20} className="text-amber-500" /> }, { label: 'Behavior Score', value: user.behaviorScore, icon: <Shield size={20} className="text-emerald-500" /> }, { label: 'Network Reach', value: 'Global', icon: <Globe size={20} className="text-indigo-500" /> }].map((stat, i) => (
                  <div key={i} className="p-8 bg-white dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm space-y-4">
                    <div className="flex items-center gap-4"><div className="p-3 bg-slate-50 dark:bg-white/5 rounded-2xl">{stat.icon}</div><p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p></div>
                    <p className="text-4xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                  </div>
                ))}
             </div>
           ) : (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in duration-500">
               {userCreations.length > 0 ? userCreations.map(act => <ActivityCard key={act.id} activity={act} onJoin={() => setJoiningActivity(act)} onUnjoin={id => {}} onDelete={handleDeleteActivity} currentUserId={user.id} />) : <div className="col-span-2 py-20 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-white/5 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/5">No pulses broadcasted by your identity yet.</div>}
             </div>
           )}
        </div>
      )}

      <CreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSubmit={handleCreateActivity} />
      <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} user={user} onSave={u => { setUser(u); setIsEditProfileOpen(false); setHasCompletedSetup(true); }} isInitialSetup={!hasCompletedSetup} />
      {joiningActivity && <JoinModal isOpen={!!joiningActivity} onClose={() => setJoiningActivity(null)} activity={joiningActivity} onConfirm={handleJoinConfirm} />}
    </Layout>
  );
};

export default App;
