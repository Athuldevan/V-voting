import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase'; // Firestore instance

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleOtpSubmit = async () => {
    try {
      const userId = 'USER_ID_HERE';  // Use user ID passed from Login page or session
      const otpRef = db.collection('otpVerification').doc(userId);
      const otpDoc = await otpRef.get();

      if (otpDoc.exists) {
        const otpData = otpDoc.data();
        const currentTime = Date.now();
        const OTP_TIMEOUT = 5 * 60 * 1000;

        if (currentTime - otpData.timestamp > OTP_TIMEOUT) {
          setError('OTP has expired. Please request a new one.');
        } else if (otp === otpData.otp) {
          navigate('/candidates'); // Redirect to the next page after successful OTP verification
        } else {
          setError('Invalid OTP. Please try again.');
        }
      }
    } catch (error) {
      setError('An error occurred while verifying OTP.');
    }
  };

  return (
    <div>
      <h2>Enter OTP</h2>
      {error && <p>{error}</p>}
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />
      <button onClick={handleOtpSubmit}>Verify OTP</button>
    </div>
  );
};

export default VerifyOtp;
