
import React from 'react';
import { useChat } from '@/contexts/ChatContext';
import Logo from './Logo';
import { FileIcon } from 'lucide-react';

const MessageList: React.FC = () => {
  const { messages, isLoading } = useChat();

  // Function to render file attachments
  const renderAttachments = (attachments: any[]) => {
    if (!attachments || attachments.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {attachments.map((file, index) => (
          <div 
            key={index}
            className="bg-gray-100 dark:bg-lofty-darkInput/70 text-black dark:text-white rounded-md px-3 py-1.5 flex items-center gap-2 text-sm"
          >
            <FileIcon size={14} />
            <span className="truncate max-w-[120px]">{file.name || 'File'}</span>
          </div>
        ))}
      </div>
    );
  };

  // If no messages, show welcome screen
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <Logo size="large" className="animate-pulse duration-3000" />
          <h1 className="text-3xl font-bold dark:text-white">go:lofty</h1>
          <p className="text-xl dark:text-gray-300">How can I help you today?</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 max-w-2xl px-4">
            <div className="p-4 bg-lofty-gray/60 dark:bg-lofty-darkInput rounded-lg hover:bg-lofty-gray dark:hover:bg-lofty-darkInput/80 transition-all cursor-pointer">
              <h3 className="text-lg font-medium mb-1">Analyze a Document</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Verify alignment with business strategy</p>
            </div>
            <div className="p-4 bg-lofty-gray/60 dark:bg-lofty-darkInput rounded-lg hover:bg-lofty-gray dark:hover:bg-lofty-darkInput/80 transition-all cursor-pointer">
              <h3 className="text-lg font-medium mb-1">Create a Presentation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Build professional slide decks</p>
            </div>
            <div className="p-4 bg-lofty-gray/60 dark:bg-lofty-darkInput rounded-lg hover:bg-lofty-gray dark:hover:bg-lofty-darkInput/80 transition-all cursor-pointer">
              <h3 className="text-lg font-medium mb-1">Market Analysis</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Get insights on market trends</p>
            </div>
            <div className="p-4 bg-lofty-gray/60 dark:bg-lofty-darkInput rounded-lg hover:bg-lofty-gray dark:hover:bg-lofty-darkInput/80 transition-all cursor-pointer">
              <h3 className="text-lg font-medium mb-1">Strategic Planning</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Develop business strategies</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`max-w-[80%] p-3 rounded-lg ${
              message.role === 'user' 
                ? 'bg-lofty-blue text-white' 
                : 'bg-lofty-gray dark:bg-lofty-darkInput text-black dark:text-white'
            }`}
          >
            {message.content}
            {message.attachments && renderAttachments(message.attachments)}
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[80%] p-3 rounded-lg bg-lofty-gray dark:bg-lofty-darkInput">
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"></div>
              <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
