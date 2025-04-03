import React from 'react';
import BasicFlow from './components/BasicFlow'; // Make sure this path is correct
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>React Flow Testbed</h1>
      </header>
      <main className="app-content">
        <BasicFlow />
      </main>
    </div>
  );
}

export default App;