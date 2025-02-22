import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase';

const Candidates = () => {
  const [candidatesByPosition, setCandidatesByPosition] = useState({}); // Store grouped candidates by position
  const [votedPositions, setVotedPositions] = useState([]); // Track voted positions for the user
  const [loadingPositions, setLoadingPositions] = useState([]); // Track positions being voted on (for time lag prevention)
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state; // Get userId from Login

  useEffect(() => {
    // Fetch the user's voted positions
    const fetchUserData = async () => {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const { votedPositions = [] } = userDoc.data();
        setVotedPositions(votedPositions); // Set the voted positions
      }
    };

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

    fetchUserData();
    fetchCandidates();
  }, [userId]);

  const handleVote = async (candidateId, currentVotes, position) => {
    if (loadingPositions.includes(position)) return; // Prevent voting while a vote is being cast for the same position

    setLoadingPositions([...loadingPositions, position]); // Set position as loading

    try {
      const candidateRef = candidateId ? doc(db, 'candidates', candidateId) : null;
      const userRef = doc(db, 'users', userId);

      if (candidateId) {
        const newVotes = isNaN(currentVotes) ? 1 : currentVotes + 1;

        // Update votes in Firestore for the candidate if NOTA is not selected
        await updateDoc(candidateRef, {
          votes: newVotes,
        });
      }

      // Update the user's votedPositions field in Firestore
      await updateDoc(userRef, {
        votedPositions: [...votedPositions, position], // Add the position to the votedPositions array
      });

      setVotedPositions([...votedPositions, position]);
      setLoadingPositions(loadingPositions.filter(pos => pos !== position)); // Remove from loading state
    } catch (error) {
      console.error('Error casting vote: ', error);
      alert('Failed to cast vote. Please try again.');
      setLoadingPositions(loadingPositions.filter(pos => pos !== position)); // Remove from loading state on error
    }
  };

  const handleSubmit = () => {
    navigate('/home'); // Redirect to home after all votes are submitted
  };

  // Check if the user has voted for all positions
  const allVoted = Object.keys(candidatesByPosition).length === votedPositions.length;

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
                  onClick={() => handleVote(candidate.id, candidate.votes, position)}
                  disabled={votedPositions.includes(position) || loadingPositions.includes(position)} // Disable if already voted or vote is being cast
                >
                  {votedPositions.includes(position) ? 'Voted' : (loadingPositions.includes(position) ? 'Voting...' : 'Vote')}
                </button>
              </li>
            ))}
            {/* Add NOTA option */}
            <li className="candidate-item">
              <span className="candidate-name">NOTA</span>
              <button
                className="vote-btn"
                onClick={() => handleVote(null, null, position)} // Handle NOTA vote
                disabled={votedPositions.includes(position) || loadingPositions.includes(position)} // Disable if already voted or vote is being cast
              >
                {votedPositions.includes(position) ? 'Voted' : (loadingPositions.includes(position) ? 'Voting...' : 'Vote NOTA')}
              </button>
            </li>
          </ul>
        </div>
      ))}

      {/* Show Submit button only if all positions are voted */}
      {allVoted && (
        <button className="submit-btn" onClick={handleSubmit}>
          Submit Votes
        </button>
      )}
    </div>
  );
};

export default Candidates;
