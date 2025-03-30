import React, { useState, useMemo, useEffect, useRef } from 'react';
import './NeglectTest.css';
import logoImage from '../assets/logo.png';

const NeglectTest = () => {
  const [lines, setLines] = useState([]);
  const [markedLetters, setMarkedLetters] = useState({});
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [results, setResults] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const resultsRef = useRef(null);
  const logoImage = '/logo.png';

  // Genera le linee una sola volta all'inizio
  useEffect(() => {
    const generatedLines = [];
    
    // Creiamo una matrice 10x40 piena di 'M'
    for (let i = 0; i < 10; i++) {
      const line = new Array(40).fill('M');
      generatedLines.push(line);
    }

    // Definiamo i quadranti (5 righe x 4 colonne)
    const quadrants = [];
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 4; col++) {
        quadrants.push({ row, col });
      }
    }
    
    // Mescoliamo i quadranti
    for (let i = quadrants.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [quadrants[i], quadrants[j]] = [quadrants[j], quadrants[i]];
    }
    
    // Selezioniamo 10 quadranti per il lato sinistro e 10 per il destro
    const leftQuadrants = quadrants.filter(q => q.col < 2).slice(0, 10);
    const rightQuadrants = quadrants.filter(q => q.col >= 2).slice(0, 10);
    
    // Per ogni quadrante, posizioniamo una H in una posizione casuale all'interno del quadrante
    [...leftQuadrants, ...rightQuadrants].forEach(({ row, col }) => {
      // Calcoliamo i limiti del quadrante
      const startRow = row * 2; // Ogni quadrante occupa 2 righe
      const startCol = col * 10; // Ogni quadrante occupa 10 colonne
      
      // Generiamo una posizione casuale all'interno del quadrante
      const randomRow = startRow + Math.floor(Math.random() * 2);
      const randomCol = startCol + Math.floor(Math.random() * 10);
      
      generatedLines[randomRow][randomCol] = 'H';
    });
    
    setLines(generatedLines);
  }, []);

  // Aggiorna il timer ogni secondo
  useEffect(() => {
    let interval;
    if (testStarted && !testCompleted) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [testStarted, testCompleted]);

  const handleStartTest = () => {
    setTestStarted(true);
    setStartTime(Date.now());
  };

  const handleLetterClick = (lineIndex, letterIndex) => {
    if (!testStarted) return;
    setMarkedLetters(prev => ({
      ...prev,
      [lineIndex]: {
        ...prev[lineIndex],
        [letterIndex]: !prev[lineIndex]?.[letterIndex]
      }
    }));
  };

  const handleComplete = () => {
    const endTime = Date.now();
    const timeElapsed = Math.floor((endTime - startTime) / 1000);
    
    let markedHLeft = 0;
    let markedHRight = 0;
    
    // Calcola le H marcate per lato
    lines.forEach((line, lineIndex) => {
      line.forEach((letter, letterIndex) => {
        if (letter === 'H' && markedLetters[lineIndex]?.[letterIndex]) {
          if (letterIndex < 20) {
            markedHLeft++;
          } else {
            markedHRight++;
          }
        }
      });
    });

    const markedPercentageLeft = (markedHLeft / 10) * 100;
    const markedPercentageRight = (markedHRight / 10) * 100;
    const difference = Math.abs(markedPercentageLeft - markedPercentageRight);
    
    let neglectLevel = '';
    let diagnosis = '';
    let diagnosisClass = '';

    if (difference < 10) {
      neglectLevel = 'Nessun Neglect';
      diagnosis = 'Non si evidenzia neglect spaziale unilaterale. La performance è bilanciata tra i due emicampi.';
      diagnosisClass = 'no-neglect';
    } else if (difference < 20) {
      neglectLevel = 'Neglect Lieve';
      diagnosis = `Si evidenzia un neglect spaziale unilaterale di grado lieve ${markedPercentageLeft < markedPercentageRight ? 'a sinistra' : 'a destra'}. La differenza tra i due emicampi è moderata.`;
      diagnosisClass = 'mild-neglect';
    } else if (difference < 30) {
      neglectLevel = 'Neglect Moderato';
      diagnosis = `Si evidenzia un neglect spaziale unilaterale di grado moderato ${markedPercentageLeft < markedPercentageRight ? 'a sinistra' : 'a destra'}. La differenza tra i due emicampi è significativa.`;
      diagnosisClass = 'moderate-neglect';
    } else {
      neglectLevel = 'Neglect Grave';
      diagnosis = `Si evidenzia un neglect spaziale unilaterale di grado grave ${markedPercentageLeft < markedPercentageRight ? 'a sinistra' : 'a destra'}. La differenza tra i due emicampi è molto significativa.`;
      diagnosisClass = 'severe-neglect';
    }

    setResults({
      markedHLeft,
      markedHRight,
      markedPercentageLeft,
      markedPercentageRight,
      difference: `${difference.toFixed(1)}%`,
      neglectLevel,
      diagnosis,
      diagnosisClass,
      timeElapsed
    });
    
    setTestCompleted(true);
    
    // Scroll verso i risultati dopo un breve delay per assicurarsi che siano stati renderizzati
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleRestart = () => {
    setTestStarted(false);
    setTestCompleted(false);
    setResults(null);
    setMarkedLetters({});
    setCurrentTime(0);
  };

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderTest = () => (
    <div className="test-container">
      <img 
        src={logoImage} 
        alt="Logo" 
        className="logo"
      />
      {!testStarted && (
        <div className="start-banner">
          <p>Marca tutte le lettere H che vedi</p>
          <button className="start-button" onClick={handleStartTest}>
            Inizia Test
          </button>
        </div>
      )}
      {testStarted && (
        <div className="timer">
          Tempo: {formatTime(currentTime)}
        </div>
      )}
      <div className="lines-container">
        {lines.map((line, lineIndex) => (
          <div key={lineIndex} className="line">
            {line.map((letter, letterIndex) => (
              <div
                key={letterIndex}
                className={`letter ${markedLetters[lineIndex]?.[letterIndex] ? 'marked' : ''} ${testCompleted && letter === 'H' && !markedLetters[lineIndex]?.[letterIndex] ? 'unmarked' : ''} ${!testStarted ? 'disabled' : ''}`}
                onClick={() => handleLetterClick(lineIndex, letterIndex)}
              >
                {letter}
              </div>
            ))}
          </div>
        ))}
      </div>
      {testStarted && (
        <button className="complete-button" onClick={handleComplete}>
          Completa Test
        </button>
      )}
    </div>
  );

  const renderResults = () => {
    if (!results) return null;
    
    return (
      <div className="results-container" ref={resultsRef}>
        <img 
          src={logoImage} 
          alt="Logo" 
          className="logo"
        />
        <h2>Risultati del Test</h2>
        <div className="results-grid">
          <div className="result-item">
            <h3>Lato Sinistro</h3>
            <p>H marcate: {results.markedHLeft}/10</p>
            <p>Percentuale: {results.markedPercentageLeft.toFixed(1)}%</p>
          </div>
          <div className="result-item">
            <h3>Lato Destro</h3>
            <p>H marcate: {results.markedHRight}/10</p>
            <p>Percentuale: {results.markedPercentageRight.toFixed(1)}%</p>
          </div>
          <div className="result-item">
            <h3>Differenza</h3>
            <p>{results.difference}</p>
          </div>
          <div className="result-item">
            <h3>Tempo Impiegato</h3>
            <p>{formatTime(results.timeElapsed)}</p>
          </div>
        </div>
        <div className={`diagnosis ${results.diagnosisClass}`}>
          <h3>Diagnosi</h3>
          <p>{results.diagnosis}</p>
        </div>
        <button className="complete-button" onClick={handleRestart}>
          Ripeti Test
        </button>
      </div>
    );
  };

  return (
    <div className="neglect-test">
      {renderTest()}
      {testCompleted && renderResults()}
    </div>
  );
};

export default NeglectTest;
