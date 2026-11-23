import { lazy, Suspense, useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

const ChatBot = lazy(() => import('../chat/ChatBot'));

export default function Layout() {
    const [isChatLoaded, setIsChatLoaded] = useState(false);

    useEffect(() => {
        const handleOpenChat = () => setIsChatLoaded(true);
        window.addEventListener('open-iaso-chat', handleOpenChat);
        return () => window.removeEventListener('open-iaso-chat', handleOpenChat);
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1 pt-16">
                <Outlet />
            </main>
            <Footer />
            {isChatLoaded ? (
                <Suspense fallback={null}>
                    <ChatBot />
                </Suspense>
            ) : (
                <div className="fixed bottom-6 right-6 z-50">
                    <button
                        onClick={() => {
                            setIsChatLoaded(true);
                            setTimeout(() => {
                                window.dispatchEvent(new CustomEvent('open-iaso-chat'));
                            }, 50);
                        }}
                        className="w-14 h-14 bg-gradient-to-tr from-primary-600 to-primary-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-primary-500/30 hover:shadow-primary-500/50 transition-all border-2 border-white/20 hover:scale-105 cursor-pointer"
                        aria-label="Open Health Assistant"
                        title="Chat with IASO AI"
                    >
                        <MessageCircle className="w-6 h-6" />
                    </button>
                </div>
            )}
        </div>
    );
}
