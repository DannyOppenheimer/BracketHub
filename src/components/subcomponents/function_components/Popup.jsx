import React from 'react';
import ReactDOM from 'react-dom';
import styles from './Popup.module.css'; // We'll define styles below

const Popup = ({ message, onConfirm, onCancel }) => {
    // Portal to make it pop up globally
    return ReactDOM.createPortal(
        <div className={styles.overlay}>
            <div className={styles.popupbox}>
                <p className={styles.message}>{message}</p>
                <div className={styles.buttons}>
                    <button className={styles.confirm} onClick={onConfirm}>Confirm</button>
                    <button className={styles.deny} onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default Popup;