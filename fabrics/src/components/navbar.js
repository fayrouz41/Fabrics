import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';
import logo from '../styles/logofab.png'; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/home">
          <img src={logo} alt="Logo" className="navbar-logo-image" />
        </Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/cart">Cart</Link></li>
        <li><Link to="/search">Search</Link></li>
        <li><Link to="/add-stock">Add Stock</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
