import React from 'react';
import styles from './BracketMatchup.module.css';
import PropTypes from 'prop-types';

const BracketMatchup_BLANK = ({ oneTeam }) => {
  return (
    <ul className={styles.matchup}>
        <li className={styles.team}>
          <input className={styles.team_input} type='text' disabled={true} />
        </li>
        <li className={styles.team}>
          {
            // Display only 1 team in the matchup (for uneven numbers of participants)
            !oneTeam ? 
              <>
                <p ><></></p>
                <input className={styles.team_input} type='text' disabled={true} />
              </>
            :
              <></>
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