import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './AuthFields.module.css';
import PropTypes from 'prop-types';
import './FirebaseConfig';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

const AuthFields = ({ title, user }) => {

    // State that contains the text inside email and password inputs. Updates all the time
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Map error codes to a custom message to appear below inputs
    const errorMessageMap = {
        'auth/weak-password': 'Your password must contain at least 6 characters. ',
        'auth/invalid-email': 'Invalid Email. ',
        'auth/user-not-found': 'That user does not exist. Please sign up first. ',
        'auth/wrong-password': 'Incorrect password. ',

    }
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Firebase auth var
    const auth = getAuth();

    // Handle authentication for both sign in and sign up
    const handleAuthentication = () => {
        // If currently on sign in page
        if(title === 'Sign In') {
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // user after sign up
                const user = userCredential.user;
                setSuccess("Sign in successful");
                console.log(user.email);
            })
            .catch((error) => {
                console.log(error.code + '\n' + error.message);
                setError(errorMessageMap[error.code]);
            });
        } 
        // If currently on sign up page
        else if(title === 'Sign Up') {
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              // Signed in 
              const user = userCredential.user;
              user.displayName = username;
              setSuccess("Sign up successful. Please check your email for verification.");
              // Send an email to the user that verifies its their email
              sendEmailVerification(user);
              console.log(user.email);
            })
            .catch((error) => {
                console.log(error.code + '\n' + error.message);
                setError(errorMessageMap[error.code])
            });
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.already_signed_in}>
                {user !== 'N/A' ? <p>It looks like you're already signed into {user.email}</p> : <></>}
            </div>
            <h1 className={styles.title}>{title}</h1>

            <input className={styles.inputs} key='email' onInput={e => setEmail(e.target.value)} type='text' placeholder='Email' />
            {/* Display a 'display name' input if on sign up page */}
            {
                title === 'Sign Up' 
                ? 
                <input className={styles.inputs} key='username' onInput={e => setUsername(e.target.value)} type='text' placeholder='Display Name' /> 
                : 
                <></>
            }
            <input className={styles.inputs} key='password' onInput={e => setPassword(e.target.value)} type='password' placeholder='Password' />
            
            <div className={styles.errors}>
                {/* If the error message is the non-existant user account, provide them a link to sign up as well */}
                {error !== 'That user does not exist. Please sign up first. ' ? (<p>{error}</p>) : (<span>{error} <NavLink to='/signup'>Sign up</NavLink></span>)}
            </div>
            <div className={styles.success}>
                {success}
            </div>
            {/* Submit form, either signs up or signs in based on title of page */}
            <button onClick={handleAuthentication} className={styles.sub}>Submit</button>
        </div>
    )
}

AuthFields.propTypes = {
    title: PropTypes.string
}

export default AuthFields