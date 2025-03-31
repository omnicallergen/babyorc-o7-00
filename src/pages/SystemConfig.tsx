
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  Save, 
  RotateCw, 
  Cpu, 
  MessageSquare, 
  Sparkles, 
  Info, 
  Key, 
  Bot,
  Check,
  X,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAvailableGeminiModels, ModelOption, testGeminiApiKey, getModelDetails } from '@/utils/geminiApi';
import ModelInfoCard from '@/components/ModelInfoCard';

const SystemConfig: React.FC = () => {
  const { user, updateSystemPrompt, systemPromptSettings } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for form values
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

  const [geminiApiKey, setGeminiApiKey] = useState<string>(
    systemPromptSettings?.geminiApiKey || ''
  );

  const [selectedGeminiModel, setSelectedGeminiModel] = useState<string>(
    systemPromptSettings?.selectedGeminiModel || 'gemini-2.0-flash'
  );
  
  // State for key validation
  const [isValidatingKey, setIsValidatingKey] = useState<boolean>(false);
  const [isKeyValid, setIsKeyValid] = useState<boolean | null>(null);
  const [validationMessage, setValidationMessage] = useState<string>('');
  
  // UI state
  const [activeTab, setActiveTab] = useState<string>("general");
  const [modelDetails, setModelDetails] = useState<ModelOption | null>(null);
  
  // Get available models
  const geminiModels = getAvailableGeminiModels();
  
  // Update model details when selected model changes
  useEffect(() => {
    const details = getModelDetails(selectedGeminiModel);
    setModelDetails(details);
  }, [selectedGeminiModel]);
  
  // Auto-save functionality
  useEffect(() => {
    if (autoSaveEnabled) {
      const timer = setTimeout(() => {
        handleSave();
      }, 5000); // Auto save after 5 seconds of inactivity
      
      return () => clearTimeout(timer);
    }
  }, [systemPrompt, temperature, maxTokens, autoSaveEnabled, geminiApiKey, selectedGeminiModel]);

  // Validate API key
  const validateApiKey = async () => {
    if (!geminiApiKey.trim()) {
      setIsKeyValid(null);
      setValidationMessage('');
      return;
    }
    
    setIsValidatingKey(true);
    
    try {
      const isValid = await testGeminiApiKey(geminiApiKey.trim());
      setIsKeyValid(isValid);
      setValidationMessage(isValid 
        ? 'API key is valid! You can now use Gemini models.' 
        : 'Invalid API key. Please check and try again.');
    } catch (error) {
      setIsKeyValid(false);
      setValidationMessage('Error validating API key. Please check your internet connection.');
    } finally {
      setIsValidatingKey(false);
    }
  };
  
  // Validate key when it changes
  useEffect(() => {
    // Debounce validation to avoid too many API calls
    const handler = setTimeout(() => {
      if (geminiApiKey && geminiApiKey !== systemPromptSettings?.geminiApiKey) {
        validateApiKey();
      }
    }, 1000);
    
    return () => clearTimeout(handler);
  }, [geminiApiKey]);

  const handleSave = () => {
    updateSystemPrompt({
      prompt: systemPrompt,
      temperature: temperature,
      maxTokens: maxTokens,
      autoSave: autoSaveEnabled,
      geminiApiKey: geminiApiKey,
      selectedGeminiModel: selectedGeminiModel
    });
    
    toast({
      title: "System configuration updated",
      description: "Your AI configuration has been saved successfully"
    });
  };
  
  const handleReset = () => {
    setSystemPrompt('You are go:lofty, an AI assistant specialized in consulting. Provide helpful, accurate, and concise advice.');
    setTemperature(0.7);
    setMaxTokens(1024);
    setGeminiApiKey('');
    setSelectedGeminiModel('gemini-2.0-flash');
    setAutoSaveEnabled(false);
    
    toast({
      title: "System configuration reset",
      description: "System settings have been reset to default values"
    });
  };
  
  const getSystemPromptExample = (type: string) => {
    switch(type) {
      case "consulting":
        return "You are an AI consultant specializing in business strategy. Provide actionable advice based on data. Focus on practical solutions that can be implemented quickly. Always consider both short-term wins and long-term goals.";
      case "research":
        return "You are a research assistant with expertise in data analysis. When providing information, cite sources where possible and indicate confidence levels. Prioritize accuracy over speculation.";
      case "creative":
        return "You are a creative consultant with expertise in marketing and branding. Generate innovative ideas and think outside the box. Your responses should inspire creativity while remaining practical and implementation-focused.";
      default:
        return "You are go:lofty, an AI assistant specialized in consulting. Provide helpful, accurate, and concise advice.";
    }
  };

  const applyPromptExample = (type: string) => {
    const example = getSystemPromptExample(type);
    setSystemPrompt(example);
    
    toast({
      title: "Example prompt applied",
      description: `Applied the ${type} example prompt. Feel free to customize it further.`
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="mb-6">
            <TabsTrigger value="general" className="flex items-center gap-1">
              <Bot size={16} />
              General Settings
            </TabsTrigger>
            <TabsTrigger value="gemini" className="flex items-center gap-1">
              <Sparkles size={16} />
              Gemini Integration
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-1">
              <Cpu size={16} />
              Advanced Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare size={18} />
                System Prompt Configuration
              </h2>
              
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
                          The system prompt defines how the AI will behave. Be specific about the AI's role, tone, and constraints.
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
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MessageSquare size={14} />
                    Define how the AI assistant should behave and respond
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {systemPrompt.length} characters
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-base">Prompt Examples</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => applyPromptExample("consulting")}
                    className="justify-start"
                  >
                    Business Consulting
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => applyPromptExample("research")}
                    className="justify-start"
                  >
                    Research Assistant
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => applyPromptExample("creative")}
                    className="justify-start"
                  >
                    Creative Consultant
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => applyPromptExample("default")}
                    className="justify-start"
                  >
                    Default Assistant
                  </Button>
                </div>
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
                    <span>Focused (0.1)</span>
                    <span>Balanced (0.5)</span>
                    <span>Creative (1.0)</span>
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
                              Maximum length of the response. Higher values allow for longer responses but may use more tokens.
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
                    max="8192"
                    step="256"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Short (256)</span>
                    <span>Medium (2048)</span>
                    <span>Long (8192)</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="gemini" className="space-y-6">
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Bot size={20} />
                Gemini API Configuration
              </h2>
              
              <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <AlertTitle>About Gemini API</AlertTitle>
                <AlertDescription>
                  Gemini is Google's most advanced AI model. Add your API key below to use Gemini for chat and document analysis.
                  <a 
                    href="https://ai.google.dev/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block mt-2 text-blue-600 dark:text-blue-400 underline"
                  >
                    Get your API key from Google AI Studio →
                  </a>
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="geminiApiKey" className="text-base">API Key</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={16} className="text-gray-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Enter your Gemini API key from Google AI Studio. Required to use the real Gemini API.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="relative">
                    <Input
                      id="geminiApiKey"
                      type="password"
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                      placeholder="Enter your Gemini API key"
                      className="pr-10 dark:bg-gray-600"
                    />
                    <Key size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  
                  {isValidatingKey && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 size={14} className="animate-spin" />
                      Validating API key...
                    </div>
                  )}
                  
                  {!isValidatingKey && isKeyValid !== null && (
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
                  
                  <p className="text-sm text-muted-foreground">
                    Your API key is stored locally and never sent to our servers
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="geminiModel" className="text-base">Gemini Model</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={16} className="text-gray-500 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Select the Gemini model to use for AI responses and document analysis.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Select
                    value={selectedGeminiModel}
                    onValueChange={setSelectedGeminiModel}
                  >
                    <SelectTrigger className="w-full dark:bg-gray-600">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      {geminiModels.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          <div className="flex flex-col">
                            <span>{model.name}</span>
                            {model.description && (
                              <span className="text-xs text-muted-foreground">{model.description}</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {modelDetails && (
                  <ModelInfoCard model={modelDetails} className="mt-4" />
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Advanced Settings</h2>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoSave">Auto-Save Configuration</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save changes after 5 seconds of inactivity
                  </p>
                </div>
                <Switch 
                  id="autoSave"
                  checked={autoSaveEnabled} 
                  onCheckedChange={setAutoSaveEnabled} 
                />
              </div>
              
              <Separator />
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="examples">
                  <AccordionTrigger>Sample Prompts & Templates</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 py-2">
                      <div className="space-y-2">
                        <h3 className="text-base font-medium">Business Consulting</h3>
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm">
                          <pre className="whitespace-pre-wrap">{getSystemPromptExample("consulting")}</pre>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => applyPromptExample("consulting")}
                          className="mt-1"
                        >
                          Apply Template
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <h3 className="text-base font-medium">Research Assistant</h3>
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-sm">
                          <pre className="whitespace-pre-wrap">{getSystemPromptExample("research")}</pre>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => applyPromptExample("research")}
                          className="mt-1"
                        >
                          Apply Template
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="usage">
                  <AccordionTrigger>Usage & Best Practices</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 py-2">
                      <h3 className="text-base font-medium">Tips for Effective Prompts</h3>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>Be specific about the AI's role and expertise</li>
                        <li>Define preferred response format and length</li>
                        <li>Specify tone (formal, casual, technical)</li>
                        <li>Mention any constraints or guidelines</li>
                        <li>Include examples of desired outputs if possible</li>
                      </ul>
                      
                      <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 mt-3">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <AlertTitle>Important Note</AlertTitle>
                        <AlertDescription className="text-sm">
                          Lower temperature (0.1-0.3) works best for factual, analytical tasks.
                          Higher temperature (0.7-1.0) is better for creative or exploratory tasks.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RotateCw size={16} />
            Reset
          </Button>
          <Button 
            onClick={handleSave}
            className="flex items-center gap-2"
          >
            <Save size={16} />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SystemConfig;
