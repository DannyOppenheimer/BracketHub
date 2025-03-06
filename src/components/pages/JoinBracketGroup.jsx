
import React, { useState } from 'react';
import '../subcomponents/FirebaseConfig';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import styles from "./JoinBracketGroup.module.css";
import { getFirestore, doc, updateDoc, arrayUnion } from "firebase/firestore";



let currentUser = '';
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
    } else {
        currentUser = "N/A"
    }
});

const JoinBracketGroup = () => {

    const [typedCode, setTypedCode] = useState('');

    const db = getFirestore();

    const handleSubmit = () => {
        console.log(typedCode);

        if (!currentUser || currentUser === '') {
            console.error("No user is signed in.");
            return;
        }

        try {
            const gameRef = doc(db, "ActiveGames", typedCode);
            const userRef = doc(db, "Users", currentUser.uid);

            updateDoc(gameRef, {
                players: arrayUnion(currentUser.uid),
            });

            updateDoc(userRef, {
                games: arrayUnion(typedCode),
            });

        } catch (error) {
            console.error("Error adding player to the bracket:", error.message);
        }
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Join a Bracket</h1>
            <p className={styles.label}>Input the unique 5 character code</p>
            <input className={styles.codeInput} onChange={(e) => setTypedCode(e.target.value)} type='text' placeholder='5 Character Code'></input>
            <button className={styles.submitButton} onClick={handleSubmit}>Submit</button>
        </div>
    )
}

export default JoinBracketGroup