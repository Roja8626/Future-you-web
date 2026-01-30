export type LanguageCode = 
  | 'en' // English
  | 'ta' // Tamil
  | 'tgl' // Tanglish
  | 'hi' // Hindi
  | 'es' // Spanish
  | 'fr' // French
  | 'de' // German
  | 'pt' // Portuguese
  | 'ar' // Arabic
  | 'ja' // Japanese
  | 'ko' // Korean
  | 'zh'; // Mandarin

export interface UserProfile {
  email: string;
  name: string;
  futureDescription: string;
  timeHorizon: string;
  emotionalFocus: string;
  language: LanguageCode;
  hasCompletedSetup: boolean;
}

export interface ReflectionEntry {
  id: string;
  date: string;
  prompt: string;
  response: string;
}

export type ViewState = 
  | 'LANDING' 
  | 'AUTH' 
  | 'SETUP' 
  | 'GENERATING' 
  | 'LETTER' 
  | 'REFLECTION' 
  | 'SUPPORT';

export interface AppState {
  view: ViewState;
  user: UserProfile | null;
  currentLetter: string | null;
  todayReflection: ReflectionEntry | null;
  language: LanguageCode;
}

export const STORAGE_KEYS = {
  USER_PROFILE: 'future_you_profile',
  REFLECTION_HISTORY: 'future_you_reflections',
  LAST_LETTER: 'future_you_last_letter',
  LAST_VISIT: 'future_you_last_visit',
  LANGUAGE_PREF: 'future_you_language',
};