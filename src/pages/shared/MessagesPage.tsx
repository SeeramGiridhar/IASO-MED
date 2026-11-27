import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    MessageSquare,
    Send,
    Loader2,
    AlertCircle,
    User as UserIcon,
    Stethoscope,
    Check,
    CheckCheck,
    ChevronUp,
    ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface ConversationItem {
    id: string;
    patient_id: string;
    doctor_id: string;
    last_message_at: string;
    last_message_preview: string | null;
    partnerName: string;
    partnerRoleLabel: string;
    partnerAvatar: string | null;
    partnerId: string;
}

interface MessageItem {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    is_read: boolean;
    created_at: string;
}

const PAGE_SIZE = 20;

export default function MessagesPage() {
    const { user } = useAuth();
    const { partnerId } = useParams<{ partnerId?: string }>();
    const [conversations, setConversations] = useState<ConversationItem[]>([]);
    const [activeConvId, setActiveConvId] = useState<string | null>(null);
    const [messages, setMessages] = useState<MessageItem[]>([]);
    const [hasMoreMessages, setHasMoreMessages] = useState(false);
    const [isLoadingConvs, setIsLoadingConvs] = useState(true);
    const [isLoadingMsgs, setIsLoadingMsgs] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [draft, setDraft] = useState('');
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const isDoctor = user?.role === 'doctor';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const loadConversations = useCallback(async () => {
        if (!user) return;
        setIsLoadingConvs(true);
        setError(null);
        try {
            // If partnerId is provided in URL, ensure conversation exists (or surface appointment guard message)
            if (partnerId) {
                const patId = isDoctor ? partnerId : user.id;
                const docId = isDoctor ? user.id : partnerId;

                const { data: existingConv } = await supabase
                    .from('conversations')
                    .select('id')
                    .eq('patient_id', patId)
                    .eq('doctor_id', docId)
                    .maybeSingle();

                if (!existingConv) {
                    const { data: createdConv, error: createErr } = await supabase
                        .from('conversations')
                        .insert({ patient_id: patId, doctor_id: docId })
                        .select('id')
                        .single();

                    if (createErr) {
                        setError('Direct messaging is available once you have an appointment booked together.');
                    } else if (createdConv) {
                        setActiveConvId(createdConv.id);
                    }
                } else {
                    setActiveConvId(existingConv.id);
                }
            }

            const { data, error: convErr } = await supabase
                .from('conversations')
                .select(`
                    id,
                    patient_id,
                    doctor_id,
                    last_message_at,
                    last_message_preview,
                    patient:patient_id ( id, full_name, avatar_url ),
                    doctor:doctor_id ( id, full_name, avatar_url )
                `)
                .order('last_message_at', { ascending: false });

            if (convErr) throw convErr;

            const mapped: ConversationItem[] = (data || []).map((row) => {
                const pat = Array.isArray(row.patient) ? row.patient[0] : row.patient;
                const doc = Array.isArray(row.doctor) ? row.doctor[0] : row.doctor;
                const partner = isDoctor ? pat : doc;
                return {
                    id: row.id,
                    patient_id: row.patient_id,
                    doctor_id: row.doctor_id,
                    last_message_at: row.last_message_at,
                    last_message_preview: row.last_message_preview,
                    partnerName: partner?.full_name || (isDoctor ? 'Patient' : 'Doctor'),
                    partnerRoleLabel: isDoctor ? 'Patient' : 'Specialist Doctor',
                    partnerAvatar: partner?.avatar_url || null,
                    partnerId: isDoctor ? row.patient_id : row.doctor_id,
                };
            });

            setConversations(mapped);
            setActiveConvId((prev) => prev || mapped[0]?.id || null);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Unable to load conversations.';
            setError(msg);
        } finally {
            setIsLoadingConvs(false);
        }
    }, [user, partnerId, isDoctor]);

    useEffect(() => {
        loadConversations();
    }, [loadConversations]);

    const markIncomingAsRead = useCallback(
        async (convId: string) => {
            if (!user) return;
            await supabase
                .from('messages')
                .update({ is_read: true })
                .eq('conversation_id', convId)
                .neq('sender_id', user.id)
                .eq('is_read', false);
        },
        [user]
    );

    const loadMessages = useCallback(
        async (convId: string) => {
            setIsLoadingMsgs(true);
            try {
                const { data, error: msgErr } = await supabase
                    .from('messages')
                    .select('id, conversation_id, sender_id, content, is_read, created_at')
                    .eq('conversation_id', convId)
                    .order('created_at', { ascending: false })
                    .limit(PAGE_SIZE);

                if (msgErr) throw msgErr;
                const chronological = [...(data || [])].reverse();
                setMessages(chronological);
                setHasMoreMessages((data || []).length === PAGE_SIZE);
                await markIncomingAsRead(convId);
                setTimeout(scrollToBottom, 50);
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : 'Failed to load messages.';
                setError(msg);
            } finally {
                setIsLoadingMsgs(false);
            }
        },
        [markIncomingAsRead]
    );

    const loadOlderMessages = async () => {
        if (!activeConvId || messages.length === 0 || isLoadingMore) return;
        setIsLoadingMore(true);
        try {
            const oldestTimestamp = messages[0].created_at;
            const { data, error: msgErr } = await supabase
                .from('messages')
                .select('id, conversation_id, sender_id, content, is_read, created_at')
                .eq('conversation_id', activeConvId)
                .lt('created_at', oldestTimestamp)
                .order('created_at', { ascending: false })
                .limit(PAGE_SIZE);

            if (msgErr) throw msgErr;
            const olderChronological = [...(data || [])].reverse();
            setMessages((prev) => [...olderChronological, ...prev]);
            setHasMoreMessages((data || []).length === PAGE_SIZE);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Failed to load earlier messages.';
            setError(msg);
        } finally {
            setIsLoadingMore(false);
        }
    };

    useEffect(() => {
        if (!activeConvId) {
            setMessages([]);
            return;
        }
        loadMessages(activeConvId);

        const channel = supabase
            .channel(`messages:${activeConvId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${activeConvId}`,
                },
                (payload) => {
                    const newMsg = payload.new as MessageItem;
                    setMessages((prev) => {
                        if (prev.some((m) => m.id === newMsg.id)) return prev;
                        return [...prev, newMsg];
                    });
                    setConversations((prev) =>
                        prev.map((c) =>
                            c.id === activeConvId
                                ? { ...c, last_message_at: newMsg.created_at, last_message_preview: newMsg.content.slice(0, 120) }
                                : c
                        )
                    );
                    if (newMsg.sender_id !== user?.id) {
                        markIncomingAsRead(activeConvId);
                    }
                    setTimeout(scrollToBottom, 50);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [activeConvId, loadMessages, markIncomingAsRead, user?.id]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !activeConvId) return;
        const text = draft.trim();
        if (!text || isSending) return;

        setIsSending(true);
        setDraft('');
        try {
            const { data, error: sendErr } = await supabase
                .from('messages')
                .insert({
                    conversation_id: activeConvId,
                    sender_id: user.id,
                    content: text,
                })
                .select('id, conversation_id, sender_id, content, is_read, created_at')
                .single();

            if (sendErr) throw sendErr;
            if (data) {
                setMessages((prev) => (prev.some((m) => m.id === data.id) ? prev : [...prev, data]));
                setConversations((prev) =>
                    prev.map((c) =>
                        c.id === activeConvId
                            ? { ...c, last_message_at: data.created_at, last_message_preview: data.content.slice(0, 120) }
                            : c
                    )
                );
                setTimeout(scrollToBottom, 50);
            }
        } catch (err: unknown) {
            setDraft(text);
            const msg = err instanceof Error ? err.message : 'Unable to send message.';
            setError(msg);
        } finally {
            setIsSending(false);
        }
    };

    const activeConversation = conversations.find((c) => c.id === activeConvId) || null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-outfit">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">Direct Messages</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Secure clinical communication between {isDoctor ? 'you and your patients' : 'you and your booked specialists'}.
                    </p>
                </div>
                <Link
                    to={isDoctor ? '/doctor/dashboard' : '/patient/doctors'}
                    className="self-start sm:self-auto px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    {isDoctor ? 'Back to Dashboard' : 'Find Doctors'}
                </Link>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-800 text-sm font-medium">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden grid lg:grid-cols-12 min-h-[600px]">
                {/* Left Sidebar: Conversations */}
                <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col">
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                            Active Threads ({conversations.length})
                        </p>
                    </div>

                    {isLoadingConvs ? (
                        <div className="flex-1 flex items-center justify-center p-10">
                            <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                            <MessageSquare className="w-10 h-10 text-gray-200 mb-3" />
                            <p className="text-sm font-bold text-gray-800">No conversations yet</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {isDoctor
                                    ? 'Patients with booked appointments can message you here.'
                                    : 'Book an appointment with a verified doctor to start messaging.'}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100 overflow-y-auto max-h-[540px]">
                            {conversations.map((conv) => (
                                <button
                                    key={conv.id}
                                    onClick={() => setActiveConvId(conv.id)}
                                    className={`w-full p-4 flex items-start gap-3 text-left transition-colors ${
                                        conv.id === activeConvId ? 'bg-primary-50/70 border-l-4 border-primary-600' : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="w-11 h-11 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center shrink-0">
                                        {isDoctor ? <UserIcon className="w-5 h-5" /> : <Stethoscope className="w-5 h-5" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-sm font-bold text-gray-900 truncate">{conv.partnerName}</p>
                                            <span className="text-[10px] text-gray-400 shrink-0">
                                                {new Date(conv.last_message_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-[11px] font-semibold text-primary-600">{conv.partnerRoleLabel}</p>
                                        <p className="text-xs text-gray-500 truncate mt-0.5">
                                            {conv.last_message_preview || 'Start the conversation...'}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Pane: Chat Messages */}
                <div className="lg:col-span-8 flex flex-col bg-gray-50/30">
                    {!activeConversation ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                            <MessageSquare className="w-12 h-12 text-gray-200 mb-3" />
                            <p className="text-base font-bold text-gray-700">Select a conversation</p>
                            <p className="text-xs text-gray-400 mt-1">Choose a thread on the left to view and send messages.</p>
                        </div>
                    ) : (
                        <>
                            {/* Thread Header */}
                            <div className="p-4 sm:px-6 bg-white border-b border-gray-100 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center">
                                        {isDoctor ? <UserIcon className="w-5 h-5" /> : <Stethoscope className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{activeConversation.partnerName}</p>
                                        <p className="text-[11px] text-gray-500">{activeConversation.partnerRoleLabel}</p>
                                    </div>
                                </div>
                                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-100 rounded-full text-[11px] font-medium">
                                    <ShieldAlert className="w-3.5 h-3.5" />
                                    Not for medical emergencies
                                </span>
                            </div>

                            {/* Messages List */}
                            <div className="flex-1 p-4 sm:p-6 overflow-y-auto max-h-[430px] space-y-3">
                                {hasMoreMessages && (
                                    <div className="text-center pb-2">
                                        <button
                                            onClick={loadOlderMessages}
                                            disabled={isLoadingMore}
                                            className="inline-flex items-center gap-1 px-4 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-50"
                                        >
                                            {isLoadingMore ? <Loader2 className="w-3 h-3 animate-spin" /> : <ChevronUp className="w-3 h-3" />}
                                            Load earlier messages
                                        </button>
                                    </div>
                                )}

                                {isLoadingMsgs ? (
                                    <div className="py-20 flex justify-center">
                                        <Loader2 className="w-7 h-7 text-primary-500 animate-spin" />
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="py-16 text-center text-xs text-gray-400">
                                        No messages yet. Say hello to begin your consultation thread.
                                    </div>
                                ) : (
                                    messages.map((msg) => {
                                        const isMine = msg.sender_id === user?.id;
                                        return (
                                            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                                <div
                                                    className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                                                        isMine
                                                            ? 'bg-primary-600 text-white rounded-br-sm'
                                                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                                                    }`}
                                                >
                                                    <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
                                                    <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${isMine ? 'text-primary-100' : 'text-gray-400'}`}>
                                                        <span>
                                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        {isMine && (msg.is_read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />)}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Bar */}
                            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
                                <input
                                    type="text"
                                    value={draft}
                                    onChange={(e) => setDraft(e.target.value)}
                                    maxLength={4000}
                                    placeholder={`Write a message to ${activeConversation.partnerName}...`}
                                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!draft.trim() || isSending}
                                    className="px-5 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                                >
                                    {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    <span className="hidden sm:inline">Send</span>
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
