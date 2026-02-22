import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';
import { useGamification } from '../context/GamificationContext';
import { useWallet } from '../hooks/useWallet';

const Tech = () => {
  const navigate = useNavigate();
  const { addEarnings, ageGroup } = useWallet();
  const { addPoints } = useGamification();
  const canvasRef = useRef(null);

  const isKid = ageGroup === 'Kids';
  const isTeen = ageGroup === 'Teens';
  const isAdult = ageGroup === 'Adults';

  const [activeTab, setActiveTab] = useState('coding');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };
  const [completedLessons, setCompletedLessons] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('techCompletedLessons')) || [];
    } catch (e) {
      return [];
    }
  });
  const [techPoints, setTechPoints] = useState(() => Number(localStorage.getItem('techPoints')) || 0);

  useEffect(() => {
    localStorage.setItem('techCompletedLessons', JSON.stringify(completedLessons));
    localStorage.setItem('techPoints', techPoints);
  }, [completedLessons, techPoints]);

  const completeLesson = (lessonId, points) => {
    // Award points and money every time to encourage replay
    setTechPoints(prev => prev + points);
    addPoints(points); // Award points to gamification system
    addEarnings('tech', points); // Will be silent if capped

    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  // --- CODING STATE ---
  const kidCorrectOrder = ['Start 🚀', 'Walk 👣', 'Jump 🦘', 'Finish 🏁'];
  const adultCorrectOrder = ['console', '.', 'log', '(', '"Hello Africa"', ')', ';'];
  const correctOrder = isKid ? kidCorrectOrder : adultCorrectOrder;

  const [availableBlocks, setAvailableBlocks] = useState(() => {
    if (ageGroup === 'Kids') {
      return [
        { id: 4, text: 'Walk 👣' }, { id: 1, text: 'Start 🚀' },
        { id: 2, text: 'Finish 🏁' }, { id: 3, text: 'Jump 🦘' }
      ];
    }
    return [
      { id: 1, text: 'log' }, { id: 2, text: '"Hello Africa"' }, { id: 3, text: ';' },
      { id: 4, text: 'console' }, { id: 5, text: '(' }, { id: 6, text: '.' }, { id: 7, text: ')' },
    ];
  });

  const [userCode, setUserCode] = useState([]);
  const [codeMessage, setCodeMessage] = useState(isKid ? "Drag the steps in order!" : "Arrange the blocks!");
  const [loopCount, setLoopCount] = useState(3);
  const [isLoopPlaying, setIsLoopPlaying] = useState(false);
  const [loopStep, setLoopStep] = useState(0);
  const [trafficLight, setTrafficLight] = useState('red');
  const [conditionFeedback, setConditionFeedback] = useState('');

  // --- CYBERSECURITY STATE ---
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const chatScenarios = isKid ? [
    { id: 1, message: "Hi! I am a friend from school. Want to see my puppy?", safe: true },
    { id: 2, message: "I am a stranger. Tell me your home address so I can send a toy!", safe: false },
    { id: 3, message: "Let's play an online game together tomorrow!", safe: true },
    { id: 4, message: "Tell me your school name and what time you leave", safe: false },
    { id: 5, message: "What is your favorite cartoon?", safe: true },
  ] : [
    { id: 1, message: "Hi! What's your favorite color?", safe: true },
    { id: 2, message: "Can you send me your home address?", safe: false },
    { id: 3, message: "Want to play a game together?", safe: true },
    { id: 4, message: "Tell me your school name and what time you get out", safe: false },
    { id: 5, message: "What's your favorite animal?", safe: true },
  ];
  const [currentChat, setCurrentChat] = useState(0);
  const [chatScore, setChatScore] = useState(0);
  const [chatFeedback, setChatFeedback] = useState('');
  const scamExamples = [
    { id: 1, text: "🎉 You won $1,000,000! Click here to claim!", isScam: true },
    { id: 2, text: "Your homework assignment is due tomorrow. Check the portal.", isScam: false },
    { id: 3, text: "URGENT: Your account will be deleted! Send password now!", isScam: true },
    { id: 4, text: "Mom: Pick up milk on your way home", isScam: false },
  ];
  const [currentScam, setCurrentScam] = useState(0);
  const [scamScore, setScamScore] = useState(0);
  const [scamFeedback, setScamFeedback] = useState('');
  const infoItems = [
    { id: 1, item: "Your first name", shouldShare: 'sometimes', explanation: "Only with permission" },
    { id: 2, item: "Your home address", shouldShare: 'never', explanation: "NEVER share online" },
    { id: 3, item: "Your favorite color", shouldShare: 'yes', explanation: "Safe!" },
    { id: 4, item: "Your school name", shouldShare: 'never', explanation: "Keep private" },
    { id: 5, item: "Your phone number", shouldShare: 'never', explanation: "Private info" },
    { id: 6, item: "Your favorite game", shouldShare: 'yes', explanation: "Safe!" },
  ];
  const [infoAnswers, setInfoAnswers] = useState({});
  const [showInfoResults, setShowInfoResults] = useState(false);

  // --- AI STATE ---
  const [aiAccuracy, setAiAccuracy] = useState(0);
  const [currentImage, setCurrentImage] = useState({ emoji: '🦁', type: 'wild' });
  const [aiMessage, setAiMessage] = useState("Teach the AI!");


  // --- CREATIVITY STATE ---
  const [pixelGrid, setPixelGrid] = useState(Array(16).fill().map(() => Array(16).fill('#000')));
  const [selectedColor, setSelectedColor] = useState('#FFD700');
  const [isPlaying, setIsPlaying] = useState(false);
  const [beatPattern, setBeatPattern] = useState(Array(16).fill().map(() => ({ drum: false, piano: false, horn: false })));
  const [currentBeat, setCurrentBeat] = useState(0);

  // --- ROBOTICS STATE ---
  const [robotParts, setRobotParts] = useState({ brain: false, eyes: false, wheels: false, arms: false });
  const [sensorActive, setSensorActive] = useState({ light: false, sound: false, touch: false });
  const [robotX, setRobotX] = useState(50);

  // --- PROBLEM SOLVING STATE ---
  const logicPuzzles = isKid ? [
    { q: "If you have 2 apples and get 1 more, do you have 3?", a: "yes" },
    { q: "Is the sun cold at night?", a: "no" },
    { q: "Can a dog fly to the moon?", a: "no" },
  ] : [
    { q: "All lions are cats. Simba is a lion. Is Simba a cat?", a: "yes" },
    { q: "If it rains, the ground is wet. The ground is wet. Did it rain?", a: "maybe" },
    { q: "All birds can fly. Penguins are birds. Can penguins fly?", a: "no" },
  ];
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [puzzleFeedback, setPuzzleFeedback] = useState('');
  const [debugCode, setDebugCode] = useState('console.log("Hello"');
  const [debugFeedback, setDebugFeedback] = useState('');

  // --- HANDLERS ---
  const handleAddBlock = (block) => {
    setUserCode([...userCode, block]);
    setAvailableBlocks(availableBlocks.filter(b => b.id !== block.id));
  };

  const handleRemoveBlock = (block) => {
    setAvailableBlocks([...availableBlocks, block]);
    setUserCode(userCode.filter(b => b.id !== block.id));
  };

  const handleRunCode = () => {
    const currentString = userCode.map(b => b.text).join('');
    if (currentString === correctOrder.join('')) {
      setCodeMessage("🎉 SUCCESS!");
      completeLesson('coding-1', 20);
    } else {
      setCodeMessage("❌ Try again!");
    }
  };

  const handleLoopPlay = () => {
    setIsLoopPlaying(true);
    setLoopStep(0);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setLoopStep(step);
      if (step >= loopCount * 3) {
        clearInterval(interval);
        setIsLoopPlaying(false);
        completeLesson('coding-loops', 30);
      }
    }, 500);
  };

  const handleConditionCheck = (action) => {
    const correct = (trafficLight === 'red' && action === 'stop') ||
      (trafficLight === 'green' && action === 'go') ||
      (trafficLight === 'yellow' && action === 'slow');
    if (correct) {
      setConditionFeedback('✅ Correct!');
      completeLesson('coding-conditions', 30);
    } else {
      setConditionFeedback('❌ Wrong!');
    }
  };

  const checkPasswordStrength = (pwd) => {
    setPassword(pwd);
    if (pwd.length < 4) setPasswordStrength('weak');
    else if (pwd.length < 8 || !/\d/.test(pwd)) setPasswordStrength('medium');
    else if (pwd.length >= 8 && /\d/.test(pwd) && /[!@#$%^&*]/.test(pwd)) {
      setPasswordStrength('strong');
      completeLesson('cyber-password', 25);
    } else setPasswordStrength('medium');
  };

  const handleChatAnswer = (isSafe) => {
    const scenario = chatScenarios[currentChat];
    if ((isSafe && scenario.safe) || (!isSafe && !scenario.safe)) {
      setChatScore(prev => prev + 1);
      setChatFeedback('✅ Correct!');
    } else {
      setChatFeedback('❌ Wrong!');
    }
    setTimeout(() => {
      if (currentChat < chatScenarios.length - 1) {
        setCurrentChat(prev => prev + 1);
        setChatFeedback('');
      } else {
        completeLesson('cyber-chat', 25);
      }
    }, 1500);
  };

  const handleScamAnswer = (isScam) => {
    const example = scamExamples[currentScam];
    if ((isScam && example.isScam) || (!isScam && !example.isScam)) {
      setScamScore(prev => prev + 1);
      setScamFeedback('✅ Correct!');
    } else {
      setScamFeedback('❌ Wrong!');
    }
    setTimeout(() => {
      if (currentScam < scamExamples.length - 1) {
        setCurrentScam(prev => prev + 1);
        setScamFeedback('');
      } else {
        completeLesson('cyber-scam', 25);
      }
    }, 1500);
  };

  const handleInfoSubmit = () => {
    setShowInfoResults(true);
    const correct = Object.keys(infoAnswers).filter(key => {
      const item = infoItems.find(i => i.id === parseInt(key));
      return infoAnswers[key] === item.shouldShare;
    }).length;
    if (correct === infoItems.length) completeLesson('cyber-info', 25);
  };



  const handlePixelClick = (row, col) => {
    const newGrid = [...pixelGrid];
    newGrid[row][col] = selectedColor;
    setPixelGrid(newGrid);
  };

  const clearCanvas = () => {
    setPixelGrid(Array(16).fill().map(() => Array(16).fill('#000')));
  };

  const saveArt = () => {
    completeLesson('creativity-pixel', 40);
    showToast('Art saved! 🎨', 'success');
  };

  const toggleBeat = (index, instrument) => {
    const newPattern = [...beatPattern];
    newPattern[index][instrument] = !newPattern[index][instrument];
    setBeatPattern(newPattern);
  };

  const playBeat = () => {
    setIsPlaying(true);
    let beat = 0;
    const interval = setInterval(() => {
      setCurrentBeat(beat);
      const sounds = beatPattern[beat];
      if (sounds.drum) new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8LJnHgU7k9n0yXkpBSh+zPLaizsKGGe+7+mjTxELTqvk8bVrIAU+mNz1xXYlBSl+zO==').play();
      if (sounds.piano) new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8LJnHgU7k9n0yXkpBSh+zPLaizsKGGe+7+mjTxELTqvk8bVrIAU+mNz1xXYlBSl+zO==').play();
      if (sounds.horn) new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGS57OihUBELTKXh8LJnHgU7k9n0yXkpBSh+zPLaizsKGGe+7+mjTxELTqvk8bVrIAU+mNz1xXYlBSl+zO==').play();
      beat++;
      if (beat >= 16) {
        beat = 0;
        clearInterval(interval);
        setIsPlaying(false);
        completeLesson('creativity-music', 40);
      }
    }, 300);
  };

  const toggleRobotPart = (part) => {
    setRobotParts({ ...robotParts, [part]: !robotParts[part] });
    const allParts = Object.values({ ...robotParts, [part]: !robotParts[part] }).every(v => v);
    if (allParts) completeLesson('robotics-build', 35);
  };

  const toggleSensor = (sensor) => {
    setSensorActive({ ...sensorActive, [sensor]: !sensorActive[sensor] });
    if (sensor === 'light' && sensorActive.light) {
      setRobotX(prev => Math.min(prev + 10, 90));
    }
  };

  const handlePuzzleAnswer = (answer) => {
    const puzzle = logicPuzzles[currentPuzzle];
    if (answer === puzzle.a) {
      setPuzzleFeedback('✅ Correct!');
      if (currentPuzzle < logicPuzzles.length - 1) {
        setTimeout(() => {
          setCurrentPuzzle(prev => prev + 1);
          setPuzzleFeedback('');
        }, 1500);
      } else {
        completeLesson('logic-puzzles', 35);
      }
    } else {
      setPuzzleFeedback('❌ Try again!');
    }
  };

  const checkDebug = () => {
    if (debugCode.includes(')')) {
      setDebugFeedback('✅ Fixed! Missing closing parenthesis');
      completeLesson('debug-challenge', 35);
    } else {
      setDebugFeedback('❌ Still has errors!');
    }
  };

  // --- RENDER FUNCTIONS ---
  const renderCoding = () => (
    <div>
      <h2 style={{ marginBottom: '1rem', color: '#FFD700' }}>💻 Coding: talk to computers</h2>
      {isKid && (
        <div style={{ backgroundColor: 'rgba(33, 150, 243, 0.1)', padding: '1rem', borderRadius: '12px', border: '1px solid #2196F3', marginBottom: '2rem' }}>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#fff' }}>
            <strong>What is Coding?</strong> 🎓 Coding is like giving a <strong>recipe</strong> to a robot. You tell it exactly what steps to take!
          </p>
        </div>
      )}

      {/* Kids Track: Basic Sequences */}
      {isKid && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>Level 1: Robot Instructions</h3>
          <p style={{ color: '#aaa', marginBottom: '1rem' }}>Arrange the blocks to tell the robot what to do!</p>
          <div style={{ backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '8px', minHeight: '80px', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ color: '#569cd6' }}>&gt;</span>
            {userCode.map((block) => (
              <button key={block.id} onClick={() => handleRemoveBlock(block)} style={{ backgroundColor: '#333', color: '#fff', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
                {block.text}
              </button>
            ))}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {availableBlocks.map((block) => (
                <button key={block.id} onClick={() => handleAddBlock(block)} className="btn btn-sm" style={{ backgroundColor: '#444' }}>
                  {block.text}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleRunCode} className="btn" style={{ backgroundColor: '#00C851' }}>RUN CODE ▶</button>
          <p style={{ marginTop: '1rem' }}>{codeMessage}</p>
        </div>
      )}

      {/* Teens & Adults: Advanced Javascript Editor */}
      {(isTeen || isAdult) && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>{isTeen ? 'Level 1: VS Code Simulation 🖥️' : 'Level 1: Business Automation'}</h3>
          <p style={{ color: '#aaa', marginBottom: '1rem' }}>
            {isTeen ? 'Write real Javascript using logic! Try one of the Africa-centric projects below.' : 'Automate a greeting for your business using JS.'}
          </p>

          {isTeen && (
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-sm" onClick={() => setDebugCode(`const user = "Abba";\nconst balance = 5000;\nconsole.log(user + "'s M-Pesa Balance: ₦" + balance);`)} style={{ backgroundColor: '#1e1e1e', border: '1px solid #00C851', color: '#00C851' }}>📱 M-Pesa Logic</button>
              <button className="btn btn-sm" onClick={() => setDebugCode(`const temp = 35;\nif (temp > 30) {\n  console.log("Activating Solar Pump... ☀️");\n} else {\n  console.log("Pump Idle.");\n}`)} style={{ backgroundColor: '#1e1e1e', border: '1px solid #FF8800', color: '#FF8800' }}>☀️ Smart Farm API</button>
              <button className="btn btn-sm" onClick={() => setDebugCode(`const code = "*123#";\nif (code === "*123#") {\n  console.log("1. Check Balance\\n2. Buy Data\\n3. Transfer");\n}`)} style={{ backgroundColor: '#1e1e1e', border: '1px solid #2196F3', color: '#2196F3' }}>📟 USSD Menu</button>
            </div>
          )}

          <div style={{ backgroundColor: '#1e1e1e', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', gap: '10px', color: '#666', marginBottom: '10px', fontSize: '0.8rem' }}>
              <span>main.js</span>
              <span>index.html</span>
            </div>
            <textarea
              style={{
                width: '100%',
                height: '150px',
                backgroundColor: 'transparent',
                color: '#fff',
                border: 'none',
                fontFamily: 'monospace',
                fontSize: '1rem',
                outline: 'none',
                resize: 'none'
              }}
              value={isTeen ? debugCode : undefined}
              onChange={isTeen ? (e) => setDebugCode(e.target.value) : undefined}
              placeholder={`// Write your code here...\nconsole.log("MindNest Pro");`}
              defaultValue={!isTeen ? `const appName = "MindNest";\nconsole.log(appName + " is ready!");` : undefined}
            />
          </div>
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button className="btn" style={{ backgroundColor: '#2196F3' }} onClick={() => {
              showToast("Deploying to African Regional Server... 🚀", "success");
              completeLesson('coding-advanced', 50);
            }}>Deploy Code 🚀</button>
            <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Hint: Practice using variables and logic.</span>
          </div>
        </div>
      )}

      {/* Shared: Loops Section */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Lesson 2: Loops ({isKid ? 'Repeat' : 'Iteration'})</h3>
        <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>
          {isKid ? 'Set the loop count to see the robot move!' : 'Understand how computers process thousands of items in seconds.'}
        </p>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '5rem' }}>
            {isLoopPlaying ? (loopStep % 3 === 0 ? '🕺' : loopStep % 3 === 1 ? '💃' : '🙌') : '🤖'}
          </div>
          <p style={{ fontWeight: 'bold' }}>{isLoopPlaying ? `Processing: Item ${loopStep}` : 'Standard Iteration Start'}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
          <label>Data Count:</label>
          <input type="number" min="1" max="100" value={loopCount} onChange={(e) => setLoopCount(Number(e.target.value))} style={{ padding: '0.5rem', width: '80px', borderRadius: '8px', backgroundColor: '#333', border: '1px solid #555', color: '#fff' }} />
          <button onClick={handleLoopPlay} disabled={isLoopPlaying} className="btn" style={{ backgroundColor: '#2196F3' }}>
            {isLoopPlaying ? 'Iterating...' : 'Run Loop 🔄'}
          </button>
        </div>
      </div>

      {/* Adults: Specialized Monetization section in Coding */}
      {isAdult && (
        <div className="card" style={{ border: '2px solid var(--color-accent)', background: 'rgba(255, 215, 0, 0.05)' }}>
          <h3 style={{ color: 'var(--color-accent)' }}>Building SaaS (Software as a Service)</h3>
          <p style={{ marginBottom: '1.5rem' }}>Learn how to turn your code into a monthly income stream.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', backgroundColor: '#222', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 10px 0' }}>SaaS Model</h4>
              <p style={{ fontSize: '0.85rem', color: '#aaa' }}>Build once, sell many times with subscriptions.</p>
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#222', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 10px 0' }}>API Economy</h4>
              <p style={{ fontSize: '0.85rem', color: '#aaa' }}>Sell your code functionality to other developers.</p>
            </div>
          </div>
          <button className="btn" style={{ marginTop: '1.5rem', width: '100%' }} onClick={() => completeLesson('coding-saas', 60)}>Master SaaS Logic</button>
        </div>
      )}

      {/* Lesson 3: Conditions */}
      <div className="card">
        <h3>Lesson 3: Conditions (If/Then)</h3>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto 1rem', backgroundColor: trafficLight === 'red' ? '#ff4444' : trafficLight === 'yellow' ? '#FFD700' : '#00C851' }}></div>
          <button onClick={() => setTrafficLight(trafficLight === 'red' ? 'yellow' : trafficLight === 'yellow' ? 'green' : 'red')} className="btn btn-sm">Change Light</button>
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <button onClick={() => handleConditionCheck('stop')} className="btn" style={{ flex: '1 1 100px', backgroundColor: '#ff4444' }}>STOP 🛑</button>
          <button onClick={() => handleConditionCheck('slow')} className="btn" style={{ flex: '1 1 100px', backgroundColor: '#FFD700', color: '#000' }}>SLOW ⚠️</button>
          <button onClick={() => handleConditionCheck('go')} className="btn" style={{ flex: '1 1 100px', backgroundColor: '#00C851' }}>GO ✅</button>
        </div>
        {conditionFeedback && <p style={{ textAlign: 'center' }}>{conditionFeedback}</p>}
      </div>
    </div>
  );

  const renderCybersecurity = () => (
    <div>
      <h2 style={{ marginBottom: '1rem', color: '#FFD700' }}>🔒 Cybersecurity: {isKid ? 'Shield Your Self' : 'Defense and Encryption'}</h2>
      {isKid && (
        <div style={{ backgroundColor: 'rgba(244, 67, 54, 0.1)', padding: '1.5rem', borderRadius: '12px', border: '1px solid #f44336', marginBottom: '2rem' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#f44336' }}>📖 Kid's Tech Dictionary</h4>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#fff', lineHeight: '1.6' }}>
            <li><strong>Password</strong>: A secret key for your digital house.</li>
            <li><strong>Scam</strong>: A trick someone uses to steal something from you.</li>
            <li><strong>Private Info</strong>: Your name, school, or address. Keep them secret!</li>
          </ul>
        </div>
      )}

      {/* Password Strength Section */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>{isKid ? 'Create a Secret Code' : 'Advanced Entropy Check'}</h3>
        <p style={{ color: '#aaa', marginBottom: '1rem' }}>
          {isKid ? 'Create a strong password that strangers can\'t guess!' : 'Passwords need high entropy (unpredictability). Test yours below.'}
        </p>
        <input type="password" value={password} onChange={(e) => checkPasswordStrength(e.target.value)} placeholder="Type password..." style={{ width: '100%', padding: '1rem', marginBottom: '1rem', borderRadius: '8px', backgroundColor: '#333', color: '#fff', border: '1px solid #555' }} />
        <div style={{ height: '12px', borderRadius: '6px', backgroundColor: '#333', overflow: 'hidden', marginBottom: '1rem' }}>
          <div style={{ height: '100%', width: passwordStrength === 'weak' ? '33%' : passwordStrength === 'medium' ? '66%' : '100%', backgroundColor: passwordStrength === 'weak' ? '#ff4444' : passwordStrength === 'medium' ? '#FFD700' : '#00C851', transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
        </div>
        <p style={{ textAlign: 'center', fontWeight: 'bold', color: passwordStrength === 'weak' ? '#ff4444' : passwordStrength === 'medium' ? '#FFD700' : '#00C851' }}>
          {passwordStrength ? `Strength: ${passwordStrength.toUpperCase()}` : 'Analyze Password Entropy'}
        </p>
      </div>

      {/* MFA / Pro Safety Sections for Teens and Adults */}
      {!isKid && (
        <div className="card" style={{ marginBottom: '2rem', border: '1px solid #666' }}>
          <h3>Multi-Factor Authentication (MFA) 📱</h3>
          <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>A password is not enough. You need multiple keys for your house.</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px', padding: '1rem', backgroundColor: '#2a2a2a', borderRadius: '8px', borderLeft: '4px solid #2196F3' }}>
              <span style={{ display: 'block', fontSize: '1.1rem', marginBottom: '5px' }}>🔑 Something you know</span>
              <p style={{ fontSize: '0.8rem', color: '#888' }}>Standard passwords or PINs.</p>
            </div>
            <div style={{ flex: '1 1 200px', padding: '1rem', backgroundColor: '#2a2a2a', borderRadius: '8px', borderLeft: '4px solid #00C851' }}>
              <span style={{ display: 'block', fontSize: '1.1rem', marginBottom: '5px' }}>📱 Something you have</span>
              <p style={{ fontSize: '0.8rem', color: '#888' }}>Auth apps or SMS codes.</p>
            </div>
          </div>
          <button className="btn" style={{ marginTop: '1.5rem', width: '100%', backgroundColor: '#2196F3' }} onClick={() => completeLesson('cyber-mfa', 40)}>Secure Your Account</button>
        </div>
      )}

      {/* Spot the Scam (Expanded for Adults) */}
      <div className="card">
        <h3>{isAdult ? 'Corporate Espionage & Phishing' : 'Spot the Scam'}</h3>
        <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>
          {isAdult ? 'Learn how sophisticated attackers try to steal business data.' : 'Don\'t fall for tricky links and fake winners.'}
        </p>
        {currentScam < scamExamples.length && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #333' }}>
              <p style={{ fontStyle: 'italic', color: '#FFD700' }}>{scamExamples[currentScam].text}</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => handleScamAnswer(false)} className="btn" style={{ flex: '1 1 150px', padding: '0.8rem 2rem', backgroundColor: '#333', border: '1px solid #00C851', color: '#00C851' }}>✅ AUTHENTIC</button>
              <button onClick={() => handleScamAnswer(true)} className="btn" style={{ flex: '1 1 150px', padding: '0.8rem 2rem', backgroundColor: '#333', border: '1px solid #ff4444', color: '#ff4444' }}>🚨 SCAM / PHISHING</button>
            </div>
            {scamFeedback && <p style={{ textAlign: 'center', marginTop: '1rem', color: '#FFD700', fontWeight: 'bold' }}>{scamFeedback}</p>}
          </div>
        )}
      </div>

      {isAdult && (
        <div className="card" style={{ marginTop: '2rem', background: '#1a1a1a', border: '1px solid #f44336' }}>
          <h3 style={{ color: '#f44336' }}>Enterprise Security Protocol</h3>
          <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '1rem' }}>As a professional, you are a target. Learn the Zero Trust model.</p>
          <ul style={{ fontSize: '0.85rem', color: '#aaa', paddingLeft: '20px' }}>
            <li>Never trust, always verify (even internal emails).</li>
            <li>Use hardware security keys (YubiKeys) for high value work.</li>
            <li>Segregate your professional and personal devices.</li>
          </ul>
        </div>
      )}

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Chat Detective</h3>
        {currentChat < chatScenarios.length && (
          <>
            <div style={{ backgroundColor: '#222', padding: '2rem', borderRadius: '8px', marginBottom: '1rem' }}>
              <p>"{chatScenarios[currentChat].message}"</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => handleChatAnswer(true)} className="btn" style={{ flex: '1 1 120px', backgroundColor: '#00C851' }}>✅ SAFE</button>
              <button onClick={() => handleChatAnswer(false)} className="btn" style={{ flex: '1 1 120px', backgroundColor: '#ff4444' }}>🚨 DANGER</button>
            </div>
            {chatFeedback && <p style={{ textAlign: 'center', marginTop: '1rem' }}>{chatFeedback}</p>}
          </>
        )}
      </div>
    </div>
  );

  const [aiLevel, setAiLevel] = useState(1);
  const [aiScore, setAiScore] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const aiLevels = {
    1: { title: 'Level 1: Domestic vs Wild 🐶🦁', target: 5, data: [{ emoji: '🐶', type: 'domestic' }, { emoji: '🦁', type: 'wild' }, { emoji: '🐱', type: 'domestic' }, { emoji: '🐆', type: 'wild' }] },
    2: { title: 'Level 2: Fruit vs Veggie 🍎🥕', target: 8, data: [{ emoji: '🍎', type: 'fruit' }, { emoji: '🥕', type: 'veggie' }, { emoji: '🍌', type: 'fruit' }, { emoji: '🥦', type: 'veggie' }] },
    3: { title: 'Level 3: Land vs Sea 🐘🐳', target: 10, data: [{ emoji: '🐘', type: 'land' }, { emoji: '🐳', type: 'sea' }, { emoji: '🦒', type: 'land' }, { emoji: '🐙', type: 'sea' }] },
    4: { title: 'Level 4: Flying vs Walking 🦅🐕', target: 12, data: [{ emoji: '🦅', type: 'fly' }, { emoji: '🐕', type: 'walk' }, { emoji: '🦜', type: 'fly' }, { emoji: '🐄', type: 'walk' }] },
    5: { title: 'Level 5: Living vs Non-Living 🤖👩', target: 15, data: [{ emoji: '🤖', type: 'non-living' }, { emoji: '👩', type: 'living' }, { emoji: '📱', type: 'non-living' }, { emoji: '🌲', type: 'living' }] }
  };

  const currentLevelData = aiLevels[aiLevel];

  useEffect(() => {
    // Initialize first image for level 1
    const levels = aiLevels[1].data;
    setCurrentImage(levels[Math.floor(Math.random() * levels.length)]);
  }, []);

  const handleTrain = (selection) => {
    // Mapping for button clicks to types
    let isCorrect = false;

    // Normalize selection for display buttons (which might send generic 'left'/'right' or specific types)
    // Simplified logic: Check if selection matches current image type
    if (selection === currentImage.type) {
      isCorrect = true;
    }

    if (isCorrect) {
      setAiScore(prev => prev + 1);
      setAiAccuracy(prev => Math.min(prev + 15, 100)); // Update for Adult View
      setAiMessage("✅ Correct!");
      if (aiScore + 1 >= currentLevelData.target) {
        setShowLevelUp(true);
      }
    } else {
      setAiAccuracy(prev => Math.max(prev - 10, 0)); // Update for Adult View
      setAiMessage("❌ Wrong!");
    }

    // Pick next image from current level
    const nextImg = currentLevelData.data[Math.floor(Math.random() * currentLevelData.data.length)];
    setCurrentImage(nextImg);
  };

  const nextLevel = () => {
    if (aiLevel < 5) {
      setAiLevel(prev => prev + 1);
      setAiScore(0);
      setShowLevelUp(false);
      setAiMessage("New Level Started!");
      // Set image for new level
      const nextLvlData = aiLevels[aiLevel + 1].data;
      setCurrentImage(nextLvlData[Math.floor(Math.random() * nextLvlData.length)]);
    } else {
      completeLesson('ai-master', 100);
      setAiMessage("🎓 AI MASTER GRADUATE!");
      setShowLevelUp(false);
    }
  };

  const renderAI = () => (
    <div className="card" style={{ textAlign: 'center' }}>
      <h2 style={{ marginBottom: '1rem', color: '#FFD700' }}>🧠 {isKid ? 'AI Academy' : 'Artificial Intelligence & Ethics'}</h2>
      {isKid && (
        <div style={{ backgroundColor: 'rgba(156, 39, 176, 0.1)', padding: '1rem', borderRadius: '12px', border: '1px solid #9C27B0', marginBottom: '2rem', textAlign: 'left' }}>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#fff' }}>
            <strong>What is AI?</strong> 🧠 AI is a computer that learns from <strong>examples</strong>, just like you learn from books. It helps us solve problems!
          </p>
        </div>
      )}
      <p style={{ marginBottom: '2rem', color: '#aaa' }}>
        {isKid ? 'Train your AI model through 5 zones of intelligence!' : isTeen ? 'Explore how AI learns, and the ethics of bias and deepfakes.' : 'Leverage AI for professional productivity and data analysis.'}
      </p>

      {/* Kids Game Area */}
      {isKid ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', padding: '0 1rem', fontSize: '0.9rem', color: '#888' }}>
            <span>Level {aiLevel}/5</span>
            <span>Score: {aiScore}/{currentLevelData.target}</span>
          </div>

          {!showLevelUp ? (
            <>
              <h3 style={{ color: '#00C851', marginBottom: '1rem' }}>{currentLevelData.title}</h3>
              <div style={{ fontSize: '8rem', marginBottom: '2rem', transition: 'all 0.3s' }}>{currentImage.emoji}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {/* Dynamic Buttons based on Level */}
                {aiLevel === 1 && (
                  <>
                    <button className="btn" style={{ flex: '1 1 150px', backgroundColor: '#FF4500' }} onClick={() => handleTrain('wild')}>Wild 🦁</button>
                    <button className="btn" style={{ flex: '1 1 150px', backgroundColor: '#00C851' }} onClick={() => handleTrain('domestic')}>Domestic 🐶</button>
                  </>
                )}
                {aiLevel === 2 && (
                  <>
                    <button className="btn" style={{ flex: '1 1 150px', backgroundColor: '#FF4500' }} onClick={() => handleTrain('fruit')}>Fruit 🍎</button>
                    <button className="btn" style={{ flex: '1 1 150px', backgroundColor: '#00C851' }} onClick={() => handleTrain('veggie')}>Veggie 🥕</button>
                  </>
                )}
                {aiLevel === 3 && (
                  <>
                    <button className="btn" style={{ flex: '1 1 150px', backgroundColor: '#FF4500' }} onClick={() => handleTrain('land')}>Land 🐘</button>
                    <button className="btn" style={{ flex: '1 1 150px', backgroundColor: '#00C851' }} onClick={() => handleTrain('sea')}>Sea 🐳</button>
                  </>
                )}
                {aiLevel === 4 && (
                  <>
                    <button className="btn" style={{ flex: '1 1 150px', backgroundColor: '#FF4500' }} onClick={() => handleTrain('fly')}>Flying 🦅</button>
                    <button className="btn" style={{ flex: '1 1 150px', backgroundColor: '#00C851' }} onClick={() => handleTrain('walk')}>Walking 🐕</button>
                  </>
                )}
                {aiLevel === 5 && (
                  <>
                    <button className="btn" style={{ flex: '1 1 150px', backgroundColor: '#FF4500' }} onClick={() => handleTrain('non-living')}>Object 🤖</button>
                    <button className="btn" style={{ flex: '1 1 150px', backgroundColor: '#00C851' }} onClick={() => handleTrain('living')}>Living 👩</button>
                  </>
                )}
              </div>
              <h3>{aiMessage}</h3>
            </>
          ) : (
            <div style={{ padding: '2rem', backgroundColor: '#1a1a1a', borderRadius: '12px', border: '2px solid #FFD700' }}>
              <h2 style={{ color: '#FFD700' }}>🎉 Level Complete!</h2>
              <p>Your AI is getting smarter!</p>
              <button className="btn" onClick={nextLevel} style={{ backgroundColor: '#00C851', marginTop: '1rem', width: '100%' }}>
                {aiLevel < 5 ? 'Start Next Level 🚀' : 'Claim Master Certificate 🎓'}
              </button>
            </div>
          )}

          <div style={{ width: '100%', height: '10px', backgroundColor: '#333', borderRadius: '5px', marginTop: '2rem', overflow: 'hidden' }}>
            <div style={{ width: `${(aiLevel / 5) * 100}%`, height: '100%', backgroundColor: '#2196F3', transition: 'width 0.5s' }}></div>
          </div>
        </div>
      ) : (
        /* Teen/Adult View */
        <div>
          <div style={{ fontSize: '8rem', marginBottom: '2rem' }}>{currentImage.emoji}</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <button className="btn" style={{ flex: '1 1 180px', backgroundColor: '#FF4500' }} onClick={() => handleTrain('wild')}>Wild / Unstructured 🦁</button>
            <button className="btn" style={{ flex: '1 1 180px', backgroundColor: '#00C851' }} onClick={() => handleTrain('domestic')}>Domestic / Labeled 🏠</button>
          </div>
          <h3>{aiMessage}</h3>

          <div style={{ maxWidth: '500px', margin: '2rem auto 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Model Convergence:</span><span>{aiAccuracy}%</span>
            </div>
            <div style={{ width: '100%', height: '20px', backgroundColor: '#333', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${aiAccuracy}%`, height: '100%', backgroundColor: aiAccuracy > 80 ? '#00C851' : '#FFD700', transition: 'width 0.3s' }}></div>
            </div>
          </div>
        </div>
      )}

      {!isKid && (
        <div style={{ marginTop: '3rem', textAlign: 'left', padding: '1.5rem', backgroundColor: '#1a1a1a', borderRadius: '12px', borderLeft: '5px solid #9C27B0' }}>
          <h4 style={{ color: '#9C27B0', marginTop: 0 }}>{isTeen ? 'AI Ethics: Deepfakes & Bias' : 'AI for Business Productivity 💼'}</h4>
          <p style={{ fontSize: '0.9rem', color: '#888', lineHeight: '1.6' }}>
            {isTeen
              ? 'AI can be tricked! If you train it with biased data, it makes biased decisions. Always verify AI-generated content (Deepfakes).'
              : (
                <>
                  Stop doing repetitive work manually. Use AI tools to 10x your output:
                  <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem' }}>
                    <li><strong>Automate Emails:</strong> Use LLMs to draft responses and summarize threads.</li>
                    <li><strong>Data Analysis:</strong> Upload Excel sheets to AI to find trends instantly.</li>
                    <li><strong>Code Assistance:</strong> Debug and write scripts faster with AI co-pilots.</li>
                  </ul>
                </>
              )}
          </p>
          <button className="btn btn-sm" style={{ marginTop: '1rem', backgroundColor: '#9C27B0' }} onClick={() => completeLesson('ai-ethics', 50)}>
            {isTeen ? 'Understand AI Bias' : 'Master Productivity Tools'}
          </button>
        </div>
      )}
    </div>
  );

  const renderCreativity = () => (
    <div>
      <h2 style={{ marginBottom: '1rem', color: '#FFD700' }}>🎨 Digital Creativity</h2>
      {isKid && (
        <div style={{ backgroundColor: 'rgba(255, 152, 0, 0.1)', padding: '1rem', borderRadius: '12px', border: '1px solid #FF9800', marginBottom: '2rem' }}>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#fff' }}>
            <strong>What is Digital Creativity?</strong> 🎨 It means using computers to <strong>paint with light</strong> and make <strong>music with math</strong>!
          </p>
        </div>
      )}

      {/* Pixel Art Section */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>{isAdult ? 'Digital Asset Creation' : 'Pixel Art Creator'}</h3>
        <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>
          {isKid ? 'Draw something beautiful for Africa!' : isTeen ? 'Create assets for your portfolio or game projects.' : 'Design and sell digital assets, icons, or UI kits.'}
        </p>
        <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
          <label style={{ marginRight: '0.5rem', display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center', marginBottom: '0.5rem' }}>Select Color:</label>
          {['#FFD700', '#ff4444', '#00C851', '#2196F3', '#fff', '#000'].map(color => (
            <button key={color} onClick={() => setSelectedColor(color)} style={{ width: '45px', height: '45px', backgroundColor: color, border: selectedColor === color ? '3px solid #fff' : '1px solid #444', borderRadius: '50%', cursor: 'pointer', flexShrink: 0, boxShadow: selectedColor === color ? '0 0 10px rgba(255,255,255,0.5)' : 'none', transition: 'all 0.2s' }}></button>
          ))}
        </div>
        <div style={{ overflowX: 'auto', maxWidth: '100%', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 20px)', gap: '1px', minWidth: '340px', justifyContent: 'center', backgroundColor: '#222', padding: '10px', borderRadius: '8px', margin: '0 auto' }}>
            {pixelGrid.map((row, i) => row.map((color, j) => (
              <div key={`${i}-${j}`} onClick={() => handlePixelClick(i, j)} style={{ width: '20px', height: '20px', backgroundColor: color, cursor: 'pointer', border: '0.5px solid #111' }}></div>
            )))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={clearCanvas} className="btn" style={{ flex: '1 1 150px', backgroundColor: '#222', color: '#aaa', border: '1px solid #444' }}>Clear Canvas</button>
          <button onClick={saveArt} className="btn" style={{ flex: '1 1 150px', backgroundColor: '#00C851' }}>
            {isAdult ? 'Mint as Digital Product (₦)' : 'Save Artwork 🎨'}
          </button>
        </div>
      </div>

      {/* Beat Maker / Sound Design */}
      <div className="card">
        <h3>{isTeen || isAdult ? 'Sound Engineering & Logic Beats' : 'Beat Maker 🎵'}</h3>
        <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>Use mathematical patterns to create rhythm and melody.</p>
        <div style={{ backgroundColor: '#111', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', overflowX: 'auto' }}>
          <div style={{ minWidth: '400px' }}>
            {beatPattern.map((beat, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                <span style={{ width: '25px', color: currentBeat === i && isPlaying ? '#FF9800' : '#444', fontSize: '0.8rem' }}>{i + 1}</span>
                <button onClick={() => toggleBeat(i, 'drum')} style={{ flex: 1, padding: '0.8rem', backgroundColor: beat.drum ? '#ff4444' : '#222', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{isKid ? '🥁' : 'KICK'}</button>
                <button onClick={() => toggleBeat(i, 'piano')} style={{ flex: 1, padding: '0.8rem', backgroundColor: beat.piano ? '#2196F3' : '#222', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{isKid ? '🎹' : 'SYNTH'}</button>
                <button onClick={() => toggleBeat(i, 'horn')} style={{ flex: 1, padding: '0.8rem', backgroundColor: beat.horn ? '#FFD700' : '#222', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{isKid ? '🎺' : 'GLITCH'}</button>
              </div>
            ))}
          </div>
        </div>
        <button onClick={playBeat} disabled={isPlaying} className="btn" style={{ backgroundColor: '#FF9800', width: '100%' }}>
          {isPlaying ? 'Synthesizing...' : 'Play Sequence ▶'}
        </button>
      </div>

      {isAdult && (
        <div className="card" style={{ marginTop: '2rem', border: '1px solid #FF9800', background: 'rgba(255, 152, 0, 0.05)' }}>
          <h4 style={{ color: '#FF9800', marginTop: 0 }}>Monetizing Creativity</h4>
          <p style={{ fontSize: '0.9rem', color: '#aaa' }}>Don't just create for fun. Sell your beats and assets on marketplaces like AudioJungle, Unity Asset Store, or Envato.</p>
          <button className="btn btn-sm" style={{ backgroundColor: '#FF9800' }} onClick={() => completeLesson('creativity-market', 60)}>The Business of Art</button>
        </div>
      )}
    </div>
  );

  const renderRobotics = () => (
    <div>
      <h2 style={{ marginBottom: '1rem', color: '#FFD700' }}>🤖 {isKid ? 'Robotics: Build a Friend' : 'Robotics & Automation Engineering'}</h2>
      {isKid && (
        <div style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', padding: '1rem', borderRadius: '12px', border: '1px solid #4CAF50', marginBottom: '2rem' }}>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#fff' }}>
            <strong>What are Robots?</strong> 🤖 Robots are machines that can <strong>move</strong> and help us with hard work. You can build one!
          </p>
        </div>
      )}

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>{isKid ? 'Build a Robot' : 'System Integration: Mechanical & Logic'}</h3>
        <p style={{ marginBottom: '1.5rem', color: '#aaa' }}>
          {isKid ? 'Click to add robot parts!' : 'Verify the integrity of your robotic system by integrating all hardware modules.'}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {Object.keys(robotParts).map(part => (
            <button key={part} onClick={() => toggleRobotPart(part)} className="btn" style={{ backgroundColor: robotParts[part] ? '#00C851' : '#222', padding: '1.5rem', border: '1px solid #444', transition: 'all 0.3s' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>
                {part === 'brain' && '🧠'} {part === 'eyes' && '👀'} {part === 'wheels' && '🛞'} {part === 'arms' && '🦾'}
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{part.toUpperCase()}</span>
            </button>
          ))}
        </div>
        {Object.values(robotParts).every(v => v) && (
          <div style={{ padding: '1rem', backgroundColor: 'rgba(0, 200, 81, 0.1)', borderRadius: '8px', border: '1px solid #00C851', textAlign: 'center' }}>
            <p style={{ color: '#00C851', fontSize: '1.2rem', margin: 0 }}>✅ {isKid ? 'Robot Complete! Yay!' : 'System Online: All Components Synced'}</p>
          </div>
        )}
      </div>

      <div className="card">
        <h3>{isAdult ? 'Industrial IoT & Automation' : isTeen ? 'Sensor & Feedback Loops' : 'Sensor Simulator'}</h3>
        <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>
          {isKid ? 'Light sensor moves the robot forward!' : 'Simulate real-time input data to trigger mechanical responses (Actuators).'}
        </p>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => toggleSensor('light')} className="btn btn-sm" style={{ flex: 1, backgroundColor: sensorActive.light ? '#FFD700' : '#222', color: sensorActive.light ? '#000' : '#888', border: '1px solid #444' }}>💡 PHOTO-RESISTOR</button>
            <button onClick={() => toggleSensor('sound')} className="btn btn-sm" style={{ flex: 1, backgroundColor: sensorActive.sound ? '#2196F3' : '#222', color: sensorActive.sound ? '#fff' : '#888', border: '1px solid #444' }}>🔊 ACOUSTIC SENSOR</button>
            <button onClick={() => toggleSensor('touch')} className="btn btn-sm" style={{ flex: 1, backgroundColor: sensorActive.touch ? '#ff4444' : '#222', color: sensorActive.touch ? '#fff' : '#888', border: '1px solid #444' }}>👆 TACTILE SWITCH</button>
          </div>
          <div style={{ position: 'relative', height: '100px', backgroundColor: '#000', borderRadius: '12px', border: '1px solid #333', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', left: `${robotX}%`, top: '25px', fontSize: '3rem', transition: 'left 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}>🤖</div>
            {/* Floor indicators */}
            <div style={{ position: 'absolute', bottom: 0, width: '100%', height: '5px', background: 'repeating-linear-gradient(90deg, #333, #333 20px, #111 20px, #111 40px)' }}></div>
          </div>
        </div>
        {isAdult && (
          <div style={{ padding: '1rem', background: '#111', borderRadius: '8px', fontSize: '0.85rem' }}>
            <p style={{ color: '#aaa', margin: 0 }}><strong>Pro Tip:</strong> In a real factory (Smart Farming or Logistics), these sensors coordinate thousands of moves an hour to maximize yield.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderProblemSolving = () => (
    <div>
      <h2 style={{ marginBottom: '1rem', color: '#FFD700' }}>🧩 {isKid ? 'Problem Solving' : 'Critical Analysis & Troubleshooting'}</h2>
      {isKid && (
        <div style={{ backgroundColor: 'rgba(255, 215, 0, 0.1)', padding: '1rem', borderRadius: '12px', border: '1px solid #FFD700', marginBottom: '2rem' }}>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#fff' }}>
            <strong>What is Logic?</strong> 🧩 Logic is like being a <strong>detective</strong>. You use what you know to solve puzzles!
          </p>
        </div>
      )}

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>{isKid ? 'Logic Puzzles' : isTeen ? 'Deductive Logic Gates' : 'Systems Architecture Logic'}</h3>
        {currentPuzzle < logicPuzzles.length && (
          <>
            <div style={{ backgroundColor: '#1e1e1e', padding: '2rem', borderRadius: '12px', marginBottom: '1.5rem', borderLeft: '4px solid #FFD700' }}>
              <p style={{ fontSize: '1.1rem', color: '#eee' }}>{logicPuzzles[currentPuzzle].q}</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => handlePuzzleAnswer('yes')} className="btn" style={{ flex: '1 1 100px', backgroundColor: '#333', border: '1px solid #00C851', color: '#00C851' }}>TRUE / YES</button>
              <button onClick={() => handlePuzzleAnswer('no')} className="btn" style={{ flex: '1 1 100px', backgroundColor: '#333', border: '1px solid #ff4444', color: '#ff4444' }}>FALSE / NO</button>
              <button onClick={() => handlePuzzleAnswer('maybe')} className="btn" style={{ flex: '1 1 140px', backgroundColor: '#333', border: '1px solid #FFD700', color: '#FFD700' }}>INDETERMINATE</button>
            </div>
            {puzzleFeedback && <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '1.1rem', fontWeight: 'bold' }}>{puzzleFeedback}</p>}
          </>
        )}
      </div>

      <div className="card">
        <h3>{isKid ? 'Fix the Mistake 🛠️' : 'Technical Troubleshooting'}</h3>
        <p style={{ marginBottom: '1rem', color: '#aaa' }}>
          {isKid ? 'Fix the broken code!' : 'Identify the syntax/logic error in the following snippet to restore functionality.'}
        </p>
        <div style={{ backgroundColor: '#000', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #333' }}>
          <code style={{ display: 'block', marginBottom: '0.5rem', color: '#6a9955' }}>// Function to print greeting</code>
          <input type="text" value={debugCode} onChange={(e) => setDebugCode(e.target.value)} style={{ width: '100%', backgroundColor: 'transparent', color: '#ce9178', border: 'none', padding: '0', fontFamily: 'monospace', fontSize: '1.1rem', outline: 'none' }} />
        </div>
        <button onClick={checkDebug} className="btn" style={{ backgroundColor: '#2196F3', width: '100%' }}>RESTORE SYSTEM 🛠️</button>
        {debugFeedback && <p style={{ marginTop: '1rem', textAlign: 'center' }}>{debugFeedback}</p>}
      </div>
    </div>
  );

  const renderCareers = () => (
    <div>
      <h2 style={{ marginBottom: '2rem', color: '#FFD700' }}>💼 {isAdult ? 'Digital Economy & Careers' : 'Tech Career Pathways'}</h2>

      <div className="card" style={{ marginBottom: '2rem', background: isAdult ? 'linear-gradient(135deg, #2c3e50 0%, #000000 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: isAdult ? '1px solid #FFD700' : 'none' }}>
        <h3 style={{ marginTop: 0 }}>{isKid ? 'Dream Big!' : isTeen ? 'Build Your Professional Future' : 'Income & Financial Freedom'}</h3>
        <ul style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
          <li>💰 <strong>Earnings</strong>: {isKid ? 'Earn rewards while learning!' : isTeen ? 'Start with internships at $500/mo, grow to $10k+/mo.' : 'Scale your income with high-value technical skills.'}</li>
          <li>🌍 <strong>Remote Work</strong>: Work for companies in Lagos, London, or NYC from your bedroom.</li>
          {isAdult && <li>📈 <strong>SaaS & Products</strong>: Passive income through digital assets.</li>}
          <li>🇳🇬 <strong>Local Impact</strong>: Solve African problems with code.</li>
        </ul>
      </div>

      {!isKid && (
        <div className="card" style={{ marginBottom: '2rem', backgroundColor: '#111', border: '1px solid #333' }}>
          <h3>{isAdult ? 'Professional Freelancing' : 'Portfolio Strategy'}</h3>
          <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>
            {isTeen
              ? 'GitHub and LinkedIn are your new resume. Start contributing to open source today.'
              : 'Upwork and Fiverr allow you to compete globally. Learn how to bid and win high-paying contracts.'}
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-sm" style={{ flex: '1 1 150px', backgroundColor: '#333' }} onClick={() => completeLesson('career-strategy', 40)}>
              {isTeen ? 'Setup GitHub' : 'Optimize Profile'}
            </button>
            <button className="btn btn-sm" style={{ flex: '1 1 150px', backgroundColor: '#333' }} onClick={() => completeLesson('career-resume', 40)}>
              {isTeen ? 'Write Dev Portfolio' : 'Bid Strategy'}
            </button>
          </div>
        </div>
      )}

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3>Top In-Demand Roles</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {[
            { title: 'Software Engineer', icon: '💻', salary: '$60k-$120k', skills: isKid ? 'Coding' : 'React, Node.js, SQL' },
            { title: 'Cybersecurity Analyst', icon: '🔒', salary: '$80k-$150k', skills: isKid ? 'Safety' : 'Network Security, Pentesting' },
            { title: 'UX Designer', icon: '🎨', salary: '$50k-$100k', skills: isKid ? 'Art' : 'Figma, User Research' },
            { title: 'Cloud Architect', icon: '☁️', salary: '$100k-$180k', skills: isKid ? 'Servers' : 'AWS, Docker, Azure' },
          ].map(career => (
            <div key={career.title} style={{ backgroundColor: '#1a1a1a', padding: '1.5rem', borderRadius: '12px', border: '1px solid #222' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{career.icon}</div>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>{career.title}</h4>
              <p style={{ color: '#00C851', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>{career.salary}/year</p>
              <p style={{ fontSize: '0.8rem', color: '#888', margin: 0 }}>Required: {career.skills}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Success Stories</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { name: 'Iyinoluwa Aboyeji', company: 'Andela & Flutterwave', story: 'Co-founded two African unicorns worth billions.' },
            { name: 'Odunayo Eweniyi', company: 'PiggyVest', story: 'Youngest woman to build a tech fintech for millions of Africans.' },
          ].map(person => (
            <div key={person.name} style={{ backgroundColor: '#222', padding: '1.5rem', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#FFD700' }}>{person.name}</h4>
              <p style={{ margin: 0, color: '#aaa', fontSize: '0.9rem' }}>{person.story}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <button onClick={() => navigate('/')} style={{ background: 'none', color: 'var(--color-primary)', fontSize: '1.2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        ← Back to Hub
      </button>

      <header style={{ marginBottom: '2rem', textAlign: 'center', width: '100%', maxWidth: '900px', margin: '0 auto 3rem auto' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 8vw, 2.5rem)', color: 'var(--color-accent)', textTransform: isKid ? 'none' : 'uppercase', letterSpacing: isKid ? 'normal' : '2px', lineHeight: 1.2 }}>
          {isKid ? 'Tech & Digital 💻' : 'Technical & Digital Ecosystem'}
        </h1>
        <p style={{ fontSize: 'clamp(1rem, 4vw, 1.2rem)', color: 'var(--color-text-muted)', maxWidth: '750px', margin: '1rem auto 2rem auto', lineHeight: 1.6 }}>
          {isKid ? 'Build Your Tech Career!' : isTeen ? 'Engineering the future with advanced technical skills.' : 'Harnessing technology for economic mobility and professional impact.'}
        </p>

        <div style={{ maxWidth: '500px', margin: '0 auto 2.5rem auto', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Tech Points:</span>
            <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.2rem' }}>{techPoints}</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666', textAlign: 'left' }}>
            Completed: {completedLessons.length} Modules
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', padding: '0 0.5rem' }}>
          {[
            { id: 'coding', label: '💻 Coding', color: '#2196F3' },
            { id: 'cybersecurity', label: '🔒 Security', color: '#ff4444' },
            { id: 'ai', label: '🧠 AI', color: '#9C27B0' },
            { id: 'creativity', label: '🎨 Create', color: '#FF9800' },
            { id: 'robotics', label: '🤖 Robots', color: '#00C851' },
            { id: 'logic', label: '🧩 Logic', color: '#FFD700' },
            { id: 'careers', label: '💼 Careers', color: '#E91E63' },
          ].map(tab => (
            <button key={tab.id} className="btn" style={{
              padding: '0.6rem 1.2rem',
              fontSize: '0.85rem',
              backgroundColor: activeTab === tab.id ? tab.color : 'rgba(255,255,255,0.02)',
              border: `1.5px solid ${tab.color}`,
              color: activeTab === tab.id ? '#000' : tab.color,
              flex: '1 1 auto',
              minWidth: '100px',
              maxWidth: '150px'
            }} onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'coding' && renderCoding()}
      {activeTab === 'cybersecurity' && renderCybersecurity()}
      {activeTab === 'ai' && renderAI()}
      {activeTab === 'creativity' && renderCreativity()}
      {activeTab === 'robotics' && renderRobotics()}
      {activeTab === 'logic' && renderProblemSolving()}
      {activeTab === 'careers' && renderCareers()}
    </div>
  );
};

export default Tech;
