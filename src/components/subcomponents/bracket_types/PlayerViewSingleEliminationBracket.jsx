import { React } from 'react';
import matchupStyles from '../single_elim_bracket/BracketMatchup.module.css';

import SingleEliminationBracket from '../single_elim_bracket/SingleEliminationBracket';

const PlayerViewSingleEliminationBracket = ({ buildData, bracket }) => {


    return (
        <SingleEliminationBracket buildData={buildData} bracket={bracket}>
            <input className={matchupStyles.team_display} type='text' disabled={true} placeholder='Error Team Not Found'></input>
            <input className={matchupStyles.team_display} type='text' disabled={true} placeholder='Error Team Not Found'></input>
        </SingleEliminationBracket>
    )
}

export default PlayerViewSingleEliminationBracket