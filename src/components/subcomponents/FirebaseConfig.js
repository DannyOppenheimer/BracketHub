import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAdse8QSco1KuBYAq-Hs7nSlXEry4ysQ8k",
  authDomain: "bracketplexus-b30b9.firebaseapp.com",
  projectId: "bracketplexus",
  storageBucket: "bracketplexus.appspot.com",
  messagingSenderId: "135384914174",
  appId: "1:135384914174:web:0f6d9566832e824a5aedaf"
};

const app = initializeApp(firebaseConfig);

export {app};
