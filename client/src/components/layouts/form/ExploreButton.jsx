import React from 'react';
import styles from './ExploreButton.module.css';

const ExploreButton = ({ onClick }) => {
  return (
    <button className={styles.button} onClick={onClick} type="button">
      <span>Explore More</span>
      <span className={styles.icon}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L14.3 9.7L22 12L14.3 14.3L12 22L9.7 14.3L2 12L9.7 9.7L12 2Z" />
        </svg>
      </span>
    </button>
  );
};

export default ExploreButton;