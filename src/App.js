import './App.css';

import { useState } from 'react'

function range(stop) {
  return new Array(stop).fill(null).map((x, i) => i)
}

function Guesses ({ guesses, word }) {
  return (
    <table className='Guesses'>
      <tbody>
        {range(6).map(i => (
          <tr>
            {range(5).map(j => (
              <td key={j} className='Guesses'>
                {(guesses[i] || [])[j] || null}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function KeyboardKey ({ keyboardKey, onKeyPress }) {
  return (
    <button
      className={keyboardKey.length === 1 ? 'Key' : 'KeyLong'}
      onClick={() => {
        onKeyPress(keyboardKey)
        console.log(keyboardKey)
      }}
    >
      {keyboardKey}
    </button>
  )
}

function KeyboardRow ({ keys, onKeyPress }) {
  return (
    <div className='KeyboardRow'>
      {keys.map(key => (
        <KeyboardKey key={key} keyboardKey={key} onKeyPress={onKeyPress} />
      ))}
    </div>
  )
}

function Keyboard ({ onKeyPress }) {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
  ]
  return (
    <div className='Keyboard'>
      {rows.map((row, i) => (
        <KeyboardRow key={i} keys={row} onKeyPress={onKeyPress} />
      ))}
    </div>
  )
}

function App() {
  const [guess, setGuess] = useState([])
  return (
    <div className='App'>
      <div className='Header'>
        <h1 style={{ textAlign: 'center' }}>
          Wordle Clone
        </h1>
      </div>
      <div className='Content'>
        <Guesses guesses={[guess]} />
      </div>
      <Keyboard onKeyPress={key => setGuess([...guess, key])}/>
    </div>
  );
}

export default App;
