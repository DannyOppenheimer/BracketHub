import React from 'react';
import PropTypes from 'prop-types';
import BracketMatchup_BLANK from './BracketMatchup_BLANK';
import BracketMatchup_INACTIVE from './BracketMatchup_INACTIVE';

const SingleEliminationFinalFour = ({ buildData, bracket, playBracket, children, semiside }) => {

    return (
        <>
            {bracket['semis'][semiside].team1name === null && bracket['semis'][semiside].team2name === null ? <BracketMatchup_INACTIVE /> : <BracketMatchup_BLANK seedingOn={buildData['Seeding']} seed1={bracket['semis'][semiside].team1} seed2={bracket['semis'][semiside].team2} region={'semis'} round={'semis'} matchup={semiside} bracket={bracket} fullBracket={bracket} buildData={buildData} playBracket={playBracket}>{children}</BracketMatchup_BLANK>}
        </>
    );


}


export default SingleEliminationFinalFour;