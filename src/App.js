import "./App.css"
import React, { useState, useEffect } from "react"
import Grid from "./components/Grid"
import { getWordOfTheDay, isValidWord } from "./utils/word"
import { useTimer } from "use-timer"
import intToTime from "./utils/formatTime"
import useLocalStorage from "./hooks/localStorage"

const MAX_TRIES = 6

function App() {
  const [initialState, setInitialState] = useLocalStorage("state", {})
  const wordOfTheDay = getWordOfTheDay()
  const [guess, setGuess] = useState("")
  const [isInputDisabled, setIsInputDisabled] = useState(true)
  if (isInputDisabled && (!initialState || initialState.grid?.[initialState.grid.length - 1] !== wordOfTheDay)) {
    setIsInputDisabled(false)
  }

  const [gridState, setGridState] = useState(initialState?.grid || [])
  const [triesLeft, setTriesLeft] = useState(MAX_TRIES - gridState.length)
  const { time, start, pause } = useTimer({
    autostart: !!initialState.time && triesLeft > 0,
    onTimeUpdate: (time) => {
      if (time > 0) {
        setInitialState({ ...initialState, time })
      }
    },
    initialTime: initialState?.time || 0
  })
  const [primaryMessage, setPrimaryMessage] = useState("")
  const [helperMessage, setHelperMessage] = useState("")

  function handleChange(e) {
    if (helperMessage !== "") {
      setHelperMessage("")
    }
    start()
    setGuess(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault() //prevent refreshing on submit

    if (guess.length === wordOfTheDay.length && !/[^a-z]/gi.test(guess)) {
      if (isValidWord(guess)) {
        setTriesLeft(triesLeft - 1)
        setGridState([...gridState, guess])
        setInitialState({ ...initialState, grid: [...gridState, guess] })
      } else {
        setHelperMessage("Ce mot n'est pas dans le dictionnaire.")
      }
    } else {
    }
  }

  useEffect(() => {
    setGuess("")
    if (guess === wordOfTheDay || initialState.grid?.[initialState.grid.length - 1] === wordOfTheDay) {
      setIsInputDisabled(true)
      setPrimaryMessage("Gagné !")
      pause() //timer
    } else if (triesLeft === 0) {
      setIsInputDisabled(true)
      setPrimaryMessage("Perdu...")
      pause() //timer
    }
    // eslint-disable-next-line
  }, [triesLeft])

  return (
    <div className="App">
      <header className="App-header">
        <form autoComplete="off" onSubmit={handleSubmit}>
          <div>
            <h1 className="primary-message">{primaryMessage}</h1>
            <h2>{intToTime(time)}</h2>
            <Grid
              state={gridState}
              lineCount={MAX_TRIES}
              lineToValidate={MAX_TRIES - triesLeft}
              value={guess}
              maxLength={wordOfTheDay.length}
              word={wordOfTheDay}
            />
          </div>
          <input
            className="input-primary"
            autoCapitalize="none"
            autoCorrect="off"
            maxLength={wordOfTheDay.length}
            id="guessInputField"
            onChange={handleChange}
            value={guess}
            pattern="[a-z]*"
            disabled={isInputDisabled}
          />
          <input className="hidden-on-mobile btn-primary" type="submit" value="Entrer" />
        </form>
        <p className="helper-message">{helperMessage}</p>
      </header>
    </div>
  )
}

export default App
