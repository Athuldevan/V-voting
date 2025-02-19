// src/components/AdminLogin.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure you import your initialized Firebase Firestore

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = async () => {
    try {
      // Query the 'admins' collection
      const q = query(collection(db, 'admins'), where('adminName', '==', username), where('adminPin', '==', password));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Credentials match, redirect to the admin results page
        navigate('/admin/results');
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
    <div>
      <h2>Admin Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter Admin Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter Admin Password"
      />
      <button onClick={handleAdminLogin}>Login</button>
    </div>
  );
};

export default AdminLogin;
