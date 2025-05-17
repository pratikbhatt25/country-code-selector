import React from 'react';
import logo from './logo.svg';
import './App.css';
import { CountryCodeSelector } from './components/CountryCodeSelector';

function App() {
  return (
    <div className="App">
    
      <h1 style={{textAlign: 'center'}}>Country Code Selector</h1>
      <CountryCodeSelector />
    
    </div>
  );
}

export default App;
