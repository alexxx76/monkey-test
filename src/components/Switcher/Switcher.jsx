import React from 'react'

const Switcher = (props) => {
  const { text } = props
  return (
    <div>
      Switcher = text - {text}
      <button>click</button>
    </div>
  )
}

export default Switcher