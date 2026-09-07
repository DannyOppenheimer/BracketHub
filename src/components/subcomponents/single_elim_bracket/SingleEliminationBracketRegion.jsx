import React from 'react';
import PropTypes from 'prop-types';
import styles from './SingleEliminationBracketRegion.module.css';
import BracketMatchupBlank from './BracketMatchup_BLANK';
import BracketMatchupInactive from './BracketMatchup_INACTIVE';

const SingleEliminationBracketRegion = ({ regionNum, buildData, bracket, children, gameID, fullBracket, playBracket }) => {
    const regionBracket = bracket && typeof bracket === 'object' ? bracket : {};

    // easy to access user preference
    const seedingOn = buildData?.Seeding === 'on' || buildData?.Seeding === true;

    const forwardBracket = Object.keys(regionBracket);
    const reverseBracket = forwardBracket.slice().reverse();
    return (
        <div className={styles.zoom_pane}>
            <div className={styles.container}>
                {
                    (regionNum % 2 === 0 ? reverseBracket : forwardBracket).map((round, i) => {
                        const roundMatchups = regionBracket[round] && typeof regionBracket[round] === 'object'
                            ? regionBracket[round]
                            : {};
                        return (
                            // Key set to round and the increment
                            <div key={`${round}_${i}`} className={styles.column}>
                                {
                                    Object.keys(roundMatchups).map((matchup, j) => {
                                        const matchupData = roundMatchups[matchup] ?? {};

                                        return (
                                            <div key={`inline_connector_${j}`} className={styles.inlineConnecter}>

                                                {
                                                    regionNum % 2 === 0 ?
                                                        round !== '1'
                                                            ?
                                                            <div key={`connector_${j}`} className={styles.connector}>
                                                                <div key={`Rtop_connector_${j}`} className={matchup % 2 !== 0 ? (styles.connectorRTopReverse) : (styles.connectorRBotReverse)}></div>
                                                                <div key={`Ltop_connector_${j}`} className={matchup % 2 !== 0 ? (styles.connectorLTopReverse) : (styles.connectorLBotReverse)}></div>
                                                            </div>
                                                            :
                                                            <></>
                                                        :
                                                        <></>
                                                }

                                                <div key={`cell_${j}`} className={styles.cell}>
                                                    {
                                                        matchupData.team1name == null && matchupData.team2name == null
                                                            ?
                                                            <BracketMatchupInactive key={`inactive_cell_${j}`} />
                                                            :
                                                            <BracketMatchupBlank key={`cell_${round}_${matchup}`} seedingOn={seedingOn} seed1={matchupData.team1 ?? null} seed2={matchupData.team2 ?? null} region={regionNum} round={round} matchup={matchup} bracket={regionBracket} buildData={buildData} gameID={gameID} fullBracket={fullBracket} playBracket={playBracket}>
                                                                {children}
                                                            </BracketMatchupBlank>
                                                    }
                                                </div>

                                                {
                                                    regionNum % 2 !== 0 ?
                                                        round !== '1'
                                                            ?
                                                            <div key={`connector_${j}`} className={styles.connector}>
                                                                <div key={`Ltop_connector_${j}`} className={matchup % 2 !== 0 ? (styles.connectorLTop) : (styles.connectorLBot)}></div>
                                                                <div key={`Rtop_connector_${j}`} className={matchup % 2 !== 0 ? (styles.connectorRTop) : (styles.connectorRBot)}></div>
                                                            </div>
                                                            :
                                                            <></>
                                                        :
                                                        <></>
                                                }

                                            </div>

                                        )
                                    })
                                }
                            </div>

                        )
                    })
                }
            </div>
        </div >


    )
}

SingleEliminationBracketRegion.propTypes = {
    regionNum: PropTypes.number.isRequired,
    buildData: PropTypes.object,
    bracket: PropTypes.object,
    children: PropTypes.node,
    gameID: PropTypes.string,
    fullBracket: PropTypes.object,
    playBracket: PropTypes.object
};

export default SingleEliminationBracketRegion
