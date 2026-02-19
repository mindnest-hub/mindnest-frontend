export const bodyHealthData = {
    // TEEN TRACK (5 LEVELS - "Learning who I am")
    teens: [
        {
            id: 'body_basics',
            title: 'Understanding My Body',
            icon: '🧬',
            desc: 'Puberty, hormones, and growing up with confidence.',
            content: `
### Puberty & Changes
Puberty is like a software update for your body. It's normal to feel awkward!
- **Hormones**: Chemical messengers that tell your body to grow.
- **Hygiene**: Sweating is natural. Regular showers and deodorant help.
- **Body Image**: Every body grows at its own pace. Strength > Appearance.
            `,
            quiz: [
                { q: "What are hormones?", o: ["Tiny robots", "Chemical messengers", "Types of food"], a: 1 },
                { q: "True or False: Everyone goes through puberty at the exact same time.", o: ["True", "False"], a: 1 }
            ]
        },
        {
            id: 'nutrition_teen',
            title: 'Nutrition Power',
            icon: '🍎', // Apple
            desc: 'Fueling your brain and body for energy.',
            content: `
### Fuel Your Potential
- **Real Food vs. Junk**: "Junk" food gives quick energy that crashes fast. Whole foods give lasting power.
- **Hydration**: Water is the best energy drink. Your brain needs it to focus.
- **Emotional Eating**: Eating because you're bored or sad, not hungry.
            `,
            quiz: [
                { q: "Which gives lasting energy?", o: ["Soda", "Whole grains & fruits", "Candy"], a: 1 },
                { q: "What is the best drink for focus?", o: ["Coffee", "Water", "Energy drinks"], a: 1 }
            ]
        },
        {
            id: 'sleep_energy',
            title: 'Sleep & Energy',
            icon: '⚡',
            desc: 'Why rest is your secret weapon.',
            content: `
### Sleep is for Champions
- **Growth**: You actually grow while you sleep!
- **Screens**: Blue light from phones tricks your brain into thinking it's daytime. Turn them off 1 hour before bed.
- **Mood**: Tired = Grumpy. Rested = Ready for anything.
            `,
            quiz: [
                { q: "What tricks your brain into staying awake?", o: ["Books", "Blue light from screens", "Darkness"], a: 1 },
                { q: "When does your body do most of its growing?", o: ["During school", "While sleeping", "While eating"], a: 1 }
            ]
        },
        {
            id: 'physical_activity',
            title: 'Move Your Body',
            icon: '🏃',
            desc: 'Exercise for mood, strength, and confidence.',
            content: `
### Movement is Medicine
- **It's not just for sports**: Dancing, walking, and playing tag count!
- **Posture**: Stand tall like a leader. Slumping affects your mood.
- **Confidence**: Being strong feels good.
            `,
            quiz: [
                { q: "Which counts as exercise?", o: ["Only running", "Only gym", "Dancing, walking, sports"], a: 2 },
                { q: "Good posture can help your...", o: ["Grades directly", "Mood and confidence", "Hair growth"], a: 1 }
            ]
        },
        {
            id: 'sexual_health_teen',
            title: 'Sexual Health & Safety',
            icon: '🛡️',
            desc: 'Respect, consent, and staying safe.',
            content: `
### Respect & Boundaries
- **Consent**: It must be an enthusiastic "Yes!". Silence is not a yes.
- **STIs**: Infections can happen. Protection and knowledge are key.
- **Peer Pressure**: True friends respect your "No".
- **Pregnancy Awareness**: Understanding how life is created and the responsibility it takes.
            `,
            quiz: [
                { q: "Consent must be...", o: ["Implied", "Enthusiastic and clear", "Forced"], a: 1 },
                { q: "Who decides your boundaries?", o: ["Your friends", "You", "TV shows"], a: 1 }
            ]
        }
    ],

    // ADULT TRACK (7 LEVELS - "Responsibility & Pressure")
    adults: [
        {
            id: 'stress_mgmt',
            title: 'Stress & Burnout',
            icon: '📉',
            desc: 'Managing work, money, and emotional overload.',
            content: `
### The Burnout Trap
- **Signs**: Constant fatigue, cynicism, feeling ineffective.
- **Recovery**: Disconnect to reconnect. You cannot pour from an empty cup.
- **Financial Stress**: Focus on what you can control. Create a plan.
            `,
            quiz: [
                { q: "What is a sign of burnout?", o: ["High energy", "Cynicism and fatigue", "Excitement"], a: 1 },
                { q: "To recover, you need to...", o: ["Work harder", "Disconnect and rest", "Ignore it"], a: 1 }
            ]
        },
        {
            id: 'preventive_health',
            title: 'Preventive Health',
            icon: '🩺',
            desc: 'Blood pressure, diabetes, and regular checks.',
            content: `
### Your Body is an Engine
- **Maintenance**: Regular check-ups catch issues early (BP, Sugar levels).
- **Lifestyle Diseases**: Type 2 Diabetes and Hypertension are often manageable with lifestyle changes.
- **Know Your Numbers**: BP, weight, cholesterol.
            `,
            quiz: [
                { q: "Why are check-ups important?", o: ["To spend money", "Catch issues early", "Waste time"], a: 1 },
                { q: "Many lifestyle diseases are...", o: ["Manageable/Preventable", "Inevitable", "Fake"], a: 0 }
            ]
        },
        {
            id: 'nutrition_adult',
            title: 'Nutrition & Lifestyle',
            icon: '🥦', // Broccoli
            desc: 'Healthy eating on a busy schedule.',
            content: `
### Fueling for Longevity
- **Budget Eating**: Beans, greens, and local produce are superfoods and affordable.
- **Portion Control**: We often eat more than we need.
- **Hydration**: Often mistaken for hunger. Drink water first.
            `,
            quiz: [
                { q: "Which are affordable superfoods?", o: ["Imported snacks", "Beans and greens", "Fast food"], a: 1 },
                { q: "Thirst is often mistaken for...", o: ["Sleepiness", "Hunger", "Anger"], a: 1 }
            ]
        },
        {
            id: 'sleep_opt',
            title: 'Sleep Optimization',
            icon: '🌙',
            desc: 'Recovery, insomnia, and night routines.',
            content: `
### Sleep is Repair Time
- **Insomnia**: Often caused by stress or irregular schedules.
- **Routine**: Dark room, cool temperature, no screens.
- **The Link**: Poor sleep increases risk of heart disease and diabetes.
            `,
            quiz: [
                { q: "Poor sleep risks...", o: ["Nothing", "Heart disease & diabetes", "Better mood"], a: 1 },
                { q: "A good sleep environment is...", o: ["Bright and loud", "Dark and cool", "Warm and noisy"], a: 1 }
            ]
        },
        {
            id: 'physical_fitness_adult',
            title: 'Physical Fitness',
            icon: '🏋️',
            desc: 'Mobility, injury prevention, and activity.',
            content: `
### Move to Live
- **Sitting Disease**: Sitting all day hurts your back and heart. Stand up every hour.
- **Mobility**: Stretching prevents injuries as we age.
- **Strength**: Muscle protects your bones and metabolism.
            `,
            quiz: [
                { q: "What protects bones and metabolism?", o: ["Sitting", "Muscle/Strength", "Sleeping"], a: 1 },
                { q: "How often should you stand if working at a desk?", o: ["Every hour", "Once a day", "Never"], a: 0 }
            ]
        },
        {
            id: 'sexual_health_adult',
            title: 'Sexual Health',
            icon: '❤️', // Heart (Neutral)
            desc: 'Fertility, family planning, and intimacy.',
            content: `
### Healthy Intimacy
- **Family Planning**: Deciding when/if to have children allows for better financial stability.
- **Check-ups**: Regular screenings (Pap smears, prostate) save lives.
- **Communication**: Intimacy requires open, honest talk with your partner.
            `,
            quiz: [
                { q: "Family planning helps with...", o: ["Financial stability", "Nothing", "Creating stress"], a: 0 },
                { q: "Intimacy requires...", o: ["Silence", "Communication", "Secrets"], a: 1 }
            ]
        },
        {
            id: 'addiction_control',
            title: 'Addiction Control',
            icon: '🚭',
            desc: 'Breaking free from smoking, alcohol, and habits.',
            content: `
### Reclaiming Control
- **Dopamine Traps**: Gambling, scrolling, and substances hijack your brain's reward system.
- **Triggers**: Identify what makes you want to use/do the habit.
- **Replacement**: Swap a bad habit for a neutral one (e.g., chewing gum instead of smoking).
            `,
            quiz: [
                { q: "What hijacks the reward system?", o: ["Water", "Dopamine traps", "Sleep"], a: 1 },
                { q: "A good strategy for bad habits is...", o: ["Replacement", "Giving up", "Doing it more"], a: 0 }
            ]
        }
    ]
};
