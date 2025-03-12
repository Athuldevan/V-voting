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

  const getWinnerForPosition = (candidates) => {
    const maxVotes = Math.max(...candidates.map(candidate => candidate.votes || 0));
    const topCandidates = candidates.filter(candidate => (candidate.votes || 0) === maxVotes);

    if (topCandidates.length > 1) {
      return { draw: true, candidates: topCandidates };
    }
    return { draw: false, candidate: topCandidates[0] };
  };

  return (
    <div className="results-container">
      <h2 className="results-title">Election Results</h2>
      <div className="positions-wrapper">
        {Object.keys(positions).map((position) => {
          const candidatesForPosition = positions[position];
          const result = getWinnerForPosition(candidatesForPosition);

          return (
            <div key={position} className="position-card">
              <div className="position-header">
                <h3 className="position-title">{position}</h3>
              </div>
              <div className="position-body">
                <ul className="candidate-list">
                  {candidatesForPosition.map((candidate) => (
                    <li key={candidate.id} className="candidate-item">
                      <span className="candidate-name">{candidate.name}</span>
                      <span className="candidate-votes">{candidate.votes || 0} votes</span>
                    </li>
                  ))}
                </ul>
                {result.draw ? (
                  <div className="draw-info">
                    Draw between: {result.candidates.map(candidate => candidate.name).join(', ')} with {result.candidates[0].votes} votes!
                  </div>
                ) : (
                  <div className="winner-info">
                    Winner: <span className="winner-name">{result.candidate.name}</span> with {result.candidate.votes} votes!
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Results;
