import React from 'react';
import BracketMatchup_INACTIVE from './BracketMatchup_INACTIVE';
import BracketMatchup_BLANK from './BracketMatchup_BLANK';


const SingleEliminationFinals = ({ buildData, bracket, children, playBracket }) => {

    return (
        <>
            {bracket['finals'].team1name === null && bracket['finals'].team2name === null ? <BracketMatchup_INACTIVE /> : <BracketMatchup_BLANK seedingOn={buildData['Seeding']} seed1={bracket['finals'].team1} seed2={bracket['finals'].team2} region={'finals'} round={'finals'} matchup={1} bracket={bracket} playBracket={playBracket} buildData={buildData}>{children}</BracketMatchup_BLANK>}

        </>
    );

}


export default SingleEliminationFinals