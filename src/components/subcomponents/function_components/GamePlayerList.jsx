import React from 'react';
import styles from './GamePlayerList.module.css'; // Make sure to create or reuse the corresponding CSS module

const GamePlayersTable = ({ currentUser, players }) => {
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

export default GamePlayersTable;