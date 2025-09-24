import { create } from 'zustand';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase'; // Make sure this path is correct

// This creates our global state store. Any component can access this data and these functions.
export const useGameStore = create((set, get) => ({
  // --- STATE ---
  // These are the pieces of data our app needs to track in real-time.
  user: null,    // Will hold the logged-in user's data (uid, name, email)
  points: 0,     // The user's current score
  rank: 'Beginner', // The user's current rank

  // --- ACTIONS ---
  // These are functions that allow our components to change the state.

  /**
   * Loads the user's data into the store when they log in or sign up.
   * This is the bridge between Firebase (long-term memory) and Zustand (short-term memory).
   * @param {object} userData - The user data fetched from Firestore.
   */
  setUser: (userData) => {
    const userPoints = userData.points || 0;
    set({ 
      user: userData, 
      points: userPoints, 
      rank: get().calculateRank(userPoints) // Calculate rank based on their points
    });
  },

  /**
   * Adds points to the user's score.
   * This function does two things:
   * 1. Instantly updates the score in the app for a fast, responsive feel.
   * 2. Saves the new score to Firebase in the background.
   * @param {number} amount - The number of points to add.
   */
  addPoints: async (amount) => {
    if (!get().user) return; // Don't do anything if no user is logged in.

    const newPoints = get().points + amount;
    
    // 1. Update the state in Zustand instantly.
    set({ 
      points: newPoints,
      rank: get().calculateRank(newPoints)
    });

    // 2. Save the new score to Firebase in the background.
    try {
      const userRef = doc(db, 'users', get().user.uid);
      await updateDoc(userRef, {
        points: newPoints
      });
    } catch (error) {
      console.error("Error updating points in Firebase:", error);
      // Optional: Logic to handle a failed save, maybe revert the points change.
    }
  },
  
  /**
   * A helper function to determine a user's rank based on their points.
   * @param {number} points - The user's current points.
   * @returns {string} The calculated rank.
   */
  calculateRank: (points) => {
    if (points >= 1000) return 'Master Chef';
    if (points >= 500) return 'Sous Chef';
    if (points >= 200) return 'Apprentice';
    return 'Beginner';
  },

  /**
   * Clears all user data from the store when they log out.
   */
  clearUser: () => set({ user: null, points: 0, rank: 'Beginner' }),
}));
