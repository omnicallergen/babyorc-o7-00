
import React, { useState } from 'react';
import ModelSelector from './ModelSelector';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import Logo from './Logo';
import { useToast } from '@/hooks/use-toast';

const ChatContainer: React.FC = () => {
  const { toast } = useToast();
  
  const handleToolSelect = (tool: string) => {
    toast({
      title: `Tool selected: ${tool}`,
      description: "This feature is coming soon!",
      duration: 3000,
    });
  };

  return (
    <div className="h-screen flex-1 flex flex-col">
      {/* Header */}
      <div className="border-b border-lofty-border p-4 flex justify-between items-center">
        <ModelSelector />
        <Logo size="small" />
      </div>

      {/* Message list */}
      <MessageList />

      {/* Input section */}
      <div className="border-t border-lofty-border mt-auto">
        <ChatInput onToolSelect={handleToolSelect} />
      </div>
    </div>
  );
};

export default ChatContainer;
