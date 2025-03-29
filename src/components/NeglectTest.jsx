import React, { useState, useEffect } from 'react';
import './NeglectTest.css';

const NeglectTest = () => {
  const [markedPositions, setMarkedPositions] = useState(new Set());
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [results, setResults] = useState(null);

  // Genera 19 linee di M con 10 H su ogni lato
  const generateLines = () => {
    const lines = [];
    const totalLines = 19;
    const lettersPerLine = 50; // Numero di lettere per linea
    const hPositions = new Set();

    // Genera le posizioni delle H
    for (let line = 0; line < totalLines; line++) {
      // 10 H per lato
      for (let side = 0; side < 2; side++) {
        let position;
        do {
          position = Math.floor(Math.random() * lettersPerLine);
        } while (hPositions.has(`${line}-${position}`));
        hPositions.add(`${line}-${position}`);
      }
    }

    // Genera le linee
    for (let line = 0; line < totalLines; line++) {
      const lineContent = [];
      for (let pos = 0; pos < lettersPerLine; pos++) {
        lineContent.push({
          letter: hPositions.has(`${line}-${pos}`) ? 'H' : 'M',
          position: pos,
          line: line
        });
      }
      lines.push(lineContent);
    }

    return lines;
  };

  const [lines] = useState(generateLines());

  const handleLetterClick = (line, position) => {
    const key = `${line}-${position}`;
    setMarkedPositions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const calculateResults = () => {
    let totalH = 0;
    let foundH = 0;
    let leftH = 0;
    let rightH = 0;
    let foundLeftH = 0;
    let foundRightH = 0;

    lines.forEach((line, lineIndex) => {
      line.forEach((letter, position) => {
        if (letter.letter === 'H') {
          totalH++;
          if (position < 25) { // Lato sinistro
            leftH++;
            if (markedPositions.has(`${lineIndex}-${position}`)) {
              foundLeftH++;
            }
          } else { // Lato destro
            rightH++;
            if (markedPositions.has(`${lineIndex}-${position}`)) {
              foundRightH++;
            }
          }
          if (markedPositions.has(`${lineIndex}-${position}`)) {
            foundH++;
          }
        }
      });
    });

    const percentage = (foundH / totalH) * 100;
    const leftPercentage = (foundLeftH / leftH) * 100;
    const rightPercentage = (foundRightH / rightH) * 100;
    const difference = Math.abs(leftPercentage - rightPercentage);

    let neglectLevel = '';
    if (difference < 10) {
      neglectLevel = 'Nessun neglect evidente';
    } else if (difference < 20) {
      neglectLevel = 'Neglect lieve';
    } else if (difference < 30) {
      neglectLevel = 'Neglect moderato';
    } else {
      neglectLevel = 'Neglect evidente';
    }

    return {
      totalH,
      foundH,
      percentage,
      leftH,
      rightH,
      foundLeftH,
      foundRightH,
      leftPercentage,
      rightPercentage,
      difference,
      neglectLevel
    };
  };

  const handleComplete = () => {
    const results = calculateResults();
    setResults(results);
    setIsTestComplete(true);
  };

  if (isTestComplete) {
    return (
      <div className="test-container">
        <h2>Test Completato</h2>
        <div className="results">
          <p>H Totali: {results.totalH}</p>
          <p>H Identificate: {results.foundH}</p>
          <p>Percentuale di Identificazione: {results.percentage.toFixed(1)}%</p>
          <p>Lato Sinistro: {results.foundLeftH}/{results.leftH} ({results.leftPercentage.toFixed(1)}%)</p>
          <p>Lato Destro: {results.foundRightH}/{results.rightH} ({results.rightPercentage.toFixed(1)}%)</p>
          <p>Differenza tra i Lati: {results.difference.toFixed(1)}%</p>
          <p className="neglect-level">Livello di Neglect: {results.neglectLevel}</p>
        </div>
        <button onClick={() => window.location.reload()}>Ripeti il Test</button>
      </div>
    );
  }

  return (
    <div className="test-container">
      <h2>Test di Neglect</h2>
      <div className="lines-container">
        {lines.map((line, lineIndex) => (
          <div key={lineIndex} className="line">
            {line.map((letter, position) => (
              <span
                key={`${lineIndex}-${position}`}
                className={`letter ${markedPositions.has(`${lineIndex}-${position}`) ? 'marked' : ''}`}
                onClick={() => handleLetterClick(lineIndex, position)}
              >
                {letter.letter}
              </span>
            ))}
          </div>
        ))}
      </div>
      <button onClick={handleComplete} className="complete-button">
        Completa il Test
      </button>
    </div>
  );
};

export default NeglectTest;
