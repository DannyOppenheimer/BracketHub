import React from 'react';
import styles from './BracketMatchup.module.css';
import PropTypes from 'prop-types';

const BracketMatchup_INACTIVE = () => {
    return (
        <div className={styles.inactive_matchup}>
            <ul className={styles.matchup}>

                <li className={styles.team}>
                    <p className={styles.seed_num}><></></p>
                    <input className={styles.team_input} type='text' disabled={true} />
                </li>
                <div className={styles.lower_line}></div>
                <li className={styles.team}>
                    <p className={styles.seed_num}><></></p>
                    <input className={styles.team_input} type='text' disabled={true} />

                </li>

            </ul>
        </div>
    )
}

export default BracketMatchup_INACTIVE