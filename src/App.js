import React, { useState, useEffect } from 'react';
import './App.css';
import BroadbandSignup from './BroadbandSignup';
import Splash from './Splash';

function App() {

  const [showBroadbandSignup, setShowBroadbandSignup] = useState(false);

  useEffect(() => {
    // Set another timer to show the BroadbandSignup after 5 seconds
    const signupTimer = setTimeout(() => {
      setShowBroadbandSignup(true);
    }, 4000);

    // Clean up the timers
    return () => {
      clearTimeout(signupTimer);
    };
  }, []);

  return (
    <div className="App">
      {<Splash/>}
      {showBroadbandSignup && <BroadbandSignup />}
    </div>
  );
}

export default App;
