
import React from 'react';
import { ChatProvider } from '@/contexts/ChatContext';
import Sidebar from '@/components/Sidebar';
import ChatContainer from '@/components/ChatContainer';

const Index: React.FC = () => {
  return (
    <ChatProvider>
      <div className="flex h-screen bg-white dark:bg-gray-900">
        <Sidebar />
        <ChatContainer />
      </div>
    </ChatProvider>
  );
};

export default Index;
