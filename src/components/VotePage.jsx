import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from '../firebase'; // Firestore instance

const VotePage = () => {
  const [candidatesByPosition, setCandidatesByPosition] = useState({}); // Store candidates by position
  const [votes, setVotes] = useState({}); // Track votes for each position
  const [hasVoted, setHasVoted] = useState(false); // Track if user has voted in all positions
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state; // Get userId from login or previous route

  // Fetch candidates from Firestore and group them by position
  useEffect(() => {
    const fetchCandidates = async () => {
      const candidatesCollection = collection(db, 'candidates');
      const candidatesSnapshot = await getDocs(candidatesCollection);

      const candidatesList = candidatesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Group candidates by position
      const groupedCandidates = candidatesList.reduce((acc, candidate) => {
        const { position } = candidate;
        if (!acc[position]) {
          acc[position] = [];
        }
        acc[position].push(candidate);
        return acc;
      }, {});

      setCandidatesByPosition(groupedCandidates); // Store grouped candidates
    };

    fetchCandidates();
  }, []);

  // Handle voting for a specific candidate
  const handleVote = (candidateId, position) => {
    // Update votes state to reflect that this position has been voted for
    setVotes((prevVotes) => ({
      ...prevVotes,
      [position]: candidateId,
    }));
  };

  // Check if all positions have been voted for
  const hasVotedAllPositions = () => {
    return (
      Object.keys(candidatesByPosition).length > 0 &&
      Object.keys(votes).length === Object.keys(candidatesByPosition).length
    );
  };

  // Submit the votes and mark the user as "voted" if all positions are filled
  const handleSubmitVote = async () => {
    try {
      // Check if all positions have been voted for
      if (hasVotedAllPositions()) {
        // Update the votes for each candidate in Firestore
        await Promise.all(
          Object.entries(votes).map(async ([position, candidateId]) => {
            const candidateRef = doc(db, 'candidates', candidateId);
            const candidateSnapshot = await candidateRef.get();
            const currentVotes = candidateSnapshot.data().votes || 0;

            await updateDoc(candidateRef, {
              votes: currentVotes + 1,
            });
          })
        );

        // Update the user document to mark as voted
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          voted: true,
        });

        setHasVoted(true);
        alert('Thank you! All votes cast successfully.');
        /navigate('/home'); // Redirect to home page after success
      } else {
        alert('Please vote for a candidate in each position before submitting.');
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('Failed to submit votes. Please try again.');
    }
  };

  return (
    <div className="vote-page-container">
      <h2 className="vote-page-header">Vote for Candidates</h2>
      {Object.entries(candidatesByPosition).map(([position, candidates]) => (
        <div key={position} className="position-section">
          <h3 className="position-title">{position}</h3>
          <ul className="candidates-list">
            {candidates.map((candidate) => (
              <li key={candidate.id} className="candidate-item">
                <span className="candidate-name">{candidate.name}</span>
                <button
                  className="vote-btn"
                  onClick={() => handleVote(candidate.id, position)}
                  disabled={votes[position] !== undefined} // Disable button if voted for this position
                >
                  {votes[position] === candidate.id ? 'Voted' : 'Vote'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {/* Submit vote button */}
      <button
        className="submit-vote-btn"
        onClick={handleSubmitVote}
        disabled={!hasVotedAllPositions()} // Disable if not all positions are voted for
      >
        Submit All Votes
      </button>
    </div>
  );
};

export default VotePage;
