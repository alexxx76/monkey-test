import React from 'react'
import styles from './Cell.module.css'

const Cell = (props) => {
  const { id, data, transmit } = props

  let mode = `${styles[data.status]}`
  let cellCSSClass = `${styles.cell} ${mode}`

  const handleClick = () => {
    transmit(id, data.value)
  }

  return (
    <div className={cellCSSClass} onClick={handleClick}>
      {data.status !== 'hide' ? data.value : null}
    </div>
  )
}

export default Cell
