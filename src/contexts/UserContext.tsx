
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type SystemPromptSettings = {
  prompt: string;
  temperature: number;
  maxTokens: number;
  autoSave: boolean;
  geminiApiKey?: string;
  selectedGeminiModel?: string;
};

type UserProfile = {
  name: string;
  avatar?: string;
  email?: string;
  language?: string;
  theme?: string;
  notificationSettings?: {
    push: boolean;
    email: boolean;
    sound: boolean;
  };
  securitySettings?: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
  };
};

interface UserContextType {
  user: UserProfile;
  darkMode: boolean;
  systemPromptSettings: SystemPromptSettings | null;
  toggleDarkMode: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  updateNotificationSettings: (settings: Partial<UserProfile['notificationSettings']>) => void;
  updateSecuritySettings: (settings: Partial<UserProfile['securitySettings']>) => void;
  updateSystemPrompt: (settings: SystemPromptSettings) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<UserProfile>({
    name: 'User Name',
    avatar: undefined,
    email: 'user@example.com',
    language: 'english',
    notificationSettings: {
      push: true,
      email: true,
      sound: true
    },
    securitySettings: {
      twoFactorEnabled: false,
      lastPasswordChange: new Date().toISOString()
    }
  });
  
  const [darkMode, setDarkMode] = useState(false);
  
  const [systemPromptSettings, setSystemPromptSettings] = useState<SystemPromptSettings>({
    prompt: 'You are go:lofty, an AI assistant specialized in consulting. Provide helpful, accurate, and concise advice.',
    temperature: 0.7,
    maxTokens: 1024,
    autoSave: false,
    geminiApiKey: '',
    selectedGeminiModel: 'gemini-1.5-pro'
  });
  
  // Load user preferences from localStorage on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem('userProfile');
    const savedDarkMode = localStorage.getItem('darkMode');
    const savedSystemPrompt = localStorage.getItem('systemPromptSettings');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
    
    if (savedSystemPrompt) {
      setSystemPromptSettings(JSON.parse(savedSystemPrompt));
    }
  }, []);
  
  // Update document with dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  const updateUserProfile = (profile: Partial<UserProfile>) => {
    const updatedProfile = { ...user, ...profile };
    setUser(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  };
  
  const updateNotificationSettings = (settings: Partial<UserProfile['notificationSettings']>) => {
    const updatedSettings = { 
      ...user.notificationSettings, 
      ...settings 
    };
    
    updateUserProfile({
      notificationSettings: updatedSettings
    });
  };
  
  const updateSecuritySettings = (settings: Partial<UserProfile['securitySettings']>) => {
    const updatedSettings = { 
      ...user.securitySettings, 
      ...settings 
    };
    
    updateUserProfile({
      securitySettings: updatedSettings
    });
  };
  
  const updateSystemPrompt = (settings: SystemPromptSettings) => {
    setSystemPromptSettings(settings);
    localStorage.setItem('systemPromptSettings', JSON.stringify(settings));
  };
  
  const value = {
    user,
    darkMode,
    systemPromptSettings,
    toggleDarkMode,
    updateUserProfile,
    updateNotificationSettings,
    updateSecuritySettings,
    updateSystemPrompt
  };
  
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
