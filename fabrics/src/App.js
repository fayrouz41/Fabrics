// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import logo from './logo.svg';
// import './App.css';
// import RegistrationPage from './pages/register';
// import LoginPage from './pages/login';

// function App() {
//   return (
//     <div className="App">
//       <RegistrationPage/>
//       <LoginPage/>
//     </div>
//   );
// }



// export default App;



import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import RegistrationPage from './pages/register';
import LoginPage from './pages/login';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<LoginPage />} /> {/* Default to Login */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
