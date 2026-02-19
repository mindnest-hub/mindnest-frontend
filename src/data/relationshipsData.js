export const relationshipsData = {
    // TEEN TRACK (6 LEVELS)
    teens: [
        {
            id: 'friendship_101',
            title: 'Friendship 101',
            desc: 'Green flags vs Red flags in friends.',
            icon: '🤝',
            content: `
### True Friends vs Fake Friends
- **Green Flags**: They celebrate your wins, listen to you, and respect your boundaries.
- **Red Flags**: They gossip about you, pressure you to do bad things, or only call when they need something.
            `,
            quiz: [
                { q: "A good friend will...", o: ["Gossip about you", "Celebrate your wins", "Ignore you"], a: 1 },
                { q: "If a friend pressures you to do something wrong, that is a...", o: ["Red Flag", "Green Flag", "Blue Flag"], a: 0 }
            ]
        },
        {
            id: 'communication',
            title: 'Communication Skills',
            desc: 'Active listening and speaking clearly.',
            icon: '🗣️',
            content: `
### How to Talk & Listen
- **Active Listening**: Don't just wait for your turn to speak. Listen to understand.
- **"I" Statements**: Instead of "You are annoying," say "I feel annoyed when..."
            `,
            quiz: [
                { q: "Active listening means...", o: ["Listening to understand", "Waiting to talk", "Ignoring them"], a: 0 },
                { q: "Which is better?", o: ["You are so messy!", "I feel stress when the room is messy."], a: 1 }
            ]
        },
        {
            id: 'peer_pressure',
            title: 'Peer Pressure',
            desc: 'Saying "No" with confidence.',
            icon: '🛑',
            content: `
### Standing Your Ground
People will try to make you do things.
- **The Trick**: They say "Everyone is doing it." (Spoiler: They aren't).
- **The Fix**: say "No thanks, not for me." You don't need to explain why.
            `,
            quiz: [
                { q: "Do you need to explain why you say No?", o: ["Yes, always", "No, 'No' is a complete sentence", "Only to best friends"], a: 1 },
                { q: "Is 'everyone' really doing it?", o: ["Yes", "Usually not", "Assume so"], a: 1 }
            ]
        },
        {
            id: 'family_dynamics',
            title: 'Family Dynamics',
            desc: 'Understanding parents and siblings.',
            icon: '👨‍👩‍👧',
            content: `
### Peace at Home
- **Parents**: They are human too. They stress about money and safety.
- **Siblings**: They can be annoying, but they are your longest relationship. Pick your battles.
            `,
            quiz: [
                { q: "Parents are...", o: ["Robots", "Humans with stress", "Perfect"], a: 1 },
                { q: "With siblings, it is best to...", o: ["Fight every time", "Pick your battles", "Ignore them forever"], a: 1 }
            ]
        },
        {
            id: 'digital_etiquette',
            title: 'Digital Etiquette',
            desc: 'Respect and safety online.',
            icon: '📱',
            content: `
### Online vs Real Life
- **The Rule**: If you wouldn't say it to their face, don't type it.
- **Screenshots**: assume everything you send will be seen by everyone.
            `,
            quiz: [
                { q: "Before typing a mean comment, ask...", o: ["Will this get likes?", "Would I say this to their face?", "Is it funny?"], a: 1 },
                { q: "You should assume private messages are...", o: ["Totally safe", "Temporary", "Public forever"], a: 2 }
            ]
        },
        {
            id: 'conflict_res',
            title: 'Conflict Resolution',
            desc: 'Fighting fair.',
            icon: '🏳️',
            content: `
### Fighting Fair
Conflict happens. It's how you handle it.
- **Don't**: Name call, bring up the past, or storm off.
- **Do**: Focus on the problem, not the person. Apologize when you are wrong.
            `,
            quiz: [
                { q: "In a fight, you should focus on...", o: ["The person's flaws", "The problem", "Winning"], a: 1 },
                { q: "If you are wrong, you should...", o: ["Apologize", "Doubledown", "Change the subject"], a: 0 }
            ]
        }
    ],

    // ADULT TRACK (8 LEVELS)
    adults: [
        {
            id: 'eq',
            title: 'Emotional Intelligence',
            desc: 'Self-awareness and empathy.',
            icon: '🧠',
            content: `
### EQ > IQ
Success is often determined by how well you handle people.
- **Self-Awareness**: Knowing what you feel.
- **Empathy**: Knowing what others feel. If you can read the room, you can lead the room.
            `,
            quiz: [
                { q: "Empathy is the ability to...", o: ["Predict the future", "Understand others' feelings", "Do math"], a: 1 },
                { q: "Which is often more important for leadership?", o: ["IQ", "EQ", "Height"], a: 1 }
            ]
        },
        {
            id: 'networking',
            title: 'Professional Networking',
            desc: 'Building social capital.',
            icon: '💼',
            content: `
### It's Who You Know
- **Weak Ties**: Opportunities often come from acquaintances, not close friends.
- **Value First**: Don't ask "What can I get?" Ask "How can I help?"
            `,
            quiz: [
                { q: "Networking is about...", o: ["Collecting cards", "Providing value", "Asking for favors"], a: 1 },
                { q: "Most jobs are found through...", o: ["Weak ties", "Strangers", "Applying cold"], a: 0 }
            ]
        },
        {
            id: 'partnerships',
            title: 'Romantic Partnerships',
            desc: 'Love languages and compromise.',
            icon: '❤️',
            content: `
### Sustaining Love
- **Love Languages**: People give and receive love differently (Words, Acts, Gifts, Time, Touch).
- **Compromise**: It's not You vs Me. It's Us vs The Problem.
            `,
            quiz: [
                { q: "Understanding love languages helps to...", o: ["Win arguments", "Make your partner feel loved", "Save money"], a: 1 },
                { q: "In a relationship conflict, the enemy is...", o: ["The partner", "The problem", "The in-laws"], a: 1 }
            ]
        },
        {
            id: 'parenting_mentorship',
            title: 'Parenting & Mentorship',
            desc: 'Guiding the next generation.',
            icon: '🌱',
            content: `
### The Guide on the Side
- **Parenting**: Your job shifts from "Manager" (0-10) to "Consultant" (18+).
- **Mentorship**: You don't need to be perfect. You just need to be present and honest.
            `,
            quiz: [
                { q: "As a child grows, the parent's role shifts to...", o: ["Boss", "Consultant", "Friend"], a: 1 },
                { q: "A mentor needs to be...", o: ["Perfect", "Rich", "Present and honest"], a: 2 }
            ]
        },
        {
            id: 'deescalation',
            title: 'Conflict De-escalation',
            desc: 'Managing heated situations.',
            icon: '🧊',
            content: `
### Cooling Down
When someone is angry, they cannot hear logic.
- **Validate**: "I can see you are upset."
- **Listen**: Let them vent.
- **Lower Volume**: Speak quietly to lower their energy.
            `,
            quiz: [
                { q: "When someone is angry, start by...", o: ["Arguing logic", "Validating their feelings", "Yelling back"], a: 1 },
                { q: "Speaking quietly helps to...", o: ["Annoy them", "Lower the tension", "Show weakness"], a: 1 }
            ]
        },
        {
            id: 'boundaries',
            title: 'Boundaries',
            desc: 'Setting and holding limits.',
            icon: '🚧',
            content: `
### Good Fences
Boundaries teach people how to treat you.
- **Setting**: "I cannot do that right now."
- **Holding**: If they push, repeat calmly. You are not responsible for their reaction.
            `,
            quiz: [
                { q: "Boundaries teach people...", o: ["To go away", "How to treat you", "That you are mean"], a: 1 },
                { q: "If someone gets mad at your boundary, it means...", o: ["You were wrong", "The boundary was necessary", "You should apologize"], a: 1 }
            ]
        },
        {
            id: 'public_speaking',
            title: 'Public Speaking',
            desc: 'Confidence in groups.',
            icon: '🎤',
            content: `
### The Spotlight
- **Preparation**: Know your first sentence cold.
- **Eye Contact**: Look at one person at a time.
- **Breath**: Adrenaline makes you fast. Slow down.
            `,
            quiz: [
                { q: "When nervous, you should try to...", o: ["Speak faster", "Slow down", "Close your eyes"], a: 1 },
                { q: "Look at...", o: ["The floor", "One person at a time", "The ceiling"], a: 1 }
            ]
        },
        {
            id: 'community_leadership',
            title: 'Community Leadership',
            desc: 'Serving others.',
            icon: '🌍',
            content: `
### Servant Leadership
A leader isn't the person in charge. It's the person in whose care others are.
- **Mission**: Focus on the group's goal, not your ego.
- **Service**: Help others succeed.
            `,
            quiz: [
                { q: "Servant leadership focuses on...", o: ["Power", "The group's success", "Money"], a: 1 },
                { q: "True leadership is about...", o: ["Being the boss", "Taking care of others", "Giving orders"], a: 1 }
            ]
        }
    ]
};

export const scenarios = [
    {
        id: 1,
        title: "The Gossip",
        desc: "A friend tells you a secret about someone else.",
        options: [
            { text: "Tell everyone immediately.", result: "Bad choice. You broke trust.", score: 0 },
            { text: "Listen but keep it to yourself.", result: "Okay, but participating in gossip is risky.", score: 5 },
            { text: "Change the subject and say you don't want to hear it.", result: "Best choice! You stopped the cycle.", score: 10 }
        ]
    },
    {
        id: 2,
        title: "The Loan",
        desc: "A cousin asks for money but hasn't paid back the last loan.",
        options: [
            { text: "Give it to them. Family is family.", result: "Kind, but sets a bad precedent if you can't afford it.", score: 5 },
            { text: "Yell at them for being irresponsible.", result: "Bad choice. Creates unnecessary conflict.", score: 0 },
            { text: "Say 'I can't lend money right now, but I can help with X'.", result: "Great! Good boundary setting.", score: 10 }
        ]
    }
];
