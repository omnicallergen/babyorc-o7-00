
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, RotateCw, Cpu, MessageSquare, Sparkles, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SystemConfig: React.FC = () => {
  const { user, updateSystemPrompt, systemPromptSettings } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [systemPrompt, setSystemPrompt] = useState<string>(
    systemPromptSettings?.prompt || 'You are go:lofty, an AI assistant specialized in consulting. Provide helpful, accurate, and concise advice.'
  );
  
  const [temperature, setTemperature] = useState<number>(
    systemPromptSettings?.temperature || 0.7
  );
  
  const [maxTokens, setMaxTokens] = useState<number>(
    systemPromptSettings?.maxTokens || 1024
  );
  
  const [autoSaveEnabled, setAutoSaveEnabled] = useState<boolean>(
    systemPromptSettings?.autoSave || false
  );

  // Auto save when enabled
  useEffect(() => {
    if (autoSaveEnabled) {
      const timer = setTimeout(() => {
        handleSave();
      }, 5000); // Auto save after 5 seconds of inactivity
      
      return () => clearTimeout(timer);
    }
  }, [systemPrompt, temperature, maxTokens, autoSaveEnabled]);

  const handleSave = () => {
    updateSystemPrompt({
      prompt: systemPrompt,
      temperature: temperature,
      maxTokens: maxTokens,
      autoSave: autoSaveEnabled
    });
    
    toast({
      title: "System prompt updated",
      description: "Your AI configuration has been saved successfully"
    });
  };
  
  const handleReset = () => {
    setSystemPrompt('You are go:lofty, an AI assistant specialized in consulting. Provide helpful, accurate, and concise advice.');
    setTemperature(0.7);
    setMaxTokens(1024);
    
    toast({
      title: "System prompt reset",
      description: "System prompt has been reset to default values"
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={16} />
          Back to Chat
        </Button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Cpu size={24} />
          System Configuration
        </h1>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="systemPrompt" className="text-lg">System Prompt</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info size={16} className="text-gray-500 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      The system prompt defines how Gemini will behave. Be specific about the AI's role, tone, and constraints.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Textarea
              id="systemPrompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Enter system prompt instructions for the AI..."
              className="min-h-32 dark:bg-gray-700"
            />
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MessageSquare size={14} />
              Define how the AI assistant should behave and respond
            </p>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="temperature">Temperature</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info size={16} className="text-gray-500 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Controls randomness: Lower values (0.2) for more focused responses, higher values (0.8) for more creative ones.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {temperature.toFixed(1)}
                </span>
              </div>
              <input
                id="temperature"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Focused</span>
                <span>Creative</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="maxTokens">Max Tokens</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info size={16} className="text-gray-500 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Maximum length of the response. Higher values allow for longer responses but may use more resources.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {maxTokens}
                </span>
              </div>
              <input
                id="maxTokens"
                type="range"
                min="256"
                max="4096"
                step="128"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Shorter</span>
                <span>Longer</span>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Sparkles size={16} />
                Auto-Save Changes
              </Label>
              <p className="text-sm text-muted-foreground">
                Automatically save changes as you type
              </p>
            </div>
            <Switch
              checked={autoSaveEnabled}
              onCheckedChange={setAutoSaveEnabled}
            />
          </div>
          
          <div className="flex gap-4 mt-8">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleReset}
            >
              <RotateCw size={16} />
              Reset to Default
            </Button>
            <Button 
              className="flex-1 flex items-center justify-center gap-2"
              onClick={handleSave}
            >
              <Save size={16} />
              Save Configuration
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemConfig;
