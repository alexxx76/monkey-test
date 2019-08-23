import { listen } from './dispatcher';
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
    disabledStatus: false
  },
  time: 0.5,
  timeControl: {
    text: 'time',
    min: 0.125,
    max: 5,
    step: 0.125,
    disabledStatus: false
  },
  cells: cellsInit(amountCells)
};

const listeners = [];

export const addChangeListener = fn => listeners.push(fn);

const notify = () => listeners.forEach(fn => fn());

export const getState = () => state;

export const getSwitcherText = () => {
  let text = state.mode === 'test' ? 'stop' : state.mode;
  return text.toUpperCase();
}

export const getControlValue = controlText => {
  let value = state[controlText];
  const step = state[`${controlText}Control`].step;
  const digits = step.toString().split('.').splice(1).join('').length;
  return value.toFixed(digits);
};

export const getControlStatus = controlText => {
  return state[`${controlText}Control`].disabledStatus;
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

const changeControlsStatus = (status) => {
  state.lengthControl.disabledStatus = status;
  state.timeControl.disabledStatus = status;
};

const setRandom = () => {
  const arr = new Array(state.cells.length).fill(null);
  for (let i = 0; i < state.length; i++) {
    arr[i] = i + 1;
  }
  arr.sort(() => .5 - Math.random());
  const newCells = state.cells.map((item, index) => {
    item.value = arr[index];
    return item;
  });
  state.cells = newCells;
};

const initCounter = () => state.counter = 1;

const resetCounter = () => state.counter = 0;

const setCellsStatus = status => {
  const newCells = state.cells.map(item => {
    if (item.value) item.status = status;
    return item;
  });
  state.cells = newCells;
};

const resetCells = () => {
  setCellsStatus('clear');
  const newCells = state.cells.map(item => {
    item.value = null;
    return item;
  });
  state.cells = newCells;
};

const startTimer = () => {
  setCellsStatus('show');
  state.timer = setTimeout(() => {
    stopTimer();
  }, state.time * 1000);
  state.timerOn = true;
};

const stopTimer = () => {
  setCellsStatus('hide');
  clearTimeout(state.timer);
  state.timerOn = false;
  notify();
};

const startTest = () => {
  state.mode = 'test';
  changeControlsStatus(true);
  setRandom();
  initCounter();
  startTimer();
};

const resetTest = () => {
  state.mode = 'start';
  changeControlsStatus(false);
  stopTimer();
  resetCounter();
  resetCells();
};

listen(action.MODE_CHANGE, () => {
  if (state.mode === 'start') startTest();
  else if (['test', 'win', 'lose'].includes(state.mode)) resetTest();
  notify();
});