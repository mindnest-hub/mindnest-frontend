import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ─────────────────────────────────────────────────────────────────────────────
// LEGAL CONTENT DATA
// ─────────────────────────────────────────────────────────────────────────────
const SECTIONS = {
  terms: {
    label: '📜 Terms & Conditions',
    title: 'Terms and Conditions of Use',
    lastUpdated: 'April 2026',
    blocks: [
      {
        heading: '1. Critical Legal Disclaimer',
        sub: 'AI & No Professional Advice',
        body: `MindNest Africa provides the following for informational and educational purposes only:
• AI Assistant (My MindNest AI Companion)
• Educational Modules
• Community Forums
• Mentorship Tools
• Learning Pathways

MindNest Africa does NOT provide legal, medical, financial, investment, educational certification, or professional services.`
      },
      {
        heading: 'AI Hallucination Disclaimer',
        body: `You acknowledge and agree that:
• The AI Assistant is an artificial intelligence system
• AI responses may be inaccurate, incomplete, outdated, or fabricated
• The AI may generate incorrect facts, legal precedents, or financial information
• AI responses should not be relied upon as professional advice

MindNest Africa is not responsible for AI-generated errors or hallucinations.`
      },
      {
        heading: 'No Professional Advice',
        body: `The AI Assistant, mentors, and community content do NOT replace lawyers, doctors, financial advisors, or certified professionals.

Before making any decision based on the Service, you must consult a licensed professional.

MindNest Africa shall not be liable for financial loss, legal consequences, business decisions, career outcomes, academic results, or personal decisions arising from use of the Service.`
      },
      {
        heading: '2. Eligibility and Age Groups',
        body: `Adults (18+): Full access to AI consultation tools, mentorship, community, and professional learning.

Teens (13–17): Academic learning, career exploration, AI educational assistance, moderated community. Parent or guardian consent is required.

Kids (Under 13): Parent-controlled accounts. Educational modules only. No community access. Restricted AI access. Full parental monitoring.

MindNest Africa requires verifiable parental consent before collecting any child data.`
      },
      {
        heading: '3. User Accounts',
        body: `Users agree to:
• Provide accurate registration information
• Maintain account security and keep passwords confidential
• Not share account access with others
• Notify MindNest Africa of any unauthorized access

Accounts violating these Terms may be suspended or terminated.`
      },
      {
        heading: '4. Use of AI Companion',
        body: `Users agree NOT to:
• Submit illegal or harmful content
• Request harmful instructions
• Use AI for fraud or academic cheating
• Misuse legal or financial tools

MindNest Africa may restrict AI access if misuse is detected. AI availability is not guaranteed.`
      },
      {
        heading: '5. Certificates & Educational Modules',
        body: `Certificates issued by MindNest Africa:
• Do not guarantee employment
• Do not equal university degrees
• Do not replace formal education

Progress tracking is based on system data and may be affected by technical issues.`
      },
      {
        heading: '6. Paid Services & Free Trial',
        body: `MindNest Africa offers premium AI features, mentorship sessions, courses, and subscriptions.

Free Trial: 14 days for eligible paid services. After the trial, subscriptions continue automatically unless cancelled.

Refunds are only permitted for duplicate payments, billing errors, or technical failures preventing access. No refunds for partially used subscriptions, completed courses, or accessed AI services.`
      },
      {
        heading: '7. Zero-Tolerance Anti-Harassment Policy',
        body: `MindNest Africa strictly prohibits: bullying, harassment, hate speech, discrimination, sexual misconduct, threats, and abusive language.

Violations result in immediate suspension, permanent ban, or legal reporting.

Report violations to: Mindnestafrica@gmail.com`
      },
      {
        heading: '8. Intellectual Property',
        body: `All MindNest Africa content is protected, including the logo, app design, AI system, educational content, platform technology, software, and branding.

Users receive a limited personal license to use the Service.

AI Outputs may be used for personal learning or business ideas, but may NOT be resold, copied commercially, or redistributed without permission.`
      },
      {
        heading: '9. Limitation of Liability',
        body: `MindNest Africa is not liable for loss of income, business loss, academic or financial loss, data loss, emotional distress, career decisions, or AI errors.

Maximum liability is limited to the amount paid by the user (if any).`
      },
      {
        heading: '10. Governing Law & Dispute Resolution',
        body: `These Terms are governed by the laws of the Federal Republic of Nigeria.

Disputes shall be resolved through:
• Mediation first
• Arbitration if necessary
• Nigerian courts as final authority

Location: Port Harcourt or Abuja, Nigeria`
      },
      {
        heading: '11. Contact Information',
        body: `MindNest Africa Support & Compliance Team
📧 Mindnestafrica@gmail.com
🌐 Mindnest.bond
📍 Port Harcourt, Rivers State, Nigeria`
      }
    ]
  },
  privacy: {
    label: '🔐 Privacy Policy',
    title: 'Privacy Policy',
    lastUpdated: 'April 2026',
    blocks: [
      {
        heading: '1. Information We Collect',
        body: `(A) Information you provide directly:
• Full name, email address, phone number (if provided)
• Age group (Kids, Teens, Adults)
• Password (encrypted), profile details, learning preferences
• AI chat inputs

(B) Information collected automatically:
• Device type, IP address, browser type
• Usage time, pages visited, click behavior, app performance data

(C) AI Interaction Data:
When you use the AI Assistant, we may collect questions asked, responses generated, feedback provided, and learning patterns to improve accuracy and safety.`
      },
      {
        heading: '2. How We Use Your Information',
        body: `We use your data to:
• Provide AI learning services and personalize learning paths
• Improve educational content and maintain account security
• Detect abuse or fraud and improve system performance
• Offer customer support and send updates or notifications`
      },
      {
        heading: '3. Age Group Data Protection',
        body: `Kids (Under 13): Requires verifiable parental consent. Limited data collection. No public community access. Highly restricted AI interaction.

Teens (13–17): Moderated AI access. Parental awareness required. Restricted content filtering.

Adults (18+): Full platform access. Standard data processing.

We apply extra protection for all minors.`
      },
      {
        heading: '4. Data Sharing',
        body: `We do NOT sell your personal data.

We may share data only with:
• Trusted service providers (hosting, analytics, payments)
• Legal authorities (if required by law)
• Verified educational partners (limited scope)

All partners must follow strict confidentiality rules.`
      },
      {
        heading: '5. Data Storage & Security',
        body: `We use reasonable security measures including encryption, secure servers, access control, and monitoring systems.

However, no system is 100% secure. You use the platform at your own risk.`
      },
      {
        heading: '6. Your Rights',
        body: `You have the right to access, correct, request deletion of your data, withdraw consent, and request account closure.

Requests: 📧 Mindnestafrica@gmail.com`
      },
      {
        heading: '7. Cookies & Tracking',
        body: `We use cookies to keep you logged in, analyze platform usage, improve performance, and personalize your experience.

You can manage cookies through your browser settings. Some features may not work if cookies are disabled.`
      },
      {
        heading: '8. Contact',
        body: `MindNest Africa Support & Compliance Team
📧 Mindnestafrica@gmail.com
🌐 Mindnest.bond
📍 Port Harcourt, Rivers State, Nigeria`
      }
    ]
  },
  ai: {
    label: '🤖 AI Ethics Policy',
    title: 'AI Ethical Use Policy',
    lastUpdated: 'April 2026',
    blocks: [
      {
        heading: '1. Purpose of AI',
        body: `The AI system is designed to assist learning, explain concepts, support career growth, and guide education.

It is NOT a human expert and cannot replace professional judgment.`
      },
      {
        heading: '2. AI Limitations',
        body: `You understand that:
• AI can make mistakes and may generate false information
• AI does not "know truth" the way a human does
• AI is for guidance only

Never rely on AI as a final authority for important decisions.`
      },
      {
        heading: '3. Prohibited AI Use',
        body: `You must NOT use AI to:
• Break laws or create harmful content
• Assist fraud, scams, or promote violence or hate
• Cheat in academic exams
• Impersonate professionals

MindNest Africa may restrict access if misuse is detected.`
      },
      {
        heading: '4. Human Verification Rule',
        body: `For important decisions involving legal, financial, or medical matters, you MUST consult a qualified human professional.

AI cannot replace certified experts.`
      },
      {
        heading: '5. Child Safety',
        body: `For Kids and Teens:
• AI content is filtered for safety
• Harmful content is automatically blocked
• Parents may supervise Kids' usage
• Teens are restricted from misuse`
      },
      {
        heading: '6. Reporting AI Issues',
        body: `Users can report AI problems, bias, or hallucinations to:
📧 Mindnestafrica@gmail.com`
      }
    ]
  },
  cookie: {
    label: '🍪 Cookie Policy',
    title: 'Cookie Policy',
    lastUpdated: 'April 2026',
    blocks: [
      {
        heading: '1. What Are Cookies?',
        body: `Cookies are small files stored on your device that help us recognize you, remember your preferences, and improve platform performance.`
      },
      {
        heading: '2. Types of Cookies We Use',
        body: `Essential Cookies: Required for login, security, and basic platform functionality. Cannot be disabled.

Performance Cookies: Used to measure usage, improve speed, and fix bugs.

Functional Cookies: Used to remember settings, personalize experience, and save learning progress.

Analytics Cookies: Used to understand how users interact with MindNest and which features are most used.`
      },
      {
        heading: '3. Children\'s Cookie Policy',
        body: `For Kids (Under 13):
• No behavioral advertising cookies
• Minimal tracking only
• Parental control required`
      },
      {
        heading: '4. Managing Cookies',
        body: `You can control cookies through your browser or device settings. If disabled, some features may not work properly.`
      },
      {
        heading: '5. Contact',
        body: `📧 Mindnestafrica@gmail.com
🌐 Mindnest.bond
📍 Port Harcourt, Rivers State, Nigeria`
      }
    ]
  },
  agreement: {
    label: '🤝 User Agreement',
    title: 'User Agreement',
    lastUpdated: 'April 2026',
    blocks: [
      {
        heading: '1. Acceptance of Rules',
        body: `By using MindNest Africa, you confirm that:
• You have read and understood these rules
• You agree to follow them at all times
• You accept responsibility for your actions on the platform`
      },
      {
        heading: '2. User Responsibilities',
        body: `You agree to:
• Provide accurate information and keep your account secure
• Use the platform responsibly and respectfully
• Respect other users, mentors, and community members
• Follow all applicable laws in your country`
      },
      {
        heading: '3. Community Rules',
        body: `Users must NOT:
• Harass, bully, or intimidate others
• Post harmful, offensive, or abusive content
• Impersonate other users or public figures
• Spread deliberate misinformation
• Disrupt community discussions

Violations may lead to suspension or permanent ban.`
      },
      {
        heading: '4. Paid Services',
        body: `MindNest Africa offers paid features including subscriptions, premium AI tools, courses, and mentorship programs.

• Payments are required for premium access
• Free trial lasts 14 days
• Subscriptions renew unless cancelled before the billing cycle
• Digital access is non-refundable except in stated cases`
      },
      {
        heading: '5. Termination',
        body: `We may suspend or terminate your account if you:
• break these rules
• misuse the platform or harm other users
• attempt fraud, abuse, or policy violations

You may also stop using the service at any time.`
      },
      {
        heading: '6. Contact',
        body: `📧 Mindnestafrica@gmail.com
🌐 Mindnest.bond
📍 Port Harcourt, Nigeria`
      }
    ]
  },
  appstore: {
    label: '📱 App Store Terms',
    title: 'App Store Terms Summary',
    lastUpdated: 'April 2026',
    blocks: [
      { heading: '1. Educational Use Only', body: 'MindNest Africa provides AI-powered learning and career tools. It is NOT professional advice.' },
      { heading: '2. AI Disclaimer', body: 'AI responses may be incorrect or incomplete. Do not rely on AI for legal, financial, or medical decisions.' },
      { heading: '3. Age Groups', body: 'Kids (parent-controlled), Teens (restricted access), Adults (full access).' },
      { heading: '4. Paid Services', body: 'Some features require payment after a 14-day free trial. Subscriptions renew unless cancelled.' },
      { heading: '5. User Responsibility', body: 'You are responsible for your actions on the platform.' },
      { heading: '6. Prohibited Use', body: 'You may not use the app for illegal, harmful, or abusive activities.' },
      { heading: '7. Privacy', body: 'We collect data to improve learning. We do not sell personal data. See Privacy Policy for details.' },
      { heading: '8. Limitation of Liability', body: 'MindNest Africa is not responsible for losses caused by use of the app or AI outputs.' },
      { heading: '9. Changes', body: 'We may update these terms at any time. Continued use means acceptance.' },
      { heading: '10. Contact', body: '📧 Mindnestafrica@gmail.com\n🌐 Mindnest.bond' }
    ]
  }
};

const TAB_ORDER = ['terms', 'privacy', 'ai', 'cookie', 'agreement', 'appstore'];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function LegalDocs() {
  const navigate = useNavigate();
  const [active, setActive] = useState('terms');
  const section = SECTIONS[active];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0A0A0B 0%, #0D0B08 100%)',
      color: '#fff',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      paddingBottom: '100px'
    }}>
      {/* ── TOP HEADER ─────────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #1A1208 0%, #0F0C06 100%)',
        borderBottom: '1px solid rgba(197,160,25,0.25)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'rgba(197,160,25,0.12)',
            border: '1px solid rgba(197,160,25,0.3)',
            borderRadius: '50%',
            width: '40px', height: '40px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#C5A019', cursor: 'pointer', flexShrink: 0
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
        </button>
        <div>
          <p style={{ fontSize: '11px', color: '#C5A019', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '2px', opacity: 0.8 }}>MindNest Africa</p>
          <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#E8C96E', margin: 0, letterSpacing: '1px' }}>⚖️ Legal Center</h1>
        </div>
      </div>

      {/* ── TAB STRIP ──────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        overflowX: 'auto',
        gap: '8px',
        padding: '16px 20px 12px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        scrollbarWidth: 'none'
      }}>
        {TAB_ORDER.map((key) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              style={{
                flexShrink: 0,
                padding: '8px 16px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: '700',
                letterSpacing: '0.5px',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: isActive ? '1px solid #C5A019' : '1px solid rgba(255,255,255,0.1)',
                background: isActive
                  ? 'linear-gradient(135deg, #C5A019, #E8C96E)'
                  : 'rgba(255,255,255,0.04)',
                color: isActive ? '#000' : '#999',
                boxShadow: isActive ? '0 0 16px rgba(197,160,25,0.4)' : 'none'
              }}
            >
              {SECTIONS[key].label}
            </button>
          );
        })}
      </div>

      {/* ── SECTION HEADER ─────────────────────────────────────────────────── */}
      <div style={{
        margin: '20px 20px 0',
        padding: '20px',
        background: 'linear-gradient(135deg, rgba(197,160,25,0.12) 0%, rgba(197,160,25,0.04) 100%)',
        border: '1px solid rgba(197,160,25,0.2)',
        borderRadius: '16px'
      }}>
        <p style={{ fontSize: '10px', color: '#C5A019', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '6px' }}>Legal Document</p>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#E8C96E', margin: '0 0 8px' }}>{section.title}</h2>
        <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>Last Updated: {section.lastUpdated} · Governing Law: Federal Republic of Nigeria</p>
      </div>

      {/* ── CONTENT BLOCKS ─────────────────────────────────────────────────── */}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {section.blocks.map((block, i) => (
          <div
            key={i}
            style={{
              background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(197,160,25,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderLeft: '3px solid rgba(197,160,25,0.5)',
              borderRadius: '12px',
              padding: '18px 20px'
            }}
          >
            {block.sub && (
              <p style={{ fontSize: '10px', color: '#C5A019', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '700' }}>{block.sub}</p>
            )}
            <h3 style={{
              fontSize: '15px',
              fontWeight: '700',
              color: '#E8C96E',
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: '1px solid rgba(197,160,25,0.15)'
            }}>{block.heading}</h3>
            <div style={{ fontSize: '13px', color: '#B0B0B8', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
              {block.body.split('\n').map((line, li) => {
                if (line.startsWith('•')) {
                  return (
                    <div key={li} style={{ display: 'flex', gap: '8px', marginBottom: '5px' }}>
                      <span style={{ color: '#C5A019', flexShrink: 0, marginTop: '1px' }}>▸</span>
                      <span>{line.replace('•', '').trim()}</span>
                    </div>
                  );
                }
                if (line.trim() === '') return <div key={li} style={{ height: '8px' }} />;
                return <p key={li} style={{ margin: '0 0 6px', color: '#B5B5BF' }}>{line}</p>;
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <div style={{
        margin: '8px 20px 20px',
        padding: '20px',
        background: 'rgba(197,160,25,0.06)',
        border: '1px solid rgba(197,160,25,0.15)',
        borderRadius: '16px',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '12px', color: '#C5A019', fontWeight: '700', marginBottom: '4px' }}>🌍 MindNest Africa</p>
        <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>📧 Mindnestafrica@gmail.com &nbsp;·&nbsp; 🌐 Mindnest.bond &nbsp;·&nbsp; 📍 Port Harcourt, Nigeria</p>
      </div>
    </div>
  );
}
