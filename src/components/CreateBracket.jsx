import React, { useState } from 'react';
import StyleButton from './subcomponents/StyleButton';
import './subcomponents/FirebaseConfig';
import styles from './CreateBracket.module.css';
import SingleEliminationBracket from './subcomponents/SingleEliminationBracket';
import { getAuth, onAuthStateChanged } from "firebase/auth";


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

    const [savedBuild, setSavedBuild] = useState('');

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
                            <h3>Title</h3>
                            <input className={styles.create_text_input} type='text' placeholder='Title of bracket' onInput={(e) => setSavedBuild({...savedBuild, 'Title': e.target.value})}/>
                        </>
                        
                    :
                        <></>
                    }
                </div>
                <div className={styles.decision}>
                    {(savedBuild['Title'] !== undefined) ? 
                        <>
                            <h3>Number of Regions</h3>
                            <input className={styles.create_text_input} type='number' placeholder='Number of regions' onInput={(e) => {
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
                    {/* only show title and team input when previous selections have been made */}
                    {(savedBuild['Regions'] !== undefined) ? 
                        <>
                            <h3>Number of Competitors per Region</h3>
                            <input className={styles.create_text_input} type='number' placeholder='Number of competitors' onInput={(e) => {
                                if(e.target.value < 2 && e.target.value !== '') {
                                    e.target.value = 2;
                                }
                                if(e.target.value > 128 && e.target.value !== '') {
                                    e.target.value = 128;
                                }
                                setSavedBuild({...savedBuild, 'Amount': e.target.value});
                            }
                            }/>
                        </>
                        
                    :
                        <></>
                    }
                </div>
                <div className={styles.decision}>
                    {(savedBuild['Amount'] !== undefined && savedBuild['Amount'] !== '') ? 
                        <>
                            <StyleButton clicked={() => setSavedBuild({...savedBuild, 'Seeding': 'on'})} text='Seeding Enabled'/>
                            <StyleButton clicked={() => setSavedBuild({...savedBuild, 'Seeding': 'off'})} text='Seeding Disabled'/>
                        </>
                    :
                        <></>
                    }
                </div>
                
            </div>
            <>
                {
                    savedBuild['Seeding'] !== undefined && savedBuild['Amount'] !== undefined && savedBuild['Amount'] !== '' ?
                        <SingleEliminationBracket data={savedBuild} />
                    :
                        <></>
                }
            </>
        </>
    )
}

export default CreateBracket