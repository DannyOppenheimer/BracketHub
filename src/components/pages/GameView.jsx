import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import '../subcomponents/FirebaseConfig';
import styles from './GameView.module.css';
import { getFirestore, doc, getDoc, setDoc, updateDoc, getDocs, collection } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from '../subcomponents/FirebaseConfig';
import PickSingleEliminationBracket from '../subcomponents/bracket_types/PickSingleEliminationBracket';
import GamePlayerList from '../subcomponents/function_components/GamePlayerList';
import PanZoomCanvas from '../subcomponents/style_components/PanZoomCanvas';
import AdminChooseSingleEliminationBracket from '../subcomponents/bracket_types/AdminChooseSingleEliminationBracket';
import PlayerViewSingleEliminationBracket from '../subcomponents/bracket_types/PlayerViewSingleEliminationBracket';
import Popup from '../subcomponents/function_components/Popup';

const GameView = () => {
    const location = useLocation();
    const { gameID } = location.state || {};

    const [currentUser, setCurrentUser] = useState(null);
    const [playerBrackets, setPlayerBrackets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bracket, setBracket] = useState(null);
    const [playBracket, setPlayBracket] = useState(null);
    const [savedBuild, setSavedBuild] = useState(null);
    const [isHost, setIsHost] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [numRegions, setNumRegions] = useState(0);
    const [teamsPerRegion, setTeamsPerRegion] = useState(0);

    const auth = getAuth();
    const db = getFirestore(app);

    useEffect(() => {
        const fetchHostStatus = async (uid) => {
            const gameRef = doc(db, "ActiveGames", gameID);
            const gameSnap = await getDoc(gameRef);

            if (gameSnap.data().host === uid) {
                setIsHost(true);
            }

            setNumRegions(gameSnap.data().numRegions);
            setTeamsPerRegion(gameSnap.data().perRegion);


            if (gameSnap.data().playBracket === undefined) {
                await updateDoc(gameRef, {
                    playBracket: gameSnap.data().bracket
                });
                setPlayBracket(gameSnap.data().playBracket);


            } else {
                setPlayBracket(gameSnap.data().playBracket);
            }


            const bracketsRef = collection(db, "ActiveGames", gameID, "brackets");

            const bracketsSnap = await getDocs(bracketsRef);

            const playerBracketsData = await Promise.all(
                bracketsSnap.docs.map(async (docSnap) => {
                    const bracketData = docSnap.data();
                    const cur_uid = docSnap.id; // Each document ID is the player UID
                    const userRef = doc(db, "Users", uid);
                    const userSnap = await getDoc(userRef);
                    const displayName = userSnap.exists() ? (userSnap.data().displayName || "Unknown Player") : "Unknown Player";


                    if (cur_uid === uid) {
                        setBracket(Object.values(bracketData)[0]);
                    }
                    return {
                        cur_uid,
                        displayName,
                        bracket: bracketData
                    };
                })
            );


            setPlayerBrackets(playerBracketsData);
        }

        // Check authentication state
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                fetchHostStatus(user.uid);
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

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };



        fetchGamePlayers();

    }, [gameID, db]);

    const handleStartClick = () => {
        setShowPopup(true);
    };

    const handleConfirm = async () => {

        const gameRef = doc(db, "ActiveGames", gameID);

        const now = new Date();
        const pad = (n) => n.toString().padStart(2, '0');

        const localFormattedNow = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;

        try {
            await updateDoc(gameRef, {
                deadline: localFormattedNow,
            });
            console.log("Deadline set to current LOCAL datetime:", localFormattedNow);
        } catch (error) {
            console.error("Error updating deadline:", error);
        }
        const gameSnap = await getDoc(gameRef);

        const gameData = gameSnap.data();
        console.log("Game data:", gameData.deadline);
        // Set the saved build state with the fetched game data
        setSavedBuild({
            Title: gameData.name,
            Format: gameData.access,
            Regions: gameData.numRegions,
            "Participants Per Region": gameData.perRegion,
            Seeding: gameData.seeded,
            Deadline: gameData.deadline
        });

        setShowPopup(false);
    };

    const handleCancel = () => {
        setShowPopup(false);
    };

    const updateBracket = (bracket, region, round, matchup, key, value) => {
        const copyBracket = JSON.parse(JSON.stringify(bracket));

        if (round === "FINALS") {
            copyBracket[region][key] = value;
        } else if (matchup === "SEMIS") {
            copyBracket[region][round][key] = value;
        } else if (value === "SEARCH_AND_DELETE") {
            if (copyBracket[region][round][matchup]['team1name'] === key) {
                copyBracket[region][round][matchup]['team1name'] = null;
                copyBracket[region][round][matchup]['team1'] = null;
            } else if (copyBracket[region][round][matchup]['team2name'] === key) {
                copyBracket[region][round][matchup]['team2name'] = null;
                copyBracket[region][round][matchup]['team2'] = null;
            }
        } else {
            copyBracket[region][round][matchup][key] = value;
        }

        return copyBracket;
    };
    const recievePicks = (region, event, teamName, team, round, matchup, numRounds) => {
        let newBracket = JSON.parse(JSON.stringify(bracket)); // Start from current

        if (region === 'finals') {
            newBracket = updateBracket(newBracket, 'finals', "FINALS", null, `teamselected`, team);
        } else if (region === 'semis') {
            newBracket = updateBracket(newBracket, 'semis', matchup, 'SEMIS', `teamselected`, team);
        } else {
            newBracket = updateBracket(newBracket, region, round, matchup, 'teamselected', team);
        }

        let count = 1;
        for (let i = round - 1; i > 0; i--) {
            const destMatchup = Math.ceil(matchup / (2 ** count));

            if (i === round - 1) {
                newBracket = updateBracket(newBracket, region, i, destMatchup, `team${matchup % 2 !== 0 ? 1 : 2}`, bracket[region][round][matchup][`team${team}`]);
                newBracket = updateBracket(newBracket, region, i, destMatchup, `team${matchup % 2 !== 0 ? 1 : 2}name`, bracket[region][round][matchup][`team${team}name`]);
            } else {
                const keyName = bracket[region][round][matchup][`team${bracket[region][round][matchup]['teamselected']}name`];
                newBracket = updateBracket(newBracket, region, i, destMatchup, keyName, "SEARCH_AND_DELETE");
            }

            count++;
        }

        if (round === '1') {
            console.log("HERE!!")
            if (savedBuild['Regions'] == 2) {

                newBracket = updateBracket(newBracket, 'finals', "FINALS", null, `team${region === 1 ? 1 : 2}`, bracket[region][round][matchup][`team${team}`]);
                newBracket = updateBracket(newBracket, 'finals', "FINALS", null, `team${region === 1 ? 1 : 2}name`, bracket[region][round][matchup][`team${team}name`]);
            }

            if (savedBuild['Regions'] == 4) {
                const side = (region === 1 || region === 3) ? 'left' : 'right';
                const teamIndex = (region === 1 || region === 2) ? 1 : 2;

                newBracket = updateBracket(newBracket, 'semis', side, 'SEMIS', `team${teamIndex}`, bracket[region][round][matchup][`team${team}`]);
                newBracket = updateBracket(newBracket, 'semis', side, 'SEMIS', `team${teamIndex}name`, bracket[region][round][matchup][`team${team}name`]);
            }
        }

        if (region === 'semis' && savedBuild['Regions'] === 4) {
            const teamIndex = matchup === 'left' ? 1 : 2;
            newBracket = updateBracket(newBracket, 'finals', "FINALS", null, `team${teamIndex}`, bracket[region][matchup][`team${team}`]);
            newBracket = updateBracket(newBracket, 'finals', "FINALS", null, `team${teamIndex}name`, bracket[region][matchup][`team${team}name`]);
        }

        // ✅ Now apply all changes to state at once
        console.log("Updated bracket:", newBracket);
        setBracket(newBracket);
    };

    const updatePlayBracket = (bracket, region, round, matchup, key, value) => {
        const copyBracket = JSON.parse(JSON.stringify(bracket));

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

        return copyBracket;
    };

    const recieveAdminPicks = async (region, event, teamName, team, round, matchup, numRounds) => {
        let newBracket = JSON.parse(JSON.stringify(playBracket)); // start from current

        if (region == 'finals') {
            newBracket = updatePlayBracket(newBracket, 'finals', "FINALS", null, `teamselected`, team);
        } else if (region == 'semis') {
            newBracket = updatePlayBracket(newBracket, 'semis', matchup, 'SEMIS', `teamselected`, team);
        } else {
            newBracket = updatePlayBracket(newBracket, region, round, matchup, 'teamselected', team);
        }

        let count = 1;
        for (let i = round - 1; i > 0; i--) {
            const destMatchup = Math.ceil(matchup / (2 ** count));

            if (i === round - 1) {
                newBracket = updatePlayBracket(newBracket, region, i, destMatchup, `team${matchup % 2 !== 0 ? 1 : 2}`, playBracket[region][round][matchup][`team${team}`]);
                newBracket = updatePlayBracket(newBracket, region, i, destMatchup, `team${matchup % 2 !== 0 ? 1 : 2}name`, playBracket[region][round][matchup][`team${team}name`]);
            } else {
                const keyName = playBracket[region][round][matchup][`team${playBracket[region][round][matchup]['teamselected']}name`];
                newBracket = updatePlayBracket(newBracket, region, i, destMatchup, keyName, "SEARCH_AND_DELETE");
            }

            count++;
        }

        if (round == '1') {
            if (savedBuild['Regions'] == 2) {
                newBracket = updatePlayBracket(newBracket, 'finals', "FINALS", null, `team${region === 1 ? 1 : 2}`, playBracket[region][round][matchup][`team${team}`]);
                newBracket = updatePlayBracket(newBracket, 'finals', "FINALS", null, `team${region === 1 ? 1 : 2}name`, playBracket[region][round][matchup][`team${team}name`]);
            }

            if (savedBuild['Regions'] == 4) {
                const side = region == 1 || region == 3 ? 'left' : 'right';
                const teamIndex = (region == 1 || region == 2) ? 1 : 2;

                newBracket = updatePlayBracket(newBracket, 'semis', side, 'SEMIS', `team${teamIndex}`, playBracket[region][round][matchup][`team${team}`]);
                newBracket = updatePlayBracket(newBracket, 'semis', side, 'SEMIS', `team${teamIndex}name`, playBracket[region][round][matchup][`team${team}name`]);
            }
        }

        if (region == 'semis' && savedBuild['Regions'] == 4) {
            const teamIndex = matchup == 'left' ? 1 : 2;
            newBracket = updatePlayBracket(newBracket, 'finals', "FINALS", null, `team${teamIndex}`, playBracket[region][matchup][`team${team}`]);
            newBracket = updatePlayBracket(newBracket, 'finals', "FINALS", null, `team${teamIndex}name`, playBracket[region][matchup][`team${team}name`]);
        }

        setPlayBracket(newBracket);

        try {
            const docRef = doc(db, "ActiveGames", gameID);
            await updateDoc(docRef, { playBracket: structuredClone(newBracket) });
        } catch (error) {
            console.error("Failed to update Firestore:", error);
        }
    };


    const submit = () => {

        const userId = currentUser.uid;

        const bracketDocRef = doc(db, "ActiveGames", gameID, "brackets", userId);

        setDoc(bracketDocRef, { bracket });

        alert("Submitted");
    }

    if (!gameID) {
        return <p className={styles.error}>No game selected. Please try again.</p>;
    }


    if (loading || playBracket === null || playBracket === undefined) {
        return <p className={styles.loading}>Loading...</p>;
    }

    return (
        <>
            {
                new Date() < new Date(savedBuild.Deadline) ?
                    <div className={styles.upper_container}>
                        <h1 className={styles.title}>{savedBuild.Title}</h1>
                        <h2 className={styles.subtitle}>Deadline to Enter Picks: {new Date(savedBuild.Deadline).toLocaleString()}</h2>
                        <h2 className={styles.subtitle}>
                            {isHost && (
                                <div className={styles.host_desc}>
                                    <span className={styles.youre_host}>You're The Host!</span>
                                    <button onClick={handleStartClick} className={styles.start_game}>Lock Picks - Start Tournament Now</button>
                                </div>
                            )}
                        </h2>
                        <h2 className={styles.subtitle}>
                            {savedBuild.Format.charAt(0).toUpperCase() + savedBuild.Format.slice(1)} Bracket
                        </h2>

                        <PanZoomCanvas type='pick'>
                            <div>
                                <PickSingleEliminationBracket buildData={savedBuild} bracket={bracket} updateBracketFunc={recievePicks} />
                            </div>
                        </PanZoomCanvas>

                        <button onClick={submit} className={styles.submit_button}>
                            {"Submit Your Picks"}
                        </button>

                        {showPopup && (
                            <Popup
                                message="Are you sure you want to start the tournament? All picks will be locked."
                                onConfirm={handleConfirm}
                                onCancel={handleCancel}
                            />
                        )}

                    </div>
                    :
                    <div className={styles.upper_container}>
                        <h1 className={styles.title}>{savedBuild.Title}</h1>
                        <h2 className={styles.subtitle}>{savedBuild?.Format?.charAt(0).toUpperCase() + savedBuild?.Format?.slice(1) || ""} Bracket</h2>
                        <h2 className={styles.subtitle}>
                            {isHost && (
                                <div className={styles.host_desc}>
                                    <span className={styles.youre_host}>You're The Host!</span>
                                    <span className={styles.select_winner_bla_bla_bla}>Select winners in each matchup to update tournament</span>
                                </div>
                            )}
                        </h2>


                        <>

                            {isHost ?
                                <>
                                    <PanZoomCanvas type='pick'>
                                        <div>
                                            <AdminChooseSingleEliminationBracket buildData={savedBuild} bracket={playBracket} playBracket={playBracket} updateBracketFunc={recieveAdminPicks} gameID={gameID} />
                                        </div>
                                    </PanZoomCanvas>
                                    <h2 className={styles.subtitle}>Your Bracket</h2>
                                </>
                                :
                                <></>
                            }
                            <PanZoomCanvas type='pick'>
                                <div>
                                    <PlayerViewSingleEliminationBracket buildData={savedBuild} bracket={playBracket} playBracket={bracket} />
                                </div>
                            </PanZoomCanvas>
                        </>


                    </div>
            }

            <GamePlayerList currentUser={currentUser} isInPlay={new Date() > new Date(savedBuild.Deadline)} playBracket={playBracket} playerBrackets={playerBrackets} numRegions={numRegions} numRounds={Math.ceil(Math.log2(teamsPerRegion))} />
        </>

    );
};

export default GameView;