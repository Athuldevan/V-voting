// src/components/HomeScreen.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to the Voting App</h1>
      <button onClick={() => navigate('/login')}>User Login</button>
      <button onClick={() => navigate('/admin/login')}>Admin Login</button>
    </div>
  );
};

export default HomeScreen;
