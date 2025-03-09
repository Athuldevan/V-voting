import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore'; // Firebase Firestore imports
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { db } from '../firebase'; // Using Firestore initialized in firebase.js
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchCandidates = async () => {
      const querySnapshot = await getDocs(collection(db, "candidates"));

      let candidatesData = [];
      let totalVotesCount = 0;

      querySnapshot.forEach((doc) => {
        const candidate = doc.data();
        candidatesData.push(candidate);
        totalVotesCount += candidate.votes;
      });

      setCandidates(candidatesData);
      setTotalVotes(totalVotesCount);
    };

    fetchCandidates();
  }, []); // Run only once when the component is mounted

  // Function to handle modal visibility
  const toggleModal = () => {
    setShowModal(!showModal); // Toggle modal visibility
  };

  // Functions for buttons
  const handleViewResults = () => {
    navigate('/admin/results'); // Navigate to Results.jsx page
  };

  const handleAllocateCandidate = () => {
    navigate('/admin/allocate-candidate'); // Navigate to AllocateCandidate.jsx page
  };

  const handleAllocateUser = () => {
    navigate('/admin/allocate-user'); // Navigate to AllocateUser.jsx page
  };

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">Admin Dashboard</h2>
      <div className="dashboard-buttons">
        <button className="dashboard-btn" onClick={handleViewResults}>View Results</button>
        <button className="dashboard-btn" onClick={handleAllocateCandidate}>Allocate Candidate</button>
        
        {/* New button for Allocate User */}
        <button className="dashboard-btn" onClick={handleAllocateUser}>Allocate User</button>
        
        <button className="dashboard-btn" onClick={toggleModal}>Overview</button>
      </div>

      {/* Modal for overview */}
      {showModal && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Summary Overview</h3>
              <button className="close-modal" onClick={toggleModal}>X</button>
            </div>
            <div className="modal-body">
              <p><strong>Total Candidates:</strong> {candidates.length}</p>
              <p><strong>Total Common Candidates:</strong> {candidates.filter(c => c.isCommon).length}</p>
              <p><strong>Total Votes Cast:</strong> {totalVotes}</p>

              <h3>Voting Analytics</h3>
              <ul>
                {candidates.map((candidate, index) => (
                  <li key={index}>
                    {candidate.position}: <strong>{candidate.name}</strong> {candidate.votes} votes
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
