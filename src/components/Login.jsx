import React, { useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase'; // Firestore instance
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [hasVoted, setHasVoted] = useState(false); // Tracks if user has voted
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('admissionNumber', '==', admissionNumber), where('name', '==', name));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('Invalid admission number or name. Please try again.');
      } else {
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.voted) {
            setHasVoted(true); // User has already voted, so set hasVoted to true
          } else {
            // If the user has not voted, navigate to the candidates page and pass the user ID
            navigate('/candidates', { state: { userId: doc.id } });
          }
        });
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>User Login</h2>
      {error && <p className="error-message">{error}</p>}
      {hasVoted ? (
        <p className="already-voted-message">You have already voted and cannot vote again.</p>
      ) : (
        <div>
          <input
            type="text"
            value={admissionNumber}
            onChange={(e) => setAdmissionNumber(e.target.value)}
            placeholder="Enter Admission Number"
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Name"
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      )}
    </div>
  );
};

export default Login;
// normal login


// import { useState, useEffect } from 'react';
// import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, onAuthStateChanged } from "firebase/auth";
// import { db } from '../firebase';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const [admissionNumber, setAdmissionNumber] = useState('');
//   const [email, setEmail] = useState('');
//   const [isSecondStep, setIsSecondStep] = useState(false); // To handle the second step (admission number verification after clicking the magic link)
//   const [loading, setLoading] = useState(true); // To track auth loading state
//   const navigate = useNavigate();
//   const auth = getAuth();

//   useEffect(() => {
//     // Check if the user clicked the email magic link
//     if (isSignInWithEmailLink(auth, window.location.href)) {
//       setIsSecondStep(true); // Switch to the second step to ask for the admission number again

//       let emailForSignIn = window.localStorage.getItem('emailForSignIn');
//       if (!emailForSignIn) {
//         // In case email is not found in local storage (unlikely), handle error or provide fallback
//         console.error('Error: No email found for sign-in');
//         return;
//       }

//       // Sign in using the email link
//       signInWithEmailLink(auth, emailForSignIn, window.location.href)
//         .then(() => {
//           window.localStorage.removeItem('emailForSignIn');
//           // User successfully logged in via magic link, now move to the second step (enter admission number)
//         })
//         .catch((e) => {
//           console.error('Error during email link sign-in: ', e.message || e);
//         });
//     }
//   }, [auth]);

//   useEffect(() => {
//     // Listen for changes in the auth state
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         // User is signed in
//         console.log('User is authenticated');
//       } else {
//         // No user is signed in
//         setLoading(false); // End loading state
//       }
//     });

//     return () => unsubscribe(); // Cleanup the listener on unmount
//   }, [auth, navigate]);

//   const handleFirstStepLogin = async () => {
//     try {
//       // Query Firestore to find the user by admission number
//       const usersRef = collection(db, 'users');
//       const q = query(usersRef, where('admissionNumber', '==', admissionNumber));
//       const querySnapshot = await getDocs(q);

//       if (querySnapshot.empty) {
//         throw new Error('No user found with this admission number.');
//       }

//       let storedEmail = '';
//       querySnapshot.forEach((doc) => {
//         storedEmail = doc.data().email; // Fetch the email from Firestore
//       });

//       // Verify if the email matches the one provided by the user
//       if (email !== storedEmail) {
//         throw new Error('Email does not match the stored email.');
//       }

//       // If email matches, send login link to the email
//       const actionCodeSettings = {
//         url: 'http://localhost:3000/login', // Redirect to login page after verification
//         handleCodeInApp: true,
//       };

//       await sendSignInLinkToEmail(auth, storedEmail, actionCodeSettings);
//       window.localStorage.setItem('emailForSignIn', storedEmail);
//       alert('Verification email sent. Check your inbox.');
//     } catch (e) {
//       console.error('Error during login: ', e.message || e);
//     }
//   };

//   const handleSecondStepLogin = async () => {
//     try {
//       // Query Firestore again to find the user by admission number during the second step
//       const usersRef = collection(db, 'users');
//       const q = query(usersRef, where('admissionNumber', '==', admissionNumber));
//       const querySnapshot = await getDocs(q);

//       if (querySnapshot.empty) {
//         throw new Error('No user found with this admission number.');
//       }

//       // If admission number matches, redirect to the candidate page
//       navigate('/candidate-page');
//     } catch (e) {
//       console.error('Error during second step login: ', e.message || e);
//     }
//   };

//   if (loading) {
//     return <p>Loading...</p>; // Show loading state while checking auth state
//   }

//   return (
//     <div>
//       {!isSecondStep ? (
//         // First step: Admission number and email input
//         <>
//           <input
//             type="text"
//             value={admissionNumber}
//             onChange={(e) => setAdmissionNumber(e.target.value)}
//             placeholder="Admission Number"
//           />
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             placeholder="Email"
//           />
//           <button onClick={handleFirstStepLogin}>Login</button>
//         </>
//       ) : (
//         // Second step: Admission number input after clicking the magic link
//         <>
//           <h3>Re-enter Admission Number</h3>
//           <input
//             type="text"
//             value={admissionNumber}
//             onChange={(e) => setAdmissionNumber(e.target.value)}
//             placeholder="Admission Number"
//           />
//           <button onClick={handleSecondStepLogin}>Verify Admission Number</button>
//         </>
//       )}
//     </div>
//   );
// };

// export default Login;
