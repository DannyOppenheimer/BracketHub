import React from 'react';
import styles from './StyleButton.module.css'
import PropTypes from 'prop-types';

const StyleButton = ({ text, clicked, disabled }) => {
    return (
        <button className={styles.button} onClick={clicked} disabled={disabled}>{text}</button>
    )
}

StyleButton.propTypes = {
    text: PropTypes.string,
    onClick: PropTypes.func,
}

export default StyleButton