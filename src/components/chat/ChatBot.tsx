import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2, Minus, Maximize2 } from 'lucide-react';
import { clsx } from 'clsx';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function ChatBot({ initialOpen = false }: { initialOpen?: boolean }) {
    const [isOpen, setIsOpen] = useState(initialOpen);
    const [isMinimized, setIsMinimized] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Hello! I am IASO AI, your personal health assistant. How can I help you today?',
            timestamp: new Date()
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen && !isMinimized) {
            scrollToBottom();
        }
    }, [messages, isOpen, isMinimized]);

    useEffect(() => {
        const handleOpenChat = (e: Event) => {
            const customEvent = e as CustomEvent<{ message?: string }>;
            setIsOpen(true);
            setIsMinimized(false);
            if (customEvent.detail?.message) {
                setInput(customEvent.detail.message);
            }
        };

        window.addEventListener('open-iaso-chat', handleOpenChat);
        return () => window.removeEventListener('open-iaso-chat', handleOpenChat);
    }, []);

    const getDemoResponse = (userInput: string): string => {
        const query = userInput.toLowerCase();

        if (query.includes('blood') || query.includes('test') || query.includes('lab')) {
            return "I can help you understand blood test results! Common blood tests include CBC (Complete Blood Count), lipid panels, and glucose levels. For personalized live AI insights, configure your Gemini API key in your .env file or consult with a doctor.";
        } else if (query.includes('report') || query.includes('analysis')) {
            return "I can analyze medical reports and provide patient-friendly explanations. Upload your report through the 'Upload Report' section. Configure your Gemini API key for instant AI analysis, or consult one of our verified specialists.";
        } else if (query.includes('appointment') || query.includes('doctor')) {
            return "You can book appointments with verified doctors through our platform! Go to the 'Find Doctors' section to search for specialists based on your needs.";
        } else if (query.includes('help') || query.includes('how')) {
            return "I'm IASO AI, your medical assistant! I can help you:\n• Understand medical reports\n• Explain blood test results\n• Find the right doctors\n• Book appointments\n• Answer health questions\n\nAsk me any question and I'll do my best to assist!";
        } else {
            return "Thank you for your question! I can help you navigate the IASO Med platform, explain symptoms, understand reports, and book appointments with doctors. How can I assist you right now?";
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            content: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Build conversation history for Gemini
            const conversationHistory = messages
                .map(m => `${m.role === 'user' ? 'User' : 'Model'}: ${m.content}`)
                .join('\n');

            // 1. Try secure server-side endpoint first (/api/chat)
            let serverSuccess = false;
            try {
                const apiRes = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: userMessage.content, history: conversationHistory })
                });

                if (apiRes.ok) {
                    const data = await apiRes.json();
                    if (data.text) {
                        const assistantMessage: Message = {
                            role: 'assistant',
                            content: data.text,
                            timestamp: new Date()
                        };
                        setMessages(prev => [...prev, assistantMessage]);
                        serverSuccess = true;
                    }
                }
            } catch {
                // Endpoint not available (e.g. static host), continue to client fallback
            }

            if (serverSuccess) {
                setIsLoading(false);
                return;
            }

            // 2. Client fallback with VITE_GEMINI_API_KEY if present
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

            if (!apiKey) {
                // Mock response if no API key is provided
                setTimeout(() => {
                    const mockResponse: Message = {
                        role: 'assistant',
                        content: getDemoResponse(userMessage.content),
                        timestamp: new Date()
                    };
                    setMessages(prev => [...prev, mockResponse]);
                    setIsLoading(false);
                }, 800);
                return;
            }

            const fullPrompt = `You are IASO AI, a helpful and professional medical assistant for the IASO Med platform. You help patients understand their medical reports and symptoms. Always include a disclaimer that you are an AI and not a replacement for professional medical advice.

${conversationHistory}
User: ${userMessage.content}
Model:`;

            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-goog-api-key': apiKey,
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: fullPrompt
                        }]
                    }]
                })
            });

            const data = await response.json();

            if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                const assistantMessage: Message = {
                    role: 'assistant',
                    content: data.candidates[0].content.parts[0].text,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, assistantMessage]);
            } else if (data.error) {
                throw new Error(data.error.message || 'Gemini API error');
            } else {
                throw new Error('Invalid response from AI');
            }
        } catch (error: unknown) {
            console.error('Chat error:', error);

            let errorContent = "I'm sorry, I encountered an error. Please try again later.";
            if (error instanceof Error && error.message.includes('API key')) {
                errorContent = "⚠️ API key issue detected. Please check your Gemini API configuration in .env.";
            }

            const errorMessage: Message = {
                role: 'assistant',
                content: errorContent,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-9999 font-outfit">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            height: isMinimized ? '64px' : '600px',
                            width: '400px'
                        }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={clsx(
                            "bg-white rounded-4xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden mb-4",
                            isMinimized && "rounded-full"
                        )}
                    >
                        {/* Header */}
                        <div className="p-4 bg-primary-600 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm leading-tight">IASO AI Assistant</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                        <span className="text-[10px] text-primary-100 font-semibold uppercase tracking-wider">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
                                >
                                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/80 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Messages Container */}
                                <div className="flex-1 p-4 overflow-y-auto space-y-4 no-scrollbar">
                                    {messages.map((message, index) => (
                                        <div
                                            key={index}
                                            className={clsx(
                                                "flex gap-3 max-w-[85%]",
                                                message.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                            )}
                                        >
                                            <div className={clsx(
                                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-white text-xs",
                                                message.role === 'user' ? "bg-primary-600" : "bg-gray-100 text-gray-600"
                                            )}>
                                                {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-primary-600" />}
                                            </div>
                                            <div className={clsx(
                                                "p-3.5 rounded-2xl text-sm leading-relaxed",
                                                message.role === 'user'
                                                    ? "bg-primary-600 text-white rounded-tr-none shadow-sm"
                                                    : "bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100 whitespace-pre-line"
                                            )}>
                                                {message.content}
                                                <div className={clsx(
                                                    "text-[9px] mt-1 text-right",
                                                    message.role === 'user' ? "text-primary-200" : "text-gray-400"
                                                )}>
                                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex gap-3 max-w-[85%] mr-auto items-center">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-primary-600">
                                                <Bot className="w-4 h-4" />
                                            </div>
                                            <div className="p-4 bg-gray-50 rounded-2xl rounded-tl-none border border-gray-100">
                                                <Loader2 className="w-4 h-4 text-primary-600 animate-spin" />
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Footer / Input */}
                                <div className="p-3 bg-white border-t border-gray-100">
                                    <form
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            handleSend();
                                        }}
                                        className="flex items-center gap-2"
                                    >
                                        <input
                                            type="text"
                                            placeholder="Ask anything about reports or symptoms..."
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 font-medium"
                                        />
                                        <button
                                            type="submit"
                                            disabled={!input.trim() || isLoading}
                                            className="p-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-md shadow-primary-500/20"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </form>
                                    <p className="text-[10px] text-gray-400 text-center mt-2 font-medium">
                                        AI may make errors. Always consult a licensed healthcare professional.
                                    </p>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {!isOpen && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 bg-gradient-to-tr from-primary-600 to-primary-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all border-2 border-white/20"
                >
                    <MessageCircle className="w-6 h-6" />
                </motion.button>
            )}
        </div>
    );
}
