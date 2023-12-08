import React from 'react';
import styles from './SingleEliminationBracket.module.css';
import PropTypes from 'prop-types';
import { useRef } from "react";

import BracketMatchup_BLANK from './BracketMatchup_BLANK';
import SingleEliminationBracketRegion from './SingleEliminationBracketRegion';

const SingleEliminationBracket = ({ data, sendBracketUp, currentBracketBuild }) => {

    let regions = [];
    for(let i = 0; i < data['Regions']; i++) {
        regions.push(
            <>  
                <p key={`region_num_${i + 1}`}>Region {i + 1}</p>
                <SingleEliminationBracketRegion key={`region_${i + 1}`} regionNum={i + 1} data={data} sendBracketUp={sendBracketUp} currentBracketBuild={currentBracketBuild} />
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