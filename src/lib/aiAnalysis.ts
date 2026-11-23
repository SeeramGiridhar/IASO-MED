/**
 * IASO Med - AI Medical Report Analysis Service
 * Uses Google Gemini (gemini-3.5-flash) via secure server-side endpoint with direct fallback
 */

export interface ReportMarker {
    name: string;
    value: string;
    unit?: string;
    range?: string;
    status: 'normal' | 'warning' | 'critical';
}

export interface AnalysisResult {
    summary: string;
    keyFindings: string[];
    recommendations: string[];
    markers?: ReportMarker[];
    severity: 'normal' | 'warning' | 'critical';
}

/**
 * Analyzes a medical report image using Google Gemini
 */
export async function analyzeMedicalReport(file: File): Promise<AnalysisResult> {
    try {
        // Convert file to base64
        const base64Image = await fileToBase64(file);
        const base64Data = base64Image.split(',')[1];
        const mimeType = file.type || 'image/jpeg';

        // 1. First attempt: Secure Server-Side Endpoint (/api/analyze)
        try {
            const apiRes = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ base64Data, mimeType })
            });

            if (apiRes.ok) {
                const result = await apiRes.json();
                if (result.summary) {
                    return result as AnalysisResult;
                }
            }
        } catch {
            // Serverless endpoint not present (e.g. static host), continue to client fallback
        }

        // 2. Client fallback if VITE_GEMINI_API_KEY is configured
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('Gemini API key not configured');
        }

        const promptText = `You are a medical AI assistant specialized in analyzing medical reports. Your role is to:
1. Extract and interpret key medical data from report images accurately
2. Identify abnormal values and flag them
3. Provide clear, patient-friendly explanations
4. Classify overall severity: normal, warning, or critical
5. Suggest next steps (always recommend consulting a doctor)

Analyze this medical report image and provide your response in VALID JSON format with this exact structure:
{
  "summary": "Brief 2-3 sentence overview of the report",
  "keyFindings": ["Finding 1", "Finding 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "markers": [
    {
      "name": "Biomarker or Test Name",
      "value": "Measured Value",
      "unit": "Unit (e.g. mg/dL, g/dL, etc.)",
      "range": "Normal Reference Range",
      "status": "normal"
    }
  ],
  "severity": "normal"
}

IMPORTANT: 
- Return ONLY valid JSON, no markdown formatting, no code fences
- Extract ONLY genuine findings and lab markers present in the image
- If quantitative test values are present, extract them into the markers array with status ("normal", "warning", or "critical")
- If no quantitative laboratory values exist (e.g. prescription, scan, notes), leave "markers": []
- In recommendations, always state that this is an AI assistive review and certified medical consultation is required
- severity must be exactly one of: "normal", "warning", or "critical"`;

        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': apiKey
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: promptText },
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
            const error = await response.json().catch(() => ({}));
            throw new Error(error.error?.message || 'Failed to analyze report with Gemini');
        }

        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!content) {
            throw new Error('No content received from Gemini API');
        }

        let jsonString = content.trim();
        const jsonMatch = jsonString.match(/```json\n?([\s\S]*?)\n?```/) || jsonString.match(/```\n?([\s\S]*?)\n?```/);
        if (jsonMatch) {
            jsonString = jsonMatch[1];
        }

        const analysis: AnalysisResult = JSON.parse(jsonString.trim());
        return analysis;
    } catch (error) {
        console.error('Report analysis error:', error);
        throw error;
    }
}

function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
}
