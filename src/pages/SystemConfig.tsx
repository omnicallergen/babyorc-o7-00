
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
  Clock,
  History,
  FileCode,
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
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { getAvailableGeminiModels, ModelOption, testGeminiApiKey, getModelDetails } from '@/utils/geminiApi';
import ModelInfoCard from '@/components/ModelInfoCard';
import ApiKeyForm from '@/components/ApiKeyForm';
import PromptTemplates, { PromptTemplate, getTemplateById } from '@/components/PromptTemplates';
import PromptValidator from '@/components/PromptValidator';

const SystemConfig: React.FC = () => {
  const { user, updateSystemPrompt, systemPromptSettings, getPromptHistory } = useUser();
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

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    systemPromptSettings?.selectedTemplateId || 'default-assistant'
  );
  
  const [isPromptValid, setIsPromptValid] = useState<boolean>(true);
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  
  // UI state
  const [activeTab, setActiveTab] = useState<string>("general");
  const [modelDetails, setModelDetails] = useState<ModelOption | null>(null);
  
  // Get available models
  const geminiModels = getAvailableGeminiModels();
  
  // Load prompt history
  useEffect(() => {
    setPromptHistory(getPromptHistory());
  }, []);
  
  // Update model details when selected model changes
  useEffect(() => {
    const details = getModelDetails(selectedGeminiModel);
    setModelDetails(details);
  }, [selectedGeminiModel]);
  
  // Auto-save functionality
  useEffect(() => {
    if (autoSaveEnabled) {
      const timer = setTimeout(() => {
        if (isPromptValid) {
          handleSave();
        }
      }, 5000); // Auto save after 5 seconds of inactivity
      
      return () => clearTimeout(timer);
    }
  }, [systemPrompt, temperature, maxTokens, autoSaveEnabled, geminiApiKey, selectedGeminiModel, isPromptValid]);

  // Handler for template selection
  const handleTemplateSelect = (template: PromptTemplate) => {
    setSystemPrompt(template.template);
    setSelectedTemplateId(template.id);
    
    toast({
      title: "Template applied",
      description: `Applied the "${template.name}" template`
    });
  };
  
  // Handle prompt validation results
  const handleValidationResult = (isValid: boolean, message: string) => {
    setIsPromptValid(isValid);
    setValidationMessage(message);
  };

  const handleSave = () => {
    if (!isPromptValid) {
      toast({
        title: "Invalid prompt",
        description: validationMessage || "Please fix the issues with your prompt before saving",
        variant: "destructive"
      });
      return;
    }
    
    updateSystemPrompt({
      prompt: systemPrompt,
      temperature: temperature,
      maxTokens: maxTokens,
      autoSave: autoSaveEnabled,
      geminiApiKey: geminiApiKey,
      selectedGeminiModel: selectedGeminiModel,
      selectedTemplateId: selectedTemplateId
    });
    
    toast({
      title: "System configuration updated",
      description: "Your AI configuration has been saved successfully"
    });
  };
  
  const handleReset = () => {
    const defaultTemplate = getTemplateById('default-assistant');
    
    setSystemPrompt(defaultTemplate?.template || 'You are go:lofty, an AI assistant specialized in consulting. Provide helpful, accurate, and concise advice.');
    setTemperature(0.7);
    setMaxTokens(1024);
    setGeminiApiKey('');
    setSelectedGeminiModel('gemini-2.0-flash');
    setSelectedTemplateId('default-assistant');
    setAutoSaveEnabled(false);
    
    toast({
      title: "System configuration reset",
      description: "System settings have been reset to default values"
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
            <TabsTrigger value="prompt" className="flex items-center gap-1">
              <MessageSquare size={16} />
              Prompt Orchestration
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
            {/* Basic system settings */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Bot size={18} />
                Basic Configuration
              </h2>
              
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
              
              <ApiKeyForm onKeyValidated={() => {}} />
            </div>
          </TabsContent>
          
          <TabsContent value="prompt" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <MessageSquare size={18} />
                  System Prompt
                </h2>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="systemPrompt" className="text-base">Prompt</Label>
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
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {systemPrompt.length} chars
                      </Badge>
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <History size={16} />
                            <span className="sr-only">History</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72" align="end">
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Prompt History</h3>
                            {promptHistory.length > 0 ? (
                              <div className="max-h-72 overflow-y-auto space-y-2">
                                {promptHistory.map((prompt, index) => (
                                  <div 
                                    key={index}
                                    className="text-xs p-2 bg-gray-50 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                    onClick={() => setSystemPrompt(prompt)}
                                  >
                                    <div className="flex items-center justify-between mb-1">
                                      <Badge variant="outline" className="text-xs">Version {index + 1}</Badge>
                                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setSystemPrompt(prompt)}>
                                        <ArrowLeft size={12} />
                                      </Button>
                                    </div>
                                    <p className="truncate">{prompt}</p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">No prompt history yet</p>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <Textarea
                    id="systemPrompt"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    placeholder="Enter system prompt instructions for the AI..."
                    className="min-h-32 dark:bg-gray-700"
                  />
                  
                  <PromptValidator 
                    prompt={systemPrompt} 
                    onValidationResult={handleValidationResult}
                  />
                  
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock size={14} />
                      Last updated: {systemPromptSettings?.lastUpdated ? new Date(systemPromptSettings.lastUpdated).toLocaleString() : 'Never'}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSystemPrompt('')}
                        disabled={!systemPrompt}
                      >
                        Clear
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={handleSave}
                        disabled={!isPromptValid}
                      >
                        <Save size={14} className="mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <FileCode className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertTitle className="text-sm font-medium">Prompt Tips</AlertTitle>
                  <AlertDescription className="text-xs">
                    <ul className="list-disc pl-4 pt-1 space-y-1">
                      <li>Start with "You are..." to define the AI's role</li>
                      <li>Specify tone (formal, casual, technical)</li>
                      <li>Include specific constraints or guidelines</li>
                      <li>Focus on one primary role for best results</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Bot size={18} />
                  Prompt Templates
                </h2>
                
                <PromptTemplates 
                  onSelectTemplate={handleTemplateSelect}
                  activeTemplateId={selectedTemplateId}
                />
              </div>
            </div>
            
            <Accordion type="single" collapsible className="w-full mt-4">
              <AccordionItem value="examples">
                <AccordionTrigger>Advanced Prompt Techniques</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 py-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="text-base font-medium mb-2">Chain-of-Thought Prompting</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Instruct the AI to think step-by-step to solve complex problems.
                          </p>
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-xs">
                            <pre className="whitespace-pre-wrap">
                              {`You are an analytical problem solver. Always think step-by-step before providing your final answer. Break down complex problems into smaller parts and analyze each component sequentially.`}
                            </pre>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="p-4">
                          <h3 className="text-base font-medium mb-2">Format Control</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            Specify exactly how responses should be structured.
                          </p>
                          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded text-xs">
                            <pre className="whitespace-pre-wrap">
                              {`You are a business consultant. Always structure your responses in the following format:
1. SUMMARY: A brief overview of the solution
2. DETAILS: In-depth explanation with supporting evidence
3. ACTION ITEMS: 3-5 concrete next steps
4. RESOURCES: Relevant tools or references`}
                            </pre>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
              
              <ApiKeyForm onKeyValidated={() => {}} />
              
              <div className="space-y-2 mt-4">
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
              
              <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Reset Configuration</AlertTitle>
                <AlertDescription>
                  Reset all configuration settings to their default values. This action cannot be undone.
                  
                  <Button 
                    variant="destructive" 
                    onClick={handleReset}
                    className="mt-2"
                  >
                    <RotateCw size={14} className="mr-2" />
                    Reset All Settings
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="flex items-center gap-2"
            disabled={!isPromptValid}
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
