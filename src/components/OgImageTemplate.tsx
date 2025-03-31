
import React from 'react';
import Logo from './Logo';
import { Layers, MessageSquare, User } from 'lucide-react';

const OgImageTemplate: React.FC = () => {
  return (
    <div className="flex h-[630px] w-[1200px] flex-col overflow-hidden bg-white dark:bg-lofty-darkBg">
      {/* Header */}
      <div className="flex h-20 items-center justify-between border-b border-lofty-border px-6 dark:border-lofty-darkBorder">
        <div className="flex items-center gap-4">
          <Logo size="large" showText={true} />
          <h1 className="text-2xl font-bold text-black dark:text-white">
            GenAI for Consulting
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar (simplified) */}
        <div className="w-[250px] border-r border-lofty-border bg-white p-4 dark:border-lofty-darkBorder dark:bg-lofty-darkBg">
          <div className="mb-4 flex items-center gap-2 text-base">
            <Layers size={16} className="text-lofty-darkgray dark:text-white" />
            <span className="text-black dark:text-white">GenAI for Consulting</span>
          </div>
          
          <div className="mb-2 rounded-md bg-lofty-gray p-3 dark:bg-lofty-darkInput">
            <div className="flex items-center gap-2">
              <div className="text-black dark:text-white">
                New Chat
              </div>
            </div>
          </div>
          
          <div className="mt-4 mb-2 flex items-center gap-2">
            <div className="text-sm text-black dark:text-white">
              History Preview
            </div>
          </div>
        </div>
        
        {/* Main Chat Area */}
        <div className="flex-1 bg-background p-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 rounded-lg bg-white p-4 shadow-md dark:bg-lofty-darkInput">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <User size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-gray-800 dark:text-gray-200">
                  How can AI help with consulting projects?
                </div>
              </div>
            </div>
            
            <div className="rounded-lg bg-blue-50 p-4 shadow-md dark:bg-blue-900/20">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                  <MessageSquare size={16} className="text-white" />
                </div>
                <div className="text-gray-800 dark:text-gray-200">
                  AI can assist with data analysis, market research, document creation, and generating insights from large datasets. It can help streamline workflows and provide data-driven recommendations.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer with watermark */}
      <div className="border-t border-lofty-border bg-white p-4 text-center dark:border-lofty-darkBorder dark:bg-lofty-darkBg">
        <p className="text-sm text-gray-500 dark:text-gray-400">GenAI for Consulting - AI-powered consulting assistant</p>
      </div>
    </div>
  );
};

export default OgImageTemplate;
