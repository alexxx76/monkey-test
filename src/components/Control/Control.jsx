import React from 'react'

const Control = (props) => {
  const { text, min, max, value, step } = props
  return (
    <div>
      Control = text - {text} . min - {min} . max - {max} . value - {value} . step - {step}
      <button>-</button><button>+</button>
    </div>
  )
}

export default Control