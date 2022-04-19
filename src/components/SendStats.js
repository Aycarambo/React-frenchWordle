import { supabase } from "../supabaseClient"
import React, { useState } from "react"

function SendStats({ word, time, tryCount }) {
  const [isInputDisabled, setIsInputDisabled] = useState(false)
  const [name, setName] = useState("")

  function handleSubmit(e) {
    e.preventDefault() //prevent refreshing on submit

    setIsInputDisabled(true)
    const sendStats = async () => {
      let { data } = await supabase
        .from("statistics")
        .insert([{ user_name: name, time: time, try_count: tryCount, word: word }])
    }
    sendStats()

    return false
  }

  return (
    <form className="send-input" autoComplete="off" onSubmit={handleSubmit}>
      <input name="nom" placeholder="nom" onChange={(e) => setName(e.target.value)} disabled={isInputDisabled} />
    </form>
  )
}

export default SendStats
