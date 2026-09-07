import React, { useState } from 'react';
import styles from './BracketMatchup.module.css';
import PropTypes from 'prop-types';
import Popup from '../../subcomponents/function_components/Popup';


const BracketMatchup_BLANK = ({ seedingOn, seed1, seed2, children, region, round, matchup, bracket, buildData, gameID, fullBracket, playBracket }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [popupWinTeam, setPopupWinTeam] = useState('');
    const [popupLoseTeam, setPopupLoseTeam] = useState('');
    const [pendingAction, setPendingAction] = useState(null);

    let chosenTeam = null;
    let isPlayerView = false;
    let correct = '';

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

    const openPopup = () => {
        setShowPopup(true);
    };

    const enhancedChildren = React.Children.map(children, (child, index) => {
        if (React.isValidElement(child) && child.type === 'input') {
            const originalOnChange = child.props.onChange;

            let base = round === 'finals' ?
                bracket?.finals
                :
                round === 'semis' ?
                    bracket?.semis?.[matchup]
                    :
                    bracket?.[round]?.[matchup];

            if (!base) return child;

            let value =
                index === 0
                    ? base['team1name']
                    : base['team2name'];


            // FOR CREATING NEW BRACKET
            if (child.props.type === 'text') {

                if (child.props['data-role'] === 'player_view') {

                    isPlayerView = true;
                    const pickedMatchup = region === 'finals'
                        ? playBracket?.finals
                        : region === 'semis'
                            ? playBracket?.semis?.[matchup]
                            : playBracket?.[region]?.[round]?.[matchup];
                    const resultMatchup = region === 'finals'
                        ? fullBracket?.finals
                        : region === 'semis'
                            ? fullBracket?.semis?.[matchup]
                            : fullBracket?.[region]?.[round]?.[matchup];

                    const pickedTeam = pickedMatchup?.teamselected;
                    const resultTeam = resultMatchup?.teamselected;
                    chosenTeam = pickedTeam == null
                        ? 'No pick'
                        : pickedMatchup?.[`team${pickedTeam}name`] ?? 'Unknown team';

                    if (resultTeam == null) {
                        correct = '❔';
                    } else if (pickedTeam == null) {
                        correct = '✖️';
                    } else {
                        const pickedTeamID = pickedMatchup?.[`team${pickedTeam}`];
                        const resultTeamID = resultMatchup?.[`team${resultTeam}`];
                        correct = pickedTeamID === resultTeamID ? '✔️' : '✖️';
                    }

                    const playBase = resultMatchup;

                    if (!playBase) return child;

                    let play_value =
                        index === 0
                            ? playBase['team1name']
                            : playBase['team2name'];


                    return (
                        <div className={styles.team_display_container}>
                            {React.cloneElement(child, {
                                value: play_value,
                                className: styles.team_display,

                            })}

                        </div>
                    );
                } else {
                    return React.cloneElement(child, {
                        onChange: (event) =>
                            originalOnChange(region, event, index + 1, round, matchup)
                    });
                }

            }

            // FOR CHOOSING YOUR PICKS
            if (child.props.type === 'radio') {

                if (child.props['data-role'] === 'admin_choose') {

                    return (
                        <div className={styles.radio_outer_div}>
                            <label key={index} className={styles.radio_container}>
                                {React.cloneElement(child, {
                                    value: value,
                                    name: `region-${region}-round-${round}-matchup-${matchup}`,
                                    checked: base['teamselected'] === index + 1,
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
            {isPlayerView ? <div className={[round === 'finals' ? styles.finals_your_pick : "", (correct === '✖️' ? styles.pick_wrong : ""), (correct === '✔️' ? styles.pick_correct : ""), styles.your_pick].join(' ')}><p>Your Pick:</p><p>{chosenTeam}</p><p>{correct}</p></div> : <></>}

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
                    message={`Are you sure you want to mark ${popupWinTeam} as winning${popupLoseTeam === null ? '' : ' over ' + popupLoseTeam}?`}
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
    children: PropTypes.node,
    region: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    round: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    matchup: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    bracket: PropTypes.object,
    buildData: PropTypes.object,
    gameID: PropTypes.string,
    fullBracket: PropTypes.object,
    playBracket: PropTypes.object
}

export default BracketMatchup_BLANK
