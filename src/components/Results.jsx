import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Firestore instance

const Results = () => {
  const [candidates, setCandidates] = useState([]);
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

  const getWinnerForPosition = (candidates) => {
    return candidates.reduce((prev, current) => {
      return (current.votes || 0) > (prev.votes || 0) ? current : prev;
    });
  };

  return (
    <div className="results-container">
      <h2>Election Results by Position</h2>
      {Object.keys(positions).map((position) => {
        const candidatesForPosition = positions[position];
        const winner = getWinnerForPosition(candidatesForPosition); // Get winner for each position

        return (
          <div key={position} className="position-container">
            <h3>{position}</h3> {/* Display Position as Heading */}
            <ul>
              {candidatesForPosition.map((candidate) => (
                <li key={candidate.id}>
                  <span>{candidate.name}</span>
                  <span>Total Votes: {candidate.votes || 0}</span>
                </li>
              ))}
            </ul>

            {/* Display Winner for this Position */}
            {winner && (
              <div className="winner">
                Winner: {winner.name} with {winner.votes || 0} votes!
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Results;
