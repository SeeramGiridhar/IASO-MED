import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2, Minus, Maximize2 } from 'lucide-react';
import { clsx } from 'clsx';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
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
        const handleOpenChat = (e: any) => {
            setIsOpen(true);
            setIsMinimized(false);
            if (e.detail?.message) {
                setInput(e.detail.message);
            }
        };

        window.addEventListener('open-iaso-chat', handleOpenChat);
        return () => window.removeEventListener('open-iaso-chat', handleOpenChat);
    }, []);

    const getDemoResponse = (userInput: string): string => {
        const input = userInput.toLowerCase();

        if (input.includes('blood') || input.includes('test') || input.includes('lab')) {
            return "I can help you understand blood test results! In a real scenario, I would analyze your specific values and explain what they mean. Common blood tests include CBC (Complete Blood Count), cholesterol panels, and glucose levels. For personalized insights, please add OpenAI credits to enable AI analysis or consult with a doctor.";
        } else if (input.includes('report') || input.includes('analysis')) {
            return "I can analyze medical reports and provide patient-friendly explanations. Upload your report through the 'Upload Report' section, and once OpenAI credits are added, I'll provide detailed AI-powered insights. For now, you can view your uploaded reports in the Reports section.";
        } else if (input.includes('appointment') || input.includes('doctor')) {
            return "You can book appointments with doctors through our platform! Go to the 'Find Doctors' section to search for specialists based on your needs. I'd provide personalized doctor recommendations with full AI capabilities enabled.";
        } else if (input.includes('help') || input.includes('how')) {
            return "I'm IASO AI, your medical assistant! I can help you:\n• Understand medical reports\n• Explain blood test results\n• Find the right doctors\n• Book appointments\n• Answer health questions\n\nNote: Full AI analysis requires OpenAI credits. Please add credits at platform.openai.com or ask your questions and I'll provide helpful guidance!";
        } else {
            return "Thank you for your question! I'm currently in demo mode as the OpenAI API quota has been exceeded. To enable full AI-powered responses, please add credits to your OpenAI account. In the meantime, I can still help you navigate the IASO Med platform, upload reports, and book appointments with doctors. How else can I assist you?";
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
            // Check for OpenAI        try {
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
                }, 1000);
                return;
            }

            // Build conversation history for Gemini
            const conversationHistory = messages
                .map(m => `${m.role === 'user' ? 'User' : 'Model'}: ${m.content}`)
                .join('\n');

            const fullPrompt = `You are IASO AI, a helpful and professional medical assistant for the IASO Med platform. You help patients understand their medical reports and symptoms. Always include a disclaimer that you are an AI and not a replacement for professional medical advice.

${conversationHistory}
User: ${userMessage.content}
Model:`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
        } catch (error: any) {
            console.error('Chat error:', error);

            // Provide helpful error message
            let errorContent = "I'm sorry, I encountered an error. Please try again later.";

            if (error?.message?.includes('API key')) {
                errorContent = "⚠️ API key issue detected. Please check your Gemini API configuration.";
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
                                    <h3 className="font-bold text-sm">IASO AI Assistant</h3>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                                    {messages.map((m, i) => (
                                        <div
                                            key={i}
                                            className={clsx(
                                                "flex group",
                                                m.role === 'user' ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            <div className={clsx(
                                                "max-w-[85%] flex gap-3",
                                                m.role === 'user' && "flex-row-reverse"
                                            )}>
                                                <div className={clsx(
                                                    "w-8 h-8 rounded-xl shrink-0 flex items-center justify-center shadow-sm",
                                                    m.role === 'user' ? "bg-primary-100 text-primary-600" : "bg-white text-gray-400 border border-gray-100"
                                                )}>
                                                    {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                                </div>
                                                <div className={clsx(
                                                    "p-4 rounded-2xl text-sm leading-relaxed",
                                                    m.role === 'user'
                                                        ? "bg-primary-600 text-white rounded-tr-none shadow-lg shadow-primary-500/20"
                                                        : "bg-white text-gray-700 border border-gray-100 rounded-tl-none shadow-sm"
                                                )}>
                                                    {m.content}
                                                    <div className={clsx(
                                                        "text-[10px] mt-2 opacity-50",
                                                        m.role === 'user' ? "text-white" : "text-gray-400"
                                                    )}>
                                                        {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3">
                                                <Loader2 className="w-4 h-4 text-primary-500 animate-spin" />
                                                <span className="text-xs text-gray-400 font-medium tracking-wide italic">IASO is thinking...</span>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="p-4 bg-white border-t border-gray-100">
                                    <div className="relative flex items-center">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                            placeholder="Ask me anything..."
                                            className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border-2 border-transparent focus:border-primary-100 focus:bg-white rounded-2xl outline-none transition-all text-sm font-medium"
                                        />
                                        <button
                                            onClick={handleSend}
                                            disabled={!input.trim() || isLoading}
                                            className="absolute right-2 p-2 bg-primary-600 text-white rounded-xl shadow-lg shadow-primary-500/30 hover:bg-primary-700 disabled:bg-gray-200 disabled:shadow-none transition-all"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-center text-gray-400 mt-3 font-medium tracking-wide">
                                        Powered by IASO GPT-4o • Medical AI Assistant
                                    </p>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                    setIsOpen(true);
                    setIsMinimized(false);
                }}
                className={clsx(
                    "w-16 h-16 bg-primary-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-500/40 relative group overflow-hidden",
                    isOpen && "hidden"
                )}
            >
                <div className="absolute inset-0 bg-linear-to-br from-white/20 to-transparent pointer-events-none" />
                <MessageCircle className="w-7 h-7" />
                <div className="absolute top-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full m-3" />
            </motion.button>
        </div>
    );
}
