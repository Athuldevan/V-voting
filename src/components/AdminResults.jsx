// src/components/AdminResults.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const AdminResults = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const candidatesSnapshot = await getDocs(collection(db, 'candidates'));
        const resultsList = candidatesSnapshot.docs.map(doc => ({
          name: doc.data().name,
          votes: doc.data().votes || 0, // Assuming each candidate has a 'votes' field
        }));
        setResults(resultsList);
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    fetchResults();
  }, []);

  return (
    <div>
      <h2>Election Results</h2>
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            {result.name}: {result.votes} votes
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminResults;
