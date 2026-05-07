import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import { IOSDevice } from './ios-frame.jsx';
import { CakeOrderApp } from './cake-app.jsx';

function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  if (isMobile) {
    return (
      <div style={{ width: '100%', height: '100dvh', overflow: 'hidden', background: 'var(--cream)' }}>
        <CakeOrderApp />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#EFEAE3',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
    }}>
      <IOSDevice width={400} height={820}>
        <CakeOrderApp />
      </IOSDevice>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
