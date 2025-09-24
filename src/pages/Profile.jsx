import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useGameStore } from '../store';

export default function Profile() {
    // Get all necessary data and functions from our Zustand store
    const { user, setUser, points, rank, clearUser } = useGameStore();
    const navigate = useNavigate();

    // State for the form fields, initialized with the user's current data
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    
    // State for loading and success messages
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');
        setError('');

        if (!user) {
            setError("No user is logged in.");
            setLoading(false);
            return;
        }

        try {
            // 1. Prepare the data to be updated
            const updatedData = { name, email };

            // 2. Update the document in Firestore
            const userDocRef = doc(db, 'users', user.uid);
            await updateDoc(userDocRef, updatedData);

            // 3. Update the user data in our Zustand store (the app's "brain")
            setUser({ ...user, ...updatedData });

            setSuccess('Profile saved successfully!');
        } catch (err) {
            setError('Failed to save profile. Please try again.');
            console.error("Error updating profile: ", err);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            clearUser();
            navigate('/');
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    if (!user) {
        return <div>Loading profile...</div>;
    }

    return (
        <main className="mx-auto max-w-xl px-4">
            <section className="py-8 md:py-12">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">Your Profile</h1>

                <form onSubmit={handleSave} className="bg-white rounded-xl ring-1 ring-gray-200 p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm" placeholder="Your name" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                        <input value={points} disabled className="w-full rounded-md border-gray-300 bg-gray-50 text-sm" />
                        <p className="text-xs text-gray-500 mt-1">Your current rank is: <span className="font-bold">{rank}</span></p>
                    </div>
                    {success && <p className="text-sm text-green-600">{success}</p>}
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div className="pt-2 flex items-center justify-between">
                        <button type="submit" disabled={loading} className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white text-sm font-medium hover:bg-indigo-700 disabled:bg-gray-400">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>

                <div className="mt-8 border-t pt-6">
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:shadow-outline"
                    >
                        Logout
                    </button>
                </div>
            </section>
        </main>
    )
}

