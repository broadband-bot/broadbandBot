
import React, { useState, useEffect } from 'react';
import Chat from './components/Chat';
import './App.css'
import Splash from './Splash';

const App: React.FC = () => {

  const [showChatBot, setChatBot] = useState(false);

  useEffect(() => {
    document.title = "Broadband Bot";
  }, []);

  useEffect(() => {
    // Set another timer to show the BroadbandSignup after 5 seconds
    const signupTimer = setTimeout(() => {
      setChatBot(true);
    }, 4000);

    // Clean up the timers
    return () => {
      clearTimeout(signupTimer);
    };
  }, []);

  return (
    
    <div className="App" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
    }}>
      {<Splash/>}

     {showChatBot && <header style={{ 
        minHeight: '50px',
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        backgroundColor: 'white',
      }}> 

        <div style={{ left: '20%', display: 'flex', justifyContent: 'center', width: '100%' }}>
          <img src="/faircount.avif" style={{ marginTop: 'auto', maxWidth: '300px', height: 'auto', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }} alt="Faircount Logo" />
        </div>
      </header>}

      {showChatBot &&<main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <Chat />
      </main>}
    </div>
  );
};

export default App;
