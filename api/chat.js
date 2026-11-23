// Vercel Serverless Function: Secure Server-Side Health Assistant Chat
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Server-side GEMINI_API_KEY is not configured.' });
    }

    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const fullPrompt = `You are IASO AI, a helpful and professional medical assistant for the IASO Med platform. You help patients understand their medical reports and symptoms. Always include a disclaimer that you are an AI and not a replacement for professional medical advice.

${history || ''}
User: ${message}
Model:`;

        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': apiKey
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: fullPrompt }]
                }]
            })
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            return res.status(response.status).json({ error: errData.error?.message || 'Gemini API failed' });
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            return res.status(500).json({ error: 'Empty response from Gemini' });
        }

        return res.status(200).json({ text });
    } catch (err) {
        console.error('Server-side chat error:', err);
        return res.status(500).json({ error: err.message || 'Internal server error during chat' });
    }
}
