import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    height: '100vh', backgroundColor: '#F0E6D2', fontFamily: '"Comic Sans MS", "Arial", sans-serif', color: '#4A3B2C', overflow: 'hidden', position: 'relative'
                }}>
                    <style>
                        {`
                            .error-title { font-size: 8rem; font-weight: 900; margin: 0; color: #D15A36; text-shadow: 4px 4px 0px #F9D8A4; }
                            .error-subtitle { font-size: 2.5rem; margin: 10px 0; font-weight: bold; }
                            .error-text { font-size: 1.2rem; max-width: 600px; text-align: center; margin-bottom: 30px; line-height: 1.6; }
                            
                            /* User Provided Caveman CSS snippet elements */
                            .caveman-container { display: flex; gap: 40px; margin-bottom: 20px; position: relative; height: 100px; align-items: flex-end; }
                            .leg { position: relative; border-radius: 10px; height: 55px; width: 10px; background-color: #4A3B2C; }
                            .leg::after { position: absolute; content: ""; border-radius: 50%; height: 10px; left: -5px; top: 15px; width: 10px; background-color: #4A3B2C; }
                            .leg-foot { position: absolute; border-radius: 25px 25px 0 0; height: 25px; left: -20px; bottom: 0; width: 40px; background-color: #4A3B2C; }
                        `}
                    </style>

                    <h1 className="error-title">404</h1>

                    {/* Abstract Caveman Legs using the snippet */}
                    <div className="caveman-container">
                        <div className="leg"><div className="leg-foot"></div></div>
                        <div className="leg" style={{ transform: 'scaleX(-1)' }}><div className="leg-foot"></div></div>
                    </div>

                    <h2 className="error-subtitle">Something went wrong.</h2>
                    <p className="error-text">
                        Looks like you've wandered into the stone age! A wild error appeared and the page you are looking for has gone extinct.
                    </p>

                    <div style={{ display: 'flex', gap: '15px', zIndex: 10 }}>
                        <button
                            onClick={() => window.location.reload()}
                            style={{ padding: '15px 30px', backgroundColor: '#D15A36', color: '#fff', border: 'none', borderRadius: '30px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(209, 90, 54, 0.3)', transition: 'transform 0.2s' }}
                            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        >
                            Refresh App
                        </button>
                    </div>

                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
