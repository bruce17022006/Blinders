import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useGameStore } from '../store';

export default function LeaderBoard() {
    // Get the current user from our Zustand store to highlight them
    const currentUser = useGameStore((state) => state.user);

    // State to hold the leaderboard data and manage loading
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // This useEffect hook runs once when the component is first rendered
    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                // 1. Create a reference to the 'users' collection
                const usersCollectionRef = collection(db, 'users');

                // 2. Create a query to get all users, ordered by their points in descending order
                const q = query(usersCollectionRef, orderBy('points', 'desc'));

                // 3. Execute the query
                const querySnapshot = await getDocs(q);

                // 4. Map the results to a new array, adding a 'rank' to each user
                const leaderboardData = querySnapshot.docs.map((doc, index) => ({
                    id: doc.id, // The user's UID
                    ...doc.data(), // Get all data from the database first...
                    rank: index + 1, // ...THEN add/overwrite the rank with the correct number.
                }));

                setRows(leaderboardData);
            } catch (err) {
                console.error("Error fetching leaderboard:", err);
                // This error often means you need to create an index in Firebase (see note below)
                setError('Failed to load leaderboard. You may need to configure a database index.');
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []); // The empty dependency array [] ensures this runs only once.

    if (loading) {
        return <main className="text-center py-12">Loading Leaderboard...</main>;
    }

    if (error) {
        return <main className="text-center py-12 text-red-500">{error}</main>;
    }

    return (
        <main className="mx-auto max-w-4xl px-4">
            <section className="py-8 md:py-12">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">Leaderboard</h1>
                <div className="overflow-hidden rounded-xl ring-1 ring-gray-200 bg-white">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Rank</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">User</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Points</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {rows.map((row) => (
                                // We add a yellow background if the row's ID matches the current user's ID
                                <tr key={row.id} className={row.id === currentUser?.uid ? 'bg-yellow-100' : 'hover:bg-gray-50'}>
                                    <td className="px-4 py-3 text-sm text-gray-900">{row.rank}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700 font-medium">{row.name} {row.id === currentUser?.uid ? '(You)' : ''}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 text-right font-semibold">{row.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    )
}

