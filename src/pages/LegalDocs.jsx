import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LegalDocs = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('terms');

    // UI Styles
    const textGradient = "text-transparent bg-clip-text bg-gradient-to-r from-[#D9A060] to-[#EBC188]";
    const panelBg = "bg-[#121214] border border-[#B67F4B]/30 rounded-xl";

    const tabs = [
        { id: 'terms', label: 'Terms & Conditions' },
        { id: 'privacy', label: 'Privacy Policy' },
        { id: 'cookie', label: 'Cookie Policy' },
        { id: 'agreement', label: 'User Agreement' },
        { id: 'ai', label: 'AI Ethics Policy' },
        { id: 'appstore', label: 'App Store Terms' }
    ];

    const content = {
        terms: `Terms and Conditions of Use for MindNest Africa

Effective Date: [Insert Date]
Last Updated: [Insert Date]

Welcome to MindNest Africa (“MindNest Africa,” “we,” “our,” or “us”), a consultative career companion and educational technology platform designed to provide AI-powered learning, mentorship, and educational tools for users across Africa and globally.

By accessing or using our mobile application, website, AI companion, community forums, or any related services (collectively, the “Service”), you agree to be bound by these Terms and Conditions (“Terms”).

If you do not agree to these Terms, you must not use the Service.

⸻

1. Critical Legal Disclaimer (AI & No Professional Advice)

Informational and Educational Use Only

MindNest Africa provides:
 • AI Assistant (My MindNest AI Companion)
 • Educational Modules
 • Community Forums
 • Mentorship Tools
 • Learning Pathways

These are provided for informational and educational purposes only.

MindNest Africa does not provide legal, medical, financial, investment, educational certification, or professional services.

⸻

AI Hallucination Disclaimer

You acknowledge and agree that:
 • The AI Assistant is an artificial intelligence system
 • AI responses may be inaccurate, incomplete, outdated, or fabricated
 • The AI may generate incorrect facts, legal precedents, or financial information
 • AI responses should not be relied upon as professional advice

MindNest Africa is not responsible for AI-generated errors or hallucinations.

⸻

No Professional Advice

The AI Assistant, mentors, and community content:
 • Do not replace lawyers
 • Do not replace doctors
 • Do not replace financial advisors
 • Do not replace certified professionals

Before making any decision based on the Service, you must consult a licensed professional.

You use MindNest Africa at your own risk.

MindNest Africa shall not be liable for:
 • financial loss
 • legal consequences
 • business decisions
 • career outcomes
 • academic results
 • personal decisions

arising from use of the Service.

⸻

2. Eligibility and Age Groups

MindNest Africa operates with three user categories:

Adults (18+)
 • Career development
 • AI consultation tools
 • Mentorship
 • Community access
 • Professional learning

Users must be at least 18 years old.

⸻

Teens (13–17)
 • Academic learning
 • Career exploration
 • AI educational assistance
 • Moderated community

Teen users must have parent or guardian consent.

Parents are responsible for teen usage.

⸻

Kids (Under 13)
 • Parent-controlled accounts
 • Educational modules only
 • No community access
 • Restricted AI access
 • Full parental monitoring

MindNest Africa requires verifiable parental consent before collecting any child data.

We comply with:
 • Child data protection standards
 • Global digital child safety frameworks

⸻

3. User Accounts

Users agree to:
 • provide accurate information
 • maintain account security
 • keep passwords confidential
 • not share accounts
 • notify MindNest Africa of unauthorized access

MindNest Africa may suspend or terminate accounts that violate these Terms.

⸻

4. Use of AI Companion

The My MindNest AI Companion is a consultative learning tool.

Users agree:
 • not to submit illegal content
 • not to request harmful instructions
 • not to use AI for fraud
 • not to use AI for academic cheating
 • not to misuse legal or financial tools

MindNest Africa may restrict AI access if misuse is detected.

AI availability is not guaranteed.

⸻

5. Educational Modules and Certificates

MindNest Africa provides:
 • learning pathways
 • career modules
 • educational challenges
 • certificates of completion

Certificates:
 • are issued by MindNest Africa
 • do not guarantee employment
 • do not equal university degrees
 • do not replace formal education

Progress tracking is based on system data and may be affected by technical issues.

⸻

6. Community and Mentorship

MindNest Africa provides:
 • mentors
 • forums
 • discussions
 • collaboration tools

Mentors:
 • share personal knowledge
 • are not employees unless stated • do not provide professional services

MindNest Africa is not responsible for:
 • mentor advice
 • user interactions
 • external communications

⸻

7. Zero-Tolerance Anti-Harassment Policy

MindNest Africa strictly prohibits:
 • bullying
 • harassment
 • hate speech
 • discrimination
 • sexual misconduct
 • threats
 • abusive language

This applies to:
 • forums
 • messages
 • mentorship
 • AI inputs

Violations result in:
 • immediate suspension
 • permanent ban
 • legal reporting if necessary

Users can report violations to:

[Insert Support Email]

⸻

8. Prohibited Conduct

Users must not:
 • break any laws
 • impersonate others
 • spread false information
 • upload harmful content
 • use bots or scrapers
 • hack or disrupt the platform
 • upload viruses
 • attempt to access restricted systems
 • exploit AI tools

Violation may result in:
 • account suspension
 • termination
 • legal action

⸻

9. Intellectual Property

All MindNest Africa content is protected.

This includes:
 • logo
 • app design
 • AI system
 • educational content
 • platform technology
 • software
 • branding

Users receive a limited personal license to use the Service.

⸻

AI Inputs

Users own what they input.

MindNest Africa may use inputs to:
 • improve AI
 • enhance services
 • improve system performance

⸻

AI Outputs

Users may use AI responses for:
 • personal learning
 • business ideas
 • academic support

AI outputs may not be:
 • resold
 • copied commercially
 • redistributed without permission

MindNest Africa retains system ownership.

⸻

10. User Generated Content & Copyright

Users must not upload copyrighted content they do not own.

If copyright infringement occurs:

Send notice to:

[Insert Copyright Email]

We will remove infringing content.

This protects MindNest Africa under safe harbor laws.

⸻

11. Privacy Policy

MindNest Africa collects:
 • account information
 • usage data
 • learning data
 • AI interactions

Full details are in:

Privacy Policy [Insert Link]

We apply stronger protection for:
 • children
 • teens
 • sensitive data

⸻

12. Service Availability

The Service is provided:

“As Is” and “As Available”

MindNest Africa does not guarantee:
 • uptime
 • continuous AI availability
 • error-free service
 • uninterrupted access

We may:
 • update the system
 • perform maintenance
 • modify features
 • suspend access

⸻

13. Limitation of Liability

MindNest Africa is not liable for:
 • loss of income
 • business loss
 • academic loss
 • financial loss
 • data loss
 • emotional distress
 • career decisions
 • AI errors

Maximum liability is limited to:

Amount paid by the user (if any)

⸻

14. Termination

MindNest Africa may terminate accounts for:
 • violating terms
 • harmful activity
 • illegal use
 • misuse of AI
 • harassment

Users may stop using the Service at any time.

⸻

15. Governing Law

These Terms shall be governed by the laws of:

Federal Republic of Nigeria

⸻

16. Dispute Resolution

All disputes shall be resolved through:
 • mediation first
 • arbitration if necessary
 • Nigerian courts as final authority

Location:

Lagos or Abuja, Nigeria

⸻

17. Changes to Terms

MindNest Africa may update Terms.

Users will be notified through:
 • app
 • email
 • website

Continued use means acceptance of updated Terms.

⸻

18. Contact Information

MindNest Africa

Email: [Insert Email]
Support: [Insert Support Email]
Website: [Insert Website]
Office: [Insert Address]`,
        privacy: `2. PRIVACY POLICY (MindNest Africa)

Effective Date: [Insert Date]
Last Updated: [Insert Date]

This Privacy Policy explains how MindNest Africa (“we,” “our,” or “us”) collects, uses, stores, and protects your personal information when you use Mindnest.bond and related services.

By using the Service, you agree to this Privacy Policy.

⸻

1. INFORMATION WE COLLECT

We collect information to provide and improve the Service.

(A) Information you provide directly
 • Full name
 • Email address
 • Phone number (if provided)
 • Age group (Kids, Teens, Adults)
 • Password (encrypted)
 • Profile details
 • Learning preferences
 • AI chat inputs

⸻

(B) Information collected automatically
 • Device type
 • IP address
 • Browser type
 • Usage time
 • Pages visited
 • Click behavior
 • App performance data

⸻

(C) AI Interaction Data

When you use the AI Assistant, we may collect:
 • questions asked
 • responses generated
 • feedback you provide
 • learning patterns

This helps improve accuracy and safety.

⸻

2. HOW WE USE YOUR INFORMATION

We use your data to:
 • provide AI learning services
 • personalize learning paths
 • improve educational content
 • maintain account security
 • detect abuse or fraud
 • improve system performance
 • offer customer support
 • send updates or notifications

⸻

3. AGE GROUP DATA PROTECTION

MindNest Africa operates 3 user categories:

Kids (Under 13)
 • Requires verifiable parental consent
 • Limited data collection
 • No public community access
 • Highly restricted AI interaction

Teens (13–17)
 • Moderated AI access
 • Parental awareness required
 • Restricted content filtering

Adults (18+)
 • Full platform access
 • Standard data processing

We apply extra protection for minors.

⸻

4. DATA SHARING

We do NOT sell your personal data.

We may share data only with:
 • trusted service providers (hosting, analytics, payments)
 • legal authorities (if required by law)
 • verified educational partners (limited scope)

All partners must follow strict confidentiality rules.

⸻

5. ADS & SPONSORED CONTENT

MindNest Africa may display:
 • educational sponsorships
 • verified partner content
 • career or learning-based promotions

We ensure:
 • ads are relevant to education or development
 • no harmful or misleading ads
 • no behavioral targeting for children

⸻

6. DATA STORAGE & SECURITY

We use reasonable security measures including:
 • encryption
 • secure servers
 • access control
 • monitoring systems

However, no system is 100% secure.

You use the platform at your own risk.

⸻

7. YOUR RIGHTS

You have the right to:
 • access your data
 • correct your data
 • request deletion
 • withdraw consent
 • request account closure

Requests can be sent to:

📧 Mindnestafrica@gmail.com

⸻

8. DATA RETENTION

We retain data only as long as necessary to:
 • provide services
 • comply with legal obligations
 • prevent fraud or abuse
 • improve AI systems

Users may request deletion at any time.

⸻

9. COOKIES & TRACKING TECHNOLOGIES

We use cookies and similar technologies to:
 • keep you logged in
 • analyze platform usage
 • improve performance
 • personalize experience

You can disable cookies in your browser, but some features may stop working.

⸻

10. THIRD-PARTY SERVICES

We may use third-party tools such as:
 • payment processors
 • analytics providers
 • cloud hosting services

These services have their own privacy policies.

⸻

11. INTERNATIONAL DATA USE

MindNest Africa may process data outside Nigeria.

By using the Service, you consent to cross-border data transfer.

⸻

12. CHILD SAFETY COMPLIANCE

We comply with child data protection principles including:
 • parental consent
 • minimal data collection
 • restricted AI access
 • no behavioral advertising for children

⸻

13. CHANGES TO THIS POLICY

We may update this Privacy Policy at any time.

Users will be notified through:
 • app notification
 • email
 • website update

⸻

14. CONTACT

MindNest Africa Support & Compliance Team
📧 Mindnestafrica@gmail.com
🌐 Mindnest.bond
📍 Port Harcourt, Rivers State, Nigeria`,
        cookie: `COOKIE POLICY

Effective Date: [Insert Date]
Last Updated: [Insert Date]

This Cookie Policy explains how MindNest Africa uses cookies and similar technologies.

⸻

1. WHAT ARE COOKIES?

Cookies are small files stored on your device that help us:
 • recognize you
 • remember your preferences
 • improve performance

⸻

2. TYPES OF COOKIES WE USE

(A) Essential Cookies

Required for:
 • login
 • security
 • basic platform functionality

You cannot disable these.

⸻

(B) Performance Cookies

Used to:
 • measure usage
 • improve speed
 • fix bugs

⸻

(C) Functional Cookies

Used to:
 • remember settings
 • personalize experience
 • save learning progress

⸻

(D) Analytics Cookies

Used to understand:
 • how users interact with MindNest
 • which features are most used
 • system performance

⸻

3. HOW WE USE COOKIES

We use cookies to:
 • improve AI experience
 • track learning progress
 • enhance personalization
 • secure accounts

⸻

4. ADS & SPONSORED CONTENT COOKIES

If ads are shown, cookies may be used to:
 • show relevant educational content
 • measure engagement
 • prevent repeated ads

We do NOT allow invasive tracking or harmful targeting.

⸻

5. CHILDREN’S COOKIES POLICY

For Kids (Under 13):
 • no behavioral advertising cookies
 • minimal tracking only
 • parental control required

⸻

6. MANAGING COOKIES

You can control cookies through:
 • browser settings
 • device settings

If disabled, some features may not work properly.

⸻

7. THIRD-PARTY COOKIES

Some services may place cookies, including:
 • analytics tools
 • payment gateways
 • embedded content

These are governed by their own policies.

⸻

8. UPDATES TO THIS POLICY

We may update this Cookie Policy periodically.

⸻

9. CONTACT

MindNest Africa Support & Compliance Team
📧 Mindnestafrica@gmail.com
🌐 Mindnest.bond
📍 Port Harcourt, Rivers State, Nigeria`,
        agreement: `USER AGREEMENT (MindNest Africa)

Effective Date: [Insert Date]
Last Updated: [Insert Date]

This User Agreement explains the rules you must follow when using MindNest Africa (Mindnest.bond).

By using the platform, you agree to follow this Agreement.

⸻

1. ACCEPTANCE OF RULES

By using MindNest Africa, you confirm that:
 • you have read and understood the rules
 • you agree to follow them
 • you accept responsibility for your actions

If you do not agree, do not use the platform.

⸻

2. USER RESPONSIBILITIES

You agree to:
 • provide accurate information
 • keep your account secure
 • use the platform responsibly
 • respect other users and mentors
 • follow all applicable laws

⸻

3. AGE GROUP RULES

MindNest Africa has 3 groups:

Kids (Under 13)
 • must be supervised by a parent
 • no independent account control
 • restricted AI access

Teens (13–17)
 • must have parental awareness/consent
 • cannot use AI for cheating
 • moderated community access

Adults (18+)
 • full access to platform features
 • responsible for all actions

⸻

4. COMMUNITY RULES

Users must NOT:
 • harass or bully others
 • post harmful or offensive content
 • impersonate others
 • spread false information
 • disrupt discussions

Violations may lead to suspension or ban.

⸻

5. AI USAGE RULES

You agree NOT to:
 • use AI for illegal activity
 • generate harmful instructions
 • cheat in school or exams
 • attempt to manipulate or hack AI
 • rely on AI as professional advice

AI is a learning tool only.

⸻

6. PAID SERVICES

MindNest Africa offers paid features such as:
 • subscriptions
 • premium AI tools
 • courses
 • mentorship programs

You agree that:
 • payments are required for premium access
 • free trial lasts 14 days
 • subscriptions renew unless cancelled
 • access is digital and non-refundable (except stated cases)

⸻

7. TERMINATION

We may suspend or terminate your account if you:
 • break these rules
 • misuse the platform
 • harm other users
 • attempt fraud or abuse

You may also stop using the service anytime.

⸻

8. LIMITATION OF LIABILITY

MindNest Africa is not responsible for:
 • decisions you make using AI
 • financial loss
 • academic outcomes
 • business decisions
 • errors in AI content

You use the platform at your own risk.

⸻

9. CHANGES TO THIS AGREEMENT

We may update this Agreement anytime.

Continued use means acceptance of updates.

⸻

10. CONTACT

📧 Mindnestafrica@gmail.com
🌐 Mindnest.bond
📍 Port Harcourt, Nigeria`,
        ai: `🤖 5. AI ETHICAL USE POLICY

Effective Date: [Insert Date]

This policy explains how AI in MindNest Africa must be used responsibly.

⸻

1. PURPOSE OF AI

The AI system is designed to:
 • assist learning
 • explain concepts
 • support career growth
 • guide education

It is NOT a human expert.

⸻

2. IMPORTANT AI LIMITATIONS

You understand that:
 • AI can make mistakes
 • AI may generate false information
 • AI does not “know truth” like a human
 • AI is for guidance only

Never rely on AI as final authority.

⸻

3. PROHIBITED AI USE

You must NOT use AI to:
 • break laws
 • create harmful content
 • assist fraud or scams
 • promote violence or hate
 • cheat in academic exams
 • impersonate professionals

⸻

4. CHILD SAFETY RULES

For Kids and Teens:
 • AI is filtered for safety
 • harmful content is blocked
 • parents may supervise usage (kids)
 • teens are restricted from misuse

⸻

5. HUMAN VERIFICATION RULE

For important decisions (legal, financial, medical):

You must consult a qualified human professional.

AI cannot replace experts.

⸻

6. FAIR USE POLICY

Users must not:
 • overload AI systems
 • attempt to reverse engineer AI
 • exploit system vulnerabilities
 • automate queries (bots)

⸻

7. DATA & IMPROVEMENT

AI interactions may be used to:
 • improve responses
 • enhance safety
 • improve learning quality

No personal data is sold.

⸻

8. BIAS & SAFETY

We work to reduce:
 • bias
 • misinformation
 • harmful outputs

But we cannot guarantee perfection.

⸻

9. REPORTING ISSUES

Users can report AI issues to:

📧 Mindnestafrica@gmail.com`,
        appstore: `APP STORE TERMS (SHORT VERSION)

This version is used for:
 • App Store
 • Google Play
 • onboarding screens

⸻

MindNest Africa Terms Summary

By using this app, you agree:

1. Educational Use Only

MindNest Africa provides AI-powered learning and career tools. It is not professional advice.

⸻

2. AI Disclaimer

AI responses may be incorrect or incomplete. Do not rely on AI for legal, financial, or medical decisions.

⸻

3. Age Groups
 • Kids (parent-controlled)
 • Teens (restricted access)
 • Adults (full access)

⸻

4. Paid Services

Some features require payment after a 14-day free trial. Subscriptions renew unless cancelled.

⸻

5. User Responsibility

You are responsible for your actions on the platform.

⸻

6. Prohibited Use

You may not use the app for illegal, harmful, or abusive activities.

⸻

7. Privacy

We collect data to improve learning. We do not sell personal data.

⸻

8. Limitation of Liability

MindNest Africa is not responsible for losses caused by use of the app or AI outputs.

⸻

9. Changes

We may update these terms at any time.

⸻

10. Contact

📧 Mindnestafrica@gmail.com
🌐 Mindnest.bond`
    };

    return (
        <div className="min-h-screen bg-[#070707] text-white p-5 pb-32" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/black-scales.png")' }}>
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 pt-4">
                <button onClick={() => navigate(-1)} className="text-[#D9A060] bg-[#1a1a1a] p-2 rounded-full border border-[#D9A060]/30 hover:bg-[#D9A060]/10 transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
                </button>
                <h1 className={\`text-2xl font-bold uppercase tracking-widest \${textGradient}\`}>Legal Center</h1>
            </div>

            {/* Horizontal Tabs */}
            <div className="flex overflow-x-auto gap-2 pb-4 mb-6 border-b border-white/10 no-scrollbar">
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={\`px-4 py-2 rounded-full text-[12px] font-semibold tracking-wide whitespace-nowrap transition-all \${activeTab === tab.id ? 'bg-[#D9A060] text-black shadow-[0_0_10px_rgba(217,160,96,0.5)]' : 'bg-[#1D1D20] text-slate-400 border border-[#D9A060]/20'}\`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Display */}
            <div className={\`p-6 \${panelBg} shadow-[0_5px_30px_rgba(0,0,0,0.5)]\`}>
                <div className="prose prose-invert max-w-none">
                    {content[activeTab].split('\\n').map((line, idx) => {
                        if (line.trim() === '⸻') {
                            return <hr key={idx} className="border-[#D9A060]/20 my-6" />;
                        } else if (line.trim().startsWith('1.') || line.trim().startsWith('2.') || line.trim().startsWith('3.') || line.trim().startsWith('4.') || line.trim().startsWith('5.') || line.trim().startsWith('6.') || line.trim().startsWith('7.') || line.trim().startsWith('8.') || line.trim().startsWith('9.') || line.trim().startsWith('10.')) {
                            return <h2 key={idx} className="text-[#EBC188] font-bold text-lg mt-8 mb-4">{line}</h2>;
                        } else if (line.trim().startsWith('•') || line.trim().startsWith('▪')) {
                            return <li key={idx} className="text-slate-300 ml-4 mb-1 text-[13px]">{line.replace('•', '').trim()}</li>;
                        } else if (line.trim().length > 0) {
                            return <p key={idx} className="text-slate-300 text-[14px] leading-relaxed mb-4">{line}</p>;
                        }
                        return null;
                    })}
                </div>
            </div>
        </div>
    );
};

export default LegalDocs;
