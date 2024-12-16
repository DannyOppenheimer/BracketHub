import React, { useState, useEffect } from 'react';
import '../subcomponents/FirebaseConfig';
import styles from "./Account.module.css";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { Navigate, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import StyleButton from '../subcomponents/StyleButton';

const Account = () => {
    const [currentUser, setCurrentUser] = useState(null);  // Manage user state
    const [loading, setLoading] = useState(true);          // Manage loading state
    const [isEditing, setIsEditing] = useState(false);     // Edit mode state
    const [newDisplayName, setNewDisplayName] = useState(''); // New display name input
    const navigate = useNavigate();
    const auth = getAuth();

    // Check for auth state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);  // Update current user
                setNewDisplayName(user.displayName); // Set default display name
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

    // Save the updated display name
    const handleSave = () => {

        if (currentUser) {
            updateProfile(currentUser, { displayName: newDisplayName })
                .then(() => {

                    setIsEditing(false);
                })
                .catch((error) => {
                    console.error("Error updating display name:", error.message);
                });
        }
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
            <table className={styles.accountInfoTable}>
                <tbody className={styles.accountInfoTableBody}>
                    <tr>
                        <td>Display Name</td>
                        <td>
                            {isEditing ? (
                                <>
                                    <input
                                        type="text"
                                        value={newDisplayName}
                                        onChange={(e) => setNewDisplayName(e.target.value)}
                                        className={styles.editInput}
                                    />
                                    
                                    <button onClick={handleSave} className={styles.saveButton}>
                                        Save
                                    </button>
                                </>
                            ) : (
                                <>
                                    {currentUser.displayName || "No Display Name"}
                                    <FontAwesomeIcon
                                        icon={faPencilAlt}
                                        className={styles.editIcon}
                                        onClick={() => setIsEditing(true)}
                                    />
                                </>
                            )}
                        </td>
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
};

export default Account;