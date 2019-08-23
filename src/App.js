import React, { Component } from 'react';
import Control from './components/Control/Control';
import Switcher from './components/Switcher/Switcher';
import Cell from './components/Cell/Cell';
import { emit } from './flux/dispatcher';
import { action } from './flux/actions';
import { getState, addChangeListener, getCells } from './flux/store';
import styles from './App.module.css';

class App extends Component {
  constructor() {
    super();

    this.state = getState();
  }

  componentDidMount() {
    addChangeListener(this.update);
  }

  update = () => this.setState(getState());
  
  componentWillUnmount() {
    emit(action.APP_UNMOUNT);
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
              getCells().map(item => {
                return (
                  <Cell key={item.id} id={item.id} data={item} />
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
    );
  }
};

export default App;
