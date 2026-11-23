import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const ChatBot = lazy(() => import('../chat/ChatBot'));

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1 pt-16">
                <Outlet />
            </main>
            <Footer />
            <Suspense fallback={null}>
                <ChatBot />
            </Suspense>
        </div>
    );
}
