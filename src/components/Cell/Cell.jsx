import React from 'react';
import { emit } from '../../flux/dispatcher';
import { action } from '../../flux/actions';
import styles from './Cell.module.css';

const handleClick = (id, value) => emit(action.CELL_CLICK, id, value);

const Cell = ({ id, data }) => {
  let mode = `${styles[data.status]}`;
  let cellCSSClass = `${styles.cell} ${mode}`;

  return (
    <div className={cellCSSClass} onClick={() => { handleClick(id, data.value) }}>
      {data.status !== 'hide' ? data.value : null}
    </div>
  );
};

export default Cell;
