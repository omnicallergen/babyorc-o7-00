
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserProfile = {
  name: string;
  avatar?: string;
};

interface UserContextType {
  user: UserProfile;
  darkMode: boolean;
  toggleDarkMode: () => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
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
    avatar: undefined
  });
  
  const [darkMode, setDarkMode] = useState(false);
  
  // Load user preferences from localStorage on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem('userProfile');
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
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
  
  const value = {
    user,
    darkMode,
    toggleDarkMode,
    updateUserProfile
  };
  
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
