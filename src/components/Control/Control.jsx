import React from 'react';
import { emit } from '../../flux/dispatcher';
import { action } from '../../flux/actions';
import { getControlValue, getControlStatus } from '../../flux/store.js';
import styles from './Control.module.css';

const increment = descriptor => emit(action.CONTROL_INCREMENT, descriptor);

const decrement = descriptor => emit(action.CONTROL_DECREMENT, descriptor);

const Control = (props) => {
  const { text } = props;
  return (
    <div className={styles.control}>
      <div className={styles.text}>{text}</div>
      <div className={styles.value}>{getControlValue(text)}</div>
      <div className={styles.commands}>
        <button
          className={styles.button}
          onClick={() => { decrement(text) }}
          disabled={getControlStatus(text)}
        >-</button>
        <button
          className={styles.button}
          onClick={() => { increment(text) }}
          disabled={getControlStatus(text)}
        >+</button>
      </div>
    </div>
  )
};

export default Control;