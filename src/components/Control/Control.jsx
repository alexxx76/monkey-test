import React, { Component } from 'react'

class Control extends Component {
  constructor(props) {
    super(props)

    const { text, min, max, value, step } = this.props
    this.state = {
      text,
      min,
      max,
      value,
      step
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

  render() {
    return (
      <div>
        Control = text - {this.state.text}
        . min - {this.state.min}
        . max - {this.state.max}
        . value - {this.state.value}
        . step - {this.state.step}
        <div>
          <button onClick={this.decrement}>-</button>
          <button onClick={this.increment}>+</button>
        </div>
      </div>
    )
  }
}

export default Control