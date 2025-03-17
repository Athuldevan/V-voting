import React, { useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('admissionNumber', '==', admissionNumber), where('name', '==', name));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('Invalid admission number or name. Please try again.');
      } else {
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          const userId = doc.id;  // Get the userId from the doc ID
          if (userData.voted) {
            setError('You have already voted.');
          } else {
            // Navigate to Otpauth with email and userId
            navigate('/otpauth', { state: { email: userData.email, userId } });
          }
        });
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>User Login</h2>
      {error && <p className="error-message">{error}</p>}
      <input
        type="text"
        value={admissionNumber}
        onChange={(e) => setAdmissionNumber(e.target.value)}
        placeholder="Enter Admission Number"
      />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter Name"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
