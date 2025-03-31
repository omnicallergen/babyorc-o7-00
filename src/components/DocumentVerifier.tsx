
import React, { useState, useRef } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription, 
  SheetFooter 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, FileText, CheckCircle, CircleAlert, ExternalLink } from 'lucide-react';
import { analyzeDocument, VerificationResult } from '@/utils/documentAnalysis';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { useUser } from '@/contexts/UserContext';

interface DocumentVerifierProps {
  isOpen: boolean;
  onClose: () => void;
}

const DocumentVerifier: React.FC<DocumentVerifierProps> = ({ isOpen, onClose }) => {
  const { systemPromptSettings } = useUser();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [businessStrategy, setBusinessStrategy] = useState('');
  const [missionVision, setMissionVision] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<VerificationResult | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleVerify = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a document to verify",
        variant: "destructive"
      });
      return;
    }
    
    if (!businessStrategy.trim()) {
      toast({
        title: "Business strategy required",
        description: "Please enter your business strategy to continue",
        variant: "destructive"
      });
      return;
    }
    
    if (!missionVision.trim()) {
      toast({
        title: "Mission/vision required",
        description: "Please enter your mission and vision statements to continue",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    setResult(null);
    
    // Simulated progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 500);
    
    try {
      const apiKey = systemPromptSettings?.geminiApiKey;
      const model = systemPromptSettings?.selectedGeminiModel;
      
      // Show toast if no API key is configured
      if (!apiKey) {
        toast({
          title: "No Gemini API key configured",
          description: "Using mock data. Configure your API key in System Settings for production use.",
          variant: "default"
        });
      }
      
      const analysisResult = await analyzeDocument({
        document: selectedFile,
        businessStrategy,
        missionVision,
        apiKey,
        model
      });
      
      setResult(analysisResult);
      setProgress(100);
      
      toast({
        title: "Document analysis complete",
        description: "Your document has been analyzed successfully",
      });
    } catch (error) {
      console.error("Error verifying document:", error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to analyze document",
        variant: "destructive"
      });
    } finally {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
    }
  };
  
  const resetForm = () => {
    setSelectedFile(null);
    setBusinessStrategy('');
    setMissionVision('');
    setResult(null);
    setProgress(0);
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-md md:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-xl flex items-center gap-2">
            <FileText size={20} />
            Document Verification Tool
          </SheetTitle>
          <SheetDescription>
            Verify if your document aligns with business strategy
          </SheetDescription>
        </SheetHeader>
        
        {!result ? (
          <div className="space-y-6">
            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="document" className="text-base font-medium">
                Document Upload
              </Label>
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${selectedFile ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600'}`}
                onClick={handleFileUploadClick}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  id="document"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  disabled={isAnalyzing}
                />
                {selectedFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      Change File
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-10 w-10 text-gray-400" />
                    <p className="text-base font-medium">Click to upload a document</p>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX, TXT up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Business Strategy */}
            <div className="space-y-2">
              <Label htmlFor="businessStrategy" className="text-base font-medium">
                Business Strategy
              </Label>
              <Textarea
                id="businessStrategy"
                placeholder="Enter your business strategy..."
                value={businessStrategy}
                onChange={(e) => setBusinessStrategy(e.target.value)}
                className="min-h-24 resize-none"
                disabled={isAnalyzing}
              />
              <p className="text-xs text-gray-500">
                Include your key strategic objectives, market positioning, and competitive advantages
              </p>
            </div>
            
            {/* Mission & Vision */}
            <div className="space-y-2">
              <Label htmlFor="missionVision" className="text-base font-medium">
                Mission & Vision Statements
              </Label>
              <Textarea
                id="missionVision"
                placeholder="Enter your mission and vision statements..."
                value={missionVision}
                onChange={(e) => setMissionVision(e.target.value)}
                className="min-h-24 resize-none"
                disabled={isAnalyzing}
              />
              <p className="text-xs text-gray-500">
                What does your organization stand for and where is it headed?
              </p>
            </div>
            
            {isAnalyzing && (
              <div className="space-y-2 py-4">
                <p className="text-sm font-medium text-center">
                  Analyzing document...
                </p>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-center text-gray-500">
                  Using {systemPromptSettings?.selectedGeminiModel || 'gemini-1.5-pro'} 
                  {systemPromptSettings?.geminiApiKey ? '' : ' (mock data)'}
                </p>
              </div>
            )}
            
            <SheetFooter>
              <Button 
                variant="outline" 
                onClick={handleClose}
                disabled={isAnalyzing}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleVerify}
                disabled={!selectedFile || !businessStrategy.trim() || !missionVision.trim() || isAnalyzing}
                className="min-w-32"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing
                  </>
                ) : "Verify Document"}
              </Button>
            </SheetFooter>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Results */}
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Alignment Score</h3>
                <div className="text-2xl font-bold">{result.alignmentScore}%</div>
              </div>
              <Progress value={result.alignmentScore} className="h-2" />
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Summary</h3>
                <p className="text-sm">{result.summary}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Key Points</h3>
                <ul className="space-y-2">
                  {result.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      {point.aligned ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <CircleAlert className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      )}
                      <span className="text-sm">{point.point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                <ul className="list-disc ml-5 space-y-1">
                  {result.recommendations.map((recommendation, index) => (
                    <li key={index} className="text-sm">{recommendation}</li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2"
                  asChild
                >
                  <a href={result.documentUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink size={16} />
                    View Full Report
                  </a>
                </Button>
              </div>
            </div>
            
            <SheetFooter className="gap-2">
              <Button 
                variant="outline" 
                onClick={resetForm}
              >
                Analyze Another Document
              </Button>
              <Button 
                onClick={handleClose}
              >
                Close
              </Button>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default DocumentVerifier;
