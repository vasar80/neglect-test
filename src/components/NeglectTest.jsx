import React, { useState } from 'react';
import './NeglectTest.css';
import logoImage from '../assets/logo.png';

const NeglectTest = () => {
  const [markedPositions, setMarkedPositions] = useState([]);
  const [testCompleted, setTestCompleted] = useState(false);
  const [results, setResults] = useState(null);
  const lines = generateLines(); // Spostato fuori dal render per evitare il rimescolamento

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
    const totalHLetters = lines.flat().filter(letter => letter === 'H').length;
    const markedHLetters = markedPositions.filter(pos => {
      const [lineIndex, letterIndex] = pos.split('-').map(Number);
      return lines[lineIndex][letterIndex] === 'H';
    }).length;
    const unmarkedHLetters = totalHLetters - markedHLetters;

    const markedRight = markedPositions.filter(pos => {
      const [lineIndex, letterIndex] = pos.split('-').map(Number);
      return letterIndex >= 20 && lines[lineIndex][letterIndex] === 'H';
    }).length;

    const markedLeft = markedPositions.filter(pos => {
      const [lineIndex, letterIndex] = pos.split('-').map(Number);
      return letterIndex < 20 && lines[lineIndex][letterIndex] === 'H';
    }).length;

    const differenceRightLeft = Math.abs(markedRight - markedLeft);

    let neglectLevel = '';
    if (differenceRightLeft === 10) {
      neglectLevel = 'Neglect Grave';
    } else if (differenceRightLeft === 0) {
      neglectLevel = 'Neglect non evidenziabile';
    } else if (differenceRightLeft <= 3) {
      neglectLevel = 'Neglect Lieve';
    } else if (differenceRightLeft <= 7) {
      neglectLevel = 'Neglect Moderato';
    } else {
      neglectLevel = 'Neglect Significativo';
    }

    setResults({
      markedHLetters,
      unmarkedHLetters,
      markedRight,
      markedLeft,
      neglectLevel,
      differenceRightLeft,
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
        <h1>Test per Neglect: Cancellazione di lettere H</h1>
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
        <h1>Test per Neglect: Cancellazione di lettere H</h1>
        <div className="lines-container">
          {lines.map((line, lineIndex) => (
            <div key={lineIndex} className="line">
              {line.map((letter, letterIndex) => (
                <span
                  key={letterIndex}
                  className={`letter ${
                    markedPositions.includes(`${lineIndex}-${letterIndex}`)
                      ? 'marked'
                      : !markedPositions.includes(`${lineIndex}-${letterIndex}`) && letter === 'H'
                      ? 'unmarked'
                      : ''
                  }`}
                >
                  {letter}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="results">
          <h2>Risultati del Test</h2>
          <p>Lettere H evidenziate: {results.markedHLetters}</p>
          <p>Lettere H non evidenziate: {results.unmarkedHLetters}</p>
          <p>Lettere H evidenziate a destra: {results.markedRight}</p>
          <p>Lettere H evidenziate a sinistra: {results.markedLeft}</p>
          <div className="neglect-level">
            <h3>Livello di Neglect:</h3>
            <p>{results.neglectLevel}</p>
          </div>
          <button onClick={() => window.location.reload()}>Ripeti Test</button>
        </div>
      </div>
    );
  };

  return testCompleted ? renderResults() : renderTest();
};

export default NeglectTest;
