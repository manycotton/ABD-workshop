'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ExclusionStory {
  task: string;
  place: string;
  barrier: string;
  emotion: string;
  consequence: string;
}

export interface ReflectionData {
  strengths: string;
  importantThings: string;
  selectedContext: string;
  exclusionStory: ExclusionStory;
  inclusiveActions: string[];
  generatedStory?: string | null;
}

export interface DesignData {
  title: string;
  image: File | null;
  description: string;
}

export interface Persona {
  id: number;
  name: string;
  role: string;
  description: string[];
  imageUrl: string;
  color: string;
  age: number;
}

interface AppState {
  selectedPersona: Persona | null;
  reflectionData: ReflectionData | null;
  designData: DesignData | null;
  currentView: 'personas' | 'exercise' | 'summary' | 'design-fiction';
}

interface AppContextType {
  appState: AppState;
  setSelectedPersona: (persona: Persona | null) => void;
  setReflectionData: (data: ReflectionData) => void;
  setDesignData: (data: DesignData) => void;
  setCurrentView: (view: 'personas' | 'exercise' | 'summary' | 'design-fiction') => void;
  resetAllData: () => void;
  hasAnyData: () => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialState: AppState = {
  selectedPersona: null,
  reflectionData: null,
  designData: null,
  currentView: 'personas'
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [appState, setAppState] = useState<AppState>(initialState);

  const setSelectedPersona = (persona: Persona | null) => {
    setAppState(prev => ({ ...prev, selectedPersona: persona }));
  };

  const setReflectionData = (data: ReflectionData) => {
    setAppState(prev => ({ ...prev, reflectionData: data }));
  };

  const setDesignData = (data: DesignData) => {
    setAppState(prev => ({ ...prev, designData: data }));
  };

  const setCurrentView = (view: 'personas' | 'exercise' | 'summary' | 'design-fiction') => {
    setAppState(prev => ({ ...prev, currentView: view }));
  };

  const resetAllData = () => {
    setAppState(initialState);
  };

  const hasAnyData = () => {
    return !!(appState.reflectionData || appState.designData);
  };

  const value: AppContextType = {
    appState,
    setSelectedPersona,
    setReflectionData,
    setDesignData,
    setCurrentView,
    resetAllData,
    hasAnyData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}