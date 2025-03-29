//import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const NeglectTest = () => {
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [lines, setLines] = useState([]);
  const [clickedLetters, setClickedLetters] = useState([]);
  const [missedLetters, setMissedLetters] = useState([]);
  const [allHPositions, setAllHPositions] = useState([]);
  const [resultData, setResultData] = useState({
    date: '',
    totalH: 0,
    clickedH: 0,
    missedH: 0,
    percentage: 0,
    leftMissed: 0,
    rightMissed: 0,
    neglectSide: ''
  });

  // Generate test with M's and H's
  const generateTest = () => {
    const newLines = [];
    const newAllHPositions = [];
    const currentDate = new Date().toLocaleString();
    
    // Number of lines
    const numLines = 10;
    // Letters per line (increased for wider coverage)
    const lineLength = 80;
    
    // Generate balanced distribution of H's
    let totalH = 0;
    
    for (let i = 0; i < numLines; i++) {
      const line = [];
      const midpoint = lineLength / 2;
      
      // Ensure there are H's on both sides
      const leftSideHCount = Math.floor(Math.random() * 3) + 1; // 1-3 H's on left
      const rightSideHCount = Math.floor(Math.random() * 3) + 1; // 1-3 H's on right
      
      const leftPositions = [];
      const rightPositions = [];
      
      // Generate positions for left side
      for (let j = 0; j < leftSideHCount; j++) {
        let pos;
        do {
          pos = Math.floor(Math.random() * midpoint);
        } while (leftPositions.includes(pos));
        leftPositions.push(pos);
      }
      
      // Generate positions for right side
      for (let j = 0; j < rightSideHCount; j++) {
        let pos;
        do {
          pos = midpoint + Math.floor(Math.random() * midpoint);
        } while (rightPositions.includes(pos));
        rightPositions.push(pos);
      }
      
      // Ensure some H's are at extreme edges (within first/last 10%)
      const extremeLeftPos = Math.floor(Math.random() * (lineLength * 0.1));
      const extremeRightPos = lineLength - 1 - Math.floor(Math.random() * (lineLength * 0.1));
      
      if (!leftPositions.includes(extremeLeftPos)) {
        leftPositions.push(extremeLeftPos);
      }
      
      if (!rightPositions.includes(extremeRightPos)) {
        rightPositions.push(extremeRightPos);
      }
      
      const allPositions = [...leftPositions, ...rightPositions];
      
      // Fill the line with M's and H's
      for (let j = 0; j < lineLength; j++) {
        if (allPositions.includes(j)) {
          line.push({ id: `${i}-${j}`, char: 'H', position: j, clicked: false });
          newAllHPositions.push(`${i}-${j}`);
          totalH++;
        } else {
          line.push({ id: `${i}-${j}`, char: 'M', position: j, clicked: false });
        }
      }
      
      newLines.push(line);
    }
    
    setLines(newLines);
    setAllHPositions(newAllHPositions);
    setResultData(prev => ({
      ...prev,
      date: currentDate,
      totalH: totalH
    }));
  };

  // Handle click on a letter
  const handleLetterClick = (lineIndex, letterIndex) => {
    if (testCompleted) return;
    
    const updatedLines = [...lines];
    const letter = updatedLines[lineIndex][letterIndex];
    
    if (letter.char === 'H' && !letter.clicked) {
      letter.clicked = true;
      setClickedLetters(prev => [...prev, letter.id]);
    }
    
    setLines(updatedLines);
  };

  // Start the test
  const startTest = () => {
    setTestStarted(true);
    setTestCompleted(false);
    setClickedLetters([]);
    setMissedLetters([]);
    generateTest();
  };

  // Complete the test and generate results
  const completeTest = () => {
    setTestCompleted(true);
    
    // Calculate missed H's
    const missed = allHPositions.filter(id => !clickedLetters.includes(id));
    setMissedLetters(missed);
    
    // Count left and right missed
    let leftMissed = 0;
    let rightMissed = 0;
    
    missed.forEach(id => {
      const [lineIndex, letterIndex] = id.split('-').map(Number);
      const position = lines[lineIndex][letterIndex].position;
      
      if (position < lines[lineIndex].length / 2) {
        leftMissed++;
      } else {
        rightMissed++;
      }
    });
    
    // Calculate results
    const clickedCount = clickedLetters.length;
    const totalH = allHPositions.length;
    const missedCount = missed.length;
    const percentage = Math.round((clickedCount / totalH) * 100);
    
    // Determine neglect side
    let neglectSide = 'Nessun neglect rilevato';
    if (leftMissed > rightMissed + 2) {
      neglectSide = 'Neglect a SINISTRA';
    } else if (rightMissed > leftMissed + 2) {
      neglectSide = 'Neglect a DESTRA';
    }
    
    setResultData({
      date: resultData.date,
      totalH: totalH,
      clickedH: clickedCount,
      missedH: missedCount,
      percentage: percentage,
      leftMissed: leftMissed,
      rightMissed: rightMissed,
      neglectSide: neglectSide
    });
  };

  // Reset the test
  const resetTest = () => {
    setTestStarted(false);
    setTestCompleted(false);
    setLines([]);
    setClickedLetters([]);
    setMissedLetters([]);
  };

  // Generate Google Sheets formula
  const generateSheetsFormula = () => {
    return `=SPLIT("${resultData.date}|${resultData.totalH}|${resultData.clickedH}|${resultData.missedH}|${resultData.percentage}%|${resultData.leftMissed}|${resultData.rightMissed}|${resultData.neglectSide}", "|")`;
  };

  return (
    <div className="flex flex-col items-center w-full">
      <Card className="w-full max-w-6xl">
        <CardHeader>
          <CardTitle className="text-xl text-center">Test di Neglect Visivo</CardTitle>
        </CardHeader>
        <CardContent>
          {!testStarted ? (
            <div className="flex flex-col items-center gap-4">
              <p>Clicca su "Inizia Test" per avviare il test di neglect visivo.</p>
              <p>Istruzioni: Cerca tutte le lettere "H" nascoste tra le "M" e clicca su di esse.</p>
              <Button onClick={startTest} className="mt-4">Inizia Test</Button>
            </div>
          ) : (
            <div>
              {!testCompleted ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="font-mono text-sm w-full overflow-x-auto">
                    {lines.map((line, lineIndex) => (
                      <div key={lineIndex} className="mb-1 whitespace-nowrap">
                        {line.map((letter, letterIndex) => (
                          <span
                            key={letter.id}
                            className={`cursor-pointer ${letter.char === 'H' && letter.clicked ? 'text-red-600 font-bold' : ''}`}
                            onClick={() => handleLetterClick(lineIndex, letterIndex)}
                          >
                            {letter.char}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                  <Button onClick={completeTest} className="mt-6">Completa Test</Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <h3 className="text-lg font-bold">Risultati del Test</h3>
                  <div className="font-mono text-sm w-full overflow-x-auto">
                    {lines.map((line, lineIndex) => (
                      <div key={lineIndex} className="mb-1 whitespace-nowrap">
                        {line.map((letter, letterIndex) => (
                          <span
                            key={letter.id}
                            className={`
                              ${letter.char === 'H' && letter.clicked ? 'text-red-600 font-bold' : ''}
                              ${letter.char === 'H' && missedLetters.includes(letter.id) ? 'bg-yellow-300' : ''}
                            `}
                          >
                            {letter.char}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gray-100 p-4 rounded-md w-full max-w-lg mt-4">
                    <h3 className="text-lg font-semibold mb-2">Report</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>Data:</div><div>{resultData.date}</div>
                      <div>Totale H:</div><div>{resultData.totalH}</div>
                      <div>H trovate:</div><div>{resultData.clickedH}</div>
                      <div>H mancate:</div><div>{resultData.missedH}</div>
                      <div>Percentuale di successo:</div><div>{resultData.percentage}%</div>
                      <div>H mancate a sinistra:</div><div>{resultData.leftMissed}</div>
                      <div>H mancate a destra:</div><div>{resultData.rightMissed}</div>
                      <div>Diagnosi:</div><div className="font-bold">{resultData.neglectSide}</div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-semibold mb-1">Codice per Google Sheets:</h4>
                      <div className="bg-white p-2 border rounded overflow-x-auto">
                        <code>{generateSheetsFormula()}</code>
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={resetTest} className="mt-4">Nuovo Test</Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NeglectTest;
