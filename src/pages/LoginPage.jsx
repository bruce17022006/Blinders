import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase'; // Import auth and db from your firebase.js
import { useGameStore } from '../store'; // Import our Zustand store

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true); // To toggle between Login and Sign Up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const setUser = useGameStore((state) => state.setUser); // Get the setUser action from Zustand
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (isLogin) {
      // --- LOGIN LOGIC ---
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch user data from Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            // Put user data into Zustand store
            setUser({ uid: user.uid, ...userDoc.data() });
            navigate('/home'); // Redirect to dashboard after login
          } else {
            setError('No user data found.');
          }
        } catch (dbErr) {
          if (dbErr && dbErr.name === 'AbortError') {
            console.warn('Firestore getDoc aborted during login:', dbErr);
            setError('Login interrupted. Please try again.');
          } else {
            console.error('Error fetching user doc on login:', dbErr);
            setError(dbErr.message || 'Failed to load user data.');
          }
        }
      } catch (err) {
        setError(err.message);
      }
    } else {
      // --- SIGN UP LOGIC ---
      if (name.trim() === '') {
        setError('Please enter your name.');
        setLoading(false);
        return;
      }
      try {
        // 1. Create user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Create the user document in Firestore
        const newUser = {
          name: name,
          email: email,
          points: 0,
          rank: 'Beginner',
        };
        
        // Use the user's uid as the document ID
        await setDoc(doc(db, 'users', user.uid), newUser);

        // 3. Put new user data into Zustand store and log them in
        setUser({ uid: user.uid, ...newUser });
        
        // 4. Redirect to the dashboard
        navigate('/dashboard');

      } catch (err) {
        setError(err.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-sm w-full">
        <h1 className="text-2xl font-bold text-center mb-4">SDG Nexus</h1>
        <h2 className="text-xl font-semibold text-center mb-6">{isLogin ? 'Login' : 'Sign Up'}</h2>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:bg-gray-400"
            >
              {loading ? '...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </div>
        </form>

        <p className="text-center text-gray-500 text-xs mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 hover:text-blue-800 ml-1">
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
