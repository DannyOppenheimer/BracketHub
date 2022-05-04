import React, { useState } from 'react';
import StyleButton from './subcomponents/StyleButton';
import './subcomponents/FirebaseConfig';
import styles from './CreateBracket.module.css';
import SingleEliminationBracket from './subcomponents/bracket_components/SingleEliminationBracket';
import SubtitleWithInfo from './subcomponents/SubtitleWithInfo';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { NavLink } from "react-router-dom";


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

    // Booleans that check the state of the current build, ie. if the user has chosen it to be an online bracket thats public
    const printable = savedBuild['Format'] === 'print';
    const sharable = savedBuild['Format'] === 'online';
    const publicAccess = savedBuild['Access'] === 'public';
    const privateAccess = savedBuild['Access'] === 'private';
    
    
    return (
        <>
            <div className={styles.container}>
                <h2 className={styles.subtitle}>Build a Bracket</h2>

                <div className={styles.current_build}>
                    <h2 className={styles.subsubtitle}>Current Build</h2>
                    {
                        Object.keys(savedBuild).map((keyName, i) => (
                            // Each item from the "savedBuild" object. Used to update the current build on the top right of the screen.
                            // Classname will change when on the last item to draw lines only between each item, not below
                            <span className={(Object.keys(savedBuild).length - 1) === i ? styles.last : styles.inter} key={'d' + i}>{Object.keys(savedBuild)[i]}: {savedBuild[keyName]} </span>
                        ))
                    }

                </div>

                <div className={styles.decision}>
                    <StyleButton clicked={() => {setSavedBuild({'Format': 'print'})}} text='Printable PDF Bracket'/>
                    <StyleButton clicked={() => setSavedBuild({'Format': 'online'})} text='Live, Online Bracket'/>
                </div>
                {savedBuild['Format'] === 'online' && (currentUser === "N/A" || currentUser === '') ? <p className={styles.error}>Warning! You are not signed in, so you will not be able to create this live bracket even after configuration. Please <NavLink to="/signin">Sign In</NavLink> or <NavLink to="/signup">Sign Up</NavLink> first</p> : <></>}
                <div className={styles.decision}>
                    {savedBuild['Format'] === 'online' ?
                    <>
                        <StyleButton clicked={() => setSavedBuild({...savedBuild, 'Access': 'public'})} text='Public Bracket'/>
                        <StyleButton clicked={() => setSavedBuild({...savedBuild, 'Access': 'private'})} text='Private Bracket'/>
                    </>
                    :
                        <></>
                    }
                </div>
                
                <div className={styles.decision}>
                    {/* only show title and team input when previous selections have been made */}
                    {((sharable && publicAccess) || (sharable && privateAccess)) || printable ? 
                        <>
                            <SubtitleWithInfo title='Title' popupText='The name of your bracket. Will appear at the top.' />
                            
                            <input className={styles.create_text_input} type='text' placeholder='Title of bracket' onInput={(e) => setSavedBuild({...savedBuild, 'Title': e.target.value})}/>
                        </>
                        
                    :
                        <></>
                    }
                </div>
                <div className={styles.decision}>
                    {(savedBuild['Title'] !== undefined) ? 
                        <>
                            <SubtitleWithInfo title='Number of Regions' popupText='Number of regions. For example, the NCAA Mens Tournament has 4 regions. For simple brackets, just put 1 region. This caps at 8.' />
                            {/* Blur function prevents "scrolling" on top of number inputs from changing the number */}
                            <input className={styles.create_text_input} onWheel={(e) => e.target.blur()} type='number' placeholder='Number of regions' onInput={(e) => {
                                if(e.target.value < 1 && e.target.value !== '') {
                                    e.target.value = 1;
                                }
                                if(e.target.value > 4 && e.target.value !== '') {
                                    e.target.value = 4;
                                }
                                setSavedBuild({...savedBuild, 'Regions': e.target.value});
                            }
                            }/>
                        </>
                        
                    :
                        <></>
                    }
                </div>
                <div className={styles.decision}>
                    {/* only show input when previous selections have been made */}
                    {(savedBuild['Regions'] !== undefined) ? 
                        <>
                            <SubtitleWithInfo title='Number of competitors per region' popupText='Number of participants in each region. For example, the NCAA Mens Tournament has 16 teams in each region. If you have 1 region, just list the number of participants. This caps at 128' />
                            <input className={styles.create_text_input} onWheel={(e) => e.target.blur()} type='number' placeholder='Number of competitors' onInput={(e) => {
                                if(e.target.value < 1 && e.target.value !== '') {
                                    e.target.value = 1;
                                }
                                if(e.target.value > 128 && e.target.value !== '') {
                                    e.target.value = 128;
                                }
                                if(!((savedBuild['Participants Per Region'] & (savedBuild['Participants Per Region'] - 1)) === 0)) {
                                    setSavedBuild(delete savedBuild['Playin'])
                                }
                                setSavedBuild({...savedBuild, 'Participants Per Region': e.target.value});
                            }
                            }/>
                        </>
                        
                    :
                        <></>
                    }
                </div>
                <div className={styles.decision}>
                    {(savedBuild['Participants Per Region'] !== undefined) ? 
                        <>
                            <StyleButton clicked={() => setSavedBuild({...savedBuild, 'Seeding': 'on'})} text='Seeding Enabled'/>
                            <StyleButton clicked={() => setSavedBuild({...savedBuild, 'Seeding': 'off'})} text='Seeding Disabled'/>
                        </>
                    :
                        <></>
                    }
                </div>

                <div className={styles.decision}>
                    {/* Last check in this row makes sure that the input isnt a power of 2 (2, 4, 8, 16, 32, 64) so it can give a play in option */}
                    {(savedBuild['Seeding'] !== undefined && savedBuild['Seeding'] !== '') && ((savedBuild['Participants Per Region'] !== 0) && !((savedBuild['Participants Per Region'] & (savedBuild['Participants Per Region'] - 1)) === 0)) ? 
                        <>
                            <StyleButton clicked={() => setSavedBuild({...savedBuild, 'Playin': 'on'})} text='Play-in Games Enabled'/>
                            <StyleButton clicked={() => setSavedBuild({...savedBuild, 'Playin': 'off'})} text='Play-in Games Disabled'/>
                        </>
                    :
                        <></>
                    }
                </div>
                
            </div>
            <>
                {
                    (savedBuild['Playin'] !== undefined && savedBuild['Playin'] !== undefined) || ((savedBuild['Seeding'] !== undefined && savedBuild['Seeding'] !== '') && ((savedBuild['Participants Per Region'] & (savedBuild['Participants Per Region'] - 1)) === 0)) ?
                        <SingleEliminationBracket data={savedBuild} sendBracketUp={setBuiltBracket} />
                    :
                        <></>
                }
            </>
        </>
    )
}

export default CreateBracket