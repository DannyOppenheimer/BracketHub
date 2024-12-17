import React from 'react'
import { NavLink } from "react-router-dom";
import styles from "./Navigation.module.css";

const Navigation = () => {
    return (
        <div className={styles.container}>
            <ul className={styles.big_header_list}>
                {/* For header on all pages: */}
                <li className={styles.header_item}><NavLink className={styles.header_button} to="/">Home</NavLink></li>
                <li className={styles.header_item}><NavLink className={styles.header_button} to="/bracket-builder">Create Bracket</NavLink></li>
                <li className={styles.header_item}><NavLink className={styles.header_button} to="/join-bracket">Join Bracket Group</NavLink></li>
                <li className={styles.header_item}><NavLink className={styles.header_button} to="/bracket-groups">My Bracket Groups</NavLink></li>
                <li className={styles.header_item}><NavLink className={styles.header_button} to="/explore">Explore</NavLink></li>

                <li className={styles.header_item_right}><NavLink className={styles.header_button} to="/Account"><img className={styles.account_image} alt='Account Icon' src={"https://cdn-icons-png.flaticon.com/512/748/748128.png"} /></NavLink></li>
            </ul>
        </div>
    )
}

export default Navigation
