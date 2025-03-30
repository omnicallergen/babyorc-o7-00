
import React, { useState } from 'react';
import ModelSelector from './ModelSelector';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import Logo from './Logo';
import { useToast } from '@/hooks/use-toast';
import DocumentVerifier from './DocumentVerifier';

const ChatContainer: React.FC = () => {
  const { toast } = useToast();
  const [isDocumentVerifierOpen, setIsDocumentVerifierOpen] = useState(false);
  
  const handleToolSelect = (tool: string) => {
    if (tool === 'verify document') {
      setIsDocumentVerifierOpen(true);
    } else {
      toast({
        title: `Tool selected: ${tool}`,
        description: "This feature is coming soon!",
        duration: 3000,
      });
    }
  };

  return (
    <div className="h-screen flex-1 flex flex-col bg-white dark:bg-lofty-darkBg dark:text-white">
      {/* Header */}
      <div className="border-b border-lofty-border dark:border-lofty-darkBorder p-4 flex justify-between items-center">
        <ModelSelector />
        <Logo size="small" />
      </div>

      {/* Message list */}
      <MessageList />

      {/* Input section */}
      <div className="border-t border-lofty-border dark:border-lofty-darkBorder mt-auto">
        <ChatInput onToolSelect={handleToolSelect} />
      </div>

      {/* Document Verifier Tool */}
      <DocumentVerifier 
        isOpen={isDocumentVerifierOpen} 
        onClose={() => setIsDocumentVerifierOpen(false)} 
      />
    </div>
  );
};

export default ChatContainer;
