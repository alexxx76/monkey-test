import React from 'react'
import Control from './components/Control/Control';
import Switcher from './components/Switcher/Switcher';
import Cell from './components/Cell/Cell';

const App = () => {
  return (
    <div>
      App
      <Control text="lenght" min={1} max={10} value={1} step={1}/>
      <Control text="time" min={0.25} max={5} value={2} step={0.25}/>
      <Switcher text="START"/>
      <Cell id={1} set={1}/>
      <Cell id={2} set={null}/>
      <Cell id={3} set={null}/>
      <Cell id={4} set={null}/>
      <Cell id={5} set={null}/>
      <Cell id={6} set={null}/>
      <Cell id={7} set={null}/>
      <Cell id={8} set={null}/>
      <Cell id={9} set={null}/>
    </div>
  )
}

export default App
