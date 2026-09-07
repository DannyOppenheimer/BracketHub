import React from 'react';
import PropTypes from 'prop-types';
import BracketMatchupInactive from './BracketMatchup_INACTIVE';
import BracketMatchupBlank from './BracketMatchup_BLANK';


const SingleEliminationFinals = ({ buildData, bracket, children, playBracket }) => {
    const finals = bracket?.finals ?? null;
    const seedingOn = buildData?.Seeding === 'on' || buildData?.Seeding === true;

    if (!finals || (finals.team1name == null && finals.team2name == null)) {
        return <BracketMatchupInactive />;
    }

    return (
        <BracketMatchupBlank
            seedingOn={seedingOn}
            seed1={finals.team1 ?? null}
            seed2={finals.team2 ?? null}
            region="finals"
            round="finals"
            matchup={1}
            bracket={bracket}
            fullBracket={bracket}
            playBracket={playBracket}
            buildData={buildData}
        >
            {children}
        </BracketMatchupBlank>
    );
}

SingleEliminationFinals.propTypes = {
    buildData: PropTypes.object,
    bracket: PropTypes.object,
    playBracket: PropTypes.object,
    children: PropTypes.node
};


export default SingleEliminationFinals
