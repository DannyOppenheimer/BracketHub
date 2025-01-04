import { React } from 'react';
import matchupStyles from '../single_elim_bracket/BracketMatchup.module.css';

import SingleEliminationBracket from '../single_elim_bracket/SingleEliminationBracket';

const PickSingleEliminationBracket = ({ buildData, bracket, updateBracketFunc }) => {

    const handlePicks = (event, team, round, matchup, numRounds) => {

        updateBracketFunc(event, event.target.value, team, round, matchup, numRounds);

    };

    return (
        <SingleEliminationBracket buildData={buildData} bracket={bracket}>
            <input className={matchupStyles.team_input_radio} type='radio' onChange={handlePicks} ></input>
            <input className={matchupStyles.team_input_radio} type='radio' onChange={handlePicks} ></input>
        </SingleEliminationBracket>
    )
}

export default PickSingleEliminationBracket