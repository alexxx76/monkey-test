import { listen, emit } from './dispatcher';
import { action } from './actions';

const cellsInit = (number) => {
  return new Array(number).fill(1)
    .map((_, index) => ({ id: index, value: null, status: 'clear' }));
};

const amountCells = 25;

const state = {
  timer: null,
  timerOn: false,
  length: 3,
  time: 0.5,
  mode: 'start',
  counter: 0,
  cells: cellsInit(amountCells)
};

const listeners = [];

export const getState = () => state;

export const addChangeListener = fn => listeners.push(fn);

const notify = () => listeners.forEach(fn => fn());