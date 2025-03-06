import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Firestore instance
import '../styles/Results.css';

const Results = () => {
  const [positions, setPositions] = useState({}); // Store candidates by position

  useEffect(() => {
    const fetchResults = async () => {
      const candidatesCollection = collection(db, 'candidates');
      const candidateSnapshot = await getDocs(candidatesCollection);
      const candidateList = candidateSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));

      // Group candidates by position
      const groupedByPosition = candidateList.reduce((acc, candidate) => {
        const { position } = candidate;
        if (!acc[position]) {
          acc[position] = [];
        }
        acc[position].push(candidate);
        return acc;
      }, {});
      
      setPositions(groupedByPosition);
    };

    fetchResults();
  }, []);

  // Logic to handle draws
  const getWinnerForPosition = (candidates) => {
    const maxVotes = Math.max(...candidates.map(candidate => candidate.votes || 0)); // Find the highest number of votes
    const topCandidates = candidates.filter(candidate => (candidate.votes || 0) === maxVotes); // Get all candidates with max votes

    // If more than one candidate has the max votes, it's a draw
    if (topCandidates.length > 1) {
      return { draw: true, candidates: topCandidates };
    }

    // If only one candidate has the max votes, they are the winner
    return { draw: false, candidate: topCandidates[0] };
  };

  return (
    <div className="results-container">
      <h2>Election Results by Position</h2>
      <div className="positions-container"> {/* Flexbox container for positions */}
        {Object.keys(positions).map((position) => {
          const candidatesForPosition = positions[position];
          const result = getWinnerForPosition(candidatesForPosition); // Get winner or draw for each position

          return (
            <div key={position} className="position-card">
              <h3>{position}</h3> {/* Display Position as Heading */}
              <ul className="candidate-list">
                {candidatesForPosition.map((candidate) => (
                  <li key={candidate.id} className="candidate-item">
                    <span className="candidate-name">{candidate.name}</span>
                    <span className="candidate-votes">Votes: {candidate.votes || 0}</span>
                  </li>
                ))}
              </ul>

              {/* Display Result for this Position */}
              {result.draw ? (
                <div className="draw">
                  Draw between: {result.candidates.map(candidate => candidate.name).join(', ')} with {result.candidates[0].votes} votes!
                </div>
              ) : (
                <div className="winner">
                  Winner: {result.candidate.name} with {result.candidate.votes} votes!
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Results;
