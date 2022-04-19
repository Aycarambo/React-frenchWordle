import React, { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"
import avg from "../utils/avg"
import intToTime from "../utils/formatTime"
import SendStats from "./SendStats"

function UserStatistics({ onClose, word, time, tryCount }) {
  const [stats, setStats] = useState([])

  useEffect(() => {
    const getStats = async () => {
      let { data } = await supabase
        .from("statistics")
        .select(`*`)
        .eq("word", word)
        .order("try_count", { ascending: true })
      setStats([
        ...data,
        {
          id: "USER",
          user_name: "USER!",
          try_count: tryCount,
          time,
          word,
          created_at: ""
        }
      ])
    }
    getStats()
    // eslint-disable-next-line
  }, [])

  //var bestTenPlayers[]
  //data.slice(0, 10).forEach(() => {})

  const avgTryCount = avg(stats, "try_count").toFixed(1)
  const avgTime = intToTime(avg(stats, "time"))

  return (
    <div className="modal">
      <button onCLick={onClose} type="button" class="btn-close" aria-label="Close"></button>
      <p>Nombre moyen d'essais : {avgTryCount}</p>
      <p>Temps moyen : {avgTime}</p>
      <SendStats word={word} time={time} tryCount={tryCount} />
    </div>
  )
}

export default UserStatistics
