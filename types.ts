
import type { ComponentType } from 'react';

export type Page = 'home' | 'detect' | 'weather' | 'chatbot' | 'dashboard';

export interface Language {
  code: 'en' | 'ta' | 'hi' | 'te';  // Supported language codes (added 'te' for Telugu)
  name: string;              // Display name in native script
}

export interface DiseaseResult {
  disease_name: string;
  confidence: number;
  treatment_plan: {
    title: string;
    steps: string[];
  };
  preventive_measures: {
    title: string;
    steps: string[];
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface WeatherData {
    day: string;
    temp: number;
    humidity: number;
    precipitation: number;
    icon: ComponentType<{ className?: string }>;
}

export interface DiseaseStat {
    name: string;
    count: number;
}

export interface CropStat {
    name: string;
    value: number;
    [key: string]: string | number; // Add index signature for recharts
}
