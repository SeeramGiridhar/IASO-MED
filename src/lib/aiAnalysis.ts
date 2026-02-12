/**
 * IASO Med - AI Medical Report Analysis Service
 * Uses Google Gemini Pro Vision to analyze medical report images and extract insights
 */

interface AnalysisResult {
    summary: string;
    keyFindings: string[];
    recommendations: string[];
    severity: 'normal' | 'warning' | 'critical';
}

/**
 * Analyzes a medical report image using Google Gemini Pro Vision
 */
export async function analyzeMedicalReport(file: File): Promise<AnalysisResult> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('Gemini API key not configured');
    }

    try {
        // Convert file to base64 (remove data URL prefix for Gemini)
        const base64Image = await fileToBase64(file);
        const base64Data = base64Image.split(',')[1]; // Remove "data:image/...;base64," prefix

        const mimeType = file.type || 'image/jpeg';

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        {
                            text: `You are a medical AI assistant specialized in analyzing medical reports. Your role is to:
1. Extract and interpret key medical data from report images
2. Identify abnormal values and flag them
3. Provide clear, patient-friendly explanations
4. Classify severity: normal, warning, or critical
5. Suggest next steps (always recommend consulting a doctor)

Analyze this medical report image and provide your response in VALID JSON format with this exact structure:
{
  "summary": "Brief 2-3 sentence overview of the report",
  "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "severity": "normal"
}

IMPORTANT: 
- Return ONLY valid JSON, no markdown formatting
- Always include a disclaimer that this is AI analysis and professional medical consultation is required
- severity must be exactly one of: "normal", "warning", or "critical"`
                        },
                        {
                            inlineData: {
                                mimeType: mimeType,
                                data: base64Data
                            }
                        }
                    ]
                }]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to analyze report');
        }

        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!content) {
            throw new Error('No content received from Gemini API');
        }

        // Extract JSON from the response (handle markdown code blocks and backticks)
        let jsonString = content.trim();

        // Remove markdown code blocks if present
        const jsonMatch = jsonString.match(/```json\n?([\s\S]*?)\n?```/) || jsonString.match(/```\n?([\s\S]*?)\n?```/);
        if (jsonMatch) {
            jsonString = jsonMatch[1];
        }

        // Remove any leading/trailing whitespace
        jsonString = jsonString.trim();

        const analysis: AnalysisResult = JSON.parse(jsonString);

        return analysis;
    } catch (error) {
        console.error('Report analysis error:', error);
        throw error;
    }
}

/**
 * Converts a File to base64 data URL
 */
function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Generates a patient-friendly summary for a specific report type
 */
export async function generateReportSummary(
    reportType: string,
    extractedText: string
): Promise<string> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        return 'AI analysis is currently unavailable. Please configure your API key.';
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are a medical AI that creates brief, patient-friendly summaries of medical reports. Keep it concise (2-3 sentences) and always remind users to consult their doctor.

Summarize this ${reportType} report in patient-friendly language:

${extractedText}`
                    }]
                }]
            })
        });

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate summary.';
    } catch (error) {
        console.error('Summary generation error:', error);
        return 'Unable to generate summary. Please review the full report details.';
    }
}
