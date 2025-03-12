import React from 'react';

const SummaryOverview = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f7fa', borderRadius: '8px', maxWidth: '400px', margin: '0 auto' }}>
      <p style={{ fontWeight: 'bold', color: '#333', fontSize: '1.2rem', marginBottom: '10px' }}>Total Candidates: 11</p>
      <p style={{ fontWeight: 'bold', color: '#333', fontSize: '1.2rem', marginBottom: '10px' }}>Total Common Candidates: 6</p>
      <p style={{ fontWeight: 'bold', color: '#333', fontSize: '1.2rem', marginBottom: '10px' }}>Total Votes Cast: 1</p>
    </div>
  );
};

export default SummaryOverview;
