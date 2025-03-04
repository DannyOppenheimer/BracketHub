import React from 'react';
import styles from './SingleEliminationBracket.module.css';
import PropTypes from 'prop-types';

import SingleEliminationBracketRegion from './SingleEliminationBracketRegion';
import SingleEliminationFinals from './SingleEliminationFinals';
import SingleEliminationFinalThree from './SingleEliminationFinalThree';
import SingleEliminationFinalFour from './SingleEliminationFinalFour';


const SingleEliminationBracket = ({ buildData, bracket, children }) => {

    let regions = [];
    for (let i = 0; i < buildData['Regions']; i++) {
        regions.push(
            <>
                <SingleEliminationBracketRegion key={`region_${i + 1}`} regionNum={i + 1} buildData={buildData} bracket={bracket[i + 1]} >
                    {children}
                </SingleEliminationBracketRegion>
            </>
        );
        
        if (buildData['Regions'] == 2 && i == 0) {
            regions.push(
                <div className={styles.finals}>
                    <SingleEliminationFinals buildData={buildData} bracket={bracket}>{children}</SingleEliminationFinals>
                </div>
            )
        }
        if (buildData['Regions'] == 3 && i == 0) {
            regions.push(
                <div className={styles.finals}>
                    <SingleEliminationFinalThree buildData={buildData} bracket={bracket}>{children}</SingleEliminationFinalThree>
                </div>
            )
        }
        if (buildData['Regions'] == 4 && i == 0) {
            regions.push(
            <div className={styles.finals}>
                <SingleEliminationFinalFour buildData={buildData} bracket={bracket}>{children}</SingleEliminationFinalFour>
            </div>
            )
        }
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