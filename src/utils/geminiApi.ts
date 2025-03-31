
/**
 * Gemini API Utility
 * 
 * This file contains utilities for communicating with the Google Gemini API
 */

// Types for the Gemini API requests and responses
export interface GeminiMessage {
  role: 'user' | 'model' | 'system';
  parts: {
    text?: string;
    fileData?: {
      mimeType: string;
      fileUri?: string;
      data?: string; // Base64 encoded data
    };
  }[];
}

export interface GeminiChatRequest {
  contents: GeminiMessage[];
  safetySettings?: any[];
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
    topP?: number;
    topK?: number;
  };
}

export interface GeminiChatResponse {
  candidates: {
    content: {
      role: string;
      parts: {
        text?: string;
      }[];
    };
    finishReason: string;
    safetyRatings: any[];
  }[];
  promptFeedback: any;
}

// Interface for the model options
export interface ModelOption {
  id: string;
  name: string;
  disabled?: boolean;
  description?: string;
}

/**
 * Send a message to the Gemini API
 */
export const sendMessageToGemini = async (
  messages: GeminiMessage[],
  apiKey: string,
  model: string,
  temperature: number = 0.7,
  maxTokens: number = 1024
): Promise<string> => {
  // Ensure we have an API key
  if (!apiKey) {
    throw new Error("Gemini API key is required");
  }

  // Format the request
  const request: GeminiChatRequest = {
    contents: messages,
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens
    }
  };

  // Map the UI model names to actual API model identifiers
  const modelMapping: Record<string, { apiModel: string, apiVersion: string }> = {
    'gemini-2.0-flash': { apiModel: 'gemini-1.0-pro', apiVersion: 'v1' },
    'gemini-2.0-flash-thinking': { apiModel: 'gemini-1.0-pro', apiVersion: 'v1' },
    'gemini-deep-research': { apiModel: 'gemini-1.0-pro', apiVersion: 'v1' },
    'gemini-personalization': { apiModel: 'gemini-1.0-pro', apiVersion: 'v1' },
    'gemini-2.5-pro': { apiModel: 'gemini-1.5-pro', apiVersion: 'v1' },
    // Fallback to gemini-1.0-pro for UI-only models
    'baby-orchestrator': { apiModel: 'gemini-1.0-pro', apiVersion: 'v1' },
    'baby-validator': { apiModel: 'gemini-1.0-pro', apiVersion: 'v1' }
  };
  
  // Get the actual API model name and version
  const { apiModel, apiVersion } = modelMapping[model] || { apiModel: 'gemini-1.0-pro', apiVersion: 'v1' };
  console.log(`Using Gemini model: ${apiModel} (selected: ${model}) with API version: ${apiVersion}`);
  
  // Build the correct API endpoint
  const apiEndpoint = `https://generativelanguage.googleapis.com/${apiVersion}/models/${apiModel}:generateContent?key=${apiKey}`;

  try {
    console.log(`Sending request to Gemini API endpoint: ${apiEndpoint}`);
    
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as GeminiChatResponse;
    
    // Extract the text from the response
    if (data.candidates && data.candidates.length > 0) {
      const content = data.candidates[0].content;
      if (content.parts && content.parts.length > 0 && content.parts[0].text) {
        return content.parts[0].text;
      }
    }
    
    throw new Error('No text response from Gemini API');
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

/**
 * Convert our internal message format to Gemini's format
 */
export const formatMessagesForGemini = (
  messages: Array<{ role: 'user' | 'assistant', content: string }>,
  systemPrompt?: string
): GeminiMessage[] => {
  const geminiMessages: GeminiMessage[] = [];
  
  // Add system prompt if provided
  if (systemPrompt) {
    geminiMessages.push({
      role: 'system',
      parts: [{ text: systemPrompt }]
    });
  }
  
  // Convert each message to Gemini format
  messages.forEach(message => {
    geminiMessages.push({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }]
    });
  });
  
  return geminiMessages;
};

/**
 * Get available Gemini models for the dropdown
 */
export const getAvailableGeminiModels = (): ModelOption[] => {
  return [
    { id: 'gemini-2.0-flash', name: 'Gemini Flash', description: 'Get everyday help', disabled: false },
    { id: 'gemini-2.0-flash-thinking', name: 'Gemini Flash Thinking (experimental)', description: 'Uses advanced reasoning', disabled: false },
    { id: 'gemini-deep-research', name: 'Deep Research', description: 'Get in-depth research reports', disabled: false },
    { id: 'gemini-personalization', name: 'Personalization (experimental)', description: 'Help based on your Search history', disabled: false },
    { id: 'gemini-2.5-pro', name: 'Gemini Pro (experimental)', description: 'Best for complex tasks', disabled: false }
  ];
};
