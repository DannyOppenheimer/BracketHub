import React from 'react'
import styles from "./Home.module.css";
import '../subcomponents/FirebaseConfig';
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const handleButton = (path) => {
        navigate(path);
    }

    const description = "Make brackets for your backyard basketball tournament, online 1v1, or unique professional sport\nCreate groups, add your friends, enjoy March Madness style scoring. Completely free!"
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Bracket Hub</h1>
            <p className={styles.description}>{description}</p>
            <div className={styles.authentication_container}>
                <button className={styles.sign_up_button} onClick={() => handleButton('/signin')}>Sign In</button>
                <button className={styles.sign_up_button} onClick={() => handleButton('/signup')}>Sign up</button>
            </div>
            <div>
                <img className={styles.dino_pic} src="/dino.png" alt="Dino" />
            </div>
        </div>
    )
}

export default Home