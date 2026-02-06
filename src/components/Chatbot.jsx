import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getLegalAdvice } from '../data/legalRights';
import DocumentDrafter from './DocumentDrafter';

// Initialize Gemini API (Replace with env var in production)
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const Chatbot = () => {
    // Session Management State
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
        { text: "Hello! I'm your MindNest Consultant. 🌍 Select a topic to get started.", sender: 'bot' }
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

    const [challengerStep, setChallengerStep] = useState(() => {
        const sid = localStorage.getItem('currentSessionId');
        if (sid) {
            const savedSessions = JSON.parse(localStorage.getItem('chatSessions') || '[]');
            const active = savedSessions.find(s => s.id === sid);
            if (active) return active.challengerStep || 0;
        }
        return 0;
    });

    const [ageMode, setAgeMode] = useState("adults");
    const [isLoading, setIsLoading] = useState(false);
    const [showDocumentDrafter, setShowDocumentDrafter] = useState(false);
    const messagesEndRef = useRef(null);

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

    const [input, setInput] = useState("");

    const countries = ["Nigeria", "Ghana", "Kenya", "South Africa", "Uganda", "Rwanda", "Tanzania"];
    const topics = [
        { id: 'rights', label: '⚖️ Legal Rights', prompt: 'legal rights and police procedures' },
        { id: 'land', label: '🏠 Land & Property', prompt: 'land titles, verification, and property scams' },
        { id: 'traffic', label: '🚦 Traffic Safety', prompt: 'traffic laws, road safety, and police stops' },
        { id: 'invest', label: '📈 Investment', prompt: 'real estate investment and financial growth' }
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        if (!country) {
            setMessages(prev => [...prev, { text: "Please select a country first! 🏳️", sender: 'bot' }]);
            return;
        }
        if (!topic) {
            setMessages(prev => [...prev, { text: "Please select a topic above! 👆", sender: 'bot' }]);
            return;
        }

        const userMsg = input;
        setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
        setInput("");
        setIsLoading(true);

        // --- CHALLENGER SCRIPT LOGIC (Victor's Version) ---
        if ((topic === 'invest' || topic === 'land') && ageMode === 'adults') {

            // Start the script if keywords match or if already in flow
            if (challengerStep === 0 && (userMsg.toLowerCase().includes('buy') || userMsg.toLowerCase().includes('invest') || userMsg.toLowerCase().includes('land'))) {
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        text: "Before we talk about the property itself, I want to understand what your long-term plan is. Are you looking for safety, appreciation, steady cash flow, or a mix of all three?",
                        sender: 'bot'
                    }]);
                    setChallengerStep(1); // Move to Step 1 (Warm Up)
                    setIsLoading(false);
                }, 1000);
                return;
            }

            if (challengerStep > 0) {
                setTimeout(() => {
                    let response = "";
                    let nextStep = challengerStep + 1;

                    switch (challengerStep) {
                        case 1: // Reframe
                            response = "Interesting choice. Most people focus only on the building they’re buying. But what actually determines whether they gain or lose money is something different… it’s the **verification risk** — the land documents and the development history behind the property.";
                            break;
                        case 2: // Insight
                            response = "From the cases I’ve handled, over 60% of property problems don’t come from the building — they come from the land history: wrong layout approvals, family disputes, or faulty excision. These don't show up in a site visit. They only show up when someone checks the backend.";
                            break;
                        case 3: // Cost
                            response = "When people skip proper verification, the property feels cheaper — until the government marks it, or a family comes with a court injunction. Then they realize the ‘cheap’ property actually costs 3x more in stress and correction.";
                            break;
                        case 4: // Solution
                            response = "That’s why every property I recommend has passed through a **3-layer verification process**: \n1. Document authenticity check\n2. Land registry cross-verification\n3. Development & boundary history review.\n\nSo you’re getting protection built into the deal.";
                            break;
                        case 5: // Lens
                            response = "Now, look at this unit through that lens: \n• The excision file is clean\n• The survey matches coordinates\n• No overlapping claims\n\nThat’s why this one is positioned for safe growth.";
                            break;
                        case 6: // CTA
                            response = "If this aligns with what you’re looking for — **safety first, profit next** — then we can move forward and reserve it. If not, no pressure. I would rather you buy the right property than a fast one.\n\nWould you like to proceed with **MindNest Realty**?";
                            nextStep = 0; // End of script
                            break;
                        default:
                            response = "Let me know if you have any other questions!";
                            nextStep = 0;
                    }

                    setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
                    setChallengerStep(nextStep);
                    setIsLoading(false);
                }, 1500); // Slight delay for natural feel
                return;
            }
        }


        // --- STANDARD GEMINI AI ---
        try {
            // Content Safety Filter
            const inappropriateKeywords = ['sex', 'nude', 'porn', 'xxx', 'naked', 'explicit'];
            const isInappropriate = inappropriateKeywords.some(keyword => userMsg.toLowerCase().includes(keyword));

            if (isInappropriate) {
                setMessages(prev => [...prev, {
                    text: "I'm here to help with educational topics like legal rights, property verification, traffic safety, and investment advice. Please keep questions appropriate and on-topic.",
                    sender: 'bot'
                }]);
                setIsLoading(false);
                return;
            }

            if (!API_KEY) {
                // Improved Mock response
                setTimeout(() => {
                    let mockResponse = `**${country} - ${topics.find(t => t.id === topic)?.label}**\n\n`;

                    if (topic === 'land') {
                        mockResponse += "Key points about land verification:\n\n1. **Certificate of Occupancy (C of O)**: Always verify it's genuine at the Land Registry\n2. **Survey Plan**: Must match current coordinates\n3. **Payment**: Never pay cash - use bank transfers for accountability\n4. **Due Diligence**: Check for family disputes or government acquisition\n\nNeed help verifying a specific property? Let me know!";
                    } else if (topic === 'traffic') {
                        mockResponse += "Your rights at traffic stops:\n\n1. **Stop safely**: Pull over when signaled\n2. **Show documents**: License, registration, insurance\n3. **No bribes**: Politely decline and ask for a ticket\n4. **Record details**: Officer's name, badge number, time\n\nBeen stopped unfairly? I can guide you through the complaint process.";
                    } else if (topic === 'invest') {
                        mockResponse += "Smart investment principles:\n\n1. **Diversify**: Don't put all funds in one asset\n2. **Verify**: Especially for real estate - check documents\n3. **Long-term**: Best returns come from patience\n4. **Professional advice**: Consult verified experts\n\nInterested in real estate investment? I can explain the verification process.";
                    } else {
                        // Use legal database for Legal Rights topic
                        const legalInfo = getLegalAdvice(country, 'arrest');
                        if (legalInfo) {
                            mockResponse = legalInfo;
                        } else {
                            mockResponse += "Your legal rights:\n\n1. **Right to silence**: You don't have to answer all questions\n2. **Right to a lawyer**: Request one if arrested\n3. **No torture**: Report any abuse immediately\n4. **Fair trial**: You're innocent until proven guilty\n\nFacing a legal issue? Tell me more so I can provide specific guidance.";
                        }
                    }

                    setMessages(prev => [...prev, { text: mockResponse, sender: 'bot' }]);
                    setIsLoading(false);
                }, 1000);
                return;
            }

            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            let systemPrompt = `You are a helpful assistant for ${country}. Topic: ${topics.find(t => t.id === topic).prompt}. `;

            if (ageMode === 'kids') systemPrompt += "Explain like I'm 10 years old. Use emojis. Keep it simple and safe. ";
            else if (ageMode === 'teens') systemPrompt += "Explain for a teenager. Be relatable, use cool examples. ";
            else systemPrompt += "Be professional, detailed, and practical. ";

            systemPrompt += `User Question: "${userMsg}". Disclaimer: Not legal/financial advice.`;

            console.log("Sending to Gemini:", systemPrompt);

            const result = await model.generateContent(systemPrompt);
            const response = await result.response;
            const text = response.text();

            console.log("Gemini response:", text);
            setMessages(prev => [...prev, { text: text, sender: 'bot' }]);
        } catch (error) {
            console.error("Gemini API Error:", error);
            let errorMsg = "Connection error. ";
            if (error.message?.includes("API_KEY")) {
                errorMsg += "API key issue. Please check your configuration.";
            } else if (error.message?.includes("quota")) {
                errorMsg += "API quota exceeded. Please try again later.";
            } else {
                errorMsg += "Please try again or check your internet connection.";
            }
            setMessages(prev => [...prev, { text: errorMsg, sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed', bottom: '2rem', right: '2rem',
                    width: '60px', height: '60px', borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)', color: '#fff',
                    border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    cursor: 'pointer', zIndex: 1000, fontSize: '1.5rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
            >
                {isOpen ? '✕' : '💬'}
            </button>

            {isOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '7rem',
                    right: '2rem',
                    width: 'min(350px, calc(100vw - 4rem))',
                    height: 'min(600px, calc(100vh - 10rem))',
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: '1rem',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: 1000,
                    border: '1px solid var(--color-text-muted)'
                }}>
                    {/* Header */}
                    <div style={{ padding: '1rem', borderBottom: '1px solid #333', backgroundColor: 'var(--color-primary)', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem', color: '#fff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>MindNest Consultant ✨</h3>
                            <button
                                onClick={() => setShowHistory(!showHistory)}
                                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}
                                title="Chat History"
                            >
                                {showHistory ? '💬' : '📜'}
                            </button>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {['kids', 'teens', 'adults'].map(mode => (
                                    <button
                                        key={mode}
                                        onClick={() => setAgeMode(mode)}
                                        style={{
                                            fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '10px', border: 'none',
                                            backgroundColor: ageMode === mode ? '#fff' : 'rgba(255,255,255,0.3)',
                                            color: ageMode === mode ? 'var(--color-primary)' : '#fff', cursor: 'pointer'
                                        }}
                                    >
                                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={startNewChat}
                                style={{
                                    fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '10px',
                                    border: '1px solid rgba(255,255,255,0.3)', background: 'none',
                                    color: '#fff', cursor: 'pointer'
                                }}
                                title="New Chat"
                            >
                                ➕
                            </button>
                        </div>
                    </div>

                    {showHistory ? (
                        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <h4 style={{ color: '#aaa', margin: '0 0 0.5rem 0' }}>Recent Conversations</h4>
                            {sessions.length === 0 ? (
                                <p style={{ color: '#666', fontSize: '0.9rem', textAlign: 'center', marginTop: '2rem' }}>No past conversations yet.</p>
                            ) : (
                                sessions.map(s => (
                                    <div
                                        key={s.id}
                                        onClick={() => loadSession(s)}
                                        style={{
                                            padding: '0.8rem',
                                            borderRadius: '8px',
                                            backgroundColor: currentSessionId === s.id ? 'rgba(156, 39, 176, 0.2)' : '#222',
                                            border: `1px solid ${currentSessionId === s.id ? 'var(--color-primary)' : '#333'}`,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div style={{ overflow: 'hidden' }}>
                                            <div style={{ color: '#fff', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {s.snippet}
                                            </div>
                                            <div style={{ color: '#666', fontSize: '0.7rem', marginTop: '0.2rem' }}>
                                                {s.country || 'No Country'} • {s.topic ? topics.find(t => t.id === s.topic)?.label : 'No Topic'}
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => deleteSession(s.id, e)}
                                            style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', fontSize: '1rem' }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))
                            )}
                            <button
                                onClick={startNewChat}
                                style={{
                                    marginTop: 'auto',
                                    padding: '0.8rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--color-primary)',
                                    backgroundColor: 'transparent',
                                    color: 'var(--color-primary)',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                + Start New Conversation
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Settings Area */}
                            <div style={{ padding: '0.5rem', borderBottom: '1px solid #333', backgroundColor: '#222' }}>
                                {!country ? (
                                    <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                                        {countries.map(c => (
                                            <button key={c} onClick={() => setCountry(c)} style={{ whiteSpace: 'nowrap', padding: '0.3rem 0.6rem', borderRadius: '15px', border: '1px solid #555', background: 'none', color: '#fff', cursor: 'pointer', fontSize: '0.8rem' }}>{c}</button>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#aaa', fontSize: '0.8rem' }}>
                                        <span>📍 {country}</span>
                                        <button onClick={() => { setCountry(""); setTopic(""); setChallengerStep(0); }} style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer' }}>Change</button>
                                    </div>
                                )}

                                {country && !topic && (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        {topics.map(t => (
                                            <button key={t.id} onClick={() => setTopic(t.id)} style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid var(--color-primary)', background: 'rgba(156, 39, 176, 0.1)', color: '#fff', cursor: 'pointer', fontSize: '0.8rem', textAlign: 'left' }}>
                                                {t.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {topic && (
                                    <div style={{ marginTop: '0.5rem', color: 'var(--color-accent)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                        Topic: {topics.find(t => t.id === topic)?.label}
                                    </div>
                                )}
                            </div>

                            {/* Messages or Document Drafter */}
                            {showDocumentDrafter ? (
                                <DocumentDrafter
                                    country={country}
                                    onClose={() => setShowDocumentDrafter(false)}
                                />
                            ) : (
                                <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {messages.map((msg, idx) => (
                                        <div key={idx} style={{
                                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                            backgroundColor: msg.sender === 'user' ? 'var(--color-primary)' : '#333',
                                            color: '#fff', padding: '0.8rem', borderRadius: '1rem',
                                            maxWidth: '85%', fontSize: '0.9rem', whiteSpace: 'pre-wrap'
                                        }}>
                                            {msg.text}
                                        </div>
                                    ))}
                                    {topic === 'rights' && country && (
                                        <button
                                            onClick={() => setShowDocumentDrafter(true)}
                                            style={{
                                                alignSelf: 'flex-start',
                                                padding: '0.8rem 1rem',
                                                borderRadius: '10px',
                                                border: '1px solid var(--color-accent)',
                                                background: 'rgba(0, 200, 81, 0.1)',
                                                color: 'var(--color-accent)',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem',
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}
                                        >
                                            📝 Draft a Legal Document
                                        </button>
                                    )}
                                    {isLoading && <div style={{ alignSelf: 'flex-start', color: '#888', fontSize: '0.8rem' }}>Thinking...</div>}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}

                            {/* Input Area */}
                            <div style={{ padding: '1rem', borderTop: '1px solid #333', display: 'flex', gap: '0.5rem' }}>
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={topic ? `Ask about ${topics.find(t => t.id === topic)?.label}...` : "Select a topic above..."}
                                    disabled={!topic}
                                    style={{
                                        flex: 1, padding: '0.8rem', borderRadius: '20px',
                                        border: 'none', backgroundColor: '#333', color: '#fff'
                                    }}
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!topic || isLoading}
                                    style={{
                                        width: '40px', height: '40px', borderRadius: '50%',
                                        border: 'none', backgroundColor: (topic && !isLoading) ? 'var(--color-primary)' : '#555',
                                        color: '#fff', cursor: 'pointer'
                                    }}
                                >
                                    ➤
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default Chatbot;
