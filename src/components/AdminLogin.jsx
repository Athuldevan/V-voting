import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure you import your initialized Firebase Firestore
import '../styles/AdminLogin.css';


const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = async () => {
    try {
      const q = query(
        collection(db, 'admins'),
        where('adminName', '==', username),
        where('adminPin', '==', password)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Credentials match, redirect to the admin dashboard page
        navigate('/admin/dashboard'); // Change to dashboard instead of results
      } else {
        // Invalid credentials
        setError('Invalid admin credentials.');
      }
    } catch (error) {
      console.error('Error during admin login: ', error);
      setError('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2 className="login-title">ADMIN LOGIN</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="input-container">
          <i className="fas fa-user icon"></i>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="login-input"
          />
        </div>
        <div className="input-container">
          <i className="fas fa-lock icon"></i>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="login-input"
          />
        </div>
        <div className="forgot-password">
          <a href="#">Lost Password?</a>
        </div>
        <button className="login-button" onClick={handleAdminLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
