import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWallet } from '../hooks/useWallet';
import { api } from '../services/api';
import ShareButton from '../components/ShareButton';

// Seed posts for offline/fallback
const SEED_POSTS = [
    { id: 1, author: 'Victor O.', username: 'victor_elite', flag: '🇳🇬', title: 'How do I verify a C of O in Lagos?', content: 'I am planning to buy land in Ibeju-Lekki. Does anyone know the current process at the land registry?', likes: 12, comments: 4, category: 'Land Law', isElite: true, time: '2h ago' },
    { id: 2, author: 'Chidi M.', username: 'chidi_agri', flag: '🇳🇬', title: 'Grant for small-scale palm oil processing', content: 'Just found a grant for agri-tech startups in West Africa. Sharing for anyone interested — deadline is April 30th.', likes: 25, comments: 8, category: 'Opportunities', isElite: false, time: '5h ago' },
    { id: 3, author: 'Kemi A.', username: 'kemi_laws', flag: '🇬🇭', title: 'Tenant rights during renovation', content: 'My landlord wants to start major work while I still have 3 months on my lease. What are my rights under Nigerian tenancy law?', likes: 9, comments: 15, category: 'Legal', isElite: true, time: '1d ago' },
    { id: 4, author: 'Emmanuel S.', username: 'emma_s', flag: '🇿🇦', title: '🏆 Mastered Finance Module!', content: 'Just completed all Finance challenges with a 94% score. The Budget Simulator changed how I think about money completely!', likes: 47, comments: 22, category: 'Success Story', isElite: true, time: '2d ago' },
];

const CATEGORIES = ['All', 'Land Law', 'Business', 'Legal', 'Opportunities', 'Success Story'];

const Community = () => {
    const { user } = useAuth();
    const { balance } = useWallet();

    const [posts, setPosts] = useState(SEED_POSTS);
    const [activeCategory, setActiveCategory] = useState('All');
    const [showNewPost, setShowNewPost] = useState(false);
    const [likedPosts, setLikedPosts] = useState(new Set());
    const [loading, setLoading] = useState(false);

    // New Post Form
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newCategory, setNewCategory] = useState('General');

    const userFlag = JSON.parse(localStorage.getItem('userLocation') || '{}')?.flag || '🌍';
    const referralCode = user?.username ? `MN-${user.username.slice(0, 5).toUpperCase()}` : 'MN-XXXXX';
    const referralLink = `https://mindnest.bond/#/?ref=${referralCode}`;

    const filteredPosts = activeCategory === 'All' ? posts : posts.filter(p => p.category === activeCategory);

    const handleLike = (postId) => {
        setLikedPosts(prev => {
            const updated = new Set(prev);
            if (updated.has(postId)) { updated.delete(postId); setPosts(p => p.map(post => post.id === postId ? { ...post, likes: post.likes - 1 } : post)); }
            else { updated.add(postId); setPosts(p => p.map(post => post.id === postId ? { ...post, likes: post.likes + 1 } : post)); }
            return updated;
        });
    };

    const handleSubmitPost = async () => {
        if (!newTitle.trim() || !newContent.trim()) return;
        const newPost = {
            id: Date.now(), author: user?.username || 'Anonymous', username: user?.username || 'anon',
            flag: userFlag, title: newTitle, content: newContent, category: newCategory,
            likes: 0, comments: 0, isElite: user?.isElite, time: 'Just now'
        };
        setPosts(prev => [newPost, ...prev]);
        setNewTitle(''); setNewContent(''); setShowNewPost(false);
        // Attempt backend sync (non-blocking)
        try {
            const token = localStorage.getItem('token');
            if (token) await api.createDiscussion?.(token, { title: newTitle, content: newContent, category: newCategory });
        } catch (e) { /* offline — post stored locally */ }
    };

    return (
        <div className="section animate-fade max-w-4xl mx-auto pb-20">

            {/* ─── HEADER ─── */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold mb-2 text-white">Elite Community Feed 👥</h1>
                    <p className="text-slate-400">Collaborate, ask questions, and grow together with our global community.</p>
                </div>
                <button onClick={() => setShowNewPost(true)} className="btn btn-primary px-8 py-3 font-bold">+ New Discussion</button>
            </div>

            {/* ─── REFERRAL CARD ─── */}
            <div className="bg-gradient-to-r from-[#C5A019]/10 to-transparent border border-[#C5A019]/20 rounded-[28px] p-6 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C5A019] mb-1">🎁 Invite & Earn</p>
                    <h3 className="text-lg font-black text-white">Your Referral Code: <span className="text-[#C5A019]">{referralCode}</span></h3>
                    <p className="text-xs text-slate-400 mt-1">Earn 50 XP for every friend who joins and completes their first module.</p>
                </div>
                <ShareButton
                    title="Join MindNest Africa Elite!"
                    text={`I'm learning and earning on MindNest! Join with my code ${referralCode} 🦁`}
                    url={referralLink}
                    style={{ background: '#C5A019', color: '#000', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', whiteSpace: 'nowrap' }}
                />
            </div>

            {/* ─── CATEGORY FILTER ─── */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2 no-scrollbar">
                {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all font-bold ${cat === activeCategory ? 'bg-[#C5A019] text-slate-950' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                        {cat}
                    </button>
                ))}
            </div>

            {/* ─── FEED ─── */}
            <div className="space-y-6">
                {filteredPosts.map(post => (
                    <div key={post.id} className="group bg-[#111] border border-white/5 rounded-[28px] p-6 hover:border-[#C5A019]/20 transition-all">
                        {/* Author row */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-[#C5A019] flex items-center justify-center text-slate-950 font-black text-lg">
                                {post.author[0]}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h4 className="text-white font-bold text-sm">{post.flag} {post.author}</h4>
                                    {post.isElite && <span className="text-[9px] bg-[#C5A019]/20 text-[#C5A019] px-2 py-0.5 rounded-full font-black">ELITE</span>}
                                </div>
                                <span className="text-[10px] text-slate-500">{post.category} · {post.time}</span>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold mb-2 group-hover:text-[#C5A019] transition-colors">{post.title}</h3>
                        <p className="text-slate-400 text-sm mb-6 line-clamp-2">{post.content}</p>

                        {/* Actions */}
                        <div className="flex items-center gap-6 border-t border-white/5 pt-4 text-slate-500 text-xs">
                            <button onClick={() => handleLike(post.id)}
                                className={`flex items-center gap-1 hover:text-[#C5A019] transition-colors ${likedPosts.has(post.id) ? 'text-[#C5A019]' : ''}`}>
                                {likedPosts.has(post.id) ? '❤️' : '🤍'} {post.likes}
                            </button>
                            <button className="flex items-center gap-1 hover:text-[#C5A019] transition-colors">💬 {post.comments}</button>
                            <button className="ml-auto hover:text-white transition-colors text-slate-600 font-bold">Share ↗</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ─── NEW POST MODAL ─── */}
            {showNewPost && (
                <div className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4">
                    <div className="bg-[#111] border border-white/10 rounded-[32px] w-full max-w-lg p-8 relative">
                        <button onClick={() => setShowNewPost(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white text-2xl">×</button>
                        <h2 className="text-xl font-black mb-6">Start a Discussion</h2>
                        <div className="space-y-4">
                            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Discussion title"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-[#C5A019] outline-none" />
                            <textarea value={newContent} onChange={e => setNewContent(e.target.value)} placeholder="Share your question, experience, or insight..." rows={4}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-[#C5A019] outline-none resize-none" />
                            <select value={newCategory} onChange={e => setNewCategory(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#C5A019] outline-none">
                                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <button onClick={handleSubmitPost} disabled={!newTitle.trim() || !newContent.trim()}
                                className="w-full bg-[#C5A019] text-black h-12 rounded-xl font-black active:scale-95 transition-transform disabled:opacity-40">
                                Post Discussion →
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Community;
