import React from 'react'
import './subcomponents/FirebaseConfig';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, updateDoc, arrayUnion, getDoc } from "firebase/firestore"; 
import { app } from './subcomponents/FirebaseConfig';
import styles from "./MyBracketGroups.module.css";

let currentUser = '';
const auth = getAuth();

const db = getFirestore(app);
let userRef;
let userDocSnap;

let gameRef;
let gameDocSnap;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUser = user;
    userRef = doc(db, "Users", currentUser.uid);
    // userDocSnap =  await getDoc(docRef);

    
  } else {
    currentUser = "N/A"
  }
});



const MyBracketGroups = () => {
 
  return (
    
    <>

      {
        (currentUser !== '' && currentUser !== 'N/A' && userDocSnap !== undefined) ?
        Object.values(userDocSnap.data().games).map((joinCode, i) => (
            <div className={styles.container}>
              <div className={styles.number}>
                <p>#{i}</p>
              </div>
              <div className={styles.name}>
                <p>Name:</p>
                <p>{doc(db, "Users", currentUser.uid)}</p>
              </div>
              <div className={styles.joinCode}>
                <p>Join Code:</p>
                <p>{joinCode}</p>
              </div>
              <div className={styles.bracketSize}>
                <p>Bracket Size:</p>
                <p>{joinCode}</p>
              </div>
              <div className={styles.players}>
                <p>Number of Players:</p>
                <p>{joinCode}</p>
              </div>
            </div>  
        ))
        :
        <></>
      }
      
    </>
  )
}

export default MyBracketGroups