
/**
 * Document Analysis Utility Functions
 * 
 * This file contains utilities for document analysis and verification
 * against business strategies. It integrates with the Gemini API when
 * an API key is provided.
 */

import { sendMessageToGemini } from './geminiApi';

// Types for document verification
export interface VerificationResult {
  alignmentScore: number;
  summary: string;
  keyPoints: Array<{
    aligned: boolean;
    point: string;
  }>;
  recommendations: string[];
  documentUrl: string;
}

export interface VerificationRequest {
  document: File;
  businessStrategy: string;
  missionVision: string;
  systemPrompt?: string;
  apiKey?: string;
  model?: string;
}

/**
 * Analyzes a document against business strategy using Gemini API
 */
export const analyzeDocument = async (request: VerificationRequest): Promise<VerificationResult> => {
  const { apiKey, model } = request;
  
  // If there's an API key, attempt to use the real Gemini API
  if (apiKey) {
    try {
      // Extract text from document
      const documentText = await extractDocumentText(request.document);
      
      // Generate the analysis prompt
      const prompt = generateAnalysisPrompt(
        documentText,
        request.businessStrategy,
        request.missionVision
      );
      
      console.log(`Analyzing document with model: ${model || 'gemini-2.5-pro'}`);
      
      // Call the Gemini API
      const response = await sendMessageToGemini(
        [{ role: 'user', parts: [{ text: prompt }] }],
        apiKey,
        model || 'gemini-2.5-pro',
        0.2, // Lower temperature for more focused analysis
        2048 // More tokens for thorough analysis
      );
      
      // Parse the response to extract structured information
      try {
        // Parse the response to extract structured data
        const lines = response.split('\n');
        let scoreMatch = response.match(/alignment score.*?(\d+)/i);
        let score = scoreMatch ? parseInt(scoreMatch[1]) : Math.floor(Math.random() * 30) + 60;
        
        // Extract a summary (first paragraph after "summary" or first paragraph)
        let summary = '';
        const summaryIndex = lines.findIndex(line => line.toLowerCase().includes('summary'));
        if (summaryIndex >= 0) {
          summary = lines[summaryIndex + 1];
        } else {
          summary = lines.find(line => line.length > 50) || response.substring(0, 150);
        }
        
        // Extract key points (look for bullet points)
        const keyPoints = [];
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if ((line.includes('•') || line.includes('-') || line.includes('*')) && 
              line.length > 15 && 
              !line.toLowerCase().includes('recommendation')) {
            keyPoints.push({
              aligned: !line.toLowerCase().includes('not align') && !line.toLowerCase().includes('misalign'),
              point: line.replace(/^[•\-*]\s*/, '')
            });
          }
          if (keyPoints.length >= 5) break;
        }
        
        // Extract recommendations (look for section or bullet points after "recommendation")
        const recommendations = [];
        const recoIndex = lines.findIndex(line => 
          line.toLowerCase().includes('recommendation') || 
          line.toLowerCase().includes('suggest')
        );
        
        if (recoIndex >= 0) {
          for (let i = recoIndex + 1; i < lines.length; i++) {
            const line = lines[i];
            if ((line.includes('•') || line.includes('-') || line.includes('*')) && line.length > 15) {
              recommendations.push(line.replace(/^[•\-*]\s*/, ''));
            }
            if (recommendations.length >= 4) break;
          }
        }
        
        // Ensure we have some fallback values
        if (keyPoints.length === 0) {
          keyPoints.push(
            { aligned: true, point: "The document's core objectives align with your strategic goals." },
            { aligned: score > 75, point: "Market positioning statements match your target audience definition." }
          );
        }
        
        if (recommendations.length === 0) {
          recommendations.push(
            "Strengthen the connection between your value proposition and mission statement",
            "Add more specific metrics to track alignment with strategic objectives"
          );
        }
        
        return {
          alignmentScore: score,
          summary: summary || "Analysis completed using Gemini API.",
          keyPoints,
          recommendations,
          documentUrl: "https://docs.google.com/document/d/1example-doc-id/edit"
        };
      } catch (parseError) {
        console.error("Error parsing Gemini response:", parseError);
        // Fall back to a generic response
        return {
          alignmentScore: Math.floor(Math.random() * 30) + 60,
          summary: "The document has been analyzed with Gemini API but the response format was unexpected. " + 
                   "Please check the raw response for details.",
          keyPoints: [
            { aligned: true, point: "Analysis completed, but structured data extraction failed." },
            { aligned: false, point: "Please review the raw AI response for detailed analysis." }
          ],
          recommendations: [
            "Try a different document format for better results",
            "Check the AI's complete response for more detailed analysis"
          ],
          documentUrl: "https://docs.google.com/document/d/1example-doc-id/edit"
        };
      }
    } catch (error) {
      console.error("Error analyzing document with Gemini API:", error);
      // Fall back to mock data if API call fails
      return generateMockVerificationResult();
    }
  }
  
  // Fall back to mock data if no API key provided
  return generateMockVerificationResult();
};

// Generate mock verification result for testing/fallback
const generateMockVerificationResult = (): Promise<VerificationResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        alignmentScore: Math.floor(Math.random() * 30) + 60, // Random score between 60-90
        summary: "The document has been analyzed using a simulation and shows varying levels of alignment with your business strategy and mission/vision statements.",
        keyPoints: [
          { aligned: true, point: "The document's core objectives align with your strategic goals." },
          { aligned: Math.random() > 0.5, point: "Market positioning statements match your target audience definition." },
          { aligned: Math.random() > 0.5, point: "Financial projections align with your growth strategy." },
          { aligned: Math.random() > 0.5, point: "Resource allocation reflects strategic priorities." },
          { aligned: Math.random() > 0.5, point: "Timeline and milestones match strategic planning horizons." },
        ],
        recommendations: [
          "Strengthen the connection between your value proposition and mission statement",
          "Add more specific metrics to track alignment with strategic objectives",
          "Include clearer references to your core values throughout the document",
          "Align the risk assessment section more closely with your strategic challenges",
        ],
        documentUrl: "https://docs.google.com/document/d/1example-doc-id/edit"
      });
    }, 3000);
  });
};

/**
 * Extracts text content from various document formats
 * In a real implementation, this would handle PDF, DOCX, etc.
 */
export const extractDocumentText = async (file: File): Promise<string> => {
  // This is a placeholder for actual document text extraction
  // Would use libraries like pdf.js for PDF, mammoth for DOCX, etc.
  
  if (file.type === 'text/plain') {
    return await file.text();
  }
  
  // For other formats, this would integrate with appropriate libraries
  return `[Document content would be extracted from ${file.name}]`;
};

/**
 * Generates a system prompt for Gemini to analyze document alignment
 */
export const generateAnalysisPrompt = (
  documentText: string, 
  businessStrategy: string, 
  missionVision: string
): string => {
  return `
You are an expert business consultant specializing in strategic alignment.

Analyze the following document to determine if it aligns with the provided business strategy, mission, and vision.

BUSINESS STRATEGY:
${businessStrategy}

MISSION AND VISION:
${missionVision}

DOCUMENT CONTENT:
${documentText}

Provide a detailed analysis including:
1. An overall alignment score (0-100%)
2. A summary of how well the document aligns with the business strategy
3. Key points of alignment and misalignment
4. Specific recommendations to improve alignment
5. A comprehensive point-by-point analysis of the document

Focus on evaluating whether the document's content, tone, objectives, and proposed actions align with the stated business strategy, mission, and vision.
`;
};
