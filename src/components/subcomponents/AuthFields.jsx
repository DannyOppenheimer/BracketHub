import React, { useState, useEffect  } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './AuthFields.module.css';
import PropTypes from 'prop-types';
import './FirebaseConfig';

import { Navigate, useNavigate } from 'react-router-dom';

import { app } from './FirebaseConfig';
import { getFirestore, doc, setDoc } from "firebase/firestore"; 
import { getAuth, onAuthStateChanged, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, signInWithPopup } from 'firebase/auth';

const AuthFields = ({ title }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [currentUser, setCurrentUser] = useState(null);  // Tracks user state
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    auth.useDeviceLanguage();

    const errorMessageMap = {
        'auth/weak-password': 'Your password must contain at least 6 characters.',
        'auth/invalid-email': 'Invalid Email.',
        'auth/user-not-found': 'That user does not exist. Please sign up first.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/email-already-in-use': 'That email is already in use.'
    };

    // Listen for auth state changes on page load
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);  // Persist user on reload
            } else {
                setCurrentUser(null);
            }
        });
        return () => unsubscribe();  // Clean up listener on unmount
    }, [auth]);

    // Handle authentication based on the command
    const handleAuthentication = (command) => {
        const db = getFirestore(app);
        setError('');
        setSuccess('');

        if (command === 'Sign In') {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    setCurrentUser(userCredential.user);
                    setSuccess('Sign in successful.');
                })
                .catch((error) => {
                    alert(error.code);
                    setError(errorMessageMap[error.code] || 'An error occurred.');
                });
        } else if (command === 'Sign Up') {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    user.displayName = username;
                    setSuccess('Sign up successful. Please check your email for verification.');
                    sendEmailVerification(user);

                   
                    setDoc(doc(db, "Users", user.uid), {
                        displayName: user.displayName,
                        games: [],
                    });

                })
                .catch((error) => {
                    setError(errorMessageMap[error.code] || 'An error occurred.');
                });
        } else if (command === 'Google') {
            signInWithPopup(auth, provider)
                .then((result) => {
                    setCurrentUser(result.user);
                    setSuccess('Sign in with Google successful.');

                    setDoc(doc(db, "Users", result.user.uid), {
                        displayName: result.user.displayName,
                        games: [],
                    });

                })
                .catch((error) => {
                    setError(errorMessageMap[error.code] || 'An error occurred.');
                });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.already_signed_in}>
                {currentUser ? (
                    <p>It looks like you're already signed into {currentUser.email}</p>
                ) : (
                    <></>
                )}
            </div>

            <h1 className={styles.title}>{title}</h1>

            <input
                className={styles.inputs}
                key="email"
                onInput={(e) => setEmail(e.target.value)}
                type="text"
                placeholder="Email"
            />

            {title === 'Sign Up' && (
                <input
                    className={styles.inputs}
                    key="username"
                    onInput={(e) => setUsername(e.target.value)}
                    type="text"
                    placeholder="Display Name"
                />
            )}

            <input
                className={styles.inputs}
                key="password"
                onInput={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
            />

            <button
                onClick={() => handleAuthentication(title)}
                className={styles.sub}
            >
                Submit
            </button>

            {success === '' && (
                <div
                    className={styles.google_sign_up_field}
                    onClick={() => handleAuthentication('Google')}
                >
                    <img
                        className={styles.google_logo}
                        src="https://upload.wikimedia.org/wikipedia/commons/2/2d/Google-favicon-2015.png"
                        alt="Google Logo"
                    />
                    <p className={styles.google_label}>Sign in with Google</p>
                </div>
            )}

            <div className={styles.errors}>
                {error !== errorMessageMap['auth/user-not-found'] ? (
                    <p>{error}</p>
                ) : (
                    <span>
                        {error} <NavLink to="/signup">Sign up</NavLink>
                    </span>
                )}
            </div>

            <div className={styles.success}>{success}</div>
        </div>
    );
};

AuthFields.propTypes = {
    title: PropTypes.string
}

export default AuthFields