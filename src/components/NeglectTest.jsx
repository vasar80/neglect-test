import React, { useState, useEffect } from 'react';
import './NeglectTest.css';

const NeglectTest = () => {
  const [currentTrial, setCurrentTrial] = useState(0);
  const [score, setScore] = useState(0);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [results, setResults] = useState({
    leftSide: 0,
    rightSide: 0,
    totalTime: 0,
    startTime: null
  });

  const stimuli = [
    { id: 1, position: 'left', type: 'circle' },
    { id: 2, position: 'right', type: 'square' },
    { id: 3, position: 'left', type: 'triangle' },
    { id: 4, position: 'right', type: 'circle' },
    { id: 5, position: 'left', type: 'square' },
    { id: 6, position: 'right', type: 'triangle' },
  ];

  useEffect(() => {
    if (!results.startTime) {
      setResults(prev => ({ ...prev, startTime: Date.now() }));
    }
  }, []);

  const handleStimulusClick = (position) => {
    const currentStimulus = stimuli[currentTrial];
    const isCorrect = position === currentStimulus.position;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      if (position === 'left') {
        setResults(prev => ({ ...prev, leftSide: prev.leftSide + 1 }));
      } else {
        setResults(prev => ({ ...prev, rightSide: prev.rightSide + 1 }));
      }
    }

    if (currentTrial < stimuli.length - 1) {
      setCurrentTrial(prev => prev + 1);
    } else {
      const totalTime = (Date.now() - results.startTime) / 1000;
      setResults(prev => ({ ...prev, totalTime }));
      setIsTestComplete(true);
    }
  };

  const resetTest = () => {
    setCurrentTrial(0);
    setScore(0);
    setIsTestComplete(false);
    setResults({
      leftSide: 0,
      rightSide: 0,
      totalTime: 0,
      startTime: Date.now()
    });
  };

  if (isTestComplete) {
    return (
      <div className="test-container">
        <h2>Test Completato</h2>
        <div className="results">
          <p>Punteggio Totale: {score}/{stimuli.length}</p>
          <p>Risposte Corrette Lato Sinistro: {results.leftSide}</p>
          <p>Risposte Corrette Lato Destro: {results.rightSide}</p>
          <p>Tempo Totale: {results.totalTime.toFixed(2)} secondi</p>
        </div>
        <button onClick={resetTest}>Ripeti il Test</button>
      </div>
    );
  }

  return (
    <div className="test-container">
      <h2>Test di Neglect</h2>
      <p>Trial {currentTrial + 1} di {stimuli.length}</p>
      <div className="stimulus-container">
        <div className="left-side" onClick={() => handleStimulusClick('left')}>
          {stimuli[currentTrial].position === 'left' && (
            <div className={`stimulus ${stimuli[currentTrial].type}`} />
          )}
        </div>
        <div className="right-side" onClick={() => handleStimulusClick('right')}>
          {stimuli[currentTrial].position === 'right' && (
            <div className={`stimulus ${stimuli[currentTrial].type}`} />
          )}
        </div>
      </div>
    </div>
  );
};

export default NeglectTest;
