

import React, { useState, useEffect } from 'react';
import './Home.css';

const Home = ({ onStartVisualizer }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      onStartVisualizer(); // Automatically trigger the visualizer after loading
    }, 3000); // Simulate a 3-second loading time
    return () => clearTimeout(timer);
  }, [onStartVisualizer]); // Add onStartVisualizer as a dependency

  return (
    <div className="home">
      {!isLoaded ? (
        <div className="hacker-loader">
          <div className="loader-text">
            <span data-text="Initializing...Welcome to Algorithm Visualizer" className="text-glitch">Initializing...Welcome to Algorithm Visualizer</span>
          </div>
          
          <div className="loader-bar">
            <div className="bar-fill"></div>
            <div className="bar-glitch"></div>
          </div>
          <div className="particles">
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>
        </div>
      ) : null }
    </div>
  );
};

export default Home;

