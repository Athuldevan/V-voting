// src/components/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './HomeScreen'; // Import your HomeScreen component
import Candidates from './Candidates'; // Import the Candidates component
import Login from './Login'; // Import your Login component
import AdminLogin from './AdminLogin'; // Import the AdminLogin component
import Results from './Results'; // Import your Results component (admin results page)
import '../App.css'; // <-- Ensure App.css is imported

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/home" element={<HomeScreen />} />
        <Route path="/candidates" element={<Candidates />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/results" element={<Results />} /> {/* Add the route for admin results */}
      </Routes>
    </Router>
  );
}

export default App;
