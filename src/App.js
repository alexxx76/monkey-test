import React, { Component } from 'react'
import Control from './components/Control/Control'
import Switcher from './components/Switcher/Switcher'
import Cell from './components/Cell/Cell'
import styles from './App.module.css'


class App extends Component {
  constructor() {
    super()

    this.state = {
      timer: null,
      timerOn: false,
      length: 3,
      time: 0.5,
      mode: 'start',
      counter: 0,
      cells: ((number) => {
        return new Array(number).fill(1).map((_, index) => ({
          id: index, value: null, status: 'clear'
        }))
      })(25)
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
    this.stopTimer()
    this.resetCounter()
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
      const newCells = state.cells.map(item => {
        item.value = null
        return item
      })
      return { cells: newCells }
    })
  }

  setCellsStatus(status) {
    this.setState((state, props) => {
      const newCells = state.cells.map(item => {
        if (item.value) item.status = status
        return item
      })
      return { cells: newCells }
    })
  }

  setIdCellStatus(idCell, status) {
    this.setState((state, props) => {
      const newCells = state.cells.map(item => {
        if (item.id === idCell) item.status = status
        return item
      })
      return { cells: newCells }
    })
  }

  changeMode() {
    if (this.state.mode === 'start') this.startTest()
    if (['test', 'win', 'lose'].includes(this.state.mode)) this.resetTest()
  }

  detectSuccess(idCell, value) {
    if (value === this.state.counter) {
      this.setIdCellStatus(idCell, 'success')
      if (value === this.state.length) {
        this.setState({ mode: 'win' })
      }
    }
  }

  detectFault(idCell, value) {
    if (value !== this.state.counter) {
      this.setIdCellStatus(idCell, 'fail')
      this.setState({ mode: 'lose' })
    }
  }

  getIdCellStatus(idCell) {
    return this.state.cells.filter(item => (item.id === idCell))[0].status
  }

  clickCell(idCell, value) {
    if (this.state.mode === 'test' && !this.state.timerOn &&
      (this.getIdCellStatus(idCell) !== 'success')) {
      if (value) {
        this.detectSuccess(idCell, value)
        this.detectFault(idCell, value)
        this.incrementCounter()
      }
    }
  }

  componentWillUnmount() {
    this.stopTimer()
  }

  render() {
    return (
      <div className={styles.App}>
        <header className={styles.header}>
          <h1>Monkey Test</h1>
        </header>
        <div className={styles.gameboard}>
          <div className={styles.grid}>
            {
              this.state.cells.map(item => {
                return (
                  <Cell
                    key={item.id}
                    id={item.id}
                    data={item}
                    transmit={this.clickCell}
                  />
                )
              })
            }
          </div>
          <div className={styles.controls}>
            <Control
              text="length"
              min={3}
              max={10}
              value={this.state.length}
              step={1}
              dis={this.state.mode !== 'start'}
              changeValue={this.changeLength}
            />
            <Switcher
              text={this.state.mode}
              switching={this.changeMode}
            />
            <Control
              text="time"
              min={0.125}
              max={5}
              value={this.state.time}
              step={0.125}
              dis={this.state.mode !== 'start'}
              changeValue={this.changeTime}
            />
          </div>
        </div>
        <footer className={styles.footer}>
          <h5>разработик Алкесандр Карпенко - <a href="https://github.com/alexxx76/monkey-test">GitHub</a></h5>
        </footer>
      </div>
    )
  }
}

export default App
