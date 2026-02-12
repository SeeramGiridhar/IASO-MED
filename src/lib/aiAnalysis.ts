/**
 * IASO Med - AI Medical Report Analysis Service
 * Uses OpenAI GPT-4o to analyze medical report images and extract insights
 */

interface AnalysisResult {
    summary: string;
    keyFindings: string[];
    recommendations: string[];
    severity: 'normal' | 'warning' | 'critical';
}

/**
 * Analyzes a medical report image using OpenAI GPT-4o Vision
 */
export async function analyzeMedicalReport(file: File): Promise<AnalysisResult> {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
        throw new Error('OpenAI API key not configured');
    }

    try {
        // Convert file to base64
        const base64Image = await fileToBase64(file);

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: `You are a medical AI assistant specialized in analyzing medical reports. Your role is to:
1. Extract and interpret key medical data from report images
2. Identify abnormal values and flag them
3. Provide clear, patient-friendly explanations
4. Classify severity: normal, warning, or critical
5. Suggest next steps (always recommend consulting a doctor)

Return your analysis in JSON format with this structure:
{
  "summary": "Brief 2-3 sentence overview of the report",
  "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "severity": "normal" | "warning" | "critical"
}

IMPORTANT: Always include a disclaimer that this is AI analysis and professional medical consultation is required.`
                    },
                    {
                        role: 'user',
                        content: [
                            {
                                type: 'text',
                                text: 'Please analyze this medical report image and provide insights in the requested JSON format.'
                            },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: base64Image
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to analyze report');
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // Extract JSON from the response (handle markdown code blocks)
        const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;

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
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
        return 'AI analysis is currently unavailable. Please configure your API key.';
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a medical AI that creates brief, patient-friendly summaries of medical reports. Keep it concise (2-3 sentences) and always remind users to consult their doctor.'
                    },
                    {
                        role: 'user',
                        content: `Summarize this ${reportType} report in patient-friendly language:\n\n${extractedText}`
                    }
                ],
                max_tokens: 200
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Summary generation error:', error);
        return 'Unable to generate summary. Please review the full report details.';
    }
}
