
import React from 'react';
import { Clock, FileText, Plus, User, MoreHorizontal, Sun, Moon, Trash2, Archive, Pin, Settings } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { useUser } from '@/contexts/UserContext';
import Logo from './Logo';
import { Link } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

const Sidebar: React.FC = () => {
  const { sessions, createNewChat, selectSession, deleteSession } = useChat();
  const { user, darkMode, toggleDarkMode } = useUser();
  const { toast } = useToast();

  const handleDeleteAllHistory = () => {
    toast({
      title: "History cleared",
      description: "All chat history has been deleted",
    });
    // This would need to be implemented in ChatContext
    // For now we'll just show a toast
  };

  const handleArchiveHistory = () => {
    toast({
      title: "History archived",
      description: "Your chat history has been archived",
    });
  };

  const handleExportHistory = () => {
    toast({
      title: "Exporting history",
      description: "Your chat history is being exported",
    });
  };

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

        {/* History Preview with dropdown */}
        <div className="flex items-center justify-between p-3 text-black dark:text-white">
          <div className="flex items-center space-x-2">
            <Clock size={16} />
            <span>History Preview</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-lofty-darkInput/50 rounded-md p-1">
                <MoreHorizontal size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleDeleteAllHistory} className="cursor-pointer">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Clear History</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleArchiveHistory} className="cursor-pointer">
                <Archive className="mr-2 h-4 w-4" />
                <span>Archive Chats</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportHistory} className="cursor-pointer">
                <FileText className="mr-2 h-4 w-4" />
                <span>Export History</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Pin className="mr-2 h-4 w-4" />
                <span>Pin Recent Chats</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>History Settings</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto space-y-1">
          {sessions.map((session) => (
            <div key={session.id} className="group relative">
              <button
                onClick={() => selectSession(session.id)}
                className="p-2 hover:bg-lofty-gray/50 dark:hover:bg-lofty-darkInput/50 rounded-md w-full text-left truncate text-black dark:text-white"
              >
                {session.title}
              </button>
              <button 
                onClick={() => deleteSession(session.id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 p-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
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
