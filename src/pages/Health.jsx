import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Health = ({ ageGroup }) => {
    const navigate = useNavigate();
    const [stage, setStage] = useState(1); // 1 to 9
    const [toast, setToast] = useState(null);

    const isKid = ageGroup === 'kids' || ageGroup === 'Kids';
    const isTeen = ageGroup === 'teens' || ageGroup === 'Teens';
    const isAdult = !isKid && !isTeen;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [stage]);

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // --- STAGE COMPONENTS ---

    const IntroStage = () => (
        <div style={{ animation: 'fadeIn 0.8s' }}>
            <div style={{
                position: 'relative',
                height: '400px',
                borderRadius: '24px',
                overflow: 'hidden',
                marginBottom: '2.5rem',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                border: '1px solid var(--color-border)'
            }}>
                <img
                    src="file:///C:/Users/USER/.gemini/antigravity/brain/69520f71-be61-458d-9cf6-8cdff8a237d4/health_intro_banner_1769388020713.png"
                    alt="Health and Wellness"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '3rem 2rem',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                    color: 'white'
                }}>
                    <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', margin: 0 }}>Health, Wellness & Mindset</h1>
                </div>
            </div>

            <p style={{
                fontSize: '1.4rem',
                lineHeight: '1.6',
                color: 'var(--color-text-muted)',
                maxWidth: '850px',
                margin: '0 auto 3rem auto',
                textAlign: 'center',
                fontStyle: 'italic'
            }}>
                “Your body, mind, and habits shape your future. Learn to eat well, stay fit, manage your mind, and develop habits that make you strong, disciplined, and productive.”
            </p>

            <div className="grid-cols" style={{ marginBottom: '4rem' }}>
                <div className="card" style={{ borderTop: '4px solid #C5A019' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🥗</div>
                    <h3>Nutrition</h3>
                    <p>Fuel your body with the right classes of food and ancient African wisdom.</p>
                </div>
                <div className="card" style={{ borderTop: '4px solid #006B3C' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💪</div>
                    <h3>Fitness</h3>
                    <p>Move your body every day with home-friendly exercises and movement keys.</p>
                </div>
                <div className="card" style={{ borderTop: '4px solid #00BFFF' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🧠</div>
                    <h3>Mindset</h3>
                    <p>Master your inner world, manage stress, and build unshakable discipline.</p>
                </div>
            </div>

            <button
                onClick={() => setStage(2)}
                className="btn btn-primary"
                style={{
                    width: '100%',
                    padding: '1.5rem',
                    fontSize: '1.2rem',
                    borderRadius: '16px'
                }}
            >
                Begin Your Journey 🚀
            </button>
        </div>
    );

    const NutritionStage = () => {
        const [quizStep, setQuizStep] = useState(0);
        const foodClasses = [
            { t: 'Carbohydrates', d: 'Energy source for your brain and body.', examples: 'Yam, Cassava, Rice, Millet', icon: '⚡' },
            { t: 'Proteins', d: 'Builds and repairs tissues and muscles.', examples: 'Beans, Fish, Egg, Groundnut', icon: '🏗️' },
            { t: 'Fats & Oils', d: 'Provides long-term energy and protects organs.', examples: 'Palm Oil, Coconut Oil, Avocado', icon: '🛡️' },
            { t: 'Vitamins & Minerals', d: 'Boosts immunity and regulates body functions.', examples: 'Leafy Greens, Fruits, Moringa', icon: '🥦' }
        ];

        return (
            <div style={{ animation: 'fadeIn 0.5s' }}>
                <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ color: '#C5A019' }}>Phase 2: Nutrition Mastery 🥗</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>Learn to fuel your vessel for maximum performance.</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                    {foodClasses.map(fc => (
                        <div key={fc.t} className="card" style={{ border: '1px solid rgba(197, 160, 25, 0.2)', backgroundColor: 'rgba(197, 160, 25, 0.03)' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{fc.icon}</div>
                            <h4>{fc.t}</h4>
                            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{fc.d}</p>
                            <div style={{
                                padding: '0.75rem',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '12px',
                                fontSize: '0.85rem'
                            }}>
                                <strong>Common Examples:</strong><br />
                                {fc.examples}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="card" style={{ marginBottom: '3rem', background: 'linear-gradient(135deg, rgba(197, 160, 25, 0.1), transparent)' }}>
                    <h3>Building a Balanced Plate 🍽️</h3>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '1rem' }}>✓ <strong>Portion Control:</strong> Half your plate should be colorful vegetables.</li>
                        <li style={{ marginBottom: '1rem' }}>✓ <strong>Hydration:</strong> Drink 2-3 liters of water daily. Skip the soda.</li>
                        <li style={{ marginBottom: '1rem' }}>✓ <strong>Budget Hack:</strong> Buy local, seasonal fruits and vegetables for higher nutrients at lower cost.</li>
                    </ul>
                </div>

                <div className="card" style={{ marginBottom: '3rem', border: '1px solid var(--color-primary)' }}>
                    <h3>Knowledge Check 🧠</h3>
                    <p>Which food class is primarily responsible for "building and repairing tissues"?</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '1rem' }}>
                        <button onClick={() => showToast("Try again! (Energy)", 'warning')} className="btn btn-outline">Carbs</button>
                        <button onClick={() => showToast("Correct! 🏗️", 'success')} className="btn btn-outline">Proteins</button>
                        <button onClick={() => showToast("Try again! (Protection)", 'warning')} className="btn btn-outline">Fats</button>
                        <button onClick={() => showToast("Try again! (Regulation)", 'warning')} className="btn btn-outline">Vitamins</button>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setStage(1)} className="btn btn-outline" style={{ flex: 1 }}>Back</button>
                    <button onClick={() => setStage(3)} className="btn btn-primary" style={{ flex: 2 }}>Unlock Fitness ⚡</button>
                </div>
            </div>
        );
    };

    const FitnessStage = () => {
        const exercises = [
            { t: 'Daily Movement', d: 'The most important habit. 30 minutes of walking or dancing keeps the heart strong.', icon: '🚶' },
            { t: 'Home Exercise', d: 'Bodyweight squats, push-ups, and planks. No equipment needed, just your dedication.', icon: '🏠' },
            { t: 'Posture & Stretch', d: 'Open your chest and stretch your spine. Counter the effects of sitting.', icon: '🧘' }
        ];

        return (
            <div style={{ animation: 'fadeIn 0.5s' }}>
                <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ color: '#006B3C' }}>Phase 3: Relentless Fitness 💪</h2>
                    <p style={{ color: 'var(--color-text-muted)' }}>Strength is a choice. Make it daily.</p>
                </header>

                <div className="grid-cols" style={{ marginBottom: '3rem' }}>
                    {exercises.map(ex => (
                        <div key={ex.t} className="card" style={{ borderLeft: '4px solid #006B3C' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{ex.icon}</div>
                            <h4>{ex.t}</h4>
                            <p>{ex.d}</p>
                        </div>
                    ))}
                </div>

                <div className="card" style={{ marginBottom: '3rem', textAlign: 'center', border: '2px dashed var(--color-border)' }}>
                    <h3>Today's Movement Challenge ⚡</h3>
                    <p style={{ fontSize: '1.2rem', margin: '1rem 0' }}>80 Squats + 20 Pushups + 5 Minute Plank</p>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>"Movement is medicine for a stagnant mind."</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setStage(2)} className="btn btn-outline" style={{ flex: 1 }}>Back</button>
                    <button onClick={() => setStage(4)} className="btn btn-primary" style={{ flex: 2, backgroundColor: '#006B3C', color: 'white' }}>Unlock Mental Health 🧠</button>
                </div>
            </div >
        );
    };

    const MentalHealthStage = () => (
        <div style={{ animation: 'fadeIn 0.5s' }}>
            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ color: '#00BFFF' }}>Phase 4: Mental Resilience 🧠</h2>
                <p style={{ color: 'var(--color-text-muted)' }}>A strong mind drives a strong life.</p>
            </header>

            <div className="grid-cols" style={{ marginBottom: '3rem' }}>
                <div className="card">
                    <h4>Emotional Awareness</h4>
                    <p>Learn to identify what you feel. Is it stress, anxiety, or growth discomfort? Naming it is the first step to mastering it.</p>
                </div>
                <div className="card">
                    <h4>The Stoic Calm</h4>
                    <p>Focus only on what you can control. Your breath, your reactions, and your effort. Let go of the rest.</p>
                </div>
                <div className="card">
                    <h4>Journaling Power</h4>
                    <p>Write to clear the mental clutter. 5 minutes of brain-dumping every morning changes your perspective.</p>
                </div>
            </div>

            <div className="card" style={{
                marginBottom: '3rem',
                border: '1px solid rgba(0, 191, 255, 0.3)',
                background: 'linear-gradient(to right, rgba(0, 191, 255, 0.05), transparent)'
            }}>
                <h3>Interactive Exercise: The 4-7-8 Breath</h3>
                <p>Inhale for 4s, Hold for 7s, Exhale for 8s. Repeat 4 times.</p>
                <button
                    onClick={() => showToast("Calmness Activated! 🌊", 'success')}
                    className="btn btn-outline"
                    style={{ marginTop: '1rem', borderColor: '#00BFFF', color: '#00BFFF' }}
                >
                    Start Timer ⏱️
                </button>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => setStage(3)} className="btn btn-outline" style={{ flex: 1 }}>Back</button>
                <button
                    onClick={() => setStage(5)}
                    className="btn btn-primary"
                    style={{ flex: 2, backgroundColor: '#00BFFF', color: 'white' }}
                >
                    Unlock Body Changes 🧬
                </button>
            </div>
        </div>
    );

    const ReproductiveHealthStage = () => (
        <div style={{ animation: 'fadeIn 0.5s' }}>
            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ color: '#DB7093' }}>Phase 5: Life & Body Awareness 🧬</h2>
                <p style={{ color: 'var(--color-text-muted)' }}>Understanding your vessel leads to better decisions.</p>
            </header>

            <div className="grid-cols" style={{ marginBottom: '3rem' }}>
                <div className="card">
                    <h4>Body Changes</h4>
                    <p>{isKid ? "Your body grows as you get older. It's perfectly normal and healthy!" : "Understanding puberty and hormonal cycles helps you manage your physical and emotional well-being."}</p>
                </div>
                <div className="card">
                    <h4>Safe Practices</h4>
                    <p>{isKid ? "Always ask for permission before touching others, and say 'No' if you feel uncomfortable." : "Consent is active, enthusiastic, and revocable. Protect your health with STI awareness and prevention."}</p>
                </div>
                <div className="card">
                    <h4>Healthy Relationships</h4>
                    <p>Respect, communication, and boundaries are the foundations of any strong connection.</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => setStage(4)} className="btn btn-outline" style={{ flex: 1 }}>Back</button>
                <button onClick={() => setStage(6)} className="btn btn-primary" style={{ flex: 2, backgroundColor: '#DB7093', color: 'white' }}>Unlock Sleep 🌙</button>
            </div>
        </div>
    );

    const SleepStage = () => (
        <div style={{ animation: 'fadeIn 0.5s' }}>
            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ color: '#6A5ACD' }}>Phase 6: Sleep & Recovery 🌙</h2>
                <p style={{ color: 'var(--color-text-muted)' }}>Sleep is not a luxury; it's a high-performance necessity.</p>
            </header>

            <div className="grid-cols" style={{ marginBottom: '3rem' }}>
                <div className="card">
                    <h4>The 7-9 Hour Rule</h4>
                    <p>During deep sleep, your brain flushes toxins and consolidates memories. Missing this is like not charging your battery.</p>
                </div>
                <div className="card">
                    <h4>Sleep Cycles</h4>
                    <p>We sleep in 90-minute chunks. Waking up at the end of a cycle makes you feel refreshed, not groggy.</p>
                </div>
                <div className="card">
                    <h4>Sleep Hygiene</h4>
                    <p>No screens 1 hour before bed. Keep the room cool and dark. Consistency is king.</p>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '3rem', border: '1px solid rgba(106, 90, 205, 0.3)' }}>
                <h3>The Cost of Deprivation</h3>
                <p>One night of bad sleep reduces your focus by 40%. Long-term lack leads to anxiety and weakened immunity.</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => setStage(5)} className="btn btn-outline" style={{ flex: 1 }}>Back</button>
                <button onClick={() => setStage(7)} className="btn btn-primary" style={{ flex: 2, backgroundColor: '#6A5ACD', color: 'white' }}>Unlock Digital Health 📱</button>
            </div>
        </div>
    );

    const DigitalHygieneStage = () => (
        <div style={{ animation: 'fadeIn 0.5s' }}>
            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ color: '#00BFFF' }}>Phase 7: Digital Hygiene 📱</h2>
                <p style={{ color: 'var(--color-text-muted)' }}>Own your tools; don't let them own you.</p>
            </header>

            <div className="grid-cols" style={{ marginBottom: '3rem' }}>
                <div className="card">
                    <h4>Screen Time & The Brain</h4>
                    <p>Endless scrolling triggers dopamine loops that kill deep focus. Set hard limits for social apps.</p>
                </div>
                <div className="card">
                    <h4>Digital Detox</h4>
                    <p>Schedule 1 hour a day and 1 day a month with zero screens. Reconnect with the physical world.</p>
                </div>
                <div className="card">
                    <h4>Productivity Hacks</h4>
                    <p>Turn off non-human notifications. Use "Do Not Disturb" during deep work sessions.</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => setStage(6)} className="btn btn-outline" style={{ flex: 1 }}>Back</button>
                <button onClick={() => setStage(8)} className="btn btn-primary" style={{ flex: 2, backgroundColor: '#00BFFF', color: 'white' }}>Unlock Mindset 💎</button>
            </div>
        </div>
    );

    const MindsetStage = () => (
        <div style={{ animation: 'fadeIn 0.5s' }}>
            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ color: '#C5A019' }}>Phase 8: Micro-Discipline 💎</h2>
                <p style={{ color: 'var(--color-text-muted)' }}>Discipline compounds faster than money.</p>
            </header>

            <div className="grid-cols" style={{ marginBottom: '3rem' }}>
                <div className="card">
                    <h4>Small Habits = Big Results</h4>
                    <p>Winning the morning wins the day. Make your bed, drink water, and do 10 pushups immediately.</p>
                </div>
                <div className="card">
                    <h4>The Power of 'No'</h4>
                    <p>Discipline is saying 'No' to a small pleasure now for a massive victory later.</p>
                </div>
                <div className="card">
                    <h4>Body Fuels Mind</h4>
                    <p>Never forget: Your physical state dictates your mental drive. If you're stuck, MOVE.</p>
                </div>
            </div>

            <div className="card" style={{ marginBottom: '3rem', textAlign: 'center', background: 'var(--color-primary-soft)' }}>
                <h3>"Discipline is the bridge between goals and accomplishment."</h3>
                <p>— Jim Rohn</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => setStage(7)} className="btn btn-outline" style={{ flex: 1 }}>Back</button>
                <button onClick={() => setStage(9)} className="btn btn-primary" style={{ flex: 2 }}>The Final Challenge 🏆</button>
            </div>
        </div>
    );

    const CommunityStage = () => (
        <div style={{ animation: 'fadeIn 0.5s', textAlign: 'center' }}>
            <div style={{ fontSize: '5rem', marginBottom: '2rem' }}>🏆</div>
            <h2 style={{ color: 'var(--color-primary)' }}>Level 9: The Community Challenge</h2>
            <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
                Wellness is infectious. Your final task isn't about you—it's about lifting others.
            </p>

            <div className="card" style={{ marginBottom: '4rem', textAlign: 'left' }}>
                <h3>Your Mandate:</h3>
                <ul style={{ listStyleType: 'none', padding: 0, marginTop: '1.5rem' }}>
                    <li style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>👥</span>
                        <span><strong>Teach One:</strong> Share one thing you learned today with a friend or family member.</span>
                    </li>
                    <li style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>🌿</span>
                        <span><strong>Impact One:</strong> Help someone make a healthier choice today.</span>
                    </li>
                    <li style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>🛡️</span>
                        <span><strong>Protect One:</strong> Stand up for the wellness of your community environment.</span>
                    </li>
                </ul>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => setStage(8)} className="btn btn-outline" style={{ flex: 1 }}>Back</button>
                <button
                    onClick={() => {
                        showToast("Wellness Mastery Claimed! 🎓", 'success');
                        navigate('/');
                    }}
                    className="btn btn-primary"
                    style={{ flex: 2 }}
                >
                    Finish Mastery 🎓
                </button>
            </div>
        </div>
    );

    // --- MAIN RENDER ---
    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
            {toast && (
                <div style={{
                    position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
                    zIndex: 1000, padding: '1rem 2rem', borderRadius: '50px',
                    backgroundColor: toast.type === 'success' ? '#006B3C' : '#C5A019',
                    color: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', animation: 'popIn 0.3s'
                }}>
                    {toast.message}
                </div>
            )}

            <button onClick={() => navigate('/')} className="btn-back" style={{ marginBottom: '2rem' }}>← Hub</button>

            {stage === 1 && <IntroStage />}
            {stage === 2 && <NutritionStage />}
            {stage === 3 && <FitnessStage />}
            {stage === 4 && <MentalHealthStage />}
            {stage === 5 && <ReproductiveHealthStage />}
            {stage === 6 && <SleepStage />}
            {stage === 7 && <DigitalHygieneStage />}
            {stage === 8 && <MindsetStage />}
            {stage === 9 && <CommunityStage />}

            {/* Placeholder for future stages */}
            {stage > 9 && (
                <div className="card" style={{ textAlign: 'center', padding: '100px 20px' }}>
                    <h2>Phase {stage} Coming Soon! 🚀</h2>
                    <p>The mastery continues. Check back in a few moments.</p>
                    <button onClick={() => setStage(stage - 1)} className="btn btn-outline" style={{ marginTop: '2rem' }}>Go Back</button>
                </div>
            )}

            {/* Progress indicator */}
            <div style={{
                position: 'fixed',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.8)',
                padding: '0.5rem 1rem',
                borderRadius: '100px',
                border: '1px solid var(--color-border)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                gap: '8px',
                zIndex: 99
            }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <div
                        key={num}
                        style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: stage >= num ? 'var(--color-primary)' : '#333',
                            transition: 'var(--transition)'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Health;
