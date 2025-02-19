import React from 'react';

const VotePage = () => {
  return (
    <div>
      <h2>Vote</h2>
      {/* List of candidates */}
      <button onClick={() => alert('Vote submitted!')}>Submit Vote</button>
    </div>
  );
};

export default VotePage;
