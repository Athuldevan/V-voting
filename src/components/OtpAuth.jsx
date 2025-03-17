import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';

const Otpauth = () => {
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!location.state || !location.state.email || !location.state.userId) {
      navigate('/login');
      return;
    }
    setEmail(location.state.email);
    sendEmail();
  }, [location, navigate]);

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendEmail = () => {
    const otpCode = generateOtp();
    setGeneratedOtp(otpCode);

    emailjs.send('service_d68lc2q', 'template_umg678l', {
      email: location.state.email,  // Use the passed email from state
      passcode: otpCode
    }, 'Yvcma3TCikLuBePOx')
    .then(() => alert('OTP sent successfully!'))
    .catch(() => alert('Failed to send OTP. Please try again.'));
  };

  const handleSubmit = () => {
    if (otp === generatedOtp) {
      navigate('/candidates', { state: { userId: location.state.userId } });  // Pass userId to Candidates page
    } else {
      alert('Invalid OTP! Please try again.');
    }
  };

  return (
    <div className="otp-container">
      <h2>Enter 6-digit OTP</h2>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Otpauth;
