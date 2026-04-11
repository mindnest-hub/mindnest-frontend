import React, { useState } from 'react';

const TABS = [
  { id: 'terms', label: '📜 Terms' },
  { id: 'privacy', label: '🔐 Privacy' },
  { id: 'ai', label: '🤖 AI Ethics' },
  { id: 'cookie', label: '🍪 Cookies' },
];

const CONTENT = {
  terms: {
    title: 'Terms and Conditions of Use',
    items: [
      { h: '⚠️ Critical Disclaimer', b: 'MindNest Africa provides educational and informational content ONLY. We do NOT provide legal, medical, financial, investment, or professional certification services.' },
      { h: '🤖 AI Hallucination Warning', b: 'Our AI may generate inaccurate, incomplete, or fabricated responses ("hallucinations"). Never rely on AI output for professional decisions. Always consult a licensed expert.' },
      { h: '👤 User Accounts', b: 'Provide accurate information, keep your password secure, do not share your account, and notify us immediately of unauthorized access.' },
      { h: '🔞 Age Groups', b: 'Adults (18+): Full access. Teens (13–17): Parental consent required, restricted access. Kids (Under 13): Parent-controlled accounts only, no community access.' },
      { h: '💳 Paid Services', b: 'A 14-day free trial is available. After that, subscriptions renew automatically unless cancelled. No refunds for accessed digital services except billing errors.' },
      { h: '🚫 Prohibited Conduct', b: 'No harassment, hate speech, impersonation, fraud, hacking, spreading misinformation, or misuse of AI tools. Violations result in immediate account suspension.' },
      { h: '©️ Intellectual Property', b: 'All platform content, branding, AI systems, and educational materials belong to MindNest Africa. You receive a limited, personal, non-transferable license to use the Service.' },
      { h: '⚖️ Limitation of Liability', b: 'MindNest Africa is not liable for financial loss, career decisions, academic outcomes, AI errors, or data loss. You use the platform entirely at your own risk.' },
      { h: '🇳🇬 Governing Law', b: 'These Terms are governed by the laws of the Federal Republic of Nigeria. Disputes are resolved in Port Harcourt or Abuja through mediation, then arbitration or court if necessary.' },
    ]
  },
  privacy: {
    title: 'Privacy Policy',
    items: [
      { h: '📊 What We Collect', b: 'We collect your name, email, age group, device information, usage data, and AI chat interactions to provide and improve our services.' },
      { h: '📌 How We Use It', b: 'To provide AI learning, personalize content, detect fraud, maintain security, and send updates. We do NOT sell your personal data.' },
      { h: '👶 Child Data Protection', b: 'Kids (Under 13) require verifiable parental consent. We apply minimal data collection and no behavioral advertising for children.' },
      { h: '🔒 Data Security', b: 'We use encryption, secure servers, and access controls. However, no system is 100% secure — use the platform at your own risk.' },
      { h: '✅ Your Rights', b: 'You may access, correct, or request deletion of your data at any time. Email: Mindnestafrica@gmail.com' },
      { h: '🍪 Cookies', b: 'We use cookies for login, analytics, and personalization. You can manage cookies in your browser settings.' },
    ]
  },
  ai: {
    title: 'AI Ethical Use Policy',
    items: [
      { h: '🎯 Purpose of AI', b: 'Our AI is designed to assist learning, explain concepts, and support career growth. It is NOT a human expert and cannot replace professional advice.' },
      { h: '⚠️ AI Limitations', b: 'AI can make mistakes, generate false information, and has no real-world accountability. Always verify important information with a qualified professional.' },
      { h: '🚫 Prohibited AI Use', b: 'Do not use AI for illegal activities, harmful content, academic cheating, fraud, impersonating professionals, or any unethical purpose.' },
      { h: '👦 Child Safety', b: 'AI content for Kids and Teens is filtered for safety. Harmful content is automatically blocked.' },
      { h: '🔍 Human Verification', b: 'For legal, financial, or medical decisions, you MUST consult a human professional. AI cannot replace certified experts.' },
    ]
  },
  cookie: {
    title: 'Cookie Policy',
    items: [
      { h: '🔑 Essential Cookies', b: 'Required for login, security, and basic functionality. Cannot be disabled.' },
      { h: '📈 Performance & Analytics', b: 'Used to measure usage, improve speed, fix bugs, and understand how users interact with MindNest.' },
      { h: '⚙️ Functional Cookies', b: 'Used to remember your settings, personalize your experience, and save learning progress.' },
      { h: '👶 Children\'s Cookie Policy', b: 'For Kids (Under 13): No behavioral advertising cookies, minimal tracking only, parental control required.' },
      { h: '🎛️ Managing Cookies', b: 'You can control cookies via your browser settings. Disabling some cookies may affect platform functionality.' },
    ]
  }
};

const LegalModal = ({ onClose, defaultTab = 'terms' }) => {
  const [tab, setTab] = useState(defaultTab);
  const section = CONTENT[tab];

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.92)', zIndex: 6000,
      backdropFilter: 'blur(8px)', display: 'flex',
      alignItems: 'flex-end', justifyContent: 'center',
      padding: '0'
    }}>
      <div style={{
        backgroundColor: '#0D0C08',
        width: '100%', maxWidth: '600px',
        borderRadius: '24px 24px 0 0',
        overflow: 'hidden',
        border: '1px solid rgba(197,160,25,0.3)',
        borderBottom: 'none',
        display: 'flex', flexDirection: 'column',
        maxHeight: '90vh',
        boxShadow: '0 -20px 60px rgba(0,0,0,0.8)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1A1208, #0F0C06)',
          padding: '20px 20px 0',
          borderBottom: '1px solid rgba(197,160,25,0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <p style={{ fontSize: '10px', color: '#C5A019', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 4px' }}>Review Before Signing Up</p>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#E8C96E', margin: 0 }}>⚖️ Legal Documents</h2>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(197,160,25,0.1)', border: '1px solid rgba(197,160,25,0.3)',
                borderRadius: '50%', width: '36px', height: '36px',
                color: '#C5A019', fontSize: '20px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >×</button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', paddingBottom: '0' }}>
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  flex: 1, padding: '10px 4px', background: 'none', border: 'none',
                  color: tab === t.id ? '#E8C96E' : '#666',
                  fontWeight: tab === t.id ? '800' : '500',
                  fontSize: '11px', cursor: 'pointer',
                  borderBottom: tab === t.id ? '2px solid #C5A019' : '2px solid transparent',
                  transition: 'all 0.2s', whiteSpace: 'nowrap'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#E8C96E', marginBottom: '16px' }}>{section.title}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {section.items.map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderLeft: '3px solid rgba(197,160,25,0.5)',
                borderRadius: '10px',
                padding: '14px 16px'
              }}>
                <p style={{ fontSize: '13px', fontWeight: '700', color: '#E8C96E', margin: '0 0 6px' }}>{item.h}</p>
                <p style={{ fontSize: '12px', color: '#A0A0B0', lineHeight: '1.7', margin: 0 }}>{item.b}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div style={{
          padding: '16px 20px 28px',
          borderTop: '1px solid rgba(197,160,25,0.15)',
          background: 'rgba(0,0,0,0.4)'
        }}>
          <p style={{ fontSize: '11px', color: '#666', textAlign: 'center', marginBottom: '12px' }}>
            By creating an account you agree to these terms · 📧 Mindnestafrica@gmail.com
          </p>
          <button
            onClick={onClose}
            style={{
              width: '100%', padding: '14px',
              background: 'linear-gradient(135deg, #C5A019, #E8C96E)',
              border: 'none', borderRadius: '12px',
              color: '#000', fontWeight: '800', fontSize: '15px',
              cursor: 'pointer', letterSpacing: '0.5px'
            }}
          >
            ✅ I Have Read & I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
