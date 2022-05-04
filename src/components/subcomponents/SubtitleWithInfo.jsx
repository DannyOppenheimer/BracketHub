import React from 'react';
import styles from './SubtitleWithInfo.module.css';

const SubtitleWithInfo = ({ title, popupText }) => {
  return (
    <div className={styles.container}>
        <h3 className={styles.subtitle}>{title}</h3>
        <img className={styles.icon} src='https://cdn-icons-png.flaticon.com/512/25/25400.png' alt='Question Mark Icon'></img>
    </div>
  )
}

export default SubtitleWithInfo