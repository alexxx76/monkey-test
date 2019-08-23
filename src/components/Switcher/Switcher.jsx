import React from 'react';
import { emit } from '../../flux/dispatcher';
import { action } from '../../flux/actions';
import { getSwitcherText } from '../../flux/store';
import styles from './Switcher.module.css';

const changeMode = () => emit(action.MODE_CHANGE);

const Switcher = () => {
  return (
    <div className={styles.switcher}>
      <button
        className={styles.button}
        onClick={changeMode}
      >
        {getSwitcherText()}
      </button>
    </div>
  );
};

export default Switcher;