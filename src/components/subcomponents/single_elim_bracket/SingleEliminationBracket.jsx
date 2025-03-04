import React from 'react';
import styles from './SingleEliminationBracket.module.css';
import PropTypes from 'prop-types';

import SingleEliminationBracketRegion from './SingleEliminationBracketRegion';
import SingleEliminationFinals from './SingleEliminationFinals';
import SingleEliminationFinalFour from './SingleEliminationFinalFour';


const SingleEliminationBracket = ({ buildData, bracket, children }) => {

    const numRegions = buildData['Regions'];

    let finals = <div className={`${styles.finals} ${numRegions == 4 ? styles.finals_4 : ''}`}>
        <SingleEliminationFinals buildData={buildData} bracket={bracket}>{children}</SingleEliminationFinals>
    </div>
    let semis_left = <div className={`${styles.finals} ${numRegions == 4 ? styles.finals_4 : ''}`}>
        <SingleEliminationFinalFour buildData={buildData} bracket={bracket} semiside={'left'}>{children}</SingleEliminationFinalFour>
    </div>
    let semis_right = <div className={`${styles.finals} ${numRegions == 4 ? styles.finals_4 : ''}`}>
        <SingleEliminationFinalFour buildData={buildData} bracket={bracket} semiside={'right'}>{children}</SingleEliminationFinalFour>
    </div>
    let blank_div = <div className={styles.finals}></div>

    let regions = [];
    for (let i = 0; i < numRegions; i++) {
        regions.push(
            <>
                <SingleEliminationBracketRegion key={`region_${i + 1}`} regionNum={i + 1} buildData={buildData} bracket={bracket[i + 1]} >
                    {children}
                </SingleEliminationBracketRegion>
            </>
        );
    }

    if (numRegions == 2) {
        regions.splice(1, 0, finals)
    }
    if (numRegions == 4) {
        regions.splice(1, 0, semis_left);
        regions.splice(2, 0, finals);
        regions.splice(3, 0, semis_right);

        regions.splice(6, 0, blank_div, blank_div, blank_div);
    }


    return (
        <div className={`${styles.container} ${numRegions == 2 ? styles.grid_3 : styles.grid_5}`}>
            {regions}
        </div>
    )

}

SingleEliminationBracket.propTypes = {
    data: PropTypes.object
}


export default SingleEliminationBracket