// 3 Games per Kids Civics Module (7 modules × 3 = 21 games)
// Game types: 'quiz' (MCQ), 'truefalse', 'scenario'

export const civicsKidsGames = {
    kids_mod_1: [
        {
            id: "kids_mod_1_g1",
            type: "quiz",
            emoji: "🏘️",
            title: "What Is a Community?",
            question: "Which of these is a community you belong to?",
            options: [
                { text: "Your school", correct: true },
                { text: "The moon", correct: false },
                { text: "A cloud", correct: false }
            ],
            explanation: "Your school is a community! It's a group of people who learn and work together."
        },
        {
            id: "kids_mod_1_g2",
            type: "truefalse",
            emoji: "🤝",
            title: "True or False?",
            question: "A community works better when people help each other.",
            answer: true,
            explanation: "TRUE! When people help each other, everything in the community gets better — roads, schools, and friendships!"
        },
        {
            id: "kids_mod_1_g3",
            type: "scenario",
            emoji: "🌍",
            title: "Make the Right Choice",
            situation: "You see your neighbour's mango rolling onto the road. You have time to help.",
            question: "What do you do?",
            options: [
                { text: "Pick it up and give it back 🙂", correct: true },
                { text: "Leave it on the road 😐", correct: false },
                { text: "Take it for yourself 😬", correct: false }
            ],
            explanation: "Great citizens help neighbours! That's what makes a community strong."
        }
    ],

    kids_mod_2: [
        {
            id: "kids_mod_2_g1",
            type: "quiz",
            emoji: "👑",
            title: "Leaders & Leadership",
            question: "What is the main job of a leader?",
            options: [
                { text: "To boss everyone around", correct: false },
                { text: "To help the team solve problems", correct: true },
                { text: "To take all the credit", correct: false }
            ],
            explanation: "Leaders are helpers! Their job is to guide and solve problems — not to be bossy."
        },
        {
            id: "kids_mod_2_g2",
            type: "truefalse",
            emoji: "🦁",
            title: "True or False?",
            question: "A good leader only cares about themselves.",
            answer: false,
            explanation: "FALSE! Good leaders care about everyone in the group, not just themselves."
        },
        {
            id: "kids_mod_2_g3",
            type: "scenario",
            emoji: "⚽",
            title: "Make the Right Choice",
            situation: "You are team captain. One teammate is sad because they never get to play.",
            question: "What do you do?",
            options: [
                { text: "Include them and give them a chance 🙌", correct: true },
                { text: "Ignore them, you have to win 🙈", correct: false },
                { text: "Tell them to go home 😤", correct: false }
            ],
            explanation: "A true captain makes sure everyone gets a fair chance — THAT'S real leadership!"
        }
    ],

    kids_mod_3: [
        {
            id: "kids_mod_3_g1",
            type: "quiz",
            emoji: "📜",
            title: "Rules and Laws",
            question: "Why do we have rules in school?",
            options: [
                { text: "To make children sad", correct: false },
                { text: "To keep everyone safe and fair", correct: true },
                { text: "Because teachers are bored", correct: false }
            ],
            explanation: "Rules keep everyone safe and make sure things are fair for everyone!"
        },
        {
            id: "kids_mod_3_g2",
            type: "truefalse",
            emoji: "⚖️",
            title: "True or False?",
            question: "Laws only apply to grown-ups, not children.",
            answer: false,
            explanation: "FALSE! Laws help protect EVERYONE — including children. That's why you have the right to go to school!"
        },
        {
            id: "kids_mod_3_g3",
            type: "scenario",
            emoji: "🚦",
            title: "Make the Right Choice",
            situation: "You see a sign that says 'Don't run in the corridor'. Your friend is running.",
            question: "What do you do?",
            options: [
                { text: "Run with your friend!", correct: false },
                { text: "Gently remind your friend about the rule 😊", correct: true },
                { text: "Ignore it, rules are boring", correct: false }
            ],
            explanation: "Good citizens remind each other to follow rules kindly. Rules prevent accidents!"
        }
    ],

    kids_mod_4: [
        {
            id: "kids_mod_4_g1",
            type: "quiz",
            emoji: "🛡️",
            title: "Rights and Respect",
            question: "Going to school is…",
            options: [
                { text: "A privilege only for rich children", correct: false },
                { text: "A right every child has", correct: true },
                { text: "Optional if you're tired", correct: false }
            ],
            explanation: "Education is a HUMAN RIGHT! Every child deserves to go to school, no matter who they are."
        },
        {
            id: "kids_mod_4_g2",
            type: "truefalse",
            emoji: "❤️",
            title: "True or False?",
            question: "If someone else has a right, I should respect it.",
            answer: true,
            explanation: "TRUE! We all have rights, but we must also RESPECT other people's rights. It works both ways!"
        },
        {
            id: "kids_mod_4_g3",
            type: "scenario",
            emoji: "🤐",
            title: "Make the Right Choice",
            situation: "In class, a quiet child raises their hand to answer but the teacher doesn't see. Your louder friend wants to answer instead.",
            question: "What is the fair thing?",
            options: [
                { text: "Let the quiet child speak first 🙋", correct: true },
                { text: "Shout over them so your friend can answer", correct: false },
                { text: "Tell the quiet child to give up", correct: false }
            ],
            explanation: "Everyone has the right to be heard! That's fairness and respect working together."
        }
    ],

    kids_mod_5: [
        {
            id: "kids_mod_5_g1",
            type: "quiz",
            emoji: "🏛️",
            title: "Government Basics",
            question: "Who builds the roads in our country?",
            options: [
                { text: "Nobody", correct: false },
                { text: "The government, using money from taxes", correct: true },
                { text: "Road fairies", correct: false }
            ],
            explanation: "The government uses money collected from people (taxes) to build roads, schools, and hospitals!"
        },
        {
            id: "kids_mod_5_g2",
            type: "truefalse",
            emoji: "🏥",
            title: "True or False?",
            question: "A government's job is to only help the President and ministers, not ordinary people.",
            answer: false,
            explanation: "FALSE! The government is supposed to serve ALL citizens — including YOU!"
        },
        {
            id: "kids_mod_5_g3",
            type: "scenario",
            emoji: "🌊",
            title: "Make the Right Choice",
            situation: "There is a flood in your village. Many people have lost their homes.",
            question: "Who should children ask for help?",
            options: [
                { text: "No one, just manage on your own", correct: false },
                { text: "The government and community leaders 📢", correct: true },
                { text: "Aliens from space 👽", correct: false }
            ],
            explanation: "That's right! The government is set up exactly to provide emergency help in situations like this."
        }
    ],

    kids_mod_6: [
        {
            id: "kids_mod_6_g1",
            type: "quiz",
            emoji: "🗳️",
            title: "Voting",
            question: "In a fair vote, who gets to vote?",
            options: [
                { text: "Only the class captain's friends", correct: false },
                { text: "Only the loudest people", correct: false },
                { text: "Everyone eligible — equally", correct: true }
            ],
            explanation: "In a fair vote, EVERY eligible person gets exactly ONE vote, no matter how loud or quiet they are."
        },
        {
            id: "kids_mod_6_g2",
            type: "truefalse",
            emoji: "✅",
            title: "True or False?",
            question: "The person who gets the most votes wins a fair election.",
            answer: true,
            explanation: "TRUE! This is called majority rule — the candidate with the most votes wins."
        },
        {
            id: "kids_mod_6_g3",
            type: "scenario",
            emoji: "😤",
            title: "Make the Right Choice",
            situation: "The class voted for a captain. Emeka got 15 votes, Adaeze got 12. Emeka's friend won.",
            question: "What should Adaeze do?",
            options: [
                { text: "Refuse to accept the result and cause trouble 😡", correct: false },
                { text: "Congratulate Emeka and support the team 🤝", correct: true },
                { text: "Demand all new votes until she wins", correct: false }
            ],
            explanation: "Accepting results peacefully is very important in democracy. You can try again next time!"
        }
    ],

    kids_mod_7: [
        {
            id: "kids_mod_7_g1",
            type: "quiz",
            emoji: "💪",
            title: "My Role as a Kid",
            question: "What is one thing YOU can do as a young citizen?",
            options: [
                { text: "Litter everywhere because adults will clean it", correct: false },
                { text: "Keep your environment clean and report problems to adults 🌱", correct: true },
                { text: "Do nothing and wait to grow up first", correct: false }
            ],
            explanation: "You can make a big difference right now! Keeping your environment clean is powerful civic action."
        },
        {
            id: "kids_mod_7_g2",
            type: "truefalse",
            emoji: "🌟",
            title: "True or False?",
            question: "Only adults can be good citizens.",
            answer: false,
            explanation: "FALSE! Children can be amazing citizens — by being honest, kind, following rules, and helping others."
        },
        {
            id: "kids_mod_7_g3",
            type: "scenario",
            emoji: "🗑️",
            title: "Make the Right Choice",
            situation: "You finish eating a snack in the park. There's no bin nearby.",
            question: "What does a good citizen do?",
            options: [
                { text: "Drop the wrapper on the ground", correct: false },
                { text: "Put it in your pocket until you find a bin 🎒", correct: true },
                { text: "Blame the government for not having enough bins", correct: false }
            ],
            explanation: "Great! Taking personal responsibility — even in small ways — is what civic life is all about!"
        }
    ]
};
