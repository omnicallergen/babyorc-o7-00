import { Message } from '@/contexts/ChatContext';

// Models available in Gemini API
export interface ModelOption {
  id: string;
  name: string;
  description?: string;
  disabled?: boolean;
  capabilities?: string[];
  contextWindow?: number;
  bestFor?: string[];
}

export const getAvailableGeminiModels = (): ModelOption[] => {
  return [
    { 
      id: 'gemini-2.0-flash', 
      name: 'Gemini Flash', 
      description: 'Fast responses for everyday tasks',
      capabilities: ['Text generation', 'Instruction following'],
      contextWindow: 16384,
      bestFor: ['Quick questions', 'Simple tasks', 'Everyday help']
    },
    { 
      id: 'gemini-2.0-flash-thinking', 
      name: 'Gemini Flash Thinking', 
      description: 'Fast with improved reasoning',
      capabilities: ['Text generation', 'Instruction following', 'Basic reasoning'],
      contextWindow: 32768,
      bestFor: ['Problem-solving', 'Step-by-step thinking', 'Detailed explanations']
    },
    { 
      id: 'gemini-deep-research', 
      name: 'Gemini Deep Research', 
      description: 'In-depth analysis and research',
      capabilities: ['Text generation', 'Document analysis', 'Research synthesis'],
      contextWindow: 65536,
      bestFor: ['Comprehensive research', 'Document analysis', 'Literature review']
    },
    { 
      id: 'gemini-2.5-pro', 
      name: 'Gemini Pro', 
      description: 'Most capable model for complex tasks',
      capabilities: ['Text generation', 'Advanced reasoning', 'Complex problem solving', 'Creative writing'],
      contextWindow: 131072,
      bestFor: ['Complex reasoning', 'Creative work', 'Long-form content', 'Consulting tasks']
    },
    { 
      id: 'gemini-personalization', 
      name: 'Gemini Personalization', 
      description: 'Personalized responses based on history',
      capabilities: ['Text generation', 'Personalization', 'Context awareness'],
      contextWindow: 32768,
      bestFor: ['Personalized advice', 'Context-aware responses', 'Tailored consulting']
    }
  ];
};

// Format messages for Gemini API
export const formatMessagesForGemini = (
  messages: Message[],
  systemPrompt: string
): any[] => {
  const formattedMessages = [];
  
  // Add system prompt as the first message
  formattedMessages.push({
    role: 'system',
    parts: [{ text: systemPrompt }]
  });
  
  // Format user and assistant messages
  messages.forEach(message => {
    const role = message.role === 'user' ? 'user' : 'model';
    formattedMessages.push({
      role: role,
      parts: [{ text: message.content }]
    });
  });
  
  return formattedMessages;
};

// Send message to Gemini API
export const sendMessageToGemini = async (
  messages: any[],
  apiKey: string,
  modelName: string = 'gemini-2.0-flash',
  temperature: number = 0.7,
  maxTokens: number = 1024
): Promise<string> => {
  try {
    if (!apiKey) {
      throw new Error("API key is required");
    }
    
    console.log(`Sending request to Gemini API with model: ${modelName}`);
    
    const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/" + 
      `${modelName}:generateContent?key=${apiKey}`;
    
    const requestBody = {
      contents: messages,
      generationConfig: {
        temperature: temperature,
        maxOutputTokens: maxTokens,
        topP: 0.9,
        topK: 40,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);
      throw new Error(`API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No response generated");
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};

// Test API key validity
export const testGeminiApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    return Array.isArray(data.models) && data.models.length > 0;
  } catch (error) {
    console.error("Error testing Gemini API key:", error);
    return false;
  }
};

// Get model details by ID
export const getModelDetails = (modelId: string): ModelOption | null => {
  const models = getAvailableGeminiModels();
  return models.find(model => model.id === modelId) || null;
};
