import { React, useState } from 'react';
import styles from './PickBracketMatchup.module.css';
import PropTypes from 'prop-types';

const PickBracketMatchup = ({ seedingEnabled, region, seed1, seed2, sendBracketUp, currentBracketBuild }) => {

    // Every time an input is changed, the JS object holding all bracket data is updated
    const handleChange = (e, seed) => {
        sendBracketUp({
            ...currentBracketBuild, [region]: {
                ...currentBracketBuild[region],
                [seed]: e.target.value
            }
        })
    }

    const [isSeed1Selected, setIsSeed1Selected] = useState(false);
    const [isSeed2Selected, setIsSeed2Selected] = useState(false);

    const handleClick = (seed) => {

        if (!isSeed2Selected && seed === 2) {
            setIsSeed1Selected(false);
            setIsSeed2Selected(true);
        }
        else if (!isSeed1Selected && seed === 1) {
            setIsSeed1Selected(true);
            setIsSeed2Selected(false);
        }

        console.log(isSeed1Selected + " --- " + isSeed2Selected);
    };

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
                                <input className={`${styles.team_input} ${isSeed1Selected ? styles.selected : ''}`} onFocus={() => handleClick(1)} type='text' value={currentBracketBuild[region][seed1]} readOnly />

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
                                <input className={`${styles.team_input} ${isSeed2Selected ? styles.selected : ''}`} onFocus={() => handleClick(2)} type='text' value={currentBracketBuild[region][seed2]} readOnly />

                            </>
                    }

                </li>
            </ul>
        </div>
    )
}

PickBracketMatchup.propTypes = {
    seedingEnabled: PropTypes.bool,
    seed1: PropTypes.number,
    seed2: PropTypes.number,
    oneTeam: PropTypes.bool,
    returnTeams: PropTypes.func
}

export default PickBracketMatchup