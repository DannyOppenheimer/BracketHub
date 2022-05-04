import React from 'react';
import styles from './SingleEliminationBracket.module.css';
import PropTypes from 'prop-types';

import BracketMatchup_BLANK from './BracketMatchup_BLANK';
import SingleEliminationBracketRegion from './SingleEliminationBracketRegion';

const SingleEliminationBracket = ({ data }) => {

    const numRegions = data['Regions'];
    const numTeams = data['Participants Per Round'];

    return (
        <div className={styles.container}>
            <SingleEliminationBracketRegion data={data} />
        </div>
    )
}

SingleEliminationBracket.propTypes = {
    data: PropTypes.object
}


export default SingleEliminationBracket