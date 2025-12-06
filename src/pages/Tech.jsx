import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Tech = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('code'); // 'code' or 'ai'

  // --- CODING PUZZLE STATE ---
  const correctOrder = ['console', '.', 'log', '(', '"Hello Africa"', ')', ';'];
  const [availableBlocks, setAvailableBlocks] = useState([
    { id: 1, text: 'log' },
    { id: 2, text: '"Hello Africa"' },
    { id: 3, text: ';' },
    { id: 4, text: 'console' },
    { id: 5, text: '(' },
    { id: 6, text: '.' },
    { id: 7, text: ')' },
  ]);
  const [userCode, setUserCode] = useState([]);
  const [message, setMessage] = useState("Arrange the blocks to print a message!");
  const [isSuccess, setIsSuccess] = useState(false);

  // --- AI TRAINING STATE ---
  const [aiAccuracy, setAiAccuracy] = useState(0);
  const [currentImage, setCurrentImage] = useState({ emoji: '🦁', type: 'wild' });
  const [trainingCount, setTrainingCount] = useState(0);
  const [aiMessage, setAiMessage] = useState("Teach the AI: Is this animal Wild or Domestic?");

  const trainingData = [
    { emoji: '🐶', type: 'domestic' },
    { emoji: '🐘', type: 'wild' },
    { emoji: '🐱', type: 'domestic' },
    { emoji: '🐆', type: 'wild' },
    { emoji: '🐄', type: 'domestic' },
    { emoji: '🦓', type: 'wild' },
  ];

  // --- CODING HANDLERS ---
  const handleAddBlock = (block) => {
    setUserCode([...userCode, block]);
    setAvailableBlocks(availableBlocks.filter(b => b.id !== block.id));
    setMessage("Keep building...");
  };

  const handleRemoveBlock = (block) => {
    setAvailableBlocks([...availableBlocks, block]);
    setUserCode(userCode.filter(b => b.id !== block.id));
    setIsSuccess(false);
    setMessage("Arrange the blocks to print a message!");
  };

  const handleRun = () => {
    const currentString = userCode.map(b => b.text).join('');
    const correctString = correctOrder.join('');

    if (currentString === correctString) {
      setIsSuccess(true);
      setMessage("🎉 SUCCESS! You just wrote your first line of code.");
    } else {
      setMessage("❌ Syntax Error. Check the order! (Hint: console.log...)");
    }
  };

  // --- AI HANDLERS ---
  const handleTrain = (selection) => {
    if (selection === currentImage.type) {
      setAiAccuracy(prev => Math.min(prev + 15, 100));
      setAiMessage("✅ Correct! The AI is learning.");
    } else {
      setAiAccuracy(prev => Math.max(prev - 10, 0));
      setAiMessage("❌ Oops! Wrong label. The AI is confused.");
    }

    setTrainingCount(prev => prev + 1);
    const nextImg = trainingData[Math.floor(Math.random() * trainingData.length)];
    setCurrentImage(nextImg);
  };

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <button
        onClick={() => navigate('/')}
        style={{
          background: 'none',
          color: 'var(--color-primary)',
          fontSize: '1.2rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        ← Back to Hub
      </button>

      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--color-accent)' }}>Tech & Digital 💻</h1>
        <p style={{ fontSize: '1.5rem', color: 'var(--color-text-muted)' }}>
          The language of the future is Code & AI.
        </p>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button
            className="btn"
            style={{
              backgroundColor: mode === 'code' ? 'var(--color-accent)' : 'transparent',
              border: '1px solid var(--color-accent)',
              color: mode === 'code' ? '#000' : 'var(--color-accent)'
            }}
            onClick={() => setMode('code')}
          >
            Coding Logic
          </button>
          <button
            className="btn"
            style={{
              backgroundColor: mode === 'ai' ? 'var(--color-accent)' : 'transparent',
              border: '1px solid var(--color-accent)',
              color: mode === 'ai' ? '#000' : 'var(--color-accent)'
            }}
            onClick={() => setMode('ai')}
          >
            AI Training
          </button>
        </div>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        {mode === 'code' ? (
          // --- CODING UI ---
          <div className="card" style={{ gridColumn: 'span 2' }}>
            <h2 style={{ marginBottom: '1rem' }}>Mission: Say Hello to the Continent</h2>

            <div style={{
              backgroundColor: '#1e1e1e',
              padding: '2rem',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '1.5rem',
              minHeight: '100px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              alignItems: 'center',
              marginBottom: '2rem',
              border: isSuccess ? '2px solid var(--color-secondary)' : '2px solid #333'
            }}>
              <span style={{ color: '#569cd6' }}>&gt;</span>
              {userCode.map((block) => (
                <button
                  key={block.id}
                  onClick={() => handleRemoveBlock(block)}
                  style={{
                    backgroundColor: '#333',
                    color: '#fff',
                    border: '1px solid #555',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontFamily: 'monospace',
                    fontSize: '1.2rem'
                  }}
                >
                  {block.text}
                </button>
              ))}
              <span className="cursor" style={{ width: '10px', height: '20px', backgroundColor: '#fff', animation: 'blink 1s infinite' }}></span>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <p style={{ marginBottom: '1rem', color: 'var(--color-text-muted)' }}>Available Blocks (Click to add):</p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {availableBlocks.map((block) => (
                  <button
                    key={block.id}
                    onClick={() => handleAddBlock(block)}
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      color: 'var(--color-accent)',
                      border: '1px solid var(--color-accent)',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontFamily: 'monospace',
                      fontSize: '1.2rem',
                      transition: 'transform 0.2s'
                    }}
                  >
                    {block.text}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <button
                className="btn"
                style={{ backgroundColor: 'var(--color-secondary)', color: '#fff', padding: '1rem 3rem' }}
                onClick={handleRun}
              >
                RUN CODE ▶
              </button>
              <h3 style={{ color: isSuccess ? 'var(--color-secondary)' : 'var(--color-text)' }}>
                {message}
              </h3>
            </div>
          </div>
        ) : (
          // --- AI UI ---
          <div className="card" style={{ gridColumn: 'span 2', textAlign: 'center' }}>
            <h2 style={{ marginBottom: '1rem' }}>Train Your AI Model 🤖</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
              AI learns from examples. Teach it to distinguish between Wild and Domestic animals.
            </p>

            <div style={{ fontSize: '8rem', marginBottom: '2rem' }}>
              {currentImage.emoji}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
              <button
                className="btn"
                style={{ backgroundColor: '#FF4500', color: '#fff' }}
                onClick={() => handleTrain('wild')}
              >
                Wild 🦁
              </button>
              <button
                className="btn"
                style={{ backgroundColor: 'var(--color-secondary)', color: '#fff' }}
                onClick={() => handleTrain('domestic')}
              >
                Domestic 🏠
              </button>
            </div>

            <h3>{aiMessage}</h3>

            <div style={{ marginTop: '2rem', maxWidth: '500px', margin: '2rem auto 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Model Accuracy:</span>
                <span>{aiAccuracy}%</span>
              </div>
              <div style={{
                width: '100%',
                height: '20px',
                backgroundColor: '#333',
                borderRadius: '10px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${aiAccuracy}% `,
                  height: '100%',
                  backgroundColor: aiAccuracy > 80 ? 'var(--color-secondary)' : 'var(--color-accent)',
                  transition: 'width 0.3s'
                }}></div>
              </div>
              <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                Samples Trained: {trainingCount}
              </p>
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="card">
          <h2 style={{ marginBottom: '1rem' }}>Why Code & AI? 🚀</h2>
          <ul style={{ listStyle: 'none' }}>
            <li style={{ marginBottom: '1rem' }}>
              <strong>🌐 Global Language:</strong> Code works the same in Lagos, Nairobi, and Silicon Valley.
            </li>
            <li style={{ marginBottom: '1rem' }}>
              <strong>🛡️ Cybersecurity:</strong> Protect our digital borders and data.
            </li>
            <li>
              <strong>🤖 AI Literacy:</strong> Don't just use AI; understand how to build it.
            </li>
          </ul>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Tech;
