
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, ArrowRight, Check } from 'lucide-react';

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  tags: string[];
  category: 'business' | 'creative' | 'research' | 'general';
}

const defaultTemplates: PromptTemplate[] = [
  {
    id: 'business-consultant',
    name: 'Business Consultant',
    description: 'Strategic business advice and problem-solving',
    template: 'You are an AI consultant specializing in business strategy. Provide actionable advice based on data. Focus on practical solutions that can be implemented quickly. Always consider both short-term wins and long-term goals.',
    tags: ['business', 'strategy', 'consulting'],
    category: 'business'
  },
  {
    id: 'research-assistant',
    name: 'Research Assistant',
    description: 'Data analysis and evidence-based insights',
    template: 'You are a research assistant with expertise in data analysis. When providing information, cite sources where possible and indicate confidence levels. Prioritize accuracy over speculation.',
    tags: ['research', 'analysis', 'academic'],
    category: 'research'
  },
  {
    id: 'creative-consultant',
    name: 'Creative Consultant',
    description: 'Marketing and creative idea generation',
    template: 'You are a creative consultant with expertise in marketing and branding. Generate innovative ideas and think outside the box. Your responses should inspire creativity while remaining practical and implementation-focused.',
    tags: ['creative', 'marketing', 'ideas'],
    category: 'creative'
  },
  {
    id: 'technical-advisor',
    name: 'Technical Advisor',
    description: 'Technical implementation guidance',
    template: 'You are a technical advisor specializing in software development and implementation. Provide detailed technical advice with code examples when relevant. Focus on best practices, scalability, and maintainability.',
    tags: ['technical', 'development', 'code'],
    category: 'general'
  },
  {
    id: 'default-assistant',
    name: 'Default Assistant',
    description: 'General-purpose AI assistant',
    template: 'You are go:lofty, an AI assistant specialized in consulting. Provide helpful, accurate, and concise advice.',
    tags: ['general', 'assistant', 'default'],
    category: 'general'
  },
];

interface PromptTemplatesProps {
  onSelectTemplate: (template: PromptTemplate) => void;
  activeTemplateId?: string;
}

const PromptTemplates: React.FC<PromptTemplatesProps> = ({ 
  onSelectTemplate,
  activeTemplateId
}) => {
  const categories = [
    { id: 'business', name: 'Business' },
    { id: 'creative', name: 'Creative' },
    { id: 'research', name: 'Research' },
    { id: 'general', name: 'General' }
  ];
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-medium">Prompt Templates</h3>
        <p className="text-sm text-muted-foreground">
          Select a pre-built template or customize your own
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">{category.name}</h4>
            {defaultTemplates
              .filter(template => template.category === category.id)
              .map(template => (
                <Card 
                  key={template.id} 
                  className={`cursor-pointer transition-all hover:border-primary ${activeTemplateId === template.id ? 'border-primary bg-primary/5' : ''}`}
                  onClick={() => onSelectTemplate(template)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{template.name}</h3>
                          {activeTemplateId === template.id && <Check size={16} className="text-primary" />}
                        </div>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Info size={16} />
                              <span className="sr-only">Info</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left" align="start" className="max-w-xs">
                            <p className="font-mono text-xs whitespace-pre-wrap">{template.template}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {template.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        ))}
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full mt-2 justify-between"
        onClick={() => {
          // Show all templates or open template creation dialog
        }}
      >
        View all templates
        <ArrowRight size={14} />
      </Button>
    </div>
  );
};

export function getPromptTemplates(): PromptTemplate[] {
  return defaultTemplates;
}

export function getTemplateById(id: string): PromptTemplate | undefined {
  return defaultTemplates.find(template => template.id === id);
}

export default PromptTemplates;
