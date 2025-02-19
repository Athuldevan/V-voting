import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation, useNavigate
import { db } from '../firebase'; // Firestore

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [votedCandidateId, setVotedCandidateId] = useState(null); // Track voted candidate
  const navigate = useNavigate(); // Use navigate hook to redirect
  const location = useLocation();
  const { userId } = location.state; // Get userId from Login

  useEffect(() => {
    const fetchCandidates = async () => {
      const candidatesCollection = collection(db, 'candidates');
      const candidatesSnapshot = await getDocs(candidatesCollection);
      const candidatesList = candidatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCandidates(candidatesList);
    };

    fetchCandidates();
  }, []);

  const handleVote = async (candidateId, currentVotes) => {
    try {
      const candidateRef = doc(db, 'candidates', candidateId);
      const userRef = doc(db, 'users', userId);

      // Ensure currentVotes is a valid number, if not, initialize it to 0
      const newVotes = isNaN(currentVotes) ? 1 : currentVotes + 1;

      // Update the votes field in Firestore
      await updateDoc(candidateRef, {
        votes: newVotes,
      });

      // Mark user as voted in the "users" collection
      await updateDoc(userRef, {
        voted: true, // Mark user as having voted
      });

      // Disable the button after voting
      setVotedCandidateId(candidateId);

      // Show success alert
      alert('Vote cast successfully!');

      // Navigate to HomeScreen
      navigate("/home");// Redirect after successful vote
    } catch (error) {
      console.error('Error casting vote: ', error);
      alert('Failed to cast vote. Please try again.');
    }
  };

  return (
    <div>
      <h2>Candidates List</h2>
      <ul>
        {candidates.map(candidate => (
          <li key={candidate.id} style={{ marginBottom: '10px' }}>
            <span>{candidate.name} - Votes: {candidate.votes || 0} </span>
            <button 
              onClick={() => handleVote(candidate.id, candidate.votes)} 
              disabled={votedCandidateId === candidate.id} // Disable button if already voted
            >
              {votedCandidateId === candidate.id ? 'Voted' : 'Vote'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Candidates;
