import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Firestore instance

const Results = () => {
  const [candidates, setCandidates] = useState([]);
  const [winner, setWinner] = useState(null); // State to track the winner

  useEffect(() => {
    const fetchResults = async () => {
      const candidatesCollection = collection(db, 'candidates');
      const candidateSnapshot = await getDocs(candidatesCollection);
      const candidateList = candidateSnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));
      setCandidates(candidateList);

      // Calculate the winner based on the highest number of votes
      if (candidateList.length > 0) {
        const topCandidate = candidateList.reduce((prev, current) => {
          return prev.votes > current.votes ? prev : current;
        });
        setWinner(topCandidate); // Set the winner
      }
    };

    fetchResults();
  }, []);

  return (
    <div>
      <h2>Election Results</h2>
      <ul>
        {candidates.map((candidate, index) => (
          <li key={index}>
            {candidate.name} - Total Votes: {candidate.votes}
          </li>
        ))}
      </ul>

      {winner && (
        <div style={{ marginTop: '20px', color: 'green', fontWeight: 'bold' }}>
          <h3>Winner: {winner.name} with {winner.votes} votes!</h3>
        </div>
      )}
    </div>
  );
};

export default Results;
