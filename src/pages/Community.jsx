import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../hooks/useGamification';
import { useWallet } from '../hooks/useWallet';

const Community = () => {
    const [discussions, setDiscussions] = useState([
        { id: 1, author: 'Victor', title: 'How do I verify a C of O in Lagos?', content: 'I am planning to buy land in Ibeju-Lekki. Does anyone know the current process at the land registry?', likes: 12, comments: 4, category: 'Land Law' },
        { id: 2, author: 'Chidi', title: 'Grant for small-scale palm oil processing', content: 'Just found a grant for agri-tech startups in West Africa. Sharing for anyone interested.', likes: 25, comments: 8, category: 'Opportunities' },
        { id: 3, author: 'Kemi', title: 'Tenant rights during renovation', content: 'My landlord wants to start major work while I still have 3 months on my lease. What are my rights?', likes: 9, comments: 15, category: 'Legal' }
    ]);

    return (
        <div className="section animate-fade max-w-4xl mx-auto">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold mb-2 text-white">MindNest Core Community 👥</h1>
                    <p className="text-slate-400">Collaborate, ask questions, and grow together with 10k+ members.</p>
                </div>
                <button className="btn btn-primary px-8 py-3 font-bold">+ New Discussion</button>
            </div>

            {/* SEARCH / CATEGORY */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2 no-scrollbar">
                {['All', 'Land Law', 'Business', 'Legal', 'Opportunities', 'Success Stories'].map(cat => (
                    <button key={cat} className={`px-4 py-2 rounded-full text-xs whitespace-nowrap transition-all ${cat === 'All' ? 'bg-yellow-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                        {cat}
                    </button>
                ))}
            </div>

            {/* FEED */}
            <div className="space-y-6">
                {discussions.map(post => (
                    <div key={post.id} className="card p-6 border-slate-800 hover:border-yellow-400/30">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-slate-950 font-bold">
                                {post.author[0]}
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm">{post.author}</h4>
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest">{post.category}</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-400 transition-colors">
                            {post.title}
                        </h3>
                        <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                            {post.content}
                        </p>
                        <div className="flex items-center gap-6 border-t border-slate-800 pt-4 text-slate-500 text-xs">
                            <button className="hover:text-yellow-400 transition-colors">👍 {post.likes} Likes</button>
                            <button className="hover:text-yellow-400 transition-colors">💬 {post.comments} Comments</button>
                            <button className="ml-auto hover:text-white transition-colors">Share</button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-12 p-8 text-center border-t border-slate-800">
                <button className="text-yellow-400 font-bold hover:underline">View All Discussions →</button>
            </div>
        </div>
    );
};

export default Community;
