import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomeScreen.css'; // Import the CSS file for styles

const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="content-wrapper">
        <h1 className="title">
          Welcome to <span className="highlight">v voting</span> App
        </h1>
        <p className="subtitle">Cast your vote with ease, fairness, and transparency!</p>
        <div className="button-group">
          <button className="home-btn" onClick={() => navigate('/login')}>
            User Login
          </button>
          <button className="home-btn" onClick={() => navigate('/admin/login')}>
            Admin Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
