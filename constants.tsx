
import React from 'react';
import { Trophy, BookOpen, Users, Code, Gamepad2, Tent, Activity as ActivityIcon, Zap, Circle, Target } from 'lucide-react';
import { Category, Activity, User } from './types';

export interface CategoryItem {
  name: Category;
  icon: React.ReactNode;
  color: string;
  border: string;
  parent?: Category;
}

export const CATEGORIES: CategoryItem[] = [
  // Main Categories
  { name: 'Sports', icon: <Trophy className="w-4 h-4" />, color: 'bg-slate-900 text-slate-100', border: 'border-slate-800' },
  { name: 'Study', icon: <BookOpen className="w-4 h-4" />, color: 'bg-indigo-900/20 text-indigo-400', border: 'border-indigo-500/30' },
  { name: 'Social', icon: <Users className="w-4 h-4" />, color: 'bg-emerald-900/20 text-emerald-400', border: 'border-emerald-500/30' },
  { name: 'Projects', icon: <Code className="w-4 h-4" />, color: 'bg-slate-800/40 text-slate-300', border: 'border-slate-500/30' },
  { name: 'Gaming', icon: <Gamepad2 className="w-4 h-4" />, color: 'bg-violet-900/20 text-violet-400', border: 'border-violet-500/30' },
  { name: 'Clubs', icon: <Tent className="w-4 h-4" />, color: 'bg-rose-900/20 text-rose-400', border: 'border-rose-500/30' },

  // Sports Sub-categories
  { name: 'Basketball', parent: 'Sports', icon: <Trophy className="w-4 h-4" />, color: 'bg-orange-900/20 text-orange-500', border: 'border-orange-500/30' },
  { name: 'Football', parent: 'Sports', icon: <ActivityIcon className="w-4 h-4" />, color: 'bg-emerald-900/20 text-emerald-500', border: 'border-emerald-500/30' },
  { name: 'Cricket', parent: 'Sports', icon: <Target className="w-4 h-4" />, color: 'bg-sky-900/20 text-sky-500', border: 'border-sky-500/30' },
  { name: 'Tennis', parent: 'Sports', icon: <Zap className="w-4 h-4" />, color: 'bg-lime-900/20 text-lime-500', border: 'border-lime-500/30' },
  { name: 'Badminton', parent: 'Sports', icon: <Zap className="w-4 h-4" />, color: 'bg-yellow-900/20 text-yellow-500', border: 'border-yellow-500/30' },
  { name: 'Table Tennis', parent: 'Sports', icon: <Circle className="w-4 h-4" />, color: 'bg-rose-900/20 text-rose-500', border: 'border-rose-500/30' },
  { name: 'Volleyball', parent: 'Sports', icon: <ActivityIcon className="w-4 h-4" />, color: 'bg-cyan-900/20 text-cyan-500', border: 'border-cyan-500/30' },
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Alex Johnson',
  rollNumber: 'AP21-CS-105',
  email: 'alex.j@university.edu',
  avatar: '',
  interests: ['Basketball', 'React Development', 'Chess', 'Algorithms', 'Badminton'],
  major: 'Computer Science',
  age: 21,
  participationRate: 88,
  behaviorScore: 96,
};

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    title: '3v3 Basketball Scrimmage',
    category: 'Basketball',
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
    ],
    status: 'Upcoming'
  },
  {
    id: 'h1',
    title: 'Inter-Department Football Finals',
    category: 'Football',
    location: 'Campus Main Field',
    time: '2 days ago',
    slotsTotal: 22,
    slotsTaken: 22,
    creatorId: 'u1',
    creatorName: 'Alex Johnson',
    creatorAvatar: '',
    description: 'Final showdown between CS and Mechanical departments.',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    participants: [],
    status: 'Completed',
    outcome: 'CS won 2-1 (Championship Title)'
  },
  {
    id: 'h2',
    title: 'DSA Library Hack-a-thon',
    category: 'Projects',
    location: 'Quiet Zone A',
    time: 'Last Week',
    slotsTotal: 5,
    slotsTaken: 5,
    creatorId: 'u4',
    creatorName: 'Mike Ross',
    creatorAvatar: '',
    description: 'Solve as many Leetcode mediums as possible.',
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    participants: [{ id: 'u1', name: 'Alex Johnson', avatar: '' }],
    status: 'Completed',
    outcome: 'Solved 12 problems; Shared solutions on GitHub.'
  },
  {
    id: 'a4',
    title: 'Mixed Doubles Tennis',
    category: 'Tennis',
    location: 'North Courts',
    time: 'Today, 6:30 PM',
    slotsTotal: 4,
    slotsTaken: 3,
    creatorId: 'u5',
    creatorName: 'Emma Watson',
    creatorAvatar: '',
    skillLevel: 'Advanced',
    description: 'Need one more for a doubles match. High intensity!',
    createdAt: new Date().toISOString(),
    participants: [
      { id: 'p7', name: 'Chris Evans', avatar: '' },
      { id: 'p8', name: 'Scarlett J.', avatar: '' }
    ],
    status: 'Upcoming'
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
    ],
    status: 'Upcoming'
  },
];
