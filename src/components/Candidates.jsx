import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import '../styles/Candidate.css';

const Candidates = () => {
  const [candidatesByPosition, setCandidatesByPosition] = useState({});
  const [votedPositions, setVotedPositions] = useState([]);
  const [loadingPositions, setLoadingPositions] = useState([]);
  const [userYear, setUserYear] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId || null;

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const { votedPositions = [], year } = userDoc.data();
        setVotedPositions(votedPositions);
        setUserYear(year);
      }
    };

    const fetchCandidates = async () => {
      const candidatesCollection = collection(db, 'candidates');
      const candidatesSnapshot = await getDocs(candidatesCollection);
      const candidatesList = candidatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const filteredCandidates = candidatesList.filter(candidate => {
        return candidate.isCommon || candidate.year === userYear;
      });

      const groupedCandidates = filteredCandidates.reduce((acc, candidate) => {
        const { position } = candidate;
        if (!acc[position]) {
          acc[position] = [];
        }
        acc[position].push(candidate);
        return acc;
      }, {});

      setCandidatesByPosition(groupedCandidates);
    };

    fetchUserData();
    fetchCandidates();
  }, [userId, userYear, navigate]);

  const handleVote = async (candidateId, currentVotes, position) => {
    if (loadingPositions.includes(position)) return;

    setLoadingPositions([...loadingPositions, position]);

    try {
      const candidateRef = candidateId ? doc(db, 'candidates', candidateId) : null;
      const userRef = doc(db, 'users', userId);

      if (candidateId) {
        const newVotes = isNaN(currentVotes) ? 1 : currentVotes + 1;
        await updateDoc(candidateRef, { votes: newVotes });
      }

      await updateDoc(userRef, {
        votedPositions: [...votedPositions, position],
      });

      setVotedPositions([...votedPositions, position]);
      setLoadingPositions(loadingPositions.filter(pos => pos !== position));
    } catch (error) {
      console.error('Error casting vote: ', error);
      alert('Failed to cast vote. Please try again.');
      setLoadingPositions(loadingPositions.filter(pos => pos !== position));
    }
  };

  const handleSubmit = () => {
    navigate('/home');
  };

  const allVoted = Object.keys(candidatesByPosition).every(
    (position) => votedPositions.includes(position)
  );

  return (
    <div className="candidates-wrapper-new-layout">
      <div className="candidates-header">
        <h2>Candidates</h2>
      </div>
      <div className="candidates-section">
        {Object.entries(candidatesByPosition).map(([position, candidates]) => (
          <div key={position} className="position-card-grid">
            <h3 className="position-title" >{position}</h3>
            <div className="candidates-grid">
              {candidates.map(candidate => (
                <div key={candidate.id} className="candidate-tile">
                  <div className="candidate-info">
                    <p className="candidate-name">{candidate.name}</p>
                  </div>
                  <button
                    className={`vote-btn-tile ${votedPositions.includes(position) ? 'voted' : ''}`}
                    onClick={() => handleVote(candidate.id, candidate.votes, position)}
                    disabled={votedPositions.includes(position) || loadingPositions.includes(position)}
                  >
                    {votedPositions.includes(position) ? 'Voted' : (loadingPositions.includes(position) ? 'Voting...' : 'Vote')}
                  </button>
                </div>
              ))}
              <div className="candidate-tile">
                <div className="candidate-info">
                  <p className="candidate-name">NOTA</p>
                </div>
                <button
                  className={`vote-btn-tile ${votedPositions.includes(position) ? 'voted' : ''}`}
                  onClick={() => handleVote(null, null, position)}
                  disabled={votedPositions.includes(position) || loadingPositions.includes(position)}
                >
                  {votedPositions.includes(position) ? 'Voted' : (loadingPositions.includes(position) ? 'Voting...' : 'Vote NOTA')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {allVoted && (
        <div className="submit-btn-container">
          <button className="submit-btn" onClick={handleSubmit}>
            Submit Votes
          </button>
        </div>
      )}
    </div>
  );
};

export default Candidates;
