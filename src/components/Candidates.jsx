import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation, useNavigate
import { db } from '../firebase'; // Firestore

const Candidates = () => {
  const [candidatesByPosition, setCandidatesByPosition] = useState({}); // Store grouped candidates by position
  const [votedCandidateId, setVotedCandidateId] = useState(null); // Track voted candidate
  const navigate = useNavigate(); // Use navigate hook to redirect
  const location = useLocation();
  const { userId } = location.state; // Get userId from Login

  useEffect(() => {
    const fetchCandidates = async () => {
      const candidatesCollection = collection(db, 'candidates');
      const candidatesSnapshot = await getDocs(candidatesCollection);

      // Group candidates by position
      const candidatesList = candidatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const groupedCandidates = candidatesList.reduce((acc, candidate) => {
        const { position } = candidate;
        if (!acc[position]) {
          acc[position] = [];
        }
        acc[position].push(candidate);
        return acc;
      }, {});

      setCandidatesByPosition(groupedCandidates); // Store the grouped candidates
    };

    fetchCandidates();
  }, []);

  const handleVote = async (candidateId, currentVotes) => {
    try {
      const candidateRef = doc(db, 'candidates', candidateId);
      const userRef = doc(db, 'users', userId);

      const newVotes = isNaN(currentVotes) ? 1 : currentVotes + 1;

      // Update votes in Firestore
      await updateDoc(candidateRef, {
        votes: newVotes,
      });

      // Mark user as voted
      await updateDoc(userRef, {
        voted: true,
      });

      setVotedCandidateId(candidateId);
      alert('Vote cast successfully!');
      navigate('/home'); // Redirect to home
    } catch (error) {
      console.error('Error casting vote: ', error);
      alert('Failed to cast vote. Please try again.');
    }
  };

  return (
    <div className="candidates-container">
      <h2 className="candidates-header">Candidates List</h2>
      {/* Iterate over positions and candidates */}
      {Object.entries(candidatesByPosition).map(([position, candidates]) => (
        <div key={position} className="position-section">
          <h3 className="position-title">{position}</h3> {/* Display position heading */}
          <ul className="candidates-list">
            {candidates.map(candidate => (
              <li key={candidate.id} className="candidate-item">
                <span className="candidate-name">{candidate.name}</span>
                <button
                  className="vote-btn"
                  onClick={() => handleVote(candidate.id, candidate.votes)}
                  disabled={votedCandidateId === candidate.id} // Disable button if voted
                >
                  {votedCandidateId === candidate.id ? 'Voted' : 'Vote'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Candidates;
// group