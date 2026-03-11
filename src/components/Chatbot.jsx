import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const Chatbot = () => {
    // Session Management State
    const { user, refreshProfile } = useAuth();
    const [sessions, setSessions] = useState(() => {
        const saved = localStorage.getItem('chatSessions');
        return saved ? JSON.parse(saved) : [];
    });

    const [currentSessionId, setCurrentSessionId] = useState(() => {
        return localStorage.getItem('currentSessionId') || null;
    });

    const [isOpen, setIsOpen] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    // Initial default message
    const defaultMessages = [
        { text: "Hello! I'm your African Oracle Mentor. 🌍 Select a topic to get started.", sender: 'bot' }
    ];

    // Lazy initialization of active chat state based on current session
    const [messages, setMessages] = useState(() => {
        const sid = localStorage.getItem('currentSessionId');
        if (sid) {
            const savedSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
            const active = savedSessions.find(s => s.id === sid);
            if (active) return active.messages;
        }
        return defaultMessages;
    });

    const [country, setCountry] = useState(() => {
        const sid = localStorage.getItem('currentSessionId');
        if (sid) {
            const savedSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
            const active = savedSessions.find(s => s.id === sid);
            if (active) return active.country;
        }
        return "";
    });

    const [topic, setTopic] = useState(() => {
        const sid = localStorage.getItem('currentSessionId');
        if (sid) {
            const savedSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
            const active = savedSessions.find(s => s.id === sid);
            if (active) return active.topic;
        }
        return "";
    });

    const [challengerStep, setChallengerStep] = useState(0);
    const [ageMode, setAgeMode] = useState("adults");
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Derived State for Monetization
    const isAiUnlimited = user?.isElite ||
        (user?.aiUnlimitedExpires && new Date(user.aiUnlimitedExpires) > new Date()) ||
        (user?.eliteExpires && new Date(user.eliteExpires) > new Date());

    // PERSISTENCE: Sync history from DB on mount
    useEffect(() => {
        const syncHistory = async () => {
            if (user) {
                try {
                    const token = localStorage.getItem('token');
                    const history = await api.getAiHistory(token);
                    if (history && history.length > 0) {
                        const formatted = history.flatMap(h => [
                            { text: h.message, sender: 'user' },
                            { text: h.response, sender: 'bot' }
                        ]);
                        setMessages([...defaultMessages, ...formatted]);
                    }
                } catch (err) {
                    console.error("Failed to sync AI history:", err);
                }
            }
        };
        syncHistory();
    }, [user]);

    // Save session data whenever relevant state changes
    useEffect(() => {
        if (!currentSessionId && messages.length <= 1 && !country && !topic) return;

        let sid = currentSessionId;
        if (!sid) {
            sid = Date.now().toString();
            setCurrentSessionId(sid);
            localStorage.setItem('currentSessionId', sid);
        }

        const newSession = {
            id: sid,
            messages,
            country,
            topic,
            challengerStep,
            lastUpdated: new Date().toISOString(),
            snippet: messages.find(m => m.sender === 'user')?.text || messages[0].text
        };

        setSessions(prev => {
            const filtered = prev.filter(s => s.id !== sid);
            const updated = [newSession, ...filtered];
            localStorage.setItem('chatSessions', JSON.stringify(updated));
            return updated;
        });
    }, [messages, country, topic, challengerStep, currentSessionId]);

    const startNewChat = () => {
        setCurrentSessionId(null);
        localStorage.removeItem('currentSessionId');
        setMessages(defaultMessages);
        setCountry("");
        setTopic("");
        setChallengerStep(0);
        setShowHistory(false);
    };

    const resetServerHistory = async () => {
        if (!user) return;
        if (!window.confirm("Are you sure you want to clear your AI Mentor's memory? This cannot be undone.")) return;

        try {
            const token = localStorage.getItem('token');
            await api.clearAiHistory(token);
            setMessages(defaultMessages);
            setSessions([]);
            localStorage.removeItem('chatSessions');
            setShowHistory(false);
        } catch (err) {
            console.error("Failed to clear AI history:", err);
        }
    };

    const loadSession = (session) => {
        setCurrentSessionId(session.id);
        localStorage.setItem('currentSessionId', session.id);
        setMessages(session.messages);
        setCountry(session.country);
        setTopic(session.topic);
        setChallengerStep(session.challengerStep || 0);
        setShowHistory(false);
    };

    const deleteSession = (sessionId, e) => {
        e.stopPropagation();
        const updated = sessions.filter(s => s.id !== sessionId);
        setSessions(updated);
        localStorage.setItem('chatSessions', JSON.stringify(updated));
        if (currentSessionId === sessionId) {
            startNewChat();
        }
    };

    const countries = ["Nigeria", "Ghana", "Kenya", "South Africa", "Uganda", "Rwanda", "Tanzania"];
    const topics = [
        { id: 'rights', label: '⚖️ Legal Rights', prompt: 'legal rights' },
        { id: 'land', label: '🏠 Land & Property', prompt: 'land titles' },
        { id: 'chat', label: '💬 Guidance', prompt: 'general guidance' },
        { id: 'invest', label: '📈 Investment', prompt: 'financial growth' }
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;
        if (!country || !topic) return;

        const userMsg = input;
        setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
        setInput("");
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await api.sendAiChat(token, {
                message: userMsg,
                ageMode: ageMode,
                topic: topic,
                country: country
            });

            setMessages(prev => [...prev, { text: res.response, sender: 'bot' }]);
            refreshProfile();
        } catch (error) {
            console.error("AI Mentor Error:", error);
            setMessages(prev => [...prev, {
                text: "My wisdom is temporarily unavailable. Please try again later.",
                sender: 'bot'
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed', bottom: '2rem', right: '2rem',
                    width: '60px', height: '60px', borderRadius: '30px',
                    backgroundColor: 'var(--color-primary)', color: '#fff',
                    border: 'none', boxShadow: '0 4px 15px rgba(0, 200, 81, 0.3)',
                    cursor: 'pointer', zIndex: 1000, fontSize: '1.5rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'transform 0.3s ease'
                }}
            >
                {isOpen ? '✕' : '🌍'}
            </button>

            {isOpen && (
                <div style={{
                    position: 'fixed', bottom: '7rem', right: '2rem',
                    width: 'min(400px, calc(100vw - 4rem))',
                    height: 'min(700px, calc(100vh - 10rem))',
                    backgroundColor: '#0a0a0a', borderRadius: '1.5rem',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
                    display: 'flex', flexDirection: 'column',
                    zIndex: 1000, overflow: 'hidden', border: '1px solid #333'
                }}>
                    {/* HEADER */}
                    <div style={{ padding: '1.25rem', background: '#121212', borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🌍</div>
                            <h3 style={{ margin: 0, fontSize: '1rem', color: '#fff' }}>African Oracle</h3>
                        </div>
                        <button onClick={() => setShowHistory(!showHistory)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>{showHistory ? '💬' : '📜'}</button>
                    </div>

                    {/* QUOTA BAR */}
                    {!isAiUnlimited && (
                        <div style={{ height: '3px', width: '100%', backgroundColor: '#111' }}>
                            <div style={{
                                height: '100%', width: `${Math.min((user?.aiMessagesLeft || 0) * 10, 100)}%`,
                                backgroundColor: (user?.aiMessagesLeft || 0) <= 3 ? '#ff4444' : 'var(--color-primary)',
                                transition: 'width 0.5s ease'
                            }} />
                        </div>
                    )}

                    <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        {showHistory ? (
                            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                                {sessions.map(s => (
                                    <div key={s.id} onClick={() => loadSession(s)} style={{ padding: '0.8rem', borderRadius: '10px', backgroundColor: '#111', marginBottom: '0.5rem', cursor: 'pointer', border: '1px solid #222' }}>
                                        <div style={{ color: '#eee', fontSize: '0.85rem' }}>{s.snippet}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>
                                <div style={{ padding: '0.75rem', borderBottom: '1px solid #222', backgroundColor: '#0d0d0d' }}>
                                    {!country ? (
                                        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
                                            {countries.map(c => (
                                                <button key={c} onClick={() => setCountry(c)} style={{ padding: '0.4rem 0.8rem', borderRadius: '20px', backgroundColor: '#111', color: '#fff', border: '1px solid #333', fontSize: '0.75rem' }}>{c}</button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                                            <span style={{ color: '#fff' }}>📍 {country} {topic && `• ${topics.find(t => t.id === topic)?.label}`}</span>
                                            <button onClick={() => { setCountry(""); setTopic(""); }} style={{ color: 'var(--color-primary)', background: 'none', border: 'none' }}>Reset</button>
                                        </div>
                                    )}
                                    {country && !topic && (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.75rem' }}>
                                            {topics.map(t => (
                                                <button key={t.id} onClick={() => setTopic(t.id)} style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: '#111', color: '#eee', border: '1px solid #333', fontSize: '0.8rem' }}>{t.label}</button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {messages.map((msg, i) => (
                                        <div key={i} style={{
                                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                            backgroundColor: msg.sender === 'user' ? 'var(--color-primary)' : '#1a1a1a',
                                            padding: '0.8rem 1rem', borderRadius: '12px', maxWidth: '85%', fontSize: '0.9rem', color: '#fff'
                                        }}>{msg.text}</div>
                                    ))}
                                    {loading && <div style={{ color: '#666', fontSize: '0.8rem' }}>Oracle is consulting the stars...</div>}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div style={{ padding: '1.25rem', borderTop: '1px solid #222' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <input
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                            placeholder={topic ? "Speak to the Oracle..." : "Select a topic..."}
                                            style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', border: '1px solid #333', backgroundColor: '#111', color: '#fff', outline: 'none' }}
                                        />
                                        <button onClick={handleSend} style={{ width: '45px', height: '45px', borderRadius: '12px', backgroundColor: 'var(--color-primary)', border: 'none', color: '#fff' }}>➤</button>
                                    </div>
                                    {!isAiUnlimited && (
                                        <div style={{ marginTop: '0.8rem', textAlign: 'center', fontSize: '0.7rem', color: '#666' }}>
                                            {user?.aiMessagesLeft} messages remaining. <a href="#finance" style={{ color: 'var(--color-primary)' }}>Get Unlimited</a>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;
