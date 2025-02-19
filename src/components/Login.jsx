import React, { useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase'; // Firestore instance
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [hasVoted, setHasVoted] = useState(false); // Tracks if user has voted
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
          if (userData.voted) {
            setHasVoted(true); // User has already voted, so set hasVoted to true
          } else {
            // If the user has not voted, navigate to the candidates page and pass the user ID
            navigate('/candidates', { state: { userId: doc.id } });
          }
        });
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2>User Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {hasVoted ? (
        <p>You have already voted and cannot vote again.</p>
      ) : (
        <div>
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
      )}
    </div>
  );
};

export default Login;
