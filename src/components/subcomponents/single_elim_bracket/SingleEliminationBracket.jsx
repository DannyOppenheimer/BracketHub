import React from 'react';
import styles from './SingleEliminationBracket.module.css';
import PropTypes from 'prop-types';

import SingleEliminationBracketRegion from './SingleEliminationBracketRegion';
import SingleEliminationFinals from './SingleEliminationFinals';
import SingleEliminationFinalFour from './SingleEliminationFinalFour';


const SingleEliminationBracket = ({ buildData, bracket, children, gameID, playBracket }) => {
    const numRegions = Number(buildData?.Regions) || 0;

    if (!bracket || ![1, 2, 4].includes(numRegions)) {
        return null;
    }

    const finals = <div className={`${styles.finals} ${numRegions === 4 ? styles.finals_4 : ''}`}>
        <SingleEliminationFinals buildData={buildData} bracket={bracket} playBracket={playBracket}>{children}</SingleEliminationFinals>
    </div>
    const semisLeft = <div className={`${styles.finals} ${numRegions === 4 ? styles.finals_4 : ''}`}>
        <SingleEliminationFinalFour buildData={buildData} bracket={bracket} playBracket={playBracket} semiside={'left'}>{children}</SingleEliminationFinalFour>
    </div>
    const semisRight = <div className={`${styles.finals} ${numRegions === 4 ? styles.finals_4 : ''}`}>
        <SingleEliminationFinalFour buildData={buildData} bracket={bracket} playBracket={playBracket} semiside={'right'}>{children}</SingleEliminationFinalFour>
    </div>

    const regions = [];
    for (let i = 0; i < numRegions; i++) {
        const regionBracket = bracket[i + 1] ?? bracket[String(i + 1)] ?? null;
        regions.push(
            <SingleEliminationBracketRegion
                key={`region_${i + 1}`}
                regionNum={i + 1}
                buildData={buildData}
                bracket={regionBracket}
                gameID={gameID}
                fullBracket={bracket}
                playBracket={playBracket}
            >
                {children}
            </SingleEliminationBracketRegion>
        );
    }

    if (numRegions === 2) {
        regions.splice(1, 0, finals)
    }
    if (numRegions === 4) {
        regions.splice(1, 0, semisLeft);
        regions.splice(2, 0, finals);
        regions.splice(3, 0, semisRight);

        regions.splice(6, 0,
            <div key="blank_1" className={styles.finals}></div>,
            <div key="blank_2" className={styles.finals}></div>,
            <div key="blank_3" className={styles.finals}></div>
        );
    }


    return (
        <div className={`${styles.container} ${numRegions === 2 ? styles.grid_3 : styles.grid_5}`}>
            {regions}
        </div>
    )

}

SingleEliminationBracket.propTypes = {
    buildData: PropTypes.object,
    bracket: PropTypes.object,
    children: PropTypes.node,
    gameID: PropTypes.string,
    playBracket: PropTypes.object
}


export default SingleEliminationBracket
