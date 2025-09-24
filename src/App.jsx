import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase'; // Make sure your firebase.js is set up
import { useGameStore } from './store'; // Make sure your store.js is set up

// Import all your pages and components
import NavBar from './components/NavBar.jsx';
import Home from './pages/Home.jsx';
import LeaderBoard from './pages/LeaderBoard.jsx';
import Profile from './pages/Profile.jsx';
import Game from './pages/game.jsx';
import LoginPage from './pages/LoginPage.jsx';

// This is a helper component to protect routes
const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    // If no user is logged in, redirect to the login page
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function App() {
  // Get user data and actions from our Zustand store
  const { user, setUser, clearUser } = useGameStore();
  const [loading, setLoading] = useState(true);

  // This useEffect is the "gatekeeper". It runs once when the app loads.
  useEffect(() => {
    let cancelled = false;
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (cancelled) return;

      if (authUser) {
        // User is logged in to Firebase, now get their data from Firestore
        try {
          const userDocRef = doc(db, 'users', authUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (cancelled) return;

          if (userDoc.exists()) {
            setUser({ uid: authUser.uid, ...userDoc.data() });
          } else {
            // User exists in auth but not firestore, clear local user
            clearUser();
          }
        } catch (err) {
          // Firestore may abort requests during HMR or network issues — handle gracefully
          if (err && err.name === 'AbortError') {
            console.warn('Firestore request was aborted:', err);
          } else {
            console.error('Error fetching user document:', err);
          }
          if (!cancelled) clearUser();
        }
      } else {
        // No user is logged in
        if (!cancelled) clearUser();
      }

      if (!cancelled) setLoading(false); // Done checking, we can show the app now
    });

    // Cleanup the listener when the app unmounts
    return () => {
      cancelled = true;
      try { unsubscribe(); } catch {}
    };
  }, [setUser, clearUser]);

  // While checking, show a loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-xl font-semibold">Loading SDG Explorer...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      {/* Only show the NavBar and footer if a user is logged in */}
      {user && <NavBar />}
      
      <Routes>
        {/* The login page is the root. If a user is already logged in, redirect them to home. */}
        <Route path="/" element={!user ? <LoginPage /> : <Navigate to="/home" />} />
        
        {/* These are your protected routes. A user must be logged in to see them. */}
        <Route path='/home' element={<ProtectedRoute user={user}><Home /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute user={user}><LeaderBoard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute user={user}><Profile /></ProtectedRoute>} />
        <Route path="/game" element={<ProtectedRoute user={user}><Game /></ProtectedRoute>} />
      </Routes>

      {user && <footer className="py-8 text-center text-xs text-gray-500">© SDG Explorer</footer>}
    </div>
  );
}
