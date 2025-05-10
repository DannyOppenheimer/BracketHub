import React, { useState } from 'react';
import styles from './BracketMatchup.module.css';
import PropTypes from 'prop-types';
import Popup from '../../subcomponents/function_components/Popup';

import { getFirestore, doc, setDoc, updateDoc, arrayUnion, getDoc, fullBracket } from "firebase/firestore";
import { app } from '../FirebaseConfig';


const getBaseLog = (base, number) => {
    return Math.log(number) / Math.log(base);
};

const db = getFirestore(app);


const BracketMatchup_BLANK = ({ seedingOn, seed1, seed2, children, region, round, matchup, bracket, buildData, gameID, fullBracket }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [popupWinTeam, setPopupWinTeam] = useState('');
    const [popupLoseTeam, setPopupLoseTeam] = useState('');
    const [pendingAction, setPendingAction] = useState(null);


    const handleConfirm = () => {
        if (pendingAction) {
            pendingAction();
            setPendingAction(null);
        }
        setShowPopup(false);
    };

    const handleCancel = () => {
        setShowPopup(false);
    };

    const openPopup = async () => {
        setShowPopup(true);
    };

    const enhancedChildren = React.Children.map(children, (child, index) => {
        if (React.isValidElement(child) && child.type === 'input') {
            const originalOnChange = child.props.onChange;

            // FOR CREATING NEW BRACKET
            if (child.props.type === 'text') {
                return React.cloneElement(child, {
                    onChange: (event) =>
                        originalOnChange(region, event, index + 1, round, matchup)
                });
            }

            // FOR CHOOSING YOUR PICKS
            if (child.props.type === 'radio') {
                let base = round === 'finals' ? bracket['finals'] : bracket[round][matchup];

                let value =
                    index === 0
                        ? base['team1name']
                        : base['team2name'];

                if (child.props['data-role'] === 'admin_choose') {

                    return (
                        <div className={styles.radio_outer_div}>
                            <label key={index} className={styles.radio_container}>
                                {React.cloneElement(child, {
                                    value: value,
                                    name: `region-${region}-round-${round}-matchup-${matchup}`,
                                    onChange: (event) => {
                                        setPopupWinTeam(value);
                                        setPopupLoseTeam(index === 0 ? base['team2name'] : base['team1name']);

                                        setPendingAction(() => () => {
                                            originalOnChange(region, event, index + 1, round, matchup, Object.keys(bracket).length);
                                        });
                                        openPopup();
                                    }

                                })}
                                <span className={styles.radio_text}>{value}</span>
                            </label>
                        </div>
                    )

                }
                else {


                    return (
                        <>
                            <div className={styles.radio_outer_div}>
                                <label key={index} className={styles.radio_container}>
                                    {React.cloneElement(child, {
                                        value: value,
                                        name: `region-${region}-round-${round}-matchup-${matchup}`,
                                        checked: base['teamselected'] === index + 1,
                                        onChange: (event) =>
                                            originalOnChange(region, event, index + 1, round, matchup, Object.keys(bracket).length),

                                    })}
                                    <span className={styles.radio_text}>{value}</span>
                                </label>
                            </div>

                        </>




                    );
                }

            }


        }
        return child;
    });

    return (
        <>
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
                                    {enhancedChildren[1]}
                                </>
                        }

                    </li>
                </ul>
            </div>

            {showPopup && (
                <Popup
                    message={`Are you sure you want to mark ${popupWinTeam} as winning over ${popupLoseTeam}? This action cannot be undone.`}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </>

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