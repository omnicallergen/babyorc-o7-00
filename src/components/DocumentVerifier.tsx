
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Upload, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from '@/contexts/UserContext';

interface DocumentVerifierProps {
  isOpen: boolean;
  onClose: () => void;
}

const DocumentVerifier: React.FC<DocumentVerifierProps> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [businessStrategy, setBusinessStrategy] = useState('');
  const [missionVision, setMissionVision] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const { systemPromptSettings } = useUser();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleVerify = async () => {
    if (!file) {
      toast({
        title: "No document selected",
        description: "Please upload a document to verify",
        variant: "destructive",
      });
      return;
    }

    if (!businessStrategy.trim() || !missionVision.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both business strategy and mission/vision",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    
    try {
      // Here we would process the document and send it to Gemini API
      // For now, we'll simulate the response with a timeout
      
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append('document', file);
      formData.append('businessStrategy', businessStrategy);
      formData.append('missionVision', missionVision);
      
      // If we had a system prompt setting, we would include it
      if (systemPromptSettings?.prompt) {
        formData.append('systemPrompt', systemPromptSettings.prompt);
      }
      
      // Simulate API request to Gemini
      setTimeout(() => {
        // Simulate a successful response
        const mockResult = {
          alignmentScore: 78,
          summary: "The document generally aligns with the business strategy, but there are areas for improvement.",
          keyPoints: [
            { aligned: true, point: "Product roadmap aligns with strategic objectives" },
            { aligned: true, point: "Target market definition matches business vision" },
            { aligned: false, point: "Competitive positioning statement needs adjustment" },
            { aligned: false, point: "Revenue projections may be optimistic compared to strategy" },
            { aligned: true, point: "Core values are consistently represented" },
          ],
          recommendations: [
            "Refine competitive positioning to better align with business differentiation strategy",
            "Adjust revenue projections to match strategic growth targets",
            "Add more detail about sustainability initiatives to match mission statement",
          ],
          documentUrl: "https://docs.google.com/document/d/1example-doc-id/edit"
        };
        
        setVerificationResult(mockResult);
        setIsVerifying(false);
        setStep(3);
      }, 3000);
      
    } catch (error) {
      console.error("Error verifying document:", error);
      toast({
        title: "Verification failed",
        description: "There was an error verifying your document. Please try again.",
        variant: "destructive",
      });
      setIsVerifying(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setBusinessStrategy('');
    setMissionVision('');
    setVerificationResult(null);
    setStep(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Verify Document Alignment</DialogTitle>
          <DialogDescription>
            Upload a document to verify its alignment with your business strategy.
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="document-upload" className="text-sm font-medium">
                  Upload Document
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="document-upload"
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('document-upload')?.click()}
                    className="w-full py-8 border-dashed"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {file ? file.name : "Select a document to upload"}
                  </Button>
                </div>
                {file && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <FileText className="h-4 w-4" />
                    <span>{file.name}</span>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button onClick={() => setStep(2)} disabled={!file}>Next</Button>
            </DialogFooter>
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="business-strategy" className="text-sm font-medium">
                  Business Strategy
                </label>
                <Textarea
                  id="business-strategy"
                  placeholder="Describe your business strategy, goals, and key objectives..."
                  value={businessStrategy}
                  onChange={(e) => setBusinessStrategy(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="mission-vision" className="text-sm font-medium">
                  Mission and Vision
                </label>
                <Textarea
                  id="mission-vision"
                  placeholder="Describe your company's mission, vision, and core values..."
                  value={missionVision}
                  onChange={(e) => setMissionVision(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button 
                onClick={handleVerify}
                disabled={isVerifying || !businessStrategy.trim() || !missionVision.trim()}
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Document'
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === 3 && verificationResult && (
          <>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-lg font-medium">Alignment Score</h3>
                <div className={`text-xl font-bold ${
                  verificationResult.alignmentScore >= 70 
                    ? 'text-green-600' 
                    : verificationResult.alignmentScore >= 50 
                      ? 'text-yellow-600' 
                      : 'text-red-600'
                }`}>
                  {verificationResult.alignmentScore}%
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-2">Summary</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {verificationResult.summary}
                </p>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-2">Key Points</h3>
                <ul className="space-y-2">
                  {verificationResult.keyPoints.map((point: any, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      {point.aligned ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                      )}
                      <span>{point.point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-md font-medium mb-2">Recommendations</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {verificationResult.recommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">{rec}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-4">
                <h3 className="text-md font-medium mb-2">Detailed Report</h3>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(verificationResult.documentUrl, '_blank')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View Complete Analysis in Google Docs
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>Close</Button>
              <Button onClick={resetForm}>Verify Another Document</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DocumentVerifier;
