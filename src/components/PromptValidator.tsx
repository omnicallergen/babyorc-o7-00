
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, AlertTriangle, X } from 'lucide-react';

interface PromptValidatorProps {
  prompt: string;
  onValidationResult?: (isValid: boolean, message: string) => void;
}

interface ValidationResult {
  isValid: boolean;
  message: string;
  warnings: string[];
}

const PromptValidator: React.FC<PromptValidatorProps> = ({ 
  prompt, 
  onValidationResult 
}) => {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Perform validation whenever the prompt changes
  useEffect(() => {
    if (!prompt) {
      setValidationResult(null);
      if (onValidationResult) onValidationResult(false, "");
      return;
    }
    
    setIsValidating(true);
    
    // Add a small delay to avoid constant validation while typing
    const timeoutId = setTimeout(() => {
      validatePrompt(prompt).then(result => {
        setValidationResult(result);
        setIsValidating(false);
        if (onValidationResult) onValidationResult(result.isValid, result.message);
      });
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [prompt]);

  // Validate the prompt for common issues
  const validatePrompt = async (text: string): Promise<ValidationResult> => {
    const result: ValidationResult = { 
      isValid: true, 
      message: "Prompt looks good!",
      warnings: []
    };
    
    // Check minimum length
    if (text.length < 20) {
      result.isValid = false;
      result.message = "System prompt is too short";
      return result;
    }
    
    // Check for specific keywords that indicate good prompt design
    const containsRoleDefinition = /you are|act as|behave as|function as|serve as/i.test(text);
    if (!containsRoleDefinition) {
      result.warnings.push("Consider defining a clear role (e.g., 'You are...')");
    }
    
    // Check for overly complex prompts that might lead to confusion
    if (text.length > 1000) {
      result.warnings.push("Prompt is very long. Consider simplifying for better results.");
    }
    
    // Check for ambiguous instructions
    const ambiguousTerms = ["maybe", "possibly", "perhaps", "sometimes"];
    for (const term of ambiguousTerms) {
      if (text.toLowerCase().includes(term)) {
        result.warnings.push(`Contains ambiguous term: "${term}". Consider using more definitive language.`);
      }
    }
    
    // If there are warnings but it's still valid, customize the message
    if (result.warnings.length > 0 && result.isValid) {
      result.message = "Prompt is valid, but could be improved";
    }
    
    return result;
  };

  if (!prompt || !validationResult) {
    return null;
  }

  return (
    <div className="mt-2">
      {isValidating ? (
        <div className="text-sm text-muted-foreground animate-pulse">
          Analyzing prompt...
        </div>
      ) : (
        <>
          <div className={`flex items-center gap-2 text-sm ${
            validationResult.isValid 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            {validationResult.isValid ? (
              <Check size={16} />
            ) : (
              <X size={16} />
            )}
            {validationResult.message}
          </div>
          
          {validationResult.warnings.length > 0 && (
            <Alert className="mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-sm">
                <strong>Suggestions:</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  {validationResult.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
};

export default PromptValidator;
