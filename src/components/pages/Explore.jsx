import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, writeBatch, arrayUnion } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import '../subcomponents/FirebaseConfig';
import styles from './Explore.module.css';

const Explore = () => {
    const [publicGames, setPublicGames] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user || null);
            setError('');

            if (user) {
                try {
                    const db = getFirestore();
                    const gamesCol = collection(db, 'ActiveGames');
                    const snapshot = await getDocs(gamesCol);
                    const filteredGames = [];

                    snapshot.forEach(gameDoc => {
                        const data = gameDoc.data();
                        if (data.access === 'public') {
                            const players = Array.isArray(data.players) ? data.players : [];
                            filteredGames.push({
                                id: gameDoc.id,
                                name: data.name,
                                type: data.type,
                                deadline: data.deadline,
                                playerCount: players.length,
                                joined: players.includes(user.uid)
                            });
                        }
                    });

                    setPublicGames(filteredGames);
                } catch (fetchError) {
                    console.error('Error loading public games:', fetchError);
                    setError('Unable to load public games. Please try again.');
                }
            } else {
                setPublicGames([]);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const formatDeadline = (timestamp) => {
        if (!timestamp) return 'No deadline';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        if (Number.isNaN(date.getTime())) return 'Invalid deadline';
        const day = String(date.getDate()).padStart(2, '0');
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day} ${month} ${year} at ${hours}:${minutes}`;
    };

    const joinGame = async (game) => {
        if (!currentUser || game.joined) return;

        try {
            const db = getFirestore();
            const batch = writeBatch(db);
            const gameRef = doc(db, 'ActiveGames', game.id);
            const userRef = doc(db, 'Users', currentUser.uid);

            batch.update(gameRef, { players: arrayUnion(currentUser.uid) });
            batch.update(userRef, { games: arrayUnion(game.id) });
            await batch.commit();

            setPublicGames(currentGames => currentGames.map(currentGame =>
                currentGame.id === game.id
                    ? { ...currentGame, joined: true, playerCount: currentGame.playerCount + 1 }
                    : currentGame
            ));
        } catch (joinError) {
            console.error('Error joining game:', joinError);
            setError('Failed to join the game. Please try again.');
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Explore Public Games</h2>

            {loading ? (
                <div className={styles.loading}>Loading...</div>
            ) : !currentUser ? (
                <div className={styles.notSignedIn}>You must be signed in</div>
            ) : error ? (
                <div className={styles.error}>{error}</div>
            ) : publicGames.length === 0 ? (
                <div className={styles.noGames}>No public games available.</div>
            ) : (
                <table className={styles.table}>
                    <thead className={styles.tableHeader}>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Deadline</th>
                            <th>Players</th>
                            <th>Join</th>
                        </tr>
                    </thead>
                    <tbody>
                        {publicGames.map(game => (
                            <tr key={game.id} className={styles.tableRow}>
                                <td className={styles.cell}>{game.name}</td>
                                <td className={styles.cell}>{game.type}</td>
                                <td className={styles.cell}>{formatDeadline(game.deadline)}</td>
                                <td className={styles.cell}>{game.playerCount}</td>
                                <td className={styles.cell}>
                                    <button
                                        className={styles.button}
                                        disabled={game.joined}
                                        onClick={() => joinGame(game)}
                                    >
                                        {game.joined ? 'Joined' : 'Join'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Explore;
