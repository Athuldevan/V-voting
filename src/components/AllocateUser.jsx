import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore'; // Firestore functions
import { db } from '../firebase'; // Firebase initialization
import '../styles/AllocateUser.css';

const AllocateUser = () => {
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [year, setYear] = useState(''); // Still a string here for input handling
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // New email state
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Submitting user details:', admissionNumber, year, name, email); // Debug log

      // Add user to Firestore
      await addDoc(collection(db, 'users'), {
        admissionNumber,
        year: Number(year), // Convert year to a number
        name,
        email, // Add email to Firestore
        votedPosition: [] // Automatically set as an empty array
      });

      // Reset form fields
      setAdmissionNumber('');
      setYear('');
      setName('');
      setEmail(''); // Reset email field
      setSuccessMessage('User added successfully!');
      setErrorMessage('');

      console.log('User added successfully');
    } catch (error) {
      console.error('Error adding user: ', error); // Debug error log
      setErrorMessage('Failed to add user. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="allocate-user">
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Admission Number</label>
          <input
            type="text"
            value={admissionNumber}
            onChange={(e) => setAdmissionNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Year</label>
          <input
            type="number" // Input type is number
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label> {/* New email input field */}
          <input
            type="email" // Input type email for validation
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add User</button>
      </form>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default AllocateUser;

