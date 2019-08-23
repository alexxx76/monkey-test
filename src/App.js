import React, { Component } from 'react';
import Control from './components/Control/Control';
import Switcher from './components/Switcher/Switcher';
import Cell from './components/Cell/Cell';
import { getState, addChangeListener } from './flux/store';
import styles from './App.module.css';

class App extends Component {
  constructor() {
    super()

    this.state = getState();

    this.clickCell = this.clickCell.bind(this)
  }

  componentDidMount() {
    addChangeListener(this.update);
  }

  update = () => {
    this.setState(getState(), () => {
      // console.log(this.state);
    });
  }



  incrementCounter() {
    this.setState((state) => ({ counter: state.counter + 1 }))
  }

  setIdCellStatus(idCell, status) {
    this.setState((state) => {
      const newCells = state.cells.map(item => {
        if (item.id === idCell) item.status = status
        return item
      })
      return { cells: newCells }
    })
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
            <Control text="length" />
            <Switcher />
            <Control text="time" />
          </div>
        </div>
        <footer className={styles.footer}>
          <h5>разработчик Алкесандр Карпенко - <a href="https://github.com/alexxx76/monkey-test">GitHub</a></h5>
        </footer>
      </div>
    )
  }
}

export default App
