
import React, { createContext, useContext, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { useUser } from './UserContext';

type MessageRole = 'user' | 'assistant';

interface Message {
  id: string;
  role: MessageRole;
  content: string;
  attachments?: any[]; // For file attachments
}

interface Session {
  id: string;
  title: string;
  messages: Message[];
}

interface ChatContextType {
  messages: Message[];
  sessions: Session[];
  currentSession: string | null;
  isLoading: boolean;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  sendMessage: (content: string, attachments?: File[]) => Promise<void>;
  createNewChat: () => void;
  selectSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  clearAllSessions: () => void;
  exportSessions: (format: string) => void;
  archiveSessions: () => void;
}

const defaultSessions: Session[] = [
  {
    id: '1',
    title: 'Previous chat 1',
    messages: []
  },
  {
    id: '2',
    title: 'Previous chat 2',
    messages: []
  }
];

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<Session[]>(defaultSessions);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('baby-orchestrator');
  const { toast } = useToast();
  const { systemPromptSettings } = useUser();

  // Get current messages based on the active session
  const messages = currentSession 
    ? sessions.find(s => s.id === currentSession)?.messages || []
    : [];

  const createNewChat = () => {
    const newSession: Session = {
      id: uuidv4(),
      title: `New chat ${sessions.length + 1}`,
      messages: []
    };
    
    setSessions(prev => [...prev, newSession]);
    setCurrentSession(newSession.id);
  };

  const selectSession = (sessionId: string) => {
    setCurrentSession(sessionId);
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    
    // If we deleted the current session, set current to null
    if (currentSession === sessionId) {
      setCurrentSession(null);
    }
  };
  
  const clearAllSessions = () => {
    setSessions([]);
    setCurrentSession(null);
    
    toast({
      title: "All sessions cleared",
      description: "Your chat history has been deleted"
    });
  };
  
  const exportSessions = (format: string = 'json') => {
    const sessionData = JSON.stringify(sessions, null, 2);
    
    // Create a blob and download link
    const blob = new Blob([sessionData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export complete",
      description: `Your chat history has been exported as ${format.toUpperCase()}`
    });
  };
  
  const archiveSessions = () => {
    // In a real application, this would move sessions to an archive
    // For now, we just show a toast
    toast({
      title: "Sessions archived",
      description: "Your chat history has been archived"
    });
  };

  const sendMessage = async (content: string, attachments: File[] = []) => {
    if (!content.trim() && attachments.length === 0) return;
    
    // Create session if none exists
    if (!currentSession) {
      createNewChat();
    }
    
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      attachments: attachments.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size
      }))
    };
    
    setSessions(prev => {
      return prev.map(session => {
        if (session.id === currentSession) {
          return {
            ...session,
            messages: [...session.messages, userMessage]
          };
        }
        return session;
      });
    });
    
    // Simulate assistant response
    setIsLoading(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, we would use the systemPromptSettings here
      console.log("Using system prompt:", systemPromptSettings?.prompt);
      console.log("Using temperature:", systemPromptSettings?.temperature);
      console.log("Using max tokens:", systemPromptSettings?.maxTokens);
      
      // Add assistant response
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: `This is a response to: "${content}"`
      };
      
      setSessions(prev => {
        return prev.map(session => {
          if (session.id === currentSession) {
            // Update session title based on first message if it's a new chat
            const isFirstMessage = session.messages.length <= 1;
            return {
              ...session,
              title: isFirstMessage ? content.slice(0, 30) + (content.length > 30 ? '...' : '') : session.title,
              messages: [...session.messages, assistantMessage]
            };
          }
          return session;
        });
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider 
      value={{ 
        messages, 
        sessions, 
        currentSession, 
        isLoading, 
        selectedModel,
        setSelectedModel,
        sendMessage, 
        createNewChat, 
        selectSession,
        deleteSession,
        clearAllSessions,
        exportSessions,
        archiveSessions
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
