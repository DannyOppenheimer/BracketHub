import React from 'react'
import styles from "./Home.module.css";
import { NavLink } from "react-router-dom";
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

const Home = () => {
    const description = "Make brackets for your backyard basketball tournament, online 1v1, or unique professional sport\nCreate groups and add your friends, or explore public brackets"
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Bracket Hub</h1>
            <p className={styles.description}>{description}</p>
            <div className={styles.authentication_container}>
                <NavLink className={styles.sign_up_button} to="/signin">Sign In</NavLink>
                <NavLink className={styles.sign_up_button} to="/signup">Sign up</NavLink>
            </div>
            <p></p>
        </div>
    )
}

export default Home