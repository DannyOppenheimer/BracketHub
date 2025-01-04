import { React } from 'react';
import matchupStyles from '../single_elim_bracket/BracketMatchup.module.css';

import SingleEliminationBracket from '../single_elim_bracket/SingleEliminationBracket';

const PickSingleEliminationBracket = ({ buildData, bracket, updateBracketFunc }) => {

    return (
        <SingleEliminationBracket buildData={buildData} bracket={bracket}>
            <input className={matchupStyles.team_input_radio} type='radio' onChange={updateBracketFunc} ></input>
            <input className={matchupStyles.team_input_radio} type='radio' onChange={updateBracketFunc} ></input>
        </SingleEliminationBracket>
    )
}

export default PickSingleEliminationBracket