import React, { useState, useEffect } from 'react';
import './App.css'; // Assuming your CSS is in App.css
import LoadingCircle  from './LoadingCircle';

const SplashScreen = () => {
  const [fadeout, setFadeout] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Start the fade-out effect after a set time
    setTimeout(() => setFadeout(true), 2000); // Starts fade out after  seconds

    // Remove the splash screen from DOM after the fade-out transition
    setTimeout(() => setVisible(false), 4000); // Completely removes after 3 seconds
  }, []);

  if (!visible) return null;

  return (
    <div className={`splash-screen ${fadeout ? 'fade-out' : ''}`}>
      <img src="/splash.png" style={{ width: '500px', height: 'auto' }}/>
      <LoadingCircle />
    </div>
  );
};

export default SplashScreen;
