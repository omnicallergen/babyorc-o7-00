
import React from 'react';
import { ChatProvider } from '@/contexts/ChatContext';
import { UserProvider } from '@/contexts/UserContext';
import Sidebar from '@/components/Sidebar';
import ChatContainer from '@/components/ChatContainer';

const Index: React.FC = () => {
  return (
    <UserProvider>
      <ChatProvider>
        <div className="flex h-screen bg-white">
          <Sidebar />
          <ChatContainer />
        </div>
      </ChatProvider>
    </UserProvider>
  );
};

export default Index;
