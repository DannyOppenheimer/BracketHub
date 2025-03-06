import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import '../subcomponents/FirebaseConfig';
import styles from './GameView.module.css';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from '../subcomponents/FirebaseConfig';
import PickSingleEliminationBracket from '../subcomponents/bracket_types/PickSingleEliminationBracket';
import { keyboard } from '@testing-library/user-event/dist/cjs/keyboard/index.js';
import PanZoomCanvas from '../subcomponents/style_components/PanZoomCanvas';

const GameView = () => {
    const location = useLocation();
    const { gameID } = location.state || {};

    const [currentUser, setCurrentUser] = useState(null);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bracket, setBracket] = useState(null);
    const [savedBuild, setSavedBuild] = useState(null);
    const [savedPicks, setSavedPicks] = useState(null);

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
                const gameData = gameSnap.data(); // Fetch the game data from Firestore

                // Set the saved build state with the fetched game data
                setSavedBuild({
                    Title: gameData.name,
                    Format: gameData.access,
                    Regions: gameData.numRegions,
                    "Participants Per Region": gameData.perRegion,
                    Seeding: gameData.seeded,
                    Deadline: gameData.deadline
                });


                setBracket(gameData.bracket);


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

    const updateBracket = (region, round, matchup, key, value) => {

        setBracket((prevBracket) => {

            const copyBracket = JSON.parse(JSON.stringify(prevBracket));

            if (round == "FINALS") {
                copyBracket[region][key] = value;
            }
            else if (matchup == 'SEMIS') {
                copyBracket[region][round][key] = value;
            }
            else if (value == "SEARCH_AND_DELETE") {

                if (copyBracket[region][round][matchup]['team1name'] == key) {
                    copyBracket[region][round][matchup]['team1name'] = null;
                    copyBracket[region][round][matchup]['team1'] = null;
                } else if (copyBracket[region][round][matchup]['team2name'] == key) {
                    copyBracket[region][round][matchup]['team2name'] = null;
                    copyBracket[region][round][matchup]['team2'] = null;
                }

            } else {
                copyBracket[region][round][matchup][key] = value;
            }


            return copyBracket; // Return the updated state
        });
    };

    const recievePicks = (region, event, teamName, team, round, matchup, numRounds) => {

        if (region == 'finals') {
            updateBracket('finals', "FINALS", null, `teamselected`, team);
        } else if (region == 'semis') {
            updateBracket('semis', matchup, 'SEMIS', `teamselected`, team);
        } else {

            updateBracket(region, round, matchup, 'teamselected', team);
        }

        let count = 1;
        for (let i = round - 1; i > 0; i--) {

            if (i === round - 1) {

                updateBracket(region, i, Math.ceil(matchup / (2 ** count)), `team${matchup % 2 !== 0 ? 1 : 2}`, bracket[region][round][matchup][`team${team}`]);
                updateBracket(region, i, Math.ceil(matchup / (2 ** count)), `team${matchup % 2 !== 0 ? 1 : 2}name`, bracket[region][round][matchup][`team${team}name`]);
            } else {

                updateBracket(region, i, Math.ceil(matchup / (2 ** count)), bracket[region][round][matchup][`team${bracket[region][round][matchup]['teamselected']}name`], "SEARCH_AND_DELETE");
            }

            count++;
        }

        if (round == '1') {

            if (savedBuild['Regions'] == 2) {


                updateBracket('finals', "FINALS", null, `team${region === 1 ? 1 : 2}`, bracket[region][round][matchup][`team${team}`]);
                updateBracket('finals', "FINALS", null, `team${region === 1 ? 1 : 2}name`, bracket[region][round][matchup][`team${team}name`]);

            }
            if (savedBuild['Regions'] == 4) {

                updateBracket('semis', region == 1 || region == 3 ? 'left' : 'right', 'SEMIS', `team${(region == 1 || region == 2) ? 1 : 2}`, bracket[region][round][matchup][`team${team}`]);
                updateBracket('semis', region == 1 || region == 3 ? 'left' : 'right', 'SEMIS', `team${(region == 1 || region == 2) ? 1 : 2}name`, bracket[region][round][matchup][`team${team}name`]);

            }
        }

        if (region == 'semis') {
            if (savedBuild['Regions'] == 4) {

                updateBracket('finals', "FINALS", null, `team${matchup == 'left' ? 1 : 2}`, bracket[region][matchup][`team${team}`]);
                updateBracket('finals', "FINALS", null, `team${matchup == 'left' ? 1 : 2}name`, bracket[region][matchup][`team${team}name`]);

            }
        }


    }

    if (!gameID) {
        return <p className={styles.error}>No game selected. Please try again.</p>;
    }

    if (loading) {
        return <p className={styles.loading}>Loading...</p>;
    }

    return (
        <>

            <div className={styles.upper_container}>
                <h1 className={styles.title}>{savedBuild.Title}</h1>
                <h2 className={styles.subtitle}>Deadline to Enter Picks: {new Date(savedBuild.Deadline).toLocaleString()}</h2>
                <h2 className={styles.subtitle}>Format: {savedBuild.Format} bracket</h2>

                <PanZoomCanvas type='pick'>
                    <div>
                        <PickSingleEliminationBracket buildData={savedBuild} bracket={bracket} updateBracketFunc={recievePicks} />
                    </div>


                </PanZoomCanvas>
                <button className={styles.submit_button} disabled={Date() > new Date(savedBuild.Deadline)}>
                    {new Date() > new Date(savedBuild.Deadline) ? "Deadline Passed" : "Submit Picks"}
                </button>
            </div>



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
        </>

    );
};

export default GameView;