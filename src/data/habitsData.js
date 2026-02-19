export const habitsData = {
    // TEEN TRACK (6 LEVELS)
    teens: [
        {
            id: 'the_loop',
            title: 'The Habit Loop',
            desc: 'How habits work: Cue, Routine, Reward.',
            icon: '🔄',
            content: `
### The 3 Parts of a Habit
1. **Cue**: The trigger (e.g., phone buzzes).
2. **Routine**: The action (e.g., check Instagram).
3. **Reward**: The benefit (e.g., dopamine hit).

### Hacking the Loop:
To change a habit, keep the Cue and Reward, but change the Routine.
            `,
            quiz: [
                { q: "What are the 3 parts of the habit loop?", o: ["Cue, Routine, Reward", "Stop, Drop, Roll", "Eat, Sleep, Repeat"], a: 0 },
                { q: "To change a habit, you should change the...", o: ["Cue", "Routine", "Reward"], a: 1 }
            ]
        },
        {
            id: 'dopamine_detox',
            title: 'Dopamine Detox',
            desc: 'Resetting your brain\'s reward system.',
            icon: '🧠',
            content: `
### The Pleasure Trap
Your brain loves "cheap" dopamine (social media, sugar, video games). It makes "expensive" dopamine (studying, exercise) feel boring.

### The Detox:
Take a break from high-stimulation activities for 24 hours. Boredom resets your focus baseline.
            `,
            quiz: [
                { q: "Cheap dopamine comes from...", o: ["Hard work", "Social media & sugar", "Sleeping"], a: 1 },
                { q: "A dopamine detox helps to...", o: ["Make you boring", "Reset your focus baseline", "Lower your grades"], a: 1 }
            ]
        },
        {
            id: 'micro_habits',
            title: 'Micro-Habits',
            desc: 'The power of tiny changes (1% better).',
            icon: '🤏',
            content: `
### Start Small
Don't say "I will read for an hour." Say "I will read one page."
- **Low Friction**: It's so easy you can't say no.
- **Momentum**: Once you start, it's easy to keep going.
            `,
            quiz: [
                { q: "A micro-habit should be...", o: ["Huge and impressive", "So easy you can't say no", "Painful"], a: 1 },
                { q: "The goal of 1% better is...", o: ["Compound growth", "Instant perfection", "Showing off"], a: 0 }
            ]
        },
        {
            id: 'environment_design',
            title: 'Environment Design',
            desc: 'Make good habits easy, bad habits hard.',
            icon: '🏡',
            content: `
### Context is King
Willpower is overrated. Design your space.
- **To Read More**: Put a book on your pillow.
- **To Eat Better**: Put junk food in a high cupboard.
- **To Study**: Put your phone in another room.
            `,
            quiz: [
                { q: "If you want to study, where should your phone be?", o: ["In your hand", "On the desk", "In another room"], a: 2 },
                { q: "Environment design relies on...", o: ["Willpower", "Changing your space", "Luck"], a: 1 }
            ]
        },
        {
            id: 'identity_shifting',
            title: 'Identity Shifting',
            desc: 'Becoming the type of person who...',
            icon: '🆔',
            content: `
### I Am...
Don't say "I'm trying to quit sugar." Say "I am a healthy eater."
- **Goal**: Read a book.
- **Identity**: Become a reader.

True behavior change is identity change.
            `,
            quiz: [
                { q: "Instead of 'I want to run', say...", o: ["I hate running", "I am a runner", "I might run"], a: 1 },
                { q: "True behavior change is...", o: ["Identity change", "Temporary", "Fake"], a: 0 }
            ]
        },
        {
            id: 'streak_power',
            title: 'Streak Power',
            desc: 'Don\'t break the chain.',
            icon: '🔗',
            content: `
### The Seinfeld Strategy
Jerry Seinfeld wrote a joke every day and marked an X on a calendar. His only goal: Don't break the chain.

### The Rule:
Never miss twice. If you miss one day, get back on track immediately.
            `,
            quiz: [
                { q: "The 'Seinfeld Strategy' involves...", o: ["Marking an X on a calendar", "Writing a sitcom", "Eating cereal"], a: 0 },
                { q: "If you miss one day...", o: ["Give up", "Never miss twice", "Start a new habit"], a: 1 }
            ]
        }
    ],

    // ADULT TRACK (8 LEVELS)
    adults: [
        {
            id: 'habit_psychology',
            title: 'Habit Psychology',
            desc: 'Neuroscience of neuroplasticity.',
            icon: '🧬',
            content: `
### Neurons That Fire Together...
Wire together. Every time you repeat an action, the neural pathway gets stronger (myelination).
- **Plasticity**: Your brain changes structure based on what you do.
- **Automaticity**: Eventually, the habit moves to the basal ganglia (autopilot).
            `,
            quiz: [
                { q: "Myelination makes neural pathways...", o: ["Weaker", "Stronger/Faster", "Disappear"], a: 1 },
                { q: "Habits eventually move to your brain's...", o: ["Autopilot (Basal Ganglia)", "Vision center", "Memory bank"], a: 0 }
            ]
        },
        {
            id: 'outcome_vs_identity',
            title: 'Outcome vs Identity',
            desc: 'Focus on who you wish to become.',
            icon: '🎯',
            content: `
### Layers of Change
1. **Outcome**: What you get (lose weight).
2. **Process**: What you do (gym routine).
3. **Identity**: What you believe (I am an athlete).

Focus on Identity first. The outcome will follow.
            `,
            quiz: [
                { q: "The deepest layer of behavior change is...", o: ["Outcome", "Process", "Identity"], a: 2 },
                { q: "Instead of focusing on losing weight, focus on...", o: ["Becoming a healthy person", "Starving", "Buying clothes"], a: 0 }
            ]
        },
        {
            id: 'habit_stacking',
            title: 'Habit Stacking',
            desc: 'Anchoring new habits to old ones.',
            icon: '🥞',
            content: `
### The Formula
"After I [Current Habit], I will [New Habit]."
- After I pour my coffee, I will meditate for 1 minute.
- After I take off my work shoes, I will put on my gym clothes.
            `,
            quiz: [
                { q: "Habit Stacking involves...", o: ["Doing everything at once", "Linking new habits to old ones", "Stacking blocks"], a: 1 },
                { q: "A good anchor habit is one that...", o: ["You rarely do", "You already do every day", "You hate doing"], a: 1 }
            ]
        },
        {
            id: 'environment_audit',
            title: 'Environment Design',
            desc: 'Designing your life for success.',
            icon: '🏗️',
            content: `
### Friction Analysis
- **Increase Friction** for bad habits (take batteries out of remote).
- **Decrease Friction** for good habits (gym bag packed by door).

You are the architect of your choices.
            `,
            quiz: [
                { q: "To stop a bad habit, you should...", o: ["Increase friction", "Decrease friction", "Ignore it"], a: 0 },
                { q: "Visual cues (like gym bag by door) help by...", o: ["Decreasing friction", "Looking messy", "Increasing friction"], a: 0 }
            ]
        },
        {
            id: 'breaking_bad',
            title: 'Breaking Bad Habits',
            desc: 'Inversion of the 4 laws.',
            icon: '🚫',
            content: `
### How to Break It:
1. **Make it Invisible**: Hide the cues.
2. **Make it Unattractive**: Reframe the benefits.
3. **Make it Difficult**: Add friction.
4. **Make it Unsatisfying**: Accountability partner / consequence.
            `,
            quiz: [
                { q: "To break a habit, you can make it...", o: ["Invisible", "Easy", "Attractive"], a: 0 },
                { q: "Adding friction makes a habit...", o: ["Difficult", "Fun", "Fast"], a: 0 }
            ]
        },
        {
            id: 'accountability',
            title: 'Accountability Systems',
            desc: 'Contracts and partners.',
            icon: '🤝',
            content: `
### The Power of Social Contract
We care deeply what others think. Use this.
- **Habit Contract**: Written agreement with a consequence. "If I skip the gym, I owe you $50."
- **Partners**: Workout buddies make you show up.
            `,
            quiz: [
                { q: "A habit contract should include...", o: ["A reward only", "A specific consequence", "Vague goals"], a: 1 },
                { q: "Accountability works because...", o: ["We like money", "We care about social standing", "We are bored"], a: 1 }
            ]
        },
        {
            id: 'tracking_data',
            title: 'Data & Tracking',
            desc: 'Measuring what matters.',
            icon: '📊',
            content: `
### Don't Break the Chain
Visual progress acts as a reward.
- **Habit Tracker**: A simple grid. X gets marked.
- **Rule**: Never miss twice.
- **Caution**: Goodhart's Law. When a measure becomes a target, it ceases to be a good measure. Focus on the habit, not just the chart.
            `,
            quiz: [
                { q: "Visual trackers provide...", o: ["Confusion", "Immediate satisfaction/Reward", "Stress"], a: 1 },
                { q: "The 'Never Miss Twice' rule prevents...", o: ["Success", "Sliding into a slump", "Tracking"], a: 1 }
            ]
        },
        {
            id: 'mastery_flow',
            title: 'Mastery & Flow',
            desc: 'The Goldilocks Rule.',
            icon: '🥋',
            content: `
### Staying Motivated
Humans experience peak motivation when working on tasks that are right on the edge of their current abilities.
- **Too Hard**: Anxiety.
- **Too Easy**: Boredom.
- **Just Right**: Flow.
            `,
            quiz: [
                { q: "Peak motivation occurs when a task is...", o: ["Impossible", "Way too easy", "Just right difficulty"], a: 2 },
                { q: "The zone between anxiety and boredom is called...", o: ["Flow", "Sleep", "Stress"], a: 0 }
            ]
        }
    ]
};
