import { supabase } from "../supabaseClient"
import React, { useState } from "react"
import { TODAY } from "../utils/today"

function SendStats({ onNameSubmitted, word, time, tryCount, userName, initialState, setInitialState }) {
  const [isInputDisabled, setIsInputDisabled] = useState(!!initialState[TODAY]?.data_sent)

  function handleSubmit(e) {
    e.preventDefault() //prevent refreshing on submit
    const userName = e.target[0].value

    onNameSubmitted(userName)

    setIsInputDisabled(true)
    const sendStats = async () => {
      const hasUserWon = initialState?.[TODAY]?.grid[initialState?.[TODAY]?.grid?.length - 1] === word
      await supabase
        .from("statistics")
        .insert([{ user_name: userName, time: time, try_count: tryCount, word: word, has_won: hasUserWon }])
        .then(setInitialState({ [TODAY]: { ...initialState[TODAY], data_sent: true } }))
    }
    sendStats()

    return false
  }

  return (
    <>
      <form className="send-input" autoComplete="off" onSubmit={handleSubmit}>
        <input defaultValue={userName} name="nom" placeholder="YOU" disabled={isInputDisabled} />
      </form>
    </>
  )
}

export default SendStats
