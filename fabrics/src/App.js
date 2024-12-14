import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar'; // Import Navbar component
import Home from './pages/home'; // Import Home component
import AddStock from './pages/addstock'; // Import AddStock component
import Cart from './components/cart'; // Import Cart component
import RegistrationPage from './pages/register'; // Import Register component
import LoginPage from './pages/login'; // Import Login component

function App() {
  return (
    <Router>
      <div className="App">
        {/* Always display Navbar except for /register and /login */}
        <Routes>
          <Route
            path="*"
            element={
              window.location.pathname !== '/register' && window.location.pathname !== '/login' ? (
                <>
                  <Navbar />
                  <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/add-stock" element={<AddStock />} />
                    <Route path="/cart" element={<Cart />} />
                  </Routes>
                </>
              ) : (
                <>
                  <Routes>
                    <Route path="/register" element={<RegistrationPage />} />
                    <Route path="/login" element={<LoginPage />} />
                  </Routes>
                </>
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
