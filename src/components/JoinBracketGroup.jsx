import React from 'react'
import './subcomponents/FirebaseConfig';
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

const JoinBracketGroup = () => {
  return (
    <div>
        <h1>Join a Bracket</h1>
        <p>Input the unique 10 character code</p>
        <input type='text' placeholder='10 Character Code'></input>
        <button>Submit</button>
    </div>
  )
}

export default JoinBracketGroup