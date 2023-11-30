
import React from 'react';
import Chat from './components/Chat';
import './App.css'

const App: React.FC = () => {
  return (
    <div className="App" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
    }}>
      <header style={{ 
        minHeight: '50px',
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        backgroundColor: 'white',
      }}>
        <div style={{ left: '20%', display: 'flex', justifyContent: 'center', width: '100%' }}>
          <img src="/faircount.avif" style={{ marginTop: 'auto', maxWidth: '300px', height: 'auto', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }} alt="Faircount Logo" />
        </div>
      </header>
      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <Chat />
      </main>
    </div>
  );
};

export default App;
