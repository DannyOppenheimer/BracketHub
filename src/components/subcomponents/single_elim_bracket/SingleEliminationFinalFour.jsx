import React from 'react';
import PropTypes from 'prop-types';
import BracketMatchupBlank from './BracketMatchup_BLANK';
import BracketMatchupInactive from './BracketMatchup_INACTIVE';

const SingleEliminationFinalFour = ({ buildData, bracket, playBracket, children, semiside }) => {
    const semifinals = bracket?.semis?.[semiside] ?? null;
    const seedingOn = buildData?.Seeding === 'on' || buildData?.Seeding === true;

    if (!semifinals || (semifinals.team1name == null && semifinals.team2name == null)) {
        return <BracketMatchupInactive />;
    }

    return (
        <BracketMatchupBlank
            seedingOn={seedingOn}
            seed1={semifinals.team1 ?? null}
            seed2={semifinals.team2 ?? null}
            region="semis"
            round="semis"
            matchup={semiside}
            bracket={bracket}
            fullBracket={bracket}
            buildData={buildData}
            playBracket={playBracket}
        >
            {children}
        </BracketMatchupBlank>
    );

}

SingleEliminationFinalFour.propTypes = {
    buildData: PropTypes.object,
    bracket: PropTypes.object,
    playBracket: PropTypes.object,
    children: PropTypes.node,
    semiside: PropTypes.oneOf(['left', 'right']).isRequired
};


export default SingleEliminationFinalFour;
