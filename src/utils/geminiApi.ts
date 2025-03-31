
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

  // Different models have different API endpoints
  let apiEndpoint;
  
  // Standard models use the generativeLanguage API
  if (model.startsWith('gemini-')) {
    const baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    apiEndpoint = `${baseUrl}/models/${model}:generateContent?key=${apiKey}`;
  } else {
    // For future models or custom endpoints
    apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  }

  // Send the request to the Gemini API
  try {
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
