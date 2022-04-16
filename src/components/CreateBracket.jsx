import React from 'react';
import CreationOptionsMenu from './subcomponents/CreationOptionsMenu';
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

const CreateBracket = () => {

    return (
        <div className='container'>
            <h2 className='subtitle'>Build a Bracket</h2>
            <CreationOptionsMenu />
            
        </div>
    )
}

export default CreateBracket