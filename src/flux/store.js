import { listen } from './dispatcher';
import { action } from './actions';

const cellsInit = (number) => {
  return new Array(number).fill(1)
    .map((_, index) => ({ id: index, value: null, status: 'clear' }));
};

const amountCells = 25;

const state = {
  amountCells: 25,
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
  cells: cellsInit(amountCells),
};

const listeners = [];

const notify = () => listeners.forEach(fn => fn());

const formatByValueStep = (value, step) => {
  const digits = step.toString().split('.').splice(1).join('').length;
  return value.toFixed(digits);
};

export const addChangeListener = fn => listeners.push(fn);

export const getState = () => state;

export const getSwitcherText = () => {
  return (state.mode === 'test' ? 'stop' : state.mode).toUpperCase();
};

export const getCells = () => state.cells;

export const getControlValue = controlText => {
  let value = state[controlText];
  const step = state[`${controlText}Control`].step;
  return formatByValueStep(value, step);
};

export const getControlStatus = controlText => {
  return state[`${controlText}Control`].disabledStatus;
};

const changeAllControlsStatus = status => {
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
    notify();
  }, state.time * 1000);
  state.timerOn = true;
};

const stopTimer = () => {
  setCellsStatus('hide');
  clearTimeout(state.timer);
  state.timerOn = false;
};

const startTest = () => {
  state.mode = 'test';
  changeAllControlsStatus(true);
  setRandom();
  initCounter();
  startTimer();
};

const resetTest = () => {
  state.mode = 'start';
  changeAllControlsStatus(false);
  stopTimer();
  resetCounter();
  resetCells();
};

const getIdCellStatus = (idCell) => {
  return state.cells.filter(item => (item.id === idCell))[0].status;
};

const setIdCellStatus = (idCell, status) => {
  const newCells = state.cells.map(item => {
    if (item.id === idCell) item.status = status;
    return item;
  });
  state.cells = newCells;
};

const detectSuccess = (idCell, value) => {
  if (value === state.counter) {
    setIdCellStatus(idCell, 'success');
    if (value === state.length) state.mode = 'win';
  }
};

const detectFault = (idCell, value) => {
  if (value !== state.counter) {
    setIdCellStatus(idCell, 'fail');
    state.mode = 'lose';
  }
};

const incrementCounter = () => state.counter = state.counter + 1;

const isCellClickable = idCell => {
  return !!(state.mode === 'test' && !state.timerOn && (getIdCellStatus(idCell) !== 'success'));
}

const clickCell = (idCell, value) => {
  if (isCellClickable(idCell)) {
    if (value) {
      detectSuccess(idCell, value);
      detectFault(idCell, value);
      incrementCounter();
    }
  }
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

listen(action.MODE_CHANGE, () => {
  if (state.mode === 'start') startTest();
  else if (['test', 'win', 'lose'].includes(state.mode)) resetTest();
  notify();
});

listen(action.CELL_CLICK, (id, value) => {
  clickCell(id, value);
  notify();
});

listen(action.APP_UNMOUNT, () => {
  clearTimeout(state.timer);
});