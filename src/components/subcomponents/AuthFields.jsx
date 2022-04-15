import React, { useState } from 'react'
import styles from './AuthFields.module.css';
import PropTypes from 'prop-types'
import './FirebaseConfig';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const AuthFields = ({ title }) => {

    // State that contains the text inside email and password inputs. Updates all the time
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Map error codes to a custom message to appear below inputs
    const errorMessageMap = {
        "auth/weak-password": 'Your password must contain at least 6 characters.',
        "auth/invalid-email": "Invalid Email",
        "auth/user-not-found": 'That user does not exist. Please sign up first',

    }
    const [error, setError] = useState('');
    
    // Firebase auth var
    const auth = getAuth();

    // Handle authentication for both sign in and sign up
    const handleAuthentication = () => {
        // If currently on sign in page
        if(title === "Sign In") {
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // user after sign up
                const user = userCredential.user;
                console.log(user.email);
            })
            .catch((error) => {
                console.log(error.code + "\n" + error.message);
                setError(errorMessageMap[error.code]);
            });
        } 
        // If currently on sign up page
        else if(title === "Sign Up") {
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              // Signed in 
              const user = userCredential.user;
              console.log(user.email);
            })
            .catch((error) => {
                console.log(error.code + "\n" + error.message);
                setError(errorMessageMap[error.code])
            });
        }
    }

    return (
        <div className={styles.container}>

            <h1 className={styles.title}>{title}</h1>

            <input className={styles.inputs} key='email' onInput={e => setEmail(e.target.value)} type='text' placeholder='Email' />
            <input className={styles.inputs} key='password' onInput={e => setPassword(e.target.value)} type='text' placeholder='Password' />
            <div className={styles.errors}>{error}</div>
            <button onClick={handleAuthentication} className={styles.sub}>Submit</button>
        </div>
    )
}

AuthFields.propTypes = {
    title: PropTypes.string
}

export default AuthFields