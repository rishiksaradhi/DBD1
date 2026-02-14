
export type Category = 'Sports' | 'Basketball' | 'Football' | 'Cricket' | 'Tennis' | 'Badminton' | 'Table Tennis' | 'Volleyball' | 'Study' | 'Social' | 'Projects' | 'Gaming' | 'Clubs';

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  skillLevel?: string;
}

export interface User {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  avatar: string;
  interests: string[];
  major: string;
  age: number;
  participationRate: number;
  behaviorScore: number;
  bio?: string;
  socialLinks?: {
    github?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export type ActivityStatus = 'Upcoming' | 'Active' | 'Completed' | 'Cancelled';

export interface Activity {
  id: string;
  title: string;
  category: Category;
  location: string;
  time: string;
  slotsTotal: number;
  slotsTaken: number;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Any';
  description: string;
  createdAt: string;
  participants: Participant[];
  status?: ActivityStatus;
  outcome?: string; // e.g., "Won match", "Finished Chapter 4", "Formed Team"
}

export interface Message {
  id: string;
  activityId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface MatchSuggestion {
  activityId: string;
  reason: string;
  compatibilityScore: number;
}
