export const purposeData = {
    // TEEN TRACK (6 LEVELS)
    teens: [
        {
            id: 'self_discovery',
            title: 'Self-Discovery',
            desc: 'What are you good at?',
            icon: '🔍',
            content: `
### The Mirror
To find your path, look at yourself first.
- **Strengths**: What comes easy to you but is hard for others?
- **Interests**: What do you do in your free time without being asked?
            `,
            quiz: [
                { q: "Your strengths are things that...", o: ["Are hard for everyone", "Come easy to you", "You hate doing"], a: 1 },
                { q: "A clue to your purpose is found in...", o: ["Your chores", "Your free time interests", "Your sleep"], a: 1 }
            ]
        },
        {
            id: 'passion_career',
            title: 'Passion vs Career',
            desc: 'Can you get paid for it?',
            icon: '🎨',
            content: `
### Hobby vs Job
- **Hobby**: You pay to do it (e.g., gaming).
- **Career**: You get paid to do it (e.g., game development).
- **The Sweet Spot**: Turning a passion into a skill people pay for.
            `,
            quiz: [
                { q: "A career is something you...", o: ["Pay to do", "Get paid to do", "Do only on weekends"], a: 1 },
                { q: "To turn a passion into a career, you must...", o: ["Solve problems for others", "Keep it a secret", "Stop doing it"], a: 0 }
            ]
        },
        {
            id: 'goal_setting',
            title: 'Goal Setting',
            desc: 'SMART goals.',
            icon: '🎯',
            content: `
### Be SMART
- **S**pecific: "I want to be rich" (Bad). "I want to save ₦50k" (Good).
- **M**easurable: Can you track it?
- **A**chievable: Is it realistic?
- **R**elevant: Does it matter?
- **T**ime-bound: When will you finish?
            `,
            quiz: [
                { q: "A SMART goal must be...", o: ["Vague", "Specific and Time-bound", "Impossible"], a: 1 },
                { q: "Which is a SMART goal?", o: ["I will run fast", "I will run 5km in 30 mins by Friday", "I like running"], a: 1 }
            ]
        },
        {
            id: 'resilience',
            title: 'Resilience',
            desc: 'Bouncing back from failure.',
            icon: '🛡️',
            content: `
### Failing Forward
Failure is not the opposite of success; it is part of success.
- **Growth Mindset**: "I can't do it YET."
- **Feedback**: Treat failure as data, not judgment.
            `,
            quiz: [
                { q: "Failure is...", o: ["The end of the road", "Part of success", "Shameful"], a: 1 },
                { q: "Growth mindset adds the word ____ to 'I can't do it'.", o: ["Ever", "Yet", "Help"], a: 1 }
            ]
        },
        {
            id: 'mentorship',
            title: 'Mentorship',
            desc: 'Finding a guide.',
            icon: '🧭',
            content: `
### Don't Go Alone
A mentor is someone who has been where you want to go.
- **How to ask**: "I admire your work in X. Can I ask you 3 questions about how you started?"
- **Value**: Respect their time. Listen more than you talk.
            `,
            quiz: [
                { q: "A mentor is someone who...", o: ["Does your homework", "Has walked the path before you", "Needs money"], a: 1 },
                { q: "When meeting a mentor, you should...", o: ["Talk about yourself", "Ask good questions & listen", "Ask for money"], a: 1 }
            ]
        },
        {
            id: 'vision_board',
            title: 'Vision Board',
            desc: 'Visualizing the future.',
            icon: '🖼️',
            content: `
### See It to Be It
Your brain works in images.
- **Visualize**: Create a board with pictures of the life you want.
- **Action**: Visualization without action is daydreaming.
            `,
            quiz: [
                { q: "Visualization helps because...", o: ["Your brain thinks in images", "It is magic", "It is easy"], a: 0 },
                { q: "Visualization must be paired with...", o: ["Sleep", "Action", "Food"], a: 1 }
            ]
        }
    ],

    // ADULT TRACK (8 LEVELS)
    adults: [
        {
            id: 'ikigai',
            title: 'Ikigai',
            desc: 'The Japanese concept of purpose.',
            icon: '🌸',
            content: `
### Reason for Being
Ikigai is the intersection of 4 circles:
1. What you LOVE.
2. What you are GOOD at.
3. What the world NEEDS.
4. What you can get PAID for.
            `,
            quiz: [
                { q: "Ikigai means...", o: ["Working hard", "Reason for being", "Retiring early"], a: 1 },
                { q: "Which is NOT one of the 4 circles?", o: ["What you love", "What you hate", "What the world needs"], a: 1 }
            ]
        },
        {
            id: 'career_pivot',
            title: 'Career Pivot',
            desc: 'It\'s never too late.',
            icon: '🔄',
            content: `
### Changing Lanes
The average person changes careers 5-7 times.
- **Transferable Skills**: Communication, leadership, and problem-solving work everywhere.
- **The Dip**: Expect a temporary drop in comfort when learning something new.
            `,
            quiz: [
                { q: "True or False: You must stay in one career forever.", o: ["True", "False"], a: 1 },
                { q: "Skills that work in multiple jobs are called...", o: ["Specific skills", "Transferable skills", "Useless skills"], a: 1 }
            ]
        },
        {
            id: 'legacy',
            title: 'Legacy',
            desc: 'What will you leave behind?',
            icon: '🏛️',
            content: `
### Planting Trees
Legacy is planting seeds in a garden you never get to see.
- **Impact**: Who have you helped?
- **Character**: How will people remember you?
            `,
            quiz: [
                { q: "Legacy is compared to...", o: ["Building a wall", "Planting trees you won't sit under", "Mining gold"], a: 1 },
                { q: "Legacy focuses on...", o: ["Short term wins", "Long term impact", "Fame"], a: 1 }
            ]
        },
        {
            id: 'service',
            title: 'Service',
            desc: 'Purpose through helping others.',
            icon: '🤲',
            content: `
### The Paradox of Happiness
You find yourself by losing yourself in service to others.
- **Contribution**: Gives life meaning.
- **Community**: We are wired to help the tribe.
            `,
            quiz: [
                { q: "The paradox of happiness is that it comes from...", o: ["Selfishness", "Serving others", "Buying things"], a: 1 },
                { q: "Contribution gives life...", o: ["Meaning", "Stress", "Money"], a: 0 }
            ]
        },
        {
            id: 'spiritual',
            title: 'Spiritual Purpose',
            desc: 'Connection to something bigger.',
            icon: '✨',
            content: `
### Beyond Self
Whether religious or secular, connecting to a "higher power" or "greater good" builds resilience.
- **Purpose**: "I am here for a reason."
- **Peace**: Accepting what you cannot control.
            `,
            quiz: [
                { q: "Spiritual purpose involves connecting to...", o: ["Your phone", "Something bigger than yourself", "The internet"], a: 1 },
                { q: "Accepting what you cannot control brings...", o: ["Peace", "Anger", "Confusion"], a: 0 }
            ]
        },
        {
            id: 'work_life',
            title: 'Work-Life Harmony',
            desc: 'Integration, not balance.',
            icon: '⚖️',
            content: `
### Harmony vs Balance
Balance implies a static scale (50/50). Harmony implies music (different notes at different times).
- **Seasons**: Sometimes work is loud. Sometimes family is loud.
- **Presence**: Be where your feet are.
            `,
            quiz: [
                { q: "Instead of perfect balance, seek...", o: ["Harmony", "Chaos", "Nothing"], a: 0 },
                { q: "Being 'where your feet are' means...", o: ["Looking down", "Being present in the moment", "Standing still"], a: 1 }
            ]
        },
        {
            id: 'financial_freedom',
            title: 'Financial Freedom',
            desc: 'Purpose-driven wealth.',
            icon: '💰',
            content: `
### Money as a Tool
Money is not the goal. It is the fuel for your purpose.
- **Freedom**: The ability to say "No" to things that don't align with your purpose.
- **Generosity**: Using wealth to bless others.
            `,
            quiz: [
                { q: "Money should be viewed as...", o: ["The master", "A tool/fuel", "Evil"], a: 1 },
                { q: "Financial freedom gives you the power to...", o: ["Show off", "Say No to non-aligned things", "Sleep all day"], a: 1 }
            ]
        },
        {
            id: 'longevity',
            title: 'The 100-Year Life',
            desc: 'Planning for a long game.',
            icon: '👴',
            content: `
### Playing Long
You might live to 100.
- **Pacing**: Life is a marathon, not a sprint.
- **Lifelong Learning**: Your degree is just the beginning. Keep upgrading your mind.
            `,
            quiz: [
                { q: "If life is a marathon, you should...", o: ["Sprint early", "Pace yourself", "Give up"], a: 1 },
                { q: "In a 100-year life, learning must be...", o: ["Lifelong", "Finished at 22", "Avoided"], a: 0 }
            ]
        }
    ]
};
