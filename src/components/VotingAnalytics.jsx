import React from 'react';

const VotingAnalytics = () => {
  return (
    <div>
      <p>First Year Rep</p>
      <input type="text" value="Sayooj: 0 votes" readOnly />

      <p>Joint Secretary</p>
      <input type="text" value="Sweety: 0 votes" readOnly />

      <p>Chairman</p>
      <input type="text" value="Ajaymth: 0 votes" readOnly />

      {/* Add more analytics fields as needed */}
    </div>
  );
};

export default VotingAnalytics;
