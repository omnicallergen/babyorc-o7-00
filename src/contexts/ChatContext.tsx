
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
};

interface ChatContextType {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  messages: Message[];
  isLoading: boolean;
  selectedModel: string;
  createNewChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  setSelectedModel: (model: string) => void;
  selectSession: (sessionId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('baby-orchestrator');

  // Load sessions from localStorage on initial render
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    const savedCurrentSessionId = localStorage.getItem('currentSessionId');
    
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions).map((session: any) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt),
        messages: session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
      
      setSessions(parsedSessions);
      
      if (savedCurrentSessionId) {
        const currentSession = parsedSessions.find((s: ChatSession) => s.id === savedCurrentSessionId);
        if (currentSession) {
          setCurrentSession(currentSession);
        }
      } else if (parsedSessions.length > 0) {
        setCurrentSession(parsedSessions[0]);
      }
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('chatSessions', JSON.stringify(sessions));
    }
    if (currentSession) {
      localStorage.setItem('currentSessionId', currentSession.id);
    }
  }, [sessions, currentSession]);

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: `New Chat ${sessions.length + 1}`,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setSessions([newSession, ...sessions]);
    setCurrentSession(newSession);
  };

  const selectSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
    }
  };

  const updateSession = (updatedSession: ChatSession) => {
    const updatedSessions = sessions.map(session => 
      session.id === updatedSession.id ? updatedSession : session
    );
    
    setSessions(updatedSessions);
    setCurrentSession(updatedSession);
  };

  const sendMessage = async (content: string) => {
    if (!currentSession) {
      createNewChat();
    }
    
    setIsLoading(true);
    
    // Create user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date()
    };
    
    // Add user message to the current session
    const updatedSession = currentSession ? {
      ...currentSession,
      messages: [...currentSession.messages, userMessage],
      updatedAt: new Date()
    } : {
      id: `session-${Date.now()}`,
      title: content.slice(0, 30) + (content.length > 30 ? '...' : ''),
      messages: [userMessage],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    updateSession(updatedSession as ChatSession);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Create assistant message
      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        content: `This is a simulated response to: "${content}"`,
        role: 'assistant',
        timestamp: new Date()
      };
      
      // Add assistant message to the current session
      const sessionWithResponse = {
        ...updatedSession,
        messages: [...updatedSession.messages, assistantMessage],
        updatedAt: new Date()
      };
      
      updateSession(sessionWithResponse as ChatSession);
      setIsLoading(false);
    }, 1000);
  };

  const value = {
    currentSession,
    sessions,
    messages: currentSession?.messages || [],
    isLoading,
    selectedModel,
    createNewChat,
    sendMessage,
    setSelectedModel,
    selectSession
  };
  
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
