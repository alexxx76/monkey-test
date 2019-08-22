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
  mode: 'start',
  counter: 0,
  length: 3,
  lengthControl: {
    text: 'length',
    min: 3,
    max: 10,
    step: 1,
    status: false
  },
  time: 0.5,
  timeControl: {
    text: 'time',
    min: 0.125,
    max: 5,
    step: 0.125,
    status: false
  },
  cells: cellsInit(amountCells)
};

const listeners = [];

export const getState = () => state;

export const addChangeListener = fn => listeners.push(fn);

const notify = () => listeners.forEach(fn => fn());

export const getControlValue = controlText => {
  let value = state[controlText];
  const step = state[`${controlText}Control`].step;
  const digits = step.toString().split('.').splice(1).join('').length;
  return value.toFixed(digits);
};

export const getControlStatus = controlText => {
  return state[`${controlText}Control`].status;
};

listen(action.CONTROL_DECREMENT, controlText => {
  let value = state[controlText];
  const { step, min } = state[`${controlText}Control`];
  state[controlText] = (value > min ? value - step : value);
  notify();
});

listen(action.CONTROL_INCREMENT, controlText => {
  let value = state[controlText];
  const { step, max } = state[`${controlText}Control`];
  state[controlText] = (value < max ? value + step : value);
  notify();
});
