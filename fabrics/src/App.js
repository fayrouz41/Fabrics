import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/navbar'; 
import Home from './pages/home'; 
import AddStock from './pages/addstock'; 
import CategoryPage from './pages/categoryPage';
import Cart from './components/cart';
import RegistrationPage from './pages/register'; 
import LoginPage from './pages/login'; 
import CheckoutPage from './components/checkout';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />

         
          <Route
            path="/home"
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
          />
          <Route
            path="/add-stock"
            element={
              <>
                <Navbar />
                <AddStock />
              </>
            }
          />

          <Route 
            path="/category/:category" 
            element={
              <>
              <Navbar />
              <CategoryPage />
              </>
            }
          />
          
          <Route
            path="/cart"
            element={
              <>
                <Navbar />
                <Cart />
              </>
            }
          />

          <Route
            path="/checkout"
            element={
              <>
                <Navbar />
                <CheckoutPage />
              </>
            }
          />

          
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
