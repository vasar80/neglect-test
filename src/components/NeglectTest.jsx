import React, { useState } from 'react';
import './NeglectTest.css';
import logoImage from '../assets/logo.png';  // Questo è il percorso corretto

const NeglectTest = () => {
  // ... resto del codice invariato ...

  const renderTest = () => {
    const lines = generateLines();

    return (
      <div className="test-container">
        <img 
          src={logoImage} 
          alt="Logo" 
          className="logo"
        />
        {/* ... resto del codice ... */}
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
        {/* ... resto del codice ... */}
      </div>
    );
  };

  // ... resto del codice invariato ...
};

export default NeglectTest;
