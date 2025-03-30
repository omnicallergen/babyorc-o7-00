
import React from 'react';
import { Clock, FileText, Plus, User, MoreHorizontal, Sun, Moon } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { useUser } from '@/contexts/UserContext';
import Logo from './Logo';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const { sessions, createNewChat, selectSession } = useChat();
  const { user, darkMode, toggleDarkMode } = useUser();

  return (
    <div className="h-screen w-full max-w-[250px] border-r border-lofty-border dark:border-lofty-darkBorder dark:bg-lofty-darkBg flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center space-x-2 text-black dark:text-white">
        <FileText size={18} />
        <h1 className="font-semibold">GenAI for Consulting</h1>
      </div>

      {/* Divider */}
      <div className="border-b border-lofty-border dark:border-lofty-darkBorder"></div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col space-y-2">
        {/* New Chat Button */}
        <button 
          onClick={createNewChat}
          className="flex items-center space-x-2 p-3 bg-lofty-gray dark:bg-lofty-darkInput hover:bg-lofty-gray/80 dark:hover:bg-lofty-darkInput/80 rounded-md w-full text-left text-black dark:text-white"
        >
          <Plus size={16} />
          <span>New Chat</span>
        </button>

        {/* History Preview */}
        <div className="flex items-center justify-between p-3 text-black dark:text-white">
          <div className="flex items-center space-x-2">
            <Clock size={16} />
            <span>History Preview</span>
          </div>
          <button className="text-gray-500 dark:text-gray-400">
            <MoreHorizontal size={16} />
          </button>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto space-y-1">
          {sessions.map((session) => (
            <button
              key={session.id}
              onClick={() => selectSession(session.id)}
              className="p-2 hover:bg-lofty-gray/50 dark:hover:bg-lofty-darkInput/50 rounded-md w-full text-left truncate text-black dark:text-white"
            >
              {session.title}
            </button>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-lofty-border dark:border-lofty-darkBorder"></div>

      {/* User section */}
      <div className="p-4 flex items-center justify-between">
        <Link to="/settings" className="flex items-center space-x-2 group">
          <div className="bg-lofty-gray dark:bg-lofty-darkInput rounded-full p-2">
            <User size={16} className="text-lofty-darkgray dark:text-white" />
          </div>
          <div>
            <div className="text-black dark:text-white">{user.name}</div>
            <div className="text-xs text-lofty-darkgray dark:text-gray-400 group-hover:underline">Profile Settings</div>
          </div>
        </Link>
        <button onClick={toggleDarkMode} className="p-1 text-black dark:text-white">
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
