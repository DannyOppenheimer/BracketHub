import React from 'react';
import styles from './SingleEliminationBracketRegion.module.css';
import BracketMatchup_BLANK from './BracketMatchup_BLANK';
import BracketMatchup_INACTIVE from './BracketMatchup_INACTIVE';

const SingleEliminationBracketRegion = ({ regionNum, buildData, bracket, children, gameID, fullBracket, playBracket }) => {


    // easy to access user preference
    const seedingOn = buildData['Seeding'] === 'on';

    const forwardBracket = Object.keys(bracket);
    const reverseBracket = Object.keys(bracket).reverse();
    return (
        <div className={styles.zoom_pane}>
            <div className={styles.container}>
                {
                    (regionNum % 2 == 0 ? reverseBracket : forwardBracket).map((round, i) => {
                        return (
                            // Key set to round and the increment
                            <div key={`${round}_${i}`} className={styles.column}>
                                {
                                    Object.keys(bracket[round]).map((matchup, j) => {

                                        return (
                                            <div key={`inline_connector_${j}`} className={styles.inlineConnecter}>

                                                {
                                                    regionNum % 2 == 0 ?
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
                                                        bracket[round][matchup].team1 === null && bracket[round][matchup].team2 === null
                                                            ?
                                                            <BracketMatchup_INACTIVE key={`inactive_cell_${j}`} />
                                                            :
                                                            <BracketMatchup_BLANK key={`cell_${bracket[round][matchup].team1}_${bracket[round][matchup].team2}`} seedingOn={seedingOn} seed1={bracket[round][matchup].team1} seed2={bracket[round][matchup].team2} region={regionNum} round={round} matchup={matchup} bracket={bracket} buildData={buildData} gameID={gameID} fullBracket={fullBracket} playBracket={playBracket}>
                                                                {children}
                                                            </BracketMatchup_BLANK>
                                                    }
                                                </div>

                                                {
                                                    regionNum % 2 != 0 ?
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

export default SingleEliminationBracketRegion