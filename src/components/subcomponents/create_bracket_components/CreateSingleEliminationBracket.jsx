import React from 'react';
import styles from './CreateSingleEliminationBracket.module.css';
import PropTypes from 'prop-types';

import CreateSingleEliminationBracketRegion from './CreateSingleEliminationBracketRegion';

const CreateSingleEliminationBracket = ({ data, sendBracketUp, currentBracketBuild }) => {

    let regions = [];
    for (let i = 0; i < data['Regions']; i++) {
        regions.push(
            <>
                <p key={`region_num_${i + 1}`}>Region {i + 1}</p>
                <CreateSingleEliminationBracketRegion key={`region_${i + 1}`} regionNum={i + 1} data={data} sendBracketUp={sendBracketUp} currentBracketBuild={currentBracketBuild} />
            </>
        );
    }
    return (
        <div className={styles.container}>
            {regions}
        </div>
    )

}

CreateSingleEliminationBracket.propTypes = {
    data: PropTypes.object
}


export default CreateSingleEliminationBracket