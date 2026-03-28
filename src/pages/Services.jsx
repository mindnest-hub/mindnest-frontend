import React from 'react';

const Services = () => {
    const services = [
        { 
            id: 'land', 
            title: 'Land & Property Verification', 
            partner: 'Rollin Stone Properties Ltd', 
            icon: '🏢', 
            desc: 'Expert verification of C of O, Governors Consent, and land surveying. Buy safely with our verified partners.',
            color: '#B8860B'
        },
        { 
            id: 'legal', 
            title: 'Legal Help Desk', 
            partner: 'MindNest Legal Partners', 
            icon: '⚖️', 
            desc: 'Get professional legal advice on tenancy, contracts, and citizen rights from certified lawyers.',
            color: '#FF4500'
        },
        { 
            id: 'business', 
            title: 'Business Registration (CAC)', 
            partner: 'Enterprise Hub', 
            icon: '📈', 
            desc: 'Fast tracking your business registration and obtaining tax identification numbers (TIN).',
            color: '#00A86B'
        },
        { 
            id: 'contracts', 
            title: 'Contract Review', 
            partner: 'MindNest Legal', 
            icon: '📄', 
            desc: 'Professional review of your employment, rental, or business partnership contracts.',
            color: '#4682B4'
        }
    ];

    return (
        <div className="section animate-fade">
            <div className="mb-12">
                <h1 className="text-4xl font-bold mb-3 text-white">Professional Services Hub 🏛️</h1>
                <p className="text-slate-400 max-w-2xl">Connect with verified experts to secure your assets and protect your rights. No more "Middle-man" risks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {services.map(service => (
                    <div key={service.id} className="card group hover:bg-slate-900 border-slate-800 transition-all p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                                {service.icon}
                            </div>
                            <span className="text-[10px] bg-slate-800/50 text-yellow-400 px-3 py-1 rounded-full uppercase tracking-widest font-bold">Verified Partner</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-yellow-400 transition-colors">{service.title}</h3>
                        <p className="text-slate-500 text-sm font-medium mb-4 italic">by {service.partner}</p>
                        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                            {service.desc}
                        </p>
                        <div className="flex flex-col gap-3">
                            <button className="btn btn-primary w-full py-4 font-bold shadow-lg shadow-yellow-500/10">Book Consultation</button>
                            <button className="btn btn-outline w-full py-3 text-xs font-bold">View Service Details</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-20 p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center">
                <h2 className="text-2xl font-bold mb-4">Are you a Professional Service Provider? 🤝</h2>
                <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
                    Join the MindNest ecosystem as a verified partner and help thousands of Africans make safe, informed decisions.
                </p>
                <button className="btn btn-outline px-12 py-4 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-slate-950 font-bold">Apply for Partnership</button>
            </div>
        </div>
    );
};

export default Services;
