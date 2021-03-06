import "./App.css"
import React, { useState, useEffect } from "react"
import Grid from "./components/Grid"
import { getWordOfTheDay, isValidWord } from "./utils/getWordOfTheDay"
import { useTimer } from "use-timer"
import intToTime from "./utils/formatTime"
import useLocalStorage from "./hooks/localStorage"
import UserStatistics from "./components/UserStatistics"
import clsx from "clsx"
import { TODAY } from "./utils/today"

const MAX_TRIES = 6

function App() {
  const [initialState, setInitialState] = useLocalStorage("state", {})
  const wordOfTheDay = getWordOfTheDay()

  const [guess, setGuess] = useState("")
  const [isInputDisabled, setIsInputDisabled] = useState(true)
  const [isStatsDisabled, setIsStatsDisabled] = useState(true)
  const hasUserWon =
    guess === wordOfTheDay || initialState?.[TODAY]?.grid?.[initialState?.[TODAY]?.grid?.length - 1] === wordOfTheDay
  const hasUserLost = initialState?.[TODAY]?.grid?.length === MAX_TRIES && !hasUserWon
  useEffect(() => {
    if (isInputDisabled && (!initialState || initialState.grid?.[initialState?.grid?.length - 1] !== wordOfTheDay)) {
      setIsInputDisabled(false)
    }
    // eslint-disable-next-line
  }, [])
  const [gridState, setGridState] = useState(initialState?.[TODAY]?.grid || [])
  const [triesLeft, setTriesLeft] = useState(MAX_TRIES - gridState.length)
  const { time, start, pause } = useTimer({
    autostart: !!initialState?.[TODAY]?.time && triesLeft > 0,
    onTimeUpdate: (time) => {
      if (time > 0) {
        setInitialState({ [TODAY]: { ...initialState[TODAY], time } })
      }
    },
    initialTime: initialState?.[TODAY]?.time || 0
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
        setInitialState({ [TODAY]: { ...initialState[TODAY], grid: [...gridState, guess] } })
      } else {
        setHelperMessage("Ce mot n'est pas dans le dictionnaire.")
      }
    }
  }

  function closeStatsModal() {
    setIsStatsDisabled(true)
  }

  function openStatsModal() {
    setIsStatsDisabled(false)
  }

  useEffect(() => {
    setGuess("")
    if (hasUserWon) {
      setIsInputDisabled(true)
      setIsStatsDisabled(false)
      setPrimaryMessage("Gagn?? !")
      pause() //timer
    } else if (triesLeft <= 0) {
      setIsInputDisabled(true)
      setIsStatsDisabled(false)
      setPrimaryMessage(`Perdu... il fallait deviner "${wordOfTheDay}"`)
      pause() //timer
    }
    // eslint-disable-next-line
  }, [triesLeft])

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={openStatsModal} type="button">
          Statistiques
        </button>

        <div className={clsx({ hidden: isStatsDisabled })}>
          <UserStatistics
            isGameEnded={hasUserWon || hasUserLost}
            hasUserWon={hasUserWon}
            onClose={closeStatsModal}
            word={wordOfTheDay}
            time={time}
            tryCount={MAX_TRIES - triesLeft}
            initialState={initialState}
            setInitialState={setInitialState}
          />
        </div>

        <form autoComplete="off" onSubmit={handleSubmit}>
          <div>
            {primaryMessage && <h1 className="primary-message">{primaryMessage}</h1>}
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
        {helperMessage && <p className="helper-message">{helperMessage}</p>}
      </header>
    </div>
  )
}

export default App
