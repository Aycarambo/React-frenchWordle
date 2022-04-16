import "./App.css"
import React, { useState, useEffect } from "react"
import Grid from "./components/Grid"
import words from "an-array-of-french-words"
import dayjs from "dayjs"
import seedrandom from "seedrandom"

const MAX_TRIES = 6

function App() {
  const [guess, setGuess] = useState("")
  const [triesLeft, setTriesLeft] = useState(MAX_TRIES)
  const date = dayjs().format("YYYY-MM-DD")
  const filteredWords = words
    .filter((word) => !/[^a-z]/gi.test(word))
    .filter((word) => word.length > 4 && word.length < 9)
  var myrng = new seedrandom(date)
  const wordOfTheDay = filteredWords[Math.round(myrng() * filteredWords.length)]

  console.log(wordOfTheDay)

  function handleChange(e) {
    setGuess(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault() //prevent refreshing on submit

    if (guess.length == wordOfTheDay.length && !/[^a-z]/gi.test(guess)) {
      if (filteredWords.includes(guess)) {
        setTriesLeft(triesLeft - 1)
      } else {
        alert("Ce mot n'est pas dans le dictionnaire.")
      }
    } else {
    }
  }
  useEffect(() => {
    setGuess("")
  }, [triesLeft])

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
            maxLength={wordOfTheDay.length}
            id="guess"
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
