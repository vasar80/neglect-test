import React, { useState, useMemo } from 'react';
import './NeglectTest.css';
import logoImage from '../assets/logo.png';

const NeglectTest = () => {
  const [markedPositions, setMarkedPositions] = useState([]);
  const [testCompleted, setTestCompleted] = useState(false);
  const [results, setResults] = useState(null);

  // Genera le linee una sola volta all'inizio
  const lines = useMemo(() => {
    const generatedLines = [];
    for (let i = 0; i < 10; i++) {
      const line = [];
      for (let j = 0; j < 40; j++) {
        line.push(Math.random() < 0.5 ? 'H' : 'M');
      }
      generatedLines.push(line);
    }
    return generatedLines;
  }, []); // Array vuoto significa che viene generato solo una volta

  const handleLetterClick = (lineIndex, letterIndex) => {
    setMarkedPositions(prev => [...prev, `${lineIndex}-${letterIndex}`]);
  };

  const handleComplete = () => {
    setTestCompleted(true);
    calculateResults();
  };

  const calculateResults = () => {
    let totalH = 0;
    let markedH = 0;
    let markedHLeft = 0;
    let markedHRight = 0;

    // Conta le H totali e quelle marcate
    lines.forEach((line, lineIndex) => {
      line.forEach((letter, letterIndex) => {
        if (letter === 'H') {
          totalH++;
          if (markedPositions.includes(`${lineIndex}-${letterIndex}`)) {
            markedH++;
            // Determina se è a sinistra o destra
            if (letterIndex < 20) {
              markedHLeft++;
            } else {
              markedHRight++;
            }
          }
        }
      });
    });

    const difference = Math.abs(markedHRight - markedHLeft);
    let neglectLevel = '';
    
    if (difference === 0) {
      neglectLevel = 'Neglect non evidenziabile';
    } else if (difference <= 2) {
      neglectLevel = 'Neglect lieve';
    } else if (difference <= 4) {
      neglectLevel = 'Neglect moderato';
    } else if (difference <= 6) {
      neglectLevel = 'Neglect significativo';
    } else if (difference <= 8) {
      neglectLevel = 'Neglect severo';
    } else {
      neglectLevel = 'Neglect grave';
    }

    setResults({
      totalH,
      markedH,
      markedHLeft,
      markedHRight,
      difference,
      markedPercentage: (markedH / totalH) * 100,
      neglectLevel
    });
  };

  const renderTest = () => {
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
                      : testCompleted && letter === 'H' && !markedPositions.includes(`${lineIndex}-${letterIndex}`)
                      ? 'unmarked'
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
      <div className="results">
        <h2>Risultati del Test</h2>
        <p>Lettere H totali: {results.totalH}</p>
        <p>Lettere H evidenziate: {results.markedH}</p>
        <p>Lettere H non evidenziate: {results.totalH - results.markedH}</p>
        <p>Percentuale di lettere H evidenziate: {results.markedPercentage.toFixed(1)}%</p>
        <p>Differenza tra H evidenziate a destra e sinistra: {results.difference}</p>
        <div className="neglect-level">
          <h3>Livello di Negligenza Spaziale:</h3>
          <p>{results.neglectLevel}</p>
        </div>
        <div className="legend">
          <div className="legend-item">
            <span className="legend-color marked"></span>
            <span>H Evidenziate</span>
          </div>
          <div className="legend-item">
            <span className="legend-color unmarked"></span>
            <span>H Non Evidenziate</span>
          </div>
        </div>
        <button onClick={() => window.location.reload()}>Ripeti Test</button>
      </div>
    );
  };

  return (
    <>
      {renderTest()}
      {testCompleted && renderResults()}
    </>
  );
};

export default NeglectTest;
