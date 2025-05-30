import React, { useState } from 'react';
import StyleButton from '../subcomponents/style_components/StyleButton';
import { app } from '../subcomponents/FirebaseConfig';
import styles from './CreateBracket.module.css';
import CreateSingleEliminationBracket from '../subcomponents/bracket_types/CreateSingleEliminationBracket.jsx';
import SingleEliminationBracket from '../subcomponents/single_elim_bracket/SingleEliminationBracket';

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { NavLink } from "react-router-dom";
import { getFirestore, doc, setDoc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import PanZoomCanvas from '../subcomponents/style_components/PanZoomCanvas.jsx';

let currentUser = '';
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
    } else {
        currentUser = "N/A"
    }
});

const CreateBracket = () => {

    // JS Object containing the users CONFIGURATION settings, ie: title, number of regions
    const [savedBuild, setSavedBuild] = useState('');
    // JS Object containing the actual GENERATED BRACKET based on the config settings
    const [builtBracket, setBuiltBracket] = useState('');

    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);


    const navigate = useNavigate();

    const submit = async () => {

        setIsSubmitButtonDisabled(true);

        confetti({
            particleCount: 150,
            spread: 150, // Spread the confetti particles
            origin: { y: 1.0 }, // Start position at 60% of the height
        });

        // If the build is set to an online version, get ready to update firestore database
        if (savedBuild['Format'] === 'online') {
            let host = currentUser;
            // Create a random alphanumerical join code 5 characters long
            let joinCode = (Math.random().toString(36) + '00000000000000000').slice(2, 7);

            const db = getFirestore(app);

            // Create a new document for the new bracket group
            await setDoc(doc(db, "ActiveGames", joinCode), {
                name: savedBuild['Title'],
                regionNum: savedBuild['Regions'],
                host: host.uid,
                players: [host.uid],
                bracket: builtBracket,
                perRegion: savedBuild['Participants Per Region'],
                numRegions: savedBuild['Regions'],
                seeded: savedBuild['Seeding'],
                access: savedBuild['Access'],
                deadline: savedBuild['Deadline'],
                type: 'singleelim_predict',
                brackets: {},
                winner: null,


            });

            let docRef = doc(db, "Users", host.uid);
            const docSnap = await getDoc(docRef);
            // Check if a user has already created or joined a game, and then add this game to their array
            if (docSnap.exists()) {
                await updateDoc(doc(db, "Users", host.uid), {
                    games: arrayUnion(joinCode),
                })
                setTimeout(() => {
                    navigate('/bracket-groups');
                }, 1000);
            } else {
                console.log("user does not exist");
            }

            console.log("sending to bracket");
        }
    }

    // Booleans that check the state of the current build, ie. if the user has chosen it to be an online bracket thats public
    const printable = savedBuild['Format'] === 'print';
    const sharable = savedBuild['Format'] === 'online';
    const publicAccess = savedBuild['Access'] === 'public';
    const privateAccess = savedBuild['Access'] === 'private';


    return (
        <>
            <div className={styles.whole_page}>
                <div className={styles.container}>
                    <h2 className={styles.subtitle}>Build a Bracket</h2>

                    <div className={styles.decision}>
                        <StyleButton clicked={() => { setSavedBuild({ 'Format': 'print' }) }} text='Printable PDF Bracket' />
                        <StyleButton clicked={() => setSavedBuild({ 'Format': 'online' })} text='Live, Online Bracket' />
                    </div>
                    {savedBuild['Format'] === 'online' && (currentUser === "N/A" || currentUser === '') ? <p className={styles.error}>Warning! You are not signed in, so you will not be able to create this live bracket even after configuration. Please <NavLink to="/signin">Sign In</NavLink> or <NavLink to="/signup">Sign Up</NavLink> first</p> : <></>}
                    <div className={styles.decision}>
                        {savedBuild['Format'] === 'online' ?
                            <>
                                <StyleButton clicked={() => setSavedBuild({ ...savedBuild, 'Access': 'public' })} text='Public Bracket' />
                                <StyleButton clicked={() => setSavedBuild({ ...savedBuild, 'Access': 'private' })} text='Private Bracket' />
                            </>
                            :
                            <></>
                        }
                    </div>

                    <div className={styles.decision}>
                        {/* only show title and team input when previous selections have been made */}
                        {((sharable && publicAccess) || (sharable && privateAccess)) || printable ?
                            <>
                                <p className={styles.subtitle}>Title</p>
                                <input className={styles.create_text_input} type='text' placeholder='Title of bracket' onInput={(e) => setSavedBuild({ ...savedBuild, 'Title': e.target.value })} />
                            </>

                            :
                            <></>
                        }
                    </div>
                    <div className={styles.decision}>
                        {(savedBuild['Title'] !== undefined) ?
                            <>
                                <p className={styles.subtitle}>Number of Regions</p>
                                {/* Blur function prevents "scrolling" on top of number inputs from changing the number */}
                                <input className={styles.create_text_input} onWheel={(e) => e.target.blur()} type='number' placeholder='Number of regions' onInput={(e) => {
                                    if (e.target.value < 1 && e.target.value !== '') {
                                        e.target.value = 1;
                                    }
                                    if (e.target.value > 4 && e.target.value !== '') {
                                        e.target.value = 4;
                                    }
                                    if (e.target.value == 3 && e.target.value !== '') {
                                        e.target.value = 4;
                                    }
                                    setSavedBuild({ ...savedBuild, 'Regions': e.target.value });
                                }
                                } />
                            </>

                            :
                            <></>
                        }
                    </div>
                    <div className={styles.decision}>
                        {/* only show input when previous selections have been made */}
                        {(savedBuild['Regions'] !== undefined) ?
                            <>
                                <p className={styles.subtitle}>Number of Competitors Per Region</p>
                                <input className={styles.create_text_input} onWheel={(e) => e.target.blur()} type='number' placeholder='Number of competitors' onInput={(e) => {
                                    if (e.target.value < 1 && e.target.value !== '') {
                                        e.target.value = 1;
                                    }
                                    if (e.target.value > 32 && e.target.value !== '') {
                                        e.target.value = 32;
                                    }
                                    setSavedBuild({ ...savedBuild, 'Participants Per Region': e.target.value });
                                }
                                } />
                            </>

                            :
                            <></>
                        }
                    </div>
                    <div className={styles.decision}>
                        {(savedBuild['Participants Per Region'] !== undefined) ?
                            <>
                                <StyleButton clicked={() => setSavedBuild({ ...savedBuild, 'Seeding': 'on' })} text='Seeding Enabled' />
                                <StyleButton clicked={() => setSavedBuild({ ...savedBuild, 'Seeding': 'off' })} text='Seeding Disabled' />
                            </>
                            :
                            <></>
                        }
                    </div>
                    <div className={styles.decision}>
                        {savedBuild['Seeding'] !== undefined && savedBuild['Seeding'] !== '' && savedBuild['Format'] === 'online' ?
                            <>
                                <p className={styles.subtitle}>Deadline to Make Picks</p>
                                {/* Blur function prevents "scrolling" on top of number inputs from changing the number */}
                                <input
                                    className={styles.create_text_input}
                                    onWheel={(e) => e.target.blur()}
                                    type="datetime-local"
                                    placeholder="Deadline"
                                    onBlur={(e) => {
                                        const currentDate = new Date(); // Get the current date and time
                                        const inputDate = new Date(e.target.value); // Parse the input value to a Date object

                                        // Check if the input date is valid and in the past
                                        if (inputDate < currentDate) {
                                            // Add 24 hours to the current date and time
                                            const newDeadline = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);

                                            // Format the new deadline as 'YYYY-MM-DDTHH:MM' for datetime-local input
                                            const formattedDeadline = newDeadline.toISOString().slice(0, 16);

                                            // Update the input field value and state
                                            e.target.value = formattedDeadline;
                                            setSavedBuild({ ...savedBuild, Deadline: formattedDeadline });
                                        } else {
                                            // Update the state if the deadline is valid
                                            setSavedBuild({ ...savedBuild, Deadline: e.target.value });
                                        }
                                    }}
                                    onChange={(e) => {
                                        // Allow typing and update the state without validation
                                        setSavedBuild({ ...savedBuild, Deadline: e.target.value });
                                    }}
                                />
                            </>

                            :
                            <></>
                        }
                    </div>


                </div>
                <div className={styles.bracket_view}>
                    {
                        ((savedBuild['Deadline'] !== undefined && savedBuild['Deadline'] !== '') || (savedBuild['Format'] === 'print' && savedBuild['Seeding'] !== undefined && savedBuild['Seeding'])) ?
                            <>
                                <PanZoomCanvas type={'create'}>
                                    <CreateSingleEliminationBracket buildData={savedBuild} updateBracketFunc={setBuiltBracket} />
                                </PanZoomCanvas>
                            </>
                            :
                            <div className={styles.bracket_placeholder}>
                                <p className={styles.placeholder_label}>Waiting for user to create...</p>
                            </div>

                    }
                </div>
            </div >
            <div className={styles.submit_button}>
                {
                    ((savedBuild['Deadline'] !== undefined && savedBuild['Deadline'] !== '') || (savedBuild['Format'] === 'print' && savedBuild['Seeding'] !== undefined && savedBuild['Seeding'])) ?
                        <StyleButton clicked={() => submit()} text='Submit Bracket' disabled={isSubmitButtonDisabled} />
                        :
                        <></>
                }

            </div>

        </>
    )
}

export default CreateBracket