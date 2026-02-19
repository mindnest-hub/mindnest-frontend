export const mentalHealthData = {
    // TEEN TRACK (8 MODULES)
    teens: [
        {
            id: 'understanding_emotions',
            title: 'Understanding Emotions',
            desc: 'Learn to identify and name what you are feeling.',
            icon: '🎭',
            content: `
### What are Emotions?
Emotions are like messages from your brain. They tell you how you are reacting to the world around you. There are no "bad" emotions, but some are harder to handle than others.

### Key Emotions:
- **Joy**: Feeling happy and content.
- **Sadness**: Feeling down or upset, usually when losing something or someone.
- **Anger**: A strong feeling of annoyance or hostility.
- **Fear**: An unpleasant emotion caused by the belief that someone or something is dangerous.
- **Anxiety**: A feeling of worry, nervousness, or unease.

### Emotional Regulation Tips:
1. **Name it to tame it**: Say "I am feeling angry" instead of acting out.
2. **Pause**: Take three deep breaths before reacting.
3. **Move**: Physical activity can help release built-up energy.
            `,
            quiz: [
                { q: "What is the first step in handling a strong emotion?", o: ["Ignore it", "Name it", "Yell at someone", "Sleep"], a: 1 },
                { q: "True or False: There are 'bad' emotions that you should never feel.", o: ["True", "False"], a: 1 }
            ]
        },
        {
            id: 'self_esteem',
            title: 'Self-Esteem & Confidence',
            desc: 'Building a strong belief in your own worth.',
            icon: '🦁',
            content: `
### Unlocking Your Inner Lion
Confidence isn't about being perfect; it's about trusting yourself to handle whatever happens.

### Practical Steps:
- **Positive Self-Talk**: catch your inner critic. Would you say that to a friend?
- **Body Language**: Stand tall. Your posture signals your brain to feel confident.
- **Skill Building**: Nothing builds confidence like competence. Learn something new!
            `,
            quiz: [
                { q: "Confidence comes from...", o: ["Being perfect", "Trusting yourself", "Having money"], a: 1 },
                { q: "What affects how you feel about yourself?", o: ["The weather", "Body language & self-talk", "Video games"], a: 1 }
            ]
        },
        {
            id: 'peer_pressure',
            title: 'Handling Peer Pressure',
            desc: 'Staying true to yourself when others push you.',
            icon: '🛑',
            content: `
### Types of Peer Pressure
- **Direct**: Someone telling you what to do.
- **Indirect**: Seeing others do something and feeling like you should too.

### How to Say No:
- **The Broken Record**: Just keep saying "No" or "I'm not interested" without explaining.
- **The Excuse**: "My parents will kill me if I do that."
- **The Better Idea**: "Nah, let's go play ball instead."
            `,
            quiz: [
                { q: "Indirect peer pressure is when...", o: ["Someone yells at you", "You feel you should copy others", "You are forced"], a: 1 },
                { q: "A good way to resist is...", o: ["Giving in", "Suggesting a better idea", "Crying"], a: 1 }
            ]
        },
        {
            id: 'anxiety_basics',
            title: 'Anxiety & Stress Basics',
            desc: 'Understanding the fight-or-flight response.',
            icon: '😰',
            content: `
### It's All Biology
Anxiety is your body preparing to fight a danger. But sometimes, it gets triggered by exams or social situations instead of lions.

### Taming the Beast:
- **Box Breathing**: Inhale 4s, Hold 4s, Exhale 4s, Hold 4s.
- **Grounding**: Find 5 things you can see, 4 you can touch, 3 you can hear.
            `,
            quiz: [
                { q: "Anxiety is basically your body...", o: ["Sleeping", "Preparing for danger", "Digesting food"], a: 1 },
                { q: "Box breathing involves counting to...", o: ["10", "4", "100"], a: 1 }
            ]
        },
        {
            id: 'social_media',
            title: 'Social Media Mental Health',
            desc: 'Protecting your mind in the digital age.',
            icon: '📱',
            content: `
### The Highlight Reel
Remember: People only post their best moments. Don't compare your "behind-the-scenes" with their "highlight reel".

### Digital Hygiene:
- **Unfollow** accounts that make you feel bad.
- **Limit** scrolling time, especially before bed.
- **Create** more than you consume.
            `,
            quiz: [
                { q: "What is the 'Highlight Reel' effect?", o: ["Posting everything", "Only seeing others' best moments", "Watching movies"], a: 1 },
                { q: "If an account makes you feel bad, you should...", o: ["Argue with them", "Unfollow", "Copy them"], a: 1 }
            ]
        },
        {
            id: 'bullying_rejection',
            title: 'Bullying & Rejection',
            desc: 'Coping with unkindness and exclusion.',
            icon: '🛡️',
            content: `
### It's Not About You
Bullying often comes from the bully's own pain or insecurity.

### Handling Rejection:
- **Feel it**: It's okay to be sad.
- **Don't spiral**: One "no" doesn't mean you are unworthy.
- **Find your tribe**: Focus on the people who DO accept you.
            `,
            quiz: [
                { q: "Bullying often reflects...", o: ["The victim's flaws", "The bully's insecurities", "Nothing"], a: 1 },
                { q: "When rejected, you should...", o: ["Give up forever", "Focus on who accepts you", "Fight everyone"], a: 1 }
            ]
        },
        {
            id: 'emotional_regulation_skills',
            title: 'Emotional Regulation Skills',
            desc: 'Advanced tools for managing big feelings.',
            icon: '🎮',
            content: `
### The Control Panel
You can't control what happens, but you can control your reaction.

### Tools:
- **Journaling**: Writing it down gets it out of your head.
- **Opposite Action**: If you want to hide (sadness), go outside. If you want to yell (anger), speak softly.
            `,
            quiz: [
                { q: "Journaling helps by...", o: ["Wasting paper", "Getting thoughts out of your head", "Improving handwriting only"], a: 1 },
                { q: "Opposite action for sadness (wanting to hide) would be...", o: ["Hiding more", "Going outside/Connecting", "Sleeping"], a: 1 }
            ]
        },
        {
            id: 'identity_discovery',
            title: 'Identity & Self-Discovery',
            desc: 'Figuring out who you want to be.',
            icon: '🧭',
            content: `
### The Big Questions
- What do I value? (Honesty, Fun, Hard Work?)
- What am I curious about?
- How do I want to treat others?

Your identity is a sculpture you are constantly building.
            `,
            quiz: [
                { q: "Identity is...", o: ["Fixed at birth", "Constantly built by you", "Decided by parents"], a: 1 },
                { q: "A core value might be...", o: ["Pizza", "Honesty", "Video games"], a: 1 }
            ]
        }
    ],

    // ADULT TRACK (8 MODULES)
    adults: [
        {
            id: 'stress_mgmt_adult',
            title: 'Stress Management',
            desc: 'Strategies for high-pressure lives.',
            icon: '📉',
            content: `
### The Stress Bucket
We all have a bucket. If you keep pouring stress in without opening the tap (relaxing), it overflows (burnout).

### Taps:
- **Exercise**: Burns off stress hormones.
- **Boundaries**: Saying 'no' is a stress reliever.
- **Perspective**: Will this matter in 5 years?
            `,
            quiz: [
                { q: "What happens if you don't 'open the tap' on stress?", o: ["Nothing", "Burnout/Overflow", "You get stronger"], a: 1 },
                { q: "A good way to reduce stress input is...", o: ["Taking on more work", "Setting boundaries", "Ignoring emails"], a: 1 }
            ]
        },
        {
            id: 'anxiety_awareness',
            title: 'Anxiety Awareness',
            desc: 'Recognizing different forms of anxiety.',
            icon: '😰',
            content: `
### Beyond "Nerves"
Anxiety can manifest as:
- **General**: Constant worry about everything.
- **Social**: Fear of judgment in social settings.
- **Panic**: Sudden intense attacks of fear.

### Coping:
- **Limit Caffeine**: It mimics anxiety symptoms.
- **Fact-Check**: Challenge your anxious thoughts. Are they 100% true?
            `,
            quiz: [
                { q: "Social anxiety is specifically fear of...", o: ["Spiders", "Social judgment", "Germs"], a: 1 },
                { q: "Caffeine can...", o: ["Cure anxiety", "Mimic anxiety symptoms", "Help you sleep"], a: 1 }
            ]
        },
        {
            id: 'burnout_recovery',
            title: 'Burnout Recovery',
            desc: 'Healing from chronic exhaustion.',
            icon: '🔋',
            content: `
### Signs of Burnout
1. Exhaustion.
2. Cynicism (feeling negative about work/life).
3. Inefficacy (feeling like you can't achieve anything).

### The Cure:
- **Rest**: Not just sleep, but mental rest.
- **Disconnect**: True unplugging from work.
- **Re-evaluate**: Are your goals aligning with your values?
            `,
            quiz: [
                { q: "Cynicism is a sign of...", o: ["Happiness", "Burnout", "Energy"], a: 1 },
                { q: "To recover, you often need to...", o: ["Work harder", "Disconnect and rest", "Drink coffee"], a: 1 }
            ]
        },
        {
            id: 'emotional_intelligence',
            title: 'Emotional Intelligence (EQ)',
            desc: 'Understanding yourself and others.',
            icon: '🧠',
            content: `
### The 4 Pillars of EQ
1. **Self-Awareness**: Knowing what you feel.
2. **Self-Management**: Controlling your reaction.
3. **Social Awareness**: Empathy; understanding others.
4. **Relationship Management**: Handling conflict and connection.
            `,
            quiz: [
                { q: "Empathy falls under which EQ pillar?", o: ["Self-Management", "Social Awareness", "Self-Awareness"], a: 1 },
                { q: "Knowing what you feel is...", o: ["Self-Awareness", "Social Skills", "Motivation"], a: 0 }
            ]
        },
        {
            id: 'trauma_awareness',
            title: 'Trauma Awareness',
            desc: 'How the past affects the present.',
            icon: '🌑',
            content: `
### It's Not "What's Wrong With You?"
It's "What happened to you?"

Trauma is not the event, but the lasting impact on your nervous system. Healing involves teaching your body that it is safe now.
            `,
            quiz: [
                { q: "The better question to ask about trauma is...", o: ["What's wrong with you?", "What happened to you?", "Why are you like this?"], a: 1 },
                { q: "Healing involves teaching your body that...", o: ["It is safe now", "Danger is everywhere", "The past is gone"], a: 0 }
            ]
        },
        {
            id: 'negative_thinking',
            title: 'Negative Thinking Patterns',
            desc: 'Breaking the cycle of pessimism.',
            icon: '💭',
            content: `
### Common Cognitive Distortions
- **All-or-Nothing**: "If I fail this, I'm a total failure."
- **Catastrophizing**: Expecting the worst possible outcome.
- **Mind Reading**: "I know they hate me."

### The Fix:
Catch the thought. Check the evidence. Change the thought.
            `,
            quiz: [
                { q: "Expecting the worst possible outcome is called...", o: ["Realism", "Catastrophizing", "Planning"], a: 1 },
                { q: "Thinking 'Everyone hates me' without proof is...", o: ["Mind Reading", "Intuition", "Fact"], a: 0 }
            ]
        },
        {
            id: 'resilience_training',
            title: 'Resilience Training',
            desc: 'Bouncing back from life\'s punches.',
            icon: '🧗',
            content: `
### The 3 P's of Resilience
When something bad happens, realize it is:
1. **Why not Permanent**: This too shall pass.
2. **Not Pervasive**: It doesn't ruin *everything* in your life.
3. **Not Personal**: It likely isn't because you are a bad person.
            `,
            quiz: [
                { q: "Believing a problem will last forever is thinking it is...", o: ["Permanent", "Pervasive", "Personal"], a: 0 },
                { q: "Resilience is the ability to...", o: ["Avoid problems", "Bounce back", "Never feel pain"], a: 1 }
            ]
        },
        {
            id: 'confidence_rebuilding',
            title: 'Confidence Rebuilding',
            desc: 'Regaining trust in yourself.',
            icon: '🏗️',
            content: `
### Rebuilding the Foundation
Confidence is built on evidence.
- **Keep promises to yourself**: If you say you'll walk, walk.
- **Celebrate small wins**: Don't wait for the big victory.
- **Accept compliments**: Say "Thank you" instead of deflecting.
            `,
            quiz: [
                { q: "Confidence is built on...", o: ["Dreams", "Evidence/Action", "Luck"], a: 1 },
                { q: "When complimented, you should...", o: ["Deny it", "Say 'Thank You'", "Change the subject"], a: 1 }
            ]
        }
    ],

    hotlines: [
        { country: "Nigeria", name: "Lagos Emergency", number: "112" },
        { country: "Nigeria", name: "Mentally Aware Nigeria", number: "+234 809 111 6264" },
        { country: "Ghana", name: "Ghana Suicide Lifeline", number: "1554" },
        { country: "Kenya", name: "Befrienders Kenya", number: "+254 722 178 177" },
        { country: "South Africa", name: "SADAG", number: "0800 567 567" },
        { country: "South Africa", name: "Suicide Crisis Line", number: "0800 567 567" },
        { country: "Rwanda", name: "Center for Mental Health", number: "0788 506 070" },
        { country: "Uganda", name: "Butabika Helpline", number: "0800 200 100" },
        { country: "Tanzania", name: "Mental Health Assoc.", number: "+255 22 212 2841" }
    ],
    stressTest: {
        questions: [
            "I find it hard to wind down.",
            "I tend to overreact to situations.",
            "I feel like I'm using a lot of nervous energy.",
            "I find myself getting agitated easily.",
            "I find it difficult to relax.",
            "I feel intolerant of anything that keeps me from getting on with what I was doing.",
            "I feel I am rather touchy.",
            "I find it difficult to work up the initiative to do things.",
            "I feel down-hearted and blue.",
            "I feel I have nothing to look forward to."
        ],
        scoring: {
            low: { range: [0, 10], result: "Low Stress", desc: "You seem to be managing well! Keep up your healthy habits." },
            moderate: { range: [11, 20], result: "Moderate Stress", desc: "You're feeling some pressure. Try the Breathing Exercise or a walk." },
            high: { range: [21, 30], result: "High Stress", desc: "You're carrying a heavy load. Please consider talking to someone or using the Crisis Resources." }
        }
    }
};
