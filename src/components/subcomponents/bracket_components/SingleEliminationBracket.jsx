import React from 'react';
import styles from './SingleEliminationBracket.module.css';
import PropTypes from 'prop-types';
import { useRef } from "react";

import BracketMatchup_BLANK from './BracketMatchup_BLANK';
import SingleEliminationBracketRegion from './SingleEliminationBracketRegion';

const SingleEliminationBracket = ({ data }, sendBracketUp) => {

    let regions = [];
    console.log(data);
    for(let i = 0; i < data['Regions']; i++) {
        console.log(i)
        regions.push(
            <>  
                <p>Region {i + 1}</p>
                <SingleEliminationBracketRegion data={data} sendBracketUp={sendBracketUp} />
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