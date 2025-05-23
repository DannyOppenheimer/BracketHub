import React from 'react'
import AuthFields from '../subcomponents/function_components/AuthFields';
import '../subcomponents/FirebaseConfig';
import styles from './Signin.module.css';
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

const Signin = () => {
    return (
        <div className={styles.card}>
            <AuthFields title='Sign In' user={currentUser} />
        </div>
    )
}

export default Signin
