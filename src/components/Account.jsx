import React, { useState, useEffect } from 'react';
import './subcomponents/FirebaseConfig';
import styles from "./Account.module.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Navigate, useNavigate } from 'react-router-dom';
import StyleButton from './subcomponents/StyleButton';

const Account = () => {
    const [currentUser, setCurrentUser] = useState(null);  // Manage user state
    const [loading, setLoading] = useState(true);         // Manage loading state
    const navigate = useNavigate();
    const auth = getAuth();

    // Check for auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);  // Update current user
            } else {
                setCurrentUser(null);  // Reset if no user
            }
            setLoading(false);  // Stop loading
        });

        // Cleanup the listener on component unmount
        return () => unsubscribe();
    }, [auth]);

    // Handle logout
    const logout = () => {
        auth.signOut().then(() => {
            navigate('/confirmation', { state: { message: 'Successfully Logged Out!' } });
        });
    };

    // Show loading indicator while checking auth
    if (loading) {
        return <p className={styles.loading}>Loading...</p>;
    }

    // Redirect if no user
    if (!currentUser) {
        return <Navigate to="/signup" />;
    }

    return (
        <div className={styles.container}>
            <table>
                <tbody>
                    <tr>
                        <td>Username</td>
                        <td>{currentUser.displayName}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>{currentUser.email}</td>
                    </tr>
                </tbody>
            </table>
            <StyleButton text={"Log Out"} clicked={logout} />
        </div>
    );
}

export default Account