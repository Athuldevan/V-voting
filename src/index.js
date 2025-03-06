// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react'; // Import ClerkProvider
import App from './components/App'; // Correct path to App component
import './index.css';

const publishableKey = "pk_test_Z3VpZGVkLXNhdHlyLTI3LmNsZXJrLmFjY291bnRzLmRldiQ"; // Replace with your actual publishableKey

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={publishableKey}> {/* Use the publishableKey */}
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
