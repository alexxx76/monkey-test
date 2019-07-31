import React, { Component } from 'react'
import Control from './components/Control/Control';
import Switcher from './components/Switcher/Switcher';
import Cell from './components/Cell/Cell';


class App extends Component {
  constructor() {
    super()

    this.state = {
      timer: null,
      timerOn: false,
      length: 3,
      time: 2,
      mode: 'start',
      counter: 0,
      cells: ((number) => {
        return new Array(number).fill(1).map((item, index) => ({
          id: index, value: null, status: 'clear'
        }))
      })(15)
    }

    this.changeLength = this.changeLength.bind(this)
    this.changeTime = this.changeTime.bind(this)
    this.changeMode = this.changeMode.bind(this)
    this.clickCell = this.clickCell.bind(this)
  }

  changeLength(value) {
    this.setState({ length: value })
  }

  changeTime(value) {
    this.setState({ time: value })
  }

  startTest() {
    this.setState({ mode: 'test' })
    this.setRandom()
    this.initCounter()
    this.startTimer()
  }

  resetTest() {
    this.setState({ mode: 'start' })
    this.resetCounter()
    this.stopTimer()
    this.resetCells()
  }

  startTimer() {
    this.setCellsStatus('show')
    this.setState((state, props) => {
      state.timer = setTimeout(() => {
        this.stopTimer()
      }, this.state.time * 1000)
      return state
    }, this.setState({ timerOn: true }))
  }

  stopTimer() {
    this.setCellsStatus('hide')
    clearTimeout(this.state.timer)
    this.setState({ timerOn: false })
  }

  setRandom() {
    const arr = new Array(this.state.cells.length).fill(null)
    for (let i = 0; i < this.state.length; i++) {
      arr[i] = i + 1
    }
    arr.sort(() => .5 - Math.random())
    const newCells = this.state.cells.map((item, index) => {
      item.value = arr[index]
      return item
    })
    this.setState({ cells: newCells })
  }

  resetCounter() {
    this.setState({ counter: 0 })
  }

  initCounter() {
    this.setState({ counter: 1 })
  }

  incrementCounter() {
    this.setState((state, props) => ({ counter: state.counter + 1 }))
  }

  resetCells() {
    this.setCellsStatus('clear')
    this.setState((state, props) => {
      state.cells = state.cells.map(item => {
        item.value = null
        return item
      })
      return state
    })
  }

  setCellsStatus(status) {
    this.setState((state, props) => {
      state.cells = state.cells.map(item => {
        if (item.value) item.status = status
        return item
      })
      return state
    })
  }

  setIdCellStatus(idCell, status) {
    this.setState((state, props) => {
      state.cells = state.cells.map(item => {
        if (item.id === idCell) item.status = status
        return item
      })
      return state
    })
  }

  changeMode() {
    if (this.state.mode === 'start') this.startTest()
    if (this.state.mode === 'test') this.resetTest()
    if (this.state.mode === 'win') this.resetTest()
    if (this.state.mode === 'lose') this.resetTest()
  }

  verifySuccess(idCell, value) {
    if (value === this.state.counter && value !== this.state.length) {
      this.setIdCellStatus(idCell, 'success')
    }
    if (value === this.state.counter && value === this.state.length) {
      this.setIdCellStatus(idCell, 'success')
      this.setState({ mode: 'win' })
    }
  }

  verifyFault(idCell, value) {
    if (value !== this.state.counter) {
      this.setIdCellStatus(idCell, 'fail')
      this.setState({ mode: 'lose' })
    }
  }

  clickCell(idCell, value) {
    if (this.state.mode === 'test' && !this.state.timerOn) {
      if (value) {
        this.verifySuccess(idCell, value)
        this.verifyFault(idCell, value)
        this.incrementCounter()
      }
    }
  }

  componentWillUnmount() {
    this.stopTimer()
  }

  render() {
    return (
      <div>
        App - length - {this.state.length}
        . time - {this.state.time}
        . mode - {this.state.mode}
        <Control
          text="length"
          min={1}
          max={10}
          value={3}
          step={1}
          changeValue={this.changeLength}
        />
        <Control
          text="time"
          min={0.25}
          max={5}
          value={2}
          step={0.25}
          changeValue={this.changeTime}
        />
        <Switcher
          text={this.state.mode}
          switching={this.changeMode}
        />
        <div>
          {
            this.state.cells.map(item => {
              return <Cell key={item.id} id={item.id} data={item} transmit={this.clickCell} />
            })
          }
        </div>
      </div>
    )
  }
}

export default App
