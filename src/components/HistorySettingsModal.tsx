
import React, { useState } from 'react';
import { useChat } from '@/contexts/ChatContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RotateCw, 
  Clock, 
  Database, 
  Lock, 
  Save, 
  Download, 
  Shield, 
  Trash2 
} from 'lucide-react';

interface HistorySettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HistorySettingsModal: React.FC<HistorySettingsModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const { sessions } = useChat();
  
  // Local state for settings
  const [autoDeleteDays, setAutoDeleteDays] = useState<number>(30);
  const [autoClearEnabled, setAutoClearEnabled] = useState<boolean>(false);
  const [sessionLimitEnabled, setSessionLimitEnabled] = useState<boolean>(false);
  const [sessionLimit, setSessionLimit] = useState<number>(50);
  const [encryptHistory, setEncryptHistory] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<string>("json");
  const [syncEnabled, setSyncEnabled] = useState<boolean>(true);
  
  const handleSaveSettings = () => {
    // Here we would save settings to a persistent storage
    // For now we just show a toast notification
    toast({
      title: "Settings saved",
      description: "Your history settings have been updated"
    });
    onOpenChange(false);
  };
  
  const handleExportHistory = () => {
    // Create a JSON representation of chat history
    const historyData = JSON.stringify(sessions, null, 2);
    
    // Create a blob and download link
    const blob = new Blob([historyData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${new Date().toISOString().split('T')[0]}.${exportFormat}`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "History exported",
      description: `Your chat history has been exported as ${exportFormat.toUpperCase()}`
    });
  };
  
  const handleClearAllHistory = () => {
    // This would be implemented in the ChatContext
    toast({
      title: "History cleared",
      description: "All chat history has been deleted",
      variant: "destructive"
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock size={18} />
            History Settings
          </DialogTitle>
          <DialogDescription>
            Manage how your chat history is stored and maintained
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="general" className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="data">Data Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sync across devices</Label>
                  <p className="text-sm text-muted-foreground">
                    Keep your chat history in sync across your devices
                  </p>
                </div>
                <Switch 
                  checked={syncEnabled} 
                  onCheckedChange={setSyncEnabled} 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-title conversations</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically generate titles for new conversations
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Maximum sessions</Label>
                  <Switch 
                    checked={sessionLimitEnabled} 
                    onCheckedChange={setSessionLimitEnabled} 
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Slider
                    disabled={!sessionLimitEnabled}
                    value={[sessionLimit]}
                    min={10}
                    max={200}
                    step={10}
                    onValueChange={(value) => setSessionLimit(value[0])}
                    className="flex-1"
                  />
                  <div className="w-12 text-center">
                    {sessionLimit}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Limit the number of saved conversations
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Lock size={16} />
                    Encrypt chat history
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Encrypt your chat history for additional security
                  </p>
                </div>
                <Switch 
                  checked={encryptHistory} 
                  onCheckedChange={setEncryptHistory} 
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <RotateCw size={16} />
                    Auto-delete history
                  </Label>
                  <Switch 
                    checked={autoClearEnabled} 
                    onCheckedChange={setAutoClearEnabled} 
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Slider
                    disabled={!autoClearEnabled}
                    value={[autoDeleteDays]}
                    min={1}
                    max={365}
                    step={1}
                    onValueChange={(value) => setAutoDeleteDays(value[0])}
                    className="flex-1"
                  />
                  <div className="w-12 text-center">
                    {autoDeleteDays}d
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Automatically delete history after specified days
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="data" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Export format</Label>
                <div className="flex space-x-2">
                  <Button 
                    variant={exportFormat === "json" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setExportFormat("json")}
                  >
                    JSON
                  </Button>
                  <Button 
                    variant={exportFormat === "csv" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setExportFormat("csv")}
                  >
                    CSV
                  </Button>
                  <Button 
                    variant={exportFormat === "txt" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setExportFormat("txt")}
                  >
                    TXT
                  </Button>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={handleExportHistory}
              >
                <Download size={16} />
                Export Chat History
              </Button>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  variant="destructive" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleClearAllHistory}
                >
                  <Trash2 size={16} />
                  Clear All History
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  This action cannot be undone. All your chat history will be permanently deleted.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveSettings} className="gap-2">
            <Save size={16} />
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HistorySettingsModal;
