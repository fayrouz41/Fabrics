import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import RegistrationPage from './pages/register';

function App() {
  return (
    <div className="App">
      <RegistrationPage/>
    </div>
  );
}

export default App;
