import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import RegistrationPage from './pages/register';
import LoginPage from './pages/login';

function App() {
  return (
    <div className="App">
      {/* <RegistrationPage/> */}
      <LoginPage/>
    </div>
  );
}

export default App;
