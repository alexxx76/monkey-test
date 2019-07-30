import React from 'react'

const Cell = (props) => {
  const { id, set } = props
  return (
    <div>
      Cell = id - {id} {set ? `. set - ${set}` : null}
      <button>click</button>
    </div>
  )
}

export default Cell
