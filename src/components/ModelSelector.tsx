
import React, { useState, useEffect } from 'react';
import { ChevronDown, Check, Sparkles, Info, Bot } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { useUser } from '@/contexts/UserContext';
import { getAvailableGeminiModels, ModelOption } from '@/utils/geminiApi';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ModelSelector: React.FC = () => {
  const { selectedModel, setSelectedModel } = useChat();
  const { systemPromptSettings } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  
  // Default models (UI-only versions) with optional description field
  const defaultModels: ModelOption[] = [
    { 
      id: 'baby-orchestrator', 
      name: 'baby-orchestrator', 
      disabled: false, 
      description: 'Default assistant model' 
    },
    { 
      id: 'baby-validator', 
      name: 'baby-validator', 
      disabled: true, 
      description: 'Validation model (coming soon)' 
    },
  ];
  
  // Combine with Gemini models
  const geminiModels = getAvailableGeminiModels();
  
  // Check if API key is available to enable Gemini models
  const apiKeyAvailable = !!systemPromptSettings?.geminiApiKey;
  
  // Combine models, making Gemini models disabled if no API key is available
  const models: ModelOption[] = [
    ...defaultModels,
    ...geminiModels.map(model => ({
      ...model, 
      disabled: !apiKeyAvailable
    }))
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectModel = (modelId: string) => {
    if (!models.find(model => model.id === modelId)?.disabled) {
      setSelectedModel(modelId);
    }
    setIsOpen(false);
  };
  
  // Show a tooltip hint if hovering over a disabled model
  const getDisabledMessage = (model: ModelOption) => {
    return model.disabled && !apiKeyAvailable 
      ? "Add Gemini API key in System Configuration to use this model" 
      : "";
  };
  
  // Get the current model's info
  const currentModel = models.find(m => m.id === selectedModel) || models[0];

  return (
    <div className="relative">
      <button
        className="inline-flex items-center justify-between gap-2 px-4 py-2 border border-lofty-border dark:border-lofty-darkBorder rounded-full focus:outline-none min-w-[220px] dark:bg-lofty-darkInput dark:text-white hover:bg-lofty-gray/50 dark:hover:bg-lofty-darkInput/80 transition-colors"
        onClick={toggleDropdown}
      >
        <span className="flex items-center gap-2">
          {currentModel.id.includes('gemini') ? (
            <Sparkles size={16} className="text-lofty-blue" />
          ) : (
            <Bot size={16} className="text-blue-500" />
          )}
          <span>{currentModel.name}</span>
        </span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-[280px] bg-white dark:bg-lofty-darkBg border border-lofty-border dark:border-lofty-darkBorder rounded-md shadow-lg z-10">
          <div className="py-1">
            {defaultModels.length > 0 && (
              <>
                <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Local Models
                </div>
                <ul className="mb-2">
                  {defaultModels.map((model) => (
                    <li key={model.id}>
                      <button
                        className={`flex flex-col w-full items-start px-4 py-2 text-left
                          ${model.disabled 
                            ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                            : 'hover:bg-lofty-gray/50 dark:hover:bg-lofty-darkInput/70 dark:text-white'
                          }
                          ${selectedModel === model.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                        `}
                        onClick={() => selectModel(model.id)}
                        disabled={model.disabled}
                        title={getDisabledMessage(model)}
                      >
                        <span className="flex items-center justify-between w-full">
                          <span className="flex items-center gap-1.5">
                            <Bot size={14} className={model.disabled ? 'text-gray-400' : 'text-blue-500'} />
                            {model.name}
                          </span>
                          {selectedModel === model.id && <Check size={16} className="text-blue-500" />}
                        </span>
                        {model.description && (
                          <span className="text-xs text-muted-foreground">{model.description}</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
            
            <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase flex items-center justify-between">
              <span>Gemini Models</span>
              {!apiKeyAvailable && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={14} className="text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-[200px] text-xs">
                        Add your Gemini API key in System Configuration to enable these models.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            
            <ul className="py-1">
              {geminiModels.map((model) => (
                <li key={model.id}>
                  <button
                    className={`flex flex-col w-full items-start px-4 py-2 text-left
                      ${model.disabled 
                        ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                        : 'hover:bg-lofty-gray/50 dark:hover:bg-lofty-darkInput/70 dark:text-white'
                      }
                      ${selectedModel === model.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                    `}
                    onClick={() => selectModel(model.id)}
                    disabled={model.disabled}
                    title={getDisabledMessage(model)}
                  >
                    <span className="flex items-center justify-between w-full">
                      <span className="flex items-center gap-1.5">
                        <Sparkles size={14} className={model.disabled ? 'text-gray-400' : 'text-blue-500'} />
                        {model.name}
                      </span>
                      {selectedModel === model.id && <Check size={16} className="text-blue-500" />}
                    </span>
                    {model.description && (
                      <span className="text-xs text-muted-foreground">{model.description}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
