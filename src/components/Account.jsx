import React, { useState, useEffect } from 'react';
import './subcomponents/FirebaseConfig';
import styles from "./Account.module.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Navigate, useNavigate } from 'react-router-dom';
import StyleButton from './subcomponents/StyleButton';

let currentUser = '';
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
  } else {
    currentUser = "N/A"
  }
});

const logout = () => {
    auth.signOut().then(() => {
        const navigate = useNavigate();
        navigate('/');
    }, function(error) {
        // An error happened.
    });
}

const Account = () => {

    return (
        <div>
            {currentUser !== "N/A" && currentUser !== '' ? 
                (
                    <>
                        <table>
                            <tbody>
                                <tr>
                                    <td>Username</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                        <StyleButton text={"Log Out"} clicked={logout} />
                    </>
                ) : 
                (
                    // If the user isnt signed in redirect them to the sign up page
                    <Navigate to="/signup" />
                )
            }
        </div>
    )
}

export default Account