import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { useUser } from './UserContext';
import { sendMessageToGemini, formatMessagesForGemini } from '@/utils/geminiApi';

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

const defaultSessions: Session[] = [];

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<Session[]>(defaultSessions);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('baby-orchestrator');
  const { toast } = useToast();
  const { systemPromptSettings } = useUser();

  useEffect(() => {
    if (sessions.length === 0) {
      createNewChat();
    } else if (!currentSession) {
      setCurrentSession(sessions[0].id);
    }
  }, [sessions.length]);

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
    
    if (currentSession === sessionId) {
      const remainingSessions = sessions.filter(session => session.id !== sessionId);
      setCurrentSession(remainingSessions.length > 0 ? remainingSessions[0].id : null);
      
      if (remainingSessions.length === 0) {
        createNewChat();
      }
    }
  };
  
  const clearAllSessions = () => {
    setSessions([]);
    setCurrentSession(null);
    
    setTimeout(() => createNewChat(), 0);
    
    toast({
      title: "All sessions cleared",
      description: "Your chat history has been deleted"
    });
  };
  
  const exportSessions = (format: string = 'json') => {
    const sessionData = JSON.stringify(sessions, null, 2);
    
    const blob = new Blob([sessionData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export complete",
      description: `Your chat history has been exported as ${format.toUpperCase()}`
    });
  };
  
  const archiveSessions = () => {
    toast({
      title: "Sessions archived",
      description: "Your chat history has been archived"
    });
  };

  const sendMessage = async (content: string, attachments: File[] = []) => {
    if (!content.trim() && attachments.length === 0) return;
    
    if (!currentSession) {
      await createNewChat();
    }

    const sessionToUse = sessions.find(s => s.id === currentSession);
    if (!sessionToUse) {
      console.error("No active session found");
      toast({
        title: "Error",
        description: "No active chat session. Creating a new one...",
        variant: "destructive"
      });
      await createNewChat();
      return sendMessage(content, attachments);
    }
    
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
    
    setIsLoading(true);
    
    try {
      const currentSessionObj = sessions.find(s => s.id === currentSession);
      if (!currentSessionObj) throw new Error("Session not found");
      
      const allMessages = [...currentSessionObj.messages, userMessage];
      
      const prompt = systemPromptSettings?.prompt || 'You are go:lofty, an AI assistant specialized in consulting. Provide helpful, accurate, and concise advice.';
      const temperature = systemPromptSettings?.temperature || 0.7;
      const maxTokens = systemPromptSettings?.maxTokens || 1024;
      const apiKey = systemPromptSettings?.geminiApiKey || '';
      
      console.log("Using system prompt:", prompt);
      console.log("Using temperature:", temperature);
      console.log("Using max tokens:", maxTokens);
      console.log("Using model:", modelToUse);
      
      let responseText = '';
      
      if (apiKey) {
        const formattedMessages = formatMessagesForGemini(allMessages, prompt);
        responseText = await sendMessageToGemini(
          formattedMessages,
          apiKey,
          modelToUse,
          temperature,
          maxTokens
        );
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        responseText = `This is a simulated response to: "${content}". Please add your Gemini API key in System Configuration to use the real Gemini API.`;
      }
      
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: responseText
      };
      
      setSessions(prev => {
        return prev.map(session => {
          if (session.id === currentSession) {
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
    } catch (error) {
      console.error("Error generating response:", error);
      toast({
        title: "Error",
        description: `Failed to generate response: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive"
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
