import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import '../subcomponents/FirebaseConfig';
import styles from './GameView.module.css';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from '../subcomponents/FirebaseConfig';

const GameView = () => {
  const location = useLocation();
  const { gameID } = location.state || {};

  const [currentUser, setCurrentUser] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const db = getFirestore(app);

  useEffect(() => {
    // Check authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchGamePlayers = async () => {
      if (!gameID) return;

      try {
        // Fetch game document
        const gameRef = doc(db, "ActiveGames", gameID);
        const gameSnap = await getDoc(gameRef);

        if (gameSnap.exists()) {
          const gameData = gameSnap.data();
          const playerUIDs = gameData.players || [];

          // Fetch display names for each UID
          const playerNames = await Promise.all(
            playerUIDs.map(async (uid) => {
              const userRef = doc(db, "Users", uid);
              const userSnap = await getDoc(userRef);
              if (userSnap.exists()) {
                return userSnap.data().displayName || "Unknown Player";
              } else {
                return "Unknown Player";
              }
            })
          );

          setPlayers(playerNames);
        } else {
          console.error("Game not found!");
        }
      } catch (error) {
        console.error("Error fetching game data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGamePlayers();
  }, [gameID, db]);

  if (!gameID) {
    return <p className={styles.error}>No game selected. Please try again.</p>;
  }

  if (loading) {
    return <p className={styles.loading}>Loading...</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Game Players</h1>
      {currentUser ? (
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader}>
              <th>#</th>
              <th>Player Name</th>
            </tr>
          </thead>
          <tbody>
            {players.length > 0 ? (
              players.map((playerName, index) => (
                <tr key={index} className={styles.tableRow}>
                  <td className={styles.cell}>{index + 1}</td>
                  <td className={styles.cell}>{playerName}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className={styles.noPlayers}>
                  No players have joined yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <p className={styles.notSignedIn}>Please sign in to view the game.</p>
      )}
    </div>
  );
};

export default GameView;