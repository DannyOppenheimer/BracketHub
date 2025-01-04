import React from 'react';
import styles from './BracketMatchup.module.css';
import PropTypes from 'prop-types';

const BracketMatchup_BLANK = ({ seedingOn, seed1, seed2, children, round, matchup, bracket }) => {

    const enhancedChildren = React.Children.map(children, (child, index) => {
        if (React.isValidElement(child) && child.type === 'input') {
            const originalOnChange = child.props.onChange;

            // FOR CREATING NEW BRACKET
            if (child.props.type === 'text') {
                return React.cloneElement(child, {
                    onChange: (event) =>
                        originalOnChange(event, index + 1, round, matchup)
                });
            }

            // FOR CHOOSING YOUR PICKS
            if (child.props.type === 'radio') {
                let value =
                    index === 0
                        ? bracket[round][matchup]['team1name']
                        : bracket[round][matchup]['team2name'];

                return (
                    <label key={index}>
                        {React.cloneElement(child, {
                            value: value,
                            name: `round-${round}-matchup-${matchup}`,
                            onChange: (event) =>
                                originalOnChange(event, index + 1, round, matchup),
                        })}
                        <span className={styles.radio_text}>{value}</span>
                    </label>
                );
            }


        }
        return child;
    });

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
                                <p className={styles.seed_num}>{seedingOn ? seed1 : <></>}</p>
                                {/* Here, the input will detect change as users type and send the data all the way back to the CreateBracket component */}
                                {enhancedChildren[0]}
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
                                <p className={styles.seed_num}>{seedingOn ? seed2 : <></>}</p>
                                {/* Here, the input will detect change as users type and send the data all the way back to the CreateBracket component */}
                                {enhancedChildren[1]}
                            </>
                    }

                </li>
            </ul>
        </div>
    )
}

BracketMatchup_BLANK.propTypes = {
    seedingOn: PropTypes.bool,
    seed1: PropTypes.number,
    seed2: PropTypes.number,
    oneTeam: PropTypes.bool,
    returnTeams: PropTypes.func
}

export default BracketMatchup_BLANK