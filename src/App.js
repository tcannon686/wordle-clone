import './App.css';
import words from './words'

import { useState, useEffect } from 'react'

function range(stop) {
  return new Array(stop).fill(null).map((x, i) => i)
}

function isInWord (word, guess, i) {
  return Array.from(guess).slice(0, i + 1).reduce((a, c) =>
    c.toLowerCase() === guess[i].toLowerCase() ? 1 + a : a, 0)
      <=  Array.from(word).reduce((a, c) =>
        c.toLowerCase() === guess[i].toLowerCase() ? 1 + a : a, 0)
}

function isInCorrectPlace (word, guess, i) {
  return guess[i].toLowerCase() === word[i].toLowerCase()
}

function Guesses ({ guesses, guess, word }) {
  return (
    <table className='Guesses'>
      <tbody>
        {range(6).map(i => (
          <tr key={i}>
            {range(5).map(j => (
              i === guesses.length
                ? (
                  <td
                    key={j}
                    className='Guesses'
                  >
                    {guess[j]}
                  </td>
                )
                : (
                  <td
                    key={j}
                    className={
                      'Guesses' + (guesses[i] ? (
                      isInCorrectPlace(word, guesses[i], j)
                        ? ' Correct'
                        : (
                      isInWord(word, guesses[i], j)
                        ? ' InWord'
                        : ' Incorrect'
                        )
                      ) : '')
                    }
                  >
                    {(guesses[i] || [])[j] || null}
                  </td>
                )
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

function Popup ({ message, open, onClose, autoClose }) {
  const [displayMessage, setDisplayMessage] = useState('')
  useEffect(() => {
    if (!message) { return }
    setDisplayMessage(message)
    const timeout = setTimeout(() => {
      if (autoClose) {
        if (onClose) { onClose() }
      }
    }, 2500)
    const handleClick = () => {
      if (onClose) { onClose() }
    }
    document.addEventListener('click', handleClick)
    return () => {
      clearTimeout(timeout)
      document.removeEventListener('click', handleClick)
    }
  }, [message, onClose])

  const openStyle = { opacity: 1, pointerEvents: 'all' }
  const closeStyle = { opacity: 0, pointerEvents: 'none' }
  const style = open ? openStyle : closeStyle
  return (
    <div className='PopupContainer' style={style}>
      <div
        className='Popup'
        onClick={e => e.stopPropagation()}
        style={{ ...style, opacity: 1 }}
      >
        {displayMessage}
      </div>
    </div>
  )
}

function hash (str) {
  let ret = 0
  for (let i = 0; i < str.length; i++) {
    ret = ((ret<<5)-ret)+str.charCodeAt(i)
    ret = ret & ret
  }
  return ret
}

function App () {
  const [guess, setGuess] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [seenTutorial, setSeenTutorial] = useState(JSON.parse(localStorage.getItem('seenTutorial') || 'false'))
  const date = new Date()
  const wordIndex = Math.abs(hash(
    `${date.getFullYear()}${date.getMonth()},${date.getDate()}`
  )) % words.words.length
  const word = words.words[wordIndex]
  const [guesses, setGuesses] = useState(
    (JSON.parse(localStorage.getItem('guesses')) || {})[word] || []
  )

  useEffect(() => {
    localStorage.setItem('seenTutorial', JSON.stringify(seenTutorial))
  }, [seenTutorial])

  useEffect(() => {
    localStorage.setItem('guesses', JSON.stringify({ [word]: guesses }))
  }, [guesses])
  const won = guesses.length && guesses.at(-1).every((c, i) => (
    c.toLowerCase() === word[i].toLowerCase()
  ))
  const lost = guesses.length === 6 && !won

  const handleKeyPress = key => {
    if (won || lost) {
      return
    }
    if (key === 'Backspace') {
      setGuess(guess.slice(0, -1))
    } else if (key === 'Enter') {
      if (guess.length !== 5) {
        setErrorMessage('Last time I checked you were supposed to enter 5 letters...')
      } else if (!words.words.includes(guess.join('').toLowerCase())) {
        setErrorMessage('??? that\'s not a word!')
      } else if (guesses.some(x => x.join('') === guess.join(''))) {
        setErrorMessage(
          ':| You already guessed that. You must really be out of ideas'
        )
      } else {
        setGuesses([...guesses, guess])
        setGuess([])
      }
    } else {
      setGuess([...guess, key].slice(0, 5))
    }
  }

  return (
    <div className='App'>
      <div className='Header'>
        <h1 style={{ textAlign: 'center' }}>
          Wordle Clone
        </h1>
      </div>
      <div className='Content'>
        <Guesses guesses={guesses} guess={guess} word={word} />
      </div>
      <Keyboard onKeyPress={handleKeyPress} />
      <Popup
        message={errorMessage}
        onClose={() => setErrorMessage(null)}
        open={Boolean(errorMessage)}
        autoClose
      />
      <Popup
        message='Congrats, you won! Play again tomorrow!'
        open={won}
      />
      <Popup
        message='You lost. You suck, try again tomorrow tho'
        open={lost}
      />
      <Popup
        message={
          <>
            <h1>Wordle Clone</h1>
            <p>
              Welcome to wordle clone, the game where you wordle, I wordle, and we wordle.
            </p>
            <p>
              Try to guess the 5 letter word! For each guess, a green letter
              indicates that the letter is in the right place. A yellow letter
              indicates that the letter is in the word but in the wrong place.
            </p>
            <p>
              You will get 6 guesses. A new word is chosen every day! Good luck!
            </p>
          </>
        }
        open={!seenTutorial}
        onClose={() => { setSeenTutorial(true) }}
      />
    </div>
  );
}

export default App;
