import React from 'react';
import styles from './BracketMatchup.module.css';
import PropTypes from 'prop-types';

const BracketMatchup_INACTIVE = ({ seedingEnabled, seed1, seed2, oneTeam, returnTeams }) => {
  return (
    <div className={styles.inactive_matchup}>
    <ul className={styles.matchup}>
      
        <li className={styles.team}>
          {
            seed1 === null 
            ?
              <>
                <p className={styles.seed_num}><></></p>
                <input className={styles.team_input} type='text' disabled={true} />
              </>
            :
              <>
                <p className={styles.seed_num}>{seedingEnabled ? seed1 : <></>}</p>
                <input className={styles.team_input} type='text'  disabled={true} />
              </>
          }
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
                <input className={styles.team_input} type='text' disabled={true} />
              </>
          }
         
        </li>
        
    </ul>
    </div>
  )
}

BracketMatchup_INACTIVE.propTypes = {
  seedingEnabled: PropTypes.bool,
  seed1: PropTypes.number,
  seed2: PropTypes.number,
  oneTeam: PropTypes.bool,
  returnTeams: PropTypes.func
}

export default BracketMatchup_INACTIVE