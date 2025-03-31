
import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { testGeminiApiKey } from '@/utils/geminiApi';
import { Key, Loader2, Check, X, AlertTriangle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ApiKeyFormProps {
  onKeyValidated?: (isValid: boolean) => void;
}

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onKeyValidated }) => {
  const { systemPromptSettings, updateSystemPrompt } = useUser();
  const { toast } = useToast();
  
  const [apiKey, setApiKey] = useState<string>(
    systemPromptSettings?.geminiApiKey || ''
  );
  
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isKeyValid, setIsKeyValid] = useState<boolean | null>(null);
  const [validationMessage, setValidationMessage] = useState<string>('');
  
  // Validate API key
  const validateApiKey = async () => {
    if (!apiKey.trim()) {
      setIsKeyValid(null);
      setValidationMessage('');
      return;
    }
    
    setIsValidating(true);
    
    try {
      const isValid = await testGeminiApiKey(apiKey.trim());
      setIsKeyValid(isValid);
      setValidationMessage(isValid 
        ? 'API key is valid! You can now use Gemini models.' 
        : 'Invalid API key. Please check and try again.');
        
      if (onKeyValidated) onKeyValidated(isValid);
    } catch (error) {
      setIsKeyValid(false);
      setValidationMessage('Error validating API key. Please check your internet connection.');
      if (onKeyValidated) onKeyValidated(false);
    } finally {
      setIsValidating(false);
    }
  };
  
  // Save the API key
  const saveApiKey = () => {
    if (systemPromptSettings) {
      updateSystemPrompt({
        ...systemPromptSettings,
        geminiApiKey: apiKey
      });
      
      toast({
        title: "API key saved",
        description: "Your Gemini API key has been saved"
      });
    }
  };
  
  // Validate key when it changes
  useEffect(() => {
    // Debounce validation to avoid too many API calls
    const handler = setTimeout(() => {
      if (apiKey && apiKey !== systemPromptSettings?.geminiApiKey) {
        validateApiKey();
      }
    }, 1000);
    
    return () => clearTimeout(handler);
  }, [apiKey]);
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="geminiApiKey" className="text-base">Gemini API Key</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertTriangle size={16} className="text-amber-500 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Your API key is stored locally in your browser. It's never sent to our servers.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="relative">
          <Input
            id="geminiApiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API key"
            className="pr-10 dark:bg-gray-600"
          />
          <Key size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        
        {isValidating && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 size={14} className="animate-spin" />
            Validating API key...
          </div>
        )}
        
        {!isValidating && isKeyValid !== null && (
          <div className={`flex items-center gap-2 text-sm ${isKeyValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {isKeyValid ? (
              <>
                <Check size={14} />
                {validationMessage}
              </>
            ) : (
              <>
                <X size={14} />
                {validationMessage}
              </>
            )}
          </div>
        )}
        
        <div className="flex justify-end gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={validateApiKey}
            disabled={!apiKey || isValidating}
          >
            {isValidating ? (
              <>
                <Loader2 size={14} className="mr-2 animate-spin" />
                Validating
              </>
            ) : (
              'Validate Key'
            )}
          </Button>
          <Button 
            onClick={saveApiKey}
            disabled={!apiKey || (isKeyValid === false)}
          >
            Save Key
          </Button>
        </div>
      </div>
      
      <Alert variant="default" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <AlertDescription className="text-sm">
          Get your API key from <a 
            href="https://ai.google.dev/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 underline"
          >
            Google AI Studio
          </a>.
          The API key is stored locally in your browser.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ApiKeyForm;
