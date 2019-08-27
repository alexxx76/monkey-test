import { listen } from './dispatcher';
import { action } from './actions';

const store = {
  state: {
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

    cells: (() => {
      const amountCells = 25;
      return new Array(amountCells).fill(1)
        .map((_, index) => ({ id: index, value: null, status: 'clear' }));
    })()
  },

  getState() {
    return this.state;
  },

  getCells() {
    return this.state.cells;
  },

  getSwitcherText() {
    return (this._isModeTest() ? 'stop' : this._getMode()).toUpperCase();
  },

  getControlFormatedValue(controlText) {
    let value = this._getControlValue(controlText);
    const step = this._getControlParams(controlText).step;
    return this._formatByValueStep(value, step);
  },

  getControlStatus(controlText) {
    return this._getControlParams(controlText).disabledStatus;
  },



  _startTest() {
    this._setMode('test');
    this._changeAllControlsStatus(true);
    this._setRandom();
    this._initCounter();
    this._startTimer();
  },

  _resetTest() {
    this._setMode('start');
    this._changeAllControlsStatus(false);
    this._stopTimer();
    this._resetCounter();
    this._resetCells();
  },

  _startTimer() {
    this._setCellsStatus('show');
    this.state.timer = setTimeout(() => {
      this._stopTimer();
      this._notify();
    }, this._getControlValue('time') * 1000);
    this._setTimerFLag();
  },

  _setCellsStatus(status) {
    const newCells = this.getCells().map(item => {
      if (item.value) item.status = status;
      return item;
    });
    this._setCells(newCells);
  },

  _resetCells() {
    this._setCellsStatus('clear');
    const newCells = this.getCells().map(item => {
      item.value = null;
      return item;
    });
    this._setCells(newCells);
  },

  _stopTimer() {
    this._setCellsStatus('hide');
    clearTimeout(this.state.timer);
    this._resetTimerFlag();
  },

  _setCells(arr) {
    this.state.cells = arr;
  },

  _getMode() {
    return this.state.mode;
  },

  _setMode(mode) {
    this.state.mode = mode;
  },

  _isModeTest() {
    return !!(this._getMode() === 'test');
  },

  _isModeStart() {
    return !!(this._getMode() === 'start');
  },

  _isModeNotStart() {
    return !!(['test', 'win', 'lose'].includes(this._getMode()));
  },

  _formatByValueStep(value, step) {
    const digits = step.toString().split('.').splice(1).join('').length;
    return value.toFixed(digits);
  },

  _getControlValue(controlText) {
    return this.state[controlText];
  },

  _setControlValue(controlText, value) {
    this.state[controlText] = value;
  },

  _changeAllControlsStatus(status) {
    this._setControlStatus('length', status);
    this._setControlStatus('time', status);
  },

  _setControlStatus(controlText, status) {
    this._getControlParams(controlText).disabledStatus = status;
  },

  _getControlParams(controlText) {
    return this.state[`${controlText}Control`];
  },

  _getCounterValue() {
    return this.state.counter;
  },

  _resetCounter() {
    this.state.counter = 0;
  },

  _initCounter() {
    this.state.counter = 1;
  },

  _incrementCounter() {
    this.state.counter = this._getCounterValue() + 1;
  },

  _setTimerFLag() {
    this.state.timerOn = true;
  },

  _resetTimerFlag() {
    this.state.timerOn = false;
  },

  _isTimerOn() {
    return this.state.timerOn;
  },

  _isTimerOff() {
    return !this._isTimerOn();
  },

  _setRandom() {
    const cells = this.getCells();
    const length = this._getControlValue('length');
    const arr = new Array(cells.length).fill(null);
    for (let i = 0; i < length; i++) {
      arr[i] = i + 1;
    }
    arr.sort(() => .5 - Math.random());
    const newCells = cells.map((item, index) => {
      item.value = arr[index];
      return item;
    });
    this._setCells(newCells);
  },

  _clickCell(idCell, value) {
    if (this._isCellClickable(idCell)) {
      if (value) {
        this._detectSuccess(idCell, value);
        this._detectFault(idCell, value);
        this._incrementCounter();
      }
    }
  },

  _isCellClickable(idCell) {
    return !!(this._isModeTest() && this._isTimerOff() && !this._isIdCellSuccess(idCell));
  },

  _isIdCellSuccess(idCell) {
    return !!(this._getIdCellStatus(idCell) === 'success');
  },

  _detectSuccess(idCell, stepNumber) {
    if (stepNumber === this._getCounterValue()) {
      this._setIdCellStatus(idCell, 'success');
      if (stepNumber === this._getControlValue('length')) {
        this._setMode('win');
      }
    }
  },

  _detectFault(idCell, stepNumber) {
    if (stepNumber !== this._getCounterValue()) {
      this._setIdCellStatus(idCell, 'fail');
      this._setMode('lose');
    }
  },

  _getIdCellStatus(idCell) {
    return this.getCells().filter(item => (item.id === idCell))[0].status;
  },

  _setIdCellStatus(idCell, status) {
    const newCells = this.getCells().map(item => {
      if (item.id === idCell) item.status = status;
      return item;
    });
    this._setCells(newCells);
  },




  listeners: [],

  addChangeListener(fn) {
    this.listeners.push(fn);
  },

  _notify() {
    this.listeners.forEach(fn => fn());
  },



  actionControlDecrement(controlText) {
    let value = this._getControlValue(controlText);
    const { step, min } = this._getControlParams(controlText);
    value = (value > min ? value - step : value);
    this._setControlValue(controlText, value);
    this._notify();
  },

  actionControlIncrement(controlText) {
    let value = this._getControlValue(controlText);
    const { step, max } = this._getControlParams(controlText);
    value = (value < max ? value + step : value);
    this._setControlValue(controlText, value);
    this._notify();
  },

  actionModeChange() {
    if (this._isModeStart()) this._startTest();
    else if (this._isModeNotStart()) this._resetTest();
    this._notify();
  },

  actionCellClick(id, value) {
    this._clickCell(id, value);
    this._notify();
  },

  actionUnmountApp() {
    clearTimeout(this.state.timer);
  }
};

store.getState = store.getState.bind(store);
store.getCells = store.getCells.bind(store);
store.getSwitcherText = store.getSwitcherText.bind(store);
store.getControlFormatedValue = store.getControlFormatedValue.bind(store);
store.getControlStatus = store.getControlStatus.bind(store);
store.addChangeListener = store.addChangeListener.bind(store);

export const {
  getState,
  getCells,
  getSwitcherText,
  getControlFormatedValue,
  getControlStatus,
  addChangeListener,
} = store;

store.actionControlDecrement = store.actionControlDecrement.bind(store);
store.actionControlIncrement = store.actionControlIncrement.bind(store);
store.actionModeChange = store.actionModeChange.bind(store);
store.actionCellClick = store.actionCellClick.bind(store);
store.actionUnmountApp = store.actionUnmountApp.bind(store);

listen(action.CONTROL_DECREMENT, store.actionControlDecrement);
listen(action.CONTROL_INCREMENT, store.actionControlIncrement);
listen(action.MODE_CHANGE, store.actionModeChange);
listen(action.CELL_CLICK, store.actionCellClick);
listen(action.APP_UNMOUNT, store.actionUnmountApp);