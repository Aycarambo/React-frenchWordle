import { supabase } from "../supabaseClient"
import React, { useState } from "react"

function SendStats({ onNameSubmitted, word, time, tryCount, userName }) {
  const [isInputDisabled, setIsInputDisabled] = useState(!!userName)
  const [name, setName] = useState("")

  function handleSubmit(e) {
    e.preventDefault() //prevent refreshing on submit

    onNameSubmitted(name)

    setIsInputDisabled(true)
    const sendStats = async () => {
      await supabase.from("statistics").insert([{ user_name: name, time: time, try_count: tryCount, word: word }])
    }
    sendStats()

    return false
  }

  return (
    <>
      <form className="send-input" autoComplete="off" onSubmit={handleSubmit}>
        <input
          defaultValue={userName}
          name="nom"
          placeholder="YOU"
          onChange={(e) => setName(e.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </>
  )
}

export default SendStats
