import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';
import { useGamification } from '../context/GamificationContext';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const Finance = ({ ageGroup }) => {
  const navigate = useNavigate();
  const { user, upgradeToElite } = useAuth();
  const { balance, moduleBalances, moduleEarnings, addEarnings, deductPenalty, getModuleCap, WITHDRAWAL_LIMIT, setModuleBalance } = useWallet();
  const { addPoints } = useGamification();
  const MODULE_CAP = getModuleCap('finance');

  const isKid = ageGroup?.toLowerCase() === 'kids' || ageGroup?.toLowerCase() === 'kid';
  const isTeen = ageGroup?.toLowerCase() === 'teens' || ageGroup?.toLowerCase() === 'teen';
  const isAdult = !isKid && !isTeen;

  const [expandedModule, setExpandedModule] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // --- LEARN-TO-EARN STATE ---
  const [currentLevel, setCurrentLevel] = useState(() => {
    const saved = Number(localStorage.getItem('financeLevel'));
    return saved >= 1 ? saved : 1;
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

  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
  const [dailyFact, setDailyFact] = useState("");

  useEffect(() => {
    localStorage.setItem('dreamGoal', dreamGoal);
    localStorage.setItem('dreamCost', dreamCost);
  }, [dreamGoal, dreamCost]);

  // --- PASSIVE INCOME LOOP (LEVEL 16) ---
  useEffect(() => {
    if (currentLevel < 16) return;

    const interval = setInterval(() => {
      setPortfolio(prev => {
        // Calculate yields
        const realEstateYield = prev.realEstate * 50; // Lagos Rent ₦50 per unit
        const stockYield = prev.stocks * 5; // Dividends ₦5 per share
        const bankYield = prev.bankFixed * 10; // Interest ₦10 per k

        const totalIncome = realEstateYield + stockYield + bankYield;

        if (totalIncome > 0) {
          return { ...prev, cash: prev.cash + totalIncome };
        }
        return prev;
      });
    }, 5000); // Pulse every 5 seconds

    return () => clearInterval(interval);
  }, [currentLevel]);




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

  // --- ARCADE 1: THE MONEY MAKER STATE ---
  // Level 1: Trade Master
  const [tradeStep, setTradeStep] = useState(0); // 0: intro, 1: game, 2: success
  const [subStage, setSubStage] = useState(0); // 0, 1, 2 (for 3-stage levels)
  const kidTradeScenarios = [
    { want: "Goat 🐐", offer: "3 Chickens 🐔", correct: "3 Chickens 🐔", options: ["1 Stone 🪨", "3 Chickens 🐔", "1 Leaf 🍃"], fact: "Barter is the exchange of goods without money. It requires a 'double coincidence of wants'." },
    { want: "Bread 🍞", offer: "2 Fish 🐟", correct: "2 Fish 🐟", options: ["2 Fish 🐟", "1 Shoe 👞", "Mud 🧱"], fact: "In ancient times, salt was used as money because everyone needed it." },
    { want: "Cow 🐄", offer: "5 Sacks of Rice 🍚", correct: "5 Sacks of Rice 🍚", options: ["1 Feather 🪶", "5 Sacks of Rice 🍚", "1 Stick 🪵"], fact: "Before coins, Africans used Cowries and Manillas as medium of exchange." }
  ];

  const teenTradeScenarios = [
    { want: "A Brand New Laptop 💻", offer: "6 Months of Quality Work ⌨️", correct: "6 Months of Quality Work ⌨️", options: ["6 Months of Quality Work ⌨️", "1 Used Phone 📱", "A Social Media Shoutout 📣"], fact: "Value Exchange: Your time and skills are your first assets. Trading specialized labor for high-value goods is the foundation of a modern career." },
    { want: "5% Stake in a Farm 🚜", offer: "₦500k Investment 💰", correct: "₦500k Investment 💰", options: ["₦500k Investment 💰", "A Promise to Help 🤝", "1 Bag of Fertilizer 🪴"], fact: "Equity Barter: Investing capital (money) for a share of ownership (equity) allows you to earn passive income as the business grows." },
    { want: "Higher Harvest Yields 🌾", offer: "Advanced Irrigation System 💧", correct: "Advanced Irrigation System 💧", options: ["Advanced Irrigation System 💧", "More Hard Work ⛏️", "Wishing for Rain ⛈️"], fact: "Technology Leverage: Trading today's capital for technology increases future productivity. This is called Capital Expenditure (CAPEX)." },
    { want: "Community Solar Hub ☀️", offer: "Grant for Clean Energy 📜", correct: "Grant for Clean Energy 📜", options: ["Grant for Clean Energy 📜", "Selling Small Batteries 🔋", "Praying for Sunshine ☀️"], fact: "Public-Private Partnership: Social enterprises trade community impact for institutional funding. This is how large-scale infrastructure is often built." },
    { want: "International Export License 🚢", offer: "Certified Quality Audit 📋", correct: "Certified Quality Audit 📋", options: ["Certified Quality Audit 📋", "A Fancy Suit 👔", "Knowing the Captain ⚓"], fact: "Compliance Trade: In global markets, you trade 'Proof of Quality' for 'Access to Markets'. Standards are just as valuable as the product itself." }
  ];

  const tradeScenarios = isKid ? kidTradeScenarios : teenTradeScenarios;

  // Level 2: Coin Catcher
  const [coinScore, setCoinScore] = useState(0);
  const [isCoinGameActive, setIsCoinGameActive] = useState(false);
  const [fallingItems, setFallingItems] = useState([]); // {id, type, left, top}
  const kidCoinTargets = [5, 10, 15];
  const teenCoinTargets = [12, 18, 25, 30, 35];
  const coinTargets = isKid ? kidCoinTargets : teenCoinTargets;

  // Level 3: Slice the Pie (Budgeting)
  const [pieSlices, setPieSlices] = useState({ needs: 50, wants: 30, savings: 20 });
  const [pieFeedback, setPieFeedback] = useState("");
  const kidBudgetScenarios = [
    {
      role: "Chioma (Student) 🎓",
      name: "Chioma",
      income: 5000,
      desc: "Weekly allowance for a secondary student.",
      needs: ["Transport (okada)", "Lunch", "Textbooks"],
      wants: ["Snacks", "Phone credit", "Cinema"],
      savingsGoal: "Class contribution fund",
      fact: "Needs are things you MUST have to survive or go to school. Wants are things that are just 'nice to have'."
    },
    {
      role: "Emeka (Shop Help) 🛒",
      name: "Emeka",
      income: 15000,
      desc: "Monthly savings for a new bicycle.",
      needs: ["Work shoes", "Data for home", "Savings"],
      wants: ["New jeans", "Gala & Coke", "Game center"],
      savingsGoal: "Bicycle fund (₦30,000)",
      fact: "A savings goal helps you stay focused. If you save ₦10,000 a month, you'll have your bike in 3 months!"
    },
    {
      role: "Amina (Young Farmer) 🚜",
      name: "Amina",
      income: 30000,
      desc: "Starting her own poultry farm.",
      needs: ["Chicken feed", "Vaccines", "Water"],
      wants: ["Fancy boots", "Sola radio", "New scarf"],
      savingsGoal: "Expansion fund",
      fact: "Business expenses (seeds, feed) are 'Needs'. If you don't buy them, you won't make more money later."
    }
  ];

  const teenBudgetScenarios = [
    {
      role: "Tayo (Tech Graduate) 💼",
      name: "Tayo",
      income: 120000,
      desc: "Monthly salary after PAYE tax and Pension deductions.",
      needs: ["Rent (₦40k)", "Internet (₦15k)", "Commute", "Emergency Fund"],
      wants: ["Socializing", "Premium Apps", "Fashion"],
      savingsGoal: "Laptop Upgrade (₦450,000)",
      fact: "Black Tax: In many African households, supporting siblings or parents is a cultural 'Need'. Budgeting for it early prevents financial stress later."
    },
    {
      role: "Ada (Enterprising Student) 👗",
      name: "Ada",
      income: 45000,
      desc: "Earnings from a side-thrifting business.",
      needs: ["Inventory", "Shipping", "Marketing"],
      wants: ["Dining Out", "New Heels", "Celebration"],
      savingsGoal: "Business Warehouse Space",
      fact: "Reinvesting Profit: For a business, at least 40% of profit should go back into growth. This is the difference between a 'hustle' and a 'company'."
    },
    {
      role: "Musa (Digital Nomad) 💻",
      name: "Musa",
      income: 250000,
      desc: "Freelance income with fluctuating monthly totals.",
      needs: ["Solar Power Setup", "Health Insurance", "Tax Reserve"],
      wants: ["Latest Gadget", "Lagos Staycation", "Hobbies"],
      savingsGoal: "Real Estate Downpayment",
      fact: "Sinking Funds: Save for big annual expenses (like Rent or Insurance) by dividing the total cost by 12 and saving that amount every month."
    },
    {
      role: "Lola (Small Business Owner) 🌽",
      name: "Lola",
      income: 80000,
      desc: "Profit from a local catering service.",
      needs: ["Ingredients", "Gas/Fuel", "Staff Pay"],
      wants: ["Gifts", "New TV", "Weekends Off"],
      savingsGoal: "Commercial Kitchen Equipment",
      fact: "Operating Margin: Your 'Needs' in business include everything required to keep the doors open. If your margin is too thin, any emergency can sink you."
    },
    {
      role: "Koffi (Visual Artist) 🎨",
      name: "Koffi",
      income: 150000,
      desc: "Selling paintings and digital assets.",
      needs: ["Studio Rent", "Art Supplies", "Internet"],
      wants: ["Gallery Travel", "Collectibles", "High-end Gear"],
      savingsGoal: "International Exhibition Fund",
      fact: "Creative Capital: As an artist, your 'Wants' often look like 'Needs' (travel, gear). Be strict! Only spend on things that directly generate more value."
    }
  ];

  const budgetScenarios = isKid ? kidBudgetScenarios : teenBudgetScenarios;

  // Level 4: Supermarket Sweep
  const [shopScenario, setShopScenario] = useState(0);
  const shopScenarios = [
    [ // Stage 1 (Rice)
      { name: "Rice (1kg)", price: 2000, bulk: false },
      { name: "Rice (5kg)", price: 8000, bulk: true } // 1600/kg
    ],
    [ // Stage 2 (Oil)
      { name: "Oil (1L)", price: 1500, bulk: false },
      { name: "Oil (3L)", price: 4000, bulk: true } // 1333/L
    ],
    [ // Stage 3 (Soap)
      { name: "Soap (1 pack)", price: 500, bulk: false },
      { name: "Soap (6 pack)", price: 2500, bulk: true } // 416/pack
    ],
    [ // Stage 4 (Beans)
      { name: "Beans (1 cup)", price: 400, bulk: false },
      { name: "Beans (Painter/Bucket)", price: 5000, bulk: true }
    ],
    [ // Stage 5 (Cement/Salt - Bulk context)
      { name: "Salt (Small sachet)", price: 100, bulk: false },
      { name: "Salt (Big bag)", price: 1500, bulk: true }
    ]
  ];

  // Level 5: Safe Keeper
  const [safeScore, setSafeScore] = useState(0);
  const [safeGameActive, setSafeGameActive] = useState(false);
  const [currentSafeItem, setCurrentSafeItem] = useState(null);
  const safeItems = [
    { name: "Cash 💵", type: "bank" },
    { name: "Gold 🥇", type: "bank" },
    { name: "Candy 🍬", type: "mattress" }, // Consumable/Small
    { name: "Jewelry 💍", type: "bank" },
    { name: "Old Toy 🧸", type: "mattress" }
  ];

  // --- GENERIC STAGE HANDLER ---
  const handleStageComplete = (levelId, reward) => {
    // Award partial earnings
    const result = addEarnings('finance', reward);
    if (result.success) {
      triggerConfetti();

      // Advance Sub-Stage
      setSubStage(prev => {
        const nextStage = prev + 1;
        const maxStages = isKid ? 3 : 5;
        if (nextStage >= maxStages) {
          // Level Complete
          setTimeout(() => {
            completeLevel(levelId); // Mark level as done and reset
            setSubStage(0);
          }, 1500);

          if (levelId === 14) return 3;
          return maxStages - 1; // Stay at last stage visuals
        }
        return nextStage;
      });
    } else {
      showToast(result.message, 'error');
    }
  };

  // --- ARCADE 2: THE WEALTH BUILDER STATE ---
  // Level 6: Career Ladder
  // --- ARCADE 2: THE WEALTH BUILDER STATE ---
  // Level 6: Career Ladder
  const [careerStep, setCareerStep] = useState(0); // 0-2 (Intern, Manager, CEO)
  const [careerHistory, setCareerHistory] = useState([]);
  const careerLevels = [
    { title: "Intern ☕", desc: "Start your journey.", task: "Learn Skills", reward: 30, options: [{ txt: "Study Hard 📚", type: "good" }, { txt: "Nap 😴", type: "bad" }] },
    { title: "Manager 👔", desc: "Lead the team.", task: "Manage Team", reward: 30, options: [{ txt: "Mentor Team 🤝", type: "good" }, { txt: "Micromanage 🧐", type: "bad" }] },
    { title: "Director 🏢", desc: "Scale the branch.", task: "Optimize", reward: 40, options: [{ txt: "Efficient Systems ⚙️", type: "good" }, { txt: "Lobbying 🗣️", type: "bad" }] },
    { title: "CEO 🚀", desc: "Lead the company.", task: "Innovate", reward: 50, options: [{ txt: "Launch Product 💡", type: "good" }, { txt: "Cut Costs 📉", type: "bad" }] },
    { title: "Founder 🦄", desc: "Build a legend.", task: "Legacy", reward: 100, options: [{ txt: "Public Listing 📈", type: "good" }, { txt: "Sell Out 💰", type: "bad" }] }
  ];

  // Level 7: Investing (The Garden)
  const [isGrowing, setIsGrowing] = useState(false);
  const [investYear, setInvestYear] = useState(0); // 0, 1, 2
  const investStages = [
    { year: 1, title: "Sowing Seeds 🌱", desc: "Plant your money safely.", options: [{ name: "Govt Bond 🏛️", risk: "low" }, { name: "Daily Ajo 💰", risk: "low" }], correct: "low", reward: 30 },
    { year: 2, title: "Watering 🚿", desc: "Nurture with steady growth.", options: [{ name: "Real Estate (Lagos Land) 🏘️", risk: "med" }, { name: "Cash under mattress 🛏️", risk: "none" }], correct: "med", reward: 30 },
    { year: 3, title: "Growth 🌿", desc: "Diversify for more fruit.", options: [{ name: "Index Fund 📊", risk: "med" }, { name: "New Phone 📱", risk: "none" }], correct: "med", reward: 30 },
    { year: 4, title: "Pruning ✂️", desc: "Cut bad assets.", options: [{ name: "Diversified Stocks 📈", risk: "high" }, { name: "Gambling 🎰", risk: "scam" }], correct: "high", reward: 30 },
    { year: 5, title: "Harvesting 🍎", desc: "Reap the rewards!", options: [{ name: "Tech Stock 💻", risk: "high" }, { name: "Ponzi Scheme ⚠️", risk: "scam" }], correct: "high", reward: 40 }
  ];

  // Level 8: Risk & Reward (Nigerian Choices)
  const [riskChoiceFeedback, setRiskChoiceFeedback] = useState("");
  const [riskChoiceLevel, setRiskChoiceLevel] = useState(0); // 0, 1, 2
  const riskChoiceStages = [
    { name: "Small Business 🏪", desc: "Opening a small kiosk at the market.", risk: "med", reward: 30, outcome: "Steady growth! You earned ₦30." },
    { name: "Daily Savings 🐖", desc: "Saving ₦100 every day with the local Ajo.", risk: "low", reward: 30, outcome: "Safe and sound! You earned ₦30." },
    { name: "Double-Money Scheme ⚠️", desc: "Someone promises to double your money in 1 hour.", risk: "scam", reward: 0, outcome: "Oh no! It was a scam. You lost your capital. 💸" }
  ];

  // Level 9: Debt Sorter (Ninja)
  const [debtScore, setDebtScore] = useState(0);
  const [currentDebtItem, setCurrentDebtItem] = useState(null);
  const [debtStage, setDebtStage] = useState(0); // 0, 1, 2
  const debtStages = [
    { title: "Bad Debt: High Interest", target: "bad", items: [{ name: "Quick Credit (Lapo) 💸", type: "bad" }, { name: "Education Fund 🎓", type: "good" }], reward: 30 },
    { title: "Bad Debt: Consumer Debt", target: "bad", items: [{ name: "Expensive Phone Loan 💳", type: "bad" }, { name: "Mortgage 🏠", type: "good" }], reward: 30 },
    { title: "Business vs Personal", target: "bad", items: [{ name: "Leased Laptop for Work 💻", type: "good" }, { name: "Vacation Loan ✈️", type: "bad" }], reward: 30 },
    { title: "Emergency Debt", target: "bad", items: [{ name: "Credit Card for Party 🎈", type: "bad" }, { name: "Hospital Loan 🏥", type: "good" }], reward: 30 },
    { title: "Predatory Lenders", target: "bad", items: [{ name: "Loan Shark 🦈", type: "bad" }, { name: "Small Business Loan 💼", type: "good" }], reward: 40 }
  ];

  // Level 10: Insurance (Rainy Day)
  const [weatherStatus, setWeatherStatus] = useState("sunny");
  const [rainStage, setRainStage] = useState(0); // 0-2 (Drizzle, Storm, Hurricane)
  const [protection, setProtection] = useState(null);
  const rainStages = [
    { name: "Drizzle 🌦️", need: "Raincoat", reward: 30, options: ["Raincoat 🧥", "New Shoes 👟"] },
    { name: "Thunderstorm ⛈️", need: "Umbrella", reward: 30, options: ["Umbrella ☂️", "Sunglasses 🕶️"] },
    { name: "Food Shortage 🍲", need: "Food Bank", reward: 30, options: ["Emergency Fund 💰", "Gold Chain ⛓️"] },
    { name: "Medical Emergency 🏥", need: "Health Insurance", reward: 30, options: ["Health Insurance 📋", "New Car 🚗"] },
    { name: "Hurricane 🌀", need: "Shelter", reward: 40, options: ["House Insurance 🏠", "Beach Towel 🏖️"] }
  ];

  // --- ARCADE 3: THE MASTERMIND STATE ---
  // Level 11: Scam Buster
  const [scamStep, setScamStep] = useState(0); // 0-2
  const scamLevels = [
    { title: "Email Inspector 📧", type: "email", text: "From: Prince Aliko. Subject: URGENT! I have $5M for you. Click Link.", correct: "scam", reward: 30 },
    { title: "Website Warrior 🌐", type: "web", text: "Secure Bank Login (http://bank-secure-login.net)", correct: "scam", reward: 30 },
    { title: "Social Media 📸", type: "post", text: "DM: 'Help! I'm stuck abroad. Send ₦50k instantly!'", correct: "scam", reward: 30 },
    { title: "Investment Bait 📈", type: "post", text: "Earn 200% profit in 24 hours. Guaranteed!", correct: "scam", reward: 30 },
    { title: "The Call 📞", type: "call", text: "Caller: 'Hello, this is your bank. What is your PIN?'", correct: "scam", reward: 40 }
  ];

  // Level 12: Real Wealth (Sorter)
  const [assetStage, setAssetStage] = useState(0); // 0-2
  const assetStages = [
    { title: "Money Magnet 🗑️", task: "Drag things that GROW your money here", items: [{ name: "Lagos Land/Plot 🏠", type: "asset" }, { name: "New iPhone 📱", type: "liability" }], reward: 30 },
    { title: "Cash Flow 💸", task: "Which one yields profit every month?", items: [{ name: "Rental Shop 🏢", type: "asset" }, { name: "Luxury Watch ⌚", type: "liability" }], reward: 30 },
    { title: "Stock Options 📈", task: "Pick the growth engine", items: [{ name: "Index Fund 📊", type: "asset" }, { name: "Designer Bag 👜", type: "liability" }], reward: 30 },
    { title: "Royalties 🎶", task: "Passive income source?", items: [{ name: "Writing a Book 📚", type: "asset" }, { name: "Buying Snacks 🍟", type: "liability" }], reward: 30 },
    { title: "Income Team 💼", task: "Pick the team that makes you rich", items: ["Gold Bar 🥇", "Small Shop 🏪", "Lagos Land 🏘️", "Lottery Ticket 🎫"], correct: ["Gold Bar 🥇", "Small Shop 🏪", "Lagos Land 🏘️"], reward: 40 }
  ];

  // Level 13: Financial Freedom (Path)
  const [freedomStep, setFreedomStep] = useState(0); // 0-2
  const [passiveIncome, setPassiveIncome] = useState(0);
  const freedomStages = [
    { title: "The Grind 🔨", goal: "Active Income", task: "Click to earn salary.", reward: 30 },
    { title: "Upskilling 🎓", goal: "Professional Certs", task: "Learn new tools.", reward: 30 },
    { title: "Investing 🧠", goal: "Buy Assets", task: "Turn salary into assets.", reward: 30 },
    { title: "Scaling 📈", goal: "Multiple Income", task: "Build diverse streams.", reward: 30 },
    { title: "Freedom 🕊️", goal: "Passive > Expense", task: "Relax while money grows.", reward: 40 }
  ];

  // Level 15: Risk Management (Egg Drop)
  const [riskStage, setRiskStage] = useState(0); // 0-2
  const [riskFeedback, setRiskFeedback] = useState("");
  const riskStages = [
    { title: "One-Good Stall 🌽", choice: "single", desc: "You only sell corn. What happens during a poor harvest?", reward: 30, outcome: "Poor harvest! You have nothing else to sell. Learn to diversify! 📉" },
    { title: "Diverse Stall 🥫", choice: "diverse", desc: "You sell maize, soap, and bread. What happens if bread is scarce?", reward: 30, outcome: "Safe! Your other goods still sell well. Good job! ✅" },
    { title: "Market Fire 🕯️", choice: "diverse", desc: "A candle starts a fire. Does your diversified business survive?", reward: 40, outcome: "Survival! Your spread-out goods saved your capital. 🏆" }
  ];

  // Level 16: The Wealth Engine 🌍
  const [cryptoStage, setCryptoStage] = useState(0);
  const [portfolio, setPortfolio] = useState({
    bitcoin: 0,
    ethereum: 0,
    stocks: 0,
    realEstate: 0,
    bankFixed: 0,
    cash: 1000
  });
  const [prices, setPrices] = useState({
    bitcoin: 50000,
    ethereum: 3000,
    stocks: 100,
    realEstate: 5000,
    bankFixed: 1000
  });
  const [newsEvent, setNewsEvent] = useState(null);
  const [passiveIncomeRate, setPassiveIncomeRate] = useState(0);

  const cryptoStages = [
    { title: "Buy Low, Sell High", desc: "Watch the trends!", target: 1200 },
    { title: "Diversify Holdings", desc: "Spread your risk.", target: 1500 },
    { title: "Survive the Crash", desc: "Protect your wealth!", target: 1800 }
  ];

  const newsEvents = [
    { text: "Central Bank raises rates 📈", effect: { bitcoin: -0.1, ethereum: -0.08, stocks: -0.05 } },
    { text: "Tech adopts crypto 🚀", effect: { bitcoin: 0.15, ethereum: 0.12, stocks: 0.03 } },
    { text: "Recession fears 📉", effect: { bitcoin: -0.15, ethereum: -0.12, stocks: -0.2 } },
    { text: "Inflation hits high 💸", effect: { bitcoin: 0.08, ethereum: 0.05, stocks: -0.1 } }
  ];

  // --- ARCADE 1 HANDLERS ---
  const handleTrade = (option) => {
    const currentScenario = tradeScenarios[subStage];
    if (option === currentScenario.correct) {
      const reward = subStage === 2 ? 40 : 30; // 30, 30, 40 distribution
      showToast(`Good Trade! +₦${reward} 🤝\n${currentScenario.fact}`, 'success');
      handleStageComplete(1, reward);
    } else {
      showToast("Not a fair trade! Think about the value exchange.", 'error');
    }
  };

  const startCoinGame = () => {
    setIsCoinGameActive(true);
    setCoinScore(0);
    setFallingItems([]);
  };

  const handleCoinClick = (type) => {
    if (type === 'coin') {
      setCoinScore(prev => {
        const newScore = prev + 1;
        const target = coinTargets[Math.min(subStage, isKid ? 2 : 4)];
        if (newScore >= target) {
          setIsCoinGameActive(false);
          const reward = subStage === 2 ? 40 : 30;
          const fact = isKid
            ? "Saving a little every day builds a big mountain of treasure! 🏔️"
            : "Compound Interest Warning: If you don't save, inflation (price rises) will eat your buying power. Saving is your defense! 🛡️";
          showToast(`Kolo Full! +₦${reward} 💰\n\n${fact}`, 'success');
          handleStageComplete(2, reward);
        }
        return newScore;
      });
    } else {
      // Penalty for clicking temptations (candy/temptation/etc.)
      const penalty = isKid ? 1 : 2;
      setCoinScore(prev => Math.max(0, prev - penalty));
      showToast(isKid ? 'Ah! Avoid temptations! Save your money! 💸' : 'Impulse Buy! 📉 Teens/Adults: Avoid liabilities that lose value over time.', 'warning');
    }
  };

  const checkBudget = () => {
    const total = pieSlices.needs + pieSlices.wants + pieSlices.savings;
    if (total !== 100) {
      showToast("Budget must add up to exactly 100%!", "error");
      return;
    }

    if (pieSlices.needs < 40) {
      showToast(isKid ? "You didn't buy enough food or books! 😟" : "Your basic survival (Rent/Food) is underfunded. Risk of debt! 📉", "error");
      return;
    }

    if (pieSlices.savings < (isKid ? 10 : 20)) {
      showToast(isKid ? "Try to save a bit more for your goal! 💰" : "Teens/Adults: Savings should be at least 20% to fight inflation and build wealth.", "warning");
    }

    const reward = subStage === 2 ? 60 : 40;
    const currentScenario = budgetScenarios[Math.min(subStage, isKid ? 2 : 4)];
    showToast(`${currentScenario.fact}`, "success");
    handleStageComplete(3, reward);
  };

  const handleShopChoice = (item) => {
    if (item.bulk) {
      const reward = subStage === 2 ? 40 : 30;
      showToast(`Smart choice! Buying in bulk saves money per unit. +₦${reward} 🧠`, 'success');
      handleStageComplete(4, reward);
    } else {
      showToast("That's okay, but the bigger option is cheaper per unit! Try again.", 'warning');
    }
  };

  const startSafeGame = () => {
    setSafeGameActive(true);
    setSafeScore(0);
    nextSafeItem();
  };

  const nextSafeItem = () => {
    const item = safeItems[Math.floor(Math.random() * safeItems.length)];
    setCurrentSafeItem(item);
  };

  const handleSafeSort = (destination) => { // 'bank' or 'mattress'
    if (!currentSafeItem) return;

    // Simplified logic: Valuables -> Bank, Small items -> Mattress/Home
    const correctDest = currentSafeItem.type;

    if (destination === correctDest) {
      setSafeScore(prev => {
        const newScore = prev + 1;
        if (newScore >= 5) {
          setSafeGameActive(false);
          const reward = subStage === 2 ? 40 : 30;
          showToast(`Safe & Secure! +₦${reward}`, 'success');
          handleStageComplete(5, reward);
        }
        return newScore;
      });
      nextSafeItem();
    } else {
      showToast(`Oops! ${currentSafeItem.name} is better kept in the ${correctDest === 'bank' ? 'Bank 🏦' : 'Home 🏠'}.`, 'error');
    }
  };

  // --- ARCADE 2 HANDLERS ---
  const handleCareerChoice = (type) => { // 'good' or 'bad'
    const correctType = 'good';
    if (type === correctType) {
      const reward = careerLevels[careerStep].reward;
      showToast(`Great Choice! ${careerLevels[careerStep].options.find(o => o.type === 'good').txt} +₦${reward} 🌟`, 'success');

      // Progression
      handleStageComplete(6, reward); // Award money

      // Logic handled by generic 'handleStageComplete' doesn't cover local state progression for custom games
      // So we manually check and advance
      setCareerHistory(prev => [...prev, `Level ${careerStep + 1}: Promoted! 📈`]);
      if (careerStep < 2) setCareerStep(s => s + 1);
      else {
        triggerConfetti();
        if (currentLevel === 6) {
          setTimeout(() => completeLevel(6), 1500);
          setCareerStep(0); // Reset for replay
          setCareerHistory([]);
        }
      }
    } else {
      showToast("Oops! That didn't help your career. Try again.", 'warning');
    }
  };

  const handleInvestChoice = (risk) => {
    const stage = investStages[investYear];
    if (risk === stage.correct) {
      showToast(`Success! Investment grew. +₦${stage.reward} 🌳`, 'success');
      handleStageComplete(7, stage.reward);
      setIsGrowing(true);
      setTimeout(() => setIsGrowing(false), 2000);

      if (investYear < 2) setInvestYear(y => y + 1);
      else {
        triggerConfetti();
        if (currentLevel === 7) {
          setTimeout(() => completeLevel(7), 1500);
          setInvestYear(0);
        }
      }
    } else {
      if (risk === 'scam') showToast("Oh no! That was a scam! You lost money. 💸", 'error');
      else showToast("Goal missed! Try a different risk level for this stage.", 'warning');
    }
  };

  const handleRiskChoiceHander = (opt) => {
    setRiskChoiceFeedback(`${opt.name}: ${opt.outcome}`);
    handleStageComplete(8, opt.reward);

    setTimeout(() => {
      setRiskChoiceFeedback("");
      if (riskChoiceLevel < 2) {
        setRiskChoiceLevel(prev => prev + 1);
      } else {
        triggerConfetti();
        if (currentLevel === 8) {
          setTimeout(() => completeLevel(8), 1500);
          setRiskChoiceLevel(0);
        }
      }
    }, 3000);
  };

  const handleDebtAction = (type) => { // 'good' or 'bad'
    const stage = debtStages[debtStage];

    // Correct action is always to 'slash' only the bad ones
    // But my UI will probably force a choice between two items.
    // Let's assume we clicked the item itself.

    if (type === 'bad') { // User correctly identified and clicked the bad debt
      showToast(`Slashed Bad Debt! Good job. +₦${stage.reward} ⚔️`, 'success');
      handleStageComplete(9, stage.reward);

      if (debtStage < 2) setDebtStage(s => s + 1);
      else {
        triggerConfetti();
        if (currentLevel === 9) {
          setTimeout(() => completeLevel(9), 1500);
          setDebtStage(0);
        }
      }
    } else {
      showToast("Don't slash Good Debt! It helps you grow. Slash the Bad Debt!", 'warning');
    }
  };

  const handleRainChoice = (item) => {
    const stage = rainStages[rainStage];
    // Logic: Did they pick the right protection item?
    // Options are just strings. We need to know which is right.
    // Based on array: options[0] is always the right one in my data structure above? 
    // let's verify data: "Raincoat" is options[0], "New Shoes" options[1].

    const correctOption = stage.options[0].split(' ')[0]; // Basic check
    if (item.includes(correctOption)) {
      showToast(`Protected! You stayed dry. +₦${stage.reward} ☂️`, 'success');
      handleStageComplete(10, stage.reward);
      setProtection(item);
      setWeatherStatus(rainStage === 0 ? 'cloudy' : rainStage === 1 ? 'raining' : 'thunder');

      if (rainStage < 2) setRainStage(s => s + 1);
      else {
        triggerConfetti();
        if (currentLevel === 10) {
          setTimeout(() => completeLevel(10), 1500);
          setRainStage(0);
          setWeatherStatus('sunny');
        }
      }
    } else {
      showToast(`You got wet! ${item} didn't help. Try the other one.`, 'warning');
    }
  };

  // --- ARCADE 3 HANDLERS ---
  const handleScamGuess = (isScam) => {
    const stage = scamLevels[scamStep];
    // Logic: User clicks 'Scam!' (true) or 'Safe' (false)
    const correctIsScam = stage.correct === 'scam';

    if (isScam === correctIsScam) {
      showToast(`Correct! You spotted the ${correctIsScam ? 'scam' : 'safe item'}. +₦${stage.reward} 🕵️‍♂️`, 'success');
      handleStageComplete(11, stage.reward);
      if (scamStep < 2) setScamStep(s => s + 1);
      else {
        triggerConfetti();
        if (currentLevel === 11) {
          setTimeout(() => completeLevel(11), 1500);
          setScamStep(0);
        }
      }
    } else {
      showToast(`Oops! That was actually ${correctIsScam ? 'a SCAM' : 'SAFE'}. be careful!`, 'error');
    }
  };

  const handleAssetAction = (item) => {
    const stage = assetStages[assetStage];
    // Stage 0 & 1: Sorte/Connect -> Check if type matches action (implied correct click)
    // For simplicity, ANY click on the correct item for the stage goal works.

    // Stage 2: Portfolio - accumulate
    if (assetStage === 2) {
      if (stage.correct.includes(item)) {
        showToast(`Good pick! ${item} is a solid asset.`, 'success');
        // We need local state for portfolio count or just sim completion
        // Let's just award small score or assume 1 click = 1 stage part?
        // Simplify: Click 1 correct item to pass stage 3 for now, or just alert.
        // Let's make it: User picks 1 best asset to win the level.
        showToast(`Great Portfolio Choice! +₦${stage.reward} 📈`, 'success');
        handleStageComplete(12, stage.reward);
        triggerConfetti();
        if (currentLevel === 12) {
          setTimeout(() => completeLevel(12), 1500);
          setAssetStage(0);
        }
        return;
      } else {
        showToast("Risky choice! Try a safer asset.", 'warning');
        return;
      }
    }

    // Stage 0 & 1
    if (item.type === 'asset' || (stage.title.includes('Cash Flow') && item.type === 'asset')) {
      showToast(`Good Job! Assets build wealth. +₦${stage.reward} 💰`, 'success');
      handleStageComplete(12, stage.reward);
      if (assetStage < 2) setAssetStage(s => s + 1);
    } else {
      showToast("That's a liability! It takes money out of your pocket.", 'warning');
    }
  };

  const handleFreedomAction = (type) => { // 'work' or 'invest'
    const stage = freedomStages[freedomStep];

    if (type === 'work' && freedomStep === 0) {
      // Stage 1: The Grind
      showToast(`Hard work pays off! +₦${stage.reward} 🔨`, 'success');
      handleStageComplete(13, stage.reward);
      setFreedomStep(1);
    } else if (type === 'invest' && freedomStep === 1) {
      // Stage 2: Invest
      showToast(`Smart move! You bought an asset. +₦${stage.reward} 🧠`, 'success');
      handleStageComplete(13, stage.reward);
      setFreedomStep(2);
      setPassiveIncome(100);
    } else if (type === 'relax' && freedomStep === 2) {
      // Stage 3: Freedom
      showToast(`You are Free! Passive Income > Expenses. +₦${stage.reward} 🕊️`, 'success');
      handleStageComplete(13, stage.reward);
      triggerConfetti();
      if (currentLevel === 13) {
        setTimeout(() => completeLevel(13), 1500);
        setFreedomStep(0);
        setPassiveIncome(0);
      }
    } else {
      const msgs = ["Work first!", "Invest next!", "Relax now!"];
      showToast(`Not yet! ${msgs[freedomStep]}`, 'info');
    }
  };

  const handleRiskAction = (type) => {
    const stage = riskStages[riskStage];

    if (type === stage.choice || (riskStage === 0 && type === 'single')) {
      setRiskFeedback(stage.outcome);
      handleStageComplete(15, stage.reward);

      setTimeout(() => {
        setRiskFeedback("");
        if (riskStage < 2) setRiskStage(s => s + 1);
        else {
          triggerConfetti();
          if (currentLevel === 15) {
            setTimeout(() => completeLevel(15), 1500);
            setRiskStage(0);
          }
        }
      }, 3000);
    } else {
      showToast("Not the best strategy! Think about safety.", 'warning');
    }
  };

  // --- CRYPTO HANDLERS ---
  // --- CRYPTO & WEALTH HANDLERS ---
  const handleCryptoTrade = (asset, action) => {
    const price = prices[asset];
    const amount = 100;

    if (action === 'buy') {
      if (portfolio.cash >= amount) {
        setPortfolio(prev => ({
          ...prev,
          [asset]: prev[asset] + (amount / price),
          cash: prev.cash - amount
        }));
        showToast(`Bought ${asset.toUpperCase()}! 📈`, 'success');
      } else {
        showToast("Not enough cash!", 'error');
      }
    } else if (action === 'sell') {
      const holdings = portfolio[asset];
      if (holdings > 0) {
        const sellValue = holdings * price;
        setPortfolio(prev => ({
          ...prev,
          [asset]: 0,
          cash: prev.cash + sellValue
        }));
        showToast(`Sold ${asset.toUpperCase()} for ₦${Math.round(sellValue)}! 💰`, 'success');
      } else {
        showToast(`You don't own any ${asset}!`, 'warning');
      }
    }
  };

  const wealthAssets = [
    { id: 'bitcoin', name: 'Bitcoin ₿', color: '#F7931A', yieldDesc: 'Volatile' },
    { id: 'realEstate', name: 'Lagos Land 🏘️', color: '#4CAF50', yieldDesc: '₦50/pulse' },
    { id: 'stocks', name: 'Index Fund 📊', color: '#2196F3', yieldDesc: '₦5/pulse' },
    { id: 'bankFixed', name: 'Bank Fixed 🏦', color: '#9C27B0', yieldDesc: '₦10/pulse' }
  ];


  const triggerMarketEvent = () => {
    const event = newsEvents[Math.floor(Math.random() * newsEvents.length)];
    setNewsEvent(event);

    setPrices(prev => ({
      bitcoin: Math.round(prev.bitcoin * (1 + event.effect.bitcoin)),
      ethereum: Math.round(prev.ethereum * (1 + event.effect.ethereum)),
      stocks: Math.round(prev.stocks * (1 + event.effect.stocks))
    }));

    setTimeout(() => setNewsEvent(null), 3000);
  };

  const checkCryptoProgress = () => {
    const totalValue = portfolio.cash +
      (portfolio.bitcoin * prices.bitcoin) +
      (portfolio.ethereum * prices.ethereum) +
      (portfolio.stocks * prices.stocks);

    const stage = cryptoStages[cryptoStage];

    if (totalValue >= stage.target) {
      // Level 16: No reward addition as per request (100x15 = 1500 cap)
      const reward = 0;
      showToast(`Stage Complete! Portfolio: ₦${Math.round(totalValue)} 🎉`, 'success');
      handleStageComplete(16, reward);

      if (cryptoStage < 2) {
        setCryptoStage(s => s + 1);
        triggerMarketEvent();
      } else {
        triggerConfetti();
        if (currentLevel === 16) {
          setTimeout(() => completeLevel(16), 1500);
          setCryptoStage(0);
          setPortfolio({ bitcoin: 0, ethereum: 0, stocks: 0, realEstate: 0, bankFixed: 0, cash: 1000 });
        }
      }
    } else {
      showToast(`Keep trading! Target: ₦${stage.target}`, 'info');
    }
  };

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
      showToast(`⚠️ 3 Wrong Attempts! A penalty of ₦${penalty} has been deducted from your Finance wallet.`, 'error');
      setAttempts(0);
    } else {
      showToast(`❌ Wrong! Be careful. (${newAttempts}/3 attempts)`, 'warning');
    }
  };

  const completeLevel = (levelId) => {
    // Reward: 100 per level for first 15 = 1500 total.
    // Staged levels (1-15) already award 100 via handleStageComplete.
    // Level 16 is graduation (no money).

    if (levelId === (isKid ? 15 : 16)) {
      setShowBadge(true);
      triggerConfetti();
    }

    if (levelId === 14) {
      setCityBuildings([]);
      setTaxPaid(0);
    }

    if (levelId === currentLevel) {
      setCurrentLevel(prev => prev + 1);
      addPoints(levelId * 10); // Gamification: Award points based on level
      setAttempts(0);
    }
  };

  const toggleModule = (id) => {
    if (isAdult || id <= currentLevel) {
      if (expandedModule !== id) {
        // Reset progression state when opening a NEW module
        setSubStage(0);
        // Reset level-specific states
        if (id === 14) setCityBuildings([]);
        if (id === 6) { setCareerStep(0); setCareerHistory([]); }
        if (id === 7) setInvestYear(0);
        if (id === 8) setRiskChoiceLevel(0);
        if (id === 10) setRainStage(0);
        if (id === 11) setScamStep(0);
        if (id === 12) setAssetStage(0);
        if (id === 13) setFreedomStep(0);
        if (id === 15) { setRiskStage(0); setRiskFeedback(""); }
        if (id === 16) {
          setPortfolio({ bitcoin: 0, ethereum: 0, stocks: 0, realEstate: 0, bankFixed: 0, cash: 1000 });
          setCryptoStage(0);
        }
      }
      setExpandedModule(expandedModule === id ? null : id);
    }
  };


  const handleInvest = () => {
    const financeBalance = moduleBalances.finance || 0;

    if (financeBalance < investAmount) {
      showToast(`Insufficient funds in Finance Wallet (₦${financeBalance})!`, 'error');
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

  // Level 14: Community Pot (City Builder)
  const [cityBuildings, setCityBuildings] = useState([]); // ['school', 'road', 'hospital']
  const [taxPaid, setTaxPaid] = useState(0);

  const handlePayTax = () => {
    const buildings = ['School 🏫', 'Road 🛣️', 'Hospital 🏥', 'Library 📚', 'Solar Farm ☀️'];
    // Stage 0: School, Stage 1: Road, Stage 2: Hospital, Stage 3: Library, Stage 4: Solar Farm

    if (subStage < (isKid ? 3 : 5)) {
      setCityBuildings([...cityBuildings, buildings[subStage]]);
      setTaxPaid(prev => prev + 1);

      const reward = subStage === 2 ? 40 : 30;
      showToast(`You built a ${buildings[subStage]}! +₦${reward} 🏗️`, 'success');
      handleStageComplete(14, reward);
    }
  };


  // --- MODULE CONTENT ---
  const modules = [
    {
      id: 1,
      title: "Money Basics: Trade Master 🤝",
      desc: "Before money, we traded items.",
      content: (
        <div>
          <p><strong>Stage {Math.min(subStage, isKid ? 2 : 4) + 1}/{isKid ? 3 : 5}:</strong> The villager wants <strong>{tradeScenarios[Math.min(subStage, isKid ? 2 : 4)].want}</strong>.</p>
          <p>You have: <strong>{tradeScenarios[Math.min(subStage, isKid ? 2 : 4)].offer}</strong>.</p>

          {tradeStep === 0 && (
            <button onClick={() => setTradeStep(1)} className="btn" style={{ backgroundColor: '#FFBB33', color: 'black' }}>Start Trading</button>
          )}

          {tradeStep === 1 && (
            <div className="grid-cols" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
              {tradeScenarios[Math.min(subStage, isKid ? 2 : 4)].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTrade(opt)}
                  className="btn btn-outline"
                  style={{
                    padding: '1rem',
                    minHeight: '60px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.95rem'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {tradeStep === 2 && (
            <div style={{ textAlign: 'center', color: '#00C851' }}>
              <h3>Deal! 🤝</h3>
              <p>You traded successfully. Next trade coming up...</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 2,
      title: "Kolo Bank 🏺",
      desc: "Save money in Mama's traditional pot!",
      content: (
        <div>
          {/* Stage-Specific Header */}
          <div style={{
            background: subStage === 0 ? 'linear-gradient(135deg, #4A2C2A 0%, #6B3E3E 100%)' :
              subStage === 1 ? 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)' :
                'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
            padding: '1.25rem',
            borderRadius: '12px',
            marginBottom: '1.25rem',
            border: '2px solid rgba(255,255,255,0.15)',
            transition: 'all 0.5s',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1.3rem', fontWeight: 'bold' }}>
              {subStage === 0 && '🏠 Level 1: Mama\'s Clay Kolo'}
              {subStage === 1 && '🏪 Level 2: Ajo Society Pot'}
              {subStage === 2 && '🏦 Level 3: Bank Account'}
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.95 }}>
              {subStage === 0 && 'Save ₦ at home in the traditional clay pot'}
              {subStage === 1 && 'Contribute to the community savings group'}
              {subStage === 2 && 'Professional banking - the modern way!'}
            </p>
          </div>

          {/* Score Display */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '1.5rem',
            gap: '1rem',
            minHeight: '80px'
          }}>
            <div style={{
              backgroundColor: '#1a1a1a',
              padding: '0.85rem 1.5rem',
              borderRadius: '12px',
              border: '2px solid #00C851',
              boxShadow: '0 2px 10px rgba(0,200,81,0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: '140px'
            }}>
              <div style={{ fontSize: '0.75rem', color: '#aaa', marginBottom: '0.2rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>💰 SAVINGS</div>
              <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#00C851' }}>
                {coinScore}/{coinTargets[Math.min(subStage, 2)] || 10}
              </div>
            </div>

            {coinScore >= 3 && isCoinGameActive && (
              <div style={{
                backgroundColor: '#FFD700',
                color: '#000',
                padding: '0.8rem 1.2rem',
                borderRadius: '12px',
                fontWeight: '900',
                animation: 'pulse 0.6s ease-in-out infinite',
                fontSize: '0.9rem',
                boxShadow: '0 4px 15px rgba(255,215,0,0.4)',
                whiteSpace: 'nowrap'
              }}>
                🔥 STREAK!
              </div>
            )}
          </div>

          {/* Start Button */}
          {!isCoinGameActive && coinScore < (coinTargets[Math.min(subStage, 2)] || 10) && (
            <button
              onClick={startCoinGame}
              className="btn"
              style={{
                width: '100%',
                background: subStage === 0 ? 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)' :
                  subStage === 1 ? 'linear-gradient(135deg, #D97706 0%, #F59E0B 100%)' :
                    'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
                fontSize: '1.15rem',
                padding: '1.1rem',
                marginBottom: '1.25rem',
                fontWeight: 'bold',
                border: 'none',
                boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                transition: 'transform 0.2s'
              }}
            >
              {subStage === 0 && '🏺 Open Kolo Pot'}
              {subStage === 1 && '💰 Join Ajo Meeting'}
              {subStage === 2 && '🏦 Access Bank Vault'}
            </button>
          )}

          {/* Game Area */}
          {isCoinGameActive && (
            <div style={{
              position: 'relative',
              height: '340px',
              border: '4px solid ' + (subStage === 0 ? '#8B4513' : subStage === 1 ? '#D97706' : '#1E40AF'),
              borderRadius: '20px',
              overflow: 'hidden',
              background: subStage === 0 ? 'linear-gradient(180deg, #2C1810 0%, #1a0f08 100%)' :
                subStage === 1 ? 'linear-gradient(180deg, #7C2D12 0%, #451A03 100%)' :
                  'linear-gradient(180deg, #1E3A8A 0%, #0F172A 100%)',
              marginBottom: '1.25rem',
              boxShadow: 'inset 0 2px 20px rgba(0,0,0,0.5)'
            }}>
              {/* Instructions */}
              <div style={{
                position: 'absolute',
                top: '1.25rem',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                zIndex: 5,
                backgroundColor: 'rgba(0,0,0,0.85)',
                padding: '0.65rem 1.35rem',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: '600',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
              }}>
                💰 Tap MONEY | ❌ Avoid TEMPTATIONS
              </div>

              {/* Falling Items */}
              <div style={{
                position: 'absolute',
                bottom: '22%',
                left: 0,
                width: '100%',
                display: 'flex',
                justifyContent: 'space-around',
                padding: '0 1rem',
                gap: '0.5rem',
                flexWrap: 'wrap',
                zIndex: 2
              }}>
                <button onClick={() => handleCoinClick('coin')} style={{ fontSize: '2.8rem', background: 'none', border: 'none', cursor: 'pointer', animation: 'bounce 1s infinite', filter: 'drop-shadow(0 0 10px rgba(0,200,81,0.6))', transition: 'transform 0.15s' }}>🪙</button>
                <button onClick={() => handleCoinClick('coin')} style={{ fontSize: '2.8rem', background: 'none', border: 'none', cursor: 'pointer', animation: 'bounce 1.35s infinite', filter: 'drop-shadow(0 0 10px rgba(0,200,81,0.6))' }}>💵</button>
                {subStage >= 1 && <button onClick={() => handleCoinClick('coin')} style={{ fontSize: '2.8rem', background: 'none', border: 'none', cursor: 'pointer', animation: 'bounce 1.15s infinite', filter: 'drop-shadow(0 0 10px rgba(0,200,81,0.6))' }} title="Mobile money">📱</button>}
                <button onClick={() => handleCoinClick('temptation')} style={{ fontSize: '2.8rem', background: 'none', border: 'none', cursor: 'pointer', animation: 'bounce 1.75s infinite', filter: 'drop-shadow(0 0 10px rgba(255,68,68,0.6))' }} title="Suya!">🍖</button>
                <button onClick={() => handleCoinClick('temptation')} style={{ fontSize: '2.8rem', background: 'none', border: 'none', cursor: 'pointer', animation: 'bounce 1.5s infinite', filter: 'drop-shadow(0 0 10px rgba(255,68,68,0.6))' }} title="Gala!">🌮</button>
                {subStage >= 1 && <button onClick={() => handleCoinClick('temptation')} style={{ fontSize: '2.8rem', background: 'none', border: 'none', cursor: 'pointer', animation: 'bounce 1.65s infinite', filter: 'drop-shadow(0 0 10px rgba(255,68,68,0.6))' }} title="Betting slip!">🎰</button>}
                {subStage >= 2 && <button onClick={() => handleCoinClick('temptation')} style={{ fontSize: '2.8rem', background: 'none', border: 'none', cursor: 'pointer', animation: 'bounce 1.9s infinite', filter: 'drop-shadow(0 0 10px rgba(255,68,68,0.6))' }} title="Unnecessary airtime!">📞</button>}
                <button onClick={() => handleCoinClick('coin')} style={{ fontSize: '2.8rem', background: 'none', border: 'none', cursor: 'pointer', animation: 'bounce 1.25s infinite', filter: 'drop-shadow(0 0 10px rgba(0,200,81,0.6))' }}>🪙</button>
              </div>

              {/* Kolo Pot */}
              <div style={{
                position: 'absolute',
                bottom: '1.5rem',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '4.5rem',
                animation: coinScore >= 3 ? 'shake 0.5s' : 'none',
                filter: coinScore >= (coinTargets[Math.min(subStage, 2)] || 10) * 0.7 ? 'drop-shadow(0 0 20px #FFD700)' : 'none',
                zIndex: 1
              }}>
                {subStage === 0 && '🏺'}
                {subStage === 1 && '💰'}
                {subStage === 2 && '🏦'}
              </div>
            </div>
          )}

          {/* Progress Messages */}
          {coinScore > 0 && coinScore < (coinTargets[Math.min(subStage, 2)] || 10) && isCoinGameActive && (
            <div style={{
              textAlign: 'center',
              padding: '0.95rem',
              backgroundColor: 'rgba(0,200,81,0.15)',
              borderRadius: '10px',
              border: '2px solid #00C851',
              marginBottom: '1.25rem',
              animation: 'fadeIn 0.3s'
            }}>
              <div style={{ fontSize: '0.95rem', color: '#00C851', fontWeight: '600' }}>
                {subStage === 0 && coinScore >= 3 && '🎉 Mama is proud of you!'}
                {subStage === 1 && coinScore >= 5 && '👏 The Ajo chairlady approves!'}
                {subStage === 2 && coinScore >= 7 && '⭐ You\'re banking like a pro!'}
                {coinScore < 3 && 'Keep saving! Every naira counts! 💪'}
              </div>
            </div>
          )}

          {/* Completion */}
          {coinScore >= (coinTargets[Math.min(subStage, 2)] || 10) && (
            <div style={{
              textAlign: 'center',
              padding: '1.75rem',
              background: 'linear-gradient(135deg, rgba(0,200,81,0.2) 0%, rgba(0,200,81,0.3) 100%)',
              borderRadius: '15px',
              border: '3px solid #00C851',
              animation: 'popIn 0.5s',
              boxShadow: '0 4px 20px rgba(0,200,81,0.3)'
            }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>
                {subStage === 0 && '🏺✨'}
                {subStage === 1 && '💰🎉'}
                {subStage === 2 && '🏦🏆'}
              </div>
              <h3 style={{ color: '#00C851', margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>
                {subStage === 0 && 'Kolo Full!'}
                {subStage === 1 && 'Ajo Complete!'}
                {subStage === 2 && 'Bank Balance Growing!'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.9 }}>
                You\'ve mastered this level! Ready for the next? 🚀
              </p>
            </div>
          )}

          <style>{`
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-25px); }
            }
            @keyframes shake {
              0%, 100% { transform: translateX(-50%) rotate(0deg); }
              25% { transform: translateX(-50%) rotate(-6deg); }
              75% { transform: translateX(-50%) rotate(6deg); }
            }
            @keyframes popIn {
              0% { transform: scale(0.85); opacity: 0; }
              50% { transform: scale(1.05); }
              100% { transform: scale(1); opacity: 1; }
            }
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.08); }
            }
          `}</style>
        </div>
      )
    },
    {
      id: 3,
      title: "Family Budget Challenge 👨‍👩‍👧💰",
      desc: "Master real-life Nigerian budgeting!",
      content: (
        <div>
          {/* Character Card */}
          <div style={{
            background: subStage === 0 ? 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)' :
              subStage === 1 ? 'linear-gradient(135deg, #059669 0%, #10B981 100%)' :
                'linear-gradient(135deg, #DC2626 0%, #F87171 100%)',
            padding: '1.5rem',
            borderRadius: '15px',
            marginBottom: '1.5rem',
            border: '3px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1rem' }}>
              {/* Character Avatar with Expression */}
              <div style={{
                fontSize: '4rem',
                filter: pieSlices.savings >= 20 ? 'drop-shadow(0 0 15px #FFD700)' : 'none',
                transition: 'all 0.3s'
              }}>
                {subStage === 0 && (pieSlices.savings >= 20 ? '😄' : '😐')}
                {subStage === 1 && (pieSlices.savings >= 20 ? '😎' : '😟')}
                {subStage === 2 && (pieSlices.savings >= 20 ? '🥳' : '😰')}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, marginBottom: '0.5rem', fontSize: '1.4rem', fontWeight: 'bold' }}>
                  {budgetScenarios[Math.min(subStage, 2)].role}
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.95 }}>
                  {budgetScenarios[Math.min(subStage, 2)].desc}
                </p>
                <div style={{
                  marginTop: '0.75rem',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#FFD700',
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                }}>
                  Income: ₦{budgetScenarios[Math.min(subStage, 2)].income.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Financial Wisdom Tip */}
          <div style={{
            backgroundColor: 'rgba(59,130,246,0.1)',
            border: '2px solid #3B82F6',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'start',
            gap: '0.75rem'
          }}>
            <div style={{ fontSize: '1.5rem' }}>💡</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.25rem', color: '#3B82F6' }}>Nigerian Budget Rule</div>
              <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>50% Needs | 30% Wants | 20% Savings</div>
            </div>
          </div>

          {/* Visual Pie Chart */}
          <div style={{
            backgroundColor: '#1a1a1a',
            padding: '1.5rem',
            borderRadius: '15px',
            marginBottom: '1.5rem',
            border: '2px solid #333'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <h4 style={{ margin: 0, marginBottom: '1rem', color: '#fff' }}>Your Budget Breakdown</h4>

              {/* Pie Chart Visualization */}
              <div style={{
                width: '200px',
                height: '200px',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                background: `conic-gradient(
                  #4285F4 0% ${pieSlices.needs}%,
                  #EA4335 ${pieSlices.needs}% ${pieSlices.needs + pieSlices.wants}%,
                  #34A853 ${pieSlices.needs + pieSlices.wants}% 100%
                )`,
                boxShadow: '0 8px 30px rgba(0,0,0,0.5), inset 0 0 0 15px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent'
                }}>
                  <div style={{
                    backgroundColor: '#1a1a1a',
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '3px solid #333'
                  }}>
                    <div style={{ fontSize: '0.7rem', color: '#aaa' }}>TOTAL</div>
                    <div style={{
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      color: (pieSlices.needs + pieSlices.wants + pieSlices.savings) === 100 ? '#00C851' : '#ff4444'
                    }}>
                      {pieSlices.needs + pieSlices.wants + pieSlices.savings}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: '#4285F4', borderRadius: '3px' }}></div>
                  <span>Needs: {pieSlices.needs}%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: '#EA4335', borderRadius: '3px' }}></div>
                  <span>Wants: {pieSlices.wants}%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '12px', height: '12px', backgroundColor: '#34A853', borderRadius: '3px' }}></div>
                  <span>Savings: {pieSlices.savings}%</span>
                </div>
              </div>
            </div>

            {/* Sliders */}
            <div style={{ marginTop: '1.5rem' }}>
              {/* Needs Slider */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontWeight: '600', color: '#4285F4' }}>🏚️ Needs</label>
                  <span style={{ color: '#4285F4', fontWeight: 'bold' }}>{pieSlices.needs}%</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.5rem' }}>
                  {budgetScenarios[Math.min(subStage, isKid ? 2 : 4)].needs.join(', ')}
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={pieSlices.needs}
                  onChange={(e) => setPieSlices({ ...pieSlices, needs: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    accentColor: '#4285F4',
                    height: '8px',
                    borderRadius: '5px'
                  }}
                />
              </div>

              {/* Wants Slider */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontWeight: '600', color: '#EA4335' }}>🎉 Wants</label>
                  <span style={{ color: '#EA4335', fontWeight: 'bold' }}>{pieSlices.wants}%</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.5rem' }}>
                  {budgetScenarios[Math.min(subStage, isKid ? 2 : 4)].wants.join(', ')}
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={pieSlices.wants}
                  onChange={(e) => setPieSlices({ ...pieSlices, wants: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    accentColor: '#EA4335',
                    height: '8px',
                    borderRadius: '5px'
                  }}
                />
              </div>

              {/* Savings Slider */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <label style={{ fontWeight: '600', color: '#34A853' }}>💰 Savings</label>
                  <span style={{ color: '#34A853', fontWeight: 'bold' }}>{pieSlices.savings}%</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.5rem' }}>
                  Goal: {budgetScenarios[Math.min(subStage, isKid ? 2 : 4)].savingsGoal}
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={pieSlices.savings}
                  onChange={(e) => setPieSlices({ ...pieSlices, savings: Number(e.target.value) })}
                  style={{
                    width: '100%',
                    accentColor: '#34A853',
                    height: '8px',
                    borderRadius: '5px'
                  }}
                />
              </div>
            </div>

            {/* Check Budget Button */}
            <button
              className="btn"
              onClick={checkBudget}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #00C851 0%, #00E676 100%)',
                fontSize: '1.15rem',
                padding: '1.1rem',
                fontWeight: 'bold',
                border: 'none',
                boxShadow: '0 4px 15px rgba(0,200,81,0.3)',
                marginTop: '0.5rem'
              }}
            >
              ✅ Check My Budget
            </button>

            {/* Feedback */}
            {pieFeedback && (
              <div style={{
                marginTop: '1.25rem',
                padding: '1.25rem',
                borderRadius: '12px',
                background: pieFeedback.includes('✅') ? 'linear-gradient(135deg, rgba(0,200,81,0.15) 0%, rgba(0,200,81,0.25) 100%)' : 'linear-gradient(135deg, rgba(255,68,68,0.15) 0%, rgba(255,68,68,0.25) 100%)',
                border: `3px solid ${pieFeedback.includes('✅') ? '#00C851' : '#ff4444'}`,
                animation: 'popIn 0.5s',
                boxShadow: pieFeedback.includes('✅') ? '0 4px 20px rgba(0,200,81,0.3)' : '0 4px 20px rgba(255,68,68,0.3)'
              }}>
                {/* Star Rating */}
                {pieFeedback.includes('✅') && (
                  <div style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '0.75rem' }}>
                    {pieSlices.savings >= 25 && '⭐⭐⭐'}
                    {pieSlices.savings >= 20 && pieSlices.savings < 25 && '⭐⭐'}
                    {pieSlices.savings < 20 && '⭐'}
                  </div>
                )}
                <p style={{
                  margin: 0,
                  textAlign: 'center',
                  color: pieFeedback.includes('✅') ? '#00C851' : '#ff4444',
                  fontWeight: 'bold',
                  fontSize: '1.05rem'
                }}>
                  {pieFeedback}
                </p>
                {pieFeedback.includes('✅') && pieSlices.savings >= 25 && (
                  <p style={{ margin: '0.75rem 0 0 0', textAlign: 'center', fontSize: '0.85rem', opacity: 0.9 }}>
                    🏆 Excellent! {budgetScenarios[Math.min(subStage, isKid ? 2 : 4)].name}'s future is secure!
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Contextual Tips */}
          <div style={{
            backgroundColor: 'rgba(255,193,7,0.1)',
            border: '2px dashed #FFC107',
            borderRadius: '10px',
            padding: '1rem',
            fontSize: '0.85rem',
            color: '#FFC107'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>📚 Pro Tip:</div>
            <div style={{ opacity: 0.95 }}>
              {subStage === 0 && 'Students: Save at least 20% for unexpected school expenses!'}
              {subStage === 1 && 'Young workers: Build an emergency fund of 3-6 months expenses before splurging!'}
              {subStage === 2 && 'Families: Prioritize children\'s education savings - it\'s the best investment!'}
              {subStage === 3 && 'Business Owners: Reinvest at least 40% of profit back into the business!'}
              {subStage === 4 && 'High Earners: Don\'t let lifestyle creep eat your wealth. Keep a high savings rate!'}
            </div>
          </div>

          <style>{`
            @keyframes popIn {
              0% { transform: scale(0.85); opacity: 0; }
              50% { transform: scale(1.05); }
              100% { transform: scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      )
    },
    {
      id: 4,
      title: "Smart Shopper: Supermarket Sweep 🛒",
      desc: "Find the best value.",
      content: (
        <div>
          <p><strong>Stage {Math.min(subStage, isKid ? 2 : 4) + 1}/{isKid ? 3 : 5}:</strong> Which option is the better value?</p>
          <div className="grid-cols" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            {shopScenarios[Math.min(subStage, isKid ? 2 : 4)].map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleShopChoice(item)}
                className="card"
                style={{
                  padding: '1.5rem', border: '2px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)', color: 'white', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
                  minHeight: '180px',
                  justifyContent: 'center',
                  transition: 'all 0.3s'
                }}
              >
                <span style={{ fontSize: '2.5rem' }}>{idx === 0 ? '📦' : '📦📦'}</span>
                <strong style={{ fontSize: '1.1rem' }}>{item.name}</strong>
                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '1.2rem' }}>₦{item.price}</span>
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "Bank Accounts: Safe Keeper 🏦",
      desc: "Sort items to the right place.",
      content: (
        <div>
          <p><strong>Stage {Math.min(subStage, isKid ? 2 : 4) + 1}/{isKid ? 3 : 5}:</strong> Sort 5 items correctly.</p>

          {!safeGameActive && safeScore < 5 ? (
            <button onClick={startSafeGame} className="btn" style={{ width: '100%', marginTop: '1rem', backgroundColor: '#9C27B0' }}>Start Sorting</button>
          ) : safeScore >= 5 ? (
            <div style={{ textAlign: 'center', color: '#00C851' }}>
              <h3>Round Complete! 🔒</h3>
              <p>Get ready for the next batch...</p>
              {subStage < 3 && (
                <button onClick={startSafeGame} className="btn" style={{ marginTop: '1rem', backgroundColor: '#00C851' }}>Start Next Round 🚀</button>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'popIn 0.5s' }}>{currentSafeItem?.name}</div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button onClick={() => handleSafeSort('bank')} className="btn btn-primary" style={{ flex: '1 1 140px', height: '54px', fontSize: '1.1rem' }}>Bank 🏦</button>
                <button onClick={() => handleSafeSort('mattress')} className="btn btn-outline" style={{ flex: '1 1 140px', height: '54px', fontSize: '1.1rem' }}>Home 🏠</button>
              </div>
              <p style={{ marginTop: '1rem' }}>Score: {safeScore}/5</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 6,
      title: "Earning Power: Career Ladder 🪜",
      desc: "Skills = Money.",
      content: (
        <div>
          <p><strong>Stage {Math.min(careerStep, isKid ? 2 : 4) + 1}/{isKid ? 3 : 5}:</strong> {careerLevels[Math.min(careerStep, 4)].title}</p>
          <p>{careerLevels[careerStep].desc}</p>
          <p><strong>Goal:</strong> {careerLevels[careerStep].task}</p>

          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem', flexWrap: 'wrap', alignItems: 'stretch' }}>
            <div style={{
              flex: '1 1 180px',
              border: '2px solid var(--color-border)',
              textAlign: 'center',
              padding: '1.5rem',
              borderRadius: '15px',
              backgroundColor: 'rgba(255,255,255,0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '4.5rem', marginBottom: '1rem' }}>{careerStep === 0 ? '☕' : careerStep === 1 ? '👔' : careerStep === 2 ? '🏢' : careerStep === 3 ? '🚀' : '🦄'}</div>
              <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--color-primary)' }}>Current: {careerLevels[careerStep].title.split(' ')[0]}</p>
            </div>
            <div style={{ flex: '2 1 250px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <p style={{ marginBottom: '0.25rem', fontWeight: 'bold', opacity: 0.8 }}>Choose your action:</p>
              {careerLevels[careerStep].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCareerChoice(opt.type)}
                  className="btn btn-outline"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    minHeight: '60px',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {opt.txt}
                </button>
              ))}
            </div>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#aaa', maxHeight: '60px', overflowY: 'auto', marginTop: '1rem', borderTop: '1px solid #333', paddingTop: '0.5rem' }}>
            {careerHistory.map((h, i) => <div key={i}>{h}</div>)}
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "Investing 101: The Garden 🌳",
      desc: "Make money work for you.",
      content: (
        <div className={isGrowing ? "pulse-animation" : ""}>
          <style>{`
            .pulse-animation { animation: pulse 0.5s ease-in-out; }
            @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.02); box-shadow: 0 0 20px #00C851; } 100% { transform: scale(1); } }
          `}</style >
          <p><strong>Stage {Math.min(investYear, isKid ? 2 : 4) + 1}/{isKid ? 3 : 5}:</strong> {investStages[Math.min(investYear, 4)].title}</p>
          <p><em>{investStages[investYear].desc}</em></p>

          <div style={{ backgroundColor: '#2c2c2c', padding: '1.5rem', borderRadius: '15px', marginTop: '1rem', border: '1px solid var(--color-primary)' }}>
            <h4 style={{ color: 'var(--color-primary)', marginTop: 0 }}>Year {investStages[investYear].year} Strategy 🌳</h4>

            <div className="grid-cols" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              {investStages[investYear].options
                .filter(opt => !(isKid && opt.name === "Tech Stock 💻")) // Filter out for kids
                .map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleInvestChoice(opt.risk)}
                    className="card"
                    style={{
                      padding: '1.25rem', border: '2px solid var(--color-border)',
                      backgroundColor: 'var(--color-surface)', color: 'white', cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
                      minHeight: '140px',
                      justifyContent: 'center',
                      transition: 'all 0.3s'
                    }}
                  >
                    <span style={{ fontSize: '2rem' }}>{opt.name.split(' ')[opt.name.split(' ').length - 1]}</span>
                    <strong style={{ textAlign: 'center' }}>{opt.name}</strong>
                  </button>
                ))}
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#aaa' }}>Choose wisely to grow your garden!</p>
          </div>
        </div >
      )
    },
    {
      id: 8,
      title: "Risk & Reward: The Choice ⚖️",
      desc: "Balance risk and safety.",
      content: (
        <div>
          <p><strong>Scenario {Math.min(riskChoiceLevel, isKid ? 2 : 4) + 1}/{isKid ? 3 : 5}:</strong> Which risk is right for you?</p>

          <div style={{ backgroundColor: '#2c2c2c', padding: '1.5rem', borderRadius: '15px', marginTop: '1rem', border: '1px solid #FF9800' }}>
            <h4 style={{ color: '#FF9800', marginTop: 0 }}>The Big Decision</h4>
            <p style={{ color: '#aaa', fontSize: '0.9rem' }}>Choose the option that matches your goals.</p>

            <div className="grid-cols" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              {riskChoiceStages.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRiskChoiceHander(opt)}
                  className="card"
                  disabled={riskChoiceFeedback !== ""}
                  style={{
                    padding: '1rem', border: '2px solid var(--color-border)',
                    backgroundColor: 'var(--color-surface)', color: 'white', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                    opacity: riskChoiceFeedback !== "" && !riskChoiceFeedback.includes(opt.name) ? 0.5 : 1
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{opt.name.split(' ')[opt.name.split(' ').length - 1]}</span>
                  <strong>{opt.name}</strong>
                </button>
              ))}
            </div>

            {riskChoiceFeedback && (
              <div style={{
                marginTop: '1rem', padding: '1rem', borderRadius: '8px',
                backgroundColor: 'rgba(255,152,0,0.1)', border: '1px solid #FF9800',
                animation: 'popIn 0.3s'
              }}>
                <p style={{ margin: 0, fontWeight: 'bold' }}>{riskChoiceFeedback}</p>
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      id: 9,
      title: "Good vs Bad Debt: Credit Ninja 💳",
      desc: "Slash the bad debt!",
      content: (
        <div>
          <p><strong>Stage {Math.min(debtStage, isKid ? 2 : 4) + 1}/{isKid ? 3 : 5}:</strong> {debtStages[Math.min(debtStage, 4)].title}</p>
          <p>Sharpen your sword! Slash <strong>{debtStages[debtStage].target === 'bad' ? 'BAD DEBT' : 'BAD DEBT'}</strong>.</p>

          <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
            {debtStages[debtStage].items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleDebtAction(item.type)}
                className="btn"
                style={{
                  minHeight: '160px',
                  padding: '1.5rem',
                  fontSize: '1rem',
                  lineHeight: '1.3',
                  backgroundColor: '#1a1a1a',
                  border: '2px solid #555',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  textAlign: 'center',
                  borderRadius: '15px',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>{item.name.split(' ').pop()}</div>
                <div style={{ fontWeight: 'bold', width: '100%' }}>{item.name.replace(item.name.split(' ').pop(), '')}</div>
              </button>
            ))}
          </div>
          <p style={{ marginTop: '1rem', textAlign: 'center', color: '#aaa', fontSize: '0.9rem' }}>
            Hint: Slash anything that has high interest (e.g. Loans, Credit Cards). Keep assets.
          </p>
        </div>
      )
    },
    {
      id: 10,
      title: "Insurance: Rainy Day ☂️",
      desc: "Prepare for the storm.",
      content: (
        <div>
          <p><strong>Stage {Math.min(rainStage, isKid ? 2 : 4) + 1}/{isKid ? 3 : 5}:</strong> {rainStages[Math.min(rainStage, 4)].name}</p>
          <p>The weather is changing. <strong>{rainStages[rainStage].need}</strong> needed!</p>

          <div style={{
            height: '200px',
            backgroundColor: rainStages[rainStage].name.includes('Drizzle') ? '#90A4AE' : rainStages[rainStage].name.includes('Thunder') ? '#546E7A' : '#263238',
            borderRadius: '10px',
            transition: 'background-color 1s',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
            border: '2px solid #555'
          }}>
            <div style={{ fontSize: '4rem', zIndex: 2 }}>{rainStages[rainStage].name.split(' ')[1]}</div>

            {/* Visual Effects based on stage */}
            {weatherStatus === 'raining' && <div className="rain-animation" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,255,0.1)' }}></div>}

            <div style={{ marginTop: '1rem', fontWeight: 'bold', zIndex: 2, backgroundColor: 'rgba(0,0,0,0.5)', padding: '0.5rem', borderRadius: '5px' }}>
              Wealth Protected: {protection ? 'YES ✅' : 'NO ❌'}
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            {rainStages[rainStage].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleRainChoice(opt)}
                className="btn btn-outline"
                style={{
                  minHeight: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem'
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 11,
      title: "Scam Buster: Spot the Fake 🕵️‍♂️",
      desc: "Spot the fakes.",
      content: (
        <div>
          <p><strong>Stage {Math.min(scamStep, isKid ? 2 : 4) + 1}/{isKid ? 3 : 5}:</strong> {scamLevels[Math.min(scamStep, 4)].title}</p>
          <div style={{ backgroundColor: '#333', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
            <p style={{ fontSize: '1.2rem', margin: '1rem 0', fontFamily: 'monospace' }}>"{scamLevels[scamStep].text}"</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn" style={{ flex: 1, backgroundColor: '#ff4444', height: '54px', fontSize: '1.1rem', fontWeight: 'bold' }} onClick={() => handleScamGuess(true)}>Scam! ❌</button>
              <button className="btn" style={{ flex: 1, backgroundColor: '#00C851', height: '54px', fontSize: '1.1rem', fontWeight: 'bold' }} onClick={() => handleScamGuess(false)}>Safe ✅</button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 12,
      title: "Real Wealth: The Money Magnet 🧲",
      desc: "Assets vs Liabilities.",
      content: (
        <div>
          <p><strong>Stage {Math.min(assetStage, isKid ? 2 : 4) + 1}/{isKid ? 3 : 5}:</strong> {assetStages[Math.min(assetStage, 4)].title}</p>
          <p style={{ color: '#FFD700', fontWeight: 'bold' }}>Your Task: {assetStages[assetStage].task}</p>

          <div style={{
            border: '2px solid #00C851', borderRadius: '20px', overflow: 'hidden', padding: '1.5rem',
            backgroundColor: 'rgba(0,200,81,0.05)', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              {assetStages[assetStage].items.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAssetAction(item)}
                  className="card"
                  style={{
                    backgroundColor: '#1a1a1a', border: '2px solid #444', padding: '1.5rem',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
                    transition: 'all 0.3s', minHeight: '140px', justifyContent: 'center'
                  }}
                >
                  <div style={{ fontSize: '2.8rem' }}>{typeof item === 'string' ? item.split(' ').pop() : item.name.split(' ').pop()}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 'bold', textAlign: 'center' }}>{typeof item === 'string' ? item.replace(item.split(' ').pop(), '') : item.name.replace(item.name.split(' ').pop(), '')}</div>
                </button>
              ))}
            </div>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#888' }}>
              Click on the items that make you rich! 💰
            </p>
          </div>
        </div>
      )
    },
    {
      id: 13,
      title: "Financial Freedom: The Path 🕊️",
      desc: "The ultimate goal.",
      content: (
        <div>
          <p><strong>Stage {Math.min(freedomStep, isKid ? 2 : 4) + 1}/{isKid ? 3 : 5}:</strong> {freedomStages[Math.min(freedomStep, 4)].title}</p>
          <p>{freedomStages[freedomStep].task}</p>

          <div style={{ textAlign: 'center', margin: '1rem 0' }}>
            <div style={{ fontSize: '3rem' }}>{freedomStep === 0 ? '👷' : freedomStep === 1 ? '📈' : '🏖️'}</div>
            <p>Goal: {freedomStages[freedomStep].goal}</p>
            {freedomStep > 1 && <p style={{ color: '#00C851' }}>Passive Income: ₦{passiveIncome}</p>}
          </div>

          <div className="grid-cols" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
            <button onClick={() => handleFreedomAction('work')} className="btn" style={{ backgroundColor: '#4285F4', opacity: freedomStep === 0 ? 1 : 0.5, border: '1px solid #fff', height: '60px', fontWeight: 'bold' }}>Work 🔨</button>
            <button onClick={() => handleFreedomAction('invest')} className="btn" style={{ backgroundColor: '#FF8800', opacity: freedomStep === 1 ? 1 : 0.5, border: '1px solid #fff', height: '60px', fontWeight: 'bold' }}>Invest 🧠</button>
            <button onClick={() => handleFreedomAction('relax')} className="btn" style={{ backgroundColor: '#00C851', opacity: freedomStep === 2 ? 1 : 0.5, border: '1px solid #fff', height: '60px', fontWeight: 'bold' }}>Relax 🕊️</button>
          </div>
        </div>
      )
    },
    {
      id: 14,
      title: "Community Pot: City Builder 🍲",
      desc: "Why we pay taxes.",
      content: (!user?.isElite && (isKid || isTeen)) ? (
        <div style={{ textAlign: 'center', padding: '2rem', border: '2px dashed #007E33', borderRadius: '20px', backgroundColor: 'rgba(0,126,51,0.05)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💎</div>
          <h3 style={{ color: '#007E33' }}>Elite Mastery Required</h3>
          <p>Certification levels are reserved for MindNest Elite members.</p>
          <button
            onClick={upgradeToElite}
            className="btn"
            style={{ backgroundColor: '#007E33', color: 'white', fontWeight: 'bold', padding: '0.8rem 1.5rem', borderRadius: '10px' }}
          >
            Upgrade to Elite (₦9,000 / year)
          </button>
        </div>
      ) : (
        <div>
          <p><strong>Stage {Math.min(subStage, isKid ? 2 : 4) + 1}/{isKid ? 3 : 5}:</strong> Taxes build our community. Watch it grow!</p>
          <div style={{
            height: '180px', backgroundColor: '#1a1a1a', borderRadius: '24px', border: '2px dashed #444',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '1.5rem', marginBottom: '1.5rem',
            gap: '1.5rem'
          }}>
            {cityBuildings.length === 0 && <p style={{ color: '#aaa', alignSelf: 'center', fontStyle: 'italic' }}>Building a legacy...</p>}
            {cityBuildings.map((b, i) => (
              <div key={i} style={{ fontSize: '3.5rem', animation: 'popIn 0.5s', filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))' }}>{b.split(' ')[1]}</div>
            ))}
          </div>

          <button
            onClick={handlePayTax}
            className="btn"
            style={{
              width: '100%',
              backgroundColor: subStage >= 3 ? '#00C851' : '#4285F4',
              color: '#fff',
              fontSize: '1.1rem',
              height: '50px'
            }}
            disabled={subStage >= (isKid ? 3 : 5)}
          >
            {subStage >= (isKid ? 3 : 5) ? "Village Fully Built! 🌆✅" : `Pay Tax & Build ${['School', 'Road', 'Hospital', 'Library', 'Solar Farm'][subStage] || ''} 🏗️`}
          </button>

          {subStage >= (isKid ? 3 : 5) && (
            <div style={{ textAlign: 'center', marginTop: '1rem', color: '#00C851' }}>
              <h3>Community Thriving! 🌟</h3>
              <p>Your taxes provided essential services.</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 15,
      title: "Risk Management: The Savvy Merchant 🌽",
      desc: "Diversify to survive.",
      content: (
        <div>
          <p><strong>Scenario {Math.min(riskStage, isKid ? 2 : 4) + 1}/{isKid ? 3 : 5}:</strong> {riskStages[Math.min(riskStage, 2)].title}</p>
          <p><em>{riskStages[Math.min(riskStage, 2)].desc}</em></p>

          <div style={{ margin: '1.5rem 0' }}>
            <div className="grid-cols" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.5rem' }}>
              <button
                onClick={() => handleRiskAction('single')}
                className="card"
                disabled={riskFeedback !== ""}
                style={{
                  padding: '2rem', border: '2px solid #555', backgroundColor: '#1a1a1a',
                  flexDirection: 'column', alignItems: 'center', display: 'flex', gap: '1rem',
                  opacity: riskFeedback.includes('Poor harvest') ? 1 : (riskFeedback !== "" ? 0.3 : 1),
                  transition: 'all 0.3s', minHeight: '200px', justifyContent: 'center', borderRadius: '20px'
                }}
              >
                <div style={{ fontSize: '3.5rem' }}>🌽</div>
                <strong style={{ fontSize: '1.1rem' }}>Sell Only Corn</strong>
              </button>
              <button
                onClick={() => handleRiskAction('diverse')}
                className="card"
                disabled={riskFeedback !== ""}
                style={{
                  padding: '2rem', border: '2px solid #555', backgroundColor: '#1a1a1a',
                  flexDirection: 'column', alignItems: 'center', display: 'flex', gap: '1rem',
                  opacity: riskFeedback.includes('Safe') || riskFeedback.includes('Survival') ? 1 : (riskFeedback !== "" ? 0.3 : 1),
                  transition: 'all 0.3s', minHeight: '200px', justifyContent: 'center', borderRadius: '20px'
                }}
              >
                <div style={{ fontSize: '3.5rem' }}>🛍️</div>
                <strong style={{ fontSize: '1.1rem' }}>Mixed Goods</strong>
              </button>
            </div>
          </div>

          {riskFeedback && (
            <div style={{
              padding: '1rem', borderRadius: '12px',
              backgroundColor: riskFeedback.includes('Poor') ? 'rgba(255,68,68,0.1)' : 'rgba(0,200,81,0.1)',
              border: `1px solid ${riskFeedback.includes('Poor') ? '#ff4444' : '#00C851'}`,
              animation: 'popIn 0.3s'
            }}>
              <p style={{ margin: 0, fontWeight: 'bold', textAlign: 'center' }}>{riskFeedback}</p>
            </div>
          )}
        </div>
      )
    },
    {
      id: 16,
      title: "Wealth Engine: Diversified Choice 🌍",
      desc: "Invest to earn passive income.",
      content: (!user?.isElite) ? (
        <div style={{ textAlign: 'center', padding: '2rem', border: '2px dashed var(--color-primary)', borderRadius: '20px', backgroundColor: 'rgba(156, 39, 176, 0.05)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💎</div>
          <h3 style={{ color: 'var(--color-primary)' }}>Elite Wealth Engine</h3>
          <p>The automated Wealth Engine is a premium feature for Elite members only.</p>
          <button
            onClick={upgradeToElite}
            className="btn"
            style={{ backgroundColor: 'var(--color-primary)', color: 'white', fontWeight: 'bold', padding: '0.8rem 1.5rem', borderRadius: '10px' }}
          >
            Unlock Wealth Engine (₦9,000 / year)
          </button>
        </div>
      ) : (
        <div>
          <p><strong>Stage {cryptoStage + 1}/3:</strong> Build your wealth engine.</p>
          <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '1rem' }}>
            Hold assets to earn money automatically every 5 seconds! 💸
          </p>

          {/* TOTAL WEALTH CARD */}
          <div style={{
            backgroundColor: '#007E33', padding: '1.5rem', borderRadius: '20px',
            color: 'white', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,200,81,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>Available Cash</p>
                <h3 style={{ margin: 0, fontSize: '1.8rem' }}>₦{Math.round(portfolio.cash)}</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.8 }}>Income Pulse</p>
                <h3 style={{ margin: 0, color: '#00C851' }}>+₦{
                  (portfolio.realEstate * 50) + (portfolio.stocks * 5) + (portfolio.bankFixed * 10)
                }/5s</h3>
              </div>
            </div>
            <p style={{ fontSize: '0.75rem', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem' }}>
              Target to Mastery: <strong>₦{cryptoStages[cryptoStage].target}</strong>
            </p>
          </div>

          {/* ASSET GRID */}
          <div className="grid-cols" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            {wealthAssets.map((asset) => (
              <div key={asset.id} style={{
                backgroundColor: '#2c2c2c', padding: '1rem', borderRadius: '15px',
                border: `1px solid ${asset.color}`, display: 'flex', flexDirection: 'column', gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <span style={{ fontSize: '1.2rem' }}>{asset.name}</span>
                  <span style={{ fontSize: '0.7rem', color: '#aaa' }}>{asset.yieldDesc}</span>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>₦{prices[asset.id].toLocaleString()}</div>
                <div style={{ fontSize: '0.75rem', color: '#888' }}>
                  Owned: {portfolio[asset.id].toFixed(2)}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button onClick={() => handleCryptoTrade(asset.id, 'buy')} className="btn btn-sm" style={{ flex: 1, backgroundColor: '#00C851', fontSize: '0.7rem', padding: '0.4rem' }}>Buy ₦100</button>
                  <button onClick={() => handleCryptoTrade(asset.id, 'sell')} className="btn btn-sm" style={{ flex: 1, backgroundColor: '#ff4444', fontSize: '0.7rem', padding: '0.4rem' }}>Sell All</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button onClick={checkCryptoProgress} className="btn btn-primary" style={{ width: '100%' }}>Check Progress ✅</button>
            <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.5rem', fontStyle: 'italic' }}>
              Mastery rule: Only investors can withdraw funds from this module.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      {/* MASTERY BADGE MODAL */}
      {showBadge && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 10000,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          padding: '1rem'
        }}>
          <div className="card" style={{
            maxWidth: '400px', width: '100%', textAlign: 'center',
            background: 'linear-gradient(135deg, #1a1a1a 0%, #333 100%)',
            border: '2px solid #FFD700', borderRadius: '24px', padding: '2.5rem',
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.3)',
            animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🏅</div>
            <h2 style={{ color: '#FFD700', marginBottom: '0.5rem' }}>FINANCE MASTER!</h2>
            <p style={{ color: '#fff', marginBottom: '1.5rem' }}>
              Congratulations! You've unlocked all {isKid ? '15' : '16'} levels of Financial Literacy.
              You are now a certified Wealth Builder! 👑
            </p>
            <div style={{
              backgroundColor: 'rgba(255,215,0,0.1)', border: '1px dashed #FFD700',
              padding: '1rem', borderRadius: '12px', marginBottom: '2rem'
            }}>
              <span style={{ fontSize: '0.8rem', color: '#FFD700' }}>RANK EARNED</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>Village Treasurer 💰</div>
            </div>
            <button
              onClick={() => setShowBadge(false)}
              className="btn"
              style={{ width: '100%', backgroundColor: '#FFD700', color: '#000', fontWeight: 'bold' }}
            >
              SHOW OFF MY BADGE! 🚀
            </button>
          </div>
        </div>
      )}

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

      <header style={{ marginBottom: '2rem', textAlign: 'center', width: '100%', maxWidth: '800px', margin: '0 auto 3rem auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem', width: '100%' }}>
          {isKid || isTeen ? "Path to Wealth 🚀" : "Financial Literacy 💰"}
        </h1>
        <p style={{ fontSize: 'clamp(1rem, 4vw, 1.5rem)', color: 'var(--color-text-muted)', width: '100%' }}>
          {isKid || isTeen ? "Level Up & Earn Real Cash!" : "Master the Rules of Money"}
        </p>
        <div style={{ display: 'inline-flex', padding: '0.4rem 1.2rem', border: '1px solid var(--color-primary)', borderRadius: '20px', marginTop: '1rem', color: 'var(--color-primary)', fontSize: '0.9rem', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ opacity: 0.7 }}>Mode:</span> <strong>{ageGroup || 'Adults'}</strong>
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



          {/* DREAM GOAL TRACKER */}
          <div style={{ backgroundColor: '#222', padding: '1.5rem', borderRadius: '20px', margin: '2rem 0', border: '1px solid #444' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, color: '#FFBB33' }}>🎯 My Dream Goal</h3>
              <button onClick={() => setShowGoalInput(!showGoalInput)} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }}>⚙️ Edit</button>
            </div>

            {showGoalInput ? (
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <input type="text" placeholder="Goal (e.g. Bicycle)" value={dreamGoal} onChange={(e) => setDreamGoal(e.target.value)} style={{ flex: '1 1 200px', padding: '0.8rem', borderRadius: '10px', backgroundColor: '#333', color: 'white', border: '1px solid #444' }} />
                <input type="number" placeholder="Cost (₦)" value={dreamCost} onChange={(e) => setDreamCost(Number(e.target.value))} style={{ flex: '1 1 120px', padding: '0.8rem', borderRadius: '10px', backgroundColor: '#333', color: 'white', border: '1px solid #444' }} />
                <button onClick={() => setShowGoalInput(false)} className="btn btn-primary" style={{ flex: '1 1 100%', padding: '0.8rem' }}>Save Goal</button>
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
            padding: '2rem', borderRadius: '24px', color: 'white', marginBottom: '2rem',
            boxShadow: '0 10px 30px rgba(0,200,81,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: '1.5rem', border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ flex: '1 1 200px' }}>
              <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '0.25rem' }}>Finance Wallet Balance</p>
              <h2 style={{ fontSize: '2.8rem', margin: 0, fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ₦{moduleBalances.finance || 0}
              </h2>
              <p style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🎯 Goal:</span> <strong>₦{WITHDRAWAL_LIMIT}</strong>
              </p>
            </div>
            <button
              onClick={() => setShowWithdrawModal(true)}
              disabled={(moduleBalances.finance || 0) < WITHDRAWAL_LIMIT}
              style={{
                backgroundColor: 'white', color: '#007E33', border: 'none', padding: '1rem 2rem',
                borderRadius: '30px', fontWeight: 'bold', cursor: (moduleBalances.finance || 0) >= WITHDRAWAL_LIMIT ? 'pointer' : 'not-allowed',
                opacity: (moduleBalances.finance || 0) >= WITHDRAWAL_LIMIT ? 1 : 0.7,
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                fontSize: '1.1rem',
                minWidth: '160px'
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
                      <p>To ensure secure transactions, we must verify your identity and wealth records.</p>
                      <div style={{ backgroundColor: '#1a1a1a', padding: '1.5rem', borderRadius: '15px', margin: '1.5rem 0', textAlign: 'left', border: '1px solid #333' }}>
                        <p style={{ margin: '0.6rem 0', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{ fontSize: '1.2rem' }}>📋</span> <strong>Requirement 1:</strong> Balance ≥ ₦{WITHDRAWAL_LIMIT} <span style={{ color: '#00C851', marginLeft: 'auto', fontWeight: 'bold' }}>✅</span>
                        </p>
                        <p style={{ margin: '0.6rem 0', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{ fontSize: '1.2rem' }}>📜</span> <strong>Requirement 2:</strong> History Wallet ≥ ₦2,000 <span style={{ color: moduleBalances.history >= 2000 ? '#00C851' : '#ff4444', marginLeft: 'auto', fontWeight: 'bold' }}>{moduleBalances.history >= 2000 ? '✅' : '❌'}</span>
                        </p>
                        <p style={{ margin: '0.6rem 0', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{ fontSize: '1.2rem' }}>🏗️</span> <strong>Requirement 3:</strong> Active Investments <span style={{ color: (portfolio.bitcoin > 0 || portfolio.stocks > 0 || portfolio.realEstate > 0 || portfolio.bankFixed > 0) ? '#00C851' : '#ff4444', marginLeft: 'auto', fontWeight: 'bold' }}>{(portfolio.bitcoin > 0 || portfolio.stocks > 0 || portfolio.realEstate > 0 || portfolio.bankFixed > 0) ? '✅' : '❌'}</span>
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button
                          onClick={() => {
                            const hasInvestments = portfolio.bitcoin > 0 || portfolio.stocks > 0 || portfolio.realEstate > 0 || portfolio.bankFixed > 0;
                            if (hasInvestments && (moduleBalances.history || 0) >= 2000) {
                              setVerificationStatus('verifying');
                              setTimeout(() => setVerificationStatus('success'), 3000);
                            } else {
                              setVerificationStatus('failed');
                            }
                          }}
                          className="btn"
                          style={{ backgroundColor: '#00C851', flex: 1, padding: '1rem', fontWeight: 'bold' }}
                        >
                          Verify Records 🕵️‍♂️
                        </button>
                        <button onClick={() => setShowWithdrawModal(false)} className="btn" style={{ backgroundColor: '#333', flex: 1, padding: '1rem', border: '1px solid #555' }}>Cancel</button>
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
                        <button onClick={() => showToast("Withdrawal Request Sent! 🚀 (This is a demo)", 'success')} className="btn" style={{ backgroundColor: '#00C851', flex: 1 }}>Confirm</button>
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
            {modules
              .filter(m => !(isKid && m.id === 16))
              .map((module) => {
                const isLocked = module.id > (currentLevel || 1);
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
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </>
      ) : (
        // --- ADULT VIEW (Advanced Content & Tools) ---
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

          {/* FINANCIAL TOOLS SECTION */}
          <div className="grid-cols">
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
                {loanPayment && (
                  <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(255, 187, 51, 0.1)', borderRadius: '10px', border: '1px solid rgba(255, 187, 51, 0.3)' }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#aaa' }}>Monthly Payment</p>
                    <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#FFBB33' }}>₦{Number(loanPayment).toLocaleString()}</p>
                  </div>
                )}
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
                      onClick={() => showToast("Redirecting to Real Estate Partner Page... (Demo)", 'info')}
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
          <div style={{ backgroundColor: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
            <h2 style={{ color: '#FFBB33', borderBottom: '1px solid #333', paddingBottom: '0.75rem', marginTop: 0 }}>🔰 Financial Foundations</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>New to finance? Start here to build a solid understanding.</p>
            <div className="grid-cols">
              {modules.slice(0, 6).map((module) => (
                <div key={module.id} className="card" style={{ padding: '1rem', borderLeft: '4px solid #FFBB33' }}>
                  <h4 style={{ color: '#FFBB33', margin: '0 0 0.5rem 0' }}>{module.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: '#ccc' }}>{module.desc}</p>
                  <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: '#fff' }}>
                    {module.content}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ADULT MODULES LIST (Advanced) */}
          <div style={{ marginTop: '3rem' }}>
            <h2 style={{ color: '#00C851', borderBottom: '1px solid #333', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>🎓 Advanced Curriculum</h2>
            <div className="grid-cols">
              {[
                { id: 1, title: "Inflation Hedging 🛡️", desc: "Protecting against devaluation.", content: "Store value in assets like Real Estate, Gold, or Stablecoins to beat inflation." },
                { id: 2, title: "Emergency Funds 🚑", desc: "3-6 months of expenses.", content: "Keep this in a liquid account (like a Savings Account) for unexpected events." },
                { id: 3, title: "Debt Management 💳", desc: "Snowball vs Avalanche.", content: "Snowball: Smallest debts first. Avalanche: Highest interest first." },
                { id: 4, title: "Estate Planning 📜", desc: "Wills and Trusts.", content: "Protect your legacy. Ensure your assets go to loved ones without legal battles." },
                { id: 5, title: "Retirement Savings Account 🇳🇬", desc: "Pension Reform.", content: "Ensure employer remissions. You can also make voluntary contributions." },
                { id: 6, title: "Diversification 📊", desc: "Risk Management.", content: "Spread risk across Agriculture, Tech, Real Estate, and Bonds." },
                { id: 7, title: "Taxation 101 🏛️", desc: "PAYE, VAT, and CIT.", content: "Value Added Tax (7.5%) and Company Income Tax are key for builders." },
                { id: 8, title: "Risk Mitigation ⚠️", desc: "Financial Safety.", content: "Insurance and Emergency Funds are key to sleeping well at night." }
              ].map((module) => (
                <div key={module.id} className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #00C851', height: '100%', minHeight: '200px' }}>
                  <h4 style={{ color: '#00C851', marginBottom: '0.5rem' }}>{module.title}</h4>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1rem', fontStyle: 'italic' }}>{module.desc}</p>
                  <p style={{ fontSize: '0.9rem' }}>{module.content}</p>
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
