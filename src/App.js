import "./App.css"
import React, { useState, useEffect } from "react"
import Grid from "./components/Grid"
import { getWordOfTheDay, isValidWord } from "./utils/word"

const MAX_TRIES = 6

function App() {
  const [guess, setGuess] = useState("")
  const [triesLeft, setTriesLeft] = useState(MAX_TRIES)
  const wordOfTheDay = getWordOfTheDay

  console.log(wordOfTheDay)

  function handleChange(e) {
    setGuess(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault() //prevent refreshing on submit

    if (guess.length === wordOfTheDay.length && !/[^a-z]/gi.test(guess)) {
      if (isValidWord(guess)) {
        setTriesLeft(triesLeft - 1)
      } else {
        alert("Ce mot n'est pas dans le dictionnaire.")
      }
    } else {
    }
  }
  useEffect(() => {
    setGuess("")
    if (guess === wordOfTheDay) {
      document.getElementById("guessInputField").disabled = true
    } else if (triesLeft === 0) {
      document.getElementById("guessInputField").disabled = true
      alert("Perdu...")
    }
  }, [triesLeft, wordOfTheDay, guess])

  return (
    <div className="App">
      <header className="App-header">
        <form autoComplete="off" onSubmit={handleSubmit}>
          <div>
            <Grid
              lines={MAX_TRIES}
              lineToValidate={MAX_TRIES - triesLeft}
              value={guess}
              maxLength={wordOfTheDay.length}
              word={wordOfTheDay}
            />
          </div>
          <input
            autoCapitalize="none"
            autoCorrect="off"
            maxLength={wordOfTheDay.length}
            id="guessInputField"
            onChange={handleChange}
            value={guess}
            pattern="[a-z]*"
          />
          <input type="submit" />
        </form>
      </header>
    </div>
  )
}

export default App
