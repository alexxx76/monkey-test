import React, { Component } from 'react'
import styles from './Control.module.css'

class Control extends Component {
  constructor(props) {
    super(props)

    const { text, min, max, value, step, dis } = this.props
    this.state = {
      text,
      min,
      max,
      value,
      step,
      dis
    }

    this.decrement = this.decrement.bind(this)
    this.increment = this.increment.bind(this)
  }

  decrement() {
    this.setState((state, props) => ({
      value: (state.value > state.min ? state.value - state.step : state.value)
    }), () => {
      this.props.changeValue(this.state.value)
    })
  }

  increment() {
    this.setState((state, props) => ({
      value: (state.value < state.max ? state.value + state.step : state.value)
    }), () => {
      this.props.changeValue(this.state.value)
    })
  }

  format(value) {
    const digits = this.state.step.toString().split('.').splice(1).join('').length
    return value.toFixed(digits)
  }

  componentDidUpdate() {
    this.setState((state, props) => {
      if (state.dis !== props.dis) return {
        dis: props.dis
      }
    })
  }

  render() {
    return (
      <div className={styles.control}>
        <div className={styles.text}>{this.state.text}</div>
        <div className={styles.value}>{this.format(this.state.value)}</div>
        <div className={styles.commands}>
          <button
            className={styles.button}
            onClick={this.decrement}
            disabled={this.state.dis}
          >-</button>
          <button
            className={styles.button}
            onClick={this.increment}
            disabled={this.state.dis}
          >+</button>
        </div>
      </div>
    )
  }
}

export default Control