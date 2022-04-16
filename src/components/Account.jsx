import React, { useState, useEffect } from 'react';
import './subcomponents/FirebaseConfig';
import styles from "./Account.module.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Navigate } from 'react-router-dom';

let currentUser = '';
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
  } else {
    currentUser = "N/A"
  }
});

const Account = () => {

    return (
        <div>
            {currentUser !== "N/A" ? 
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