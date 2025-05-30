import { React } from 'react';
import matchupStyles from '../single_elim_bracket/BracketMatchup.module.css';

import SingleEliminationBracket from '../single_elim_bracket/SingleEliminationBracket';

const PlayerViewSingleEliminationBracket = ({ buildData, bracket, playBracket }) => {
    return (
        <SingleEliminationBracket buildData={buildData} bracket={bracket} playBracket={playBracket}>
            <input className={matchupStyles.team_display} type='text' data-role='player_view' disabled={true}></input>
            <input className={matchupStyles.team_display} type='text' data-role='player_view' disabled={true}></input>
        </SingleEliminationBracket>
    )
}

export default PlayerViewSingleEliminationBracket