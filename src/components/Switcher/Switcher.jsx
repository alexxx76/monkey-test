import React from 'react'

const Switcher = (props) => {
  const { text } = props
  return (
    <div>
      Switcher = text - {text.toUpperCase()}
      <button onClick={props.switching}>click</button>
    </div>
  )
}

export default Switcher