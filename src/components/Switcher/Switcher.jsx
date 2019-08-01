import React from 'react'
import styles from './Switcher.module.css'

const Switcher = (props) => {
  const { text } = props
  return (
    <div className={styles.switcher}>
      <button
        className={styles.button}
        onClick={props.switching}
      >
        {text.toUpperCase()}
      </button>
    </div>
  )
}

export default Switcher