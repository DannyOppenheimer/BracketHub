import React, { useState, useEffect } from 'react';
import styles from './GamePlayerList.module.css';

export const getScoreIndex = (numRegions, roundNumber) => (
    numRegions === 4 ? roundNumber - 1 : roundNumber
);

export const getRoundMultiplier = (numRegions, numRounds, roundNumber) => {
    if (numRegions === 1) {
        return 2 ** (numRounds - roundNumber - 1);
    }

    const regionalMultiplier = 2 ** (numRounds - roundNumber);
    return numRegions === 4 ? 2 * regionalMultiplier : regionalMultiplier;
};

export const calculatePlayerScores = (playerBrackets, playBracket, numRounds, numRegions) => {
    if (!Array.isArray(playerBrackets) || !playBracket || ![1, 2, 4].includes(numRegions)) {
        return {};
    }

    const scores = {};

    playerBrackets.forEach(playerEntry => {
        const playerID = playerEntry.cur_uid;
        const playerBracket = playerEntry.bracket?.bracket ?? {};

        if (!playerID) return;
        scores[playerID] = {};

        for (let round = 1; round <= numRounds; round++) {
            let correctPicks = 0;
            const matchupCount = (2 ** round) / 2;

            for (let region = 1; region <= numRegions; region++) {
                for (let matchup = 1; matchup <= matchupCount; matchup++) {
                    const playerPick = playerBracket?.[region]?.[round]?.[matchup]?.teamselected;
                    const actualPick = playBracket?.[region]?.[round]?.[matchup]?.teamselected;

                    if (actualPick != null && playerPick === actualPick) {
                        correctPicks += 1;
                    }
                }
            }

            const scoreIndex = numRegions === 1 ? round - 1 : round;
            scores[playerID][scoreIndex] = { score: correctPicks };
        }

        if (numRegions >= 2) {
            const actualFinal = playBracket?.finals?.teamselected;
            const playerFinal = playerBracket?.finals?.teamselected;
            scores[playerID][numRegions === 4 ? -1 : 0] = {
                score: actualFinal != null && playerFinal === actualFinal ? 1 : 0
            };
        }

        if (numRegions === 4) {
            const semifinalSides = ['left', 'right'];
            const semifinalScore = semifinalSides.reduce((total, side) => {
                const actualPick = playBracket?.semis?.[side]?.teamselected;
                const playerPick = playerBracket?.semis?.[side]?.teamselected;
                return total + (actualPick != null && playerPick === actualPick ? 1 : 0);
            }, 0);

            scores[playerID][0] = { score: semifinalScore };
        }
    });

    return scores;
};

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
        const regionalRounds = baseRounds.slice(baseRounds.length - numRounds - (numRegions === 1 ? 0 : 1) - (numRegions === 4 ? 1 : 0));
        visibleRounds.push(...regionalRounds);

        return visibleRounds;
    };

    const visibleRounds = getVisibleRounds();

    useEffect(() => {
        if (playerBrackets && playBracket && numRounds && numRegions) {
            setPlayerScores(calculatePlayerScores(playerBrackets, playBracket, numRounds, numRegions));
        }
    }, [playerBrackets, playBracket, numRounds, numRegions]);

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
                                    <tr key={player.cur_uid} className={styles.tableRow}>
                                        <td className={styles.cell}>{index + 1}</td>
                                        <td className={styles.cell}>{player.displayName}</td>
                                        {isInPlay &&
                                            visibleRounds.map((round, rIndex) => {
                                                let roundNumber = visibleRounds.length - rIndex - 1;
                                                const scoreIndex = getScoreIndex(numRegions, roundNumber);
                                                const rawScore = playerScores?.[playerID]?.[scoreIndex]?.score;
                                                const score = rawScore == null
                                                    ? '—'
                                                    : getRoundMultiplier(numRegions, numRounds, roundNumber) * rawScore;


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
                                                        const scoreIndex = getScoreIndex(numRegions, roundNumber);
                                                        const roundScore = playerScores?.[playerID]?.[scoreIndex]?.score ?? 0;
                                                        return total + getRoundMultiplier(numRegions, numRounds, roundNumber) * roundScore;
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
