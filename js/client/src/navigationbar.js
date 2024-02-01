import React from 'react';
import './App.css';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom


const NavigationBar = () => {
  return (
    <nav className="navbar">
        <div className="navbar-container">
            {/*<a href="#" className="navbar-item">Home</a>*/}
            <Link to="/" className="navbar-item">Home</Link>
            {/*<a href="#" className="navbar-item">Product</a>*/}
            <Link to="/SecondPage" className="navbar-item">Product</Link>
            <Link to="/About" className="navbar-item">About Us</Link>
            {/*<a href="#" className="navbar-item">About Us</a>*/}
        </div>
    </nav>
  );
};

export default NavigationBar;

