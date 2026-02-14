
import React, { useState } from 'react';
import { X, Check, Star, Zap, Activity as ActivityIcon } from 'lucide-react';
import { Activity } from '../types';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity;
  onConfirm: (skillLevel: string) => void;
}

const JoinModal: React.FC<JoinModalProps> = ({ isOpen, onClose, activity, onConfirm }) => {
  const [selectedLevel, setSelectedLevel] = useState('Intermediate');

  if (!isOpen) return null;

  const levels = [
    { name: 'Beginner', desc: 'Just starting out, eager to learn.', icon: <Zap size={18} className="text-emerald-500" /> },
    { name: 'Intermediate', desc: 'Know the basics, fairly consistent.', icon: <Zap size={18} className="text-amber-500" /> },
    { name: 'Advanced', desc: 'High skill level, competitive play.', icon: <Zap size={18} className="text-rose-500" /> },
  ];

  const needsSkill = ['Sports', 'Projects', 'Gaming'].includes(activity.category);

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 p-8 space-y-8">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Confirm Entry</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ActivityIcon size={12} /> {activity.title}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {needsSkill ? (
          <div className="space-y-4">
            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 block px-1">Adjust Your Tier</label>
            <div className="space-y-3">
              {levels.map((level) => (
                <button
                  key={level.name}
                  onClick={() => setSelectedLevel(level.name)}
                  className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all text-left ${
                    selectedLevel === level.name
                      ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-black shadow-xl -translate-y-1'
                      : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-white/5 text-slate-900 dark:text-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${selectedLevel === level.name ? 'bg-white/20' : 'bg-slate-50 dark:bg-black/20'}`}>
                      {level.icon}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest">{level.name}</p>
                      <p className={`text-[10px] font-bold opacity-60`}>{level.desc}</p>
                    </div>
                  </div>
                  {selectedLevel === level.name && <Check size={18} />}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8 bg-slate-50 dark:bg-black/20 rounded-[2rem] border border-dashed border-slate-200 dark:border-white/5 text-center space-y-4">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl mx-auto flex items-center justify-center text-[var(--primary)] shadow-xl animate-bounce">
              <Star size={32} />
            </div>
            <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-wider">
              No specific skill tier required for this engagement. Your participation is highly valued!
            </p>
          </div>
        )}

        <button
          onClick={() => onConfirm(needsSkill ? selectedLevel : 'Any')}
          className="w-full py-5 text-white font-black rounded-2xl shadow-2xl transition-all hover:opacity-90 active:scale-95 uppercase text-xs tracking-widest flex items-center justify-center gap-3"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          Finalize Authorization
          <Check size={18} />
        </button>
      </div>
    </div>
  );
};

export default JoinModal;
