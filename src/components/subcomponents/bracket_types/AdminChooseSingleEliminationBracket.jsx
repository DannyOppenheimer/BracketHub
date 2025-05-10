import { React } from 'react';
import matchupStyles from '../single_elim_bracket/BracketMatchup.module.css';

import SingleEliminationBracket from '../single_elim_bracket/SingleEliminationBracket';

const AdminChooseSingleEliminationBracket = ({ buildData, bracket, updateBracketFunc, gameID }) => {

    const handleChoices = (region, event, team, round, matchup, numRounds) => {

        updateBracketFunc(region, event, event.target.value, team, round, matchup, numRounds);

    };

    return (
        <SingleEliminationBracket buildData={buildData} bracket={bracket} gameID={gameID}>
            <input className={matchupStyles.admin_choose_radio} data-role='admin_choose' type='radio' onChange={handleChoices} ></input>
            <input className={matchupStyles.admin_choose_radio} data-role='admin_choose' type='radio' onChange={handleChoices} ></input>
        </SingleEliminationBracket>
    )
}

export default AdminChooseSingleEliminationBracket