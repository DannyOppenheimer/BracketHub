import React from "react";
import AuthFields from './subcomponents/AuthFields';
import './subcomponents/FirebaseConfig';
import styles from './Signup.module.css';
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

const Signup = () => {
  return (
    <div className={styles.card}>
        <AuthFields title='Sign Up' user={currentUser} />
    </div>
  )
}

export default Signup
