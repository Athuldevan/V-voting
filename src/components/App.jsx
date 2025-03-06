import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './HomeScreen'; // Fixing the import path
import Candidates from './Candidates';
import Login from './Login';
import VerifyOtp from './VerifyOtp';
import AdminLogin from './AdminLogin';
import Results from './Results';
import AdminDashboard from './AdminDashboard';
import AllocateCandidate from './AllocateCandidate';
import '../App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/results" element={<Results />} />
        <Route path="/admin/allocate-candidate" element={<AllocateCandidate />} />
      </Routes>
    </Router>
  );
}

export default App; // Only one export default statement
