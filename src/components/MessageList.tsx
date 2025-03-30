
import React from 'react';
import { useChat } from '@/contexts/ChatContext';
import Logo from './Logo';

const MessageList: React.FC = () => {
  const { messages, isLoading } = useChat();

  // If no messages, show welcome screen
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Logo size="medium" />
          <h1 className="text-3xl font-bold">go:lofty</h1>
          <p className="text-xl">How can I help you today?</p>
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
                : 'bg-lofty-gray text-black'
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[80%] p-3 rounded-lg bg-lofty-gray">
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
