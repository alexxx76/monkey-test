import React from 'react'

const Cell = (props) => {
  const { id, data } = props
  const { transmit } = props

  let inlinestyle = {}
  switch (data.status) {
    case 'clear':
      inlinestyle = {background: ''}
      break
    case 'show':
      inlinestyle = {background: '#acc'}
      break
    case 'hide':
      inlinestyle = {background: '#cac'}
      break
    case 'success':
      inlinestyle = {background: '#cfc'}
      break
    case 'fail':
      inlinestyle = {background: '#fcc'}
      break
    default:
      inlinestyle = {background: ''}
  }

  const handleClick = () => {
    transmit(id, data.value)
  }

  return (
    <div>
      Cell = id - {id}
      . - {data.value ? data.value : null}
      <button onClick={handleClick} style={inlinestyle}>click</button>
    </div>
  )
}

export default Cell
