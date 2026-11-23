// Vercel Serverless Function: Secure Server-Side Medical Report Analysis
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Server-side GEMINI_API_KEY is not configured.' });
    }

    try {
        const { base64Data, mimeType } = req.body;

        if (!base64Data) {
            return res.status(400).json({ error: 'Missing image data' });
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
                                mimeType: mimeType || 'image/jpeg',
                                data: base64Data
                            }
                        }
                    ]
                }]
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            return res.status(response.status).json({ error: errData.error?.message || 'Gemini API failed' });
        }

        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!content) {
            return res.status(500).json({ error: 'No content received from Gemini API' });
        }

        let jsonString = content.trim();
        const jsonMatch = jsonString.match(/```json\n?([\s\S]*?)\n?```/) || jsonString.match(/```\n?([\s\S]*?)\n?```/);
        if (jsonMatch) {
            jsonString = jsonMatch[1];
        }

        const parsed = JSON.parse(jsonString.trim());
        return res.status(200).json(parsed);
    } catch (err) {
        console.error('Server-side analysis error:', err);
        return res.status(500).json({ error: err.message || 'Internal server error during analysis' });
    }
}
