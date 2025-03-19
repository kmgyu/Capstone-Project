// src/App.js
import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import Slider from './components/Slider';
import Footer from './components/Footer';
import './css/App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <div className="container">
          <Hero />
          <Dashboard />
          <Slider />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;