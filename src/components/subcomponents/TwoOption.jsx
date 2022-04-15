import React from 'react';
import PropTypes from 'prop-types';

const TwoOption = ({ first, second }) => {
  return (
    <div className='container'>
        <span>
            <button className='print-vs-group-button'>{first}</button>
            <button className='print-vs-group-button'>{second}</button>
        </span>
    </div>
  )
}


TwoOption.propTypes = {
    first: PropTypes.string,
    second: PropTypes.string,
    choiceClick: PropTypes.func,
}

export default TwoOption

