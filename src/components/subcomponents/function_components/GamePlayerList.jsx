import React from 'react';
import styles from './GamePlayerList.module.css';

const GamePlayersTable = ({ currentUser, isInPlay, playerBrackets, playBracket }) => {
    const rounds = ['R128', 'R64', 'R32', 'R16', 'R8', 'R4', 'Semis', 'Finals'];

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Submitted Brackets</h1>
            {currentUser ? (
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.tableHeader}>
                            <th>#</th>
                            <th>Player Name</th>
                            {isInPlay &&
                                rounds.map((round) => (
                                    <th key={round}>{round}</th>
                                ))}
                        </tr>
                    </thead>
                    <tbody>
                        {playerBrackets && playerBrackets.length > 0 ? (
                            playerBrackets.map((player, index) => (
                                <tr key={player.uid} className={styles.tableRow}>
                                    <td className={styles.cell}>{index + 1}</td>
                                    <td className={styles.cell}>{player.displayName}</td>
                                    {isInPlay &&
                                        rounds.map((round) => (
                                            <td key={round} className={styles.cell}>
                                                {player.bracket?.[round] ? '✔' : '—'}
                                            </td>
                                        ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={isInPlay ? 2 + rounds.length : 2} className={styles.noPlayers}>
                                    No players have submitted brackets yet.
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
