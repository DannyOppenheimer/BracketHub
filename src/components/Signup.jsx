import React from "react";
import AuthFields from './subcomponents/AuthFields';
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

const Signup = () => {
  return (
    <div>
        <AuthFields title='Sign Up' user={currentUser} />
    </div>
  )
}

export default Signup
