import React, { useEffect, useState } from 'react';
import '../subcomponents/FirebaseConfig';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from '../subcomponents/FirebaseConfig';
import styles from "./MyBracketGroups.module.css";
import { useNavigate } from 'react-router-dom';

const MyBracketGroups = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);

    const auth = getAuth();
    const db = getFirestore(app);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserGames = async () => {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    setCurrentUser(user);

                    try {
                        const userRef = doc(db, "Users", user.uid);
                        const userDocSnap = await getDoc(userRef);

                        if (userDocSnap.exists()) {
                            const gameCodes = userDocSnap.data().games || [];

                            const gameDetails = await Promise.all(
                                gameCodes.map(async (code) => {
                                    const gameRef = doc(db, "ActiveGames", code);
                                    const gameDocSnap = await getDoc(gameRef);

                                    if (gameDocSnap.exists()) {
                                        return { joinCode: code, ...gameDocSnap.data() };
                                    } else {
                                        return { joinCode: code, name: "Game not found", regionNum: "-", players: [] };
                                    }
                                })
                            );

                            setGames(gameDetails);
                        }
                    } catch (error) {
                        console.error("Error fetching user's games:", error.message);
                    }
                } else {
                    setCurrentUser(null);
                }
                setLoading(false);
            });
        };

        fetchUserGames();
    }, [auth, db]);

    const handleRowClick = (gameCode) => {
        navigate('/gameview', { state: { gameID: gameCode } });
    };

    if (loading) {
        return <p className={styles.loading}>Loading...</p>;
    }

    if (!currentUser) {
        return <p className={styles.notSignedIn}>You are not signed in. Please sign in to see your games.</p>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>My Bracket Groups</h1>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.tableHeader}>
                        <th>#</th>
                        <th>Game Name</th>
                        <th>Join Code</th>
                        <th>Number of Players</th>
                    </tr>
                </thead>
                <tbody>
                    {games.length > 0 ? (
                        games.map((game, index) => (
                            <tr key={index} className={styles.tableRow} onClick={() => handleRowClick(game.joinCode)} style={{ cursor: 'pointer' }}>
                                <td className={styles.cell}>{index + 1}</td>
                                <td className={styles.cell}>{game.name || "Unnamed Game"}</td>
                                <td className={styles.cell}>{game.joinCode}</td>
                                <td className={styles.cell}>{game.players.length || 0}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className={styles.noGames}>
                                No games joined yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MyBracketGroups;