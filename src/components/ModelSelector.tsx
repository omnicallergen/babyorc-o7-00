
import React, { useState, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { useUser } from '@/contexts/UserContext';
import { getAvailableGeminiModels } from '@/utils/geminiApi';

const ModelSelector: React.FC = () => {
  const { selectedModel, setSelectedModel } = useChat();
  const { systemPromptSettings } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  
  // Default models (UI-only versions)
  const defaultModels = [
    { id: 'baby-orchestrator', name: 'baby-orchestrator', disabled: false },
    { id: 'baby-validator', name: 'baby-validator', disabled: true },
  ];
  
  // Combine with Gemini models
  const geminiModels = getAvailableGeminiModels();
  
  // Check if API key is available to enable Gemini models
  const apiKeyAvailable = !!systemPromptSettings?.geminiApiKey;
  
  // Combine models, making Gemini models disabled if no API key is available
  const models = [
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
  const getDisabledMessage = (model: any) => {
    return model.disabled && !apiKeyAvailable 
      ? "Add Gemini API key in System Configuration to use this model" 
      : "";
  };

  return (
    <div className="relative">
      <button
        className="inline-flex items-center justify-between gap-2 px-4 py-2 border border-lofty-border dark:border-lofty-darkBorder rounded-full focus:outline-none min-w-[200px] dark:bg-lofty-darkInput dark:text-white"
        onClick={toggleDropdown}
      >
        <span>{selectedModel}</span>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-lofty-darkBg border border-lofty-border dark:border-lofty-darkBorder rounded-md shadow-lg z-10">
          <ul className="py-1">
            {models.map((model) => (
              <li key={model.id}>
                <button
                  className={`flex flex-col w-full items-start px-4 py-2 text-left
                    ${model.disabled 
                      ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                      : 'hover:bg-lofty-gray/50 dark:hover:bg-lofty-darkInput/70 dark:text-white'
                    }
                  `}
                  onClick={() => selectModel(model.id)}
                  disabled={model.disabled}
                  title={getDisabledMessage(model)}
                >
                  <span className="flex items-center justify-between w-full">
                    <span>{model.name}</span>
                    {selectedModel === model.id && <Check size={16} />}
                  </span>
                  {model.description && (
                    <span className="text-xs text-muted-foreground">{model.description}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
