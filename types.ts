
export type Gender = 'male' | 'female' | 'other';
export type FoodPreference = 'veg' | 'non-veg' | 'vegan' | 'keto' | 'paleo' | 'mediterranean';
export type HealthGoal = 'stay healthy' | 'weight loss' | 'muscle gain' | 'sugar control' | 'gut health' | 'longevity';
export type ActivityLevel = 'sedentary' | 'moderate' | 'active' | 'athlete';
export type AppLanguage = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'kn';

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  height: string;
  weight: string;
  bloodGroup: string;
  activityLevel: ActivityLevel;
  conditions: string[];
  medications: string;
  preference: FoodPreference;
  cuisines: string[];
  goal: HealthGoal;
  language: AppLanguage;
  profilePic?: string;
}

export enum FoodSafetyStatus {
  SAFE = 'Good',
  MODERATE = 'Okay in limits',
  HARMFUL = 'Not recommended'
}

export interface FoodAnalysis {
  foodName: string;
  status: FoodSafetyStatus;
  explanation: string;
  risks: string[];
  healthScore: number;
  alternatives: string[];
  tips: string[];
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
