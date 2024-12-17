import React from 'react';
import styles from './CreateBracketMatchup.module.css';
import PropTypes from 'prop-types';

const CreateBracketMatchup_BLANK = ({ seedingEnabled, region, seed1, seed2, sendBracketUp, currentBracketBuild }) => {

    // Every time an input is changed, the JS object holding all bracket data is updated
    const handleChange = (e, seed) => {
        sendBracketUp({
            ...currentBracketBuild, [region]: {
                ...currentBracketBuild[region],
                [seed]: e.target.value
            }
        })
    }

    return (
        <div className={styles.blank_matchup}>
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
                                {/* Here, the input will detect change as users type and send the data all the way back to the CreateBracket component */}
                                <input className={styles.team_input} type='text' onChange={(e) => handleChange(e, seed1)} placeholder='Team 1' />
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
                                {/* Here, the input will detect change as users type and send the data all the way back to the CreateBracket component */}
                                <input className={styles.team_input} type='text' onChange={(e) => handleChange(e, seed2)} placeholder='Team 2' />
                            </>
                    }

                </li>
            </ul>
        </div>
    )
}

CreateBracketMatchup_BLANK.propTypes = {
    seedingEnabled: PropTypes.bool,
    seed1: PropTypes.number,
    seed2: PropTypes.number,
    oneTeam: PropTypes.bool,
    returnTeams: PropTypes.func
}

export default CreateBracketMatchup_BLANK