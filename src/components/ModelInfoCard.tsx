
import React from 'react';
import { ModelOption } from '@/utils/geminiApi';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Zap, Brain, Cpu, ListChecks, Scale } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ModelInfoCardProps {
  model: ModelOption;
  className?: string;
}

const ModelInfoCard: React.FC<ModelInfoCardProps> = ({ model, className = '' }) => {
  // Format context window size to be more readable
  const formatContextSize = (size: number) => {
    if (size >= 1000000) {
      return `${(size / 1000000).toFixed(1)}M tokens`;
    } else if (size >= 1000) {
      return `${(size / 1000).toFixed(1)}K tokens`;
    }
    return `${size} tokens`;
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Cpu size={20} className="text-lofty-blue" />
              {model.name}
            </CardTitle>
            <CardDescription className="mt-1">{model.description}</CardDescription>
          </div>
          <Badge variant="outline" className="bg-lofty-blue/10 text-lofty-blue border-lofty-blue/20">
            {model.id}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {model.capabilities && model.capabilities.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Brain size={16} />
              Capabilities
            </h4>
            <div className="flex flex-wrap gap-1">
              {model.capabilities.map((capability, index) => (
                <Badge key={index} variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {capability}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {model.bestFor && model.bestFor.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <ListChecks size={16} />
              Best For
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1 ml-5 list-disc">
              {model.bestFor.map((use, index) => (
                <li key={index}>{use}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      {model.contextWindow && (
        <CardFooter className="border-t pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Scale size={14} />
            Context Window: {formatContextSize(model.contextWindow)}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default ModelInfoCard;
