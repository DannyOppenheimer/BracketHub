import React, { useState, useEffect } from 'react';
import styles from './GamePlayerList.module.css';

const GamePlayersTable = ({
    currentUser,
    isInPlay,
    playerBrackets,
    playBracket,
    numRounds,
    numRegions
}) => {
    const [playerScores, setPlayerScores] = useState({});

    const baseRounds = ['R128', 'R64', 'R32', 'R16', 'R8', 'Semis', 'Finals'];

    const getVisibleRounds = () => {
        const visibleRounds = [];
        const regionalRounds = baseRounds.slice(baseRounds.length - numRounds - (numRegions == 1 ? 0 : 1));
        visibleRounds.push(...regionalRounds);

        return visibleRounds;
    };

    const visibleRounds = getVisibleRounds();

    const calcScores = () => {
        const left = playBracket[1];
        if (numRegions == 2) {

            const right = playBracket[2];
            const newScores = {};

            for (let playerBracket of playerBrackets) {
                const playerID = playerBracket.cur_uid;
                const playerLeft = playerBracket.bracket.bracket[1];
                const playerRight = playerBracket.bracket.bracket[2];
                newScores[playerID] = {};

                for (let i = 1; i <= numRounds; i++) {
                    let score = 0;

                    for (let j = 1; j <= (2 ** i) / 2; j++) {
                        const playerLeftPick = playerLeft?.[i]?.[j]?.teamselected;
                        const actualLeftPick = left?.[i]?.[j]?.teamselected;

                        const playerRightPick = playerRight?.[i]?.[j]?.teamselected;
                        const actualRightPick = right?.[i]?.[j]?.teamselected;

                        if (playerLeftPick != null && actualLeftPick != null && playerLeftPick === actualLeftPick) {
                            score += 1;
                        }

                        if (playerRightPick != null && actualRightPick != null && playerRightPick === actualRightPick) {
                            score += 1;
                        }
                    }

                    newScores[playerID][i] = { score };
                }

                const correctFinal = playBracket?.['finals']?.teamselected;
                const playerFinal = playerBracket.bracket?.bracket?.['finals']?.teamselected;

                newScores[playerID][0] = {
                    score: correctFinal === playerFinal ? 1 : 0,
                };
            }

            setPlayerScores(newScores);
        } else if (numRegions == 1) {
            const newScores = {};
            for (let playerBracket of playerBrackets) {
                const playerID = playerBracket.cur_uid;
                const playerLeft = playerBracket.bracket.bracket[1];
                newScores[playerID] = {};

                for (let i = 1; i <= numRounds; i++) {
                    let score = 0;

                    for (let j = 1; j <= (2 ** i) / 2; j++) {
                        const playerLeftPick = playerLeft?.[i]?.[j]?.teamselected;
                        const actualLeftPick = left?.[i]?.[j]?.teamselected;

                        if (playerLeftPick != null && actualLeftPick != null && playerLeftPick === actualLeftPick) {
                            score += 1;
                        }
                    }

                    newScores[playerID][i - 1] = { score };
                }

            }
            setPlayerScores(newScores);
        }

    };


    useEffect(() => {
        if (playerBrackets && playBracket && numRounds && numRegions) {
            calcScores();
        }
    }, [playerBrackets, playBracket, numRounds, numRegions]);

    useEffect(() => {
        // console.log(playerScores)
    }, [playerScores]);

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
                                visibleRounds.map((round) => (
                                    <th key={round}>{round}</th>
                                ))}
                            {isInPlay && <th>Total</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {playerBrackets && playerBrackets.length > 0 ? (
                            playerBrackets.map((player, index) => {
                                const playerID = player.cur_uid;

                                return (
                                    <tr key={player.uid} className={styles.tableRow}>
                                        <td className={styles.cell}>{index + 1}</td>
                                        <td className={styles.cell}>{player.displayName}</td>
                                        {isInPlay &&
                                            visibleRounds.map((round, rIndex) => {
                                                let roundNumber = visibleRounds.length - rIndex - 1;
                                                const score = numRegions == 1 ? ((2 ** (numRounds - roundNumber - 1)) * playerScores?.[playerID]?.[roundNumber]?.score ?? '—') : ((2 ** (numRounds - roundNumber)) * playerScores?.[playerID]?.[roundNumber]?.score ?? '—');


                                                return (
                                                    <td key={round} className={styles.cell}>
                                                        {score}
                                                    </td>
                                                );
                                            })}
                                        {isInPlay && (
                                            <td className={styles.cell}>
                                                {
                                                    visibleRounds.reduce((total, _, rIndex) => {
                                                        const roundNumber = visibleRounds.length - rIndex - 1;
                                                        const roundScore = playerScores?.[playerID]?.[roundNumber]?.score ?? 0;
                                                        return total + (numRegions == 1 ? (2 ** (numRounds - roundNumber - 1)) * roundScore : (2 ** (numRounds - roundNumber)) * roundScore);
                                                    }, 0)
                                                }
                                            </td>
                                        )}
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={isInPlay ? 2 + visibleRounds.length + 1 : 2} className={styles.noPlayers}>
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
