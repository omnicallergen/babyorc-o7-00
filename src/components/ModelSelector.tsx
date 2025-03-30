
import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';

const ModelSelector: React.FC = () => {
  const { selectedModel, setSelectedModel } = useChat();
  const [isOpen, setIsOpen] = useState(false);

  const models = [
    { id: 'baby-orchestrator', name: 'baby-orchestrator', disabled: false },
    { id: 'baby-validator', name: 'baby-validator', disabled: true }
  ];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectModel = (modelId: string) => {
    if (modelId !== 'baby-validator') {
      setSelectedModel(modelId);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        className="inline-flex items-center justify-between gap-2 px-4 py-2 border border-lofty-border rounded-full focus:outline-none min-w-[200px]"
        onClick={toggleDropdown}
      >
        <span>{selectedModel}</span>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-lofty-border rounded-md shadow-lg z-10">
          <ul className="py-1">
            {models.map((model) => (
              <li key={model.id}>
                <button
                  className={`flex w-full items-center justify-between px-4 py-2 text-left
                    ${model.disabled ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-lofty-gray/50'}
                  `}
                  onClick={() => !model.disabled && selectModel(model.id)}
                  disabled={model.disabled}
                >
                  <span>{model.name}</span>
                  {selectedModel === model.id && <Check size={16} />}
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
