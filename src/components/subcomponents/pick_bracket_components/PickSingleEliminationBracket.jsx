import React from 'react';
import styles from './PickSingleEliminationBracket.module.css';
import PropTypes from 'prop-types';

import PickSingleEliminationBracketRegion from './PickSingleEliminationBracketRegion';

const PickSingleEliminationBracket = ({ data, sendBracketUp, currentBracketBuild }) => {

    let regions = [];
    for (let i = 0; i < data['Regions']; i++) {
        regions.push(
            <>
                <p key={`region_num_${i + 1}`}>Region {i + 1}</p>
                <PickSingleEliminationBracketRegion key={`region_${i + 1}`} regionNum={i + 1} data={data} sendBracketUp={sendBracketUp} currentBracketBuild={currentBracketBuild} />
            </>
        );
    }
    return (
        <div className={styles.container}>
            {regions}
        </div>
    )

}

PickSingleEliminationBracket.propTypes = {
    data: PropTypes.object
}


export default PickSingleEliminationBracket