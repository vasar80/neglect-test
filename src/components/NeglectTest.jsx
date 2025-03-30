import React, { useState } from 'react';
import './NeglectTest.css';
import logoImage from '../assets/logo.png';

const NeglectTest = () => {
  const [markedPositions, setMarkedPositions] = useState([]);
  const [testCompleted, setTestCompleted] = useState(false);
  const [results, setResults] = useState(null);

  const generateLines = () => {
    const lines = [];
    for (let i = 0; i < 10; i++) {
      const line = [];
      for (let j = 0; j < 40; j++) {
        line.push(Math.random() < 0.5 ? 'H' : 'M');
      }
      lines.push(line);
    }
    return lines;
  };

  const handleLetterClick = (lineIndex, letterIndex) => {
    setMarkedPositions(prev => [...prev, `${lineIndex}-${letterIndex}`]);
  };

  const handleComplete = () => {
    setTestCompleted(true);
    calculateResults();
  };

  const calculateResults = () => {
    const totalLetters = 400; // 10 lines * 40 letters
    const markedCount = markedPositions.length;
    const unmarkedCount = totalLetters - markedCount;
    const markedPercentage = (markedCount / totalLetters) * 100;
    const unmarkedPercentage = (unmarkedCount / totalLetters) * 100;

    let neglectLevel = '';
    if (unmarkedPercentage > 50) {
      neglectLevel = 'Negligenza spaziale significativa';
    } else if (unmarkedPercentage > 30) {
      neglectLevel = 'Negligenza spaziale moderata';
    } else if (unmarkedPercentage > 15) {
      neglectLevel = 'Negligenza spaziale lieve';
    } else {
      neglectLevel = 'Nessuna negligenza spaziale significativa';
    }

    setResults({
      markedCount,
      unmarkedCount,
      markedPercentage,
      unmarkedPercentage,
      neglectLevel
    });
  };

  const renderTest = () => {
    const lines = generateLines();

    return (
      <div className="test-container">
        <img 
          src={logoImage} 
          alt="Logo" 
          className="logo"
        />
        <div className="lines-container">
          {lines.map((line, lineIndex) => (
            <div key={lineIndex} className="line">
              {line.map((letter, letterIndex) => (
                <span
                  key={letterIndex}
                  className={`letter ${
                    markedPositions.includes(`${lineIndex}-${letterIndex}`)
                      ? 'marked'
                      : ''
                  }`}
                  onClick={() => handleLetterClick(lineIndex, letterIndex)}
                >
                  {letter}
                </span>
              ))}
            </div>
          ))}
        </div>
        <button className="complete-button" onClick={handleComplete}>
          Completa Test
        </button>
      </div>
    );
  };

  const renderResults = () => {
    if (!results) return null;

    return (
      <div className="test-container">
        <img 
          src={logoImage} 
          alt="Logo" 
          className="logo"
        />
        <div className="results">
          <h2>Risultati del Test</h2>
          <p>Lettere evidenziate: {results.markedCount}</p>
          <p>Lettere non evidenziate: {results.unmarkedCount}</p>
          <p>Percentuale di lettere evidenziate: {results.markedPercentage.toFixed(1)}%</p>
          <p>Percentuale di lettere non evidenziate: {results.unmarkedPercentage.toFixed(1)}%</p>
          <div className="neglect-level">
            <h3>Livello di Negligenza Spaziale:</h3>
            <p>{results.neglectLevel}</p>
          </div>
          <div className="legend">
            <div className="legend-item">
              <span className="legend-color marked"></span>
              <span>Evidenziate</span>
            </div>
            <div className="legend-item">
              <span className="legend-color unmarked"></span>
              <span>Non Evidenziate</span>
            </div>
          </div>
          <button onClick={() => window.location.reload()}>Ripeti Test</button>
        </div>
      </div>
    );
  };

  return testCompleted ? renderResults() : renderTest();
};

export default NeglectTest;
