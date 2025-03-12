import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure your Firebase config is imported
import '../styles/AllocateCandidates.css'; // Import the CSS file

const AllocateCandidate = () => {
  const [candidateName, setCandidateName] = useState('');
  const [position, setPosition] = useState('');
  const [isCommon, setIsCommon] = useState(false);
  const [year, setYear] = useState('');
  const [showModal, setShowModal] = useState(false); // For showing the modal

  // Year options for dropdown (number format)
  const yearOptions = [1, 2, 3, 4];

  // Function to handle allocation after confirmation
  const handleAllocate = async (e) => {
    e.preventDefault();

    // Validate input
    if (!candidateName || !position) {
      alert('Please fill all fields');
      return;
    }

    // Show confirmation modal
    setShowModal(true);
  };

  // Function to proceed with the allocation after confirmation
  const allocateConfirmed = async () => {
    try {
      await addDoc(collection(db, 'candidates'), {
        name: candidateName,
        position: position,
        isCommon: isCommon,
        year: isCommon ? null : Number(year), // Ensure the year is stored as a number
        votes: 0, // Initialize votes to 0
      });

      // Reset the form after successful allocation
      setCandidateName('');
      setPosition('');
      setIsCommon(false);
      setYear('');
      setShowModal(false); // Close the modal

      // Success notification (you can replace this with a better UI notification)
      alert('Candidate allocated successfully');
    } catch (error) {
      console.error('Error allocating candidate: ', error);
      alert('Error allocating candidate. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2 className="header">Allocate Candidate</h2>
      <form onSubmit={handleAllocate} className="form">
        <div className="formGroup">
          <label htmlFor="candidateName" className="label">Candidate Name:</label>
          <input
            type="text"
            id="candidateName"
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            className="input"
            required
          />
        </div>

        <div className="formGroup">
          <label htmlFor="position" className="label">Position:</label>
          <input
            type="text"
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="input"
            required
          />
        </div>

        <div className="checkboxGroup">
          <label className="checkboxLabel">
            <input
              type="checkbox"
              checked={isCommon}
              onChange={(e) => setIsCommon(e.target.checked)}
              className="checkbox"
            />
            Common Position
          </label>
        </div>

        {!isCommon && (
          <div className="formGroup">
            <label htmlFor="year" className="label">Year:</label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="select"
              required={!isCommon}
            >
              <option value="">Select Year</option>
              {yearOptions.map((yearOption) => (
                <option key={yearOption} value={yearOption}>
                  {yearOption} Year
                </option>
              ))}
            </select>
          </div>
        )}

        <button type="submit" className="button">Allocate Candidate</button>
      </form>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Are you sure you want to allocate this candidate?</p>
            <div className="modal-buttons">
              <button className="modal-button confirm" onClick={allocateConfirmed}>
                Yes
              </button>
              <button className="modal-button cancel" onClick={() => setShowModal(false)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllocateCandidate;
