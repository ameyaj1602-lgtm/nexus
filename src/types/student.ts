export interface StudentProfile {
  name: string;
  age: string;
  grade: string;
  board: string;
  city: string;
  schoolType: string;
}

export interface ParentExpectations {
  selected: string[];
  other: string;
}

export interface InterestSelection {
  id: string;
  label: string;
  icon: string;
}

export interface IdentityDimension {
  label: string;
  question: string;
  key: string;
  value: number;
}

export interface IdentityScores {
  creative: number;
  analytical: number;
  social: number;
  practical: number;
  entrepreneurial: number;
  caring: number;
}

export interface CareerHypothesis {
  id: string;
  name: string;
  status: 'exploring' | 'tested' | 'active';
  note: string;
}

export interface InterestCard {
  id: number;
  scenario: string;
  icon: string;
  category: string;
}

export interface ValueItem {
  id: string;
  label: string;
  icon: string;
  rank: number;
}

export interface JournalEntry {
  id: string;
  prompt: string;
  response: string;
  createdAt: string;
}

export interface OnboardingData {
  profile: StudentProfile;
  parentExpectations: ParentExpectations;
  interests: string[];
  identityScores: IdentityScores;
  completedAt: string;
}

export interface DiscoveryData {
  interestResponses: Record<number, 'love' | 'meh' | 'nope'>;
  valueRankings: ValueItem[];
  journalEntries: JournalEntry[];
}
