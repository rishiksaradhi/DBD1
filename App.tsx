
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Sparkles, Bell, User as UserIcon, Calendar, MapPin, CheckCircle2, Edit3, ShieldCheck, Loader2, Award, Share2, Plus, PlusCircle, ArrowUpRight, GraduationCap, Fingerprint, Clock, Activity as ActivityIcon, Shield, Heart, LogOut, Hash, Key, AlertCircle, X as CloseIcon } from 'lucide-react';
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

  const [activeTab, setActiveTab] = useState('home');
  const [activities, setActivities] = useState<Activity[]>(getStoredActivities);
  const [user, setUser] = useState<User>(getStoredUser);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [joiningActivity, setJoiningActivity] = useState<Activity | null>(null);
  const [prefilledLocation, setPrefilledLocation] = useState('');
  
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
  
  const [notifications] = useState([
    { id: 1, text: "Jordan Smith joined your Basketball Scrimmage", time: "2m ago", read: false },
    { id: 2, text: "CS101 Final Review is starting in 30 minutes", time: "15m ago", read: false },
    { id: 3, text: "New matching activity: 'E-Sports Valorant' fits your interests", time: "1h ago", read: true },
  ]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('campus_connect_user', JSON.stringify(user));
    localStorage.setItem('campus_connect_activities', JSON.stringify(activities));
    localStorage.setItem('campus_connect_logged_in', isLoggedIn.toString());
    localStorage.setItem('campus_connect_setup', hasCompletedSetup.toString());
  }, [user, activities, isLoggedIn, hasCompletedSetup]);

  const fetchAiData = async () => {
    setIsAiLoading(true);
    setQuotaExhausted(false);
    try {
      const [aiGreeting, aiMatches] = await Promise.all([
        getQuickGreeting(user).catch(e => {
          if (e instanceof QuotaExhaustedError) {
            setQuotaExhausted(true);
            return `Welcome back, ${user.name.split(' ')[0]}!`;
          }
          return `Welcome, ${user.name.split(' ')[0]}`;
        }),
        getSmartMatches(user, activities).catch(e => {
          if (e instanceof QuotaExhaustedError) {
            setQuotaExhausted(true);
            return [];
          }
          return [];
        })
      ]);
      setGreeting(aiGreeting);
      setSuggestions(aiMatches);
    } catch (err) {
      console.error("AI Data fetch failed:", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      // Check for custom key
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setHasCustomKey(hasKey);
      }

      const timer = setTimeout(() => {
        setIsAppInitializing(false);
      }, 2500);

      if (isLoggedIn) {
        await fetchAiData();
      }
      
      return () => clearTimeout(timer);
    };
    init();
  }, [user, isLoggedIn]);

  const handleOpenKeySelector = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setHasCustomKey(true);
      setQuotaExhausted(false);
      if (isLoggedIn) await fetchAiData();
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    if (!hasCompletedSetup) {
      setIsEditProfileOpen(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('campus_connect_logged_in', 'false');
    setActiveTab('home');
  };

  const handlePostActivity = (data: Partial<Activity>) => {
    const newActivity: Activity = {
      id: `a${Date.now()}`,
      title: data.title || 'Untitled Engagement',
      category: data.category || 'Social',
      location: data.location || 'Campus Center',
      time: data.time || 'TBD',
      slotsTotal: data.slotsTotal || 2,
      slotsTaken: 1,
      creatorId: user.id,
      creatorName: user.name,
      creatorAvatar: user.avatar,
      description: data.description || '',
      createdAt: new Date().toISOString(),
      participants: [{ id: user.id, name: user.name, avatar: user.avatar }]
    };
    setActivities([newActivity, ...activities]);
    setIsCreateOpen(false);
    setPrefilledLocation('');
    setActiveTab('home'); 
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setUser(updatedUser);
    setIsEditProfileOpen(false);
    setHasCompletedSetup(true);
  };

  const handleStartJoin = (id: string) => {
    const act = activities.find(a => a.id === id);
    if (act) setJoiningActivity(act);
  };

  const handleUnjoin = (id: string) => {
    setActivities(prev => prev.map(act => {
      if (act.id === id) {
        const isParticipant = act.participants.some(p => p.id === user.id);
        if (isParticipant) {
          return {
            ...act,
            slotsTaken: Math.max(0, act.slotsTaken - 1),
            participants: act.participants.filter(p => p.id !== user.id)
          };
        }
      }
      return act;
    }));
  };

  const handleConfirmJoin = (skillLevel: string) => {
    if (!joiningActivity) return;
    
    setActivities(prev => prev.map(act => {
      if (act.id === joiningActivity.id && act.slotsTaken < act.slotsTotal) {
        const participant: Participant = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          skillLevel: skillLevel !== 'Any' ? skillLevel : undefined
        };
        return { 
          ...act, 
          slotsTaken: act.slotsTaken + 1,
          participants: [...act.participants, participant]
        };
      }
      return act;
    }));
    setJoiningActivity(null);
  };

  const filteredActivities = useMemo(() => {
    return activities.filter(act => {
      const matchesSearch = act.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           act.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || act.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [activities, searchQuery, selectedCategory]);

  const recommendedActivities = useMemo(() => {
    return suggestions.map(s => {
      const activity = activities.find(a => a.id === s.activityId);
      if (activity) return { ...activity, suggestion: s };
      return null;
    }).filter(Boolean);
  }, [suggestions, activities]);

  if (isAppInitializing) return <SplashScreen />;
  if (!isLoggedIn) return <LandingPage onLogin={handleLogin} onSelectKey={handleOpenKeySelector} hasCustomKey={hasCustomKey} />;

  const PulseFeed = () => (
    <>
      <header className="mb-16 space-y-12">
        {quotaExhausted && (
          <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-500/30 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400">
                <AlertCircle size={20} />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-black uppercase tracking-widest text-amber-900 dark:text-amber-200">Campus Quota Alert</p>
                <p className="text-[10px] font-bold text-amber-700/80 dark:text-amber-400/60 uppercase tracking-widest leading-relaxed">Intelligence access is throttled. Use a personal key to restore speeds.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleOpenKeySelector}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-[9px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95"
              >
                Restore Full Pulse
              </button>
              <button 
                onClick={() => setQuotaExhausted(false)}
                className="p-2 text-amber-400 hover:text-amber-600 transition-colors"
              >
                <CloseIcon size={16} />
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: 'var(--primary)' }}>Campus Pulse: Live</span>
              <div className="h-px w-12 bg-slate-200 dark:bg-white/10"></div>
              {isAiLoading && <Loader2 className="w-3 h-3 animate-spin text-slate-400" />}
            </div>
            <h1 className="text-4xl md:text-7xl font-extrabold tracking-tighter text-slate-900 dark:text-white leading-[0.9] min-h-[1.1em]">
              {greeting}
            </h1>
            <p className="text-slate-400 dark:text-slate-500 text-sm font-semibold tracking-wide max-w-sm">
              Discover verified campus opportunities curated for your success.
            </p>
          </div>
          <div className="flex items-center gap-8 bg-slate-50 dark:bg-black/20 p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm">
            <div className="text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Engagements</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{activities.filter(a => a.creatorId === user.id).length + 4}</p>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-white/10"></div>
            <div className="text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Participation</p>
              <p className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-blue-400 bg-clip-text text-transparent">{user.participationRate}%</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 transition-colors group-focus-within:text-[var(--primary)]" />
            <input 
              type="text" 
              placeholder="Filter by keyword or venue..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 hover:border-slate-300 focus:border-[var(--primary)] focus:border-opacity-30 rounded-2xl py-5 pl-16 pr-8 transition-all outline-none text-slate-900 dark:text-white font-semibold placeholder:text-slate-400 shadow-sm"
            />
          </div>
          <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 no-scrollbar px-1">
            <button 
              onClick={() => setSelectedCategory('All')}
              className={`px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border ${
                selectedCategory === 'All' 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl dark:bg-white dark:text-black dark:border-white' 
                  : 'bg-white dark:bg-white/5 text-slate-400 border-slate-200 dark:border-white/5 hover:border-slate-300'
              }`}
            >
              All
            </button>
            {CATEGORIES.map(cat => (
              <button 
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border flex items-center gap-2 whitespace-nowrap ${
                  selectedCategory === cat.name 
                    ? `text-white border-opacity-10 shadow-xl` 
                    : 'bg-white dark:bg-white/5 text-slate-400 border-slate-200 dark:border-white/5 hover:border-slate-300'
                }`}
                style={selectedCategory === cat.name ? { backgroundColor: 'var(--primary)', borderColor: 'var(--primary)' } : {}}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {recommendedActivities.length > 0 && selectedCategory === 'All' && !searchQuery && (
        <section className="mb-20">
          <div className="flex items-center justify-between mb-10 px-2">
            <h2 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-4 uppercase tracking-[0.3em]">
              <Sparkles size={16} style={{ color: 'var(--primary)' }} />
              AI Intelligence
            </h2>
            <div className="h-px flex-1 mx-8 bg-slate-100 dark:bg-white/5 hidden md:block"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {recommendedActivities.map((act: any) => (
              <ActivityCard 
                key={`rec-${act.id}`} 
                activity={act} 
                onJoin={handleStartJoin} 
                onUnjoin={handleUnjoin}
                isSuggested={true} 
                matchReason={act.suggestion?.reason} 
                currentUserId={user.id}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-10 px-2">
          <h2 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.3em]">
            Live Engagements
          </h2>
          <div className="text-[9px] font-black text-slate-400 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200 dark:bg-black/20 dark:border-white/5 uppercase tracking-widest">
            {filteredActivities.length} Active
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Constant "Create" Card at the start of the list */}
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="group relative bg-slate-50 dark:bg-black/20 rounded-[1.5rem] p-6 border border-dashed border-slate-300 dark:border-white/10 flex flex-col items-center justify-center gap-4 transition-all hover:bg-white dark:hover:bg-slate-900/40 hover:border-solid hover:border-[var(--primary)] hover:shadow-xl hover:-translate-y-1 min-h-[300px]"
          >
            <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-[var(--primary)] shadow-sm transition-all group-hover:scale-110">
              <PlusCircle size={32} strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-1">
                Initiate Engagement
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {selectedCategory === 'All' ? 'Host a new activity' : `Start a ${selectedCategory} pulse`}
              </p>
            </div>
            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="bg-[var(--primary)] text-white p-2 rounded-lg shadow-lg">
                  <ArrowUpRight size={16} />
               </div>
            </div>
          </button>

          {filteredActivities.map(act => (
            <ActivityCard key={act.id} activity={act} onJoin={handleStartJoin} onUnjoin={handleUnjoin} currentUserId={user.id} />
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="mt-10 bg-slate-50/50 dark:bg-black/20 rounded-[3rem] p-24 text-center border border-dashed border-slate-200 dark:border-white/5">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-widest">No Active Pulses</h3>
            <p className="text-slate-400 max-w-sm mx-auto font-semibold text-sm leading-relaxed mb-10">
              Be the first to create an engagement for {selectedCategory === 'All' ? 'this criteria' : selectedCategory}.
            </p>
          </div>
        )}
      </section>
    </>
  );

  const DiscoverView = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <h2 className="text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Campus Map</h2>
        <p className="text-slate-400 font-semibold uppercase text-[10px] tracking-widest">Active hotspots for student collaboration</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {['Main Library', 'Student Union', 'Athletics Wing', 'Common Greens'].map(loc => (
          <div key={loc} className="group p-8 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[2rem] hover:shadow-2xl transition-all">
            <div className="flex justify-between items-start mb-10">
              <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-black/20 flex items-center justify-center text-slate-400 group-hover:text-[var(--primary)] transition-colors">
                <MapPin size={24} />
              </div>
              <button 
                onClick={() => {
                  setPrefilledLocation(loc);
                  setIsCreateOpen(true);
                }}
                className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-100 uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
              >
                Host Here
              </button>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{loc}</h3>
            <div className="flex items-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
              <span>{activities.filter(a => a.location.includes(loc)).length} Engagements</span>
              <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
              <span>Active Spot</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const NotificationsView = () => (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Alerts</h2>
        <button className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--primary)' }}>Clear All</button>
      </div>
      <div className="space-y-4">
        {notifications.map(n => (
          <div key={n.id} className={`p-6 rounded-[1.5rem] border transition-all flex items-start gap-6 ${n.read ? 'bg-white dark:bg-slate-900/20 border-slate-100 dark:border-white/5 opacity-60' : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-white/10 shadow-sm'}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${n.read ? 'bg-slate-50 text-slate-300' : 'bg-indigo-50 text-indigo-500'}`} style={!n.read ? { backgroundColor: 'var(--primary-glow)', color: 'var(--primary)' } : {}}>
              <Bell size={20} />
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white leading-snug">{n.text}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{n.time}</p>
            </div>
            {!n.read && <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--primary)' }}></div>}
          </div>
        ))}
      </div>
    </div>
  );

  const ProfileView = () => {
    const joinedActivities = activities.filter(a => a.participants.some(p => p.id === user.id));
    const hostedActivities = activities.filter(a => a.creatorId === user.id);
    
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
        {/* Superior Hero Profile Card - Compact & Clean */}
        <div className="relative group overflow-hidden bg-white dark:bg-slate-900/60 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl transition-all duration-700">
          <div className="absolute top-0 left-0 w-full h-full bg-[var(--primary)] opacity-[0.03]"></div>
          
          <div className="p-8 md:p-12 relative z-10">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
              {/* Avatar Column */}
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)] to-amber-500 rounded-[2.5rem] blur-2xl opacity-10 scale-125"></div>
                <div className="relative">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="Profile" 
                      className="relative w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] border-[6px] border-white dark:border-slate-800 shadow-2xl object-cover transition-all duration-500 group-hover:scale-105" 
                    />
                  ) : (
                    <AvatarPlaceholder size="w-32 h-32 md:w-40 md:h-40" iconSize={32} className="transition-all duration-500 group-hover:scale-105" />
                  )}
                  <div className="absolute -top-2 -left-2 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-xl border border-slate-100 dark:border-white/5 text-amber-500">
                    <Shield size={16} fill="currentColor" />
                  </div>
                </div>

                <div 
                  className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl flex items-center justify-center text-white border-[4px] border-white dark:border-slate-800 shadow-xl" 
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  <Fingerprint size={20} />
                </div>
              </div>
              
              {/* Identity Details Column */}
              <div className="flex-1 text-center lg:text-left space-y-2">
                <div className="space-y-3">
                  <div className="flex flex-col md:flex-row items-center lg:items-start md:gap-4">
                    <div className="flex flex-col items-center lg:items-start">
                      <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.9] mb-1">
                        {user.name.split(' ')[0]} <span style={{ color: 'var(--primary)' }}>{user.name.split(' ')[1] || ''}</span>
                      </h2>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">
                         ID: {user.rollNumber}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 self-center md:self-start mt-2 md:mt-0">
                       <button 
                        onClick={() => setIsEditProfileOpen(true)}
                        className="bg-slate-900 dark:bg-white text-white dark:text-black p-3 rounded-xl shadow-lg transition-all hover:scale-105"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 p-3 rounded-xl text-slate-400 hover:bg-slate-50">
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {user.bio && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed max-w-lg mb-4">
                    {user.bio}
                  </p>
                )}

                {/* Structured Identity Tags - Small fonts */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-100 dark:border-white/5">
                    <GraduationCap size={14} className="text-slate-400" />
                    <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{user.major}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-100 dark:border-white/5">
                    <Calendar size={14} className="text-slate-400" />
                    <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{user.age} Years</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Verified Student</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Core Performance Metrics (Width: 4) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Behavior & Participation Dashboard - Minimalist small font focus */}
            <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 space-y-10 shadow-sm">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.4em]">Pulse Health</h3>
                <ActivityIcon size={16} className="text-slate-300" />
              </div>
              
              <div className="space-y-10">
                {/* Participation Percentage */}
                <div className="space-y-3 group">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                          <PlusCircle size={14} />
                       </div>
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Participation %</span>
                    </div>
                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{user.participationRate}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)] group-hover:brightness-110 transition-all duration-500" style={{ width: `${user.participationRate}%` }}></div>
                  </div>
                </div>

                {/* Behavior Percentage */}
                <div className="space-y-3 group">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                          <ShieldCheck size={14} />
                       </div>
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Behavior Conduct</span>
                    </div>
                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{user.behaviorScore}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] group-hover:brightness-110 transition-all duration-500" style={{ width: `${user.behaviorScore}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center italic">Metrics derived from peer-verified engagements.</p>
              </div>
            </div>

            {/* Quota Health / Key Management - Helpful for 429 Errors */}
            <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-[2rem] p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.4em]">Intelligence Access</h3>
                <Key size={14} className={hasCustomKey ? "text-emerald-500" : "text-amber-500"} />
              </div>
              <p className="text-[10px] font-semibold text-slate-400 leading-relaxed uppercase tracking-widest">
                {hasCustomKey 
                  ? "Operating with personal high-capacity identification." 
                  : "Experiencing lag or quota limits? Switching to a dedicated key restores full pulse speeds."}
              </p>
              <button 
                onClick={handleOpenKeySelector}
                className={`w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border ${quotaExhausted ? 'bg-amber-600 text-white border-transparent' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-50'}`}
              >
                {hasCustomKey ? "Rotate Profile Key" : "Optimize Quota Access"}
              </button>
            </div>
          </div>

          {/* Right Column: Interests & History (Width: 8) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Interests Section - Small fonts */}
            <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-black/20 text-slate-400 flex items-center justify-center">
                    <Award size={20} />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.4em]">Domain Specialties</h3>
                </div>
                <Sparkles size={16} className="text-slate-200" />
              </div>
              
              <div className="flex flex-wrap gap-3">
                {user.interests.map((interest) => (
                  <span key={interest} className="px-5 py-2.5 bg-slate-50 dark:bg-white/5 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-white/5">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Engagement Feed Section - Small fonts */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-6">
                <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.5em]">Live Pulse Log</h3>
                <div className="h-px flex-1 mx-10 bg-slate-100 dark:bg-white/10"></div>
                <button className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest">Archive</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...hostedActivities, ...joinedActivities.filter(a => a.creatorId !== user.id)].map(act => (
                  <div key={act.id} className="p-6 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/5 rounded-[2rem] hover:shadow-lg transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-12 h-12 bg-[var(--primary)] opacity-[0.03] rounded-bl-[2rem]"></div>
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-[9px] font-black bg-slate-50 dark:bg-black/30 text-slate-400 px-3 py-1 rounded-lg border border-slate-100 dark:border-white/5 uppercase tracking-widest">{act.category}</span>
                      <Heart size={16} className="text-slate-100 group-hover:text-rose-500 transition-colors" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-[var(--primary)] transition-colors">{act.title}</h4>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <MapPin size={12} /> {act.location}
                    </div>
                  </div>
                ))}
              </div>

              {hostedActivities.length === 0 && joinedActivities.length === 0 && (
                <div className="p-20 text-center bg-slate-50 dark:bg-black/10 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-white/5">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No Recent Activity Recorded</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Logout Section */}
        <div className="pt-12 flex justify-center pb-12">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-10 py-4 bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-slate-200 dark:border-white/5 hover:border-rose-200 transition-all duration-300 rounded-2xl group shadow-sm active:scale-95"
          >
            <LogOut size={16} className="transition-transform group-hover:-translate-x-1" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em]">Terminate Session</span>
          </button>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'home': return <PulseFeed />;
      case 'explore': return <DiscoverView />;
      case 'notifications': return <NotificationsView />;
      case 'profile': return <ProfileView />;
      default: return <PulseFeed />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onCreateClick={() => setIsCreateOpen(true)}>
      {renderContent()}
      <CreateModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSubmit={handlePostActivity} 
        initialCategory={selectedCategory !== 'All' ? selectedCategory : 'Social'}
        initialLocation={prefilledLocation}
      />
      <EditProfileModal 
        isOpen={isEditProfileOpen} 
        onClose={() => setIsEditProfileOpen(false)} 
        user={user} 
        onSave={handleUpdateProfile} 
        isInitialSetup={!hasCompletedSetup}
      />
      {joiningActivity && (
        <JoinModal 
          isOpen={!!joiningActivity}
          onClose={() => setJoiningActivity(null)}
          activity={joiningActivity}
          onConfirm={handleConfirmJoin}
        />
      )}
    </Layout>
  );
};

export default App;
