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

const MyBracketGroups = () => {
  return (
    <div>MyBracketGroups</div>
  )
}

export default MyBracketGroups