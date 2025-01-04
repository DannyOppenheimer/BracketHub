import React from 'react';
import styles from './SingleEliminationBracket.module.css';
import PropTypes from 'prop-types';

import SingleEliminationBracketRegion from './SingleEliminationBracketRegion';

const SingleEliminationBracket = ({ buildData, bracket, children }) => {

    let regions = [];
    for (let i = 0; i < buildData['Regions']; i++) {
        regions.push(
            <>
                <p key={`region_num_${i + 1}`}>Region {i + 1}</p>
                <SingleEliminationBracketRegion key={`region_${i + 1}`} regionNum={i + 1} buildData={buildData} bracket={bracket} >
                    {children}
                </SingleEliminationBracketRegion>
            </>
        );
    }
    return (
        <div className={styles.container}>
            {regions}
        </div>
    )

}

SingleEliminationBracket.propTypes = {
    data: PropTypes.object
}


export default SingleEliminationBracket