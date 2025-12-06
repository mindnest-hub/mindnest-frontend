import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';

const Finance = ({ ageGroup }) => {
  const navigate = useNavigate();
  const { balance, moduleBalances, moduleEarnings, addEarnings, deductPenalty, getModuleCap, WITHDRAWAL_LIMIT, setModuleBalance } = useWallet();
  const MODULE_CAP = getModuleCap('finance');

  const isKid = ageGroup === 'kids' || ageGroup === 'Kids';
  const isTeen = ageGroup === 'teens' || ageGroup === 'Teens';
  const isAdult = !isKid && !isTeen;

  const [expandedModule, setExpandedModule] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // --- LEARN-TO-EARN STATE ---
  const [currentLevel, setCurrentLevel] = useState(() => {
    return Number(localStorage.getItem('financeLevel')) || 1;
  });
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('idle'); // idle, verifying, success, failed
  const [attempts, setAttempts] = useState(0);
  const [showCertificate, setShowCertificate] = useState(false);

  // --- CERTIFICATE STATE ---
  const [userName, setUserName] = useState("");
  const [userCountry, setUserCountry] = useState("");
  const [userNameInput, setUserNameInput] = useState("");
  const [userCountryInput, setUserCountryInput] = useState("");

  useEffect(() => {
    localStorage.setItem('financeLevel', currentLevel);
  }, [currentLevel]);

  // --- GAME STATE ---
  const [budget, setBudget] = useState(0);
  const [savings, setSavings] = useState(0);
  const [needs, setNeeds] = useState(0);
  const [wants, setWants] = useState(0);
  const [showResult, setShowResult] = useState(false);

  // --- INVESTMENT SIMULATOR ---
  const [investAmount, setInvestAmount] = useState(1000);
  const [selectedAsset, setSelectedAsset] = useState('bond');
  const [simulationResult, setSimulationResult] = useState(null);

  // --- ASSET CHAT STATE ---
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: "Welcome to the Wealth Clinic! 🏥 I'm Dr. Finance." },
    { sender: 'bot', text: "To pass this level, tell me 3 examples of ASSETS that put money in your pocket." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [foundAssets, setFoundAssets] = useState([]);

  // --- KIDS ENGAGEMENT STATE ---
  const [dreamGoal, setDreamGoal] = useState(() => localStorage.getItem('dreamGoal') || '');
  const [dreamCost, setDreamCost] = useState(() => Number(localStorage.getItem('dreamCost')) || 0);
  const [showGoalInput, setShowGoalInput] = useState(!localStorage.getItem('dreamGoal'));
  const [showDailyBonus, setShowDailyBonus] = useState(false);
  const [dailyFact, setDailyFact] = useState("");

  useEffect(() => {
    localStorage.setItem('dreamGoal', dreamGoal);
    localStorage.setItem('dreamCost', dreamCost);
  }, [dreamGoal, dreamCost]);

  // Daily Bonus Logic
  useEffect(() => {
    const lastLogin = localStorage.getItem('lastFinanceLogin');
    const today = new Date().toDateString();
    if (lastLogin !== today) {
      const facts = [
        "The cowrie shell was once used as money in Africa! 🐚",
        "Saving just ₦50 a day adds up to ₦18,250 in a year! 📅",
        "Compound interest is like a snowball rolling down a hill—it gets bigger and bigger! ❄️",
        "Mansa Musa of Mali was the richest man in history! 👑",
        "A 'Budget' is just a plan for your money. 📝"
      ];
      setDailyFact(facts[Math.floor(Math.random() * facts.length)]);
      setShowDailyBonus(true);
      addEarnings('finance', 50); // Bonus
      localStorage.setItem('lastFinanceLogin', today);
    }
  }, []);

  // --- ADULT TOOLS STATE ---
  const [loanPrincipal, setLoanPrincipal] = useState(0);
  const [loanRate, setLoanRate] = useState(0);
  const [loanTerm, setLoanTerm] = useState(0);
  const [loanPayment, setLoanPayment] = useState(null);

  const [retireAge, setRetireAge] = useState(60);
  const [currentAge, setCurrentAge] = useState(30);
  const [monthlySave, setMonthlySave] = useState(0);
  const [investDuration, setInvestDuration] = useState(10);
  const [standardResult, setStandardResult] = useState(null);
  const [partnerResult, setPartnerResult] = useState(null);

  // --- HELPERS ---

  // --- HELPERS ---
  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handlePenalty = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    if (newAttempts >= 3) {
      const penalty = 200;
      deductPenalty('finance', penalty);
      alert(`⚠️ 3 Wrong Attempts! A penalty of ₦${penalty} has been deducted from your Finance wallet.`);
      setAttempts(0);
    } else {
      alert(`❌ Wrong! Be careful. (${newAttempts}/3 attempts)`);
    }
  };

  const completeLevel = (levelId) => {
    if (levelId === currentLevel) {
      // Reward: ₦2000 / 15 ≈ ₦130
      const reward = 130;
      const result = addEarnings('finance', reward);

      if (result.success) {
        triggerConfetti();
        setCurrentLevel(prev => prev + 1);
        setAttempts(0);
      } else {
        alert(result.message);
        setCurrentLevel(prev => prev + 1); // Still advance even if capped
      }
    }
  };

  const toggleModule = (id) => {
    if (isAdult || id <= currentLevel) {
      setExpandedModule(expandedModule === id ? null : id);
    }
  };

  const handleInvest = () => {
    const financeBalance = moduleBalances.finance || 0;

    if (financeBalance < investAmount) {
      alert(`Insufficient funds in Finance Wallet (₦${financeBalance})! You cannot invest what you don't have.`);
      return;
    }

    // Deduct investment capital
    setModuleBalance('finance', financeBalance - investAmount);

    let returnRate = 0;
    let message = "";
    let outcome = "";

    // RNG for Market Conditions
    const marketMood = Math.random(); // 0.0 to 1.0

    if (selectedAsset === 'bond') {
      // Low Risk: 5-10% return. Always positive.
      returnRate = 0.05 + (Math.random() * 0.05);
      outcome = "Steady Growth 🟢";
      message = "Government Bonds are safe and reliable.";
    } else if (selectedAsset === 'agri') {
      // Medium Risk: -5% to +20%
      if (marketMood < 0.2) { // 20% chance of bad harvest
        returnRate = -0.05;
        outcome = "Bad Harvest 📉";
        message = "Drought affected the crops.";
      } else {
        returnRate = 0.10 + (Math.random() * 0.10);
        outcome = "Bountiful Harvest 🌾";
        message = "The cooperative sold rice at a premium!";
      }
    } else if (selectedAsset === 'tech') {
      // High Risk: -50% to +200%
      if (marketMood < 0.4) { // 40% chance of failure
        returnRate = -0.50;
        outcome = "Crash 💥";
        message = "The startup failed to find product-market fit.";
      } else if (marketMood > 0.9) { // 10% chance of unicorn
        returnRate = 2.0;
        outcome = "To The Moon! 🚀";
        message = "The startup got acquired by a global tech giant!";
      } else {
        returnRate = 0.20; // Decent growth
        outcome = "Growth 📈";
        message = "User base is growing steadily.";
      }
    }

    const finalValue = Math.round(investAmount * (1 + returnRate));
    const profit = finalValue - investAmount;

    // Update Balance with Returns
    // We need to get the *latest* balance because we just deducted. 
    // Since state updates are async, we calculate based on what we know: (oldBalance - invest) + finalValue
    const newBalance = (financeBalance - investAmount) + finalValue;
    setModuleBalance('finance', newBalance);

    setSimulationResult({
      outcome,
      message,
      initial: investAmount,
      final: finalValue,
      profit
    });

    if (currentLevel === 7) completeLevel(7);
  };

  const handleChatSubmit = () => {
    if (!chatInput.trim()) return;

    const userMsg = { sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);

    const lowerInput = chatInput.toLowerCase();
    const validAssets = ['house', 'land', 'real estate', 'stock', 'bond', 'business', 'gold', 'farm', 'shop', 'company', 'rental', 'apartment', 'crypto', 'bitcoin', 'ethereum'];

    let botResponse = "";
    let newFound = [...foundAssets];

    // Simple keyword matching
    const matchedAsset = validAssets.find(asset => lowerInput.includes(asset));

    if (matchedAsset) {
      // Check if we already found this specific type (to avoid "land" and "farmland" cheating, though simple check is fine for now)
      if (newFound.includes(matchedAsset)) {
        botResponse = "You already mentioned that type of asset! Give me a different one.";
      } else {
        newFound.push(matchedAsset);
        setFoundAssets(newFound);
        botResponse = `Correct! ✅ "${chatInput}" is a great asset. (${newFound.length}/3)`;
      }
    } else {
      botResponse = `Hmm, "${chatInput}" sounds more like a liability (money out) or I don't recognize it. Remember: Assets put money IN your pocket. Try things like 'Business' or 'Land'.`;
    }

    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);
      if (newFound.length === 3) {
        setTimeout(() => {
          setChatMessages(prev => [...prev, { sender: 'bot', text: "🎉 Amazing! You know your assets. Level Complete!" }]);
          if (currentLevel === 12) completeLevel(12);
        }, 1000);
      }
    }, 500);

    setChatInput("");
  };

  // --- MODULE CONTENT ---
  const modules = [
    {
      id: 1,
      title: "Money Basics 💰",
      desc: "What is money?",
      content: (
        <div>
          <p>Money is a tool to trade value. You earn it by solving problems.</p>
          <button onClick={() => completeLevel(1)} className="btn btn-sm" style={{ marginTop: '1rem' }} disabled={currentLevel > 1}>
            {currentLevel > 1 ? "Completed ✅" : "I Understand! (+₦130)"}
          </button>
        </div>
      )
    },
    {
      id: 2,
      title: "The Savings Jar 🏺",
      desc: "Pay yourself first.",
      content: (
        <div>
          <p>Save at least 20% of everything you earn.</p>
          <button onClick={() => completeLevel(2)} className="btn btn-sm" style={{ marginTop: '1rem' }} disabled={currentLevel > 2}>
            {currentLevel > 2 ? "Completed ✅" : "I Promise to Save! (+₦130)"}
          </button>
        </div>
      )
    },
    {
      id: 3,
      title: "Budgeting Boss 📊",
      desc: "Needs vs Wants.",
      content: (
        <div>
          <p><strong>50/30/20 Rule:</strong> 50% Needs, 30% Wants, 20% Savings.</p>
          <div style={{ backgroundColor: '#333', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
            <h4>Budget Calculator</h4>
            <input type="number" placeholder="Enter Allowance (₦)" onChange={(e) => setBudget(Number(e.target.value))} style={{ padding: '0.5rem', width: '100%', marginBottom: '0.5rem' }} />
            <button className="btn btn-sm" onClick={() => {
              if (budget <= 0) { handlePenalty(); return; }
              setSavings(budget * 0.2);
              setNeeds(budget * 0.5);
              setWants(budget * 0.3);
              setShowResult(true);
              if (currentLevel === 3) completeLevel(3);
            }}>Calculate</button>
            {showResult && (
              <div style={{ marginTop: '0.5rem' }}>
                <p>Save: ₦{savings}</p>
                <p>Needs: ₦{needs}</p>
                <p>Wants: ₦{wants}</p>
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Smart Spending 🛒",
      desc: "Compare before you buy.",
      content: (
        <div>
          <p>Always check prices at different shops. Buying in bulk can save money!</p>
          <button onClick={() => completeLevel(4)} className="btn btn-sm" style={{ marginTop: '1rem' }} disabled={currentLevel > 4}>
            {currentLevel > 4 ? "Completed ✅" : "I'm a Smart Shopper! (+₦130)"}
          </button>
        </div>
      )
    },
    {
      id: 5,
      title: "Bank Accounts 🏦",
      desc: "Where to keep money safe.",
      content: (
        <div>
          <p>Banks keep your money safe and pay you interest. Don't keep all your cash under the mattress!</p>
          <button onClick={() => completeLevel(5)} className="btn btn-sm" style={{ marginTop: '1rem' }} disabled={currentLevel > 5}>
            {currentLevel > 5 ? "Completed ✅" : "Open Account (+₦130)"}
          </button>
        </div>
      )
    },
    {
      id: 6,
      title: "Earning Power ⚡",
      desc: "Skills = Money.",
      content: (
        <div>
          <p>The more you learn, the more you earn. Your skills are your biggest asset.</p>
          <button onClick={() => completeLevel(6)} className="btn btn-sm" style={{ marginTop: '1rem' }} disabled={currentLevel > 6}>
            {currentLevel > 6 ? "Completed ✅" : "Level Up Skills (+₦130)"}
          </button>
        </div>
      )
    },
    {
      id: 7,
      title: "Investing 101 📈",
      desc: "Make money work for you.",
      content: (
        <div>
          <p>Compound interest is the 8th wonder of the world. But remember: <strong>Higher Risk = Higher Reward (and potential Loss).</strong></p>
          <div style={{ backgroundColor: '#2c2c2c', padding: '1.5rem', borderRadius: '15px', marginTop: '1rem', border: '1px solid var(--color-primary)' }}>
            <h4 style={{ color: 'var(--color-primary)', marginTop: 0 }}>Investment Simulator 🎰</h4>
            <p style={{ fontSize: '0.9rem', color: '#aaa' }}>Test your strategy. Can you grow your wealth?</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
              <button
                onClick={() => setSelectedAsset('bond')}
                style={{
                  padding: '0.5rem', borderRadius: '8px', border: selectedAsset === 'bond' ? '2px solid #00C851' : '1px solid #555',
                  backgroundColor: selectedAsset === 'bond' ? 'rgba(0,200,81,0.2)' : 'transparent', color: 'white', cursor: 'pointer'
                }}
              >
                🏛️ Govt Bond<br /><span style={{ fontSize: '0.7rem' }}>Low Risk (5-10%)</span>
              </button>
              <button
                onClick={() => setSelectedAsset('agri')}
                style={{
                  padding: '0.5rem', borderRadius: '8px', border: selectedAsset === 'agri' ? '2px solid #FFBB33' : '1px solid #555',
                  backgroundColor: selectedAsset === 'agri' ? 'rgba(255,187,51,0.2)' : 'transparent', color: 'white', cursor: 'pointer'
                }}
              >
                🌾 Agri-Coop<br /><span style={{ fontSize: '0.7rem' }}>Med Risk (-5% to +20%)</span>
              </button>
              <button
                onClick={() => setSelectedAsset('tech')}
                style={{
                  padding: '0.5rem', borderRadius: '8px', border: selectedAsset === 'tech' ? '2px solid #ff4444' : '1px solid #555',
                  backgroundColor: selectedAsset === 'tech' ? 'rgba(255,68,68,0.2)' : 'transparent', color: 'white', cursor: 'pointer'
                }}
              >
                💻 Tech Startup<br /><span style={{ fontSize: '0.7rem' }}>High Risk (-50% to +200%)</span>
              </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Amount to Invest (₦):</label>
              <input
                type="number"
                value={investAmount}
                onChange={(e) => setInvestAmount(Number(e.target.value))}
                style={{ padding: '0.5rem', borderRadius: '5px', border: 'none', width: '100%', maxWidth: '200px' }}
              />
            </div>

            <button className="btn" onClick={() => {
              handleInvest();
              if (currentLevel === 7) completeLevel(7);
            }} style={{ width: '100%', backgroundColor: 'var(--color-primary)', color: 'black', fontWeight: 'bold' }}>
              Simulate 1 Year ⏳
            </button>

            {simulationResult && (
              <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px', animation: 'fadeIn 0.5s' }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{simulationResult.outcome}</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{simulationResult.message}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                  <span>Invested: ₦{simulationResult.initial}</span>
                  <span style={{ color: simulationResult.profit >= 0 ? '#00C851' : '#ff4444' }}>
                    {simulationResult.profit >= 0 ? '+' : ''}₦{simulationResult.profit}
                  </span>
                </div>
                <p style={{ marginTop: '0.5rem', textAlign: 'right', fontSize: '0.8rem' }}>Final Value: ₦{simulationResult.final}</p>
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: "Risk & Reward ⚖️",
      desc: "Balancing act.",
      content: (
        <div>
          <p>High reward usually comes with high risk. Never invest money you can't afford to lose!</p>
          <button onClick={() => completeLevel(8)} className="btn btn-sm" style={{ marginTop: '1rem' }} disabled={currentLevel > 8}>
            {currentLevel > 8 ? "Completed ✅" : "Got it! (+₦130)"}
          </button>
        </div>
      )
    },
    {
      id: 9,
      title: "Good Debt vs Bad Debt 💳",
      desc: "Not all debt is bad.",
      content: (
        <div>
          <p><strong>Good Debt:</strong> Borrowing to buy a farm (makes money). <br /><strong>Bad Debt:</strong> Borrowing to buy candy (eaten and gone).</p>
          <button onClick={() => completeLevel(9)} className="btn btn-sm" style={{ marginTop: '1rem' }} disabled={currentLevel > 9}>
            {currentLevel > 9 ? "Completed ✅" : "I'll be Careful! (+₦130)"}
          </button>
        </div>
      )
    },
    {
      id: 10,
      title: "Insurance 🛡️",
      desc: "Protection for rainy days.",
      content: (
        <div>
          <p>Insurance protects you from big losses. It's like an umbrella for your money.</p>
          <button onClick={() => completeLevel(10)} className="btn btn-sm" style={{ marginTop: '1rem' }} disabled={currentLevel > 10}>
            {currentLevel > 10 ? "Completed ✅" : "Stay Protected! (+₦130)"}
          </button>
        </div>
      )
    },
    {
      id: 11,
      title: "Scam Buster 🕵️‍♂️",
      desc: "Spot the fakes.",
      content: (
        <div>
          <p>The future of money is digital. Be safe!</p>
          <div style={{ backgroundColor: '#333', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
            <h4>Scam Detector Quiz</h4>
            <p>Scenario: "Send me your PIN to win ₦50k!"</p>
            <button className="btn btn-sm" style={{ marginRight: '0.5rem', backgroundColor: '#ff4444' }} onClick={() => {
              if (currentLevel === 11) completeLevel(11);
              else alert("Correct! But you already completed this level.");
            }}>Scam! ❌</button>
            <button className="btn btn-sm" style={{ backgroundColor: '#00C851' }} onClick={() => handlePenalty()}>Safe ✅</button>
          </div>
        </div>
      )
    },
    {
      id: 12,
      title: "Real Wealth 🏡",
      desc: "Assets vs Liabilities.",
      content: (
        <div>
          <p>Assets put money in your pocket. Liabilities take it out.</p>
          <div style={{
            border: '2px solid #00C851', borderRadius: '10px', overflow: 'hidden',
            backgroundColor: '#f9f9f9', marginTop: '1rem', display: 'flex', flexDirection: 'column'
          }}>
            {/* Chat Area */}
            <div style={{ height: '200px', overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.sender === 'user' ? '#00C851' : '#e0e0e0',
                  color: msg.sender === 'user' ? 'white' : 'black',
                  padding: '0.5rem 1rem', borderRadius: '15px', maxWidth: '80%'
                }}>
                  {msg.text}
                </div>
              ))}
            </div>
            {/* Input Area */}
            <div style={{ display: 'flex', borderTop: '1px solid #ccc' }}>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                placeholder="Type an asset..."
                disabled={foundAssets.length >= 3}
                style={{ flex: 1, padding: '1rem', border: 'none', outline: 'none' }}
              />
              <button
                onClick={handleChatSubmit}
                disabled={foundAssets.length >= 3}
                style={{
                  backgroundColor: '#00C851', color: 'white', border: 'none', padding: '0 1.5rem', cursor: 'pointer', fontWeight: 'bold'
                }}
              >
                Send
              </button>
            </div>
          </div>
          {foundAssets.length >= 3 && (
            <p style={{ color: '#00C851', fontWeight: 'bold', marginTop: '0.5rem' }}>Level Completed! ✅</p>
          )}
        </div>
      )
    },
    {
      id: 13,
      title: "Financial Freedom 🕊️",
      desc: "The ultimate goal.",
      content: (
        <div>
          <p>Freedom means doing what you want, when you want.</p>
          <button onClick={() => completeLevel(13)} className="btn btn-sm" style={{ marginTop: '1rem' }} disabled={currentLevel > 13}>
            {currentLevel > 13 ? "Completed ✅" : "Claim Final Reward! (+₦130)"}
          </button>
        </div>
      )
    },
    {
      id: 14,
      title: "The Community Pot 🍲",
      desc: "Why we pay taxes.",
      content: (
        <div>
          <p>Taxes are like a big pot where everyone puts a little money. We use this pot to buy things we all need, like roads, schools, and hospitals.</p>
          <button onClick={() => completeLevel(14)} className="btn btn-sm" style={{ marginTop: '1rem' }} disabled={currentLevel > 14}>
            {currentLevel > 14 ? "Completed ✅" : "I Contribute! (+₦130)"}
          </button>
        </div>
      )
    },
    {
      id: 15,
      title: "Risk Management Strategies 🛡️",
      desc: "Protecting your wealth.",
      content: (
        <div>
          <p>Don't put all your eggs in one basket. Diversify your investments to stay safe!</p>
          <button onClick={() => completeLevel(15)} className="btn btn-sm" style={{ marginTop: '1rem' }} disabled={currentLevel > 15}>
            {currentLevel > 15 ? "Completed ✅" : "I'm Safe! (+₦130)"}
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      {/* CONFETTI */}
      {showConfetti && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999,
          background: 'radial-gradient(circle, transparent 20%, transparent 20%, transparent 80%, transparent 80%, transparent 100%), radial-gradient(circle, transparent 20%, transparent 20%, transparent 80%, transparent 80%, transparent 100%)',
          backgroundSize: '10px 10px',
          animation: 'confetti 1s infinite'
        }}></div>
      )}
      <style>{`
                @keyframes confetti {
                    0% { background-position: 0 0, 10px 10px; opacity: 1; }
                    100% { background-position: 0 100px, 10px 110px; opacity: 0; }
                }
            `}</style>

      <button
        onClick={() => navigate('/')}
        style={{
          background: 'none', color: 'var(--color-primary)', fontSize: '1.2rem', marginBottom: '2rem',
          display: 'flex', alignItems: 'center', gap: '0.5rem'
        }}
      >
        ← Back to Hub
      </button>

      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--color-primary)' }}>
          {isKid || isTeen ? "Path to Wealth 🚀" : "Financial Literacy 💰"}
        </h1>
        <p style={{ fontSize: '1.5rem', color: 'var(--color-text-muted)' }}>
          {isKid || isTeen ? "Level Up & Earn Real Cash!" : "Master the Rules of Money"}
        </p>
        <div style={{ display: 'inline-block', padding: '0.5rem 1rem', border: '1px solid var(--color-primary)', borderRadius: '20px', marginTop: '1rem', color: 'var(--color-primary)' }}>
          Mode: {ageGroup || 'Adults'}
        </div>
      </header>
      {(isKid || isTeen) ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ padding: '0.5rem 1rem', border: '1px solid var(--color-secondary)', borderRadius: '20px', color: 'var(--color-secondary)' }}>
              Module Earning: ₦{moduleEarnings.finance || 0} / ₦{MODULE_CAP}
            </div>
            <div style={{ padding: '0.5rem 1rem', border: '1px solid var(--color-accent)', borderRadius: '20px', color: 'var(--color-accent)' }}>
              Finance Balance: ₦{moduleBalances.finance || 0}
            </div>
          </div>

          {/* DAILY BONUS MODAL */}
          {showDailyBonus && (
            <div style={{
              position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 11000, animation: 'fadeIn 0.5s'
            }}>
              <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '20px', maxWidth: '400px', textAlign: 'center', border: '4px solid #FFD700', boxShadow: '0 0 30px #FFD700' }}>
                <h2 style={{ fontSize: '2rem', margin: 0 }}>🌞 Daily Bonus!</h2>
                <p style={{ fontSize: '1.5rem', color: '#00C851', fontWeight: 'bold' }}>+₦50</p>
                <div style={{ backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '10px', margin: '1rem 0', fontStyle: 'italic' }}>
                  "Did you know? {dailyFact}"
                </div>
                <button onClick={() => setShowDailyBonus(false)} className="btn" style={{ backgroundColor: '#00C851', color: 'white', width: '100%' }}>Awesome! 🚀</button>
              </div>
            </div>
          )}

          {/* DREAM GOAL TRACKER */}
          <div style={{ backgroundColor: '#222', padding: '1.5rem', borderRadius: '20px', margin: '2rem 0', border: '1px solid #444' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#FFBB33' }}>🎯 My Dream Goal</h3>
              <button onClick={() => setShowGoalInput(!showGoalInput)} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }}>⚙️ Edit</button>
            </div>

            {showGoalInput ? (
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input type="text" placeholder="Goal (e.g. Bicycle)" value={dreamGoal} onChange={(e) => setDreamGoal(e.target.value)} style={{ flex: 2, padding: '0.5rem', borderRadius: '5px' }} />
                <input type="number" placeholder="Cost (₦)" value={dreamCost} onChange={(e) => setDreamCost(Number(e.target.value))} style={{ flex: 1, padding: '0.5rem', borderRadius: '5px' }} />
                <button onClick={() => setShowGoalInput(false)} className="btn btn-sm" style={{ backgroundColor: '#00C851' }}>Save</button>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ margin: '0 0 0.5rem 0' }}>{dreamGoal || "Set a Goal!"}</h2>
                <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Target: ₦{dreamCost.toLocaleString()}</p>
              </div>
            )}

            {/* Progress Bar */}
            <div style={{ width: '100%', height: '20px', backgroundColor: '#444', borderRadius: '10px', overflow: 'hidden', marginTop: '0.5rem' }}>
              <div style={{
                width: `${Math.min(((moduleBalances.finance || 0) / (dreamCost || 1)) * 100, 100)}%`,
                height: '100%',
                backgroundColor: (moduleBalances.finance || 0) >= dreamCost ? '#00C851' : '#FFBB33',
                transition: 'width 1s ease-in-out'
              }}></div>
            </div>
            <p style={{ textAlign: 'right', fontSize: '0.8rem', marginTop: '0.5rem', color: '#aaa' }}>
              {dreamCost > 0 ? `${Math.round(((moduleBalances.finance || 0) / dreamCost) * 100)}% Reached` : "0%"}
            </p>
          </div>

          {/* TROPHY CASE */}
          <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '2rem', backgroundColor: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '15px' }}>
            <div style={{ textAlign: 'center', opacity: currentLevel > 3 ? 1 : 0.3, filter: currentLevel > 3 ? 'none' : 'grayscale(1)' }}>
              <div style={{ fontSize: '2.5rem' }}>🥉</div>
              <p style={{ fontSize: '0.8rem', margin: 0 }}>Saver Scout</p>
            </div>
            <div style={{ textAlign: 'center', opacity: currentLevel > 7 ? 1 : 0.3, filter: currentLevel > 7 ? 'none' : 'grayscale(1)' }}>
              <div style={{ fontSize: '2.5rem' }}>🥈</div>
              <p style={{ fontSize: '0.8rem', margin: 0 }}>Smart Investor</p>
            </div>
            <div style={{ textAlign: 'center', opacity: currentLevel > 11 ? 1 : 0.3, filter: currentLevel > 11 ? 'none' : 'grayscale(1)' }}>
              <div style={{ fontSize: '2.5rem' }}>🥇</div>
              <p style={{ fontSize: '0.8rem', margin: 0 }}>Scam Buster</p>
            </div>
          </div>
          {/* WALLET CARD */}
          <div style={{
            background: 'linear-gradient(135deg, #00C851 0%, #007E33 100%)',
            padding: '1.5rem', borderRadius: '20px', color: 'white', marginBottom: '2rem',
            boxShadow: '0 10px 20px rgba(0,200,81,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Finance Wallet Balance</p>
              <h2 style={{ fontSize: '2.5rem', margin: 0 }}>₦{moduleBalances.finance || 0}</h2>
              <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>Goal: ₦{WITHDRAWAL_LIMIT}</p>
            </div>
            <button
              onClick={() => setShowWithdrawModal(true)}
              disabled={(moduleBalances.finance || 0) < WITHDRAWAL_LIMIT}
              style={{
                backgroundColor: 'white', color: '#007E33', border: 'none', padding: '0.8rem 1.5rem',
                borderRadius: '30px', fontWeight: 'bold', cursor: (moduleBalances.finance || 0) >= WITHDRAWAL_LIMIT ? 'pointer' : 'not-allowed',
                opacity: (moduleBalances.finance || 0) >= WITHDRAWAL_LIMIT ? 1 : 0.5
              }}
            >
              {(moduleBalances.finance || 0) >= WITHDRAWAL_LIMIT ? "Withdraw 🏦" : "Locked 🔒"}
            </button>
          </div>

          {/* WITHDRAW MODAL */}
          {
            showWithdrawModal && (
              <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)',
                display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000
              }}>
                <div style={{ backgroundColor: '#222', padding: '2rem', borderRadius: '20px', width: '90%', maxWidth: '400px', border: '2px solid #00C851', textAlign: 'center' }}>
                  <h2 style={{ color: '#00C851', marginTop: 0 }}>Withdraw ₦{WITHDRAWAL_LIMIT}</h2>

                  {!verificationStatus || verificationStatus === 'idle' ? (
                    <>
                      <p>To ensure secure transactions, we must verify your identity and academic records.</p>
                      <div style={{ backgroundColor: '#333', padding: '1rem', borderRadius: '10px', margin: '1rem 0', textAlign: 'left' }}>
                        <p style={{ margin: '0.5rem 0' }}>📋 <strong>Requirement 1:</strong> Finance Balance ≥ ₦{WITHDRAWAL_LIMIT} ✅</p>
                        <p style={{ margin: '0.5rem 0' }}>📜 <strong>Requirement 2:</strong> History Wallet ≥ ₦2,000 {moduleBalances.history >= 2000 ? '✅' : '❌'}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                          onClick={() => {
                            setVerificationStatus('verifying');
                            setTimeout(() => {
                              if ((moduleBalances.history || 0) >= 2000) {
                                setVerificationStatus('success');
                              } else {
                                setVerificationStatus('failed');
                              }
                            }, 3000);
                          }}
                          className="btn"
                          style={{ backgroundColor: '#00C851', flex: 1 }}
                        >
                          Start Verification 🕵️‍♂️
                        </button>
                        <button onClick={() => setShowWithdrawModal(false)} className="btn" style={{ backgroundColor: '#ff4444', flex: 1 }}>Cancel</button>
                      </div>
                    </>
                  ) : verificationStatus === 'verifying' ? (
                    <div style={{ padding: '2rem' }}>
                      <div className="spinner" style={{ width: '50px', height: '50px', border: '5px solid #333', borderTop: '5px solid #00C851', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
                      <p>Verifying Identity...</p>
                      <p style={{ fontSize: '0.8rem', color: '#aaa' }}>Checking History Module Records...</p>
                      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                    </div>
                  ) : verificationStatus === 'failed' ? (
                    <div>
                      <h3 style={{ color: '#ff4444' }}>Verification Failed ❌</h3>
                      <p>Your History Wallet balance is too low.</p>
                      <p>You need at least <strong>₦2,000</strong> in your History Wallet to prove you understand our roots before building wealth.</p>
                      <button onClick={() => setShowWithdrawModal(false)} className="btn" style={{ backgroundColor: '#333', marginTop: '1rem' }}>Close & Go Earn</button>
                    </div>
                  ) : (
                    // SUCCESS - SHOW FORM
                    <div style={{ animation: 'fadeIn 0.5s' }}>
                      <p style={{ color: '#00C851', fontWeight: 'bold' }}>Verification Successful! ✅</p>
                      <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Enter your Nigerian Bank Account details.</p>
                      <input type="text" placeholder="Bank Name (e.g. GTBank)" style={{ width: '100%', padding: '1rem', marginBottom: '1rem', borderRadius: '10px', border: 'none' }} />
                      <input type="text" placeholder="Account Number" style={{ width: '100%', padding: '1rem', marginBottom: '1rem', borderRadius: '10px', border: 'none' }} />
                      <input type="text" placeholder="Account Name" style={{ width: '100%', padding: '1rem', marginBottom: '1rem', borderRadius: '10px', border: 'none' }} />
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => alert("Withdrawal Request Sent! 🚀 (This is a demo)")} className="btn" style={{ backgroundColor: '#00C851', flex: 1 }}>Confirm</button>
                        <button onClick={() => setShowWithdrawModal(false)} className="btn" style={{ backgroundColor: '#ff4444', flex: 1 }}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          }

          {/* CERTIFICATE BUTTON */}
          {currentLevel > 14 && (
            <div style={{ textAlign: 'center', marginBottom: '2rem', animation: 'fadeIn 1s' }}>
              <h2 style={{ color: '#FFD700' }}>🎉 Congratulations! 🎉</h2>
              <p>You have mastered the Finance Module!</p>
              <button
                onClick={() => setShowCertificate(true)}
                className="btn"
                style={{
                  backgroundColor: '#FFD700', color: 'black', fontWeight: 'bold',
                  padding: '1rem 2rem', fontSize: '1.2rem', borderRadius: '30px',
                  boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)', border: 'none', cursor: 'pointer'
                }}
              >
                🎓 View Your Certificate
              </button>
            </div>
          )}

          {/* CERTIFICATE MODAL */}
          {showCertificate && (
            <div style={{
              position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.9)',
              display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10001
            }}>
              <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '10px', maxWidth: '600px', width: '90%', textAlign: 'center', color: 'black' }}>
                <h2 style={{ color: '#007E33', fontFamily: 'serif', fontSize: '2.5rem', marginBottom: '0.5rem' }}>Certificate of Completion</h2>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Awarded to</p>

                {/* INPUTS */}
                <div style={{ marginBottom: '2rem' }}>
                  <input
                    type="text"
                    placeholder="Enter Your Full Name"
                    value={userNameInput}
                    onChange={(e) => setUserNameInput(e.target.value)}
                    style={{ padding: '0.5rem', width: '70%', marginRight: '0.5rem', border: '1px solid #ccc', borderRadius: '5px' }}
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={userCountryInput}
                    onChange={(e) => setUserCountryInput(e.target.value)}
                    style={{ padding: '0.5rem', width: '25%', border: '1px solid #ccc', borderRadius: '5px' }}
                  />
                  <button
                    onClick={() => {
                      setUserName(userNameInput);
                      setUserCountry(userCountryInput);
                    }}
                    style={{ display: 'block', margin: '1rem auto', padding: '0.5rem 1rem', backgroundColor: '#007E33', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Update Name
                  </button>
                </div>

                {/* PREVIEW AREA */}
                <div id="certificate-preview" style={{
                  border: '10px solid #FFD700', padding: '2rem', position: 'relative',
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url("https://www.transparenttextures.com/patterns/cubes.png")',
                  marginBottom: '2rem'
                }}>
                  <h1 style={{ color: '#007E33', fontFamily: 'serif', margin: '1rem 0' }}>{userName || "Your Name Here"}</h1>
                  <p>Has successfully completed the</p>
                  <h3 style={{ color: '#000' }}>Financial Literacy Module</h3>
                  <p>at the African Education Hub</p>
                  <p style={{ marginTop: '2rem', fontWeight: 'bold' }}>{userCountry || "Africa"}</p>
                  <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
                    <span>Date: {new Date().toLocaleDateString()}</span>
                    <span>Signature: Dr. Finance</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button
                    onClick={() => {
                      const canvas = document.createElement('canvas');
                      canvas.width = 800;
                      canvas.height = 600;
                      const ctx = canvas.getContext('2d');

                      // Background
                      ctx.fillStyle = '#ffffff';
                      ctx.fillRect(0, 0, 800, 600);

                      // Border
                      ctx.strokeStyle = '#FFD700';
                      ctx.lineWidth = 20;
                      ctx.strokeRect(10, 10, 780, 580);

                      // Text
                      ctx.textAlign = 'center';
                      ctx.fillStyle = '#007E33';
                      ctx.font = 'bold 40px serif';
                      ctx.fillText('Certificate of Completion', 400, 100);

                      ctx.fillStyle = '#000000';
                      ctx.font = '20px sans-serif';
                      ctx.fillText('Awarded to', 400, 160);

                      ctx.fillStyle = '#007E33';
                      ctx.font = 'bold 60px serif';
                      ctx.fillText(userName || "Student", 400, 250);

                      ctx.fillStyle = '#000000';
                      ctx.font = '20px sans-serif';
                      ctx.fillText('For successfully completing the', 400, 320);

                      ctx.fillStyle = '#000000';
                      ctx.font = 'bold 30px sans-serif';
                      ctx.fillText('Financial Literacy Module', 400, 370);

                      ctx.font = '20px sans-serif';
                      ctx.fillText(`Country: ${userCountry || "Africa"}`, 400, 450);

                      ctx.font = 'italic 15px sans-serif';
                      ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, 400, 550);

                      // Download
                      const link = document.createElement('a');
                      link.download = 'Finance_Certificate.png';
                      link.href = canvas.toDataURL();
                      link.click();
                    }}
                    className="btn"
                    style={{ backgroundColor: '#007E33', color: 'white', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer' }}
                  >
                    Download Image 📥
                  </button>
                  <button onClick={() => setShowCertificate(false)} className="btn" style={{ backgroundColor: '#ff4444', color: 'white', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer' }}>Close</button>
                </div>
              </div>
            </div>
          )}

          {/* LEVELS LIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {modules.map((module) => {
              const isLocked = module.id > currentLevel;
              const isCompleted = module.id < currentLevel;
              return (
                <div
                  key={module.id}
                  className="card"
                  style={{
                    padding: '0', overflow: 'hidden',
                    borderLeft: isCompleted ? '4px solid #00C851' : (isLocked ? '4px solid #555' : '4px solid var(--color-primary)'),
                    opacity: isLocked ? 0.5 : 1,
                    filter: isLocked ? 'grayscale(1)' : 'none'
                  }}
                >
                  <div
                    onClick={() => !isLocked && toggleModule(module.id)}
                    style={{
                      padding: '1.5rem', cursor: isLocked ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      backgroundColor: expandedModule === module.id ? 'rgba(255,255,255,0.05)' : 'transparent'
                    }}
                  >
                    <div>
                      <h3 style={{ margin: 0, color: isCompleted ? '#00C851' : (isLocked ? '#888' : 'var(--color-primary)') }}>
                        {module.id}. {module.title} {isCompleted && '✅'} {isLocked && '🔒'}
                      </h3>
                      <p style={{ margin: '0.5rem 0 0 0', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>{module.desc}</p>
                    </div>
                    {!isLocked && <span style={{ fontSize: '1.5rem', transform: expandedModule === module.id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>}
                  </div>

                  {expandedModule === module.id && (
                    <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', animation: 'fadeIn 0.5s' }}>
                      {module.content}
                      {/* Fallback for modules without interactive buttons */}
                      {!module.content.props.children.some?.(child => child?.type === 'button' || child?.props?.children?.type === 'button') && (
                        <button onClick={() => completeLevel(module.id)} className="btn btn-sm" style={{ marginTop: '1rem' }} disabled={currentLevel > module.id}>
                          {currentLevel > module.id ? "Completed ✅" : "Mark as Done (+₦130)"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        // --- ADULT VIEW (Advanced Content & Tools) ---
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* FINANCIAL TOOLS SECTION */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* LOAN CALCULATOR */}
            <div style={{ backgroundColor: '#222', padding: '1.5rem', borderRadius: '15px', border: '1px solid #444' }}>
              <h3 style={{ color: '#FFBB33', marginTop: 0 }}>🏦 Loan Calculator</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input type="number" placeholder="Loan Amount (₦)" onChange={(e) => setLoanPrincipal(Number(e.target.value))} style={{ padding: '0.5rem', borderRadius: '5px' }} />
                <input type="number" placeholder="Interest Rate (%)" onChange={(e) => setLoanRate(Number(e.target.value))} style={{ padding: '0.5rem', borderRadius: '5px' }} />
                <input type="number" placeholder="Term (Years)" onChange={(e) => setLoanTerm(Number(e.target.value))} style={{ padding: '0.5rem', borderRadius: '5px' }} />
                <button
                  onClick={() => {
                    const r = loanRate / 100 / 12;
                    const n = loanTerm * 12;
                    const p = (loanPrincipal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
                    setLoanPayment(p.toFixed(2));
                  }}
                  className="btn btn-sm" style={{ backgroundColor: '#FFBB33', color: 'black' }}
                >
                  Calculate Payment
                </button>
                {loanPayment && <p style={{ color: 'white', fontWeight: 'bold' }}>Monthly: ₦{Number(loanPayment).toLocaleString()}</p>}
              </div>
            </div>

            {/* WEALTH PROJECTOR (Marketing Tool) */}
            <div style={{ backgroundColor: '#222', padding: '1.5rem', borderRadius: '15px', border: '1px solid #444' }}>
              <h3 style={{ color: '#00C851', marginTop: 0 }}>🚀 Wealth Projector</h3>
              <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '1rem' }}>See the power of <strong>Compound Interest</strong> with our High-Yield Real Estate Plan.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input type="number" placeholder="Monthly Savings (₦)" onChange={(e) => setMonthlySave(Number(e.target.value))} style={{ padding: '0.5rem', borderRadius: '5px' }} />
                <input type="number" placeholder="Duration (Years)" value={investDuration} onChange={(e) => setInvestDuration(Number(e.target.value))} style={{ padding: '0.5rem', borderRadius: '5px' }} />

                <button
                  onClick={() => {
                    const months = investDuration * 12;

                    // Standard Bank Rate (10% APY)
                    const rateStd = 0.10 / 12;
                    const fvStd = monthlySave * ((Math.pow(1 + rateStd, months) - 1) / rateStd);
                    setStandardResult(Math.round(fvStd));

                    // Partner Real Estate Rate (30% APY)
                    const ratePartner = 0.30 / 12;
                    const fvPartner = monthlySave * ((Math.pow(1 + ratePartner, months) - 1) / ratePartner);
                    setPartnerResult(Math.round(fvPartner));
                  }}
                  className="btn btn-sm" style={{ backgroundColor: '#00C851', color: 'white', fontWeight: 'bold' }}
                >
                  Calculate Growth 📈
                </button>

                {(standardResult && partnerResult) && (
                  <div style={{ marginTop: '1rem', animation: 'fadeIn 0.5s' }}>
                    <div style={{ marginBottom: '0.5rem', padding: '0.5rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '5px' }}>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#aaa' }}>Regular Bank (10%)</p>
                      <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>₦{Number(standardResult).toLocaleString()}</p>
                    </div>
                    <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: 'rgba(0, 200, 81, 0.2)', borderRadius: '10px', border: '1px solid #00C851' }}>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#00C851' }}>✨ With Our Real Estate Plan (30%)</p>
                      <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>₦{Number(partnerResult).toLocaleString()}</p>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', fontStyle: 'italic' }}>
                        You earn <strong>₦{(partnerResult - standardResult).toLocaleString()}</strong> more!
                      </p>
                    </div>
                    <button
                      onClick={() => alert("Redirecting to Real Estate Partner Page... (Demo)")}
                      className="btn"
                      style={{ width: '100%', backgroundColor: '#FFD700', color: 'black', fontWeight: 'bold' }}
                    >
                      Start Investing Now 🏆
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* BEGINNER SECTION (Foundations) */}
          <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '15px', border: '1px solid #444' }}>
            <h2 style={{ color: '#FFBB33', borderBottom: '1px solid #444', paddingBottom: '0.5rem', marginTop: 0 }}>🔰 Financial Foundations (The Basics)</h2>
            <p style={{ color: '#aaa', marginBottom: '1rem' }}>New to finance? Start here to build a solid understanding.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {modules.slice(0, 6).map((module) => (
                <div key={module.id} className="card" style={{ padding: '1rem', borderLeft: '4px solid #FFBB33' }}>
                  <h4 style={{ color: '#FFBB33', margin: '0 0 0.5rem 0' }}>{module.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: '#ccc' }}>{module.desc}</p>
                  <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: '#fff' }}>
                    {/* Render content but strip buttons to avoid confusion */}
                    {React.isValidElement(module.content) ?
                      React.cloneElement(module.content, {
                        children: React.Children.map(module.content.props.children, child => {
                          if (child?.type === 'button' || child?.props?.children?.type === 'button') return null;
                          return child;
                        })
                      })
                      : module.content}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ADULT MODULES LIST (Advanced) */}
          <div style={{ marginTop: '2rem' }}>
            <h2 style={{ color: '#00C851', borderBottom: '1px solid #444', paddingBottom: '0.5rem' }}>🎓 Advanced Curriculum</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { id: 1, title: "Inflation Hedging 🛡️", desc: "Protecting against currency devaluation.", content: "Store value in assets like Real Estate, Gold, or Foreign Currency (Stablecoins) to beat inflation." },
                { id: 2, title: "Emergency Funds 🚑", desc: "3-6 months of expenses.", content: "Keep this in a liquid, low-risk account (like a High-Yield Savings Account) for unexpected life events." },
                { id: 3, title: "Debt Management 💳", desc: "Snowball vs Avalanche method.", content: "Snowball: Pay smallest debts first for momentum. Avalanche: Pay highest interest first for savings." },
                { id: 4, title: "Estate Planning 📜", desc: "Wills and Trusts.", content: "Protect your legacy. Ensure your assets go to your loved ones without legal battles." },
                { id: 5, title: "Retirement Savings Account (RSA) 🇳🇬", desc: "Pension Reform Act.", content: "Ensure your employer is remitting your pension. You can also make voluntary contributions." },
                { id: 6, title: "Investment Diversification 📊", desc: "Don't put all eggs in one basket.", content: "Spread risk across sectors: Agriculture, Tech, Real Estate, and Bonds." },
                { id: 7, title: "Taxation 101 🏛️", desc: "PAYE, VAT, and CIT.", content: "Know your obligations: PAYE (Income Tax), VAT (Consumption Tax 7.5%), and CIT (Company Income Tax for businesses)." },
                { id: 8, title: "Risk Management ⚠️", desc: "Mitigating financial risks.", content: "Insurance, Emergency Funds, and Diversification are key to sleeping well at night." }
              ].map((module) => (
                <div key={module.id} className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--color-primary)' }}>
                  <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>{module.title}</h3>
                  <p style={{ color: '#aaa', marginBottom: '1rem', fontStyle: 'italic' }}>{module.desc}</p>
                  <p>{module.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div >
  );
};

export default Finance;
