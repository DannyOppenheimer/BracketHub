import React from 'react';
import styles from './BracketMatchup.module.css';
import PropTypes from 'prop-types';

const BracketMatchup_BLANK = ({ seedingEnabled, seed1, seed2, oneTeam, returnTeams }) => {
  return (
    <ul className={styles.matchup}>
        <li className={styles.team}>
          <p className={styles.seed_num}>{seedingEnabled ? seed1 : <></>}</p>
          <input className={styles.team_input} type='text' placeholder='Team 1' />
        </li>
        <div className={styles.lower_line}></div>
        <li className={styles.team}>
          {
            // Display only 1 team in the matchup (for uneven numbers of participants)
            seed2 === null 
            ? 
              <>
                <p className={styles.seed_num}><></></p>
                <input className={styles.team_input} type='text' disabled={true} />
              </>
            :
              <>
                <p className={styles.seed_num}>{seedingEnabled ? seed2 : <></>}</p>
                <input className={styles.team_input} type='text' placeholder='Team 2' />
              </>
          }
         
        </li>
    </ul>
  )
}

BracketMatchup_BLANK.propTypes = {
  seedingEnabled: PropTypes.bool,
  seed1: PropTypes.number,
  seed2: PropTypes.number,
  oneTeam: PropTypes.bool,
  returnTeams: PropTypes.func
}

export default BracketMatchup_BLANK