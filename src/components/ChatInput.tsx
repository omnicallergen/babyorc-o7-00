
import React, { useState, useRef } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { Paperclip, Send, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChatInputProps {
  onToolSelect: (tool: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onToolSelect }) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sendMessage, isLoading } = useChat();
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if ((message.trim() || attachments.length > 0) && !isLoading) {
      try {
        await sendMessage(message, attachments);
        setMessage('');
        setAttachments([]);
      } catch (error) {
        toast({
          title: "Failed to send message",
          description: "There was a problem sending your message",
          variant: "destructive",
        });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      if (attachments.length + newFiles.length > 5) {
        toast({
          title: "Too many files",
          description: "You can only attach up to 5 files",
          variant: "destructive",
        });
        return;
      }
      setAttachments(prev => [...prev, ...newFiles]);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const tools = [
    'verify document',
    'build a presentation',
    'build a website'
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div 
              key={index}
              className="bg-gray-100 dark:bg-lofty-darkInput text-black dark:text-white rounded-full px-3 py-1 flex items-center gap-1 text-sm"
            >
              <span className="truncate max-w-[120px]">{file.name}</span>
              <button 
                onClick={() => removeAttachment(index)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Input field */}
      <div className="flex items-center bg-white dark:bg-lofty-darkInput border border-lofty-border dark:border-lofty-darkBorder rounded-full px-4 py-2">
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />
        <button 
          className="text-lofty-darkgray dark:text-gray-400 hover:text-lofty-blue dark:hover:text-lofty-blue p-1 mr-2"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip size={20} />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="message lofty..."
          className="flex-1 outline-none bg-transparent dark:text-white dark:placeholder-gray-400"
          disabled={isLoading}
        />
        <button 
          className={`p-1 text-lofty-blue ${(!message.trim() && attachments.length === 0 || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleSendMessage}
          disabled={(!message.trim() && attachments.length === 0) || isLoading}
        >
          <Send size={20} />
        </button>
      </div>

      {/* Tool buttons */}
      <div className="flex gap-2">
        {tools.map((tool) => (
          <button
            key={tool}
            onClick={() => onToolSelect(tool)}
            className="flex-1 bg-lofty-gray dark:bg-lofty-darkInput hover:bg-lofty-gray/80 dark:hover:bg-lofty-darkInput/80 py-2 px-4 rounded-md text-sm text-black dark:text-white"
          >
            {tool}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatInput;
