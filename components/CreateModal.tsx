
import React, { useState, useEffect } from 'react';
import { X, MapPin, Users, Clock, AlignLeft, ShieldPlus, Sparkles, ChevronDown, CalendarDays } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { Category } from '../types';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialCategory?: Category;
  initialLocation?: string;
}

const CreateModal: React.FC<CreateModalProps> = ({ isOpen, onClose, onSubmit, initialCategory, initialLocation }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>(initialCategory || 'Sports');
  const [location, setLocation] = useState(initialLocation || '');
  const [slots, setSlots] = useState(2);
  const [desc, setDesc] = useState('');
  
  // Improved Time State
  const [selectedDay, setSelectedDay] = useState<'Today' | 'Tomorrow' | 'Future'>('Today');
  const [selectedTime, setSelectedTime] = useState('17:00');

  useEffect(() => {
    if (initialCategory) setCategory(initialCategory);
    if (initialLocation) setLocation(initialLocation);
  }, [initialCategory, initialLocation, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Format time string for the activity object
    const timeString = `${selectedDay}, ${formatTime(selectedTime)}`;
    onSubmit({ 
      title, 
      category, 
      location, 
      slotsTotal: slots, 
      time: timeString, 
      description: desc 
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12;
    return `${displayH}:${minutes} ${ampm}`;
  };

  const mainCategories = CATEGORIES.filter(c => !c.parent);
  const sportsCategories = CATEGORIES.filter(c => c.parent === 'Sports');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-lg animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300 border border-slate-200 dark:border-white/10">
        <div className="flex justify-between items-center p-10 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-black/10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-lg animate-pulse" style={{ backgroundColor: 'var(--primary)' }}>
              <ShieldPlus size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">New Engagement</h2>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] flex items-center gap-2" style={{ color: 'var(--primary)' }}>
                <Sparkles size={10} /> Verified Host Access
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all text-slate-400">
            <X size={18} />
          </button>
        </div>

        <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto no-scrollbar">
          {/* Domain Selection */}
          <div className="space-y-6">
             <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 block px-1">Engagement Specialist Domain</label>
             <div className="space-y-4">
               <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {mainCategories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setCategory(cat.name)}
                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl whitespace-nowrap transition-all border ${
                      category === cat.name || (cat.name === 'Sports' && sportsCategories.some(s => s.name === category))
                        ? `text-white border-transparent shadow-xl` 
                        : 'bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-white/5 hover:border-slate-300'
                    }`}
                    style={category === cat.name || (cat.name === 'Sports' && sportsCategories.some(s => s.name === category)) ? { backgroundColor: 'var(--primary)' } : {}}
                  >
                    {cat.icon}
                    <span className="text-[9px] font-black uppercase tracking-widest">{cat.name}</span>
                  </button>
                ))}
              </div>
              {(category === 'Sports' || sportsCategories.some(s => s.name === category)) && (
                <div className="p-6 bg-slate-50 dark:bg-black/20 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4 animate-in slide-in-from-top-2 duration-300">
                   <div className="flex items-center justify-between">
                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Select Specific Game</span>
                     <ChevronDown size={10} className="text-slate-400" />
                   </div>
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {sportsCategories.map(sport => (
                        <button
                          key={sport.name}
                          type="button"
                          onClick={() => setCategory(sport.name)}
                          className={`px-3 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all border ${
                            category === sport.name 
                              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-white/10 shadow-md scale-105' 
                              : 'bg-transparent text-slate-400 border-slate-200 dark:border-white/5 hover:bg-white/50 dark:hover:bg-white/5'
                          }`}
                        >
                          {sport.name}
                        </button>
                      ))}
                   </div>
                </div>
              )}
             </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div>
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 mb-3 block px-1">Pulse Objective</label>
              <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Midterm Cram Session, 5v5 Friendly"
                className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl p-5 focus:border-opacity-30 focus:ring-4 focus:ring-opacity-5 transition-all outline-none text-slate-900 dark:text-white font-semibold placeholder:text-slate-400"
                style={{ borderColor: 'var(--primary)' }}
                autoFocus
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 mb-3 block px-1 flex items-center gap-1.5"><MapPin size={10}/> Campus Venue</label>
                <input 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Where at?"
                  className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl p-4.5 transition-all outline-none text-slate-900 dark:text-white font-semibold placeholder:text-slate-400"
                />
              </div>

              {/* Enhanced Time Selector */}
              <div className="space-y-3">
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 block px-1 flex items-center gap-1.5"><Clock size={10}/> Scheduled Timestamp</label>
                <div className="flex flex-col gap-3">
                  <div className="flex p-1 bg-slate-100 dark:bg-black/30 rounded-2xl border border-slate-200 dark:border-white/5">
                    {(['Today', 'Tomorrow', 'Future'] as const).map(day => (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`flex-1 py-2 text-[8px] font-black uppercase tracking-widest rounded-xl transition-all ${
                          selectedDay === day 
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' 
                          : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors pointer-events-none">
                       <CalendarDays size={14} />
                    </div>
                    <input 
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl py-4 pl-12 pr-6 transition-all outline-none text-slate-900 dark:text-white font-bold appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 mb-3 block px-1 flex items-center gap-1.5"><Users size={10}/> Attendee Capacity</label>
                <div className="flex items-center bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl px-4">
                  <button onClick={() => setSlots(Math.max(1, slots - 1))} className="p-2 text-slate-400 hover:text-indigo-500 transition-colors">-</button>
                  <input 
                    type="number"
                    value={slots}
                    onChange={(e) => setSlots(parseInt(e.target.value) || 1)}
                    className="w-full bg-transparent border-none py-4 text-center text-slate-900 dark:text-white font-bold outline-none"
                  />
                  <button onClick={() => setSlots(slots + 1)} className="p-2 text-slate-400 hover:text-indigo-500 transition-colors">+</button>
                </div>
              </div>
              <div>
                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 mb-3 block px-1">Network Visibility</label>
                <div className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl p-4 text-[10px] font-black uppercase tracking-[0.2em] text-center flex items-center justify-center gap-2" style={{ color: 'var(--primary)' }}>
                   Public Campus Pulse
                </div>
              </div>
            </div>

            <div>
              <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 mb-3 block px-1 flex items-center gap-1.5"><AlignLeft size={10}/> Pulse Briefing</label>
              <textarea 
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="What are the goals? Any specific requirements?"
                rows={3}
                className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-2xl p-5 transition-all outline-none resize-none text-slate-900 dark:text-white font-semibold placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="p-10 bg-slate-50 dark:bg-black/10 flex gap-6 border-t border-slate-100 dark:border-white/5">
          <button onClick={onClose} className="flex-1 py-4 font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors uppercase text-[10px] tracking-widest">
            Discard
          </button>
          <button 
            onClick={handleSubmit}
            className="flex-[2] text-white font-black py-5 rounded-2xl transition-all shadow-xl hover:opacity-90 active:scale-[0.98] uppercase text-[11px] tracking-widest flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            Confirm Engagement
            <ShieldPlus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
