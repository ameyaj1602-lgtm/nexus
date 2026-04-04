export interface StudentProfile {
  id: string;
  user_id: string;
  name: string;
  age: number;
  class_grade: number;
  board: 'CBSE' | 'ICSE' | 'State' | 'IB' | 'Other';
  city: string;
  school_type: 'Private' | 'Government' | 'Semi-Government' | 'International';
  stream_interest?: string;
  parent_expectation?: string;
  language_pref: 'en' | 'hi';
  onboarding_complete: boolean;
  created_at: string;
}

export interface ParentProfile {
  id: string;
  user_id: string;
  name: string;
  linked_student_id?: string;
  invite_code: string;
  created_at: string;
}

export interface IdentitySnapshot {
  id: string;
  student_id: string;
  creative: number;
  analytical: number;
  social: number;
  practical: number;
  entrepreneurial: number;
  caring: number;
  snapshot_date: string;
  source: 'self' | 'parent' | 'peer';
}

export interface InterestResponse {
  id: string;
  student_id: string;
  card_id: string;
  response: 'excited' | 'neutral' | 'not_me';
  timestamp: string;
}

export interface ValueRanking {
  id: string;
  student_id: string;
  value_name: string;
  rank: number;
  timestamp: string;
}

export interface CareerHypothesis {
  id: string;
  student_id: string;
  career_name: string;
  status: 'exploring' | 'tested' | 'rejected' | 'active';
  evidence?: string;
  liked_aspects?: string;
  disliked_aspects?: string;
  created_at: string;
  updated_at: string;
}

export interface JournalEntry {
  id: string;
  student_id: string;
  prompt: string;
  response: string;
  mood?: string;
  timestamp: string;
}

export interface Career {
  id: string;
  name: string;
  cluster: string;
  description: string;
  skills: string[];
  salary_range: { min: number; max: number; currency: string };
  ai_risk_score: number; // 0-100
  growth_trend: 'rising' | 'stable' | 'declining';
  education_path: string;
  day_in_life: string;
  icon: string;
  identity_match?: {
    creative: number;
    analytical: number;
    social: number;
    practical: number;
    entrepreneurial: number;
    caring: number;
  };
}

export interface AlignmentSurvey {
  id: string;
  parent_id: string;
  student_id: string;
  parent_expectations: string[];
  student_aspirations: string[];
  alignment_score: number;
  survey_date: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export type UserRole = 'student' | 'parent';

export interface InterestCard {
  id: string;
  title: string;
  description: string;
  image?: string;
  category: string;
}

export interface ValueOption {
  name: string;
  label: string;
  description: string;
  icon: string;
}
