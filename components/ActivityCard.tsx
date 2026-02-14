
import React from 'react';
import { MapPin, Clock, Users, Star, ArrowUpRight, Check, Sparkles, User as UserIcon, X } from 'lucide-react';
import { Activity } from '../types';
import { CATEGORIES } from '../constants';

interface ActivityCardProps {
  activity: Activity;
  isSuggested?: boolean;
  matchReason?: string;
  onJoin: (id: string) => void;
  onUnjoin: (id: string) => void;
  currentUserId?: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, isSuggested, matchReason, onJoin, onUnjoin, currentUserId }) => {
  const category = CATEGORIES.find(c => c.name === activity.category);
  const isFull = activity.slotsTaken >= activity.slotsTotal;
  const hasJoined = activity.participants.some(p => p.id === currentUserId);
  
  return (
    <div className={`group relative bg-white dark:bg-slate-900/60 rounded-[1.5rem] p-6 border border-slate-200 dark:border-white/5 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200 dark:hover:shadow-none hover:-translate-y-1 ${isSuggested ? 'ring-1 ring-amber-500/30' : ''}`}>
      {isSuggested && (
        <div className="absolute -top-3 left-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[9px] font-black px-3 py-1 rounded-md uppercase tracking-[0.2em] shadow-lg flex items-center gap-2">
          <Sparkles size={10} />
          Smart Suggestion
        </div>
      )}

      <div className="flex justify-between items-start mb-6">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${category?.border} ${category?.color.replace('bg-', 'bg-opacity-10 dark:bg-opacity-5 bg-')} shadow-sm transition-colors`}>
          {category?.icon}
          <span className="text-[10px] font-black uppercase tracking-widest">{activity.category}</span>
        </div>
        <div className={`text-[10px] font-black px-2.5 py-1 rounded-md border ${isFull ? 'bg-rose-50 text-rose-500 border-rose-100' : 'text-slate-500 dark:text-slate-500 bg-slate-50 dark:bg-black/20 border-slate-100 dark:border-white/5'} uppercase tracking-widest`}>
          {isFull ? 'FULLY BOOKED' : `${activity.slotsTaken}/${activity.slotsTotal} FILLED`}
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-[var(--primary)] transition-colors">
        {activity.title}
      </h3>

      <div className="space-y-3 mb-6">
        <div className="flex items-center text-xs text-slate-600 dark:text-slate-400 gap-2 font-medium">
          <MapPin size={14} className="text-slate-400" />
          <span className="truncate tracking-tight">{activity.location}</span>
        </div>
        <div className="flex items-center text-xs text-slate-600 dark:text-slate-400 gap-2 font-medium">
          <Clock size={14} className="text-slate-400" />
          <span className="tracking-tight">{activity.time}</span>
        </div>
      </div>

      {/* Participants List - Now using silhouette placeholders */}
      <div className="mb-8 space-y-3">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Pulse Lineup</p>
        <div className="flex items-center -space-x-2">
          {activity.participants.slice(0, 5).map((p) => (
            <div key={p.id} className="relative group/user">
              {p.avatar ? (
                <img 
                  src={p.avatar} 
                  alt={p.name} 
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 shadow-sm transition-transform group-hover/user:scale-110 group-hover/user:z-10 object-cover" 
                />
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 shadow-sm transition-transform group-hover/user:scale-110 group-hover/user:z-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400">
                  <UserIcon size={12} />
                </div>
              )}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest opacity-0 group-hover/user:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {p.name} {p.skillLevel ? `(${p.skillLevel})` : ''}
              </div>
            </div>
          ))}
          {activity.participants.length > 5 && (
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[8px] font-black text-slate-400">
              +{activity.participants.length - 5}
            </div>
          )}
          {activity.participants.length === 0 && (
            <span className="text-[10px] font-bold text-slate-300 italic">Initiate engagement...</span>
          )}
        </div>
      </div>

      {isSuggested && matchReason && (
        <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-500/5 rounded-xl border border-amber-100 dark:border-amber-500/10">
          <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-500/80 italic leading-relaxed">
             "{matchReason}"
          </p>
        </div>
      )}

      <div className="flex items-center justify-between pt-5 border-t border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative">
            {activity.creatorAvatar ? (
               <img src={activity.creatorAvatar} alt={activity.creatorName} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 shadow-sm object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <UserIcon size={12} />
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800" style={{ backgroundColor: 'var(--primary)' }}></div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-900 dark:text-slate-200 uppercase tracking-widest">{activity.creatorName}</span>
            <div className="flex items-center gap-1 text-[9px] text-amber-600 dark:text-amber-500 font-bold uppercase tracking-widest">
              Verified Host
            </div>
          </div>
        </div>
        
        {hasJoined ? (
          <button 
            onClick={() => onUnjoin(activity.id)}
            className="flex items-center gap-2 text-rose-500 hover:text-white hover:bg-rose-500 border border-rose-500 text-[10px] font-black py-2.5 px-5 rounded-lg transition-all active:scale-95 uppercase tracking-[0.15em] bg-transparent"
          >
            <X size={14} /> Unjoin
          </button>
        ) : (
          <button 
            disabled={isFull}
            onClick={() => onJoin(activity.id)}
            className={`flex items-center gap-2 text-white text-[10px] font-black py-2.5 px-5 rounded-lg transition-all shadow-xl active:scale-95 uppercase tracking-[0.15em] ${isFull ? 'bg-slate-200 dark:bg-white/5 text-slate-400 shadow-none cursor-not-allowed border border-slate-100 dark:border-white/5' : 'hover:opacity-90'}`}
            style={!isFull ? { backgroundColor: 'var(--primary)' } : {}}
          >
            {isFull ? <Check size={14} /> : 'Join'}
            {isFull ? 'Full' : <ArrowUpRight size={14} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default ActivityCard;
