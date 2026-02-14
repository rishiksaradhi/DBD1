
import React from 'react';
import { Trophy, BookOpen, Users, Code, Gamepad2, Tent } from 'lucide-react';
import { Category, Activity, User } from './types';

export const CATEGORIES: { name: Category; icon: React.ReactNode; color: string; border: string }[] = [
  { name: 'Sports', icon: <Trophy className="w-4 h-4" />, color: 'bg-amber-900/20 text-amber-500', border: 'border-amber-500/30' },
  { name: 'Study', icon: <BookOpen className="w-4 h-4" />, color: 'bg-indigo-900/20 text-indigo-400', border: 'border-indigo-500/30' },
  { name: 'Social', icon: <Users className="w-4 h-4" />, color: 'bg-emerald-900/20 text-emerald-400', border: 'border-emerald-500/30' },
  { name: 'Projects', icon: <Code className="w-4 h-4" />, color: 'bg-slate-800/40 text-slate-300', border: 'border-slate-500/30' },
  { name: 'Gaming', icon: <Gamepad2 className="w-4 h-4" />, color: 'bg-violet-900/20 text-violet-400', border: 'border-violet-500/30' },
  { name: 'Clubs', icon: <Tent className="w-4 h-4" />, color: 'bg-rose-900/20 text-rose-400', border: 'border-rose-500/30' },
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Johnson',
  rollNumber: 'AP21-CS-105',
  email: 'alex.j@university.edu',
  avatar: '',
  interests: ['Basketball', 'React Development', 'Chess', 'Algorithms'],
  major: 'Computer Science',
  age: 21,
  participationRate: 88,
  behaviorScore: 96,
};

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    title: '3v3 Basketball Scrimmage',
    category: 'Sports',
    location: 'Main Gym Court 2',
    time: 'Today, 5:00 PM',
    slotsTotal: 6,
    slotsTaken: 4,
    creatorId: 'u2',
    creatorName: 'Jordan Smith',
    creatorAvatar: '',
    skillLevel: 'Intermediate',
    description: 'Looking for 2 more players for a friendly half-court session.',
    createdAt: new Date().toISOString(),
    participants: [
      { id: 'p1', name: 'Marcus Lee', avatar: '', skillLevel: 'Advanced' },
      { id: 'p2', name: 'Taylor Swift', avatar: '', skillLevel: 'Beginner' },
      { id: 'p3', name: 'Riley Reid', avatar: '', skillLevel: 'Intermediate' }
    ]
  },
  {
    id: 'a2',
    title: 'CS101 Final Review',
    category: 'Study',
    location: 'Central Library, Floor 3',
    time: 'Tomorrow, 2:00 PM',
    slotsTotal: 5,
    slotsTaken: 2,
    creatorId: 'u3',
    creatorName: 'Sarah Chen',
    creatorAvatar: '',
    description: 'Going over binary trees and recursion. Bring coffee!',
    createdAt: new Date().toISOString(),
    participants: [
      { id: 'p4', name: 'Elena Gilbert', avatar: '' }
    ]
  },
  {
    id: 'a3',
    title: 'E-Sports Club: Valorant',
    category: 'Gaming',
    location: 'Student Union Room 402',
    time: 'Friday, 8:00 PM',
    slotsTotal: 10,
    slotsTaken: 7,
    creatorId: 'u4',
    creatorName: 'Mike Ross',
    creatorAvatar: '',
    skillLevel: 'Any',
    description: 'Casual LAN party and ladder climb. All ranks welcome!',
    createdAt: new Date().toISOString(),
    participants: [
      { id: 'p5', name: 'Harvey Specter', avatar: '' },
      { id: 'p6', name: 'Donna Paulsen', avatar: '' }
    ]
  },
];
