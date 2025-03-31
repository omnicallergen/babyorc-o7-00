
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import ApiKeyForm from '@/components/ApiKeyForm';
import PromptTemplates, { PromptTemplate, getTemplateById } from '@/components/PromptTemplates';
import PromptValidator from '@/components/PromptValidator';
import { 
  ArrowLeft, 
  Save, 
  RotateCw, 
  Clock, 
  CheckCircle, 
  BookTemplate,
  Sparkles
} from 'lucide-react';
import { getAvailableGeminiModels, ModelOption } from '@/utils/geminiApi';
import ModelInfoCard from '@/components/ModelInfoCard';

const SystemConfig: React.FC = () => {
  const { systemPromptSettings, updateSystemPrompt } = useUser();
  const { toast } = useToast();
  
  const [prompt, setPrompt] = useState<string>(systemPromptSettings?.prompt || '');
  const [selectedGeminiModel, setSelectedGeminiModel] = useState<string>(
    systemPromptSettings?.selectedGeminiModel || 'gemini-2.0-flash'
  );
  const [temperature, setTemperature] = useState<number>(
    systemPromptSettings?.temperature || 0.7
  );
  const [maxTokens, setMaxTokens] = useState<number>(
    systemPromptSettings?.maxTokens || 1024
  );
  const [autoSave, setAutoSave] = useState<boolean>(
    systemPromptSettings?.autoSave || false
  );
  const [apiKeyValid, setApiKeyValid] = useState<boolean>(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(
    systemPromptSettings?.selectedTemplateId
  );
  
  const handleSaveSettings = () => {
    if (systemPromptSettings) {
      updateSystemPrompt({
        ...systemPromptSettings,
        prompt,
        temperature,
        maxTokens,
        autoSave,
        selectedGeminiModel,
        selectedTemplateId
      });
      
      toast({
        title: "Settings saved",
        description: "Your system settings have been updated",
      });
    }
  };
  
  const handleTemplateSelect = (template: PromptTemplate) => {
    setPrompt(template.template);
    setSelectedTemplateId(template.id);
  };
  
  // Get Gemini models
  const models = getAvailableGeminiModels();
  const selectedModel = models.find(m => m.id === selectedGeminiModel) || models[0];
  
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="flex items-center text-blue-500 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Chat
        </Link>
        <Button onClick={handleSaveSettings} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">System Configuration</h1>
      
      <Tabs defaultValue="system-prompt" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="system-prompt" className="text-base py-3">
            <BookTemplate className="h-4 w-4 mr-2" />
            System Prompt
          </TabsTrigger>
          <TabsTrigger value="api-settings" className="text-base py-3">
            <Sparkles className="h-4 w-4 mr-2" />
            API Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="system-prompt" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="system-prompt" className="text-lg">System Prompt</Label>
                <Textarea 
                  id="system-prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-32 dark:bg-gray-700"
                  placeholder="Enter your system prompt here..."
                />
                
                <PromptValidator 
                  prompt={prompt}
                  onValidationResult={(isValid) => {
                    // Validation feedback can be used here
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="temperature" className="flex items-center justify-between">
                  <span>Temperature: {temperature.toFixed(1)}</span>
                </Label>
                <Slider
                  id="temperature" 
                  min={0}
                  max={1}
                  step={0.1}
                  value={[temperature]}
                  onValueChange={(value) => setTemperature(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Precise (0.0)</span>
                  <span>Balanced (0.5)</span>
                  <span>Creative (1.0)</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max-tokens" className="flex items-center justify-between">
                  <span>Max Output Tokens: {maxTokens}</span>
                </Label>
                <Slider
                  id="max-tokens" 
                  min={256}
                  max={4096}
                  step={256}
                  value={[maxTokens]}
                  onValueChange={(value) => setMaxTokens(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Short (256)</span>
                  <span>Medium (2048)</span>
                  <span>Long (4096)</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-save">Auto Save System Prompt</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save changes to system prompt
                  </p>
                </div>
                <Switch
                  id="auto-save"
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                />
              </div>
              
              <div className="pt-4 mt-2 border-t">
                <Button 
                  variant="outline" 
                  onClick={handleSaveSettings}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save System Prompt
                </Button>
              </div>
            </div>
            
            <div className="space-y-6">
              <PromptTemplates
                onSelectTemplate={handleTemplateSelect}
                activeTemplateId={selectedTemplateId}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="api-settings" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <ApiKeyForm 
                onKeyValidated={(isValid) => setApiKeyValid(isValid)} 
              />
              
              <div className="space-y-2 pt-6 border-t">
                <Label className="text-lg">Select Gemini Model</Label>
                <div className="grid grid-cols-1 gap-2">
                  {models.map((model) => (
                    <div 
                      key={model.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors
                        ${selectedGeminiModel === model.id 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }
                        ${!apiKeyValid ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                      onClick={() => apiKeyValid && setSelectedGeminiModel(model.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles size={16} className="text-blue-500" />
                          <span className="font-medium">{model.name}</span>
                        </div>
                        {selectedGeminiModel === model.id && (
                          <CheckCircle size={16} className="text-blue-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {model.description}
                      </p>
                    </div>
                  ))}
                </div>
                
                <p className="text-sm text-muted-foreground pt-2">
                  {!apiKeyValid 
                    ? "Add your Gemini API key above to enable model selection" 
                    : "Select a model to use with your API key"}
                </p>
                
                <div className="pt-4 mt-2">
                  <Button 
                    variant="outline" 
                    onClick={handleSaveSettings}
                    className="w-full flex items-center justify-center gap-2"
                    disabled={!apiKeyValid}
                  >
                    <Save className="h-4 w-4" />
                    Save API Settings
                  </Button>
                </div>
              </div>
            </div>
            
            <div>
              <ModelInfoCard model={selectedModel} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemConfig;
