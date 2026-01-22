import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { triggerLiveEvent } from '../components/LiveNotifications';
import { africanResources } from '../data/africanResources';
import Toast from '../components/Toast';
const CriticalThinking = ({ ageGroup }) => {
    console.log("CriticalThinking: Component Mounting...");
    const navigate = useNavigate();
    const isKid = ageGroup === 'kids' || ageGroup === 'Kids';
    console.log("CriticalThinking: AgeGroup:", ageGroup, "isKid:", isKid);
    const isTeen = ageGroup === 'teens' || ageGroup === 'Teens';
    const isAdult = !isKid && !isTeen;

    let wallet;
    try {
        wallet = useWallet();
        console.log("CriticalThinking: Wallet loaded", wallet);
    } catch (e) {
        console.error("CriticalThinking: Wallet Error", e);
    }
    const { addEarnings } = wallet || {};

    const [expandedModule, setExpandedModule] = useState(null);
    const [globalError, setGlobalError] = useState(null);

    // DEBUGGING: Catch runtime errors
    useEffect(() => {
        const handleError = (event) => {
            console.error("CriticalThinking Error Caught:", event);
            setGlobalError({
                message: event.message || "Unknown Error",
                stack: event.error?.stack || "No stack trace",
                lineno: event.lineno,
                filename: event.filename
            });
        };

        const handleRejection = (event) => {
            console.error("CriticalThinking Promise Rejection:", event);
            setGlobalError({
                message: "Promise Rejection: " + (event.reason?.message || event.reason),
                stack: event.reason?.stack,
                type: "Unhandled Rejection"
            });
        };

        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleRejection);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleRejection);
        };
    }, []);

    if (globalError) {
        return (
            <div style={{
                padding: '2rem', color: '#ff4444', backgroundColor: '#1a1a1a',
                minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '1rem',
                fontFamily: 'monospace'
            }}>
                <h1 style={{ fontSize: '2rem' }}>⚠️ Application Error</h1>
                <div style={{ padding: '1rem', border: '1px solid #ff4444', borderRadius: '10px' }}>
                    <p style={{ fontWeight: 'bold' }}>{globalError.message}</p>
                    {globalError.filename && <p>File: {globalError.filename}:{globalError.lineno}</p>}
                    <pre style={{ whiteSpace: 'pre-wrap', overflowX: 'auto', fontSize: '0.8rem', color: '#aaa' }}>
                        {globalError.stack}
                    </pre>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    style={{ padding: '1rem', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '5px', fontSize: '1.2rem', cursor: 'pointer' }}
                >
                    🔄 Reload Page
                </button>
            </div>
        );
    }

    const toggleModule = (id) => {
        if (expandedModule === id) {
            setExpandedModule(null);
        } else {
            setExpandedModule(id);
        }
    };

    // --- GAMIFICATION STATE ---
    const [completedModules, setCompletedModules] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('criticalThinkingCompleted')) || [];
        } catch (e) {
            return [];
        }
    });
    const [brainPower, setBrainPower] = useState(() => Number(localStorage.getItem('brainPower')) || 0);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState("");
    const [creativeMode, setCreativeMode] = useState(null); // 'delib-cog', 'delib-emo', 'spon-cog', 'spon-emo'
    const [toast, setToast] = useState(null);
    const MAX_EARNINGS = 1500;

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
    };

    const [seenFacts, setSeenFacts] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('seenFacts')) || [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('seenFacts', JSON.stringify(seenFacts));
    }, [seenFacts]);

    const getRandomFact = () => {
        // Filter out facts we've already seen
        const availableFacts = africanResources.filter(r => !seenFacts.includes(r.fact));

        // If we've seen everything, reset the history to start fresh (or just pick random)
        const pool = availableFacts.length > 0 ? availableFacts : africanResources;

        if (availableFacts.length === 0 && seenFacts.length > 0) {
            // Optional: Auto-reset if we ran out
            setSeenFacts([]);
        }

        const random = pool[Math.floor(Math.random() * pool.length)];

        // Add to seen list if it's not already there
        if (!seenFacts.includes(random.fact)) {
            setSeenFacts(prev => [...prev, random.fact]);
        }

        return `Did you know? ${random.fact} (${random.country})`;
    };

    useEffect(() => {
        localStorage.setItem('criticalThinkingCompleted', JSON.stringify(completedModules));
        localStorage.setItem('brainPower', brainPower);
    }, [completedModules, brainPower]);

    // --- MENTOR CHAT STATE ---
    const [showChat, setShowChat] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { sender: 'mentor', text: "Greetings, young one! 🦁 I am the Village Mentor. Tell me, what did you do today?" }
    ]);
    const [chatInput, setChatInput] = useState("");
    const chatEndRef = useRef(null);

    // --- MISSING STATES (FIXED) ---
    const [wisdomEntry, setWisdomEntry] = useState("");
    const [savedWisdom, setSavedWisdom] = useState(() => localStorage.getItem('wisdomLog') || "");

    // --- DETECTIVE MODE STATES ---
    const [detectiveCase, setDetectiveCase] = useState(0); // Case index
    const [detectiveStep, setDetectiveStep] = useState(0); // 0: Case Selection, 1: Solving
    const [detectiveSuspect, setDetectiveSuspect] = useState(null);
    const [detectiveFeedback, setDetectiveFeedback] = useState("");
    const [solvedCases, setSolvedCases] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('solvedDetectiveCases')) || [];
        } catch (e) {
            return [];
        }
    });

    // --- BRAIN GYM STATES ---
    const [gymStatus, setGymStatus] = useState('idle'); // idle, playing, complete
    const [gymScore, setGymScore] = useState(0);
    const [gymTimer, setGymTimer] = useState(60);
    const [gymQuestion, setGymQuestion] = useState(null);
    const [gymAnswer, setGymAnswer] = useState("");







    // --- MINI-GAME STATES ---
    // Module 1: Observation (Interactive)
    const [obsLevel, setObsLevel] = useState(0);
    const [obsInput, setObsInput] = useState("");
    const [obsFeedback, setObsFeedback] = useState("");
    const [showMemory, setShowMemory] = useState(true); // For teens memory game
    const [memoryTimer, setMemoryTimer] = useState(5);

    const kidObsItems = [
        { id: 1, emoji: "🦁", name: "Lion", hint: "King of the jungle. Starts with L." },
        { id: 2, emoji: "🚗", name: "Car", hint: "Vroom vroom! Starts with C." },
        { id: 3, emoji: "🍌", name: "Banana", hint: "Monkeys love it. Starts with B." }
    ];

    const teenObsItems = [
        { id: 1, items: ["📕", "👓", "🔑", "🍎"], answer: ["book", "glasses", "key", "apple"] },
        { id: 2, items: ["⚽", "👟", "🏆", "👕"], answer: ["ball", "shoe", "trophy", "shirt"] }
    ];

    // Module 2: Asking Good Questions (Chat Bot)
    const [questChat, setQuestChat] = useState([
        { sender: 'elder', text: "Greetings! Ask me anything. Start with 'Why' or 'How'. 🦁" }
    ]);
    const [questInput, setQuestInput] = useState("");

    const chatQuestions = [
        { q: "The sun is hot. ☀️", type: "FACT" },
        { q: "Blue is the best color. 💙", type: "OPINION" },
        { q: "Dogs have 4 legs. 🐕", type: "FACT" }
    ];

    // Module 10: Media Literacy (Unused/Placeholder in current render?)
    const [mediaScore, setMediaScore] = useState(0);
    const [mediaIndex, setMediaIndex] = useState(0);
    const mediaQuestions = [
        { q: "Win a free iPhone! Click here! 📱", type: "FAKE" },
        { q: "NASA lands rover on Mars. 🚀", type: "REAL" },
        { q: "Send this to 10 friends or bad luck! 🍀", type: "FAKE" }
    ];

    // --- MARKET DAY STATE ---
    const [marketScore, setMarketScore] = useState(0);
    const [marketIndex, setMarketIndex] = useState(() => Number(localStorage.getItem('marketIndex')) || 0);

    useEffect(() => {
        localStorage.setItem('marketIndex', marketIndex);
    }, [marketIndex]);

    const marketScenarios = [
        { q: "You have ₦100. Apples cost ₦20. How many can you buy?", options: ["3", "5", "10"], choice: "5", reason: "100 / 20 = 5" },
        { q: "A toy is ₦50. It's on sale for half price. How much is it?", options: ["₦25", "₦50", "₦10"], choice: "₦25", reason: "Half of 50 is 25." },
        { q: "You want to save ₦10 every day. How much in a week?", options: ["₦50", "₦70", "₦100"], choice: "₦70", reason: "10 x 7 = 70." }
    ];

    // --- DILEMMA TALES STATE ---
    const [dilemmaIndex, setDilemmaIndex] = useState(() => Number(localStorage.getItem('dilemmaIndex')) || 0);
    const [dilemmaFeedback, setDilemmaFeedback] = useState("");

    useEffect(() => {
        localStorage.setItem('dilemmaIndex', dilemmaIndex);
    }, [dilemmaIndex]);

    const dilemmas = [
        { q: "A hungry lion asks where the gazelle went. You know. What do you say?", options: ["Tell the truth (Lion eats Gazelle)", "Lie (Save Gazelle)", "Run away"], good: "Lie (Save Gazelle)" },
        { q: "You promised to keep a secret, but it might hurt someone. Do you tell?", options: ["Keep Secret", "Tell to protect", "Ignore it"], good: "Tell to protect" }
    ];

    // --- TEACH A FRIEND STATE ---
    const [teachTopicIndex, setTeachTopicIndex] = useState(0);
    const [teachExplanation, setTeachExplanation] = useState("");
    const [teachFeedback, setTeachFeedback] = useState("");
    const [teachScore, setTeachScore] = useState(0);

    // --- LEGEND OF TRUTH STATE ---
    const [truthStep, setTruthStep] = useState(0);
    const [isReading, setIsReading] = useState(false);

    useEffect(() => {
        return () => window.speechSynthesis.cancel();
    }, []);

    const speakText = (text) => {
        if (isReading) {
            window.speechSynthesis.cancel();
            setIsReading(false);
            return;
        }
        setIsReading(true);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsReading(false);
        window.speechSynthesis.speak(utterance);
    };

    const teachTopics = [
        {
            topic: "Why do we need to drink water?",
            keywords: ["thirsty", "body", "healthy", "live", "survive", "hydrate"],
            goodResponse: "Amazing! 🌟 You explained it so well! Water keeps our body working and helps us stay healthy. You're a great teacher!",
            encouragement: "Good try! 💪 Remember: Water helps our body work properly. We need it to stay alive and healthy. Try explaining it in your own words!"
        },
        {
            topic: "Why should we be kind to others?",
            keywords: ["happy", "feel", "good", "friends", "nice", "help", "love"],
            goodResponse: "Wonderful! ❤️ You understand kindness! Being kind makes everyone feel good and helps us make friends. Keep teaching!",
            encouragement: "That's a start! 😊 Think about: How do YOU feel when someone is kind to you? Being kind makes people happy and helps us be friends!"
        },
        {
            topic: "Why do plants need sunlight?",
            keywords: ["grow", "food", "energy", "green", "photosynthesis", "leaves"],
            goodResponse: "Excellent! 🌱 You know how plants work! Sunlight helps plants make their own food so they can grow big and strong!",
            encouragement: "Nice thinking! 🌞 Here's a hint: Plants use sunlight like we use food - it gives them energy to grow! Can you explain it that way?"
        },
        {
            topic: "Why is it important to tell the truth?",
            keywords: ["trust", "believe", "honest", "friends", "right", "good"],
            goodResponse: "Perfect! 🦁 You understand honesty! When we tell the truth, people can trust us and we feel good inside!",
            encouragement: "Good effort! 💭 Think about: What happens when someone lies to you? Truth helps people trust each other. Try again!"
        }
    ];

    const handleTeachSubmit = () => {
        if (!teachExplanation.trim()) {
            setTeachFeedback("Tell me what you would teach your friend! 😊");
            return;
        }

        verifyAction(() => {
            const currentTopic = teachTopics[teachTopicIndex];
            const explanation = teachExplanation.toLowerCase();

            // Check if explanation contains key concepts
            const keywordsFound = currentTopic.keywords.filter(keyword =>
                explanation.includes(keyword.toLowerCase())
            ).length;

            const isGoodExplanation = keywordsFound >= 2 || explanation.length > 30;

            if (isGoodExplanation) {
                setTeachFeedback(currentTopic.goodResponse);
                setTeachScore(prev => prev + 1);
                triggerConfetti();
                addEarnings('criticalThinking', 50);

                setTimeout(() => {
                    setTeachFeedback("");
                    setTeachExplanation("");
                    if (teachTopicIndex < teachTopics.length - 1) {
                        setTeachTopicIndex(prev => prev + 1);
                    } else {
                        markComplete(13); // Teach a Friend module ID
                    }
                }, 4000);
            } else {
                setTeachFeedback(currentTopic.encouragement);
                setTimeout(() => setTeachFeedback(""), 3000);
            }
        }, "Listening to your teaching... 👂");
    };

    // --- BASIC REASONING GAMES STATE ---
    const [reasoningGame, setReasoningGame] = useState(0); // 0: Shape Match, 1: What's Next, 2: Odd One Out
    const [reasoningLevel, setReasoningLevel] = useState(0);
    const [reasoningScore, setReasoningScore] = useState(0);
    const [reasoningFeedback, setReasoningFeedback] = useState("");

    // Game 1: Shape Matching
    const shapeGames = [
        { shapes: ["🔴", "🔴", "🟦"], question: "Which shapes are the same?", answer: "🔴", options: ["🔴", "🟦", "🟢"] },
        { shapes: ["⭐", "⭐", "⭐", "🌙"], question: "Which one is different?", answer: "🌙", options: ["⭐", "🌙", "🔴"] },
        { shapes: ["🔺", "🔺", "🔻"], question: "Which shapes match?", answer: "🔺", options: ["🔺", "🔻", "🟦"] }
    ];

    // Game 2: What Comes Next (Patterns)
    const sequenceGames = [
        { sequence: ["🍎", "🍌", "🍎", "🍌", "🍎", "?"], answer: "🍌", options: ["🍌", "🍎", "🍊"] },
        { sequence: ["🐶", "🐱", "🐶", "🐱", "?"], answer: "🐶", options: ["🐶", "🐱", "🐭"] },
        { sequence: ["🌞", "🌙", "🌞", "🌙", "?"], answer: "🌞", options: ["🌞", "🌙", "⭐"] }
    ];

    // Game 3: Odd One Out
    const oddOneGames = [
        { items: ["🍎", "🍌", "🍊", "🚗"], question: "Which doesn't belong?", answer: "🚗", options: ["🍎", "🍌", "🚗"] },
        { items: ["🐶", "🐱", "🐭", "🌳"], question: "Which is not an animal?", answer: "🌳", options: ["🐶", "🌳", "🐭"] },
        { items: ["⚽", "🏀", "🎾", "🍕"], question: "Which is not a ball?", answer: "🍕", options: ["⚽", "🍕", "🏀"] }
    ];

    const handleReasoningAnswer = (answer) => {
        verifyAction(() => {
            let correct = false;
            let currentGame;

            if (reasoningGame === 0) {
                currentGame = shapeGames[reasoningLevel];
            } else if (reasoningGame === 1) {
                currentGame = sequenceGames[reasoningLevel];
            } else {
                currentGame = oddOneGames[reasoningLevel];
            }

            if (answer === currentGame.answer) {
                setReasoningFeedback(`Correct! 🎉 ${getRandomFact()}`);
                setReasoningScore(prev => prev + 1);
                triggerConfetti();
                addEarnings('criticalThinking', 30);

                setTimeout(() => {
                    setReasoningFeedback("");
                    if (reasoningLevel < 2) {
                        setReasoningLevel(prev => prev + 1);
                    } else if (reasoningGame < 2) {
                        setReasoningGame(prev => prev + 1);
                        setReasoningLevel(0);
                    } else {
                        markComplete(11); // Basic Reasoning complete
                    }
                }, 3000);
            } else {
                setReasoningFeedback("Try again! Think carefully 🤔");
                setTimeout(() => setReasoningFeedback(""), 1500);
            }
        }, "Checking your answer...");
    };

    // --- LOGIC GAMES STATE (Module 3) ---
    const [logicGame, setLogicGame] = useState(0); // 0: Boat Puzzle, 1: True/False, 2: Number Sequences, 3: If-Then
    const [logicLevel, setLogicLevel] = useState(0);
    const [logicScore, setLogicScore] = useState(0);
    const [logicFeedback, setLogicFeedback] = useState("");

    // Game 1: True or False Logic
    const trueFalseGames = [
        { statement: "All birds can fly", answer: false, explanation: "Penguins and ostriches are birds but can't fly! 🐧" },
        { statement: "The sun rises in the east", answer: true, explanation: "Correct! The sun always rises in the east! ☀️" },
        { statement: "Fish can live without water", answer: false, explanation: "Fish need water to breathe! 🐠" },
        { statement: "Lions are the king of the jungle", answer: true, explanation: "Yes! Lions are called the king of the jungle! 🦁" }
    ];

    // Game 2: Number Sequences (What's Missing?)
    const numberSequences = [
        { sequence: [2, 4, "?", 8, 10], answer: "6", options: ["5", "6", "7"], explanation: "Count by 2s: 2, 4, 6, 8, 10!" },
        { sequence: [1, 3, 5, "?", 9], answer: "7", options: ["6", "7", "8"], explanation: "Odd numbers: 1, 3, 5, 7, 9!" },
        { sequence: [10, 20, 30, "?"], answer: "40", options: ["35", "40", "50"], explanation: "Count by 10s: 10, 20, 30, 40!" },
        { sequence: [5, 10, 15, "?", 25], answer: "20", options: ["18", "20", "22"], explanation: "Count by 5s: 5, 10, 15, 20, 25!" }
    ];

    // Game 3: If-Then Logic
    const ifThenGames = [
        {
            question: "If it rains, the ground gets ___",
            options: ["Wet 💧", "Dry ☀️", "Hot 🔥"],
            answer: "Wet 💧",
            explanation: "When it rains, water makes the ground wet!"
        },
        {
            question: "If you study hard, you will ___",
            options: ["Learn 📚", "Sleep 😴", "Play 🎮"],
            answer: "Learn 📚",
            explanation: "Studying helps you learn new things!"
        },
        {
            question: "If you plant a seed, it will ___",
            options: ["Grow 🌱", "Fly 🦅", "Swim 🏊"],
            answer: "Grow 🌱",
            explanation: "Seeds grow into plants with water and sunlight!"
        },
        {
            question: "If you are kind to others, they will ___",
            options: ["Be happy 😊", "Be sad 😢", "Be angry 😠"],
            answer: "Be happy 😊",
            explanation: "Kindness makes people happy!"
        }
    ];

    const handleLogicAnswer = (answer) => {
        verifyAction(() => {
            let currentGame, correct = false, explanation = "";

            if (logicGame === 1) {
                // True/False
                currentGame = trueFalseGames[logicLevel];
                correct = answer === currentGame.answer;
                explanation = currentGame.explanation;
            } else if (logicGame === 2) {
                // Number Sequences
                currentGame = numberSequences[logicLevel];
                correct = answer === currentGame.answer;
                explanation = currentGame.explanation;
            } else if (logicGame === 3) {
                // If-Then
                currentGame = ifThenGames[logicLevel];
                correct = answer === currentGame.answer;
                explanation = currentGame.explanation;
            }

            if (correct) {
                setLogicFeedback(`Correct! 🎉\n\n${explanation}\n\n${getRandomFact()}`);
                setLogicScore(prev => prev + 1);
                triggerConfetti();
                addEarnings('criticalThinking', 35);

                setTimeout(() => {
                    setLogicFeedback("");
                    if (logicLevel < 3) {
                        setLogicLevel(prev => prev + 1);
                    } else if (logicGame < 3) {
                        setLogicGame(prev => prev + 1);
                        setLogicLevel(0);
                    } else {
                        markComplete(3); // All logic games complete!
                    }
                }, 4000);
            } else {
                setLogicFeedback("Try again! Think carefully 🤔");
                setTimeout(() => setLogicFeedback(""), 1500);
            }
        }, "Thinking...");
    };

    // --- RIDDLE STATE ---
    const [riddleGame, setRiddleGame] = useState(0); // 0: Classic Riddles, 1: Animal Sounds, 2: Rhyme Time
    const [riddleScore, setRiddleScore] = useState(0);
    const [riddleIndex, setRiddleIndex] = useState(() => Number(localStorage.getItem('riddleIndex')) || 0);
    const [showRiddleResult, setShowRiddleResult] = useState(null);

    useEffect(() => {
        localStorage.setItem('riddleIndex', riddleIndex);
    }, [riddleIndex]);

    // Game 1: Classic African Riddles
    const classicRiddles = [
        { q: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?", options: ["A Map 🗺️", "A Dream 💭", "A Painting 🎨"], ans: "A Map 🗺️" },
        { q: "The more of this there is, the less you see. What is it?", options: ["Darkness 🌑", "Fog 🌫️", "Light 💡"], ans: "Darkness 🌑" },
        { q: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", options: ["An Echo 🗣️", "A Ghost 👻", "A Cloud ☁️"], ans: "An Echo 🗣️" },
        { q: "I have a neck but no head. I have two arms but no hands. What am I?", options: ["A Shirt 👕", "A Tree 🌳", "A River 🌊"], ans: "A Shirt 👕" }
    ];

    // Game 2: Animal Sounds (What Animal Makes This Sound?)
    const animalSounds = [
        { sound: "ROAR!", emoji: "🦁", question: "What animal makes this sound?", options: ["Lion 🦁", "Elephant 🐘", "Monkey 🐒"], ans: "Lion 🦁" },
        { sound: "MOO!", emoji: "🐄", question: "What animal makes this sound?", options: ["Goat 🐐", "Cow 🐄", "Sheep 🐑"], ans: "Cow 🐄" },
        { sound: "TWEET TWEET!", emoji: "🐦", question: "What animal makes this sound?", options: ["Bird 🐦", "Frog 🐸", "Cat 🐱"], ans: "Bird 🐦" },
        { sound: "HISS!", emoji: "🐍", question: "What animal makes this sound?", options: ["Snake 🐍", "Lion 🦁", "Dog 🐕"], ans: "Snake 🐍" }
    ];

    // Game 3: Rhyme Time (Complete the Rhyme)
    const rhymeGames = [
        { line1: "Twinkle, twinkle, little ___", options: ["Star ⭐", "Car 🚗", "Jar 🏺"], ans: "Star ⭐", hint: "It shines in the sky!" },
        { line1: "The cat sat on the ___", options: ["Mat 🧘", "Bat 🦇", "Hat 🎩"], ans: "Mat 🧘", hint: "You sit or stand on it!" },
        { line1: "I see a big red ___", options: ["Ball ⚽", "Wall 🧱", "Doll 🪆"], ans: "Ball ⚽", hint: "You can throw and catch it!" },
        { line1: "The sun is very ___", options: ["Hot ☀️", "Pot 🍲", "Dot •"], ans: "Hot ☀️", hint: "It gives us warmth!" }
    ];

    const riddles = classicRiddles; // Keep for backward compatibility

    // --- PATTERN STATE ---
    const [patternLevel, setPatternLevel] = useState(() => Number(localStorage.getItem('patternLevel')) || 0);
    const [patternFeedback, setPatternFeedback] = useState("");

    useEffect(() => {
        localStorage.setItem('patternLevel', patternLevel);
    }, [patternLevel]);

    const patterns = [
        { seq: ["🔴", "🔵", "🔴", "?"], options: ["🔴", "🔵", "🟢"], ans: "🔵" },
        { seq: ["⭐", "🌙", "⭐", "🌙", "?"], options: ["⭐", "☀️", "🌙"], ans: "⭐" },
        { seq: ["1", "2", "4", "8", "?"], options: ["10", "12", "16"], ans: "16" }
    ];

    // --- RIVER CROSSING STATE (Logic) ---
    const [riverItems, setRiverItems] = useState([
        { id: 'lion', name: 'Lion', emoji: '🦁', side: 'left' },
        { id: 'goat', name: 'Goat', emoji: '🐐', side: 'left' },
        { id: 'yam', name: 'Yam', emoji: '🍠', side: 'left' }
    ]);
    const [boatSide, setBoatSide] = useState('left'); // 'left' or 'right'
    const [boatContent, setBoatContent] = useState(null); // null or item ID
    const [riverMessage, setRiverMessage] = useState("Help the Farmer cross the river! 🚣");
    const [riverStatus, setRiverStatus] = useState('playing'); // 'playing', 'won', 'lost'

    // --- CATTLE HERDER STATE (Problem Solving) ---
    const [herderLevel, setHerderLevel] = useState(() => Number(localStorage.getItem('herderLevel')) || 0);
    const [herderPos, setHerderPos] = useState({ x: 0, y: 0 });
    const [herderCommands, setHerderCommands] = useState([]);
    const [herderStatus, setHerderStatus] = useState('planning'); // 'planning', 'running', 'won', 'lost'
    const [herderMessage, setHerderMessage] = useState("Guide the Herdsman to the Water! 💧");
    const [herderEarnings, setHerderEarnings] = useState(0); // Visual tracker

    useEffect(() => {
        localStorage.setItem('herderLevel', herderLevel);
    }, [herderLevel]);

    const kidLevels = [
        {
            id: 1,
            gridSize: 3,
            start: { x: 0, y: 0 },
            goal: { x: 2, y: 0 },
            obstacles: [],
            lions: []
        },
        {
            id: 2,
            gridSize: 4,
            start: { x: 0, y: 0 },
            goal: { x: 3, y: 2 },
            obstacles: [{ x: 1, y: 1, type: 'rock' }, { x: 2, y: 0, type: 'rock' }],
            lions: []
        },
        {
            id: 3,
            gridSize: 4,
            start: { x: 0, y: 0 },
            goal: { x: 3, y: 3 },
            obstacles: [{ x: 1, y: 1, type: 'rock' }, { x: 2, y: 2, type: 'rock' }, { x: 0, y: 2, type: 'rock' }],
            lions: []
        }
    ];

    const teenLevels = [
        {
            id: 1,
            gridSize: 4,
            start: { x: 0, y: 0 },
            goal: { x: 3, y: 3 },
            obstacles: [{ x: 1, y: 1, type: 'rock' }, { x: 2, y: 1, type: 'rock' }],
            lions: [{ x: 0, y: 2 }]
        },
        {
            id: 2,
            gridSize: 5,
            start: { x: 0, y: 0 },
            goal: { x: 4, y: 4 },
            obstacles: [{ x: 1, y: 1, type: 'rock' }, { x: 3, y: 3, type: 'rock' }, { x: 2, y: 2, type: 'rock' }],
            lions: [{ x: 4, y: 3 }, { x: 3, y: 4 }, { x: 1, y: 3 }]
        },
        {
            id: 3,
            gridSize: 5,
            start: { x: 0, y: 0 },
            goal: { x: 4, y: 0 },
            obstacles: [{ x: 1, y: 1, type: 'rock' }, { x: 2, y: 2, type: 'rock' }, { x: 3, y: 1, type: 'rock' }],
            lions: [{ x: 2, y: 0 }, { x: 4, y: 2 }]
        }
    ];

    const herderLevels = isKid ? kidLevels : teenLevels;

    useEffect(() => {
        const level = herderLevels[herderLevel];
        if (level) {
            setHerderPos({ ...level.start });
            setHerderCommands([]);
            setHerderStatus('planning');
            setHerderMessage("Guide the Herdsman to the Water! 💧");
        }
    }, [herderLevel, isKid]);



    // --- FALLACY DETECTIVE STATE (ADULT) ---
    const [fallacyIndex, setFallacyIndex] = useState(0);
    const [fallacyScore, setFallacyScore] = useState(0);
    const [showFallacyResult, setShowFallacyResult] = useState(null);
    const fallacies = [
        { q: "You're too young to understand money, so your opinion is wrong.", a: "Ad Hominem 🗣️", options: ["Ad Hominem 🗣️", "Strawman 🌾", "Red Herring 🐟"] },
        { q: "If we allow one mistake, the whole project will fail immediately!", a: "Slippery Slope ⛷️", options: ["Bandwagon 🎺", "Slippery Slope ⛷️", "False Dilemma ⚖️"] },
        { q: "Everyone is buying this crypto, so it must be a good investment.", a: "Bandwagon 🎺", options: ["Ad Hominem 🗣️", "Bandwagon 🎺", "Circular Reasoning 🔄"] }
    ];

    // --- STRATEGY ROOM STATE (ADULT) ---
    const [strategyLevel, setStrategyLevel] = useState(0);
    const [strategyMessage, setStrategyMessage] = useState("Analyze the board. Find the winning move.");
    const strategies = [
        { name: "The Opening", setup: [4, 4, 4, 4, 4, 4], goal: "Standard Oware opening. Capture is not possible yet.", hint: "Focus on distributing seeds to your side." },
        { name: "The Trap", setup: [0, 0, 0, 0, 1, 0], goal: "Capture seeds in the next move.", hint: "Look for a pit with 1 seed that lands in an empty pit." },
        { name: "Endgame", setup: [1, 0, 0, 0, 0, 0], goal: "Clear your side to win.", hint: "Move the last seed to safety." }
    ];

    // --- VILLAGE FIX-IT STATE (Creative Solving) ---
    const [fixItLevel, setFixItLevel] = useState(() => Number(localStorage.getItem('fixItLevel')) || 0);
    const [fixItFeedback, setFixItFeedback] = useState("");
    const [fixItEarnings, setFixItEarnings] = useState(0); // Visual tracker

    useEffect(() => {
        localStorage.setItem('fixItLevel', fixItLevel);
    }, [fixItLevel]);
    const fixItChallenges = [
        { problem: "The village well is dry. 💧", solution: "Dig deeper or build a rainwater tank. 🌧️", options: ["Wait for rain 🌧️", "Build a rainwater tank 🏗️", "Move the village 🏃"], correct: 1 },
        { problem: "Goats are eating the crops. 🐐", solution: "Build a fence. 🚧", options: ["Yell at goats 🗣️", "Build a fence 🚧", "Stop planting 🌱"], correct: 1 },
        { problem: "It's too dark to study at night. 🌑", solution: "Solar lamps. ☀️", options: ["Sleep earlier 😴", "Use solar lamps 💡", "Catch fireflies 🪰"], correct: 1 }
    ];

    // --- PALAVER TREE STATE (EQ) ---
    const [palaverLevel, setPalaverLevel] = useState(() => Number(localStorage.getItem('palaverLevel')) || 0);
    const [palaverStep, setPalaverStep] = useState(0); // 0: Question, 1: Feedback
    const [palaverEarnings, setPalaverEarnings] = useState(0);

    useEffect(() => {
        localStorage.setItem('palaverLevel', palaverLevel);
    }, [palaverLevel]);

    const kidPalaver = [
        { q: "Two friends want the same toy. 🧸", good: "Take turns ⏳", bad: "Grab it 😠", goodRes: "✅ Taking turns is fair! Both friends are happy.", badRes: "❌ Grabbing hurts feelings. Now no one wants to play." },
        { q: "You accidentally broke your sister's drawing. 🖼️", good: "Say sorry & help fix 🩹", bad: "Hide it 🤫", goodRes: "✅ Apologizing shows you care. You can make a new one together!", badRes: "❌ Hiding it breaks trust. It's better to be honest." },
        { q: "A new student is sitting alone. 🧍", good: "Invite them to play 👋", bad: "Ignore them 😒", goodRes: "✅ Kindness makes new friends! They feel welcome now.", badRes: "❌ Being ignored feels lonely. Be the friend you would want." }
    ];

    const teenPalaver = [
        { q: "Your group wants to skip class. You don't. 🏫", good: "Stay & study 📚", bad: "Follow them 🚶", goodRes: "✅ Leadership is standing alone for what's right. Respect earned!", badRes: "❌ Following the crowd into trouble isn't freedom. It's peer pressure." },
        { q: "You hear a rumor about a friend. 🗣️", good: "Stop the rumor 🛑", bad: "Spread it 📢", goodRes: "✅ Real friends protect each other's names. You showed integrity.", badRes: "❌ Gossip destroys trust. Imagine if it was about you." },
        { q: "You are angry at your parents. 😡", good: "Talk calmly 🗣️", bad: "Yell & slam door 🚪", goodRes: "✅ Communication solves problems. Yelling creates them.", badRes: "❌ Anger controls you. Calmness controls the situation." }
    ];

    // --- DECISION MAKING STATE (Module 5) ---
    const [decisionGame, setDecisionGame] = useState('menu'); // 'menu', 'habits', 'empathy'

    // Game 1: Healthy Habits
    const [habitScore, setHabitScore] = useState(0);
    const [habitStep, setHabitStep] = useState(0);
    const [habitMessage, setHabitMessage] = useState("");
    const habitScenarios = [
        { q: "You're thirsty! What do you drink?", options: [{ txt: "Water 💧", type: "good" }, { txt: "Soda 🥤", type: "bad" }], good: "Hydration Hero! 💧", bad: "Sugar crash coming! 📉" },
        { q: "You found ₦500. What now?", options: [{ txt: "Save it 🐖", type: "good" }, { txt: "Buy sweets 🍬", type: "bad" }], good: "Future Millionaire! 💰", bad: "Money gone! 💸" },
        { q: "It's late. Bedtime?", options: [{ txt: "Sleep 😴", type: "good" }, { txt: "Play games 🎮", type: "bad" }], good: "Restored Energy! ⚡", bad: "Tired tomorrow... 😴" }
    ];

    // Game 2: Empathy Challenge
    const [empathyScore, setEmpathyScore] = useState(0);
    const [empathyStep, setEmpathyStep] = useState(0);
    const [empathyMessage, setEmpathyMessage] = useState("");
    const empathyScenarios = [
        { q: "Friend fell down.", options: [{ txt: "Laugh 😂", type: "bad" }, { txt: "Help up 🤝", type: "good" }], good: "Kindness is power! ❤️", bad: "Ouch. That hurts feelings. 💔" },
        { q: "New kid alone.", options: [{ txt: "Say Hello 👋", type: "good" }, { txt: "Ignore 😒", type: "bad" }], good: "New friend made! 🌟", bad: "Loneliness is sad. 😢" },
        { q: "Sister broke toy.", options: [{ txt: "Forgive 🕊️", type: "good" }, { txt: "Yell 😡", type: "bad" }], good: "Peace maker! 🏳️", bad: "Anger doesn't fix toys. 🧩" }
    ];

    // Handlers
    const handleHabitClick = (type) => {
        if (type === 'good') {
            setHabitScore(s => s + 1);
            setHabitMessage(habitScenarios[habitStep].good);
            triggerConfetti();
        } else {
            setHabitMessage(habitScenarios[habitStep].bad);
        }

        setTimeout(() => {
            setHabitMessage("");
            if (habitStep < habitScenarios.length - 1) {
                setHabitStep(s => s + 1);
            } else {
                setHabitMessage(`Game Over! Score: ${habitScore + (type === 'good' ? 1 : 0)}/${habitScenarios.length}`);
                setTimeout(() => {
                    markComplete(5);
                    setDecisionGame('menu');
                    setHabitStep(0);
                    setHabitScore(0);
                }, 2000);
            }
        }, 1500);
    };

    const handleEmpathyClick = (type) => {
        if (type === 'good') {
            setEmpathyScore(s => s + 1);
            setEmpathyMessage(empathyScenarios[empathyStep].good);
            triggerConfetti();
        } else {
            setEmpathyMessage(empathyScenarios[empathyStep].bad);
        }

        setTimeout(() => {
            setEmpathyMessage("");
            if (empathyStep < empathyScenarios.length - 1) {
                setEmpathyStep(s => s + 1);
            } else {
                setEmpathyMessage(`Compassion Champion! Score: ${empathyScore + (type === 'good' ? 1 : 0)}/${empathyScenarios.length}`);
                setTimeout(() => {
                    markComplete(5);
                    setDecisionGame('menu');
                    setEmpathyStep(0);
                    setEmpathyScore(0);
                }, 2000);
            }
        }, 1500);
    };

    const palaverScenarios = isKid ? kidPalaver : teenPalaver;



    // --- LITTLE SCIENTIST STATE (Scientific Thinking) ---
    const [scienceLevel, setScienceLevel] = useState(() => Number(localStorage.getItem('scienceLevel')) || 0);
    const [scienceStep, setScienceStep] = useState(0);
    const [scienceObservation, setScienceObservation] = useState("");
    const [scienceEarnings, setScienceEarnings] = useState(0);

    useEffect(() => {
        localStorage.setItem('scienceLevel', scienceLevel);
    }, [scienceLevel]);

    const kidScience = [
        {
            q: "Will a stone float or sink in water? 🪨",
            options: ["Float 🪵", "Sink 🪨"],
            correct: "Sink 🪨",
            explanation: "Stones are heavier than water, so they sink to the bottom!",
            experiment: "Drop a stone in water.",
            observation: "It sank! ⬇️",
            conclusion: "Heavy things like stones sink."
        },
        {
            q: "What do plants need to grow? 🌱",
            options: ["Candy 🍬", "Sun & Water ☀️"],
            correct: "Sun & Water ☀️",
            explanation: "Plants can't eat candy! They need sunlight and water to make their own food.",
            experiment: "Put one plant in sun, one in dark.",
            observation: "Sun plant grew! ☀️",
            conclusion: "Plants need light to make food."
        },
        {
            q: "What happens to your shadow at noon? ☀️",
            options: ["Gets Long 🦒", "Gets Short 🐜"],
            correct: "Gets Short 🐜",
            explanation: "When the sun is right above you, your shadow is right under your feet!",
            experiment: "Stand outside at 12 PM.",
            observation: "Shadow is tiny! 👣",
            conclusion: "Sun is high, shadow is short."
        }
    ];

    const teenScience = [
        {
            q: "Why does oil float on water? 💧",
            options: ["Oil is lighter (less dense) 🪶", "Oil is heavier 🏋️"],
            correct: "Oil is lighter (less dense) 🪶",
            explanation: "Oil has a lower density than water, so it sits on top like a raft.",
            experiment: "Mix oil and water.",
            observation: "Oil stays on top. 🥃",
            conclusion: "Density determines buoyancy."
        },
        {
            q: "How do plants make food? 🍃",
            options: ["Photosynthesis ☀️", "Respiration 🌬️"],
            correct: "Photosynthesis ☀️",
            explanation: "Photosynthesis is the process where plants use sunlight to turn CO2 into food.",
            experiment: "Test leaf for starch.",
            observation: "Leaf turns blue-black (Starch present).",
            conclusion: "Light energy converts to chemical energy."
        },
        {
            q: "Why do things fall down? 🍎",
            options: ["Magnetism 🧲", "Gravity ⬇️"],
            correct: "Gravity ⬇️",
            explanation: "Gravity is the force that pulls everything towards the center of the Earth.",
            experiment: "Drop a ball.",
            observation: "It accelerates down. ⬇️",
            conclusion: "Gravity is a force of attraction."
        }
    ];

    const scienceScenarios = isKid ? kidScience : teenScience;


    // --- VERIFICATION HELPER ---
    const verifyAction = (callback, message = "Verifying Wisdom... 🦁") => {
        setIsVerifying(true);
        setVerificationMessage(message);
        setTimeout(() => {
            setIsVerifying(false);
            setVerificationMessage("");
            callback();
        }, 3000);
    };

    // --- ADULT STATE ---
    const [pits, setPits] = useState([4, 4, 4, 4, 4, 4]);
    const [moves, setMoves] = useState(0);
    const [message, setMessage] = useState("Pick a pit to sow seeds! Try to empty your side.");

    // --- RESTORED HELPERS ---
    const triggerConfetti = () => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
    };

    const markComplete = (id) => {
        if (!completedModules.includes(id)) {
            setCompletedModules(prev => [...prev, id]);
            setBrainPower(prev => prev + 10);
            setShowLevelUp(true);
            triggerConfetti();
            addEarnings('criticalThinking', 100);
            triggerLiveEvent("completed a Critical Thinking module! 🧠");
            setTimeout(() => setShowLevelUp(false), 3000);
        }
    };

    // --- CATTLE HERDER HANDLERS ---
    const addHerderCommand = (cmd) => {
        if (herderStatus !== 'planning') return;
        if (herderCommands.length < 10) {
            setHerderCommands(prev => [...prev, cmd]);
        }
    };

    const runHerderCommands = async () => {
        if (herderStatus !== 'planning' || herderCommands.length === 0) return;
        setHerderStatus('running');
        setHerderMessage("Walking... 🚶🏿‍♂️");

        let currentPos = { ...herderPos };
        const level = herderLevels[herderLevel];
        let won = false;

        for (let i = 0; i < herderCommands.length; i++) {
            const cmd = herderCommands[i];
            await new Promise(r => setTimeout(r, 500)); // Animation delay

            let nextPos = { ...currentPos };
            if (cmd === '⬆️') nextPos.y -= 1;
            if (cmd === '⬇️') nextPos.y += 1;
            if (cmd === '⬅️') nextPos.x -= 1;
            if (cmd === '➡️') nextPos.x += 1;

            // Check Bounds
            if (nextPos.x < 0 || nextPos.x >= level.gridSize || nextPos.y < 0 || nextPos.y >= level.gridSize) {
                setHerderStatus('lost');
                setHerderMessage("Ouch! Hit the wall! 🧱");
                return;
            }

            // Check Obstacles
            if (level.obstacles.some(o => o.x === nextPos.x && o.y === nextPos.y)) {
                setHerderStatus('lost');
                setHerderMessage("Blocked by a rock! 🪨");
                return;
            }

            // Check Lions
            if (level.lions.some(l => l.x === nextPos.x && l.y === nextPos.y)) {
                setHerderStatus('lost');
                setHerderMessage("Oh no! A Lion! 🦁");
                return;
            }

            currentPos = nextPos;
            setHerderPos(currentPos);

            // Check Win
            if (currentPos.x === level.goal.x && currentPos.y === level.goal.y) {
                won = true;
                break;
            }
        }

        if (won) {
            setHerderStatus('won');
            setHerderMessage("You found the water! 🎉");
            triggerConfetti();

            // Visual earnings update
            setHerderEarnings(prev => prev + 50);

            // Removed intermediate earnings - reward only at the end
            if (herderLevel < herderLevels.length - 1) {
                setTimeout(() => setHerderLevel(l => l + 1), 2000);
            } else {
                markComplete(4);
            }
        } else {
            if (herderStatus !== 'lost') {
                setHerderStatus('lost');
                setHerderMessage("Didn't reach the goal. Try again! 🔄");
            }
        }
    };

    const resetHerder = () => {
        const level = herderLevels[herderLevel];
        setHerderPos({ ...level.start });
        setHerderCommands([]);
        setHerderStatus('planning');
        setHerderMessage("Guide the Herdsman to the Water! 💧");
    };

    // --- RIVER CROSSING HANDLERS ---
    const handleRiverMove = (action, itemId) => {
        if (riverStatus !== 'playing') return;

        if (action === 'cross') {
            const newSide = boatSide === 'left' ? 'right' : 'left';
            setBoatSide(newSide);

            // Check safety on the shore we just LEFT
            const itemsOnOldSide = riverItems.filter(i => i.side === boatSide && i.id !== boatContent);
            const hasLion = itemsOnOldSide.find(i => i.id === 'lion');
            const hasGoat = itemsOnOldSide.find(i => i.id === 'goat');
            const hasYam = itemsOnOldSide.find(i => i.id === 'yam');

            if (hasLion && hasGoat && !hasYam) {
                setRiverStatus('lost');
                setRiverMessage("Oh no! The Lion ate the Goat! 🦁🍖");
            } else if (hasGoat && hasYam && !hasLion) {
                setRiverStatus('lost');
                setRiverMessage("Oh no! The Goat ate the Yam! 🐐🍠");
            } else {
                setRiverMessage("Rowing across... 🚣");
            }
        } else if (action === 'load') {
            if (boatContent) return;
            setBoatContent(itemId);
            setRiverItems(prev => prev.map(i => i.id === itemId ? { ...i, side: 'boat' } : i));
        } else if (action === 'unload') {
            if (!boatContent) return;
            const idToUnload = boatContent;
            setBoatContent(null);

            // Update items
            const newItems = riverItems.map(i => i.id === idToUnload ? { ...i, side: boatSide } : i);
            setRiverItems(newItems);

            // Check Win (All on right)
            const allRight = newItems.every(i => i.side === 'right');
            if (allRight) {
                setRiverStatus('won');
                setRiverMessage("You did it! Everyone crossed safely! 🎉");
                triggerConfetti();
                markComplete(3);
            }
        }
    };

    const resetRiverGame = () => {
        setRiverItems([
            { id: 'lion', name: 'Lion', emoji: '🦁', side: 'left' },
            { id: 'goat', name: 'Goat', emoji: '🐐', side: 'left' },
            { id: 'yam', name: 'Yam', emoji: '🍠', side: 'left' }
        ]);
        setBoatSide('left');
        setBoatContent(null);
        setRiverStatus('playing');
        setRiverMessage("Help the Farmer cross the river! 🚣");
    };

    // --- STRATEGY ROOM HANDLER ---
    const handleSow = (index) => {
        if (pits[index] === 0) return;

        let seeds = pits[index];
        let newPits = [...pits];
        newPits[index] = 0;
        let currentIndex = index;

        while (seeds > 0) {
            currentIndex = (currentIndex + 1) % 6;
            newPits[currentIndex]++;
            seeds--;
        }

        setPits(newPits);
        setMoves(m => m + 1);

        if (newPits.every(p => p === 0)) {
            setMessage("Game Over! Board cleared.");
        } else {
            setMessage(`Moved! Seeds sown. (Moves: ${moves + 1})`);
        }
    };

    // --- NEW HANDLERS ---
    const handleRiddleAnswer = (option) => {
        verifyAction(() => {
            let currentRiddle, correctAnswer;

            if (riddleGame === 0) {
                currentRiddle = classicRiddles[riddleIndex];
                correctAnswer = currentRiddle.ans;
            } else if (riddleGame === 1) {
                currentRiddle = animalSounds[riddleIndex];
                correctAnswer = currentRiddle.ans;
            } else {
                currentRiddle = rhymeGames[riddleIndex];
                correctAnswer = currentRiddle.ans;
            }

            if (option === correctAnswer) {
                setShowRiddleResult(`Correct! 🎉\n\n${getRandomFact()}`);
                setRiddleScore(prev => prev + 1);
                triggerConfetti();
                addEarnings('criticalThinking', 40);

                setTimeout(() => {
                    setShowRiddleResult(null);

                    const maxIndex = riddleGame === 0 ? classicRiddles.length - 1 :
                        riddleGame === 1 ? animalSounds.length - 1 :
                            rhymeGames.length - 1;

                    if (riddleIndex < maxIndex) {
                        setRiddleIndex(prev => prev + 1);
                    } else if (riddleGame < 2) {
                        setRiddleGame(prev => prev + 1);
                        setRiddleIndex(0);
                    } else {
                        markComplete(14); // All 3 games complete!
                    }
                }, 4000);
            } else {
                setShowRiddleResult("Try again! 🤔");
                setTimeout(() => setShowRiddleResult(null), 1500);
            }
        }, "Thinking...");
    };
    const handlePatternCheck = (option) => {
        verifyAction(() => {
            const currentPattern = patterns[patternLevel];
            if (option === currentPattern.ans) {
                setPatternFeedback(`Correct! 🌟 ${getRandomFact()}`);
                triggerConfetti();
                setTimeout(() => {
                    setPatternFeedback("");
                    if (patternLevel < patterns.length - 1) {
                        setPatternLevel(prev => prev + 1);
                    } else {
                        markComplete(15);
                    }
                }, 4000);
            } else {
                setPatternFeedback("Not quite. Look closely! 👀");
                setTimeout(() => setPatternFeedback(""), 1000);
            }
        }, "Checking Pattern...");
    };

    // --- ADULT HANDLERS ---
    const handleFallacyAnswer = (option) => {
        verifyAction(() => {
            const currentFallacy = fallacies[fallacyIndex];
            if (option === currentFallacy.a) {
                setShowFallacyResult(`Correct! 🎯\n${getRandomFact()}`);
                setFallacyScore(prev => prev + 1);
                triggerConfetti();
                setTimeout(() => {
                    setShowFallacyResult(null);
                    if (fallacyIndex < fallacies.length - 1) {
                        setFallacyIndex(prev => prev + 1);
                    }
                }, 4000);
            } else {
                setShowFallacyResult("Incorrect. Try again! 🤔");
                setTimeout(() => setShowFallacyResult(null), 1000);
            }
        }, "Analyzing Logic...");
    };

    const startStrategyLevel = (idx) => {
        const strat = strategies[idx];
        setStrategyLevel(idx);
        setPits([...strat.setup]);
        setStrategyMessage(`Goal: ${strat.goal}`);
        setMoves(0);
    };

    // --- NEW EXPANSION HANDLERS ---
    const handleFixItChoice = (option) => {
        verifyAction(() => {
            const current = fixItChallenges[fixItLevel];
            const selectedIndex = current.options.indexOf(option);

            if (selectedIndex === current.correct) {
                setFixItFeedback(`Brilliant! 🛠️ ${getRandomFact()}`);
                triggerConfetti();

                // Visual earnings update
                setFixItEarnings(prev => Math.min(prev + 50, MAX_EARNINGS));

                setTimeout(() => {
                    setFixItFeedback("");
                    if (fixItLevel < fixItChallenges.length - 1) setFixItLevel(l => l + 1);
                    else markComplete(7); // Corrected ID from 6 to 7
                }, 4000);
            } else {
                setFixItFeedback("Hmm, that might not work. Try again! 🤔");
                setTimeout(() => setFixItFeedback(""), 1000);
            }
        }, "Analyzing Solution...");
    };

    const handleMarketChoice = (option) => {
        verifyAction(() => {
            const current = marketScenarios[marketIndex];
            if (option === current.choice) {
                triggerConfetti();
                showToast(`Correct! 🎉\n\n${getRandomFact()}`, 'success');
                if (marketIndex < marketScenarios.length - 1) setMarketIndex(i => i + 1);
                else markComplete(14); // Financial Thinking ID
            } else {
                showToast("Think about value! " + current.reason, 'warning');
            }
        }, "Checking Value...");
    };

    const handleDilemmaChoice = (option) => {
        verifyAction(() => {
            const current = dilemmas[dilemmaIndex];
            if (option === current.good) {
                setDilemmaFeedback(`You chose honor! 🦁 ${getRandomFact()}`);
                triggerConfetti();
                setTimeout(() => {
                    setDilemmaFeedback("");
                    if (dilemmaIndex < dilemmas.length - 1) setDilemmaIndex(i => i + 1);
                    else markComplete(10); // Ethical Thinking ID
                }, 4000);
            } else {
                setDilemmaFeedback("Is that the right thing to do? Listen to your heart. ❤️");
                setTimeout(() => setDilemmaFeedback(""), 1000);
            }
        }, "Weighing Options...");
    };

    const saveWisdom = () => {
        if (!wisdomEntry.trim()) return;
        const newWisdom = `${new Date().toLocaleDateString()}: ${wisdomEntry}\n${savedWisdom}`;
        setSavedWisdom(newWisdom);
        localStorage.setItem('wisdomLog', newWisdom);
        setWisdomEntry("");
        triggerConfetti();
        markComplete(12); // Reflection ID
    };

    // --- NEW INTERACTIVITY HANDLERS ---
    // Observation (Kids & Teens)
    useEffect(() => {
        let timer;
        if (isTeen && showMemory && memoryTimer > 0) {
            timer = setInterval(() => setMemoryTimer(t => t - 1), 1000);
        } else if (memoryTimer === 0) {
            setShowMemory(false);
        }
        return () => clearInterval(timer);
    }, [isTeen, showMemory, memoryTimer]);

    const handleObsSubmit = () => {
        verifyAction(() => {
            if (isKid) {
                const current = kidObsItems[obsLevel];
                if (obsInput.toLowerCase().trim() === current.name.toLowerCase()) {
                    setObsFeedback(`Correct! 🌟 ${getRandomFact()}`);
                    triggerConfetti();
                    addEarnings('criticalThinking', 50);
                    setTimeout(() => {
                        setObsFeedback("");
                        setObsInput("");
                        if (obsLevel < kidObsItems.length - 1) setObsLevel(l => l + 1);
                        else markComplete(1);
                    }, 4000);
                } else {
                    setObsFeedback(`Try again! Hint: ${current.hint}`);
                }
            } else {
                // Teens Memory Logic
                const current = teenObsItems[obsLevel];
                const userItems = obsInput.toLowerCase().split(',').map(s => s.trim());
                const correctCount = userItems.filter(i => current.answer.includes(i)).length;

                if (correctCount >= 3) {
                    setObsFeedback(`Great memory! You got ${correctCount}/4! 🧠\n${getRandomFact()}`);
                    triggerConfetti();
                    addEarnings('criticalThinking', 50);
                    setTimeout(() => {
                        setObsFeedback("");
                        setObsInput("");
                        setShowMemory(true);
                        setMemoryTimer(5);
                        if (obsLevel < teenObsItems.length - 1) setObsLevel(l => l + 1);
                        else markComplete(1);
                    }, 4000);
                } else {
                    setObsFeedback(`You found ${correctCount}. Try to remember more! (Hint: ${current.answer[0]}...)`);
                }
            }
        }, "Checking Observation...");
    };

    // Asking Good Questions
    const handleQuestSubmit = (e) => {
        e.preventDefault();
        if (!questInput.trim()) return;

        verifyAction(() => {
            const userMsg = { sender: 'user', text: questInput };
            setQuestChat(prev => [...prev, userMsg]);

            const lower = questInput.toLowerCase();
            const hasQuestionMark = questInput.includes('?');
            const isOpenEnded = lower.startsWith('why') || lower.startsWith('how') || lower.startsWith('what if');

            let reply = "";

            if (isKid) {
                if (hasQuestionMark && (lower.includes('why') || lower.includes('how'))) {
                    reply = `That is a great question! Asking 'Why' helps us understand the world. 🌍\n\n${getRandomFact()}`;
                    triggerConfetti();
                    addEarnings('criticalThinking', 50);
                    setTimeout(() => markComplete(2), 4000);
                } else {
                    reply = "Good try! But can you ask a question starting with 'Why' or 'How'? And don't forget the '?'";
                }
            } else {
                // Teens
                if (hasQuestionMark && isOpenEnded && questInput.length > 15) {
                    reply = `Excellent inquiry. Open-ended questions lead to wisdom. You are thinking deeply. 🦁\n\n${getRandomFact()}`;
                    triggerConfetti();
                    addEarnings('criticalThinking', 50);
                    setTimeout(() => markComplete(2), 4000);
                } else {
                    reply = "Try digging deeper. Ask an open-ended question (Why/How/What if) that cannot be answered with just 'Yes' or 'No'.";
                }
            }

            setTimeout(() => {
                setQuestChat(prev => [...prev, { sender: 'elder', text: reply }]);
            }, 1000);
            setQuestInput("");
        }, "Consulting the Elder...");
    };

    // --- DETECTIVE MODE HANDLERS ---
    // Comprehensive case database
    const detectiveCases = {
        kids: [
            {
                id: 0,
                title: "The Cookie Mystery 🍪",
                scenario: "Someone ate all the cookies from the jar! Who did it?",
                clues: [
                    "It has 4 legs.",
                    "It loves to eat everything (grass, cans, clothes!).",
                    "It says 'Meee' not 'Moo'."
                ],
                suspects: [
                    { id: 1, name: "Lion 🦁", emoji: "🦁" },
                    { id: 2, name: "Goat 🐐", emoji: "🐐" },
                    { id: 3, name: "Chicken 🐔", emoji: "🐔" }
                ],
                culprit: 2,
                reward: 100
            }
        ],
        teens: [
            {
                id: 0,
                title: "The Missing Trophy 🏆",
                scenario: "The school trophy disappeared overnight. Security footage shows someone in a blue uniform.",
                clues: [
                    "The thief wore a BLUE uniform.",
                    "The janitor was cleaning the gym until 10 PM.",
                    "The coach left at 6 PM (has alibi).",
                    "The rival team captain was seen near the trophy case at 9 PM."
                ],
                suspects: [
                    { id: 1, name: "Coach", emoji: "👨‍🏫", detail: "Left early" },
                    { id: 2, name: "Janitor", emoji: "🧹", detail: "Blue uniform" },
                    { id: 3, name: "Rival Captain", emoji: "⚽", detail: "Red jersey" }
                ],
                culprit: 2,
                reward: 150
            },
            {
                id: 1,
                title: "Science Fair Sabotage 🧪",
                scenario: "A chemistry project was destroyed. Chemical residue found: H2O2 (hydrogen peroxide).",
                clues: [
                    "The saboteur used hydrogen peroxide (found in biology lab).",
                    "Lab partner was home sick (verified by parents).",
                    "Rival student has access to biology lab (member of science club).",
                    "Janitor doesn't have keys to chemical storage."
                ],
                suspects: [
                    { id: 1, name: "Lab Partner", emoji: "👥", detail: "Sick at home" },
                    { id: 2, name: "Rival Student", emoji: "🎓", detail: "Science club" },
                    { id: 3, name: "Janitor", emoji: "🧹", detail: "No chem access" }
                ],
                culprit: 2,
                reward: 200
            }
        ],
        adults: [
            {
                id: 0,
                title: "The Gold Heist 💰",
                scenario: "Gold stolen from the palace vault. The thief wore red.",
                clues: [
                    "The thief was wearing RED.",
                    "The Farmer was working in the field all day (witnessed by neighbors).",
                    "The Scholar was reading in the library (librarian confirms).",
                    "The Merchant was seen near the vault at noon."
                ],
                suspects: [
                    { id: 1, name: "Merchant", emoji: "👤", detail: "Blue robes" },
                    { id: 2, name: "Soldier", emoji: "👤", detail: "Red uniform" },
                    { id: 3, name: "Farmer", emoji: "👤", detail: "Green clothes" },
                    { id: 4, name: "Scholar", emoji: "👤", detail: "Yellow robes" }
                ],
                culprit: 2,
                reward: 150
            },
            {
                id: 1,
                title: "Corporate Whistleblower 📊",
                scenario: "Confidential financial documents leaked to the press. Email metadata shows sender used CFO credentials.",
                clues: [
                    "Email sent at 2:47 AM using CFO's login credentials.",
                    "Security footage shows someone in a BLUE SUIT near server room at 2:30 AM.",
                    "CEO was at a conference in Lagos (flight records confirm).",
                    "CFO claims they were home sleeping (no verification).",
                    "IT Admin has motive (passed over for promotion) but was logged out at midnight."
                ],
                suspects: [
                    { id: 1, name: "CEO", emoji: "👔", detail: "Red tie, in Lagos" },
                    { id: 2, name: "CFO", emoji: "💼", detail: "Blue suit, weak alibi" },
                    { id: 3, name: "IT Admin", emoji: "💻", detail: "Green hoodie, logged out" }
                ],
                culprit: 2,
                reward: 250
            }
        ]
    };

    // Get current case data
    const getCurrentAgeGroup = () => {
        if (isKid) return 'kids';
        if (isTeen) return 'teens';
        return 'adults';
    };

    const currentCaseData = detectiveCases[getCurrentAgeGroup()][detectiveCase] || detectiveCases[getCurrentAgeGroup()][0];
    const suspects = currentCaseData.suspects;

    const generateGymQuestion = () => {
        const types = ['math', 'logic'];
        const type = types[Math.floor(Math.random() * types.length)];

        if (type === 'math') {
            const a = Math.floor(Math.random() * 10) + 1;
            const b = Math.floor(Math.random() * 10) + 1;
            const op = Math.random() > 0.5 ? '+' : '-';
            return {
                q: `${a} ${op} ${b} = ?`,
                a: op === '+' ? (a + b).toString() : (a - b).toString()
            };
        } else {
            // Simple logic for speed
            const items = ["Apple", "Banana", "Carrot", "Dog"];
            const q = "Which is NOT a food?";
            return { q: q, a: "Dog" };
        }
    };

    const handleDetectiveGuess = (suspectId) => {
        verifyAction(() => {
            const correctId = currentCaseData.culprit;

            if (suspectId === correctId) {
                const caseKey = `${getCurrentAgeGroup()}-${detectiveCase}`;
                setDetectiveFeedback(`Correct! You solved the case! 🕵️‍♂️ ${getRandomFact()}`);
                triggerConfetti();
                addEarnings('criticalThinking', currentCaseData.reward);

                // Mark case as solved
                const newSolved = [...solvedCases, caseKey];
                setSolvedCases(newSolved);
                localStorage.setItem('solvedDetectiveCases', JSON.stringify(newSolved));

                setTimeout(() => {
                    setDetectiveFeedback("");
                    markComplete(18);
                    setDetectiveStep(0); // Return to case selection
                }, 4000);
            } else {
                setDetectiveFeedback("Not quite. Review the clues! 🧐");
                setTimeout(() => setDetectiveFeedback(""), 2000);
            }
        }, "Analyzing Evidence...");
    };

    const selectCase = (caseId) => {
        setDetectiveCase(caseId);
        setDetectiveStep(1); // Move to solving phase
        setDetectiveFeedback("");
        setDetectiveSuspect(null);
    };

    const startBrainGym = () => {
        setGymStatus('playing');
        setGymScore(0);
        setGymTimer(60);
        setGymQuestion(generateGymQuestion());
    };

    const handleGymSubmit = (ans) => {
        if (!gymQuestion) return;

        if (ans.toLowerCase().trim() === gymQuestion.a.toLowerCase()) {
            setGymScore(s => s + 10);
            setGymFeedback("Correct! +10");
            triggerConfetti();
        } else {
            setGymFeedback("Missed it!");
        }

        setGymQuestion(generateGymQuestion());
        setGymAnswer("");
        setTimeout(() => setGymFeedback(""), 500);
    };

    // Brain Gym Timer
    useEffect(() => {
        let timer;
        if (gymStatus === 'playing' && gymTimer > 0) {
            timer = setInterval(() => setGymTimer(t => t - 1), 1000);
        } else if (gymTimer === 0 && gymStatus === 'playing') {
            setGymStatus('complete');
            addEarnings('criticalThinking', gymScore);
            if (gymScore >= 50) markComplete(19);
        }
        return () => clearInterval(timer);
    }, [gymStatus, gymTimer]);

    // Additional State for gym feedback
    const [gymFeedback, setGymFeedback] = useState("");


    // --- CURRICULUM MODULES ---
    const modules = [
        {
            id: 1,
            title: "Observation Skills 👁️",
            desc: "Small clues matter.",
            content: (
                <div>
                    <p><strong>{isKid ? "Spelling Detective 🕵️‍♂️" : "Memory Master 🧠"}</strong></p>
                    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#333', borderRadius: '8px' }}>
                        {isKid ? (
                            <>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{kidObsItems[obsLevel]?.emoji || "❓"}</div>
                                <p>Type the name of this item:</p>
                                <input
                                    type="text"
                                    value={obsInput}
                                    onChange={(e) => setObsInput(e.target.value)}
                                    placeholder="Type here..."
                                    style={{ padding: '0.5rem', borderRadius: '5px', border: 'none', marginTop: '0.5rem', width: '100%' }}
                                />
                                <button onClick={handleObsSubmit} className="btn btn-sm" style={{ marginTop: '1rem', backgroundColor: '#00C851' }}>Check Spelling ✅</button>
                            </>
                        ) : (
                            <>
                                {showMemory ? (
                                    <div>
                                        <p>Memorize these items! ({memoryTimer}s)</p>
                                        <div style={{ fontSize: '2rem', letterSpacing: '1rem', margin: '1rem 0' }}>
                                            {teenObsItems[obsLevel]?.items?.join(" ") || "Loading..."}
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <p>What did you see? (Separate with commas)</p>
                                        <input
                                            type="text"
                                            value={obsInput}
                                            onChange={(e) => setObsInput(e.target.value)}
                                            placeholder="e.g. apple, book..."
                                            style={{ padding: '0.5rem', borderRadius: '5px', border: 'none', marginTop: '0.5rem', width: '100%' }}
                                        />
                                        <button onClick={handleObsSubmit} className="btn btn-sm" style={{ marginTop: '1rem', backgroundColor: '#00C851' }}>Check Memory 🧠</button>
                                    </div>
                                )}
                            </>
                        )}
                        {obsFeedback && <p style={{ marginTop: '1rem', color: '#FFD700' }}>{obsFeedback}</p>}
                    </div>
                </div>
            )
        },
        {
            id: 2,
            title: "Asking Good Questions ❓",
            desc: "The power of 'Why?'",
            content: (
                <div>
                    <p>Ask the Village Mentor a question to learn wisdom.</p>
                    <div style={{ marginTop: '1rem', height: '300px', display: 'flex', flexDirection: 'column', backgroundColor: '#222', borderRadius: '8px', overflow: 'hidden' }}>
                        <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {questChat.map((msg, i) => (
                                <div key={i} style={{
                                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    backgroundColor: msg.sender === 'user' ? '#444' : '#5d4037',
                                    padding: '0.5rem 1rem', borderRadius: '15px', maxWidth: '80%', fontSize: '0.9rem'
                                }}>
                                    {msg.text}
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleQuestSubmit} style={{ padding: '0.5rem', backgroundColor: '#333', display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                value={questInput}
                                onChange={(e) => setQuestInput(e.target.value)}
                                placeholder={isKid ? "Ask 'Why'..." : "Ask an open-ended question..."}
                                style={{ flex: 1, padding: '0.5rem', borderRadius: '5px', border: 'none' }}
                            />
                            <button type="submit" className="btn btn-sm" style={{ backgroundColor: '#00C851' }}>➤</button>
                        </form>
                    </div>
                </div>
            )
        },
        {
            id: 3,
            title: "Logical Thinking 🧩",
            desc: "4 Fun Logic Games!",
            content: (
                <div>
                    <p style={{ marginBottom: '1rem' }}>
                        <strong>
                            {logicGame === 0 && "🚣 Game 1: River Crossing Puzzle"}
                            {logicGame === 1 && "✅ Game 2: True or False"}
                            {logicGame === 2 && "🔢 Game 3: Number Sequences"}
                            {logicGame === 3 && "🤔 Game 4: If-Then Logic"}
                        </strong>
                    </p>

                    {/* Game Selector */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto' }}>
                        {['🚣 Boat', '✅ T/F', '🔢 Numbers', '🤔 If-Then'].map((label, idx) => (
                            <button
                                key={idx}
                                onClick={() => setLogicGame(idx)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    border: logicGame === idx ? '2px solid #FFD700' : '2px solid #555',
                                    background: logicGame === idx ? '#FFD700' : '#333',
                                    color: logicGame === idx ? '#000' : '#fff',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Game 1: Boat Puzzle (Original) */}
                    {logicGame === 0 && (
                        <div>
                            <p>Help the Farmer get the Lion, Goat, and Yam across the river!</p>
                            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#444', borderRadius: '8px', border: '2px solid #FFD700' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h4 style={{ color: '#FFD700', margin: 0 }}>🚣 River Crossing Challenge</h4>
                                    <button onClick={resetRiverGame} className="btn btn-sm" style={{ backgroundColor: '#ff4444' }}>🔄 Reset</button>
                                </div>

                                <p style={{ textAlign: 'center', marginBottom: '1rem', minHeight: '3rem', color: riverStatus === 'lost' ? '#ff4444' : '#fff' }}>
                                    {riverMessage}
                                </p>

                                {/* GAME AREA */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '200px', position: 'relative' }}>

                                    {/* LEFT BANK */}
                                    <div style={{ width: '30%', height: '100%', backgroundColor: '#2e7d32', borderRadius: '10px', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: boatSide === 'left' ? '2px solid #FFD700' : 'none' }}>
                                        <div style={{ textAlign: 'center', fontWeight: 'bold' }}>Left Bank</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                                            {riverItems.filter(i => i.side === 'left').map(item => (
                                                <button key={item.id} onClick={() => handleRiverMove('load', item.id)} disabled={boatSide !== 'left' || riverStatus !== 'playing'} style={{ fontSize: '2rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                    {item.emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* RIVER & BOAT */}
                                    <div style={{ flex: 1, height: '100%', backgroundColor: '#0288d1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                        <div style={{
                                            width: '80px', height: '50px', backgroundColor: '#795548', borderRadius: '0 0 40px 40px',
                                            display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem',
                                            position: 'absolute', left: boatSide === 'left' ? '10%' : 'auto', right: boatSide === 'right' ? '10%' : 'auto',
                                            transition: 'all 1s ease'
                                        }}>
                                            {boatContent ? riverItems.find(i => i.id === boatContent)?.emoji : ''}
                                            <span style={{ fontSize: '1rem', position: 'absolute', top: '-20px' }}>👨‍🌾</span>
                                        </div>

                                        {/* CONTROLS */}
                                        <div style={{ marginTop: '100px', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
                                            {boatContent ? (
                                                <button onClick={() => handleRiverMove('unload')} className="btn btn-sm" style={{ backgroundColor: '#ffbb33', color: '#000' }}>Unload</button>
                                            ) : null}
                                            <button onClick={() => handleRiverMove('cross')} className="btn btn-sm" style={{ backgroundColor: '#fff', color: '#000' }}>Row Boat 🚣</button>
                                        </div>
                                    </div>

                                    {/* RIGHT BANK */}
                                    <div style={{ width: '30%', height: '100%', backgroundColor: '#2e7d32', borderRadius: '10px', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', border: boatSide === 'right' ? '2px solid #FFD700' : 'none' }}>
                                        <div style={{ textAlign: 'center', fontWeight: 'bold' }}>Right Bank</div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                                            {riverItems.filter(i => i.side === 'right').map(item => (
                                                <button key={item.id} onClick={() => handleRiverMove('load', item.id)} disabled={boatSide !== 'right' || riverStatus !== 'playing'} style={{ fontSize: '2rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                                                    {item.emoji}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                </div>

                                {riverStatus === 'won' && <div style={{ textAlign: 'center', marginTop: '1rem' }}>🏆 You Won! <button onClick={resetRiverGame} className="btn btn-sm">Replay</button></div>}
                                {riverStatus === 'lost' && <div style={{ textAlign: 'center', marginTop: '1rem' }}><button onClick={resetRiverGame} className="btn btn-sm" style={{ backgroundColor: '#ff4444' }}>Try Again</button></div>}
                            </div>
                        </div>
                    )}

                    {/* Game 2: True or False */}
                    {logicGame === 1 && (
                        <div style={{ backgroundColor: '#2c2c2c', padding: '1.5rem', borderRadius: '10px' }}>
                            {logicFeedback ? (
                                <div style={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}>
                                    <h3 style={{ color: logicFeedback.includes('Correct') ? '#00C851' : '#FFC107' }}>
                                        {logicFeedback}
                                    </h3>
                                </div>
                            ) : (
                                <>
                                    <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem' }}>🤔</div>
                                    <p style={{ fontSize: '1.2rem', textAlign: 'center', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                                        {trueFalseGames[logicLevel].statement}
                                    </p>
                                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                        <button
                                            onClick={() => handleLogicAnswer(true)}
                                            style={{
                                                padding: '1rem 2rem',
                                                borderRadius: '10px',
                                                border: '2px solid #00C851',
                                                background: '#00C851',
                                                color: '#fff',
                                                cursor: 'pointer',
                                                fontSize: '1.2rem',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            ✅ TRUE
                                        </button>
                                        <button
                                            onClick={() => handleLogicAnswer(false)}
                                            style={{
                                                padding: '1rem 2rem',
                                                borderRadius: '10px',
                                                border: '2px solid #ff4444',
                                                background: '#ff4444',
                                                color: '#fff',
                                                cursor: 'pointer',
                                                fontSize: '1.2rem',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            ❌ FALSE
                                        </button>
                                    </div>
                                </>
                            )}
                            <div style={{ marginTop: '1rem', textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>
                                Question {logicLevel + 1}/4
                            </div>
                        </div>
                    )}

                    {/* Game 3: Number Sequences */}
                    {logicGame === 2 && (
                        <div style={{ backgroundColor: '#2c2c2c', padding: '1.5rem', borderRadius: '10px' }}>
                            {logicFeedback ? (
                                <div style={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}>
                                    <h3 style={{ color: logicFeedback.includes('Correct') ? '#00C851' : '#FFC107' }}>
                                        {logicFeedback}
                                    </h3>
                                </div>
                            ) : (
                                <>
                                    <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem' }}>🔢</div>
                                    <p style={{ textAlign: 'center', marginBottom: '1rem' }}>What number is missing?</p>
                                    <div style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '1.5rem', letterSpacing: '1rem' }}>
                                        {numberSequences[logicLevel].sequence.join(' ')}
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                        {numberSequences[logicLevel].options.map((opt, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleLogicAnswer(opt)}
                                                style={{
                                                    padding: '1rem 1.5rem',
                                                    borderRadius: '10px',
                                                    border: '2px solid #555',
                                                    background: '#333',
                                                    color: '#fff',
                                                    cursor: 'pointer',
                                                    fontSize: '1.5rem',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                            <div style={{ marginTop: '1rem', textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>
                                Sequence {logicLevel + 1}/4
                            </div>
                        </div>
                    )}

                    {/* Game 4: If-Then Logic */}
                    {logicGame === 3 && (
                        <div style={{ backgroundColor: '#2c2c2c', padding: '1.5rem', borderRadius: '10px' }}>
                            {logicFeedback ? (
                                <div style={{ textAlign: 'center', whiteSpace: 'pre-wrap' }}>
                                    <h3 style={{ color: logicFeedback.includes('Correct') ? '#00C851' : '#FFC107' }}>
                                        {logicFeedback}
                                    </h3>
                                </div>
                            ) : (
                                <>
                                    <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem' }}>💭</div>
                                    <p style={{ fontSize: '1.2rem', textAlign: 'center', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                                        {ifThenGames[logicLevel].question}
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {ifThenGames[logicLevel].options.map((opt, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleLogicAnswer(opt)}
                                                style={{
                                                    padding: '1rem',
                                                    borderRadius: '8px',
                                                    border: '2px solid #555',
                                                    background: '#333',
                                                    color: '#fff',
                                                    cursor: 'pointer',
                                                    fontSize: '1.1rem'
                                                }}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                            <div style={{ marginTop: '1rem', textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>
                                Question {logicLevel + 1}/4
                            </div>
                        </div>
                    )}

                    <div style={{ marginTop: '1rem', textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>
                        Total Score: {logicScore}/16 • Game {logicGame + 1}/4
                    </div>
                </div>
            )
        },
        {
            id: 4,
            title: "Problem-Solving 🐄",
            desc: "The Cattle Herder.",
            content: (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <p style={{ margin: 0 }}><strong>Level {herderLevel + 1}:</strong> {herderMessage}</p>
                        <div style={{ backgroundColor: '#00C851', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '10px', fontSize: '0.8rem' }}>
                            Earned: ₦{herderEarnings}
                        </div>
                    </div>
                    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#444', borderRadius: '8px', border: '2px solid #00C851' }}>

                        {/* GRID */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${herderLevels[herderLevel].gridSize}, 1fr)`,
                            gap: '5px',
                            maxWidth: '300px',
                            margin: '0 auto'
                        }}>
                            {Array.from({ length: herderLevels[herderLevel].gridSize * herderLevels[herderLevel].gridSize }).map((_, idx) => {
                                const level = herderLevels[herderLevel];
                                const x = idx % level.gridSize;
                                const y = Math.floor(idx / level.gridSize);

                                let content = "";
                                if (x === herderPos.x && y === herderPos.y) content = "👨🏿‍🌾";
                                else if (x === level.goal.x && y === level.goal.y) content = "💧";
                                else if (level.obstacles.some(o => o.x === x && o.y === y)) content = "🪨";
                                else if (level.lions.some(l => l.x === x && l.y === y)) content = "🦁";

                                return (
                                    <div key={idx} style={{
                                        width: '50px', height: '50px', backgroundColor: '#5d4037',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '2rem', borderRadius: '5px'
                                    }}>
                                        {content}
                                    </div>
                                );
                            })}
                        </div>

                        {/* CONTROLS */}
                        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                            <div style={{ marginBottom: '1rem', minHeight: '30px', color: '#FFD700' }}>
                                Commands: {herderCommands.join(" ")}
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem' }}>
                                <button onClick={() => addHerderCommand('⬆️')} className="btn btn-sm" disabled={herderStatus !== 'planning'}>⬆️</button>
                                <button onClick={() => addHerderCommand('⬇️')} className="btn btn-sm" disabled={herderStatus !== 'planning'}>⬇️</button>
                                <button onClick={() => addHerderCommand('⬅️')} className="btn btn-sm" disabled={herderStatus !== 'planning'}>⬅️</button>
                                <button onClick={() => addHerderCommand('➡️')} className="btn btn-sm" disabled={herderStatus !== 'planning'}>➡️</button>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                <button onClick={runHerderCommands} className="btn btn-sm" style={{ backgroundColor: '#00C851' }} disabled={herderStatus !== 'planning'}>Go! 🏃🏿‍♂️</button>
                                <button onClick={resetHerder} className="btn btn-sm" style={{ backgroundColor: '#ff4444' }}>Reset 🔄</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 5,
            title: "Decision-Making ⚖️",
            desc: "Choices for a better life.",
            content: (
                <div style={{ padding: '1rem', backgroundColor: '#2c2c2c', borderRadius: '10px' }}>
                    {decisionGame === 'menu' && (
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Choose your path:</p>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <button onClick={() => setDecisionGame('habits')} className="btn" style={{ background: 'linear-gradient(45deg, #4CAF50, #8BC34A)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 2rem' }}>
                                    <span style={{ fontSize: '2rem' }}>🥗</span>
                                    <span>Healthy Habits</span>
                                </button>
                                <button onClick={() => setDecisionGame('empathy')} className="btn" style={{ background: 'linear-gradient(45deg, #2196F3, #03A9F4)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 2rem' }}>
                                    <span style={{ fontSize: '2rem' }}>❤️</span>
                                    <span>Empathy Challenge</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {decisionGame === 'habits' && (
                        <div style={{ animation: 'fadeIn 0.5s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ margin: 0 }}>🥗 Healthy Habits</h3>
                                <button onClick={() => setDecisionGame('menu')} className="btn btn-sm" style={{ backgroundColor: '#555' }}>Back</button>
                            </div>

                            {habitMessage ? (
                                <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#333', borderRadius: '8px' }}>
                                    <p style={{ fontSize: '1.5rem', color: habitMessage.includes('!') ? '#00C851' : '#ff4444' }}>{habitMessage}</p>
                                </div>
                            ) : (
                                <div>
                                    <p style={{ fontSize: '1.2rem', textAlign: 'center', marginBottom: '1.5rem' }}>{habitScenarios[habitStep].q}</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        {habitScenarios[habitStep].options.map((opt, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleHabitClick(opt.type)}
                                                className="btn"
                                                style={{ padding: '1.5rem', fontSize: '1.1rem', backgroundColor: '#333', border: '1px solid #555' }}
                                            >
                                                {opt.txt}
                                            </button>
                                        ))}
                                    </div>
                                    <p style={{ marginTop: '1rem', textAlign: 'center', color: '#888' }}>Question {habitStep + 1}/{habitScenarios.length}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {decisionGame === 'empathy' && (
                        <div style={{ animation: 'fadeIn 0.5s' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h3 style={{ margin: 0 }}>❤️ Empathy Challenge</h3>
                                <button onClick={() => setDecisionGame('menu')} className="btn btn-sm" style={{ backgroundColor: '#555' }}>Back</button>
                            </div>

                            {empathyMessage ? (
                                <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#333', borderRadius: '8px' }}>
                                    <p style={{ fontSize: '1.5rem', color: empathyMessage.includes('!') ? '#00C851' : '#ff4444' }}>{empathyMessage}</p>
                                </div>
                            ) : (
                                <div>
                                    <p style={{ fontSize: '1.2rem', textAlign: 'center', marginBottom: '1.5rem' }}>{empathyScenarios[empathyStep].q}</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        {empathyScenarios[empathyStep].options.map((opt, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleEmpathyClick(opt.type)}
                                                className="btn"
                                                style={{ padding: '1.5rem', fontSize: '1.1rem', backgroundColor: '#333', border: '1px solid #555' }}
                                            >
                                                {opt.txt}
                                            </button>
                                        ))}
                                    </div>
                                    <p style={{ marginTop: '1rem', textAlign: 'center', color: '#888' }}>Scenario {empathyStep + 1}/{empathyScenarios.length}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )
        },
        {
            id: 6,
            title: "Village Fix-It 🛠️",
            desc: "Creative Problem Solving.",
            content: (
                <div>
                    <p><strong>Challenge:</strong> {fixItChallenges[fixItLevel].problem}</p>
                    <p><em>Goal: {fixItChallenges[fixItLevel].solution}</em></p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                        {fixItChallenges[fixItLevel].options.map((opt, idx) => (
                            <button key={idx} onClick={() => handleFixItChoice(opt)} className="btn btn-sm" style={{ textAlign: 'left' }}>
                                {opt}
                            </button>
                        ))}
                    </div>
                    {fixItFeedback && <p style={{ marginTop: '1rem', color: '#FFD700', fontWeight: 'bold' }}>{fixItFeedback}</p>}
                </div>
            )
        },
        {
            id: 7,
            title: "The Palaver Tree 🌳",
            desc: "Emotional Intelligence (EQ).",
            content: (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <p style={{ margin: 0 }}><strong>Conflict {palaverLevel + 1}:</strong> Peace & Understanding.</p>
                        <div style={{ backgroundColor: '#00C851', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '10px', fontSize: '0.8rem' }}>
                            Earned: ₦{palaverEarnings}
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#333', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
                        {palaverLevel < palaverScenarios.length ? (
                            <div>
                                {palaverStep === 0 ? (
                                    <div>
                                        <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}><strong>Situation:</strong> {palaverScenarios[palaverLevel].q}</p>
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                            <button onClick={() => setPalaverStep(1)} className="btn" style={{ backgroundColor: '#ff4444' }}>{palaverScenarios[palaverLevel].bad}</button>
                                            <button onClick={() => {
                                                setPalaverStep(2);
                                                triggerConfetti();
                                                setPalaverEarnings(prev => Math.min(prev + 50, MAX_EARNINGS));
                                                setTimeout(() => {
                                                    setPalaverStep(0);
                                                    if (palaverLevel < palaverScenarios.length - 1) {
                                                        setPalaverLevel(l => l + 1);
                                                    } else {
                                                        markComplete(7);
                                                    }
                                                }, 4000);
                                            }} className="btn" style={{ backgroundColor: '#00C851' }}>{palaverScenarios[palaverLevel].good}</button>
                                        </div>
                                    </div>
                                ) : palaverStep === 1 ? (
                                    <div style={{ marginTop: '1rem', color: '#ff4444' }}>
                                        <p><strong>Outcome:</strong></p>
                                        <p>{palaverScenarios[palaverLevel].badRes}</p>
                                        <button onClick={() => setPalaverStep(0)} className="btn btn-sm" style={{ marginTop: '0.5rem' }}>Try Again</button>
                                    </div>
                                ) : (
                                    <div style={{ marginTop: '1rem', color: '#00C851' }}>
                                        <p><strong>Outcome:</strong></p>
                                        <p>{palaverScenarios[palaverLevel].goodRes}</p>
                                        <p style={{ marginTop: '0.5rem', fontStyle: 'italic', color: '#FFD700' }}>{getRandomFact()}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', color: '#00C851' }}>
                                <h3>Peacemaker! 🕊️</h3>
                                <p>You have mastered the art of conflict resolution.</p>
                            </div>
                        )}
                    </div>
                </div>
            )
        },
        {
            id: 8,
            title: "Market Day 🧺",
            desc: "Financial Thinking.",
            content: (
                <div>
                    <p>Make smart trades in the market!</p>
                    <div style={{ backgroundColor: '#444', padding: '1rem', borderRadius: '8px', marginTop: '1rem', border: '1px solid #FFD700' }}>
                        <p><strong>Scenario:</strong> {marketScenarios[marketIndex].q}</p>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            {marketScenarios[marketIndex].options.map((opt, idx) => (
                                <button key={idx} onClick={() => handleMarketChoice(opt)} className="btn btn-sm" style={{ flex: 1 }}>{opt}</button>
                            ))}
                        </div>
                        <p style={{ fontSize: '0.8rem', marginTop: '1rem', color: '#aaa' }}>Score: {marketScore}</p>
                    </div>
                </div>
            )
        },
        {
            id: 9,
            title: "Little Scientist 🔬",
            desc: "Test your ideas.",
            content: (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <p style={{ margin: 0 }}><strong>Experiment {scienceLevel + 1}:</strong> {scienceScenarios[scienceLevel].q}</p>
                        <div style={{ backgroundColor: '#00C851', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '10px', fontSize: '0.8rem' }}>
                            Earned: ₦{scienceEarnings}
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem', backgroundColor: '#333', padding: '1rem', borderRadius: '8px' }}>
                        {scienceLevel < scienceScenarios.length ? (
                            <div>
                                <p style={{ marginBottom: '1rem' }}><strong>Question:</strong> {scienceScenarios[scienceLevel].q}</p>

                                {scienceStep === 0 ? (
                                    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                                        {scienceScenarios[scienceLevel].options.map((opt, idx) => (
                                            <button key={idx} onClick={() => {
                                                if (opt === scienceScenarios[scienceLevel].correct) {
                                                    setScienceObservation(scienceScenarios[scienceLevel].observation);
                                                    setScienceStep(1);
                                                    triggerConfetti();
                                                } else {
                                                    showToast(`Not quite! 🧠\n\n${scienceScenarios[scienceLevel].explanation}`, 'warning');
                                                }
                                            }} className="btn btn-sm" style={{ textAlign: 'left' }}>
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div>
                                        <p style={{ color: '#00C851', fontWeight: 'bold', marginTop: '1rem' }}>Correct! 🎉</p>
                                        <p><strong>Experiment:</strong> {scienceScenarios[scienceLevel].experiment}</p>
                                        <p style={{ color: '#FFD700', fontWeight: 'bold', marginTop: '0.5rem' }}>Observation: {scienceObservation}</p>
                                        <p style={{ color: '#00C851', marginTop: '0.5rem' }}>Conclusion: {scienceScenarios[scienceLevel].conclusion}</p>
                                        <p style={{ marginTop: '0.5rem', fontStyle: 'italic', color: '#FFD700' }}>{getRandomFact()}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', color: '#00C851' }}>
                                <h3>Master Scientist! 🔬</h3>
                                <p>You have verified all hypotheses.</p>
                            </div>
                        )}
                    </div>
                </div>
            )
        },
        {
            id: 10,
            title: "Dilemma Tales 🦁",
            desc: "Ethical Thinking.",
            content: (
                <div>
                    <p>What is the right thing to do?</p>
                    <div style={{ backgroundColor: '#2c2c2c', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
                        <p>{dilemmas[dilemmaIndex].q}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                            {dilemmas[dilemmaIndex].options.map((opt, idx) => (
                                <button key={idx} onClick={() => handleDilemmaChoice(opt)} className="btn btn-sm" style={{ textAlign: 'left' }}>{opt}</button>
                            ))}
                        </div>
                        {dilemmaFeedback && <p style={{ marginTop: '1rem', color: '#FFD700' }}>{dilemmaFeedback}</p>}
                    </div>
                </div>
            )
        },
        {
            id: 11,
            title: "Basic Reasoning 🔗",
            desc: "3 Fun Brain Games!",
            content: (
                <div>
                    <p style={{ marginBottom: '1rem' }}>
                        <strong>
                            {reasoningGame === 0 && "🎯 Game 1: Shape Matching"}
                            {reasoningGame === 1 && "🔮 Game 2: What Comes Next?"}
                            {reasoningGame === 2 && "🎪 Game 3: Odd One Out"}
                        </strong>
                    </p>

                    {/* Game 1: Shape Matching */}
                    {reasoningGame === 0 && (
                        <div style={{ backgroundColor: '#2c2c2c', padding: '1.5rem', borderRadius: '10px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>
                                {shapeGames[reasoningLevel].shapes.join(' ')}
                            </div>
                            <p style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.1rem' }}>
                                {shapeGames[reasoningLevel].question}
                            </p>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                {shapeGames[reasoningLevel].options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleReasoningAnswer(opt)}
                                        style={{
                                            fontSize: '2.5rem',
                                            padding: '1rem',
                                            borderRadius: '10px',
                                            border: '2px solid #555',
                                            background: '#333',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Game 2: What Comes Next */}
                    {reasoningGame === 1 && (
                        <div style={{ backgroundColor: '#2c2c2c', padding: '1.5rem', borderRadius: '10px' }}>
                            <p style={{ textAlign: 'center', marginBottom: '1rem' }}>What comes next in the pattern?</p>
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>
                                {sequenceGames[reasoningLevel].sequence.join(' ')}
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                {sequenceGames[reasoningLevel].options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleReasoningAnswer(opt)}
                                        style={{
                                            fontSize: '2.5rem',
                                            padding: '1rem',
                                            borderRadius: '10px',
                                            border: '2px solid #555',
                                            background: '#333',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Game 3: Odd One Out */}
                    {reasoningGame === 2 && (
                        <div style={{ backgroundColor: '#2c2c2c', padding: '1.5rem', borderRadius: '10px' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>
                                {oddOneGames[reasoningLevel].items.join(' ')}
                            </div>
                            <p style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.1rem' }}>
                                {oddOneGames[reasoningLevel].question}
                            </p>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                {oddOneGames[reasoningLevel].options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleReasoningAnswer(opt)}
                                        style={{
                                            fontSize: '2.5rem',
                                            padding: '1rem',
                                            borderRadius: '10px',
                                            border: '2px solid #555',
                                            background: '#333',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {reasoningFeedback && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            backgroundColor: reasoningFeedback.includes('Correct') ? 'rgba(0, 200, 81, 0.2)' : 'rgba(255, 193, 7, 0.2)',
                            borderRadius: '8px',
                            border: `2px solid ${reasoningFeedback.includes('Correct') ? '#00C851' : '#FFC107'}`,
                            textAlign: 'center'
                        }}>
                            <p style={{ margin: 0 }}>{reasoningFeedback}</p>
                        </div>
                    )}

                    <div style={{ marginTop: '1rem', textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>
                        Game {reasoningGame + 1}/3 • Level {reasoningLevel + 1}/3 • Score: {reasoningScore}/9
                    </div>
                </div>
            )
        },
        {
            id: 12,
            title: "Wisdom Log 🪞",
            desc: "Reflection.",
            content: (
                <div>
                    <p>What did you learn today?</p>
                    <textarea
                        value={wisdomEntry}
                        onChange={(e) => setWisdomEntry(e.target.value)}
                        placeholder="I learned that..."
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', marginTop: '0.5rem', minHeight: '60px' }}
                    />
                    <button onClick={saveWisdom} className="btn btn-sm" style={{ marginTop: '0.5rem', backgroundColor: '#00C851' }}>Save to Log 💾</button>
                    {savedWisdom && (
                        <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '5px', maxHeight: '100px', overflowY: 'auto', fontSize: '0.8rem' }}>
                            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{savedWisdom}</pre>
                        </div>
                    )}
                </div>
            )
        },
        {
            id: 13,
            title: "Teach a Friend 🗣️",
            desc: "Explain what you learned!",
            content: (
                <div>
                    <p style={{ marginBottom: '1rem' }}>🎓 <strong>Be the Teacher!</strong></p>
                    <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '1rem' }}>
                        Pretend you're teaching your friend. Explain this topic in your own words:
                    </p>

                    <div style={{ backgroundColor: '#2c2c2c', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                        <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#FFD700' }}>
                            📚 {teachTopics[teachTopicIndex].topic}
                        </p>
                    </div>

                    <textarea
                        value={teachExplanation}
                        onChange={(e) => setTeachExplanation(e.target.value)}
                        placeholder="I would tell my friend that..."
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            borderRadius: '8px',
                            border: '2px solid #555',
                            backgroundColor: '#222',
                            color: '#fff',
                            fontSize: '0.95rem',
                            minHeight: '100px',
                            marginBottom: '1rem'
                        }}
                    />

                    <button
                        onClick={handleTeachSubmit}
                        className="btn btn-sm"
                        style={{
                            backgroundColor: '#00C851',
                            width: '100%',
                            padding: '0.8rem',
                            fontSize: '1rem'
                        }}
                    >
                        Share My Teaching! 🎤
                    </button>

                    {teachFeedback && (
                        <div style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            backgroundColor: teachFeedback.includes('Amazing') || teachFeedback.includes('Wonderful') || teachFeedback.includes('Excellent') || teachFeedback.includes('Perfect')
                                ? 'rgba(0, 200, 81, 0.2)'
                                : 'rgba(255, 193, 7, 0.2)',
                            borderRadius: '8px',
                            border: `2px solid ${teachFeedback.includes('Amazing') || teachFeedback.includes('Wonderful') || teachFeedback.includes('Excellent') || teachFeedback.includes('Perfect') ? '#00C851' : '#FFC107'}`,
                            whiteSpace: 'pre-wrap'
                        }}>
                            <p style={{ margin: 0, fontSize: '0.95rem' }}>{teachFeedback}</p>
                        </div>
                    )}

                    <div style={{ marginTop: '1rem', textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>
                        Topic {teachTopicIndex + 1} of {teachTopics.length} • Score: {teachScore}
                    </div>
                </div>
            )
        },
        {
            id: 14,
            title: "Riddle Me This 🦁",
            desc: "3 Fun Brain Games!",
            content: (
                <div>
                    <p style={{ marginBottom: '1rem' }}>
                        <strong>
                            {riddleGame === 0 && "🧩 Game 1: Classic Riddles"}
                            {riddleGame === 1 && "🐾 Game 2: Animal Sounds"}
                            {riddleGame === 2 && "🎵 Game 3: Rhyme Time"}
                        </strong>
                    </p>

                    <div style={{ marginTop: '1rem', padding: '1.5rem', backgroundColor: '#2c2c2c', borderRadius: '10px' }}>
                        {showRiddleResult ? (
                            <div style={{ textAlign: 'center' }}>
                                <h3 style={{ color: showRiddleResult.includes("Correct") ? '#00C851' : '#ff4444', whiteSpace: 'pre-wrap' }}>
                                    {showRiddleResult}
                                </h3>
                            </div>
                        ) : (
                            <>
                                {/* Game 1: Classic Riddles */}
                                {riddleGame === 0 && (
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🤔</div>
                                        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontStyle: 'italic', lineHeight: '1.6' }}>
                                            "{classicRiddles[riddleIndex].q}"
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {classicRiddles[riddleIndex].options.map((opt, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleRiddleAnswer(opt)}
                                                    style={{
                                                        padding: '0.8rem',
                                                        borderRadius: '8px',
                                                        border: '2px solid #555',
                                                        background: '#333',
                                                        color: '#fff',
                                                        cursor: 'pointer',
                                                        fontSize: '1rem'
                                                    }}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Game 2: Animal Sounds */}
                                {riddleGame === 1 && (
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                                            {animalSounds[riddleIndex].emoji}
                                        </div>
                                        <p style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#FFD700' }}>
                                            {animalSounds[riddleIndex].sound}
                                        </p>
                                        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                                            {animalSounds[riddleIndex].question}
                                        </p>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                            {animalSounds[riddleIndex].options.map((opt, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleRiddleAnswer(opt)}
                                                    style={{
                                                        padding: '1rem',
                                                        borderRadius: '10px',
                                                        border: '2px solid #555',
                                                        background: '#333',
                                                        color: '#fff',
                                                        cursor: 'pointer',
                                                        fontSize: '1.5rem'
                                                    }}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Game 3: Rhyme Time */}
                                {riddleGame === 2 && (
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎶</div>
                                        <p style={{ fontSize: '1.3rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                            {rhymeGames[riddleIndex].line1}
                                        </p>
                                        <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                                            Hint: {rhymeGames[riddleIndex].hint}
                                        </p>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                            {rhymeGames[riddleIndex].options.map((opt, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleRiddleAnswer(opt)}
                                                    style={{
                                                        padding: '1rem',
                                                        borderRadius: '10px',
                                                        border: '2px solid #555',
                                                        background: '#333',
                                                        color: '#fff',
                                                        cursor: 'pointer',
                                                        fontSize: '1.2rem'
                                                    }}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div style={{ marginTop: '1rem', textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>
                        Game {riddleGame + 1}/3 • Question {riddleIndex + 1}/4 • Score: {riddleScore}/12
                    </div>
                </div>
            )
        },
        {
            id: 15,
            title: "Pattern Master 🎨",
            desc: "What comes next?",
            content: (
                <div>
                    <p>Complete the sequence.</p>
                    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#333', borderRadius: '8px', textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem', letterSpacing: '0.5rem' }}>
                            {patterns[patternLevel].seq.join(" ")}
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            {patterns[patternLevel].options.map((opt, idx) => (
                                <button key={idx} onClick={() => handlePatternCheck(opt)} className="btn" style={{ fontSize: '1.5rem' }}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                        {patternFeedback && <p style={{ marginTop: '1rem', color: '#FFBB33' }}>{patternFeedback}</p>}
                    </div>
                </div>
            )
        },
        {
            id: 16,
            title: "The Innovator's Studio 💡",
            desc: "4 Types of Creativity",
            content: (
                <div>
                    <p style={{ marginBottom: '1rem', textAlign: 'center' }}>"Creativity has 4 flavors. Which one are you today?"</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {/* 1. Deliberate Cognitive */}
                        <div
                            onClick={() => setCreativeMode('delib-cog')}
                            style={{
                                padding: '1rem', backgroundColor: creativeMode === 'delib-cog' ? '#FFD700' : '#333', color: creativeMode === 'delib-cog' ? '#000' : '#fff',
                                borderRadius: '10px', cursor: 'pointer', textAlign: 'center', border: '1px solid #555'
                            }}>
                            <div style={{ fontSize: '2rem' }}>🔬🧠</div>
                            <p><strong>The Detective</strong></p>
                            <p style={{ fontSize: '0.8rem' }}>(Deliberate Cognitive)</p>
                        </div>

                        {/* 2. Deliberate Emotional */}
                        <div
                            onClick={() => setCreativeMode('delib-emo')}
                            style={{
                                padding: '1rem', backgroundColor: creativeMode === 'delib-emo' ? '#FF4081' : '#333', color: creativeMode === 'delib-emo' ? '#fff' : '#fff',
                                borderRadius: '10px', cursor: 'pointer', textAlign: 'center', border: '1px solid #555'
                            }}>
                            <div style={{ fontSize: '2rem' }}>📝❤️</div>
                            <p><strong>The Poet</strong></p>
                            <p style={{ fontSize: '0.8rem' }}>(Deliberate Emotional)</p>
                        </div>

                        {/* 3. Spontaneous Cognitive */}
                        <div
                            onClick={() => setCreativeMode('spon-cog')}
                            style={{
                                padding: '1rem', backgroundColor: creativeMode === 'spon-cog' ? '#00BFFF' : '#333', color: creativeMode === 'spon-cog' ? '#fff' : '#fff',
                                borderRadius: '10px', cursor: 'pointer', textAlign: 'center', border: '1px solid #555'
                            }}>
                            <div style={{ fontSize: '2rem' }}>🍎💡</div>
                            <p><strong>The Newton</strong></p>
                            <p style={{ fontSize: '0.8rem' }}>(Spontaneous Cognitive)</p>
                        </div>

                        {/* 4. Spontaneous Emotional */}
                        <div
                            onClick={() => setCreativeMode('spon-emo')}
                            style={{
                                padding: '1rem', backgroundColor: creativeMode === 'spon-emo' ? '#7B1FA2' : '#333', color: creativeMode === 'spon-emo' ? '#fff' : '#fff',
                                borderRadius: '10px', cursor: 'pointer', textAlign: 'center', border: '1px solid #555'
                            }}>
                            <div style={{ fontSize: '2rem' }}>🎷🎨</div>
                            <p><strong>The Artist</strong></p>
                            <p style={{ fontSize: '0.8rem' }}>(Spontaneous Emotional)</p>
                        </div>
                    </div>

                    {/* DETAILS PANEL */}
                    {creativeMode && (
                        <div style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: '#222', borderRadius: '15px', border: '2px solid #FFD700', animation: 'fadeIn 0.5s' }}>
                            {creativeMode === 'delib-cog' && (
                                <div>
                                    <h3 style={{ color: '#FFD700' }}>Deliberate Cognitive: "The Detective" 🕵️‍♂️</h3>
                                    <p>This is when you sit down and focus really hard to solve a problem.</p>
                                    <ul style={{ textAlign: 'left', marginTop: '1rem', paddingLeft: '1.5rem' }}>
                                        <li><strong>Example:</strong> Thomas Edison trying 1,000 ways to make a lightbulb. 💡</li>
                                        <li><strong>Fun Task:</strong> Build a tower using only spaghetti and tape!</li>
                                    </ul>
                                    <button onClick={() => { triggerConfetti(); addEarnings('criticalThinking', 25); markComplete(16); }} className="btn btn-sm" style={{ marginTop: '1rem', backgroundColor: '#00C851' }}>I get it! (+₦25)</button>
                                </div>
                            )}
                            {creativeMode === 'delib-emo' && (
                                <div>
                                    <h3 style={{ color: '#FF4081' }}>Deliberate Emotional: "The Poet" 📝</h3>
                                    <p>This is when you think deeply about your feelings to create something.</p>
                                    <ul style={{ textAlign: 'left', marginTop: '1rem', paddingLeft: '1.5rem' }}>
                                        <li><strong>Example:</strong> Writing a diary entry about a sad day to resolve your feelings. 📔</li>
                                        <li><strong>Fun Task:</strong> Write a funny poem about a hungry goat!</li>
                                    </ul>
                                    <button onClick={() => { triggerConfetti(); addEarnings('criticalThinking', 25); markComplete(16); }} className="btn btn-sm" style={{ marginTop: '1rem', backgroundColor: '#00C851' }}>I get it! (+₦25)</button>
                                </div>
                            )}
                            {creativeMode === 'spon-cog' && (
                                <div>
                                    <h3 style={{ color: '#00BFFF' }}>Spontaneous Cognitive: "The Newton" 🍏</h3>
                                    <p>The "Aha!" moment! When an idea hits you while you're doing something else.</p>
                                    <ul style={{ textAlign: 'left', marginTop: '1rem', paddingLeft: '1.5rem' }}>
                                        <li><strong>Example:</strong> Isaac Newton seeing an apple fall and realizing Gravity exists!</li>
                                        <li><strong>Fun Task:</strong> Go for a walk. Let your mind wander. See what pops in!</li>
                                    </ul>
                                    <button onClick={() => { triggerConfetti(); addEarnings('criticalThinking', 25); markComplete(16); }} className="btn btn-sm" style={{ marginTop: '1rem', backgroundColor: '#00C851' }}>I get it! (+₦25)</button>
                                </div>
                            )}
                            {creativeMode === 'spon-emo' && (
                                <div>
                                    <h3 style={{ color: '#7B1FA2' }}>Spontaneous Emotional: "The Artist" 🎨</h3>
                                    <p>Creativity that flows from the heart without planning.</p>
                                    <ul style={{ textAlign: 'left', marginTop: '1rem', paddingLeft: '1.5rem' }}>
                                        <li><strong>Example:</strong> A jazz musician playing a solo they just made up on the spot. 🎷</li>
                                        <li><strong>Fun Task:</strong> Turn on music and dance however you feel! No steps, just flow!</li>
                                    </ul>
                                    <button onClick={() => { triggerConfetti(); addEarnings('criticalThinking', 25); markComplete(16); }} className="btn btn-sm" style={{ marginTop: '1rem', backgroundColor: '#00C851' }}>I get it! (+₦25)</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )
        },
        {
            id: 17,
            title: "Legend of Truth & Lie 🎭",
            desc: "A story of wisdom.",
            content: (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p><strong>The Naked Truth and the Dressed-Up Lie</strong></p>
                        <button
                            onClick={() => speakText("The Naked Truth and the Dressed-Up Lie. One day, Truth and Lie met...")}
                            className="btn btn-sm"
                            style={{ backgroundColor: isReading ? '#ff4444' : '#00C851' }}
                        >
                            {isReading ? "🤫 Stop" : "🔊 Read to Me"}
                        </button>
                    </div>

                    <div style={{ marginTop: '1rem', padding: '1.5rem', backgroundColor: '#222', borderRadius: '15px', border: '1px solid #FFD700' }}>
                        {truthStep === 0 && (
                            <div style={{ animation: 'fadeIn 0.5s' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
                                <p>One day, Truth and Lie met. Lie said to Truth, "It's a marvelous day today!"</p>
                                <p>Truth looked up at the sky and sighed, for the day was truly beautiful.</p>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                    <button onClick={() => speakText("One day, Truth and Lie met. Lie said to Truth, It's a marvelous day today! Truth looked up at the sky and sighed, for the day was truly beautiful.")} className="btn btn-sm" style={{ backgroundColor: '#333' }}>🔊 Listen</button>
                                    <button onClick={() => setTruthStep(1)} className="btn" style={{ backgroundColor: '#00C851', flex: 1 }}>Continue...</button>
                                </div>
                            </div>
                        )}
                        {truthStep === 1 && (
                            <div style={{ animation: 'fadeIn 0.5s' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏊‍♂️</div>
                                <p>They spent some time together, arriving at a well. Lie said, "The water is very nice, let's take a bath together!"</p>
                                <p>Truth, once again suspicious, tested the water and discovered it was indeed very nice.</p>
                                <p>They undressed and started bathing.</p>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                    <button onClick={() => speakText("They spent some time together, arriving at a well. Lie said, The water is very nice, let's take a bath together! Truth, once again suspicious, tested the water and discovered it was indeed very nice. They undressed and started bathing.")} className="btn btn-sm" style={{ backgroundColor: '#333' }}>🔊 Listen</button>
                                    <button onClick={() => setTruthStep(2)} className="btn" style={{ backgroundColor: '#00C851', flex: 1 }}>What happened next?</button>
                                </div>
                            </div>
                        )}
                        {truthStep === 2 && (
                            <div style={{ animation: 'fadeIn 0.5s' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏃‍♂️💨</div>
                                <p>Suddenly, Lie came out of the water, put on Truth's clothes and ran away!</p>
                                <p>The furious Truth came out of the well and ran everywhere to find Lie and to get his clothes back.</p>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                    <button onClick={() => speakText("Suddenly, Lie came out of the water, put on Truth's clothes and ran away! The furious Truth came out of the well and ran everywhere to find Lie and to get his clothes back.")} className="btn btn-sm" style={{ backgroundColor: '#333' }}>🔊 Listen</button>
                                    <button onClick={() => setTruthStep(3)} className="btn" style={{ backgroundColor: '#ff4444', flex: 1 }}>Oh no!</button>
                                </div>
                            </div>
                        )}
                        {truthStep === 3 && (
                            <div style={{ animation: 'fadeIn 0.5s' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🫣</div>
                                <p>The World, seeing Truth naked, turned its gaze away, with contempt and rage.</p>
                                <p>Poor Truth returned to the well and disappeared forever, hiding therein, its shame.</p>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                    <button onClick={() => speakText("The World, seeing Truth naked, turned its gaze away, with contempt and rage. Poor Truth returned to the well and disappeared forever, hiding therein, its shame.")} className="btn btn-sm" style={{ backgroundColor: '#333' }}>🔊 Listen</button>
                                    <button onClick={() => setTruthStep(4)} className="btn" style={{ backgroundColor: '#00C851', flex: 1 }}>The Lesson...</button>
                                </div>
                            </div>
                        )}
                        {truthStep === 4 && (
                            <div style={{ animation: 'fadeIn 0.5s' }}>
                                <h3 style={{ color: '#FFD700' }}>The Moral</h3>
                                <p style={{ fontStyle: 'italic', fontSize: '1.2rem', margin: '1rem 0' }}>
                                    "Since then, Lie travels around the world, dressed as Truth, satisfying the needs of society, because the World has no desire at all to meet the naked Truth."
                                </p>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                    <button onClick={() => speakText("Since then, Lie travels around the world, dressed as Truth, satisfying the needs of society, because the World has no desire at all to meet the naked Truth.")} className="btn btn-sm" style={{ backgroundColor: '#333' }}>🔊 Listen</button>
                                    <button
                                        onClick={() => verifyAction(() => {
                                            markComplete(17);
                                            setTruthStep(5);
                                        }, "Reflecting on Truth...")}
                                        className="btn"
                                        style={{ backgroundColor: '#00C851', flex: 1 }}
                                        disabled={completedModules.includes(17)}
                                    >
                                        {completedModules.includes(17) ? "Wisdom Gained ✅" : "I Understand (+₦130)"}
                                    </button>
                                </div>
                            </div>
                        )}
                        {truthStep === 5 && (
                            <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s' }}>
                                <h3>🌟 Wisdom Added to Your Heart 🌟</h3>
                                <button onClick={() => setTruthStep(0)} className="btn" style={{ marginTop: '1rem' }}>Read Again</button>
                            </div>
                        )}
                    </div>
                </div>
            )
        },
        {
            id: 18,
            title: "The Detective's Office 🕵️‍♂️",
            desc: "Solve the Mystery!",
            content: (
                <div>
                    {/* CASE SELECTION (Teens/Adults only) */}
                    {!isKid && detectiveStep === 0 ? (
                        <div>
                            <h3 style={{ color: '#FFD700', marginBottom: '1rem' }}>Choose Your Case</h3>
                            <p style={{ marginBottom: '1.5rem', color: '#aaa' }}>Select a mystery to solve. Harder cases award more coins!</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {detectiveCases[getCurrentAgeGroup()].map((caseData) => {
                                    const caseKey = `${getCurrentAgeGroup()}-${caseData.id}`;
                                    const isSolved = solvedCases.includes(caseKey);
                                    return (
                                        <div
                                            key={caseData.id}
                                            style={{
                                                backgroundColor: '#222',
                                                padding: '1.5rem',
                                                borderRadius: '15px',
                                                border: isSolved ? '2px solid #00C851' : '2px solid #444',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s',
                                                opacity: isSolved ? 0.7 : 1
                                            }}
                                            onClick={() => !isSolved && selectCase(caseData.id)}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                <h4 style={{ margin: 0, color: isSolved ? '#00C851' : '#FFD700' }}>
                                                    {caseData.title} {isSolved && '✅'}
                                                </h4>
                                                <span style={{
                                                    backgroundColor: isSolved ? '#00C851' : '#FF8800',
                                                    padding: '0.3rem 0.8rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.9rem',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {isSolved ? 'Solved' : `₦${caseData.reward}`}
                                                </span>
                                            </div>
                                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#ccc' }}>{caseData.scenario}</p>
                                            {!isSolved && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); selectCase(caseData.id); }}
                                                    className="btn btn-sm"
                                                    style={{ marginTop: '1rem', backgroundColor: '#FFD700', color: '#000' }}
                                                >
                                                    Investigate 🔍
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        /* SOLVING PHASE */
                        <div>
                            {!isKid && (
                                <button
                                    onClick={() => setDetectiveStep(0)}
                                    className="btn btn-sm"
                                    style={{ marginBottom: '1rem', backgroundColor: '#444' }}
                                >
                                    ← Back to Cases
                                </button>
                            )}
                            <p style={{ marginBottom: '1rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                {currentCaseData.title}
                            </p>
                            <p style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#aaa' }}>
                                {currentCaseData.scenario}
                            </p>
                            <div style={{ backgroundColor: '#222', padding: '1rem', borderRadius: '15px', border: '1px solid #FFD700' }}>
                                {detectiveFeedback ? (
                                    <div style={{ textAlign: 'center' }}>
                                        <h3 style={{ color: detectiveFeedback.includes('Correct') ? '#00C851' : '#ff4444' }}>{detectiveFeedback}</h3>
                                    </div>
                                ) : (
                                    <div>
                                        {/* CLUES */}
                                        <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#333', borderRadius: '10px' }}>
                                            <h4 style={{ color: '#FFD700', marginTop: 0 }}>🔍 Clues:</h4>
                                            <ul style={{ textAlign: 'left', paddingLeft: '1.5rem' }}>
                                                {currentCaseData.clues.map((clue, idx) => (
                                                    <li key={idx} style={{ marginBottom: '0.5rem' }}>{clue}</li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* SUSPECTS */}
                                        <p style={{ marginBottom: '1rem' }}>Whodunnit?</p>
                                        <div style={{ display: 'grid', gridTemplateColumns: isKid ? '1fr 1fr 1fr' : (suspects.length === 4 ? '1fr 1fr' : '1fr 1fr 1fr'), gap: '0.5rem' }}>
                                            {suspects.map(s => (
                                                <button
                                                    key={s.id}
                                                    onClick={() => handleDetectiveGuess(s.id)}
                                                    className="btn"
                                                    style={{
                                                        backgroundColor: '#444',
                                                        padding: '1rem',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        border: detectiveSuspect === s.id ? '2px solid #FFD700' : '1px solid #555'
                                                    }}
                                                >
                                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                                                        {s.emoji || '👤'}
                                                    </div>
                                                    <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{s.name}</span>
                                                    {s.detail && <span style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.25rem' }}>{s.detail}</span>}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )
        },
        {
            id: 19,
            title: "Brain Gym 🏋️‍♂️",
            desc: "Speed Mental Workout!",
            content: (
                <div>
                    {gymStatus === 'idle' ? (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⏱️</div>
                            <p>Answer as many questions as you can in 60 seconds!</p>
                            <button onClick={startBrainGym} className="btn" style={{ marginTop: '1rem', backgroundColor: '#00C851', fontSize: '1.2rem', padding: '1rem 2rem' }}>
                                Start Workout! 🏃💨
                            </button>
                        </div>
                    ) : gymStatus === 'playing' ? (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                <span style={{ color: '#FFD700' }}>Score: {gymScore}</span>
                                <span style={{ color: gymTimer < 10 ? '#ff4444' : '#fff' }}>Time: {gymTimer}s</span>
                            </div>

                            <div style={{ padding: '2rem', backgroundColor: '#333', borderRadius: '15px', marginBottom: '1rem', border: '2px solid #00C851' }}>
                                <h2 style={{ fontSize: '2.5rem', margin: 0 }}>{gymQuestion?.q}</h2>
                            </div>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    value={gymAnswer}
                                    onChange={(e) => setGymAnswer(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleGymSubmit(gymAnswer)}
                                    placeholder="Type answer..."
                                    autoFocus
                                    style={{ flex: 1, padding: '1rem', fontSize: '1.2rem', borderRadius: '10px', border: 'none' }}
                                />
                                <button onClick={() => handleGymSubmit(gymAnswer)} className="btn" style={{ backgroundColor: '#00C851' }}>Submit 🚀</button>
                            </div>
                            {gymFeedback && <p style={{ marginTop: '0.5rem', color: '#FFD700', fontWeight: 'bold', animation: 'fadeOut 1s forwards' }}>{gymFeedback}</p>}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <h2>Workout Complete! 💦</h2>
                            <p style={{ fontSize: '1.5rem', margin: '1rem 0' }}>Final Score: <span style={{ color: '#FFD700' }}>{gymScore}</span></p>
                            <p>{gymScore >= 50 ? "Amazing! Your brain is huge! 🧠" : "Good logic! Try again to beat your score!"}</p>
                            <button onClick={startBrainGym} className="btn" style={{ marginTop: '1rem', backgroundColor: '#2196F3' }}>Agian! 🔄</button>
                        </div>
                    )}
                </div>
            )
        }
    ];

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            {/* CONFETTI */}
            {showConfetti && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999,
                    background: 'radial-gradient(circle, transparent 20%, transparent 20%, transparent 80%, transparent 80%, transparent 100%), radial-gradient(circle, transparent 20%, transparent 20%, transparent 80%, transparent 80%, transparent 100%)',
                    backgroundSize: '10px 10px',
                    animation: 'confetti 1s infinite'
                }}></div>
            )}

            {/* VERIFICATION OVERLAY */}
            {isVerifying && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 10000,
                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#fff', animation: 'fadeIn 0.3s'
                }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'bounce 1s infinite' }}>🦁</div>
                    <h2 style={{ color: '#FFD700', fontSize: '2rem' }}>{verificationMessage}</h2>
                    <p style={{ color: '#aaa' }}>Taking a moment to think...</p>
                    <div style={{ width: '200px', height: '5px', backgroundColor: '#333', borderRadius: '5px', marginTop: '1rem', overflow: 'hidden' }}>
                        <div style={{ width: '100%', height: '100%', backgroundColor: '#00C851', animation: 'loading 3s linear' }}></div>
                    </div>
                    <style>{`
                        @keyframes loading { from { width: 0%; } to { width: 100%; } }
                        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
                    `}</style>
                </div>
            )}

            <style>{`
                @keyframes confetti {
                    0% { background-position: 0 0, 10px 10px; opacity: 1; }
                    100% { background-position: 0 100px, 10px 110px; opacity: 0; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <button
                onClick={() => navigate('/')}
                className="btn btn-sm"
                style={{ marginBottom: '1rem', backgroundColor: '#333', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
                ⬅️ Back to Home
            </button>

            <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '3rem', color: 'var(--color-primary)' }}>
                    {isKid || isTeen ? "Think Like a Leader 🧠" : "Critical Thinking 🧠"}
                </h1>
                <p style={{ fontSize: '1.5rem', color: 'var(--color-text-muted)' }}>
                    {isKid || isTeen ? "15 Steps to Super Brain Power!" : "The Ancient Game of Strategy (Oware Logic)"}
                </p>
                <div style={{ display: 'inline-block', padding: '0.5rem 1rem', border: '1px solid var(--color-primary)', borderRadius: '20px', marginTop: '1rem', color: 'var(--color-primary)' }}>
                    Mode: {ageGroup || 'Adults'}
                </div>
            </header>

            {(isKid || isTeen) && (
                <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span><strong>Brain Power:</strong> {brainPower} XP</span>
                        <span>{completedModules.length}/15 Modules</span>
                    </div>
                    <div style={{ width: '100%', height: '15px', backgroundColor: '#333', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${(completedModules.length / 15) * 100}%`, height: '100%', backgroundColor: '#00C851', transition: 'width 0.5s' }}></div>
                    </div>
                    {showLevelUp && <div style={{ textAlign: 'center', color: '#FFD700', fontWeight: 'bold', marginTop: '0.5rem', animation: 'bounce 0.5s' }}>🎉 LEVEL UP! +10 XP</div>}
                </div>
            )}

            {/* MODULES LIST */}
            {(isKid || isTeen) && (
                <>
                    {/* MODULES QUEST MAP */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        {modules.map((module, index) => {
                            const isLocked = index > 0 && !completedModules.includes(modules[index - 1].id) && !completedModules.includes(module.id);
                            // Relaxed locking for fun: only lock if > 2 levels ahead? No, strict linear is better for "Game" feel.
                            // Actually, let's just visual lock but allow click for exploration if they want? No, let's keep it open but visually distinct.

                            const isExpanded = expandedModule === module.id;

                            return (
                                <div
                                    key={module.id}
                                    className="card"
                                    style={{
                                        padding: '0',
                                        overflow: 'hidden',
                                        gridColumn: isExpanded ? '1 / -1' : 'auto',
                                        border: isExpanded ? '2px solid var(--color-primary)' : 'none',
                                        backgroundColor: isExpanded ? '#222' : 'rgba(255,255,255,0.05)',
                                        transition: 'all 0.3s ease',
                                        position: 'relative',
                                        opacity: isLocked && !isExpanded ? 0.6 : 1,
                                        transform: isExpanded ? 'scale(1)' : 'scale(0.98)'
                                    }}
                                >
                                    <div
                                        onClick={() => toggleModule(module.id)}
                                        style={{
                                            padding: '1.5rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: isExpanded ? 'row' : 'column',
                                            justifyContent: isExpanded ? 'space-between' : 'center',
                                            alignItems: 'center',
                                            textAlign: isExpanded ? 'left' : 'center',
                                            height: isExpanded ? 'auto' : '200px',
                                            background: completedModules.includes(module.id)
                                                ? 'linear-gradient(45deg, rgba(0,200,81,0.2), transparent)'
                                                : 'transparent'
                                        }}
                                    >
                                        <div style={{ marginBottom: isExpanded ? 0 : '1rem' }}>
                                            <div style={{
                                                fontSize: '2.5rem',
                                                marginBottom: '0.5rem',
                                                filter: isLocked && !completedModules.includes(module.id) ? 'grayscale(1)' : 'none'
                                            }}>
                                                {module.title.split(" ")[module.title.split(" ").length - 1]}
                                                {/* Uses the last emoji as the icon */}
                                            </div>
                                            <h3 style={{ margin: 0, color: completedModules.includes(module.id) ? '#00C851' : (isExpanded ? 'var(--color-primary)' : '#fff') }}>
                                                {isLocked && !completedModules.includes(module.id) ? "🔒 Locked" : module.title}
                                            </h3>
                                            <p style={{ margin: '0.5rem 0 0 0', color: 'var(--color-text-muted)', fontSize: '0.9rem', display: isExpanded ? 'block' : 'none' }}>
                                                {module.desc}
                                            </p>
                                        </div>

                                        {!isExpanded && (
                                            <button className="btn btn-sm" style={{
                                                backgroundColor: completedModules.includes(module.id) ? '#00C851' : (isLocked ? '#555' : 'var(--color-primary)'),
                                                marginTop: 'auto'
                                            }}>
                                                {completedModules.includes(module.id) ? "Replay ↺" : (isLocked ? "Locked" : "Start ▶")}
                                            </button>
                                        )}

                                        {isExpanded && <span style={{ fontSize: '1.5rem', transform: 'rotate(180deg)' }}>▼</span>}
                                    </div>

                                    {isExpanded && (
                                        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', animation: 'fadeIn 0.5s' }}>
                                            {module.content}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* MENTOR CHAT FAB */}
                    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
                        {!showChat && (
                            <button
                                onClick={() => setShowChat(true)}
                                style={{
                                    width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--color-primary)',
                                    border: 'none', color: '#000', fontSize: '2rem', boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                🦁
                            </button>
                        )}
                    </div>

                    {/* MENTOR CHAT WINDOW */}
                    {showChat && (
                        <div style={{
                            position: 'fixed', bottom: '5rem', right: '2rem', width: '350px', height: '500px',
                            backgroundColor: '#1a1a1a', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                            display: 'flex', flexDirection: 'column', border: '2px solid var(--color-primary)', zIndex: 1000,
                            animation: 'fadeIn 0.3s'
                        }}>
                            <div style={{
                                padding: '1rem', backgroundColor: 'var(--color-primary)', color: '#000',
                                borderTopLeftRadius: '18px', borderTopRightRadius: '18px',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}>
                                <h3 style={{ margin: 0 }}>🦁 Village Mentor</h3>
                                <button onClick={() => setShowChat(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                            </div>

                            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {chatMessages.map((msg, i) => (
                                    <div key={i} style={{
                                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                        backgroundColor: msg.sender === 'user' ? '#333' : '#004d40',
                                        padding: '0.8rem', borderRadius: '15px', maxWidth: '80%'
                                    }}>
                                        {msg.text}
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>

                            <form onSubmit={handleChatSubmit} style={{ padding: '1rem', borderTop: '1px solid #333', display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="I helped my mom..."
                                    style={{ flex: 1, padding: '0.8rem', borderRadius: '20px', border: 'none', backgroundColor: '#333', color: '#fff' }}
                                />
                                <button type="submit" style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', backgroundColor: 'var(--color-primary)', cursor: 'pointer' }}>➤</button>
                            </form>
                        </div>
                    )}
                </>
            )}

            {(!isKid && !isTeen) && (
                // --- ADULT VIEW ---
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* FALLACY DETECTIVE */}
                    <div className="card" style={{ padding: '2rem', borderLeft: '4px solid #FF8800' }}>
                        <h3 style={{ color: '#FF8800', marginTop: 0 }}>🕵️‍♂️ Fallacy Detective</h3>
                        <p>Identify the flaw in the logic.</p>
                        <div style={{ marginTop: '1rem', padding: '1.5rem', backgroundColor: '#333', borderRadius: '15px' }}>
                            {showFallacyResult ? (
                                <h4 style={{ color: showFallacyResult.includes("Correct") ? '#00C851' : '#ff4444' }}>{showFallacyResult}</h4>
                            ) : (
                                <>
                                    <p style={{ fontSize: '1.2rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>"{fallacies[fallacyIndex].q}"</p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                        {fallacies[fallacyIndex].options.map((opt, i) => (
                                            <button key={i} onClick={() => handleFallacyAnswer(opt)} className="btn" style={{ backgroundColor: '#444' }}>{opt}</button>
                                        ))}
                                    </div>
                                </>
                            )}
                            <p style={{ marginTop: '1rem', textAlign: 'right', color: '#aaa' }}>Score: {fallacyScore}/{fallacies.length}</p>
                        </div>
                    </div>

                    {/* STRATEGY ROOM */}
                    <div className="card" style={{ padding: '2rem', borderLeft: '4px solid #00C851' }}>
                        <h3 style={{ color: '#00C851', marginTop: 0 }}>🦁 Strategy Room (Advanced Oware)</h3>
                        <p>Master the endgame.</p>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                            {strategies.map((strat, i) => (
                                <button
                                    key={i}
                                    onClick={() => startStrategyLevel(i)}
                                    className="btn btn-sm"
                                    style={{
                                        backgroundColor: strategyLevel === i ? 'var(--color-primary)' : '#333',
                                        color: strategyLevel === i ? '#000' : '#fff',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {strat.name}
                                </button>
                            ))}
                        </div>

                        <div style={{ backgroundColor: '#3e2723', padding: '2rem', borderRadius: '20px', textAlign: 'center' }}>
                            <p style={{ color: '#FFD700', marginBottom: '1rem' }}>{strategyMessage}</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                                {pits.map((seeds, index) => (
                                    <button
                                        key={index} onClick={() => handleSow(index)} disabled={seeds === 0}
                                        style={{
                                            width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#5d4037',
                                            border: 'none', color: '#fff', fontSize: '1.2rem', fontWeight: 'bold',
                                            cursor: seeds > 0 ? 'pointer' : 'default', margin: '0 auto'
                                        }}
                                    >
                                        {seeds}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => startStrategyLevel(strategyLevel)} className="btn btn-sm" style={{ backgroundColor: '#ff4444' }}>Reset Level</button>
                        </div>
                    </div>

                    {/* MENTOR CHAT FAB (Shared) */}
                    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
                        {!showChat && (
                            <button
                                onClick={() => setShowChat(true)}
                                style={{
                                    width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--color-primary)',
                                    border: 'none', color: '#000', fontSize: '2rem', boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}
                            >
                                🦁
                            </button>
                        )}
                    </div>

                    {/* MENTOR CHAT WINDOW */}
                    {showChat && (
                        <div style={{
                            position: 'fixed', bottom: '5rem', right: '2rem', width: '350px', height: '500px',
                            backgroundColor: '#1a1a1a', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                            display: 'flex', flexDirection: 'column', border: '2px solid var(--color-primary)', zIndex: 1000,
                            animation: 'fadeIn 0.3s'
                        }}>
                            <div style={{
                                padding: '1rem', backgroundColor: 'var(--color-primary)', color: '#000',
                                borderTopLeftRadius: '18px', borderTopRightRadius: '18px',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}>
                                <h3 style={{ margin: 0 }}>🦁 Village Mentor</h3>
                                <button onClick={() => setShowChat(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                            </div>

                            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {chatMessages.map((msg, i) => (
                                    <div key={i} style={{
                                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                        backgroundColor: msg.sender === 'user' ? '#333' : '#004d40',
                                        padding: '0.8rem', borderRadius: '15px', maxWidth: '80%'
                                    }}>
                                        {msg.text}
                                    </div>
                                ))}
                                <div ref={chatEndRef} />
                            </div>

                            <form onSubmit={handleChatSubmit} style={{ padding: '1rem', borderTop: '1px solid #333', display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    placeholder="I helped my mom..."
                                    style={{ flex: 1, padding: '0.8rem', borderRadius: '20px', border: 'none', backgroundColor: '#333', color: '#fff' }}
                                />
                                <button type="submit" style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', backgroundColor: 'var(--color-primary)', cursor: 'pointer' }}>➤</button>
                            </form>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default CriticalThinking;
