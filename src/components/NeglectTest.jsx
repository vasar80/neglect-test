import React, { useState, useEffect } from 'react';
import './NeglectTest.css';

const NeglectTest = () => {
  const [markedPositions, setMarkedPositions] = useState(new Set());
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [results, setResults] = useState(null);

  // Genera 10 linee di M con 10 H su ogni lato
  const generateLines = () => {
    const lines = [];
    const totalLines = 10;
    const lettersPerLine = 50; // Numero di lettere per linea
    const hPositions = new Set();

    // Genera le posizioni delle H
    for (let line = 0; line < totalLines; line++) {
      // 1 H per lato per ogni linea
      for (let side = 0; side < 2; side++) {
        let position;
        do {
          // Per il lato sinistro (0-24) o destro (25-49)
          position = side === 0 
            ? Math.floor(Math.random() * 25) // Lato sinistro
            : 25 + Math.floor(Math.random() * 25); // Lato destro
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

  const calculateResul
