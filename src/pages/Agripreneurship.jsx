import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Agripreneurship = () => {
    const navigate = useNavigate();
    const [soilMoisture, setSoilMoisture] = useState(80);
    const [cropStage, setCropStage] = useState(0); // 0: Seed, 1: Sprout, 2: Mature, 3: Harvested
    const [money, setMoney] = useState(1000);
    const [weather, setWeather] = useState('Sunny ☀️');

    // Simulation tick
    useEffect(() => {
        const timer = setInterval(() => {
            setSoilMoisture(prev => Math.max(0, prev - 5));
        }, 2000);
        return () => clearInterval(timer);
    }, []);

    const handleWater = () => {
        setSoilMoisture(100);
    };

    const handlePlant = () => {
        if (money >= 100) {
            setMoney(prev => prev - 100);
            setCropStage(1);
            setSoilMoisture(100);
        }
    };

    const handleHarvest = () => {
        if (cropStage === 2) {
            setMoney(prev => prev + 300);
            setCropStage(3);
            setTimeout(() => setCropStage(0), 2000); // Reset after 2s
        }
    };

    // Grow crop if moisture is good
    useEffect(() => {
        if (cropStage === 1 && soilMoisture > 30) {
            const growTimer = setTimeout(() => setCropStage(2), 5000);
            return () => clearTimeout(growTimer);
        }
    }, [cropStage, soilMoisture]);

    const getCropEmoji = () => {
        switch (cropStage) {
            case 0: return '🟫'; // Soil
            case 1: return '🌱'; // Sprout
            case 2: return '🌽'; // Corn/Maize (Mature)
            case 3: return '💰'; // Sold
            default: return '🟫';
        }
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
                <h1 style={{ fontSize: '3rem', color: 'var(--color-secondary)' }}>Smart Agri-Tech 🌱</h1>
                <p style={{ fontSize: '1.5rem', color: 'var(--color-text-muted)' }}>
                    Tech + Land = The Future of Wealth.
                </p>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
            }}>
                {/* Dashboard Card */}
                <div className="card">
                    <h2 style={{ marginBottom: '1rem' }}>Farm Status 📊</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span>Weather:</span>
                        <strong>{weather}</strong>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <span>Soil Moisture:</span>
                        <div style={{
                            width: '100%',
                            height: '10px',
                            backgroundColor: '#333',
                            borderRadius: '5px',
                            marginTop: '0.5rem'
                        }}>
                            <div style={{
                                width: `${soilMoisture}%`,
                                height: '100%',
                                backgroundColor: soilMoisture < 30 ? 'red' : '#00BFFF',
                                borderRadius: '5px',
                                transition: 'width 0.5s'
                            }}></div>
                        </div>
                    </div>
                    <div style={{ fontSize: '2rem', color: 'var(--color-primary)' }}>
                        Wallet: ₦{money}
                    </div>
                </div>

                {/* Action Card */}
                <div className="card" style={{ textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '2rem' }}>Field 1 (Maize)</h2>
                    <div style={{ fontSize: '5rem', marginBottom: '2rem' }}>
                        {getCropEmoji()}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        {cropStage === 0 && (
                            <button className="btn btn-primary" onClick={handlePlant}>Plant (-₦100)</button>
                        )}
                        {cropStage > 0 && cropStage < 3 && (
                            <button className="btn" style={{ backgroundColor: '#00BFFF', color: '#fff' }} onClick={handleWater}>Irrigate 💧</button>
                        )}
                        {cropStage === 2 && (
                            <button className="btn" style={{ backgroundColor: 'var(--color-secondary)', color: '#fff' }} onClick={handleHarvest}>Harvest (+₦300)</button>
                        )}
                    </div>
                </div>

                {/* Knowledge Card */}
                <div className="card">
                    <h2 style={{ marginBottom: '1rem' }}>Agri-Facts 🚜</h2>
                    <ul style={{ listStyle: 'none' }}>
                        <li style={{ marginBottom: '1rem' }}>
                            <strong>🌍 Food Security:</strong> Africa has 60% of the world's uncultivated arable land.
                        </li>
                        <li style={{ marginBottom: '1rem' }}>
                            <strong>📱 Precision Farming:</strong> Using drones and sensors to save water and boost yields.
                        </li>
                        <li>
                            <strong>🔄 Value Chain:</strong> Don't just sell cocoa beans; make chocolate. Process your produce!
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Agripreneurship;
