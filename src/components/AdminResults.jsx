// src/components/AdminResults.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

const AdminResults = () => {
  const [view, setView] = useState('results'); // 'results' or 'allocate'
  const [results, setResults] = useState([]);
  const [newCandidate, setNewCandidate] = useState({
    name: '',
    position: '',
    votes: 0,
    isCommon: false,
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch results from Firebase
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

  // Handle candidate allocation
  const handleCandidateAllocation = async () => {
    try {
      await addDoc(collection(db, 'candidates'), newCandidate);
      setSuccessMessage('Candidate allocated successfully!');
      setError('');
      setNewCandidate({ name: '', position: '', votes: 0, isCommon: false });
    } catch (error) {
      setError('Error allocating candidate.');
      setSuccessMessage('');
      console.error('Error allocating candidate: ', error);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {/* Buttons to switch between views */}
      <div>
        <button onClick={() => setView('results')}>View Results</button>
        <button onClick={() => setView('allocate')}>Allocate Candidate</button>
      </div>

      {/* Conditionally render based on selected view */}
      {view === 'results' ? (
        <div>
          <h3>Election Results</h3>
          <ul>
            {results.map((result, index) => (
              <li key={index}>
                {result.name}: {result.votes} votes
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          <h3>Allocate New Candidate</h3>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          <input
            type="text"
            placeholder="Candidate Name"
            value={newCandidate.name}
            onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Candidate Position"
            value={newCandidate.position}
            onChange={(e) => setNewCandidate({ ...newCandidate, position: e.target.value })}
          />
          <input
            type="number"
            placeholder="Votes (optional, default is 0)"
            value={newCandidate.votes}
            onChange={(e) => setNewCandidate({ ...newCandidate, votes: e.target.value })}
          />
          <label>
            Common Candidate:
            <input
              type="checkbox"
              checked={newCandidate.isCommon}
              onChange={(e) => setNewCandidate({ ...newCandidate, isCommon: e.target.checked })}
            />
          </label>
          <button onClick={handleCandidateAllocation}>Allocate Candidate</button>
        </div>
      )}
    </div>
  );
};

export default AdminResults;
